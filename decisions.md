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

## 2026-09-06 · Khoá vùng: nhận muộn, một lane một khoá, và cấm nhả hộ

Đức: *"tôi muốn adjust rule về việc giữ khóa để tối ưu flow làm việc hơn"*. Ba luật vào
`AGENTS.md` mục 1: **nhận khoá ngay trước lượt ghi đầu tiên** (đọc và đo không cần khoá) ·
**một lane một khoá gói** · **không nhả khoá hộ lane khác** vì đo thấy vùng chưa bị chạm.

Tín hiệu mới `"repo chưa thấy dấu vết"` hiện ở ba chỗ và là **VÀNG, không ĐỎ** — chặn một lane
đang đọc kỹ là dạy mọi lane ghi bừa một byte để giữ khoá cho hợp lệ. Bằng chứng gốc: 06/09 một
phiên điều phối đo thấy "0 commit 0 sửa đổi" rồi nhả khoá hộ, trong khi lane đó đang làm thật ở
thư mục ngoài repo — lane phải hoàn nguyên phần đã xong. Ghim: `tests/khoa-dau-vet.mjs`.

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
