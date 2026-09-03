/* SỔ MIGRATE — phép kiểm hạt giống.
 *
 * Sổ này tồn tại để chống QUÊN, nên hai thứ phải được ghim: (a) một lần migrate không được biến
 * mất khỏi sổ vì hồ sơ khai thiếu, và (b) mọi hồ sơ phải in ra CÙNG MỘT KHUÔN — cùng khuôn thì
 * so sánh được giữa các lần, và thiếu phần nào thì lộ ra thay vì lẫn vào văn xuôi.
 */

import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { docHoSo, khoiHoSo, trangSo } from "../scripts/build-so-migrate.mjs";

let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };

const dungKho = (files) => {
  const root = mkdtempSync(join(tmpdir(), "so-migrate-"));
  mkdirSync(join(root, "docs", "migrations"), { recursive: true });
  for (const [ten, noi] of Object.entries(files)) {
    writeFileSync(join(root, "docs", "migrations", ten), noi, "utf8");
  }
  return root;
};

const hoSoDu = `---
kind: migration
repo: Repo Thử
duong_dan: C:\\tam\\repo-thu
ngay: 2026-01-02
ban_khung: 9.9.9
nghe: thử
muc_truoc: 1
muc_sau: 3
chi_phi_truoc: thả 7 · viết 9 · soi 0
chi_phi_sau: thả 0 · viết 0 · soi 0
cong_dong_phien: xanh
trang_thai: xong
loi_tim_ra: 4
---

## Trạng thái mới nhất
Xong.
`;

/* ---- 1. Xếp mới nhất lên đầu -------------------------------------------- */
{
  const root = dungKho({
    "a.md": hoSoDu.replace("ngay: 2026-01-02", "ngay: 2026-01-02").replace("Repo Thử", "Cũ"),
    "b.md": hoSoDu.replace("ngay: 2026-01-02", "ngay: 2026-05-05").replace("Repo Thử", "Mới")
  });
  try {
    const hs = docHoSo(root);
    assert.equal(hs.length, 2, "phai doc du hai ho so");
    assert.equal(hs[0].fm.repo, "Mới", "moi nhat phai len dau — nguoi mo so gan nhu luon hoi 'lan gan nhat the nao'");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("xếp mới nhất lên đầu");
}

/* ---- 2. Hồ sơ khai thiếu KHÔNG được biến mất ---------------------------- */
{
  // Bỏ qua im lặng nghĩa là một lần migrate biến mất khỏi lịch sử — đúng thứ sổ này sinh ra để
  // chặn. Nó phải VẪN HIỆN, và tự khai là thiếu.
  const root = dungKho({ "thieu.md": "---\nkind: migration\nrepo: Chỉ có tên\n---\n\nnội dung\n" });
  try {
    const hs = docHoSo(root);
    assert.equal(hs.length, 1, "ho so khai thieu VAN phai nam trong so, khong duoc bo qua im lang");
    const html = khoiHoSo(hs[0]);
    assert.match(html, /chưa khai \(ngay\)/, "truong thieu phai tu khai la thieu, khong duoc de trong");
    assert.match(html, /Chỉ có tên/, "phan khai duoc thi van phai hien");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("hồ sơ khai thiếu vẫn hiện, và tự khai chỗ thiếu");
}

/* ---- 3. Mọi hồ sơ in ra CÙNG MỘT KHUÔN ---------------------------------- */
{
  const root = dungKho({ "a.md": hoSoDu });
  try {
    const html = khoiHoSo(docHoSo(root)[0]);
    for (const phan of ["mức đạt chuẩn", "lỗi bộ khung tìm ra", "cổng đóng phiên", "kết quả"]) {
      assert.ok(html.includes(phan), `khuon phai co o "${phan}" — thieu mot o la mat mot chieu so sanh`);
    }
    assert.match(html, /1 → <strong>3<\/strong>/, "phai noi ro muc truoc va muc sau");
    assert.match(html, /den xanh/, "cong xanh thi den phai xanh");
    // Frontmatter KHONG duoc lot vao than bai. Ban dau destructure `{fm, body}` trong khi
    // parser tra `{fm, than}`, nen `body` la undefined va `body ?? raw` nga ve CA FILE —
    // toan bo khoi khai bao bi in lai nhu van xuoi. Khoi 3 cu chi kiem NHAN cua khuon nen
    // khong thay gi: mot phep kiem chi soi cai khung, khong soi cai trong khung.
    assert.doesNotMatch(html, /kind:\s*migration/, "frontmatter khong duoc in lai trong than bai");
    assert.doesNotMatch(html, /ban_khung:\s*9\.9\.9/, "truong khai bao khong duoc lot vao van xuoi");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("mọi hồ sơ in ra cùng một khuôn bốn ô");
}

/* ---- 4. Đèn: chỉ XANH khi cổng thật sự xanh ----------------------------- */
{
  // ĐỐI CHỨNG DƯƠNG cho khối 3: thiếu vế này thì một hàm luôn trả "den xanh" cũng qua được.
  const root = dungKho({ "a.md": hoSoDu.replace("cong_dong_phien: xanh", "cong_dong_phien: đỏ") });
  try {
    const html = khoiHoSo(docHoSo(root)[0]);
    assert.match(html, /den do/, "cong do thi den phai do");
    assert.doesNotMatch(html, /den xanh/, "cong do ma den xanh la so noi doi");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("đèn đỏ khi cổng đỏ (đối chứng dương cho khối 3)");
}

/* ---- 5. Sổ rỗng vẫn dùng được, và chỉ đường -------------------------- */
{
  const root = dungKho({});
  try {
    const html = trangSo(docHoSo(root), "2026-01-01");
    assert.match(html, /Chưa có lần migrate nào/, "so rong phai noi ro la rong, khong duoc de trang trang");
    assert.match(html, /docs\/migrations/, "va phai chi duong lam sao them ho so");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("sổ rỗng nói rõ là rỗng và chỉ đường");
}

console.log(`\n${passed} passed, 0 failed, ${passed} total`);
