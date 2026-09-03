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

export function docSoGhim(repo) {
  try { return JSON.parse(fs.readFileSync(path.join(repo, ...SO_GHIM.split("/")), "utf8")); }
  catch { return null; }
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

export function soGhimMoi(chuan, cu) {
  const managed = {};
  for (const rel of fileMay(chuan)) managed[rel] = bam(chuan.get(rel));
  const x = new Date();
  const z = (n) => String(n).padStart(2, "0");
  return {
    _doc: "Repo này đang dùng bản khung nào, và file máy nào là của bộ khung. SINH TỰ ĐỘNG bởi upgrade.mjs — đừng sửa tay.",
    source: "https://github.com/anhducds-GIT/Ark_Repo_Harness",
    version: TEMPLATE_VERSION,
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
  const soGhim = docSoGhim(repo);
  const dong = soSanh(repo, chuan, soGhim);
  const dem = (t) => dong.filter((d) => d.trangThai === t);

  console.log(`${NL}GHIM PHIÊN BẢN — ${repo}${NL}`);
  console.log(`  bản khung ở đây : ${TEMPLATE_VERSION}`);
  console.log(`  repo đích ghim  : ${soGhim ? soGhim.version : "CHƯA GHIM BAO GIỜ"}`);
  console.log("");
  for (const t of ["SỬA TAY", "CŨ", "THIẾU", "CHƯA GHIM", "ĐÃ MỚI"]) {
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

  let daGhi = 0;
  for (const d of dong) {
    if (d.trangThai === "ĐÃ MỚI") continue;
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
