---
kind: migration
repo: ALL_SKILL_MANAGEMENT
duong_dan: C:\WORKING ZONE\ALL_SKILL_MANAGEMENT
ngay: 2026-09-06
ban_khung: 1.3.8
nghe: kho kỹ năng AI — Markdown là sản phẩm · đã tự có một cơ chế hiệp đồng nhiều AI TRƯỚC khi bộ khung tới
muc_truoc: 1
muc_sau: 3
chi_phi_truoc: thả 12 · viết 17 · soi 0
chi_phi_sau: thả 0 · viết 0 · soi 0
cong_dong_phien: XANH TOÀN BỘ
trang_thai: xong
loi_tim_ra: 3
viec_audit: xong
viec_assistant: xong
viec_ke: `bootstrap.blocking` đang RỖNG cố ý — chạy vài phiên cho sạch rồi bật dần từng mã, mỗi lần ghi lý do vào `decisions.md` của repo đó
khai_boi: claude-k4-bangsong 2026-09-07, Đức chốt cho khai lại · audit: thân bài — mục 'Ba lỗi tìm ra', hai cái là bẫy im lặng · assistant: thân bài — `npm test` exit 0/53 xanh, cổng XANH TOÀN BỘ, đã đẩy 5 commit và trả ba khoá
---

## Trạng thái mới nhất

Mức 1 → **mức 3**. `npm test` **exit 0, 53 phép xanh**. Cổng cấu trúc **0 đỏ**, 65 vàng.
Cổng đóng phiên **XANH TOÀN BỘ**. Đã đẩy 5 commit, trả ba khoá.

Đây là **ca khó nhất trong ba repo đã chạm**: không phải một bộ luật gặp một repo trống, mà
**hai bộ luật hiệp đồng chồng nhau** — và điều phối AI chính là *nghề* của repo này.

## Bốn file trùng tên giữ 1824 dòng — không file nào bị đè

BƯỚC 0 (audit độc lập trước khi thả file nào) là thứ cứu lượt này. Đo trước và sau:

| File | Trước | Sau | Cách giữ |
|---|---|---|---|
| `AGENTS.md` | 191 | **269** | 86 dòng THÊM, **0 dòng xoá** — Phần B của bộ khung nối vào cuối |
| `DASHBOARD.md` | 123 | **123** | đổi tên → `DASHBOARD-THU-CONG.md`, md5 **không đổi** |
| `decisions.md` | 285 | **285** | không chạm, md5 **không đổi** |
| `handoff.md` | 1225 | **1225** | đổi tên → `HANDOFF.md`, 1225 dòng đầu md5 **không đổi** |

Kiểm chứng bằng `git diff <nhánh-dự-phòng> HEAD --numstat`, không bằng mắt.

## Ba lỗi tìm ra — hai cái là bẫy IM LẶNG

### 1. `handoff.md` và `HANDOFF.md` là CÙNG MỘT FILE trên Windows

Bộ khung đòi tên viết hoa. Thả hạt giống `HANDOFF.md` vào là **mất sạch 1225 dòng, git không
báo gì**. `npm run assess` có bắt được và gọi đúng tên — *"SAI HOA THƯỜNG — máy này không phân
biệt nên trông như đã có, máy Linux sẽ báo thiếu"* — nhưng nó nói ở mục cảnh báo, không phải
mục chặn.

Cách đổi an toàn, **hai bước**, vì `git mv a.md A.md` một bước trên Windows không ăn:

```bash
git mv handoff.md handoff-tam.md
git mv handoff-tam.md HANDOFF.md
```

Rồi đối chiếu md5 trước/sau. Đây là ca **đầu tiên** gặp; repo nào đặt tên thường đều dính.

### 2. Bộ khung ĐÓNG CỨNG tên `DASHBOARD.md` cho bản máy sinh

Repo này có một bảng theo dõi **viết tay** 123 dòng, có mirror sang Google Sheet, và được
`HANDOFF.md`, `decisions.md`, `03_templates/` trỏ tới. Chạy `npm run overview` là đè mất.

Đã đổi tên bản viết tay sang `DASHBOARD-THU-CONG.md`. **Nhưng đây là nợ của bộ khung, không
phải của repo đích**: `DASHBOARD_FILE` là hằng số trong `build-dashboard.mjs`, không khai được.
Repo nào đã có `DASHBOARD.md` viết tay đều phải đổi tên file của mình để nhường bộ sinh.

### 3. Bản trích KHÔNG mang `docs/LEGEND.md` và `docs/HUONG-DAN.md`

Tôi viết bản đồ file trỏ tới hai file đó vì repo nhà có. Kiểm lại trước khi commit thì cả hai
**không tồn tại** ở repo đích — đúng hình dạng lỗi đã đếm **năm lần** ở repo bộ khung: *luật trỏ
tới một thứ không tồn tại*. Đã gỡ hai dòng. Nhưng đây là hai file **repo mới cần nhất** (một
cuốn từ điển thuật ngữ, một bản hướng dẫn cho người mới) — ghi nợ ở repo bộ khung.

## Luật cũ: KHAI TỬ, KHÔNG XOÁ

Đức chốt 06/09: **bộ khung thắng**. `authority_matrix.md` và phần phân quyền của
`discussion_protocol.md` hết hiệu lực; khoá vùng + cổng đóng phiên là chuẩn.

Nhưng **văn bản giữ nguyên**, chỉ dán một khối cảnh báo ở đầu file. Lý do: một luật hết hiệu
lực vẫn là **bằng chứng vì sao repo từng chạy như thế**, và bộ khung này sống bằng bằng chứng.
Đó cũng là ranh giới của quyết định — nó chốt *cơ chế nào là chuẩn*, không phải *được xoá file*.

Một chỗ cố ý **không** khai tử: `discussion_protocol.md` mục 1–4 là **quy trình ghi biên bản
hội ý**, không phải cơ chế khoá, nên nó không chồng lên khoá vùng chút nào. Giữ nguyên hiệu lực.
Áp quyết định quá tay ở đây là xoá một quy trình đang chạy tốt mà chẳng giải quyết xung đột nào.

## `bootstrap.blocking` để RỖNG, cố ý

Repo vừa lắp thì bật chặn khi đang đỏ là **tự khoá repo**. 65 chỗ vàng hiện tại phần lớn là
B13/B14 (tài liệu chậm hơn code). Chạy vài phiên cho sạch rồi bật dần từng mã, mỗi lần ghi lý
do vào `decisions.md`.

## Bốn khoá vùng

`_skills` (`01_skills/` + `02_registry/` — chỗ việc nặng nhất, tách riêng để hai phiên sửa kỹ
năng và sửa tài liệu không giẫm chân) · `_docs` · `_code` · `_root`.

`rounds/` khai `append-only`: biên bản round là bằng chứng ai đã bàn gì, sửa lại sau là viết
lại lịch sử.
