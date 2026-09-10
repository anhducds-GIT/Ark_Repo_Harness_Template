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

## 2026-09-10 · Bản rà 111 mục luật là ĐỀ XUẤT — AI chốt từng mục, không phải Đức

**Đức chốt.** Đức và GPT rà cả `AGENTS.md` + `CLAUDE.md` thành **111 mục** (`R-001`→`R-111`), mỗi
mục một trong năm số phận: `GIỮ` · `GỘP` · `HẠ THÀNH HƯỚNG DẪN` · `CHUYỂN SANG MÁY` · `BỎ`.
Đức nói: *"đó chỉ là proposal thôi, bạn review và là người quyết định cuối cùng nhé"* — mục đích
*"core rule lean hơn và consistent hơn"*.

**Vì sao đây là việc của AI, không phải của Đức:** mục 2 của luật chung đã cho AI tự quyết việc
đổi luật an toàn khi đủ ba điều kiện (audit độc lập sạch · sổ quyết định nói cái MẤT · không làm
yếu lớp bảo vệ mà không gọi tên thứ mất đi). Chốt từng mục **cần đọc mã để biết máy nào có thật**,
và đó là dữ kiện Đức không có trong tay.

**Quyết định của tôi và cái MẤT: [ADR-0018](docs/adr/0018-ra-lai-111-muc-luat.md).** Khác đề xuất
ở **14 chỗ**, và giữ **43** mục thay vì 36 — bảy mục thêm vào đều là mục đề xuất muốn chuyển sang
máy, mà cái máy đó **chưa tồn tại hoặc chỉ BÁO chứ không CHẶN** (đo được, xem ADR).

## 2026-09-10 · `upgrade` KHÔNG tự sửa tài liệu repo đích — ba bước cuối làm TAY

**Đức chốt.** Sau `upgrade --apply`, ba bước để cổng repo đích xanh lại — khai thư mục mới vào
Bản đồ file · sinh lại artifact · ghi Log — **làm TAY**, không tự động hoá.

**Lý do Đức nói:** *"mục đích là đảm bảo repo đích chạy được chính xác"*. Một lượt nâng tự viết
vào tài liệu repo đích thì không ai đọc lại xem nó viết đúng chưa — và cái cổng Đỏ ở đó chính
là thứ bắt người ta đọc.

**Số đo đã có khi chốt:** `--apply` **7 giây**; ba bước tay **~3 phút/repo**, tức **96%** thời gian
migrate nằm ở phần làm tay. Đức biết con số đó và vẫn chốt như trên.

**Cái MẤT:** migrate không phải một lệnh, mà là một lệnh cộng ba việc người — và ba việc đó
**có thể bị quên**. Bù lại bằng cách DUY NHẤT không vi phạm nguyên tắc: `upgrade` **nói tên đúng
ba bước đó** ở cuối mọi lượt `--apply`, thay vì chỉ nói *"chạy npm test rồi cổng"*.

## 2026-09-10 · Thứ tự sau đóng gói: `T3` → `R6`, không phải `R4`/`R5`

**Đức chốt.** Đóng gói cái đang có trước (`T3`), rồi **bỏ luật không có máy canh** (`R6`).
Hai bảng điều khiển luật/nợ (`R4`/`R5`) **hoãn**.

**Vì sao:** tôi đề xuất thứ tự này sau khi đo được giá của một mắt nối: thêm một file vào bộ
khung buộc nối đúng **5 chỗ**, và mỗi mắt bỏ sót chỉ lộ ra sau một lượt cổng 7 phút — riêng việc
phát hiện tuần tự chúng tiêu **~35 phút**. **Bớt mắt nối đáng hơn thêm dụng cụ để nhìn mắt nối.**
Đức đọc và chốt đúng thứ tự đó.

## 2026-09-10 · Ghi đè bản vá tay của repo đích — AI tự quyết, sau khi sửa ở LÕI

**AI tự quyết** (mục 2 — không thuộc ba việc phải hỏi Đức). `Chrome_Extension_AI_Agentic` tự vá
`scripts/build-dashboard.mjs` (lỗi `behaviourOpts` sai phạm vi). Tôi **sửa cùng lỗi ở LÕI**, ghim
bằng `bang-song` vế 14, rồi `upgrade --force` ghi đè bản của họ.

**Cái MẤT:** bản vá tại chỗ của lane khác bị xoá — họ không được hỏi. Điều kiện tôi tự đặt để
cho phép mình làm: đối chiếu **đúng 2 hunk, +8/-2**, nội dung trùng với bản vá ở lõi. **Không
trùng thì không được `--force`** — lúc đó là xoá việc của người khác, không phải đồng bộ hoá.

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

> **trạng thái:** đang hiệu lực — nó mang một NGUYÊN TẮC vẫn đang áp: *mọi cơ chế phải có
> một mục trong `features.json`*. Áp lại 09/09 khi thêm `F5.5` cho bộ biên dịch luật. `KHUNG-48`
> đóng rồi, nhưng nguyên tắc thì không đóng theo.

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

## 2026-09-09 · Tài liệu KHÔNG được dạy mặc định đã bị thay thế

**Đức chốt:** *"nhiều quyết định sau cover hoặc reverse cái cũ → sẽ sinh noise."* Đây là ca đo
được của chính câu đó.

**Đo 09/09:** luật đổi mặc định khoá từ VÙNG sang FILE hôm 08/09 và chỉ sửa `AGENTS.md`. Đo lại
cả kho tài liệu: `--sua` (lệnh MỚI) xuất hiện ở **1 file**, `--take` (lệnh CŨ) ở **4 file**.
`docs/SO-TAY-AGENT.md` còn bảo nhận khoá **lúc mở phiên** — ngược cả luật *"nhận ngay trước lượt
ghi"*. Nặng nhất là `docs/briefs/GIAO-VIEC-CHUNG.md`: **đề bài giao cho AI khác**, nên mọi phiên
được giao việc đều đang học mặc định đã bị thay thế, và **không sai ở chỗ nào cả** — nó đọc đúng
một câu đang nằm trong repo.

**Chốt:** ⑴ sửa cả bốn file trỏ về `AGENTS.md` mục 1 thay vì chép luật; ⑵ ghim bằng **F20** ở
`tests/core-contract.mjs` — file nào nhắc `--take` thì **phải** nhắc cả `--sua`. Đo bằng SỰ CÓ
MẶT, không đoán ngữ nghĩa; nó không cấm nhắc khoá vùng, chỉ cấm **dạy một nửa**.

**Bài học về chính phép đo:** bản đầu của F20 dò chuỗi đầy đủ `claim.mjs --take` và chỉ thấy 1
file — **bỏ sót đúng file nặng nhất**. Phép đo hẹp hơn thực tế thì nó báo xanh ở đúng chỗ đang
hỏng.

## 2026-09-09 · Số mô tả một tập hợp thì phải ĐẾM, không gõ tay

**Không phải Đức chốt — đây là luật tôi rút ra từ SÁU ca đo được trong một ngày**, ghi theo luật
mục 8 (thêm một luật phải trả lời được "đã có chuyện gì xảy ra thật chưa").

**Sáu con số gõ tay đã sai, cùng một hình dạng:** bảng tra nói *"6 trên 11 mục cổng có ca đỏ"*
(cổng có 15) · cổng phiên gọi bộ kiểm cấu trúc là *"B1–B14"* (nó có 15) · bộ đó tự xưng *"15 phép
kiểm B1…B15"* ngay lượt thêm B16 · `features.json` khai *"41 mục"* (có 44) · `bang-song` *"chín
vế"* (11) · `khoa-dau-vet` *"tám vế"* (11).

**Không cái nào làm đỏ bất cứ thứ gì — và đó chính là vấn đề.** Nên cả sáu cùng sống. Người đọc
luật thì TIN con số: một phiên đọc *"6 vế"* sẽ nghĩ hai vế cuối không tồn tại.

**Chốt:** ⑴ chỗ nào máy đếm được thì để máy đếm (tiêu đề cổng cấu trúc nay tự đếm; tên mục cổng
thôi mang số); ⑵ ghim **F21** ở `core-contract` — mọi khẳng định *"N vế"* đi kèm liên kết tới
`tests/*.mjs` phải khớp số vế thật.

**Lỗ của chính F21, tìm ra bằng đột biến:** bản đầu chỉ đọc chữ số, nên đổi *"11 vế"* thành *"chín
vế"* là khẳng định đó **rơi ra khỏi tập đo** và phép kiểm vẫn xanh — mà *"chín vế"* đúng là một
trong sáu con số sai. **Một phép kiểm chừa ca hỏng của chính nó là đồ trang trí.** Nới ra đọc cả
số viết bằng chữ thì nó bắt ngay con số sai **thứ sáu** mà tôi chưa hề biết.

## 2026-09-09 · Sổ tay vai điều phối chép luật, và bản chép trôi lệch ba lần

**Rà `ORCHESTRATOR.md`** (464 dòng, file tài liệu lớn nhất) theo đúng luật vừa dựng. Không tìm lỗi
diễn đạt — tìm **bản chép của luật có nhà ở nơi khác**.

**Ba chỗ, đều là bản chép, đều đã sai:**

1. **Mục 5b** khẳng định *"đẩy kèm commit của phiên khác thì **phải hỏi**"* — sai từ 09/09, khi
   Đức chốt cho `--carry` tự làm nếu cổng XANH TOÀN BỘ và mọi commit quy thuộc được.
2. **Mục 2** viết luật song song dạng *"KHI VÀ CHỈ KHI hai khoá khác nhau"* — **hẹp hơn luật thật**
   từ 08/09: mặc định là khoá mức FILE nên hai việc cùng vùng khác file cũng song song được.
   Bản đồ việc trả lời **an toàn**, không trả lời **đủ** — và câu cũ đọc thành "cùng vùng thì cấm".
3. **Khối cảnh báo đầu file** từng nói ngược về hai lệnh của vai này, sai từ 1.3.0 tới 05/09.

**Và ca thứ tư ở file khác:** `docs/briefs/ONBOARD-AI-REPO-DICH.md` — **đề bài giao cho AI ở repo
đích** — cũng chép luật `--carry` cũ. Hai trong bốn ca nằm trong **đề bài giao cho AI khác**, tức
chỗ bản chép sai lan xa nhất.

**Chốt:** cả bốn chỗ **thôi chép, chỉ trỏ**. Ghim mở rộng **F20**: một **đoạn văn** nhắc `--carry`
thì phải nhắc cả `AGENTS.md` — phát biểu luật một mình là không được.

**Bài học về phép đo, lặp lại lần thứ ba trong ngày:** bản đầu đo theo **dòng** và báo lệch hai chỗ
lành (một bảng đối chiếu kỹ thuật, một dòng NỐI của đoạn đã trỏ đúng). Đo theo **đoạn** thì sạch.
Phép đo chặt hơn thực tế cũng nguy như phép đo lỏng hơn — người ta sẽ tắt nó.

## 2026-09-09 · CONTEXT COMPILER, và máy KHÔNG được tự cắt luật

> **trạng thái:** đang hiệu lực — hai nguyên tắc dưới đây đang cưỡng chế ở cổng đóng phiên.

**Đức chốt:** *"chốt thiết kế Rule Compiler V1 riêng gồm append → merge → supersede → trim →
compile, rồi mới gắn nó vào Context Compiler. đây là điểm quan trọng nhất để chốt các rules."*
Kèm uỷ quyền: *"việc tổng hợp rules, tự động compile & control sẽ do AI chủ động hoàn toàn."*

**Chốt:** [ADR-0015](docs/adr/0015-context-compiler.md), bổ sung ADR-0014. Năm lệnh:
`--so-cai` · `--de-xuat` · frontmatter (supersede) · `--trim` · **`--nap`**.

**Số đo 09/09:** một phiên nạp **284/300 dòng**; phần **KHÔNG nạp 4.499 dòng** — **6% nạp**.
Nên *"tổng tài liệu 3.602/2.200"* **không phải chi phí ngữ cảnh**: kho tài liệu là thư viện tra
cứu, 94% không bao giờ được nạp. Thứ phải giữ nhỏ là **phần NẠP**, và nó đang trong trần.

**Bài học đắt nhất:** `--trim` bản đầu cắt theo tín hiệu đo được và **bắt oan ba lượt liên tiếp**
— *Trần sổ nợ giữ 25* (trần vẫn cưỡng chế) · *Migrate là BA việc* (định nghĩa đang dùng) · *Cơ chế
suite song song* (chứa nguyên tắc vừa áp lại cùng ngày). **Một mục sổ quyết định thường chứa CẢ
bản ghi việc đã xong LẪN một nguyên tắc đang sống.** Nên máy chỉ cắt thứ ĐÃ KHAI
(`> **trạng thái:** đã thi hành`), và `đang hiệu lực` thắng mọi tín hiệu.

**Cưỡng chế:** cổng đóng phiên, gộp vào mục *"Ngân sách trong trần"* — **không** thành mục thứ 26,
vì thêm một phép kiểm để cưỡng chế luật chống-phình thì tự mâu thuẫn. Ghim ca đỏ thật ở
`tests/cong-do-that.mjs` vế 14.

## 2026-09-09 · Hiến pháp chỉ giữ LUẬT; mở phiên đọc `STATUS.md`, không đọc đuôi `HANDOFF.md`

> **trạng thái:** đang hiệu lực — hai nguyên tắc dưới đây đang cưỡng chế ở cổng đóng phiên
> (`budget.tokenNap`) và ở mục 0 của `AGENTS.md`.

**Đức chốt hai điều.**

⑴ **Ngưỡng không phải đích.** *"mục tiêu không phải đạt ngưỡng, mà phải nhỏ hơn ngưỡng margin là
30-40%, vì sau này sẽ tiếp tục phình ra."* Trần thật giữ **6.000 token**; `budget.tokenNap` siết
xuống **4.200** — vạch biên 30% — để cổng ĐỎ **sớm**, trước khi chạm trần.

⑵ **Mở phiên đọc `STATUS.md`.** *"mục 1 đổi từ 'đọc cuối HANDOFF.md' sang 'đọc STATUS.md' …
HANDOFF.md chuyển sang nạp khi cần."* Đuôi `HANDOFF.md` là **một lượt việc**, không phải **trạng
thái**. Đây là điều **sửa** [ADR-0015](docs/adr/0015-context-compiler.md), ghi ở
[ADR-0016](docs/adr/0016-hien-phap-mong.md).

⑶ **Uỷ quyền thường trực:** *"tôi ủy quyền cho bạn duy trì tự động cơ chế nén rules, tái tổ chức
và cấu tạo lại kiến trúc cho phù hợp, đạt ngưỡng đề ra hiện tại."* AI tự nén, tự dời, tự đổi cấu
trúc — miễn đúng hướng, trong ngân sách, và **không mất nội dung thật**. Sáu việc mục 2 vẫn phải hỏi.

**Số:** tổng nạp mỗi phiên **13.799 → 5.804 → 3.943 token**. Lý lẽ sang `docs/VI-SAO-LUAT.md`,
ba luật cơ chế khoá sang `docs/protocols/MULTIFLOW.md`, cách lắp repo mới sang `README.md`.

**Cái mất, và audit Codex bắt được:** nén văn xuôi làm **rụng mệnh lệnh phụ** — bốn chỗ bị làm
yếu ở bản nén đầu, đã trả lại nguyên văn. Chi tiết ở ADR-0016.

## 2026-09-09 · Đính chính số nạp của mục trước: 3.943 → 4.002

> **trạng thái:** đã thi hành — chỉ sửa CON SỐ, không đổi quyết định nào.

Mục *"Hiến pháp chỉ giữ LUẬT"* phía trên ghi tổng nạp **3.943 token**; số đó đúng lúc chốt, còn
số **đóng phiên là 4.002** (`AGENTS.md` 3.432 + `STATUS.md` 570), vì sau đó có ghim thêm luật
*GOM COMMIT* vào `AGENTS.md` mục 0b. Trần vẫn **4.200**, vẫn ĐẠT.

Ghi bằng cách THÊM chứ không sửa đè: [ADR-0016](docs/adr/0016-hien-phap-mong.md) đã `Accepted`
nên thân bài bất biến (B12), và `HANDOFF.md` là sổ chỉ-thêm.

## 2026-09-09 · Dời mốc Stable Baseline từ `v1.2.17` sang `v1.7.2`

> **trạng thái:** đã thi hành — `README.md` và `STATUS.md` đã trỏ mốc mới.

**Đức chốt:** *"đóng gói trọn vẹn để ta bắt đầu migrate sang các repo khác"*, kèm bốn tính năng
phải sống sót: hai vai AI · khoá mức FILE · bộ nén và giao thức nén context · audit và đưa repo
đích lên chuẩn.

**Vì sao phải dời, không để nguyên:** `v1.2.17` mang hiến pháp **13.799 token**. Toàn bộ việc nén
hôm nay **không tới được repo nào** chừng nào repo thứ ba trở đi vẫn lắp từ mốc cũ — sửa
[ADR-0003](docs/adr/0003-dong-bang-stable-baseline.md) ở đúng con số mốc, mọi điều khác của nó
(chế độ bảo trì, không lắp từ HEAD) giữ nguyên.

**Số ở repo đích:** nạp mỗi phiên **4.207 / 6.000 token — biên 30%**, so với 13.799 của mốc cũ.

**Cái mất:** `v1.2.17` đã chạy thật nhiều ngày; `v1.7.2` mới một ngày tuổi. Đổi lại nó mang bốn
tính năng trên ở trạng thái **BẬT** — mốc cũ mang bộ nén nhưng **không khai một ngân sách nào**,
nên cổng ở repo đích không canh được gì mà vẫn báo xanh.

## 2026-09-09 · Kéo lớp bảo vệ của repo tiêu thụ VỀ NHÀ trước, rồi mới migrate

> **trạng thái:** đã thi hành — [ADR-0017](docs/adr/0017-dau-niem-phong-bang-quyen.md), bản 1.8.0.

**Đức chốt** khi soát repo `Chrome_Extension_AI_Agentic` trước lượt migrate: *"kéo về nhà trước,
rồi mới đẩy xuống"*.

**Vì sao:** repo đó **không cũ hơn bộ khung — nó đi trước ở tầng máy**. Nó có **dấu niêm phong
`.agents/claims.json`** cưỡng chế đúng câu luật mục 1 của ta (*"nhận và trả bằng lệnh, không sửa
tay"*) mà **ta viết ra nhưng chưa bao giờ kiểm**. `upgrade --force` sẽ **xoá lớp bảo vệ đó khỏi
chính repo đã phát minh ra nó** — luật vàng 3 cấm.

**Đính chính con số của chính tôi:** ban đầu tôi báo *"họ hơn ta 11 năng lực"*. Đó là đếm theo
**TÊN HÀM**. Soát lại theo **NĂNG LỰC** thì phần lớn ta đã có dưới tên khác (`DAU_VET`,
`handoffCapFrom`, kiểm artifact theo HEAD, `don.mjs` cắt kho). Thứ thật sự thiếu là **một**: dấu
niêm phong cộng ghi nguyên tử. Đếm tên không phải đếm năng lực.

**Còn lại, ghi nợ chứ không chép:** `handoffSoMucCapFrom` (trần SỐ MỤC, ta đã có trần byte và
trần dòng — thêm cái thứ ba vào cùng một file là phình), và **ONE LOADING LAW** trong
`CONTEXT-COMPILER-V1-PROPOSAL.md` của họ: bảng máy đọc `việc → file#mục`, mạnh hơn bảng văn xuôi
mục 6 của ta. Đáng làm, chưa làm.

## 2026-09-10 — Nới trần sổ nợ 25 → 30, và nó là trần TẠM

**Đức chốt**, nguyên văn: *"tạm thời nới margin lên 30, ta sẽ clean sau"*.

**Vì sao cần chốt:** `backlog.tran` là con số duy nhất trong `.repo-structure.json` mà
`ADR-0010` bắt phải hỏi người chốt — nới trần là cách rẻ nhất để một cái cổng thôi kêu, nên
nó cố ý không nằm trong tay AI. Cổng cũng nói thẳng: *"đừng nâng trần để đi tiếp"*.

**Bối cảnh đo được:** bản 1.8.11 lôi ra hai nợ thật cùng lúc — `KHUNG-61` (6 mục luật ở
`AGENTS.md` nhà chưa có phép dò) và `KHUNG-62` (không có cửa máy cho *"Đức chốt cho nhả khoá
FILE của lane khác"*, nên phải mạo nhãn và bảng quyền ghi sai người). Sổ đang 25/25, nên một
trong hai phải bị gộp vào mục khác — tức **mất một dòng `đóng khi:` riêng**, mà đó chính là
thứ làm một mục nợ đóng được.

**Trần TẠM, không phải trần mới.** Lượt DỌN tiếp theo phải hạ lại; số 30 không được tự sống.


## 2026-09-10 — VẠCH ĐÍCH của bộ khung: hai vế, và vế nào cũng là SỐ

Đức chốt `R0` trong [ROADMAP-V2](docs/ROADMAP-V2.md). **Vế A — LÀM ĐƯỢC:** một repo mới sau
migrate làm được bốn việc (nhận khoá · commit không cuốn việc lane khác · cổng xanh · đẩy an
toàn). **Vế B — CÂN NẶNG:** bảng chín ô, mỗi ô một con số.

**Vì sao phải có SỐ.** Bản Đức mô tả đầu tiên toàn tính từ — *lean · không phình · không
over-engineer · không quá nhiều luật*. Không có số thì tuần sau vẫn cãi được, và mọi phiên vẫn
tìm ra chỗ đáng gọn hơn. Đó đúng là cỗ máy đã ăn mất một tuần: **repo không có vạch đích thì mọi
thứ đều là "còn thiếu"**. Đức thêm hai ô AI bỏ sót — **bộ sinh BẢNG** và **một vòng sửa → đẩy** —
vì đó là hai chỗ ngốn thời gian thật, không phải hai chỗ trông xấu.

**Đủ bảng thì DỪNG.** Vạch đích không chỉ nói khi nào được nghỉ, nó còn cấm gọn thêm sau đó.

## 2026-09-10 — Đức chốt: ĐÁNH ĐỔI lớp "artifact còn tươi" để lấy tốc độ

Đức: *"đồng ý với sacrifice để optimize."*

**Mất gì, nói thẳng.** Ba file `DASHBOARD.md` · `llms.txt` · `repo-map.json` vẫn nằm trong git
nhưng **không còn ai đối chiếu chúng với `HEAD`**. Ai sửa tay một dòng thì không cổng nào kêu.
Đó là hệ quả trực tiếp của `generators: []`, không phải chỗ mù.

**Được gì.** Bỏ vòng lặp **191/522 commit (37%)** trong 7 ngày mà cổng BẮT BUỘC sinh ra — mỗi
commit như thế còn làm hỏng dấu xác nhận suite, tức thêm ~10 phút một lượt.

**Ba điều kiện đi kèm, không phải lời hứa suông:**
1. Cổng in ra **KHÔNG ÁP DỤNG** kèm câu *"artifact đã commit hiện KHÔNG ai canh"* — chỗ mất được
   nói ở đúng nơi người vận hành đọc, không giấu trong một dòng sổ.
2. Lời miễn trừ suite cho commit chỉ-sinh-artifact **chết theo** khi `generators` rỗng: không ai
   canh thì không được miễn. Có đối chứng ngược ghim (`tests/cong-do-that.mjs` ca b2).
3. Phần CHƯA bịt được — có bộ sinh không chứng minh bộ sinh canh đúng file được miễn — ghi nợ
   `KHUNG-64`, không tự nhận là đủ.

**Vì sao ghi vào đây chứ không chỉ trong CHANGELOG:** đây là lần đầu repo **cố ý bỏ một lớp bảo
vệ**. Mọi luật trước nay đều nói *"không làm yếu lớp bảo vệ đã có"*. Ngoại lệ có người chốt, có
ngày, có cái giá — khác hẳn một lớp bảo vệ bị mòn đi mà không ai nhớ vì sao.

## 2026-09-10 — `R2` · Bản phát hành cắt theo ĐỢT VIỆC, không theo lượt ghi file

Đo 7 ngày: **78 lần cắt bản**. Không phải vì ai lười gom — vì **cơ chế bắt cắt**: sổ phát hành là
vùng chỉ-thêm, nên mỗi lượt sửa một file tầng máy là buộc phải cắt một bản mới. Riêng việc `R1`
hôm nay đi qua `1.9.0 → 1.9.1 → 1.9.2 → 1.9.3`, trong đó **hai bản cắt hụt chưa từng đẩy**.

**Chốt:** một bản cho một **đợt việc đã đóng** (audit sạch, cổng xanh, đã đẩy), không phải một bản
cho một lượt `git add`. Mục tiêu **≤ 7 bản/tuần**. Cách làm: gom hết thay đổi tầng máy của một đợt
rồi mới `npm run template` **một lần** ở cuối.

## 2026-09-10 — `R3` · ĐÓNG BĂNG tính năng và phép kiểm tới khi xong `R11`

**Cấm cho tới khi 5 repo đích cùng một bản, cùng xanh:** thêm tính năng mới · thêm phép kiểm mới ·
thêm luật mới · thêm tài liệu mới. Việc ngoài phạm vi → ghi `BACKLOG.md`, không tự làm.

**Được phép:** BỎ, GỘP, và vá thứ đang chặn `R11`.

Áp cho **cả AI lẫn người**. Vì sao cần một dòng chốt: repo chết vì phình, và mỗi bản vá riêng lẻ
đều đúng — cộng lại thì không. Đo: `scripts/` 16.533 dòng mà lõi thật chỉ **22%**.

## 2026-09-10 — Rút SÁU việc phải hỏi Đức xuống BA. Đức quyết ĐÁNH ĐỔI, máy quyết ĐÚNG/SAI

Đức: *"bản chất tôi muốn AI hoàn toàn tự chủ động và quyết định, vì tôi không code nên không tham
gia control. Làm thế nào hệ thống ổn định an toàn + tiết kiệm usage để không phải nhắc đi nhắc lại,
hỏi đi hỏi lại tôi là được."*

**An toàn hôm nay KHÔNG đến từ việc Đức duyệt.** Đo ngày 10/09, trên một bản vá ~20 dòng mã:

| Ai bắt lỗi | Số lỗi |
|---|---|
| Cổng kiểm (máy) | 4 |
| Audit độc lập (Codex, 6 vòng) | 11 |
| Chính bản vá làm lộ ra | 3 |
| AI tự thấy | 2 |
| **Đức** | **0 lỗi mã** |

Nhưng Đức bắt **hai thứ máy không thấy**: bảng vạch đích thiếu ô *bộ sinh BẢNG* và *một vòng
sửa → đẩy*, và quyết định **đánh đổi** lớp "artifact còn tươi" để lấy tốc độ. Đó là đường phân
chia đúng: **Đức quyết ĐÁNH ĐỔI, máy quyết ĐÚNG/SAI.** Hỏi Đức một câu đúng/sai là hỏi người
không có dữ liệu — vừa tốn lượt, vừa cho câu trả lời kém hơn máy.

**GIỮ ba việc:** xoá/sửa dữ liệu gốc · gửi ra ngoài · tạo automation tự chạy. Cả ba là quyết định
của **người sở hữu**, không phải câu hỏi kỹ thuật.

**BA VIỆC CŨ KHÔNG ĐƯỢC NỚI — chúng thành ĐIỀU CẤM.** Đây là chỗ dễ đọc sai nhất: rút khỏi danh
sách "phải hỏi" KHÔNG có nghĩa là được phép. Một luật máy luôn có hiệu lực; một câu hỏi thì bỏ qua
được, trả lời sai được, và quên được.
- `--carry` khi cổng chưa xanh toàn bộ → **CẤM**, không còn đường "hỏi rồi làm".
- Giành vùng phiên khác đang giữ → **CẤM**, ba đường hợp lệ vẫn như mục 1.
- Đổi luật an toàn → **AI tự quyết**, đủ ba điều kiện MÁY: audit độc lập sạch · một dòng sổ này
  nói rõ **cái MẤT** · không làm yếu một lớp bảo vệ mà không **gọi tên** thứ mất đi.

**CÁI MẤT, nói thẳng.** Từ nay không còn một con người nào đứng giữa AI và lịch sử repo cho những
việc lùi lại được. Nếu cổng và audit cùng sai thì không ai chặn. Đổi lấy: Đức thôi bị hỏi những
câu Đức không có dữ liệu để trả lời, và chuỗi việc chạy liền không đứt.

**Kèm theo, cùng ngày — LUẬT PHẢI CÓ HOOK.** Đức: *"các luật cũng cần kèm cơ chế hook, chứ không
thì AI vẫn làm sai, vì hệ thống rule của ta hơi dày."* Hai cửa máy dựng ngay lượt này (`T2`):
`commit-msg` chặn mẻ chạm tầng máy mà chưa cắt bản (11 phút → 0,2 giây), và `post-commit` tự trả
khoá file. Cách chữa "rule dày" **không phải viết luật ngắn hơn** mà là: **luật nào không có máy
canh thì XOÁ** — nó vẫn chiếm chỗ đọc của mọi phiên và cho cảm giác an toàn sai.
