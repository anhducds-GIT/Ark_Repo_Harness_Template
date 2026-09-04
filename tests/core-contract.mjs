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
import { isBehaviourFile, LIFECYCLES } from "../scripts/build-dashboard.mjs";
import { VONG_DOI } from "../scripts/build-overview.mjs";
import { blockingCodes, checkB10, createBootstrapDeps } from "../scripts/check-bootstrap.mjs";

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

console.log(`\n${passed} passed, 0 failed, ${passed} total`);
