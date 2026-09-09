---
kind: migration
repo: nav_platform_main
duong_dan: C:\WORKING ZONE\Đầu tư Chứng khoán\nav_platform_main
ngay: 2026-09-09
ban_khung: 1.8.0
nghe: Dashboard NAV danh mục + lớp Radar giá–khối lượng cổ phiếu VN — Node + Python, dữ liệu EOD
muc_truoc: 1
muc_sau: 3
chi_phi_truoc: thả 1 · viết 3 · soi 15
chi_phi_sau: thả 0 · viết 0 · soi 0
cong_dong_phien: CHẶN không có chỗ đỏ (cổng đóng phiên CHƯA chạy trọn — xem "Còn mở")
trang_thai: xong-mot-phan
loi_tim_ra: 3
viec_audit: xong
viec_assistant: một phần
viec_ke: `NAV-4` — nén `AGENTS.md` (302 dòng / 8.279 token) xuống dưới 6.000 rồi siết trần
khai_boi: harness-migrate-3repo 2026-09-09
---

## Cổng TỪ CHỐI CHẠY ngay lượt đầu — và nó đúng

`bootstrap.blocking` của repo này khai `B5` và `B7`. Bản 1.8.0 **gộp cả hai vào `B2`**. Cổng ném
`CHAN_MA_LA` và dừng hẳn thay vì lặng lẽ tha:

> *một mã gõ sai là một phép kiểm tưởng đang chặn mà thật ra không chặn gì*

**Đây là ca chung cho MỌI repo ghim bản trước 1.8.0**, không riêng repo này. Đã gấp vào
[MIGRATE-REPO.md](../briefs/MIGRATE-REPO.md) bước 4.

Sửa xong danh sách mà cổng **vẫn** kể lỗi cũ — vì tôi chưa commit. **Cổng đọc HEAD, không đọc
đĩa.** Cùng bẫy với `last_verified_commit`, và nó ăn của tôi một vòng chạy.

## Thứ nguy hơn cả ba chỗ đỏ: một phép đo hạ cánh ở trạng thái TẮT

`upgrade --apply` mang bộ nén luật (`scripts/rule-compiler.mjs` · `npm run luat`) tới, nhưng
**không mang `budget.tokenNap`** — nó nằm trong `.repo-structure.json`, file cố ý thuộc repo đích
(`TEP_CUA_REPO_DICH`). Chưa khai thước thì cổng báo *"chưa khai thước thì không đo"* rồi **XANH**.

Tính năng tới rồi mà nằm không, và **không phép kiểm nào kể tên nó**. Cùng họ với `KHUNG-48`.

| | Repo này | Bộ khung cùng ngày |
|---|---|---|
| `AGENTS.md` | 302 dòng · **8.279 token** | 162 dòng · 3.432 token |
| `STATUS.md` | 49 dòng · 773 token | 34 dòng · 619 token |
| **tổng nạp mỗi phiên** | **9.052** | 4.051 |

Trần đặt **11.800** = số thật + biên 30%. Nó chặn phình thêm, **không** nói 9.052 là ổn. Nén
`AGENTS.md` của repo đích không thuộc lượt migrate (brief cấm *"đổi luật repo đích cho giống repo
nhà"*, và `AGENTS.md` là một trong bốn file cấm đè) → nợ `NAV-4`.

## So HAI CHIỀU trước khi nghĩ tới `--force`

`comm -3` danh sách hàm export của `template/scripts/*.mjs` với bản ở đích: **rỗng ở cột repo
đích**. Repo này chỉ đi SAU, không đi trước. Không file nào ở trạng thái `SỬA TAY`, nên `--apply`
sạch — không cần `--force`, không xoá việc của ai.

## Đo tại chỗ

- `tests/khoa-file.mjs` mới: **12 vế xanh** (bản cũ 7) — dấu niêm phong bảng quyền chạy thật ở đây.
- `check-bootstrap`: **CHẶN không có chỗ đỏ** · 1 đỏ ngoài nhóm chặn (`B16`) · 98 vàng
  (`B6`/`B9`/`B14`, đỏ sẵn từ trước lượt này).
- `B16` đỏ vì `ADR-0000` thiếu `chu_de:`. **Cố ý không bật vào `blocking`** — bật chặn lúc đang
  đỏ là tự khoá repo → nợ `NAV-5`.
- Dựng mới `decisions.md`: repo này chưa từng có sổ quyết định.

## CÒN MỞ — phải báo Đức

Repo này có **9 commit chưa đẩy** (đếm lại cuối lượt: 4 của lane trước + 5 của tôi), trong đó
**2 không quy thuộc được**: `a222239` không có nhãn `Lane:` nào (lane trước), và `1f49daf` **của
tôi** mang nhãn `harness Asistant migration` — có nhãn nhưng máy **từ chối** vì có khoảng trắng. Tên phiên tôi được giao có khoảng trắng, và
`laneFromMessage` từ chối nhãn có khoảng trắng (`LANE_CO_KHOANG_TRANG`) — tôi phát hiện sau khi
đã commit, và **không tự sửa lịch sử** vì `AGENTS.md` mục 2 bắt hỏi trước.

`safe-push` sẽ từ chối. **Chỉ Đức gỡ được** bằng `--carry`. Lượt này **chưa đẩy repo đó**.
