/* PHÉP KIỂM CÔNG CỤ ĐO ĐỘ LỆCH.
 *
 * Công cụ này sinh ra để trả lời "repo kia cách chuẩn bao xa" TRƯỚC khi ai đó bỏ công migrate.
 * Nên kiểu hỏng đáng sợ nhất của nó không phải là chạy sai — mà là **luôn trả lời dễ chịu**:
 * một bộ đo lúc nào cũng nói "gần đạt rồi" thì vô hại về mặt kỹ thuật và tai hại về mặt quyết
 * định, vì nó khiến người ta lên lịch cho một việc rẻ hơn sự thật.
 *
 * Vì thế mọi khối dưới đây đều dựng **hai đầu**: một repo THẬT SỰ đủ và một repo THẬT SỰ thiếu.
 * Không có đầu thiếu thì mọi khẳng định "đo đúng" đều rỗng nghĩa.
 */

import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildTemplateFiles } from "../scripts/build-template.mjs";
import { cauHinhDocDuoc, chiPhi, coLenhTest, danhGia, mucDo, tangCuaFile, TANG, TUY_CHON } from "../scripts/assess.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chuan = buildTemplateFiles();
let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };

function dungRepo(files) {
  const root = mkdtempSync(join(tmpdir(), "assess-"));
  for (const [rel, text] of files) {
    const abs = join(root, ...rel.split("/"));
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, text, "utf8");
  }
  return root;
}

/* ---- 1. Repo dựng ĐÚNG từ bộ khung: mức cao nhất, chi phí bằng 0 ---------- */
{
  const root = dungRepo(chuan);
  try {
    const dong = danhGia(root, chuan);
    const m = mucDo(dong);
    const cp = chiPhi(dong);
    assert.equal(m.muc, 3, `repo dung dung tu bo khung phai dat muc cao nhat, dang ra ${m.muc}`);
    assert.deepEqual(cp, { tha: 0, viet: 0, soi: 0 }, `khong duoc bao no cho mot repo vua dung tu chinh bo khung: ${JSON.stringify(cp)}`);
    assert.equal(coLenhTest(root), true, "bo khung phai khai scripts.test — thieu no la cong cam vinh vien");
    assert.ok(dong.every((d) => d.trangThai === "KHỚP"), "moi file phai KHOP vi day la ban sao nguyen ban");
    ok("repo dung tu bo khung: mức 3 · chi phí 0/0/0 · mọi file khớp");
  } finally { rmSync(root, { recursive: true, force: true }); }
}

/* ---- 2. ĐẦU KIA — repo trống rỗng phải ra mức 0 --------------------------- */
{
  // Không có khối này thì khối 1 rỗng nghĩa: một hàm luôn trả `muc: 3` cũng qua được nó.
  const root = dungRepo(new Map());
  try {
    const dong = danhGia(root, chuan);
    const m = mucDo(dong);
    assert.equal(m.muc, 0, `thu muc rong phai ra muc 0, dang ra ${m.muc}`);
    assert.ok(m.ke.length > 10, "muc 0 phai kem mot cau viec-ke doc duoc, khong chi mot con so");
    assert.equal(coLenhTest(root), null, "khong co package.json thi phai tra null, khong phai false");
    const cp = chiPhi(dong);
    assert.ok(cp.tha >= 5, `repo rong phai can tha it nhat 5 file may, dang ra ${cp.tha}`);
    ok(`thư mục rỗng: mức 0 · phải thả ${cp.tha} file máy`);
  } finally { rmSync(root, { recursive: true, force: true }); }
}

/* ---- 3. Repo NỬA VỜI — có luật, chưa có bộ máy --------------------------- */
{
  // Ca thật hay gặp nhất khi migrate: repo cũ có README và vài quy ước, nhưng không có công cụ
  // nào. Nếu công cụ đo gộp ca này với ca "chưa có gì" thì nó nói sai về giá: một bên cần thả
  // file, một bên cần dựng lại từ đầu.
  const nuaVoi = new Map([
    ["AGENTS.md", chuan.get("AGENTS.md")],
    [".repo-structure.json", chuan.get(".repo-structure.json")]
  ]);
  const root = dungRepo(nuaVoi);
  try {
    const dong = danhGia(root, chuan);
    const m = mucDo(dong);
    assert.equal(m.muc, 1, `co luat ma khong co bo may phai ra muc 1, dang ra ${m.muc}`);
    const cp = chiPhi(dong);
    assert.ok(cp.tha > 0, "phai noi ro con bao nhieu file may can tha");
    assert.ok(cp.viet > 0, "phai noi ro con bao nhieu file nguoi phai viet");
    ok(`repo nửa vời: mức 1 · thả ${cp.tha} · viết ${cp.viet}`);
  } finally { rmSync(root, { recursive: true, force: true }); }
}

/* ---- 4. Có bộ máy nhưng KHÔNG có lưới đỡ -------------------------------- */
{
  // Đây là ca đã hỏng thật ở chính bộ khung này (02/09): năm công cụ đầy đủ, cổng chạy, mà
  // không có một phép kiểm nào và `package.json` không khai `scripts.test` — nên cổng xanh
  // vĩnh viễn mà không chạy gì. Công cụ đo PHẢI phân biệt được ca này với ca đủ bộ, nếu không
  // nó sẽ chấm một repo có cổng câm là "đạt chuẩn".
  const khongLuoi = new Map(chuan);
  khongLuoi.delete("tests/harness-smoke.mjs");
  khongLuoi.set("package.json", JSON.stringify({ name: "x", scripts: { gate: "node scripts/session-check.mjs" } }, null, 2));
  const root = dungRepo(khongLuoi);
  try {
    const dong = danhGia(root, chuan);
    assert.equal(mucDo(dong).muc, 2, "co bo may ma thieu suite phai ra muc 2, khong duoc cham la du bo");
    assert.equal(coLenhTest(root), false, "package.json khong khai scripts.test thi phai bao FALSE");
    ok("repo có bộ máy nhưng cổng câm: mức 2, và nói rõ thiếu scripts.test");
  } finally { rmSync(root, { recursive: true, force: true }); }
}

/* ---- 5. Phân tầng phải đúng, vì cả cách chấm dựa lên nó ------------------ */
{
  assert.equal(tangCuaFile("scripts/session-check.mjs"), TANG.MAY);
  assert.equal(tangCuaFile("tests/harness-smoke.mjs"), TANG.MAY);
  assert.equal(tangCuaFile("AGENTS.md"), TANG.LUAT);
  assert.equal(tangCuaFile("docs/_TEMPLATE-adr.md"), TANG.LUAT);
  assert.equal(tangCuaFile("HANDOFF.md"), TANG.TRANG);
  // `package.json` KHÔNG được xếp tầng máy: mọi repo thật đều có bản riêng với hàng chục lệnh
  // khác, nên đòi khớp từng byte là báo nợ oan cho đúng 100% repo. Đo được ngay lần chạy đầu
  // trên chính repo này, 03/09.
  assert.equal(tangCuaFile("package.json"), TANG.TRANG,
    "package.json phai la tang TRANG — xep vao MAY la bao no oan cho moi repo that");
  ok("phân tầng: máy phải khớp · luật được lệch · trạng thái chỉ cần có");
}

/* ---- 6. File tuỳ chọn không được đếm thành nợ ---------------------------- */
{
  const thieuPhuLuc = new Map(chuan);
  for (const rel of TUY_CHON) thieuPhuLuc.delete(rel);
  const root = dungRepo(thieuPhuLuc);
  try {
    const cp = chiPhi(danhGia(root, chuan));
    assert.deepEqual(cp, { tha: 0, viet: 0, soi: 0 },
      `xoa file tuy chon di thi KHONG duoc sinh no: ${JSON.stringify(cp)}`);
    // ĐỐI CHỨNG: xoá một file BẮT BUỘC thì phải sinh nợ ngay. Không có vế này thì khối trên
    // cũng qua được với một hàm chiPhi luôn trả 0.
    const thieuThat = new Map(chuan);
    thieuThat.delete("scripts/safe-push.mjs");
    const root2 = dungRepo(thieuThat);
    try {
      assert.equal(chiPhi(danhGia(root2, chuan)).tha, 1, "xoa mot file MAY bat buoc thi phai sinh dung 1 no 'tha'");
    } finally { rmSync(root2, { recursive: true, force: true }); }
    ok(`file tuỳ chọn (${TUY_CHON.size}) không sinh nợ, file bắt buộc thì có`);
  } finally { rmSync(root, { recursive: true, force: true }); }
}

/* ---- 6b. Cấu hình HỎNG CÚ PHÁP phải bị chấm là repo chưa chạy được ------- */
{
  // Audit độc lập bắt được 03/09. Repo có `.repo-structure.json` chỉ gồm một dấu `{` vẫn được
  // chấm MỨC 3, CHI PHÍ 0/0/0 — trong khi structure gate của chính nó thoát mã 2 và không chạy
  // nổi. Lọt vì phép so cũ chỉ hỏi "có file không" và "có khác bản chuẩn không": file hỏng thì
  // CÓ, và KHÁC — tức "LỆCH", tức chuyện bình thường ở tầng luật. Không ai hỏi nó PARSE được không.
  for (const hong of [".repo-structure.json", "package.json", ".agents/claims.json"]) {
    const root = dungRepo(chuan);
    try {
      writeFileSync(join(root, ...hong.split("/")), "{", "utf8");
      const loi = cauHinhDocDuoc(root);
      assert.equal(loi.length, 1, `${hong} hong cu phap thi phai bao dung mot loi, dang bao ${loi.length}`);
      assert.equal(loi[0].file, hong, "phai chi dung file hong");
      assert.equal(mucDo(danhGia(root, chuan), loi).muc, 0,
        `${hong} hong thi repo CHUA CHAY DUOC — phai la muc 0, khong duoc cham la du bo`);
    } finally { rmSync(root, { recursive: true, force: true }); }
  }

  // ĐỐI CHỨNG: repo lành phải KHÔNG bị báo hỏng. Thiếu vế này thì một hàm luôn trả "có lỗi"
  // cũng qua được ba ca trên, và mọi repo trên đời đều bị chấm mức 0.
  {
    const root = dungRepo(chuan);
    try {
      assert.deepEqual(cauHinhDocDuoc(root), [], "repo lanh khong duoc bao cau hinh hong");
      assert.equal(mucDo(danhGia(root, chuan), []).muc, 3, "repo lanh van phai la muc 3");
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
  ok("cấu hình hỏng cú pháp → mức 0 (3 file), repo lành → mức 3");
}

/* ---- 7. Trên chính repo này: phải đạt mức cao nhất ----------------------- */
{
  // Repo sinh ra bộ khung mà không đạt chuẩn của chính nó thì mọi thứ khác đều đáng nghi.
  const dong = danhGia(ROOT, chuan);
  const m = mucDo(dong);
  assert.equal(m.muc, 3, `repo sinh ra bo khung phai dat muc 3, dang ra ${m.muc} (${m.ten})`);
  assert.equal(coLenhTest(ROOT), true, "repo goc phai khai scripts.test");
  ok("repo sinh ra bộ khung tự đạt chuẩn của chính nó");
}

/* ---- 8. Có file nhưng ĐỌC KHÔNG NỔI ≠ thiếu file ------------------------- */
{
  // Ca thật: một thư mục chiếm chỗ cái tên. Bản đầu gộp mọi lỗi đọc thành `null` = "THIẾU", nên
  // phép đo khuyên "thả file vào là xong" — và việc thả file THẤT BẠI, vì cái tên đã bị chiếm.
  // Lời khuyên sai còn tệ hơn không có lời khuyên: người ta làm theo rồi mới biết.
  const root = dungRepo(chuan);
  try {
    rmSync(join(root, ".repo-structure.json"), { force: true });
    mkdirSync(join(root, ".repo-structure.json"), { recursive: true });

    const dong = danhGia(root, chuan);
    const d = dong.find((x) => x.file === ".repo-structure.json");
    assert.equal(d.trangThai, "HỎNG", "thu muc chiem cho ten file phai la HONG, khong duoc keu la THIEU");
    assert.match(d.loi ?? "", /EISDIR|EPERM|EACCES/, "phai giu lai ma loi that de nguoi doc biet duong xu");

    const loi = cauHinhDocDuoc(root);
    assert.equal(loi.length, 1, "cau hinh doc khong noi cung phai bi ke la cau hinh hong");
    assert.equal(mucDo(dong, []).muc, 0, "co file doc khong noi thi moi con so phia sau la doan — phai la muc 0");
  } finally { rmSync(root, { recursive: true, force: true }); }

  // ĐỐI CHỨNG DƯƠNG: repo lành không được dính HỎNG, kẻo một hàm luôn trả HỎNG cũng qua ca trên.
  {
    const root2 = dungRepo(chuan);
    try {
      assert.equal(danhGia(root2, chuan).filter((x) => x.trangThai === "HỎNG").length, 0,
        "repo lanh khong duoc co dong nao HONG");
    } finally { rmSync(root2, { recursive: true, force: true }); }
  }
  ok("thư mục chiếm chỗ tên file → HỎNG + mức 0, không phải THIẾU");
}

/* ---- 9. Sai hoa thường không được tính là có ----------------------------- */
{
  // Windows và macOS không phân biệt hoa thường, Linux thì có. Nên `readFileSync("HANDOFF.md")`
  // vẫn đọc được file tên `handoff.md`, và phép đo báo "khớp". Cùng repo, cùng lệnh: xanh trên
  // máy Đức, đỏ trên CI Linux. Đo được thật trên repo NAV ngày 03/09.
  //
  // Phép kiểm này CHẶT trên Windows/macOS (trước khi vá thì nó đỏ) và LỎNG trên Linux (ở đó
  // đổi tên là file biến mất thật, nên nó xanh sẵn). Ghi ra đây để phiên sau đừng tưởng nó
  // đang canh gì trên CI.
  const root = dungRepo(chuan);
  try {
    renameSync(join(root, "HANDOFF.md"), join(root, "handoff.md"));
    const d = danhGia(root, chuan).find((x) => x.file === "HANDOFF.md");
    assert.equal(d.trangThai, "THIẾU",
      "file ten sai hoa thuong KHONG duoc cham la co — Linux se bao thieu");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("tên sai hoa thường → THIẾU (máy này không phân biệt, máy Linux thì có)");
}

console.log(`\n${passed} passed, 0 failed, ${passed} total`);
