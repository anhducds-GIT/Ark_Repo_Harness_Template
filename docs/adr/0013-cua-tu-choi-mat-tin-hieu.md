---
status: Accepted
adr: 0013
chu_de: khoa
bo_sung: 0012
date: 2026-09-09
deciders: Đức
---

# ADR-0013 — Một cửa TỪ CHỐI chỉ có tác dụng nếu người gọi THẤY được tín hiệu

> **Bổ sung [ADR-0012](0012-khoa-muc-file.md), không thay nó.** Mục *"Cái này KHÔNG chữa"* của
> ADR-0012 kể hai chỗ khoá mức file không đỡ được. Đây là chỗ thứ ba, tìm ra sau khi 0012 đã
> `Accepted` — và ADR đã Accepted là **bất biến** (ADR-0000), nên nó nằm ở một ADR riêng chứ
> không được viết chèn vào file kia.

## Bối cảnh

**Đã xảy ra thật 2026-09-08, ngay trong phiên viết ADR-0012.** Lệnh chạy:

```bash
node scripts/claim.mjs --sua decisions.md --as <phiên> | head -1 && cat >> decisions.md <<EOF
```

`--sua` **TỪ CHỐI** — mã thoát `3`, vì vùng `_root` do lane khác giữ. Nhưng trong một ống dẫn,
mã thoát của cả cụm là mã của lệnh **CUỐI** (`head`), và nó bằng `0`. Nên `&&` cho qua, và **67
dòng đã được ghi vào file thuộc vùng lane khác đang giữ**. Hoàn nguyên sạch, không mất gì của ai.

Lớp bảo vệ **có mặt, đã chạy, đã trả lời đúng** — và vẫn không chặn được gì.

## Quyết định

**⑴ Ghi nhận đây là một hình dạng lỗi, không phải một lượt bất cẩn.** Nó cùng họ với `--soat`
(ADR-0012, mục *"Cái này KHÔNG chữa"*): cả hai là **lớp bảo vệ CÓ MẶT mà tín hiệu bị mất trên
đường**. `--soat` mất tín hiệu vì nó chạy sau, lúc index đã rỗng; cửa từ chối mất tín hiệu vì
cách người gọi nối lệnh. Không lớp nào trong cơ chế khoá chặn được cả hai — **git giữ file, khoá
thì không**.

**⑵ Cách gọi ĐÚNG, và luật nên dạy đúng một cách:**

```bash
node scripts/claim.mjs --sua <file>… --as <phiên>              # KHÔNG nối ống dẫn
node scripts/claim.mjs --sua <file>… --as <phiên> && <lệnh ghi>
```

**⑶ CHƯA VÁ BẰNG MÁY, và ghi rõ là chưa.** Đức chốt 09/09: ghép vào tầng ADR thay vì mở một mục
sổ nợ thứ 26 — trần sổ nợ giữ **25** (ADR-0010). Đổi lại, mục này **không lên bản đồ việc**, nên
không ai được giao đi vá; đó là cái giá đã biết của lựa chọn này.

Ba lối vá đã cân nhắc, chưa chọn:

1. `--sua` in thêm một dòng ra **stderr** nhắc kiểm `$?` — rẻ nhất, **không chặn được ai**.
2. `--sua` ghi một dấu vào thư mục tạm, `--soat` đối chiếu — bắt được, nhưng vẫn phải nhớ gọi
   `--soat`, tức chỉ dời chỗ mất tín hiệu chứ không bịt.
3. `AGENTS.md` dạy đúng một cách gọi, kèm một phép ghim soi tài liệu — chặt nhất về luật, nhưng
   luật không chạy được thì vẫn là chữ.

## Hệ quả

- Không đổi một dòng mã nào. Đây là một ADR **ghi nhận**, không phải một ADR **thay đổi**.
- Nếu ca này nổ **lần thứ hai**, mở lại ADR này và chọn một trong ba lối trên — đừng vá điểm.

## Cái giá

- **Một lỗ đã biết mà không có mục nợ.** Người đọc bản đồ việc sẽ không thấy nó. Đây là chỗ duy
  nhất nó được ghi, nên nó chỉ tới tay ai đọc ADR.
- **Trần sổ nợ mua được sự tập trung bằng cách giấu bớt việc.** Đó là đánh đổi của ADR-0010, và
  lượt này là một ví dụ cụ thể của chính đánh đổi ấy — ghi ra để lần sau cân nhắc có ý thức.
