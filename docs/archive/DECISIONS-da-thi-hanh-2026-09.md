# Quyết định ĐÃ THI HÀNH — lưu trữ

**Dời bằng `npm run luat -- --trim`, 09/09.** Máy chỉ cắt mục đã KHAI `> **trạng thái:** đã thi
hành` — nó không tự suy. Ba lượt bắt oan cùng ngày cho thấy một mục sổ quyết định thường chứa CẢ
bản ghi việc đã xong LẪN một nguyên tắc vẫn đang sống, nên không tín hiệu máy nào cắt an toàn được.
Chữ giữ nguyên từng byte, chỉ đổi chỗ.

## 2026-09-06 (tối) · KHUNG-23 đã THI HÀNH — và một chỗ tôi cố ý không áp quyết định quá tay

> **trạng thái:** đã thi hành — bản ghi một lượt thi hành, mọi mã việc trong đó đã đóng.

Đức duyệt thi hành migrate `ALL_SKILL_MANAGEMENT`. Đã xong, cổng XANH TOÀN BỘ, đã đẩy.
Hồ sơ đầy đủ: [docs/migrations/2026-09-06-all-skill-management.md](docs/migrations/2026-09-06-all-skill-management.md).

**Bốn file trùng tên giữ 1824 dòng — không file nào bị đè.** Kiểm bằng
`git diff <nhánh-dự-phòng> HEAD --numstat`, không bằng mắt: `AGENTS.md` **86 thêm / 0 xoá**;
`HANDOFF.md` **48 thêm / 0 xoá**; `DASHBOARD` và `decisions.md` md5 y nguyên.

### Một chỗ tôi KHÔNG áp quyết định — nói rõ để Đức bác nếu thấy sai

Quyết định *"bộ khung thắng, bỏ luật cũ"* được đưa ra cho **hai hệ KHOÁ chồng nhau**.
`authority_matrix.md` đúng là hệ đó — nó quy định ai được quyết, ai được sửa. Đã khai tử.

Nhưng `discussion_protocol.md` mục 1–4 là **quy trình ghi biên bản hội ý nhiều AI** — nó không
quy định ai được sửa gì, không chồng lên khoá vùng chút nào. **Tôi giữ nguyên hiệu lực phần đó**,
và chỉ khai tử phần vai trò.

Lý do: áp quyết định quá tay ở đây là xoá một quy trình đang chạy tốt mà **không giải quyết xung
đột nào** — vì không có xung đột. Nếu Đức muốn khai tử cả file, một câu là tôi làm.

### Ba lỗi mới của BỘ KHUNG, do lượt migrate này lôi ra

- **KHUNG-26** — bộ khung đóng cứng tên `DASHBOARD.md`. Repo đích có bảng viết tay cùng tên thì
  chạy bộ sinh một lần là đè mất. Bộ khung là khách mà đang bắt chủ nhà dọn phòng.
- **KHUNG-27** — bản trích không mang `docs/LEGEND.md` và `docs/HUONG-DAN.md`, đúng lúc repo mới
  cần chúng nhất.
- **`handoff.md` vs `HANDOFF.md` là CÙNG MỘT FILE trên Windows** — thả hạt giống vào là mất 1225
  dòng mà git không báo gì. Đã thành một mục của quy trình migrate.

Cả ba đều **chỉ lộ khi chạm một repo thật**. Bảy phiên ở repo nhà không tìm ra cái nào — lý do
rất cụ thể: repo nhà đặt tên file đúng chuẩn từ đầu, và chưa bao giờ có bảng viết tay.

---

