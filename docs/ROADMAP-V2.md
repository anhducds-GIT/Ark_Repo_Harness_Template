---
kind: guide
status: active
ttl_days: 120
---

# ROADMAP V2 — thứ tự việc đang mở

> **Đây là lớp ĐIỀU PHỐI: thứ tự · phân luồng · phụ thuộc · chỗ cần người chốt.** Nội dung từng
> mục ở [BACKLOG.md](../BACKLOG.md) và [IDEAS.md](../IDEAS.md) — file này **không chép lại**, chỉ
> nói *làm cái nào trước, cái nào chạy cùng lúc được, và vì sao*. Bản đồ việc **sống** thì chạy
> `npm run what-next`: nó giao bảng quyền × sổ nợ × sổ ý tưởng, nên không ôi được.
>
> [ROADMAP-V1](archive/ROADMAP-V1.md) là **lịch sử** (bốn khối A→D dẫn tới v1.0, đã xong). File này
> là việc **đang mở**, rà lại ở mốc 1.8.0.
>
> Luật song song cưỡng chế chỉ một câu ([ORCHESTRATOR](protocols/ORCHESTRATOR.md) mục 2): **hai
> việc chạy song song được khi và chỉ khi thuộc hai khoá khác nhau và cả hai khoá đang trống.**

## Bốn luật chi phối THỨ TỰ — vì sao đợt nào đứng trước

> Lịch sử từng bản ở [CHANGELOG.md](../CHANGELOG.md), từng lượt việc ở
> [docs/archive/HANDOFF-2026-09-2.md](archive/HANDOFF-2026-09-2.md). Ở đây **chỉ giữ luật còn
> hiệu lực** — bốn cái, cả bốn sinh ra từ một ca hỏng thật.

1. **Lỗi chỉ lộ khi chạm dữ liệu thật.** Đo 06/09: năm thứ *"đã viết xong, test xanh"* đều hỏng —
   ba cái lộ nhờ **đột biến kiểm**, hai cái lộ khi chạy nhịp dọn trên nhật ký thật.
   → **Một mục nợ chỉ đóng được khi đã chạy trên dữ liệu thật VÀ đã qua đột biến kiểm.**
   *"Viết xong, test xanh"* không phải điều kiện đủ.
2. **`npm test` xanh không chứng minh gì về một lớp bảo vệ vừa bị NỚI.** Bản 1.3.5 là cửa hậu do
   chính 1.3.3 mở ra; cách duy nhất bắt được là **tự tay dựng ca hỏng**. → Mọi lượt nới một cấu
   hình phải kèm một khối trong `tests/cong-do-that.mjs`.
3. **Migrate đứng SỚM, không đứng cuối.** Bốn lỗi nặng nhất ngày 05/09 đều do một lượt migrate
   thật lôi ra, không do đọc lại code — bảy phiên ở nhà trước đó không tìm ra cái nào.
4. **Phép đo nói dối thì đứng trước phép đo còn thiếu.** Một phép kiểm luôn xanh không làm ai chậm
   hôm nay, nó làm mọi số đo khác mất giá **đúng lúc ta cần tin chúng**. Đây là lý do đợt 2 đứng
   trước đợt 3.

Một số vượt trần từ 06/09 tới nay **chưa ai xử**: thời gian chạy trọn bộ phép kiểm. Nhà của nó là
`Y-06` trong [IDEAS.md](../IDEAS.md), không phải file này — đo bằng `npm run can-nang`.

## Thứ tự việc — bản 09/09, xếp theo THỨ ĐANG THU THUẾ MỖI PHIÊN

> Xếp theo **thuế mỗi phiên phải trả**, không theo số mã việc. Nội dung từng mục ở
> [BACKLOG.md](../BACKLOG.md) và [IDEAS.md](../IDEAS.md) — ở đây **chỉ có thứ tự và vì sao**.
> Kế hoạch sáu đợt cũ (đợt 0→5) đã dời sang
> [docs/archive/ROADMAP-V2-dot-0-den-5.md](archive/ROADMAP-V2-dot-0-den-5.md).

### Đợt 1 · TRẢ THUẾ — làm trước, hiệu quả đo được ngay

| Mã | Vì sao đứng đây |
|---|---|
| `KHUNG-53` | **Đắt nhất.** Luật đã đổi sang khoá FILE từ 08/09, cổng vẫn đòi khoá VÙNG. Đo 09/09: một phiên nhận/trả **4 khoá vùng cho 6 lượt commit**, mỗi lượt chặn lane khác vô ích. Đóng mục này cần kèm **đối chứng ngược** |
| `KHUNG-50` | Một lane sửa dở **chặn toàn bộ đường phát**. Thuế rơi vào người khác, không rơi vào người gây ra |
| `KHUNG-15` | **KIỂM CHỨNG TRƯỚC KHI SỬA.** Codex đã sửa vùng dấu suite ở 1.7.1 — có thể mục này đã tự đóng. Đóng một mục đã tự khỏi cũng là việc; làm lại từ đầu thì không |

### Đợt 2 · CHỐNG TỰ DỐI — phép kiểm không phân biệt được hai nhánh là đồ trang trí

`KHUNG-9` → `KHUNG-47` → `KHUNG-44` → `KHUNG-4`.

Xếp sau đợt 1 vì đây là thuế **tương lai**, không phải thuế mỗi phiên: một phép kiểm luôn xanh
không làm ai chậm hôm nay, nó chỉ làm mọi số đo mất giá **lúc ta cần tin chúng nhất**. Bốn mục
độc lập nhau, chạy song song được nếu khác khoá.

### Đợt 3 · ĐƯỜNG PHÁT HÀNH

`KHUNG-7` → `KHUNG-39` → `KHUNG-51`.

Cả ba là chỗ hở của bản trích. Đứng sau đợt 2 vì sửa đường phát mà phép kiểm còn đang nói dối
thì không biết mình đã sửa được hay chưa. `KHUNG-51`: Codex đã cô lập `upgrade-smoke` — **kiểm
phần còn lại trước khi kết luận**.

### Đợt 4 · Việc mới sinh 09/09

`Y-12` (ONE LOADING LAW) → `Y-13` (đã bác, giữ để không ai đề xuất lại).

`Y-12` có một bản đề xuất 619 dòng **đã qua hai lượt review** ở repo `Chrome_Extension_AI_Agentic`.
**ĐỌC TRƯỚC KHI THIẾT KẾ LẠI** — đừng phát minh lại thứ họ đã cho reviewer đập.

### KHÔNG ĐỘNG VÀO — đang chờ Đức chốt

`KHUNG-40` · `KHUNG-37` · `Y-03` · `Y-04` · `Y-07` · `Y-08`.

Và: **4 commit ở repo `Chrome_Extension_AI_Agentic` đang nằm local** vì cổng bên đó ĐỎ ở `B12` —
nợ **có trước** lượt migrate. Đức chưa chốt có đẩy hay không. **Đừng tự đẩy.**

**Luật cắt ngang còn nguyên hiệu lực: GOM BẢN PHÁT.** Mỗi lượt cắt bản là một lần mọi repo đích
phải nâng — gom nhiều mục vào một bản, đừng cắt một bản cho mỗi mục.

## Ba thứ roadmap này CỐ Ý không chứa

1. **Không gán HẠN.** Repo chạy theo phiên, không theo lịch. Gán hạn là tạo một con số sai ngay
   hôm sau. Ngày của một lượt rà thì ghi được — nó là **đã đo lúc nào**, không phải **phải xong lúc nào**.
2. **Không có bản vá kỹ thuật cho từng mục.** Đó là việc của brief giao executor
   ([ORCHESTRATOR](protocols/ORCHESTRATOR.md) mục 4b), và brief kèm sẵn bản vá là điều sổ tay đó cấm.
3. **Không nhắc lại nội dung từng mục nợ.** Hai nguồn sự thật cho cùng một việc là đúng bệnh mà
   cả bộ khung này sinh ra để chữa. Nội dung ở [BACKLOG.md](../BACKLOG.md); thứ tự ở đây.
