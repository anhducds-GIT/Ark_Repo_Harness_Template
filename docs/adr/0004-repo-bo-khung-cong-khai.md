---
status: Accepted
adr: 0004
date: 2026-09-04
deciders: Đức (chuyển repo sang public 04/09, sau khi cân ba đường: nâng Pro · để public · chấp nhận)
---

# ADR-0004 — Repo bộ khung công khai; các repo còn lại vẫn kín

## Bối cảnh

ADR-0003 đóng băng `v1.2.17` và ghi rõ **chỗ hở duy nhất còn lại**: CI **báo** chứ chưa **chặn**.
Mọi lớp bảo vệ của bộ khung chạy trên máy người dùng, nên `git push` trần đi qua hết; CI trên
GitHub là chỗ duy nhất không tắt được từ máy mình — nhưng nó chỉ thành hàng rào khi bật
`required status check`, mà nút đó đòi repo **public** hoặc gói **Pro**.

Ba đường đã trình: nâng Pro · để public · chấp nhận CI chỉ báo. Đức chọn **public**.

## Quyết định

**`Ark_Repo_Harness_Template` công khai. Các repo khác giữ nguyên kín.**

Đây **không** phải quy tắc "từ nay repo nào cũng public". Ngược lại: nó là quy tắc **chỉ bộ khung**,
và lý do nằm ở chỗ ba loại repo này khác nhau về bản chất:

| Loại repo | Trong đó có gì | Kín hay mở |
|---|---|---|
| **Bộ khung** | luật, bộ sinh, phép kiểm — không có dữ liệu của ai | **mở** |
| Repo có việc thật (`nav_platform_main`, `Project 3 AI`, extension…) | dữ liệu vận hành, bằng chứng, việc nội bộ | **kín** |

Bộ khung mở được vì nó **không chứa gì để mất**: nó là bộ luật và bộ máy kiểm bộ luật đó. Một
repo có dữ liệu thật thì mở ra là công bố dữ liệu, và không nút CI nào đáng giá bằng.

Với repo kín cần chặn thật, đường còn lại là **Pro** — quyết định riêng cho từng repo, khi có
repo nào thật sự cần.

## Đã kiểm trước khi mở, không mở rồi mới lo

Public nghĩa là **toàn bộ lịch sử** thành đọc được, mà cổng đóng phiên chỉ soi **cây làm việc** —
nó chưa bao giờ soi lịch sử. Nên trước khi bật gì, đã quét cả 108 commit:

- giá trị hình dạng token, hai mẫu khác nhau → **không có**
- biến môi trường gán giá trị dài → **không có**
- `.env` / `.pem` / `.key` từng được commit → **không có**
- bốn chỗ khớp mẫu → **đều vô hại**: một chú thích giải thích chính mẫu dò, và một đồ giả trong
  phép kiểm (`test-one-session-token`, dựng bằng nối chuỗi)

Đã quét cả `Chrome_Extension_AI_Agentic` (668 commit) vì repo đó cũng vừa mở: cũng sạch.

## Đã bật những gì

| Bật gì | Trạng thái |
|---|---|
| `required status check` = `cong-kiem` trên `main` | bật |
| nhánh phải cập nhật trước khi merge (`strict`) | bật |
| cấm force-push lên `main` | bật |
| cấm xoá nhánh `main` | bật |
| secret scanning | bật |
| **push protection** (chặn ngay lúc push) | bật |

## Biên của nó — nói thẳng, đừng để ai tưởng nhầm

**`enforce_admins` để TẮT, có chủ ý.** Nghĩa là hàng rào này chặn **merge qua PR**, không chặn
chủ repo đẩy thẳng lên `main`.

Bật nó lên thì mọi thay đổi — kể cả một dòng Log — đều phải đi qua PR, và cả dòng chảy
`safe-push` của các phiên AI sẽ gãy. Với một repo một chủ, cái giá đó lớn hơn cái được.

Nên phát biểu đúng là: **CI nay chặn được đường PR, và `push protection` chặn secret ngay lúc
push với mọi đường.** Đẩy thẳng lên `main` vẫn là chuyện của kỷ luật (`safe-push`), không phải
của hàng rào. Ai đọc ADR này mà tưởng "từ nay không đẩy ẩu được nữa" là hiểu sai.

## Vì sao không chọn cách khác

- **Nâng Pro:** tốn tiền cho đúng một tính năng, mà bộ khung vốn không có gì cần giấu.
- **Chấp nhận CI chỉ báo:** để nguyên chỗ hở đã ghi trong ADR-0003, trong khi cách đóng nó
  miễn phí và không mất gì.
- **Bật `enforce_admins`:** xem mục biên ở trên — gãy dòng chảy hiện tại để đổi lấy một hàng rào
  mà chính chủ repo phải tự vượt qua mỗi ngày.
