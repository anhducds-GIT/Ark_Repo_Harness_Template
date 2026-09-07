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

import { gapKhoi, gomDuLieu, khoiCauTruc, khoiLienQuan, khoiMoHinh, noChuaChungMinh, tachDaXong, trang } from "../scripts/build-overview.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };
const dl = await gomDuLieu();
const html = trang(dl);

/* ---- 1. Đủ tab, và mỗi tab có phần thân của nó -------------------------- */
{
  const nut = [...html.matchAll(/data-tab="([a-z-]+)"/g)].map((m) => m[1]);
  const than = [...html.matchAll(/id="tab-([a-z-]+)"/g)].map((m) => m[1]);
  /* TRUOC 07/09 ve nay doi ">= 5 tab", va no la mot con so THAY THE cho y that: "bang khong
   * rong". Duc chot BON nhom (ADR-0006), nen con so 5 do nen — nhung go no ra roi khong thay
   * gi vao thi ve nay chi con kiem cap nut/than, tuc mot bang KHONG CO NUT NAO cung di lot.
   *
   * Nen doi con so thanh DANH SACH: bon nhom, dung ten, dung tung cai. Chat hon ">= 5" o ca
   * hai chieu — no bat ca viec thieu nhom lan viec ai do lang le them nhom thu nam. */
  /* ĐỔI TỪ BỐN SANG NĂM NHÓM — 08/09, Đức chốt, ADR-0007 bổ sung ADR-0006.
   *
   * Phép kiểm này ĐỎ khi tôi thêm tab Migrate, và nó đỏ ĐÚNG: nó sinh ra để bắt cả việc thiếu
   * nhóm lẫn việc ai đó lặng lẽ thêm nhóm thứ năm. Nên tôi sửa nó **có chủ ý và kèm một ADR**,
   * không phải sửa cho hết đỏ. Ai đọc dòng này mà không thấy ADR-0007 thì hãy nghi ngờ nó. */
  const NAM_NHOM = ["cong-viec", "he-thong", "lich-su", "migrate", "tong-quan"];
  assert.deepEqual([...new Set(nut)].sort(), NAM_NHOM,
    `bang phai co dung nam nhom (ADR-0006 + ADR-0007), dang co: ${[...new Set(nut)].join(" ")}`);
  assert.deepEqual([...new Set(nut)].sort(), [...new Set(than)].sort(),
    "moi nut tab phai co dung mot phan than — lech la bam vao thi trang trong");
  ok(`${nut.length} nhóm đúng tên, nút nào cũng có thân`);
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

/* ---- 3. Câu "chỗ đang chặn" chỉ XANH khi cả ba con số bằng 0 ------------ */
{
  // Đây là chỗ một bảng dễ nói dối nhất: tô xanh cho đẹp. Kiểm bằng chính dữ liệu đang có.
  // `null` = KHÔNG ĐO ĐƯỢC, và nó KHÔNG phải 0. Bản đầu dùng `?? 0` nên một phép đo hỏng bị
  // tính thành sạch, rồi phép kiểm đòi đèn xanh trong khi đèn (đúng) không xanh — phép kiểm
  // quay ra tố cáo chính hành vi đúng.
  //
  // ĐỔI CHỖ ĐỌC 07/09, KHÔNG ĐỔI Ý: khối "đèn sức khoẻ" bị gộp vào ba câu của Tổng quan
  // (ADR-0006), nên phép ghim này thôi đọc `class="den xanh"` và đọc `data-den` của câu thứ ba.
  // `data-den` là phán quyết MÁY ĐỌC ĐƯỢC, không phải tên lớp CSS — suy từ CSS thì đổi một lớp
  // cho đẹp là phép ghim mù, và nó mù IM LẶNG.
  const den = (h) => (/data-cau="cho-dang-chan" data-den="(\w+)"/.exec(h) || [])[1] || null;
  const doDuoc = dl.so.every((b) => typeof b.so === "number");
  const tong = dl.so.reduce((a, b) => a + (b.so ?? 0), 0);
  const sachThat = doDuoc && tong === 0 && dl.noMo.length === 0;
  assert.equal(den(html) === "xanh", sachThat,
    `${doDuoc ? `tong no = ${tong}` : "co phep do khong chay duoc"} thi cau chan ${sachThat ? "phai" : "KHONG duoc"} xanh`);
  assert.equal(dl.so.length, 3, "dung ba con so, khong hon — them nua la bat nguoi xem doc bang");

  // ĐỐI CHỨNG DƯƠNG — đèn PHẢI xanh được. Trước đây một trong ba số bị đóng cứng bằng 1, nên
  // đèn không bao giờ xanh nổi dù repo sạch hết. Không có ca này thì một hằng số như thế sống
  // mãi mà không ai biết: phép kiểm cũ chỉ so đèn với tổng, và tổng không bao giờ bằng 0.
  const sach = trang({ ...dl, so: dl.so.map((s) => ({ ...s, so: 0 })), noMo: [] });
  assert.equal(den(sach), "xanh", "ca ba so bang 0 thi cau chan PHAI xanh — khong duoc co hang so chan duong");

  // KHÔNG ĐO ĐƯỢC ≠ SẠCH, và nó phải NẶNG HƠN một con số dương: một phép đo chết thì mọi con
  // số cạnh nó đều đáng ngờ, nên nó ra ĐỎ chứ không ra vàng.
  const mu = trang({ ...dl, so: [{ so: 0, nhan: "a" }, { so: null, nhan: "b" }, { so: 0, nhan: "c" }] });
  assert.equal(den(mu), "do", "co phep do khong chay duoc thi cau chan phai ĐỎ, khong duoc xanh");
  assert.match(mu, /KHÔNG ĐO ĐƯỢC/, "phep do khong chay duoc phai NOI RA la khong do duoc, khong hien so 0");
  assert.match(trang({ ...dl, so: [{ so: 4, nhan: "a" }], noMo: [] }), /data-cau="cho-dang-chan" data-den="vang"/,
    "co no ma do duoc het thi la VANG — khong duoc lam tron ve xanh hay ve do");
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
  // MỎ NEO ĐỔI 07/09, Ý KHÔNG ĐỔI. Trước đây neo vào nhãn "đang ở đâu" của khối NOW/NEXT — khối
  // đó bị gộp vào BA CÂU (ADR-0006), nên phép kiểm đỏ với một câu lỗi không nói gì về nguyên
  // nhân. Neo mới là `data-cau`: nó là khoá máy đọc, do mã đặt tay, không đổi theo cách viết
  // nhãn tiếng Việt.
  const cau = [...dau.matchAll(/data-cau="([a-z-]+)"/g)].map((m) => m[1]);
  assert.deepEqual(cau, ["dang-lam-gi", "can-nguoi-chot", "cho-dang-chan"],
    `Tổng quan phải mở bằng ĐÚNG ba câu, đúng thứ tự — đang có: ${cau.join(" ")}`);
  const viTriLenh = dau.indexOf("npm run");
  const viTriNguoi = dau.indexOf('data-cau="dang-lam-gi"');
  assert.ok(viTriNguoi >= 0, "tab dau phai mo bang trang thai noi tieng nguoi (ba cau)");
  if (viTriLenh >= 0) {
    assert.ok(viTriNguoi < viTriLenh,
      "trang thai bang tieng nguoi phai dung TRUOC lenh dau tien tren tab mot");
  }
  assert.ok(!/\.mjs/.test(dau), "tab dau khong duoc chua ten file ma nguon");
  ok("Tổng quan mở bằng đúng 3 câu, đúng thứ tự: không lệnh, không tên file mã nguồn");
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

/* ---- 7. Trang mẹ PHẢI dẫn tới trang vệ tinh ----------------------------- */
{
  /* Khối "Trang liên quan" chưa từng có phép kiểm nào, và nó là kiểu hỏng ÂM THẦM: bản trước
     tìm chuỗi `https://claude.ai/code/artifact/`, nên khi Đức chốt (04/09) bảng ở dạng file
     HTML trong repo thì khối này rỗng VĨNH VIỄN — sổ migrate mất đường dẫn khỏi trang mẹ, mà
     trang vẫn sinh ra trông hoàn toàn bình thường. Với người chỉ mở một link, trang vệ tinh
     không có đường dẫn tới thì coi như không tồn tại. */
  assert.match(html, /Trang liên quan/, "trang me phai co khoi Trang lien quan");

  /* SỔ MIGRATE PHẢI ĐẾN ĐƯỢC — điều được ghim vẫn y nguyên, chỉ đổi đường tới.
   *
   * Tới bản 1.3.20 vế này đòi `href="SO-MIGRATE-<repo>.html"`, vì sổ migrate là một trang riêng.
   * Đức chốt 06/09: *"chỉ maintain tab Migrate"* — trang riêng thôi được nuôi, sổ nay là một TAB.
   * Nên vế đổi chỗ nhìn, KHÔNG đổi điều nó bảo vệ: sổ migrate vẫn phải có đường tới từ trang mẹ.
   * Bỏ hẳn vế này mới là làm yếu lớp bảo vệ. */
  /* ĐỔI CHỖ NHÌN LẦN THỨ BA, và mỗi lần vẫn giữ đúng MỘT điều: sổ migrate phải đến được từ
   * trang mẹ. 1.3.20: nó là một trang riêng, ghim `href="SO-MIGRATE-<repo>.html"`. 1.3.20+:
   * Đức chốt "chỉ maintain tab Migrate", nên ghim `data-tab="migrate"`. 07/09: mười tab gộp
   * thành BỐN nhóm (ADR-0006), nên sổ nay là một KHỐI trong nhóm Công việc.
   *
   * Neo vào chính KHỐI, không neo vào hình dạng điều hướng — điều hướng đã đổi ba lần, còn
   * "sổ phải đến được" thì chưa đổi lần nào. Bỏ hẳn vế này mới là làm yếu lớp bảo vệ.
   *
   * ĐỔI CHỖ NHÌN LẦN THỨ TƯ, 08/09, và vẫn giữ đúng MỘT điều đó: Đức chốt tách tab Migrate
   * (ADR-0007), và tab đó gập được — nên nhãn của khối nay là `<summary>` chứ không phải `<h2>`.
   * Nhận CẢ HAI hình dạng: một cái là nhãn khối mở, cái kia là nhãn khối gập, và ta không cần
   * biết nó đang ở dạng nào để trả lời câu *"sổ có đến được không"*. */
  assert.match(html, /<(?:h2|summary)>Sổ migrate — \d+ lượt/, "so migrate phai den duoc tu trang me");
  /* Vế này TRƯỚC 08/09 đòi sổ migrate nằm trong nhóm Công việc — đúng ADR-0006 lúc đó. Đức đảo
   * chốt đó 08/09 (ADR-0007) vì gộp lại làm nội dung migrate rải ba tab. Nên vế này đổi ĐÍCH,
   * không đổi ý: sổ vẫn phải nằm ở MỘT nhóm xác định, nay là nhóm Migrate. Đích cụ thể được đo
   * kỹ hơn ở ca "tab Migrate" phía dưới — vế ở đây chỉ giữ chỗ để câu chuyện đọc liền mạch. */
  assert.match(html, /id="tab-migrate"[\s\S]*<(?:h2|summary)>Sổ migrate/, "so migrate phai nam trong nhom Migrate");
  assert.match(html, /Sổ migrate — \d+ lượt/, "tab migrate phai co than bai that, khong phai mot cai tab rong");

  // Link chết còn tệ hơn không link: chỉ nhận trang CÓ THẬT trong HEAD.
  assert.equal(khoiLienQuan([["Sổ giả", "[so-gia.html](so-gia.html)"]], new Set()), "",
    "file khong co trong HEAD thi KHONG duoc len trang me");
  // Tên file viết trong câu văn không phải liên kết — không được lọt.
  assert.equal(khoiLienQuan([["Sinh trang", "npm run overview -- <file-tam.html>"]], new Set(["file-tam.html"])), "",
    "ten file trong cau van khong phai lien ket markdown, khong duoc lot");
  // Trang mẹ tự trỏ về mình trong mục "trang liên quan" là nhiễu.
  assert.equal(khoiLienQuan([["Trang mẹ", "[DASHBOARD-Ark-Repo-Harness.html](DASHBOARD-Ark-Repo-Harness.html)"]],
    new Set(["DASHBOARD-Ark-Repo-Harness.html"])), "", "trang me khong duoc tu tro ve minh");
  // ĐỐI CHỨNG DƯƠNG: đủ điều kiện thì PHẢI ra link, không thì một hàm luôn trả "" cũng qua hết.
  assert.match(khoiLienQuan([["Sổ thật", "[X.html](X.html)"]], new Set(["X.html"])), /href="X\.html"/,
    "co lien ket markdown va file co that thi PHAI ra link");
  ok("trang mẹ dẫn tới sổ migrate, và chỉ dẫn tới trang có thật");
}

/* ---- Tab "Đã xong": chiếu việc ĐÃ ĐÓNG, và chỉ việc đã đóng ------------- */
{
  /* VÌ SAO TAB NÀY ĐÁNG CÓ: bảng vốn chỉ chiếu thứ ĐANG mở — việc còn lại, nợ còn treo, chỗ chờ
     người chốt. Người chốt nhìn mãi một danh sách việc chưa xong thì không thấy repo đang tiến,
     chỉ thấy nó đang nợ. Việc đã đóng vốn nằm sẵn trong sổ, chỉ là không ai chiếu ra.
     ĐỌC ĐÚNG DẤU CỦA SỔ (gạch mã), cùng dấu mà `what-next.mjs` đọc — hai chỗ đọc một dấu thì
     không trôi khỏi nhau. */
  const so = [
    "## P1",
    "### ~~AA-1~~ · viec da dong han",
    "### AA-2 · viec CON MO",
    "## P3",
    "### ~~AA-3~~ · viec da dong o nhom khac",
    "van xuoi noi rang AA-9 da xong roi",
  ].join(String.fromCharCode(10));

  const ra = tachDaXong(so);
  assert.equal(ra.length, 2, `chi duoc lay muc DA GACH MA, dang lay ${ra.length}`);
  assert.deepEqual(ra.map((v) => v.ma), ["AA-1", "AA-3"]);
  // VE DOI CHUNG, va khong co no thi ve tren vo nghia: viec CON MO khong duoc lot vao.
  assert.ok(!ra.some((v) => v.ma === "AA-2"), "viec con mo KHONG duoc hien o tab da-xong");
  // Van xuoi noi "da xong" cung khong duoc tinh — chi dau gach ma moi tinh.
  assert.ok(!ra.some((v) => v.ma === "AA-9"), "van xuoi KHONG duoc tinh la da dong");
  // Uu tien luc mo phai theo dung nhom no nam duoi.
  assert.equal(ra[0].uuTien, "P1");
  assert.equal(ra[1].uuTien, "P3");
  assert.deepEqual(tachDaXong(""), [], "so rong -> khong co gi, khong duoc no");

  ok("tab Đã xong: chỉ lấy mục đã gạch mã, việc còn mở và văn xuôi không lọt");
}

/* ---- Hai vai Assistant: SỐ phải suy từ repo, CHỮ mới được gõ tay ------------
 *
 * Vì sao ghim đúng chỗ này: khối hai vai là khối duy nhất của trang trộn hai loại nội dung —
 * trách nhiệm từng vai là QUYẾT ĐỊNH của Đức (gõ tay, đúng), còn mỗi thẻ vai phải chở một con số
 * ĐO ĐƯỢC. Kiểu hỏng đắt nhất ở đây không phải trang vỡ mà là ai đó gõ cứng con số cho nhanh:
 * lúc đó trang vẫn đẹp, vẫn đủ chữ, và **nói sai về một bộ khung không còn tồn tại**. Một phép
 * kiểm chỉ dò "có chuỗi Vai ① không" thì KHÔNG bắt được ca đó.
 *
 * Nên vế chịu tải là: đổi ĐẦU VÀO thì con số trên trang phải đổi theo. Gõ cứng là ĐỎ.
 */
{
  const a = khoiMoHinh({ lenh: new Array(7).fill("x"), protocols: [{ tieuDe: "A" }],
    dichDen: [{ ten: "r1" }], soPhepKiem: 11 });
  const b = khoiMoHinh({ lenh: new Array(23).fill("x"), protocols: [{ tieuDe: "A" }, { tieuDe: "B" }],
    dichDen: [{ ten: "r1" }, { ten: "r2" }, { ten: "r3" }], soPhepKiem: 40 });

  assert.ok(a.includes("Vai ①") && a.includes("Vai ②"), "khối phải có đủ hai vai");
  assert.ok(a.includes("<b>7</b> lệnh và <b>11</b> suite"), "Vai ① phải chở số lệnh/suite của ĐẦU VÀO");
  assert.ok(b.includes("<b>23</b> lệnh và <b>40</b> suite"), "đổi đầu vào thì số Vai ① phải đổi theo");
  assert.ok(a.includes("<b>1</b> quy trình lên <b>1</b> repo đích"), "Vai ② phải chở số quy trình/repo đích");
  assert.ok(b.includes("<b>2</b> quy trình lên <b>3</b> repo đích"), "đổi đầu vào thì số Vai ② phải đổi theo");

  // RANH GIỚI CHỊU TẢI, không phải trang trí: Vai ② phát hiện, Vai ① sửa. Gộp lại thì người tìm
  // ra lỗi tự chấm bản sửa của mình. Câu đó mất khỏi trang là mất chính lý do có hai vai.
  const iPhat = a.indexOf("Vai ② được");
  const iSua = a.indexOf("Vai ① được");
  assert.ok(iPhat > 0 && iSua > iPhat, "trang phải nói rõ Vai ② phát hiện rồi Vai ① sửa, đúng thứ tự đó");

  // Và nó phải nằm CHUNG khối với mô hình ba khối — tách ra là hai trang lệch nhau về sau.
  assert.ok(a.includes("Mô hình vận hành — ba khối") && a.includes("Hai vai Assistant"),
    "hai vai phải ở cùng khối với mô hình ba khối, không thành khối rời");

  // Đầu vào RỖNG không được nổ: trang phải sinh được cả khi repo chưa có protocol/repo đích nào.
  const trong = khoiMoHinh({});
  assert.ok(trong.includes("Vai ①") && trong.includes("Vai ②"), "repo trống vẫn phải ra đủ hai vai");

  ok("hai vai Assistant: chữ là quyết định, số suy từ repo — gõ cứng số là đỏ");
}

/* ---- Tab Hệ thống: khối gập được, và bộ chuyển KHÔNG lặn vào khối đã gập ----
 *
 * Đức nêu 08/09: tab Hệ thống scroll quá dài. Chốt: 9 khối mở cứng thành khối gập, cả tab xếp
 * vào một lưới tự co. Ba kiểu hỏng phải canh, và cái thứ hai đã xảy ra thật:
 *
 *  ⓐ Bộ chuyển KHÔNG chuyển gì (im lặng no-op) → tab vẫn dài, mà không ai thấy gì sai.
 *  ⓑ Bộ chuyển LẶN VÀO một <details> đã có và chuyển cả khối con → khối "Mô hình vận hành" hiện
 *    HAI nhãn. Trang không vỡ, nó chỉ nói lặp — nên lỗi này đi qua được mắt.
 *  ⓒ Bộ chuyển ĂN MẤT nội dung khi đầu vào không khớp hình dạng. Fail-open là có chủ ý: khối
 *    không khớp phải GIỮ NGUYÊN (vẫn mở, tức đúng hành vi cũ), tuyệt đối không biến mất.
 */
{
  // ⓐ chuyển được đầu ra của hàm sinh THẬT, không phải chuỗi tự bịa
  const goc = khoiCauTruc([{ ten: "docs/", steward: "_docs" }], [{ ten: "AGENTS.md" }], []);
  const daGap = gapKhoi(goc);
  assert.ok(/<div class="the/.test(goc), "hàm sinh thật phải trả về khối mở — nếu không, ca này vô nghĩa");
  assert.equal((daGap.match(/<div class="the/g) || []).length, 0, "mọi khối mở ở tầng ngoài phải thành khối gập");
  assert.ok((daGap.match(/<details class="the gap/g) || []).length >= 1, "phải sinh ra details.the.gap");
  assert.equal((daGap.match(/<details/g) || []).length, (daGap.match(/<\/details>/g) || []).length,
    "thẻ details phải cân");
  assert.ok(!/<h2/.test(daGap), "h2 phải thành summary, không được còn cả hai");

  // ⓑ KHÔNG lặn vào <details> đã có. Đây là lỗi đã xảy ra thật, nên ca này là ca chịu tải.
  const daCoSan = `<details class="the gap"><summary>Nhãn ngoài</summary><div class="the"><h2>Nhãn trong</h2><p>x</p></div></details>`;
  const sau = gapKhoi(daCoSan);
  assert.equal(sau, daCoSan, "khối đã gập phải được chép NGUYÊN — không chuyển khối con bên trong");
  assert.equal((sau.match(/<summary>/g) || []).length, 1, "không được sinh nhãn thứ hai cho cùng một khối");

  // ⓒ fail-open: không có h2, hoặc thẻ không cân → giữ nguyên từng byte, không ăn mất nội dung
  const khongNhan = `<div class="the"><p>không có h2</p></div>`;
  assert.equal(gapKhoi(khongNhan), khongNhan, "khối không có nhãn phải giữ nguyên");
  const khongCan = `<div class="the"><h2>Nhãn</h2><p>thiếu thẻ đóng`;
  assert.ok(gapKhoi(khongCan).includes("thiếu thẻ đóng"), "thẻ không cân vẫn phải giữ được nội dung");
  assert.equal(gapKhoi(""), "", "chuỗi rỗng không được nổ");

  // moSan mở đúng khối được gọi tên, và KHÔNG mở khối khác
  const mo = gapKhoi(goc, { moSan: ["Thư mục ở tầng ngoài cùng"] });
  assert.equal((mo.match(/ open>/g) || []).length, 1, "moSan phải mở đúng MỘT khối được gọi tên");

  // Và tab Hệ thống của trang thật phải thực sự dùng lưới — không thì CSS ngồi đó vô tác dụng.
  const tabHT = html.slice(html.indexOf('id="tab-he-thong"'));
  assert.ok(tabHT.slice(0, 4000).includes('<div class="xep">'), "tab Hệ thống phải bọc trong lưới .xep");
  assert.ok(html.includes(".xep > details.the[open]{grid-column:1/-1}"),
    "phải có quy tắc cho khối đang mở chiếm cả hàng — không thì bảng bên trong bị bóp còn 1/3");

  ok("tab Hệ thống: khối mở thành khối gập, xếp lưới, và bộ chuyển không lặn vào khối đã gập");
}

/* ---- Tab Migrate: nội dung migrate KHÔNG được nằm rải ba tab ----------------
 *
 * Đức nêu 08/09: *"việc compact không làm dễ làm việc hơn mà còn trộn nội dung"*. Đo lúc đó:
 * sổ migrate ở tab Công việc, quy trình migrate ở tab Hệ thống — hai nửa của một việc, hai chỗ.
 *
 * Kiểu hỏng phải canh: ai đó sau này gom lại *"cho gọn bảng"*, và nó **trông vẫn đẹp** — mọi
 * khối vẫn đủ, chỉ là người làm migrate lại phải mở hai tab. Nên vế dưới không đo *"có tab
 * migrate không"* (quá dễ đạt) mà đo **hai nửa đó nằm CÙNG một tab**.
 */
{
  const catTab = (h) => {
    const ids = [...h.matchAll(/id="tab-([a-z-]+)"/g)].map((m) => ({ t: m[1], i: m.index }));
    const o = {};
    ids.forEach((x, k) => { o[x.t] = h.slice(x.i, k + 1 < ids.length ? ids[k + 1].i : h.length); });
    return o;
  };
  const T = catTab(html);
  assert.ok(T.migrate, "phai co tab migrate");

  // HAI NỬA CỦA MỘT VIỆC phải cùng tab: quy trình migrate, và sổ ba lượt migrate.
  assert.ok(T.migrate.includes("wf-02-dua-repo-cu-len-chuan"),
    "quy trinh migrate phai o tab Migrate");
  assert.ok(!T["he-thong"].includes("wf-02-dua-repo-cu-len-chuan"),
    "quy trinh migrate KHONG duoc con nam o tab He thong — do la nua bi tach ra");
  assert.ok(/so-migrate|Sổ migrate/.test(T.migrate), "so migrate phai o tab Migrate");
  assert.ok(!/id="so-migrate"/.test(T["cong-viec"]),
    "so migrate KHONG duoc con nam o tab Cong viec");

  // CHIA THEO DỮ LIỆU, KHÔNG THEO TÊN FILE. Đổi tên file thì tab phải vẫn đúng.
  const wMigrate = dl.workflows.filter((w) => String(w.fm.nhom || "").trim() === "migrate");
  assert.equal(wMigrate.length, 1, "dung mot workflow khai nhom: migrate — neu 0 thi tab Migrate rong");
  assert.ok(dl.workflows.length > wMigrate.length,
    "phai con workflow khac o tab He thong, neu khong thi phep kiem duoi vo nghia");

  // Tab Migrate cũng phải gập được và xếp lưới, như tab Hệ thống — cùng một cách đối xử.
  assert.ok(T.migrate.includes('<div class="xep">'), "tab Migrate phai xep luoi");
  assert.ok(/ open>/.test(T.migrate), "tab Migrate phai mo san khoi quy trinh — vao tab do la de lam migrate");

  // Và bộ vẽ workflow phải là MỘT bản. Trước 08/09 có hai, một bản chưa bao giờ được gọi.
  const nguon = fs.readFileSync(path.join(ROOT, "scripts", "build-overview.mjs"), "utf8");
  assert.equal((nguon.match(/const veWorkflow = /g) || []).length, 1,
    "chi duoc MOT bo ve workflow — hai ban thi luot sau sua nham vao ban chet");
  assert.ok(!/const tabWorkflow =/.test(nguon), "ban ve workflow da chet phai bi xoa, khong de lai");

  ok("tab Migrate: hai nửa của một việc về cùng một tab, chia theo dữ liệu chứ không theo tên file");
}

console.log(`\n${passed} passed, 0 failed, ${passed} total`);
