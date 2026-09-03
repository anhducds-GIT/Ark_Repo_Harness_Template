/* GHIM PHIÊN BẢN VÀ NÂNG CẤP — để vá bộ khung không còn phải chép tay sang từng repo.
 *
 *   node scripts/upgrade.mjs --plan  <đường-dẫn-repo>    # chỉ xem, KHÔNG ghi
 *   node scripts/upgrade.mjs --apply <đường-dẫn-repo>    # ghi, và cập nhật sổ ghim
 *
 * VÌ SAO CÓ FILE NÀY. Ngày 03/09, trong đúng một phiên, tôi phải chép tay `session-check.mjs`
 * sang hai repo **ba lần** vì vá liên tục. Với 21 repo thì mỗi vòng vá là 63 lần chép tay, và
 * mỗi lần chép tay là một cơ hội để hai bản trôi khỏi nhau. Đó chính là cách "một bộ khung" biến
 * thành "21 bộ khung khác nhau" — đúng cái bệnh cả chương trình này sinh ra để chữa.
 *
 * SỔ GHIM `.ark/harness.lock.json` ở repo ĐÍCH trả lời ba câu mà trước đây không ai trả lời được:
 *   - repo này đang dùng bản khung nào?
 *   - file máy nào là của bộ khung (được phép ghi đè), file nào là của repo?
 *   - từ lần ghim tới nay, có ai sửa tay file của bộ khung không?
 *
 * CÂU THỨ BA LÀ LÝ DO CHÍNH. Không có nó thì nâng cấp = ghi đè mù, và một bản vá tại chỗ của
 * người khác biến mất không dấu vết. Nên `--apply` **TỪ CHỐI** khi file đích đã bị sửa tay, trừ
 * khi nói rõ `--force`.
 *
 * CHỈ ĐỌC khi `--plan`. Không ghi một byte nào.
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildTemplateFiles, TEMPLATE_VERSION } from "./build-template.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NL = String.fromCharCode(10);
const SO_GHIM = ".ark/harness.lock.json";

/* Chỉ tầng MÁY được nâng cấp tự động. Luật và trạng thái là chữ của repo đó — ghi đè chúng là
   xoá công của người ta, và đó đúng là thứ quy trình migrate cấm ("thêm vào, đừng thay thế"). */
export function fileMay(chuan) {
  return [...chuan.keys()].filter((rel) => rel.startsWith("scripts/") || rel.startsWith("tests/"));
}

const bam = (text) => createHash("sha256").update(String(text).split(String.fromCharCode(13)).join("")).digest("hex").slice(0, 16);

/* BA TRẠNG THÁI, KHÔNG PHẢI HAI.
 *
 * Bản đầu bắt mọi lỗi rồi trả `null`, nên JSON cắt cụt / sai schema / không đọc được đều rơi
 * vào nhánh "chưa từng ghim" — mà nhánh đó thì ĐƯỢC GHI ĐÈ. Tức là **làm hỏng sổ ghim là cách
 * vượt qua lớp bảo vệ sửa tay**: xoá nửa file lock rồi chạy `--apply` là mọi bản vá tại chỗ
 * biến mất hợp lệ. Audit độc lập bắt được 03/09. */
export function docSoGhim(repo) {
  const duong = path.join(repo, ...SO_GHIM.split("/"));
  let raw;
  try { raw = fs.readFileSync(duong, "utf8"); }
  catch (e) { return e?.code === "ENOENT" ? { trangThai: "KHONG" } : { trangThai: "HONG", loi: String(e.message).split(NL)[0] }; }
  let so;
  try { so = JSON.parse(raw); } catch (e) { return { trangThai: "HONG", loi: String(e.message).split(NL)[0] }; }
  if (!so || typeof so.managed !== "object" || so.managed === null || typeof so.version !== "string") {
    return { trangThai: "HONG", loi: "thiếu trường bắt buộc: version (chuỗi) và managed (khối)" };
  }
  return { trangThai: "CO", so };
}

/* SO BA CHIỀU, không phải hai.
 *
 * Hai chiều ("bản khung" vs "bản ở repo") chỉ nói được KHÁC hay GIỐNG. Nó không phân biệt được
 * hai ca hoàn toàn khác nhau: repo đang ghim một bản CŨ hợp lệ, và repo có người SỬA TAY file
 * của bộ khung. Ca đầu nâng cấp là xong; ca sau nâng cấp là mất việc của người ta.
 *
 * Chiều thứ ba là dấu vân tay đã ghi trong sổ ghim lúc lắp. */
export function soSanh(repo, chuan, soGhim) {
  const ra = [];
  /* FILE ĐÃ BỊ LOẠI KHỎI BẢN KHUNG cũng phải hiện ra. Bản đầu chỉ duyệt file của bản MỚI, nên
     một file từng nằm trong `managed` mà bản mới đã bỏ sẽ ở lại repo mãi mãi, rồi biến mất khỏi
     sổ ghim lần sau — thành rác vô chủ mà không công cụ nào kể tên. */
  for (const rel of Object.keys(soGhim?.managed ?? {})) {
    if (chuan.has(rel)) continue;
    let coTrenDia = true;
    try { fs.readFileSync(path.join(repo, ...rel.split("/"))); } catch { coTrenDia = false; }
    if (coTrenDia) ra.push({ rel, trangThai: "ĐÃ BỎ" });
  }
  for (const rel of fileMay(chuan)) {
    const moi = chuan.get(rel);
    let dangCo = null;
    try { dangCo = fs.readFileSync(path.join(repo, ...rel.split("/")), "utf8"); } catch { /* thiếu */ }
    const bamMoi = bam(moi);
    const bamCo = dangCo === null ? null : bam(dangCo);
    const bamGhim = soGhim?.managed?.[rel] ?? null;

    if (dangCo === null) { ra.push({ rel, trangThai: "THIẾU" }); continue; }
    if (bamCo === bamMoi) { ra.push({ rel, trangThai: "ĐÃ MỚI" }); continue; }
    // Khác bản khung. Câu hỏi thật: khác vì bộ khung tiến lên, hay vì repo bị sửa tay?
    if (bamGhim !== null && bamCo !== bamGhim) { ra.push({ rel, trangThai: "SỬA TAY" }); continue; }
    ra.push({ rel, trangThai: bamGhim === null ? "CHƯA GHIM" : "CŨ" });
  }
  return ra;
}

export function bamBanTrich(chuan) {
  // Một số phiên bản phải trỏ tới ĐÚNG MỘT nội dung. Bản trích dựng thẳng từ cây làm việc, còn
  // số phiên bản chỉ đọc từ `package.json` — nên nội dung đổi mà số vẫn nguyên là chuyện thường,
  // và chính phép thử "giả bản vá ở bộ khung" của tôi đã đi qua đúng ca đó.
  return bam(fileMay(chuan).sort().map((rel) => `${rel}:${bam(chuan.get(rel))}`).join("|"));
}

export function soGhimMoi(chuan, cu) {
  const managed = {};
  for (const rel of fileMay(chuan)) managed[rel] = bam(chuan.get(rel));
  const x = new Date();
  const z = (n) => String(n).padStart(2, "0");
  return {
    _doc: "Repo này đang dùng bản khung nào, và file máy nào là của bộ khung. SINH TỰ ĐỘNG bởi upgrade.mjs — đừng sửa tay.",
    source: "https://github.com/anhducds-GIT/Ark_Repo_Harness",
    version: TEMPLATE_VERSION,
    bundle_digest: bamBanTrich(chuan),
    applied_at: `${x.getFullYear()}-${z(x.getMonth() + 1)}-${z(x.getDate())}`,
    previous_version: cu?.version ?? null,
    managed
  };
}

/* ---- chạy ------------------------------------------------------------------ */

const THIS = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(THIS)) {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const force = args.includes("--force");
  const dich = args.find((a) => !a.startsWith("--"));
  if (!dich || (!apply && !args.includes("--plan"))) {
    console.error("Dùng: node scripts/upgrade.mjs --plan|--apply <đường-dẫn-repo> [--force]");
    process.exit(2);
  }
  const repo = path.resolve(dich);
  let dang;
  try { dang = fs.statSync(repo); } catch { dang = null; }
  if (!dang?.isDirectory()) {
    console.error(`TU_CHOI: "${repo}" không phải một thư mục repo.`);
    process.exit(2);
  }

  const chuan = buildTemplateFiles();
  const doc = docSoGhim(repo);

  // SỔ GHIM HỎNG THÌ DỪNG NGAY, trước cả khi so sánh. Coi nó như "chưa từng ghim" biến việc
  // làm hỏng file lock thành đường vòng qua mọi lớp bảo vệ phía dưới.
  if (doc.trangThai === "HONG") {
    console.error(`${NL}SO_GHIM_HONG: ${SO_GHIM} có nhưng đọc không nổi — ${doc.loi}`);
    console.error("Đây KHÔNG phải 'chưa từng ghim'. Sửa hoặc xoá hẳn file đó rồi chạy lại;");
    console.error(`xoá thì repo quay về trạng thái chưa ghim, và lần \`--apply\` sau sẽ ghim lại.${NL}`);
    process.exit(3);
  }
  const soGhim = doc.trangThai === "CO" ? doc.so : null;
  const dong = soSanh(repo, chuan, soGhim);
  const dem = (t) => dong.filter((d) => d.trangThai === t);

  console.log(`${NL}GHIM PHIÊN BẢN — ${repo}${NL}`);
  console.log(`  bản khung ở đây : ${TEMPLATE_VERSION}`);
  console.log(`  repo đích ghim  : ${soGhim ? soGhim.version : "CHƯA GHIM BAO GIỜ"}`);

  // CÙNG SỐ PHIÊN BẢN MÀ KHÁC NỘI DUNG — một số phiên bản phải trỏ tới đúng một nội dung, nếu
  // không nó chỉ là một cái nhãn. Ca này có thật: bản trích dựng thẳng từ cây làm việc.
  const digestMoi = bamBanTrich(chuan);
  const lechNoiDung = soGhim && soGhim.version === TEMPLATE_VERSION
    && typeof soGhim.bundle_digest === "string" && soGhim.bundle_digest !== digestMoi;
  if (lechNoiDung) {
    console.log(`${NL}  ⚠ CUNG_BAN_KHAC_NOI_DUNG: repo ghim ${soGhim.version} nhưng dấu vân tay bản trích khác`);
    console.log(`    (${soGhim.bundle_digest} ≠ ${digestMoi}). Bộ khung đã đổi mà số phiên bản chưa tăng.`);
    console.log("    Tăng phiên bản ở repo nhà trước, rồi nâng cấp — đừng để một số trỏ tới hai nội dung.");
  }
  console.log("");
  for (const t of ["ĐÃ BỎ", "SỬA TAY", "CŨ", "THIẾU", "CHƯA GHIM", "ĐÃ MỚI"]) {
    const ds = dem(t);
    if (!ds.length) continue;
    console.log(`  ${t.padEnd(10)} ${String(ds.length).padStart(2)} file${t === "ĐÃ MỚI" ? "" : `: ${ds.map((d) => d.rel).join(", ")}`}`);
  }

  const suaTay = dem("SỬA TAY");
  if (suaTay.length && !force) {
    console.log(`${NL}  ⚠ ${suaTay.length} file máy đã bị SỬA TAY sau lần ghim. Nâng cấp sẽ xoá các sửa đó.`);
    console.log("    Đọc `git diff` ở repo đích trước. Cố ý muốn bỏ thì chạy lại kèm --force.");
  }

  if (!apply) {
    const canLam = dem("CŨ").length + dem("THIẾU").length + dem("CHƯA GHIM").length;
    console.log(`${NL}${canLam ? `Chạy lại với --apply để ghi ${canLam} file.` : "Không có gì để nâng cấp."}${NL}`);
    process.exit(0);
  }

  if (suaTay.length && !force) {
    console.error(`${NL}TU_CHOI: có file bị sửa tay. Xem ở trên, rồi quyết — không tự ghi đè việc của người khác.${NL}`);
    process.exit(3);
  }

  /* CHƯA GHIM MÀ FILE ĐÃ KHÁC cũng phải DỪNG.
   *
   * Tài liệu vẫn nói "không đủ căn cứ thì báo, không đoán" — nhưng vòng ghi lại ghi mọi thứ trừ
   * ĐÃ MỚI, nên repo cũ chưa ghim có file máy đã khác sẽ bị ghi đè MẶC ĐỊNH. Đó chính là ca
   * nguy hiểm nhất: repo đã sống lâu, và không ai còn nhớ file đó khác vì lý do gì.
   *
   * THIẾU thì vẫn ghi — thiếu file là ca lắp lần đầu, không có gì để mất. */
  const chuaGhim = dem("CHƯA GHIM");
  if (chuaGhim.length && !force) {
    console.error(`${NL}TU_CHOI: ${chuaGhim.length} file máy đã khác bản khung, mà repo CHƯA có sổ ghim`);
    console.error(`nên không đủ căn cứ nói đó là bản cũ hay bản vá tại chỗ: ${chuaGhim.map((d) => d.rel).join(", ")}.`);
    console.error("Đọc `git diff` ở repo đích. Chắc chắn bỏ được thì chạy lại kèm --force.");
    console.error(`(Repo khớp hoàn toàn hoặc chỉ THIẾU file thì \`--apply\` chạy bình thường.)${NL}`);
    process.exit(3);
  }

  let daGhi = 0;
  for (const d of dong) {
    // ĐÃ BỎ = file bản khung không còn phát nữa. Chỉ kể tên, KHÔNG tự xoá: xoá file trong repo
    // người khác là việc không lùi lại được, và nó phải do người quyết.
    if (d.trangThai === "ĐÃ MỚI" || d.trangThai === "ĐÃ BỎ") continue;
    const dest = path.join(repo, ...d.rel.split("/"));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    // Ghi ra file tạm rồi đổi tên: đổi tên là thao tác nguyên tử, nên một lần ngắt giữa chừng
    // không để lại file cụt. Ghi thẳng thì có thể bỏ lại một `session-check.mjs` mất nửa cuối.
    const tam = `${dest}.tam-${process.pid}`;
    fs.writeFileSync(tam, chuan.get(d.rel), "utf8");
    fs.renameSync(tam, dest);
    daGhi += 1;
  }
  const thuMucSo = path.join(repo, ".ark");
  fs.mkdirSync(thuMucSo, { recursive: true });
  fs.writeFileSync(path.join(thuMucSo, "harness.lock.json"),
    `${JSON.stringify(soGhimMoi(chuan, soGhim), null, 2)}${NL}`, "utf8");

  console.log(`${NL}Đã ghi ${daGhi} file máy và cập nhật ${SO_GHIM} → ${TEMPLATE_VERSION}.`);
  console.log(`Bước kế ở repo đích: chạy \`npm test\`, rồi cổng đóng phiên.${NL}`);
}
