/* BỘ ĐỌC CỦA BẢNG — phép kiểm phá.
 *
 * Năm tab mới đọc từ năm nguồn khác nhau, và mỗi nguồn là chữ do NGƯỜI viết vào một file
 * markdown. Nghĩa là mọi lỗi ở đây đều có chung một hình dạng: **bảng vẽ ra một con số trông
 * hợp lý, từ một cách đọc sai** — và không ai kiểm được bằng mắt vì con số nào cũng trông
 * giống nhau.
 *
 * Nên mỗi vế dưới đây dựng đúng một ca hỏng thật rồi đòi bộ đọc bắt được nó.
 *
 * BẢY ĐỘT BIẾN ĐÃ CHẠY THẬT cho hai vế cuối (07/09) — **cả bảy đều bị bắt**, không cái nào
 * sống sót lượt đầu. Ghi lại để lần sau ai nới hai vế đó thì biết chúng đang canh gì:
 *
 *  1. gộp `[~]` MỘT PHẦN vào `[x]` XONG            → vế 11 đỏ
 *  2. không có khối thì trả `0/0` thay vì `null`   → vế 11 đỏ
 *  3. lấy khối ĐẦU thay vì khối CUỐI               → vế 11 đỏ
 *  4. đọc không ra cổng thì đóng cứng `4747`       → vế 12 đỏ
 *  5. luôn vẽ cửa bảng sống, kể cả repo không có   → vế 12 đỏ
 *  6. chỉ in vế "F5 LÀ THẤY", bỏ vế ảnh chụp       → vế 12 đỏ
 *  7. bỏ mất NGÀY ĐO khỏi khối checklist           → vế 11 đỏ
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BAC, docChecklistTinhNang, khoangNgay, nguonLamMoi, noiTuoi, quetDauDuc, readBatBien,
  readCoChe, readIdeas, readKhoa, readNo
} from "../scripts/overview-doc.mjs";
import { khoiChecklist, khoiLamMoi, NHAN_KHOA, soSanhTrang, tenTrang } from "../scripts/build-overview.mjs";

let passed = 0;
let boQua = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };

/* BỎ QUA CÓ TÊN, không bỏ qua im lặng.
 *
 * Suite này ĐI THEO BẢN TRÍCH, nên nó chạy ở repo của người khác. Ba vế dưới đây đọc file thật
 * của repo — sổ ý tưởng, luật đa phiên, trang đã sinh — mà repo mới dựng chưa chắc có file nào
 * trong ba. Đo thật lúc phát bản 1.3.17: dựng một repo giả rồi chạy `npm test`, suite **chết**
 * ngay ở `IDEAS.md`.
 *
 * Bỏ qua thì được, nhưng phải IN RA TÊN. Một vế bỏ qua im lặng trông giống hệt một vế đã chạy
 * và xanh — và bảng thì luôn xanh. */
const boQuaVi = (ten, vi) => { boQua += 1; console.log(`  --  ${ten} — BỎ QUA: ${vi}`); };
const docNeuCo = (rel) => { try { return readFileSync(join(ROOT, rel), "utf8"); } catch { return null; } };
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
  const raw = docNeuCo("IDEAS.md");
  if (raw !== null) {
    const cuaBang = readIdeas(raw);
    assert.ok(cuaBang.length >= 1, "sổ ý tưởng có mà đọc ra rỗng — bộ đọc hỏng");
  }

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
  const luat = docNeuCo("docs/protocols/MULTIFLOW.md");
  if (luat === null) {
    boQuaVi("đọc lại luật đa phiên", "repo này chưa có docs/protocols/MULTIFLOW.md");
  } else {
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

/* ---- 9. Dòng bảng quyền KHÔNG được làm trang lệch HEAD ------------------ */
{
  /* ĐO ĐƯỢC NGAY LƯỢT ĐẦU, và nó chặn cả repo: bảng chủ sở hữu đổi mỗi lần một phiên nhận hay
   * trả khoá — nhiều lần một ngày. Trang máy sinh nằm trong khối `generators`, nên cổng so nó
   * với HEAD mỗi phiên. Không có bộ lọc này thì **trả khoá xong là trang lệch**, và phiên tiếp
   * theo bị chặn đẩy vì một thứ nó không hề đụng tới.
   *
   * Vế này ghim CẢ HAI chiều. Chỉ ghim chiều "bỏ qua" thôi thì một bộ lọc bỏ qua TẤT CẢ cũng
   * xanh — và lúc đó trang đứng yên ở một quá khứ nào đó mà cổng vẫn báo sạch. */
  const goc = ["<h1>x</h1>", NHAN_KHOA + "<div>ai-mot ĐANG GIỮ</div>", "<p>chữ thường</p>"].join(NL);
  const doiKhoa = ["<h1>x</h1>", NHAN_KHOA + "<div>ai-hai KHÁC HẲN</div>", "<p>chữ thường</p>"].join(NL);
  const doiThuong = ["<h1>x</h1>", NHAN_KHOA + "<div>ai-mot ĐANG GIỮ</div>", "<p>chữ ĐÃ ĐỔI</p>"].join(NL);
  const themDong = goc + NL + "<p>dòng mới</p>";

  assert.equal(soSanhTrang(goc, doiKhoa), true, "đổi dòng bảng quyền KHÔNG được tính là trang cũ");
  assert.equal(soSanhTrang(goc, doiThuong), false, "đổi dòng thường PHẢI tính là trang cũ");
  assert.equal(soSanhTrang(goc, themDong), false, "thêm một dòng PHẢI tính là trang cũ");
  assert.equal(soSanhTrang(goc, goc), true);

  // Và trang thật phải THẬT SỰ mang nhãn — bộ lọc đúng mà không dòng nào đeo nhãn thì nó không
  // bảo vệ gì cả, chỉ trông như đang bảo vệ.
  // TÊN TRANG SUY TỪ CẤU HÌNH, không đóng cứng tên của repo nhà — suite này chạy ở repo khác.
  const html = docNeuCo(tenTrang(docNeuCo(".repo-structure.json")));
  if (html === null) {
    boQuaVi("trang thật có mang nhãn", "repo này chưa sinh trang lần nào (chạy: npm run overview)");
  } else {
    const soNhan = html.split(NL).filter((d) => d.trimStart().startsWith(NHAN_KHOA)).length;
    assert.ok(soNhan >= 3, "trang thật chỉ có " + soNhan + " dòng mang nhãn — khối bảng quyền chưa được đánh dấu");
    ok("dòng bảng quyền: bỏ qua ở phép SO, và trang thật có mang nhãn thật");
  }
}

/* ---- 10. Liên kết nhảy tab phải trỏ tới thứ CÓ THẬT ---------------------- */
{
  /* HỎNG IM LẶNG, và đã lọt thật một lần. Bản trước thêm liên kết `data-goto` vào khối ý tưởng
   * nhưng KHÔNG thêm đoạn JS xử lý nó — trình duyệt nhảy tới một id đang nằm trong tab BỊ ẨN,
   * nên không có gì xảy ra cả. Người bấm chỉ thấy trang không nhúc nhích, và không ai báo lỗi.
   *
   * Vế này bắt cả ba đường hỏng: liên kết trỏ tới tab không tồn tại · trỏ tới id không tồn tại ·
   * và trang không có đoạn JS để xử lý liên kết đó. */
  const html = docNeuCo(tenTrang(docNeuCo(".repo-structure.json")));
  if (html === null) {
    boQuaVi("liên kết nhảy tab", "repo này chưa sinh trang lần nào (chạy: npm run overview)");
  } else {
  const idCo = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const tabCo = new Set([...html.matchAll(/data-tab="([^"]+)"/g)].map((m) => m[1]));
  const tab2Co = new Set([...html.matchAll(/data-tab2="([^"]+)"/g)].map((m) => m[1]));

  const goto = [...html.matchAll(/href="#([^"]+)"\s+data-goto="([^"]+)"/g)];
  /* CHỈ ĐÒI CÓ LIÊN KẾT KHI CÓ THỨ ĐỂ LIÊN KẾT TỚI.
   *
   * Bản đầu đòi cứng `goto.length > 0`. Đúng ở repo nhà (có sổ ý tưởng nên có chín liên kết),
   * SAI ở repo vừa nhận bản phát: chưa có `IDEAS.md`, chưa có hồ sơ migrate, nên trang không có
   * liên kết nào — và đó là trạng thái HỢP LỆ. Bắt được lúc nâng repo `n8n-orchestrator` lên
   * 1.3.19; đọc lại code không thấy, chỉ chạy ở repo thật mới thấy.
   *
   * Điều kiện đúng là điều kiện CÓ ĐIỀU KIỆN: tab nào có mặt thì liên kết của tab đó phải có. */
  const coTabY = /data-tab="y-tuong"/.test(html);
  if (coTabY) {
    assert.ok(goto.length > 0, "trang CÓ tab Ý tưởng mà không có liên kết nhảy nào — khối ý tưởng đã mất?");
  }
  for (const [, dich, tab] of goto) {
    assert.ok(tabCo.has(tab), `liên kết nhảy tới tab "${tab}" mà tab đó không có trên trang`);
    assert.ok(idCo.has(dich), `liên kết nhảy tới id "${dich}" mà id đó không có trên trang`);
  }
  for (const t2 of tab2Co) {
    assert.ok(idCo.has(t2), `nút tab con "${t2}" không có khung nội dung nào mang id đó`);
  }
  const goto2 = [...html.matchAll(/data-goto2="([^"]+)"/g)].map((m) => m[1]);
  for (const g of goto2) assert.ok(tab2Co.has(g), `bảng trỏ tới tab con "${g}" mà không có nút nào`);

  // Và JS phải THẬT SỰ có đoạn xử lý. Không có nó thì mọi liên kết trên là chữ chết.
  assert.match(html, /data-goto\]/, "trang thiếu đoạn JS bắt liên kết nhảy tab");
  assert.match(html, /data-goto2\]/, "trang thiếu đoạn JS bắt liên kết nhảy tab con");
  ok(`liên kết nhảy tab: ${goto.length} liên kết + ${tab2Co.size} tab con đều trỏ tới thứ có thật`);
  }
}

/* ---- 11. Checklist tinh nang: CHUA DO khac THIEU ------------------------- */
{
  const khoi = [
    "## Checklist tính năng đã migrate — danh mục bản 1.3.31 · đo ngày 2026-09-07",
    "",
    "**F1 · Bảng trạng thái** — 2/3",
    "",
    "- [x] `F1.1` Bảng chính HTML *(từ bản 1.3.18)*",
    "- [~] `F1.2` Ba artifact máy đọc *(từ bản 1.0.0)* — thiếu: `npm run dashboard`",
    "- [x] `F1.4` Tab Migrate *(từ bản 1.3.20)*",
    "",
    "**F7 · Phát hành** — 0/0",
    "",
    "- [-] `F7.1` Bản trích tự sinh *(từ bản 1.0.0)*",
    "",
    "**Tổng: 2 xong · 1 một phần · 0 thiếu.**"
  ].join(NL);

  const r = docChecklistTinhNang(khoi);
  assert.equal(r.ban, "1.3.31");
  assert.equal(r.ngay, "2026-09-07");
  assert.equal(r.khoi.length, 2);
  assert.equal(r.xong + "/" + r.tong, "2/3");
  assert.deepEqual(r.dem, { xong: 2, "mot-phan": 1, thieu: 0, ngoai: 1 });

  // MOT PHAN KHAC THIEU, va khac DU. Ba trang thai phai la ba, khong duoc lam tron ve hai:
  // mot muc `[~]` bi doc thanh `[x]` la bang bao xong mot thu dang hong o cho khong ai nhin.
  const mp = r.khoi[0].muc.find((m) => m.ma === "F1.2");
  assert.equal(mp.trang, "mot-phan");
  assert.equal(mp.thieu, "npm run dashboard");
  assert.equal(mp.tuBan, "1.0.0");
  assert.ok(!/từ bản/.test(mp.ten) && !/thiếu/.test(mp.ten), "tên mục còn dính phần phụ");

  // KHONG CO KHOI => null, va bang phai noi CHUA DO. `null` bi lam tron thanh 0/0 la bang
  // bao mot repo khong co tinh nang nao — trong khi that ra ho so chua tung do.
  assert.equal(docChecklistTinhNang("## Trạng thái" + NL + "Xong hết."), null);
  const hChua = khoiChecklist(null);
  assert.match(hChua, /chưa đo/, "khối rỗng phải nói CHƯA ĐO");
  assert.doesNotMatch(hChua, /0\/0|thiếu tính năng nào<\/h/, "khối rỗng không được hoá con số");

  // KHOI CUOI thang, khong phai khoi dau: ho so migrate la vung CHI THEM.
  const hai = khoi + NL + NL + khoi
    .replace("bản 1.3.31", "bản 1.4.0").replace("2026-09-07", "2026-10-01");
  assert.equal(docChecklistTinhNang(hai).ban, "1.4.0", "phải lấy lần đo MỚI NHẤT");
  assert.equal(docChecklistTinhNang(hai).ngay, "2026-10-01");

  // Bang phai IN RA ngay do va ban danh muc — Duc doi dung hai con so nay 07/09.
  const h = khoiChecklist(r);
  assert.match(h, /1\.3\.31/);
  assert.match(h, /2026-09-07/);
  assert.match(h, /F1\.2/, "mục một phần phải hiện ra, không bị gập");
  ok("checklist tính năng: ba trạng thái tách nhau · chưa đo khác thiếu · lấy khối cuối · in ngày+bản");
}

/* ---- 12. O lam moi: F5 CO va F5 KHONG khong duoc noi gop ----------------- */
{
  const lenhDay = [["overview", "node scripts/build-overview.mjs"], ["bang-song:may-chu", "node bang-song/may-chu.mjs"]];
  const co = nguonLamMoi({ tenBang: "DASHBOARD-X.html", lenh: lenhDay, maMayChu: "export const CONG_MAC_DINH = 4747;" });
  assert.equal(co.anhChup.f5, false, "bản đã commit thì F5 KHÔNG đổi số");
  assert.equal(co.song.f5, true, "bản sống thì F5 LÀ THẤY");
  assert.equal(co.song.cong, 4747);
  assert.equal(co.song.url, "http://127.0.0.1:4747/");

  // Repo KHONG co bang song thi khong duoc ve mot cua khong ton tai: bang day nguoi ta go
  // mot lenh chay khong duoc la bang tu ha do tin cay cua chinh no.
  const khong = nguonLamMoi({ tenBang: "B.html", lenh: [["overview", "x"]], maMayChu: null });
  assert.equal(khong.song, null);
  const hK = khoiLamMoi(khong);
  assert.match(hK, /chưa có bảng SỐNG/);
  assert.doesNotMatch(hK, /bang-song\\\\|127\.0\.0\.1/, "repo không có bảng sống không được in cửa của nó");

  // CONG DOC TU MA NGUON, khong dong cung. Cong doc khong ra thi noi thang la doc luc chay —
  // dong cung mot con so la dan nguoi xem toi bang CUA REPO KHAC khi may chu nhay cong.
  const mu = nguonLamMoi({ tenBang: "B.html", lenh: lenhDay, maMayChu: "// khong khai cong o day" });
  assert.equal(mu.song.cong, null);
  assert.equal(mu.song.url, null);
  assert.match(khoiLamMoi(mu), /in ra lúc chạy/);

  // Ca hai cau tra loi phai co mat CUNG MOT CHO. Chi in mot ve la day sai mot nua.
  const hCo = khoiLamMoi(co);
  assert.match(hCo, /F5 LÀ THẤY/);
  assert.match(hCo, /F5 KHÔNG ĐỔI SỐ/);
  assert.ok((hCo.match(/data-cp="/g) || []).length >= 4, "phải có nút COPY cho từng thứ copy được");
  ok("ô làm mới: hai câu trả lời cùng một chỗ · cổng đọc từ mã · repo không có bảng sống thì im");
}

console.log(`overview-doc-smoke: ${passed} vế xanh` + (boQua ? ` · ${boQua} vế BỎ QUA (kể tên ở trên)` : ""));
