/* ĐỘI HÌNH — phép ghim.
 *
 * Lệnh này trả lời câu *"repo nào đang tụt lại"*, và nó là câu **chỉ repo nhà trả lời được**.
 * Nên cái đắt nhất ở đây không phải con số đúng — mà là **không bao giờ báo khoẻ cho một repo
 * chưa đo được**. Một dòng biến mất khỏi bảng đọc y hệt một repo đang khớp bản chuẩn, và đó
 * đúng hình dạng FAIL-OPEN mà bản 1.8.3 vừa phải vá ở chỗ khác.
 *
 * ĐỘT BIẾN ĐÃ CHẠY:
 *   1. `do1` trả `null` cho repo không đọc được (thay vì một mục KHONG_DOC_DUOC) → vế 2 ĐỎ
 *   2. `repoTrongSo` không khử trùng đường dẫn                                    → vế 1 ĐỎ
 *   3. `xepHang` lọc bỏ repo không đọc được                                       → vế 4 ĐỎ
 */
import assert from "node:assert/strict";
import { banBoLo, do1, fileThuocTinhNang, repoTrongSo, soSanhBan, xepHang } from "../scripts/doi-hinh.mjs";

const ok = (s) => console.log(`  ok  ${s}`);

/* ---- 1. MỘT repo, dù có ba lượt migrate ------------------------------------
 * Repo migrate lần hai, lần ba là chuyện thường (n8n-orchestrator đã hai lượt). Đếm mỗi hồ sơ
 * một dòng thì bảng nói có 8 repo trong khi thực tế có 5, và con số "mấy repo đang tụt lại"
 * thành vô nghĩa. Khoá theo `duong_dan` chứ không theo `repo`: tên đổi được, đường dẫn thì đi
 * đo được. */
{
  const hoSo = [
    { file: "b.md", fm: { repo: "X", duong_dan: "/r/x", ngay: "2026-09-09" } },
    { file: "a.md", fm: { repo: "X (cũ)", duong_dan: "/r/x", ngay: "2026-09-01" } },
    { file: "c.md", fm: { repo: "Y", duong_dan: "/r/y", ngay: "2026-09-05" } },
    { file: "d.md", fm: { repo: "Z" } }                       // thiếu đường dẫn → bỏ, không đoán
  ];
  const ra = repoTrongSo(hoSo);
  assert.equal(ra.length, 2, "hai duong dan thi hai dong, du co ba ho so");
  assert.equal(ra[0].ten, "X", "phai giu ho so MOI NHAT — readHoSo da xep moi-truoc");
  assert.deepEqual(ra.map((r) => r.duong), ["/r/x", "/r/y"]);
  ok("1 · mỗi đường dẫn một dòng, giữ hồ sơ mới nhất, hồ sơ thiếu đường dẫn thì bỏ");
}

/* ---- 2. KHÔNG ĐỌC ĐƯỢC ≠ ĐÃ MỚI — vế có răng nhất của file này ------------- */
{
  const r = do1({ duong: "/khong/he/ton/tai/2f8a", ten: "ma" }, new Map());
  assert.equal(r.trangThai, "KHONG_DOC_DUOC", "repo khong doc duoc phai thanh MOT DONG, khong duoc bien mat");
  assert.ok(r.vi && r.vi.length > 0, "phai noi VI SAO khong doc duoc — 'khong doc duoc' khong dan ai di sua duoc");
  assert.equal(r.cu, undefined, "chua do thi KHONG duoc bia ra con so 0 file cu");
  ok("2 · repo không đọc được thành một dòng có lý do, và KHÔNG mang con số 0");
}

/* ---- 3. File → tính năng, suy từ danh mục chứ không gõ tay ------------------ */
{
  const dm = { blocks: [{ muc: [
    { ma: "A.1", can: { file: ["p.mjs", "q.mjs"] } },
    { ma: "A.2", can: { file: ["p.mjs"] } },
    { ma: "A.3", can: { lenh: ["x"] } }
  ] }] };
  const m = fileThuocTinhNang(dm);
  assert.deepEqual(m.get("p.mjs"), ["A.1", "A.2"], "mot file co the thuoc NHIEU tinh nang");
  assert.deepEqual(m.get("q.mjs"), ["A.1"]);
  assert.equal(m.get("khong-co.mjs"), undefined);
  ok("3 · bản đồ file → tính năng suy từ `can.file`, không khai bản thứ hai");
}

/* ---- 4. Nặng lên trước, và không ai bị lọc mất ------------------------------ */
{
  const ket = [
    { ten: "sach", trangThai: "DO_DUOC", cu: [], thieu: [], suaTay: [] },
    { ten: "cu-it", trangThai: "DO_DUOC", cu: ["a"], thieu: [], suaTay: [] },
    { ten: "sua-tay", trangThai: "DO_DUOC", cu: [], thieu: [], suaTay: ["z"] },
    { ten: "mu", trangThai: "KHONG_DOC_DUOC", vi: "mất ổ" }
  ];
  const x = xepHang(ket);
  assert.equal(x.length, 4, "xep hang KHONG duoc lam mat mot dong nao");
  assert.equal(x[0].ten, "sua-tay", "SUA TAY nang nhat: do la ca can NGUOI doc diff, lenh khong lam ho duoc");
  assert.ok(x.some((r) => r.ten === "mu"), "repo khong doc duoc van phai co mat — no la cau hoi mo");
  ok("4 · sửa tay lên đầu · repo không đọc được vẫn còn trong bảng");
}

/* ---- 5. BỎ LỠ BẢN NÀO — và "chưa khai" phải đọc là chưa khai ---------------
 *
 * Đây là vế trả lời *"có đáng nâng không"*, khác câu *"có lệch không"* mà so băm đã trả lời.
 * Cái bẫy nằm ở bản CHƯA KHAI ý nghĩa: nếu nó lặng lẽ rơi khỏi danh sách thì bảng trông như đã
 * kể hết, và người đọc kết luận phần còn lại không đáng — trong khi thật ra chưa ai xem. */
{
  assert.ok(soSanhBan("1.8.10", "1.8.9") > 0, "1.8.10 phai LON hon 1.8.9 — so theo SO, khong theo chuoi");
  assert.equal(soSanhBan("1.8.0", "1.8.0"), 0);
  assert.ok(soSanhBan("1.3.76", "1.8.0") < 0);

  const so = {
    ban: { "1.0.0": "a", "1.8.0": "b", "1.8.2": "c", "1.8.3": "d", "1.8.7": "e", "1.8.9": "f" },
    chi_tiet: { "1.8.3": { tinh_nang: ["F8.5"], vi_sao: "vá FAIL-OPEN" } }
  };
  const bo = banBoLo("1.8.0", "1.8.3", so);
  assert.equal(bo.tong, 2, "chi tinh ban NAM GIUA ban ghim va ban nha — khong ke ban cu hon, khong ke ban tuong lai");
  assert.deepEqual(bo.coKhai.map((b) => b.ban), ["1.8.3"]);
  assert.deepEqual(bo.chuaKhai, ["1.8.2"], "ban chua khai y nghia phai duoc DEM RIENG, khong duoc bien mat");
  assert.equal(bo.coKhai.length + bo.chuaKhai.length, bo.tong, "khong ban nao duoc roi ra ngoai ca hai nhom");

  const het = banBoLo("1.8.9", "1.8.9", so);
  assert.equal(het.tong, 0, "ngang ban nha thi khong bo lo gi");
  ok("5 · bỏ lỡ bản nào: chỉ tính khoảng giữa · bản chưa khai ý nghĩa được đếm riêng, không rơi");
}

console.log("doi-hinh: 5 vế xanh");
