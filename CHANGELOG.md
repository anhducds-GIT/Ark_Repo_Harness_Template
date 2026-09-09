# CHANGELOG

> Mỗi bản một khối. **Chỉ thêm, không sửa khối cũ.** Máy đọc file này để dựng mục Nhật ký trên
> bảng, nên giữ đúng định dạng: `## <phiên bản> — <ngày> — <một câu>`.

## 1.8.4 — 2026-09-10 — Điều kiện "đã qua audit độc lập" lần đầu có máy canh

**`AGENTS.md` mục 2 cho tự đẩy khi đủ ba, trong đó điều ⑵ là *"cổng XANH TOÀN BỘ, code thì đã qua
audit độc lập"*.** Vế cổng-xanh có máy canh từ lâu — `safe-push` đọc dấu cổng. Vế **đã-qua-audit**
thì **không có gì canh**: không cờ, không trường, không phép kiểm. Nửa câu luật là chữ.

**Ca thật, đo được ngày 10/09, và nó xảy ra ~20 phút sau khi lời cảnh báo được ghi ra giấy:** lane
`harness-loi-02` commit 5 lượt bản vá lõi, ghi rõ trong `HANDOFF.md` *"chưa qua audit — đừng
`--carry`"*. Lane `harness-migrate-3repo` chạy `safe-push` và cuốn cả 5 lên `origin/main`. **Lane
đó không làm gì sai:** cổng của họ xanh, mọi commit đều mang nhãn `Lane:` — đủ đúng ba điều kiện mà
**máy** biết kiểm. Lời cảnh báo nằm ở Tầng 2, và không lane nào phải đọc nhật ký của lane khác
trước khi đẩy.

**Nhãn `Audit:`** — nhà của nó là `auditFromMessage` trong `repo-structure.mjs`, cạnh
`laneFromMessage`. `safe-push` từ chối đẩy khi có commit **tự khai** `Audit: chua-co`.

| Quyết định | Tránh cái gì |
|---|---|
| KHÔNG khai = KHÔNG chặn | chặn tuốt là khoá repo ngay lượt đầu — đúng bẫy 509 commit cũ không nhãn |
| `Audit:` **rỗng** = chưa duyệt | gõ nhãn rỗng để qua cửa là biến chính nhãn thành đường lách |
| `--carry` **KHÔNG** mở được | Đức chốt 09/09 là về **quy thuộc**, không về **duyệt** |
| Cờ riêng `--duc-duyet-chua-audit` | hai điều kiện khác nhau thì hai cờ khác nhau |

Kèm một dòng **⚠ tự dạy** lúc sắp đẩy code mà không commit nào khai `Audit:` — cùng khuôn với khối
⚠ nhãn `Lane:`, **không đổi mã thoát**. Một nhãn không ai biết là có thì không ai gõ, và chỗ dạy rẻ
nhất là đúng lúc người ta sắp đẩy, không phải một dòng thêm vào sổ tay.

**KHÔNG thêm chữ nào vào `AGENTS.md`** — chính hiến pháp nói *"cơ chế nào máy tự chặn và tự giải
thích lúc hỏng thì không nằm ở đây"*. Lời từ chối tự nói đủ ba đường ra.

Ghim: `dau-suite-smoke.mjs` **17 → 18 vế** (năm vế, kho riêng). Ba đột biến: gỡ cửa · cho `--carry`
mở cửa · chặn tuốt — mỗi lượt ĐỎ đúng vế của nó.

**GIỚI HẠN:** nhãn do người sửa **TỰ KHAI**. Nó không chứng minh đã có audit; nó làm một lời tự
khai *"chưa duyệt"* đi được tới máy. Bản chặt hơn là `Y-02`.

## 1.8.3 — 2026-09-10 — Audit độc lập bắt được một FAIL-OPEN của 1.8.2, và nó chỉ nổ ở repo TIÊU THỤ

**Bản này tồn tại vì audit độc lập làm đúng việc của nó.** 1.8.2 vá chỗ cổng gọi một suite xanh là
ĐỎ. Cách nó nhận ra "suite xanh" là khớp `/(\d+) passed, 0 failed, \d+ total/` — **một dòng tổng
bất kỳ**. Ở repo NHÀ vô hại: bộ chạy chỉ in dòng đó khi cả chuỗi xanh, và mọi lượt đỏ đều in
`── <suite> (mã N) ──`.

**Nhưng cổng này ĐƯỢC PHÁT ĐI, và ở repo tiêu thụ `scripts.test` là runner KHÁC** — jest, vitest,
script riêng. Ca hỏng đã dựng và đo: một runner in

```text
PASS  du-an-1
12 passed, 0 failed, 12 total
FAIL  du-an-2
```

rồi thoát 1, **không có tiêu đề `──` nào** → bản 1.8.2 hạ một suite **ĐỎ THẬT** xuống BỎ. Đúng
hướng fail-OPEN, tức hướng nặng.

**Vá:** cổng chỉ tin **bằng chứng DƯƠNG của chính bộ chạy** — hậu tố `— SUITE XANH` (chỉ
`chay-test.mjs` in, và chỉ khi CẢ chuỗi xanh) **và** không có chuỗi `SUITE ĐỎ`. Runner lạ không in
hậu tố đó nên rơi về ĐỎ.

**Hai chỗ nữa audit nêu, đều là hướng fail-open, đều đã chặn:**

- `nhanHopLe` dùng `[].every(Boolean)` → trả `true` cho Set RỖNG, tức *"quy thuộc được"* khi không
  nhãn nào đứng tên. Hôm nay không tới được (chỗ điền Map luôn `.add` ngay sau `set`), nhưng thêm
  `size > 0` là một token. Không có fixture — **không dựng nổi ca hỏng**, và điều đó được ghi thành
  chữ ngay tại chỗ thay vì để lượt sau tưởng đã có phép kiểm.
- `rootMine` / `rootTouched`: **đã xoá**. Chỗ dùng duy nhất là `rootIsMine`, biến không ai đọc.
  Audit nêu nó như một chỗ nghĩa có thể lệch sau khi `myRootAreas` được nới — nghĩa của code chết
  thì không lệch được, nên đường rẻ nhất là xoá.

Ghim: `dau-suite-smoke.mjs` **16 → 17 vế**. Đột biến: trả điều kiện về đúng nghĩa 1.8.2 → vế mới
ĐỎ với câu *"đây là FAIL-OPEN"*.

**Audit KHÔNG ký nghiệm thu.** Nguyên văn ba câu: *"chưa đủ bằng chứng để nghiệm thu"* — vì sandbox
Codex trên máy này không đọc được repo, nên nó chỉ thấy `git diff` chứ không thấy thân các phép
kiểm. `KHUNG-15` và `KHUNG-53` vẫn **MỞ**. Hai chỗ nó nêu mà chưa dựng nổi ca hỏng: `KHUNG-58`.

## 1.8.2 — 2026-09-10 — `KHUNG-15` tìm ra gốc: dấu xác nhận băm cả bảng quyền, nên 29 phút mất trắng

**Đây là bản đáng phát đi nhất trong ngày**, vì cái nó chữa thu thuế ở **mọi** repo có nhiều hơn
một lane, và nó chữa một chỗ cổng **nói sai**.

`KHUNG-15` mở từ 05/09: *"cổng báo Test xanh ĐỎ trong khi mọi suite exit 0"*, và **chập chờn**.
Đo trọn trong một phiên 09→10/09, cả ba lượt trên cùng một cây làm việc:

| Lượt | Thời gian | Suite | Dấu | Cổng nói |
|---|---|---|---|---|
| `npm test` #1 | 514.8s | 22/22 xanh | không ghi được | — |
| `npm test` #2 | 524.2s | 22/22 xanh | không ghi được | — |
| cổng đóng phiên | 702s | 22/22 xanh | không ghi được | **"suite gốc repo ĐỎ"** |
| | **29 phút** | **0 đỏ** | **0 dấu** | **1 kết luận sai** |

**Gốc bệnh, hai lớp:** ⑴ `dauCay()` băm `.agents/claims.json`, mà file đó bị **MỌI lane** ghi lại ở
mỗi lượt `--sua` / `--xong` — nên trong repo hai lane, dấu **không bao giờ ghi được**. ⑵
`chay-test.mjs` trả **mã 2** khi thiếu dấu dù suite xanh; cổng thấy mã ≠ 0 rồi báo *"suite gốc repo
ĐỎ → không đọc được TÊN suite đỏ"*. Không đọc được tên vì **không có suite nào đỏ**. Và *chập chờn*
giải thích xong: nó phụ thuộc lane khác có gõ trong cửa sổ ~9 phút hay không.

**Vá ⑴ — băm bỏ FILE HÀNH CHÍNH.** Không phải luật mới: repo đã ghim đúng ý đó từ 06/09 —
`isBehaviourFile(".agents/claims.json") === false` (`tests/core-contract.mjs`, sau ca thật commit
`fa7e8a7`). Chỉ là `chay-test.mjs` chưa hề nghe. Nay khái niệm có **một nhà** —
`FILE_HANH_CHINH` trong `repo-structure.mjs` — dùng chung bởi bộ đếm hành vi và bộ chạy suite, nên
hai bản không lệch được nữa. Mọi file KHÁC vẫn băm nguyên, và **dàn** bảng quyền vào index thì hết
được miễn.

**Vá ⑵ — cổng thôi gọi một suite xanh là ĐỎ.** Nó trả **BỎ** kèm đúng lý do, nên **vẫn không được
báo xong** (mã 2). Chỉ đổi LỜI, không đổi độ chặt. Fail-closed hai lớp: chỉ hạ xuống BỎ khi
**không** bắt được tên suite đỏ nào **và** có dòng tổng xanh tường minh.

**Ba lớp bảo vệ KHÔNG bị nới, và có ca hỏng chứng minh:** file nguồn đổi giữa lượt vẫn không được
cấp dấu · cây đổi trong lúc cổng chạy vẫn không được cấp bằng chứng xanh · suite đỏ THẬT vẫn bị
gọi đúng tên là ĐỎ.

Ghim: `dau-suite-smoke.mjs` **14 → 16 vế**. Ba lượt đột biến trên bản chép cách ly, mỗi lượt revert
đúng một chỗ, mỗi lượt ĐỎ đúng vế của nó — kể cả hướng **fail-OPEN**.

**CHƯA QUA AUDIT ĐỘC LẬP** (Codex hết lượt tới 01:25). `KHUNG-15` và `KHUNG-53` đều để **MỞ**.

## 1.8.1 — 2026-09-09 — Cổng thôi đòi khoá VÙNG cho mọi commit; nhãn `Lane:` là câu trả lời

**Vì sao có bản này:** tầng máy đổi thì **buộc** phải tăng số — `build-template.mjs` từ chối phát
khi một số phiên bản trỏ tới hai nội dung khác nhau. Không phải một bản phát theo kế hoạch.

Từ 08/09 mặc định là **khoá mức FILE**, trả ngay sau commit. Nhưng cổng đóng phiên vẫn đi tìm câu
*"ai đứng tên việc này"* trong bảng khoá **VÙNG** — thứ trống một cách hợp lệ vào đúng lúc cổng
chạy. Nên một phiên làm **đúng** luật mới vẫn bị ĐỎ, và phải nhận lại khoá vùng chỉ để đóng phiên.
Đo 08/09: 4 khoá vùng cho 6 lượt commit.

Nay nhãn `Lane:` của **chính phiên đang hỏi** cũng là một câu trả lời, y như nhãn của người khác
(`ADR-0012` mục ⑷). Đổi đúng một điều đó; chiều fail-closed giữ nguyên từng vế — commit **không
nhãn** vẫn ĐỎ, sửa còn trong **cây làm việc** vẫn ĐỎ.

**Nửa thứ hai, mục nợ chưa nêu:** `rootSuite` cũng suy từ `myRootAreas`, nên phiên chỉ dùng khoá
file có mục *"Test xanh"* rơi vào **BỎ**. Đây là vế **SIẾT LẠI**: trước bản này, phiên đó thoát cả
*Test xanh*, *ghi Log HANDOFF*, và *vùng chỉ-thêm* — trong im lặng.

Phép ghim: `cong-do-that.mjs` khối 1 (1 → **3 vế**) và khối 7 (3 → **4 vế**). Ba lượt đột biến trên
bản chép cách ly, mỗi lượt revert đúng một dòng, mỗi lượt ĐỎ đúng vế của nó.

**CHƯA QUA AUDIT ĐỘC LẬP.** Codex hết lượt dùng tới 10/09 01:25; mục 5 cấm người sửa tự ký nghiệm
thu. Nên `KHUNG-53` để **MỞ**, và bản này **chưa đẩy** — chờ Đức chốt.

**Một chỗ hở ghi ra cho rõ:** sổ này nhảy từ **1.3.50 → 1.8.1**, các bản 1.4–1.8.0 không có khối
nào. Lịch sử của chúng nằm ở `RELEASE-LEDGER.json` và `git log`, không ở đây.

## 1.3.50 — 2026-09-08 — Xoá 1.716 dòng sổ quyền chưa ai gọi, và trần sổ nợ lần đầu có máy canh

Đức uỷ quyền chốt hai câu treo lại từ đêm trước. Cả hai chốt **ngược với dự đoán** ghi trong bản
giao việc, và lý do là số đo chứ không phải đổi ý — [ADR-0010](docs/adr/0010-xoa-so-quyen-va-tran-so-no.md).

### Xoá sổ quyền — vì cái nó định chặn thì đã có chỗ chặn rồi

Bản giao việc hỏi *"nối sổ quyền vào đường ghi khoá, hay xoá?"* và nghiêng về **nối**. Đo trước
khi gõ:

- `scripts/quyen.mjs` **không được gọi từ đâu cả** — chỉ chính nó và test của nó.
- `refs/ark/quyen` **chưa từng tồn tại trên remote**: sổ chưa ghi một dòng nào trong đời.
- Nó **không nằm trong `template/`**, nên không repo nào khác nhận được.
- Và `claim.mjs:400` **đã có mutex thật** bằng `mkdir` (nguyên tử trên mọi hệ điều hành), dọn khoá
  mồ côi 30 giây, đọc lại bảng sau khi có khoá, nhả trên mọi đường ra.

Số cuối là số quyết định. Tôi chỉ thấy nó vì **mở file ra đọc trước khi sửa** — nếu không thì đã
cài một khoá độc quyền **thứ hai** vào cùng một đường ghi, đúng thứ giới hạn ② cấm.

Xoá `scripts/quyen.mjs` (787 dòng) + `tests/quyen-sau-ca.mjs` (929 dòng), gỡ khỏi `npm test`.
`KHUNG-45` đóng theo — **đóng vì thứ mang lỗi đã đi, không phải vì đã vá.**

**Mất gì, nói thẳng:** mất phân xử giữa **nhiều máy** (mutex chỉ chặn trong một cây làm việc — đủ
cho hôm nay, không đủ ngày có máy thứ hai), và mất vế cưỡng chế bằng máy của bất biến *"người sửa
không tự nghiệm thu bản sửa của mình"* (ADR-0008) — từ nay nó là **chữ**.

### Trần sổ nợ 25, và lần này cổng canh

Repo kia đặt trần 15 **không cưỡng chế**: mục thứ 11 vào sổ, không gì đỏ lên, trần phải nâng sau
khi đã vỡ. Một con số không có máy canh không phải trần, nó là lời khuyên.

Phép kiểm thứ **12** của cổng đóng phiên: *"Sổ nợ dưới trần"*. Trần khai ở `backlog.tran` của
`.repo-structure.json` (repo này: **25**, đang mở **23**). Bộ đếm **dùng lại** `parseBacklog` của
`what-next.mjs` — không viết bộ thứ hai, vì quy ước đóng mục nằm trong đó và hai bản sao của một
quy ước đã trả hai câu khác nhau một lần rồi (`KHUNG-46`).

**Repo không khai `backlog.tran` thì phép kiểm XANH.** Bản khung phát đi không đặt trần hộ ai.

Ghim ở `tests/cong-do-that.mjs` khối 10, chứng minh **cả ba chiều**: vượt trần ĐỎ · gạch mã một
mục XANH lại · không khai trần XANH. Vế giữa là vế dễ hỏng nhất — bộ đếm không hiểu quy ước đóng
thì cổng đỏ vĩnh viễn và người ta sẽ tháo nó ra. Hai đột biến đều bị bắt.

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


---

**Phần CŨ hơn đã dời sang kho lưu trữ** — [`docs/archive/`](docs/archive/) · chữ giữ nguyên từng dòng, cắt bằng `npm run don`.

## 1.7.1 — 2026-09-09 — Sửa bằng chứng suite/cổng và cô lập test ledger

Dấu suite ghim nội dung file thay đổi và index; sửa tiếp file đã bẩn cũng hết hiệu lực. Suite và cổng chỉ cấp dấu khi cây trước/sau lượt chạy khớp. Tự carry dùng kết quả toàn cổng của đúng phiên và mốc remote, không dùng dấu suite thay thế. Test upgrade phá ledger trong clone riêng có lịch sử Git.

Không đổi rules, flow compile, trần context, lệnh vận hành hay số mục cổng. Audit độc lập mã `e46492a`: PASS; 14 ca dấu/cổng, 24 ca upgrade và 9 ca template-null đạt.
