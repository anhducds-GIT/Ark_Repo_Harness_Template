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

**Thứ tự đổi:** migrate không còn là "đợt 5, sau khi dọn xong nợ". Nó lên **đợt 1** — mỗi lượt
migrate là một lượt tìm lỗi mà bảy phiên ở nhà không tìm ra.

## Ba hình dạng lỗi, không phải mười hai việc rời

Đọc sổ nợ theo từng mục thì thấy mười hai việc lặt vặt. Đọc theo hình dạng thì thấy **ba**, và
thứ tự dưới đây xếp theo hình dạng chứ không theo mục:

| Hình dạng | Mục | Vì sao gom lại |
|---|---|---|
| **Luật trỏ tới thứ không tồn tại** | KHUNG-7 · KHUNG-8 · KHUNG-13 | Đã xảy ra **bốn lần** (`claim.mjs` 03/09 · `BACKLOG.md` · `decisions.md` · bản trích 05/09). Bốn lần thì không còn là tai nạn — vá ba chỗ mà không chặn hình dạng là hẹn lần thứ năm |
| **Phép đo bằng chuỗi văn bản** | KHUNG-9 · KHUNG-15 (nghi) · KHUNG-12 | Một phép kiểm không phân biệt được hai nhánh là đồ trang trí, dù nó xanh (luật vàng số 2) |
| **Tài liệu nói quá / nói sai** | KHUNG-10 · KHUNG-6 · KHUNG-11 | Mỗi câu sai còn sống là một phiên sau tin nhầm — và phiên sau không có cách nào biết |

## Đợt 0 — KHUNG-15, chặn MỌI phiên

**Làm trước mọi thứ khác.** Cổng đóng phiên báo *"Test xanh"* ĐỎ trong khi `npm test` exit 0 và
từng suite chạy riêng cũng exit 0.

Hậu quả không giới hạn ở một lượt: **phiên nào cũng đứng trước cùng một lựa chọn khó chịu** —
treo việc, hoặc push khi đỏ. Đức đã phải chốt tay một lần ngày 05/09 (xem
[decisions.md](../decisions.md)), và quyết định đó ghi rõ nó **không phải tiền lệ**. Chưa vá thì
lần sau lại phải chốt tay, và lần thứ ba thì nó thành thói quen.

Vùng: `_code`. Đây là **brief cho executor**, không phải việc của vai điều phối.

## Đợt 1 — ba luồng song song, chạy được ngay sau đợt 0

| Luồng | Khoá | Việc | Vì sao ở đây |
|---|---|---|---|
| **A** | `_code` + `_template` | **KHUNG-13** | Ưu tiên số 1 trên bảng. Mỗi ngày trôi là mỗi repo dựng mới **sinh ra đã mang lỗi** — đây là mục duy nhất mà chi phí trì hoãn tăng theo số repo, không theo thời gian |
| **B** | `_docs` | KHUNG-10 | Sửa một câu nói quá trong bảng tra. Rẻ nhất cả sổ |
| **C** | *(không khoá)* | KHUNG-3 + **KHUNG-14** | `npm run assess` chỉ đọc, chạy được cả khi mọi khoá bận. Hai mục này **phải làm cùng lượt**: cùng đi tới hai repo pilot, tách ra là đi hai lần |

## Đợt 2 — chặn hình dạng lỗi, không vá ba chỗ

Xếp hàng sau luồng A (cùng đụng `_code`), và sau đợt 1 vì KHUNG-13 dạy ta hình dạng đầy đủ.

| Thứ tự | Việc |
|---|---|
| 1 | KHUNG-7 + KHUNG-8 — **cùng một lượt**, chúng là hai triệu chứng của một bệnh |
| 2 | *(kèm)* một phép kiểm máy quét **"luật trỏ tới file/lệnh không tồn tại"** |

**Mục 2 mới là giá trị của đợt này.** Câu phải trả lời **trước khi viết** nó, không phải sau:
*dựng nổi ca hỏng không?* Không dựng nổi thì đừng viết — ghi vào sổ nợ và chờ.

## Đợt 3 — dọn nốt phép đo bằng chuỗi

KHUNG-9 → KHUNG-12, cùng khoá `_code` nên **xếp hàng, không song song**. Cả hai cùng họ với
KHUNG-5 đã vá ở 1.3.1, nên làm sau đợt 2 thì rẻ hơn: lúc đó đã có sẵn cách dựng ca hỏng.

## Đợt 4 — hai việc CHỜ NGƯỜI CHỐT

| Việc | Cần quyết | Không quyết thì sao |
|---|---|---|
| **KHUNG-11** | **Bớt cái gì** trong 998 dòng tài liệu vượt ngân sách? | Ngân sách do chính repo đặt ra bị bỏ qua — và một luật bị bỏ qua một lần thì lần sau dễ hơn |
| KHUNG-6 | Chỉ **ghi rõ giới hạn** của ba lớp quy trách nhiệm, hay **siết thật**? | Người đọc tiếp tục nhầm bốn cơ chế chống-giẫm-chân thành một lớp bảo mật |

**KHUNG-11 phải chốt SỚM, và không phải vì nó khó.** Vì mọi việc còn lại đều **thêm** chữ vào
repo — kể cả chính file này. Chốt càng muộn thì con số càng xa.

## Đợt 5 — sau cùng

| Việc | Điều kiện |
|---|---|
| KHUNG-4 (ba luật vai điều phối chưa có phép kiểm máy) | Sau đợt 2 — phép kiểm của đợt đó dùng lại được cho hai trong ba luật |
| Đẩy bản vá sang hai repo đang ghim bản khung (`npm run upgrade`) | Sau khi **mọi** lượt cắt bản đã xong |

### Một luật cắt ngang mọi đợt: GOM BẢN PHÁT

Sáu mục chạm `scripts/` — KHUNG-15 · 13 · 9 · 12 · 4, và phép kiểm của đợt 2. **Mỗi lượt cắt bản
là một lần hai repo đích phải nâng.** Gom theo đợt: một bản cho đợt 0+1, một bản cho đợt 2+3.
Đừng cắt sáu bản cho sáu mục.

## Ba thứ roadmap này CỐ Ý không chứa

1. **Không có ngày tháng.** Repo chạy theo phiên, không theo lịch. Gán ngày là tạo một con số sai
   ngay hôm sau.
2. **Không có bản vá kỹ thuật cho từng mục.** Đó là việc của brief giao executor
   ([ORCHESTRATOR](protocols/ORCHESTRATOR.md) mục 4b), và brief kèm sẵn bản vá là điều sổ tay đó cấm.
3. **Không nhắc lại nội dung từng mục nợ.** Hai nguồn sự thật cho cùng một việc là đúng bệnh mà
   cả bộ khung này sinh ra để chữa. Nội dung ở [BACKLOG.md](../BACKLOG.md); thứ tự ở đây.
