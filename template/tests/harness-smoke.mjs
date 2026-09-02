/* SUITE HẠT GIỐNG CỦA BỘ KHUNG — bộ khung phải mang theo lưới đỡ của chính nó.
 *
 * Vì sao file này tồn tại (K1, 02/09): bản trích đầu mang 5 script — bộ sinh, hai cổng kiểm,
 * công cụ đẩy — mà KHÔNG mang một phép kiểm nào, và `package.json` không khai `scripts.test`.
 * Hệ quả đo được: `hasRootTestScript()` trả false vĩnh viễn, nên cổng đóng phiên của MỌI repo
 * dựng từ bộ khung không bao giờ chạy một dòng test. Cổng có, mà không có răng.
 *
 * Bốn khối dưới đây KHÔNG phải là bộ test đầy đủ của bộ khung. Chúng là bốn chỗ đã HỎNG THẬT
 * trong repo sinh ra bộ khung này — nên chúng là bốn chỗ đáng ghim nhất khi bạn chưa có gì.
 *
 * **Đây là hạt giống, không phải đích.** Repo của bạn thêm test của repo bạn vào cùng thư mục
 * này và nối vào `scripts.test`. Đừng xoá bốn khối này để cho nhanh — mỗi khối là một lần
 * ai đó đã trả giá.
 */

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { claimPrefixesFrom, kiemKhoaLa, ownershipKeys, readStructureFromDisk, unitsFrom } from "../scripts/repo-structure.mjs";
import { grandfatheredNote } from "../scripts/check-bootstrap.mjs";
import { isBehaviourFile } from "../scripts/build-dashboard.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };

/* ---- 1. Công cụ đẩy KHÔNG được im lặng khi không so được với remote ------- */
{
  // Hai ca có CÙNG hình dạng "không phân giải được origin/main", nhưng phải xử khác hẳn:
  //   a) remote CHƯA CÓ nhánh main -> cú đẩy ĐẦU TIÊN của repo mới. Hợp lệ; mọi repo dựng từ
  //      harness đều đi qua ca này, nên chặn nó là chặn chính việc harness sinh ra để làm.
  //   b) remote CÓ nhánh main mà máy không có -> máy đang lệch. PHẢI chặn: đếm "chưa đẩy" bằng
  //      một mốc không tồn tại là báo xong cho một cú đẩy CHƯA HỀ XẢY RA.
  // Bản đầu gộp cả hai vào một nhánh chặn, và repo nhà của harness không đẩy nổi lần đầu.
  //
  // PHẢI CHÉP SCRIPT SANG REPO TẠM, không chỉ đổi thư mục đang đứng: `safe-push.mjs` suy gốc
  // repo từ VỊ TRÍ FILE CỦA CHÍNH NÓ. Bản đầu của phép kiểm này dựng một repo tạm rất công phu
  // rồi đo một repo hoàn toàn khác, và vẫn XANH — vì repo chứa nó lúc ấy tình cờ cũng chưa có
  // remote.
  const temp = mkdtempSync(join(tmpdir(), "harness-push-"));
  try {
    const at = (...a) => execFileSync("git", a, { cwd: temp, encoding: "utf8" });
    at("init", "-q", "-b", "main");
    at("config", "user.name", "t"); at("config", "user.email", "t@e.invalid");
    mkdirSync(join(temp, "scripts"), { recursive: true });
    mkdirSync(join(temp, ".agents"), { recursive: true });
    for (const name of ["safe-push.mjs", "repo-structure.mjs"]) {
      copyFileSync(join(ROOT, "scripts", name), join(temp, "scripts", name));
    }
    copyFileSync(join(ROOT, ".repo-structure.json"), join(temp, ".repo-structure.json"));
    writeFileSync(join(temp, ".agents", "claims.json"), JSON.stringify({ claims: {} }), "utf8");
    writeFileSync(join(temp, "a.txt"), "hi", "utf8");
    at("add", "-A"); at("commit", "-q", "-m", "mot");

    const chay = () => {
      const r = spawnSync(process.execPath, [join(temp, "scripts", "safe-push.mjs"), "--as", "thu", "--dry-run"],
        { cwd: temp, encoding: "utf8" });
      return { ...r, out: String(r.stdout || "") + String(r.stderr || "") };
    };

    // (a) chưa có remote nào -> KHÔNG được nói "không có gì để push"
    const a1 = chay();
    assert.doesNotMatch(a1.out, /Không có gì để push/,
      "khong duoc bao 'khong co gi de push' khi chua so duoc voi remote");
    assert.match(a1.out, /LẦN ĐẦU/, "remote chua co nhanh main thi phai nhan day la cu day dau tien");
    assert.match(a1.out, /mot/, "lan dau thi phai liet ke TOAN BO lich su, khong bo trong");

    // (b) ĐÃ CÓ remote và ĐANG BẰNG NHAU -> "không có gì để push" lúc này là câu ĐÚNG.
    // Đây là đối chứng cho (a): thiếu nó thì một script luôn in "LẦN ĐẦU" cũng qua được (a).
    const bare = mkdtempSync(join(tmpdir(), "harness-bare-"));
    try {
      execFileSync("git", ["init", "-q", "--bare", "-b", "main", bare], { encoding: "utf8" });
      at("remote", "add", "origin", bare);
      at("push", "-q", "origin", "main");
      const b1 = chay();
      assert.match(b1.out, /Không có gì để push/, "bang nhau that thi noi bang nhau moi dung");
      assert.doesNotMatch(b1.out, /LẦN ĐẦU/, "da co nhanh main tren remote thi khong con la lan dau");

      // (c) có remote, và máy ĐI TRƯỚC -> phải liệt kê ĐÚNG commit đang chờ, không im.
      writeFileSync(join(temp, "b.txt"), "them", "utf8");
      at("add", "-A"); at("commit", "-q", "-m", "hai");
      const c1 = chay();
      assert.doesNotMatch(c1.out, /Không có gì để push/, "co commit cho ma bao khong co gi la fail-open");
      assert.match(c1.out, /hai/, "phai liet ke commit dang cho");
      assert.doesNotMatch(c1.out, /mot/, "chi liet ke phan CHUA day, khong ke lai lich su cu");
    
      // (d) DUNG NGOAI `main` -> phai TU CHOI. Day la lo nguy hiem nhat tung tim thay o cong cu
      // nay: moi phep soi chay tren `origin/main..HEAD`, con cau day cu la `git push origin main`
      // — tuc nhanh main TREN MAY. Dung o nhanh khac thi hai thu do la hai lich su khac nhau:
      // soi mot dang, day mot neo. Cong cu sinh ra de chan "day kem viec nguoi khac" lai co the
      // tu lam dung viec do. Audit doc lap bat duoc 03/09.
      at("checkout", "-q", "-b", "nhanh-khac");
      writeFileSync(join(temp, "c.txt"), "rieng", "utf8");
      at("add", "-A"); at("commit", "-q", "-m", "ba");
      const d1 = chay();
      assert.match(d1.out, /TU_CHOI/, "dung ngoai main thi phai TU CHOI, khong duoc am tham day nhanh main tren may");
      assert.match(d1.out, /nhanh-khac/, "phai noi ro dang dung o nhanh nao");
      assert.notEqual(d1.status, 0, "tu choi thi ma thoat phai khac 0");
      at("checkout", "-q", "main");
    } finally { rmSync(bare, { recursive: true, force: true }); }

    ok("đẩy an toàn: lần đầu · bằng nhau · đi trước — cả ba nói đúng, không ca nào im lặng");
  } finally { rmSync(temp, { recursive: true, force: true }); }
}

/* ---- 2. Một file chỉ thuộc MỘT vùng, và bảng khai chủ phải được TÔN TRỌNG --- */
{
  // Đã lệch HAI LẦN ở cùng hai file: hai bản regex riêng (26/08), rồi một hàm mới chỉ nối cho
  // cổng mà không nối cho công cụ đẩy (02/09). Lần hai: cổng quy `docs/x.md` về `_docs`, công
  // cụ đẩy quy về `_root` — phiên giữ `_docs` làm xong, cổng XANH, rồi bị chính công cụ đẩy
  // từ chối đẩy việc của mình.
  //
  // CHÚ Ý — vì sao khối này TỰ DỰNG cấu trúc thay vì đọc `.repo-structure.json` của repo:
  // bộ khung khai mọi thư mục về cùng một chủ `_root`, nên đọc cấu trúc thật thì MỌI đường dẫn
  // đều trả `_root` và phép kiểm không phân biệt được gì — nó sẽ xanh kể cả khi hàm quy chủ bị
  // hỏng hoàn toàn. Đo thật lúc viết: cả bốn đường dẫn đều ra `_root`. Muốn ghim được thì
  // fixture PHẢI dựng nổi ca nhiều chủ.
  const nhieuChu = {
    areas: {
      "docs/": { steward: "_docs", ownership_mode: "root" },
      "scripts/": { steward: "_code", ownership_mode: "root" },
      "tests/": { steward: "_code", ownership_mode: "root" }
    }
  };
  const prefixes = claimPrefixesFrom(nhieuChu);
  const mong = { "docs/a.md": "_docs", "scripts/b.mjs": "_code", "tests/c.mjs": "_code", "README.md": "_root" };
  for (const [file, vung] of Object.entries(mong)) {
    const ra = ownershipKeys([file], nhieuChu, prefixes, () => false);
    assert.deepEqual(ra, [vung], `${file}: phai quy ve ${vung}, khong phai ${JSON.stringify(ra)}`);
  }
  // Quy cả cụm phải ra đúng tập hợp của quy lẻ — đây là chỗ hai công cụ từng lệch nhau.
  const cum = ownershipKeys(Object.keys(mong), nhieuChu, prefixes, () => false);
  assert.deepEqual([...cum].sort(), [...new Set(Object.values(mong))].sort(),
    "quy ca cum phai ra dung tap hop cua quy le");
  ok("quy chu: bang khai nhieu chu duoc ton trong, quy le va quy cum cung dap an");
}

/* ---- 3. Khai cấu trúc SAI thì phải NÉM, không lặng lẽ lùi về mặc định ------ */
{
  // Fail-open ở đây là kiểu hỏng tệ nhất của cả bộ khung: khai sai một chữ thì mọi commit bị
  // quy chủ sai, mà bảng vẫn đẹp và cổng vẫn xanh.
  const xau = [
    { units: { root_dir: "", marker: "manifest.json", depth: 2 } },
    { units: { root_dir: "pkgs", marker: "", depth: 2 } },
    { units: { root_dir: "..", marker: "manifest.json", depth: 2 } }
  ];
  for (const cfg of xau) {
    assert.throws(() => unitsFrom(cfg), `khai sai phai NEM, khong duoc lui ve mac dinh: ${JSON.stringify(cfg)}`);
  }
  // ĐỐI CHỨNG DƯƠNG — không có nó thì ba dòng trên rỗng nghĩa: một hàm ném với MỌI đầu vào
  // cũng qua được. Phải chứng minh nó KHÔNG ném với đầu vào đúng.
  assert.doesNotThrow(() => unitsFrom({ units: { root_dir: "pkgs", marker: "manifest.json", depth: 2 } }),
    "khai DUNG thi khong duoc nem — neu nem thi phep kiem tren khong chung minh duoc gi");
  // GÕ SAI TÊN TRƯỜNG cũng phải bị bắt, không chỉ gõ sai GIÁ TRỊ. Cấu hình vẫn là JSON hợp lệ,
  // vẫn parse ngon, và hậu quả không hiện ra ở đâu: `root_dri` làm bộ máy quét sai thư mục,
  // `mutabilty` làm vùng bằng chứng KHÔNG CÒN được bảo vệ chỉ-thêm. Cả hai đều im.
  assert.equal(kiemKhoaLa({ units: { root_dri: "pkgs" } }).length, 1, "go sai ten truong trong units phai bi bat");
  assert.equal(kiemKhoaLa({ areas: { "evidence/": { mutabilty: "append-only" } } }).length, 1,
    "go sai `mutabilty` phai bi bat — no lam MAT lop bao ve chi-them ma khong bao gi");
  // ĐỐI CHỨNG DƯƠNG: cấu hình đúng và các trường chú thích `_...` không được bị kêu oan.
  assert.deepEqual(kiemKhoaLa({ units: { _doc: "ghi chú", root_dir: "pkgs", marker: "m.json", depth: 2, ten: "Gói" } }), []);
  assert.deepEqual(kiemKhoaLa(readStructureFromDisk(ROOT)), [], "cau hinh THAT cua repo nay phai sach");
  ok("doc cau hinh: sai gia tri thi NEM · sai TEN TRUONG cung bi bat · khai dung thi khong");
}

/* ---- 4. Cổng kiểm cấu trúc phải XANH trên chính repo này ------------------- */
{
  // Nghiệm thu mà README hứa. Nếu repo của bạn đỏ ở đây thì đọc thẳng thông báo của cổng —
  // mỗi dòng nói cả chỗ sai lẫn cách sửa.
  const run = spawnSync(process.execPath, [join(ROOT, "scripts", "check-bootstrap.mjs")], { cwd: ROOT, encoding: "utf8" });
  const out = String(run.stdout || "") + String(run.stderr || "");
  const summary = out.split("\n").find((l) => l.startsWith("TỔNG:")) ?? "";

  // ĐỌC MÃ THOÁT, ĐỪNG ĐẾM TỔNG SỐ ĐỎ.
  //
  // Bản đầu đòi tổng số ĐỎ bằng 0. Nhưng quy trình migrate dặn để `bootstrap.blocking` RỖNG ở
  // repo mới — CHÍNH VÌ repo cũ chắc chắn đỏ vài chỗ, và bật chặn khi đang đỏ là tự khoá repo ở
  // phiên đầu tiên. Hai câu đó đá nhau: `check-bootstrap` thoát 0 (không phép kiểm CHẶN nào đỏ)
  // trong khi suite này thoát 1. Hai cửa đo cùng một thứ, trả hai kết quả, và **repo vừa migrate
  // không bao giờ xanh được**. Đo thật trên repo "Project 3 AI Agent Unify" ngày 03/09:
  // `check-bootstrap` exit 0 · `TỔNG: 63 chỗ ĐỎ (B10)` · suite này exit 1.
  //
  // Mã thoát mới là hợp đồng của cổng: nó đã biết phép kiểm nào đang CHẶN ở repo NÀY. Suite thì
  // không, và không nên đoán hộ.
  assert.equal(run.status, 0,
    `cong kiem cau truc thoat khac 0 — co phep kiem thuoc nhom CHAN dang do: "${summary}"`);

  // Nhưng đừng tin mã thoát một cách mù quáng: một `check-bootstrap` rỗng cũng thoát 0. Đòi có
  // dòng tổng kết đọc được, để "thoát 0" phải kèm bằng chứng là nó đã thật sự chạy.
  assert.ok(summary, "thoat 0 nhung KHONG co dong TONG: — cong nay chua chay gi, khong duoc tin");
  assert.match(summary, /chỗ[^0-9]*ĐỎ/, `dong tong ket khong doc duoc: "${summary}"`);
  ok("cong kiem cau truc: nhom CHAN dat het, va co bang chung da chay that");
}

/* ---- 5. Danh sách miễn trừ phải ĐƯỢC ĐỌC, dù khai kiểu nào ---------------- */
{
  // Bản hạt giống khai `"grandfathered": []` (một MẢNG). Bản đọc cũ hỏi `block.paths`, mà mảng
  // thì không có `.paths` — nên nó luôn đếm 0 và phép kiểm ngược KHÔNG BAO GIỜ CHẠY. Không ném,
  // không đỏ, không thiếu dòng nào trên màn hình: một phép kiểm đứng đó mà không kiểm gì.
  const gia = (grandfathered, tracked) => ({
    fileExists: () => true,
    readFile: () => JSON.stringify({ grandfathered }),
    git: { trackedPaths: () => tracked }
  });

  // (a) hình dạng MẢNG — hình dạng bản hạt giống thật sự dùng
  {
    const n = grandfatheredNote(gia(["cu/a.md", "cu/b.md"], ["cu/a.md"]));
    assert.equal(n.declared, 2, "khai kieu MANG phai duoc dem, dang dem 0 = phep kiem chet");
    assert.deepEqual(n.gone, ["cu/b.md"], "duong dan da bien mat khoi HEAD phai bi keu ten");
  }

  // (b) hình dạng KHỐI CÓ `paths` — hình dạng bản đọc cũ mong đợi. Vẫn phải chạy.
  {
    const n = grandfatheredNote(gia({ paths: ["cu/a.md"] }, []));
    assert.equal(n.declared, 1, "khai kieu KHOI cung phai duoc dem");
    assert.deepEqual(n.gone, ["cu/a.md"]);
  }

  // (c) hình dạng LẠ — phải KÊU LÊN, không im lặng nhận 0. Im lặng chấp nhận mọi thứ chính là
  //     cách lỗi này sinh ra lần đầu.
  {
    const n = grandfatheredNote(gia("cu/a.md", []));
    assert.equal(n.declared, 0);
    assert.ok(n.hinhDangLa, "hinh dang la thi phai bao, khong duoc im lang tra 0");
  }

  // (d) ĐỐI CHỨNG DƯƠNG: không khai gì thì không có ghi chú, và không được kêu hình dạng lạ.
  {
    assert.equal(grandfatheredNote(gia(undefined, [])), null, "khong khai thi khong co ghi chu");
    assert.equal(grandfatheredNote(gia([], [])).hinhDangLa, null, "mang rong la HOP LE, khong duoc keu");
  }
  ok("mien tru vinh vien: doc duoc ca hai hinh dang, hinh dang la thi keu len");
}

/* ---- 6. Sản phẩm của bộ sinh không được đếm là "code đã đổi" ------------- */
{
  // Vòng lặp không điểm dừng: sinh lại → `repo-map.json` đổi → cột "code đã đổi sau kiểm chứng"
  // bật CÓ → phải kiểm chứng lại → ghi mốc mới → sinh lại → … Đo thật ở repo NAV ngày 03/09:
  // KHÔNG → CÓ (1) → CÓ (2) → CÓ (3). Repo nhà không bắt được vì `STATUS.md` của chính nó khai
  // `lifecycle: building` và không có `last_verified_commit` — bộ khung chưa từng tự đi qua con
  // đường nó bán cho người khác.
  for (const f of ["repo-map.json", "llms.txt", "DASHBOARD.md"]) {
    assert.equal(isBehaviourFile(f), false, `${f} la san pham cua bo sinh, khong duoc dem la code doi`);
  }
  // ĐỐI CHỨNG DƯƠNG: code thật vẫn phải được đếm, kẻo bản vá này biến phép đo thành luôn-false.
  for (const f of ["scripts/x.mjs", "app/main.js", "src/a.json", "page/index.html"]) {
    assert.equal(isBehaviourFile(f), true, `${f} la code that, PHAI duoc dem`);
  }
  // Vùng bằng chứng vẫn không tính, và tài liệu cũng không.
  assert.equal(isBehaviourFile("evidence/run-1/a.json"), false);
  assert.equal(isBehaviourFile("docs/x.md"), false);
  ok("san pham may sinh khong bi dem la code doi (va code that thi van bi dem)");
}

/* ---- 7. Sửa vùng gốc mà không ghi Log thì phải ĐỎ ------------------------ */
{
  // Bản cũ chỉ duyệt `myPackages`. Repo KHÔNG có package con — như chính repo bộ khung này —
  // thì phép kiểm luôn trả "Không có gì phải ghi", kể cả khi phiên vừa viết lại nửa bộ máy.
  // Tức luật "phiên sau phải biết phiên trước làm gì" chưa từng được cưỡng chế ở đúng nơi việc
  // nặng nhất diễn ra. Audit độc lập bắt được 03/09.
  //
  // Ba ca, và ca thứ ba là chỗ dễ tưởng đã xong nhất: `git diff --numstat` cho một dòng bị SỬA
  // ra `1 thêm / 1 xoá`, nên phép đo "có dòng thêm" vẫn đạt. Log là thứ CHỈ ĐƯỢC THÊM.
  const fx = mkdtempSync(join(tmpdir(), "harness-log-"));
  try {
    const at = (...a) => execFileSync("git", a, { cwd: fx, encoding: "utf8" });
    at("init", "-q", "-b", "main");
    at("config", "user.name", "t"); at("config", "user.email", "t@e.invalid");
    mkdirSync(join(fx, "scripts"), { recursive: true });
    mkdirSync(join(fx, ".agents"), { recursive: true });
    for (const n of ["session-check.mjs", "repo-structure.mjs", "check-bootstrap.mjs", "build-dashboard.mjs", "claim.mjs"]) {
      copyFileSync(join(ROOT, "scripts", n), join(fx, "scripts", n));
    }
    copyFileSync(join(ROOT, ".repo-structure.json"), join(fx, ".repo-structure.json"));
    copyFileSync(join(ROOT, "AGENTS.md"), join(fx, "AGENTS.md"));
    const cauHinhFx = JSON.parse(readFileSync(join(ROOT, ".repo-structure.json"), "utf8"));
    // Khai DU moi steward. Thieu mot khoa thi phep kiem "bat bien quyen so huu" do, va khoi
    // nay se doc nham cai do do la ket qua cua chinh no.
    const claimsFx = { claims: {} };
    for (const v of Object.values(cauHinhFx.areas ?? {})) {
      const k = v?.steward; if (k) claimsFx.claims[k] = { owner: null, task: null };
    }
    claimsFx.claims._root = { owner: "thu", task: "t" };
    claimsFx.claims._code = { owner: "thu", task: "t" };
    writeFileSync(join(fx, ".agents", "claims.json"), JSON.stringify(claimsFx), "utf8");
    writeFileSync(join(fx, "HANDOFF.md"), "# HANDOFF\n\n## Log\n- cu\n", "utf8");
    writeFileSync(join(fx, "package.json"), JSON.stringify({ name: "fx", private: true, type: "module", scripts: { test: "node -e 0" } }), "utf8");
    at("add", "-A"); at("commit", "-q", "-m", "nen");

    const chay = () => {
      const r = spawnSync(process.execPath, [join(fx, "scripts", "session-check.mjs"), "--as", "thu"], { cwd: fx, encoding: "utf8" });
      const out = String(r.stdout || "") + String(r.stderr || "");
      // Lay DUNG dong cua phep kiem nay. Cat theo cua so ky tu thi de nuot nham dau hieu
      // cua phep kiem KE BEN, va phep kiem se xanh/do vi ly do khong lien quan.
      const ds = out.split(String.fromCharCode(10));
      const k = ds.findIndex((l) => l.includes("HANDOFF đã ghi Log"));
      return k < 0 ? "(khong thay phep kiem HANDOFF)" : ds.slice(k, k + 2).join(String.fromCharCode(10));
    };

    const themVaoCode = () => writeFileSync(join(fx, "scripts", "claim.mjs"),
      readFileSync(join(fx, "scripts", "claim.mjs"), "utf8") + "\n// doi\n", "utf8");

    // (a) sửa code vùng gốc, KHÔNG ghi Log -> ĐỎ
    themVaoCode();
    assert.match(chay(), /ĐỎ/, "sua vung goc ma khong ghi Log thi phai DO");

    // (b) THÊM một dòng Log -> XANH
    writeFileSync(join(fx, "HANDOFF.md"), readFileSync(join(fx, "HANDOFF.md"), "utf8") + "- moi\n", "utf8");
    assert.match(chay(), /XANH/, "them dong Log that thi phai XANH");

    // (c) chỉ SỬA dòng Log cũ, không thêm dòng nào -> ĐỎ.
    //     Không có ca này thì phép đo "có dòng thêm" trông như đã canh, thật ra không: một dòng
    //     bị sửa cũng cho `them > 0`.
    at("add", "-A"); at("commit", "-q", "-m", "moc");
    themVaoCode();
    writeFileSync(join(fx, "HANDOFF.md"), readFileSync(join(fx, "HANDOFF.md"), "utf8").replace("- cu", "- cu sua"), "utf8");
    assert.match(chay(), /ĐỎ/, "sua dong Log CU khong phai la ghi Log — phai DO");

    ok("Log vung goc: khong ghi thi DO · them dong thi XANH · sua dong cu van DO");
  } finally { rmSync(fx, { recursive: true, force: true }); }
}

console.log(`\n${passed} passed, 0 failed, ${passed} total`);
