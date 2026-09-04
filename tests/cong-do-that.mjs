/* CỔNG CÓ ĐỎ THẬT ĐƯỢC KHÔNG — sáu phép kiểm chưa từng đỏ lần nào.
 *
 * `can-nang.mjs` đếm được: qua 46 lượt chạy cổng, sáu phép kiểm dưới đây CHƯA TỪNG đỏ. Đó không
 * phải bằng chứng chúng tốt; nó chỉ là bằng chứng chưa ai thử. Một phép kiểm chưa từng đỏ và một
 * phép kiểm KHÔNG THỂ đỏ trông giống hệt nhau trên bảng — và bảng thì luôn xanh.
 *
 * Mỗi khối dựng một kho thật, phá ĐÚNG MỘT thứ, rồi đòi ĐÚNG phép kiểm ấy đỏ. Đòi "cổng đỏ" thôi
 * là không đủ: cổng có thể đỏ vì lý do khác và phép kiểm này vẫn chưa hề chạy tới — hôm nay đã
 * dính đúng cái bẫy đó một lần.
 *
 * KHÔNG thêm phép kiểm mới. Đây chỉ là bằng chứng cho những phép kiểm đã có.
 */

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const NL = String.fromCharCode(10);
const SCRIPTS = ["session-check.mjs", "repo-structure.mjs", "claim.mjs", "check-bootstrap.mjs", "build-dashboard.mjs"];

/* Kho nền: đủ để cổng chạy tới được mọi phép kiểm. Mỗi khối tự phá phần của mình. */
function khoNen({ chuKhoa = "thu" } = {}) {
  const cha = mkdtempSync(join(tmpdir(), "cong-do-"));
  const kho = join(cha, "kho");
  const bare = join(cha, "bare.git");
  execFileSync("git", ["init", "-q", "--bare", bare], { encoding: "utf8" });
  mkdirSync(kho, { recursive: true });
  const at = (...a) => execFileSync("git", a, { cwd: kho, encoding: "utf8" });
  at("init", "-q", "-b", "main");
  at("config", "user.name", "t");
  at("config", "user.email", "t@e.invalid");
  for (const d of ["scripts", ".agents", "docs", "tests", "evidence"]) mkdirSync(join(kho, d), { recursive: true });
  for (const f of SCRIPTS) copyFileSync(join(ROOT, "scripts", f), join(kho, "scripts", f));
  const ct = JSON.parse(readFileSync(join(ROOT, ".repo-structure.json"), "utf8"));
  writeFileSync(join(kho, ".repo-structure.json"), JSON.stringify(ct, null, 2) + NL, "utf8");
  const khoa = {};
  for (const v of Object.values(ct.areas)) {
    if (v && v.steward) khoa[v.steward] = { owner: chuKhoa, ai: null, task: "nen", released_at: null };
  }
  writeFileSync(join(kho, ".agents", "claims.json"), JSON.stringify({ claims: khoa }, null, 2) + NL, "utf8");
  writeFileSync(join(kho, "docs", "a.md"), "# a" + NL, "utf8");
  writeFileSync(join(kho, "evidence", "cu.txt"), "bang chung cu" + NL, "utf8");
  at("add", "-A");
  at("commit", "-q", "-m", "nen" + NL + NL + "Lane: " + chuKhoa);
  at("remote", "add", "origin", bare);
  at("push", "-q", "-u", "origin", "main");
  return { cha, kho, at };
}

/* Chạy cổng, rồi TÁCH RA đúng một phép kiểm theo tên. Đòi "cổng đỏ" chung chung là bẫy: cổng có
   thể đỏ vì chuyện khác, và phép kiểm ta đang chứng minh vẫn chưa hề chạy tới. */
function docMuc(kho, ten, as = "thu") {
  const r = spawnSync(process.execPath, [join(kho, "scripts", "session-check.mjs"), "--as", as],
    { cwd: kho, encoding: "utf8" });
  const out = String(r.stdout || "") + String(r.stderr || "");
  const dong = out.split(NL);
  const i = dong.findIndex((d) => d.includes("[") && d.includes(ten));
  assert.ok(i >= 0, `khong thay muc "${ten}" trong bao cao — phep kiem nay co con ton tai khong?${NL}${out.slice(0, 600)}`);
  const trangThai = dong[i].includes("[ĐỎ") ? "ĐỎ" : dong[i].includes("[BỎ") ? "BỎ" : "XANH";
  return { trangThai, chiTiet: dong[i + 1] || "", out };
}

/* ---- 1. Phạm vi trách nhiệm ---------------------------------------------- */
{
  const { cha, kho, at } = khoNen();
  try {
    // Đối chứng: chưa phá gì thì phải XANH — nếu không, mọi khẳng định "đỏ" dưới đây vô nghĩa.
    assert.equal(docMuc(kho, "Phạm vi trách nhiệm").trangThai, "XANH", "nen phai xanh truoc da");
    // Phá: bỏ chủ khỏi mọi vùng, rồi sửa một file. Việc không ai đứng tên.
    const c = JSON.parse(readFileSync(join(kho, ".agents", "claims.json"), "utf8"));
    for (const k of Object.keys(c.claims)) c.claims[k].owner = null;
    writeFileSync(join(kho, ".agents", "claims.json"), JSON.stringify(c, null, 2) + NL, "utf8");
    writeFileSync(join(kho, "docs", "a.md"), "# a doi roi" + NL, "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "sua ma khong ai dung ten" + NL + NL + "Lane: thu");
    const m = docMuc(kho, "Phạm vi trách nhiệm");
    assert.equal(m.trangThai, "ĐỎ", `viec khong ai dung ten phai DO, dang: ${m.trangThai} — ${m.chiTiet}`);
    assert.match(m.chiTiet, /chưa ai đứng tên|chưa khai chủ/, "phai noi ro vi sao");
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("1 · Phạm vi trách nhiệm ĐỎ được — việc không ai đứng tên");
}

/* ---- 2. Vùng bằng chứng không bị sửa ------------------------------------- */
{
  const { cha, kho, at } = khoNen();
  try {
    assert.equal(docMuc(kho, "Vùng bằng chứng").trangThai, "XANH", "nen phai xanh truoc da");
    // THÊM file vào vùng chỉ-thêm là HỢP LỆ. Không có vế này thì một phép kiểm chặn tuốt cũng
    // qua được khối dưới, và ta sẽ tưởng nó đúng.
    writeFileSync(join(kho, "evidence", "moi.txt"), "them moi thi hop le" + NL, "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "them bang chung moi" + NL + NL + "Lane: thu");
    assert.equal(docMuc(kho, "Vùng bằng chứng").trangThai, "XANH",
      "THEM file vao vung chi-them la hop le — chan cai nay la chan oan");

    writeFileSync(join(kho, "evidence", "cu.txt"), "da bi sua" + NL, "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "sua bang chung cu" + NL + NL + "Lane: thu");
    const m = docMuc(kho, "Vùng bằng chứng");
    assert.equal(m.trangThai, "ĐỎ", `sua file trong vung chi-them phai DO, dang: ${m.trangThai} — ${m.chiTiet}`);
    assert.match(m.chiTiet, /cu\.txt/, "phai ke dung file bi sua");
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("2 · Vùng bằng chứng ĐỎ được khi SỬA — và vẫn xanh khi chỉ THÊM");
}

/* ---- 3. Không có secret lọt vào repo ------------------------------------- */
{
  const { cha, kho, at } = khoNen();
  try {
    assert.equal(docMuc(kho, "Không có secret").trangThai, "XANH", "nen phai xanh truoc da");
    // Dựng chuỗi bằng mã, không gõ thẳng: một token trông như thật nằm trong file nguồn của bộ
    // khung sẽ tự làm đỏ chính cổng của repo này.
    const nhan = ["api", "_key"].join("");
    const giaTri = "b7Kq2ZzX9mNpQr4sT1uV";
    writeFileSync(join(kho, "docs", "cauhinh.txt"), `${nhan} = "${giaTri}"${NL}`, "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "lo mot token" + NL + NL + "Lane: thu");
    const m = docMuc(kho, "Không có secret");
    assert.equal(m.trangThai, "ĐỎ", `token that phai DO, dang: ${m.trangThai} — ${m.chiTiet}`);
    assert.match(m.chiTiet, /cauhinh\.txt/, "phai ke dung file nghi ngo");
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("3 · Không có secret ĐỎ được — token thật trong file được track");
}

/* ---- 4. Nhãn lane trong commit ------------------------------------------- */
{
  const { cha, kho, at } = khoNen();
  try {
    // CHẾ ĐỘ CẢNH BÁO CÓ CHỦ Ý: THIẾU nhãn thì chỉ nhắc, nhãn HỎNG mới đỏ. 509 commit lịch sử
    // không có nhãn, nên đỏ vì thiếu là chặn oan. Phép kiểm này phải phá đúng cách.
    writeFileSync(join(kho, "docs", "b.md"), "# b" + NL, "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "khong co nhan");
    assert.notEqual(docMuc(kho, "Nhãn lane").trangThai, "ĐỎ",
      "THIEU nhan thi chi nhac — do o day la chan oan 509 commit lich su");

    writeFileSync(join(kho, "docs", "c.md"), "# c" + NL, "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "nhan hong" + NL + NL + "Lane: co dau cach");
    const m = docMuc(kho, "Nhãn lane");
    assert.equal(m.trangThai, "ĐỎ", `nhan HONG phai DO, dang: ${m.trangThai} — ${m.chiTiet}`);
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("4 · Nhãn lane ĐỎ được khi nhãn HỎNG — và chỉ nhắc khi thiếu nhãn");
}

/* ---- 5. Bất biến quyền sở hữu ba tầng ------------------------------------ */
{
  const { cha, kho, at } = khoNen();
  try {
    assert.equal(docMuc(kho, "Bất biến quyền").trangThai, "XANH", "nen phai xanh truoc da");
    // Phá: khai một vùng trỏ tới khoá quyền không tồn tại. Bảng quyền và bản đồ vùng lệch nhau
    // thì mọi phép quy chủ phía trên đứng trên cát.
    const ct = JSON.parse(readFileSync(join(kho, ".repo-structure.json"), "utf8"));
    ct.areas["mot-thu-muc-moi/"] = { steward: "_khong_he_ton_tai", mutability: "rw", ownership_mode: "root", note: "thu" };
    writeFileSync(join(kho, ".repo-structure.json"), JSON.stringify(ct, null, 2) + NL, "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "khai vung tro toi khoa la" + NL + NL + "Lane: thu");
    const m = docMuc(kho, "Bất biến quyền");
    assert.equal(m.trangThai, "ĐỎ", `vung tro toi khoa khong ton tai phai DO, dang: ${m.trangThai} — ${m.chiTiet}`);
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("5 · Bất biến quyền sở hữu ĐỎ được — vùng trỏ tới khoá không tồn tại");
}

/* ---- 6. Mọi lệnh git đọc được -------------------------------------------- */
{
  // `git()` nuốt lỗi rồi trả chuỗi rỗng, nên một lệnh git hỏng có thể biến thành "0 file, 0 thay
  // đổi, sạch" — toàn xanh, vì mù. Phép kiểm này là cái phanh cuối cho đúng ca đó.
  const cha = mkdtempSync(join(tmpdir(), "cong-do-git-"));
  try {
    // KHÔNG `git init`: mọi lệnh git đều hỏng.
    mkdirSync(join(cha, "scripts"), { recursive: true });
    mkdirSync(join(cha, ".agents"), { recursive: true });
    for (const f of SCRIPTS) copyFileSync(join(ROOT, "scripts", f), join(cha, "scripts", f));
    copyFileSync(join(ROOT, ".repo-structure.json"), join(cha, ".repo-structure.json"));
    writeFileSync(join(cha, ".agents", "claims.json"), JSON.stringify({ claims: {} }), "utf8");
    const m = docMuc(cha, "Mọi lệnh git đọc được");
    assert.equal(m.trangThai, "ĐỎ", `khong phai kho git thi phai DO, dang: ${m.trangThai} — ${m.chiTiet}`);
    assert.match(m.chiTiet + m.out, /GIT_HONG/, "phai goi ten no la GIT_HONG");
    assert.doesNotMatch(m.out, /XANH TOÀN BỘ/, "va tuyet doi khong duoc bao xong");
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("6 · Mọi lệnh git đọc được ĐỎ được — repo không phải kho git");
}

/* ---- 7. Chi sinh lai artifact: "khong ap dung" chu khong phai "chua kiem" -- */
{
  // Bon artifact may sinh khong doi khoa nao (luat muc 1), nen chung khong vao `myRootAreas`,
  // nen `rootSuite` false, nen mot phien CHI SINH LAI ARTIFACT roi thang vao nhanh "chua kiem"
  // — va khong co cach nao thoat: chay `npm test` cung khong doi duoc ket luan. Tuc mot loai
  // commit rat thuong (`chore: sinh lai artifact`) KHONG BAO GIO dong phien duoc.
  //
  // Cung nguyen tac da dung cho file nhi phan o v1.2.13: goi ten dung thu von khong ap dung,
  // thay vi dan nhan "khong biet" len cho ta biet ro.
  const { cha, kho, at } = khoNen();
  try {
    // Kho nen khong khai `scripts.test` (co y: khoi 1-6 khong can). Khoi nay thi CAN, vi ve (a)
    // la doi chung "suite CHAY THAT" — thieu no thi ca hai ve deu BO va khoi nay xanh vo nghia.
    writeFileSync(join(kho, "package.json"),
      JSON.stringify({ name: "thu", version: "0.0.1", scripts: { test: "node tests/that.mjs" } }, null, 2) + NL, "utf8");
    writeFileSync(join(kho, "tests", "that.mjs"), "console.log('  ok  mot phep kiem that');" + NL
      + "console.log('1 passed, 0 failed, 1 total');" + NL, "utf8");
    writeFileSync(join(kho, "STATUS.md"), "---" + NL + "ten: thu" + NL + "---" + NL + "# thu" + NL, "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "khai suite" + NL + NL + "Lane: thu");
    at("push", "-q", "origin", "main");

    // (a) Doi mot file MA NGUON -> suite PHAI chay that. Day la doi chung: thieu no thi mot ban
    //     va "bo qua tuot" cung qua duoc khoi duoi.
    writeFileSync(join(kho, "docs", "nguon.md"), "# doi mot file nguon" + NL, "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "doi file nguon" + NL + NL + "Lane: thu");
    const m1 = docMuc(kho, "Test xanh");
    assert.equal(m1.trangThai, "XANH", `doi file nguon thi suite phai chay: ${m1.chiTiet}`);
    assert.match(m1.chiTiet, /passed/, "phai co so that cua suite, khong phai mot cau chung chung");

    // (b) Chi sinh lai ARTIFACT -> khong ap dung, va phai noi ro la khong ap dung.
    at("push", "-q", "origin", "main");
    writeFileSync(join(kho, "DASHBOARD.md"), "# bang" + NL + "sinh lai" + NL, "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "sinh lai artifact" + NL + NL + "Lane: thu");
    const m2 = docMuc(kho, "Test xanh");
    assert.equal(m2.trangThai, "XANH",
      `chi sinh lai artifact thi suite KHONG AP DUNG — bao "chua kiem" la khoa vinh vien mot loai commit rat thuong: ${m2.chiTiet}`);
    assert.match(m2.chiTiet, /không áp dụng/, "phai noi ro la KHONG AP DUNG, khong im lang bao xanh");
  } finally { rmSync(cha, { recursive: true, force: true }); }

  // (c) DOI CHUNG NGUOC, va no phai o mot kho KHONG khai `scripts.test` — chi o do moi vao duoc
  //     nhanh dang kiem. Doi mot file KHONG PHAI artifact thi van phai la "chua kiem": neu bo
  //     nay thi mot ban va "coi moi phien la chi-artifact" se im lang bao xanh cho MOI THU.
  const k2 = khoNen();
  try {
    writeFileSync(join(k2.kho, "docs", "that.md"), "# file nguon that" + NL, "utf8");
    k2.at("add", "-A");
    k2.at("commit", "-q", "-m", "doi file nguon o kho khong co suite" + NL + NL + "Lane: thu");
    const m3 = docMuc(k2.kho, "Test xanh");
    assert.equal(m3.trangThai, "BỎ",
      `doi file KHONG phai artifact thi van phai la "chua kiem", khong duoc goi la "khong ap dung": ${m3.chiTiet}`);
    assert.doesNotMatch(m3.chiTiet, /không áp dụng/, "day khong phai ca 'khong ap dung'");
  } finally { rmSync(k2.cha, { recursive: true, force: true }); }
  ok("7 · chỉ sinh lại artifact → không áp dụng · file nguồn → suite chạy thật · file khác → vẫn 'chưa kiểm'");
}

console.log(`${NL}${passed} passed, 0 failed, ${passed} total`);
