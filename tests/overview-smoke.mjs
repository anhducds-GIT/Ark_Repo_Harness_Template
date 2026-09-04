/* PHÉP KIỂM BẢNG TỔNG QUAN.
 *
 * Bảng này là thứ chủ dự án mở ra xem, và ông ấy không đọc code — nên kiểu hỏng đắt nhất không
 * phải trang vỡ (thấy ngay) mà là **trang nói sai một cách trông rất bình thường**: số cũ, mục
 * biến mất, hoặc đèn xanh trong khi repo đang nợ.
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { gomDuLieu, noChuaChungMinh, trang } from "../scripts/build-overview.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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
  // `null` = KHÔNG ĐO ĐƯỢC, và nó KHÔNG phải 0. Bản đầu dùng `?? 0` nên một phép đo hỏng bị
  // tính thành sạch, rồi phép kiểm đòi đèn xanh trong khi đèn (đúng) không xanh — phép kiểm
  // quay ra tố cáo chính hành vi đúng.
  const doDuoc = dl.so.every((b) => typeof b.so === "number");
  const tong = dl.so.reduce((a, b) => a + (b.so ?? 0), 0);
  const sachThat = doDuoc && tong === 0;
  const xanh = /class="den xanh"/.test(html);
  assert.equal(xanh, sachThat, `${doDuoc ? `tong no = ${tong}` : "co phep do khong chay duoc"} thi den ${sachThat ? "phai" : "KHONG duoc"} xanh`);
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
  // CON SỐ PHẢI ĐƯỢC ĐO, KHÔNG ĐƯỢC GÕ TAY. Ba ca trên chỉ kiểm phần VẼ, nên một hằng số nằm ở
  // phần ĐO vẫn sống sót — đã chứng minh bằng một lượt thử phá: đóng cứng lại số 1 mà không
  // phép kiểm nào đỏ. Nên phải gọi thẳng vào phép đo.
  assert.equal(noChuaChungMinh("active"), 0, "dang chay thi phai la 0 — neu khong den khong bao gio xanh noi");
  assert.equal(noChuaChungMinh("archived"), 0, "da nghi cung khong con la viec chua chung minh");
  assert.equal(noChuaChungMinh("building"), 1, "dang dung thi van la mot viec chua chung minh");
  assert.equal(noChuaChungMinh("idea"), 1);
  assert.equal(noChuaChungMinh(undefined), null, "khong khai lifecycle = KHONG DO DUOC, khong phai 0");
  ok(`đèn: khớp dữ liệu · xanh được khi sạch · "?" khi không đo được · số được ĐO chứ không gõ tay`);
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
  // Chủ dự án không đọc code. Một tab MỞ ĐẦU bằng bảng `npm run` là bắt ông ấy học cú pháp
  // trước khi biết repo đang thế nào.
  //
  // Bản đầu cấm hẳn mọi lệnh ở tab một. Cấm thế là quá tay: Đức sau đó nói ngược lại — việc
  // hay dùng nhất phải nằm ngay trang đầu, đừng bắt cuộn đi tìm. Luật ĐÚNG không phải "không
  // có lệnh" mà là "KHÔNG MỞ ĐẦU bằng lệnh": trạng thái nói bằng tiếng người trước, lệnh sau.
  // Cắt tới <section> KẾ TIẾP, không cắt tới một id cụ thể: thứ tự nút tab đổi được, còn thứ
  // tự thân bài thì không — cắt theo id là phép kiểm tự vỡ mỗi lần sắp lại tab.
  const batDau = html.indexOf('id="tab-tong-quan"');
  const ketThuc = html.indexOf("<section", batDau + 10);
  const dau = html.slice(batDau, ketThuc < 0 ? html.length : ketThuc);
  const viTriLenh = dau.indexOf("npm run");
  const viTriNguoi = dau.indexOf("đang ở đâu");
  assert.ok(viTriNguoi >= 0, "tab dau phai mo bang trang thai noi tieng nguoi (NOW/NEXT)");
  if (viTriLenh >= 0) {
    assert.ok(viTriNguoi < viTriLenh,
      "trang thai bang tieng nguoi phai dung TRUOC lenh dau tien tren tab mot");
  }
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

/* ---- 6. Trang suy từ HEAD, KHÔNG suy từ đồng hồ ------------------------- */
{
  /* Vì sao ca này đắt hơn nó trông: từ 04/09 trang được COMMIT và nằm trong khối `generators`,
     nên cổng chạy `--check-head` mỗi phiên. Một dòng `new Date()` lẻn về là sang ngày hôm sau
     bản sinh lại lệch bản đã commit **dù không dữ liệu nào đổi**, cổng đỏ, và MỌI phiên bị
     chặn đẩy vì một ngày đã trôi qua. Đó là kiểu hỏng làm tê cả repo mà không ai lần ra.

     ĐỐI CHỨNG DƯƠNG dựng bằng một worktree ở commit CŨ, kèm `scripts/` hiện tại chép đè: nội
     dung đọc từ HEAD cũ, mã thì là mã đang xét. Mốc phải là ngày của commit cũ. Nếu ai đó
     đưa đồng hồ trở lại, mốc sẽ ra HÔM NAY và ca này đỏ. So `dl.ngay` với `mocHEAD()` thì
     không bắt được gì cả — hai vế cùng một dòng code. */
  // Lấy commit gần nhất có NGÀY KHÁC ngày HEAD — không lùi một số commit cố định. Repo này
  // có ngày 127 commit, nên "lùi 25 commit" vẫn nằm nguyên trong hôm nay và ca kiểm tự vô hiệu.
  const dong = execFileSync("git", ["log", "--format=%H %cd", "--date=format:%Y-%m-%d", "-n", "400"],
    { cwd: ROOT, encoding: "utf8" }).split("\n").map((l) => l.trim()).filter(Boolean);
  const khac = dong.map((l) => l.split(" ")).find(([, d]) => d !== dl.ngay);
  assert.ok(khac, "can mot commit KHAC ngay HEAD, khong thi ca nay khong chung minh gi");
  const [cu, ngayCu] = khac;

  const noi = fs.mkdtempSync(path.join(os.tmpdir(), "ark-moc-"));
  const cay = path.join(noi, "cay");
  try {
    execFileSync("git", ["worktree", "add", "--detach", cay, cu], { cwd: ROOT, stdio: "ignore" });
    fs.cpSync(path.join(ROOT, "scripts"), path.join(cay, "scripts"), { recursive: true });
    const ra = path.join(noi, "thu.html");
    execFileSync(process.execPath, [path.join(cay, "scripts", "build-overview.mjs"), ra], { stdio: "ignore" });
    const m = fs.readFileSync(ra, "utf8").match(/data-sinh="([0-9-]{10})"/);
    assert.ok(m, "trang sinh o worktree phai co dau sinh");
    assert.equal(m[1], ngayCu,
      `moc phai la ngay cua commit dang doc (${ngayCu}), khong phai ngay tren dong ho (${dl.ngay})`);
    ok(`mốc suy từ HEAD: đọc commit ${cu.slice(0, 7)} thì ra ${ngayCu}, không ra ngày hôm nay`);
  } finally {
    try { execFileSync("git", ["worktree", "remove", "--force", cay], { cwd: ROOT, stdio: "ignore" }); } catch (_) { /* dọn được thì tốt */ }
    fs.rmSync(noi, { recursive: true, force: true });
  }
}

console.log(`\n${passed} passed, 0 failed, ${passed} total`);
