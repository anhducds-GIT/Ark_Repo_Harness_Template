# CHANGELOG

> Mỗi bản một khối. **Chỉ thêm, không sửa khối cũ.** Máy đọc file này để dựng mục Nhật ký trên
> bảng, nên giữ đúng định dạng: `## <phiên bản> — <ngày> — <một câu>`.

## 1.3.7 — 2026-09-06 — Bốn quyết định treo được chốt, và cổng thôi tự làm mình đỏ

Đức chốt bốn mục đang chờ trong một lượt. Ba mục thi hành được ngay, mục thứ tư
(gộp hai cơ chế hiệp đồng) thành luật trong quy trình migrate. Chi tiết từng lựa
chọn — kèm rủi ro đã báo trước khi chọn — ở [decisions.md](decisions.md).

### Cổng "sự thật máy sinh còn tươi" thôi đỏ lại sau mỗi phiên

Đây là lỗi đã ăn của nhiều phiên trước, và **sổ nợ mô tả sai nó**.

Sổ nợ nói trang đỏ vì nhúng mã commit HEAD. Đo lại 06/09: hai dòng mã commit **đã
được miễn khỏi phép so từ trước**, nên chúng chỉ làm cây làm việc bẩn. Thứ *thật
sự* làm cổng đỏ là bộ đếm `CÓ (N commit)` — và nó nhảy vì `.agents/claims.json`
mang đuôi `.json` nên bị đếm là **file hành vi**. Mà nhận/trả quyền là việc MỌI
phiên đều phải làm. Nên mọi phiên đều tự làm trang của mình cũ đi.

Bằng chứng: commit `fa7e8a7` chạm **đúng một file** là `claims.json`, bộ đếm nhảy
4 → 5.

`AGENTS.md` mục 1 đã miễn file này khỏi luật khoá vùng vì đúng lý do đó — "nhận/trả
quyền là thao tác hành chính". Bản này chỉ làm phép đo trùng với luật đã viết.

### Trang bỏ hẳn mã commit — và bỏ luôn phần miễn trừ

Đức chọn lối 1 của KHUNG-16. Trang nhúng mã HEAD thì commit chính trang đó làm HEAD
đổi: không thứ tự commit nào hội tụ. Nay trang chỉ ghi ngày.

**Quan trọng hơn bản vá:** miễn trừ cũ được **gỡ hẳn**. Lối "miễn hai dòng khỏi phép
so" là để cổng thôi canh một phần nội dung — đổi một lỗ hổng lấy một lỗ hổng. Bỏ mã
commit rồi thì phép so canh lại được **toàn bộ** dòng. `generated_commit` cũng rời
khỏi `repo-map.json` cùng lý do.

### Mã việc nhận tiền tố có SỐ, và dòng lạ bị nêu tên

`N8N-1` nay đọc được. Nhưng gốc bệnh không phải regex hẹp — là **bỏ qua im lặng**.
Nên mọi dòng `###` không đọc ra mã việc đều bị nêu tên kèm tên sổ. Nới regex chỉ chữa
ca đã vấp; hình dạng lạ lần sau vẫn sẽ mất tăm nếu không có vế thứ hai.

Tiền tố phải **bắt đầu bằng chữ cái**: cho phép số ở đầu thì `### 2026-09 · …` bị đọc
thành mã việc `2026-09`.

### Repo nhẹ đi 572 dòng nạp mỗi phiên, không mất chữ nào — và MỘT VIỆC DỌN BỊ CHÍNH CỔNG CHẶN

| Chỗ | Trước | Sau |
|---|---|---|
| `CHANGELOG.md` | 806 | **241** |
| Tổng tài liệu | 3.681 | **3.109** / 2.200 |

Chữ giữ nguyên từng dòng trong `docs/archive/`, có md5 đối chiếu với bản trong git.

**Và một mâu thuẫn trong chính thước đo, phải vá trước thì lời khuyên của nó mới có
tác dụng:** `can-nang.mjs` bảo dời nhật ký cũ sang `docs/archive/`, trong khi nó quét
đệ quy cả `docs/`. Làm đúng lời khuyên thì dòng bị dời từ chỗ **không** bị đếm sang
chỗ **đang** bị đếm — tổng tài liệu TĂNG, người làm đúng bị phạt. Nay `docs/archive/`
được miễn: ngân sách này đo *thứ mọi phiên phải nạp*, mà lưu trữ theo định nghĩa là
thứ không nạp mỗi lần.

**Còn vượt 799 dòng và bản này KHÔNG dọn tiếp** — lối duy nhất còn lại là gọt
`ORCHESTRATOR.md`, tức xoá nội dung thật, trái luật *dời chỗ chứ không xoá*. Ghi lại
thành vòng hai của KHUNG-11 kèm số đo: gọt hết 276 dòng cũng vẫn vượt, nên 2.200 là
con số đặt theo mong muốn chứ chưa từng đặt theo số đo.

### Hai luật của repo cắn nhau — phát hiện bằng cách thử thật, CHƯA vá

Nhật ký `HANDOFF.md` 1.273 dòng / ngân sách 600. Sổ tay bảo trì bảo **phải dời** phần
cũ sang lưu trữ. Cổng đóng phiên đòi file đó **xoá đúng 0 dòng**. Làm đúng luật thứ
nhất thì **vĩnh viễn không đóng được phiên**.

Đã thử thật trong lượt này: cắt 1.273 → 455, cổng ĐỎ; thêm một commit **chỉ-thêm** cũng
không cứu được, vì phép đo cộng dồn cả dải chưa đẩy chứ không chỉ commit cuối.

**Bản này hoàn nguyên việc dọn, KHÔNG sửa cổng.** Sửa cổng là đổi luật an toàn, mà
`AGENTS.md` mục 2 hàng 6 bắt hỏi người chốt. Ghi thành KHUNG-25 kèm bản vá đã thiết kế sẵn.

Lần thứ tư cùng một hình dạng: **luật trỏ tới một thứ không hoạt động như luật tưởng**.


### Repo đích đã có cơ chế hiệp đồng riêng — bộ khung là chuẩn

Luật mới trong [quy trình migrate](docs/protocols/CHUYEN-REPO-LEN-CHUAN.md). Hai repo
đã chạm đều rơi vào ca này. Lý do phải chốt một cái thắng: hai hệ song song thì một AI
có thể hợp lệ theo hệ này mà vi phạm hệ kia, và không ai sai cả.

Kèm một ranh giới viết rõ trong luật: **khai tử luật cũ ≠ xoá văn bản cũ**. Một luật
hết hiệu lực vẫn là bằng chứng vì sao repo từng chạy như thế.

### Phép kiểm mới

`F15` · `F16` trong [tests/core-contract.mjs](tests/core-contract.mjs). Cả hai đã qua
đột biến kiểm: phá đúng một chỗ, đòi đúng phép kiểm ấy đỏ, rồi ghi lại byte gốc. Ba vế
đối chứng cố ý có mặt — miễn `claims.json` không được kéo theo `package.json`; mục đã
gạch ngang không được kêu oan; tiền tố bắt đầu bằng số không được nhận.

## 1.3.6 — 2026-09-05 — Bảng có tab "Đã xong", và migrate có BƯỚC 0: audit trước khi thả file nào

**Tab "Đã xong" trên bảng HTML.** Bảng vốn chỉ chiếu thứ ĐANG mở — việc còn lại, nợ còn treo, chỗ
chờ người chốt. Người chốt nhìn mãi một danh sách việc chưa xong thì không thấy repo đang tiến,
chỉ thấy nó đang nợ. Việc đã đóng **vốn nằm sẵn trong sổ nợ**, chỉ là không ai chiếu ra.
Đọc đúng dấu của sổ (**mã bị gạch**), cùng dấu mà `what-next.mjs` đọc — hai chỗ đọc một dấu thì
không trôi khỏi nhau. Ghim kèm vế đối chứng: việc **còn mở** không được lọt, và một câu văn xuôi
nói "đã xong" cũng **không** được tính.

**BƯỚC 0 của quy trình migrate: audit độc lập TRƯỚC khi thả file nào.** Bước này đứng trước cả
bước đo, và nó ra đời từ một con số: trial trên `ALL_SKILL_MANAGEMENT` cho thấy repo đích đang
giữ **1824 dòng nội dung riêng** trong bốn file **trùng tên** với thứ bộ khung sắp thả vào —
`AGENTS.md` (26 luật riêng) · `DASHBOARD.md` (viết tay, có mirror sang Google Sheet) ·
`decisions.md` · `handoff.md` (**1225 dòng**).

**Luật cứng: bốn file đó KHÔNG ĐƯỢC ĐÈ.** Repo đích có sẵn thì THÊM VÀO, không thay thế. Và đo
bằng **số dòng trước/sau**, không chỉ kiểm "file còn tồn tại" — một file bị ghi đè vẫn còn tồn
tại, chỉ là rỗng ruột.

**Audit giao cho AI khác, chạy trên bản clone trong thư mục tạm** — tác nhân ngoài không có lý do
gì được quyền ghi vào repo đang sống. Brief hỏi sáu câu; câu đắt nhất là câu 6: *file nào trùng
tên, và trùng thì mất gì*.

**Và luật vàng số 4 áp cho cả audit của AI khác.** Trial 05/09: Codex báo ba lệnh thoát mã
`2/1/1` ở repo `n8n-orchestrator` — đo lại thì **cả ba exit 0**. Tin thẳng thì đã đi sửa ba thứ
không hỏng. Mỗi phát hiện phải tự chạy lại trước khi đưa vào kế hoạch.

`1.3.5` → `1.3.6`.

## 1.3.5 — 2026-09-05 — Bịt CỬA HẬU do chính bản 1.3.3 mở ra

**Bản 1.3.3 cho repo khai `docs.file_map` — cần thiết, và nó mở một cửa hậu.** Đường đọc bản đồ
vốn có dòng `if (!existsSync(...)) continue`: an toàn khi nơi đặt bản đồ còn đóng cứng
`AGENTS.md` (package con không có `AGENTS.md` là chuyện thường), thành **cửa hậu ngay khi nơi
đó khai được**.

**Đo thật:** khai `file_map` trỏ tới một file không tồn tại, thêm một file mới chưa khai ở đâu
cả → cổng báo **XANH**, *"Mọi thứ mới đều đã khai"*. **Một dòng cấu hình vô hiệu hoá cả một
cổng**, không cảnh báo gì. Đúng loại lỗ mà luật vàng số 3 cấm.
Chi tiết đáng ghi: file **rỗng** thì cổng ĐỎ đúng — chỉ file **không tồn tại** mới lọt. Hai
đường đi khác nhau cho hai ca trông giống nhau.

Nay tách hai ca: repo **không** khai thì giữ nguyên hành vi cũ (không làm đỏ hàng loạt repo đang
chạy); repo **có** khai mà file không có thì **ĐỎ**, và nói thẳng đó là *khai sai*, không phải
*thiếu bản đồ* — hai thứ có hai cách sửa khác hẳn.
**Ghim ở `tests/cong-do-that.mjs` khối 8**, nơi dựng kho git thật, kèm vế đối chứng.

**Ba chỗ nữa do audit độc lập Codex chỉ ra, đã kiểm chứng lại từng cái:**
- **`budget` sai kiểu lùi về mặc định IM LẶNG.** `"budget": "rất lớn"` hay `"budget": 5` đều
  lặng lẽ thành "không khai", và người viết tưởng ngân sách riêng đang có hiệu lực — trong khi
  `CHANGELOG` 1.3.4 khẳng định nó bị từ chối. Nay từ chối thật.
- **Ngân sách không có TRẦN.** `1e300` hợp lệ, nên mọi chỉ số đều nằm dưới ngân sách và thước đo
  im lặng mất tác dụng. Nay trần = 100 lần mặc định: đủ rộng cho repo lớn thật, đủ hẹp để chặn
  một con số vô nghĩa.
- **`F13` tự khai quá phạm vi.** Tên khối nói "ba lỗi" trong khi thân chỉ kiểm hai. Một phép kiểm
  tự khai quá phạm vi là một lỗi riêng: người sau đọc tên rồi tin rằng vế thứ ba đã có ai canh.
  Đổi tên cho khớp bằng chứng, và ghi rõ vế thứ ba nằm ở đâu.

**Điều đáng nói nhất về lượt này:** cửa hậu do **tôi** mở ở 1.3.3 khi vá một lỗi thật. Nó không
lộ ra qua `npm test` — 149 phép đều xanh — mà lộ ra khi **đi dựng lại đúng ca hỏng**. Tối ưu và
vá lỗi đều là lúc lớp bảo vệ dễ mất nhất, và cách duy nhất bắt được là tự tay dựng ca hỏng chứ
không đọc lại diff.

`1.3.4` → `1.3.5`.

## 1.3.4 — 2026-09-05 — Repo migrate nay được dọn theo, không chỉ được chuẩn theo

Bộ khung vốn phát ra **luật** và **cổng kiểm**, nhưng không phát ra **nhịp dọn**. Repo dựng từ
khuôn nhận đủ thứ để làm ĐÚNG, không nhận gì để giữ RẺ — và mỗi repo tự phình theo cách riêng
cho tới lúc người chốt phát hiện ra thì đã muộn.

**Hai thứ nay đi theo bản trích:** `scripts/can-nang.mjs` (thước đo) và `docs/BAO-TRI-DINH-KY.md`
(sổ tay). Thiếu một trong hai thì "dọn dẹp đều đặn" là lời khuyên, không phải nhịp.

**Hai số đo mới, và chúng đo đúng thứ tốn tiền:**
- **`Nhật ký bàn giao`** — `HANDOFF.md`. Phình nhanh nhất cả repo và **chưa từng có nhịp dọn**.
  Đo ở repo nhà: **1237/600 dòng**.
- **`Mục nợ ĐÃ ĐÓNG còn nằm trong sổ`** — sổ nợ là thứ vai điều phối đọc **mỗi lượt**; nửa sổ là
  việc đã xong thì mỗi lượt trả tiền cho phần không còn dùng.

Vì sao hai số này chứ không phải kích thước repo: chúng đo thứ **mọi phiên phải nạp, ở mọi repo**,
nên tiết kiệm ở đây nhân lên theo **(số repo × số phiên)**. Tài liệu tra cứu chỉ đọc khi cần —
cắt 300 dòng ở đó rẻ hơn cắt 30 dòng ở `AGENTS.md`.

**Luật DỜI CHỖ, không phải XOÁ.** *"Chỉ thêm dòng, không sửa dòng cũ"* cấm **viết lại lịch sử**,
không cấm **cất gọn** nó. Ba điều kiện, thiếu một là thành xoá lịch sử: giữ nguyên chữ (không
tóm tắt — tóm tắt là diễn giải, và diễn giải của người dọn thay thế lời người viết) · để lại một
dòng trỏ sang kho lưu · khai kho lưu vào Bản đồ file.

**Ngân sách nay khai được** ở `budget` trong `.repo-structure.json` — repo khác có kích thước
khác, ép chúng theo số của một bộ khung 3000 dòng là bắt chúng im lặng chịu đỏ. Gõ sai tên mục
ngân sách thì **bị từ chối kèm danh sách hợp lệ**, không im lặng bỏ qua: một ngân sách gõ sai tên
là một lớp bảo vệ biến mất mà không ai biết — đúng ca đã xảy ra thật ở repo này 03/09.

**Đột biến kiểm, ba ca, cả ba đỏ đúng chỗ:** bỏ thước khỏi bản trích · bỏ sổ tay khỏi bản trích ·
bỏ hàng kiểm gõ sai tên ngân sách. `1.3.3` → `1.3.4`, bản trích **32 file**.

## 1.3.3 — 2026-09-05 — Ba lỗi mà bảy phiên ở repo nhà không tìm ra, một lượt migrate thật lôi ra hết

Bản này không sửa gì do đọc lại code mà thấy. **Cả ba lỗi đều do lắp bộ khung vào một repo thật
khác nghề** — `n8n-orchestrator`, Control Plane bằng Python + YAML. Repo nhà không dính lỗi nào
trong ba, và đó chính là lý do chúng sống sót qua bảy phiên.

**(A) `units.behaviour_globs` bị validator TỪ CHỐI, trong khi chú thích trong code dạy đúng trường
đó.** Khai vào là lệnh nổ: `CAU_TRUC_HONG: units.behaviour_globs — không phải trường hợp lệ`.
Nhưng `build-dashboard.mjs` viết nguyên văn *"repo tự khai `units.behaviour_globs`"*. Chú thích
dạy một trường, bộ kiểm cấm trường ấy, không ai đối chiếu hai chỗ.
Đo tiếp thì lỗi còn sâu hơn: lớp đó **chưa từng được truyền vào luồng thật** — bộ đếm gọi
`isBehaviourFile` không kèm tham số nào. Tức repo Python bị đo là *"code không đổi"* dù
`tools/*.py` sửa cả ngày, và **không ai biết cột đó đang mù**.
Nay trường hợp lệ, có hàm đọc riêng (`behaviourGlobsFrom`), và **đã nối vào luồng**.

**(B) `claim.mjs` NỔ khi bảng quyền có mục `null`.** Viết `{"_root": null}` — cách viết tự nhiên
cho *"chưa ai giữ"* — làm `--list` ném `TypeError: Cannot read properties of null (reading
'owner')`, rơi stack trace vào mặt người dùng. Nay nói rõ mã lỗi `CLAIMS_MUC_HONG` **kèm khuôn
đúng để sửa**. Không nhận `null` là "trống", cố ý: hai cách biểu diễn cùng một trạng thái làm
phép đối chiếu bảng-trên-máy ↔ bảng-trên-remote có hai kết quả cho cùng một sự thật.

**(C) Cổng đóng cứng vị trí "Bản đồ file" ở `AGENTS.md`.** Repo đích để bản đồ ở
`design_brief.md` mục 8 — hợp lệ theo luật của chính nó, và luật đó **có trước** bộ khung. Cổng
đỏ cho tới khi phải thêm một mục thứ hai vào `AGENTS.md`, nên repo đó nay có **hai** bản đồ ở hai
file: hai nguồn cho một khái niệm, đúng bệnh mà cả bộ khung sinh ra để chữa — và lần này **bộ
khung là thủ phạm**. Nay repo khai `docs.file_map` trong `.repo-structure.json`; không khai thì
vẫn là `AGENTS.md`, repo cũ không phải đổi gì.

**Đột biến kiểm — và một ca KHÔNG đỏ, ghi lại thay vì giấu.** Ba đột biến: bỏ `behaviour_globs`
khỏi danh sách trường hợp lệ → đỏ · bỏ hàng kiểm mục bảng quyền → đỏ · **gỡ dòng truyền opts
trong `collectModel` → VẪN XANH**. Ca thứ ba lộ ra rằng phép ghim mới chỉ canh được *hàm dựng
opts*, không canh được *bộ sinh có gọi hàm đó không* — đúng hình dạng lỗi vừa vá. Đã ghi thành
mục nợ riêng và **nói thẳng giới hạn ngay trong chú thích của phép kiểm**, để người sau không
tưởng nó đã phủ.

`1.3.2` → `1.3.3`. Bốn mục nợ đóng: lớp nghề chưa nối · cổng đóng cứng bản đồ · trường bị từ
chối · bảng quyền nổ vì `null`.

## 1.3.2 — 2026-09-05 — Bảng việc thôi nói "không có gì phải quyết" khi thực ra có

**Ca hỏng đo được:** `npm run what-next` in ra `C · ĐANG CHỜ NGƯỜI CHỐT — 0 mục, không ai làm
thay được`, trong khi sổ nợ đang có **hai** mục cần người chốt. Người chốt đọc bảng rồi tin mình
không phải quyết gì.

**Nguyên nhân:** mục C chỉ đọc **sổ ý tưởng** (`IDEAS.md`). Repo không có sổ đó thì mục C luôn
rỗng. Nặng hơn một mục hiển thị thiếu, vì dòng in ra **khẳng định đã kiểm và không có gì** — mà
chính công cụ này ở chỗ khác phân biệt rất kỹ giữa *"0 vì đã kiểm"* và *"KHÔNG LỌC ĐƯỢC"*.

**Vá hai vế:**
- Mục C nay đọc **cả sổ nợ**, và khi một nguồn không lọc được thì **không in con số tổng** — con
  số tổng hàm ý "đã kiểm hết", ở đó mới kiểm được một nửa. In số kèm cảnh báo vẫn khiến người
  đọc nhớ con số.
- Nhận diện bằng **cờ khai tường minh** `> **CHỜ NGƯỜI CHỐT:** …` trong thân mục, **không dò tên
  người chốt trong văn xuôi** như bản cũ. Dò chữ là phép đo bằng chuỗi: đổi cách xưng hô một chữ
  là mục biến mất khỏi bảng, và không ai biết.

**Đột biến kiểm — hai chiều, cả hai đỏ đúng chỗ:** bỏ hàng dò cờ → mục khai tường minh không còn
được nhận; nới cờ thành dò văn xuôi → mục chỉ có văn xuôi bị nhận nhầm. Vế đối chứng là phần
khiến phép ghim này không thể xanh giả.

**Bản trích cũng nhận:** hạt giống sổ nợ nay **dạy luôn quy ước cờ**, nên repo dựng từ khuôn
không phải phát minh lại. `1.3.1` → `1.3.2`, dấu vân tay `f2344159c4e3c28e`.

## 1.3.1 — 2026-09-05 — Bộ đếm "code đã đổi" thôi đếm sản phẩm của chính bộ sinh

Cổng đóng phiên có **một mục đỏ vĩnh viễn**: *"Sự thật máy sinh còn tươi"*. Không thứ tự commit
nào hội tụ được, và nó đã đỏ suốt nhiều phiên trước khi ai đó đuổi tới gốc.

**Nguyên nhân, đúng một cái.** Bộ đếm *"code đã đổi sau lần kiểm chứng"* miễn trừ ba file máy
sinh bằng một danh sách cứng trong code: `llms.txt`, `repo-map.json`, `DASHBOARD.md`. Repo nhà
sinh thêm **hai trang HTML** — chúng mang đuôi `.html` nên lọt vào danh sách đuôi file hành vi và
**bị đếm là code đã đổi**. Nên mỗi commit sinh lại artifact tự cộng thêm một vào chính con số mà
artifact vừa sinh phải khớp: artifact vừa commit xong là lập tức cũ.

Đây đúng vòng lặp mà chú thích ngay trên khối đó mô tả và tin là đã chặn — chặn cho ba file, sót
hai file thêm vào sau. Bản vá cũ chữa **triệu chứng ở ba file cụ thể**; bản này chữa **hình dạng
lỗi**.

**Khai ở cấu hình, không đóng cứng trong code.** Khối mới `generated_files` trong
`.repo-structure.json`: `generators` trả lời *"chạy lệnh nào để sinh lại"*, khối này trả lời
*"lệnh đó đẻ ra file nào"*. Khác nhau một chữ, và chính chỗ khác đó là cái bẫy. Đóng cứng tên hai
trang kia vào code là không được: tên chúng mang tên dự án, mà bộ đếm đi theo bản trích sang mọi
repo — làm thế là phát tên repo gốc đi khắp nơi, và lặp lại đúng bệnh *"đo được đúng một nghề"*
mà lớp `behaviour_globs` sinh ra để chữa.

**Một chẩn đoán sai bị bác, ghi lại vì bài học đáng hơn bản vá.** Phiên đuổi lỗi này ban đầu kết
luận có **hai** bug xếp chồng, cái thứ hai là *"bộ sinh và bộ kiểm bất đồng đúng một đơn vị —
sinh ra 11, cổng đòi 12"*. Audit độc lập bác, và đo lại xác nhận: `11` là con số nằm trong **file
đã commit**, `12` là con số **sinh lại tại HEAD**. Một bộ đếm, hai thời điểm.
*"Hai con số khác nhau"* chưa phải *"hai bộ đếm khác nhau"* — phải hỏi hai con số ấy đọc từ đâu
trước khi kết luận.

**Phép ghim cũng vá, vì nó xanh suốt trong khi ca hỏng nằm ngay trong repo.** Khối kiểm cũ thử
đúng ba file cứng — không thử hai file đang gây lỗi. Nay thêm ca cho file repo tự khai, **kèm vế
thứ hai**: file **chưa** khai thì vẫn phải bị đếm. Thiếu vế đó thì một bản vá biến mọi `.html`
thành không-đếm cũng qua được phép kiểm.
**Đột biến kiểm:** bỏ đúng dòng vừa thêm khỏi bộ đếm → suite **đỏ đúng chỗ**
(`DASHBOARD-Ten-Repo.html da khai la may sinh, khong duoc dem`), hoàn nguyên → xanh lại.

**Tầng máy đổi nên bản phát tăng:** `1.3.0` → `1.3.1`, dấu vân tay `5b2b74c0eee8e3b6` đã ghi vào
sổ phát hành. Repo đang ghim bản khung nhận bản vá bằng `npm run upgrade`, không chép tay.

## 1.3.0 — 2026-09-05 — Repo mới nhận luôn hai lệnh của vai điều phối, kèm sổ tay và phép ghim

Trước bản này, một repo vừa dựng từ bộ khung nhận được bộ máy chống hai AI giẫm chân nhau, nhưng
**không nhận được gì để trả lời hai câu hỏi mà người chốt hỏi mỗi ngày**: *đang có gì* và *làm gì
tiếp*. Ai muốn có thì phải tự viết lại — tức mỗi repo một bản, và các bản trôi khỏi nhau.

Bản này đóng gói bốn thứ đi cùng nhau, cố ý không tách:

- **Lệnh kiểm trạng thái trước khi báo cáo.** Nó hỏi *"điều tôi sắp nói có đúng với nguồn thẩm
  quyền không"*, khác hẳn cổng đóng phiên vốn hỏi *"việc tôi làm đẩy được chưa"*. Ba câu trả lời,
  cố ý không gộp: khớp · lệch · **không biết**. Không đọc được thì nói không biết — gộp nó vào
  "khớp" là biến mất mạng thành tin tốt.
- **Lệnh bản đồ việc.** Giao ba nguồn vốn không giao được với nhau: ai đang giữ vùng nào · từng
  đơn vị còn nợ gì · sổ ý tưởng. Nó cưỡng chế đúng một câu về làm song song: hai việc chạy cùng
  lúc được **khi và chỉ khi** thuộc hai vùng khác nhau và cả hai đang trống chủ.
- **Sổ tay vai điều phối.** Công cụ mà không kèm hàng rào thì hàng rào là thứ đầu tiên mất: sổ
  này ghi rõ vai điều phối **không** viết mã, **không** gỡ lỗi, **không** kê bản vá.
- **Phép ghim của cả gói** — 52 phép. Khối cuối tự dựng một repo thật có hình dạng **khác hẳn**
  repo phát hành (tên vùng khác · không có đơn vị con · thiếu cả ba quyển sổ · không có nơi đối
  chiếu từ xa) rồi chạy thật trong đó. Chạy được ở repo giống nhà thì mới là chép, chưa phải mang
  đi được.

**Hai lệnh này CHỈ ĐỌC.** Chúng không nhận vùng, không sửa file, không tự chữa. Thấy lệch thì báo
và in ra câu lệnh cho người chạy — tuyệt đối không tự đẩy, không tự đóng dấu lại bảng quyền,
không tự sinh lại rồi commit. Điều đó được ghim bằng **cấu trúc**, không bằng lời hứa: mọi lệnh
chạm kho mã đi qua đúng một cửa chỉ-đọc, và cả file chỉ được phép sinh đúng một tiến trình con.

Hai chỗ phải đổi vì cổng bắt, ghi ra để đừng ai "dọn cho gọn" rồi làm bản sau không phát được:
bộ trích từ chối mọi file mang tên dự án gốc, nên một danh sách cấm trong phép ghim nay **ghép
tên từ mảnh** thay vì viết liền, và sổ tay thôi kể thẳng ba tên gói cũ.

Repo dựng từ bản này chạy được cả hai lệnh **ngay, không sửa gì**, và bộ kiểm của nó xanh từ
ngày đầu.

---

**Bản 1.2.20 trở về trước đã dời sang** [docs/archive/CHANGELOG-0.1.0-1.2.20.md](docs/archive/CHANGELOG-0.1.0-1.2.20.md) — chữ giữ nguyên từng dòng.
