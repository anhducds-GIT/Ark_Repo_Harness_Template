#!/usr/bin/env node
/* BỘ BIÊN DỊCH LUẬT (Rule Compiler) — Đức chốt 2026-09-09.
 *
 * VẤN ĐỀ NÓ CHỮA: luật chỉ có một chiều là TĂNG. Mỗi luật hợp lý lúc thêm vào; cộng lại thì
 * mâu thuẫn nhau, và phiên sau bốc trúng câu nào thì theo câu đó. Đo được ở chính repo này
 * 09/09: mục 1 của hiến pháp có BA mốc trả khoá khác nhau cùng lúc, và một phiên đã đọc đúng
 * một trong ba rồi làm ngược hai cái kia.
 *
 * KIẾN TRÚC — ba tầng, đừng lẫn:
 *
 *     SỔ CÁI (ledger)      `docs/adr/` · `decisions.md` · `docs/archive/`
 *       CHỈ THÊM, không sửa. Đây là LỊCH SỬ: vì sao ta tới được luật hôm nay.
 *            ↓
 *     BỘ BIÊN DỊCH        file này
 *       Chuẩn hoá → gộp trùng → bao hàm → xử xung đột → cắt → biên dịch.
 *            ↓
 *     LUẬT HIỆU LỰC       thứ một phiên AI thật sự phải đọc
 *
 * BẤT BIẾN QUAN TRỌNG NHẤT, và nó là lý do file này tồn tại: **AI không tự ý sửa hay xoá luật.**
 * AI được ĐỀ XUẤT (`--de-xuat`); chỉ khai báo tường minh trong frontmatter mới làm đổi bộ luật
 * hiệu lực. Máy quyết định theo khai báo, không theo suy diễn — nên hai lượt chạy trên cùng một
 * HEAD luôn ra cùng một kết quả.
 *
 * VÌ SAO KHÔNG GỘP FILE ADR LẠI CHO GỌN: luật B12 khai ADR đã `Accepted` là BẤT BIẾN — sửa phần
 * thân là đỏ cổng. Và đúng như vậy: ADR là biên bản, không phải bản nháp. Nên ta không gộp FILE,
 * ta gộp CÂU TRẢ LỜI: mỗi ADR khai `chu_de`, một chủ đề có một `dau_moi`, và bộ biên dịch in ra
 * mỗi chủ đề MỘT khối. Muốn biết luật khoá thì mở đúng một khối, không phải đọc bốn file rồi
 * tự đoán cái nào thắng. B12 cho phép sửa frontmatter — đó chính là cửa hợp lệ để làm việc này.
 *
 * MÃ THOÁT, cố ý không gộp:
 *   0  bộ luật biên dịch được, không vi phạm
 *   2  CÓ VI PHẠM — thiếu khai báo, trỏ vào hư không, hoặc xung đột chưa ai xử
 *   3  không đọc được (nói KHÔNG BIẾT, không nói ĐẠT)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readStructureFromDisk } from "./repo-structure.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NL = String.fromCharCode(10);
const ADR_DIR = "docs/adr";
const SO_QUYET_DINH = "decisions.md";

export const EXIT = Object.freeze({ OK: 0, VI_PHAM: 2, KHONG_DOC_DUOC: 3 });

/* --- ⑴ CHUẨN HOÁ ---------------------------------------------------------- */

/* Frontmatter YAML tối giản, cố ý KHÔNG nạp thư viện: ta chỉ cần `khoá: giá trị` một dòng.
   Gặp cú pháp YAML thật (danh sách, lồng nhau) thì trả về thô để bên gọi tự xử — im lặng đoán
   là cách một bộ đọc bắt đầu nói dối. */
export function docFrontmatter(text) {
  const dong = String(text).replace(/\r\n?/g, NL).split(NL);
  if (dong[0] !== "---") return { fm: {}, coFm: false };
  const het = dong.indexOf("---", 1);
  if (het < 0) return { fm: {}, coFm: false };
  const fm = {};
  for (const d of dong.slice(1, het)) {
    const m = d.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].trim();
  }
  return { fm, coFm: true };
}

/* Mã ADR: lấy từ frontmatter `adr:`, KHÔNG lấy từ tên file. Tên file đổi được, mã thì không —
   và B12 dùng `--follow` chính vì đổi tên là chuyện có thật. */
export function chuanHoaAdr(tenFile, text) {
  const { fm, coFm } = docFrontmatter(text);
  const ma = String(fm.adr ?? "").trim();
  const quanHe = [];
  for (const khoa of ["sua", "thay_the", "superseded_by", "bo_sung", "thuoc"]) {
    const v = String(fm[khoa] ?? "").trim();
    if (v) for (const x of v.split(/[,\s]+/).filter(Boolean)) quanHe.push({ kieu: khoa, toi: x });
  }
  return {
    file: tenFile,
    coFm,
    ma,
    chuDe: String(fm.chu_de ?? "").trim(),
    dauMoi: String(fm.dau_moi ?? "").trim().toLowerCase() === "true",
    trangThai: String(fm.status ?? "").trim(),
    ngay: String(fm.date ?? "").trim(),
    quanHe,
    tieuDe: (String(text).match(/^#\s+(.+)$/m) || [])[1] || tenFile
  };
}

const CON_HIEU_LUC = (a) => !/^superseded$/i.test(a.trangThai);

/* --- ⑵→⑸ SOÁT: trùng · bao hàm · xung đột · cắt --------------------------- */

/* Trả về danh sách vi phạm. RỖNG = biên dịch được.
   Mỗi vi phạm có `ma` (tiếng Anh, để máy đọc) và `vi` (tiếng Việt, để người đọc) — đúng luật
   vàng số 5 của repo. */
export function soatLuat(dsAdr, chuDeKhai) {
  const viPham = [];
  const coMa = new Set(dsAdr.map((a) => a.ma).filter(Boolean));

  for (const a of dsAdr) {
    if (!a.coFm || !a.ma) {
      viPham.push({ ma: "ADR_KHONG_KHAI", vi: `${a.file}: không đọc được frontmatter hoặc thiếu \`adr:\`` });
      continue;
    }
    // ⑴ Chuẩn hoá đòi MỌI luật phải có chỗ đứng. Đây là cái răng chống phình: thêm một ADR mà
    //    không trả lời nổi "nó thuộc nhóm nào" thì luật đó chưa đủ rõ để thêm.
    if (!a.chuDe) {
      viPham.push({ ma: "THIEU_CHU_DE", vi: `ADR-${a.ma}: thiếu \`chu_de:\` — mỗi luật phải có ĐÚNG MỘT nhà` });
    } else if (chuDeKhai && !chuDeKhai.has(a.chuDe)) {
      // Chủ đề tự do thì một lỗi gõ đẻ ra một nhóm mới trong im lặng.
      viPham.push({
        ma: "CHU_DE_LA",
        vi: `ADR-${a.ma}: chủ đề \`${a.chuDe}\` chưa khai ở \`.repo-structure.json\` (\`luat.chu_de\`). Khai trước, hoặc sửa lỗi gõ`
      });
    }
    // ⑶ Bao hàm: quan hệ phải trỏ tới ADR CÓ THẬT. Trỏ vào hư không là bộ luật tưởng mình có
    //    thứ tự mà thật ra không có.
    for (const q of a.quanHe) {
      if (!coMa.has(q.toi)) {
        viPham.push({ ma: "QUAN_HE_TREO", vi: `ADR-${a.ma}: khai \`${q.kieu}: ${q.toi}\` mà không có ADR nào mang mã đó` });
      } else if (q.toi === a.ma) {
        viPham.push({ ma: "QUAN_HE_VONG", vi: `ADR-${a.ma}: khai quan hệ trỏ vào CHÍNH NÓ` });
      }
    }
  }

  // ⑷ Xung đột: một chủ đề phải có ĐÚNG MỘT đầu mối. Không có đầu mối thì "mở đúng một file"
  //    là câu nói suông; hai đầu mối thì lại quay về đúng bệnh đọc-rồi-tự-đoán.
  const theoChuDe = new Map();
  for (const a of dsAdr.filter((x) => x.chuDe && CON_HIEU_LUC(x))) {
    if (!theoChuDe.has(a.chuDe)) theoChuDe.set(a.chuDe, []);
    theoChuDe.get(a.chuDe).push(a);
  }
  for (const [chuDe, ds] of theoChuDe) {
    const dauMoi = ds.filter((a) => a.dauMoi);
    if (dauMoi.length === 0) {
      viPham.push({
        ma: "CHU_DE_KHONG_DAU_MOI",
        vi: `chủ đề \`${chuDe}\` (${ds.length} ADR còn hiệu lực) không ADR nào khai \`dau_moi: true\` — không biết mở file nào trước`
      });
    } else if (dauMoi.length > 1) {
      viPham.push({
        ma: "CHU_DE_HAI_DAU_MOI",
        vi: `chủ đề \`${chuDe}\` có ${dauMoi.length} đầu mối (${dauMoi.map((a) => a.ma).join(", ")}) — phải đúng một`
      });
    }
  }
  return viPham;
}

/* ĐỀ XUẤT, KHÔNG PHẢI LỆNH. Máy chỉ được nêu chỗ ĐÁNG NGỜ; quyết định gộp hay không là của
   người, và cách thi hành là sửa frontmatter. Cố ý tách khỏi `soatLuat`: trộn "vi phạm" với
   "đáng xem lại" là cách một cổng bắt đầu bị bỏ qua. */
export function deXuat(dsAdr) {
  const ra = [];
  const theoChuDe = new Map();
  for (const a of dsAdr.filter((x) => x.chuDe && CON_HIEU_LUC(x))) {
    if (!theoChuDe.has(a.chuDe)) theoChuDe.set(a.chuDe, []);
    theoChuDe.get(a.chuDe).push(a);
  }
  for (const [chuDe, ds] of theoChuDe) {
    const roiRac = ds.filter((a) => !a.dauMoi && !a.quanHe.length);
    if (roiRac.length) {
      ra.push({
        chuDe,
        vi: `${roiRac.length} ADR trong chủ đề này không khai quan hệ với đầu mối: ${roiRac.map((a) => a.ma).join(", ")}`,
        lam: "khai `thuoc: <mã-đầu-mối>` nếu nó BỔ SUNG, hoặc `sua: <mã>` nếu nó SỬA — rồi bộ biên dịch xếp đúng thứ tự"
      });
    }
  }
  return ra;
}

/* --- ⑹ BIÊN DỊCH + XẾP ---------------------------------------------------- */

/* Thứ tự cố định: đầu mối trước, rồi tới các ADR bổ sung theo NGÀY. Không xếp theo mã, vì mã
   chỉ nói thứ tự viết ra, không nói thứ tự hiệu lực. */
export function bienDich(dsAdr, chuDeKhai) {
  const theoChuDe = new Map();
  for (const a of dsAdr.filter((x) => x.chuDe && CON_HIEU_LUC(x))) {
    if (!theoChuDe.has(a.chuDe)) theoChuDe.set(a.chuDe, []);
    theoChuDe.get(a.chuDe).push(a);
  }
  const khoi = [];
  for (const [chuDe, ds] of theoChuDe) {
    ds.sort((x, y) => (y.dauMoi - x.dauMoi) || String(x.ngay).localeCompare(String(y.ngay)) || String(x.ma).localeCompare(String(y.ma)));
    khoi.push({ chuDe, ten: (chuDeKhai && chuDeKhai.get(chuDe)) || chuDe, ds });
  }
  khoi.sort((a, b) => a.chuDe.localeCompare(b.chuDe));
  const daCat = dsAdr.filter((a) => !CON_HIEU_LUC(a));
  return { khoi, daCat };
}

/* --- Chạy ---------------------------------------------------------------- */

export function docAdr(root = ROOT) {
  const thuMuc = path.join(root, ADR_DIR);
  let ten;
  try { ten = fs.readdirSync(thuMuc).filter((f) => f.endsWith(".md")).sort(); }
  catch { return null; }
  return ten.map((f) => chuanHoaAdr(`${ADR_DIR}/${f}`, fs.readFileSync(path.join(thuMuc, f), "utf8")));
}

export function chuDeKhaiTu(parsed) {
  const raw = parsed && parsed.luat && parsed.luat.chu_de;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  return new Map(Object.entries(raw).map(([k, v]) => [k, String(v)]));
}

function main() {
  const chiKiem = process.argv.includes("--check");
  const chiDeXuat = process.argv.includes("--de-xuat");

  const dsAdr = docAdr(ROOT);
  if (dsAdr === null) {
    console.log(`KHÔNG ÁP DỤNG — repo chưa có \`${ADR_DIR}/\`.`);
    return EXIT.OK;
  }
  let parsed;
  try { parsed = readStructureFromDisk(ROOT); }
  catch (e) { console.error(`KHONG_DOC_DUOC: ${String(e.message).split(NL)[0]}`); return EXIT.KHONG_DOC_DUOC; }
  const chuDeKhai = chuDeKhaiTu(parsed);

  /* FAIL-CLOSED, và đây là chỗ dễ nới nhất nên nói rõ: repo CÓ từ hai ADR trở lên mà KHÔNG khai
     chủ đề thì đó là ĐỎ, không phải "không áp dụng". Cho qua ở đây là mở đúng cái cửa mà cả bộ
     biên dịch này sinh ra để đóng — muốn thoát luật thì chỉ việc không khai. */
  if (!chuDeKhai && dsAdr.length >= 2) {
    console.error(`VI_PHAM: repo có ${dsAdr.length} ADR mà \`.repo-structure.json\` chưa khai \`luat.chu_de\`.`);
    console.error("  Khai danh sách chủ đề trước — không khai thì mọi ADR đều không có nhà, và luật lại phình tự do.");
    return EXIT.VI_PHAM;
  }

  const viPham = soatLuat(dsAdr, chuDeKhai);

  if (chiDeXuat) {
    const ds = deXuat(dsAdr);
    if (!ds.length) { console.log("Không có đề xuất nào — mọi ADR đều đã khai chỗ đứng và quan hệ."); return EXIT.OK; }
    console.log(`ĐỀ XUẤT (${ds.length}) — máy chỉ NÊU, người quyết. Thi hành bằng cách sửa frontmatter:${NL}`);
    for (const d of ds) console.log(`  · [${d.chuDe}] ${d.vi}${NL}      → ${d.lam}`);
    return EXIT.OK;
  }

  if (viPham.length) {
    console.error(`VI_PHAM (${viPham.length}) — bộ luật CHƯA biên dịch được:${NL}`);
    for (const v of viPham) console.error(`  · ${v.ma}: ${v.vi}`);
    console.error(`${NL}Sửa bằng cách khai vào frontmatter của ADR (B12 cho phép sửa frontmatter),`);
    console.error("hoặc khai chủ đề mới vào `.repo-structure.json` → `luat.chu_de`.");
    return EXIT.VI_PHAM;
  }
  if (chiKiem) {
    console.log(`Bộ luật biên dịch được — ${dsAdr.length} ADR, ${new Set(dsAdr.filter(CON_HIEU_LUC).map((a) => a.chuDe)).size} chủ đề, 0 vi phạm.`);
    return EXIT.OK;
  }

  const { khoi, daCat } = bienDich(dsAdr, chuDeKhai);
  const conHl = dsAdr.filter(CON_HIEU_LUC).length;
  console.log(`# LUẬT HIỆU LỰC — biên dịch từ ${dsAdr.length} ADR${NL}`);
  console.log(`**Nhân (kernel):** \`AGENTS.md\` — luật chung, mọi phiên nạp trước tiên.`);
  console.log(`**Sổ cái:** \`${ADR_DIR}/\` (${dsAdr.length} ADR, bất biến) · \`${SO_QUYET_DINH}\` · \`docs/archive/\`.`);
  console.log(`**Đang hiệu lực:** ${conHl} ADR trong ${khoi.length} chủ đề · **đã cắt khỏi bộ hiệu lực:** ${daCat.length}.${NL}`);
  for (const k of khoi) {
    console.log(`## ${k.ten}`);
    for (const a of k.ds) {
      const nhan = a.dauMoi ? "ĐẦU MỐI" : (a.quanHe[0] ? `${a.quanHe[0].kieu} ${a.quanHe[0].toi}` : "—");
      console.log(`  ${a.dauMoi ? "▶" : "·"} ADR-${a.ma} [${nhan}] ${a.tieuDe.replace(/^ADR-\d+\s*—\s*/, "")}`);
      console.log(`      ${a.file}`);
    }
    console.log("");
  }
  if (daCat.length) {
    console.log(`## Đã cắt khỏi bộ hiệu lực (vẫn nằm trong sổ cái, KHÔNG xoá)`);
    for (const a of daCat) console.log(`  · ADR-${a.ma} [${a.trangThai}] ${a.file}`);
  }
  return EXIT.OK;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  process.exit(main());
}
