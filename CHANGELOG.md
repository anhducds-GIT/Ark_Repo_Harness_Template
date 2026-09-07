# CHANGELOG

> Mỗi bản một khối. **Chỉ thêm, không sửa khối cũ.** Máy đọc file này để dựng mục Nhật ký trên
> bảng, nên giữ đúng định dạng: `## <phiên bản> — <ngày> — <một câu>`.

## 1.3.37 — 2026-09-07 — Bảng: 10 tab → BỐN nhóm, Tổng quan còn ba câu, và nhật ký thôi sinh ra việc

Audit UX 07/09 nói bảng **fragment** và **tự mâu thuẫn**. Cả hai đều đo được, và cả hai đều có
đúng một nguyên nhân: **cùng một khái niệm được vẽ ở nhiều chỗ.**

### Bằng chứng — đếm trên bản ĐÃ COMMIT, không đọc cảm giác

| Khái niệm | Số lần vẽ ĐẦY ĐỦ |
|---|---|
| **Bản đồ file** | **3** |
| Cần Đức · Sức khoẻ · Ý tưởng · Giao việc · Làm mới bảng | **2** mỗi thứ |

Không lần nào là tóm tắt — đều là bản vẽ đầy đủ. Hậu quả không phải là *dài*; hậu quả là **bảng
nói hai con số khác nhau cho cùng một câu hỏi**.

### Mâu thuẫn "4 vs 13" — hai gốc khác nhau, không phải một lỗi

```
Tổng quan     →  "CÓ — bốn mục đang mang dấu chờ …"
AI điều phối  →  "Cần Đức — 13 việc · 9 bấm · 4 chốt"
```

**⑴ Con 13: `HANDOFF.md` bị quét tìm dấu việc.** Đo từng nguồn: `BACKLOG.md` **5** (thật) ·
`IDEAS.md` 0 · `STATUS.md` 0 · **`HANDOFF.md` 8 (ảo)**.

`HANDOFF.md` là nhật ký **chỉ thêm dòng**. Nên mỗi lần một phiên *kể lại* rằng có việc chờ Đức thì
lần kể đó thành **một việc mới, vĩnh viễn** — con số chỉ có một chiều là tăng, và nó tăng theo
**số phiên**, không theo số việc thật. Ba trong tám dấu ảo còn tệ hơn: một dấu nằm trong câu
**giải thích chính quy ước dấu**, tức bảng biến **sách hướng dẫn của nó** thành việc phải làm.

**⑵ Con 4: một câu GÕ TAY trong `STATUS.md`.** Nguồn sự thật thứ hai cho một con số máy đếm được
— và nó đã lệch: câu đó nêu bốn mã, **hai trong bốn đã đóng**. Cùng trường ấy còn ghi *"Bản 1.3.14
· bảng nay có chín tab"* trong khi repo ở **1.3.36 với 10 tab**, và câu đó chảy tiếp vào
`DASHBOARD.md` + `repo-map.json` — **một câu cũ gõ tay làm ba artifact máy sinh nói sai cùng lúc.**

### Sửa: hai luật, cưỡng chế bằng máy

**Luật lịch-sử-không-thành-việc.** Nguồn quét dấu chờ khai thành hằng số `SO_CON_SONG` —
`BACKLOG.md` · `IDEAS.md` · `STATUS.md`. Nhật ký bị loại. **13 → 5.**

**Luật một-chỗ.** Mỗi khái niệm vẽ đầy đủ ở **đúng một** nhóm; chỗ khác chỉ một câu tóm tắt kèm
liên kết. Đã kiểm: 8/8 khái niệm nay vẽ đúng 1 lần.

**Bỏ bản đếm gõ tay** ở `STATUS.md` → `human_action`. Máy đếm được thì máy đếm.

### IA: 10 tab ngang hàng → BỐN nhóm có thứ bậc

| Nhóm | Trả lời câu gì |
|---|---|
| **Tổng quan** | *"repo đang thế nào"* — **đúng BA CÂU**, không gì khác |
| **Công việc** | *"tôi phải làm gì"* — mọi thứ HÀNH ĐỘNG được |
| **Hệ thống** | *"cái này chạy thế nào"* — đọc một lần là hiểu |
| **Lịch sử** | *"chuyện gì đã xảy ra"* — KHÔNG hành động được nữa |

Ranh **Lịch sử** quan trọng hơn nó trông: thứ nằm trong đó **không được sinh ra việc**. Đó chính
là luật thứ nhất, phát biểu thành cấu trúc.

Số đo, màn 1440×900: Tổng quan **0,4 màn hình** · tổng bốn nhóm **14,9** (trước: 10 tab ~30).

### Xoá là thắng — bốn hàm chết theo

`khoiNowNext` · `khoiSucKhoe` · `khoiYTuongGon` · `mucLuc`, cộng 7 dòng CSS chỉ phục vụ `mucLuc`,
cộng đoạn JS bắt liên kết mục lục, cộng hai hàm `sach()`/`gon()` chỉ tồn tại để **cắt câu cho bản
đồ file bản kém**. Bộ sinh: **−49 dòng thực** (195 thêm / 244 xoá).

### Một bug cùng họ, lộ ra lúc đo

`behaviourOptsFrom` đếm *"code đã đổi sau kiểm chứng"* và nó thấy trang HTML máy sinh là một file
`.html` bình thường. Ở `nav_platform_main`: mỗi lượt sinh lại trang là bộ đếm **+1**, nên cổng
*"Sự thật máy sinh còn tươi"* **ĐỎ vĩnh viễn** — sinh lại không thoát được, vì chính việc sinh lại
làm nó tăng.

Đây **đúng con bệnh đã ghi ngay trên `MAY_SINH`** cho `repo-map.json`, lặp lại lần thứ hai với một
file mới. Lần trước vá bằng cách **thêm một tên** vào danh sách; lần này vá bằng cách **bỏ danh
sách**: `tenTrangFrom` dời sang `repo-structure.mjs` — suy một lần, hai cổng dùng chung, không repo
nào phải nhớ khai gì.

### Phép kiểm

`overview-doc-smoke` 12 → **15 vế**. **Tám đột biến đã chạy, cả tám chết — và cả tám chết ở ĐÚNG
vế nó đo**, mỗi con một phép khác nhau. Lượt trước (1.3.36) đã dạy vì sao phải kiểm chỗ này: bốn
đột biến "chết" mà chết vì cổng khác nổ trước, chứng minh không gì cả.

`ADR-0006` ghi cả phần **MẤT**: bấm nhiều hơn · dấu chờ trong nhật ký thành vô hình (cố ý, nhưng
là bẫy im lặng) · con số bốn nhóm chưa được đo bằng tần suất dùng · và luật một-chỗ hiện chỉ đếm
**tiêu đề** khối, nên đổi tên là lách được.

### Và đây là lượt CẮT — số đo của cả bộ khung, để lượt sau có mốc

| Đo gì | Hôm nay |
|---|---|
| commit 7 ngày **chỉ chạm giấy tờ** | **194/280 = 69%** |
| luật-là-chữ | **1.254 dòng** |
| chốt máy cưỡng chế được | **26** · 16 file test |
| tài liệu | **8.672 dòng** — trần khai 2.200, **vượt 3,9×** |
| sổ nợ đang mở | **15** / 39 |

**48 dòng văn thuyết phục cho mỗi cơ chế thật.** Việc cắt tiếp ghi ở `BACKLOG.md`
`KHUNG-40`…`KHUNG-43`, kèm hai chỗ **cần Đức chốt** (trần dòng luật, và có đưa trần vào cổng đóng
phiên hay không).

### MỎ NEO KHỚP 0 CHỖ — và vì sao con số 0 không bao giờ là "không có gì phải sửa"

Phép ghim mới đếm số câu bằng cách tìm chuỗi `<div class="bc">`. Rồi cùng ngày tôi thêm hai
thuộc tính máy đọc vào đúng thẻ đó, thẻ mở thành `<div class="bc" data-cau="…"`, và **mỏ neo khớp
0 chỗ**. Phép kiểm báo *"Tổng quan phải đúng BA câu, đang 0"* trong khi trang có đủ ba.

Con số 0 ở đây **không** nghĩa là "trang hỏng". Nó nghĩa là **dụng cụ đo hỏng** — và hai ca đó
đọc y hệt nhau trên màn hình. Nếu tin con số thì lượt sửa kế tiếp sẽ đi sửa `khoiBaCau` (thứ đang
đúng) thay vì sửa phép kiểm.

**Luật rút ra: mỏ neo phải neo vào KHOÁ MÁY ĐỌC, không neo vào hình dạng thẻ HTML hay chữ hiển
thị.** Thêm một thuộc tính, đổi một tên lớp CSS, sửa cách viết một nhãn tiếng Việt — cả ba đều là
việc bình thường, và cả ba đều làm vỡ một mỏ neo neo sai chỗ. Nay bốn phép ghim của bảng neo vào
`data-cau` · `data-den` · `data-tab`, do mã đặt tay, không đổi theo cách viết.

### Và giới hạn ⑦ áp lên chính bản này

Bản này **thêm** một dòng luật (`AGENTS.md` khai `ADR-0006`), nên nó phải **bớt** — đúng luật mục 8.
Đã bớt hai: dòng `npm run overview` trùng với dòng bảng, và hai dòng `.gitignore`/`.gitattributes`
gộp lại thành một (cùng trả lời *"git đối xử với file thế nào"* — đúng luật một-chỗ vừa áp cho bảng).

**Luật-là-chữ: 1.254 → 1.253 dòng.** Xuống, không lên. Con số nhỏ, và đó là điểm: hiện chưa cơ chế
nào **bắt** nó xuống — `can-nang` cố ý nằm ngoài cổng đóng phiên, nên trần tài liệu đang vượt 3,9×
mà **chưa từng chặn được gì**. Đó là `KHUNG-40`, và nó cần Đức chốt.

## 1.3.36 — 2026-09-07 — Bộ đo phải đi CÙNG thứ nó đo: `features.json` vào tầng máy

Cùng một lỗ, **lần thứ ba**, và lần này lộ ra đúng lúc sắp phát bản vá sang hai repo đã lắp.

| Lần | Lỗ | Vì sao lọt |
|---|---|---|
| 1.3.26 | `bang-song/` không được phát | tầng máy định nghĩa theo **tên thư mục** |
| 1.3.35 | tên lệnh không được phát | **không tầng nào** nhận `package.json` |
| 1.3.36 | `features.json` không được phát | phép "theo đuôi file" chỉ nhận thứ **chạy được** |

`features.json` không chạy được, mà `scripts/features.mjs` thì **đọc** nó. Nên `--plan` ở một
repo đã lắp kể `scripts/features.mjs` là THIẾU nhưng **không kể `features.json`**: `--apply` gửi
bộ đo tới mà không gửi thứ nó đo, và tính năng `F9.2` của chính danh mục đó **không bao giờ xanh
được** ở repo đích.

Sâu hơn: `bamBanTrich` cũng dùng hàm đó, nên đổi nội dung `features.json` mà không tăng phiên
bản thì **sổ phát hành nói dối** về một bản đã phát — đúng hệ quả thứ hai của lần 1.3.26.

Danh sách `TEP_MAY_THEM` **khai tay**, cố ý: không có phép suy nào tách được *dữ liệu của bộ
khung* khỏi *cấu hình của repo đích* — `package.json` · `.repo-structure.json` ·
`.agents/claims.json` cũng là `.json` trong bản trích, và ghi đè bất kỳ cái nào là xoá repo của
người ta. Thà một danh sách ngắn **có phép ghim canh**, hơn một quy tắc rộng đoán sai một lần là
mất dữ liệu.

### Một phép ghim cũ bắt tôi, và tôi thu hẹp nó chứ không gỡ nó

Vế 1 của `upgrade-smoke` đòi **không file `.json` nào** ở tầng máy — nó đỏ ngay lúc tôi kéo
`features.json` vào. Đúng chỗ nó phải bắt. Nên vế đó nay đòi: `.json` ở tầng máy phải được
**khai tường minh** trong `TEP_MAY_THEM`, còn ba file của repo đích thì tuyệt đối không lọt.
*Một ngoại lệ có tên và có phép ghim khác hẳn một cái cửa mở.*

### Lượt đo đột biến ĐẦU TIÊN không dùng được — và đó là phát hiện đáng giá nhất của bản này

Bốn đột biến đều "chết". Nhưng chúng chết vì **cổng dấu vân tay nổ trước**, vế 21 chưa hề chạy.
**Một đột biến chết vì lý do khác đọc y hệt một đột biến bị bắt, và nó chứng minh không gì cả.**

Phải chạy riêng bốn phép của vế 21 mới thấy — và lúc đó lộ ra phép `[3]` đang **hỏng**: nó ghép
một `new RegExp` từ chuỗi, dấu chéo bị ăn một lớp, nên biểu thức thành `Unterminated group`. Tức
phép kiểm **ném SyntaxError chứ không assert** — và nó không lộ ra ở lần chạy xanh, vì nhánh đó
chỉ vào khi CÓ file chưa được phát. Đúng nghĩa **một phép kiểm không bao giờ đỏ được**.

Nay nó là một phép tìm chuỗi thuần: tên file có xuất hiện trong ngoặc ở mã nguồn hay không. Thô
hơn, nhưng **không thể viết sai** — và khi nó báo thì cách xử đúng là **phát file đó**, không phải
nới phép kiểm.

Đo lại sau khi sửa: bốn đột biến chết ở **bốn phép khác nhau**, mỗi cái một phép.

`tests/upgrade-smoke.mjs` 23 → **24 vế**. Đã ghi vào sổ nợ `KHUNG-39`: `.gitignore` và
`.gitattributes` cũng nằm trong bản trích mà không tầng nào phát — và số đo đổi hình việc đó:
**3/3 repo đã lắp đều đã có cả hai file của riêng chúng**, nên vế "thiếu thì mang" gần như không
bao giờ chạy, toàn bộ việc nằm ở vế "chỉ kể tên".

### Và một chỗ nữa từ chính phản hồi bố cục

Danh sách **54 lối** ở tab Cấu trúc chiếm **2.011px trong 3.052px** của tab — mỗi lần vào tab đó
để xem một thứ khác đều phải cuộn qua trọn bộ bản đồ. Nay gập lại: tab còn **~1.040px**, và thứ
"mở ra khi cần tra" không còn nằm chắn đường thứ "đọc một lần là hiểu".

## 1.3.35 — 2026-09-07 — Bảng GỌN LẠI (đo được), checklist tính năng vào tab Migrate, và tên lệnh cũng được phát

Đức, sau khi mở bảng: *"content của tab cấu trúc quá lộn xộn & dàn trải, bị scroll nhiều"* ·
*"artifact theme & layout bị thừa quá nhiều khoảng trống… ví dụ như trang ý tưởng. Scroll mỏi tay"* ·
*"phần title… chiếm nửa màn hình vô nghĩa"* · và *"cần thêm 1 ô nhỏ để copy link của file dùng để
refresh, chạy host local… nếu hiện tại F5 là check status mới nhất được rồi thì phải giải thích."*

### ĐO TRƯỚC KHI SỬA — và số đo chỉ ra chỗ khác hẳn chỗ đang nghi

Mở bảng trên màn 1440×900, đo chiều cao từng tab bằng chính trình duyệt:

| | Trước | Sau |
|---|---|---|
| Đầu trang (header + lề thân + thanh tab) | **270px** | **105px** |
| Tab Vận hành | **16,0 màn hình** | **3,7** |
| Tab Cấu trúc | **10,1 màn hình** | **3,5** |
| Tab Ý tưởng | 1,9 | 1,4 |
| Khung nội dung | 1080px trên màn 1440 | **1280px** |

Hai nguyên nhân, cả hai đều **không** phải "CSS thưa":

1. **Tab Vận hành**: ba tài liệu đổ thẳng ra màn hình, không gập — `HUONG-DAN` 3.026px ·
   `SO-TAY-AGENT` 3.392px · `BAO-TRI-DINH-KY` 4.805px. **11.223px trong 14.442px** là ba khối chữ
   mà người mở tab đó không hỏi tới. Nay gập vào toggle, mặc định đóng.
2. **Tab Cấu trúc**: **bản đồ file in HAI LẦN trên cùng một tab** — 2.217px ở dạng hàng gọn, rồi
   4.676px ở dạng bảng đầy. Cùng một nguồn, hai cách chiếu, không bổ sung gì cho nhau. Bản gọn
   giữ nguyên vị trí; bản đầy (có liên kết bấm được) gập lại.

Chỗ trống ngang mà cuộn dọc mỏi tay là **lỗi bày trang**: nới khung ngang là bớt dọc, không phải
nhồi thêm chữ.

### Ô "Làm mới bảng" — hai file, HAI câu trả lời cho cùng một cú F5

Đặt ở tab **AI điều phối** (và tab Vận hành dùng lại đúng khối đó, không viết bản thứ hai):

- `bang-song/BANG.html` → **F5 LÀ THẤY.** Nó đọc bảng quyền từ **đĩa**, nên đổi byte mỗi lượt có ai
  nhận hay trả khoá.
- `DASHBOARD-<tên>.html` → **F5 KHÔNG ĐỔI SỐ.** Suy hoàn toàn từ lần commit gần nhất, cố ý: bộ sinh
  nhìn đồng hồ thì sang ngày là mọi phiên bị chặn đẩy dù không dữ liệu nào đổi.

**Cái sai duy nhất ở đây là tưởng chúng giống nhau**, nên hai ô phải nằm cạnh nhau. Nói gộp "F5 đi"
là dạy sai một trong hai. Mỗi thứ copy được có một nút COPY; cổng máy chủ **đọc từ mã nguồn**, và
đọc không ra thì nói thẳng là lấy ở dòng máy chủ in ra — đóng cứng một con số là dẫn người xem tới
bảng CỦA REPO KHÁC khi cổng bị chiếm và máy chủ nhảy cổng.

Repo **không có** bảng sống thì khối chỉ in một ô, kèm một câu nói thẳng là chưa có — vẽ một cửa
không tồn tại là bảng tự hạ độ tin cậy của chính nó.

### Checklist tính năng lên tab Migrate — kèm NGÀY ĐO và BẢN DANH MỤC

Đức chốt 07/09: *"ở repo đích, đặc biệt là mục dashboard mới… cần ghi rõ checklist các feature list
sẽ được migrate cũng như là ngày phiên bản."*

Bảng mốc có thêm cột **Tính năng**; mỗi tab con có thẻ checklist đầy đủ. Nguồn là khối do
`features.mjs --migrate` sinh và dán vào hồ sơ migrate — **bảng không khai lần thứ hai**, nên nó
không thể nói khác hồ sơ. Ba hồ sơ đang có đã được **đo lại và thêm khối** (chỉ thêm, không sửa
một dòng nào của phần cũ): `17/34` · `19/34` · `24/34`.

**Mục chưa xong hiện trước, mục đã xong gập lại.** Người mở sổ hỏi *"còn thiếu gì"* — 24 dòng xanh
đứng trên 10 dòng vàng là cách chôn 10 dòng vàng.

Bộ đọc lấy **khối cuối**, không phải khối đầu: hồ sơ là vùng chỉ thêm, nên đo lại thì dán thêm
khối mới. Lấy khối đầu là càng đo lại nhiều lần thì bảng càng nói về quá khứ sâu hơn.

### `upgrade.mjs` phát thêm TẦNG THỨ BA: tên lệnh

Đây là **gốc** của lớp `MỘT PHẦN` mà bản 1.3.34 vừa đo ra. Lệnh nâng cấp chép file và **chưa bao
giờ chạm `package.json` của repo đích**, nên ba lượt migrate đều đưa **công cụ** tới mà không đưa
**tên gọi** tới: `scripts/session-check.mjs` nằm đó, `npm run gate` thì không.

Luật giống hệt tầng tài liệu, có ý: **THIẾU thì mang sang · KHÁC thì CHỈ kể tên.** Một khoá đã có
giá trị khác là repo đích đã tự quyết (`test` chạy bộ phép kiểm riêng chẳng hạn); ghi đè là xoá
quyết định của người ta, và hỏng **im lặng** — `npm test` vẫn xanh, chỉ là nó không còn chạy đúng
những thứ nó từng chạy. Đọc không ra `package.json` là **KHÔNG BIẾT**, và lúc đó không chạm một byte.

### Một lỗi lộ ra lúc đo, không phải lúc thiết kế

Bảng của repo đích **tự gọi mình là "bộ khung"**: câu tự giới thiệu ở đầu trang được gõ cứng vào bộ
sinh, mà bộ sinh thì đi theo bản trích. Kiểm được ở một repo đã lắp. Nay câu đó đọc từ
`repo.tagline` của chính repo, và chưa khai thì bảng **nói thẳng là chưa khai** chứ không mượn câu
của người khác.

### Phép kiểm

`tests/overview-doc-smoke.mjs` 10 → **12 vế**, `tests/upgrade-smoke.mjs` 22 → **23 vế**.
**Mười hai đột biến đã chạy thật, cả mười hai đều bị bắt** — bảy cho hai vế bảng, năm cho vế tên
lệnh; danh sách ghi ngay trong đầu hai file.

Và một lỗi do **chính vế mới bắt được**, không phải do đọc lại: `soSanhLenh("[]")` — một mảng có
`typeof === "object"`, nên phép kiểm "là object" cho nó đi lọt, rồi hàm trả `{}`, tức nói *"không
thiếu lệnh nào"* về một file **không phải** `package.json`.

### Hướng dẫn kiểm tra đầy đủ

`docs/SO-TAY-AGENT.md` mục **8**: phát bản vá sang một repo đã lắp, rồi **kiểm nó thật sự chạy ở
đó** — bảy bước, bốn tầng của bản kế hoạch với bốn luật khác nhau, bảng "lệnh nào trả lời câu gì",
ba chỗ phải MỞ BẢNG RA XEM, và ba điều không làm. *"Phát xong" không phải là `--apply` thoát 0.*

## 1.3.34 — 2026-09-07 — Danh mục tính năng ĐO ĐƯỢC, và đề bài đưa AI repo đích go live

Đức: *"tôi muốn tổng hợp feature list hiện có thành checklist… để đảm bảo khi migrate thì checklist
đó cũng sẽ được go live và được migrate sang các repo"*, và điểm quan trọng nhất: *"AI assistant cần
được go live & well onboard ở repo đích để nó sẽ là người tiếp tục đảm nhiệm."*

### Danh mục: 9 khối · 41 mục · mỗi mục MỘT PHÉP ĐO

`features.json` + `npm run features`. Chín khối: bảng · cấu trúc & bảo trì · đa phiên · AI điều
phối · luật & quyết định · sổ sách · phát hành · phép kiểm · **đối chiếu và tự nâng cấp**.

**Một danh mục không đo được thì nó là quảng cáo** — nó nói repo có gì lúc ai đó viết nó, rồi im
lặng mãi. Nên mỗi mục khai `can` (file và lệnh phải tồn tại), và lệnh chỉ đi kiểm chứ không tin một
chữ nào trong phần mô tả. Chạy được ở **bất kỳ repo nào**.

**BA trạng thái, và `[~]` MỘT PHẦN nguy hiểm hơn `[ ]` THIẾU.** Ca thật đo được ngay lượt đầu ở một
repo đã lắp: nó có `scripts/session-check.mjs` mà **thiếu `npm run gate`** — cổng có mặt mà không ai
gọi được bằng tên chuẩn, nên trên thực tế nó không tồn tại. Ba mục như thế ở một repo.

**Mỗi mục khai `tu_ban`.** Đây là chỗ phiên AI ở repo đích đối chiếu với `.ark/harness.lock.json`
để tự biết mình thiếu tính năng nào của bản mới.

### Đề bài `onboard` — việc thứ tư của lệnh giao việc

**Đo được sau ba lượt migrate: 3 lượt xong, 0 lượt có phiên AI ở repo đích chạy trọn một vòng làm
việc.** Migrate đưa CÔNG CỤ tới; nó không đưa NGƯỜI CẦM tới. Repo có cổng mà không ai chạy thì sau
vài tuần lệch chuẩn đúng bằng repo chưa migrate — chỉ khác là nó **trông như** đã lên chuẩn.

Đề bài sinh ra **mang theo checklist tính năng đã đo tại repo đích**, và bắt phiên nhận việc chạy
**trọn một vòng thật**, không diễn tập. Báo cáo **sáu dòng** — khác khuôn năm dòng của ba việc kia,
vì nó trả lời *"repo này từ giờ có người cầm chưa"*, không phải *"tôi đã làm gì"*.

### Hai lỗ vá trước khi ghi vào repo nào

Cả hai lộ ra lúc **đọc bản `--plan`**, trước khi `--apply`:

- `upgrade.mjs` định nghĩa "tầng máy" là **hai thư mục tên `scripts/` và `tests/`**. Thêm
  `bang-song/` là repo đích nhận **phép ghim mà không nhận thứ nó kiểm** → suite gãy ngay. Nay
  định nghĩa theo **đuôi file chạy được**. Dấu vân tay bản phát cũng từng bỏ quên cả thư mục đó —
  tức sổ phát hành nói dối về nội dung một bản đã phát.
- Nó định mang **phụ lục nghề lái trình duyệt** sang một repo **chứng khoán**. Dòng đầu file đó tự
  viết *"repo bạn không lái trình duyệt thì xoá file này"*. Nay phụ lục nghề chỉ **kể tên**.

### Và một lỗi tôi lặp BA LẦN trong cùng một file

`tests/features-smoke.mjs` đi theo bản trích nên chạy ở **hai loại repo**. Ba vế của nó đặt câu hỏi
**chỉ đúng ở nơi phát hành** rồi đỏ trong repo hạt giống: đòi mọi tính năng phải đủ (repo vừa dựng
thiếu `docs/migrations`, `CHANGELOG.md`… một cách **hợp lý** — nó chưa tới lúc có), và hai vế soi
`template/` (repo dựng TỪ bản trích không có thư mục đó).

Luật rút ra, ghi thẳng vào đầu file: **mỗi vế phải trả lời được câu "câu này có nghĩa gì ở repo đã
lắp?"** Không trả lời được thì rẽ nhánh và đặt một câu tương đương cho phía kia — **đừng bỏ trắng,
vì một vế bỏ trắng đọc y hệt một vế đã đạt.**

Và bug tương ứng trong bộ đo: nó suy "đây là nơi phát hành" bằng cách **so đường dẫn với chính
mình** — đúng ở repo nhà, sai ở mọi repo khác vì file đi theo bản trích. Nay suy bằng **hai dấu
hiệu đo được**, và có vế ghim rằng cả hai dấu hiệu KHÔNG đi theo bản trích.

## 1.3.28 — 2026-09-07 — Nghiệm thu ba cửa trên máy thật, và một phép đo sai bị bắt

Đức: *"chạy file cmd bạn có thể gọi codex cli làm cho."* Giao Codex chạy thật, rồi kiểm chứng
độc lập — và lượt chạy thật bắt được **hai lỗi mà mọi lượt suy luận trước đó đã bỏ qua**.

### Lỗi 1 — file lệnh Windows phải là CRLF, và tôi đã đo SAI để kết luận ngược lại

Ba lượt: (1) thêm luật theo **linh cảm**, không số đo · (2) viết một file `.cmd` **ngắn** thuần LF,
chạy thấy đúng → **gỡ luật đi** kèm một đoạn giải thích tự tin · (3) chạy CHÍNH `Bat-tu-chay.cmd`
ở hai dạng, cùng nội dung:

| | kết quả |
|---|---|
| LF | `'cp' is not recognized` · `'tlocal' is not recognized` · **mã thoát 1** |
| CRLF | chạy đúng · **mã thoát 0** |

`cmd.exe` nhảy theo **độ dời byte** và giả định CRLF, nên với LF nó rơi vào giữa một từ và ăn mất
ký tự đầu dòng. **File càng dài càng lệch** — nên một file thử ngắn không bao giờ bắt được.

**Lượt sai thứ hai nguy hiểm hơn lượt đầu:** lượt 1 chỉ thiếu bằng chứng; lượt 2 **tạo ra bằng
chứng giả rồi viết nó vào repo** cho phiên sau đọc. Ghim nay đọc **byte thật trên đĩa**, không đọc
`.gitattributes` — một dòng cấu hình đúng mà cây làm việc vẫn LF thì người vừa clone vẫn dính.

### Lỗi 2 — cổng bận không có nghĩa là "bản khác của chính mình đang chạy"

Đo trên máy Đức: repo `Chrome_Extension_AI_Agentic` phát máy chủ bảng ở **cùng cổng 4747**, cũng
có mục tự chạy lúc bật máy. Bản đầu gặp cổng bận thì **thoát im lặng** — Đức mở trình duyệt sẽ
thấy bảng của REPO KIA và tin là bảng repo này. **Tệ hơn không có bảng**: bảng vẫn hiện, số vẫn
đẹp, chỉ là của chỗ khác.

Nay nó né sang cổng kế, **nói to** cổng đang dùng, và ghi cổng thật vào `trang-thai.json`. Trình
duyệt do **chính máy chủ** mở (`--mo`), không do file `.cmd` — chỉ máy chủ mới biết cổng thật.

### Nghiệm thu, chạy thật trên máy Đức

Cửa ① sinh một lượt · cửa ③ cài vào Startup, máy chủ lên `4747` · cửa gỡ xoá mục khởi động và
**đặt file cờ** cho bản đang chạy tự thoát (đã đo: thoát sau <35s) · bật lại, PID mới, phục vụ
tiếp. Và chốt ⑴ **nổ thật giữa lượt nghiệm thu**: một khoá `_code` đang giữ → cửa ① từ chối sinh
và nói rõ lý do, đúng như thiết kế.

## 1.3.27 — 2026-09-07 — Lane đã đi rồi thì đừng bảo người ta chờ nó

`KHUNG-38`, và **giả thuyết ban đầu của chính mục đó là sai** — phần đáng đọc nhất của bản này.

Giả thuyết: `--release --du-biet` làm cổng ĐÓNG PHIÊN của lane kế đỏ. Đo trong một kho dựng riêng:
**"Phạm vi trách nhiệm" XANH** — nó đọc file sửa dở trên đĩa, không đọc commit chưa đẩy. Hai chỗ
đỏ còn lại là **nhiễu của kho thử**: đối chứng (lane đẩy đàng hoàng rồi mới trả) ra y hệt. Không
dựng đối chứng thì hai chỗ đó đã bị đọc thành bằng chứng.

**Chỗ hỏng thật ở cổng XUẤT BẢN, và nặng hơn:** `safe-push` chặn lane kế vì nó cuốn theo commit
của lane đã đi, rồi khuyên *"chờ phiên đó tự push"* — chờ một việc không bao giờ xảy ra. Không ai
đi hỏi Đức, vì câu đó bảo chỉ cần đợi. Repo kẹt **im lặng**, với mọi lane sau.

Vá ở cả hai đầu: `claim.mjs` nói ra cái giá ngay lúc trả khoá · `safe-push` đọc `tra_khi_chua_day`
và nói thẳng *"lane đó đã đi, đừng chờ"* kèm lý do lane kia khai. **`--carry` vẫn phải hỏi Đức** —
và có một vế ghim đúng điều đó, vì sửa câu chữ là chỗ dễ trượt thành tự cấp phép nhất.

Hàm quyết định chuyển sang `repo-structure.mjs` vì `safe-push.mjs` chạy phần chính ngay lúc nạp và
thoát khi thiếu `--as`, nên **không phép ghim nào import nổi nó** — một nhánh không nạp được là
một nhánh không ai đột biến kiểm được, mà nhánh này in ra câu người bị chặn sẽ làm theo.

## 1.3.26 — 2026-09-07 — Chuỗi đêm: bảng SỐNG · trả khoá an toàn · tám cái bẫy đã phân loại

Đức: *"tôi có thể F5 trên dashboard html là latest status sẽ được hiển thị lên các luồng làm
việc cùng lúc."*

### Đo trước, và chỗ chặn hoá ra KHÁC hẳn dự đoán

Dự đoán ban đầu: tiến trình nền làm bẩn cây làm việc rồi chặn push của lane khác. **Sai.**

Đo ra: bảng đọc bảng quyền **từ HEAD** (`git show HEAD:.agents/claims.json`). Trên chính lịch sử
repo này, bốn khoá một phiên giữ suốt lượt làm việc nằm trong **0/6 commit** — nên bảng nói
*"không có luồng nào chạy"* trong khi có bốn. F5 cả buổi cũng chỉ thấy số 0.

Cái giá của bản đọc-từ-đĩa, đo bằng cổng của một lane khác:

| | bảng sống bẩn | chỉ `claims.json` bẩn (nền hôm nay) |
|---|---|---|
| Phạm vi trách nhiệm | XANH | XANH |
| Sự thật máy sinh còn tươi | XANH | XANH |
| Test xanh | BỎ (2 file) | BỎ (1 file) |

**Hai cột giống hệt nhau** — bảng sống thêm **0 đồng chi phí**, với điều kiện nó không được
commit. Đó là lý do bản ra nằm ngoài git, không phải sở thích.

### Ba cửa, một lõi

`bang-song/` — nhấp đúp · máy chủ tại chỗ (`127.0.0.1`, **ba đường, chỉ GET/HEAD**) · tiến trình
nền tự chạy lúc bật máy. **Đức duyệt tường minh cửa ③** (luật mục 2 hàng 5). Tắt bằng **file cờ**,
không giết theo tên tiến trình — giết theo tên sẽ giết luôn `node` của một phiên AI đang chạy.

Hai bản, hai việc, **đừng gộp**: `DASHBOARD-*.html` đã commit vẫn suy hoàn toàn từ HEAD; chỉ bản
sống mới đọc bảng quyền từ đĩa, sau hàng rào `--khoa-song`.

### Chín đột biến, và HAI cái sống sót lượt đầu

Hai cái sống sót đáng ghi hơn bảy cái kia:

- Vế canh chốt ⑴ **lặp qua chính danh sách nó phải canh**, nên bỏ một khoá đi thì nó chỉ kiểm
  phần còn lại rồi báo xanh. Một phép kiểm tự soi mình luôn đúng, tức nó ghim số 0. Chữa bằng
  cách hỏi **hành vi**, không so hai danh sách.
- Phép ghim chỉ thử hình dạng repo **hỏng**, chưa thử hình dạng **đọc được mà thiếu** — mà đó
  mới là ca thật ở repo đích.

Và trước khi phát đi: `KHOA_CHAN_SINH` từng **đóng cứng** `_code`/`_template`. Repo đích đặt tên
khoá khác thì chốt ⑴ im lặng không bao giờ nổ — đúng loại lỗi nó sinh ra để chặn, ở đúng chỗ
không ai nhìn. Nay suy chủ của `scripts/` và `template/` từ `.repo-structure.json`.

### KHUNG-33 — trả khoá khi còn commit chưa đẩy

Trả khoá xong mà commit còn nằm trên máy thì vùng đó **không ai đứng tên** trong khi vẫn có thay
đổi chưa công bố, và cổng của phiên sau đỏ với câu *"vùng bị sửa nhưng chưa ai đứng tên"*.

**Hai vế đi cùng một lượt, và đây là chỗ dễ làm hỏng nhất.** Chỉ lấy vế chặn thì một lane bị cổng
xuất bản từ chối đẩy sẽ **kẹt khoá vĩnh viễn**: không đẩy được → không trả được → vùng chết theo
nó. Cửa thoát `--du-biet` không phải chỗ hở — nó là **điều kiện để vế chặn được phép tồn tại**, và
nó ghi lý do vào bảng nên là một câu khai chứ không phải một cái tặc lưỡi.

Chiều thứ ba, cố ý khác `--take`: **không đo được thì KHÔNG chặn**. Giành vùng không lùi lại được
nên ở đó fail-closed là đúng; trả khoá là thao tác **gỡ bí**, và một lệnh gỡ bí tự chặn vì git hỏng
thì nó biến sự cố nhỏ thành sự cố kẹt cả vùng.

### KHUNG-34 — tám cái bẫy: nhận 2, bác 5, một cái đã có sẵn

Từng cái trả lời câu của luật mục 8 — *đã xảy ra thật ở repo NÀY chưa* — bằng một phép đo:
`git commit -o` **0 chỗ dùng** · byte NUL **0/133 file** · ADR khai trạng thái **1 chỗ, không phải
2** · tên repo **không suy từ tên thư mục** · bộ đếm lưu trữ **đã giải sẵn**.

**Năm cái bị bác đều là bẫy THẬT ở repo tiêu thụ.** Bác không phải vì chúng vô lý, mà vì chép sang
là nhập năm cơ chế mà không nhập lý do tồn tại của chúng — rồi phiên sau đọc không hiểu vì sao có
và gỡ đi.

**Và bẫy số 2 suýt thành cái thứ ba được nhận.** Lượt này có thêm `*.cmd text eol=crlf` vào
`.gitattributes` dựa trên linh cảm *"cmd.exe đọc file batch thuần LF không ổn"*. Đo thật trên
Windows 11: file `.cmd` thuần LF chạy đúng, kể cả khối `if errorlevel (...)` nhiều dòng và
`chcp 65001` với chữ có dấu, mã thoát 0. **Gỡ luật đi**, và ghi lý do ngay trong `.gitattributes`
để không ai thêm lại vì cùng một linh cảm. Rơi ra `KHUNG-38`.

### KHUNG-36 — ba hồ sơ migrate cũ nay khai đủ ba mốc

Đức chốt cho khai lại. **Git xác nhận: 12 dòng thêm, 0 dòng xoá** — không viết lại một chữ nào của
thân bài, và mỗi dòng khai dẫn nguồn từ chính thân bài hồ sơ đó.

Bảng mốc nay đầy, và **một ô là dấu ✗ thật**: `Project 3 AI Agent Unify` chưa có mốc "AI onboard",
vì thân bài ghi cổng **9 XANH 1 BỎ** — mà BỎ không phải xanh, nên chưa lane nào đi trọn vòng.
Khai đúng cái đang thiếu có ích hơn một bảng toàn dấu ✓.

## 1.3.23 — 2026-09-06 — Hai luật từ repo tiêu thụ: một nguồn cho câu chữ, và vai điều phối không đứng chờ

Repo `Chrome_Extension_AI_Agentic` rút ra hai luật ngày 06/09. Cả hai thuộc về bộ khung — nó là
nơi phát hành, repo kia tiêu thụ. **Hoà giải theo hình dạng bộ khung, không chép nguyên văn.**

### Luật 1 — tên của tín hiệu khoá là phần của hợp đồng

Phần chữ bộ khung **đã có** từ bản 1.3.20 (cấm nhả khoá hộ · ba đường hợp lệ · VÀNG không ĐỎ).
Đo lại thì lòi ra chỗ chưa khớp: **`session-check.mjs` gõ lại câu bằng tay** thay vì lấy từ
`noiDauVet`. Tức có HAI bản của một câu — và cái bẫy của luật này chính là câu chữ: bản đầu gọi
nó *"vùng chưa bị chạm"*, và cả người viết ra nó cũng đọc thành *"lane đang rảnh"*.

Nay ba mặt in tín hiệu (`--list` · bảng · cổng đóng phiên) lấy câu từ **một nguồn**. Ghim ở
`tests/khoa-dau-vet.mjs` vế 6, **đột biến thứ 7 đã chạy**: gõ tay lại câu chữ → ĐỎ, kể cả khi vẫn
còn nhắc tên `noiDauVet` ở chỗ khác trong file.

Phép ghim **gỡ chú thích trước khi soi** — nhắc tên tín hiệu trong lời giải thích không phải là
dựng một bản thứ hai, và một phép ghim bắt nhầm chú thích là phép ghim người ta sẽ gỡ đi.

### Luật 2 — vai điều phối không bao giờ dừng vì chuyện commit

Mới với bộ khung. Vào `docs/protocols/ORCHESTRATOR.md` mục **5b**.

*"Dừng lại"* rộng hơn *"hỏi xin phép"*: ca thật là vai điều phối **không** hỏi phép, nó đứng chờ
cổng chạy xong rồi mới commit, và nhắn về một câu *"chờ cổng xong rồi tôi đẩy"*. Với người không
đọc được trạng thái trên máy thì **"AI đang chờ" và "AI đang làm" trông giống hệt nhau**.

**Hai chỗ cố ý khác bản gốc:**

- **Thêm một ranh giới bản gốc để ngầm:** "cho cổng chạy nền rồi làm tiếp" **không** có nghĩa là
  đẩy khi chưa đọc kết quả cổng. `AGENTS.md` mục 2 vẫn đòi XANH TOÀN BỘ. Mục này gỡ cái *chờ vô
  ích*, không gỡ cái *chốt*.
- **KHÔNG kéo về khoản `--carry` khỏi phải hỏi.** Bên kia có quyết định thường trực của người chốt
  bên đó; bộ khung không có. Quyết định thường trực là của một người ở một repo — chép sang là bộ
  khung tự cho mình một cái phép mà người chốt của repo này chưa hề cho.

Mục 5b được khai thẳng vào bảng *"chưa có phép kiểm máy"* ở đầu sổ, với lý do: máy nhìn thấy
commit và nhánh, nó **không** nhìn thấy một tin nhắn nói "đang chờ". `AGENTS.md` mục 8 hỏi *"dựng
nổi ca hỏng không?"* — ở đây là **không**, nên nó là quy ước, và nói thẳng là quy ước.

### Xếp hàng đợi — bảng tự tươi, F5 là thấy

`IDEAS.md` mục `Y-10`. Đức nêu: *"tôi có thể F5 trên dashboard html là latest status sẽ được hiển
thị"*. Repo kia đã dựng: ba cửa, một lõi, máy chủ **chỉ đọc** ở `127.0.0.1`, nhịp 30 giây so dấu
vân tay. Chưa làm vì **ba chỗ chặn**, chỗ thứ ba là của riêng bộ khung: bảng ở đây mang dữ liệu
khoá SỐNG, mà cổng đóng phiên soi artifact và `safe-push` từ chối vùng bị sửa không ai đứng tên —
một tiến trình nền ghi đè bảng mỗi lượt nhận/trả khoá có thể **chặn push của mọi lane**. Đo trước,
thiết kế sau.

## 1.3.22 — 2026-09-06 — Con số ma trên bảng quyền: mốc chỉ có ngày thôi bịa ra giờ

**Đức bắt được, không phải phép kiểm nào.** Bảng quyền báo ba khoá *"giữ 16h ⚠ quá 6h"* trong khi
cả ba vừa nhận **hai tiếng trước**.

Nguyên nhân: mốc cũ là `"2026-09-06"` — chỉ có ngày — nên `Date.parse` đọc thành nửa đêm UTC, và
tới chiều thì phép trừ ra 16 tiếng. Bản 1.3.21 đã cho mốc MỚI có giờ, nhưng mốc CŨ vẫn nằm đó và
vẫn được đọc như thể nó biết giờ.

**Vì sao đáng một bản riêng:** con số ma đó **bật ⚠**. Một cảnh báo sai vài lần thì lần thứ ba
không ai nhìn nữa — lúc đó một khoá kẹt thật cũng trôi qua, và tín hiệu thành thứ ngược lại chính
nó. Đúng cái bệnh mà chính bản 1.3.21 dựng ra để chữa, ở một chỗ khác.

Nay mốc nói **đúng độ chính xác nó có**: mốc chỉ-ngày → *"nhận trong hôm nay"*, và ⚠ chỉ bật khi
qua hẳn một ngày. Mốc có giờ chạy như cũ. Ba chỗ hiển thị (`--list` · bảng · `what-next`) dùng
chung một luật — `mocCoGio()` và `dangNhac()`.

Ghim: `tests/khoa-dau-vet.mjs` vế 9, **hai đột biến đã chạy** (dựng lại đúng con số ma → đỏ).

### Nhịp GIẾT — tiến trình nền của phiên đã chết

Đức, cùng lúc: *"phải có protocol tắt những fake task ko còn tác dụng chứ nhỉ?"* Đo `node.exe`
theo tuổi: **32.9h · 15.9h · 2.2h · 1.9h · 0.9h** — năm thế hệ MCP server chồng lên nhau, ba
thuộc phiên đã chết. `docs/BAO-TRI-DINH-KY.md` thêm nhịp thứ tư: lệnh đo, ba câu luật giết, và
**AI không tự giết cái nào**. `KHUNG-37`.

## 1.3.21 — 2026-09-06 — Khoá giữ mà repo chưa thấy dấu vết, và sổ migrate gom về một tab

> Bản 1.3.20 được cắt giữa chừng rồi tầng máy còn đổi tiếp, nên sổ phát hành chặn và số nhảy sang
> 1.3.21 — đúng như thiết kế: một số chỉ được trỏ tới **một** nội dung.

### Tín hiệu mới: "repo chưa thấy dấu vết"

Không commit nào chạm vùng đó kể từ lúc nhận khoá, **và** không file nào trong vùng đang sửa dở.
Hiện ở **ba chỗ**: `claim.mjs --list` · khối "Đang làm gì" trên bảng · cổng đóng phiên.

**VÀNG, không ĐỎ — và mức đó là phần của hợp đồng.** Một lane đọc kỹ 30 phút trước khi sửa một
dòng là lane tốt; chặn nó là dạy mọi lane ghi bừa một byte để giữ khoá cho hợp lệ.

**Tên của tín hiệu cũng là phần của hợp đồng.** Nó nói *repo chưa thấy gì*, **không** nói *lane
đang rảnh*. Ngày 06/09 một phiên điều phối đọc thành "rảnh", nhả khoá hộ, và lane kia — đang dựng
bản nháp ở thư mục **ngoài repo** — phải hoàn nguyên phần đã xong. Con số này **về nguyên tắc**
không thấy được việc làm ngoài repo, nên đo kỹ hơn cũng không đóng được lỗ đó.

`tests/khoa-dau-vet.mjs` — 8 vế, **4 đột biến đã chạy thật**, kể tên ngay đầu file.

### Luật khoá đổi ba chỗ

- **Nhận khoá ngay TRƯỚC lượt ghi đầu tiên**, không phải lúc mở phiên — đọc và đo không cần khoá.
- **Một lane, một khoá gói.**
- **Không nhả khoá hộ lane khác** vì con số này. Ba đường hợp lệ, và chỉ ba.

`AGENTS.md` mục 1 và `MULTIFLOW.md` mục 3. Thêm luật thì phải bớt luật (mục 8): định nghĩa năm
"luật an toàn" dời sang `docs/LEGEND.md`, phần còn lại gói chặt hơn — `template/AGENTS.md` về
đúng 200 dòng, **không nới trần**.

### Tab Migrate viết lại — Đức chốt

*"Tôi chỉ muốn hiểu kết quả đang ở đâu, roadmap thế nào… nếu dừng lại bước nào tôi sẽ continue."*

| Trước | Sau |
|---|---|
| bảng đối chiếu → tab con → gần trọn thân hồ sơ trải ra | **bảng ba mốc** → **"dừng ở đâu"** → chữ gập trong `<details>` |

Ba mốc lấy từ `CHUYEN-REPO-LEN-CHUAN.md` (*migrate · audit · AI onboard*), không tự đặt mốc mới.
Ô không có nguồn nói **"chưa khai"**, không làm tròn thành "chưa xong" — ba hồ sơ đang có được
ghi trước khi bảng này tồn tại. Hồ sơ từ nay khai thêm `viec_audit` · `viec_assistant` ·
`viec_ke` thì ô tự đầy.

**Trang riêng thôi được nuôi.** `SO-MIGRATE-*.html` rời `generators`/`generated`, bản cuối **dời**
sang `docs/archive/` (dời chỗ, không xoá). `build-so-migrate.mjs` nay **bắt đưa đường dẫn**: giữ
mặc định cũ là gài bẫy một file không ai khai ở gốc repo.

### Bản đồ hoà giải với repo tiêu thụ

`docs/HOA-GIAI-BO-KHUNG-VS-TIEU-THU.md` — mỗi khối lệch rơi vào đúng một ô: `KÉO XUỐNG` (7) ·
`ĐẨY LÊN` (2) · `CỐ Ý KHÁC` (9). Bản gốc và bản trích **khớp từng dòng ở cả năm file** đo được.

Một ca của luật vàng 4: bản giao việc gửi sang nói bộ khung *thiếu* `ageHours`/`ageLabel`. Số đo
đúng, **kết luận sai** — bộ khung đã có, ở `what-next.mjs` chứ không ở `claim.mjs`. So tên hàm
theo file thì một hành vi viết ở chỗ khác hiện ra như "thiếu". Chỉ chạy `grep` mới thấy.

## 1.3.19 — 2026-09-06 — Vá một vế kiểm quá chặt, và phát bảng sang hai repo đã lắp

### Vế kiểm đòi thứ không phải repo nào cũng có

Vế "liên kết nhảy tab" đòi cứng `goto.length > 0`. Đúng ở repo nhà — có sổ ý tưởng nên có chín
liên kết. **Sai ở repo vừa nhận bản phát**: chưa có `IDEAS.md`, chưa có hồ sơ migrate, nên trang
không có liên kết nào — và đó là trạng thái **hợp lệ**.

Nay điều kiện là **có điều kiện**: tab nào có mặt thì liên kết của tab đó phải có. Bắt được lúc
nâng `n8n-orchestrator`; đọc lại code không thấy, chỉ chạy ở repo thật mới thấy. **Lần thứ hai
trong cùng một ngày** một suite vừa phát đi lại đòi thứ chỉ repo nhà có.

### Đã phát sang hai repo

| Repo | Bản | Tab | Ghi chú |
|---|---|---|---|
| `n8n-orchestrator` | 1.3.13 → 1.3.19 | 7 | cổng XANH TOÀN BỘ |
| `ALL_SKILL_MANAGEMENT` | 1.3.13 → 1.3.19 | 7 | trang là **file thứ TƯ** do máy sinh, KHÔNG đụng `DASHBOARD.md` viết tay |

Ba tab còn lại (**Mô hình · Ý tưởng · Migrate**) tự ẩn ở cả hai — chúng không có nguồn cho những
tab đó. Cả hai repo đều phải khai thêm `build-overview.mjs` vào khối `generators`: không khai thì
cổng không kiểm trang, và trang cũ dần mà không ai biết.

**Một chỗ vấp chung của cả hai:** bảng markdown của chúng nhúng **số commit chưa đẩy**, nên mỗi
commit mới lại làm bảng lệch — nó tự đuổi theo đuôi mình. Lối ra là sinh lại rồi `--amend` thay
vì tạo thêm commit.

## 1.3.18 — 2026-09-06 — Bảng ĐI THEO BẢN TRÍCH: gỡ bốn chỗ nối, phát sang repo đã lắp

Đức chốt 06/09: bảng phải là **MỘT bảng cho mọi repo**, không để mỗi nơi một kiểu. `Y-09` xong.

### Bốn chỗ nối, không phải một

Bản 1.3.16 nhập từ `giao-viec.mjs` và `build-so-migrate.mjs` — **hai lệnh ở lại repo nhà** — và
dùng `md-mini.mjs` vốn chưa từng được phát. Phát trang đi mà không gỡ là repo đích **nạp trang
chết ngay dòng import**, với một câu lỗi không nói gì về nguyên nhân thật.

Lối ra là **đảo chiều phụ thuộc**: hằng số `VIEC` và bộ đọc hồ sơ migrate dời sang
`overview-doc.mjs` (file đi theo), rồi hai lệnh ở lại thì nhập từ đó. Chiều phụ thuộc nay chảy
từ thứ **ở lại** sang thứ **đi theo** — chứ không ngược. Một nguồn cho mỗi thứ.

### Tên trang suy từ cấu hình

`DASHBOARD-<tên-repo>.html`, lấy từ `repo.name`. Tên đóng cứng là mọi repo đích cùng sinh ra một
file mang tên repo **nhà** — đúng đống file trùng tên mà quy ước đặt tên sinh ra để tránh, chỉ
tệ hơn: chúng còn nói sai tên chủ. Repo đích đã có file trùng tên thì khai
`generated_names.overview`; khoá này nhận `null` nghĩa là *để bộ sinh tự suy*, khác hẳn "không có".

Chữ `Đ` được xử riêng: nó là một chữ cái, không phải `D` có dấu, nên NFD không tách được — bỏ
qua chỗ này thì "Đầu tư" ra "au-tu", mất luôn chữ đầu của tên repo.

### Hai khối chỉ đúng ở repo nhà, tự ẩn

Tab **Mô hình** mô tả bộ khung *phát bản* ra sao, mà repo đích là **người nhận** chứ không phải
nơi phát. Khối **Giao một việc cho AI khác** dạy gõ `npm run giao-viec` — lệnh ở lại repo nhà.
Vẽ chúng ở repo đích là bảng tự nhận một vai không phải của mình, và dạy người ta một lệnh không
tồn tại. Dấu nhận biết: chỉ repo nhà mới có bộ sinh bản trích.

### Một lỗi bắt được nhờ THỬ THẬT, không nhờ đọc lại code

Dựng một repo giả cố tình khác hình dạng repo nhà rồi chạy — và suite vừa phát đi **chết ngay**:
nó đọc `IDEAS.md` và tên trang của repo nhà, hai thứ repo đích không có. Tức là tôi vừa phát đi
đúng cái bệnh bộ khung này đếm được sáu lần: *một thứ trỏ tới thứ không tồn tại*.

Nay ba vế đó **bỏ qua CÓ TÊN** khi thiếu nguồn, và tổng kết in ra số vế bỏ qua. Bỏ qua im lặng
trông giống hệt đã chạy và xanh — mà bảng thì luôn xanh.

## 1.3.16 — 2026-09-06 — Migrate thành một TAB, và mỗi lượt một tab con

Đức mở bảng mẹ và **không thấy đường nào dẫn sang sổ migrate**. Đường đó có thật — nó nằm trong
khối "Trang liên quan" ở tab đầu — nhưng nằm dưới bốn khối khác. **Một liên kết người dùng không
tìm ra thì bằng không có**, và câu trả lời đúng không phải là bôi đậm nó lên.

### Tab **Migrate**, quy về một mối

Mở đầu bằng **bảng đối chiếu mọi lượt** (repo · ngày · bản khung · mức · lỗi tìm ra · kết quả) —
vì câu hỏi đầu tiên của người mở sổ hầu như luôn là *"đã làm mấy repo, cái nào còn treo"*, không
phải *"lượt thứ hai viết gì"*. Bấm tên repo là nhảy thẳng vào tab con của lượt đó.

### Mỗi lượt migrate một TAB CON

Đức nêu: *"tách riêng các job thành các tab riêng, sẽ dễ theo dõi hơn so với để tràn lan"*. Ba hồ
sơ nối đuôi nhau thì phải cuộn qua hai lượt cũ mới tới lượt mình cần, và hồ sơ nào cũng dài.

Tab con dùng `data-tab2` / `.tab2` — **tên khác hẳn tab lớn, cố ý**: dùng chung tên thì một cú
bấm tab con sẽ quét luôn cả tab lớn và người xem bị đá về trang đầu mà không hiểu vì sao.

**Trang riêng VẪN GIỮ.** Cả hai đọc chung `docs/migrations/` nên không thể nói khác nhau — một
nguồn, hai cách chiếu. Bản riêng dùng khi cần gửi riêng sổ migrate cho ai đó.

### Một lỗi HỎNG IM LẶNG của bản trước, vá luôn

Bản 1.3.15 thêm liên kết `data-goto` vào khối ý tưởng nhưng **không thêm đoạn JS xử lý nó**.
Trình duyệt nhảy tới một id đang nằm trong tab **bị ẩn**, nên không có gì xảy ra cả — người bấm
chỉ thấy trang không nhúc nhích, và không ai báo lỗi.

Phép kiểm mới bắt cả ba đường hỏng: liên kết trỏ tới **tab** không tồn tại · trỏ tới **id** không
tồn tại · và trang **thiếu đoạn JS** để xử lý. Đột biến kiểm hai lượt, cả hai đỏ đúng chỗ.

## 1.3.15 — 2026-09-06 — Bảng chín tab: năm nguồn trước nay chưa chiếu ra bao giờ

Đức mở bảng của repo `Chrome_Extension_AI_Agentic` và thấy bảng bộ khung **thiếu hẳn năm tab**.
Repo kia đã tự đi trước và chứng minh chúng dùng được. Bản này mang logic về một nguồn.

### Chín tab, và con số chín là có chủ đích

Bản trước có **mười** tab mà vẫn thiếu năm thứ Đức hỏi tới. Thêm thẳng vào là mười lăm tab —
một bảng mười lăm tab thì không ai tìm nổi mục mình cần, tức bảng chết theo kiểu khác. Nên bốn
tab cũ được **gộp vào chỗ đúng của chúng**, không đứng riêng:

| Mới | Trả lời câu gì | Gộp thêm |
|---|---|---|
| **AI điều phối** | ai đang làm gì · còn việc nào chờ Đức · còn mấy chỗ giao việc song song | — |
| **Ý tưởng** | những hướng đang mở đang ở bước nào | — |
| **Vận hành** | bảng này chạy thế nào · cái gì giữ cho không giẫm chân | Cách vận hành + Sổ tay + Bảo trì |
| **Sức khoẻ & nợ** | repo đang nợ gì, và số 0 kia là sạch hay chưa dò | — |
| **Cấu trúc** | repo chia vùng thế nào, ai được ghi vào đâu | Bên trong |

"Làm được gì" vào **Mô hình** (nó vốn là danh sách tính năng của khối dữ liệu lõi); "Đã xong"
vào **Nhật ký**.

### Năm nguồn mới, và `IDEAS.md` — sổ ý tưởng

`scripts/overview-doc.mjs` tách riêng phần **kiểm được bằng phép kiểm thuần**: đưa vào một
chuỗi, đòi ra một cấu trúc. Nó đọc sổ ý tưởng · dấu chờ người chốt · bảng chủ sở hữu · sổ nợ ·
bốn cơ chế và năm bất biến của luật đa phiên.

`IDEAS.md` là file mới ở gốc repo — **sổ nợ ghi thứ đang hỏng, sổ ý tưởng ghi hướng đi**. Trộn
hai thứ là mọi hướng đi trông như một lỗi cần vá gấp. Chín ý tưởng rút từ `decisions.md` ·
`BACKLOG.md` · `HANDOFF.md`, mỗi ý tưởng kèm *nguồn · vì sao · vì sao chưa làm ngay · đo trước
khi sửa*.

### Dấu `@Đức:bấm` / `@Đức:chốt` — bảng KHÔNG giữ danh sách việc chờ

Đặt dấu ngay trên dòng của mục trong sổ nợ / sổ ý tưởng / hồ sơ trạng thái. Mục đóng thì dấu
mất theo — **không ai phải nhớ đi xoá ở một chỗ thứ hai**, và một danh sách thứ hai thì luôn cũ
hơn thực tế. Số ngày treo đo bằng `git log -L`, không đọc đồng hồ.

### Mỗi số 0 nay kèm MẪU SỐ

Một số `0` đứng một mình trông giống hệt nhau ở hai ca ngược nhau: *đã dò hết, sạch* và *chưa dò
gì cả*. Ca thứ hai là ca nguy hiểm, vì nó hiện ra màu xanh. Nay mỗi ô kèm dòng "đã dò bao nhiêu",
và `?` nghĩa là KHÔNG ĐO ĐƯỢC — khác 0.

### Bốn lỗi thật bắt được ngay lúc chạy trên dữ liệu thật

| Lỗi | Hậu quả nếu không bắt |
|---|---|
| Lọc khoá chú thích bằng **tiền tố** `_doc` | nuốt luôn khoá vùng thật **`_docs`** — một vùng biến mất khỏi bảng, im lặng |
| Regex bất biến neo `$` cuối dòng | đọc ra **0/5** bất biến và vẫn trả mảng rỗng lễ phép — rỗng-vì-đúng và rỗng-vì-hỏng trông giống hệt nhau |
| Vùng đã khai mà chưa có file | git không theo dõi thư mục rỗng, nên một chỗ giao việc thật biến mất khỏi bảng |
| Backtick trong chú thích CSS | **lần thứ tư** repo dính bẫy template literal — module không nạp được |

### Hai chỗ sổ nói sai, tìm ra khi rà nguồn

`KHUNG-17` **đã được vá từ trước mà sổ chưa gạch mã**, nên nó vẫn chiếm chỗ trong "12 mục còn
mở". Và `STATUS.md` đang trỏ `next_step` vào `KHUNG-13` — **mục đã đóng**. Cùng một hình dạng
lỗi, hai chỗ: *sổ nói về một thực tế đã đổi*. Đã vá cả hai.

## 1.3.14 — 2026-09-06 — Đề bài KHÔNG viết tay nữa, và trang có mô hình ba khối

Lượt giao việc đầu tiên cho Codex CLI (06/09) không hỏng vì Codex. Nó hỏng vì **đề bài
được viết trước khi ai đo repo đích**. Bản này biến việc đo đó thành một lệnh.

### `npm run giao-viec` — đo repo đích RỒI mới ghép đề bài

```bash
node scripts/giao-viec.mjs --viec <nang|migrate|audit> --repo "<repo-đích>" --as <tên-phiên>
```

In ra stdout một đề bài dán trọn được, mở đầu bằng khối **ĐO ĐƯỢC LÚC GIAO VIỆC**: nhánh ·
lệch nhánh mặc định · file sửa dở nằm TRONG hay NGOÀI vùng bộ khung, **kể đích danh** ·
bảng quyền · bản khung đang ghim.

**Fail-closed.** Năm chỗ bắt DỪNG, và dừng thì `stdout` **rỗng** — không in đề bài kèm một
dòng cảnh báo, vì người ta hứng stdout vào file rồi đưa thẳng cho AI:

| Mã | Khi nào |
|---|---|
| `KHONG_TIM_THAY_REPO` · `KHONG_PHAI_KHO_GIT` | đường dẫn sai — cũng là một trong ba giới hạn của `codex exec` |
| `FILE_SUA_DO_TRONG_VUNG` | có việc đang dở ngay trong vùng lượt này sẽ ghi |
| `VUNG_CO_CHU_KHAC` | khoá đang bị phiên khác giữ |
| `CHUA_GHIM_BAN_KHUNG` | `--viec nang` vào một repo chưa lắp bộ khung |
| `KHONG_DO_DUOC_NHANH_XA` · `BANG_QUYEN_HONG` | đọc được nửa vời thì coi như không đọc được |

**Hai lỗi thật bắt được ngay lúc viết phép kiểm cho chính nó:** `git status --porcelain`
gộp một thư mục chưa theo dõi thành đúng một dòng `?? dashboard/` — đề bài đi bảo stage cả
thư mục mà không biết trong đó có việc của ai (vá bằng `-uall`); và `execFileSync` mặc định
để stderr của git chảy thẳng ra màn hình, nên mỗi lần dò `@{u}` là một dòng `fatal:` rơi vào
giữa đề bài.

**Và nó tự dựng lại được KHUNG-30.** Repo `Project 3 AI Agent Unify` đứng trên nhánh tính
năng: so với upstream của chính nhánh đó là `0 sau · 0 trước`, nhưng so với `origin/main` là
**5 sau · 48 trước**. In mỗi con số thứ nhất là trấn an người đọc về một thứ không ai hỏi rồi
giấu mất thứ làm cả lượt phải dừng. Nay in cả hai.

### Đề bài tách làm hai nửa — một luật, ba việc

| File | Là gì |
|---|---|
| `docs/briefs/GIAO-VIEC-CHUNG.md` | nửa TRÊN — tên phiên · khoá vùng · cây làm việc bẩn · hai lượt đẩy · năm việc cấm · mẫu báo cáo năm dòng · **ba giới hạn đo được của `codex exec`** |
| `docs/briefs/NANG-BO-KHUNG.md` | nửa DƯỚI — nâng (231 → 95 dòng, phần chung cắt ra) |
| `docs/briefs/MIGRATE-REPO.md` | nửa DƯỚI — migrate |
| `docs/briefs/AUDIT-REPO.md` | nửa DƯỚI — audit, chỉ đọc, chạy trên bản clone |

Chép luật chung ba lần là ba bản sẽ trôi khỏi nhau — repo này đã có ba bản chép tay của một
danh sách nói ba kiểu khác nhau. `tests/giao-viec-smoke.mjs` ghim ba câu **đã cứu được một
lượt thật** phải còn nguyên trong cả ba đề bài ghép ra.

### Trang có tab **Mô hình** — ba khối, và vòng ngược

Mọi tab khác trả lời *"repo đang thế nào"*. Không tab nào trả lời *"cái này VẬN HÀNH ra sao"*
— mà đó là câu đầu tiên của bất kỳ ai mới nhìn thấy nó. Ba khối: **dữ liệu lõi** (luật · máy ·
trạng thái) → **protocol** (ba việc giao được) → **repo đích**, cộng **vòng ngược** từ repo
đích về sổ nợ của lõi. Suy hoàn toàn từ dữ liệu: protocol đọc từ `docs/protocols`, ba việc
đọc từ bảng `VIEC` của `giao-viec.mjs`, repo đích đọc từ `docs/migrations`.

### Rà lại bốn protocol: một lỗi cũ lộ ra

`CHUYEN-REPO-LEN-CHUAN.md` để tiêu đề **"Sáu bước"** trên một danh sách **tám** bước — hai
bước thêm sau mà không ai sửa tiêu đề. Một phiên đọc "sáu bước" rồi dừng ở bước 6 là bỏ đúng
hai bước không được bỏ (hồ sơ migrate · ghim phiên bản). **Lần thứ sáu** repo gặp đúng hình
dạng lỗi này: luật trỏ tới một thứ không khớp thực tế.

## 1.3.13 — 2026-09-06 — Bộ nâng cấp mang cả tài liệu, và bộ sinh DỪNG trước khi ghi nhầm

Hai lỗi do lượt nâng `ALL_SKILL_MANAGEMENT` lôi ra, vá cả hai. Cùng một hình dạng:
**một lớp bảo vệ chỉ chạy được nửa đường.**

### `upgrade.mjs` nay so cả tầng TÀI LIỆU

Trước bản này nó chỉ đẩy tầng máy, nên mọi repo đã lắp **đóng băng ở tầng tài liệu**
tại thời điểm lắp — bộ khung thêm sổ tay bao nhiêu cũng chỉ tới repo dựng mới.

Ba trạng thái, in **riêng** khỏi bảng tầng máy:

| | Làm gì |
|---|---|
| `THIẾU` | mang sang — không có gì để mất |
| `KHÁC` | **chỉ kể tên, KHÔNG BAO GIỜ ghi đè** |
| `ĐÃ MỚI` | không làm gì |

In riêng là cố ý: trộn vào bảng tầng máy là mời người đọc tưởng `KHÁC` ở tài liệu cũng
sẽ bị ghi đè như `CŨ` ở máy. Tài liệu là chữ repo đích **được phép sửa** cho nghề của
mình — ghi đè là xoá việc của người ta, và `upgrade.mjs` tồn tại chính vì nó từ chối làm thế.

### Bộ sinh DỪNG TRƯỚC KHI GHI khi `generated_names` trên đĩa khác HEAD

Bộ sinh đọc cấu hình **từ HEAD** — cố ý, để trang luôn suy ra từ trạng thái đã commit.
Nhưng `generated_names` quyết định **nó ghi vào file nào**. Nên khai tên mới rồi chạy
ngay trước khi commit thì nó dùng tên CŨ, và **ghi đè đúng cái file mà `generated_names`
sinh ra để bảo vệ**.

Vấp thật, và vấp bởi chính người vừa vá KHUNG-26: bảng viết tay 123 dòng ở
`ALL_SKILL_MANAGEMENT` bị đè, md5 đổi từ `0b41e4d3…` sang `673f36df…`.

Bộ sinh **có** cảnh báo thứ tự — nhưng in ra **SAU khi đã ghi**.
**Cảnh báo sau khi mất là biên bản, không phải cảnh báo.**

Nay: mã thoát **2**, **không ghi một byte nào**, và nói rõ HEAD định ghi vào đâu, đĩa
định ghi vào đâu. Chỉ chặn đúng khối đó — sửa dở phần khác của cấu hình không làm mất
file nào nên vẫn chỉ cảnh báo như cũ.

Đọc đĩa là một **ngoại lệ hẹp** (`readDia`), dùng đúng MỘT chỗ. `F19` **đếm số lần gọi**
để lời hứa *"trang suy ra từ HEAD"* không bị nới dần.

### Đột biến kiểm bắt được HAI phép kiểm trang trí của chính lượt này

1. Vế kiểm thứ tự dò chuỗi `tenMaySinhLech(deps)` — mà chính **dòng khai báo hàm** cũng
   chứa chuỗi đó và luôn nằm trước chỗ ghi. Nên nó **luôn xanh** dù có đổi chỗ hay không.
2. Vế kiểm KHUNG-28 chỉ gọi hàm so sánh, không chạm vòng ghi. Phá hẳn vòng ghi mà không
   gì đỏ. Phải thêm một vế chạy `--apply` **thật** trên một repo đích thật.

*Một phép kiểm không thể đỏ và một phép kiểm đúng trông giống hệt nhau trên bảng* — lần
thứ hai trong một ngày.


## 1.3.11 — 2026-09-06 — Bộ khung thôi bắt chủ nhà dọn phòng, và bản trích mang đủ hai file repo mới cần nhất

Hai lỗi do lượt migrate `ALL_SKILL_MANAGEMENT` lôi ra hôm qua, vá cả hai.

### Ba artifact máy sinh nay KHAI TÊN ĐƯỢC

```json
"generated_names": { "dashboard": "BANG-MAY-SINH.md", "llms": "cong-vao.txt", "repo_map": "ban-do.json" }
```

Trước bản này, `DASHBOARD.md` · `llms.txt` · `repo-map.json` đóng cứng trong code. Repo
đích đã có file trùng tên thì chạy bộ sinh **một lần** là đè mất — và đè **im lặng**.
Vấp thật: `ALL_SKILL_MANAGEMENT` có một bảng theo dõi **viết tay 123 dòng**, có mirror
sang Google Sheet, được ba file khác trỏ tới. Cách duy nhất là đổi tên file của repo đích,
tức **bộ khung là khách mà bắt chủ nhà dọn phòng**.

Khai thiếu khoá nào thì khoá đó dùng mặc định. Đầu vào sai **bị từ chối thẳng**, không
lùi về mặc định im lặng — đúng cái lỗ `budget` đã mắc và đã vá 05/09: gõ sai tên khoá, để
dấu gạch chéo, hay khai hai artifact trùng tên đều đỏ ngay lúc đọc cấu hình.

`F17` dựng một **repo git thật**, khai ba tên riêng, trồng một file viết tay mang tên cũ,
rồi đòi bộ sinh ghi đúng ba tên đã khai **và** file viết tay không suy suyển. Vế đối chứng
quan trọng nhất: repo **không** khai thì hành vi cũ y nguyên — không có vế đó thì bản vá
này có thể làm đỏ hàng loạt repo đang chạy bình thường.

### Bản trích mang `LEGEND.md` và `HUONG-DAN.md`

Hai file **repo mới cần nhất** — một cuốn từ điển cho `gate` · `claim` · `lane` ·
`fail-closed`, và một bản hướng dẫn cho phiên AI đầu tiên. Repo vừa lắp bộ khung là lúc
cần nhất, và trước bản này là **lúc duy nhất không có**.

`LEGEND.md` chép nguyên văn. `HUONG-DAN.md` qua một bộ lọc **cắt theo KHỐI, không theo
dòng**: bỏ một dòng lệnh mà để lại tiêu đề với bảng giải thích thì người đọc thấy một mục
cụt, còn khó hiểu hơn là không có mục nào. Ba thứ bị cắt vì repo đích không có:
`npm run assess` · khoá vùng `_template` · câu tự giới thiệu "bộ khung này".

`F18` ghim cả hai chiều, kèm vế đối chứng *"bộ lọc cắt quá tay"*.


## 1.3.10 — 2026-09-06 — Cổng KHUNG-25 thôi bắt oan dòng chỉ ĐỔI CHỖ trong file

Bản 1.3.8 cho `HANDOFF.md` xoá dòng khi có bản khớp byte trong kho lưu trữ. Chạy thật
ngay hôm sau thì nó **ĐỎ OAN**: một dòng bị đẩy từ giữa file lên đầu file bị tính là
dòng bị xoá.

`git diff` không phân biệt "xoá" với "dịch chỗ" — cả hai đều in ra một cặp `-`/`+`.
Bản đầu chỉ đọc cái `-` rồi kết luận mất chữ.

**Một cổng bắt oan cũng nguy hiểm như một cổng bỏ sót: người ta học cách bỏ qua nó.**

Nay trước khi kết luận "mất chữ", cổng hỏi thêm một câu: *dòng đó có còn trong chính
file không?* Còn thì không mất gì cả. Xoá hẳn — không còn trong file, không có trong
kho — thì **vẫn ĐỎ**.

Vế 6 của khối 9 ở [tests/cong-do-that.mjs](tests/cong-do-that.mjs) ghim cả hai chiều,
và **hai nửa điều kiện được đột biến kiểm RIÊNG**: bỏ vế "còn trong file" thì đỏ oan
trở lại; bỏ vế "có trong kho lưu trữ" thì việc dời chỗ thật bị chặn. Không nửa nào thừa.


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
