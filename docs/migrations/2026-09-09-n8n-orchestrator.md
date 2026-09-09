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
viec_ke: mở một phiên AI thường trú tại repo đó, dán trọn `drafts/DE-BAI-ONBOARD.md` (bước 12, sinh 10/09)
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

**F8 · Phép kiểm và cổng chạy xa** — 4/5

- [x] `F8.1` Suite hạt giống — repo nhà CHẠY THẬT đúng cái nó phát cho người khác *(từ bản 1.0.0)*
- [x] `F8.2` Phép ghim của gói vai điều phối *(từ bản 1.3.0)*
- [ ] `F8.3` Cổng kiểm chạy trên GitHub — lớp duy nhất không ở trên máy người dùng *(từ bản 1.2.0)* — thiếu: `.github/workflows`
- [x] `F8.4` Kiểu xuống dòng do REPO quyết, không do máy người clone *(từ bản 1.2.0)*
- [x] `F8.5` Chạy suite song song + dấu xác nhận — cổng thôi chạy lại một chuỗi vừa xanh *(từ bản 1.3.60)*

**F9 · Đối chiếu và tự nâng cấp — cái nối repo đích về bộ khung** — 2/2

- [x] `F9.1` Sổ ghim ở repo đích — repo này đang dùng bản nào *(từ bản 1.1.0)*
- [x] `F9.2` Danh mục tính năng — checklist migrate, đo được ở mọi repo *(từ bản 1.3.31)*
- [-] `F9.3` Đề bài đưa AI assistant của repo đích GO LIVE và nhận việc maintain *(từ bản 1.3.31)*

**Tổng: 33 xong · 0 một phần · 4 thiếu.**
