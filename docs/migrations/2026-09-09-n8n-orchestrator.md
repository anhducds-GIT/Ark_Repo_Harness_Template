---
kind: migration
repo: n8n-orchestrator
duong_dan: C:\WORKING ZONE\n8n-orchestrator
ngay: 2026-09-09
ban_khung: 1.8.0
nghe: Control Plane điều phối n8n — YAML là sản phẩm · Python (tools/) · có ma trận quyền theo HÃNG trước khi bộ khung tới
muc_truoc: 1
muc_sau: 3
chi_phi_truoc: thả 1 · viết 2 · soi 15
chi_phi_sau: thả 0 · viết 0 · soi 1
cong_dong_phien: XANH TOÀN BỘ
trang_thai: xong
loi_tim_ra: 3
viec_audit: xong
viec_assistant: xong
viec_ke: `CP-5` — khai `chu_de:` cho ADR-0000 rồi thêm `B16` vào `bootstrap.blocking`
khai_boi: harness-migrate-3repo 2026-09-09
---

> Lượt thứ hai ở repo này; lượt trước là [2026-09-08](2026-09-08-n8n-orchestrator.md) (bản 1.3.67).

## HAI cơ chế tới rồi mà nằm không — và cả hai đều KHÔNG đỏ

Đây là chủ đề của cả lượt migrate hôm nay, và nó lặp ở cả ba repo.

| # | Thứ | Vì sao `upgrade --apply` không mang được | Hệ quả nếu không ai để ý |
|---|---|---|---|
| 1 | `bang-song/` chưa khai vào `areas` | `areas` nằm trong `.repo-structure.json` — file cố ý thuộc repo đích | `B3` ĐỎ. Cái này ít nhất còn **đỏ** |
| 2 | `budget.tokenNap` chưa khai | cùng file, cùng lý do | Cổng báo *"chưa đo"* rồi **XANH**. Bộ nén luật hạ cánh ở trạng thái **TẮT**, im lặng mãi mãi |

Thư mục `bang-song/` có ở repo này **từ bản 1.3.26** mà chưa lượt nào khai. Nghĩa là chỗ hụt này
đã sống qua **ba** lượt nâng trước khi ai nhìn thấy.

Đo nạp lần đầu: **5.816 token** (`AGENTS.md` 199 dòng / 5.036 · `STATUS.md` 39 dòng / 780).
Trần đặt **7.600** = số thật + biên 30%.

## `bootstrap.blocking` RỖNG suốt 4 ngày — cổng cấu trúc không cưỡng chế gì

Repo lắp bộ khung 05/09 với `blocking: []`. **Đúng cho lượt lắp đầu** — brief bắt như thế, vì bật
chặn lúc đang đỏ là tự khoá repo. Nhưng không ai quay lại bật, nên suốt bốn ngày mọi chỗ đỏ của
dãy B đều chỉ là cảnh báo, và cảnh báo đọc mãi thì thành nền.

Bật `B1 B2 B3 B4 B10 B12` — **sáu mã đã ĐO XANH tại repo này hôm nay**, nên bật chúng không thể
khoá repo. `B16` cố ý đứng ngoài vì đang đỏ.

> Rút ra: *"để rỗng lúc lắp"* phải đi kèm *"bật ở lượt sau"*, nếu không nó chỉ là tắt vĩnh viễn
> có lý do nghe hay.

## Chỗ tôi vấp: `log/` là vùng CHỈ-THÊM, và phép kiểm chặn theo TRẠNG THÁI GIT

Tôi ghi nhật ký vào `log/2026-09.md`. Cổng ĐỎ. Đọc kỹ thì phép kiểm lọc
`inAppendOnlyArea(file) && /[MDR]/.test(code)` — nó **không** đọc nội dung, chỉ đọc trạng thái
git. Nên **tháng nào đã có file log thì tháng đó hết chỗ thêm**: mọi lượt thêm dòng đều là `M`.

Lượt 08/09 vấp một biến thể của đúng chỗ này (ghi vào file tháng CŨ). Cùng gốc bệnh, khác mặt.
Đã trả `log/2026-09.md` về nguyên trạng, nhật ký sang `HANDOFF.md` mục `## Log` — nơi các lane
trước vẫn ghi.

## Đo tại chỗ

- `npm test`: **13/13 + 54/54 xanh**.
- Cổng đóng phiên: **XANH TOÀN BỘ**. Đã đẩy (5 commit, mọi commit mang nhãn `Lane:`).
- `B8` vàng 7 chỗ — `views/` do bộ sinh RIÊNG của repo này, đỏ sẵn từ trước, không thuộc lượt này.
- Đóng dấu niêm phong bảng quyền lần đầu (`--restamp`): bảng này chưa từng có dấu.
