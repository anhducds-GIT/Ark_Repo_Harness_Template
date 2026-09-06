/* BỘ ĐỌC CỦA BẢNG — phép kiểm phá.
 *
 * Năm tab mới đọc từ năm nguồn khác nhau, và mỗi nguồn là chữ do NGƯỜI viết vào một file
 * markdown. Nghĩa là mọi lỗi ở đây đều có chung một hình dạng: **bảng vẽ ra một con số trông
 * hợp lý, từ một cách đọc sai** — và không ai kiểm được bằng mắt vì con số nào cũng trông
 * giống nhau.
 *
 * Nên mỗi vế dưới đây dựng đúng một ca hỏng thật rồi đòi bộ đọc bắt được nó.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BAC, khoangNgay, noiTuoi, quetDauDuc, readBatBien, readCoChe, readIdeas, readKhoa, readNo
} from "../scripts/overview-doc.mjs";

let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };
const NL = String.fromCharCode(10);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ---- 1. Bậc lạ phải NÉM, không được xếp vào thùng "khác" ----------------- */
{
  // Một bậc gõ sai mà lặng lẽ rơi vào "khác" là ý tưởng đó biến mất khỏi thanh tiến độ, và
  // biến mất im lặng — người viết vẫn thấy nó trong sổ, bảng thì không.
  assert.throws(() => readIdeas("## Y-01 · x" + NL + "- **bậc:** gần xong"), /BAC_LA/);
  assert.throws(() => readIdeas("## Y-01 · x" + NL + "- **việc kế:** y"), /THIEU_BAC/);
  for (const b of BAC) {
    const r = readIdeas("## Y-01 · x" + NL + `- **bậc:** ${b}`);
    assert.equal(r[0].bac, b);
  }
  ok("sổ ý tưởng: bậc lạ NÉM · thiếu bậc NÉM · bốn bậc hợp lệ đều nhận");
}

/* ---- 2. Trường lạ KHÔNG được rơi vào hư không ---------------------------- */
{
  // Ai viết thêm một dòng vào sổ thì dòng đó phải hiện lên bảng. Bảng im lặng nuốt chữ của
  // người viết là bảng dạy người ta thôi viết vào sổ.
  const r = readIdeas(["## Y-07 · x", "- **bậc:** ý tưởng", "- **rủi ro:** cao",
    "- **việc kế:** làm A", "", "**nguồn** — Đức nêu 04/09", "dòng tiếp"].join(NL));
  assert.deepEqual(r[0].extra, [["rủi ro", "cao"]], "trường lạ phải được giữ nguyên");
  assert.equal(r[0].viecKe, "làm A");
  assert.equal(r[0].khoi.length, 1);
  assert.deepEqual(r[0].khoi[0].than, ["Đức nêu 04/09", "dòng tiếp"], "khối văn xuôi phải gom đủ dòng");
  ok("sổ ý tưởng: trường lạ và văn xuôi đều giữ, không nuốt chữ");
}

/* ---- 3. Bộ đọc của bảng và của bản đồ việc phải khớp NHAU ---------------- */
{
  /* Hai lệnh cùng đọc `IDEAS.md`. Nhận dạng khác nhau thì sẽ có ngày một ý tưởng hiện ở chỗ
   * này mà không hiện ở chỗ kia, và không ai biết bên nào đúng. Vế này ghim đúng chỗ đó bằng
   * cách bắt cả hai đọc CÙNG một file thật. */
  const raw = readFileSync(join(ROOT, "IDEAS.md"), "utf8");
  const cuaBang = readIdeas(raw);
  assert.ok(cuaBang.length >= 5, "sổ ý tưởng thật phải có mục — đọc ra rỗng là bộ đọc hỏng");

  const wn = readFileSync(join(ROOT, "scripts", "what-next.mjs"), "utf8");
  const mWn = /const MA_Y = (\/[^\n]+\/);/.exec(wn);
  assert.ok(mWn, "what-next.mjs không còn hằng MA_Y — hai bộ đọc đã trôi khỏi nhau");
  const od = readFileSync(join(ROOT, "scripts", "overview-doc.mjs"), "utf8");
  const mOd = /const MUC_Y = (\/[^\n]+\/);/.exec(od);
  assert.ok(mOd, "overview-doc.mjs không còn hằng MUC_Y");
  assert.equal(mOd[1], mWn[1], "hai bộ đọc phải nhận dạng mã ý tưởng BẰNG NHAU:"
    + NL + "  bảng      : " + mOd[1] + NL + "  bản đồ việc: " + mWn[1]);
  ok("sổ ý tưởng: bảng và bản đồ việc nhận dạng mã BẰNG NHAU");
}

/* ---- 4. Dấu chờ người chốt: đúng hai loại, không nhận biến thể ----------- */
{
  const ra = quetDauDuc([
    "### KHUNG-11 · abc",
    "> `@Đức:chốt` — chọn một trong hai",
    "> @duc:bam nạp lại tiện ích",
    "Đức nói câu này nhưng không có dấu",
    "@Đức: chốt có khoảng trắng"
  ].join(NL), "BACKLOG.md");
  assert.equal(ra.length, 3);
  assert.deepEqual(ra.map((x) => x.loai), ["chot", "bam", "chot"]);
  assert.deepEqual(ra.map((x) => x.soDong), [2, 3, 5]);
  // Câu văn xuôi nhắc tới tên người chốt KHÔNG được thành một mục việc — nếu không thì danh
  // sách "cần Đức" đầy rác và người ta thôi đọc nó.
  assert.ok(!ra.some((x) => x.cau.includes("không có dấu")), "văn xuôi có tên người không phải là dấu");
  assert.ok(ra[0].cau.startsWith("KHUNG-11") === false, "câu phải là phần còn lại của DÒNG có dấu");
  ok("dấu chờ: hai loại · bỏ dấu tiếng Việt vẫn nhận · văn xuôi không thành việc");
}

/* ---- 5. Sổ nợ: dấu đóng phải ở ĐẦU mã, không dò giữa câu ----------------- */
{
  const ra = readNo([
    "### KHUNG-1 · còn mở",
    "### ~~KHUNG-2~~ · ĐÓNG 06/09 · đã vá",
    "### KHUNG-3 · gỡ khoá sau khi việc kia xong",
    "khong phai muc"
  ].join(NL));
  assert.equal(ra.length, 3);
  assert.deepEqual(ra.map((x) => x.dong), [false, true, false]);
  // Chữ "xong" giữa câu là một ĐIỀU KIỆN, không phải trạng thái. Đóng oan nó là bảng báo
  // THIẾU nợ — và một việc bị đếm thiếu thì biến mất, không ai đi tìm.
  assert.equal(ra[2].dong, false, "chữ xong giữa câu KHÔNG phải dấu đóng");
  ok("sổ nợ: chỉ gạch mã mới là đóng, không dò từ khoá giữa câu");
}

/* ---- 6. Bảng quyền: hỏng thì NÉM, và `_docs` không được bị nuốt ---------- */
{
  assert.throws(() => readKhoa("{ khong phai json"), /BANG_QUYEN_HONG/);
  assert.throws(() => readKhoa('{"a":1}'), /BANG_QUYEN_HONG/);
  const ds = readKhoa(JSON.stringify({
    _doc: "chú thích", _labels: "chú thích",
    claims: { _root: { owner: "ai-do" }, _docs: { owner: null }, _code: { owner: null } }
  }));
  // Bản đầu lọc `startsWith("_doc")` và nuốt luôn khoá vùng THẬT tên `_docs` — một vùng biến
  // mất khỏi bảng, im lặng. Bắt được ngay lượt chạy đầu trên dữ liệu thật.
  assert.deepEqual(ds.map((k) => k.khoa), ["_code", "_docs", "_root"], "_docs là khoá vùng thật, không phải chú thích");
  assert.equal(ds.filter((k) => k.owner).length, 1);
  ok("bảng quyền: hỏng thì NÉM · khoá `_docs` không bị nhầm là chú thích");
}

/* ---- 7. Đọc lại luật: cắt tới mục KẾ, và bắt được cả năm bất biến -------- */
{
  const luat = readFileSync(join(ROOT, "docs", "protocols", "MULTIFLOW.md"), "utf8");
  const cc = readCoChe(luat);
  const bb = readBatBien(luat);
  assert.ok(cc.length >= 3, "bốn cơ chế đọc ra " + cc.length + " — bộ đọc hỏng");
  // Bản đầu neo `$` vào cuối dòng, mà bất biến viết dạng `**① Câu.** rồi văn xuôi chạy tiếp` —
  // nên nó bắt được 0 cái và vẫn trả mảng rỗng LỄ PHÉP. Rỗng-mà-đúng và rỗng-vì-đọc-hỏng
  // trông giống hệt nhau trên bảng, nên chỗ này phải ghim bằng số.
  assert.equal(bb.length, 5, "phải đọc ra ĐỦ năm bất biến, đọc ra " + bb.length);
  assert.deepEqual(bb.map((b) => b.so), ["①", "②", "③", "④", "⑤"]);
  assert.ok(bb.every((b) => b.cau.length > 8), "mỗi bất biến phải có câu chốt, không rỗng");
  ok("đọc lại luật: bốn cơ chế · ĐỦ năm bất biến, không rỗng lễ phép");
}

/* ---- 8. Tuổi: không đo được KHÁC bằng 0 --------------------------------- */
{
  assert.equal(khoangNgay("2026-09-06", "2026-09-01"), 5);
  assert.equal(khoangNgay("2026-09-06", "2026-09-06"), 0);
  assert.equal(khoangNgay("2026-09-01", "2026-09-06"), 0, "mốc sau nằm trước thì kẹp về 0, không âm");
  assert.equal(khoangNgay("hôm nọ", "2026-09-01"), null);
  // "Chưa đo được" và "treo 0 ngày" là hai câu khác nhau: câu thứ hai nói việc vừa nêu hôm nay,
  // câu thứ nhất nói bảng KHÔNG BIẾT. Gộp chúng là bảng khẳng định một thứ nó không biết.
  assert.notEqual(noiTuoi(null), noiTuoi(0));
  assert.match(noiTuoi(null), /chưa đo được/);
  ok("tuổi: không đo được là null, và null nói khác 0");
}

console.log(`overview-doc-smoke: ${passed} vế xanh`);
