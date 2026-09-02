/* ĐO ĐỘ LỆCH — một repo bất kỳ cách bộ khung bao xa?
 *
 *   node scripts/assess.mjs <đường-dẫn-repo>     # báo cáo cho người đọc
 *   node scripts/assess.mjs <đường-dẫn-repo> --json
 *
 * Vì sao công cụ này trước, không phải quy trình migrate trước: migrate mù thì đắt, đo thì rẻ.
 * Chạy một lượt trên N repo là ra **bản đồ chi phí** — repo nào chỉ cần thả vài file, repo nào
 * cần người ngồi viết, repo nào không đáng động vào. Không có bản đồ đó thì không lên lịch được
 * việc nhiều repo; chỉ đoán.
 *
 * NGUỒN CHUẨN LÀ BỘ SINH, KHÔNG PHẢI MỘT DANH SÁCH CHÉP TAY. File này gọi thẳng
 * `buildTemplateFiles()`. Nếu bộ khung thêm hay bớt một file, phép đo đi theo ngay — không có
 * bản thứ hai để mà trôi. Đây là bài học đắt nhất của repo này: hai bản của cùng một sự thật
 * thì sớm muộn cũng lệch, và lúc lệch thì không ai biết tin bản nào.
 *
 * CHỈ ĐỌC. Không ghi một byte nào vào repo đích — kể cả `.gitignore`, kể cả thư mục tạm.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildTemplateFiles } from "./build-template.mjs";

const CR = String.fromCharCode(13);
const eol = (text) => text.split(CR).join("");

/* Ba tầng, và chúng được ĐỐI XỬ KHÁC NHAU khi chấm — đây là phần dễ làm sai nhất.
 *
 *   MÁY   phải KHỚP. Bộ máy lệch một dòng là hai repo cư xử khác nhau mà bảng vẫn đẹp.
 *   LUẬT  ĐƯỢC PHÉP lệch. Mỗi repo sửa luật cho nghề của mình; đòi khớp là đòi sai.
 *   TRẠNG chỉ cần CÓ. Nội dung là của riêng repo đó, so nội dung là vô nghĩa.
 *
 * Chấm cả ba theo một thước là ra một con số nghe hay mà không dùng được: một repo sửa đúng
 * luật của nó sẽ bị chấm "lệch nhiều" y như một repo có bộ máy hỏng. */
export const TANG = {
  MAY: "máy",
  LUAT: "luật",
  TRANG: "trạng thái"
};

export function tangCuaFile(rel) {
  if (rel.startsWith("scripts/") || rel.startsWith("tests/")) return TANG.MAY;
  // `package.json` KHÔNG thuộc tầng MÁY dù bộ khung có mang một bản. Mọi repo thật đều có
  // package.json của riêng nó với hàng chục lệnh khác; đòi khớp từng byte là báo nợ oan cho
  // đúng 100% repo. Đo được ngay lần chạy đầu trên chính repo này. Thứ THẬT SỰ đáng đo ở đó
  // là một điều duy nhất — có khai `scripts.test` không — và nó được kiểm riêng bên dưới.
  if (rel === "package.json") return TANG.TRANG;
  if (rel === "HANDOFF.md" || rel === "STATUS.md" || rel === ".agents/claims.json") return TANG.TRANG;
  return TANG.LUAT;
}

/* Phụ lục nghề là VÍ DỤ, không phải yêu cầu. Bộ khung mang sẵn một cái có thật để chứng minh
   cơ chế chạy được, và hướng dẫn nói thẳng: repo không làm nghề đó thì XOÁ file đi. Đếm nó
   thành nợ là bắt mọi repo mang luật của một nghề nó không làm — đúng cái bệnh mà việc tách
   phụ lục sinh ra để chữa. */
export const TUY_CHON = new Set(["docs/ANNEX-tu-dong-hoa-trinh-duyet.md"]);

/* Cổng đóng phiên hỏi `package.json.scripts.test`. Không khai thì `hasRootTestScript()` trả
   false VĨNH VIỄN và cổng không chạy một dòng test nào — xanh, im, vô dụng. Đây là lỗi nặng
   nhất từng tìm thấy trong bộ khung, nên nó có phép đo riêng thay vì trốn trong một con số. */
export function coLenhTest(root) {
  const raw = docNeuCo(root, "package.json");
  if (raw === null) return null;
  try {
    return Boolean(JSON.parse(raw)?.scripts?.test);
  } catch (_) {
    return false;
  }
}

/* CẤU HÌNH CÓ ĐỌC ĐƯỢC KHÔNG — hỏi riêng, vì so nội dung không trả lời được câu này.
 *
 * Audit độc lập bắt được 03/09, và nó là đúng kiểu hỏng tệ nhất của một bộ đo: repo có
 * `.repo-structure.json` chỉ gồm một dấu `{` vẫn được chấm MỨC 3, CHI PHÍ 0/0/0 — giấy khám sức
 * khoẻ hoàn hảo — trong khi structure gate của chính repo đó thoát mã 2 và không chạy nổi.
 *
 * Vì sao lọt: phép so cũ chỉ hỏi "file có không" và "có khác bản chuẩn không". Một file hỏng cú
 * pháp thì CÓ, và KHÁC — tức là "LỆCH", tức là chuyện bình thường ở tầng luật. Không ai hỏi nó
 * có PARSE được không.
 *
 * Một bộ đo luôn trả lời dễ chịu thì vô hại về kỹ thuật và tai hại về quyết định: nó khiến người
 * ta lên lịch cho một việc rẻ hơn sự thật. */
export const CAU_HINH_MAY_DOC = [".repo-structure.json", ".agents/claims.json", "package.json"];

export function cauHinhDocDuoc(root) {
  const hong = [];
  for (const rel of CAU_HINH_MAY_DOC) {
    const kq = docChiTiet(root, rel);
    if (kq.trangThai === "KHONG") continue;  // thiếu file là việc của phép đo THIẾU, không phải ở đây
    if (kq.trangThai === "HONG") { hong.push({ file: rel, loi: kq.loi }); continue; }
    try { JSON.parse(kq.noiDung); } catch (e) { hong.push({ file: rel, loi: String(e.message).split(String.fromCharCode(10))[0] }); }
  }
  return hong;
}

/* HOA THƯỜNG CÓ PHÂN BIỆT KHÔNG — hỏi bằng thư mục cha, đừng hỏi hệ thống file.
 *
 * Windows và macOS mặc định KHÔNG phân biệt hoa thường; Linux thì có. Nên `readFileSync` cho
 * `HANDOFF.md` vẫn đọc được file tên `handoff.md`, và phép đo báo "có". Cùng một repo, cùng một
 * lệnh, chạy trên máy Đức thì xanh, chạy trên CI Linux thì đỏ — mà không ai đổi gì.
 *
 * Đo được thật ngày 03/09 trên repo NAV: `git ls-files` trả `handoff.md`, `existsSync('HANDOFF.md')`
 * trả `true`. Đây là kiểu hỏng tệ nhất của một bộ đo cầm tay đi kiểm repo khác: nó **đúng ở nơi
 * bạn đứng và sai ở nơi bạn sắp giao hàng**.
 *
 * Cách chữa: soi từng đoạn đường dẫn trong danh sách thư mục cha. `readdirSync` trả tên THẬT
 * trên đĩa, không qua lớp đối chiếu mờ hoa thường của hệ điều hành. */
function tenKhopHoaThuong(root, rel) {
  let cha = root;
  for (const doan of rel.split("/")) {
    let ds;
    try { ds = fs.readdirSync(cha); } catch (_) { return false; }
    if (!ds.includes(doan)) return false;
    cha = path.join(cha, doan);
  }
  return true;
}

/* Đọc một file của repo đích, và PHÂN BIỆT BA KẾT QUẢ, không phải hai.
 *
 * Bản đầu gộp mọi lỗi thành `null` = "không có". Nghe hợp lý, nhưng nó nói dối ở đúng ca đáng
 * lo nhất: `.repo-structure.json` tồn tại dưới dạng **thư mục** cũng cho `null`, nên phép đo bảo
 * "thiếu — thả file vào là xong". Người làm theo, và việc thả file **thất bại** vì cái tên đã bị
 * một thư mục chiếm chỗ; không dòng nào giải thích vì sao. Cùng lối đó: không đủ quyền đọc
 * (EACCES/EPERM) cũng bị kể là "thiếu".
 *
 *   CO    — đọc được, có nội dung
 *   KHONG — thật sự không có (ENOENT/ENOTDIR), hoặc có nhưng SAI HOA THƯỜNG
 *   HONG  — có gì đó ở tên này nhưng đọc không nổi. Đây là việc của người, không phải việc chép
 */
function docChiTiet(root, rel) {
  const duong = path.join(root, ...rel.split("/"));
  let raw;
  try {
    raw = fs.readFileSync(duong, "utf8");
  } catch (e) {
    const ma = e?.code;
    if (ma === "ENOENT" || ma === "ENOTDIR") return { trangThai: "KHONG" };
    return { trangThai: "HONG", ma: ma || "UNKNOWN", loi: String(e?.message ?? e).split(String.fromCharCode(10))[0] };
  }
  // Đọc được rồi mới soi hoa thường: đảo thứ tự thì tốn một lượt readdir cho mọi file vắng mặt.
  if (!tenKhopHoaThuong(root, rel)) return { trangThai: "KHONG", saiHoaThuong: true };
  return { trangThai: "CO", noiDung: raw };
}

/* Giữ lại cho những chỗ chỉ cần "có nội dung hay không". Ca HONG trả null ở đây là CỐ Ý — nơi
   duy nhất được phép quyết ca đó là `danhGia` và `cauHinhDocDuoc`, để nó không lọt êm hai lần. */
function docNeuCo(root, rel) {
  const kq = docChiTiet(root, rel);
  return kq.trangThai === "CO" ? kq.noiDung : null;
}

export function danhGia(root, chuan) {
  const dong = [];
  for (const [rel, mongDoi] of chuan) {
    const kq = docChiTiet(root, rel);
    const tang = tangCuaFile(rel);
    let trangThai;
    if (kq.trangThai === "HONG") trangThai = "HỎNG";
    else if (kq.trangThai === "KHONG") trangThai = "THIẾU";
    else if (eol(kq.noiDung) === eol(mongDoi)) trangThai = "KHỚP";
    else trangThai = "LỆCH";
    dong.push({
      file: rel,
      tang,
      trangThai,
      tuyChon: TUY_CHON.has(rel),
      ...(kq.saiHoaThuong ? { saiHoaThuong: true } : {}),
      ...(kq.trangThai === "HONG" ? { loi: kq.loi } : {})
    });
  }
  return dong;
}

/* Chi phí, và cố ý KHÔNG quy về một con số duy nhất.
 *
 * "Repo này 72% đạt chuẩn" nghe gọn nhưng không ai hành động được: 72% có thể là thiếu vài bản
 * mẫu (nửa giờ) hoặc thiếu cả bộ máy (một buổi). Ba con số dưới đây tương ứng ba loại việc thật
 * khác nhau về giá:
 *
 *   thả    — chép file vào là xong, không cần nghĩ (chủ yếu tầng MÁY và bản mẫu)
 *   viết   — người phải ngồi viết nội dung của riêng repo đó (luật, trạng thái)
 *   soi    — có sẵn nhưng lệch bản chuẩn; phải mở ra đọc mới biết là cố ý hay bỏ quên
 */
export function chiPhi(dong) {
  const batBuoc = dong.filter((d) => !d.tuyChon);
  const tha = batBuoc.filter((d) => d.trangThai === "THIẾU" && d.tang === TANG.MAY).length;
  const viet = batBuoc.filter((d) => d.trangThai === "THIẾU" && d.tang !== TANG.MAY).length;
  const soi = dong.filter((d) => d.trangThai === "LỆCH" && d.tang === TANG.MAY).length;
  return { tha, viet, soi };
}

/* Bốn mức, đo bằng thứ repo THẬT SỰ CÓ, không bằng thứ nó tự khai.
 *
 * Mức không phải điểm số — nó trả lời "bước kế tiếp là gì". Một repo mức 1 và một repo mức 3
 * cần hai việc hoàn toàn khác nhau, và trộn chúng vào một thang phần trăm là mất đúng thông tin
 * đó. */
export function mucDo(dong, hongCauHinh = []) {
  // Có file ĐỌC KHÔNG NỔI thì mọi con số phía sau đều là đoán. Xếp mức 0 cùng chỗ với cấu hình
  // hỏng, vì hậu quả giống hệt nhau: repo trông như sắp xong mà không chạy được, và lời khuyên
  // "thả file vào" sẽ thất bại im lặng — cái tên đã bị chiếm chỗ.
  const docKhongNoi = dong.filter((d) => d.trangThai === "HỎNG");
  if (docKhongNoi.length) {
    return {
      muc: 0,
      ten: "có file đọc không nổi — chưa đo được",
      ke: `Xử tay trước đã: ${docKhongNoi.map((d) => `${d.file} (${d.loi})`).join(", ")}. Thả file đè lên sẽ KHÔNG chạy.`
    };
  }
  // Cấu hình không parse được thì repo KHÔNG dùng được — mức 0, bất kể có đủ file hay không.
  // Xếp nó vào mức 0 chứ không phải một cờ phụ, vì "đủ file mà chạy không nổi" là trạng thái
  // tệ hơn "thiếu file": thiếu thì biết mà thả vào, còn hỏng thì trông y như đã xong.
  if (hongCauHinh.length) {
    return {
      muc: 0,
      ten: "cấu hình hỏng — repo chưa chạy được",
      ke: `Sửa cú pháp JSON trước đã: ${hongCauHinh.map((h) => h.file).join(", ")}. Mọi phép đo khác chưa có nghĩa.`
    };
  }
  const co = (rel) => dong.find((d) => d.file === rel)?.trangThai !== "THIẾU";
  // CHỈ `scripts/` — không tính `tests/`. Bản đầu gộp cả hai vào "bộ máy đầy đủ", nên một repo
  // có đủ năm công cụ mà thiếu suite bị chấm mức 1 ("chưa có bộ máy") thay vì mức 2 ("có bộ
  // máy, chưa có lưới đỡ"). Hai ca đó cần hai việc khác hẳn nhau về giá, và gộp lại là làm mất
  // đúng thông tin công cụ này sinh ra để cung cấp. Phép kiểm bắt được, 03/09.
  const mayDayDu = dong
    .filter((d) => d.tang === TANG.MAY && d.file.startsWith("scripts/"))
    .every((d) => d.trangThai !== "THIẾU");
  if (!co(".repo-structure.json") && !co("AGENTS.md")) {
    return { muc: 0, ten: "chưa có gì", ke: "Thả bộ khung vào, sửa tên repo trong cấu hình, chạy cổng lần đầu." };
  }
  if (!mayDayDu) {
    return { muc: 1, ten: "có luật, chưa có bộ máy", ke: "Thả nhóm MÁY vào — không cần nghĩ, chép là chạy." };
  }
  if (!co("tests/harness-smoke.mjs")) {
    return { muc: 2, ten: "có bộ máy, chưa có lưới đỡ", ke: "Thêm suite hạt giống và khai `scripts.test`, kẻo cổng không bao giờ chạy gì." };
  }
  return { muc: 3, ten: "đủ bộ", ke: "Chạy cổng kiểm; còn đỏ thì sửa theo đúng lời nó nói." };
}

/* ---- chạy ------------------------------------------------------------------ */

function inBaoCao(root, dong, json) {
  const cp = chiPhi(dong);
  const hong = cauHinhDocDuoc(root);
  const m = mucDo(dong, hong);
  const lenhTest = coLenhTest(root);
  if (json) {
    console.log(JSON.stringify({ repo: root, muc: m.muc, ten_muc: m.ten, viec_ke: m.ke, chi_phi: cp, co_lenh_test: lenhTest, cau_hinh_hong: hong, files: dong }, null, 2));
    return;
  }
  const NL = String.fromCharCode(10);
  const thieu = dong.filter((d) => d.trangThai === "THIẾU");
  const lech = dong.filter((d) => d.trangThai === "LỆCH" && d.tang === TANG.MAY);
  const khop = dong.filter((d) => d.trangThai === "KHỚP").length;

  console.log(`${NL}ĐO ĐỘ LỆCH — ${root}`);
  console.log(`${NL}  MỨC ${m.muc}/3 — ${m.ten}`);
  console.log(`  Việc kế: ${m.ke}${NL}`);
  console.log(`  ${khop}/${dong.length} file khớp bản chuẩn`);
  console.log(`  Chi phí: thả ${cp.tha} file · viết ${cp.viet} file · soi lại ${cp.soi} file`);
  // In RIÊNG, không gộp vào ba con số trên. Thiếu `scripts.test` không phải "thiếu một file" —
  // nó làm cổng đóng phiên câm trong khi vẫn báo xanh, và một dòng như thế đáng đứng một mình.
  if (lenhTest === null) console.log(`  ⚠ KHÔNG CÓ package.json — cổng đóng phiên sẽ không chạy được test nào.${NL}`);
  else if (!lenhTest) console.log(`  ⚠ package.json KHÔNG khai \`scripts.test\` — cổng sẽ báo xanh mà không chạy một dòng test nào.${NL}`);
  else console.log(`  ✓ package.json có khai \`scripts.test\` — cổng chạy được suite của repo.${NL}`);

  const docKhongNoi = dong.filter((d) => d.trangThai === "HỎNG");
  if (docKhongNoi.length) {
    console.log("  ĐỌC KHÔNG NỔI — phải xử tay, thả file đè lên sẽ không chạy:");
    for (const d of docKhongNoi) console.log(`    ${d.file}  —  ${d.loi}`);
    console.log("");
  }
  const saiHoa = dong.filter((d) => d.saiHoaThuong);
  if (saiHoa.length) {
    console.log("  SAI HOA THƯỜNG — máy này không phân biệt nên trông như đã có, máy Linux sẽ báo thiếu:");
    for (const d of saiHoa) console.log(`    ${d.file}  —  đổi tên file trên đĩa cho khớp đúng chữ hoa chữ thường`);
    console.log("");
  }
  if (thieu.length) {
    console.log("  THIẾU:");
    for (const d of thieu) console.log(`    [${d.tang}] ${d.file}${d.tuyChon ? "   (tuỳ chọn — không tính là nợ)" : ""}`);
    console.log("");
  }
  if (lech.length) {
    // Chỉ kể tầng MÁY. Luật lệch là chuyện bình thường và đúng — kể ra chỉ làm nhiễu.
    console.log("  LỆCH BẢN CHUẨN (tầng máy — mở ra đọc, lệch ở đây thường là bỏ quên chứ không cố ý):");
    for (const d of lech) console.log(`    ${d.file}`);
    console.log("");
  }
  console.log(`  Luật lệch bản chuẩn KHÔNG được kể ở trên: mỗi repo sửa luật cho nghề của mình,${NL}  nên lệch ở tầng luật là đúng, không phải nợ.${NL}`);
}

const THIS = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(THIS)) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const target = args.find((a) => !a.startsWith("--"));
  if (!target) {
    console.error("Dùng: node scripts/assess.mjs <đường-dẫn-repo> [--json]");
    process.exit(2);
  }
  const root = path.resolve(target);
  // Phải là THƯ MỤC, và phải nói thẳng khi không phải. `existsSync` trả true cho cả file, nên
  // bản đầu nhận một file rồi in ra một báo cáo đầy đủ: "mức 0 — chưa có gì, thả bộ khung vào".
  // Nghe như một repo trắng, thật ra là gõ nhầm đường dẫn — và người đọc mất cả phiên mới biết.
  let dang;
  try { dang = fs.statSync(root); } catch (_) { dang = null; }
  if (!dang) {
    console.error(`Không thấy: ${root}`);
    process.exit(2);
  }
  if (!dang.isDirectory()) {
    console.error(`TỪ CHỐI — đây là một file, không phải thư mục repo: ${root}`);
    console.error("Chỉ vào thư mục GỐC của repo (chỗ có .git), đừng chỉ vào một file bên trong nó.");
    process.exit(2);
  }
  inBaoCao(root, danhGia(root, buildTemplateFiles()), json);
}
