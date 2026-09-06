/* BỘ ĐỌC CỦA BẢNG — năm nguồn mà layout cũ chưa hề chiếu ra.
 *
 * VÌ SAO TÁCH RA MỘT FILE. Đức mở bảng của repo Chrome Extension 06/09 và thấy bảng của bộ
 * khung thiếu hẳn năm tab: **AI điều phối · Ý tưởng · Vận hành · Sức khoẻ & nợ · Cấu trúc**.
 * Repo kia đã tự đi trước và chứng minh chúng dùng được — nên việc đúng là **mang logic về
 * một nguồn rồi phát đi**, không phải để hai repo mỗi nơi một bảng.
 *
 * Bộ đọc ở riêng vì nó là thứ **kiểm được bằng phép kiểm thuần**: đưa vào một chuỗi, đòi ra
 * đúng một cấu trúc. Phần dựng HTML thì không — nó chỉ kiểm được bằng cách so chuỗi dài.
 *
 * BA LUẬT CỦA CẢ FILE NÀY, không có ngoại lệ:
 *
 * 1. **Không đọc đồng hồ.** Mọi con số "bao lâu rồi" suy từ git. Bảng nằm trong khối
 *    `generators`, nên một byte phụ thuộc đồng hồ là sang ngày mọi phiên bị chặn đẩy dù không
 *    dữ liệu nào đổi.
 * 2. **Đọc không ra thì NÉM, đừng đoán.** Trừ đúng những chỗ "rỗng là trạng thái hợp lệ" —
 *    và mỗi chỗ như thế đều có ghi chú nói vì sao rỗng khác hỏng.
 * 3. **Thà đếm THỪA nợ hơn đếm THIẾU.** Một mục đang mở bị đếm nhầm là đã đóng thì nó biến
 *    mất khỏi bảng và không ai đi tìm nữa.
 */

const NL = String.fromCharCode(10);
const CR = String.fromCharCode(13);
const donGian = (t) => String(t ?? "").split(CR).join("");

/* ---- 1. Sổ ý tưởng --------------------------------------------------------- */

/* Bốn bậc, ĐÓNG. Bậc lạ thì NÉM chứ không xếp vào "khác" — một bậc gõ sai mà lặng lẽ rơi vào
 * thùng "khác" là đúng cách một ý tưởng biến mất khỏi bảng mà không ai biết.
 *
 * `nghỉ` KHÔNG phải bậc thứ tư trên đường đi. Nó là nhánh rẽ ra. Thanh tiến độ phải vẽ nó
 * thành gạch ngang chứ không phải "gần xong" — nhầm chỗ này là báo cáo sai chiều. */
export const BAC = ["ý tưởng", "đang xây", "đã chứng minh", "nghỉ"];
export const BAC_SO = new Map(BAC.map((b, i) => [b, i]));

/* KHỚP ĐÚNG DẤU MÀ `what-next.mjs` ĐANG KHỚP, không rộng hơn.
 *
 * Hai chỗ cùng đọc một sổ mà nhận dạng khác nhau thì sẽ có ngày một ý tưởng hiện trên bảng mà
 * không hiện ở bản đồ việc — và không ai biết bên nào đúng. Tiền tố chỉ chữ in hoa (`[A-Z]+`),
 * dòng trường bắt đầu bằng `-` hoặc `*`, dấu hai chấm đặt trong hay ngoài cặp `**` đều nhận. */
const MUC_Y = /^##\s+([A-Z]+-\d+)\s*[·:]?\s*(.*)$/;
const TRUONG = /^\s*[-*]\s+\*\*([^:*]+):?\*\*:?\s*(.*)$/;
const KHOI = /^\*\*([^*]+)\*\*\s*[—-]\s*(.*)$/;

const chuanBac = (raw) => {
  const t = String(raw ?? "").trim().toLowerCase();
  for (const b of BAC) if (t === b || t.startsWith(b)) return b;
  return null;
};

/**
 * `IDEAS.md` → danh sách ý tưởng.
 *
 * Quy ước GIỮ NGUYÊN của `what-next.mjs` — hai chỗ đọc cùng một sổ thì phải đọc cùng một dấu,
 * không thì bảng và bản đồ việc sẽ nói hai kiểu về cùng một ý tưởng.
 *
 * `extra` giữ MỌI trường lạ. Ai viết thêm một dòng `- **rủi ro:** …` vào sổ thì dòng đó vẫn
 * hiện lên bảng, không rơi vào hư không. Bảng không được im lặng nuốt chữ của người.
 */
export function readIdeas(text) {
  const dong = donGian(text).split(NL);
  const ra = [];
  let cur = null;
  let khoi = null;
  for (const l of dong) {
    const m = MUC_Y.exec(l);
    if (m) {
      if (cur) ra.push(cur);
      cur = { ma: m[1], ten: m[2].trim(), bac: null, viecKe: null, chu: null, phamVi: null, extra: [], khoi: [] };
      khoi = null;
      continue;
    }
    if (!cur) continue;
    const t = TRUONG.exec(l);
    if (t) {
      const ten = t[1].trim().toLowerCase();
      const gt = t[2].trim();
      if (ten === "bậc") {
        const b = chuanBac(gt);
        if (!b) {
          throw new Error(`BAC_LA: ý tưởng ${cur.ma} khai bậc "${gt}" — sổ chỉ có ${BAC.join(" · ")}. `
            + "Không đoán hộ: một bậc gõ sai mà bị xếp vào thùng khác là ý tưởng đó biến mất khỏi bảng.");
        }
        cur.bac = b;
      } else if (ten === "việc kế") cur.viecKe = gt;
      else if (ten === "chủ") cur.chu = gt;
      else if (ten === "phạm vi") cur.phamVi = gt;
      else cur.extra.push([t[1].trim(), gt]);
      continue;
    }
    const k = KHOI.exec(l.trim());
    if (k) { khoi = { ten: k[1].trim(), than: [k[2].trim()].filter(Boolean) }; cur.khoi.push(khoi); continue; }
    if (khoi && l.trim()) khoi.than.push(l.trim());
    else if (l.trim()) khoi = null;
  }
  if (cur) ra.push(cur);
  for (const y of ra) {
    if (!y.bac) {
      throw new Error(`THIEU_BAC: ý tưởng ${y.ma} không khai dòng "- **bậc:**". `
        + "Bậc là thứ quyết định nó nằm ở đâu trên thanh tiến độ — thiếu thì bảng phải dừng, không được vẽ bừa.");
    }
  }
  return ra;
}

/* ---- 2. Việc chờ người chốt ------------------------------------------------ */

/* HAI DẤU, hai loại việc khác hẳn nhau:
 *   @Đức:bấm  — việc tay vài phút, gom được thành một buổi
 *   @Đức:chốt — việc cần Đức NGHĨ, mỗi cái một lượt
 *
 * Gộp hai loại là hỏng cách dùng: một danh sách 20 mục lẫn lộn thì Đức không biết nên dành
 * 5 phút hay một buổi. Dấu không phân biệt hoa thường và cho phép bỏ dấu tiếng Việt, vì gõ
 * dấu trên một số bàn phím là phiền — nhưng KHÔNG cho phép biến thể khác, kẻo một câu văn
 * xuôi nhắc tới "Đức" lại thành một mục việc.
 */
const DAU_DUC = /@\s*(?:Đức|Duc|đức|duc)\s*:\s*(bấm|bam|chốt|chot)\b/i;
export const LOAI_DUC = { bam: "BẤM", chot: "CHỐT" };

const boDau = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Quét MỘT file, trả các dòng có dấu. `soDong` là số dòng 1-based — người gọi dùng nó để hỏi
 * git xem dòng ấy sinh ra ngày nào.
 *
 * Cố ý quét THEO DÒNG, không theo mục: dấu đặt ngay trên dòng của mục thì lúc mục đóng, dấu
 * mất theo. Không phải nhớ đi xoá ở một danh sách thứ hai — và một danh sách thứ hai thì luôn
 * cũ hơn thực tế.
 */
export function quetDauDuc(text, file) {
  const ra = [];
  const dong = donGian(text).split(NL);
  for (let i = 0; i < dong.length; i += 1) {
    const m = DAU_DUC.exec(dong[i]);
    if (!m) continue;
    const loai = boDau(m[1]).startsWith("bam") ? "bam" : "chot";
    const cau = dong[i].replace(DAU_DUC, "").replace(/^[#>\-*\s]+/, "").replace(/\*\*/g, "").trim();
    ra.push({ file, soDong: i + 1, loai, cau });
  }
  return ra;
}

/* ---- 3. Sổ nợ: đếm mục CÒN MỞ --------------------------------------------- */

/* Dấu đóng của sổ nợ bộ khung là **gạch mã**: `### ~~KHUNG-9~~ · …`. Đọc đúng dấu đó, không
 * dò từ khoá "xong" trong văn xuôi — có mục viết "gỡ khoá sau khi việc kia xong", và chữ
 * "xong" ở đó là điều kiện chứ không phải trạng thái. Dò giữa câu là đóng oan một việc đang
 * mở, tức bảng báo THIẾU nợ. Lệch về phía báo thừa, cố ý. */
const MUC_NO = /^###\s+(~~)?\s*([A-Z][A-Z0-9]*-\d+)\s*~*\s*[·:]?\s*(.*)$/;

export function readNo(text) {
  const ra = [];
  for (const l of donGian(text).split(NL)) {
    const m = MUC_NO.exec(l);
    if (!m) continue;
    ra.push({ ma: m[2], ten: m[3].replace(/~~/g, "").trim(), dong: Boolean(m[1]) });
  }
  return ra;
}

/* ---- 4. Bảng chủ sở hữu ---------------------------------------------------- */

/**
 * `.agents/claims.json` → từng khoá: đang có chủ hay không, ai giữ, giữ để làm gì.
 *
 * NÉM khi đọc không ra. Bảng quyền là thứ cả cơ chế chống giẫm chân đứng lên; một bảng quyền
 * hỏng mà bảng vẫn vẽ ra "0 khoá đang bận" là câu trả lời SAI cho đúng câu hỏi nguy hiểm nhất.
 */
export function readKhoa(raw) {
  let j;
  try { j = JSON.parse(raw); }
  catch (e) {
    throw new Error(`BANG_QUYEN_HONG: .agents/claims.json không phải JSON đọc được (${String(e.message).split(NL)[0]}). `
      + "Không vẽ bảng từ một bảng quyền hỏng — vẽ ra là nói dối về đúng thứ nguy hiểm nhất.");
  }
  const c = j?.claims;
  if (!c || typeof c !== "object") {
    throw new Error("BANG_QUYEN_HONG: .agents/claims.json không có khối `claims`. Đây là bảng chủ sở hữu, không phải một file JSON bất kỳ.");
  }
  const ra = [];
  for (const [khoa, v] of Object.entries(c)) {
    /* KHỚP ĐÚNG TÊN, không khớp tiền tố. Bản đầu lọc `startsWith("_doc")` và nuốt luôn khoá
     * vùng **`_docs`** — một vùng thật biến mất khỏi bảng, im lặng. Bắt được ngay lượt chạy
     * đầu trên dữ liệu thật. (Ở file này hai khoá chú thích vốn nằm NGOÀI khối `claims`, nên
     * chỗ này gần như không cần lọc; giữ lại đúng hai tên cho repo nào đặt chúng vào trong.) */
    if (khoa === "_doc" || khoa === "_labels") continue;
    const o = v && typeof v === "object" ? v : {};
    ra.push({ khoa, owner: o.owner || null, task: o.task || null, tu: o.claimed_at || null });
  }
  return ra.sort((a, b) => a.khoa.localeCompare(b.khoa));
}

/* ---- 5. Bốn cơ chế và năm bất biến của MULTIFLOW --------------------------- */

/* ĐỌC LẠI TỪ LUẬT, không chép. Bảng chép luật là bảng sẽ có ngày nói khác luật, và bảng là
 * thứ người ta đọc trước. Cắt tới mục `## ` KẾ TIẾP chứ không tới cuối file: cắt tới cuối là
 * fail-open đội lốt fail-closed — mục biến mất thì nó lặng lẽ nhặt bảng của mục khác. */
export function catMuc(text, so) {
  const dong = donGian(text).split(NL);
  const dau = dong.findIndex((l) => l.startsWith(`## ${so}.`));
  if (dau < 0) return null;
  const het = dong.findIndex((l, i) => i > dau && l.startsWith("## "));
  return dong.slice(dau + 1, het < 0 ? dong.length : het);
}

export function readCoChe(text) {
  const d = catMuc(text, 2);
  if (!d) return [];
  return d.filter((l) => l.startsWith("|") && !/^\|[\s:|-]+\|?\s*$/.test(l))
    .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()))
    .filter((c) => c.length >= 2 && /^\*\*.+\*\*$/.test(c[0]))
    .map((c) => ({ ten: c[0].replace(/\*\*/g, ""), cau: c[1] }));
}

export function readBatBien(text) {
  const d = catMuc(text, 4);
  if (!d) return [];
  /* Bất biến viết dạng `**① Câu chốt.** rồi văn xuôi giải thích chạy tiếp cùng dòng` — nên
   * KHÔNG được neo `$` vào cuối dòng. Bản đầu neo `$`, và kết quả là **không bắt được cái
   * nào** trong khi vẫn trả về mảng rỗng một cách lễ phép: bảng hiện "0 bất biến" ở đúng chỗ
   * đáng lẽ phải hiện năm luật lớn nhất của cơ chế. Rỗng-mà-đúng và rỗng-vì-đọc-hỏng trông
   * giống hệt nhau, nên chỗ này lấy đúng câu in đậm đầu dòng và bỏ phần giải thích. */
  const ra = [];
  for (const l of d) {
    const m = /^\*\*([①②③④⑤])\s*(.+?)\*\*/.exec(l.trim());
    if (m) ra.push({ so: m[1], cau: m[2].trim() });
  }
  return ra;
}

/* ---- 6. Bậc thang tuổi ----------------------------------------------------- */

/** Số ngày giữa hai mốc `YYYY-MM-DD`. `null` = không đo được, và null KHÁC 0. */
export function khoangNgay(sau, truoc) {
  const ms = (d) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d ?? "").trim());
    return m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : NaN;
  };
  const a = ms(sau);
  const b = ms(truoc);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.max(0, Math.round((a - b) / 86400000));
}

export function noiTuoi(ngay) {
  if (ngay === null) return "chưa đo được tuổi";
  if (ngay === 0) return "nêu hôm nay";
  if (ngay === 1) return "treo 1 ngày";
  return `treo ${ngay} ngày`;
}
