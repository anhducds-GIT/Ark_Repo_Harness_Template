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

/* ---- 8. `docs.file_map` tro vao hu khong PHAI DO ------------------------- */
{
  /* CUA HAU DO CHINH BAN 1.3.3 MO RA, va do duoc ngay trong luot 1.3.4.
   *
   * 1.3.3 cho repo khai `docs.file_map` de noi Ban do file nam o dau — can thiet, vi repo
   * `n8n-orchestrator` de ban do o `design_brief.md` va luat do CO TRUOC bo khung.
   * Nhung duong doc ban do von co dong `if (!existsSync(...)) continue` — an toan khi noi dat
   * ban do con dong cung, thanh CUA HAU ngay khi no khai duoc.
   *
   * Do that: khai `file_map` tro toi mot file khong ton tai, them mot file moi chua khai o dau
   * ca -> cong bao XANH "Moi thu moi deu da khai". MOT DONG CAU HINH vo hieu hoa ca mot cong,
   * khong canh bao gi. Dung loai lo ma luat vang so 3 cam: khong duoc lam yeu lop bao ve da co.
   *
   * VE DOI CHUNG o cuoi khoi la phan quan trong: repo KHONG khai thi hanh vi cu phai giu nguyen,
   * neu khong ban va nay se lam do hang loat repo dang chay binh thuong. */
  const { cha, kho, at } = khoNen();
  try {
    assert.equal(docMuc(kho, "Bản đồ file").trangThai, "XANH", "nen phai xanh truoc da");

    const ct = JSON.parse(readFileSync(join(kho, ".repo-structure.json"), "utf8"));
    ct.docs = { file_map: "FILE-KHONG-HE-CO.md" };
    writeFileSync(join(kho, ".repo-structure.json"), JSON.stringify(ct, null, 2) + NL, "utf8");
    writeFileSync(join(kho, "file-moi-chua-khai.md"), "x" + NL, "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "khai file_map tro vao hu khong" + NL + NL + "Lane: thu");

    const m = docMuc(kho, "Bản đồ file");
    assert.equal(m.trangThai, "ĐỎ",
      `file_map tro toi file khong ton tai phai DO, dang: ${m.trangThai} — ${m.chiTiet}`);
    assert.match(m.chiTiet, /KHÔNG TỒN TẠI/,
      "phai noi ro la KHAI SAI, khong phai 'thieu ban do' — hai cai co hai cach sua khac han");
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("8 · `docs.file_map` trỏ vào hư không ĐỎ được — cửa hậu do 1.3.3 mở, bịt ở 1.3.4");
}


/* ---- 9. Doi nhat ky sang kho luu tru: XANH khi khop byte, DO khi khong ---- */
{
  /* KHUNG-25, Duc chot 06/09. HAI LUAT CUA REPO CAN NHAU, do that chu khong suy luan:
   *   · so tay bao tri: nhat ky qua ngan sach thi PHAI doi phan cu sang kho luu tru
   *   · cong dong phien: HANDOFF.md xoa bat ky dong nao la viet lai lich su -> chan
   * Lam dung luat thu nhat thi VINH VIEN khong dong duoc phien. Da thu that o repo nha 06/09:
   * cat 1273 -> 455 dong, cong DO; them mot commit CHI-THEM cung khong cuu duoc, vi phep do
   * cong don ca dai chua day chu khong doc rieng commit cuoi.
   *
   * Ban va SIET chu khong noi: cong thoi GIA DINH "khong doi duoc", va bat dau KIEM CHUNG luat
   * *doi cho chu khong xoa*. Ba ve duoi la ly do tin duoc dieu do — thieu ve nao thi ban va
   * chi la do trang tri. Ve 2 la ve quan trong nhat: no phan biet "co file luu tru" voi
   * "noi dung THAT SU con nguyen", va do la toan bo gia tri cua ban va nay. */
  const { cha, kho, at } = khoNen();
  try {
    const CU = Array.from({ length: 12 }, (_, i) => `luot cu so ${i + 1} — chu phai giu nguyen`);
    const nhatKy = (dong) => dong.join(NL) + NL;

    // Nen: HANDOFF.md day du, da day len remote. Day la MOC de so.
    writeFileSync(join(kho, "HANDOFF.md"), nhatKy(["# HANDOFF", "", ...CU]), "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "nhat ky day du" + NL + NL + "Lane: thu");
    at("push", "-q", "origin", "main");

    // Cham mot file ngoai HANDOFF, neu khong thi phep kiem khong co viec gi de soi.
    const chamViec = () => writeFileSync(join(kho, "docs", "a.md"), "# a" + NL + Math.random() + NL, "utf8");

    // Cat 10 luot cu, ghi Log moi. GIONG NHAU o ca ba ve — chi khac cai kho luu tru.
    const catVaGhiLog = () => {
      writeFileSync(join(kho, "HANDOFF.md"), nhatKy(["# HANDOFF", "", ...CU.slice(10), "", "## luot moi — Log cua phien nay"]), "utf8");
      chamViec();
    };

    // --- VE 1: xoa ma KHONG co kho luu tru nao -> phai DO ---
    catVaGhiLog();
    at("add", "-A");
    at("commit", "-q", "-m", "cat nhat ky, khong luu tru" + NL + NL + "Lane: thu");
    let m = docMuc(kho, "HANDOFF đã ghi Log phiên này");
    assert.equal(m.trangThai, "ĐỎ",
      `xoa dong ma khong co ban luu tru phai DO, dang: ${m.trangThai} — ${m.chiTiet}`);
    assert.match(m.chiTiet, /kho lưu trữ/,
      "loi nhan phai chi dung cho phai sua (kho luu tru), khong noi chung chung");

    // --- VE 2 (QUAN TRONG NHAT): co file luu tru nhung LECH MOT KY TU -> van phai DO ---
    // Khong co ve nay thi phep kiem chi do "co ton tai mot file trong archive/", tuc bat ky ai
    // cung qua duoc bang cach tao mot file rong — dung loai phep kiem khong phan biet duoc hai
    // nhanh ma luat vang so 2 goi la do trang tri.
    mkdirSync(join(kho, "docs", "archive"), { recursive: true });
    writeFileSync(join(kho, "docs", "archive", "cu.md"),
      nhatKy(CU.slice(0, 10).map((d, i) => i === 3 ? d.replace("chu", "chU") : d)), "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "luu tru lech mot ky tu" + NL + NL + "Lane: thu");
    m = docMuc(kho, "HANDOFF đã ghi Log phiên này");
    assert.equal(m.trangThai, "ĐỎ",
      `ban luu tru lech MOT KY TU phai van DO, dang: ${m.trangThai} — ${m.chiTiet}`);

    // --- VE 3: ban luu tru KHOP BYTE -> XANH ---
    writeFileSync(join(kho, "docs", "archive", "cu.md"), nhatKy(CU.slice(0, 10)), "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "luu tru khop byte" + NL + NL + "Lane: thu");
    m = docMuc(kho, "HANDOFF đã ghi Log phiên này");
    assert.equal(m.trangThai, "XANH",
      `doi cho co doi chieu khop byte phai XANH, dang: ${m.trangThai} — ${m.chiTiet}`);
    assert.match(m.chiTiet, /DỜI/,
      "phai NOI RO la da doi cho, de nguoi doc biet cong da kiem chuyen do chu khong bo qua");

    // --- VE 4: luat cu VAN CON RANG. Sua mot dong CU (co that tren MOC) tai cho -> DO ---
    // Ban va KHUNG-25 khong duoc lam mat phep kiem goc: viet lai lich su van phai bi chan.
    // Phai sua mot dong CON NAM TRONG file va CO TREN MOC. Ban dau toi sua dong Log vua them
    // trong luot nay — dong do khong co tren MOC nen no la dong MOI ca truoc lan sau, va phep
    // kiem xanh DUNG. Ca kiem sai, khong phai code sai. Ghi lai vi bay nay de mac lai.
    const CU_SUA = [...CU.slice(10)];
    CU_SUA[0] = CU_SUA[0].replace("giu nguyen", "DA BI SUA");
    writeFileSync(join(kho, "HANDOFF.md"),
      nhatKy(["# HANDOFF", "", ...CU_SUA, "", "## luot moi — Log cua phien nay", "", "## luot moi hon"]), "utf8");
    chamViec();
    at("add", "-A");
    at("commit", "-q", "-m", "sua dong cu tai cho" + NL + NL + "Lane: thu");
    m = docMuc(kho, "HANDOFF đã ghi Log phiên này");
    assert.equal(m.trangThai, "ĐỎ",
      `sua dong CU tai cho van phai DO — ban va KHUNG-25 khong duoc lam mat phep kiem goc, dang: ${m.chiTiet}`);

    // --- VE 5: xoa ma KHONG them dong nao -> DO, va noi DUNG ly do do ---
    // Hai ly do do khac nhau phai cho ra hai loi nhan khac nhau, neu khong nguoi doc di sua
    // nham cho: mot ben la "chua ghi Log", mot ben la "xoa mat chu".
    writeFileSync(join(kho, "HANDOFF.md"), nhatKy(["# HANDOFF", "", ...CU.slice(10)]), "utf8");
    chamViec();
    at("add", "-A");
    at("commit", "-q", "-m", "xoa sach khong them gi" + NL + NL + "Lane: thu");
    m = docMuc(kho, "HANDOFF đã ghi Log phiên này");
    assert.equal(m.trangThai, "ĐỎ", `khong them dong nao phai DO, dang: ${m.chiTiet}`);
    assert.match(m.chiTiet, /KHÔNG thêm dòng nào/,
      "phai noi dung ly do: chua ghi Log — khac han ly do 'xoa mat chu'");

    // --- VE 6: DONG DICH CHO TRONG CUNG FILE KHONG PHAI DONG BI XOA ---
    // `git diff` in ra mot cap `-`/`+` cho mot dong chi doi vi tri, va ban dau cua ban va
    // KHUNG-25 doc cai `-` do roi ket luan "mat chu". Do that 06/09, luot don dau tien:
    // dong tro sang kho luu tru bi day tu giua file len dau file -> cong DO OAN dung dong do.
    // Mot cong bat oan cung nguy hiem nhu mot cong bo sot: nguoi ta hoc cach bo qua no.
    const DICH = "> dong nay se bi day len dau file";
    writeFileSync(join(kho, "HANDOFF.md"),
      nhatKy(["# HANDOFF", "", DICH, "", ...CU.slice(10), "", "## luot moi", "", "## luot moi hon"]), "utf8");
    chamViec();
    at("add", "-A");
    at("commit", "-q", "-m", "nen co dong se dich cho" + NL + NL + "Lane: thu");
    at("push", "-q", "origin", "main");

    // Day dong do xuong cuoi + them mot muc Log moi. Dong KHONG mat, chi doi cho.
    writeFileSync(join(kho, "HANDOFF.md"),
      nhatKy(["# HANDOFF", "", ...CU.slice(10), "", "## luot moi", "", "## luot moi hon", "", "## luot moi nhat", "", DICH]), "utf8");
    chamViec();
    at("add", "-A");
    at("commit", "-q", "-m", "dich cho mot dong" + NL + NL + "Lane: thu");
    m = docMuc(kho, "HANDOFF đã ghi Log phiên này");
    assert.equal(m.trangThai, "XANH",
      `dong DICH CHO trong cung file KHONG phai dong bi xoa — cong khong duoc bat oan, dang: ${m.chiTiet}`);

    // VE DOI CHUNG: xoa HAN dong do di (khong con o dau ca) thi VAN phai DO.
    writeFileSync(join(kho, "HANDOFF.md"),
      nhatKy(["# HANDOFF", "", ...CU.slice(10), "", "## luot moi", "", "## luot moi hon", "", "## luot moi nhat", "", "## luot cuoi"]), "utf8");
    chamViec();
    at("add", "-A");
    at("commit", "-q", "-m", "xoa han dong do" + NL + NL + "Lane: thu");
    m = docMuc(kho, "HANDOFF đã ghi Log phiên này");
    assert.equal(m.trangThai, "ĐỎ",
      `xoa HAN mot dong (khong con trong file, khong co trong kho) VAN phai DO, dang: ${m.chiTiet}`);
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("9 · dời nhật ký sang kho lưu trữ: khớp byte XANH · lệch một ký tự ĐỎ · sửa dòng cũ ĐỎ · dịch chỗ KHÔNG bắt oan");
}


console.log(`${NL}${passed} passed, 0 failed, ${passed} total`);
