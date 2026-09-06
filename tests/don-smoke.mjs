/* tests/don-smoke.mjs — ghim NHỊP DỌN (`scripts/don.mjs`).
 *
 * Đức chốt 2026-09-06: repo cần một CƠ CHẾ dọn, không phải một lượt dọn — *"nội dung sẽ luôn
 * bị phình sau 1 quá trình"*. Một cơ chế thì phải chạy được nhiều lần, nên ba vế dưới đây
 * không phải trang trí: mỗi vế ứng với một lỗi ĐÃ XẢY RA THẬT lúc dựng lệnh này.
 *
 *   1. KHÔNG MẤT CHỮ   — chữ cắt ra phải nằm nguyên trong kho lưu trữ.
 *   2. HAI LẦN MỘT KẾT QUẢ — lượt đầu để lại vài dòng của chính nó, nên bản đầu vẫn nhỉnh
 *      trên ngân sách và phải chạy lượt hai mới xuống. Tức "dọn" trở thành việc không có điểm
 *      dừng, và mỗi lượt lại cắt thêm một khối.
 *   3. ĐÚNG CHIỀU      — `CHANGELOG.md` xếp mới-nhất-ở-trên, `HANDOFF.md` xếp ngược. Bản đầu
 *      chỉ có một chiều nên nó định cất đi BẢN VỪA PHÁT và giữ lại bản cũ nhất. Lệnh vẫn chạy,
 *      vẫn báo thành công, không có gì đỏ — loại lỗi tệ nhất.
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const NL = "\n";
let passed = 0;
const ok = (t) => { passed += 1; console.log("  ok  " + t); };

/* Kho thử: chỉ cần đủ thứ `don.mjs` đụng tới — `.repo-structure.json` (để đọc ngân sách),
   ba script nó import, và hai file cần dọn. Cố ý KHÔNG chép cả repo: một fixture nặng thì
   người sau ngại sửa, và một fixture ngại sửa là một fixture sẽ mục. */
function khoThu(nganSach) {
  const kho = mkdtempSync(join(tmpdir(), "don-"));
  mkdirSync(join(kho, "scripts"), { recursive: true });
  for (const f of ["don.mjs", "can-nang.mjs", "repo-structure.mjs", "claim.mjs", "build-dashboard.mjs"]) {
    try { copyFileSync(join(ROOT, "scripts", f), join(kho, "scripts", f)); } catch { /* không cần thì thôi */ }
  }
  const ct = JSON.parse(readFileSync(join(ROOT, ".repo-structure.json"), "utf8"));
  ct.budget = nganSach;
  writeFileSync(join(kho, ".repo-structure.json"), JSON.stringify(ct, null, 2) + NL, "utf8");
  return kho;
}
const chay = (kho, ...args) =>
  execFileSync(process.execPath, [join(kho, "scripts", "don.mjs"), ...args], { cwd: kho, encoding: "utf8" });
const docFile = (kho, rel) => readFileSync(join(kho, rel), "utf8").split(NL);
const kholuu = (kho) => {
  try { return readdirSync(join(kho, "docs", "archive")); } catch { return []; }
};

/* ---- 1. Nhật ký: dời phần cũ, KHÔNG mất chữ ------------------------------ */
{
  const kho = khoThu({ soNhatKy: 60, soPhatHanh: 5000 });
  try {
    const luot = (i) => [`## 2026-09-${String(i).padStart(2, "0")} · lượt ${i}`, `  nội dung riêng của lượt ${i}`, ""];
    const goc = ["# HANDOFF", "", "## Trạng thái hiện tại", "đang chạy", "", "## Log", ""]
      .concat(...Array.from({ length: 40 }, (_, i) => luot(i + 1)));
    writeFileSync(join(kho, "HANDOFF.md"), goc.join(NL) + NL, "utf8");

    // XEM TRƯỚC KHÔNG ĐƯỢC GHI GÌ. Một lệnh dọn tự ghi ngay lần chạy đầu là lệnh không ai dám chạy.
    const truoc = readFileSync(join(kho, "HANDOFF.md"), "utf8");
    chay(kho);
    assert.equal(readFileSync(join(kho, "HANDOFF.md"), "utf8"), truoc,
      "chay khong co --apply MA GHI file la loi nang nhat cua mot lenh don");
    assert.equal(kholuu(kho).length, 0, "xem truoc khong duoc tao file luu tru");

    chay(kho, "--apply");
    const sau = docFile(kho, "HANDOFF.md");
    assert.ok(sau.length <= 60, `sau khi don phai xuong duoi ngan sach, dang ${sau.length}`);

    // KHONG MAT CHU: moi dong cua ban goc phai con o dau do — hoac trong file, hoac trong kho.
    const con = new Set([...sau, ...kholuu(kho).flatMap((f) => docFile(kho, `docs/archive/${f}`))]);
    const mat = goc.filter((d) => d.trim() && !con.has(d));
    assert.deepEqual(mat, [], `mat ${mat.length} dong sau khi don — vi du: ${JSON.stringify(mat.slice(0, 3))}`);

    // GIU PHAN DAU: `## Trang thai hien tai` la thu phien sau doc dau tien, khong duoc doi di.
    assert.ok(sau.includes("## Trạng thái hiện tại"), "phan dau file phai o lai");
    assert.ok(sau.includes("  nội dung riêng của lượt 40"), "luot MOI NHAT phai o lai");
    assert.ok(!sau.includes("  nội dung riêng của lượt 1"), "luot CU NHAT phai da doi di");
  } finally { rmSync(kho, { recursive: true, force: true }); }
  ok("1 · nhật ký: xem trước không ghi · dời xong dưới ngân sách · KHÔNG mất chữ nào · giữ phần đầu");
}

/* ---- 2. Chạy hai lần ra MỘT kết quả -------------------------------------- */
{
  /* Bản đầu KHÔNG đạt vế này: lượt một để lại mấy dòng của chính nó nên file vẫn nhỉnh trên
     ngân sách, lượt hai lại cắt thêm một khối nữa. Đo thật ở repo nhà 06/09: hai lượt liên
     tiếp cất đi hai bản phát khác nhau. Một cơ chế dọn không có điểm dừng thì mỗi lần ai đó
     chạy nó, repo lại mất thêm một khối khỏi tầm mắt. */
  const kho = khoThu({ soNhatKy: 60, soPhatHanh: 5000 });
  try {
    const goc = ["# HANDOFF", "", "## Log", ""]
      .concat(...Array.from({ length: 40 }, (_, i) => [`## lượt ${i + 1}`, `nội dung ${i + 1}`, ""]));
    writeFileSync(join(kho, "HANDOFF.md"), goc.join(NL) + NL, "utf8");

    chay(kho, "--apply");
    const lan1 = readFileSync(join(kho, "HANDOFF.md"), "utf8");
    const kho1 = kholuu(kho).slice().sort();

    const ra2 = chay(kho, "--apply");
    const lan2 = readFileSync(join(kho, "HANDOFF.md"), "utf8");

    assert.equal(lan2, lan1, "chay lan hai KHONG duoc doi file — don phai co diem dung");
    assert.deepEqual(kholuu(kho).slice().sort(), kho1, "lan hai khong duoc de them file luu tru");
    assert.match(ra2, /Không có gì phải dọn/, "lan hai phai NOI RO la khong con gi, chu khong im lang");
  } finally { rmSync(kho, { recursive: true, force: true }); }
  ok("2 · chạy hai lần ra MỘT kết quả — dọn có điểm dừng, không gặm dần");
}

/* ---- 3. Đúng chiều: sổ phát hành giữ bản MỚI, cất bản CŨ ------------------ */
{
  /* Vế đối chứng của vế 1: hai file xếp NGƯỢC chiều nhau. Nếu lệnh chỉ biết một chiều thì
     nó vẫn chạy trơn, vẫn báo thành công, và cất đi đúng thứ người ta cần đọc. */
  const kho = khoThu({ soNhatKy: 5000, soPhatHanh: 40 });
  try {
    const ban = (v) => [`## 1.${v}.0 — 2026-09-06 — bản ${v}`, `đổi gì đó ở bản ${v}`, ""];
    // Mới nhất Ở TRÊN, đúng như CHANGELOG thật.
    const goc = ["# CHANGELOG", ""].concat(...Array.from({ length: 20 }, (_, i) => ban(20 - i)));
    writeFileSync(join(kho, "CHANGELOG.md"), goc.join(NL) + NL, "utf8");

    chay(kho, "--apply");
    const sau = readFileSync(join(kho, "CHANGELOG.md"), "utf8");
    assert.match(sau, /## 1\.20\.0/, "ban MOI NHAT phai o lai — cat no di la cat dung thu can doc");
    assert.doesNotMatch(sau, /## 1\.1\.0\b/, "ban CU NHAT phai da doi di");

    const luu = kholuu(kho).map((f) => readFileSync(join(kho, "docs/archive", f), "utf8")).join(NL);
    assert.match(luu, /## 1\.1\.0\b/, "ban cu nhat phai nam trong kho luu tru, khong bien mat");
    assert.doesNotMatch(luu, /## 1\.20\.0/, "ban moi nhat KHONG duoc nam trong kho luu tru");
  } finally { rmSync(kho, { recursive: true, force: true }); }
  ok("3 · sổ phát hành xếp ngược chiều nhật ký — giữ bản MỚI, cất bản CŨ, không lẫn chiều");
}

/* ---- 4. VÒNG ĐỜI THẬT: dọn → phình lại → dọn tiếp ------------------------ */
{
  /* Đây mới là ca Đức mô tả khi chốt: *"nội dung sẽ luôn bị phình sau 1 quá trình"*. Ba vế
     trên chỉ kiểm MỘT lượt dọn. Repo thật thì dọn xong lại ghi tiếp, rồi dọn nữa — và lượt
     dọn thứ hai gặp một thứ lượt đầu không gặp: DẤU CHÂN của chính lệnh nằm sẵn trong file.

     Không gỡ dấu chân ra trước khi tính thì nó bị coi là nội dung thật: bị cuốn vào kho lưu
     trữ, rồi lệnh thêm một dấu chân mới. Sau n lượt, người đọc phải lần theo n file để tới
     chỗ mình cần, và mỗi file chỉ trỏ sang file kế. Đo thật 06/09 trước khi vá: con trỏ của
     lượt một nằm trong file lưu trữ của lượt hai. */
  const kho = khoThu({ soNhatKy: 60, soPhatHanh: 5000 });
  try {
    const luot = (i) => [`## lượt ${i}`, `nội dung ${i}`, ""];
    const viet = (n, tu = 1) => writeFileSync(join(kho, "HANDOFF.md"),
      ["# HANDOFF", "", "## Log", ""].concat(...Array.from({ length: n }, (_, i) => luot(tu + i))).join(NL) + NL, "utf8");

    viet(30);
    chay(kho, "--apply");
    const sau1 = docFile(kho, "HANDOFF.md");
    assert.equal(sau1.filter((d) => d.includes("dời sang kho lưu trữ")).length, 1,
      "sau luot mot phai co DUNG MOT dau chan");

    // Repo sống tiếp: ghi thêm 30 lượt nữa vào cuối, giữ nguyên phần đã dọn.
    writeFileSync(join(kho, "HANDOFF.md"),
      sau1.join(NL) + NL + Array.from({ length: 30 }, (_, i) => luot(100 + i).join(NL)).join(NL) + NL, "utf8");
    chay(kho, "--apply");
    const sau2 = docFile(kho, "HANDOFF.md");

    // VẾ CHÍNH: vẫn ĐÚNG MỘT dấu chân, không phải hai.
    assert.equal(sau2.filter((d) => d.includes("dời sang kho lưu trữ")).length, 1,
      "sau luot hai VAN phai co dung MOT dau chan — khong duoc cong don");

    // VẾ ĐỐI CHỨNG: dấu chân KHÔNG được nằm trong kho lưu trữ. Nó là chữ của lệnh, không phải
    // lịch sử của ai; cất nó đi là cất một thứ vô nghĩa và làm loãng file lưu trữ.
    const chuLuu = kholuu(kho).flatMap((f) => docFile(kho, `docs/archive/${f}`));
    assert.equal(chuLuu.filter((d) => d.includes("dời sang kho lưu trữ")).length, 0,
      "dau chan cua lenh KHONG duoc bi cuon vao kho luu tru");

    // Và vẫn không mất chữ thật nào.
    const con = new Set([...sau2, ...chuLuu]);
    const mat = Array.from({ length: 30 }, (_, i) => `nội dung ${100 + i}`).filter((d) => !con.has(d));
    assert.deepEqual(mat, [], `luot moi bi mat: ${JSON.stringify(mat.slice(0, 3))}`);
  } finally { rmSync(kho, { recursive: true, force: true }); }
  ok("4 · vòng đời thật (dọn → phình lại → dọn tiếp): vẫn ĐÚNG MỘT dấu chân, không cuốn dấu chân vào kho");
}

console.log(`${NL}${passed} passed, 0 failed, ${passed} total`);
