---
status: Accepted
adr: 0015
chu_de: ghi-quyet-dinh
bo_sung: 0014
date: 2026-09-09
deciders: Đức
---

# ADR-0015 — Context Compiler, và vì sao máy KHÔNG được tự cắt luật

Bổ sung [ADR-0014](0014-bo-bien-dich-luat.md). ADR-0014 dựng bộ biên dịch cho **ADR**. File này
ghi hai thứ nó chưa có, và cả hai đến từ việc chạy thật.

## ⑴ CONTEXT COMPILER — sổ cái được phình, thứ NẠP thì không

Đức chốt 09/09: *"chốt thiết kế Rule Compiler V1 riêng gồm append → merge → supersede → trim →
compile, rồi mới gắn nó vào Context Compiler. đây là điểm quan trọng nhất."*

**Vấn đề nếu thiếu bước này:** biên dịch xong mà không ai đo *"rốt cuộc một phiên phải đọc bao
nhiêu"* thì bộ biên dịch chỉ là một bảng đẹp. Luật vẫn phình, chỉ khác là nay có bảng.

**Quyết định:** `npm run luat -- --nap` in ra ĐÚNG thứ một phiên phải nạp, theo ba tầng —
**NHÂN** (`AGENTS.md`) → **TRẠNG THÁI** (phần cuối `HANDOFF.md`) → **THEO VIỆC** (mở khi cần,
theo bảng mục 6, **không nạp trước**). Và nó bị **cưỡng chế ở cổng đóng phiên**, gộp vào mục
*"Ngân sách trong trần"* — không thành mục thứ 26, vì thêm một phép kiểm để cưỡng chế luật
chống-phình thì tự mâu thuẫn.

**Số đo 09/09:** nạp **284/300 dòng**, không nạp **4.499 dòng** trong 39 file `docs/` — **6% nạp**.

**Con số đáng nhìn KHÔNG phải tổng đã nạp, mà là tổng KHÔNG nạp.** Nó đo bảng mục 6 đang tiết
kiệm bao nhiêu. Bảng đó mất tác dụng thì con số kia tụt, và ta thấy ngay lượt sau.

**Hệ quả cho một tranh luận đang mở:** *"tổng tài liệu 3.602 / trần 2.200"* nghe như một khoản nợ
lớn. Nhưng kho tài liệu **không phải chi phí ngữ cảnh** — nó là thư viện tra cứu, và 94% của nó
không bao giờ được nạp. Thứ phải giữ nhỏ là **phần NẠP**.

## ⑵ MÁY KHÔNG ĐƯỢC TỰ CẮT LUẬT — ba lượt bắt oan liên tiếp

`--trim` bản đầu đề xuất cắt theo một tín hiệu đo được: *"mục chỉ còn nhắc mã việc đã đóng"*.
Nghe chặt chẽ. Nó **bắt oan ba lượt liên tiếp trong một buổi**:

| Mục | Tín hiệu nói | Sự thật |
|---|---|---|
| *Trần sổ nợ giữ 25* | chỉ nhắc `KHUNG-48` đã đóng | **trần 25 vẫn đang cưỡng chế**, và đây là chỗ duy nhất ghi VÌ SAO |
| *Migrate là BA việc trong một* | chỉ nhắc `KHUNG-2` đã đóng | là **định nghĩa** một quy trình đang dùng |
| *Cơ chế suite song song…* | chỉ nhắc `KHUNG-48` đã đóng | chứa nguyên tắc *mọi cơ chế phải có một mục trong `features.json`* — vừa được áp lại cùng ngày |

**Kết luận, và nó là thứ đắt nhất học được:** một mục sổ quyết định thường chứa **CẢ** bản ghi một
việc đã xong **LẪN** một nguyên tắc vẫn đang sống. Hai thứ đó nằm trong cùng một đoạn văn, và
không tín hiệu máy nào tách được chúng.

**Quyết định:** máy **chỉ cắt thứ ĐÃ KHAI**. Khai bằng một dòng trong thân mục:

```
> **trạng thái:** đã thi hành      (hoặc: đang hiệu lực)
```

`đang hiệu lực` **thắng mọi tín hiệu**. Mục chưa khai thì máy **NÊU kèm bằng chứng** để người đọc
khai — không cắt. Đúng điều Đức chốt ở ADR-0014: *AI đề xuất, khai báo tường minh mới làm đổi bộ
luật.*

**Hai vế ngược tự động, thêm sau mỗi lần bắt oan:** mục còn trỏ tới một **ADR đang hiệu lực** →
giữ (ADR là tầng lý lẽ; còn trỏ tới ADR sống nghĩa là nó vẫn đỡ cho một luật sống). Mục còn được
một **tài liệu sống nhắc lại** → giữ.

## Cái MẤT — nói thẳng

- **Cắt luật nay cần một bước khai báo.** Không khai thì không cắt được, và sổ sẽ dài hơn mức tối
  ưu. Đó là chủ ý: một mục thừa rẻ hơn một luật bị cắt nhầm.
- **Máy vẫn không hiểu nghĩa.** Hai vế ngược là *tín hiệu*, không phải bằng chứng — một mục không
  trỏ ADR, không được ai nhắc, mà vẫn mang luật sống thì máy vẫn nêu nó ra. Người đọc là lớp cuối.
- **`--nap` chỉ đo cái ĐO ĐƯỢC**: số dòng file. Nó không biết một dòng luật khó hiểu tốn nhiều
  hơn ba dòng luật rõ. Đừng đọc con số này thành *"chi phí ngữ cảnh thật"*.

## Ghim

[tests/rule-compiler.mjs](../../tests/rule-compiler.mjs) vế 9–10 · [tests/cong-do-that.mjs](../../tests/cong-do-that.mjs)
vế 14 (cổng ĐỎ THẬT khi phần nạp vượt trần). **8 đột biến đã chạy, 2 sống sót lượt đầu** — cả hai
cùng một bệnh: fixture thiếu đúng ca cần phân biệt.
