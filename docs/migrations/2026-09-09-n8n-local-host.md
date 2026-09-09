---
kind: migration
repo: n8n_Local host
duong_dan: C:\WORKING ZONE\n8n_Local host
ngay: 2026-09-09
ban_khung: 1.8.0
nghe: n8n chạy trên máy bằng Docker — Đức mô tả automation bằng tiếng Việt, ba AI dựng workflow, xem sơ đồ ở localhost:5678
muc_truoc: 1
muc_sau: 3
chi_phi_truoc: thả 28 · viết 30 · soi 0
chi_phi_sau: thả 0 · viết 0 · soi 0
cong_dong_phien: XANH TOÀN BỘ · dãy B 0 đỏ 0 vàng
trang_thai: xong
loi_tim_ra: 2
viec_audit: xong
viec_assistant: xong
viec_ke: mở một phiên AI thường trú tại repo đó, dán trọn `drafts/DE-BAI-ONBOARD.md` (bước 12, sinh 10/09)
khai_boi: harness-migrate-3repo 2026-09-09
---

## Lượt LẮP MỚI đầu tiên, không phải lượt nâng

Hai repo còn lại hôm nay đều đã ghim 1.3.76. Repo này **chưa từng ghim**: `assess` đo **0/62**
file khớp bản chuẩn, và **không có `package.json`** — tức trước lượt này không lệnh nào ở đây
chạy được một phép kiểm nào.

Nó vẫn ở mức 1/3 chứ không phải 0, vì bốn file luật viết tay đã có sẵn và **tốt**:
`design_brief.md` · `AGENTS.md` · `decisions.md` · `handoff.md`. Bộ khung thêm bộ máy, không
thêm luật nghề.

`init-repo.mjs` **không dùng được** ở đây — nó fail-closed khi thư mục không rỗng, và đúng như
thế. Đường đi: chép tay bản trích (bỏ file bị cấm đè) → khai hình dạng repo → ghim bằng
`upgrade --apply`.

## Suýt xoá mất một lớp bảo vệ — bằng một lệnh `cp`

Chép cả bản trích sang thì `.gitignore` của bộ khung **đè lên** `.gitignore` của repo đích. Bản
của họ có dòng `.env` — file đó chứa **API key n8n**. Đè là gỡ tấm chắn duy nhất giữa một API
key và một commit công khai.

Bắt được ngay bằng `git diff` sau bước chép, và hợp nhất lại: nội dung cũ trước, khối bộ khung
nối sau, đo lại **0 dòng bị xoá**.

**Luật bốn-file-cấm-đè chưa đủ.** Nó kể tên bốn file *tài liệu*. `.gitignore` không nằm trong đó,
mà đè nó thì mất một lớp an ninh chứ không mất chữ. Nguyên tắc đúng rộng hơn: **mọi file repo
đích ĐÃ CÓ đều là hợp nhất, không phải thay thế** — bốn file kia chỉ là bốn ca nặng nhất.

## `laneFromMessage` từ chối tên phiên có khoảng trắng — và nó đúng

Tên phiên tôi được giao có dấu cách. `session-check.mjs:1173` so nhãn `Lane:` trong commit với
`--as`, và `laneFromMessage` ném `LANE_CO_KHOANG_TRANG`: *"nhãn phiên là một từ"*. Nhãn có dấu
cách thì **không commit nào quy thuộc được**, và cổng đúng ra phải đỏ.

Tôi phát hiện **sau** commit đầu ở `nav_platform_main`, nên repo đó còn lại một commit không
nhãn — xem hồ sơ của nó. Từ đó đổi sang `harness-migrate-3repo` cho cả ba repo.

**Đã ghi luật này vào `AGENTS.md` của repo đích** (mục ba-việc-mở-phiên), vì phiên AI đầu tiên ở
đó sẽ đâm vào đúng chỗ này.

## Khai tử luật cũ mà GIỮ văn bản — ca thật đầu tiên của bước 6

Repo này có luật **"1 phiên"**: chỉ một phiên Claude được ghi file. Nó ra đời 25/08 sau khi hai
phiên Claude ghi đè `handoff.md` của nhau — tức **luật cũ dựa vào trí nhớ, và đã hỏng thật ngay
hôm nó sinh ra**.

Xử theo đúng bước 6: thêm dòng *"KHÔNG CÒN HIỆU LỰC từ 2026-09-09"* ngay dưới tiêu đề, **giữ
nguyên toàn bộ văn bản cũ**, trỏ sang mục khoá vùng mới, và ghi một dòng vào `decisions.md` của
repo đích. `AGENTS.md` 85 → 152 dòng: **chỉ thêm, không mất một chữ nào**.

## Đo tại chỗ

| | Trước | Sau |
|---|---|---|
| mức | 1/3 | **3/3** |
| file khớp bản chuẩn | 0/62 | **51/62** |
| `AGENTS.md` | 85 dòng | 152 dòng (thêm lớp bộ khung) |
| `HANDOFF.md` | 178 dòng | 181 dòng |
| nạp mỗi phiên | **chưa đo được** | **3.415 / 4.500 token** |
| dãy B | không chạy được | **0 đỏ · 0 vàng** |
| `npm test` | không có lệnh | **10 suite xanh** |

Cổng đóng phiên **XANH TOÀN BỘ**, đã đẩy. `state-check` → **STATE OK**.

## Nợ mang về

`NLH-1` ở repo đích: `node scripts/build-overview.mjs` **treo quá 300 giây, không output, không
lỗi** — cùng lệnh chạy xong trong vài giây ở hai repo kia. Thu hẹp được một nửa: nạp bằng
`import()` thì xong ngay, nên treo nằm ở nhánh chạy-trực-tiếp; nghi `execSync("node
scripts/check-bootstrap.mjs")` ở `build-overview.mjs:2289`, và đường dẫn repo này **có dấu cách**.

**Không làm đỏ cổng nào** vì `generators` của repo đó chỉ khai `build-dashboard.mjs` — đúng kiểu
hỏng im lặng mà bộ khung sinh ra để chặn. Gốc bệnh ở bộ khung; **chưa ghi được vào `BACKLOG.md`
của repo nhà vì lane `harness-loi-02` đang giữ khoá file đó.**

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
