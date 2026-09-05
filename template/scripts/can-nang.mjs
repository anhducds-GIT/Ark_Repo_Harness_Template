/* CÂN NẶNG — bộ khung này đang nặng bao nhiêu, và nặng thế có còn dùng được không?
 *
 *   node scripts/can-nang.mjs            # báo cáo
 *   node scripts/can-nang.mjs --nhanh    # bỏ phép đo thời gian (chậm nhất)
 *
 * VÌ SAO CÓ FILE NÀY. Mọi cổng kiểm khác trong repo hỏi "có đúng không". File này hỏi câu ngược
 * lại: **"có đáng không"**. Không ai hỏi câu đó thì một bộ khung chỉ có thể phình ra — mỗi lần
 * gặp lỗi là thêm một luật, và không lần nào bớt. Sau vài tháng thì:
 *
 *   - AI mất nửa phiên chỉ để đọc luật, chưa làm gì đã hết chỗ nhớ;
 *   - luật nhiều tới mức mâu thuẫn nhau, và AI chọn nhánh nào cũng "đúng luật";
 *   - đóng phiên mất vài phút, nên người ta bắt đầu bỏ qua cổng.
 *
 * Cả ba đều làm hệ thống TỆ ĐI dù mỗi luật thêm vào đều hợp lý lúc thêm. Đó là lý do cân nặng
 * phải được ĐO, chứ không để cảm tính — cảm tính luôn nói "thêm một cái nữa thì có sao đâu".
 *
 * FILE NÀY CỐ Ý KHÔNG NẰM TRONG CỔNG ĐÓNG PHIÊN. Thêm một phép kiểm vào mỗi phiên để chống
 * "quá nhiều phép kiểm mỗi phiên" thì tự mâu thuẫn. Nó chạy theo nhịp tháng — xem
 * `docs/BAO-TRI-DINH-KY.md`.
 */

import { execSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { readStructureFromDisk } from "./repo-structure.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NL = String.fromCharCode(10);

/* NGÂN SÁCH. Đây là những con số CÓ THỂ SAI, và sai thì sửa ở đây — nhưng phải sửa CÓ LÝ DO ghi
   lại, không phải nới ra cho vừa hiện trạng. Nới ngân sách để báo cáo đẹp lên là đúng cái bệnh
   file này sinh ra để bắt. */
export const NGAN_SACH_MAC_DINH = {
  docBatBuoc: 300,     // dòng một phiên AI phải đọc TRƯỚC KHI làm được gì
  tongTaiLieu: 2200,   // tổng dòng tài liệu (không tính bản trích)
  soPhepKiem: 30,      // tổng phép kiểm hai cổng
  giayDongPhien: 180,  // giây để chạy trọn bộ kiểm khi đóng phiên
  soNhatKy: 600,       // dòng HANDOFF.md — thứ phình nhanh nhất và chưa từng có nhịp dọn
  tiLeDaDong: 50       // % mục nợ đã đóng còn nằm trong sổ; quá thì chuyển sang kho lưu
};

/* NGÂN SÁCH KHAI ĐƯỢC, vì repo khác có kích thước khác. Repo nhỏ mà bắt theo ngân sách của một
   bộ khung 3000 dòng là bắt nó im lặng chịu đỏ; repo lớn mà dùng ngân sách nhỏ thì con số mất
   nghĩa. Khai `budget` trong `.repo-structure.json`; không khai thì dùng mặc định trên. */
export function nganSachTu(structure) {
  const khai = structure?.budget;
  const ra = { ...NGAN_SACH_MAC_DINH };
  if (!khai || typeof khai !== "object") return ra;
  for (const [k, v] of Object.entries(khai)) {
    if (k.startsWith("_")) continue;
    if (!(k in ra)) throw new Error(`BUDGET_HONG: \`budget.${k}\` không phải mục ngân sách. Hợp lệ: ${Object.keys(ra).join(", ")}`);
    if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) {
      throw new Error(`BUDGET_HONG: \`budget.${k}\` phải là số dương. Đang là: ${JSON.stringify(v)}`);
    }
    ra[k] = v;
  }
  return ra;
}

const dem = (rel) => {
  try { return fs.readFileSync(path.join(ROOT, rel), "utf8").split(NL).length; } catch { return 0; }
};

/* Đếm mục nợ: tổng và đã đóng. Nhận diện "đã đóng" bằng ĐÚNG quy ước sổ (gạch mã `~~`), không
   dò từ khoá trong văn xuôi — cùng lý do như cờ chờ-chốt ở `what-next.mjs`. */
function docSoNo() {
  let text = "";
  try { text = fs.readFileSync(path.join(ROOT, "BACKLOG.md"), "utf8"); } catch { return { tong: 0, daDong: 0 }; }
  const dong = text.split(NL);
  const muc = dong.filter((l) => /^###\s+~*\s*[A-Za-z0-9]+-\d+/.test(l));
  const daDong = muc.filter((l) => /^###\s+~~/.test(l));
  return { tong: muc.length, daDong: daDong.length };
}

const liet = (thuMuc) => {
  const ra = [];
  const di = (d) => {
    let mucs;
    try { mucs = fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }); } catch { return; }
    for (const m of mucs) {
      const p = `${d}/${m.name}`;
      if (m.isDirectory()) di(p);
      else if (m.name.endsWith(".md")) ra.push(p);
    }
  };
  di(thuMuc);
  return ra;
};

/* ĐỌC BẮT BUỘC — chỉ tính thứ luật bắt đọc TRƯỚC KHI gõ dòng đầu tiên (mục 0 của AGENTS.md).
   Tài liệu "mở khi cần" KHÔNG tính: nó không tốn gì của phiên không dùng tới. Phân biệt hai loại
   này là điểm mấu chốt — gộp lại thì mọi tài liệu đều thành nợ, và không ai dám viết gì nữa. */
/* HANDOFF CHỈ TÍNH PHẦN ĐUÔI, và đây là chỗ bản đầu đo SAI.
 *
 * Luật (mục 0) bảo đọc "phần cuối" của HANDOFF, không phải cả file. Mà HANDOFF là sổ CHỈ THÊM —
 * nó dài ra mãi. Đếm cả file nghĩa là ngân sách chắc chắn vỡ, không phải vì hệ thống nặng lên
 * mà vì lịch sử dài ra. Một cái cân báo động vì thứ không ai phải đọc thì sẽ bị tắt, và lúc đó
 * nó không còn canh gì nữa.
 *
 * Chính cái cân này đã tự báo sai như thế ngay lần chạy thứ hai — 305/300, trong đó phần đuôi
 * thật sự phải đọc chỉ khoảng một phần ba. */
export const DUOI_HANDOFF = 40;

export function docBatBuoc() {
  const dongHandoff = Math.min(dem("HANDOFF.md"), DUOI_HANDOFF);
  return [
    { file: "AGENTS.md", dong: dem("AGENTS.md") },
    { file: `HANDOFF.md (${DUOI_HANDOFF} dòng cuối)`, dong: dongHandoff }
  ];
}

export function demPhepKiem() {
  let b = 0;
  let s = 0;
  // ĐẾM THỨ THẬT SỰ CHẠY, đừng đếm tên hàm. Bản đầu dò tên hàm và ra 10, trong khi cổng chạy
  // 15 — năm phép kiểm sinh ra từ hàm dùng chung nên không có tên riêng. Một cái cân báo thiếu
  // một phần ba thì tệ hơn không có cân: nó cho phép phình thêm mà vẫn thấy còn dư ngân sách.
  // Cùng họ với mọi lỗi khác đã vá hôm nay — dò theo TÊN thay vì đo thứ có thật.
  {
    let ra = "";
    try {
      ra = execSync("node scripts/check-bootstrap.mjs --all", { cwd: ROOT, encoding: "utf8" });
    } catch (e) {
      ra = String(e.stdout || "");   // thoát khác 0 là chuyện thường: có phép kiểm đang đỏ
    }
    const ma = ra.split(NL).map((l) => (l.match(/\]\s+(B[0-9]+)\s/) || [])[1]).filter(Boolean);
    b = new Set(ma).size;
  }
  try {
    const t = fs.readFileSync(path.join(ROOT, "scripts", "session-check.mjs"), "utf8");
    const m = t.match(/EXPECTED_CHECKS = ([0-9]+)/);
    s = m ? Number(m[1]) : 0;
  } catch { /* nt */ }
  return { cauTruc: b, dongPhien: s, tong: b + s };
}

/* LUẬT NÀO CHƯA TỪNG CHẶN ĐƯỢC GÌ — phép đo NGƯỢC, và là phép đo khó có nhất.
 *
 * `docs/BAO-TRI-DINH-KY.md` đã hỏi câu này từ đầu, nhưng hỏi suông: không ai trả lời nổi "luật
 * này tháng qua chặn được mấy lần" khi không có gì ghi lại. Nên cổng đóng phiên nay ghi một dòng
 * mỗi lần chạy vào thư mục tạm của máy (KHÔNG nằm trong repo, mỗi máy một bản).
 *
 * Một phép kiểm chưa từng đỏ KHÔNG tự động là đồ thừa — có thể nó đang làm tốt việc răn đe. Nên
 * đây là DANH SÁCH ĐỂ HỎI, không phải danh sách để xoá. Câu hỏi đúng là: *dựng nổi ca hỏng cho
 * nó không?* Không dựng nổi thì nó chưa bao giờ là một phép kiểm thật. */
export function luatChuaTungChan(dongLog) {
  const daDo = new Set();
  const daThay = new Set();
  for (const d of dongLog) {
    for (const t of d.ten ?? []) daThay.add(t);
    for (const t of d.do ?? []) daDo.add(t);
  }
  return { soLanChay: dongLog.length, chuaTungDo: [...daThay].filter((t) => !daDo.has(t)).sort() };
}

export function docLog() {
  try {
    // Cùng chỗ mà cổng ghi: thư mục tạm của MÁY NÀY, khoá theo đường dẫn repo. Sổ cố ý KHÔNG
    // nằm trong repo — cổng đi theo bản trích sang mọi repo khác, và một file lạ trong repo
    // đích sẽ bị chính phép kiểm bản đồ của nó bắt. Lý do đầy đủ ở `session-check.mjs`.
    const khoa = crypto.createHash("sha256").update(ROOT).digest("hex").slice(0, 16);
    return fs.readFileSync(path.join(os.tmpdir(), "ark-harness-gate-log", khoa + ".jsonl"), "utf8")
      .split(NL).filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } })
      .filter(Boolean);
  } catch { return []; }
}

/* ---- chạy ------------------------------------------------------------------ */

const THIS = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(THIS)) {
  const nhanh = process.argv.includes("--nhanh");
  const canh = [];
  const dong = (nhan, thuc, budget, donVi) => {
    const qua = thuc > budget;
    if (qua) canh.push(nhan);
    console.log(`  ${qua ? "✗" : "✓"} ${nhan.padEnd(34)} ${String(thuc).padStart(5)} / ${budget} ${donVi}`);
  };

  const NS = nganSachTu(readStructureFromDisk(ROOT));
  console.log(`${NL}CÂN NẶNG BỘ KHUNG — "có đáng không", không phải "có đúng không"${NL}`);

  const bb = docBatBuoc();
  const tongBB = bb.reduce((a, b) => a + b.dong, 0);
  dong("Đọc bắt buộc trước khi làm gì", tongBB, NS.docBatBuoc, "dòng");
  for (const f of bb) console.log(`      ${f.file.padEnd(30)} ${String(f.dong).padStart(5)}`);

  const taiLieu = [...liet("docs"), "README.md", "CHANGELOG.md", "STATUS.md"];
  const tongTL = taiLieu.reduce((a, f) => a + dem(f), 0);
  dong("Tổng tài liệu (không kể bản trích)", tongTL, NS.tongTaiLieu, "dòng");

  /* HAI SỐ ĐO CHO TOKEN. Chúng đo thứ mà mọi phiên AI phải nạp, ở mọi repo — nên tiết kiệm ở
     đây nhân lên theo (số repo × số phiên), khác hẳn tài liệu tra cứu chỉ đọc khi cần. */
  const nhatKy = dem("HANDOFF.md");
  dong("Nhật ký bàn giao (HANDOFF.md)", nhatKy, NS.soNhatKy, "dòng");
  if (nhatKy > NS.soNhatKy) {
    console.log("      → chuyển các lượt CŨ sang docs/archive/HANDOFF-<năm>-<tháng>.md, giữ nguyên chữ.");
    console.log("        Đây là DỜI CHỖ, không phải xoá: luật 'chỉ thêm dòng' cấm viết lại lịch sử,");
    console.log("        không cấm cất gọn nó. Phiên sau vẫn đọc được, chỉ là không nạp mỗi lần.");
  }

  const so = docSoNo();
  if (so.tong) {
    const tiLe = Math.round((so.daDong / so.tong) * 100);
    dong("Mục nợ ĐÃ ĐÓNG còn nằm trong sổ", tiLe, NS.tiLeDaDong, `% (${so.daDong}/${so.tong} mục)`);
    if (tiLe > NS.tiLeDaDong) {
      console.log("      → chuyển mục đã đóng sang docs/archive/BACKLOG-da-dong.md.");
      console.log("        Sổ nợ là thứ vai điều phối đọc mỗi lượt; nửa sổ là việc đã xong thì");
      console.log("        mỗi lượt đọc trả tiền cho phần không còn dùng.");
    }
  }

  const pk = demPhepKiem();
  dong("Số phép kiểm", pk.tong, NS.soPhepKiem, `(${pk.cauTruc} cấu trúc + ${pk.dongPhien} đóng phiên)`);

  if (!nhanh) {
    const t0 = Date.now();
    try { execSync("npm test", { cwd: ROOT, stdio: "ignore" }); } catch { /* đỏ cũng vẫn tính giờ */ }
    dong("Thời gian chạy trọn bộ kiểm", Math.round((Date.now() - t0) / 1000), NS.giayDongPhien, "giây");
  } else {
    console.log("  · Thời gian chạy: BỎ QUA (--nhanh)");
  }

  const log = docLog();
  const kq = luatChuaTungChan(log);
  console.log(`${NL}  PHÉP KIỂM CHƯA TỪNG ĐỎ — qua ${kq.soLanChay} lần chạy cổng đã ghi lại:`);
  if (!kq.soLanChay) {
    console.log("      (chưa có dữ liệu — chạy cổng đóng phiên vài lần rồi quay lại)");
  } else if (!kq.chuaTungDo.length) {
    console.log("      (không có — mọi phép kiểm đều đã bắt được ít nhất một lần)");
  } else {
    /* CÂU HỎI NÀY ĐÃ CÓ CHỖ TRẢ LỜI, nên đừng hỏi lại mãi.
     *
     * "Chưa từng đỏ" đếm các lượt chạy THẬT, và một ca hỏng dựng trong phép kiểm thì không bao
     * giờ vào đó. Nếu chỉ liệt kê, danh sách này lặp lại y nguyên sau mỗi phiên — kể cả những
     * mục đã có ca hỏng dựng sẵn. Một lời nhắc đã được trả lời mà vẫn kêu là cách nhanh nhất
     * khiến người ta bỏ qua cả danh sách. */
    const CA_HONG = "tests/cong-do-that.mjs";
    let vanBan = "";
    try { vanBan = fs.readFileSync(path.join(ROOT, CA_HONG), "utf8"); } catch { /* chưa có file */ }
    const coCaHong = (ten) => vanBan.includes(ten);
    const daTraLoi = kq.chuaTungDo.filter(coCaHong);
    const conHoi = kq.chuaTungDo.filter((t) => !coCaHong(t));

    for (const t of conHoi) console.log(`      · ${t}`);
    if (daTraLoi.length) {
      console.log(`      ${conHoi.length ? "—" : ""} ${daTraLoi.length} mục đã có ca hỏng dựng sẵn ở ${CA_HONG}:`);
      for (const t of daTraLoi) console.log(`        ✓ ${t}`);
      console.log("        (chưa đỏ trong lượt chạy thật, nhưng đã chứng minh là ĐỎ ĐƯỢC)");
    }
    if (conHoi.length) {
      console.log(`${NL}      Đây là danh sách để HỎI, không phải để xoá. Với từng cái: dựng nổi ca`);
      console.log("      hỏng cho nó không? Không dựng nổi thì nó chưa bao giờ là phép kiểm thật.");
    }
  }

  console.log(`${NL}${canh.length ? `QUÁ NGÂN SÁCH ${canh.length} chỗ: ${canh.join(", ")}.
Trước khi nới ngân sách, hãy thử BỚT — mỗi luật thêm vào nên thay chỗ một luật cũ.` : "TRONG NGÂN SÁCH — chưa cần cắt gì."}${NL}`);
  process.exit(canh.length ? 1 : 0);
}
