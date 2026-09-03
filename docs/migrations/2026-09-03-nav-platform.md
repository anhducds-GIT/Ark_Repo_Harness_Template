---
kind: migration
repo: NAV Platform V1 (chứng khoán)
duong_dan: C:\WORKING ZONE\Đầu tư Chứng khoán\nav_platform_main
ngay: 2026-09-03
ban_khung: 0.3.0
nghe: nền tảng phân tích kỹ thuật · dữ liệu chứng khoán EOD · Node + Python
muc_truoc: 1
muc_sau: 3
chi_phi_truoc: thả 7 · viết 9 · soi 0
chi_phi_sau: thả 0 · viết 0 · soi 0
cong_dong_phien: xanh
trang_thai: đã đóng
loi_tim_ra: 9
---

## Trạng thái mới nhất

**Đã đóng — cổng XANH TOÀN BỘ.** Mức 1 → **mức 3**, nợ về 0.

Đức chốt ngày 03/09: dọn nợ QA. Hoá ra là **hai việc khác hẳn nhau**:

- `calendar-bootstrap` trỏ vào `app/index.html`, nhưng file đã đổi tên thành
  `app/NAV Dashboard.html` từ commit `d4b3cfb3`. Sửa đường dẫn — đạt ngay.
- 5 test `R01 V2` **đỏ ngay tại commit sinh ra chúng** (`4841ba92`). Chúng chưa từng bảo vệ
  điều gì; đó là đặc tả mong muốn commit vào lúc tính năng chưa xong.

Không xoá (mất ý định), không để đỏ triền miên (người ta thôi đọc suite). Cho vào danh sách
**miễn trừ CÓ HẠN**: lý do · người chốt · hạn 2026-12-02. Quá hạn là đỏ trở lại; đạt rồi thì
suite tự báo để xoá khỏi danh sách.

`npm test` nay xanh: **127/132 PASS + 5 nợ đã khai**.

## Báo cáo đầy đủ

`drafts/MIGRATE-REPORT-NAV.md` trong chính repo đó — 9 lỗi của bộ khung, mỗi lỗi kèm lệnh
tái hiện.

Bốn lỗi NẶNG đáng nhớ:

- Bảng máy sinh **không bao giờ "tươi" được**, nên cổng đỏ vĩnh viễn.
- Sai hoa thường lọt qua trên Windows — **đã vá giữa phiên**.
- Trả quyền xong là phép kiểm "Test xanh" **tự chuyển sang XANH** — xanh vì rỗng.
- Quy trình đòi cổng xanh nhưng cấm dọn thứ làm cổng đỏ.

## Câu hỏi mở

- ~~Bộ QA cũ: dọn hay để nguyên?~~ **Đức chốt 03/09: dọn. Đã xong.**
- Repo dùng nhiều nhánh; nhánh `main` trên máy đã rẽ khỏi `origin/main`.
- Miễn trừ hết hạn **2026-12-02** — tới đó hoặc R01 V2 làm xong, hoặc phải gia hạn có lý do.
