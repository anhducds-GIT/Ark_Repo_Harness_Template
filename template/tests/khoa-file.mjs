/* PHÉP GHIM CHO KHOÁ MỨC FILE — giữ ngắn, trả ngay.
 *
 * Đức chốt 2026-09-08: *"AI Assistant chỉ giữ khóa đúng ở file mà AI đó đang sửa … Nếu chỉ đọc
 * ko cần giữ khóa."* Cơ chế chạy thật ở một repo TIÊU THỤ trước, rồi mang lên đây — nơi
 * phát hành — để mọi repo cùng có. (Tên repo đó cố ý không nêu: bản trích đi tới repo của người
 * khác, và tên riêng của một repo nguồn trong đó là nhiễu.)
 *
 * ĐO Ở CHÍNH REPO NÀY, không mượn số của họ (7 ngày · 384 commit · 381 có nhãn `Lane:` · 41 lane):
 *   620 cặp commit khác lane, cách nhau <= 1h, CÙNG VÙNG
 *   ├ 265 (43%) dùng chung ít nhất một FILE  → khoá file KHÔNG gỡ được
 *   └ 355 (57%) khác file hoàn toàn          → khoá file GỠ ĐƯỢC
 *   file/commit: trung vị 3 · p90 12 · p99 30 · max 42
 *
 * Đây là cơ chế ĐA PHIÊN, nên `MULTIFLOW.md` mục 5 bắt phải có đột biến kiểm. Danh sách đột
 * biến đã chạy nằm ở CUỐI file.
 *
 * MỌI VẾ Ở ĐÂY DÙNG HÀM THUẦN, không chạm đĩa — nên chúng chạy ở repo nào cũng được, kể cả repo
 * vừa dựng chưa có bảng quyền. Đó là chủ ý: ba lần trong ngày 08/09 một phép ghim viết ở nơi
 * phát hành đã đỏ oan ở repo tiêu thụ vì nó soi thứ chỉ nơi phát hành mới có.
 */

import assert from "node:assert/strict";

import {
  chuanDuongDan, EXIT, khoaFileQuaHan, khoaFileTrongVung, MIEN_KHOA,
  PHUT_NHAC_KHOA_FILE, quyetDinhSua, quyetDinhXong, soatDanHang,
} from "../scripts/claim.mjs";

let so = 0;
const ok = (t) => { so += 1; console.log(`  ok  ${t}`); };
const LUC = "2026-09-08T10:00:00.000Z";
// Bản đồ vùng giả, đủ đơn giản để đọc: mọi thứ dưới `scripts/` và `tests/` là `_code`.
const vungCua = (d) => (d.startsWith("scripts/") || d.startsWith("tests/") ? "_code" : "_root");

/* ---- 1. Nhận và trả một khoá file --------------------------------------- */
{
  const trong = { claims: {}, tam: {} };
  const a = quyetDinhSua(trong, { duongDan: "scripts/x.mjs", as: "lane-a", luc: LUC, vungCua });
  assert.equal(a.code, EXIT.OK);
  assert.deepEqual(a.next["scripts/x.mjs"], { owner: "lane-a", luc: LUC });

  // Nhận lại chính file mình đang giữ: KHÔNG phải lỗi. Một lượt sửa dài có thể gọi hai lần, và
  // bắt nó đỏ là dạy người ta bỏ qua lệnh.
  const lai = quyetDinhSua({ claims: {}, tam: a.next }, { duongDan: "scripts/x.mjs", as: "lane-a", luc: LUC, vungCua });
  assert.equal(lai.code, EXIT.OK);
  assert.equal(lai.already, true);

  const b = quyetDinhXong({ claims: {}, tam: a.next }, { duongDan: "scripts/x.mjs", as: "lane-a" });
  assert.equal(b.code, EXIT.OK);
  /* XOÁ HÀNG, không để `owner: null`. Khoá file là tạm; giữ hàng trống thì sau một ngày bảng
     đầy xác đường dẫn và không ai đọc nổi nó. Đây là chỗ khác hẳn khoá VÙNG — khoá vùng giữ
     hàng vì hàng đó khai một vùng có thật, tồn tại cả khi vô chủ. */
  assert.ok(!Object.hasOwn(b.next, "scripts/x.mjs"), "tra khoa file thi XOA HANG, khong de owner: null");
  assert.deepEqual(Object.keys(b.next), []);
  ok("1 · nhận · nhận lại không lỗi · trả thì XOÁ HÀNG chứ không để vỏ rỗng");
}

/* ---- 2. Không giành, không trả hộ --------------------------------------- */
{
  const bang = { claims: {}, tam: { "scripts/x.mjs": { owner: "lane-a", luc: LUC } } };
  const gianh = quyetDinhSua(bang, { duongDan: "scripts/x.mjs", as: "lane-b", luc: LUC, vungCua });
  assert.equal(gianh.code, EXIT.REFUSED);
  assert.match(gianh.message, /TU_CHOI_SUA/);
  assert.match(gianh.message, /lane-a/, "phai NEU TEN ai dang giu — khong noi ten thi khong biet hoi ai");

  const traHo = quyetDinhXong(bang, { duongDan: "scripts/x.mjs", as: "lane-b" });
  assert.equal(traHo.code, EXIT.REFUSED);
  assert.match(traHo.message, /KHÔNG trả hộ/);

  // Trả một file KHÔNG ai giữ: không phải lỗi. `--xong --het` gọi hàng loạt, và một cái đã trả
  // rồi không được làm hỏng cả mẻ.
  const traTrong = quyetDinhXong({ claims: {}, tam: {} }, { duongDan: "scripts/y.mjs", as: "lane-b" });
  assert.equal(traTrong.code, EXIT.OK);
  ok("2 · không giành file người khác · không trả hộ · trả file không ai giữ thì im lặng cho qua");
}

/* ---- 3. CHỨA NHAU HAI CHIỀU — thiếu một chiều là hai lane cùng tin mình đúng --- */
{
  /* Chiều MỘT: vùng có chủ khác → khoá file bị từ chối. Giữ cả vùng nghĩa là được ghi mọi file
     trong đó; khoá file không chen vào giữa được. */
  const coChuVung = { claims: { _code: { owner: "lane-a" } }, tam: {} };
  const c1 = quyetDinhSua(coChuVung, { duongDan: "scripts/x.mjs", as: "lane-b", luc: LUC, vungCua });
  assert.equal(c1.code, EXIT.REFUSED);
  assert.match(c1.message, /nằm trong vùng "_code"/);
  // Nhưng CHÍNH CHỦ vùng thì khoá file được — không thì người giữ vùng tự chặn mình.
  assert.equal(quyetDinhSua(coChuVung, { duongDan: "scripts/x.mjs", as: "lane-a", luc: LUC, vungCua }).code, EXIT.OK);

  /* Chiều HAI: bên trong vùng còn khoá file của người khác → nhận cả vùng bị từ chối. */
  const coKhoaFile = { claims: {}, tam: { "scripts/x.mjs": { owner: "lane-a", luc: LUC }, "README.md": { owner: "lane-a", luc: LUC } } };
  const vuong = khoaFileTrongVung(coKhoaFile, "_code", "lane-b", vungCua);
  assert.deepEqual(vuong, [{ duongDan: "scripts/x.mjs", owner: "lane-a" }],
    "chi ke file TRONG vung do — README.md thuoc _root, khong duoc keo vao");
  // Khoá của CHÍNH MÌNH không chặn mình nhận cả vùng.
  assert.deepEqual(khoaFileTrongVung(coKhoaFile, "_code", "lane-a", vungCua), []);
  ok("3 · chứa nhau HAI chiều: vùng chặn file · file chặn vùng · và chính chủ không tự chặn mình");
}

/* ---- 4. Quá hạn thì NÊU TÊN, tuyệt đối không tự nhả --------------------- */
{
  const now = Date.parse("2026-09-08T11:00:00.000Z");           // một tiếng sau LUC
  const bang = { claims: {}, tam: {
    "scripts/cu.mjs": { owner: "lane-a", luc: LUC },              // 60 phút
    "scripts/moi.mjs": { owner: "lane-a", luc: "2026-09-08T10:55:00.000Z" }, // 5 phút
    "scripts/hong.mjs": { owner: "lane-a", luc: "khong-phai-moc" },
  } };
  const qua = khoaFileQuaHan(bang, PHUT_NHAC_KHOA_FILE, now);
  assert.deepEqual(qua.map((x) => x.duongDan), ["scripts/cu.mjs"]);
  assert.equal(qua[0].phut, 60);
  /* MỐC ĐỌC KHÔNG RA thì KHÔNG nêu — đoán bừa một con số còn tệ hơn im lặng. Repo tiêu thụ vấp
     đúng chỗ này theo hướng ngược: mốc của họ thiếu chữ `Z`, `Date.parse` trần đọc thành giờ
     địa phương, và một khoá vừa nhận 1 phút bị báo "420 phút — quên trả?". Một cái ⚠ sai vài
     lần thì lần thứ ba không ai nhìn nữa. */
  assert.ok(!qua.some((x) => x.duongDan === "scripts/hong.mjs"), "moc doc khong ra thi KHONG neu, khong doan");

  /* VÀ HÀM NÀY KHÔNG ĐƯỢC ĐỘNG VÀO BẢNG. Tự nhả là tự động hoá đúng vụ nhả-khoá-hộ 06/09 —
     lần đó một người làm, và một lane mất phần đã xong; nếu máy làm thì không ai kịp thấy. */
  assert.equal(Object.keys(bang.tam).length, 3, "khoaFileQuaHan chi DOC — no khong duoc nha bat cu thu gi");
  ok(`4 · quá ${PHUT_NHAC_KHOA_FILE} phút thì nêu tên · mốc hỏng thì im · và KHÔNG tự nhả`);
}

/* ---- 5. Soát file đã dàn — thứ khoá file KHÔNG chữa được ---------------- */
{
  /* Khoá không giữ file, GIT giữ. Hai lane chung một cây làm việc nên `git commit -a` vẫn cuốn
     file lane khác vừa dàn. Khoá vùng trước đây SERIAL HOÁ hai lane nên lỗi đó ít có dịp nổ;
     khoá file bỏ đúng sự serial hoá ấy, nên nó nổ DÀY HƠN. Đây là thứ mua lại. */
  const chung = {
    tam: { "scripts/cua-toi.mjs": { owner: "toi", luc: LUC } },
    claims: { _root: { owner: "nguoi-khac" } },
    as: "toi",
    mienKhoa: MIEN_KHOA,
    maySinh: ["DASHBOARD.md", ".agents/claims.json"],
    vungCua,
  };
  const kq = soatDanHang({ ...chung, daDan: [
    "scripts/cua-toi.mjs",   // tôi khoá → im
    "scripts/la.mjs",        // không khoá, vùng _code vô chủ → LẠ
    "README.md",             // vùng _root do người khác giữ → LẠ
    "HANDOFF.md",            // sổ miễn khoá → nêu tên, không chặn
    "DASHBOARD.md",          // artifact máy sinh → bỏ qua HẲN
    ".agents/claims.json",   // hành chính → bỏ qua HẲN
  ] });
  assert.deepEqual(kq.la.map((x) => x.duongDan), ["scripts/la.mjs", "README.md"]);
  assert.deepEqual(kq.soChung, ["HANDOFF.md"]);
  /* ARTIFACT MÁY SINH PHẢI ĐI QUA IM LẶNG. Bỏ sót danh sách này làm phép soát BÁO OAN ngay lượt
     dùng thật đầu tiên ở repo tiêu thụ (08/09): nó chặn ba artifact mà luật khai rõ là KHÔNG đòi
     khoá nào — không có gì của ai trong đó để mất, chạy lại bộ sinh là ra y hệt. Một cỗ máy dựng
     ra để chống chặn oan mà tự chặn oan thì nó bị bỏ qua trong một ngày. */
  assert.ok(!kq.la.some((x) => x.duongDan === "DASHBOARD.md"), "artifact may sinh KHONG duoc bao oan");
  assert.ok(!kq.soChung.includes("DASHBOARD.md"), "artifact may sinh cung khong duoc neu ten — no khong phai so");

  // Giữ CẢ VÙNG thì mọi file trong vùng đều im.
  const giuVung = soatDanHang({ ...chung, claims: { _code: { owner: "toi" } }, daDan: ["scripts/la.mjs"] });
  assert.deepEqual(giuVung.la, []);
  ok("5 · soát: file lạ NÊU · sổ miễn khoá nêu-không-chặn · artifact máy sinh im · giữ cả vùng thì im");
}

/* ---- 6. Chuẩn hoá đường dẫn và cửa từ chối đường dẫn lạ ----------------- */
{
  assert.equal(chuanDuongDan("./scripts/x.mjs"), "scripts/x.mjs");
  assert.equal(chuanDuongDan("scripts\\x.mjs"), "scripts/x.mjs", "gach nguoc cua Windows phai ve gach xuoi");
  assert.equal(chuanDuongDan("  scripts/x.mjs/  "), "scripts/x.mjs");
  for (const la of ["", "   ", "../ngoai.md", "a/../../b"]) {
    const r = quyetDinhSua({ claims: {}, tam: {} }, { duongDan: la, as: "x", luc: LUC, vungCua });
    assert.equal(r.code, EXIT.MISUSE, `duong dan la phai bi tu choi: ${JSON.stringify(la)}`);
  }
  /* `..` chỉ bị cấm khi nó là MỘT ĐOẠN đường dẫn. Cấm theo chuỗi con thì một thư mục tên hợp lệ
     như `docs/a..b/` cũng bị chặn — chặn oan, và chặn oan thì người ta đi vòng qua lệnh. */
  assert.equal(quyetDinhSua({ claims: {}, tam: {} }, { duongDan: "docs/a..b/c.md", as: "x", luc: LUC, vungCua }).code,
    EXIT.OK, "hai cham GIUA ten thu muc khong phai la di ra ngoai repo");
  ok("6 · chuẩn hoá đường dẫn · rỗng và `..` bị từ chối · nhưng `a..b` thì không bị chặn oan");
}

/* BỐN ĐỘT BIẾN ĐÃ CHẠY THẬT trên máy, cả bốn bị bắt (bộ ghim này + cổng đóng phiên):
 *
 *  1. `quyetDinhXong` đặt `owner: null` thay vì xoá hàng          → vế 1 đỏ
 *  2. bỏ chiều MỘT (không xét chủ vùng trong `quyetDinhSua`)      → vế 3 đỏ
 *  3. bỏ chiều HAI (`khoaFileTrongVung` luôn trả `[]`)            → vế 3 đỏ
 *  4. `khoaFileQuaHan` tự `delete` khoá quá hạn                   → vế 4 đỏ
 *
 * Và HAI cửa chạy thật ở repo này, không phải hàm thuần:
 *  · lane khác `--take _code` khi tôi đang khoá 2 file bên trong  → TU_CHOI_NHAN_VUNG
 *  · còn treo một khoá file lúc chạy cổng                          → mục "Khoá file đã trả hết" ĐỎ
 */

console.log(`khoa-file: ${so} vế xanh`);
