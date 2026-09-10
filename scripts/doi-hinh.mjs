#!/usr/bin/env node
/* ĐỘI HÌNH — repo nào đang tụt lại bản khung nào, đo một lượt.
 *
 *   node scripts/doi-hinh.mjs            # bảng: repo · ghim · lệch mấy file · tính năng nào cũ
 *   node scripts/doi-hinh.mjs --json
 *
 * VÌ SAO CÓ FILE NÀY. Câu *"repo nào đang tụt lại"* **về nguyên tắc chỉ trả lời được ở đây**:
 * repo đích không với tới repo nhà, nên nó không thể tự biết mình cũ. Trước lệnh này, câu đó chỉ
 * trả lời được khi có người tự gõ đường dẫn từng repo vào `upgrade --plan` — tức nó phụ thuộc
 * vào việc ai đó NHỚ RA.
 *
 * Đo 10/09, ba repo vừa migrate xong hôm trước: cả ba ghim `1.8.0` trong khi nhà đã `1.8.10`,
 * mỗi repo **7 file CŨ + 2 file THIẾU** — trong đó có `chay-test.mjs` (bản 1.8.3 vá một
 * FAIL-OPEN trong chính nó) và nguyên cơ chế cửa index của 1.8.8. Không một cổng nào ở ba repo
 * đó đỏ, và không ai biết, suốt bốn ngày.
 *
 * ĐO SỐNG, KHÔNG KHAI. Nguồn danh sách repo là `docs/migrations/*.md` — hồ sơ mỗi lượt migrate
 * đã khai sẵn `duong_dan`. Lệnh này **không đẻ thêm một cuốn sổ nào**: một cuốn sổ "repo X đang
 * ở bản Y" sẽ mục ngay lượt nâng đầu tiên không ai nhớ ghi vào, và lúc đó nó nói dối thay vì
 * nói thiếu. Hồ sơ migrate là bản ghi LỊCH SỬ, đúng vai của nó; con số hiện tại thì ĐI ĐO.
 *
 * FAIL-SOFT TỪNG REPO, NHƯNG KHÔNG BAO GIỜ FAIL-OPEN. Một repo đọc không được (đã dời chỗ, ổ
 * ngoài chưa cắm) thì kể tên nó là KHÔNG ĐỌC ĐƯỢC rồi đi tiếp — chứ không bỏ qua im lặng, vì
 * một dòng biến mất khỏi bảng đọc y hệt một repo đang khoẻ. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildTemplateFiles } from "./build-template.mjs";
import { readHoSo, THU_MUC_MIGRATE } from "./overview-doc.mjs";
import { docSoGhim, soSanh } from "./upgrade.mjs";

const NL = String.fromCharCode(10);
const NHA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* Một repo có thể có NHIỀU hồ sơ (migrate lần hai, lần ba). Lấy hồ sơ MỚI NHẤT cho mỗi đường
 * dẫn — `readHoSo` đã xếp mới-trước, nên cái gặp đầu tiên là cái cần. Khoá theo `duong_dan` chứ
 * không theo `repo`: tên repo đổi được, đường dẫn mới là thứ đi đo được. */
export function repoTrongSo(hoSo) {
  const thay = new Map();
  for (const h of hoSo) {
    const duong = String(h.fm?.duong_dan ?? "").trim();
    if (!duong || thay.has(duong)) continue;
    thay.set(duong, { duong, ten: String(h.fm?.repo ?? path.basename(duong)), ngay: h.fm?.ngay ?? null, file: h.file });
  }
  return [...thay.values()];
}

/* Bản đồ file → tính năng, suy từ `can.file` của danh mục. KHÔNG khai lần thứ hai: một bản đồ
 * gõ tay cạnh `features.json` là nguồn sự thật thứ hai cho đúng câu hỏi này. */
export function fileThuocTinhNang(danhMuc) {
  const m = new Map();
  for (const b of danhMuc.blocks ?? []) {
    for (const muc of b.muc ?? []) {
      for (const f of muc.can?.file ?? []) {
        if (!m.has(f)) m.set(f, []);
        m.get(f).push(muc.ma);
      }
    }
  }
  return m;
}

/* So hai số phiên bản dạng x.y.z. Không kéo semver về chỉ để làm việc này. Đọc không ra số thì
 * trả 0 ở vế đó — thà xếp sai thứ tự một dòng, hơn là ném và mất cả bảng. */
export function soSanhBan(a, b) {
  const p = (v) => String(v ?? "").split(".").map((x) => Number.parseInt(x, 10) || 0);
  const [x, y] = [p(a), p(b)];
  for (let i = 0; i < 3; i += 1) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0);
  return 0;
}

/* CÁC BẢN REPO ĐÍCH ĐANG BỎ LỠ — và cái mất của từng bản, nếu sổ có khai.
 *
 * Đây là vế trả lời câu **"có đáng nâng không"**, khác hẳn câu *"có lệch không"* mà so băm đã
 * trả lời. Một danh sách 7 file không nói được điều gì cho người quyết; một dòng *"1.8.3 vá một
 * FAIL-OPEN của cổng"* thì nói được.
 *
 * CHƯA KHAI PHẢI ĐỌC LÀ CHƯA KHAI. Bản không có mục trong `chi_tiet` được kể riêng thành một
 * con số, không lặng lẽ rơi khỏi danh sách — rơi đi thì bảng trông như đã kể hết. */
export function banBoLo(ghim, banNha, so) {
  const ban = Object.keys(so?.ban ?? {}).filter((v) => soSanhBan(v, ghim) > 0 && soSanhBan(v, banNha) <= 0);
  ban.sort(soSanhBan);
  const chiTiet = so?.chi_tiet ?? {};
  return {
    tong: ban.length,
    coKhai: ban.filter((v) => chiTiet[v]).map((v) => ({ ban: v, ...chiTiet[v] })),
    chuaKhai: ban.filter((v) => !chiTiet[v])
  };
}

export function do1(repo, chuan) {
  let co = false;
  try { co = fs.statSync(repo.duong).isDirectory(); } catch (_) { co = false; }
  if (!co) return { ...repo, trangThai: "KHONG_DOC_DUOC", vi: "không thấy thư mục" };

  const ghim = docSoGhim(repo.duong);
  if (ghim.trangThai === "KHONG") return { ...repo, trangThai: "CHUA_LAP", vi: "không có sổ ghim" };
  if (ghim.trangThai === "HONG") return { ...repo, trangThai: "KHONG_DOC_DUOC", vi: `sổ ghim hỏng: ${ghim.loi}` };

  const dong = soSanh(repo.duong, chuan, ghim.so);
  const gom = (t) => dong.filter((d) => d.trangThai === t).map((d) => d.rel);
  return {
    ...repo,
    trangThai: "DO_DUOC",
    ghim: ghim.so.version,
    cu: gom("CŨ"),
    thieu: gom("THIẾU"),
    suaTay: gom("SỬA TAY"),
    chuaGhim: gom("CHƯA GHIM")
  };
}

export function xepHang(ket) {
  /* Nặng trước: sửa tay là ca cần NGƯỜI đọc diff, cũ/thiếu thì lệnh làm được. Repo không đọc
   * được xuống cuối nhưng KHÔNG bị bỏ — nó là câu hỏi mở, không phải một dòng trống. */
  const diem = (r) => (r.trangThai !== "DO_DUOC" ? -1
    : (r.suaTay?.length ?? 0) * 1000 + (r.thieu?.length ?? 0) * 10 + (r.cu?.length ?? 0));
  return [...ket].sort((a, b) => diem(b) - diem(a));
}

function inBang(ket, banNha, banDoTinhNang, so) {
  console.log("");
  console.log(`ĐỘI HÌNH — bản khung ở nhà: ${banNha}`);
  console.log(`  nguồn danh sách: ${THU_MUC_MIGRATE}/*.md · ${ket.length} repo · đo SỐNG, không đọc sổ`);
  console.log("");

  let tut = 0, khongDo = 0;
  for (const r of xepHang(ket)) {
    if (r.trangThai !== "DO_DUOC") {
      khongDo += 1;
      console.log(`  [? ] ${r.ten}`);
      console.log(`       ${r.vi} — ${r.duong}`);
      console.log("       KHÔNG ĐỌC ĐƯỢC ≠ đã mới. Sửa đường dẫn trong hồ sơ, hoặc cắm lại ổ.");
      continue;
    }
    const lech = r.cu.length + r.thieu.length + r.suaTay.length;
    if (lech === 0) { console.log(`  [ok] ${r.ten}   ghim ${r.ghim} — khớp bản chuẩn`); continue; }
    tut += 1;
    console.log(`  [!!] ${r.ten}   ghim ${r.ghim} → nhà ${banNha}`);
    console.log(`       ${r.cu.length} cũ · ${r.thieu.length} thiếu · ${r.suaTay.length} sửa tay`);
    const ma = [...new Set([...r.cu, ...r.thieu].flatMap((f) => banDoTinhNang.get(f) ?? []))].sort();
    if (ma.length) console.log(`       tính năng đang chạy bản cũ hoặc thiếu hẳn: ${ma.join(" · ")}`);
    const bo = banBoLo(r.ghim, banNha, so);
    for (const b of bo.coKhai) console.log(`       bỏ lỡ ${b.ban} [${(b.tinh_nang ?? []).join(" ")}] — ${b.vi_sao}`);
    if (bo.chuaKhai.length) console.log(`       + ${bo.chuaKhai.length}/${bo.tong} bản CHƯA KHAI ý nghĩa (đọc CHANGELOG.md) — chưa khai ≠ không đáng`);
    if (r.suaTay.length) console.log(`       SỬA TAY (phải đọc diff, đừng --force): ${r.suaTay.join(" · ")}`);
    console.log(`       node scripts/upgrade.mjs --plan "${r.duong}"`);
  }

  console.log("");
  console.log(`TỔNG: ${tut} repo đang tụt lại · ${ket.length - tut - khongDo} khớp · ${khongDo} không đọc được.`);
  if (khongDo) console.log("Còn repo không đọc được thì con số trên là SÀN, không phải toàn cảnh.");
  console.log("");
}

export function chay(root = NHA) {
  const chuan = buildTemplateFiles();
  const hoSo = readHoSo({
    liet: () => { try { return fs.readdirSync(path.join(root, ...THU_MUC_MIGRATE.split("/"))).filter((f) => f.endsWith(".md")).sort(); } catch { return []; } },
    doc: (f) => fs.readFileSync(path.join(root, ...THU_MUC_MIGRATE.split("/"), f), "utf8")
  });
  return repoTrongSo(hoSo).map((r) => do1(r, chuan));
}

const THIS = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(THIS)) {
  const banNha = JSON.parse(fs.readFileSync(path.join(NHA, "package.json"), "utf8")).version;
  const ket = chay(NHA);
  if (process.argv.includes("--json")) { console.log(JSON.stringify({ banNha, repo: ket }, null, 2)); }
  else {
    const danhMuc = JSON.parse(fs.readFileSync(path.join(NHA, "features.json"), "utf8"));
    const so = JSON.parse(fs.readFileSync(path.join(NHA, "RELEASE-LEDGER.json"), "utf8"));
    inBang(ket, banNha, fileThuocTinhNang(danhMuc), so);
  }
}
