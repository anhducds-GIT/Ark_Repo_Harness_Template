---
kind: migration
repo: n8n-orchestrator
duong_dan: C:\WORKING ZONE\n8n-orchestrator
ngay: 2026-09-08
ban_khung: 1.3.67
nghe: Control Plane điều phối n8n — YAML là sản phẩm · Python (tools/) · đã tự có ma trận quyền theo HÃNG trước khi bộ khung tới
muc_truoc: 3
muc_sau: 3
chi_phi_truoc: thả 0 · viết 0 · soi 0
chi_phi_sau: thả 0 · viết 0 · soi 0
cong_dong_phien: XANH TOÀN BỘ
trang_thai: xong
loi_tim_ra: 4
viec_audit: chưa
viec_assistant: xong
viec_ke: `CP-4` — phép ghim `handoff-smoke` đòi dòng `## Log` mà repo này giữ nhật ký ở `log/YYYY-MM.md`; đã bỏ khỏi chuỗi, chờ bộ khung cho khai dấu mở nhật ký
khai_boi: harness-phat-01 2026-09-08 · assistant: thân bài — mục "Luật hai vai" · lỗi: thân bài — mục "Bốn chỗ bản trích không mang được"
---

## Vì sao hồ sơ này ra đời MUỘN hơn lượt migrate

**Repo này đã lắp bộ khung từ 05/09 (bản 1.3.3) mà chưa từng có hồ sơ.** Nó lộ ra hôm nay khi
quét `.ark/harness.lock.json` khắp `C:\WORKING ZONE`: bốn repo có sổ ghim, **ba** có hồ sơ.

Hệ quả đo được: tab **Migrate** của bảng bộ khung đọc `docs/migrations/`, nên suốt từ 05/09 tới
nay bảng nói *"đã migrate 3 repo"* trong khi con số thật là **4**. Một lượt migrate không ghi hồ
sơ thì nó **không tồn tại** với mọi phiên đến sau — đúng luật "không khai = không tồn tại", chỉ là
áp cho một thư mục thay vì một file.

## Luật hai vai — thêm làm TẦNG THỨ HAI, không thay ma trận cũ

Repo này đã có **Ma trận quyền** chia theo **hãng** (`duc` · `claude-code` · `gpt` · `google-ai`
· `codex`), bản đầy đủ ở `state/roles.yaml`, và `tools/validate.py` **đọc file đó**. Nên không
được đụng: đổi nó là làm đỏ một cổng của chủ nhà.

Cách giải: hai bảng trả lời hai câu khác nhau, và nói to điều đó ngay trong văn bản.

| Bảng | Trả lời câu |
|---|---|
| Ma trận quyền (cũ, theo hãng) | *"agent nào được ghi FILE nào"* |
| Vai theo VIỆC (mới, bản 1.3.44) | *"phiên này đang làm LOẠI VIỆC nào"* |

Bất biến **người SỬA không tự NGHIỆM THU bản sửa của mình** thì ma trận cũ đã có một nửa — nó
cấm `claude-code` *"tự audit việc mình làm"*. Mục mới nới ra cho **mọi** vai, kể cả khác hãng.

## Tốc độ — đo tại repo này, không mượn số của repo nhà

| | Trước | Sau |
|---|---|---|
| chuỗi suite (7 suite) | 145s | **60,4s** |
| cổng đóng phiên | ~145s (chạy lại chuỗi) | **11s** (đọc dấu) |
| **cả vòng** | **~290s** | **~72s — nhanh 75%** |

## Bốn chỗ bản trích không mang được — ba đỏ ngay lúc tới, một KHÔNG đỏ

| # | Chỗ | Ai đúng |
|---|---|---|
| 1 | `bang-song` vế 8 đòi 3 dòng `.gitignore` cho bản ra bảng sống — `.gitignore` không thuộc tầng nào | bộ khung thiếu đường phát |
| 2 | `dau-suite-smoke` vế 6 đòi dòng `.gitignore` cho `.ark-suite-stamp.json` — cùng gốc bệnh | bộ khung thiếu đường phát |
| 3 | `handoff-smoke` đòi `HANDOFF.md` có dòng **đúng chữ** `## Log`; repo này giữ nhật ký ở `log/YYYY-MM.md` | **repo đích CỐ Ý khác** |
| 4 | `--apply` thêm `test:tuan-tu` mà **không tên lệnh nào trỏ vào `chay-test.mjs`** | bộ khung |

**Chỗ #4 không làm đỏ phép kiểm nào, và vì thế nó nguy hơn cả ba chỗ đỏ.** Cơ chế nhanh nhất tới
rồi mà **nằm không**: cổng gọi `npm test`, `npm test` là chuỗi riêng của repo đích, không ghi dấu,
nên cổng chạy lại trọn chuỗi. Đúng ca `[~] MỘT PHẦN` mà chính danh mục cảnh báo — nhưng danh mục
**không có mục nào** cho cơ chế này nên nó không đếm được (`KHUNG-48`). Con số 60,4s ở bảng trên
chỉ có được **sau** khi vá tay `npm run test:song-song`.

Chỗ thứ năm git tự lộ: `.gitattributes` của repo này chốt `* text=auto eol=lf` cho MỌI file, nên
4 file `.cmd` vừa tới bị lưu LF. Đã thêm ngoại lệ `*.cmd text eol=crlf`; kiểm lại trên đĩa ra
`^M$`. **Giới hạn của phép đo:** dựng ca hỏng bằng một file `.cmd` tối giản thì cả hai dạng đều
thoát 0 trên máy này — nên đây là **áp luật đã đo của nơi phát hành**, không phải phép đo tự có.

Cả bốn chỗ đã mang về `BACKLOG.md` của bộ khung — mục `KHUNG-47`, bảng ba ca cộng chỗ không đỏ.

## Ba chỗ cổng đóng phiên bắt được, và cả ba đều đúng

1. **8 file mới chưa khai vào Bản đồ file** (`bang-song/*` + `features.json`). Đã khai 3 dòng.
2. **`log/2026-08.md` là vùng CHỈ-THÊM, mà tháng này là 09.** Tôi thêm dòng vào file tháng CŨ —
   đó là sửa bằng chứng. Đã trả file về nguyên trạng, dòng mới sang `log/2026-09.md`.
3. **`handoff.tran_byte_moi_muc` chưa khai** nên phép kiểm trần mục nhật ký báo **BỎ QUA** — tức
   *"chưa kiểm được gì"*, không phải *"đạt"*. Đã khai 2600.

## Bốn khoá vùng

`_state` (state/ + views/ — **chung một khoá cố ý**) · `_code` (tools/ + schema/ + scripts/ +
tests/) · `_docs` · `_root` (log/ + inbox/ + drafts/ + assets/ + gốc repo).
## Checklist tính năng đã migrate — danh mục bản 1.3.66 · đo ngày 2026-09-08

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

**F4 · AI assistant — hai vai, và bộ đồ nghề của vai điều phối** — 7/7

- [x] `F4.1` Sổ tay vai điều phối — có hàng rào vai cứng *(từ bản 1.3.0)*
- [x] `F4.2` Cổng nhất quán trạng thái — chạy TRƯỚC KHI BÁO CÁO *(từ bản 1.3.0)*
- [x] `F4.3` Bản đồ việc — giao ba nguồn, và luật song song một câu *(từ bản 1.3.0)*
- [x] `F4.4` Giao thức đa phiên — bốn cơ chế, năm bất biến kèm lý do *(từ bản 0.3.0)*
- [x] `F4.5` Cửa vào cho AI không tự nạp luật — một bản luật, nhiều cửa *(từ bản 0.3.0)*
- [x] `F4.6` Từ điển thuật ngữ và bản hướng dẫn cho phiên AI đầu tiên *(từ bản 1.3.11)*
- [x] `F4.7` Hai vai chia theo VIỆC — ① giữ lõi · ② phát & thu, và người sửa không tự nghiệm thu *(từ bản 1.3.44)*

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

**Tổng: 31 xong · 0 một phần · 4 thiếu.**


## Checklist tính năng đã migrate — danh mục bản 1.3.71 · đo ngày 2026-09-08

> Khối này do `node scripts/features.mjs --migrate <repo>` sinh ra. **Đo, không tự khai.**
> `[x]` đủ · `[~]` một phần (xử trước) · `[ ]` thiếu · `[-]` chỉ cần ở repo phát hành.

**F1 · Bảng trạng thái** — 2/4

- [~] `F1.1` Bảng chính HTML, sinh hoàn toàn từ HEAD — kèm lưu đồ vẽ thành SVG *(từ bản 1.3.18)* — thiếu: `scripts/luu-do.mjs`
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

**F5 · Luật và quyết định** — 4/4

- [x] `F5.1` Hiến pháp một trang — sáu việc phải hỏi người chốt, bản DUY NHẤT *(từ bản 0.3.0)*
- [x] `F5.2` Sổ quyết định — chỉ thêm, tra được ngày nào chốt gì *(từ bản 0.3.0)*
- [x] `F5.3` ADR — ghi nhận quyết định kiến trúc, có bản mẫu *(từ bản 0.3.0)*
- [x] `F5.4` Phụ lục NGHỀ — luật riêng của nghề repo, tách khỏi luật chung *(từ bản 1.3.6)*

**F6 · Sổ sách trạng thái** — 2/5

- [~] `F6.1` Nhật ký bàn giao — kèm TRẦN mỗi mục và nhịp xoay theo tháng, có máy canh *(từ bản 0.3.0)* — thiếu: `npm run handoff`
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

**Tổng: 30 xong · 2 một phần · 4 thiếu.**

