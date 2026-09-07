---
status: Accepted
adr: 0007
date: 2026-09-08
deciders: Đức (chốt 08/09 — "việc compact không làm cho dễ làm việc hơn mà còn trộn nội dung, gây khó làm việc & triển khai")
---

# ADR-0007 — Tab Migrate tách riêng: bổ sung ADR-0006, không thay nó

## Quan hệ với ADR-0006 — nói trước để không ai đọc sai

ADR-0006 chốt *"một khái niệm một chỗ"* và gộp mười tab thành **bốn nhóm**. ADR này **giữ nguyên
nguyên tắc đó** và chỉ sửa **một con số**: bốn nhóm → **năm**. ADR-0006 **không bị thay thế**;
mọi vế khác của nó còn hiệu lực.

Và điều đáng nói nhất: **ADR-0006 chưa hề sai.** Nó đúng ở chỗ nó nhắm tới — bảng khi ấy bị phân
mảnh và tự mâu thuẫn. Nhưng lượt gộp đó gộp **hơi quá một nhịp**, và chính nguyên tắc của nó
(*"một khái niệm một chỗ"*) là thứ đòi tách lại.

## Bối cảnh — số đo, không phải cảm giác

Đức nêu 08/09: *"có vẻ việc compact không làm cho dễ làm việc hơn mà còn trộn nội dung"*. Đo lại
trên bảng đang chạy, đếm chữ `migrate` theo từng tab:

| Tab | Số lần | Chứa gì của việc migrate |
|---|---|---|
| Công việc | **59** | **sổ migrate** ba lượt, kèm bảng đối chiếu tính năng |
| Hệ thống | **53** | **quy trình migrate** (`docs/workflows/02-…`) |
| Lịch sử | 41 | chỉ là chữ trong nhật ký phiên bản — không phải bộ máy |

Nên **hai nửa của MỘT việc nằm ở HAI tab**: muốn làm một lượt migrate thì phải mở quy trình ở tab
này và sổ ở tab kia. Đó đúng là vi phạm *"một khái niệm một chỗ"* — chỉ là vi phạm theo chiều
ngược với chiều ADR-0006 lo.

## Quyết định

⑴ **Bảng có NĂM nhóm**: `tong-quan` · `cong-viec` · **`migrate`** · `he-thong` · `lich-su`.

⑵ **Tab Migrate gom đủ một việc**: quy trình migrate · sổ ba lượt migrate · bảng đối chiếu tính
năng (vốn đã nằm trong sổ). Vào tab đó là làm được trọn một lượt migrate, không phải mở tab khác.

⑶ **Khối quy trình MỞ SẴN** trong tab đó. Lý do: vào tab Migrate là để làm migrate, nên thứ đầu
tiên cần đọc không được nằm sau một cú bấm. Các khối còn lại gập, theo đúng cơ chế gập+lưới của
tab Hệ thống.

⑷ **Chia theo DỮ LIỆU, không theo tên file.** Workflow nào khai `nhom: migrate` trong frontmatter
thì về tab đó. Lọc theo tên file thì một lượt đổi tên file làm tab rỗng **mà không phép kiểm nào
đỏ** — đúng loại hỏng im lặng mà cả repo này sinh ra để chữa.

⑸ **Phép ghim đổi có chủ ý, và đây là chỗ đáng đọc kỹ.** `overview-smoke.mjs` có một vế
`assert.deepEqual(nut, BON_NHOM)` — nó **đỏ ngay** khi tab thứ năm xuất hiện, và nó đỏ **đúng**:
vế đó sinh ra để bắt cả việc thiếu nhóm lẫn việc *"ai đó lặng lẽ thêm nhóm thứ năm"*. Tôi sửa nó
thành `NAM_NHOM` **kèm ADR này**, không phải sửa cho hết đỏ. Ai đọc mã đó về sau mà không tìm thấy
ADR-0007 thì hãy nghi ngờ lượt sửa ấy.

Hai vế cũ khác cũng phải đổi đích, và cả hai đổi **đích** chứ không đổi **ý**: *"sổ migrate phải
đến được từ trang mẹ"* (nay nhận cả nhãn `<summary>`, vì tab gập được) và *"sổ migrate nằm trong
nhóm Công việc"* → **nhóm Migrate**.

⑹ **Vế mới, và nó là vế chịu tải:** phép ghim không đo *"có tab Migrate không"* — quá dễ đạt. Nó
đo **hai nửa đó nằm CÙNG một tab**: quy trình phải ở tab Migrate **và không còn ở tab Hệ thống**,
sổ phải ở tab Migrate **và không còn ở tab Công việc**. Kiểu hỏng cần canh là ai đó sau này gom
lại *"cho gọn bảng"*, và lúc ấy **trang trông vẫn đẹp** — chỉ là người làm migrate lại phải mở
hai tab.

## Cái MẤT — ghi rõ, không giấu

- **Một nhóm nữa để nhìn.** ADR-0006 gộp lại vì mười tab là quá nhiều; năm nhóm là một bước đi
  ngược, và bước tiếp theo cùng chiều thì phải chứng minh lại.
- **Tab Hệ thống vẫn còn 51 lần chữ `migrate`.** Đó là văn xuôi trong sổ tay và quy trình đầy đủ
  nhắc tới migrate — không phải bộ máy, nên **cố ý không dời**. Đừng đọc con số đó thành "chưa xong".
- **Một trường frontmatter mới** (`nhom`) mà chỉ đúng một file dùng. Nếu ba tháng nữa vẫn chỉ một
  file dùng thì nó là một cơ chế cho một ca — lúc đó đáng xét gỡ.

## Kèm theo — một bản vẽ đã chết, lộ ra lúc đo

Lượt này tìm thấy **hai** bộ vẽ workflow trong `build-overview.mjs`: hàm `tabWorkflow` và một khối
lồng thẳng trong tab Hệ thống. Đếm ở bản đã commit: chuỗi `tabWorkflow` xuất hiện **đúng một lần**
— tức chỉ có định nghĩa, **chưa bao giờ được gọi**.

Đó là loại mã chết tệ nhất: một bản sao trông y như bản thật, nên lượt sau sửa nhầm vào đó rồi
tưởng đã sửa. Đã xoá, và nay **một** bộ vẽ dùng cho cả hai tab. Có phép ghim canh rằng nó còn
đúng một bản.
