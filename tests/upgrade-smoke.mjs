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
    const dong = soSanh(root, chuan, docSoGhim(root));
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
      const d = soSanh(root, chuan, docSoGhim(root)).find((x) => x.rel === mot);
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
      const d = soSanh(root, khungMoi, docSoGhim(root)).find((x) => x.rel === mot);
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
      const d = soSanh(root, chuan, docSoGhim(root)).find((x) => x.rel === mot);
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

console.log(`\n${passed} passed, 0 failed, ${passed} total`);
