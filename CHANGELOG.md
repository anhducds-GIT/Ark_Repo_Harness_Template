# CHANGELOG

> Mỗi bản một khối. **Chỉ thêm, không sửa khối cũ.** Máy đọc file này để dựng mục Nhật ký trên
> bảng, nên giữ đúng định dạng: `## <phiên bản> — <ngày> — <một câu>`.

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
