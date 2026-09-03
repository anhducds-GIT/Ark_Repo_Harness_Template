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
cong_dong_phien: đỏ
trang_thai: chưa đóng được
loi_tim_ra: 9
---

## Trạng thái mới nhất

Bộ khung đã lắp xong và **đo được**: mức 1 → **mức 3**, nợ về 0. Nhưng **cổng đóng phiên vẫn
đỏ một mục**, và nó đỏ vì một lý do nằm ngoài tầm của người migrate.

## Vì sao chưa đóng được

Repo này có một bộ test **đã hỏng từ trước khi bộ khung vào** (thiếu file `app/index.html`).
Cổng đóng phiên đòi suite xanh. Quy trình lại cấm dọn nợ cũ của repo đích:

> "Việc KHÔNG thuộc quy trình này: **dọn nợ cũ của repo đích**."

Hai câu đó **mâu thuẫn nhau** ở đúng ca này: một repo đang sống mà suite đỏ sẵn thì không thể
vừa xanh vừa không dọn nợ. Đây là lỗ hổng của **quy trình**, không phải của repo NAV.

## Báo cáo đầy đủ

`drafts/MIGRATE-REPORT-NAV.md` trong chính repo đó — 9 lỗi của bộ khung, mỗi lỗi kèm lệnh
tái hiện.

Bốn lỗi NẶNG đáng nhớ:

- Bảng máy sinh **không bao giờ "tươi" được**, nên cổng đỏ vĩnh viễn.
- Sai hoa thường lọt qua trên Windows — **đã vá giữa phiên**.
- Trả quyền xong là phép kiểm "Test xanh" **tự chuyển sang XANH** — xanh vì rỗng.
- Quy trình đòi cổng xanh nhưng cấm dọn thứ làm cổng đỏ.

## Câu hỏi mở

- **Cần Đức chốt:** bộ QA cũ của NAV — dọn, hay để nguyên và cho phép cổng đỏ có điều kiện?
- Quy trình cần một lối thoát cho ca "repo đích đỏ sẵn": ghi nhận nợ nền và cho qua, hay bắt
  dọn trước khi migrate?
- Repo dùng nhiều nhánh; nhánh `main` trên máy đã rẽ khỏi `origin/main`.
