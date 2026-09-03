/* GHIM PHIÊN BẢN + NÂNG CẤP — phép kiểm phá.
 *
 * Điều đáng canh nhất KHÔNG phải "có chép file sang không" (chép thì dễ), mà là **có biết dừng
 * lại khi file đích đã bị sửa tay không**. Không có vế đó thì `upgrade` chỉ là `cp -r` có nghi
 * thức, và nó sẽ xoá bản vá tại chỗ của người khác mà không để lại dấu vết nào.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildTemplateFiles } from "../scripts/build-template.mjs";
import { docSoGhim, fileMay, soGhimMoi, soSanh } from "../scripts/upgrade.mjs";

let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chuan = buildTemplateFiles();

const dungRepo = (ghiSoGhim) => {
  const root = mkdtempSync(join(tmpdir(), "upgrade-"));
  for (const rel of fileMay(chuan)) {
    mkdirSync(join(root, dirname(rel)), { recursive: true });
    writeFileSync(join(root, rel), chuan.get(rel), "utf8");
  }
  if (ghiSoGhim) {
    mkdirSync(join(root, ".ark"), { recursive: true });
    writeFileSync(join(root, ".ark", "harness.lock.json"), JSON.stringify(soGhimMoi(chuan, null), null, 2), "utf8");
  }
  return root;
};

/* ---- 1. Chỉ tầng MÁY được nâng cấp -------------------------------------- */
{
  // Luật và trạng thái là chữ của repo đích. Ghi đè chúng là xoá công của người ta — đúng thứ
  // quy trình migrate cấm ("thêm vào, đừng thay thế").
  const ds = fileMay(chuan);
  assert.ok(ds.every((r) => r.startsWith("scripts/") || r.startsWith("tests/")),
    "chi duoc nang cap scripts/ va tests/");
  assert.ok(!ds.includes("AGENTS.md") && !ds.includes("STATUS.md") && !ds.includes("HANDOFF.md"),
    "luat va trang thai KHONG duoc nam trong tap tu dong ghi de");
  assert.ok(ds.length >= 6, `phai co it nhat 6 file may, dang ${ds.length}`);
  ok("chỉ tầng máy được nâng cấp — luật và trạng thái không bị đụng");
}

/* ---- 2. Repo khớp bản khung → không có việc gì --------------------------- */
{
  const root = dungRepo(true);
  try {
    const dong = soSanh(root, chuan, docSoGhim(root).so);
    assert.ok(dong.every((d) => d.trangThai === "ĐÃ MỚI"),
      `repo vua lap thi moi file phai la DA MOI, dang co: ${dong.filter((d) => d.trangThai !== "ĐÃ MỚI").map((d) => `${d.rel}=${d.trangThai}`).join(", ")}`);
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("repo khớp bản khung: không có gì để nâng cấp");
}

/* ---- 3. SỬA TAY phải phân biệt được với CŨ ------------------------------- */
{
  // Đây là toàn bộ lý do sổ ghim tồn tại. Hai ca dưới đây trông GIỐNG HỆT nhau nếu chỉ so
  // "bản khung" với "bản ở repo" — cả hai đều KHÁC. Chỉ dấu vân tay ghi lúc lắp mới tách được:
  //   CŨ      = repo giữ nguyên bản đã ghim, bộ khung tiến lên  → nâng cấp thoải mái
  //   SỬA TAY = repo đã lệch khỏi bản đã ghim                    → nâng cấp là XOÁ việc người ta
  const mot = fileMay(chuan)[0];

  // (a) SỬA TAY: repo có sổ ghim, và file đã lệch khỏi bản đã ghim.
  {
    const root = dungRepo(true);
    try {
      writeFileSync(join(root, mot), `${chuan.get(mot)}\n// mot ban va tai cho cua nguoi khac\n`, "utf8");
      const d = soSanh(root, chuan, docSoGhim(root).so).find((x) => x.rel === mot);
      assert.equal(d.trangThai, "SỬA TAY",
        "file lech khoi ban DA GHIM la SUA TAY — nang cap se xoa viec cua nguoi ta");
    } finally { rmSync(root, { recursive: true, force: true }); }
  }

  // (b) CŨ: repo giữ đúng bản đã ghim, nhưng BẢN KHUNG đã tiến lên.
  //     Dựng bằng cách ghim một dấu vân tay khớp với file đang có, rồi giả vờ bản khung mới hơn.
  {
    const root = dungRepo(true);
    try {
      const khungMoi = new Map(chuan);
      khungMoi.set(mot, `${chuan.get(mot)}\n// ban khung tien len\n`);
      const d = soSanh(root, khungMoi, docSoGhim(root).so).find((x) => x.rel === mot);
      assert.equal(d.trangThai, "CŨ",
        "repo giu dung ban da ghim ma bo khung tien len thi la CU, khong phai SUA TAY");
    } finally { rmSync(root, { recursive: true, force: true }); }
  }

  // (c) ĐỐI CHỨNG: KHÔNG có sổ ghim thì không thể kết luận là sửa tay — phải nói "CHƯA GHIM".
  //     Đoán bừa "sửa tay" ở đây sẽ chặn mọi repo migrate trước khi có cơ chế ghim.
  {
    const root = dungRepo(false);
    try {
      writeFileSync(join(root, mot), `${chuan.get(mot)}\n// khac\n`, "utf8");
      const d = soSanh(root, chuan, docSoGhim(root).so).find((x) => x.rel === mot);
      assert.equal(d.trangThai, "CHƯA GHIM",
        "khong co so ghim thi khong du can cu goi la SUA TAY");
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
  ok("phân biệt được SỬA TAY · CŨ · CHƯA GHIM — ba ca trông giống nhau nếu chỉ so hai chiều");
}

/* ---- 4. `--apply` TỪ CHỐI khi có file bị sửa tay ------------------------- */
{
  // Không có vế này thì `upgrade` chỉ là `cp -r` có nghi thức: nó sẽ xoá bản vá tại chỗ của
  // người khác, im lặng, và không ai biết cho tới lúc thứ gì đó hỏng.
  const root = dungRepo(true);
  try {
    const mot = fileMay(chuan)[0];
    const daSua = `${chuan.get(mot)}\n// mot ban va tai cho\n`;
    writeFileSync(join(root, mot), daSua, "utf8");
    // Ép bản khung khác đi để `--apply` thật sự có việc phải ghi.
    const r = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), "--apply", root], { encoding: "utf8" });
    assert.notEqual(r.status, 0, "co file bi sua tay thi --apply phai TU CHOI");
    assert.match(String(r.stdout) + String(r.stderr), /TU_CHOI|SỬA TAY/, "phai noi ro vi sao tu choi");
    assert.equal(readFileSync(join(root, mot), "utf8"), daSua,
      "tu choi thi phai KHONG dung mot byte nao cua file da sua");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("--apply từ chối khi có file bị sửa tay, và không đụng vào file đó");
}


/* ---- 5. Sổ ghim HỎNG phải DỪNG, không được coi như chưa từng ghim -------- */
{
  // `docSoGhim` bắt mọi lỗi rồi trả `null`. Hậu quả: JSON cắt cụt, sai schema, hay không đọc
  // được đều rơi vào nhánh CHƯA GHIM — và CHƯA GHIM thì bị ghi đè. Tức là **làm hỏng sổ ghim
  // là cách để vượt qua lớp bảo vệ sửa tay**. Ba trạng thái, không phải hai: KHÔNG · CÓ · HỎNG.
  const root = dungRepo(true);
  try {
    writeFileSync(join(root, ".ark", "harness.lock.json"), "{ day la json cut", "utf8");
    const kq = docSoGhim(root);
    assert.equal(kq?.trangThai, "HONG", "so ghim hong phai la HONG, khong duoc lan sang KHONG");
    const r = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), "--apply", root], { encoding: "utf8" });
    assert.notEqual(r.status, 0, "so ghim hong thi --apply phai DUNG");
    assert.match(String(r.stdout) + String(r.stderr), /SO_GHIM_HONG/, "phai noi ro so ghim hong");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("sổ ghim hỏng → dừng, không lẫn sang 'chưa ghim'");
}

/* ---- 6. CHƯA GHIM mà file đã khác → DỪNG --------------------------------- */
{
  // Tài liệu hứa "không đủ căn cứ thì báo, không đoán" — nhưng vòng ghi lại ghi mọi thứ trừ
  // ĐÃ MỚI. Repo cũ chưa ghim mà có file máy đã khác sẽ bị ghi đè MẶC ĐỊNH. Đó đúng là ca
  // nguy hiểm nhất: repo đã sống lâu, không ai biết file đó khác vì sao.
  const root = dungRepo(false);
  try {
    const mot = fileMay(chuan)[0];
    const daSua = `${chuan.get(mot)}\n// khac, va khong biet vi sao\n`;
    writeFileSync(join(root, mot), daSua, "utf8");
    const r = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), "--apply", root], { encoding: "utf8" });
    assert.notEqual(r.status, 0, "chua ghim ma file da khac thi --apply phai DUNG");
    assert.equal(readFileSync(join(root, mot), "utf8"), daSua, "khong duoc dung vao file do");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("chưa ghim mà file đã khác → dừng, không ghi đè");
}

/* ---- 7. File bị LOẠI khỏi bản khung phải hiện ra ------------------------- */
{
  // So sánh chỉ duyệt file của bản MỚI. File từng nằm trong `managed` mà bản mới đã bỏ sẽ ở lại
  // repo mãi mãi, rồi biến mất khỏi sổ ghim lần sau — thành rác vô chủ mà không công cụ nào kể.
  const root = dungRepo(true);
  try {
    const khungMoi = new Map(chuan);
    const bo = fileMay(chuan)[0];
    khungMoi.delete(bo);
    const dong = soSanh(root, khungMoi, docSoGhim(root).so);
    const d = dong.find((x) => x.rel === bo);
    assert.ok(d, "file bi loai khoi ban khung PHAI van hien trong ket qua so sanh");
    assert.equal(d.trangThai, "ĐÃ BỎ", "phai goi ten no la DA BO, khong duoc im lang");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("file bị loại khỏi bản khung hiện ra là ĐÃ BỎ, không thành rác vô chủ");
}

/* ---- 8. Cùng phiên bản mà khác nội dung → DỪNG --------------------------- */
{
  // Bản trích dựng thẳng từ cây làm việc, còn số phiên bản chỉ đọc từ `package.json`. Nên nội
  // dung đổi mà số vẫn `1.1.0` — và chính phép thử "giả bản vá ở bộ khung" của tôi đã đi qua
  // đúng ca này. Một số phiên bản trỏ tới hai nội dung khác nhau thì nó không còn là mốc.
  const root = dungRepo(true);
  try {
    const so = JSON.parse(readFileSync(join(root, ".ark", "harness.lock.json"), "utf8"));
    assert.ok(so.bundle_digest, "so ghim phai mang dau van tay cua CA BAN TRICH, khong chi so phien ban");
    so.bundle_digest = "0".repeat(16);          // cùng version, khác nội dung
    writeFileSync(join(root, ".ark", "harness.lock.json"), JSON.stringify(so, null, 2), "utf8");
    const r = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), "--plan", root], { encoding: "utf8" });
    assert.match(String(r.stdout) + String(r.stderr), /CUNG_BAN_KHAC_NOI_DUNG/,
      "cung so phien ban ma khac noi dung thi phai keu len");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("cùng phiên bản mà khác nội dung → kêu lên, số phiên bản mới là mốc thật");
}

console.log(`
${passed} passed, 0 failed, ${passed} total`);
