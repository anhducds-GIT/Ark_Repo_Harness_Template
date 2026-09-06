/* CORE-CONTRACT — bảy chỗ hợp đồng lõi bị vỡ, mỗi chỗ một phép kiểm phá.
 *
 * Bảy khối này được viết TRƯỚC bản vá và đã chạy ĐỎ trên mã ngày 03/09. Đó là điều kiện để tin
 * chúng: một phép kiểm chưa từng đỏ thì chưa chứng minh được nó canh cái gì.
 *
 * Điểm chung của cả bảy: **bộ khung nói một đằng, làm một nẻo**. Bộ đo nói repo hoàn hảo trong
 * khi runtime ném; bảng vẽ vòng đời bằng những giá trị mà chính validator từ chối; lệnh git hỏng
 * và "không có dữ liệu" trông y như nhau. Không cái nào làm chương trình chết — nên không cái
 * nào tự lộ ra.
 */

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { readStructureFromDisk, unitsFrom, stewardOf, claimPrefixesFrom } from "../scripts/repo-structure.mjs";
import { danhGia, mucDo, cauHinhDocDuoc } from "../scripts/assess.mjs";
import { buildTemplateFiles } from "../scripts/build-template.mjs";
import { behaviourOptsFrom, isBehaviourFile, LIFECYCLES } from "../scripts/build-dashboard.mjs";
import { VONG_DOI } from "../scripts/build-overview.mjs";
import { blockingCodes, checkB10, createBootstrapDeps } from "../scripts/check-bootstrap.mjs";
import { behaviourGlobsFrom, kiemKhoaLa } from "../scripts/repo-structure.mjs";
import { readClaims } from "../scripts/claim.mjs";
import { nganSachTu, NGAN_SACH_MAC_DINH } from "../scripts/can-nang.mjs";
import { parseBacklog } from "../scripts/what-next.mjs";

const NL = String.fromCharCode(10);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };

const khoTam = () => mkdtempSync(join(tmpdir(), "core-contract-"));

/* ---- F1. Bộ đo phải dùng ĐÚNG validator mà runtime dùng ------------------- */
{
  // Đo được 03/09: cấu hình có `depth: 0`, `root_dir: ".."` và `ownership_mode` bậy vẫn được
  // chấm MỨC 3 · CHI PHÍ 0/0/0 — giấy khám sức khoẻ hoàn hảo — trong khi
  // `readStructureFromDisk()` NÉM ngay trên chính file đó.
  //
  // Đây là kiểu hỏng tệ nhất của một bộ đo: nó là thứ người ta dùng để QUYẾT ĐỊNH có migrate
  // hay không. Nói "hoàn hảo" về một repo không chạy nổi là làm hỏng chính quyết định đó.
  const root = khoTam();
  try {
    for (const [rel, noi] of buildTemplateFiles()) {
      mkdirSync(join(root, dirname(rel)), { recursive: true });
      writeFileSync(join(root, rel), noi, "utf8");
    }
    const p = join(root, ".repo-structure.json");
    const j = JSON.parse(readFileSync(p, "utf8"));
    j.units.depth = 0;
    writeFileSync(p, JSON.stringify(j, null, 2), "utf8");

    // Runtime từ chối — đây là sự thật nền, khối này vô nghĩa nếu vế đó không đúng.
    // Chú ý: `readStructureFromDisk` KHÔNG validate — nó chỉ đọc. Validator thật nằm ở
    // `unitsFrom()`, và đó chính là lý do bộ đo trượt: nó dừng ở bước đọc.
    assert.throws(() => unitsFrom(readStructureFromDisk(root)), /UNITS_HONG|CAU_TRUC_HONG/,
      "doi chung: runtime PHAI nem tren cau hinh nay");

    const hong = cauHinhDocDuoc(root);
    assert.ok(hong.length > 0, "bo do phai bao cau hinh nay la HONG, khong duoc im lang");
    assert.notEqual(mucDo(danhGia(root, buildTemplateFiles()), hong).muc, 3,
      "cau hinh runtime tu choi thi KHONG duoc cham muc 3 — bo do va runtime phai noi cung mot cau");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("F1 · bộ đo dùng đúng validator của runtime (không còn chấm mức 3 cho cấu hình runtime từ chối)");
}

/* ---- F2. Đo được code KHÔNG phải JavaScript ------------------------------ */
{
  // `isBehaviourFile` chỉ nhận .js .mjs .json .html .css. Repo Python có `src/app.py` sửa cả
  // trăm lần vẫn bị đo là "code không đổi" — và repo 3AI migrate ngày 03/09 CHÍNH LÀ repo Python.
  // Một bộ khung tự nhận là dùng chung mà chỉ đo được một nghề thì con số của nó vô nghĩa ở
  // mọi nghề khác, trong khi bảng vẫn in ra đẹp.
  assert.equal(isBehaviourFile("src/app.py", { behaviourGlobs: ["**/*.py"] }), true,
    "khai behaviour_globs cho Python thi file .py phai duoc tinh la code");
  assert.equal(isBehaviourFile("src/app.py"), false,
    "doi chung: khong khai gi thi giu nguyen hanh vi cu (chi JS), khong tu doan");
  assert.equal(isBehaviourFile("app/main.js"), true, "mac dinh JS phai van chay");
  ok("F2 · đo được code ngoài JavaScript khi repo khai behaviour_globs");
}

/* ---- F3. Vòng đời chỉ có MỘT bảng giá trị -------------------------------- */
{
  // Đo được 03/09: validator nhận idea/building/active/paused/archived/experimental/superseded,
  // còn bảng tổng quan vẽ vòng đời bằng idea/building/**proven**/paused/**retired**.
  // `proven` và `retired` KHÔNG hợp lệ với validator — tức bảng vẽ hai chặng mà không repo nào
  // hợp luật có thể đứng vào; và bốn giá trị hợp lệ thì không có chặng nào.
  for (const gt of Object.keys(VONG_DOI)) {
    assert.ok(LIFECYCLES.has(gt),
      `vong doi ve chang "${gt}" nhung validator TU CHOI gia tri do — hai bang phai la mot`);
  }
  for (const gt of LIFECYCLES) {
    assert.ok(Object.hasOwn(VONG_DOI, gt),
      `validator nhan "${gt}" nhung vong doi khong co chang nao — repo hop luat se roi ra ngoai bang`);
  }
  ok("F3 · vòng đời và validator dùng chung một bảng giá trị");
}

/* ---- F4. Lệnh git HỎNG không được trông như "không có dữ liệu" ----------- */
{
  // `const git = (...) => { try {...} catch { return ""; } }` biến MỌI lỗi thành chuỗi rỗng.
  // Trên một repo lớn, output vượt buffer cũng cho chuỗi rỗng — và lúc đó cổng đọc ra
  // "0 file được track · 0 thay đổi · 0 file cần test · secret 0/0 sạch". Toàn xanh, vì mù.
  const root = khoTam();
  try {
    // KHÔNG `git init` — mọi lệnh git ở đây đều phải hỏng.
    // PHẢI CHÉP SCRIPT SANG, không chỉ đổi cwd: `session-check.mjs` suy gốc repo từ VỊ TRÍ FILE
    // CỦA CHÍNH NÓ. Chạy bản ở repo nhà thì nó đo repo nhà, và phép kiểm này xanh vô nghĩa —
    // đúng cái bẫy đã ghi ở khối 1 của suite hạt giống.
    mkdirSync(join(root, "scripts"), { recursive: true });
    mkdirSync(join(root, ".agents"), { recursive: true });
    for (const f of ["session-check.mjs", "repo-structure.mjs", "claim.mjs", "check-bootstrap.mjs", "build-dashboard.mjs"]) {
      cpSync(join(ROOT, "scripts", f), join(root, "scripts", f));
    }
    cpSync(join(ROOT, ".repo-structure.json"), join(root, ".repo-structure.json"));
    writeFileSync(join(root, ".agents", "claims.json"), JSON.stringify({ claims: {} }), "utf8");
    const ra = execFileSync(process.execPath,
      [join(root, "scripts", "session-check.mjs"), "--as", "thu"],
      { cwd: root, encoding: "utf8" }).toString();
    assert.doesNotMatch(ra, /XANH TOÀN BỘ/,
      "khong phai repo git ma cong bao XANH TOAN BO la fail-open");
  } catch (e) {
    const ra = String(e.stdout || "") + String(e.stderr || "");
    assert.doesNotMatch(ra, /XANH TOÀN BỘ/, "khong phai repo git thi khong duoc bao xanh");
    assert.match(ra, /GIT_HONG|không phải kho git|not a git repository/i,
      "phai noi ro la LENH GIT HONG, khong duoc im lang coi nhu khong co du lieu");
  }
  ok("F4 · lệnh git hỏng bị nói ra, không hoá thành số 0");
}

/* ---- F5. Quy chủ KHÔNG được phụ thuộc thứ tự khai ------------------------ */
{
  // `stewardOf` trả về area khớp ĐẦU TIÊN theo thứ tự khoá JSON. Khai `docs/` và `docs/internal/`
  // thì chủ của `docs/internal/a.md` đổi theo thứ tự gõ hai dòng — một thứ vô hình hoàn toàn
  // với người viết cấu hình.
  const A = { areas: { "docs/": { steward: "_docs" }, "docs/internal/": { steward: "_code" } } };
  const B = { areas: { "docs/internal/": { steward: "_code" }, "docs/": { steward: "_docs" } } };
  const f = "docs/internal/a.md";
  assert.equal(stewardOf(f, A, claimPrefixesFrom(A)), stewardOf(f, B, claimPrefixesFrom(B)),
    "doi thu tu khai hai vung long nhau KHONG duoc doi chu so huu");
  assert.equal(stewardOf(f, A, claimPrefixesFrom(A)), "_code",
    "vung CU THE HON phai thang (longest prefix), khong phai vung khai truoc");
  ok("F5 · quy chủ theo tiền tố dài nhất, không theo thứ tự khai");
}

/* ---- F6. ADR đã Accepted: xoá và đổi tên cũng là vi phạm ----------------- */
{
  // B12 chỉ soi ADR CÒN Ở HEAD. Nên xoá hẳn một ADR đã Accepted là thoát sạch — đúng hành vi
  // mà "ADR Accepted là bất biến" hứa sẽ chặn. Đổi tên cũng thoát, vì `git log` thiếu `--follow`.
  const root = khoTam();
  try {
    const g = (...a) => execFileSync("git", a, { cwd: root, encoding: "utf8" });
    g("init", "-q", "-b", "main"); g("config", "user.name", "t"); g("config", "user.email", "t@e.invalid");
    mkdirSync(join(root, "docs", "adr"), { recursive: true });
    const adr = join(root, "docs", "adr", "0001-thu.md");
    writeFileSync(adr, "---\nstatus: Accepted\n---\n\nThân bài gốc.\n", "utf8");
    g("add", "-A"); g("commit", "-q", "-m", "them adr");
    writeFileSync(join(root, "khac.txt"), "x", "utf8");
    g("add", "-A"); g("commit", "-q", "-m", "hai");
    rmSync(adr);
    g("add", "-A"); g("commit", "-q", "-m", "xoa adr accepted");

    const { checkB12 } = await import("../scripts/check-bootstrap.mjs");
    const git = (...a) => { try { return execFileSync("git", a, { cwd: root, encoding: "utf8" }); } catch { return ""; } };
    const deps = {
      git: {
        trackedPaths: () => git("ls-files").split("\n").filter(Boolean),
        fileHistory: (p) => git("log", "--reverse", "--format=%H", "--follow", "--", p).split("\n").filter(Boolean),
        showAt: (sha, p) => { try { return execFileSync("git", ["show", `${sha}:${p}`], { cwd: root, encoding: "utf8" }); } catch { return null; } },
        deletedPaths: () => git("log", "--diff-filter=D", "--name-only", "--format=").split("\n").filter(Boolean)
      },
      fileExists: () => false,
      readFile: () => ""
    };
    const kq = checkB12(deps);
    assert.equal(kq.state, "fail",
      "xoa mot ADR da Accepted PHAI la vi pham — bat bien nghia la khong duoc bien mat");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("F6 · xoá một ADR đã Accepted bị bắt");
}

/* ---- F7. Nhận vùng phải ATOMIC ------------------------------------------- */
{
  // `claim.mjs` là đọc → sửa → ghi → đọc lại. Hai tiến trình cùng thấy vùng trống, cả hai cùng
  // ghi, cả hai đọc lại thấy tên MÌNH nếu đọc trước khi đối phương ghi — cả hai thoát 0 và cùng
  // tin là mình có quyền. Read-back không đóng được cửa sổ đó.
  const root = khoTam();
  try {
    mkdirSync(join(root, "scripts"), { recursive: true });
    mkdirSync(join(root, ".agents"), { recursive: true });
    for (const f of ["claim.mjs", "repo-structure.mjs"]) {
      cpSync(join(ROOT, "scripts", f), join(root, "scripts", f));
    }
    cpSync(join(ROOT, ".repo-structure.json"), join(root, ".repo-structure.json"));
    writeFileSync(join(root, ".agents", "claims.json"),
      JSON.stringify({ claims: { _root: { owner: null, released_at: null } } }, null, 2), "utf8");

    const nhan = (as) => {
      try {
        execFileSync(process.execPath, [join(root, "scripts", "claim.mjs"), "--take", "_root", "--as", as, "--task", "t"],
          { cwd: root, encoding: "utf8" });
        return true;
      } catch { return false; }
    };
    assert.equal(nhan("phien-A"), true, "phien dau tien phai nhan duoc");
    assert.equal(nhan("phien-B"), false,
      "vung DA CO CHU thi phien thu hai PHAI bi tu choi — mot vung mot chu");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("F7 · vùng đã có chủ thì phiên sau bị từ chối");
}

/* ---- F8. Bảng quyền phải ghi ĐÚNG AI, và không tự quên ------------------- */
{
  // Trường `ai` từng bị đóng cứng là "Claude", nên mọi lượt nhận của Codex và Antigravity đều bị
  // ghi sai. Bỏ hardcode xong lại lộ ra ca thứ hai: chạy lại lệnh để đổi mỗi câu `--task` mà
  // không khai `--ai` thì tên AI đã biết bị xoá — một lệnh trông vô hại mà làm mất dữ liệu.
  const root = khoTam();
  try {
    mkdirSync(join(root, "scripts"), { recursive: true });
    mkdirSync(join(root, ".agents"), { recursive: true });
    for (const f of ["claim.mjs", "repo-structure.mjs"]) {
      cpSync(join(ROOT, "scripts", f), join(root, "scripts", f));
    }
    cpSync(join(ROOT, ".repo-structure.json"), join(root, ".repo-structure.json"));
    const bang = join(root, ".agents", "claims.json");
    writeFileSync(bang, JSON.stringify({ claims: { _root: { owner: null, released_at: null } } }, null, 2), "utf8");

    const chay = (...co) => execFileSync(process.execPath,
      [join(root, "scripts", "claim.mjs"), ...co], { cwd: root, encoding: "utf8" });
    const doc = () => JSON.parse(readFileSync(bang, "utf8")).claims._root;

    chay("--take", "_root", "--as", "codex-s1", "--task", "t", "--ai", "Codex");
    assert.equal(doc().ai, "Codex", "khai --ai Codex thi phai ghi dung Codex, khong phai Claude");

    chay("--take", "_root", "--as", "codex-s1", "--task", "doi cau task thoi");
    assert.equal(doc().ai, "Codex", "chay lai chinh minh ma khong khai --ai thi PHAI giu ten cu");

    chay("--release", "_root", "--as", "codex-s1");
    assert.equal(doc().ai, null, "tra quyen thi xoa ten AI — vung trong khong thuoc AI nao");

    chay("--take", "_root", "--as", "phien-khac", "--task", "t");
    assert.equal(doc().ai, null, "phien khac khong khai thi de trong: thieu thong tin con hon thong tin sai");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("F8 · bảng quyền ghi đúng AI, giữ khi chạy lại, và không đoán cho phiên khác");
}

/* ---- F9. Cong cau truc phai co RANG, khong chi co giong ------------------ */
{
  // `check-bootstrap` chi thoat khac 0 khi mot phep kiem nam trong `bootstrap.blocking` bi do.
  // Danh sach do de RONG o repo nha, nen B1-B15 co the in DO day man hinh ma lenh van thoat 0 —
  // va CI, von chi doc ma thoat, van xanh. Bat "required status check" tren GitHub KHONG sua
  // duoc chuyen nay: nut do cuong che mot ket qua, ma ket qua dang la xanh.
  //
  // Hai ve, va can ca hai: cau hinh repo nha co bat that khong, va co che co rang that khong.
  const CHAN = ["B1", "B2", "B3", "B4", "B5", "B7", "B10", "B12"];
  const dangChan = [...blockingCodes(createBootstrapDeps(ROOT))];
  assert.deepEqual(dangChan.sort(), [...CHAN].sort(),
    "repo nha PHAI bat dung tam ma chan — danh sach rong nghia la CI khong the do vi cau truc");

  // Ve hai: dung mot repo that, lam do B3, va xem lenh co thoat khac 0 khong. Khong co ve nay
  // thi ve tren chi chung minh mot dong JSON, khong chung minh no co tac dung gi.
  const cha = mkdtempSync(join(tmpdir(), "chan-b3-"));
  const repo = join(cha, "repo");
  try {
    execFileSync(process.execPath, [join(ROOT, "scripts", "init-repo.mjs"), repo, "--ten", "Thu Chan"],
      { cwd: cha, encoding: "utf8" });

    const capCau = (danhSach) => {
      const f = join(repo, ".repo-structure.json");
      const j = JSON.parse(readFileSync(f, "utf8"));
      j.bootstrap.blocking = danhSach;
      writeFileSync(f, JSON.stringify(j, null, 2) + NL, "utf8");
      // PHAI COMMIT. `createBootstrapDeps` doc cau hinh tu HEAD, khong tu cay lam viec — do la
      // luat "bo sinh doc su that da commit" cua ca bo khung. Sua file roi chay ngay la do lai
      // ban cu, va phep kiem se xanh vi nhin nham cho.
      git("add", "-A");
      git("commit", "-q", "--allow-empty", "-m", "doi danh sach chan" + NL + NL + "Lane: fixture");
    };
    const chay = () => spawnSync(process.execPath, [join(repo, "scripts", "check-bootstrap.mjs")],
      { cwd: repo, encoding: "utf8" }).status;
    const git = (...a) => execFileSync("git", a, { cwd: repo, encoding: "utf8" });

    // Thu muc top-level khong khai trong `areas` — dung thu B3 canh.
    mkdirSync(join(repo, "mot-thu-muc-la"), { recursive: true });
    writeFileSync(join(repo, "mot-thu-muc-la", "gi-do.md"), "# chua khai vao areas" + NL, "utf8");
    git("add", "-A");
    git("commit", "-q", "-m", "them thu muc chua khai" + NL + NL + "Lane: fixture");

    capCau([]);
    assert.equal(chay(), 0, "danh sach chan RONG: B3 do ma lenh van thoat 0 — day la cai bay");
    capCau(["B3"]);
    assert.notEqual(chay(), 0, "B3 nam trong danh sach chan ma van thoat 0 thi co che khong co rang");
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("F9 · cong cau truc co rang: B3 do lam lenh thoat khac 0 khi duoc khai chan");
}


/* ---- F10. Phep kiem khong duoc doi sua file ma repo CAM sua --------------- */
{
  // B10 quet MOI CLAUDE.md duoc track, ke ca file nam trong mot vung khai `append-only`. Do that
  // 04/09 o repo 3AI: 29/63 phat hien cua B10 nam trong mot goi phat hanh DA NIEM PHONG
  // (FROZEN_CANDIDATE.md + SHA256SUMS.txt) — "don" chung la pha niem phong.
  //
  // Mot phep kiem doi ban SUA mot file ma repo CAM sua thi no khong bao gio thoa duoc. Va luat
  // nao khong thoa duoc thi som muon cung bi bo qua ca cum — do la cach mot cong kiem chet.
  const luat = "## Luat\n- mot dong luat rieng khong co trong AGENTS.md, du dai de bi tinh\n";
  const deps = (mutability) => ({
    fileExists: (p) => ["CLAUDE.md", "AGENTS.md", "kho/CLAUDE.md", "kho/AGENTS.md", ".repo-structure.json"].includes(p),
    readFile: (p) => {
      if (p === ".repo-structure.json") return JSON.stringify({ areas: { "kho/": { steward: "_root", mutability } } });
      if (p.endsWith("CLAUDE.md")) return luat;
      return "# AGENTS\nkhong co dong luat kia\n";
    },
    git: { trackedPaths: () => ["CLAUDE.md", "kho/CLAUDE.md"] }
  });

  // Doi chung duong: vung `rw` thi VAN phai bat — bo qua tuot la lam yeu phep kiem, khong phai sua.
  const rw = checkB10(deps("rw"));
  const soRw = rw.findings.filter((f) => f.where.startsWith("kho/")).length;
  assert.ok(soRw > 0, "vung rw thi B10 VAN phai soi — bo qua tuot la lam yeu lop bao ve");

  const ao = checkB10(deps("append-only"));
  assert.equal(ao.findings.filter((f) => f.where.startsWith("kho/")).length, 0,
    "vung chi-them thi khong duoc doi sua noi dung file trong do");
  assert.ok(ao.findings.some((f) => f.where.startsWith("CLAUDE.md")),
    "file NGOAI vung chi-them thi van phai bi bat — khong duoc bo qua ca luot");
  assert.match(String(ao.note ?? ""), /bỏ qua/, "phai NOI RA la da bo qua may file, khong im lang");
  ok("F10 · phép kiểm bỏ qua vùng chỉ-thêm, và nói ra — nhưng vùng rw thì vẫn soi");
}

/* ---- F11. Gianh vung: doi cau chot, va tu choi khi vung con viec do ------ */
{
  // Truoc day lenh CHI biet tu choi, nen khi Duc da chot thi cach duy nhat la SUA TAY claims.json
  // — va sua tay thi cau chot khong di vao bang, chi nam trong dau nguoi sua. Nguoi can doc cau
  // do la phien vua BI mat vung, ma ho chi doc bang.
  //
  // Va cai gia da tra that (04/09): sau mot luot gianh vung, `git add <file>` cuon theo hai dong
  // AGENTS.md cua phien khac dang sua do. Noi dung khong mat, nhung NHAN LANE ghi sai nguoi lam —
  // ma nhan lane la thu ca co che nay dua vao.
  const cha = mkdtempSync(join(tmpdir(), "gianh-vung-"));
  try {
    const g = (...a) => execFileSync("git", a, { cwd: cha, encoding: "utf8" });
    g("init", "-q", "-b", "main");
    g("config", "user.name", "t"); g("config", "user.email", "t@e.invalid");
    mkdirSync(join(cha, "scripts"), { recursive: true });
    mkdirSync(join(cha, ".agents"), { recursive: true });
    mkdirSync(join(cha, "docs"), { recursive: true });
    for (const f of ["claim.mjs", "repo-structure.mjs"]) cpSync(join(ROOT, "scripts", f), join(cha, "scripts", f));
    cpSync(join(ROOT, ".repo-structure.json"), join(cha, ".repo-structure.json"));
    const bang = join(cha, ".agents", "claims.json");
    const dat = () => writeFileSync(bang, JSON.stringify({ claims: {
      _root: { owner: "phien-cu", ai: "Codex", task: "dang lam do", released_at: null },
      _docs: { owner: "phien-cu", ai: "Codex", task: "dang lam do", released_at: null }
    } }, null, 2), "utf8");
    dat();
    writeFileSync(join(cha, "a.txt"), "x", "utf8");
    g("add", "-A"); g("commit", "-q", "-m", "mot");

    const chay = (...co) => {
      const r = spawnSync(process.execPath, [join(cha, "scripts", "claim.mjs"), ...co], { cwd: cha, encoding: "utf8" });
      return { ...r, out: String(r.stdout || "") + String(r.stderr || "") };
    };
    const doc = (k) => JSON.parse(readFileSync(bang, "utf8")).claims[k];

    // (a) Khong co cau chot -> van TU CHOI, y nhu cu.
    const a = chay("--take", "_docs", "--as", "toi", "--task", "t");
    assert.notEqual(a.status, 0, "khong co cau chot thi van phai TU CHOI");
    assert.match(a.out, /--duc-duyet/, "phai chi ra duong hop le, khong de nguoi ta di sua tay");
    assert.equal(doc("_docs").owner, "phien-cu", "tu choi thi bang KHONG duoc doi");

    // (b) Co cau chot, vung SACH -> gianh duoc, va cau chot ghi VAO BANG.
    const cauChot = "Duc chot 2026-09-04: lay lai vung nay di";
    const b = chay("--take", "_docs", "--as", "toi", "--task", "t", "--duc-duyet", cauChot);
    assert.equal(b.status, 0, `vung sach + co cau chot thi phai gianh duoc: ${b.out.slice(0, 300)}`);
    const sau = doc("_docs");
    assert.equal(sau.owner, "toi");
    assert.equal(sau.taken_from, "phien-cu", "phai ghi lai gianh cua AI");
    assert.equal(sau.duc_decision, cauChot, "cau chot phai nam TRONG BANG, khong chi in ra man hinh");

    // (c) Vung con FILE SUA DO cua chu cu -> TU CHOI, ke ca khi Duc da chot.
    dat();
    writeFileSync(join(cha, "docs", "cua-ho.md"), "ho dang sua do", "utf8");
    const c = chay("--take", "_docs", "--as", "toi", "--task", "t", "--duc-duyet", cauChot);
    assert.notEqual(c.status, 0, "vung con viec do thi phai TU CHOI du Duc da chot");
    assert.match(c.out, /sửa dở/, "phai noi ro vi sao, va ke ten file");
    assert.match(c.out, /cua-ho\.md/, "phai ke dung file dang vuong");
    assert.equal(doc("_docs").owner, "phien-cu", "tu choi thi bang KHONG duoc doi");

    // (d) DOI CHUNG: file su do o vung KHAC thi khong duoc chan oan.
    const d = chay("--take", "_root", "--as", "toi", "--task", "t", "--duc-duyet", cauChot);
    assert.equal(d.status, 0, `file do nam o vung khac thi khong duoc chan oan: ${d.out.slice(0, 300)}`);
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("F11 · giành vùng: đòi câu chốt · ghi vào bảng · từ chối khi vùng còn việc dở · không chặn oan vùng khác");
}

/* ---- F12. Luat trong khuon KHONG duoc tro toi file ban trich khong mang ------
 *
 * HINH DANG LOI DA XAY RA BON LAN trong repo nay, va lan thu tu la lan nang nhat vi no NHAN BAN:
 *   claim.mjs (03/09) - BACKLOG.md (05/09) - decisions.md (05/09) - ban trich (05/09).
 * Ba lan dau la mot file thieu o repo nha: mot cho, mot lan sua. Lan thu tu la ban trich PHAT DI
 * mot bo luat bat dung hai file ma chinh no khong mang theo, tuc MOI repo dung tu khuon sinh ra
 * DA MANG SAN benh do.
 *
 * Do that truoc khi viet phep kiem nay: template/AGENTS.md dong 11 bat ghi vao BACKLOG.md, dong
 * 175 bat ghi vao decisions.md; ban trich luc do co 28 file, khong file nao trong hai.
 *
 * PHEP KIEM NAY CHAN HINH DANG, KHONG CHAN BA CHO. Bang tra o muc 6 cua luat la NOI KHAI moi file
 * cua repo, va luat tu noi "khong khai = khong ton tai". Nen dao lai: moi duong dan ma bang tra
 * tro toi PHAI co that trong ban trich. Them mot dong bang tra tro toi file chua mang la do ngay. */
{
  const files = buildTemplateFiles();
  const luat = files.get("AGENTS.md");
  assert.ok(luat, "ban trich phai co AGENTS.md");

  const links = [...luat.matchAll(/\]\(([^)#\s]+)\)/g)].map((m) => m[1])
    .filter((h) => !/^https?:/.test(h) && !h.endsWith("/"));
  assert.ok(links.length >= 5, `bang tra phai co it nhat vai link, dang co ${links.length}`);

  const thieu = links.filter((h) => !files.has(h.replace(/^\.\//, "")));
  assert.deepEqual(thieu, [],
    `luat trong khuon tro toi file ban trich KHONG mang: ${thieu.join(", ")}`);

  // HAI FILE CU THE, ghim rieng: chung la ca hong da xay ra that, va khac moi link khac o cho
  // luat bat BUOC dung chung (muc 0 buoc 2 va muc 7 buoc 2), khong chi gioi thieu.
  for (const f of ["BACKLOG.md", "decisions.md"]) {
    assert.ok(files.has(f), `${f}: luat muc 0/muc 7 bat dung, ban trich PHAI mang theo`);
    // VE THU HAI: mang file rong cho du mat thi khong day duoc gi. Quy uoc so phai di theo, vi
    // what-next.mjs phan tich cu phap rat chat - sai mot ky tu la muc bien mat, khong bao gi.
    assert.ok(files.get(f).length > 400,
      `${f}: phai la HAT GIONG co quy uoc so, khong phai file rong cho du mat`);
  }
  ok("F12 - luat trong khuon khong tro toi file ban trich khong mang");
}

/* ---- F13. HAI trong BA loi do pilot migrate loi ra (05/09) ----------------
 *
 * Ba loi nay KHONG loi ra qua bay phien o repo nha, vi repo nha khong dung phai:
 *   A. repo nha la JS nen khong ai can khai `units.behaviour_globs`
 *   B. repo nha chua bao gio viet `null` cho mot muc trong bang quyen
 *   C. repo nha von de Ban do file dung o `AGENTS.md`
 * Do la ly do pilot ton tai. Ghim lai de lan sau khong phai migrate moi biet. */
{
  // --- A. `units.behaviour_globs` PHAI khai duoc, va phai doi duoc hanh vi bo dem.
  // Truoc 1.3.3: chu thich trong build-dashboard.mjs day dung truong nay, ma validator TU CHOI no.
  assert.deepEqual(kiemKhoaLa({ units: { behaviour_globs: ["**/*.py"] } }), [],
    "units.behaviour_globs phai la truong HOP LE — khong duoc bao 'khong nhan ra'");
  assert.deepEqual(behaviourGlobsFrom({ units: { behaviour_globs: ["**/*.py"] } }), ["**/*.py"]);
  assert.equal(behaviourGlobsFrom({}), null, "khong khai -> null, giu mac dinh");
  assert.equal(isBehaviourFile("tools/render.py"), false, "mac dinh KHONG dem .py");
  assert.equal(isBehaviourFile("tools/render.py", { behaviourGlobs: ["**/*.py"] }), true,
    "khai .py roi thi PHAI dem .py");
  // VE DOI CHUNG: khai .py thi .js thoi la nghe cua repo. Thieu ve nay thi mot ban va bien
  // moi thu thanh "co dem" cung qua duoc phep kiem.
  assert.equal(isBehaviourFile("app/x.js", { behaviourGlobs: ["**/*.py"] }), false,
    "khai .py thi .js KHONG con duoc dem");
  // Dau vao hong phai NOI RO, khong im lang bo qua.
  assert.throws(() => behaviourGlobsFrom({ units: { behaviour_globs: [] } }), /BEHAVIOUR_GLOBS_HONG/);
  assert.throws(() => behaviourGlobsFrom({ units: { behaviour_globs: ["khong-co-duoi"] } }), /BEHAVIOUR_GLOBS_HONG/);

  // DUONG TRUYEN: bo dem phai lay CA HAI lop tu cau hinh, khong chi mot.
  // Bo sinh goi `behaviourOptsFrom(structure)` roi truyen thang xuong `isBehaviourFile`.
  const opts = behaviourOptsFrom({
    units: { behaviour_globs: ["**/*.py"] },
    generated: ["views/BOARD.md"],
  });
  assert.deepEqual(opts.behaviourGlobs, ["**/*.py"], "opts phai mang nghe cua repo");
  assert.deepEqual(opts.generatedFiles, ["views/BOARD.md"], "opts phai mang file may sinh");
  assert.equal(isBehaviourFile("tools/render.py", opts), true, "qua opts: .py phai duoc dem");
  assert.equal(isBehaviourFile("views/BOARD.md", opts), false, "qua opts: file may sinh KHONG dem");

  /* GIOI HAN CUA PHEP GHIM NAY, noi thang thay vi de nguoi sau tuong da phu:
     no ghim ham dung opts, KHONG ghim rang `collectModel` co goi ham do khong. Dot bien thu
     05/09: go dong truyen opts trong collectModel -> suite nay VAN XANH. Ghim not ve do can
     dung mot bo `deps` gia day du cho collectModel; da ghi thanh muc no, chua lam. */


  // --- B. Bang quyen co muc `null` phai NOI RO, khong duoc nem TypeError.
  const thu = mkdtempSync(join(tmpdir(), "claims-null-"));
  try {
    const f = join(thu, "claims.json");
    writeFileSync(f, JSON.stringify({ claims: { _root: null } }), "utf8");
    let loi = null;
    try { readClaims(f); } catch (e) { loi = e; }
    assert.ok(loi, "muc `null` phai bi tu choi, khong duoc di tiep");
    assert.match(loi.message, /CLAIMS_MUC_HONG/, "phai la loi CO MA, khong phai TypeError");
    assert.doesNotMatch(loi.message, /Cannot read properties/, "khong duoc de TypeError lot ra");
    assert.match(loi.message, /owner/, "phai in ra KHUON DUNG de nguoi ta sua duoc");
    // DOI CHUNG: khuon dung thi van doc binh thuong.
    writeFileSync(f, JSON.stringify({ claims: { _root: { owner: null } } }), "utf8");
    assert.doesNotThrow(() => readClaims(f), "khuon dung PHAI van chay");
  } finally { rmSync(thu, { recursive: true, force: true }); }

  /* LOI THU BA (`docs.file_map`) KHONG ghim o day, va do la co y sau khi audit doc lap chi ra:
     no can mot kho git that de chay het cong dong phien, nen nam o `tests/cong-do-that.mjs`
     khoi 8. Ten khoi nay truoc do noi "ba loi" trong khi than chi kiem hai — audit Codex 05/09
     bat dung cho do. Mot phep kiem tu khai qua pham vi cua no la mot loi rieng: nguoi sau doc
     ten roi tin rang ve thu ba da co ai canh. */
  ok("F13 - hai loi pilot: behaviour_globs khai duoc va doi hanh vi - bang quyen null noi ro thay vi no");
}

/* ---- F14. NGAN SACH CAN NANG: khai duoc, va tu choi dau vao hong ----------
 *
 * VI SAO CAN: "clean up deu dan" ma khong co thuoc thi la loi khuyen, khong phai nhip. Do that
 * o repo nha 05/09: HANDOFF.md 1237/600 dong, tong tai lieu 3462/2200 — va khong ai biet cho toi
 * khi co lenh do. Repo migrate thua huong dung benh do neu ban trich khong mang theo thuoc.
 *
 * NGAN SACH PHAI KHAI DUOC, vi repo khac co kich thuoc khac. Nhung khai SAI thi phai NOI RO,
 * khong im lang bo qua — mot ngan sach go sai ten la mot lop bao ve bien mat ma khong ai biet. */
{
  assert.deepEqual(nganSachTu({}), NGAN_SACH_MAC_DINH, "khong khai -> dung mac dinh");
  assert.deepEqual(nganSachTu(null), NGAN_SACH_MAC_DINH, "cau truc rong -> dung mac dinh");

  const ns = nganSachTu({ budget: { soNhatKy: 1200 } });
  assert.equal(ns.soNhatKy, 1200, "khai roi thi phai lay so da khai");
  assert.equal(ns.tongTaiLieu, NGAN_SACH_MAC_DINH.tongTaiLieu,
    "muc KHONG khai phai giu mac dinh, khong bi xoa");

  // GO SAI TEN -> NOI RO. Day la ca da tung lam MAT lop bao ve o cho khac trong repo nay
  // (audit 03/09: go sai ten truong cau hinh, lop bao ve bien mat, khong bao gi).
  assert.throws(() => nganSachTu({ budget: { soNhatKi: 1200 } }), /BUDGET_HONG/,
    "go sai ten muc ngan sach phai bi tu choi, khong duoc im lang bo qua");
  assert.throws(() => nganSachTu({ budget: { soNhatKy: 0 } }), /BUDGET_HONG/, "so <= 0 khong hop le");
  assert.throws(() => nganSachTu({ budget: { soNhatKy: "nhieu" } }), /BUDGET_HONG/, "phai la so");

  /* BAN THAN `budget` SAI KIEU cung phai noi ra. Ban dau lui ve mac dinh IM LANG, nen
     `"budget": "rat lon"` khien nguoi viet tuong ngan sach rieng dang co hieu luc trong khi
     khong. Audit doc lap Codex bat duoc 05/09, cung ngay khoi nay ra doi. */
  for (const sai of ["chuoi", 5, [], null]) {
    assert.throws(() => nganSachTu({ budget: sai }), /BUDGET_HONG/,
      `budget = ${JSON.stringify(sai)} phai bi tu choi, khong duoc lui ve mac dinh im lang`);
  }

  /* CO TRAN. Khong tran thi 1e300 hop le, moi chi so thuc te deu nam duoi ngan sach, va thuoc do
     im lang mat tac dung — cach vo hieu hoa no ma bang van xanh. */
  assert.throws(() => nganSachTu({ budget: { soNhatKy: 1e300 } }), /vượt trần/,
    "so cuc lon phai bi chan: mot ngan sach khong bao gio cham la mot thuoc do da tat");
  // VE DOI CHUNG: noi vua du van phai chay, neu khong ban va nay chan ca repo lon that.
  assert.equal(nganSachTu({ budget: { soNhatKy: 1200 } }).soNhatKy, 1200,
    "noi vua du PHAI van hop le");

  // Chu thich `_doc` trong khoi budget khong duoc tinh la go sai ten.
  assert.doesNotThrow(() => nganSachTu({ budget: { _doc: "ghi chu", soNhatKy: 800 } }));

  // BAN TRICH PHAI MANG CA THUOC LAN SO TAY. Thieu mot trong hai thi repo migrate khong don duoc.
  const files = buildTemplateFiles();
  assert.ok(files.has("scripts/can-nang.mjs"), "ban trich phai mang THUOC do can nang");
  assert.ok(files.has("docs/BAO-TRI-DINH-KY.md"), "ban trich phai mang SO TAY bao tri");
  assert.match(files.get("package.json"), /can-nang/, "ban trich phai khai lenh `npm run can-nang`");
  assert.match(files.get("docs/BAO-TRI-DINH-KY.md"), /Nhip DON|Nhịp DỌN/,
    "so tay bao tri phai co muc nhip DON — phan giu repo RE, khong chi giu repo DUNG");

  ok("F14 - ngan sach can nang khai duoc, tu choi go sai ten; ban trich mang ca thuoc lan so tay");
}

/* F15 — BA BAN VA CUA 2026-09-06, moi cai kem VE DOI CHUNG.
   Vi sao gop mot khoi: ca ba deu la mot HINH DANG loi duy nhat — "phep do dem nham thu no
   khong dinh do", va ba lan bieu hien khac nhau. Tach ba khoi thi hinh dang bien mat. */
{
  // --- 1. Bang chu so huu KHONG phai file hanh vi (KHUNG-16, duong THAT lam cong do) ---
  // Do that 06/09: commit fa7e8a7 cham DUNG MOT file la claims.json, bo dem nhay 4 -> 5.
  // Nhan/tra quyen la viec MOI phien deu phai lam, nen moi phien deu lam trang cu di.
  assert.equal(isBehaviourFile(".agents/claims.json"), false,
    "claims.json la thao tac HANH CHINH — dem no la hanh vi thi cong do lai sau moi phien");
  // VE DOI CHUNG: ban va phai HEP. Neu no lam mo ca .json thi hai dong duoi xanh oan.
  assert.equal(isBehaviourFile("package.json"), true,
    "mien claims.json KHONG duoc mien ca duoi .json — package.json van la hanh vi");
  assert.equal(isBehaviourFile("scripts/claim.mjs"), true,
    "MA cua co che khoa van la hanh vi; chi BANG TRANG THAI moi duoc mien");

  // --- 2. Trang khong con nhung ma commit (KHUNG-16, Duc chot 06/09) ---
  const nguon = readFileSync(join(ROOT, "scripts/build-dashboard.mjs"), "utf8");
  // Do o cho GAN GIA TRI (`generated_commit:` co dau hai cham), khong do ten tran: chinh khoi
  // chu thich giai thich vi sao da bo cung nhac ten do. Do ten tran thi phep kiem nay chi day
  // nguoi ta xoa loi giai thich — dung cai bay ma tests/template-null-repo.mjs da mac mot lan.
  assert.ok(!/generated_commit:/.test(nguon),
    "ban do may doc khong duoc nhung generated_commit — no doi theo TUNG commit");
  // VE DOI CHUNG QUAN TRONG NHAT: phep so KHONG con mien dong nao.
  // Loi cu la "mien hai dong khoi phep so" = cong thoi canh mot phan noi dung. Bo ma commit
  // roi thi phai bo luon mien tru; khong bo thi da doi mot lo hong lay mot lo hong.
  assert.ok(!/SESSION_STAMP_PREFIX/.test(nguon),
    "bo ma commit roi thi mien tru dong phai bi go — neu khong, cong van thoi canh mot phan");

  // --- 3. can-nang: docs/archive/ KHONG tinh vao ngan sach tai lieu ---
  // Mau thuan THAT trong chinh cong cu: no bao "doi sang docs/archive/" trong khi quet de quy
  // ca docs/. Lam dung loi khuyen thi tong tai lieu TANG — nguoi lam dung bi phat.
  const canNang = readFileSync(join(ROOT, "scripts/can-nang.mjs"), "utf8");
  assert.match(canNang, /THU_MUC_LUU_TRU/,
    "can-nang phai mien docs/archive — neu khong, loi khuyen cua chinh no phan tac dung");
  assert.match(canNang, /m\.name !== THU_MUC_LUU_TRU/,
    "mien tru phai nam o vong DUYET THU MUC, khong phai o cho khac");

  ok("F15 - bang quyen khong la hanh vi; trang bo ma commit va bo luon mien tru; luu tru khong tinh ngan sach");
}

/* F16 — MA VIEC: tien to duoc lan SO, va dong `###` la khong bao gio bi nuot im.
   Vap that 05/09 luot migrate n8n-orchestrator: ma `N8N-1` bien mat khoi ban do viec ma
   khong bao gi, phai lach sang `CP-`. Goc benh KHONG phai regex hep — la BO QUA IM LANG. */
{
  const so = [
    "## P1", "",
    "### N8N-1 · repo ten chua so",           // phai NHAN
    "### KHUNG-9 · binh thuong",              // phai NHAN
    "### 2026-09 · moc ngay, khong phai ma viec",  // phai BI NEU TEN
    "### ~~CU-1~~ · da dong",                 // phai bo qua, KHONG bi neu ten
    ""
  ].join("\n");
  const r = parseBacklog(so);
  const ma = r.mo.map((v) => v.ma);
  assert.deepEqual(ma, ["N8N-1", "KHUNG-9"],
    "tien to duoc lan so (N8N-1) — repo ten chua so: n8n, s3, web3, i18n deu vap cai nay");

  // VE DOI CHUNG 1: bat dau bang SO thi KHONG duoc nhan, neu khong mot moc ngay
  // `### 2026-09 · ...` bi doc thanh ma viec `2026-09` va so nay moc mot muc ma.
  assert.ok(!ma.includes("2026-09"), "tien to BAT DAU bang so khong duoc nhan");

  // VE DOI CHUNG 2 — VE QUAN TRONG NHAT: no phai BI NEU TEN, khong phai lang le bien mat.
  assert.equal(r.khongHieu.length, 1, "dong `###` khong doc ra ma viec phai bi NEU TEN");
  assert.match(r.khongHieu[0], /2026-09/, "phai neu dung dong nao, de nguoi viet biet sua o dau");

  // VE DOI CHUNG 3: muc da GACH la dung quy uoc, khong duoc keu oan.
  assert.ok(!r.khongHieu.some((d) => /CU-1/.test(d)),
    "muc da gach ngang la DUNG quy uoc — keu oan thi canh bao thanh tieng on va bi bo qua");

  ok("F16 - ma viec nhan tien to co so, va dong `###` la bi neu ten thay vi bien mat im lang");
}

console.log(`\n${passed} passed, 0 failed, ${passed} total`);
