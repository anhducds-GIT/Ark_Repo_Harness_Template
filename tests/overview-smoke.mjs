/* PHÉP KIỂM BẢNG TỔNG QUAN.
 *
 * Bảng này là thứ chủ dự án mở ra xem, và ông ấy không đọc code — nên kiểu hỏng đắt nhất không
 * phải trang vỡ (thấy ngay) mà là **trang nói sai một cách trông rất bình thường**: số cũ, mục
 * biến mất, hoặc đèn xanh trong khi repo đang nợ.
 */

import assert from "node:assert/strict";
import { gomDuLieu, trang } from "../scripts/build-overview.mjs";

let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };
const dl = gomDuLieu();
const html = trang(dl);

/* ---- 1. Đủ tab, và mỗi tab có phần thân của nó -------------------------- */
{
  const nut = [...html.matchAll(/data-tab="([a-z-]+)"/g)].map((m) => m[1]);
  const than = [...html.matchAll(/id="tab-([a-z-]+)"/g)].map((m) => m[1]);
  assert.ok(nut.length >= 5, `phai co it nhat 5 tab, dang co ${nut.length}`);
  assert.deepEqual([...new Set(nut)].sort(), [...new Set(than)].sort(),
    "moi nut tab phai co dung mot phan than — lech la bam vao thi trang trong");
  ok(`${nut.length} tab, nút nào cũng có thân`);
}

/* ---- 2. Banner "trang có thể đã cũ" phải mang NGÀY SINH THẬT ------------ */
{
  // Trang là file tĩnh đem publish; nó phải tự biết mình bao nhiêu tuổi ở lúc XEM. Thiếu ngày
  // sinh thì banner không bao giờ bật được, và một trang ba tháng tuổi trông y như trang mới.
  const m = html.match(/class="cu" data-sinh="([0-9-]{10})"/);
  assert.ok(m, "phai co banner cu kem ngay sinh dang YYYY-MM-DD");
  assert.equal(m[1], dl.ngay, "ngay tren banner phai la ngay sinh that");
  assert.match(html, /ngay > 7/, "phai co phep so tuoi o phia trinh duyet, khong chi in ngay ra");
  ok("banner tự biết tuổi: mang ngày sinh thật và có phép so 7 ngày");
}

/* ---- 3. Đèn sức khoẻ chỉ XANH khi cả ba con số bằng 0 ------------------- */
{
  // Đây là chỗ một bảng dễ nói dối nhất: tô xanh cho đẹp. Kiểm bằng chính dữ liệu đang có.
  const tong = dl.so.reduce((a, b) => a + (b.so ?? 0), 0);
  const xanh = /class="den xanh"/.test(html);
  assert.equal(xanh, tong === 0, `tong no = ${tong} thi den ${tong === 0 ? "phai" : "KHONG duoc"} xanh`);
  assert.equal(dl.so.length, 3, "dung ba con so, khong hon — them nua la bat nguoi xem doc bang");

  // ĐỐI CHỨNG DƯƠNG — đèn PHẢI xanh được. Trước đây một trong ba số bị đóng cứng bằng 1, nên
  // đèn không bao giờ xanh nổi dù repo sạch hết, trong khi ngay dưới nó trang vẫn viết "Đèn
  // xanh chỉ khi cả ba bằng 0". Không có ca này thì một hằng số như thế sống mãi mà không ai
  // biết: phép kiểm cũ chỉ so đèn với tổng, và tổng thì không bao giờ bằng 0.
  const sach = trang({ ...dl, so: dl.so.map((s) => ({ ...s, so: 0 })) });
  assert.match(sach, /class="den xanh"/, "ca ba so bang 0 thi den PHAI xanh — khong duoc co hang so chan duong");

  // KHÔNG ĐO ĐƯỢC ≠ SẠCH. `null` phải hiện ra dấu ?, và đèn không được xanh.
  const mu = trang({ ...dl, so: [{ so: 0, nhan: "a" }, { so: null, nhan: "b" }, { so: 0, nhan: "c" }] });
  assert.ok(!/class="den xanh"/.test(mu), "co phep do khong chay duoc thi den KHONG duoc xanh");
  assert.match(mu, /<b>\?<\/b>/, "phep do khong chay duoc phai hien dau ?, khong duoc hien so 0");
  ok(`đèn: khớp dữ liệu · xanh được khi sạch · không-đo-được thì hiện "?" chứ không thành 0`);
}

/* ---- 3b. Tài liệu viết riêng cho chủ dự án phải LÊN TRANG ---------------- */
{
  // `docs/HUONG-DAN.md` từng được đọc vào rồi không in ra tab nào: file duy nhất viết thẳng cho
  // Đức bị nuốt mất khỏi trang của Đức. Không ai thấy, vì trang vẫn đầy đủ và đẹp.
  assert.ok(dl.huongDan, "repo nay co docs/HUONG-DAN.md — neu khong thi phep kiem duoi vo nghia");
  assert.match(html, /id="huong-dan"/, "HUONG-DAN.md phai duoc in ra trang, khong duoc doc roi bo di");
  const khong = trang({ ...dl, huongDan: null });
  assert.ok(!/id="huong-dan"/.test(khong), "khong co file thi khong duoc dung khoi rong");
  ok("hướng dẫn cho chủ dự án được in ra trang, không bị nuốt");
}

/* ---- 4. Tab đầu KHÔNG được nói bằng tiếng máy --------------------------- */
{
  // Chủ dự án không đọc code. Một tab mở đầu bằng bảng `npm run` là bắt ông ấy học cú pháp
  // trước khi biết repo đang thế nào. Lệnh có chỗ của nó — ở tab "Bên trong".
  const dau = html.slice(html.indexOf('id="tab-tong-quan"'), html.indexOf('id="tab-lam-duoc-gi"'));
  assert.ok(!dau.includes("npm run"), "tab dau khong duoc chua lenh npm");
  assert.ok(!/\.mjs/.test(dau), "tab dau khong duoc chua ten file ma nguon");
  ok("tab đầu nói bằng tiếng người: không lệnh, không tên file mã nguồn");
}

/* ---- 5. Có gì thì hiện nấy — thiếu file thì mục biến mất êm ------------- */
{
  const trong = trang({ ...dl, tinhNang: null, soTay: null, baoTri: null, workflows: [], nhatKy: [] });
  assert.ok(!trong.includes('id="tab-lam-duoc-gi"'), "thieu file thi tab phai bien mat, khong de tab rong");
  assert.ok(trong.includes('id="tab-tong-quan"'), "tab tong quan luon con");
  assert.ok(trong.length > 2000, "van phai ra mot trang dung duoc, khong vo");
  ok("repo thiếu file: mục biến mất êm, trang vẫn dùng được");
}

console.log(`\n${passed} passed, 0 failed, ${passed} total`);
