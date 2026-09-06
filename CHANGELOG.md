# CHANGELOG

> Mỗi bản một khối. **Chỉ thêm, không sửa khối cũ.** Máy đọc file này để dựng mục Nhật ký trên
> bảng, nên giữ đúng định dạng: `## <phiên bản> — <ngày> — <một câu>`.

## 1.3.9 — 2026-09-06 — Nhịp dọn chạy thật lần đầu, và nó lôi ra hai lỗ của chính nó

Bản 1.3.8 dựng `npm run don` với bốn vế test. Chạy nó trên **dữ liệu thật** cùng ngày
thì lộ hai lỗ mà **không vế nào trong bốn vế bắt được** — vì cả hai chỉ xuất hiện khi
gặp dữ liệu thật.

### Tên file lưu trữ vô nghĩa

Cách đặt tên lọc mọi ký tự không phải số rồi cắt 6 chữ số đầu của tiêu đề. Trên
`## Lượt · Đẩy hộ 12 commit của bốn lane` nó ra **`HANDOFF-12.md`**.

Một file lưu trữ tên vô nghĩa là một file **không ai mở** — chữ vẫn còn trong repo mà
coi như đã mất. Luật vàng 5 áp cả cho tên file.

Nay quét **mọi** khối bị dời tìm `YYYY-MM`; không khối nào có ngày thì lấy tháng CẤT.

### Ghi đè im lặng — lỗ nguy hiểm nhất của cả lệnh

Hai lượt dọn trong cùng một tháng cho ra cùng một nhãn, nên bản trước **đè mất file
lưu trữ của lượt trước**. Tức chính lệnh dọn làm mất đúng thứ nó sinh ra để giữ, và
**không báo gì**.

Nay trùng tên thì thêm hậu tố `-2`, `-3`… — tuyệt đối không đè.

### Chạy thật: hai bản vá của hôm nay lần đầu chạy cùng nhau

`HANDOFF.md` **654 → 509** · `CHANGELOG.md` **326 → 263**, không mất byte nào. Lệnh dọn
xoá dòng khỏi nhật ký, cổng KHUNG-25 đối chiếu byte với kho lưu trữ và cho qua — đây là
lần đầu vòng đó khép kín trên repo thật.

Nhật ký phình lại từ 415 lên 654 **trong đúng một ngày**. Đó là lý do Đức đòi một *nhịp*
chứ không phải một *lượt*.


## 1.3.8 — 2026-09-06 — Repo có NHỊP DỌN, và cổng thôi cấm chính việc nó bảo phải làm

Hai luật của repo cắn nhau — sổ tay bảo trì bắt **dời** nhật ký cũ đi, cổng đóng phiên
**cấm** `HANDOFF.md` xoá dòng nào. Bản 1.3.7 phát hiện, hoàn nguyên và ghi nợ. Bản này
Đức chốt cả hai vế: vá cổng, và dựng cơ chế dọn.

### Cổng KIỂM CHỨNG luật "dời chỗ chứ không xoá", thay vì cấm cả hai

Cổng nay cho `HANDOFF.md` xoá dòng **khi và chỉ khi** từng dòng bị xoá có bản khớp **BYTE**
trong `*/archive/*`. Đây là **siết**, không phải nới: trước đây cổng *giả định* việc dời chỗ
không xảy ra được; nay nó *kiểm chứng*. Xoá mà không có bản lưu trữ khớp thì vẫn ĐỎ.

Kèm theo, phần miễn trừ tự nó biến mất: cổng nay so **toàn bộ** dòng thay vì bỏ qua hai dòng.

Ghim ở [tests/cong-do-that.mjs](tests/cong-do-that.mjs) khối 9, **năm vế** — thiếu vế nào thì
bản vá là đồ trang trí:

| Vế | Đòi |
|---|---|
| Xoá, không có kho lưu trữ | **ĐỎ** |
| Xoá, có kho nhưng **lệch một ký tự** | **ĐỎ** ← vế quan trọng nhất |
| Xoá, kho khớp byte | XANH, và nói rõ "đã DỜI" |
| Sửa một dòng CŨ tại chỗ | **ĐỎ** — luật gốc còn nguyên răng |
| Không thêm dòng nào | **ĐỎ**, với lý do KHÁC hẳn |

Vế 2 là toàn bộ giá trị của bản vá: nó phân biệt *"có một file trong archive"* với *"nội dung
thật sự còn nguyên"*. Không có nó thì ai cũng qua cổng bằng cách tạo một file rỗng.

### `npm run don` — dọn là một NHỊP, không phải một lượt

Đức chốt: *"nội dung sẽ luôn bị phình sau 1 quá trình"*. Nên [scripts/don.mjs](scripts/don.mjs)
là một lệnh, không phải một lần dọn tay.

```bash
npm run don                # xem trước, KHÔNG ghi gì
npm run don -- --apply     # ghi thật
```

Nó dời khối cũ của `HANDOFF.md` và `CHANGELOG.md` sang `docs/archive/`, **tự đối chiếu byte
trước khi ghi** — lệch một byte thì dừng, không chạm file nào. **Đi theo bản trích**, nên repo
migrate cũng dọn được.

Kết quả ở repo nhà: `HANDOFF.md` **1.311 → 598** · `CHANGELOG.md` **335 → 262**, không mất byte.

### Ba lỗi thật lúc dựng lệnh, cả ba nay là phép kiểm

1. **Sai chiều.** `CHANGELOG.md` xếp mới-nhất-ở-trên, `HANDOFF.md` xếp ngược. Bản đầu chỉ biết
   một chiều nên nó định cất đi **bản vừa phát** và giữ lại bản cũ nhất. Lệnh vẫn chạy, vẫn báo
   thành công, không gì đỏ — loại lỗi tệ nhất.
2. **Không có điểm dừng.** Lượt đầu để lại vài dòng của chính nó nên file vẫn nhỉnh trên ngân
   sách; lượt sau lại cắt thêm một khối. Đo thật: hai lượt liên tiếp cất đi hai bản phát khác nhau.
3. **Dấu chân bị cuốn vào kho.** Dòng trỏ sang kho lưu trữ của lượt trước bị coi là nội dung
   thật, nên sau n lượt người đọc phải lần theo n file. Nay dòng đó trỏ vào **thư mục** chứ
   không vào một file, nên nó ổn định và lượt sau nhận ra được.

### Một vòng lặp bị BỎ vì đột biến kiểm chứng minh nó là code chết

Bản đầu ước lượng số dòng lệnh tự thêm, rồi bọc một vòng lặp để hứng phần ước lượng sai. Phá
vòng lặp đó đi thì **không phép kiểm nào đỏ** — nó chưa từng chạy tới. Đã bỏ, và lấy đúng độ
dài thật của phần đuôi: sai số bằng không **theo cấu trúc**, chứ không bằng một lớp hứng đặt thêm.

Một nhánh không thể chạy tới và một nhánh đúng trông giống hệt nhau trên bảng.


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


---

**Phần CŨ hơn đã dời sang kho lưu trữ** — [`docs/archive/`](docs/archive/) · chữ giữ nguyên từng dòng, cắt bằng `npm run don`.
