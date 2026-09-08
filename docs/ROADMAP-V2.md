---
kind: guide
status: active
ttl_days: 120
---

# ROADMAP V2 — sau ba bản vá và một lượt pilot

> **Đây là lớp ĐIỀU PHỐI: thứ tự · phân luồng · phụ thuộc · chỗ cần người chốt.** Nội dung từng
> mục ở [BACKLOG.md](../BACKLOG.md) — file này **không chép lại**, chỉ nói *làm cái nào trước,
> cái nào chạy cùng lúc được, và vì sao*.
>
> [ROADMAP-V1](archive/ROADMAP-V1.md) là **lịch sử** (bốn khối A→D dẫn tới v1.0, đã xong). File này là
> việc **đang mở**, sau bản 1.3.1.
>
> Luật song song cưỡng chế chỉ một câu ([ORCHESTRATOR](protocols/ORCHESTRATOR.md) mục 2): **hai
> việc chạy song song được khi và chỉ khi thuộc hai khoá khác nhau và cả hai khoá đang trống.**

## Cập nhật 2026-09-06 — MƯỜI BẢN PHÁT TRONG MỘT NGÀY, và bộ khung đổi chất

> Ngày 06/09 đi từ **1.3.4** tới **1.3.13**. Đây là **trạng thái hiện hành** của lớp điều phối;
> kế hoạch sáu đợt cũ mà mục này từng phủ lên nay đã dời sang kho lưu trữ (xem cuối file).

### Bộ khung nay có ba thứ nó chưa từng có

| | Trước 06/09 | Sau |
|---|---|---|
| **Dọn** | repo phình vô hạn, dọn tay từng lượt | `npm run don` — **nhịp**, đi theo bản trích |
| **Nhường tên** | ba artifact đóng cứng tên, repo đích phải né | `generated_names` — **bộ khung nhường** |
| **Nâng cấp tài liệu** | `upgrade.mjs` chỉ đẩy tầng máy | mang cả tài liệu THIẾU, không đụng tài liệu KHÁC |

### Ba repo đã lên chuẩn, và repo thứ ba là ca khó nhất

`Project 3 AI Agent Unify` · `n8n-orchestrator` · **`ALL_SKILL_MANAGEMENT`**.

Repo thứ ba khó vì nó **đã có sẵn cơ chế hiệp đồng nhiều AI trước khi bộ khung tới**, và điều
phối AI chính là *nghề* của nó. Đức chốt: **bộ khung thắng**, luật cũ **khai tử nhưng giữ văn
bản**. Bốn file trùng tên giữ **1824 dòng** — không file nào bị đè.

### Bài học chi phối mọi việc còn lại

**Lỗi chỉ lộ khi chạm dữ liệu thật.** Đếm được trong một ngày:

| Thứ đã viết xong, test xanh | Lộ khi nào |
|---|---|
| Vòng lặp hội tụ trong `don.mjs` | đột biến kiểm — nó **chưa từng chạy tới lần nào** |
| Tên file lưu trữ + ghi đè im lặng | chạy nhịp dọn thật trên nhật ký thật |
| Cổng KHUNG-25 **bắt oan** dòng dịch chỗ | chạy nhịp dọn thật lần đầu |
| Vế kiểm thứ tự của KHUNG-29 | đột biến kiểm — dò chuỗi trúng cả **dòng khai báo hàm**, nên LUÔN xanh |
| Vòng ghi tài liệu của KHUNG-28 | đột biến kiểm — vế đầu chỉ gọi hàm so sánh |

**Hệ quả cho thứ tự việc:** một mục nợ chỉ đóng được khi **đã chạy trên dữ liệu thật** và **đã
qua đột biến kiểm**. "Viết xong, test xanh" từ nay không phải điều kiện đủ.

### Việc còn mở — KHÔNG liệt kê ở đây nữa

Danh sách tay ở chỗ này đã ôi: đo 09/09, **5 trong 12** mã việc nó gọi là *đang mở* đã đóng hoặc
đã xoá. Và nó vi phạm chính luật cuối file này — *không nhắc lại nội dung từng mục nợ*.

**Nguồn sống:** `npm run what-next` — giao bảng quyền × sổ nợ × sổ ý tưởng, nên nó không ôi được.
Nội dung từng mục: [BACKLOG.md](../BACKLOG.md).

**Thứ tự vẫn còn hiệu lực, và nó là thứ file này ĐƯỢC nói:** làm nhóm *phép đo đang nói dối*
trước — một phép đo sai làm mọi số đo khác mất giá trị. Rồi tới chỗ hở của bản trích và migrate.

**Một con số vượt trần, chưa ai xử:** thời gian chạy trọn bộ phép kiểm **~350/180 giây**. Mỗi bản
phát lại thêm một suite. Nằm trong `KHUNG-11` nhưng thực chất là việc riêng.

## Cập nhật 2026-09-05 — pilot đổi thứ tự ưu tiên

Lượt migrate thật `n8n-orchestrator` cộng audit độc lập đã **đóng 8 mục** (KHUNG-1, 2, 5, 12,
19, 20, 21, và cửa hậu 1.3.5) và **mở 7 mục mới**. Điều đáng nói không phải con số, mà là:
**bốn lỗi nặng nhất trong ngày đều do migrate lôi ra, không do đọc lại code.**

| Bản | Vá gì | Ai tìm ra |
|---|---|---|
| 1.3.1 | bộ đếm đếm luôn sản phẩm của chính bộ sinh | đuổi lỗi ở nhà |
| 1.3.3 | ba lỗi: trường khai nghề bị từ chối · bảng quyền nổ vì `null` · cổng đóng cứng bản đồ | **pilot migrate** |
| 1.3.4 | nhịp DỌN + thước cân nặng đi theo bản trích | Đức yêu cầu |
| 1.3.5 | **cửa hậu do chính 1.3.3 mở ra** | tự dựng ca hỏng + Codex xác nhận |

**Bài học vào roadmap, không chỉ vào changelog:** `npm test` xanh **không** chứng minh gì về một
lớp bảo vệ vừa bị nới. Cách duy nhất bắt được là **tự tay dựng ca hỏng**. Nên từ nay mọi lượt nới
một cấu hình đều phải kèm một khối trong `tests/cong-do-that.mjs`.

**Thứ tự đổi, CÒN NGUYÊN hiệu lực:** migrate không còn là việc làm sau cùng sau khi dọn xong nợ —
nó lên **sớm**, vì mỗi lượt migrate tìm ra lỗi mà bảy phiên ở nhà không tìm ra. *(Gốc: "lên đợt 1".)*

## Thứ tự việc — đọc ở đâu

Kế hoạch sáu đợt cũ (đợt 0→5) đã được hai khối *Cập nhật* ở trên phủ lên, và **7 trong 13** mã
việc nó nhắc nay đã đóng. Đã dời nguyên văn sang
[docs/archive/ROADMAP-V2-dot-0-den-5.md](archive/ROADMAP-V2-dot-0-den-5.md).

**Thứ tự đang có hiệu lực:** mục *Việc còn mở, xếp theo thứ RẺ NHẤT trước* ở trên. Bản đồ việc
sống, tính từ bảng quyền × sổ nợ × sổ ý tưởng: `npm run what-next`.

**Luật cắt ngang còn nguyên hiệu lực: GOM BẢN PHÁT.** Mỗi lượt cắt bản là một lần mọi repo đích
phải nâng — gom nhiều mục vào một bản, đừng cắt một bản cho mỗi mục.

## Ba thứ roadmap này CỐ Ý không chứa

1. **Không có ngày tháng.** Repo chạy theo phiên, không theo lịch. Gán ngày là tạo một con số sai
   ngay hôm sau.
2. **Không có bản vá kỹ thuật cho từng mục.** Đó là việc của brief giao executor
   ([ORCHESTRATOR](protocols/ORCHESTRATOR.md) mục 4b), và brief kèm sẵn bản vá là điều sổ tay đó cấm.
3. **Không nhắc lại nội dung từng mục nợ.** Hai nguồn sự thật cho cùng một việc là đúng bệnh mà
   cả bộ khung này sinh ra để chữa. Nội dung ở [BACKLOG.md](../BACKLOG.md); thứ tự ở đây.
