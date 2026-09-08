/* PHÉP GHIM CHO DẤU XÁC NHẬN SUITE — `scripts/chay-test.mjs`.
 *
 * Cơ chế này cho cổng đóng phiên **thôi chạy lại** một chuỗi suite vừa chạy xong (đo 08/09: 535s
 * chạy hai lần trong một vòng làm việc). Nó đứng ngay cạnh một lớp bảo vệ, nên phần lớn phép
 * ghim ở đây là chiều **TỪ CHỐI**: mỗi cách một cây làm việc CHƯA xanh có thể lọt qua.
 *
 * Nếu một ngày ai đó nới một điều kiện dưới đây cho "tiện", họ đang bật một cửa để báo xong mà
 * chưa chạy gì — chính xác thứ cổng sinh ra để chặn.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { bamLenh, danhSachSuite, danhSachTuanTu, moiTruongNay, xetDau, TEN_DAU } from "../scripts/chay-test.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let so = 0;
const ok = (t) => { so += 1; console.log(`  ok  ${t}`); };

const CAY = { head: "a".repeat(40), bam: "b".repeat(32) };
const LENH = bamLenh(["node tests/x.mjs", "node tests/y.mjs"]);
const LUC = "2026-09-08T10:00:00.000Z";
const NOW = Date.parse("2026-09-08T10:05:00.000Z");   // 5 phút sau
const DAU_TOT = { ok: true, head: CAY.head, bam: CAY.bam, lenh: LENH, moi_truong: moiTruongNay(), luc: LUC };

/* ---- 1. Chiều NHẬN: mọi thứ khớp thì dùng lại được -------------------------
   Không có vế này thì một hàm luôn trả `false` cũng qua hết các vế dưới, và cơ chế thành
   trang trí — cổng vẫn chạy lại 535s mỗi lần, không ai biết. */
{
  const r = xetDau(DAU_TOT, CAY, LENH, { now: NOW });
  assert.equal(r.dung, true, `dau khop moi thu phai dung duoc: ${r.vi_sao}`);
  assert.match(r.vi_sao, /5 phút/, "phai noi ro dau bao nhieu tuoi — nguoi doc can biet no noi ve luc nao");
  ok("khớp hết thì dùng lại được, và nói rõ dấu bao nhiêu tuổi");
}

/* ---- 2. Chiều TỪ CHỐI — sáu cửa, mỗi cửa một cách lọt ---------------------- */
{
  const ca = [
    ["chưa có dấu", null],
    ["dấu rỗng", {}],
    ["dấu ghi lượt chạy ĐỎ", { ...DAU_TOT, ok: false }],
    ["ĐỔI HEAD (đã commit thêm)", { ...DAU_TOT, head: "c".repeat(40) }],
    ["ĐỔI CÂY LÀM VIỆC (sửa một byte)", { ...DAU_TOT, bam: "d".repeat(32) }],
    ["ĐỔI DANH SÁCH SUITE (bớt một suite)", { ...DAU_TOT, lenh: bamLenh(["node tests/x.mjs"]) }],
    ["QUÁ HẠN (31 phút)", { ...DAU_TOT, luc: "2026-09-08T09:29:00.000Z" }],
    ["mốc thời gian rác", { ...DAU_TOT, luc: "hôm qua" }],
    ["mốc ở TƯƠNG LAI (đồng hồ bị vặn)", { ...DAU_TOT, luc: "2026-09-08T11:00:00.000Z" }],
    // Phiên Codex bắt được cửa này khi chấm chéo: HEAD + cây làm việc KHÔNG nói gì về môi trường.
    ["ĐỔI MÔI TRƯỜNG (nâng bản Node)", { ...DAU_TOT, moi_truong: "v22.0.0 win32 x64" }],
    ["dấu cũ KHÔNG ghi môi trường", (() => { const d = { ...DAU_TOT }; delete d.moi_truong; return d; })()],
  ];
  for (const [ten, dau] of ca) {
    const r = xetDau(dau, CAY, LENH, { now: NOW });
    assert.equal(r.dung, false, `PHAI TU CHOI: ${ten}`);
    assert.ok(String(r.vi_sao).length > 5, `${ten}: phai noi VI SAO tu choi, khong im lang`);
  }
  ok(`từ chối đủ ${ca.length} cửa: chưa có · rỗng · đỏ · đổi HEAD · đổi cây · đổi danh sách · quá hạn · mốc rác · mốc tương lai · đổi môi trường · dấu cũ thiếu môi trường`);
}

/* ---- 3. Hạn dùng đọc được từ ngoài, và biên là ">" ------------------------- */
{
  const dungHan = { ...DAU_TOT, luc: new Date(NOW - 30 * 60000).toISOString() };
  assert.equal(xetDau(dungHan, CAY, LENH, { now: NOW }).dung, true, "dung bang han thi VAN dung duoc");
  assert.equal(xetDau(dungHan, CAY, LENH, { now: NOW + 61000 }).dung, false, "hon han mot phut thi thoi");
  assert.equal(xetDau(DAU_TOT, CAY, LENH, { now: NOW, phut: 1 }).dung, false, "ha han xuong 1 phut thi dau 5 phut phai bi tu choi");
  ok("hạn dùng: đúng bằng hạn thì được, quá thì thôi, và hạ hạn từ ngoài thì đổi kết quả");
}

/* ---- 4. Băm phải NHẠY với thứ nó phải nhạy -------------------------------- */
{
  assert.notEqual(bamLenh(["a", "b"]), bamLenh(["b", "a"]), "doi THU TU suite la mot chuoi khac");
  assert.notEqual(bamLenh(["a"]), bamLenh(["a", "b"]), "them mot suite la mot chuoi khac");
  assert.equal(bamLenh(["a", "b"]), bamLenh(["a", "b"]), "cung danh sach thi cung bam");
  ok("băm danh sách suite nhạy với thêm/bớt/đổi thứ tự");
}

/* ---- 5. CỔNG PHẢI THẬT SỰ GỌI, KHÔNG CHỈ CÓ HÀM ---------------------------
   Bốn khối trên ghim hàm thuần. Nhưng gỡ lời gọi khỏi `session-check.mjs` mà để lại hàm thì
   bốn khối đó VẪN XANH và cổng lặng lẽ quay về chạy lại 535s — chậm thì thấy, còn chiều ngược
   lại nguy hơn: ai đó gọi hàm rồi bỏ qua kết quả. Nên soi ĐÚNG LỜI GỌI. */
{
  const gate = fs.readFileSync(path.join(ROOT, "scripts", "session-check.mjs"), "utf8").replace(/\r\n/g, "\n");
  assert.match(gate, /xetDau\(docDau\(ROOT\), dauCay\(ROOT\), bamLenh\(danhSachSuite\(ROOT\)\)\)/,
    "cong phai xet dau bang DU BA nguon: dau tren dia, cay lam viec that, danh sach suite that");
  /* Hai vế dưới cố ý hỏi HÀNH VI, không hỏi tên biến: hai repo gọi nhánh chạy đầy đủ bằng hai
     cái tên khác nhau (`runRootSuite()` ở nơi phát hành, `rootSuiteParts()` ở repo tiêu thụ), mà
     điều phải ghim thì y hệt — kết quả xét PHẢI được rẽ nhánh, và đường chạy đầy đủ PHẢI còn. */
  assert.match(gate, /\.dung/, "cong phai RE NHANH theo ket qua xet, khong duoc goi roi bo qua");
  assert.match(gate, /runRootSuite\(\)|rootSuiteParts\(\)/,
    "nhanh chay lai day du PHAI con do — dau chi la duong tat, khong phai duong duy nhat");
  ok("cổng thật sự gọi phép xét, rẽ nhánh theo nó, và vẫn giữ đường chạy đầy đủ");
}

/* ---- 6. Dấu KHÔNG được đi theo repo --------------------------------------- */
{
  const bo = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf8");
  assert.ok(bo.includes(TEN_DAU), `${TEN_DAU} phai nam trong .gitignore — commit no la cho may khac muon dau cua may nay`);
  ok(".gitignore chặn dấu đi theo repo");
}

/* ---- 7. Danh sách chạy-riêng đọc từ cấu hình, không gõ cứng --------------- */
{
  const bo = fs.readFileSync(path.join(ROOT, "scripts", "chay-test.mjs"), "utf8");
  assert.ok(!/serial:\s*\[\s*"/.test(bo), "danh sach chay-rieng KHONG duoc go cung trong script");
  assert.ok(Array.isArray(danhSachTuanTu(ROOT)), "phai doc duoc tu .repo-structure.json");
  ok("danh sách chạy-riêng khai ở cấu hình, không gõ cứng trong script");
}

/* ---- Suite nào GHI ĐÈ file đã commit ở gốc repo thì PHẢI khai chạy-riêng --- */
{
  /* HỎNG DỮ LIỆU THẬT, 08/09 — không phải lo xa. `tests/upgrade-smoke.mjs` đột biến kiểm bằng
   * cách ghi đè một dòng của `RELEASE-LEDGER.json` **thật ở gốc repo**, rồi khôi phục trong
   * `finally`. Ở một repo một-lane thì đúng. Chạy song song thì:
   *   · `build-template.mjs --check` đọc sổ ĐÚNG LÚC nó đang hỏng → ba lệnh đỏ oan;
   *   · hai lượt chạy chồng nhau thì lớp khôi phục ghi đè một ảnh chụp ĐÃ HỎNG → sổ mất hẳn
   *     một dòng, và sổ này là sổ CHỈ THÊM.
   * Một commit đã mang theo dòng hỏng vì đúng cửa sổ đó — xem `KHUNG-47` trong sổ nợ.
   *
   * Nên: file test nào chạm sổ phát hành ở GỐC repo thì phải nằm trong `test.serial`. Vế này quét
   * NGUỒN chứ không quét danh sách — thêm một suite đột biến mới mà quên khai là đỏ ngay. */
  const rieng = danhSachTuanTu(ROOT);
  const soPhatHanh = "RELEASE-LEDGER.json";
  const thieu = [];
  for (const ten of fs.readdirSync(path.join(ROOT, "tests")).filter((f) => f.endsWith(".mjs"))) {
    const nguon = fs.readFileSync(path.join(ROOT, "tests", ten), "utf8");
    const chamSoThat = nguon.includes(`join(ROOT, "${soPhatHanh}")`);
    if (chamSoThat && !rieng.some((r) => ten.includes(r))) thieu.push(ten);
  }
  assert.deepEqual(thieu, [],
    `suite chạm ${soPhatHanh} ở gốc repo phải khai vào test.serial của .repo-structure.json. Đang thiếu: ${thieu.join(" · ")}`);

  /* Và bên ĐỌC sổ cũng phải chạy riêng — đỏ oan cũng là một cách làm người ta thôi tin cổng.
   *
   * SUY TỪ CHUỖI SUITE THẬT, KHÔNG GÕ CỨNG TÊN LỆNH. Bản đầu của vế này liệt kê thẳng
   * `build-template.mjs` và nó **đỏ oan ở repo vừa dựng** (bắt được ngay lượt chạy đầu, ở
   * `tests/template-null-repo.mjs`): lệnh đó là công cụ của NƠI PHÁT HÀNH, repo tiêu thụ không
   * có nó. Cùng đúng cái bẫy nhật ký 08/09 đã ghi — phép ghim soi *tên* thì là bản sao, soi
   * *hành vi* thì mới là hợp đồng. */
  let benDoc = 0;
  for (const lenh of danhSachSuite(ROOT)) {
    // CHỈ soi bước CÔNG CỤ (`scripts/`) — file trong `tests/` đã do nửa trên lo, và nửa trên
    // dùng tiêu chí chặt hơn (chạm thật, không chỉ nhắc tên). Không tách hai nửa thì chính vế
    // này tự làm mình đỏ: nó có nhắc tên sổ, mà nó không hề chạm vào sổ.
    const m = /node\s+(scripts\/\S+\.mjs)/.exec(lenh.replaceAll("\\", "/"));
    if (!m) continue;
    let nguon;
    try { nguon = fs.readFileSync(path.join(ROOT, m[1]), "utf8"); } catch { continue; }
    if (!nguon.includes(soPhatHanh)) continue;
    benDoc += 1;
    assert.ok(rieng.some((r) => lenh.includes(r)),
      `${m[1]} chạm ${soPhatHanh} ở gốc repo nên phải khai chạy-riêng`);
  }
  /* LỖ ĐÃ BIẾT, ghi ra để không ai tưởng vế này kín: nó chỉ bắt được người chạm sổ TRỰC TIẾP.
   * `tests/core-contract.mjs` gọi `upgrade.mjs --apply`, mà chính lệnh đó mới đọc sổ — nên gỡ
   * `core-contract.mjs` khỏi `test.serial` thì vế này VẪN XANH (đã thử, nó sống sót). Nó nằm
   * trong danh sách vì đã đo được nó đỏ oan 08/09, không phải vì vế này bắt được.
   * Bịt lỗ thì phải dò một tầng gọi gián tiếp — chưa làm, vì một phép dò nửa vời còn tệ hơn một
   * lỗ được ghi rõ. */
  ok(`không ai chạm ${soPhatHanh} thật mà quên khai chạy-riêng — ${rieng.length} suite khai riêng, ${benDoc} bước công cụ đọc sổ`);
}

/* ---- `--carry` tự động PHẢI đứng trên dấu xác nhận, không đứng trên lời hứa --- */
{
  /* Đức chốt 09/09: `--carry` thôi phải hỏi **khi cổng đã XANH TOÀN BỘ và mọi commit quy thuộc
   * được**. Đây là **nới một lớp bảo vệ**, nên hai điều kiện đó phải do MÁY xét, không do người
   * gọi tự khai. Bỏ vế dấu xác nhận đi thì luật còn lại là *"có nhãn Lane thì đẩy được"* — tức
   * một lane đẩy việc của lane khác đi được **trong lúc cổng đang ĐỎ**, và đó đúng là thứ mục 2
   * hàng 2 sinh ra để chặn.
   *
   * VẾ NÀY ĐỌC MÃ NGUỒN, và nói thẳng là nó yếu hơn một ca chạy thật: `safe-push.mjs` chạy phần
   * chính ngay lúc nạp module rồi THOÁT khi thiếu `--as`, nên không suite nào `import` nổi nó
   * (ghi chú này đã có sẵn trong `repo-structure.mjs`). Ca chạy thật cần một remote giả — đáng
   * làm, chưa làm. Cái vế này bắt được: ai đó gỡ một trong hai điều kiện. */
  const sp = fs.readFileSync(path.join(ROOT, "scripts", "safe-push.mjs"), "utf8");
  const iAuto = sp.indexOf("let tuDong = null;");
  assert.ok(iAuto > 0, "safe-push.mjs khong con duong --carry tu dong — neu da bo thi bo luon ve nay");
  const khoi = sp.slice(iAuto, iAuto + 1400);

  assert.match(khoi, /xetDau\(/,
    "duong --carry tu dong PHAI hoi dau xac nhan — khong hoi thi no cho day khi cong dang DO");
  assert.match(khoi, /!r\.lane/,
    "va PHAI doi moi commit quy thuoc duoc — do la thu --carry thuc su mua");
  // Hai điều kiện phải cùng đúng, không phải một trong hai.
  assert.match(khoi, /!thieuNhan\.length && dauXanh/,
    "hai dieu kien phai noi bang VA, khong duoc noi bang HOAC");
  // Và không đo được thì KHÔNG cho qua — fail-closed.
  assert.match(khoi, /catch[\s\S]{0,80}dauXanh = false/,
    "doc dau xac nhan that bai thi phai coi la CHUA xanh, khong duoc nga ve cho qua");
  ok("--carry tự động: đòi CẢ dấu xác nhận LẪN nhãn lane · nối bằng VÀ · không đo được thì chặn");
}

console.log(`\n${so} passed, 0 failed, ${so} total`);
