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
viec_audit: xong
viec_assistant: xong
viec_ke: hạn miễn trừ 5 test `R01 V2` hết 2026-12-02 — hoặc làm xong, hoặc gia hạn có lý do
khai_boi: claude-k4-bangsong 2026-09-07, Đức chốt cho khai lại · audit: thân bài — báo cáo `drafts/MIGRATE-REPORT-NAV.md`, 9 lỗi mỗi lỗi kèm lệnh tái hiện · assistant: thân bài — `npm test` xanh 127/132 + 5 nợ đã khai, cổng XANH TOÀN BỘ
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

---

## Checklist tính năng đã migrate — danh mục bản 1.3.31 · đo ngày 2026-09-07

> Khối này do `node scripts/features.mjs --migrate <repo>` sinh ra. **Đo, không tự khai.**
> `[x]` đủ · `[~]` một phần (xử trước) · `[ ]` thiếu · `[-]` chỉ cần ở repo phát hành.

**F1 · Bảng trạng thái** — 1/4

- [ ] `F1.1` Bảng chính HTML, sinh hoàn toàn từ HEAD *(từ bản 1.3.18)* — thiếu: `scripts/build-overview.mjs` `scripts/overview-doc.mjs` `scripts/md-mini.mjs` `npm run overview`
- [x] `F1.2` Ba artifact máy đọc: DASHBOARD.md · llms.txt · repo-map.json *(từ bản 1.0.0)*
- [ ] `F1.3` Bảng SỐNG — F5 là thấy, ba cửa dùng một lõi *(từ bản 1.3.26)* — thiếu: `bang-song/loi.mjs` `bang-song/may-chu.mjs` `bang-song/mot-luot.mjs` `bang-song/Bat-tu-chay.cmd` `bang-song/Tat-tu-chay.cmd` `npm run bang-song`
- [ ] `F1.4` Tab Migrate — bảng mốc ba bước, hồ sơ gập trong toggle *(từ bản 1.3.20)* — thiếu: `docs/migrations`

**F2 · Cấu trúc file và bảo trì** — 2/4

- [x] `F2.1` Repo tự khai hình dạng của mình *(từ bản 0.3.0)*
- [x] `F2.2` Cổng kiểm cấu trúc B1–B15 *(từ bản 0.3.0)*
- [ ] `F2.3` Cân nặng và ngân sách — repo phải RẺ, không chỉ ĐÚNG *(từ bản 1.1.0)* — thiếu: `scripts/can-nang.mjs` `npm run can-nang`
- [ ] `F2.4` Nhịp DỌN — dời sang lưu trữ, KHÔNG xoá *(từ bản 1.3.4)* — thiếu: `scripts/don.mjs` `npm run don`

**F3 · Đa phiên — chống hai AI giẫm chân nhau** — 4/5

- [x] `F3.1` Bảng chủ sở hữu và khoá vùng, nhận/trả bằng LỆNH *(từ bản 0.3.0)*
- [x] `F3.2` Cổng đóng phiên — 11 phép kiểm, có bộ đếm chống sửa *(từ bản 0.3.0)*
- [x] `F3.3` Cổng xuất bản — thay `git push` trần *(từ bản 0.3.0)*
- [ ] `F3.4` Tín hiệu 'repo chưa thấy dấu vết' — VÀNG, không bao giờ ĐỎ *(từ bản 1.3.20)* — thiếu: `tests/khoa-dau-vet.mjs`
- [x] `F3.5` Trả khoá an toàn khi còn commit chưa đẩy, kèm cửa thoát khai lý do *(từ bản 1.3.26)*

**F4 · AI assistant — vai điều phối** — 1/6

- [ ] `F4.1` Sổ tay vai điều phối — có hàng rào vai cứng *(từ bản 1.3.0)* — thiếu: `docs/protocols/ORCHESTRATOR.md`
- [ ] `F4.2` Cổng nhất quán trạng thái — chạy TRƯỚC KHI BÁO CÁO *(từ bản 1.3.0)* — thiếu: `scripts/state-check.mjs` `npm run state-check`
- [ ] `F4.3` Bản đồ việc — giao ba nguồn, và luật song song một câu *(từ bản 1.3.0)* — thiếu: `scripts/what-next.mjs` `npm run what-next`
- [ ] `F4.4` Giao thức đa phiên — bốn cơ chế, năm bất biến kèm lý do *(từ bản 0.3.0)* — thiếu: `docs/protocols/MULTIFLOW.md`
- [x] `F4.5` Cửa vào riêng cho từng AI — một bản luật, nhiều cửa *(từ bản 0.3.0)*
- [ ] `F4.6` Từ điển thuật ngữ và bản hướng dẫn cho phiên AI đầu tiên *(từ bản 1.3.11)* — thiếu: `docs/LEGEND.md` `docs/HUONG-DAN.md`

**F5 · Luật và quyết định** — 3/4

- [x] `F5.1` Hiến pháp một trang — sáu việc phải hỏi người chốt, bản DUY NHẤT *(từ bản 0.3.0)*
- [ ] `F5.2` Sổ quyết định — chỉ thêm, tra được ngày nào chốt gì *(từ bản 0.3.0)* — thiếu: `decisions.md`
- [x] `F5.3` ADR — ghi nhận quyết định kiến trúc, có bản mẫu *(từ bản 0.3.0)*
- [x] `F5.4` Phụ lục NGHỀ — luật riêng của nghề repo, tách khỏi luật chung *(từ bản 1.3.6)*

**F6 · Sổ sách trạng thái** — 2/5

- [x] `F6.1` Nhật ký bàn giao — phiên sau đọc phần cuối là biết phiên trước làm tới đâu *(từ bản 0.3.0)*
- [ ] `F6.2` Sổ nợ — thứ đang HỎNG, nhóm theo mức ưu tiên *(từ bản 0.3.0)* — thiếu: `BACKLOG.md`
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
- [ ] `F8.2` Phép ghim của gói vai điều phối *(từ bản 1.3.0)* — thiếu: `tests/assistant-smoke.mjs`
- [x] `F8.3` Cổng kiểm chạy trên GitHub — lớp duy nhất không ở trên máy người dùng *(từ bản 1.2.0)*
- [x] `F8.4` Kiểu xuống dòng do REPO quyết, không do máy người clone *(từ bản 1.2.0)*

**F9 · Đối chiếu và tự nâng cấp — cái nối repo đích về bộ khung** — 1/2

- [x] `F9.1` Sổ ghim ở repo đích — repo này đang dùng bản nào *(từ bản 1.1.0)*
- [ ] `F9.2` Danh mục tính năng — checklist migrate, đo được ở mọi repo *(từ bản 1.3.31)* — thiếu: `features.json` `scripts/features.mjs` `npm run features`
- [-] `F9.3` Đề bài đưa AI assistant của repo đích GO LIVE và nhận việc maintain *(từ bản 1.3.31)*

**Tổng: 17 xong · 0 một phần · 17 thiếu.**


> **Khối này THÊM VÀO ngày 2026-09-07**, sau lượt migrate — bởi phiên `claude-bang-gon`.
> Danh mục tính năng chưa tồn tại lúc lượt ấy chạy, nên hồ sơ gốc không có checklist. Chữ phần
> trên **không sửa một dòng nào**: hồ sơ migrate là vùng chỉ thêm.
