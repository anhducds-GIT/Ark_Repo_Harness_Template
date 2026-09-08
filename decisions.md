# QUYẾT ĐỊNH — Đức chốt gì, ngày nào, vì sao

> **Vì sao có file này:** `AGENTS.md` mục 7 bước 2 bắt mọi phiên ghi quyết định mới của Đức vào
> đây. Tới 2026-09-05 file **chưa từng tồn tại** — nên quyết định hoặc chìm trong `HANDOFF.md`
> (nơi không ai đi tra quyết định), hoặc bốc hơi. Xem `BACKLOG.md` mục KHUNG-7.
>
> **Chỉ THÊM, không sửa mục cũ.** Đổi ý thì ghi mục mới trỏ ngược lại mục cũ — một quyết định bị
> sửa tại chỗ là một quyết định không ai truy được đã từng nói gì.
>
> **Quyết định kiến trúc có lập luận dài thì viết ADR** (`docs/adr/`), file này giữ một dòng trỏ
> sang. Đây là sổ tra nhanh *"Đức đã chốt gì"*, không phải nơi chứa lập luận.

---

## 2026-09-05 · Migrate là BA việc trong một, không phải chuẩn hoá cấu trúc

**Đức chốt.** Đưa một repo lên chuẩn gồm ba việc, làm cùng lượt:

1. **Migrate** — thả bộ khung vào, khai hình dạng repo, dựng cổng.
2. **Audit** — quét và rà soát repo đích, không chỉ kiểm cấu trúc có đúng khuôn không.
3. **Bring AI assistant onboard** — repo đích phải có một phiên AI dùng được ngay sau lượt
   migrate, chứ không phải nhận một đống file rồi tự xoay.

**Vì sao:** Đức làm việc với từng repo **qua AI assistant của repo đó** để dọn dần nợ kỹ thuật và
ý tưởng đang mở. Một repo nhận đủ cấu trúc nhưng không có assistant biết dùng cấu trúc ấy thì
migrate xong vẫn không làm được việc — cấu trúc đúng mà không ai vận hành được.

**Trách nhiệm:** thuộc **AI Assistant của repo bộ khung này**, không đẩy sang repo đích. Bộ khung
là nơi phát hành, nên nó chịu trách nhiệm cho việc thứ ba chạy được ở đầu bên kia.

**Hệ quả trực tiếp, ghi ra để không ai phải suy:**
- Quy trình migrate cần một **checklist tính năng sẽ mang sang** — hiện chưa có; sáu bước của
  `docs/protocols/CHUYEN-REPO-LEN-CHUAN.md` nói *làm gì*, không nói *mang gì*.
- Câu hỏi KHUNG-2 (*hai quy trình migrate có đi theo bản trích không?*) **đã có hướng**: việc
  migrate là việc của người **cầm** bộ khung, nên hai quy trình đó ở lại nhà — nhưng repo đích
  phải nhận đủ thứ để assistant của nó vận hành được.
- Lượt migrate thứ ba trở đi không được coi là "xong" khi cổng xanh. Xong là khi **assistant ở
  repo đích chạy được vòng làm việc của nó**.

## 2026-09-05 · Push lượt 1.3.1 dù cổng đóng phiên còn đỏ

**Đức chốt.** Đẩy 7 commit của lượt `claude-dieu-phoi-0509` lên `origin/main`, mặc dù cổng đóng
phiên còn hai mục đỏ.

**Bằng chứng đã đo trước khi chốt, không phải tin lời:**
- `npm test` → **exit 0, 145 phép xanh, 0 đỏ**.
- `tests/cong-do-that.mjs` và `tests/core-contract.mjs` chạy riêng → **exit 0**.
- Cổng vẫn báo *"Test xanh"* ĐỎ, với dòng giải thích liệt kê **toàn dòng `ok`**.

Tức mục đỏ đó là **dương tính giả của chính cổng** — ghi thành KHUNG-15 trong `BACKLOG.md` trước
khi đẩy. Mục đỏ thứ hai (*"Sự thật máy sinh còn tươi"*) là đường chưa hội tụ của cột
`changedCount`, cũng đã ghi.

**Vì sao đẩy chứ không chờ vá:** `AGENTS.md` mục 2 nói lý do bộ khung cho phép AI tự push —
commit chưa push là **vô hình** với vòng kiểm tra chéo, vì Đức không đọc code trên máy và GPT
audit qua GitHub. Giữ bản 1.3.1 trong máy để chờ vá một lỗi *của cổng* là đánh đổi sai chiều:
nó làm bản vá thật (mục đỏ vĩnh viễn) chậm tới tay hai repo đang ghim bản khung.

**Giới hạn của quyết định này — đọc kỹ trước khi lấy làm tiền lệ.** Nó áp cho **đúng lượt này**,
với **đúng bằng chứng trên**. Nó KHÔNG mở ra luật *"tin rằng cổng báo sai thì được push"*: nếu
mỗi phiên tự phán cổng sai rồi tự đẩy thì cổng thôi là cổng. Điều kiện tối thiểu để viện dẫn
lại: **đo được suite exit 0 bằng lệnh trực tiếp**, **ghi mục nợ trước khi đẩy**, và **người chốt
chốt từng lượt**.

---

## 2026-09-06 · Đức chốt bốn việc trong một lượt

Bốn mục nợ đã treo vì cần người chốt. Đức trả lời trong một lượt sau khi đọc giải thích từng
mục. Ghi nguyên văn lựa chọn, kèm chỗ tôi đã báo trước là số đo trong sổ nợ đã cũ.

### 1 · Hai cơ chế hiệp đồng: **BỘ KHUNG THẮNG, bỏ luật cũ**

Áp cho cả `n8n-orchestrator` (CP-1) và `ALL_SKILL_MANAGEMENT` (KHUNG-23). Repo nào đã có cơ
chế phân việc nhiều AI của riêng nó — `lock` trong task, `authority_matrix.md`,
`discussion_protocol.md` — thì sau khi lắp bộ khung, **khoá vùng + cổng đóng phiên là chuẩn**,
cơ chế cũ thôi có hiệu lực.

**Đức đã đọc rủi ro trước khi chọn**: lối này phá cơ chế `ALL_SKILL_MANAGEMENT` đang dùng thật,
mà điều phối AI chính là NGHỀ của repo đó. Chọn vẫn là chọn — ghi lại để phiên sau không tưởng
là quyết vội.

**GIỚI HẠN — quyết định này chốt CƠ CHẾ NÀO LÀ CHUẨN, KHÔNG phải cho phép xoá file.**
`AGENTS.md` mục 2 hàng 1 (xoá file / sửa dữ liệu gốc) vẫn nguyên hiệu lực, và BƯỚC 0 của quy
trình migrate vẫn cấm ghi đè bốn file đang giữ 1824 dòng nội dung riêng ở
`ALL_SKILL_MANAGEMENT`. Đường đi đúng: **luật cũ bị KHAI TỬ, văn bản cũ được GIỮ** — đánh dấu
"không còn hiệu lực từ 2026-09-06, xem AGENTS.md" ở đầu file, chứ không xoá file. Mỗi lượt
thi hành ở từng repo vẫn phải hỏi Đức riêng.

### 2 · KHUNG-16: **bỏ mã commit khỏi trang, giữ ngày**

Đã thi hành cùng ngày. Kèm theo, tôi đo ra **đường thứ hai mà sổ nợ không mô tả**: hai dòng
dấu commit vốn đã được miễn khỏi phép so từ trước, nên chúng chỉ làm cây làm việc bẩn chứ
không làm cổng đỏ. Thứ **thật sự** làm cổng đỏ là bộ đếm `CÓ (N commit)`, và nó nhảy vì
`.agents/claims.json` mang đuôi `.json` nên bị đếm là file hành vi — mà nhận/trả quyền là việc
MỌI phiên đều làm. Đo: commit `fa7e8a7` chạm đúng một file là `claims.json`, bộ đếm 4 → 5.
Đã vá cả hai. Phép so nay canh lại **toàn bộ** dòng, không còn miễn dòng nào.

### 3 · KHUNG-11: **cắt gọn + dời sang lưu trữ, không xoá**

**Số đo trong sổ nợ đã cũ — tôi báo trước khi làm.** Sổ nợ nói vượt 998 dòng; đo lại 06/09 là
**vượt 1.481**, và có thêm **hai chỗ vượt mới** sổ nợ chưa nhắc: nhật ký `HANDOFF.md`
1.273/600, thời gian chạy phép kiểm 271/180 giây.

Đã làm, mỗi bước có md5 chứng minh không mất byte nào:

| Việc | Trước | Sau |
|---|---|---|
| `HANDOFF.md` → lưu trữ | 1.273 | **HOÀN NGUYÊN** — xem dưới |
| `CHANGELOG.md` → `docs/archive/CHANGELOG-0.1.0-1.2.20.md` | 806 | **241** |
| `docs/ROADMAP-V1.md` → `docs/archive/` | — | −117 |
| **Tổng tài liệu** | 3.681 | **2.999** / 2.200 |

**NHƯNG VIỆC DỌN NHẬT KÝ ĐÃ PHẢI HOÀN NGUYÊN — hai luật của repo cắn nhau.**
`can-nang.mjs` + sổ tay bảo trì bảo: nhật ký quá 600 dòng thì **phải dời** phần cũ sang lưu trữ.
Cổng đóng phiên đòi `HANDOFF.md` **xoá đúng 0 dòng**. Làm đúng luật thứ nhất thì **vĩnh viễn
không đóng được phiên**. Đã thử thật: cắt 1.273 → 455, cổng ĐỬe; ghi thêm một commit chỉ-thêm
cũng không cứu được vì phép đo cộng dồn cả dải chưa đẩy.

Tôi **không tự sửa cổng** — `AGENTS.md` mục 2 hàng 6: đổi luật an toàn phải hỏi Đức. Hoàn
nguyên `HANDOFF.md` (md5 khớp bản `fa7e8a7`), giữ phần cắt sổ phát hành. Ghi thành **KHUNG-25**.

**Và một lỗi trong chính công cụ đo, phải vá trước thì lời khuyên của nó mới có tác dụng:**
`can-nang.mjs` bảo người dùng dời nhật ký cũ sang `docs/archive/`, trong khi nó quét ĐỆ QUY cả
`docs/`. Làm đúng lời khuyên thì dòng bị dời từ chỗ KHÔNG bị đếm sang chỗ ĐANG bị đếm — tổng
tài liệu TĂNG, người làm đúng bị phạt. Nay `docs/archive/` được miễn: ngân sách này đo **thứ
mọi phiên phải nạp**, mà lưu trữ theo định nghĩa là thứ không nạp mỗi lần.

**CÒN VƯỢT 799 DÒNG, và tôi KHÔNG cắt tiếp — đây là chỗ cần Đức biết.** Lối duy nhất còn lại
là gọt `docs/protocols/ORCHESTRATOR.md` (426 dòng, file to nhất). Nhưng gọt nó là **xoá nội
dung thật**, trái đúng luật *dời chỗ chứ không xoá* mà chính Đức vừa chọn: mỗi mục trong đó
gắn với một sự cố có thật, và khối chú thích cuối file **bị một phép kiểm ghim** (
`tests/template-null-repo.mjs` cần nó chứa chuỗi cấm để nhánh miễn trừ chạy tới được).
Kể cả gọt hết 276 dòng cũng chỉ còn 2.723 — **vẫn vượt**. Tức con số 2.200 không đạt được bằng
cách dọn; nó là con số đặt theo mong muốn, chưa từng đặt theo số đo. Ghi lại thành mục nợ.

### 4 · KHUNG-18: **làm cả hai — nới regex VÀ nêu tên mục bị bỏ qua**

Đã thi hành. Tiền tố nay được lẫn số nhưng **phải bắt đầu bằng chữ cái** (`N8N-1` nhận;
`### 2026-09 · …` không nhận, để một mốc ngày không bị đọc thành mã việc). Và mọi dòng `###`
không đọc ra mã việc đều **bị nêu tên kèm tên sổ**, thay vì biến mất im lặng — đó mới là gốc
bệnh: nới regex chỉ chữa ca đã vấp, hình dạng lạ lần sau vẫn sẽ mất tăm.

---

## 2026-09-06 (chiều) · Đức chốt KHUNG-25, và đổi hướng KHUNG-11

### KHUNG-25 · Duyệt bản vá cổng — ĐỔI MỘT LUẬT AN TOÀN

Đây là lần đầu một luật an toàn của repo được đổi, nên ghi kỹ.

**Vấn đề:** sổ tay bảo trì bắt dời nhật ký cũ đi khi quá ngân sách; cổng đóng phiên đòi
`HANDOFF.md` xoá đúng 0 dòng. Làm đúng luật thứ nhất thì **vĩnh viễn không đóng được phiên**.
Đã thử thật ở bản 1.3.7 và phải hoàn nguyên.

**Đức chốt:** vá cổng theo hướng đã đề xuất.

**Bản vá SIẾT, không nới — đây là chỗ dễ hiểu nhầm nhất.** Cổng cũ *giả định* việc dời chỗ
không xảy ra được nên cấm mọi thao tác xoá. Cổng mới *kiểm chứng*: cho xoá **khi và chỉ khi**
từng dòng bị xoá có bản khớp BYTE trong `*/archive/*`. Xoá mà không có bản lưu trữ khớp thì
vẫn ĐỎ; sửa một dòng cũ tại chỗ cũng vẫn ĐỎ. Tức khả năng viết lại lịch sử **không** mở ra
thêm chút nào — chỉ khả năng **cất gọn** lịch sử là mở ra.

**Luật vàng 3 (không làm yếu lớp bảo vệ để test xanh) được giữ**, và giữ bằng bằng chứng chứ
không bằng lời: năm vế ở `tests/cong-do-that.mjs` khối 9, trong đó vế *"kho lưu trữ lệch một
ký tự vẫn phải ĐỎ"* là vế phân biệt bản vá thật với đồ trang trí.

### KHUNG-11 · Đức đổi hướng: cần CƠ CHẾ dọn, không phải một lượt dọn

Nguyên văn: *"KHUNG-11 có thể cần thêm cơ chế clean, vì nội dung sẽ luôn bị phình sau 1 quá trình."*

Đúng, và nó bác đúng cách tôi đang làm: bản 1.3.7 dọn bằng tay từng file. Dọn tay là dọn một
lần. Đã dựng `scripts/don.mjs` (`npm run don`) và cho **đi theo bản trích**, nên mọi repo
migrate cũng có nhịp dọn chứ không chỉ repo nhà.

**Câu hỏi cũ của KHUNG-11 — "bớt cái gì trong phần vượt ngân sách" — nay không còn chặn ai**,
vì phần phình nhanh nhất đã có lệnh xử. Phần còn lại (`ORCHESTRATOR.md` 426 dòng) vẫn treo,
nhưng nó không chặn phiên nào.

---

## 2026-09-06 (tối) · KHUNG-23 đã THI HÀNH — và một chỗ tôi cố ý không áp quyết định quá tay

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

## 2026-09-06 · Codex CLI là AI THỰC THI, và đề bài phải do MÁY ghép

**Đức chốt.** Nguyên văn: *"tôi cần protocol này hoạt động được, vì Claude code ko thể làm hết
1 mình tất cả, sẽ hết usage"* — và tiếp: *"tối ưu việc sử dụng CodeCLI như một AI agent thực thi
chứ không phải là Claude code nữa"*.

**Hệ quả về vai, áp cho MỌI phiên từ nay:**

| Vai | Ai làm |
|---|---|
| Thực thi việc lặp lại (nâng · migrate · audit) | **Codex CLI** là mặc định |
| Thiết kế, phản biện, audit độc lập, điều phối | Claude |
| Chốt | Đức |

Đây **không** lật bảng vai ở `AGENTS.md` mục 5 — nó nói rõ *việc nào* của Codex là mặc định.

### Đề bài KHÔNG viết tay — luật, không phải lời khuyên

Lượt giao đầu tiên hỏng vì đề bài viết **trước** khi ai đo repo đích, nên nó dạy `git add -A`
vào một repo đang có ba file sửa dở của phiên khác. Từ nay đề bài ghép bằng
`npm run giao-viec`, và lệnh đó **đo repo đích trước, đo không được thì không in gì**.

Vì sao thành lệnh chứ không thành một dòng dặn dò trong tài liệu: repo này đã đếm được **sáu**
lần cùng một hình dạng lỗi — *một luật trỏ tới thứ không tồn tại hoặc không hoạt động như luật
giả định*. Luật nào không kiểm được bằng máy thì sớm muộn cũng bị bỏ qua.

### Luật của chủ nhà thắng đề bài

Repo đích có luật riêng chọi với đề bài thì phiên nhận việc **DỪNG và báo**, không tự chọn.
Đo thật 06/09: Codex gặp luật *"Cloud Sync Hold"* của `Project 3 AI Agent Unify` và dừng đúng.
Đó là kết quả TỐT, không phải một lượt thất bại.

Lưu ý cách đọc: quyết định 06/09 *"bộ khung là chuẩn, cơ chế cũ thôi hiệu lực"* nói về **cơ chế
hiệp đồng SAU KHI đã migrate**. Nó không cho phép một phiên nhận việc tự ý bước qua luật của
repo đích ngay trong lượt đang làm.

## 2026-09-06 · Sổ migrate: chỉ nuôi TAB, thôi nuôi trang riêng

Đức: *"chúng ta sẽ maintain tab Migrate ở trong dashboard chung của template, không cần phải
maintain Migrate.html độc lập riêng… tôi chỉ muốn hiểu kết quả đang ở đâu, roadmap thế nào"*.

`SO-MIGRATE-<repo>.html` rời `generators`/`generated`, bản cuối dời sang `docs/archive/` (dời
chỗ, **không xoá**). Lệnh `build-so-migrate.mjs` vẫn chạy nhưng **bắt đưa đường dẫn** — mặc định
cũ sẽ đẻ ra một file không ai khai ở gốc repo.

Tab Migrate đổi bố cục: **bảng ba mốc lớn** (migrate · audit · AI onboard, lấy từ quy trình chứ
không tự đặt) → **"dừng ở đâu"** → chữ **gập trong `<details>`**. Ô không có nguồn nói *"chưa
khai"*, không làm tròn thành *"chưa xong"*.

## 2026-09-06 · Đổi luật chung của `AGENTS.md` — và bớt để bù

Thêm luật vào mục 1 làm `template/AGENTS.md` vượt trần 200 dòng (phép kiểm B9), đúng thứ mục 8
cấm. Đã BỚT: định nghĩa năm "luật an toàn" dời sang [docs/LEGEND.md](docs/LEGEND.md), phần còn
lại gói lại chặt hơn. Không nới trần — nới trần là làm yếu lớp bảo vệ để cho phép kiểm xanh.

## 2026-09-06 · Tiến trình nền: AI ĐO, người GIẾT

Đức thấy một tiến trình nền 14 tiếng và hỏi protocol. Đo ra năm thế hệ MCP server mồ côi
(32.9h · 15.9h · 2.2h · 1.9h · 0.9h), cộng một cầu nối của repo khác sống 32.9h.

Luật: **AI không tự giết tiến trình nào.** Nó đo, in bảng tuổi, chỉ ra cái nào chắc chắn thuộc
phiên đã chết. Người bấm. Lý do: tuổi KHÔNG phân biệt được "phiên đã chết" với "phiên đang chạy
lâu" — đúng hình dạng sai lầm của tín hiệu khoá vùng, chỉ đổi đối tượng.
Chi tiết: [docs/BAO-TRI-DINH-KY.md](docs/BAO-TRI-DINH-KY.md) · `KHUNG-37`.

## 2026-09-06 — Hai luật của repo tiêu thụ về bộ khung, và một chỗ CỐ Ý KHÔNG chép

Đức chuyển sang hai luật `Chrome_Extension_AI_Agentic` rút ra 06/09, kèm câu chốt vai:
*"Cả hai thuộc về bộ khung… đọc, phản biện, rồi hoà giải vào bộ khung theo hình dạng của bộ
khung — đừng chép nguyên văn."*

**Nhận cả hai.** Luật 1 (tên tín hiệu khoá là phần của hợp đồng) phần chữ đã có từ 1.3.20; việc
thật là bịt chỗ `session-check.mjs` gõ lại câu bằng tay. Luật 2 (vai điều phối không dừng vì
chuyện commit) là mới → `docs/protocols/ORCHESTRATOR.md` mục 5b.

**Chỗ không chép, và đây là phần cần Đức biết:** bản gốc còn cho `--carry` khỏi phải hỏi, dựa
trên một quyết định thường trực của người chốt **bên repo đó**. Bộ khung giữ nguyên `AGENTS.md`
mục 2 hàng 2 — đẩy kèm commit của phiên khác thì **vẫn phải hỏi Đức**. Lý do: một quyết định
thường trực là của một người ở một repo, nó không đi theo bộ khung; chép sang là bộ khung tự cấp
cho mình cái phép mà Đức chưa hề cho.

Chi tiết: [CHANGELOG.md](CHANGELOG.md) bản 1.3.23.

## 2026-09-06 — Bảng phải tự tươi, Đức F5 là thấy — xếp hàng đợi, chưa làm

Đức nêu: *"tôi có thể F5 trên dashboard html là latest status sẽ được hiển thị lên các luồng làm
việc cùng lúc. Hãy xếp việc này vào hàng đợi."*

Xếp vào [IDEAS.md](IDEAS.md) mục `Y-10`, bậc **ý tưởng**. Chưa viết dòng mã nào vì một chỗ chặn
chưa đo: bảng của bộ khung mang dữ liệu khoá **sống**, nên tiến trình nền ghi đè nó mỗi lượt
nhận/trả khoá có thể làm bẩn cây làm việc và **chặn push của mọi lane**. Việc kế là đo đúng chỗ
đó, không phải viết mã.

## 2026-09-07 — Bốn quyết định cho chuỗi chạy đêm

Đức trả lời bốn câu trong một lượt, để phiên chạy được một mình qua đêm.

**1 · Bảng sống — DUYỆT CẢ BA CỬA, kể cả tiến trình tự chạy lúc bật máy.** Luật mục 2 hàng 5
bắt hỏi trước khi tạo automation tự chạy, nên ghi ra đây để phiên sau biết **đây là quyết định
của Đức, không phải AI tự làm**. Cài và gỡ đều bằng nhấp đúp, dùng thư mục Startup của người
dùng, **không cần quyền quản trị, không dịch vụ hệ thống**. Tắt bằng `Tat-tu-chay.cmd` — nó đặt
một file cờ chứ **không giết theo tên tiến trình**, vì giết theo tên sẽ giết luôn tiến trình
`node` của một phiên AI đang làm việc.

**2 · KHUNG-36 — cho khai lại hai mốc vào CHÍNH ba hồ sơ migrate cũ.** Chỉ thêm dòng khai ở
phần đầu hồ sơ, **không sửa một chữ nào của thân bài**. Ranh giới: khai lại điều thân bài đã
nói ≠ viết lại lịch sử.

**3 · KHUNG-30 — HOÃN.** Repo `Project 3 AI Agent Unify` còn ba file sửa dở của phiên khác;
nâng bây giờ là giẫm chân. Không phải vấn đề kỹ thuật, và luật 8A của chính repo đó vẫn đúng.

**4 · Chuỗi đêm — bỏ mọi mục cần nói chuyện với Đức giữa chừng.** Nguyên văn: *"bỏ mục nào mà
sẽ block flow tự chạy & cần giao tiếp với Đức"*. Nên `KHUNG-30` (đã hoãn) và `KHUNG-37` (Đức
phải bấm nút giết tiến trình) ra khỏi chuỗi.

## 2026-09-07 — Bảng sống ĐÃ CÀI trên máy Đức, và cách gỡ

Đức duyệt cả ba cửa 07/09; lượt này **cài thật** và nghiệm thu thật trên máy Đức.

**Đang chạy:** máy chủ ở `http://127.0.0.1:4747/`, và một mục khởi động
`ArkBangSong.vbs` trong thư mục Startup của người dùng (không cần quyền quản trị, không phải
dịch vụ hệ thống). Bật máy lên là nó tự chạy ngầm.

**Gỡ:** nhấp đúp `bang-song\Tat-tu-chay.cmd`. Đã thử thật — nó xoá mục khởi động và đặt một
**file cờ** để bản đang chạy tự thoát trong 30 giây. Cố ý **không giết theo tên tiến trình**:
giết theo tên sẽ giết luôn `node` của một phiên AI đang làm việc.

**Một va chạm đo được, đã vá:** repo `Chrome_Extension_AI_Agentic` cũng phát máy chủ bảng ở
**cùng cổng 4747**, cũng có mục tự chạy. Bản đầu gặp cổng bận thì **thoát im lặng** — tức Đức mở
trình duyệt sẽ thấy bảng của REPO KIA và tin là bảng repo này. Nay nó né sang cổng kế và **nói to**
cổng nào đang dùng.

## 2026-09-07 — Danh mục tính năng thành CHECKLIST ĐO ĐƯỢC, và AI repo đích phải go live

Đức nêu: *"tôi muốn tổng hợp feature list hiện có thành checklist… khi block thành các tính năng
lớn như vậy thì tune và protocol migrate của chúng ta cũng sẽ clear hơn rất nhiều"*, và chốt điểm
quan trọng nhất: *"AI assistant cần được go live & well onboard ở repo đích để nó sẽ là người tiếp
tục đảm nhiệm."*

**Chốt hình dạng: danh mục phải ĐO ĐƯỢC, không phải một danh sách chữ.** Mỗi mục khai file và lệnh
phải tồn tại, nên nó chạy được ở bất kỳ repo nào và trả lời được *"tính năng này ở đây có sống
không"*. Lý do: một danh mục tự khai nói repo có gì lúc ai đó viết nó rồi im lặng mãi — và không ai
phát hiện, vì nó luôn "đúng".

**Ba trạng thái, không hai.** `MỘT PHẦN` đếm riêng vì nó nguy hiểm hơn `THIẾU`: mục đó trông như
đang chạy nhưng hỏng ở chỗ không ai nhìn.

**Đề bài `onboard` thành việc thứ tư của lệnh giao việc.** Đo được: 3 lượt migrate xong, 0 lượt có
phiên AI ở repo đích chạy trọn một vòng. Bước cuối của migrate không phải "cổng xanh" — mà là **một
phiên AI ở repo đó tự chạy được trọn một vòng, và biết ngày mai làm gì.**

**Đức chốt thêm cùng ngày:** *"mỗi repo cần 1 bảng chính, có hay không có bảng phụ tùy tình huống,
tôi ko ép."* — bảng chính là file đã commit (suy từ HEAD); bảng sống là tuỳ chọn, chỉ chạy khi ai đó
nhấp đúp. Danh mục khai `F1.3` là `tuy_chon: true` cho đúng câu này.

Chi tiết: [CHANGELOG.md](CHANGELOG.md) bản 1.3.34 · danh mục ở [features.json](features.json).

---

## 2026-09-07 — Bảng phải GỌN: năm phản hồi bố cục, và "F5 có thấy không" phải giải thích được

Đức mở bảng rồi nêu năm chỗ, **nguyên văn**:

1. *"content của tab cấu trúc quá lộn xộn & dàn trải, bị scroll nhiều -> cần gom lại, tối ưu nội
   dung & cách thể hiện, giải thích."*
2. *"tab vận hành cũng quá dài cần improve tương tự như trên."*
3. *"artifact theme & layout bị thừa quá nhiều khoảng trống, margin blank, trong khi content lại
   nhiều -> bị scroll nhiều, cần review lại toàn bộ & adjust phù hợp. (ví dụ như trang ý tưởng.
   Scroll mỏi tay)"*
4. *"trong ô AI điều phối, cần thêm 1 ô nhỏ để copy link của file dùng để refresh, chạy host
   local.... etc nếu hiện tại F5 là check status mới nhất được rồi thì phải giải thích"*
5. *"phần title… ở trên chiếm quá nhiều không gian, lãng phí, chiếm nửa màn hình vô nghĩa ->
   compact lại cho tôi."*

**Luật rút ra, áp cho mọi lần sửa bố cục sau này: ĐO CHIỀU CAO TỪNG TAB TRƯỚC KHI SỬA CSS.** Lượt
này đo bằng chính trình duyệt, và số đo chỉ ra chỗ **khác hẳn** chỗ đang nghi: tab Vận hành cao
16 màn hình vì **ba tài liệu đổ thẳng ra không gập** (11.223px trong 14.442px), tab Cấu trúc cao
10 màn hình vì **bản đồ file in HAI LẦN trên cùng một tab**. Không phải vì CSS thưa. Sửa CSS mà
không đo thì đã gọt chỗ không đau và để nguyên chỗ đau.

**"F5 có thấy số mới không" có HAI câu trả lời, và chúng phải nằm cạnh nhau.** Bảng đã commit suy
từ HEAD nên F5 không đổi số; bảng sống đọc bảng quyền từ đĩa nên F5 là thấy. Nói gộp là dạy sai
một trong hai — nên khối "Làm mới bảng" in **cả hai ô**, và repo không có bảng sống thì nói thẳng
là chưa có chứ không vẽ một cửa không tồn tại.

**Chốt kèm:** checklist tính năng lên **tab Migrate**, mang theo **ngày đo** và **bản danh mục** —
*"ở repo đích, đặc biệt là mục dashboard mới… cần ghi rõ checklist các feature list sẽ được migrate
cũng như là ngày phiên bản."*

Chi tiết: [CHANGELOG.md](CHANGELOG.md) bản 1.3.35 · quy trình kiểm: [docs/SO-TAY-AGENT.md](docs/SO-TAY-AGENT.md) mục 8.

---

## 2026-09-07 — Một đột biến chết vì lý do khác thì nó chứng minh KHÔNG GÌ CẢ

Không phải Đức chốt — đây là **luật rút ra từ một lần đo sai của chính tôi**, ghi vào đây vì nó
đổi cách làm cho mọi lượt sau.

`AGENTS.md` mục 3 luật 2 bắt mỗi fix có một test ghim, và `MULTIFLOW.md` mục 5 bắt cơ chế đa phiên
phải qua **đột biến kiểm**. Ngày 07/09 tôi chạy bốn đột biến cho một vế mới, **cả bốn đều "chết"**,
và tôi gần như ghi luôn là đạt.

Nhưng chúng chết vì **cổng dấu vân tay bản phát nổ trước** — vế mới chưa hề chạy. Trên màn hình,
một đột biến chết vì lý do khác **đọc y hệt** một đột biến bị vế đó bắt: cùng exit khác 0, cùng
một dòng `AssertionError`.

Phải chạy **riêng** bốn phép của vế đó mới thấy. Và lúc đó lộ ra một phép trong bốn đang **hỏng**:
nó ghép một biểu thức chính quy từ chuỗi, dấu chéo bị ăn một lớp, nên nó **ném SyntaxError chứ
không assert** — và không lộ ra ở lần chạy xanh, vì nhánh đó chỉ vào khi có ca hỏng thật.

**Luật, áp cho mọi đột biến kiểm từ nay:**

1. Đột biến phải **DỪNG lại ở đúng vế mình đang đo**. Không đủ khi biết "suite đỏ" — phải đọc được
   **dòng assert nào** đỏ, và nó phải là dòng của vế đó.
2. Đột biến chết ở một cổng **phía trước** vế đang đo thì **không tính**. Chạy riêng vế đó ra.
3. Mỗi đột biến nên chết ở **một phép khác nhau**. Bốn đột biến cùng chết ở một phép nghĩa là ba
   phép còn lại chưa được đo lần nào.

Ghi chi tiết: [CHANGELOG.md](CHANGELOG.md) bản 1.3.36.

---

## 2026-09-07 — Bảng: một khái niệm một chỗ, và nhật ký KHÔNG bao giờ sinh ra việc

Đức đọc audit UX rồi chốt bảy điều, **nguyên văn năm điều đầu**:

> *"Homepage chỉ giữ 3 câu: Đang làm gì / Cần Đức làm gì / Blocker-risk."* · *"Tìm và loại nguyên
> nhân 4-vs-13 'Cần Đức'; historical HANDOFF không được trở thành action."* · *"Gom 9 tab thành
> khoảng 4 nhóm."* · *"Mỗi information concept chỉ có một canonical location; nơi khác chỉ summary
> + link."* · *"Xóa/đồng bộ hướng dẫn 8-tab cũ và mọi nội dung stale."*

**Hai luật rút ra, và cả hai đã thành chốt máy:**

**⑴ Thứ không hành động được nữa thì không được sinh ra việc.** `HANDOFF.md` là nhật ký chỉ-thêm.
Quét nó tìm dấu `@Đức:` nghĩa là mỗi lần một phiên *kể lại* rằng có việc chờ thì lần kể đó thành
một việc mới, **vĩnh viễn** — con số tăng theo **số phiên**, không theo số việc. Đo được: 8 trong
13 dấu là ảo, và một dấu ảo nằm trong chính câu giải thích quy ước dấu.

**⑵ Một khái niệm một chỗ.** Bản trước vẽ bản đồ file **ba lần** và năm khái niệm khác **hai
lần** — không lần nào là tóm tắt. Hậu quả không phải dài, mà là **bảng nói hai con số khác nhau
cho cùng một câu hỏi**, và lúc đó cả hai con số đều vô giá trị.

**Luật kèm theo, áp cho mọi lần sửa bảng sau này: MÁY ĐẾM ĐƯỢC THÌ MÁY ĐẾM.** Con số "4" đến từ
một câu gõ tay trong `STATUS.md`. Một bản đếm gõ tay là nguồn sự thật thứ hai, và nguồn thứ hai
thì sẽ lệch — nó đã lệch: hai trong bốn mã nó nêu đã đóng, và cùng trường ấy còn nói *"chín tab"*
trong khi bảng có mười.

Chi tiết và **phần MẤT**: [docs/adr/0006](docs/adr/0006-bang-mot-khai-niem-mot-cho.md) ·
[CHANGELOG.md](CHANGELOG.md) bản 1.3.37.

**Hai chỗ Đức còn phải chốt** (đã ghi `BACKLOG.md` `KHUNG-40`): trần số dòng cho file luật là bao
nhiêu, và có đưa trần đó vào **cổng đóng phiên** hay không. Hiện `can-nang` cố ý nằm ngoài cổng,
nên mọi trần **chưa từng chặn được gì** — kể cả cái đang vượt 3,9 lần.

## 2026-09-08 · Cơ chế suite song song phải thành MỘT MỤC trong danh mục tính năng

**Đức chốt:** *"Nếu chưa coi đó là 1 feature, thì ta cần pack nó lại trong feature list để có
check list đầy đủ trong tab Migrate."*

**Vì sao cần chốt:** đo 08/09, `features.json` có 42 mục mà **không mục nào** đo cơ chế chạy suite
song song + dấu xác nhận (bản 1.3.60) — tính năng cắt một vòng làm việc từ 145s xuống 60s, đo thật
tại `n8n-orchestrator` cùng ngày. Nên `node scripts/features.mjs <repo>` **không trả lời được**
câu *"repo này đã nhận cơ chế đó chưa"*, và cột **Tính năng** của tab Migrate thiếu đúng dòng
quan trọng nhất.

Chi tiết việc và điều kiện đóng: [BACKLOG.md](BACKLOG.md) mục `KHUNG-48`. Việc của Vai ① — đây là
tầng máy nên đòi tăng `version` và sinh lại bản trích.
## 2026-09-08 · Lưu đồ trên bảng phải RA HÌNH, và danh sách dài phải chảy thành cột

**Đức chốt:** *"dashboard tôi thấy flow chart này toàn chữ, tôi cần hình ảnh trực quan"* · *"các
bảng bên dưới cần tự co lại thành các cột … độ rộng có thể adjustable để tôi chủ động co kéo"*.

**Chốt:** vẽ SVG **lúc sinh trang**, không nạp thư viện từ mạng — luật sẵn có trong
`build-overview.mjs` cấm phụ thuộc CDN vì trang là file tĩnh đem gửi người khác mở. Bộ vẽ
`scripts/luu-do.mjs`, ghim `tests/luu-do-smoke.mjs`. Danh sách dài dùng `column-width` (không
`column-count` — số cột phải suy từ màn hình), kèm thanh kéo nhớ lựa chọn.

Đo: lưu đồ ra hình **0/7 → 7/7** · khối checklist **1.943 → 1.023px**.

## 2026-09-08 · Ngân sách tài liệu: sửa CỔNG cho khớp LUẬT, không nới thước

**Đức chốt** hai lượt trong cùng ngày — cho `docs/archive/` rồi `docs/migrations/`.

**Vì sao cần chốt:** `AGENTS.md` và `can-nang.mjs` đều nói lưu trữ **không tính** vào ngân sách
(ngân sách đo *thứ mọi phiên phải nạp*), chỉ cổng đóng phiên là còn đếm. Một luật hai chỗ, và
chúng lệch thật: một lane chạy **đúng nhịp DỌN mà repo bắt làm** thì cổng ĐỎ vì chính việc dọn.

**Chốt:** ba thư mục CHỈ-THÊM không tính — `adr/` · `archive/` · `migrations/`, khai một chỗ ở
`THU_MUC_DOCS_KHONG_TINH`. Thước **5.744 → 4.001 → 3.248**: hai lượt miễn làm thước **chặt hơn
gần một nửa**, nên đây là chữa mâu thuẫn chứ không phải nới lớp bảo vệ.

## 2026-09-08 · Trần sổ nợ giữ 25 — đóng một mục, không nâng trần

**Đức chốt:** *"Giữ trần 25, tôi đóng `KHUNG-48`"*, thay vì nâng lên 30. Trần sổ nợ sinh ra chính
để chặn việc này (ADR-0010); nâng một lần thì lần sau dễ nâng tiếp.

## 2026-09-08 · Cổng kiểm GitHub đang bị VƯỢT — ghi bằng chứng, chưa siết

**Đức chốt:** *"ko phải big issue, ít gặp phải ko?"* → ghi lại, chưa đổi.

**Bằng chứng:** mọi lượt `safe-push` in nguyên văn từ remote: `Bypassed rule violations for
refs/heads/main: Required status check "cong-kiem" is expected`. Cổng **có khai**, tài khoản đang
đẩy **đi qua được**. Tần suất CAO, tác hại THẤP — ba lớp trước nó còn răng. Ghi ở `IDEAS.md` `Y-08`.

## 2026-09-09 · Bảng phải LIỆT KÊ sổ nợ, và có ô tìm trên cả trang

**Đức nêu:** *"tôi tìm các thông tin khung 30, 40, 53 trong dashboard nhưng rất mơ hồ? ta có thể
thêm tính năng search cho dashboard không?"*

**Vì sao cần chốt:** gốc bệnh **không phải** thiếu tìm kiếm. Đo được: bảng có hai CON SỐ của sổ nợ
và một đoạn giải thích cách đếm, nhưng **không liệt kê mục nào** — `KHUNG-53` xuất hiện **0 lần**
trên cả trang dù đang mở. Tìm kiếm trên một trang không chứa thứ cần tìm cũng không ra.

**Chốt:** làm cả hai, theo thứ tự đó. ⑴ Bảng liệt kê đủ 25 mục (mã · mức ưu tiên · tiêu đề · cờ
chờ-chốt), chảy thành cột. ⑵ Ô tìm quét **cả nhóm đang ẩn** — Ctrl+F của trình duyệt không thấy
chữ trong tab `hidden`, nên với người xem thứ họ cần "không có trên trang" trong khi nó có.

## 2026-09-09 · Giành `_root` khi bảng quyền và lời người chốt lệch nhau

**Đức chốt, nguyên văn:** *"bạn hãy giành root đi, phiên kia đang ko làm gì."* — sau khi Đức nói
*"root đã mở"* mà bảng quyền vẫn báo `harness-phat-01` giữ 24 phút.

**Ghi lại vì hình dạng, không vì lượt này:** khi **lời người chốt** và **bảng quyền** nói khác
nhau, phiên AI phải **nói ra chỗ lệch** rồi chờ chốt, không tự chọn bên nào. Bảng quyền là nguồn
sự thật cho *máy*; người chốt là nguồn sự thật cho *quyền*. Ba đường hợp lệ để một khoá được trả
vẫn nguyên (AGENTS.md mục 1).

## 2026-09-09 · `--carry` được tự làm khi cổng đã XANH TOÀN BỘ

**Đức chốt:** *"Đẩy đi, và từ nay khỏi hỏi nếu cổng đã xanh."*

**Vì sao cần chốt:** trong hai ngày, **ba lượt** phải dừng hỏi Đức cho **cùng một hình dạng** —
commit của lane khác nằm dưới commit của mình, và git xếp theo thứ tự nên đẩy cái trên là buộc
đẩy cái dưới. Cả ba lượt Đức đều duyệt. Một cửa mà lần nào cũng mở thì nó không còn là cửa, nó là
một bước thủ tục — và thủ tục lặp lại sẽ bị bỏ qua trước khi nó bị gỡ.

**Chốt:** `AGENTS.md` mục 2 hàng 2 thôi cấm `--carry` nói chung. Nay chỉ cấm khi **cổng CHƯA xanh
toàn bộ**, hoặc có commit **không quy thuộc được** (thiếu nhãn `Lane:`).

**ĐÂY LÀ NỚI MỘT LỚP BẢO VỆ**, khác hẳn hai lượt miễn thước kho chữ hôm 08/09 — những lượt đó
làm thước **chặt hơn** vì chúng sửa phép đo cho khớp luật. Lượt này đổi chính luật.

**Cái mất, nói thẳng:** Đức thôi được báo từng lượt việc của lane khác được công bố lên GitHub.
Đổi lại: commit chưa push là **vô hình** với vòng audit chéo của GPT, nên đẩy sớm là được soi sớm.

**Ghi ở đâu:** vân tay luật chung + lý do trong sổ đổi vân tay của `build-template.mjs`; luật ở
`AGENTS.md` mục 2. Một luật vào một luật ra — bản trích giữ **200/200 dòng** bằng cách gộp đoạn
*"commit và push tự làm"* với đoạn mới, vì sau lượt này hai đoạn nói cùng một điều.

## 2026-09-09 · Luật mới phủ luật cũ thì XOÁ luật cũ, và mỗi luật phải có CHỦ NGỮ

**Đức chốt:** *"rà soát thủ công và elimiate các decision, luật trùng nhau, nhiều quyết định sau
cover hoặc reverse cái cũ -> sẽ sinh noise … chỉ giữ trạng thái cuối cùng thôi."* Và sau đó:
*"tôi đồng ý, gộp, xóa, sử dụng decision mới nhất, bỏ các cái cũ đã bị obsolete để ko gây confuse."*

**Ca thật Đức bắt được:** luật mới nhất là *khoá file, trả ngay sau khi sửa xong*. Nhưng một phiên
lại nhớ sang luật khác — *"quá 30 phút thì nêu tên, tuyệt đối không tự nhả"* — rồi áp nó cho khoá
của **chính nó**, nên giữ khoá suốt phiên. Đọc lại thì câu đó **không có chủ ngữ**: "KHÔNG tự nhả"
ai? Ý gốc là **MÁY** không được tự hết hạn khoá của **lane khác**.

**Chỗ hỏng nặng hơn, đo được 09/09:** mục 1 của luật chung lúc đó có **BA mốc trả khoá** cùng lúc —
*"trả ngay sau khi sửa"* · *"NGAY SAU khi COMMIT"* (khối lệnh) · *"hết phiên"*. Và sổ đổi vân tay
ngày 08/09 chép nguyên văn lời Đức *"trả ngay trước và sau khi AI sửa"* rồi câu kế tự viết *"mốc
trả là HẾT PHIÊN"*. Một đoạn văn nói hai điều ngược nhau.

**Chốt:** mục 1 nay nói **MỘT mốc mỗi loại khoá** — khoá file trả ngay sau commit chứa lượt ghi,
khoá vùng trả sau khi đã đẩy; cổng ĐỎ chỉ là **lưới đỡ**, không phải hạn chót được phép xài. Và
mục 8 nhận **câu hỏi thứ 5**: luật mới phủ luật cũ thì xoá luật cũ ngay lượt đó, luật nào cũng
phải có chủ ngữ. Lịch sử nằm ở `git log` và ADR, không nằm ở chỗ đang cưỡng chế.

## 2026-09-09 · Luật viết bằng TIẾNG VIỆT, và mỗi luật có ĐÚNG MỘT nhà

**Đức chốt:** *"hãy phân nhóm cho chúng, giữ luật bằng tiếng việt để tôi cùng đọc bản cuối."*

**Vì sao cần chốt:** trước đó có hướng dịch luật sang tiếng Anh cho AI đọc rẻ hơn. Đức bác: anh
phải đọc được bản cuối. **Luật Đức không đọc được thì Đức không chốt được** — mà mục 5 luật vàng
đã nói *"Đức đọc không hiểu = lỗi hệ thống"*. Hướng dịch sang tiếng Anh **đóng lại**, không đo
token nữa.

**Chốt phần phân nhóm:** `AGENTS.md` mục 8 câu 4 — mỗi luật có ĐÚNG MỘT nhà, chỗ khác chỉ trỏ
sang: luật áp cho mọi repo → `AGENTS.md` · Đức vừa chốt → `decisions.md` một dòng · lý lẽ dài có
số đo và có **cái MẤT** → `docs/adr/` (bất biến) · thứ đang HỎNG → `BACKLOG.md` kèm `đóng khi:` ·
việc lặp lại hay hướng đi chưa hỏng → sổ riêng, khai vào bảng mục 6. **Chọn không nổi nhà = luật
đó chưa đủ rõ để thêm.**

**Cái mất:** thêm một luật nay tốn thêm một bước (chọn nhà). Đổi lại: hết cảnh nối luật mới vào
chỗ gần nhất, rồi hai chỗ nói hai kiểu.

## 2026-09-09 · LUẬT KHOÁ — gộp 3 quyết định 06/09–08/09 thành một

**Đức chốt:** *"gộp, xóa, sử dụng decision mới nhất, bỏ các cái cũ đã bị obsolete để ko gây confuse."*

**Vì sao:** muốn biết luật khoá hiện hành, trước lượt này phải đọc **ba mục ở ba chỗ** rồi tự ghép
— viết cách nhau ba ngày, mục sau không nói nó phủ mục nào. Ca thật: một phiên nhớ đúng câu *"quá
30 phút thì nêu tên, tuyệt đối không tự nhả"* rồi áp cho khoá của **chính nó**, giữ khoá suốt phiên
— ngược hẳn mục cùng ngày bảo *"trả ngay sau khi sửa"*. Phiên đó **không nhớ nhầm**: nó đọc đúng
một trong ba câu đang cùng có hiệu lực.

**Luật khoá hiện hành ở đâu:** [AGENTS.md](AGENTS.md) mục 1 — **một bản duy nhất**, đừng chép lại.
Lý lẽ và số đo: [ADR-0012](docs/adr/0012-khoa-muc-file.md) · [ADR-0013](docs/adr/0013-cua-tu-choi-mat-tin-hieu.md).

**Cái ĐỔI so với ba mục cũ:** ⑴ mốc trả khoá file: *"hết phiên"* → **ngay sau commit** chứa lượt
ghi; ⑵ câu *"một lane một khoá gói"* (thời chỉ có khoá vùng) nay dễ đọc nhầm — một lane giữ **nhiều**
khoá file là bình thường, điều còn đúng là **một VÙNG chỉ một lane**; ⑶ câu *"KHÔNG tự nhả"* nhận
chủ ngữ: **MÁY** không tự nhả, không phải "bạn đừng trả khoá của mình".

**Ba mục cũ:** dời nguyên văn sang
[docs/archive/DECISIONS-khoa-2026-09.md](docs/archive/DECISIONS-khoa-2026-09.md) — giữ từng byte,
chỉ đổi chỗ, đã đối chiếu bằng `git diff` (37 dòng cắt, 37 dòng vào kho, 0 dòng mất).

**Còn hở:** `KHUNG-53` — cổng buộc mục *"Test xanh"* vào khoá VÙNG, nên trả hết khoá file là mục đó
thành BỎ. Đã cắn **hai lượt**.

## 2026-09-09 · BỘ BIÊN DỊCH LUẬT — sổ cái chỉ thêm, luật hiệu lực được biên dịch ra

**Đức chốt, nguyên văn:** *"mọi rule mới được append vào ledger, nhưng KHÔNG append trực tiếp vào
active rules. Active rules luôn là một bản compiled nhỏ được tái tạo từ ledger."* Và:
*"append → merge → supersede → trim → compile."* Kèm ràng buộc: *"Tôi không khuyến nghị AI tự tiện
sửa/xóa rules. AI có thể propose → compare → recommend."*

**Vì sao cần:** đo 09/09 ở chính repo này — mục 1 hiến pháp có **BA mốc trả khoá** cùng hiệu lực,
và một phiên đã đọc đúng một trong ba rồi làm ngược hai cái kia. Thêm bốn con số gõ tay mô tả tập
hợp đều đã sai. Bệnh chung: luật chỉ có một chiều là TĂNG.

**Chốt:** [ADR-0014](docs/adr/0014-bo-bien-dich-luat.md). Lệnh: `npm run luat`. Cưỡng chế: **B16**
(nhóm CHẶN). **Không gộp file ADR** — ADR `Accepted` bất biến theo B12; ta gộp **câu trả lời** bằng
`chu_de` + `dau_moi` trong frontmatter (B12 cho phép sửa frontmatter). 14 ADR → **6 chủ đề**.

**Bất biến:** AI được ĐỀ XUẤT (`--de-xuat`), **không được tự sửa hay xoá luật**. Chỉ khai báo tường
minh mới làm đổi bộ luật hiệu lực.

**Cái mất:** thêm một ADR nay tốn thêm một bước (chọn chủ đề); và bộ biên dịch **không hiểu nghĩa**
— nó cưỡng chế khai báo, không phát hiện được hai luật mâu thuẫn cùng khai đúng chỗ.
