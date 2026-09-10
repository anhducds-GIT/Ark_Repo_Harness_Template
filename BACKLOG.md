# BACKLOG — sổ nợ của repo bộ khung

> **Vì sao có file này:** `AGENTS.md` mục 0 bước 2 bắt mọi phiên *"việc ngoài phạm vi → ghi vào
> `BACKLOG.md`, không tự làm"*. `MULTIFLOW.md` trỏ theo, và `what-next.mjs` đọc nó ở 6 chỗ.
> **Nhưng tới 2026-09-05 file này chưa từng tồn tại.** Nên suốt từ đầu, luật bảo AI ghi nợ vào
> một chỗ không có, và `npm run what-next` báo *"0 việc mở"* cho mọi vùng — không phải vì hết
> việc, mà vì không có chỗ để việc rơi vào. Đây đúng bệnh repo này từng bắt với `claim.mjs`:
> *luật trỏ tới thứ không tồn tại thì nó không phải luật, nó là chữ.*

**Quy ước sổ — `what-next.mjs` đọc đúng ba thứ này, sai một ký tự là mục biến mất:**

- Nhóm ưu tiên: một dòng `## P1` … `## P9`. Mục nằm dưới nhóm nào ăn ưu tiên nhóm đó.
- Mỗi mục: `### KHUNG-<số> · <tiêu đề>`.
- Đóng một mục: **gạch ngang mã** — `### ~~KHUNG-1~~ · …`. Giữ lại, đừng xoá: sổ còn dùng để
  tra lịch sử. Viết `ĐÓNG` mà quên gạch thì lệnh **nêu tên mục đó** là khai sai, không im lặng.

---

## P1

### KHUNG-66 · `fileScriptCanChep` bị bỏ khỏi lõi — 3 file test ở một repo đích KHÔNG NẠP ĐƯỢC

Lượt migrate `0.3.0 → 1.8.0` xoá export `fileScriptCanChep` khỏi `scripts/repo-structure.mjs`.
`Chrome_Extension_AI_Agentic` có **3 file test của riêng nó** import cái đó — `build-dashboard-smoke.mjs`,
`dashboard-dirty-repo-regression.mjs`, `dau-vet-vung-smoke.mjs` — nên chúng **không nạp nổi một dòng**.
Cổng bên đó vẫn XANH vì nó chỉ chạy suite của gói, không chạy suite gốc — tức một việc **im lặng
không chạy**, đúng loại "đồ trang trí" mà luật vàng 2 cấm.

Lịch sử: lane `claude-gpt-chay-het-job` đã tìm ra và **cố tính không tự sửa** (10/09, commit
`ab88c78e` ở repo đó), lý do ghi rõ: đoán xem hàm đó trở thành gì là đúng loại lỗi họ vừa phải
revert một lần. Tôi giữ nguyên quyết định đó: không bị bản trích nào cần tới, nên **lõi không thiếu
gì** — câu hỏi thật là API này có nên có lại không, và đó là việc của vai ② mang về, không phải
của vai ① đoán hộ.

**đóng khi:** hoặc lõi có lại một hàm tương đương **kèm một phép ghim**, hoặc 3 file test ở repo
đích đổi sang đường khác và **chạy thật được** — đo bằng `node <file>` trả 0, không bằng cổng xanh.

### KHUNG-65 · Mục nhật ký viết ở mức `###` LÁCH ĐƯỢC trần byte — và trần đó đi đòi lane khác

`scripts/handoff.mjs` tách mục bằng `RE_TIEU_DE_MUC = /^##[ \t]/`, tức **đúng hai dấu `#`**. Một
mục mở bằng `### ` không khớp, nên nó bị **gộp vào mục `## ` phía trên** và biến mất khỏi bộ đếm
byte của riêng nó.

Hai hệ quả, cả hai đo được 10/09:
1. **Lách trần.** Viết `###` là mục dài bao nhiêu cũng không bị trần 2600 byte chạm tới.
2. **Chặn oan lane khác.** Mục `## …harness-migrate-3repo…` dài 1329 byte, mục `### …harness-loi-02…`
   ngay dưới dài 2590 — cổng báo **3918 byte** và **quy cho lane migrate**. Người bị chặn không
   phải người viết phần thừa, và câu cổng in ra chỉ đúng tên của người vô can.

Trong `HANDOFF.md` hiện có nhiều mục cũ ở mức `###`; chúng đã ở trên `origin` nên không tính là
"mục MỚI", tức lỗ này im lặng cho tới lúc có ai viết mục mới ở mức đó.

**đóng khi:** một mục mở bằng `###` bị bộ đếm nhìn thấy như một mục RIÊNG (hoặc bị từ chối thẳng
với tên lỗi nói rõ phải dùng `##`), kèm một phép ghim dựng hai mục `##` + `###` cạnh nhau và đòi
byte quy đúng cho từng mục.

### KHUNG-64 · [FAIL-OPEN] Miễn suite cho file mà KHÔNG bộ sinh nào kiểm — audit xếp loại A, không phải B

Cổng miễn suite cho commit chỉ-sinh-lại-artifact. Từ 10/09 lời miễn chỉ còn hiệu lực khi
`generators` KHÔNG rỗng — nhưng điều kiện ấy đếm **số bộ sinh**, không đối chiếu **từng file**:
chỉ cần `generators` có một phần tử là **toàn bộ** `generated` vào tập được miễn.

Ca hỏng: repo khai `generated: ["BAO-CAO.md"]` mà không bộ sinh nào đẻ ra `BAO-CAO.md`. Commit
bất cứ nội dung gì vào file đó vẫn **được miễn suite**, và mục "Sự thật máy sinh còn tươi" cũng
không đối chiếu nó (bộ sinh chỉ kiểm bản ra của chính nó). Hai lớp cùng nghĩ lớp kia đang canh.

**Kiểm toán độc lập vòng sáu (10/09) bác cách tôi xếp loại:** *"Đây là đường bảo vệ không chạy,
không chỉ là độ mạnh của phép ghim. Ghi sổ nợ không đổi phân loại này."* Đúng — nên mục này mang
nhãn `[FAIL-OPEN]`, không nằm chung với nhóm góp ý.

**VÌ SAO CHƯA VÁ, và đã cân nhắc xoá.** Đường lười nhất là bỏ hẳn nửa artifact của lời miễn trừ,
chỉ giữ file hành chính — sau `R1` repo nhà và bản trích đều khai `generators: []` nên nửa đó là
mã chết **ở đây**. Nhưng nó KHÔNG chết ở đội hình: `upgrade` chỉ thay tầng máy, còn
`.repo-structure.json` là file của repo đích, nên 5 repo đã migrate vẫn khai
`generators: ["build-dashboard.mjs"]` và vẫn commit artifact. Xoá là commit sinh-lại-bảng của họ
thành "chưa kiểm" — chặn cổng của người khác để dọn một chỗ hở của mình.

**Phơi ra khi nào:** phải có ai khai vào `generated` một file không bộ sinh nào sinh ra. Bản trích
khai đúng ba file `build-dashboard.mjs` sinh ra, nên hôm nay không repo nào trong đội hình ở trạng
thái đó. Câu cổng in ra đã nêu thẳng giới hạn này thay vì nói "artifact có chỗ canh".

**đóng khi:** một file khai trong `generated` mà không bộ sinh nào nhận là bản ra của mình thì
cổng ĐỎ (hoặc không được miễn suite) — kèm phép ghim dựng đúng ca đó và ĐỎ khi gỡ bản vá. Cần một
bảng khai "bộ sinh nào đẻ ra file nào"; đó là việc sau `R11`, không phải giữa lúc đóng băng.

### KHUNG-63 · Trang tổng quan nhúng "giữ N phút" — bộ sinh đọc ĐỒNG HỒ, nên lane giữ khoá KHÔNG BAO GIỜ xanh nổi cổng

Đo 10/09, dựng lại được mọi lượt. `build-overview.mjs` in thời gian giữ khoá qua `ageLabel()`
(`claim.mjs:569`), và giá trị đó tính từ `Date.now()`. Nên trang **tự lệch mỗi phút** dù không
một dữ liệu nào trong repo đổi:

```
- ... giữ khoá `_code` · giữ 44 phút      (bản đã commit)
+ ... giữ khoá `_code` · giữ 55 phút      (sinh lại, cùng HEAD, cùng bảng quyền)
```

**Hệ quả là một vòng không lối ra, không phải một chỗ xấu xí.** Cổng đòi *"sự thật máy sinh còn
tươi"*; muốn tươi thì sinh lại rồi commit; commit xong dấu xác nhận suite mất hiệu lực nên cổng
chạy lại **19 phút** (`template-null-repo` 525s + `cong-do-that` 462s + `upgrade-smoke` 454s); 19
phút sau con số phút đã đổi và trang lại cũ. **Lane nào giữ khoá vùng thì không bao giờ đóng
được phiên** — trong khi luật lại bắt giữ khoá cho tới khi ĐÃ ĐẨY.

Ba repo migrate hôm 09/09 không dính vì `generators` của chúng chỉ khai `build-dashboard.mjs`
(không in thời gian giữ). Nó chỉ nổ ở repo có `build-overview.mjs` trong `generators` — tức repo
nhà, và `n8n-orchestrator`.

**Lỗi này đã có tên sẵn trong repo.** Đầu `build-so-migrate.mjs` viết đúng nó: *"Bộ sinh nhìn
ĐỒNG HỒ thì sang ngày mới là bản sinh lại lệch bản đã commit dù không một dữ liệu nào đổi, và
MỌI phiên bị chặn đẩy"* — và file đó đã chữa bằng `mocHEAD()`. `build-overview.mjs` chưa chữa
cho ô thời-gian-giữ-khoá.

**đóng khi:** sinh lại `DASHBOARD-*.html` hai lần cách nhau ≥ 2 phút trên cùng một HEAD và cùng
một bảng quyền cho ra **hai file byte-hệt-nhau**; kèm một phép ghim dựng nổi ca đó (giả đồng hồ,
hoặc hai lượt sinh cách nhau). Mốc thời gian nên suy từ **mốc HEAD**, không từ `Date.now()` —
cùng phép chữa mà `build-so-migrate.mjs` đã dùng.

### KHUNG-62 · Không có cửa máy cho "Đức chốt cho nhả khoá FILE của lane khác" — nên phải MẠO NHÃN

Khoá VÙNG có cửa: `--take <khoá> --as <phiên> --duc-duyet "<câu chốt>"`, ghi lại `taken_from` ·
`taken_by` · `duc_decision`. **Khoá mức FILE không có cửa tương đương.** Đức chốt cho tôi lấy
`_code` trong khi `harness-loi-02` còn hai khoá file bên trong; `--take _code --duc-duyet` **vẫn
từ chối** — cờ đó chỉ áp cho tranh chấp vùng-với-vùng. Đường duy nhất còn lại là
`--xong <file> --as harness-loi-02`, tức **mạo nhãn lane kia**.

**Cái mất không phải cái khoá — là BẢN GHI.** Sau lượt đó bảng quyền nói *"harness-loi-02 tự trả
khoá"*, trong khi người nhả là tôi. Cả bộ khung dựng trên nguyên tắc *mọi thay đổi đều quy thuộc
được*, và đây là lối đi tạo ra bản ghi SAI mà không cảnh báo gì. Sự thật hiện chỉ nằm ở
`HANDOFF.md` — tức nằm ở chỗ máy không đọc.

**đóng khi:** `--xong <file>… --as <phiên> --duc-duyet "<câu chốt>"` nhả được khoá file
của lane khác **dưới nhãn của chính người nhả**, ghi `taken_from`/`taken_by`/`duc_decision` y như
khoá vùng; thiếu `--duc-duyet` thì vẫn từ chối như hiện nay; kèm một phép ghim dựng nổi ca đó.

### KHUNG-61 · Bảy mục luật ở `AGENTS.md` nhà chưa có phép dò — đang MIỄN, không phải đang ĐỦ

Bản 1.8.11 dựng vế `5e`: mỗi mục `##` trong `AGENTS.md` của repo nhà phải có một phép dò
`trong_file`, hoặc một lời miễn có lý do trong `features.json` → `luat_nha.mien`. Cơ chế đã
chạy và bắt được omission (thêm một mục mà quên khai thì ĐỎ). **Nhưng số hiện tại là 2 dò / 7
miễn**, và sáu trong bảy lời miễn ghi thẳng là `NỢ`.

**Vì sao không khai luôn trong cùng lượt.** Phép dò đo bằng CHUỖI. Chọn vội một chuỗi lấy từ
cách hành văn của repo nhà thì mọi repo đích đỏ vì **diễn đạt khác**, trong khi luật của họ có
đủ — đúng ngược lại cái mà `F4.7` đã dạy: đo NĂNG LỰC, đừng đo TÊN GỌI. Sáu chuỗi chọn vội
trong một lượt ngồi là sáu ca báo động giả rải lên năm repo.

**Sáu mục còn nợ:** `0. Ba việc phải làm` · `1. Ai giữ package nào` · `3. Năm luật vàng` ·
`4. Vùng cấm sửa` · `7. Đóng phiên` · `8. Thêm một luật thì bớt một luật`.
*(`6. Sổ tay mở khi cần` KHÔNG nợ — nó cố ý không mang sang, đã ghi lý do.)*

**đóng khi:** mỗi mục trong sáu mục trên hoặc có một mục `trong_file` trong `features.json` mà
chuỗi của nó **đo được ở ít nhất hai repo đích có cách hành văn khác nhau**, hoặc được đổi lời
miễn từ `NỢ` sang một lý do thật *"không mang sang, vì…"*. Và `luat_nha.mien` không còn chữ `NỢ`.

### KHUNG-51 · Suite ĐỘT BIẾN ghi thẳng vào file ĐÃ COMMIT của cây làm việc chính

> **Mục này viết ra với số `KHUNG-47` — TRÙNG với một mục lane `harness-phat-01` vừa thêm cùng
> lúc.** Đổi sang 51 ngay trong cùng phiên. Đây là ca thật của việc hai lane cùng cấp mã trong
> một cây làm việc mà không ai thấy mã của người kia; ghi lại vì nó sẽ lặp.

**Không phải giả định — đã làm hỏng một commit thật hôm nay (08/09).** `tests/upgrade-smoke.mjs`
khối 14 ghi `"1".repeat(16)` đè lên một dòng của `RELEASE-LEDGER.json` **THẬT ở gốc repo**, chạy
ba lệnh để đòi chúng DỪNG, rồi khôi phục trong `finally`. Đúng thiết kế, và đó là một phép ghim
tốt — ở một repo MỘT lane.

Repo này có nhiều lane dùng **chung một cây làm việc**. Trong đúng cửa sổ vài giây đó, lane
`harness-loi-01` chạy `git add RELEASE-LEDGER.json` và **commit c385f4c mang theo dòng hỏng**:
`"1.2.10": "1111111111111111"` thay cho `946065fa2778e0e4`. Sổ phát hành là sổ **CHỈ THÊM** — một
dòng đã phát bị đổi là **nói dối về một bản đã phát**, đúng thứ chính khối 14 sinh ra để chặn.

**Vì sao không ai đỏ:** `finally` khôi phục kịp, nên cây làm việc sạch lại ngay và mọi phép kiểm
sau đó xanh. Chỉ lộ ra vì lượt sau `git status` báo `RELEASE-LEDGER.json` sửa dở — mà nội dung
"sửa dở" chính là bản ĐÚNG. Nhìn ngược.

**Cùng họ với ba file `.gitignore` của `bang-song/`**: thứ nào một tiến trình ghi đè liên tục thì
không được nằm ở chỗ lane khác đang `git add`. Khác ở chỗ đây là file **phải** commit.

Ứng viên rẻ nhất: khối 14 chép cả repo sang thư mục tạm rồi phá bản chép (đắt), hoặc `build-template.mjs`
và `upgrade.mjs` nhận cờ trỏ sang một sổ khác để đột biến không cần đụng file thật.

Vùng: `_code`.

**đóng khi:** chạy `node tests/upgrade-smoke.mjs` trong khi một tiến trình khác đọc
`RELEASE-LEDGER.json` mỗi 50ms, và tiến trình đó **không lần nào** đọc được giá trị `1111111111111111`
— đo bằng một ca dựng sẵn, không suy ra.


### KHUNG-53 · Cổng đóng phiên chưa biết tới khoá mức FILE — vẫn đòi khoá VÙNG cho mọi commit

**Đo 08/09, ngay lượt dùng thật đầu tiên của khoá mức file.** Phiên chạy đúng như Đức chốt — trả
hết khoá vùng, chỉ `--sua` đúng file lúc ghi, `--xong --het` ngay sau — rồi commit. Cổng đóng
phiên ĐỎ ở mục *"Phạm vi trách nhiệm"*:

```
Vùng gốc repo bị sửa nhưng chưa ai đứng tên: _code, _docs, _template.
```

**Nên cơ chế mới chỉ dùng được TRONG LÚC LÀM, không dùng được để ĐÓNG PHIÊN.** Muốn cổng xanh thì
vẫn phải nhận lại đủ khoá vùng — tức phần lớn cái lợi (giữ vài phút thay vì hàng tiếng) bị trả lại
ở bước cuối, và luật mới mâu thuẫn với cổng cũ.

**Vì sao hai bên không tự khớp:** cổng hỏi *"ai chịu trách nhiệm cho những commit này"* và nó tìm
câu trả lời trong bảng khoá VÙNG. Nhưng khoá file **cố ý không mang trách nhiệm truy nguồn** —
`ADR-0012` mục ⑷ nói rõ nhãn `Lane:` mới mang. Vậy cổng đang hỏi bảng khoá một câu mà bảng khoá
không còn là chỗ trả lời.

**Đừng vá bằng cách nới cổng.** Mục *"Phạm vi trách nhiệm"* là thứ chặn việc mồ côi, và gỡ nó là
gỡ một lớp bảo vệ. Hai lối đáng cân nhắc, cả hai phải đo trước: ⑴ cổng chấp nhận **khoá file đã
trả trong phiên này** như bằng chứng đứng tên (đòi bảng giữ lại lịch sử, mà khoá file lại XOÁ HÀNG
khi trả — mâu thuẫn phải giải trước); ⑵ cổng suy trách nhiệm từ **nhãn `Lane:` của chính commit**,
đúng như ADR-0012 nói — lúc đó bảng khoá thôi phải trả lời câu này.

Vùng: `_code`.

**đóng khi:** dựng một repo, chạy trọn một vòng CHỈ dùng khoá file (không nhận khoá vùng nào), rồi
đòi cổng đóng phiên XANH ở mục "Phạm vi trách nhiệm" — kèm đối chứng NGƯỢC: một commit KHÔNG có
nhãn `Lane:` và không khoá nào thì mục đó vẫn phải ĐỎ.

**BẢN VÁ ĐÃ CÓ TRONG HEAD LOCAL 09/09 — MỤC NÀY VẪN MỞ, vì chưa qua audit độc lập.** Người sửa
không tự nghiệm thu bản sửa của mình (`AGENTS.md` mục 5). Codex hết lượt dùng tới 10/09 01:25.

Đã làm: `session-check.mjs` suy trách nhiệm từ nhãn `Lane:` của **chính phiên đang hỏi**, không
chỉ nhãn người khác (`daQuyThuoc`), và `myPackages`/`myRootAreas` nhận cả hai đường đứng tên.
Nửa thứ hai, mục nợ chưa nêu: `rootSuite` cũng suy từ `myRootAreas`, nên phiên chỉ dùng khoá
file có mục *"Test xanh"* rơi vào **BỎ** — cùng gốc bệnh, khác chỗ đau.

Đã đo, ba lượt đột biến trên bản chép cách ly, mỗi lượt revert đúng một dòng:

| Đột biến | Phép ghim ĐỎ |
|---|---|
| `myRootAreas` bỏ phần nhãn `Lane:` | khối 7 vế (d): *"suite gốc PHẢI chạy, đang: BỎ"* |
| chỉ miễn cho nhãn NGƯỜI KHÁC (nghĩa cũ) | khối 1 vế ⑴: *"đang: ĐỎ — chưa ai đứng tên: _docs"* |
| coi commit KHÔNG NHÃN cũng quy thuộc được | khối 1 vế ⑶: *"đường lách, đang: XANH"* |

**còn thiếu để đóng:** một lượt audit độc lập trả lời năm câu — ⑴ bản vá có mở đường lách nào
không · ⑵ `[].every(Boolean)` trả `true`, ca Set RỖNG có tới được không (fail-OPEN) · ⑶ nới
`myRootAreas` làm các phép kiểm khác siết lại hay lỏng ra · ⑷ phép ghim có phân biệt được hai
nhánh · ⑸ có làm cổng đỏ oan một phiên vô tội không.


### KHUNG-14 · Chưa lượt migrate nào đi qua phép thử "assistant onboard"

> `@Đức:bấm` — mở một phiên AI mới ở một repo đã migrate, KHÔNG nhắc gì, và xem nó có tự làm trọn một việc nhỏ tới lúc cổng xanh không. Chừng 15 phút. Không tự động hoá được: cả giá trị của phép thử nằm ở chỗ không ai mớm.

Đức chốt 05/09: lượt migrate **không xong khi cổng xanh**, mà xong khi một phiên AI ở repo đích
nhận được khoá và làm trọn một việc nhỏ tới lúc cổng xanh, không cần ai ở bộ khung giải thích.

Hai lượt 03/09 (`nav_platform_main`, `Project 3 AI Agent Unify`) đều **dừng ở mức cổng xanh** —
tức theo định nghĩa mới thì **cả hai chưa xong việc thứ ba**. Ba phép thử đã viết trong quy trình
migrate; chưa lượt nào chạy chúng. Vùng: *(chạy ở repo đích, không đòi khoá của bộ khung)*.

**NHẬN THÊM KHUNG-3 (gộp 09/09) — nửa ĐO của cùng lượt mở máy.**
**NỬA ĐO ĐÃ XONG 09/09 — `npm run assess` chạy thật trên từng repo:**

| Repo | Khớp bản chuẩn | Thiếu | Lệch tầng máy |
|---|---|---|---|
| `n8n-orchestrator` | 30/60 | 1 (`rule-compiler.mjs`) | 12 file |
| `ALL_SKILL_MANAGEMENT` | 30/60 | — | — |
| `Project 3 AI Agent Unify` | 29/60 | — | — |
| `nav_platform_main` | **không có trên máy này** | | |

**Đọc con số cho ĐÚNG — suýt báo sai:** cả ba đều in `MỨC 1/3 — có luật, chưa có bộ máy`, và
cả bốn hồ sơ migrate đều khai `muc_sau: 3`. Nhìn thế thì tưởng hồ sơ khai vống. **Không phải.**
Ba repo đó *có* bộ máy, chỉ là **bản cũ**: hồ sơ n8n đo ở bộ khung **1.3.67**, nay là **1.3.91**
— 24 bản. `assess` so với bản CHUẨN HÔM NAY nên mọi file cũ đều tính là *lệch*.

**Nhưng đó là một chỗ hỏng THẬT của `assess`, ghi vào đây chứ không mở mục mới:** nó gộp *thiếu
bộ máy* với *bộ máy bản cũ* thành cùng một mức. Một repo đứng yên tụt từ MỨC 3 xuống MỨC 1 chỉ
vì bộ khung đi tiếp — và Đức là người đọc con số đó. **đóng khi:** `assess` phân biệt được hai ca
(thiếu file ≠ lệch bản), và một ca dựng repo đủ file nhưng bản cũ thì KHÔNG bị gọi là *chưa có bộ máy*.
 Hai repo trên migrate 03/09 ở
bản **0.3.0**; nay là **1.3.x**, không ai biết chúng đã trôi bao xa. Đo rẻ, **chỉ đọc, không đòi
khoá nào**: `npm run assess -- <đường-dẫn-repo>` cho từng repo, rồi so với `muc_sau` ghi trong hồ
sơ `docs/migrations/`. Làm phép đo này TRƯỚC phép thử onboard: nếu repo đã trôi xa thì phiên AI ở
đó vấp vì bộ khung cũ, không phải vì đề bài onboard dở — và ta sẽ đọc sai nguyên nhân.

### KHUNG-4 · Ba luật lớn của vai điều phối chưa có phép kiểm máy

`ORCHESTRATOR.md` tự khai: hàng rào chống trượt vai · query-driven · luật nạp báo cáo năm mục —
cả ba **chưa có phép kiểm nào canh**. Ở repo sinh ra sổ này, một phép kiểm cho hàng rào **đã
được viết nhưng chưa đi theo bộ khung**. `AGENTS.md` mục 7: *luật nào máy không kiểm được thì
sớm muộn cũng bị bỏ qua* — nên ba mục đó hiện là quy ước, không phải chốt. Vùng: `_code`.

### ~~KHUNG-6~~ · ĐÓNG 09/09 · Danh tính phiên là thứ TỰ KHAI — ba lớp quy trách nhiệm đều tin lời khai

**Đức chốt 09/09: GHI RÕ GIỚI HẠN, không siết bằng chữ ký.** Đã thêm mục *"Giới hạn: bốn cơ chế
này KHÔNG phải một lớp bảo mật"* vào `docs/protocols/MULTIFLOW.md` — nói thẳng cả bốn lớp (trả
quyền · nhãn `Lane:` · commit thiếu nhãn · báo cáo năm dòng) đều chỉ so chuỗi, và đối tượng đe
doạ là **nhầm lẫn**, không phải kẻ tấn công. Cái hại thật mục này chặn được là **ai đó đọc bốn
cơ chế kia như một lớp bảo mật** — tức tin vào thứ không bảo vệ mình.

> `@Đức:chốt` — chọn một: (a) chỉ GHI RÕ giới hạn vào sổ tay, hay (b) siết thật bằng chữ ký. Hai lối khác hẳn nhau về quy mô.

Audit độc lập Codex 05/09. Cả ba chốt quy trách nhiệm chỉ so chuỗi, không có gì chứng minh
người chạy đúng là người họ khai:

- `claim.mjs` — trả quyền chỉ kiểm `--as` có khớp `owner` không. Phiên B biết tên phiên A là
  chạy được `--release <khoá> --as A`, và bảng quyền tin.
- `safe-push.mjs` — commit thuộc về ai chỉ dựa vào dòng chữ `Lane:` trong thông điệp commit.
- `session-check.mjs` — commit **thiếu** nhãn chỉ bị cảnh báo; `safe-push` khi đó quy về chủ vùng
  hiện tại. Nên sau khi vùng đổi chủ, commit cũ không nhãn **bị quy cho người mới**.

Cần nói thẳng giới hạn trước khi ai đó định "vá": ba cơ chế này sinh ra để chống **giẫm chân do
vô ý** giữa các phiên AI hợp tác, không phải chống **mạo danh cố ý**. Chống mạo danh thật cần
chữ ký, tức một hạng mục khác hẳn. Việc đáng làm trước mắt có thể chỉ là **ghi rõ giới hạn đó
vào `MULTIFLOW.md`**, để không ai đọc bốn cơ chế kia như một lớp bảo mật. Vùng: `_docs`
(nếu chỉ ghi giới hạn) hoặc `_code` (nếu muốn siết thật).

**NHẬN THÊM KHUNG-31 (gộp 09/09):** lớp thứ tư cùng hình dạng — **báo cáo năm dòng** của phiên
nhận việc (`REPO / VIỆC / MÁY / CỔNG / CÒN MỞ`) cũng là lời tự khai, không ai đo lại.
Ca thật 05/09: một phiên audit khai ba lệnh thoát mã `2/1/1`; đo lại **cả ba exit 0**. Đây là ca
hỏng ĐÃ XẢY RA duy nhất trong cả mục này — ba lớp kia mới chỉ là lỗ hổng suy ra được, chưa ai
lợi dụng. Lối đi nếu Đức chọn (b): một lệnh `nghiem-thu` chạy ở repo nhà, trỏ vào repo đích, tự
đo lại đúng năm con số rồi in bảng `KHAI / ĐO ĐƯỢC / KHỚP?`.

### KHUNG-9 · `can-nang.mjs` xác nhận "đã có ca hỏng" bằng cách TÌM CHUỖI

`coCaHong()` chỉ hỏi: tên phép kiểm có xuất hiện đâu đó trong `tests/cong-do-that.mjs` không.
**Một cái tên nằm trong dòng chú thích cũng đủ** để phép kiểm đó được đánh dấu là "đã có ca
hỏng", dù không assertion nào chứng minh nó đỏ được.

Mỉa mai đúng chỗ: đây là công cụ sinh ra để phát hiện *luật chưa từng chặn được gì*, và bản thân
nó đang dùng một phép đo không phân biệt được hai nhánh — chính luật vàng số 2. Vùng: `_code`.

### KHUNG-11 · Repo vượt ngân sách — nay có CƠ CHẾ dọn, không còn là việc làm tay

> `@Đức:chốt` — chọn một: (a) gọt thật và chấp nhận mất nội dung, hay (b) đặt lại ngân sách theo SỐ ĐO hôm nay cộng biên. Nới ngân sách là nới một luật an toàn, mục 2 hàng 6 bắt hỏi.

> **Đức chốt 06/09:** cắt gọn + dời sang lưu trữ, KHÔNG xoá. Đã làm một vòng, mỗi bước có md5
> chứng minh không mất byte: `HANDOFF.md` 1.273→415 · `CHANGELOG.md` 806→241 · `ROADMAP-V1`
> vào lưu trữ. Tổng tài liệu **3.681 → 2.999**. Kèm theo phải vá một mâu thuẫn trong chính
> `can-nang.mjs`: nó bảo dời sang `docs/archive/` trong khi vẫn quét đệ quy cả `docs/` — làm
> đúng lời khuyên thì tổng TĂNG. Nay `docs/archive/` được miễn.
>
> **ĐỨC CHỐT 06/09 — vòng hai: cần CƠ CHẾ dọn, không phải một lượt dọn.** *"Nội dung sẽ luôn
> bị phình sau 1 quá trình."* Đã dựng `scripts/don.mjs` (`npm run don`) và cho đi theo bản trích,
> nên mọi repo migrate cũng dọn được. Ghim ở `tests/don-smoke.mjs`, **bốn vế**, cả bốn qua đột
> biến kiểm. `HANDOFF.md` 1.311 → 598 · `CHANGELOG.md` 335 → 262, không mất byte nào.
>
> **Còn treo, và KHÔNG chặn ai:** còn vượt **799 dòng**, và lối duy nhất còn lại là gọt
> `docs/protocols/ORCHESTRATOR.md` (426 dòng). Tôi KHÔNG tự gọt: mỗi mục trong đó gắn một sự
> cố có thật, khối chú thích cuối file bị `tests/template-null-repo.mjs` ghim, và gọt hết 276
> dòng cũng chỉ còn 2.723 — **vẫn vượt**. Tức 2.200 là con số đặt theo mong muốn, chưa từng
> đặt theo số đo. Hai lối: (a) gọt thật và chấp nhận mất nội dung; (b) đặt lại ngân sách theo
> số đo hôm nay + biên, và ghi rõ vì sao.

`can-nang.mjs` đặt ngân sách tài liệu **2.200 dòng**. **Đo lại độc lập 05/09: 3.198 dòng — vượt
998 dòng, 45%.** (Codex báo 3.169; chênh vì `BACKLOG.md` vừa thêm. Hai lượt đo khớp nhau.)
`AGENTS.md` mục 8 nói rõ: quá ngân sách thì **phải BỚT trước khi nghĩ tới nới**.

Ba con số còn lại vẫn trong ngân sách, nhưng **một con số sát trần đáng để mắt**: thời gian chạy
trọn bộ phép kiểm **174/180 giây**. Còn 6 giây. Thêm một suite nữa là vượt — và đã thấy hệ quả
thật trong phiên 05/09: `npm test` vượt quá thời gian chờ mặc định, phải chạy nền. Phép kiểm
chậm tới mức người ta ngại chạy là phép kiểm sắp bị bỏ qua.

Bớt cái gì thì cần Đức chốt hướng — đây là tài liệu của repo, không phải code thừa. Vùng:
`_docs` + `_root`.

### KHUNG-15 · Cổng báo "Test xanh ĐỎ" trong khi mọi suite exit 0

**Triệu chứng, đo 05/09 — KHÔNG chẩn đoán nguyên nhân ở đây** (mục nợ ghi triệu chứng; tìm
nguyên nhân là việc của executor có brief):

- `npm test` → **exit 0**, 145 phép xanh, 0 đỏ.
- `node tests/cong-do-that.mjs` → exit 0. `node tests/core-contract.mjs` → exit 0.
- `node scripts/session-check.mjs --as <phiên>` → mục **"Test xanh" ĐỎ**, với dòng giải thích
  `suite gốc repo ĐỎ →` rồi liệt kê **toàn dòng `ok`**.

Một chi tiết đáng đưa cho người điều tra, không phải kết luận: các phép kiểm được liệt kê ở đó
mang tên chứa sẵn chữ **`HỎNG`**, **`KHÔNG BIẾT`**, **`XOÁ`** — vì chúng là các phép kiểm *về*
trạng thái hỏng. Nếu cổng phân loại kết quả suite bằng cách dò chuỗi trong output thì đó là chỗ
đáng nhìn trước tiên.

**Hướng sai lệch là fail-closed** (báo đỏ khi thực ra xanh), nhẹ hơn chiều ngược lại. Nhưng hậu
quả thật vẫn nặng: **cổng đóng phiên không đóng được**, nên hoặc phiên treo, hoặc người ta bắt
đầu push khi đỏ — và một khi đã push-khi-đỏ một lần thì lần sau dễ hơn.

Gắn với KHUNG-9 (`can-nang` xác nhận ca hỏng bằng tìm chuỗi) và KHUNG-10: nếu đúng là dò chuỗi
thì đây là **lần thứ ba** một cơ chế của bộ khung dùng phép đo bằng chuỗi văn bản. Vùng: `_code`.

**BỔ SUNG 05/09, và đây là dữ kiện quan trọng hơn lần đỏ đầu: NÓ CHẬP CHỜN.** Lượt chạy ngay
sau đó, cùng lệnh, cùng repo, không sửa gì liên quan → mục *"Test xanh"* **XANH**. Tức nó không
đỏ ổn định.

Phép kiểm chập chờn **tệ hơn** phép kiểm đỏ ổn định, vì hai lý do:
1. Đỏ ổn định thì ai cũng phải xử. Chập chờn thì người ta **chạy lại cho tới khi xanh** — và
   thói quen đó vô hiệu hoá cổng mà không ai phải quyết định vô hiệu hoá nó.
2. Nó xoá bằng chứng của chính mình: lần chạy sau xanh thì không còn gì để điều tra.

Ai nhận mục này: **đừng bắt đầu bằng cách chạy lại cho ra đỏ.** Bắt đầu bằng câu hỏi *cổng đọc
kết quả suite từ đâu, và cái gì khác nhau giữa hai lượt chạy* — thời gian chạy, thứ tự suite,
trạng thái cây làm việc, hay output bị cắt. Ghi lại lượt nào đỏ lượt nào xanh trước khi đổi
bất cứ dòng nào.

**ĐÃ TÌM RA GỐC BỆNH 10/09, VÀ ĐÍNH CHÍNH CHÍNH TÔI.** Lúc 09/09 tôi ghi vào mục này rằng nửa
thứ hai *"không đo được vì sổ cổng chỉ lưu tên phép kiểm"*. **Câu đó sai.** Không cần sổ — chỉ cần
bắt đúng lượt đỏ lúc nó đang xảy ra, và lượt đó tới ngay trong phiên sau.

Nửa đã đóng từ trước: chỗ *"liệt kê toàn dòng `ok`"* là dò chuỗi, `KHUNG-52` vá ở 1.7.1 — cổng nay
bắt theo mẫu `── <suite> (mã N) ──` trên cả hai luồng. Ghim ở `cong-do-that.mjs` khối 12.

**Gốc bệnh của nửa còn lại — hai lớp, và cả hai đo được:**

⑴ `dauCay()` băm **`.agents/claims.json`**, mà file đó bị **MỌI lane** ghi lại ở mỗi lượt `--sua` /
`--xong`. Trong repo có hai lane cùng làm, dấu xác nhận **không bao giờ ghi được**.

⑵ `chay-test.mjs` trả **mã 2** khi không ghi được dấu, dù **22/22 suite xanh**. Cổng gọi `npm test`
bằng `execSync` — mã ≠ 0 thì ném — rồi báo *"suite gốc repo ĐỎ → không đọc được TÊN suite đỏ"*.
Không đọc được tên vì **không có suite nào đỏ**.

Số đo trong đúng một phiên (09→10/09), cả ba lượt trên cùng cây làm việc:

| Lượt | Thời gian | Suite | Dấu | Cổng nói |
|---|---|---|---|---|
| `npm test` #1 | 514.8s | 22/22 xanh | không ghi được | — |
| `npm test` #2 | 524.2s | 22/22 xanh | không ghi được | — |
| cổng đóng phiên | 702s | 22/22 xanh | không ghi được | **"suite gốc repo ĐỎ"** |
| | **29 phút** | **0 đỏ** | **0 dấu** | **1 kết luận sai** |

Và **chập chờn** giải thích xong: nó phụ thuộc lane khác có gõ trong cửa sổ ~9 phút hay không.

**Đã vá 10/09, hai chỗ, cả hai kèm đối chứng ngược:** `dauCay` bỏ file hành chính khỏi băm — khái
niệm này repo đã ghim từ trước (`isBehaviourFile(".agents/claims.json") === false`), nay có **một
nhà** là `FILE_HANH_CHINH` trong `repo-structure.mjs`, dùng chung bởi cả bộ đếm hành vi lẫn bộ
chạy suite. Và cổng thôi gọi một suite xanh là ĐỎ: nó trả **BỎ** kèm đúng lý do, nên **vẫn không
được báo xong** (mã 2) — chỉ đổi LỜI, không đổi độ chặt.

Ghim ở `dau-suite-smoke.mjs` (**14 → 16 vế**). Ba lượt đột biến trên bản chép cách ly:

| Đột biến | Vế ĐỎ |
|---|---|
| `dauCay` băm cả file hành chính (nghĩa cũ) | *"bảng quyền đổi mà dấu mất hiệu lực"* |
| bỏ nhánh *"xanh mà thiếu dấu"* (nghĩa cũ) | *"suite XANH mà bị gọi là ĐỎ"* |
| hạ xuống BỎ **không** đòi dòng tổng xanh (fail-OPEN) | *"suite đỏ THẬT thì phải bị gọi là ĐỎ"* |

**đóng khi:** một lượt audit ĐỘC LẬP xác nhận hai bản vá trên không mở đường lách — cùng lượt với
`KHUNG-53`. Người sửa không tự ký nghiệm thu (`AGENTS.md` mục 5).


### KHUNG-22 · Chưa ghim được "collectModel có truyền opts xuống không"

Lộ ra khi đột biến bản vá 1.3.3. Phép ghim F13 kiểm `behaviourOptsFrom()` trả đúng, và
`isBehaviourFile()` nhận đúng — nhưng **gỡ dòng truyền opts trong `collectModel` thì suite vẫn
XANH**. Tức vế "bộ sinh có thật sự dùng lớp đó không" chưa có ai canh.

Đây đúng hình dạng của KHUNG-12 vừa đóng: hàm đúng, không ai gọi, chú thích nói như thể đã dùng.
Ghim được vế này cần một bộ `deps` giả đầy đủ cho `collectModel` — chưa có helper nào trong
`tests/`, nên là một lượt riêng. Ghi ra thay vì để người sau tưởng F13 đã phủ. Vùng: `_code`.

### ~~KHUNG-30~~ · ĐÓNG 09/09 · `Project 3 AI Agent Unify` chưa nâng được — luật của CHÍNH REPO ĐÓ chặn

**Đức chốt 09/09: ĐỂ NGUYÊN, không nâng.** Đo lại cùng ngày: nhánh **thôi lệch** (trước *5 sau /
48 trước*, nay **0 sau / 63 trước**), nhưng luật *Cloud Sync Hold* (mục 8A của chính repo đó) vẫn
còn. Phiên AI ở đó **DỪNG đúng luật của nó** — đó là hành vi ĐÚNG, không phải thất bại, và bộ
khung dựng lên chính để luật repo đích không bị bỏ qua khi bất tiện. Repo này **cố ý đứng ngoài
nhịp nâng**. Muốn nâng thì Đức gỡ 8A ở repo đó trước; AI không sửa luật của repo khác.

> **CHỜ NGƯỜI CHỐT:** `@Đức:chốt` — nhánh đang lệch `origin/main` **5 sau / 48 trước**. Nâng bộ khung trên một
> nhánh lệch xa như thế là quyết định của Đức, không phải của AI.

**Đo 06/09, và đây là lượt giao việc cho Codex CLI đầu tiên có kết quả dùng được.**

Codex đọc đề bài [NANG-BO-KHUNG.md](briefs/NANG-BO-KHUNG.md), rồi **DỪNG** với đúng mẫu báo cáo
năm dòng. Hai lý do nó nêu, **tôi đã kiểm chứng độc lập, cả hai ĐÚNG**:

| Codex nói | Đo lại |
|---|---|
| nhánh lệch `origin/main` 48/5 commit | `git rev-list --left-right --count` → **5 / 48**. Đúng |
| repo có luật *"Cloud Sync Hold"* bắt dừng | `AGENTS.md` mục **8A** của repo đó. Có thật |

Luật 8A nói: *trước khi ghi bất kỳ file local nào, phải `git fetch origin main` và kiểm tra
Local có đang sau `origin/main` không*. Local đang sau **5 commit**, nên luật bắt dừng.

**Đây KHÔNG phải lỗi của bộ khung, cũng không phải lỗi của Codex.** Nó là hai bộ luật gặp nhau
và bộ luật của chủ nhà thắng — đúng như phải thế. Cái đáng ghi là **Codex đã đọc luật của repo
đích và tuân**, chứ không cắm đầu chạy đề bài.

**Ba lối, cần Đức chọn:**
1. Nâng trên nhánh `main` thay vì nhánh tính năng — sạch nhất, nhưng nhánh tính năng vẫn phải
   nâng riêng khi merge.
2. `git pull` 5 commit của cloud xuống trước theo đúng luật 8A, rồi nâng.
3. Hoãn — repo đó đang có việc dở của phiên khác (3 file), nâng sau khi việc đó xong.

**Kèm một giới hạn kỹ thuật đo được:** `codex exec -s workspace-write` **không chạy được
`git fetch`** — sandbox từ chối ghi `.git/FETCH_HEAD`. Nghĩa là mọi việc giao cho Codex mà cần
đọc trạng thái nhánh xa đều phải `git fetch` **trước** rồi mới giao. Ghi vào đề bài.


### KHUNG-37 · Tiến trình nền của phiên đã kết thúc KHÔNG ai dọn — đo được 5 thế hệ còn sống @Đức:bấm

Đức thấy trước, 06/09: *"tôi thấy có task chạy ngầm đã 14 tiếng, phải có protocol tắt những fake
task ko còn tác dụng chứ nhỉ?"* Đo lại ngay lúc đó, đếm tiến trình `node.exe` theo tuổi:

| Tuổi | Là gì |
|---|---|
| **32.9h** | MCP server + npm bọc ngoài — phiên sinh ra chúng đã chết từ hôm kia |
| **15.9h** | thế hệ thứ hai — chính là "14 tiếng" Đức nhìn thấy |
| 2.2h · 1.9h · 0.9h | ba thế hệ nữa |

Mỗi lần mở phiên đẻ ra một bộ MCP server; phiên đóng thì **không ai giết chúng**. Chúng không
làm gì, nhưng chúng ăn RAM và — nặng hơn — chúng làm mọi bảng tiến trình **trông như đang bận**,
nên lần sau có một tiến trình treo THẬT thì không ai phân biệt nổi.

Đây **không phải nợ của repo này**: tiến trình nằm ở tầng máy, một trong số đó là cầu nối của
repo khác (`Chrome Extension Bridge`, 32.9h). Nên việc cần là một **protocol**, không phải một
bản vá: (a) một lệnh đo *"tiến trình nào thuộc phiên đã chết"*; (b) luật ai được giết, khi nào.

**Chưa tự giết cái nào** — giết tiến trình của phiên khác là việc không lùi lại được và chạm tới
việc người khác, đúng hai nhánh bắt phải hỏi. Lệnh đo đã ghi ở [docs/BAO-TRI-DINH-KY.md](docs/BAO-TRI-DINH-KY.md).
Vùng: `_docs`.

### KHUNG-39 · `.gitignore` và `.gitattributes` nằm trong bản trích mà KHÔNG tầng nào phát

**Đo 07/09** — quét bản trích rồi hỏi mỗi file thuộc tầng nào:

```
node -e "... buildTemplateFiles() vs fileMay() vs fileTaiLieu() ..."
→ KHÔNG THUỘC TẦNG NÀO: .gitignore  .gitattributes  (và 14 file repo đích tự sở hữu)
```

14 file kia **đúng** là của repo đích (`AGENTS.md` · `HANDOFF.md` · `.repo-structure.json`…).
Hai file này thì khác: chúng là **cấu hình repo mà bộ khung có lý do kỹ thuật để mang**.

| File | Thiếu nó thì hỏng ra sao |
|---|---|
| `.gitattributes` | máy Windows tự đổi xuống dòng lúc lấy file ra, một commit có hai dạng byte, và `git status` nói SẠCH ở cả hai — đo thật ở repo nhà: cùng một cây làm việc, 75 file LF và 21 file CRLF |
| `.gitignore` | repo nhận `bang-song/` sẽ **bẩn cây làm việc** ngay lần đầu ai nhấp đúp `Xem-bang.cmd`, và cổng đóng phiên của MỌI lane ở đó kêu về ba file không ai commit được |

**Luật đúng gần như chắc chắn là luật của tầng tài liệu:** THIẾU thì mang sang · **CÓ rồi thì
CHỈ kể tên**, không bao giờ trộn. Ghép hai `.gitignore` bằng máy là việc dễ hỏng im lặng — một
dòng `!` phủ định của repo đích gặp một dòng của bộ khung thì kết quả không ai đoán được.

**Vá tay 07/09 cho hai repo đã nhận `bang-song/`** (`ALL_SKILL_MANAGEMENT` ·
`nav_platform_main`): thêm ba dòng vào `.gitignore` của chính chúng. Đó là **vá điểm**, không
phải cơ chế — repo thứ ba nhận `bang-song/` sẽ vấp lại đúng chỗ này.

**ĐÃ ĐO 07/09, và số đo đổi hình việc:** cả **3/3** repo đã lắp **đều đã có** `.gitignore` và
`.gitattributes` của riêng chúng (`ALL_SKILL_MANAGEMENT` 11 dòng · `nav_platform_main` 78 dòng ·
`Project 3 AI Agent Unify` có cả hai). Nghĩa là vế `THIẾU thì mang` gần như **không bao giờ chạy**
ở thực tế, và toàn bộ việc nằm ở vế `KHÁC` — tức chỉ kể tên. Nên bản vá đúng có lẽ **nhỏ hơn**
dự tính: chỉ cần `--plan` **KỂ TÊN** hai file này khi chúng khác bản trích, kèm một câu nói rõ
điều gì hỏng nếu thiếu dòng nào (bảng dưới), rồi **để người quyết**. Ghép bằng máy thì đừng.


### KHUNG-40 · Bảy giới hạn Đức chốt 07/09 — cái nào phổ quát, cái nào riêng repo tiêu thụ @Đức:chốt

> **CHỜ NGƯỜI CHỐT:** con số của từng trần phải do Đức đặt, không do AI đặt cho vừa hiện trạng.
> `AGENTS.md` mục 2 hàng 6 bắt hỏi — đặt hay nới một ngân sách là đổi luật an toàn.

**Nguồn.** Repo tiêu thụ `Chrome_Extension_AI_Agentic` được đo 07/09, và Đức đọc số rồi nói
nguyên văn: *"thời gian để maintain dashboard và debug hệ thống chiếm phần lớn tài nguyên và
thời gian, không add value nào cả."* Bảy giới hạn là câu trả lời của Đức cho repo ĐÓ. Việc ở đây
là quyết cái nào phổ quát (vào bộ khung) và cái nào chỉ đúng ở đó.

**ĐO Ở BỘ KHUNG, 2026-09-07** — số dưới đây là của repo NÀY, không phải của repo tiêu thụ:

| # | Đo gì | Bộ khung | Ghi chú |
|---|---|---|---|
| ① | commit 7 ngày **chỉ chạm giấy tờ** | **194/280 = 69%** | 31% có chạm máy hoặc bản trích |
| ② | luật-là-chữ | **1.254 dòng** (2.097 kể cả bản trích) | `AGENTS.md` 235 + 4 protocol 1.019 |
| ③ | chốt máy cưỡng chế được | **26** (11 cổng đóng phiên + 15 cấu trúc) · 16 file test | |
| ④ | tài liệu | **8.672 dòng** (12.329 kể cả bản trích + lưu trữ) | trần đang khai 2.200 → **vượt 3,9×** |
| ⑤ | sổ nợ đang mở | **15** mục / 39 tổng | 62% quyển sổ là việc đã đóng |

**ĐO LẠI 2026-09-09 — số cũ ở bảng trên là của 07/09 và đã ôi. Đây là số để chốt:**

| # | Đo gì | 07/09 | **09/09** |
|---|---|---|---|
| ① | commit 7 ngày chỉ chạm giấy tờ | 69% | **67%** (303/447) |
| ② | luật-là-chữ | 1.254 dòng | **1.305** (AGENTS 243 + 4 protocol 1.062) |
| ③ | chốt máy cưỡng chế | 26 · 16 file test | **32** (16 cổng phiên + 16 cấu trúc) · **21** file test |
| ④ | tài liệu | 8.672 / trần 2.200 = **3,9×** | **3.602 / 2.200 = 1,6×** |
| ⑤ | sổ nợ đang mở | 15 / 39 tổng (62% đã đóng) | **20 / 20** (0% đã đóng — đã dời sang kho) |

**Tỉ lệ luật/chốt: 1.305 ÷ 32 = 41 dòng văn mỗi cơ chế** (trước 48). Số ④ tụt 3,9× → 1,6× KHÔNG
phải vì cắt chữ, mà vì `can-nang` trước đó đếm cả `docs/adr/` — thứ luật bắt BẤT BIẾN, tức nó
đếm một khoản nợ không ai được phép trả. Đã dùng chung danh sách trừ với cổng.

**Ba trong năm số nay ĐẠT hoặc gần đạt.** Còn đúng hai chỗ cần Đức đặt số: **④ tài liệu**
(3.602 / 2.200) và **③ số phép kiểm** (32 / 30). Cả hai là *đổi luật an toàn* — mục 2 hàng 6.

**Tỉ lệ luật/chốt: 1.254 ÷ 26 = 48 dòng văn cho mỗi cơ chế thật.** Repo tiêu thụ là 71. Cùng một
hình dạng bệnh, nhẹ hơn — nhưng 69% commit chỉ chạm giấy tờ thì bộ khung **không được miễn**.

**Bảy giới hạn, và đánh giá phổ quát/riêng:**

| # | Giới hạn | Phổ quát? | Vì sao |
|---|---|---|---|
| ① | một đơn vị SỐNG một lúc | **chưa rõ** | bộ khung chỉ có 1 đơn vị nên nó không tự kiểm được vế này — đúng cái bẫy *"thứ gì repo nhà không dùng thì repo nhà không kiểm được"* |
| ② | cấm cài một tính năng hai lần | **có** | và đã cắn thật ở đây: bản đồ file vẽ **3 lần** trên một tab, xem ADR-0006 |
| ③ | tài liệu ≤ trần khai ở cấu hình | **ĐÃ CÓ** | `tongTaiLieu: 2200` — nhưng đang vượt 3,9× và **không cổng nào chặn** |
| ④ | sổ nợ hạ tầng ≤ 10 mục | **có** | ở đây 15 mục; trần này ép CHỌN, không ép dọn |
| ⑤ | test bắt 0 đột biến thì XOÁ | **có, và là phép cắt AN TOÀN NHẤT** | vì nó **đo được**. Chưa lượt nào chạy phép này trên 16 file test của bộ khung |
| ⑥ | tối đa 2 phiên song song | **riêng** | bộ khung có 4 khoá và chưa lần nào chạy quá 2 lane; trần này chưa nổ ở đây |
| ⑦ | một luật vào một luật ra | **KHÔNG thi hành được ở dạng này** | xem dưới |

**Vì sao ⑦ phải đổi hình dạng.** *"Một luật"* không đếm được — một gạch đầu dòng là một luật? một
câu? một đoạn? Không trả lời được thì không máy nào kiểm được, nên nó là **lời hứa**. Và
`AGENTS.md` mục 7 có đúng câu *"luật nào không kiểm được bằng máy thì sớm muộn cũng bị bỏ qua"* —
tức mục 8 hiện tại **tự vi phạm nguyên tắc gốc của chính nó**.

Đổi thành **TRẦN SỐ DÒNG cho file luật, cổng đóng phiên ĐỎ khi vượt**. Lúc file đã sát trần, muốn
thêm 10 dòng luật thì buộc phải xoá 10 dòng khác — *"một vào một ra"* thành **tự động**, không cần
ai tự nguyện. Và Đức kiểm được bằng một lệnh, một con số.

**Lỗ của cách này, ghi rõ chứ không giấu:** trần dòng đo **độ dày**, không đo **chất lượng**. Một
AI muốn lách sẽ cô đặc luật thành câu khó hiểu để vừa trần — mà luật khó hiểu thì **tệ hơn** luật
dài. Chưa có cách nào máy chặn chuyện đó.

**Cần Đức chốt đúng hai điều:**

1. Trần cho `AGENTS.md` + `docs/protocols/` là bao nhiêu. Đặt **bằng số đo sau khi cắt** thì cửa
   hẹp thật; đặt kèm biên rộng thì nó vô hại. Số hôm nay: **1.254**.
2. Có đưa trần đó vào **cổng đóng phiên** không. `can-nang` hiện **cố ý nằm ngoài** cổng (nhịp
   tháng), nên mọi trần hiện tại **chưa từng chặn được gì** — kể cả cái đang vượt 3,9×.

**Việc kế, KHÔNG cần Đức:** chạy phép ⑤ trên 16 file test — mỗi file, phá một chốt nó canh, xem nó
có đỏ. File bắt 0/n thì xoá kèm con số. Đây là phép cắt duy nhất trong bảy cái **tự chứng minh
được**, không cần ai chốt.

### KHUNG-41 · Bộ khung không có chỗ nào nói "DỪNG" — gốc bệnh, chưa vá

**Chẩn đoán từ repo tiêu thụ 07/09, và nó là chẩn đoán về CÔNG SUẤT, không về hành vi sai.**

Việc sản phẩm bị chặn ở tay người: bấm nút trên trình duyệt, chạy thử, chốt phạm vi. Công suất AI
thì gần như vô hạn. Nên khi hết việc-không-cần-người, AI **không dừng** — nó tìm việc, và việc
duy nhất còn lại là **sửa chính cái nhà máy**.

*Không phải AI làm sai việc. Là AI hết việc đúng rồi tự tìm việc.*

Số đo ở bộ khung: **69% commit 7 ngày chỉ chạm giấy tờ**. Ở repo tiêu thụ, tỉ lệ chạm mã sản phẩm
là **9%**, và **không ai thấy** cho tới khi Đức tự cảm nhận rồi hỏi.

**Cần một luật ngắn, đi ngược bản năng của mọi AI:** hết việc sản phẩm thì **DỪNG** và báo người
chủ cần làm gì. Không lấp chỗ trống bằng việc hạ tầng. Vùng trống ≠ phải dùng.

**Kèm một cách đo, để nó không thành một luật-là-chữ nữa:** tỉ lệ commit chạm sản phẩm; tụt dưới
ngưỡng thì **bảng phải nói ra**, không để người chủ tự đoán.

**Chỗ khó thật, phải giải TRƯỚC khi viết luật:** ở repo bộ khung, *"sản phẩm"* CHÍNH LÀ hạ tầng —
`scripts/` và `template/` là thứ nó bán. Nên phép đo 9%-vs-91% của repo tiêu thụ **không chuyển
thẳng sang được**. Phải định nghĩa lại "sản phẩm" theo từng repo, khai ở cấu hình; nếu không, luật
này sẽ nói sai ở đúng repo phát hành ra nó.

### KHUNG-43 · Một trang cho người chủ đọc — 6 ADR mà Đức không biết ADR là gì

Repo tiêu thụ có **21 file ADR**, và Đức không biết ADR là gì. Bộ khung này có **6**.

Một cơ chế người chủ không hiểu là cơ chế **không phục vụ được người chủ** — nó chỉ phục vụ AI.

Bảng hiện chiếu ADR ra dưới dạng **bảng ba cột**: tiêu đề · trạng thái · ngày. Tiêu đề thì viết
cho AI đọc (*"Gói Assistant phát hành từ bộ khung; repo nào dùng thì là người tiêu thụ"*), trạng
thái là chữ tiếng Anh (`Accepted`), và **không cột nào nói đã chốt cái gì**.

**Cần:** mỗi quyết định **một dòng tiếng Việt** nói đã chốt gì — không mã, không đường dẫn, không
SHA. Giữ ADR (chúng cứu việc thật), nhưng **bổ sung cửa cho người**.

Nguồn có sẵn: `decisions.md` đã là sổ tra nhanh *"Đức đã chốt gì, ngày nào"*, và bảng **chưa đọc
file đó lần nào**. Nên đây có thể là một lượt **nối nguồn đã có**, không phải viết cơ chế mới.

### KHUNG-7 · `template/` phát bộ sinh bảng mà KHÔNG phát phép ghim của nó

Phát hiện 08/09 khi thêm khối **hai vai Assistant** vào `build-overview.mjs`. Bản trích phát
`template/scripts/build-overview.mjs` (bản 1.3.38) nhưng `template/tests/` **không có**
`overview-smoke.mjs` — nên repo đích nhận tính năng mà **không nhận lớp canh**. Ở nhà, khối đó
có 10 phép ghim và **6/6 đột biến bị bắt**; ở repo đích nó có **0**.

Vì sao có thể là cố ý, phải kiểm trước khi "vá": `overview-smoke.mjs` gọi `gomDuLieu()` ở tầng
module, tức nó **đọc `docs/` của repo nhà**. Ở một repo đích còn trống, phép kiểm đó có thể đỏ vì
lý do không liên quan gì tới bộ sinh — và một phép kiểm đỏ vô cớ ở repo đích thì tệ hơn không có.

Nhưng phần ghim khối hai vai **không** đọc repo: nó gọi `khoiMoHinh()` với đầu vào tự dựng. Nên
lối rẻ nhất có thể là **tách phần thuần hàm ra một file riêng rồi phát file đó**, chứ không phát
cả suite.

Vùng: `_template` + `_code`.

**đóng khi:** repo đích chạy được một phép kiểm canh khối hai vai (số suy từ đầu vào, không gõ
cứng), và một đột biến gõ cứng con số làm nó ĐỎ ở repo đích — đo trên một repo đích thật, không
suy ra. Hoặc: ghi vào `PLATFORM.md` rằng bộ sinh bảng phát **không kèm** phép ghim, kèm lý do.

### KHUNG-44 · Luật bàn giao hai vai chưa được cưỡng chế ở chính repo phát hành

> **Mục này từng mang số `KHUNG-8` — TRÙNG với một mục đã có.** Đổi sang 44 ngay trong cùng phiên.
> `ADR-0009` vẫn gọi nó là `KHUNG-8`: ADR đã `Accepted` là **bất biến**, không sửa được kể cả để
> chữa một con số — nên chỗ đối chiếu đặt ở đây, tức chỗ sửa được. Đọc `KHUNG-8` trong ADR-0009
> thì hiểu là mục này.

ADR-0008 khai rằng vế bàn giao (`② ghi BACKLOG kèm đóng khi: → ① biến thành bản vá`) là **vế duy
nhất máy kiểm được**. Ở repo Extension nó **được** cưỡng chế: `npm run test:backlog` chạy
`scripts/backlog-check.mjs`. Ở đây thì **không có lệnh đó**, nên câu trong hiến pháp đang mô tả một
năng lực repo này chưa có.

Đo 08/09: **43 trên 44 mục** của chính sổ này thiếu trường `đóng khi:` — chỉ `KHUNG-7` có.

**Vì sao KHÔNG port bộ kiểm ngay tối nay, và đây là phần đáng đọc:** bật nó lên là cổng đỏ 43 mục,
mà phần lớn là **chữ của phiên khác**. Sửa chúng là viết lại lời người khác — thứ mục 1 cấm. Và
một cổng đỏ 43 mục ngay lượt đầu thì phiên sau sẽ học cách bỏ qua nó, tức lớp bảo vệ chết ngay khi
sinh ra.

Lối rẻ: port bộ kiểm ở **chế độ đếm và cảnh báo** trước, chỉ CHẶN với mục tạo ra **sau** một ngày
mốc — y như cách `IDEAS.md` của repo Extension miễn trừ 14 mục ra đời trước luật.

Vùng: `_code` + `_root`.

**đóng khi:** `npm run test:backlog` tồn tại ở repo này VÀ chặn thật một mục MỚI thiếu `đóng khi:`
(dựng được ca hỏng, không chỉ chạy xanh), VÀ mục cũ không bị đỏ oan — đo bằng một lượt chạy trên
chính sổ này.

### KHUNG-47 · Ba phép ghim của bộ khung KHOÁ VÀO chi tiết triển khai của repo nhà — đo 3 ca thật trong một lượt phát

**Cùng một bài học, lần thứ tư trong hai ngày.** 1.3.66 đã vá một ca (`runRootSuite()` → hỏi
HÀNH VI). Lượt phát 1.3.67 sang `n8n-orchestrator` hôm nay lộ ra **ba ca nữa**, cả ba đỏ **ngay
lúc file vừa tới**, trước khi ai kịp làm gì sai:

| Ca | Bộ khung đòi | Repo đích thật ra thế nào | Ai đúng |
|---|---|---|---|
| `handoff-smoke` | mọi file `…HANDOFF.md` phải có dòng **đúng chữ** `## Log` (`RE_MO_LOG` trong `handoff.mjs:33`) | n8n giữ nhật ký ở `log/YYYY-MM.md` (luật của nó, mục *Kết mỗi phiên* 3); `HANDOFF.md` ở đó là **tài liệu trạng thái**, không phải nhật ký | **repo đích** — nó CỐ Ý khác |
| `bang-song` vế 8 | 3 dòng `.gitignore` cho `bang-song/BANG.html` · `trang-thai.json` · `DUNG.txt` | không có dòng nào — `.gitignore` **không thuộc tầng nào** (KHUNG-39) | bộ khung thiếu đường phát |
| `dau-suite-smoke` vế 6 | dòng `.gitignore` cho `.ark-suite-stamp.json` | không có — cùng gốc bệnh | bộ khung thiếu đường phát |

**Và một chỗ thứ tư, không đỏ nên nguy hơn cả ba cái đỏ.** `--apply` thêm 4 tên lệnh, trong đó có
`test:tuan-tu`, **nhưng KHÔNG thêm tên nào trỏ vào `scripts/chay-test.mjs`**:

```
co alias chay-test?  []          ← đo sau khi --apply chay xong
```

Nên cơ chế nhanh nhất của bộ khung **tới rồi mà nằm không**: cổng gọi `npm test`, `npm test` là
chuỗi riêng của repo đích, không ghi dấu, và cổng chạy lại trọn chuỗi. Đúng ca `[~] MỘT PHẦN` mà
chính bộ khung cảnh báo, **và không phép kiểm nào đỏ**. Vá tay ở n8n: thêm `test:song-song`.

Luật mục 0b cũng góp phần: nó gọi tên `npm test` như thể đó là đường nhanh. Ở nơi phát hành thì
đúng; ở repo đích `npm test` là đường **chậm** — và lớp bảo vệ *"tài liệu dạy lệnh nào thì bản
trích phải khai lệnh đó"* chỉ hỏi lệnh **có tồn tại**, không hỏi nó **trỏ vào đâu**.

> Một phép ghim viết ở nơi phát hành mà soi **chi tiết triển khai** thì nó không phải hợp đồng,
> nó là bản sao. Hợp đồng phải nói về **hành vi**. — nguyên văn bài học 1.3.66, chưa được áp
> cho ba chỗ trên.

Vùng: `_code` (ba phép ghim) + `_root` (mục 0b) + `_template`.

**đóng khi:** ⑴ `handoff.mjs` cho repo đích **khai** dấu mở nhật ký (ví dụ `handoff.dau_mo_log`
trong `.repo-structure.json`), hoặc `handoff-smoke` chỉ đòi điều đó ở repo CÓ khai — và
`node tests/handoff-smoke.mjs` xanh ở n8n **mà không cần đổi `HANDOFF.md` của nó**; ⑵ `--plan`
kể tên mọi dòng `.gitignore` mà file máy nó sắp phát cần (bốn dòng đã biết), và một phép ghim dựng
repo đích thiếu dòng đó rồi đòi `--plan` **nói ra**; ⑶ `--apply` thêm một tên lệnh trỏ vào
`chay-test.mjs`, và một phép ghim đòi ĐỎ khi không tên lệnh nào trỏ vào nó; ⑷ mục 0b không còn
gọi tên một npm script cố định cho bước chạy suite.


### KHUNG-50 · Bộ trích băm CÂY LÀM VIỆC, nên một lane sửa dở là CHẶN toàn bộ đường phát — và ledger bị đọc lúc đang ghi

**Đo 08/09, hai lane chạy song song đúng luật, khác vùng, mà vẫn đụng nhau.** Tôi giữ `_root` +
`_docs`, lane ① giữ `_code` + `_template`. Hai vùng rời nhau, không file nào chung. Vậy mà:

**⑴ Không phát được sang repo nào, ba lượt liên tiếp.** `upgrade.mjs --plan` từ chối:

```
SO_PHAT_HANH_LECH: bản 1.3.67 đã ghi dấu vân tay 1633c1812bb87973,
                   nội dung tầng máy hiện tại là b5823f889730c00f
```

Vì `bamBanTrich()` băm **cây làm việc**, không băm HEAD. Nên **bất kỳ** lane nào sửa dở một file
`.mjs` là Vai ② mất cửa ra ngoài. Cái giá đo được: `nav_platform_main` **không nhận được** cơ chế
suite song song trong lượt 08/09 — phải hoãn thành `NAV-1` ở repo đó.

**Đối chiếu đáng chú ý, trong CÙNG repo này:** bộ sinh bảng **cố ý suy hoàn toàn từ HEAD**, và lý
lẽ ghi ngay trong Bản đồ file — *"bộ sinh nhìn đồng hồ thì sang ngày là mọi phiên bị chặn đẩy dù
không dữ liệu nào đổi"*. Cùng một loại vấn đề, hai lựa chọn trái nhau. Bộ trích chưa hưởng bài học đó.

**⑵ `RELEASE-LEDGER.json` bị đọc lúc đang ghi — HAI lần, cách nhau ~30 phút, hai triệu chứng:**

| Lượt | Thông báo | Sự thật trên đĩa sau đó |
|---|---|---|
| ~17:20 | `1.3.9: c985e395… → ffffffffffffffff` | `c985e395…`, nguyên |
| ~17:55 | `1.2.10: 946065fa… → (đã bị xoá)` | có mặt, 87 bản, khớp HEAD |

Cả hai lần file **hoàn toàn lành** khi tôi đọc lại. Nguyên nhân: bộ trích ghi lại **cả file**
(`writeFileSync` một cục), nên lane khác đọc trúng khoảng giữa thấy một sổ **thiếu dòng**.

**Đây là ca nguy hiểm nhất trong hai ca, vì thông báo nó phát ra là thông báo ĐÁNG SỢ NHẤT của bộ
khung:** `SO_PHAT_HANH_SUA_LICH_SU` — *"nói dối về một bản đã đi ra ngoài"*. Một lane đọc trúng
lúc đó có mọi lý do để tin sổ đã bị phá, và **cách chữa hiển nhiên là sửa sổ** — tức phá một sổ
đang lành. Lớp fail-closed đúng, nhưng nó đang đổ lỗi cho người vô can.

Vùng: `_code` (`build-template.mjs`) + `_template`.

**đóng khi:** ⑴ `bamBanTrich()` (và đường `--plan`/`--apply` gọi nó) băm nội dung tại **HEAD** chứ
không phải cây làm việc — hoặc `--plan` nói rõ *"cây làm việc đang bẩn, đây là số của cây bẩn"* thay
vì kết luận sổ lệch; kèm một phép ghim dựng repo có file `.mjs` sửa dở rồi đòi `--plan` **vẫn phát
được** (hoặc từ chối với đúng lý do); **và** ⑵ lượt ghi sổ phát hành là **nguyên tử** (ghi file tạm
rồi `renameSync`), kèm một phép ghim đọc sổ giữa hai bước và đòi **không bao giờ** thấy trạng thái
thiếu dòng.

### KHUNG-54 · Cổng đóng phiên biết cả ba dữ kiện "nên trả khoá" mà không nói thành một câu

**Đức chốt 08/09:** *"ok đóng KHUNG-42 đi, giữ dòng vàng."* — đóng cơ chế hết hạn tự động (ADR-0012
⑸ đã bác nó), giữ lại đúng **một** việc: dòng VÀNG. Đây là **bớt một cơ chế, không thêm** — nó thay
chỗ toàn bộ bảng ba dòng hết-hạn của `KHUNG-42`.

Cổng đã biết cả ba dữ kiện: phiên này giữ những khoá **vùng** nào · cây làm việc sạch chưa · còn
commit chưa đẩy không. Nó chưa gộp ba thứ đó thành một câu, nên khoá vô thừa nhận chỉ lộ ra khi có
người tình cờ chạy `--list`. Thêm một dòng ở cuối cổng:

> `⚠ Bạn còn giữ N khoá vùng (<tên>), cây sạch, mọi commit đã đẩy — cân nhắc trả khoá.`

**Hàng rào không được vượt.** `tests/khoa-dau-vet.mjs` vế 7 đã ghim: tín hiệu loại này là **VÀNG**,
nó **không được đổi mã thoát của cổng**. Chặn một lane đang đọc kỹ là dạy mọi lane ghi bừa một byte
để giữ khoá cho hợp lệ. Và nó **chỉ nêu tên, không nhả** — ADR-0012 ⑸.

**Chỗ hở nó KHÔNG chữa, ghi ra để không ai tưởng là kín:** khoá vùng của một phiên **đã chết**.
Phiên đã tắt thì không bao giờ chạy cổng, nên không dòng vàng nào tới được nó. Ca thật 08/09:
`claude-bang-gon` giữ hai khoá ở `nav_platform_main` **một ngày** sau khi phiên tắt. Cơ chế cho ca
đó là `--list` nêu tên và **một người quyết** — cố ý, vì tự nhả chính là tự động hoá vụ nhả-khoá-hộ
06/09. Chi phí đo được: một câu hỏi cho Đức, một lượt trả lời.

**đóng khi:** cổng in dòng vàng đó **khi và chỉ khi** đủ ba điều kiện, **mã thoát không đổi**, và có
một phép ghim dựng nổi cả hai nhánh — một kho đủ ba điều kiện (**phải** in), một kho thiếu đúng một
trong ba (**không được** in). Phép ghim phải chạy được ở repo tiêu thụ và soi **hành vi**, không soi
tên lệnh của nơi phát hành (bài học `KHUNG-47`).


### KHUNG-55 · Thước kho chữ đọc từ ĐĨA, nên một lane sửa dở làm ĐỎ cổng của lane khác

**Đo 09/09, không phải giả định.** `doKhoChu` trong `session-check.mjs` lấy **danh sách** file
bằng `git ls-files docs`, nhưng đọc **nội dung** bằng `fs.readFileSync` — tức từ cây làm việc.
Cây làm việc thì chung cho mọi lane.

Số đo cùng một lượt:

| | dòng `docs/` (không kể adr/, archive/, migrations/) |
|---|---|
| HEAD | **3.371** — đúng bằng thước |
| ĐĨA | **3.398** → cổng ĐỎ `KHO_CHU_PHINH`, *"thêm 27"* |

Phần thêm không phải của phiên bị chặn: `docs/briefs/MIGRATE-REPO.md` **+38 dòng** của lane
`harness-migrate-3repo` đang sửa dở. Phần của phiên bị chặn là **−11**. Nên lời nhắn *"phiên này
đang làm kho chữ to ra"* nói **sai tên người**, và ba cửa ra nó gợi ý (xoá · chuyển sang ADR ·
nâng thước) **không cửa nào dùng được** — chúng đều đòi phiên này sửa chữ của lane khác.

**Cùng họ `KHUNG-50`** (bộ trích băm CÂY LÀM VIỆC): một cơ chế đọc đĩa trong repo nhiều lane thì
biến việc đang làm dở của người khác thành lỗi của mình. Khác ở chỗ `KHUNG-50` chặn đường PHÁT,
mục này chặn đường ĐÓNG PHIÊN — và nó chặn **im lặng theo hướng buộc tội sai**, tệ hơn.

Ba phép kiểm khác trong cùng cổng đã làm đúng: chúng nói rõ *"dựng và so hoàn toàn từ HEAD"* và
*"việc đang làm dở của bất kỳ phiên nào cũng không được làm đỏ sự thật đã commit"*. Thước kho chữ
chưa theo. Vùng: `_code`.

**đóng khi:** dựng một kho có hai lane — lane A sửa dở một file `docs/` đã track cho vượt thước,
lane B **không đụng** `docs/` — rồi đòi cổng của lane B **XANH** ở mục *"Ngân sách trong trần"*,
kèm đối chứng NGƯỢC: cùng kho đó, khi chính lane B là người làm phình (đã commit) thì mục đó vẫn
phải **ĐỎ** kèm mã `KHO_CHU_PHINH`.


### KHUNG-56 · Điều kiện "đã qua audit độc lập" KHÔNG có phép kiểm nào — `--carry` phát hộ việc chưa ai duyệt

**Xảy ra thật lúc 00:4x ngày 10/09, trong vòng ~20 phút sau khi được ghi ra giấy.**

`AGENTS.md` mục 2 cho phép tự commit và push khi đủ ba, trong đó điều ⑵ là *"cổng XANH TOÀN BỘ,
**code thì đã qua audit độc lập**"*. Vế **cổng xanh** có máy canh — `safe-push` đòi dấu cổng. Vế
**đã qua audit** thì **không có gì canh cả**: không cờ, không trường trong dấu, không phép kiểm.

Ca thật: lane `harness-loi-02` commit 5 lượt (bản 1.8.1, 1.8.2 — sửa `session-check.mjs`,
`chay-test.mjs`, `repo-structure.mjs`), ghi rõ trong `HANDOFF.md` lượt (21) và (22):

> *"chưa qua audit độc lập… **chưa đẩy**. Phiên sau: đừng `--carry` commit này trước khi có audit."*

Lane `harness-migrate-3repo` chạy `safe-push` và **cuốn cả 5 commit đó lên `origin/main`** —
`a33166d · 1cb9011 · f711bed · b4f8b6c · 020f971`. Họ **không làm gì sai**: cổng của họ xanh, mọi
commit đều mang nhãn `Lane:` quy thuộc được, tức đủ đúng ba điều kiện mà **máy** biết kiểm.

**Gốc bệnh, và nó là gốc bệnh của cả bộ khung:** lời cảnh báo nằm trong `HANDOFF.md` — Tầng 2,
**không nạp mặc định**. Không lane nào phải đọc nhật ký của lane khác trước khi đẩy, và cũng không
nên phải. Đúng câu `AGENTS.md` mục 7 tự nói: *"Luật nào không kiểm được bằng máy thì sớm muộn cũng
bị bỏ qua"* — ở đây *"sớm muộn"* là **hai mươi phút**.

**Đừng vá bằng cách bắt người ta đọc thêm.** Chỗ mang tín hiệu phải là chỗ máy đã đọc: commit hoặc
dấu cổng. Hai lối đáng cân nhắc, cả hai phải đo trước: ⑴ một nhãn trong commit kiểu
`Audit: chua-co` mà `safe-push` từ chối cuốn theo khi `--carry` (rẻ, nhưng người sửa tự khai) ⑵ dấu
cổng mang thêm trường `audit` chỉ được đặt bởi một lệnh nghiệm thu riêng (chặt hơn, đắt hơn, và
`Y-02` đã bàn hình dạng lệnh đó).

Liên quan: `KHUNG-44` (luật bàn giao hai vai chưa cưỡng chế), `Y-02` (lệnh nghiệm thu). Vùng: `_code`.

**đóng khi:** dựng một kho hai lane — lane A có một commit khai *chưa qua audit*, lane B cổng XANH
chạy `safe-push --carry` — rồi đòi `safe-push` **TỪ CHỐI** và nêu đích danh commit chưa duyệt, kèm
đối chứng NGƯỢC: cùng kho đó, khi commit của A khai *đã qua audit* thì `--carry` phải **cho qua**.

**ĐÃ VÁ 10/09, bản 1.8.4 — mục vẫn MỞ tới khi có audit độc lập cho chính bản vá này.**

Lối ⑴ trong hai lối nêu trên, đúng như đã ghi: nhãn `Audit:` trong commit, `safe-push` từ chối
đẩy khi có commit **tự khai** `Audit: chua-co`. Nhà của nhãn là `auditFromMessage` trong
`repo-structure.mjs`, cạnh `laneFromMessage` — một khái niệm một nhà.

Bốn quyết định thiết kế, mỗi cái tránh một cách hỏng đã biết:

| Chốt gì | Tránh cái gì |
|---|---|
| KHÔNG khai = KHÔNG chặn | chặn tuốt là khoá repo ngay lượt đầu — bẫy 509 commit cũ không nhãn |
| `Audit:` **rỗng** = chưa duyệt | gõ nhãn rỗng để qua cửa là biến chính nhãn thành đường lách |
| `--carry` **KHÔNG** mở được cửa này | Đức chốt 09/09 là về **quy thuộc**, không về **duyệt**. Dùng lời chốt cho việc A để làm việc B là chỗ dễ sai nhất |
| Cờ riêng `--duc-duyet-chua-audit` | hai điều kiện khác nhau thì hai cờ khác nhau |

Kèm một dòng ⚠ **tự dạy** lúc sắp đẩy code mà không commit nào khai `Audit:` — cùng khuôn với
khối ⚠ nhãn `Lane:`, **không đổi mã thoát**. Nhãn nào không ai biết là có thì không ai gõ.

Ghim: `dau-suite-smoke.mjs` **17 → 18 vế**, năm vế trong một khối, kho RIÊNG. Ba đột biến:
gỡ cửa → vế ⑵ ĐỎ · cho `--carry` mở cửa → vế ⑶ ĐỎ · chặn tuốt → vế ⑴ ĐỎ.

**GIỚI HẠN, ghi ra để không ai tưởng đây là lớp thép:** nhãn do người sửa **TỰ KHAI**. Nó không
chứng minh đã có audit — nó chỉ làm một lời tự khai *"chưa duyệt"* đi được tới máy, thay vì chết
trong một quyển sổ Tầng 2 mà không lane nào phải đọc. Bản chặt hơn là `Y-02`.

**AUDIT ĐỘC LẬP ĐÃ CHẠY 10/09, và nó nói CẦN SỬA — đã sửa ở 1.8.5.** Chính cửa vừa dựng có **hai
lối fail-open**, và lối thứ nhất là câu một người cẩn thận sẽ tự viết:

| Nhãn | 1.8.4 đọc thành | Đúng |
|---|---|---|
| `Audit: chua-co (dang cho Codex)` | **ĐÃ DUYỆT** | chưa duyệt |
| `Audit: chua co` | **ĐÃ DUYỆT** | chưa duyệt |
| `AUDIT: chua-co` | lời khai **mất im lặng** | chưa duyệt |

Một cơ chế mà **viết cẩn thận hơn thì mất an toàn** thì nó không phải cơ chế an toàn. Nay chỉ một
thẻ ĐÚNG KHUÔN mới là "đã duyệt"; mọi thứ khác là CHƯA. Cộng ba chỗ nữa: câu *"đã gỡ"* in cả khi
không gỡ được gì · dòng ⚠ tắt cho mọi commit khi chỉ một commit có nhãn · đọc thông điệp hai lượt.

**Và ba vế trong phép ghim cũng bị siết:** `doesNotMatch` một mình **xanh được khi tiến trình chết
vì lý do khác** — đã dính đúng bẫy đó một lần trong chính lượt viết nó. Nay mỗi vế thành công đòi
**mã thoát 0** cộng một chuỗi **dương**.

**VÒNG AUDIT THỨ BA (1.8.5) LẠI TÌM RA — và lần này tôi vá GỐC, bản 1.8.6.** `pending`, `none`,
`todo`, `not-reviewed` đều bị đọc thành **ĐÃ DUYỆT**, vì 1.8.5 nhận *bất kỳ thẻ đúng khuôn* làm tên
người duyệt. Gốc bệnh: **người viết commit tự định nghĩa "đã duyệt"**. Chuỗi tự do thì không phân
biệt được `codex-r03` với `pending`. Nay `.repo-structure.json` khai `audit.nguoi_duyet`, ngoài
danh sách là CHƯA — một phép so danh sách **thay chỗ** hai mẹo dò chuỗi.

**Vá ba lần cùng một chỗ là dấu hiệu vá sai tầng.** Ghi ra vì nó sẽ lặp ở mục khác.

**đóng khi:** vẫn như trên, CỘNG một lượt audit độc lập cho bản **1.8.6** không còn tìm ra lối
fail-open nào. Ba vòng đầu, vòng nào cũng tìm ra — nên đừng coi "đã qua một vòng" là đủ.

**GIỚI HẠN AUDIT NÊU, CHƯA VÁ và có lý do:** một commit khai tên người duyệt **không bị ràng buộc**
với khoảng commit thật sự đã kiểm — nó gỡ theo *thứ tự*, không theo *phạm vi đã soi*. Vá đúng cần
một lệnh nghiệm thu ghi phạm vi vào dấu, tức `Y-02`. Cho tới lúc đó, cơ chế này là *"đưa một lời tự
khai tới máy"*, **không phải** máy canh *"đã qua audit độc lập"* — và câu đó phải nằm nguyên ở đây,
không được nói gọn thành "đã có máy canh".

### KHUNG-57 · `can-nang.mjs` chạy **603 giây** — đắt hơn cả bộ test, mà số nó in ra lấy được trong 0 giây

Đo 09/09 trên repo nhà, đồng hồ tường:

| Lệnh | Giây | Ghi chú |
|---|---|---|
| `node scripts/rule-compiler.mjs --nap` | **0** | |
| `node scripts/check-bootstrap.mjs` | **14** | |
| `node scripts/session-check.mjs --quick` | **34** | đã gồm mục "Ngân sách trong trần" |
| `npm test` (22 suite) | **582** | dấu xác nhận, `so_suite: 22` |
| **`node scripts/can-nang.mjs`** | **603** | **đắt hơn cả `npm test`** |

`AGENTS.md` mục 8 kết bằng đúng lệnh này — *"Cân nặng được ĐO, không để cảm tính"* + `npm run
can-nang`. Tức hiến pháp mời mọi phiên chạy một lệnh **10 phút**, ở đúng lúc phiên đang muốn cân
nhắc thêm một dòng luật. Lệnh nào đắt hơn cả bộ test thì phiên sau sẽ bỏ qua nó, rồi quay lại
đúng chỗ *"cảm tính luôn nói thêm một cái nữa thì có sao đâu"*.

**Và con số chính nó in ra thì miễn phí.** Vế kho chữ, đo cùng lúc:

```bash
find docs -name "*.md" -not -path "docs/adr/*" -not -path "docs/archive/*" \
  -not -path "docs/migrations/*" -exec cat {} + | wc -l      # 3371, trong 0 giây
```

`session-check` báo `3371/3371` — **khớp từng đơn vị**. Phiên này đã gọi cổng 34 giây **tám lượt**
để lấy một con số có sẵn trong 0 giây: **~4,5 phút đốt vì chọn nhầm dụng cụ đo.**

**Chưa dò ra hàm nào chậm** — mới đo ở mức lệnh, chưa mở máy. Nghi cùng họ với KHUNG-9/KHUNG-10
(quét đệ quy cả `docs/` nhiều lượt).

**đóng khi:** `node scripts/can-nang.mjs` ở repo nhà chạy **dưới 30 giây** (đo bằng đồng hồ tường,
ghi số vào mục này), in ra **đúng cùng các con số** như trước khi vá — đối chiếu từng vế với
`session-check`, không chỉ "trông giống" — và có một phép ghim canh trần thời gian đó, để lần sau
nó chậm lại thì máy nói chứ không phải người phát hiện sau 10 phút chờ.


### KHUNG-58 · Hai chỗ audit độc lập 10/09 NÊU mà chưa dựng nổi ca hỏng

Lượt audit độc lập cho bản 1.8.2 tìm ra **một lỗi thật** (đã vá ở 1.8.3, kèm phép ghim) và nêu
thêm hai chỗ nó **không kết luận được** vì sandbox không đọc được repo. Ghi ra đây để không ai
tưởng chúng đã được trả lời — và cũng để không ai vá một thứ chưa có ca hỏng.

**⒜ Hợp đồng của dấu xác nhận với repo TIÊU THỤ chưa được viết ra.** Bản 1.8.3 bỏ
`.agents/claims.json` khỏi băm cây, với lập luận *"không suite nào phụ thuộc nội dung bảng
quyền"*. Ở repo NHÀ tôi đã soát và điều đó đúng: mọi suite tự dựng bảng quyền trong fixture của
nó, và `tests/bang-song.mjs` đọc **mã nguồn** của bộ sinh chứ không đọc bảng thật. Nhưng cổng
này **được phát đi**, và một repo tiêu thụ hoàn toàn có thể viết một suite đọc
`.agents/claims.json` trên **đĩa**. Lúc đó một dấu xanh cũ có thể được dùng lại sai.

Audit nói đúng một điều then chốt: `isBehaviourFile(".agents/claims.json") === false` chỉ chứng
minh **cách phân loại của bộ đếm hành vi**, nó KHÔNG chứng minh suite độc lập với file đó.

**đóng khi:** hoặc ⑴ có một phép kiểm ĐỎ khi một suite của repo đọc `.agents/claims.json` từ đĩa
(bắt được bằng dò mã nguồn suite, cùng kiểu `bang-song.mjs` khối 7 đã làm), hoặc ⑵ hợp đồng này
được ghi thành một câu trong `docs/protocols/MULTIFLOW.md` **và** `upgrade.mjs` nêu nó lúc phát.
Đừng làm cả hai.

**⒝ Một vùng có thể vừa là "phần của bạn" vừa là "của phiên khác" trong cùng một câu.** Sau khi
`myRootAreas` / `myPackages` nhận thêm đường nhãn `Lane:`, một vùng mà tôi **đã commit** nhưng
lane khác **đang giữ khoá** rơi vào cả hai rổ. Hệ quả đo được: `doPhamVi` in nó ở *"Phần của
bạn"* **và** ở *"bỏ qua (của phiên khác)"*.

Không phải lỗ bảo vệ — `mine()` thành `true` là **siết**, không phải nới, nên vùng chỉ-thêm và
Log HANDOFF soi kỹ hơn. Nhưng nó là một câu **tự mâu thuẫn**, đúng họ bệnh `KHUNG-15`: cổng nói
sai một cách tự tin thì người đọc tin và đi sai hướng. Biến `rootMine`/`rootTouched` mà audit nêu
cùng chỗ đã **xoá** ở 1.8.3 — code chết, nghĩa của nó không lệch được.

**đóng khi:** một kho hai lane, lane A commit vào `_docs` rồi lane B nhận khoá `_docs`, và cổng
của A in vùng đó ở **đúng một** rổ, kèm câu nói rõ *"của tôi, nhưng lane khác đang giữ khoá"*.

Vùng: `_code`.

### KHUNG-60 · `Chrome_Extension_AI_Agentic` đã có `commit-msg` RIÊNG — nâng lên 1.8.10 là hai cửa tranh một tên file

**Đo 10/09, không phải giả định.** Repo đó ghim bản khung `1.8.0`, và nó **đã có**
`.githooks/commit-msg` của riêng nó (*"chốt cuối của N-40/N-05"*) với `core.hooksPath=.githooks`
đặt sẵn. Bộ khung 1.8.10 phát một file **cùng đường dẫn, cùng tên**.

Máy đã chặn đúng — `upgrade --plan` xếp nó vào `CHƯA GHIM`, và `--apply` **TỪ CHỐI** (mã 3), nêu
tên file. Không mất gì. Nhưng nó cũng nghĩa là **repo đó không nâng được** cho tới khi có người
quyết, và `--force` ở đây sẽ **xoá cửa N-40/N-05 của họ** — im lặng.

Ba lối, chưa cái nào đo: ⑴ gộp hai cửa vào một file (cửa của họ gọi thêm `claim.mjs --cua-index`)
· ⑵ bộ khung đổi sang một tên khác (`.githooks/commit-msg` là tên git đòi, nên phải là một hook
gọi nhiều script) · ⑶ để repo đó tự giữ cửa của mình và khai miễn trừ.

**Cùng họ với `KHUNG-59`:** cả hai đều là *"một tài nguyên dùng chung mà không ai khai chủ"* —
lần trước là index, lần này là tên file hook.

**đóng khi:** repo đó `upgrade --apply` lên bản mới nhất mà **cả hai cửa còn chạy** — dựng nổi ca
hỏng bằng một phép ghim (repo đích có hook riêng + `--apply` → cửa của họ vẫn từ chối đúng ca của
nó, cửa index vẫn từ chối đúng ca của nó), và `--force` không còn là đường xoá im lặng.

Vùng: `_template`.

### KHUNG-59 · Hai lane chung một cây git thì chung luôn **INDEX** — `git add` của tôi, `git commit` của họ

**Xảy ra HAI LẦN trong một ngày, hai chiều ngược nhau, hai lane khác nhau.** Đây là cơ chế, không
phải sơ suất của ai.

| Lượt | Ai `git add` | Ai `git commit` | Kết quả |
|---|---|---|---|
| 09/09 | `harness-migrate-3repo` (`git add -A`) | chính nó | cuốn 2 file `scripts/` **đang sửa dở** của `harness-loi-02` vào `69e0a84` |
| 10/09 | `harness-migrate-3repo` (`git add` 7 file, đã `--soat` XANH) | **`harness-loi-02`** | 7 file protocol của tôi bị gom vào `ed08d0f` của họ; `git commit` của tôi trả *"nothing to commit"* |

**Lượt 10/09 đã được lane kia TỰ SỬA** — họ dựng lại commit (`ed08d0f` → `ecd9137`) không kèm file
của tôi, và trả nội dung về cây làm việc để tôi commit dưới nhãn của mình. Cả hai lượt đều hồi
phục được **vì có người nhìn thấy**. Đó chính là chỗ đáng lo: cơ chế không bắt, chỉ có mắt người
bắt.

**Gốc: `claim` bảo vệ FILE, `safe-push` bảo vệ lượt ĐẨY — không lớp nào bảo vệ INDEX.** Một cây
làm việc có **đúng một** index dùng chung. Nên giữa `git add` và `git commit` của tôi, bất kỳ
`git commit` nào của lane khác cũng gom trọn thứ tôi vừa dàn — và ngược lại.

`--soat` **không cứu được**, và nó không sai: nó soi index **tại thời điểm được gọi**. Cửa sổ nguy
hiểm nằm **sau** nó.

**Hệ quả đo được:** ở lượt 10/09, `--soat` báo *"7 file · 0 file bạn KHÔNG có quyền ghi"*, rồi
`git commit` của tôi trả *"nothing to commit, working tree clean"* — việc đã bị commit mất, dưới
tên người khác. **Không mất nội dung, mất TRUY NGUỒN.** Mà truy nguồn chính là thứ nhãn `Lane:`
sinh ra để giữ, và là điều kiện `safe-push` kiểm.

**Chưa đề xuất bản vá** — chỗ này chạm `safe-push`, `claim` và cả cách phiên gọi git, nên phải có
người quyết kiến trúc trước. Ba hướng đã nghĩ tới, chưa cái nào đo: `git commit -- <đường dẫn>`
bỏ qua index dùng chung · mỗi lane một `git worktree` riêng · một khoá INDEX giữ trong khoảnh khắc
`add`→`commit`.

**ĐÃ VÁ 10/09 — bản 1.8.8, CHỜ AUDIT ĐỘC LẬP RỒI MỚI GẠCH MÃ** (mục 5: người sửa không tự
nghiệm thu). Cơ chế: `.githooks/commit-msg` đọc nhãn `Lane:` rồi gọi `claim.mjs --cua-index`;
cửa từ chối khi mẻ sắp vào commit có đường dẫn mà **chủ không phải lane đó**.

Ba điều ĐO ĐƯỢC, không suy từ tài liệu git — fixture rời, bốn ca:

| Đo | Số |
|---|---|
| `commit-msg` thấy đúng mẻ sắp commit ở cả `--only` và `-a` | git đặt `GIT_INDEX_FILE` sang index TẠM |
| hook thoát ≠ 0 | commit BỊ HUỶ, HEAD không đổi, **index của lane kia còn nguyên** |
| `git commit --only <đường dẫn>` | không cuốn file lane khác, kể cả khi họ đã `git add` |

**Ba quyết định phải soi khi audit, không phải ba dòng code:**

⑴ **Cửa HẸP HƠN `--soat`, cố ý.** `--soat` chặn cả file **vô chủ**; cửa chỉ chặn file **có chủ
khác**. Vì cửa chạy ở MỌI commit của MỌI lane: chặn oan một lượt hợp lệ là dạy người ta mở
`--no-verify` cho mọi lượt. Cái MẤT: lane quên nhận khoá vẫn commit được — kỷ luật khoá vẫn là
việc của `--soat` và của cổng.

⑵ **Ở `commit-msg`, không ở `pre-commit`.** Cửa cần biết AI ĐANG COMMIT, và câu trả lời duy nhất
máy đọc được là nhãn `Lane:` — chỉ `commit-msg` thấy lời nhắn. Hệ quả: **thiếu nhãn thì cửa im
lặng**, cố ý — cửa đó là phép kiểm "Nhãn lane trong commit" của cổng và của `safe-push`.

⑶ **`core.hooksPath` không theo git được** (cấu hình mỗi bản sao). Nên `claim.mjs --sua` tự bật
nó, và cổng đóng phiên ĐỎ `CUA_INDEX_TAT` nếu tắt. Đã trỏ nơi khác thì **nêu tên, không ghi đè**.

**Chính fixture lôi ra một lỗi trong bản vá:** cửa suy gốc repo từ **vị trí module**, nên đọc
index tạm của cây đang commit bằng gốc repo khác → `fatal: unable to read <oid>`, và cửa
fail-closed sẽ **chặn mọi commit**. Vá bằng `--goc` do hook truyền vào. Chỗ này sẽ va thật ở
`KHUNG-50`: một `git worktree` riêng có gốc khác gốc module.

**VÒNG AUDIT ĐỘC LẬP 10/09 trả `REVISE`, và nó đúng cả bốn chỗ** — tự dựng lại từng ca rồi mới
tin (luật vàng 4). Bốn fail-open THẬT trong bản đầu của tôi, nay đã vá và đã ghim:

| Mã | Ca hỏng | Vá |
|---|---|---|
| `CUA_INDEX_AMEND_BYPASS` | commit KHÔNG nhãn (cửa im lặng) → `git commit --amend` thêm nhãn của mình. Index bằng HEAD nên `diff --cached` RỖNG → cửa cho qua. Commit cuối mang tên tôi, chứa việc lane khác, **và cổng không thấy gì lạ vì nhãn đã có** | mẻ rỗng thì soi lại nội dung so với `HEAD^` |
| `CUA_INDEX_PATH_LOSS` | `--name-only` trần thì git TRÍCH DẪN đường dẫn ngoài ASCII, tên đã trích dẫn không khớp bảng quyền → file CÓ CHỦ đọc thành VÔ CHỦ. Repo này có sẵn danh sách `grandfathered` toàn đường dẫn tiếng Việt có dấu | `-z` + `core.quotepath=false`, không `trim` — ở CẢ `--cua-index` và `--soat` |
| `CUA_INDEX_LANE_AMBIGUOUS` | hook tự đọc nhãn bằng `sed 's/^[Ll]ane:…' \| head -1` = **bộ đọc thứ hai** cho khái niệm đã có nhà. Lệch `laneFromMessage` ở chữ thường · nhiều nhãn · nhãn có khoảng trắng. Nên `lane: A` + `Lane: B` lọt cửa dưới tên A rồi được cổng quy cho B | hook chuyển nguyên FILE lời nhắn; `claim.mjs` gọi `laneFromMessage`. Nhãn không quy thuộc được → TỪ CHỐI |
| `CUA_INDEX_ACTIVATION_GAP` | phép kiểm ở cổng chỉ hỏi *"file hook có tồn tại không"*, nên **xoá file hook đi là cổng chuyển sang XANH** | phân biệt *"repo theo dõi mà file mất"* (ĐỎ) với *"repo chưa nhận cửa"* (bỏ qua) |

**Bài học tầng, không phải bài học dòng:** ba trong bốn chỗ là **tôi tự viết bản thứ hai của một
thứ đã có** — bộ đọc nhãn, cách đọc tên file từ index, và cách hỏi "cửa có đó không". Cùng họ với
bài học 10/09 *"vá ba lần cùng một chỗ = vá SAI TẦNG"*.

**Codex nêu hai chỗ tôi KHÔNG sửa, kèm lý do:**
⑴ *"khoá file thuộc A mà vùng thuộc B thì B qua cửa"* — trạng thái đó **không dựng nổi** bằng
lệnh: `khoaFileTrongVung` (CHIỀU HAI của luật chứa nhau) chặn B nhận vùng khi A còn khoá file
trong đó, và `quyetDinhSua` chặn A nhận khoá file trong vùng của B. Đã ghim ở `tests/khoa-file.mjs`.
⑵ *"lane không gọi `--sua`, không chạy cổng thì cửa không bật"* — đúng, và **không có máy nào
với tới**: lane đó cũng bỏ qua mọi lớp khác. Nó là đường bỏ-qua-hết, không phải đường lách cửa.

**CÒN HỞ, mang theo cả vế này:** cửa chỉ thấy thứ **đã khai vào bảng quyền**. Hai lane đều không
nhận khoá thì không lớp nào biết của ai — bảng quyền là bằng chứng duy nhất máy có.

**đóng khi:** hai lane cùng chạy trên một cây **không thể** commit chéo việc của nhau — dựng được
ca hỏng bằng một phép ghim (lane A `add`, lane B `commit`, và B **không** nuốt file của A), phép
ghim đó ĐỎ trên bản hôm nay, và `AGENTS.md` mục 0b nêu cách gọi git đã chốt. Không đóng bằng một
dòng dặn *"nhớ commit ngay sau add"* — dặn dò thì lần thứ ba sẽ có người bỏ qua, và lần này người
bỏ qua đã là hai lane khác nhau trong cùng một ngày.
