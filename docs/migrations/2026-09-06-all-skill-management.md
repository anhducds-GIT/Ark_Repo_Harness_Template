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

---

## Checklist tính năng đã migrate — danh mục bản 1.3.31 · đo ngày 2026-09-07

> Khối này do `node scripts/features.mjs --migrate <repo>` sinh ra. **Đo, không tự khai.**
> `[x]` đủ · `[~]` một phần (xử trước) · `[ ]` thiếu · `[-]` chỉ cần ở repo phát hành.

**F1 · Bảng trạng thái** — 1/4

- [x] `F1.1` Bảng chính HTML, sinh hoàn toàn từ HEAD *(từ bản 1.3.18)*
- [~] `F1.2` Ba artifact máy đọc: DASHBOARD.md · llms.txt · repo-map.json *(từ bản 1.0.0)* — thiếu: `npm run dashboard`
- [ ] `F1.3` Bảng SỐNG — F5 là thấy, ba cửa dùng một lõi *(từ bản 1.3.26)* — thiếu: `bang-song/loi.mjs` `bang-song/may-chu.mjs` `bang-song/mot-luot.mjs` `bang-song/Bat-tu-chay.cmd` `bang-song/Tat-tu-chay.cmd` `npm run bang-song`
- [ ] `F1.4` Tab Migrate — bảng mốc ba bước, hồ sơ gập trong toggle *(từ bản 1.3.20)* — thiếu: `docs/migrations`

**F2 · Cấu trúc file và bảo trì** — 4/4

- [x] `F2.1` Repo tự khai hình dạng của mình *(từ bản 0.3.0)*
- [x] `F2.2` Cổng kiểm cấu trúc B1–B15 *(từ bản 0.3.0)*
- [x] `F2.3` Cân nặng và ngân sách — repo phải RẺ, không chỉ ĐÚNG *(từ bản 1.1.0)*
- [x] `F2.4` Nhịp DỌN — dời sang lưu trữ, KHÔNG xoá *(từ bản 1.3.4)*

**F3 · Đa phiên — chống hai AI giẫm chân nhau** — 2/5

- [x] `F3.1` Bảng chủ sở hữu và khoá vùng, nhận/trả bằng LỆNH *(từ bản 0.3.0)*
- [~] `F3.2` Cổng đóng phiên — 11 phép kiểm, có bộ đếm chống sửa *(từ bản 0.3.0)* — thiếu: `npm run gate`
- [~] `F3.3` Cổng xuất bản — thay `git push` trần *(từ bản 0.3.0)* — thiếu: `npm run push`
- [ ] `F3.4` Tín hiệu 'repo chưa thấy dấu vết' — VÀNG, không bao giờ ĐỎ *(từ bản 1.3.20)* — thiếu: `tests/khoa-dau-vet.mjs`
- [x] `F3.5` Trả khoá an toàn khi còn commit chưa đẩy, kèm cửa thoát khai lý do *(từ bản 1.3.26)*

**F4 · AI assistant — vai điều phối** — 6/6

- [x] `F4.1` Sổ tay vai điều phối — có hàng rào vai cứng *(từ bản 1.3.0)*
- [x] `F4.2` Cổng nhất quán trạng thái — chạy TRƯỚC KHI BÁO CÁO *(từ bản 1.3.0)*
- [x] `F4.3` Bản đồ việc — giao ba nguồn, và luật song song một câu *(từ bản 1.3.0)*
- [x] `F4.4` Giao thức đa phiên — bốn cơ chế, năm bất biến kèm lý do *(từ bản 0.3.0)*
- [x] `F4.5` Cửa vào riêng cho từng AI — một bản luật, nhiều cửa *(từ bản 0.3.0)*
- [x] `F4.6` Từ điển thuật ngữ và bản hướng dẫn cho phiên AI đầu tiên *(từ bản 1.3.11)*

**F5 · Luật và quyết định** — 4/4

- [x] `F5.1` Hiến pháp một trang — sáu việc phải hỏi người chốt, bản DUY NHẤT *(từ bản 0.3.0)*
- [x] `F5.2` Sổ quyết định — chỉ thêm, tra được ngày nào chốt gì *(từ bản 0.3.0)*
- [x] `F5.3` ADR — ghi nhận quyết định kiến trúc, có bản mẫu *(từ bản 0.3.0)*
- [x] `F5.4` Phụ lục NGHỀ — luật riêng của nghề repo, tách khỏi luật chung *(từ bản 1.3.6)*

**F6 · Sổ sách trạng thái** — 3/5

- [x] `F6.1` Nhật ký bàn giao — phiên sau đọc phần cuối là biết phiên trước làm tới đâu *(từ bản 0.3.0)*
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

**F8 · Phép kiểm và cổng chạy xa** — 3/4

- [x] `F8.1` Suite hạt giống — repo nhà CHẠY THẬT đúng cái nó phát cho người khác *(từ bản 1.0.0)*
- [x] `F8.2` Phép ghim của gói vai điều phối *(từ bản 1.3.0)*
- [ ] `F8.3` Cổng kiểm chạy trên GitHub — lớp duy nhất không ở trên máy người dùng *(từ bản 1.2.0)* — thiếu: `.github/workflows`
- [x] `F8.4` Kiểu xuống dòng do REPO quyết, không do máy người clone *(từ bản 1.2.0)*

**F9 · Đối chiếu và tự nâng cấp — cái nối repo đích về bộ khung** — 1/2

- [x] `F9.1` Sổ ghim ở repo đích — repo này đang dùng bản nào *(từ bản 1.1.0)*
- [ ] `F9.2` Danh mục tính năng — checklist migrate, đo được ở mọi repo *(từ bản 1.3.31)* — thiếu: `features.json` `scripts/features.mjs` `npm run features`
- [-] `F9.3` Đề bài đưa AI assistant của repo đích GO LIVE và nhận việc maintain *(từ bản 1.3.31)*

**Tổng: 24 xong · 3 một phần · 7 thiếu.**


> **Khối này THÊM VÀO ngày 2026-09-07**, sau lượt migrate — bởi phiên `claude-bang-gon`.
> Danh mục tính năng chưa tồn tại lúc lượt ấy chạy, nên hồ sơ gốc không có checklist. Chữ phần
> trên **không sửa một dòng nào**: hồ sơ migrate là vùng chỉ thêm.

---

## Checklist tính năng đã migrate — danh mục bản 1.3.31 · đo ngày 2026-09-07

> Khối này do `node scripts/features.mjs --migrate <repo>` sinh ra. **Đo, không tự khai.**
> `[x]` đủ · `[~]` một phần (xử trước) · `[ ]` thiếu · `[-]` chỉ cần ở repo phát hành.

**F1 · Bảng trạng thái** — 3/4

- [x] `F1.1` Bảng chính HTML, sinh hoàn toàn từ HEAD *(từ bản 1.3.18)*
- [x] `F1.2` Ba artifact máy đọc: DASHBOARD.md · llms.txt · repo-map.json *(từ bản 1.0.0)*
- [x] `F1.3` Bảng SỐNG — F5 là thấy, ba cửa dùng một lõi *(từ bản 1.3.26)*
- [ ] `F1.4` Tab Migrate — bảng mốc ba bước, hồ sơ gập trong toggle *(từ bản 1.3.20)* — thiếu: `docs/migrations`

**F2 · Cấu trúc file và bảo trì** — 4/4

- [x] `F2.1` Repo tự khai hình dạng của mình *(từ bản 0.3.0)*
- [x] `F2.2` Cổng kiểm cấu trúc B1–B15 *(từ bản 0.3.0)*
- [x] `F2.3` Cân nặng và ngân sách — repo phải RẺ, không chỉ ĐÚNG *(từ bản 1.1.0)*
- [x] `F2.4` Nhịp DỌN — dời sang lưu trữ, KHÔNG xoá *(từ bản 1.3.4)*

**F3 · Đa phiên — chống hai AI giẫm chân nhau** — 5/5

- [x] `F3.1` Bảng chủ sở hữu và khoá vùng, nhận/trả bằng LỆNH *(từ bản 0.3.0)*
- [x] `F3.2` Cổng đóng phiên — 11 phép kiểm, có bộ đếm chống sửa *(từ bản 0.3.0)*
- [x] `F3.3` Cổng xuất bản — thay `git push` trần *(từ bản 0.3.0)*
- [x] `F3.4` Tín hiệu 'repo chưa thấy dấu vết' — VÀNG, không bao giờ ĐỎ *(từ bản 1.3.20)*
- [x] `F3.5` Trả khoá an toàn khi còn commit chưa đẩy, kèm cửa thoát khai lý do *(từ bản 1.3.26)*

**F4 · AI assistant — vai điều phối** — 6/6

- [x] `F4.1` Sổ tay vai điều phối — có hàng rào vai cứng *(từ bản 1.3.0)*
- [x] `F4.2` Cổng nhất quán trạng thái — chạy TRƯỚC KHI BÁO CÁO *(từ bản 1.3.0)*
- [x] `F4.3` Bản đồ việc — giao ba nguồn, và luật song song một câu *(từ bản 1.3.0)*
- [x] `F4.4` Giao thức đa phiên — bốn cơ chế, năm bất biến kèm lý do *(từ bản 0.3.0)*
- [x] `F4.5` Cửa vào riêng cho từng AI — một bản luật, nhiều cửa *(từ bản 0.3.0)*
- [x] `F4.6` Từ điển thuật ngữ và bản hướng dẫn cho phiên AI đầu tiên *(từ bản 1.3.11)*

**F5 · Luật và quyết định** — 4/4

- [x] `F5.1` Hiến pháp một trang — sáu việc phải hỏi người chốt, bản DUY NHẤT *(từ bản 0.3.0)*
- [x] `F5.2` Sổ quyết định — chỉ thêm, tra được ngày nào chốt gì *(từ bản 0.3.0)*
- [x] `F5.3` ADR — ghi nhận quyết định kiến trúc, có bản mẫu *(từ bản 0.3.0)*
- [x] `F5.4` Phụ lục NGHỀ — luật riêng của nghề repo, tách khỏi luật chung *(từ bản 1.3.6)*

**F6 · Sổ sách trạng thái** — 3/5

- [x] `F6.1` Nhật ký bàn giao — phiên sau đọc phần cuối là biết phiên trước làm tới đâu *(từ bản 0.3.0)*
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

**F8 · Phép kiểm và cổng chạy xa** — 3/4

- [x] `F8.1` Suite hạt giống — repo nhà CHẠY THẬT đúng cái nó phát cho người khác *(từ bản 1.0.0)*
- [x] `F8.2` Phép ghim của gói vai điều phối *(từ bản 1.3.0)*
- [ ] `F8.3` Cổng kiểm chạy trên GitHub — lớp duy nhất không ở trên máy người dùng *(từ bản 1.2.0)* — thiếu: `.github/workflows`
- [x] `F8.4` Kiểu xuống dòng do REPO quyết, không do máy người clone *(từ bản 1.2.0)*

**F9 · Đối chiếu và tự nâng cấp — cái nối repo đích về bộ khung** — 2/2

- [x] `F9.1` Sổ ghim ở repo đích — repo này đang dùng bản nào *(từ bản 1.1.0)*
- [x] `F9.2` Danh mục tính năng — checklist migrate, đo được ở mọi repo *(từ bản 1.3.31)*
- [-] `F9.3` Đề bài đưa AI assistant của repo đích GO LIVE và nhận việc maintain *(từ bản 1.3.31)*

**Tổng: 30 xong · 0 một phần · 4 thiếu.**


> **Đo LẠI ngày 2026-09-07, SAU khi nhận bản khung 1.3.36** — phiên `claude-bang-gon`.
> Khối trên (đo trước lượt nâng) vẫn giữ nguyên từng dòng: hồ sơ migrate là vùng **chỉ thêm**,
> và hai lần đo cạnh nhau mới nói được lượt nâng làm được gì. **24 xong · 3 một phần · 7 thiếu**
> → **30 xong · 0 MỘT PHẦN · 4 thiếu**. Bảng đọc khối CUỐI, nên tab Migrate sẽ chiếu số mới.
