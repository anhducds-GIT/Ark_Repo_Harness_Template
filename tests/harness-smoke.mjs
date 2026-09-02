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
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { claimPrefixesFrom, ownershipKeys, readStructureFromDisk, unitsFrom } from "../scripts/repo-structure.mjs";

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
  ok("doc cau hinh: khai sai thi NEM (3 ca), khai dung thi khong (doi chung duong)");
}

/* ---- 4. Cổng kiểm cấu trúc phải XANH trên chính repo này ------------------- */
{
  // Nghiệm thu mà README hứa. Nếu repo của bạn đỏ ở đây thì đọc thẳng thông báo của cổng —
  // mỗi dòng nói cả chỗ sai lẫn cách sửa.
  const run = spawnSync(process.execPath, [join(ROOT, "scripts", "check-bootstrap.mjs")], { cwd: ROOT, encoding: "utf8" });
  const out = String(run.stdout || "") + String(run.stderr || "");
  const summary = out.split("\n").find((l) => l.startsWith("TỔNG:")) ?? "";
  const m = summary.match(/([0-9]+)[^0-9]*chỗ[^0-9]*ĐỎ/);
  assert.ok(m, `khong doc duoc so cho DO tu dong tong ket: "${summary}"`);
  assert.equal(Number(m[1]), 0, `cong kiem cau truc con cho DO: "${summary}"`);
  ok("cong kiem cau truc: 0 cho DO tren chinh repo nay");
}

console.log(`\n${passed} passed, 0 failed, ${passed} total`);
