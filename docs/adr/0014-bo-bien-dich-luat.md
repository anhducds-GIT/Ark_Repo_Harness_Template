---
status: Accepted
adr: 0014
chu_de: ghi-quyet-dinh
thuoc: 0000
date: 2026-09-09
deciders: Đức
---

# ADR-0014 — Bộ biên dịch luật: sổ cái chỉ thêm, bộ luật hiệu lực được BIÊN DỊCH ra

## Bối cảnh

[ADR-0000](0000-ghi-nhan-quyet-dinh-kien-truc.md) làm ADR **bất biến**: quyết định đã `Accepted`
thì không sửa, muốn đổi thì viết ADR mới. Điều đó đúng và không đổi ở đây. Nhưng nó chỉ giải
quyết được *tính trung thực của lịch sử*, không giải quyết được *tính dùng được của luật hôm nay*.

**Đo 2026-09-09, ở chính repo này:**

- Mục 1 của hiến pháp có **BA mốc trả khoá khác nhau** cùng có hiệu lực: *"trả ngay sau khi sửa"*
  · *"NGAY SAU khi COMMIT"* · *"hết phiên"*. Một phiên đã đọc đúng **một trong ba** rồi làm ngược
  hai cái kia — và nó **không nhớ nhầm**, nó đọc đúng một câu đang có hiệu lực.
- Muốn biết luật khoá hiện hành phải đọc **ba mục ở ba chỗ** trong `decisions.md` rồi tự ghép.
- Câu *"quá 30 phút thì nêu tên, KHÔNG tự nhả"* **không có chủ ngữ**, và bị áp nhầm cho khoá của
  chính phiên đang đọc.
- Bốn con số gõ tay mô tả tập hợp đã sai: bảng tra nói *"6 trên 11 mục cổng"* khi cổng có 15;
  cổng gọi bộ kiểm cấu trúc là *"B1–B14"* khi nó có 15; bộ đó tự xưng *"15 phép kiểm B1…B15"*.

Cả năm chỗ cùng một bệnh: **luật chỉ có một chiều là TĂNG**. Mỗi luật hợp lý lúc thêm vào; cái vỡ
không phải độ dài mà là **hai câu trả lời cho một câu hỏi**.

Đức chốt 2026-09-09, sau khi xem cách một repo khác gom **27 ADR thành 9 file**: *"khi add rules,
ta cần categorize nó và xếp nó đúng chỗ, hợp lý chứ ko ghi kiểu cứ thêm dần thêm dần → phình vô
hạn, ko bao giờ control được."* Và: *"mọi rule mới được append vào ledger, nhưng KHÔNG append trực
tiếp vào active rules."*

## Quyết định

**⑴ Ba tầng, không được lẫn.**

| Tầng | Là gì | Luật |
|---|---|---|
| **Sổ cái** | `docs/adr/` · `decisions.md` · kho lưu trữ | CHỈ THÊM. Đây là LỊCH SỬ |
| **Bộ biên dịch** | `scripts/rule-compiler.mjs` | tất định, đọc khai báo, không suy diễn |
| **Luật hiệu lực** | thứ một phiên AI thật sự phải đọc | nhỏ, mỗi chủ đề một câu trả lời |

**⑵ KHÔNG gộp file ADR — gộp CÂU TRẢ LỜI.** Repo kia gộp 27 file thành 9. Ở đây không làm được:
[B12](../../scripts/check-bootstrap.mjs) khai ADR `Accepted` là bất biến, sửa phần thân là đỏ cổng.
Nhưng B12 **cho phép sửa frontmatter** — đó là cửa hợp lệ. Nên mỗi ADR khai `chu_de`, mỗi chủ đề
có đúng một `dau_moi: true`, và bộ biên dịch in ra **mỗi chủ đề một khối**. Kết quả đọc giống hệt
"một chủ đề = một file", mà không mất một chữ lịch sử nào.

**⑶ Sáu bước, tất định:** chuẩn hoá → gộp trùng → bao hàm → xử xung đột → cắt → biên dịch + xếp.
Bước "cắt" (`status: superseded`) **KHÔNG phải xoá**: ADR vẫn nằm nguyên trong sổ cái, chỉ ra khỏi
bộ hiệu lực.

**⑷ AI ĐỀ XUẤT, KHÔNG TỰ SỬA LUẬT.** Đây là bất biến quan trọng nhất của ADR này. `--de-xuat` chỉ
NÊU chỗ đáng gộp; chỉ **khai báo tường minh trong frontmatter** mới làm đổi bộ luật hiệu lực. Nhờ
vậy hai lượt chạy trên cùng một HEAD luôn ra cùng kết quả, và không có đường nào để một phiên AI
tự dọn mất một luật nó thấy phiền.

**⑸ Cưỡng chế bằng B16, nhóm CHẶN.** Thiếu `chu_de` · chủ đề chưa khai · quan hệ trỏ vào hư không
· chủ đề không có (hoặc có hai) đầu mối → ĐỎ. Repo có từ 2 ADR mà chưa khai `luat.chu_de` cũng ĐỎ:
cho qua chỗ đó là mở đúng cái cửa mà cả phép kiểm này sinh ra để đóng.

**⑹ Số mô tả một tập hợp thì phải ĐẾM, không gõ.** Bốn chỗ sai kể trên đều là số gõ tay. Nay tiêu
đề bộ kiểm cấu trúc tự đếm, và tên mục cổng thôi mang số.

## Cái MẤT — nói thẳng

- **Thêm một ADR nay tốn thêm một bước**: phải trả lời "nó thuộc chủ đề nào". Đó là chủ ý — không
  trả lời nổi thì luật đó chưa đủ rõ để thêm — nhưng nó là ma sát thật, và nó rơi vào đúng lúc
  người ta đang vội ghi lại một quyết định vừa chốt.
- **Bộ biên dịch KHÔNG hiểu nghĩa.** Nó không biết hai luật có cùng nội dung hay không; nó chỉ
  cưỡng chế **khai báo**. Hai ADR mâu thuẫn nhau mà cùng khai `thuoc` một đầu mối thì nó vẫn xanh.
  Chống mâu thuẫn ngữ nghĩa vẫn là việc của người đọc — đừng đọc phép kiểm này như một lớp bảo đảm.
- **Chủ đề là một chỗ để phình mới.** Khai một chủ đề cho mỗi ADR thì mọi thứ xanh mà không được
  gì, chỉ thêm một lớp thủ tục. `.repo-structure.json` nói rõ điều đó ngay tại chỗ khai.
- Bản trích nay mang thêm một script. Bộ khung to hơn một chút để giữ cho luật khỏi to lên nhiều.

## Ghim

[tests/rule-compiler.mjs](../../tests/rule-compiler.mjs) — 8 vế, **5 đột biến đã chạy thật, 1 sống
sót lượt đầu**: fixture đặt đầu mối trùng luôn là mã nhỏ nhất nên xếp-theo-mã và xếp-theo-đầu-mối
cho cùng kết quả, tức vế đó chỉ đang xác nhận một sự trùng hợp. Đã đảo fixture.
