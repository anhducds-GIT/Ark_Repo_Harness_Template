# Quyết định về KHOÁ — LƯU TRỮ, 06/09 → 08/09

**Ba quyết định dưới đây đã được GỘP thành một mục duy nhất trong [decisions.md](../../decisions.md)
ngày 09/09** — Đức chốt: *"gộp, xóa, sử dụng decision mới nhất, bỏ các cái cũ đã bị obsolete để ko
gây confuse."* Chữ giữ nguyên từng byte, chỉ đổi chỗ. Đây là LỊCH SỬ, không phải luật đang chạy:
muốn biết luật khoá hiện hành thì đọc `decisions.md` và `AGENTS.md` mục 1.

## 2026-09-06 · Khoá vùng: nhận muộn, một lane một khoá, và cấm nhả hộ

Đức: *"tôi muốn adjust rule về việc giữ khóa để tối ưu flow làm việc hơn"*. Ba luật vào
`AGENTS.md` mục 1: **nhận khoá ngay trước lượt ghi đầu tiên** (đọc và đo không cần khoá) ·
**một lane một khoá gói** · **không nhả khoá hộ lane khác** vì đo thấy vùng chưa bị chạm.

Tín hiệu mới `"repo chưa thấy dấu vết"` hiện ở ba chỗ và là **VÀNG, không ĐỎ** — chặn một lane
đang đọc kỹ là dạy mọi lane ghi bừa một byte để giữ khoá cho hợp lệ. Bằng chứng gốc: 06/09 một
phiên điều phối đo thấy "0 commit 0 sửa đổi" rồi nhả khoá hộ, trong khi lane đó đang làm thật ở
thư mục ngoài repo — lane phải hoàn nguyên phần đã xong. Ghim: `tests/khoa-dau-vet.mjs`.

## 2026-09-08 · Đóng `KHUNG-42` — giữ đúng dòng VÀNG, bỏ cơ chế khoá tự hết hạn

**Đức chốt:** *"ok đóng KHUNG-42 đi, giữ dòng vàng."*

**Vì sao cần chốt:** `KHUNG-42` đề xuất một bảng ba dòng cho khoá **tự hết hạn** khi có phiên khác
chờ. Nhưng [ADR-0012](docs/adr/0012-khoa-muc-file.md) (Accepted cùng ngày, người chốt cũng là Đức)
nói **ngược** ở vế ⑸: *"Quá 30 phút thì NÊU TÊN, tuyệt đối không tự nhả"* — vì tự nhả là tự động hoá
đúng vụ nhả-khoá-hộ 06/09, lần đó một lane mất phần đã xong. Hai luật ngược nhau về cùng một khoá
thì lane nào cũng có cớ làm theo bên có lợi cho mình, nên phải bỏ hẳn một bên.

**Chốt:** ADR-0012 thắng. `KHUNG-42` đóng. Giữ lại **một** việc duy nhất của nó — dòng **VÀNG** ở
cuối cổng đóng phiên, chỉ **nêu tên** và **không đổi mã thoát**.

Việc và điều kiện đóng: [BACKLOG.md](BACKLOG.md) mục `KHUNG-54`. Việc của Vai ① — tầng máy.


## 2026-09-08 · Khoá mức FILE: giữ ngắn, trả ngay; chỉ đọc thì không khoá

**Đức chốt, nguyên văn:** *"AI Assistant chỉ giữ khóa đúng ở file mà AI đó đang sửa, các file khác
không giữ, khóa được giữ và trả ngay trước và sau khi AI sửa … Nếu chỉ đọc ko cần giữ khóa."*
Và giữa phiên: *"bạn tạm nhả khóa được ko? bao giờ ghi file hãy lấy lại khóa"*.

**Chốt:** [ADR-0012](docs/adr/0012-khoa-muc-file.md) — sáu quyết định, số đo của CHÍNH repo này
(620 cặp va chạm, **57% là chặn oan**, p90 **12 file** một lượt sửa), và mục **"cái này KHÔNG
chữa"**. Ghim `tests/khoa-file.mjs`. Còn hở: `KHUNG-53`.

