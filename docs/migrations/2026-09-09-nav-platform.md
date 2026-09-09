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
viec_ke: Đức chốt cách xử 16 commit chưa đẩy (2 commit không quy thuộc được), rồi mở phiên thường trú với `drafts/DE-BAI-ONBOARD.md`
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

## Bước 8 — đo FEATURE, đo lại sau khi vá (2026-09-10)

> Khối này là **bằng chứng của bước 8**, không phải bản chép tay: sinh bằng
> `node scripts/features.mjs --migrate` ở repo này, chạy lại sau lượt vá 10/09.
> `assess.mjs` đếm FILE và báo mức 3/3; khối dưới đo NĂNG LỰC. Khoảng cách giữa
> hai con số đó chính là thứ không phép kiểm nào đang bắt.

## Checklist tính năng đã migrate — danh mục bản 1.3.73 · đo ngày 2026-09-09

> Khối này do `node scripts/features.mjs --migrate <repo>` sinh ra. **Đo, không tự khai.**
> `[x]` đủ · `[~]` một phần (xử trước) · `[ ]` thiếu · `[-]` chỉ cần ở repo phát hành.

**F1 · Bảng trạng thái** — 3/4

- [x] `F1.1` Bảng chính HTML, sinh hoàn toàn từ HEAD — kèm lưu đồ vẽ thành SVG *(từ bản 1.3.18)*
- [x] `F1.2` Ba artifact máy đọc: DASHBOARD.md · llms.txt · repo-map.json *(từ bản 1.0.0)*
- [x] `F1.3` Bảng SỐNG — F5 là thấy, ba cửa dùng một lõi *(từ bản 1.3.26)*
- [ ] `F1.4` Tab Migrate — bảng mốc ba bước, hồ sơ gập trong toggle *(từ bản 1.3.20)* — thiếu: `docs/migrations`

**F2 · Cấu trúc file và bảo trì** — 4/4

- [x] `F2.1` Repo tự khai hình dạng của mình — và MỘT bộ đọc duy nhất cho nó *(từ bản 0.3.0)*
- [x] `F2.2` Cổng kiểm cấu trúc B1–B15 *(từ bản 0.3.0)*
- [x] `F2.3` Cân nặng và ngân sách — repo phải RẺ, không chỉ ĐÚNG *(từ bản 1.1.0)*
- [x] `F2.4` Nhịp DỌN — dời sang lưu trữ, KHÔNG xoá *(từ bản 1.3.4)*

**F3 · Đa phiên — chống hai AI giẫm chân nhau** — 5/5

- [x] `F3.1` Bảng chủ sở hữu và khoá vùng, nhận/trả bằng LỆNH *(từ bản 0.3.0)*
- [x] `F3.2` Cổng đóng phiên — 11 phép kiểm, có bộ đếm chống sửa *(từ bản 0.3.0)*
- [x] `F3.3` Cổng xuất bản — thay `git push` trần *(từ bản 0.3.0)*
- [x] `F3.4` Tín hiệu 'repo chưa thấy dấu vết' — VÀNG, không bao giờ ĐỎ *(từ bản 1.3.20)*
- [x] `F3.5` Trả khoá an toàn khi còn commit chưa đẩy, kèm cửa thoát khai lý do *(từ bản 1.3.26)*

**F4 · AI assistant — hai vai, và bộ đồ nghề của vai điều phối** — 7/7

- [x] `F4.1` Sổ tay vai điều phối — có hàng rào vai cứng *(từ bản 1.3.0)*
- [x] `F4.2` Cổng nhất quán trạng thái — chạy TRƯỚC KHI BÁO CÁO *(từ bản 1.3.0)*
- [x] `F4.3` Bản đồ việc — giao ba nguồn, và luật song song một câu *(từ bản 1.3.0)*
- [x] `F4.4` Giao thức đa phiên — bốn cơ chế, năm bất biến kèm lý do *(từ bản 0.3.0)*
- [x] `F4.5` Cửa vào cho AI không tự nạp luật — một bản luật, nhiều cửa *(từ bản 0.3.0)*
- [x] `F4.6` Từ điển thuật ngữ và bản hướng dẫn cho phiên AI đầu tiên *(từ bản 1.3.11)*
- [x] `F4.7` Hai vai chia theo VIỆC — ① giữ lõi · ② phát & thu, và người sửa không tự nghiệm thu *(từ bản 1.3.44)*

**F5 · Luật và quyết định** — 5/5

- [x] `F5.1` Hiến pháp một trang — sáu việc phải hỏi người chốt, bản DUY NHẤT *(từ bản 0.3.0)*
- [x] `F5.2` Sổ quyết định — chỉ thêm, tra được ngày nào chốt gì *(từ bản 0.3.0)*
- [x] `F5.3` ADR — ghi nhận quyết định kiến trúc, có bản mẫu *(từ bản 0.3.0)*
- [x] `F5.4` Phụ lục NGHỀ — luật riêng của nghề repo, tách khỏi luật chung *(từ bản 1.3.6)*
- [x] `F5.5` Bộ biên dịch luật — sổ cái chỉ thêm, luật hiệu lực được biên dịch ra *(từ bản 1.3.82)*

**F6 · Sổ sách trạng thái** — 3/5

- [x] `F6.1` Nhật ký bàn giao — kèm TRẦN mỗi mục và nhịp xoay theo tháng, có máy canh *(từ bản 0.3.0)*
- [x] `F6.2` Sổ nợ — thứ đang HỎNG, nhóm theo mức ưu tiên *(từ bản 0.3.0)*
- [ ] `F6.3` Sổ ý tưởng — HƯỚNG ĐI, cố ý tách khỏi sổ nợ *(từ bản 1.3.2)* — thiếu: `IDEAS.md`
- [x] `F6.4` Hồ sơ trạng thái từng đơn vị công việc, có bản mẫu *(từ bản 0.3.0)*
- [ ] `F6.5` Sổ phát hành cho người đọc — mỗi bản một khối, chỉ thêm *(từ bản 0.3.0)* — thiếu: `CHANGELOG.md`

**F7 · Phát hành bộ khung — chỉ nơi PHÁT mới cần** — 0/0

- [-] `F7.1` Bản trích tự sinh, có phép kiểm không cho hai bản trôi khỏi nhau *(từ bản 1.0.0)*
- [-] `F7.2` Sổ phát hành máy đọc — mỗi bản một dấu vân tay, CHỈ THÊM *(từ bản 1.0.0)*
- [-] `F7.3` Nâng repo đã lắp — TỪ CHỐI ghi đè file đã bị sửa tay *(từ bản 1.1.0)*
- [-] `F7.5` Đo một repo cách chuẩn bao xa *(từ bản 1.0.0)*
- [-] `F7.6` Dựng repo mới từ bộ khung *(từ bản 1.0.0)*
- [-] `F7.7` Sinh đề bài đã ĐO SẴN repo đích, cho AI khác thực thi *(từ bản 1.3.15)*

**F8 · Phép kiểm và cổng chạy xa** — 5/5

- [x] `F8.1` Suite hạt giống — repo nhà CHẠY THẬT đúng cái nó phát cho người khác *(từ bản 1.0.0)*
- [x] `F8.2` Phép ghim của gói vai điều phối *(từ bản 1.3.0)*
- [x] `F8.3` Cổng kiểm chạy trên GitHub — lớp duy nhất không ở trên máy người dùng *(từ bản 1.2.0)*
- [x] `F8.4` Kiểu xuống dòng do REPO quyết, không do máy người clone *(từ bản 1.2.0)*
- [x] `F8.5` Chạy suite song song + dấu xác nhận — cổng thôi chạy lại một chuỗi vừa xanh *(từ bản 1.3.60)*

**F9 · Đối chiếu và tự nâng cấp — cái nối repo đích về bộ khung** — 2/2

- [x] `F9.1` Sổ ghim ở repo đích — repo này đang dùng bản nào *(từ bản 1.1.0)*
- [x] `F9.2` Danh mục tính năng — checklist migrate, đo được ở mọi repo *(từ bản 1.3.31)*
- [-] `F9.3` Đề bài đưa AI assistant của repo đích GO LIVE và nhận việc maintain *(từ bản 1.3.31)*

**Tổng: 34 xong · 0 một phần · 3 thiếu.**
