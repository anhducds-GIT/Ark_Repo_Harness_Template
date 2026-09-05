---
kind: guide
status: active
ttl_days: 120
---

# ROADMAP V2 — 10 mục nợ, xếp thành 4 đợt

> **Đây là lớp ĐIỀU PHỐI: thứ tự · phân luồng · phụ thuộc · chỗ cần Đức chốt.** Nội dung từng
> mục nằm ở [BACKLOG.md](../BACKLOG.md) — file này **không chép lại**, chỉ nói *làm cái nào
> trước, cái nào chạy cùng lúc được, và vì sao*.
>
> [ROADMAP-V1](ROADMAP-V1.md) là **lịch sử** (bốn khối A→D dẫn tới v1.0, đã xong). File này là
> việc **đang mở**, sau bản 1.3.1.
>
> Luật song song cưỡng chế chỉ một câu (`ORCHESTRATOR.md` mục 2): **hai việc chạy song song được
> khi và chỉ khi thuộc hai khoá khác nhau và cả hai khoá đang trống.** Bảng dưới đã chia sẵn theo
> khoá — đừng gộp hai việc cùng khoá thành hai luồng, kể cả khi chúng đụng hai file khác nhau.

## Một câu về hình dạng của nợ hiện tại

Trong 10 mục còn mở, **ba mục cùng một hình dạng lỗi**: luật trỏ tới thứ không tồn tại
(`decisions.md`, "bảng lỗi của sổ tay"), và một biến thể của nó — tài liệu nói sai về chính repo.
Repo này đã dính hình dạng đó **ba lần** (`claim.mjs` 03/09 · `BACKLOG.md` 05/09 · `decisions.md`
05/09). Ba lần thì nó không còn là tai nạn. **Đợt 2 tồn tại để chặn hình dạng đó, không phải để
vá ba chỗ.**

Hình dạng thứ hai, hai mục: **phép kiểm không phân biệt được hai nhánh** (KHUNG-9 dùng tìm chuỗi
để xác nhận "đã có ca hỏng"; KHUNG-12 có một lớp chưa từng chạy ở luồng thật). Cùng bệnh với
KHUNG-5 vừa vá ở 1.3.1.

## Đợt 1 — ba luồng, chạy song song được NGAY

Ba khoá khác nhau, cả ba đang trống. Không luồng nào chờ luồng nào.

| Luồng | Khoá | Việc | Vì sao đợt 1 |
|---|---|---|---|
| **A** | `_code` | KHUNG-12 → KHUNG-9 | Cùng bệnh với lỗi vừa vá ở 1.3.1; đường truyền tham số đã nối sẵn nên KHUNG-12 rẻ nhất lúc này |
| **B** | `_docs` | KHUNG-10 → KHUNG-6 | Cả hai là **sửa câu nói quá**, không phải sửa cơ chế. Rẻ, và mỗi câu sai còn sống là một phiên sau tin nhầm |
| **C** | *(không khoá)* | KHUNG-3 | `npm run assess` chỉ đọc. Chạy được cả khi ba khoá kia đều bận |

**Luồng A đổi tầng máy → sẽ phải cắt bản mới.** Gộp KHUNG-12 và KHUNG-9 vào **một** lượt phát,
đừng cắt hai bản cho hai mục — mỗi bản phát là một lần hai repo đích phải nâng.

## Đợt 2 — chặn hình dạng lỗi, không vá ba chỗ

Chờ đợt 1 xong ở khoá tương ứng. **Xếp hàng, không song song**: cả hai mục đều đụng `_root`.

| Thứ tự | Việc | Ghi chú |
|---|---|---|
| 1 | KHUNG-7 + KHUNG-8 | Làm **cùng một lượt** — chúng là hai triệu chứng của một bệnh |
| 2 | *(kèm)* một phép kiểm máy quét "luật trỏ tới file/lệnh không tồn tại" | **Đây mới là giá trị của đợt 2.** Không có nó thì lần thứ tư sẽ tới, và lại do người phát hiện |

Câu hỏi phải trả lời **trước khi** viết phép kiểm đó, không phải sau: *nó dựng nổi ca hỏng
không?* (`AGENTS.md` luật vàng số 2). Dựng không nổi thì đừng viết — viết vào sổ nợ và chờ.

## Đợt 3 — hai việc CHỜ ĐỨC CHỐT, không ai làm thay được

Hai mục này **không phải chỗ sót, mà là câu hỏi hướng**. Không chốt thì không có việc để giao.

| Việc | Đức cần quyết | Nếu không quyết |
|---|---|---|
| KHUNG-2 | Hai quy trình migrate có đi theo bản trích không? | Repo mới vẫn nhận công cụ mà không nhận quy trình dùng nó |
| KHUNG-11 | **Bớt cái gì** trong 998 dòng tài liệu vượt ngân sách? | Ngân sách do chính repo đặt ra bị bỏ qua — và luật bị bỏ qua một lần thì lần sau dễ hơn |

**KHUNG-11 là mục nguy hiểm nhất của cả roadmap, và không phải vì nó khó.** Vì mọi việc còn lại
đều **thêm** chữ vào repo — kể cả chính file này. Nên KHUNG-11 phải chốt **sớm**, và từ lúc đó
mỗi lượt thêm chữ phải kèm một lượt bớt chữ (`AGENTS.md` mục 8).

## Đợt 4 — sau khi ba đợt trên xong

| Việc | Điều kiện |
|---|---|
| KHUNG-4 (ba luật vai điều phối chưa có phép kiểm máy) | Sau đợt 2 — vì phép kiểm của đợt 2 có thể dùng lại được cho hai trong ba luật đó |
| Đẩy bản vá sang hai repo đang ghim bản khung (`npm run upgrade`) | Sau khi **mọi** lượt cắt bản của đợt 1–2 đã xong. Nâng một lần, không nâng ba lần |

## Ba thứ roadmap này CỐ Ý không chứa

1. **Không có ngày tháng.** Repo này chạy theo phiên, không theo lịch. Gán ngày là tạo một con số
   sai ngay hôm sau.
2. **Không có bản vá kỹ thuật cho từng mục.** Đó là việc của brief giao executor
   (`ORCHESTRATOR.md` mục 4b), và brief kèm sẵn bản vá là điều sổ tay đó cấm.
3. **Không nhắc lại nội dung từng mục nợ.** Hai nguồn sự thật cho cùng một việc là đúng bệnh mà
   cả bộ khung này sinh ra để chữa. Nội dung ở `BACKLOG.md`; thứ tự ở đây.
