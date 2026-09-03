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
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { readStructureFromDisk, unitsFrom, stewardOf, claimPrefixesFrom } from "../scripts/repo-structure.mjs";
import { danhGia, mucDo, cauHinhDocDuoc } from "../scripts/assess.mjs";
import { buildTemplateFiles } from "../scripts/build-template.mjs";
import { isBehaviourFile, LIFECYCLES } from "../scripts/build-dashboard.mjs";
import { VONG_DOI } from "../scripts/build-overview.mjs";

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

console.log(`\n${passed} passed, 0 failed, ${passed} total`);
