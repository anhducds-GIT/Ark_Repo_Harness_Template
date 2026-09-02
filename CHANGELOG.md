# CHANGELOG

> Mỗi bản một khối. **Chỉ thêm, không sửa khối cũ.** Máy đọc file này để dựng mục Nhật ký trên
> bảng, nên giữ đúng định dạng: `## <phiên bản> — <ngày> — <một câu>`.

## 0.3.0 — 2026-09-03 — AI là chủ nhà: sổ tay, lịch bảo trì, và bảng nói tiếng người

**Thêm**
- `docs/SO-TAY-AGENT.md` — bảy danh sách kiểm cho việc lặp lại. Chặn **drift**: một việc làm mười lần bởi mười phiên khác nhau sẽ ra mười kiểu nếu không có nó.
- `docs/BAO-TRI-DINH-KY.md` — ba nhịp quét (mỗi phiên · mỗi tuần · mỗi tháng) và ba dấu hiệu repo xuống cấp. Cả ba đều im lặng, nên phải chủ động đi tìm.
- `docs/TINH-NANG.md` — kể tính năng bằng tiếng người, mỗi mục kèm câu *"không có nó thì hỏng ra sao"*.
- Bảng tổng quan: banner tự biết tuổi · NOW/NEXT · vòng đời · đèn sức khoẻ đếm **nợ** chứ không đếm tài sản.

**Sửa**
- Bốn lỗ **gate báo xanh mà không chặn** — audit độc lập tìm ra, mutation test xác nhận từng cái.
- `safe-push` chặn luôn cú đẩy đầu tiên của một repo mới, tức chính ca harness sinh ra để làm.
- `init-repo --ten "X" <đích>` dựng repo ở thư mục tên `X` và bỏ qua `<đích>`.
- `claim.mjs` không tồn tại dù luật bắt mọi phiên dùng nó.

**Gỡ**
- Bộ sinh trang thứ hai. Hai bộ cho cùng một việc là phân mảnh — đúng thứ harness sinh ra để chữa.

## 0.2.0 — 2026-09-03 — Harness về nhà riêng, và có đủ công cụ để nhân bản

**Thêm**
- `assess` — đo một repo cách chuẩn bao xa. Mức 0–3, chi phí tách ba loại việc thật khác giá.
- `init-repo` — dựng repo mới bằng một lệnh, thay sáu bước làm tay dễ lệch thứ tự.
- `build-template-overview` — trang mô tả chính harness, sinh từ chính nó.
- Hai protocol: kiểm một repo · đưa repo cũ lên chuẩn.
- Ba workflow có lưu đồ: dựng repo mới · migrate · một phiên làm việc.
- `LEGEND.md` — tra cứu thuật ngữ. Thuật ngữ giữ tiếng Anh, giải nghĩa tiếng Việt.
- ADR-0002 — chốt cái gì đi theo bản trích, cái gì ở lại repo nhà.

**Sửa**
- Generator **cộng thêm một dòng trống mỗi lần chạy** — chỉ lộ ra khi harness tự trích lại chính
  nó, tức đúng lúc nó có nhà riêng.
- `stripNghe` ném cả ở ca lành (luật đã ở dạng chung), nên harness không tự trích lại được.
- `units.ten` — generator từng đóng cứng chữ "Extension" ở tiêu đề bảng và tên cột, nên mọi repo
  dựng từ harness đều nhận một bảng gọi mọi thứ là Extension.
- Session gate **chết ngay khi nạp** với mọi phiên: một biến dùng trước khi khai.

**Đã biết, chưa xong**
- Chưa có remote.
- Chưa từng migrate một repo thật khác nghề — nhãn `unproven` vẫn đúng.

## 0.1.0 — 2026-09-02 — Trích harness ra khỏi repo sinh ra nó

**Thêm**
- 5 công cụ vận hành: generator trang · structure gate · session gate · safe-push · đọc cấu hình.
- Luật ba tầng: luật chung · annex nghề (tuỳ chọn) · bản đồ địa phương.
- Suite seed — harness mang theo lưới đỡ của chính nó.
- Bốn bản mẫu: ADR · nghiên cứu · đề bài phiên · annex.
- ADR-0001 — harness sống ở một repo độc lập.

**Nghiệm thu**
- Repo trống + harness → structure gate 0 đỏ 0 vàng.
- Bộ máy cũ và mới sinh ra artifact giống hệt từng byte.
