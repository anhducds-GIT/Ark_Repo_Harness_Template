# CHANGELOG

> Mỗi bản một khối. **Chỉ thêm, không sửa khối cũ.** Máy đọc file này để dựng mục Nhật ký trên
> bảng, nên giữ đúng định dạng: `## <phiên bản> — <ngày> — <một câu>`.

## 1.8.8 — 2026-09-10 — CỬA INDEX: `git commit` của bạn thôi cuốn được việc lane khác (KHUNG-59)

**Ca hỏng thật, hai lượt trong một ngày, hai chiều, hai lane.** Một cây làm việc git có ĐÚNG MỘT
index, nên giữa `git add` và `git commit` của lane A, bất kỳ `git commit` nào của lane B cũng gom
trọn mẻ của A. Không mất nội dung — **mất truy nguồn**, đúng thứ nhãn `Lane:` sinh ra để giữ. Cả
hai lượt hồi phục được **vì có mắt người nhìn thấy**; cơ chế không bắt gì.

`.githooks/commit-msg` đọc nhãn `Lane:` rồi gọi `claim.mjs --cua-index`, và từ chối khi mẻ sắp
vào commit có đường dẫn mà chủ không phải lane đó. `claim.mjs --sua` tự bật `core.hooksPath`
(cấu hình mỗi bản sao, không theo git được); cổng đóng phiên ĐỎ `CUA_INDEX_TAT` nếu nó tắt.

| Đo trên fixture rời | Kết quả |
|---|---|
| hook thấy gì ở `commit --only` và `commit -a` | ĐÚNG mẻ sắp commit — git đặt `GIT_INDEX_FILE` sang index TẠM |
| hook thoát ≠ 0 | commit BỊ HUỶ · HEAD không đổi · **mẻ của lane kia còn nguyên trong index** |
| `git commit --only <đường dẫn>` | không cuốn file lane khác, kể cả khi họ đã `git add` |
| tháo cửa ra | ca hỏng KHUNG-59 **quay lại** — vế 3e của phép ghim |

**Cửa HẸP HƠN `--soat`, cố ý.** `--soat` chặn cả file vô chủ; cửa chỉ chặn file **có chủ khác**.
Cửa này chạy ở MỌI commit của MỌI lane, và một cửa chặn oan sẽ bị mở `--no-verify` trong một
ngày. Cái MẤT nói thẳng: lane quên nhận khoá vẫn commit được.

**Ở `commit-msg`, không `pre-commit`:** cửa cần biết AI nào đang commit, và chỉ `commit-msg` thấy
lời nhắn. Nên **thiếu nhãn `Lane:` thì cửa im lặng** — cửa đó đã có (phép kiểm nhãn lane của cổng
và của `safe-push`), và hai cửa canh một điều là hai câu trả lời cho một câu hỏi.

**Fixture lôi ra một lỗi trong chính bản vá này:** cửa suy gốc repo từ vị trí module, nên đọc
index tạm của cây đang commit bằng gốc khác → `fatal: unable to read <oid>`, và cửa fail-closed
sẽ chặn MỌI commit. Vá bằng `--goc` hook truyền vào — sẽ va thật ở `KHUNG-50` (`git worktree`
riêng có gốc khác gốc module). Đây là lần thứ hai trong hai phiên fixture bắt lỗi mà đọc code
không thấy.

**Ngân sách:** phần nạp 4.161 → **4.169/4.200 token** cho cả một cơ chế mới, nhờ gộp hai đoạn
trùng nhau trong `STATUS.md` (`next_step` và `current_focus` nói cùng một câu *"MỘT bệnh"*). Kho
chữ **3.117/3.117**, không đổi — mục bản đồ file nối vào dòng `ADR-0012` sẵn có thay vì thêm dòng.

`tests/cua-index.mjs`: **8 vế** trên fixture git thật, **5 đột biến đã chạy** (cửa luôn cho qua ·
cửa rộng bằng `--soat` · hook rỗng · hook thiếu `--goc` · `hooksPath` tắt). Suite 22 → **23**.

**CÒN HỞ:** cửa chỉ thấy thứ đã khai vào bảng quyền — hai lane đều không nhận khoá thì không lớp
nào biết của ai. **`KHUNG-59` chưa gạch mã:** chờ audit độc lập, mục 5.

## 1.8.7 — 2026-09-10 — Vòng audit 4 nói *"logic ĐẠT"*, và một chỗ fail-SILENT cuối

**Vòng audit độc lập thứ tư kết luận: *"Logic bản vá: ĐẠT. Không xác định được lỗi bắt buộc sửa
ngay."*** Nó tự chạy lại parser và báo **27/27 ca đạt kỳ vọng**, và nói thêm một câu đáng giữ:
*"Không dùng giới hạn đó để buộc thêm một vòng vá chuỗi."*

Bản này làm **đúng một** việc vòng 4 nêu: `nguoiDuyetFrom` bản trước `filter` thẳng, nên repo khai
`Duc` (hoa) hay `nguyen van a` (có khoảng trắng) thì tên đó **rơi mất không một tiếng nào** —
người khai tưởng mình đã cấp quyền duyệt, mà thật ra chưa. Không phải lỗ nhận nhầm; nó là chỗ
**fail SILENT**, và repo này có luật riêng cho đúng chuyện đó.

Nay `safe-push` **nêu đích danh** tên sai khuôn, và **chỉ nêu — không đổi mã thoát**. Không tự
chuẩn hoá (không tự hạ chữ thường): đoán ý người khai là một cửa khác.

Ghim: khối `Audit:` **9 vế** (thêm vế ⑼ — nêu tên sai khuôn, và cấm nó đổi mã thoát).

**Bốn vòng audit, và đây là hình dạng đường đi — đáng giữ hơn bản thân bản vá:**

| Vòng | Kết luận | Cái nó bắt |
|---|---|---|
| 1 | CẦN SỬA | cổng nhận *một dòng tổng bất kỳ* là suite xanh → **fail-open ở repo tiêu thụ** |
| 2 | CẦN SỬA | `chua-co (dang cho)` → **ĐÃ DUYỆT** |
| 3 | CẦN SỬA | `pending` · `none` · `todo` → **ĐÃ DUYỆT** |
| 4 | **logic ĐẠT** | một chỗ fail-silent ở cấu hình |

Ba vòng đầu, mỗi vòng bắt một **fail-open** mà người sửa không tự thấy. Không vòng nào là thừa.

**Giới hạn CÒN NGUYÊN, và vòng 4 xác nhận nó là giới hạn ĐÃ CÔNG BỐ, không phải lỗi:** ai cũng
viết được `Audit: codex`; danh sách kiểm **tên được phép**, không chứng minh người đó thực sự
duyệt. Nhãn cũng không ràng buộc với khoảng commit đã soi. Cần `Y-02`.

## 1.8.6 — 2026-09-10 — `pending` cũng là "đã duyệt": vòng audit thứ ba, và lần này vá GỐC

**Ba vòng audit độc lập mới tới được hình dạng đúng, và hai vòng đầu tôi vá SAI CHỖ.**

| Bản | Nó hỏi gì | Cái gì lọt |
|---|---|---|
| 1.8.4 | *"có đúng bằng `chua-co`?"* | `chua-co (dang cho)` · `chua co` → **ĐÃ DUYỆT** |
| 1.8.5 | *"có đúng khuôn một thẻ?"* | `pending` · `none` · `todo` · `not-reviewed` → **ĐÃ DUYỆT** |
| 1.8.6 | *"tên này có trong danh sách repo khai?"* | — |

Đo được cả sáu biến thể. Và mẹo `/^chua/` của 1.8.5 còn **chặn oan** một tên hợp lệ như `chuan`.

**GỐC BỆNH của cả hai vòng đầu — và nó không phải lỗi regex:** tôi để **người viết commit** tự
định nghĩa cái gì là *"đã duyệt"*. Một chuỗi tự do thì **không có cách nào** phân biệt `codex-r03`
với `pending` — cả hai chỉ là chữ. Mỗi vòng tôi lại bịt một chuỗi cụ thể, và vòng sau lại lòi ra
chuỗi khác. Đó là dấu hiệu vá sai tầng.

**Nay câu hỏi đổi CHỦ NGỮ:** `.repo-structure.json` khai `audit.nguoi_duyet` — **repo** nói trước
ai được duyệt, và **mọi thứ ngoài danh sách là CHƯA**. Hậu tố vòng `-rNN` được phép, nên `codex`
khai một lần là `codex-r03` dùng được.

**Đây là BỚT luật, không phải thêm:** một phép so danh sách **thay chỗ** hai mẹo dò chuỗi
(`=== "chua-co"` và `/^chua/`). Vừa chặt hơn vừa ít luật hơn — và hết cả ca chặn oan.

**Hai chỗ nữa vòng ba nêu, đã sửa:**

- `Audit:` mà **thiếu dấu cách đầu dòng** (` Audit: …`) hoặc `Audit : …` bị bỏ qua → lời khai mất
  im lặng. Nay khớp `/^\s*audit\s*:/i`.
- **Lời khuyên SAI:** cổng bảo *"để commit đó nằm lại, đẩy riêng phần còn lại"*. Không làm được:
  với `origin → A(chưa duyệt) → B`, đẩy tới B là mang cả A. Nay nói đúng — muốn tách thì
  `cherry-pick` phần độc lập sang nhánh khác rồi chạy lại cổng ở đó.
- **Một commit MỘT lời khai:** hai dòng `Audit:` khác nhau → `AUDIT_XUNG_DOT`, cùng khuôn
  `LANE_XUNG_DOT` đã có.

Ghim: khối `Audit:` **8 vế**, nay có **sáu** biến thể fail-open (thêm `pending`, `none`, tên lạ).
Vế thành công đòi mã thoát 0 **cộng** chuỗi dương; vế từ chối đòi đúng **thông báo của cửa audit**,
không chỉ mã 1 — mã 1 một mình không phân biệt được nó chết ở cửa nào. Bảy đột biến, mỗi lượt ĐỎ
đúng vế của nó.

**GIỚI HẠN CÒN NGUYÊN, và audit nói thẳng — đừng nói gọn:** một commit khai tên người duyệt **không
bị ràng buộc** với khoảng commit thật sự đã soi; nó gỡ theo *thứ tự*, không theo *phạm vi*. Nên cơ
chế này là *"đưa một lời tự khai tới máy"*, **KHÔNG phải** máy canh *"đã qua audit độc lập"*. Vá
đúng cần `Y-02`.

## 1.8.5 — 2026-09-10 — Chính cửa audit vừa dựng có HAI lối fail-open, và audit độc lập bắt được

**Bản 1.8.4 hỏi ngược chiều.** Nó hỏi *"giá trị có đúng bằng `chua-co` không? Không thì coi là tên
người duyệt."* Hai ca đo được, cả hai **FAIL-OPEN**, và ca thứ nhất là câu **một người cẩn thận sẽ
tự viết**:

| Nhãn | 1.8.4 đọc thành | Đúng phải là |
|---|---|---|
| `Audit: chua-co (dang cho Codex)` | **ĐÃ DUYỆT** | chưa duyệt |
| `Audit: chua co` (dấu cách thay gạch) | **ĐÃ DUYỆT** | chưa duyệt |
| `AUDIT: chua-co` (khoá viết hoa) | không khai — lời khai **mất im lặng** | chưa duyệt |

Ca đầu nguy nhất: người viết thêm ghi chú *để rõ hơn*, và cái cửa mở ra. Một cơ chế mà **viết
cẩn thận hơn thì mất an toàn** thì nó không phải cơ chế an toàn.

**Nay hỏi đúng chiều — CHỈ một thẻ người-duyệt ĐÚNG KHUÔN mới là "đã duyệt"**, `^[a-z0-9][a-z0-9._-]*$`:
một thẻ, không khoảng trắng, không mở đầu bằng `chua`. Rỗng, mở đầu `chua`, hay không đọc được →
**CHƯA**, kèm mã lỗi `AUDIT_KHONG_DOC_DUOC`. Khoá `Audit:` so không phân biệt hoa thường. Cùng
khuôn `laneFromMessage` đã dùng cho `LANE_CO_KHOANG_TRANG`.

**Ba chỗ nữa audit nêu, đã sửa:**

- Cổng in *"đã gỡ lời khai cũ"* **kể cả khi không gỡ được cái nào** (lời khai mới hơn nên không
  thuộc diện gỡ). Một câu đúng-một-nửa ở cổng là đúng họ bệnh `KHUNG-15`. Nay chỉ nói khi thật sự
  gỡ được, và nói **gỡ mấy cái**.
- Dòng ⚠ tự dạy tắt cho **mọi** commit code khi chỉ **một** commit có nhãn. Nay **đếm commit thiếu
  khai**, và in `N/M`.
- Đọc thông điệp commit **hai lượt** (một cho cảnh báo, một cho cửa) → gộp còn một lượt.

**Và ba chỗ trong PHÉP GHIM cũng bị siết, vì audit nói đúng:** `doesNotMatch` một mình **xanh được
khi tiến trình chết vì lý do khác** — tôi đã dính đúng bẫy đó một lần trong chính lượt viết nó.
Nay mỗi vế thành công đòi **mã thoát 0** cộng một chuỗi **dương**, không chỉ phủ định.

Ghim: `dau-suite-smoke.mjs` **8 vế** trong khối `Audit:` (thêm vế ⑻ cho ba biến thể fail-open).
Sáu đột biến trên bản chép cách ly, mỗi lượt ĐỎ đúng vế của nó — kể cả lượt trả parser về nghĩa 1.8.4.

**Giới hạn KHÔNG đổi, và audit nói thẳng:** nhãn do người sửa TỰ KHAI, và một commit khai tên người
duyệt **không bị ràng buộc** với khoảng commit thật sự đã kiểm. Nên đây là *"đưa một lời tự khai
tới máy"*, **chưa** phải máy canh *"đã qua audit độc lập"*. Bản chặt hơn là `Y-02`.

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

| Chốt gì | Tránh cái gì |
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
