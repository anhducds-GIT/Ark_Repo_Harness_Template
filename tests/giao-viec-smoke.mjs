/* GIAO-VIEC — phép kiểm phá.
 *
 * Điều đáng canh nhất KHÔNG phải "có in ra đề bài không" (in thì dễ), mà là **có DỪNG đúng chỗ
 * không**. Một lệnh giao việc luôn in ra một đề bài trông tử tế là thứ nguy hiểm nhất trong cả
 * bộ khung: phiên nhận việc tin nó, làm theo, và hỏng ở repo NGƯỜI KHÁC.
 *
 * Nên mỗi vế dưới đây dựng một repo thật, phá đúng MỘT thứ, rồi đòi đúng chỗ ấy chặn.
 */

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chuVung, doRepo, duongDanBan, ghepDeBai, trongVungBoKhung, VIEC } from "../scripts/giao-viec.mjs";

let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };
const NL = String.fromCharCode(10);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rac = [];

/* Một kho git thật, tối thiểu. Không giả lập `git` bằng hàm: cả giá trị của lệnh này nằm ở chỗ
 * nó đọc trạng thái git THẬT, nên phép kiểm cũng phải chạy trên git thật. */
function dungKho({ lock = null, claims = null, bay = [] } = {}) {
  const root = mkdtempSync(join(tmpdir(), "giaoviec-"));
  rac.push(root);
  const g = (...a) => execFileSync("git", a, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  g("init", "-q", "-b", "main");
  g("config", "user.email", "t@t");
  g("config", "user.name", "t");
  writeFileSync(join(root, "README.md"), "x" + NL, "utf8");
  if (lock) {
    mkdirSync(join(root, ".ark"), { recursive: true });
    writeFileSync(join(root, ".ark", "harness.lock.json"), JSON.stringify({ version: lock }), "utf8");
  }
  if (claims !== null) {
    mkdirSync(join(root, ".agents"), { recursive: true });
    writeFileSync(join(root, ".agents", "claims.json"), claims, "utf8");
  }
  g("add", "-A");
  g("commit", "-q", "-m", "goc");
  for (const rel of bay) {
    mkdirSync(join(root, dirname(rel)), { recursive: true });
    writeFileSync(join(root, rel), "dang lam do" + NL, "utf8");
  }
  return root;
}

const CLAIMS = (owner) => JSON.stringify({
  _doc: "bo qua",
  _labels: "bo qua",
  claims: { _root: { owner, task: "viec gi do" }, _code: { owner: null } }
});

/* ---- 1. Vùng bộ khung: khớp TIỀN TỐ phải là tiền tố THƯ MỤC -------------- */
{
  // Bẫy kinh điển: `startsWith("docs")` nuốt luôn `docsy/`. Nhầm chiều nào cũng hỏng —
  // kể thừa thì phiên bị dừng oan, kể thiếu thì nó ghi đè việc dở của người khác.
  assert.equal(trongVungBoKhung("docs/x.md"), true);
  assert.equal(trongVungBoKhung("scripts/a/b.mjs"), true);
  assert.equal(trongVungBoKhung("package.json"), true);
  assert.equal(trongVungBoKhung("docsy/x.md"), false, "docsy/ KHÔNG phải docs/");
  assert.equal(trongVungBoKhung("src/package.json"), false, "khớp đúng file gốc, không khớp trùng tên ở sâu");
  assert.equal(trongVungBoKhung("dashboard/state.js"), false);
  assert.equal(trongVungBoKhung("scripts\\win\\a.mjs"), true, "đường dẫn kiểu Windows vẫn phải nhận ra");
  ok("vùng bộ khung khớp tiền tố thư mục, không khớp chuỗi trần");
}

/* ---- 2. Đọc porcelain: dạng đổi tên lấy vế MỚI --------------------------- */
{
  // `R  cu -> moi` mà lấy vế CŨ thì danh sách "được phép stage" trỏ vào một file không còn tồn
  // tại, và file thật thì không ai canh.
  const ra = duongDanBan([
    " M docs/a.md",
    "?? dashboard/b.js",
    "R  docs/cu.md -> docs/moi.md",
    "",
    'A  "ten co dau.md"'
  ].join(NL));
  assert.deepEqual(ra, ["docs/a.md", "dashboard/b.js", "docs/moi.md", "ten co dau.md"]);
  ok("porcelain: đổi tên lấy vế mới, bỏ nháy, bỏ dòng rỗng");
}

/* ---- 3. Bảng quyền hỏng KHÁC bảng quyền trống ---------------------------- */
{
  assert.equal(chuVung("{ khong phai json"), null, "JSON hỏng phải là null, không phải mảng rỗng");
  assert.equal(chuVung('{"claims": 5}'), null, "claims không phải object cũng là null");
  const ds = chuVung(CLAIMS("ai-khac"));
  assert.deepEqual(ds.map((c) => c.khoa), ["_root", "_code"], "bỏ qua khoá chú thích _doc/_labels");
  assert.equal(ds[0].owner, "ai-khac");
  assert.equal(ds[1].owner, null);
  ok("bảng quyền: hỏng → null, và null khác rỗng");
}

/* ---- 4. File sửa dở TRONG vùng thì CHẶN, NGOÀI vùng thì CẢNH BÁO --------- */
{
  // Đây là lỗi thật của lượt giao đầu tiên (06/09): đề bài dạy `git add -A` trong khi repo đích
  // có ba file sửa dở của phiên khác.
  const trong = dungKho({ lock: "1.0.0", claims: CLAIMS(null), bay: ["docs/dang-viet.md"] });
  const a = doRepo(trong, { viec: "nang", as: "toi", banNha: "1.3.13" });
  assert.ok(a.chan.some((c) => c.startsWith("FILE_SUA_DO_TRONG_VUNG")), "sửa dở TRONG vùng phải CHẶN");

  const ngoai = dungKho({ lock: "1.0.0", claims: CLAIMS(null), bay: ["dashboard/state.js"] });
  const b = doRepo(ngoai, { viec: "nang", as: "toi", banNha: "1.3.13" });
  assert.deepEqual(b.chan, [], "sửa dở NGOÀI vùng thì không chặn");
  const w = b.canh.join(NL);
  assert.ok(w.includes("không `git add -A`"), "phải cấm git add -A");
  assert.ok(w.includes("dashboard/state.js"), "phải NÊU TÊN file, không chỉ nói chung chung");
  ok("sửa dở: trong vùng CHẶN · ngoài vùng cảnh báo và nêu đích danh");
}

/* ---- 5. Vùng người khác đang giữ thì CHẶN, mình giữ thì không ------------ */
{
  const r = dungKho({ lock: "1.0.0", claims: CLAIMS("phien-khac") });
  const a = doRepo(r, { viec: "nang", as: "toi", banNha: "1.3.13" });
  assert.ok(a.chan.some((c) => c.startsWith("VUNG_CO_CHU_KHAC")), "vùng người khác giữ phải CHẶN");
  assert.ok(a.chan.join(NL).includes("phien-khac"), "phải nói RÕ ai đang giữ");

  const b = doRepo(r, { viec: "nang", as: "phien-khac", banNha: "1.3.13" });
  assert.deepEqual(b.chan, [], "chính mình đang giữ thì đi tiếp được");

  // Lượt audit CHỈ ĐỌC — không được chặn vì bảng quyền, vì nó không định ghi gì.
  const c = doRepo(r, { viec: "audit", as: "toi" });
  assert.deepEqual(c.chan, [], "audit chỉ đọc thì bảng quyền không chặn");

  // Lượt chỉ đọc không commit gì — cảnh báo `git add -A` ở đó là nhiễu, và nhiễu làm người ta
  // thôi đọc cảnh báo thật.
  const d = doRepo(dungKho({ claims: CLAIMS(null), bay: ["dashboard/state.js"] }), { viec: "audit", as: "toi" });
  assert.ok(!d.canh.join(NL).includes("git add -A"), "audit không được cảnh báo về git add");
  ok("bảng quyền: chặn đúng người, và không chặn lượt chỉ đọc");
}

/* ---- 6. `nang` mà chưa ghim bản khung thì CHẶN --------------------------- */
{
  // Không có sổ ghim = repo chưa lắp bộ khung. Nâng một thứ chưa lắp là thả file bừa vào.
  const r = dungKho({ lock: null, claims: CLAIMS(null) });
  const a = doRepo(r, { viec: "nang", as: "toi", banNha: "1.3.13" });
  assert.ok(a.chan.some((c) => c.startsWith("CHUA_GHIM_BAN_KHUNG")));
  assert.ok(a.chan.join(NL).includes("--viec migrate"), "phải chỉ ra lối đi đúng, không chỉ báo lỗi");

  // Ngược lại: migrate một repo ĐÃ ghim thì không chặn, chỉ cảnh báo.
  const r2 = dungKho({ lock: "1.2.0", claims: CLAIMS(null) });
  const b = doRepo(r2, { viec: "migrate", as: "toi", banNha: "1.3.13" });
  assert.deepEqual(b.chan, []);
  assert.ok(b.canh.join(NL).includes("1.2.0"), "đã ghim rồi thì phải nói bản nào");
  ok("sổ ghim: nâng khi chưa ghim thì CHẶN, migrate khi đã ghim thì cảnh báo");
}

/* ---- 7. Không phải kho git thì CHẶN, và nói đúng lý do ------------------- */
{
  const trong = mkdtempSync(join(tmpdir(), "giaoviec-khonggit-"));
  rac.push(trong);
  const a = doRepo(trong, { viec: "audit", as: "toi" });
  assert.ok(a.chan.some((c) => c.startsWith("KHONG_PHAI_KHO_GIT")));
  // Đây là một trong ba giới hạn đo được của `codex exec`. Báo lỗi mà không nhắc nó thì người
  // giao việc lại vấp lần nữa.
  assert.ok(a.chan.join(NL).includes("codex exec"), "phải nhắc giới hạn thật của codex");

  const b = doRepo(join(trong, "khong-ton-tai"), { viec: "audit", as: "toi" });
  assert.ok(b.chan.some((c) => c.startsWith("KHONG_TIM_THAY_REPO")));
  ok("không phải kho git / không có thư mục → CHẶN, kèm lý do dùng được");
}

/* ---- 8. CHẶN thì KHÔNG in đề bài — đo ở tầng lệnh ------------------------ */
{
  // Vế 4–7 đo hàm. Vế này đo cái người ta thật sự chạy: chặn rồi thì stdout phải RỖNG.
  // Thiếu vế này thì `main()` có thể in đề bài kèm một dòng cảnh báo ở stderr, và người dùng
  // `> de-bai.txt` sẽ có một đề bài sai trông hoàn toàn bình thường.
  const chay = (repo, viec) => spawnSync(process.execPath,
    [join(ROOT, "scripts", "giao-viec.mjs"), "--viec", viec, "--repo", repo, "--as", "toi"],
    { cwd: ROOT, encoding: "utf8" });

  const hong = chay(dungKho({ lock: null, claims: CLAIMS(null) }), "nang");
  assert.notEqual(hong.status, 0, "chặn thì phải thoát khác 0");
  assert.equal(hong.stdout, "", "CHẶN thì stdout phải RỖNG — không được in đề bài kèm cảnh báo");
  assert.ok(hong.stderr.includes("KHONG_GIAO_DUOC"));

  const chay0 = chay(dungKho({ lock: "1.2.0", claims: CLAIMS(null) }), "nang");
  assert.equal(chay0.status, 0, "đủ điều kiện thì phải in được: " + chay0.stderr.slice(0, 200));
  assert.ok(chay0.stdout.includes("## ĐO ĐƯỢC LÚC GIAO VIỆC"), "đề bài phải mở bằng khối đo được");
  ok("tầng lệnh: chặn → stdout rỗng · đủ điều kiện → in đề bài");
}

/* ---- 9. Đề bài ghép ra phải CÒN NGUYÊN những câu đã cứu được một lượt ---- */
{
  /* Ba câu dưới đây không phải chữ trang trí — mỗi câu ứng với một lần vấp thật, và lượt giao
   * cho Codex 06/09 đi qua được là nhờ chúng. Tách đề bài làm hai nửa (phần chung + phần việc)
   * làm cho việc cắt gọt trở nên dễ, nên phải có phép ghim: cắt mất một trong ba thì ĐỎ. */
  const chung = readFileSync(join(ROOT, "docs", "briefs", "GIAO-VIEC-CHUNG.md"), "utf8");
  for (const [viec, cf] of Object.entries(VIEC)) {
    const phanViec = readFileSync(join(ROOT, cf.doc), "utf8");
    const van = ghepDeBai({
      viec, repoAbs: "/x", as: "t", banNha: "9.9.9",
      dong: ["- **Nhánh:** `main`"], canh: [], chung, phanViec, ngay: "2026-01-01"
    });
    assert.ok(van.includes("Luật của chủ nhà THẮNG"), viec + ": mất luật ưu tiên của repo đích");
    assert.ok(van.includes("CÒN MỞ"), viec + ": mất mẫu báo cáo năm dòng");
    assert.ok(van.includes("KHÔNG dùng `git push` trần"), viec + ": mất luật cấm push trần");
    assert.ok(!van.startsWith("---"), viec + ": frontmatter phải bị bóc, không dán thẳng vào đề bài");
    assert.ok(van.includes(cf.nhan), viec + ": tiêu đề phải nói đúng loại việc");
  }
  ok("đề bài ghép: ba câu đã cứu một lượt vẫn còn, cả ba loại việc");
}

for (const d of rac) { try { rmSync(d, { recursive: true, force: true }); } catch { /* thư mục tạm */ } }
console.log(`giao-viec-smoke: ${passed} vế xanh`);
