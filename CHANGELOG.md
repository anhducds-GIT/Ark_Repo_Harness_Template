# CHANGELOG

> Mỗi bản một khối. **Chỉ thêm, không sửa khối cũ.** Máy đọc file này để dựng mục Nhật ký trên
> bảng, nên giữ đúng định dạng: `## <phiên bản> — <ngày> — <một câu>`.

## 1.2.5 — 2026-09-03 — Sổ phát hành thôi tự làm chứng cho chính nó

v1.2.4 dựng sổ phát hành để một số phiên bản trỏ tới đúng một nội dung. Audit độc lập đọc lại
và thấy **chính cái sổ ấy fail-open** — tôi vừa dựng lại đúng cái bẫy đã vá ở v1.2.1, ở một chỗ
mới.

| Ca | v1.2.4 | v1.2.5 |
|---|---|---|
| Sổ **hỏng** hoặc bị **xoá** | bắt lỗi → trả `{}` → coi là "chưa ghi" → **bộ sinh tự dựng lại** | `SO_PHAT_HANH_HONG`, dừng cả ba đường |
| Sổ **đọc không được** (không phải thiếu) | như trên | phân biệt được: chỉ `ENOENT` mới là "chưa có" |
| Sửa (hoặc xoá) một **bản đã phát** | đi lọt: sửa nguồn + sửa dòng cho khớp là mọi phép so đều xanh | so với bản sổ **trong HEAD** → `SUA_LICH_SU` |
| Từ chối vì sổ lệch | xoá `template/`, ghi 22 file, **rồi** mới từ chối | preflight — từ chối trước, `template/` còn nguyên |

Ca thứ nhất là đường vòng thật: **sửa nguồn → xoá sổ → chạy bộ sinh**, và cùng một số phiên bản
được đóng lại với dấu vân tay mới, không một lời cảnh báo.

Ca thứ ba đáng nói riêng, vì nó là vế yếu nhất của cả cơ chế: **sổ tự làm chứng cho chính nó.**
Vật đối chiếu duy nhất không sửa kèm được trong cùng một thao tác là bản sổ **đã nằm trong
HEAD**. Nói rõ biên: khoá của bản đang soạn chưa vào HEAD nên chưa được canh — đúng, vì lúc đó
bạn vẫn đang viết bản phát ấy; và ai cố ý vẫn sửa được cả hai rồi commit đè. Nó không chặn gian
lận có chủ đích, nó chặn chuyện "sửa cho xong" và bắt gian lận phải để lại vết trong lịch sử.

Sáu phép đột biến ngược: **năm bị bắt**. Cái thứ sáu — `ghiSoPhatHanh` từ chối mọi trạng thái xấu
— **không bắt được, và đó là câu trả lời đúng**: preflight đã chặn trước khi tới nó. Đã ghi
`ponytail:` ngay tại dòng đó thay vì giả vờ nó có phép kiểm.

Sửa luôn: repo canonical đã đổi tên thành **`Ark_Repo_Harness_Template`**, mà trường `source`
trong mọi sổ ghim còn trỏ tên cũ — nay chỉ còn sống nhờ redirect của GitHub, và redirect đó
đứt nếu có ai tạo repo mới trùng tên cũ. Suite 69.

## 1.2.4 — 2026-09-03 — Một số phiên bản trỏ tới đúng một nội dung, và không lùi được nữa

Hai lỗ, cùng một gốc: **bản trích và số phiên bản đều dựng từ nguồn đang sống**, nên không có
gì ghi lại "1.2.4 là nội dung nào".

**Lỗ một — cùng một nhãn, hai nội dung.** Cửa "cùng số bản, khác nội dung" của v1.2.1 chỉ mở
khi repo đích **đang ở đúng số bản hiện tại**. Nên chỉ cần một lần sửa file tầng máy mà quên
tăng phiên bản là đủ:

| Repo | Vào cửa đó? | Kết cục |
|---|---|---|
| đang ở bản **cũ** | không | được nâng lên nội dung mới, **đóng dấu 1.2.4** |
| đã ở **1.2.4** | có | bị chặn, giữ nội dung cũ, **vẫn mang dấu 1.2.4** |

Hai repo, cùng một con số, hai nội dung — đúng cái bệnh mà số phiên bản sinh ra để chữa, chỉ
dịch đi một bước.

Nay có **`RELEASE-LEDGER.json`**: mỗi phiên bản ↔ dấu vân tay tầng máy của nó, **chỉ thêm**.
Sửa nội dung tầng máy mà không tăng phiên bản thì sổ lệch, và ba chỗ cùng chặn: `npm test` đỏ ·
bộ sinh **từ chối tự sửa dòng cũ** · `upgrade.mjs` không phát đi được, **với mọi repo đích**,
kể cả `--force` — vì lỗi nằm ở repo **nhà**.

**Lỗ hai — hạ cấp im lặng.** Chỗ so sánh chỉ nhìn nội dung, không nhìn thứ tự phiên bản. Chạy
bộ khung 1.2.3 lên một repo đã ghim 1.3.0 thì file của 1.3.0 bị gọi là **`CŨ`** — sai hẳn
nghĩa, nó *mới hơn* — rồi `--apply` ghi bản cũ đè lên. Đã dựng lại được ca này: repo mất nguyên
nội dung 1.3.0, sổ ghim tụt về 1.2.3, **thoát 0, không một lời cảnh báo**.

Nay `HA_CAP` dừng lại. Gần như luôn là máy chưa `git pull`. `--force` vẫn lùi được — lùi một
bản vá hỏng là việc có thật — nhưng phải nói to.

Năm phép đột biến ngược, cả năm đều bị bắt. Suite 66.

## 1.2.3 — 2026-09-03 — Cổng cấu trúc trên CI có răng, và `--plan` thôi nói sai

Audit độc lập chỉ đúng một chỗ nữa, và nó vô hiệu hoá gần hết giá trị của CI vừa dựng:
`bootstrap.blocking` ở repo nhà **để rỗng**, mà `check-bootstrap` chỉ thoát khác 0 khi một
phép kiểm nằm trong danh sách đó bị đỏ. Nên B1–B15 có thể in **ĐỎ đầy màn hình** và CI —
vốn chỉ đọc mã thoát — **vẫn xanh**. Bật "required status check" trên GitHub cũng không sửa
được: nút đó cưỡng chế một kết quả, mà kết quả đang là xanh.

Đã bật tám mã `B1 B2 B3 B4 B5 B7 B10 B12`. Repo đang 0 chỗ đỏ nên bật được ngay, không tự
khoá mình. Phép kiểm mới **F9** giữ hai vế: repo nhà có bật đủ tám mã không, **và** cơ chế có
răng thật không — nó dựng một repo thật, làm đỏ B3, rồi xem lệnh có thoát khác 0 không.
Đột biến ngược cả hai vế đều bị bắt.

Một chi tiết F9 tự dạy lại: sửa `.repo-structure.json` rồi chạy ngay thì **không có tác dụng
gì** — bộ kiểm đọc cấu hình từ HEAD, không từ cây làm việc. Phải commit trước.

**`--plan` thôi nói sai.** Câu cuối của nó trước đây chỉ đếm số file, nên nó sai theo cả hai
chiều: bảo "chạy lại với `--apply`" cho ca `CHƯA GHIM` mà `--apply` sẽ từ chối, và bảo "không
có gì để nâng cấp" khi nội dung đã khớp nhưng **số ghim ở đích còn là bản cũ** — lúc đó
`--apply` có việc thật (đóng lại dấu phiên bản), và bỏ qua thì câu trả lời cho "repo này đang
dùng bản nào" sai vĩnh viễn. Nay câu cuối được tính từ đúng những điều kiện `--apply` dùng.

## 1.2.2 — 2026-09-03 — CI vừa bật đã bắt được một cái bẫy vô hình ở địa phương

Lượt chạy CI đầu tiên **đỏ ngay**, và nó đỏ vì một lỗi thật, không phải vì cấu hình CI:
`init-repo.mjs` tự commit hai lần, nên trên một máy chưa khai `user.name` / `user.email`
git từ chối ở đúng commit đầu — **sau khi** đã ghi cả bộ khung ra đĩa. Người dùng nhận một
repo dựng nửa chừng và một thông báo của git không nhắc gì tới bộ khung.

Không máy phát triển nào bắt được ca này: máy nào cũng đã khai danh tính từ lâu, nên cái bẫy
vô hình ở địa phương. **Mà người dùng thật thì đúng là đang ngồi trên một máy sạch** — tức là
đúng đối tượng của lệnh này lại là đúng người gặp lỗi.

Nay `init-repo` hỏi git trước khi ghi file nào: thiếu thì `THIEU_DANH_TINH_GIT`, chỉ luôn hai
lệnh để sửa, và **không ghi một file nào**. Không tự đặt danh tính hộ — commit mang tên do máy
bịa là gán việc cho một người không có thật. Phép kiểm dựng lại đúng máy sạch bằng
`GIT_CONFIG_GLOBAL`/`GIT_CONFIG_SYSTEM` trỏ vào chỗ không tồn tại.

Đây là lý do CI đáng có: nó không kiểm giỏi hơn cổng đóng phiên, nó chỉ chạy ở **một chỗ khác**.

## 1.2.1 — 2026-09-03 — Ba cửa v1.2 mở toang, và một lệnh tự quên

Audit độc lập vòng sau đọc lại chính bốn cửa vừa dựng, và **ba cái không đóng**. Cả ba đều
cùng một hình dạng: thông báo có, hành động không. Một cổng kiểm chỉ nói mà không chặn thì
nó tệ hơn không có cổng — vì nó làm người ta yên tâm.

| Ca | v1.2 làm gì | v1.2.1 làm gì |
|---|---|---|
| Cùng số bản, khác nội dung | in cảnh báo rồi **vẫn nâng cấp và vẫn ghi lại sổ ghim** | thoát 3, **không ghi một byte** — và `--force` KHÔNG mở được |
| Sổ ghim **không có** `bundle_digest` | cửa trên tự tắt: chỉ so khi digest là chuỗi | `THIEU_DAU_VAN_TAY`, dừng như trên |
| File `ĐÃ BỎ` | kể tên **đúng một lần**, rồi rơi khỏi sổ sau `--apply` | nhớ tiếp ở khối `retired`, tự rụng khi file bị xoá thật |
| `claim --take` chạy lại | không khai `--ai` là **xoá tên AI đã biết** | giữ tên cũ khi là quyền của chính mình |

Cửa thứ hai đáng nói riêng: **xoá đúng một dòng trong sổ ghim là tắt được cửa thứ nhất.**
Đúng cùng một hình dạng đường vòng mà `SO_GHIM_HONG` của v1.2 sinh ra để chặn — chặn được
một cửa rồi để hở cửa bên cạnh.

Và phép kiểm của v1.2 cho cửa thứ nhất mang đúng tiêu đề "→ DỪNG" nhưng chỉ soi thông báo
trên `--plan`. Nó xanh trong khi `--apply` vẫn đi tiếp. Nay nó kiểm cả ba: thoát khác 0 ·
file trên đĩa không đổi · sổ ghim không đổi.

**Thêm CI** (`.github/workflows/cong-kiem.yml`): mọi lớp bảo vệ trước nay chạy trên máy
người dùng, nên `git push` trần đi qua hết. GitHub chạy thì không ai tắt từ máy mình được.
Nó kiểm ba sự thật thuộc về repo — bộ phép kiểm · cấu trúc B1–B15 · artifact máy sinh còn
tươi — chứ không thay cổng đóng phiên, vì cổng đó hỏi những câu chỉ có nghĩa trong một phiên.

**Còn hở, nói thẳng:** đỏ trên CI chưa tự chặn merge (một nút trong Settings của GitHub,
quyền của Đức), và phép kiểm secret chưa chạy trên CI — bật Secret scanning + Push
protection của GitHub thì tốt hơn regex của chúng ta, vì nó chặn ngay lúc push.

## 1.2.0 — 2026-09-03 — Bốn cửa của nâng cấp: biết dừng trong bốn ca nữa

Audit độc lập giữ v1.1 ở trạng thái RC và chỉ đúng bốn chỗ. Cả bốn đã dựng được ca hỏng,
fixture đỏ trước bản vá, xanh sau.

| Ca | Trước | Nay |
|---|---|---|
| Sổ ghim **hỏng** | lẫn sang "chưa từng ghim", rồi **bị ghi đè** | `SO_GHIM_HONG`, dừng |
| **Chưa ghim** mà file đã khác | ghi đè **mặc định** | từ chối, phải `--force` |
| File bản khung **đã bỏ** | ở lại repo thành rác vô chủ | hiện là `ĐÃ BỎ`, kể tên, không tự xoá |
| Cùng số bản, **khác nội dung** | im lặng | `CUNG_BAN_KHAC_NOI_DUNG`, có `bundle_digest` |

Cái thứ nhất là đường vòng thật: **làm hỏng file sổ ghim là cách vượt qua lớp bảo vệ sửa tay**.
Xoá nửa file lock rồi `--apply` là mọi bản vá tại chỗ biến mất một cách hợp lệ.

**Chưa làm, để v1.3:** rollback cả lô, sao lưu trước `--force`, nâng cấp tầng LUẬT/TRẠNG THÁI.

## 1.1.0 — 2026-09-03 — Ghim phiên bản: vá một lần, đẩy đi nhiều repo

**Thêm**
- `scripts/upgrade.mjs` — `--plan` xem trước (chỉ đọc), `--apply` ghi. Sổ ghim
  `.ark/harness.lock.json` ở repo đích ghi bản khung đang dùng và dấu vân tay từng file máy.
- `docs/migrations/` giờ có bạn: sổ ghim trả lời "repo này đang chạy bản khung nào".

**Vì sao cần**

Trong đúng một phiên ngày 03/09, `session-check.mjs` phải chép tay sang hai repo **ba lần** vì
vá liên tục. Với 21 repo, mỗi vòng vá là 63 lần chép tay — và mỗi lần chép là một cơ hội để hai
bản trôi khỏi nhau. Đó chính là cách một bộ khung biến thành 21 bộ khung khác nhau.

**Điều quan trọng nhất nó làm: BIẾT DỪNG LẠI**

Sổ ghim tách được ba ca mà trước đây trông giống hệt nhau — vì so hai chiều thì cả ba đều "khác":

| | Nghĩa | Nâng cấp |
|---|---|---|
| **CŨ** | repo giữ đúng bản đã ghim, bộ khung tiến lên | ghi đè thoải mái |
| **SỬA TAY** | repo đã lệch khỏi bản đã ghim | **TỪ CHỐI** — đó là việc của người khác |
| **CHƯA GHIM** | không có sổ ghim, không đủ căn cứ kết luận | báo, không đoán |

Không có vế "SỬA TAY" thì `upgrade` chỉ là `cp -r` có nghi thức: nó xoá bản vá tại chỗ của
người khác, im lặng, và không ai biết cho tới lúc thứ gì đó hỏng.

**Đã ghim**: Project 3 AI Agent Unify · NAV Platform — cả hai ở `1.0.0`.

## 1.0.0 — 2026-09-03 — Đóng v1: hợp đồng lõi đã đúng, và đã chạy thật trên hai repo

**Vì sao gọi là 1.0**

Không phải "chạy được" — mà **mọi lớp bảo vệ đã được chứng minh là chặn thật**, bằng fixture
dựng được ca hỏng rồi thử phá. Và bộ khung đã lắp thật lên hai repo khác nghề: một repo Python
điều phối AI, một nền tảng chứng khoán Node + dữ liệu EOD thật.

**Sửa — bảy chỗ hợp đồng lõi (`tests/core-contract.mjs`)**
- Bộ đo từng chấm **mức 3 · 0/0/0** cho cấu hình mà runtime NÉM. Nay gọi đúng validator runtime.
- Chỉ đo được JavaScript: repo Python bị đo thành "code không đổi". Nay khai `behaviour_globs`.
- Vòng đời vẽ hai chặng mà validator TỪ CHỐI, còn bốn giá trị hợp lệ không có chặng nào.
- Lệnh git hỏng hoá thành chuỗi rỗng → "0 file · 0 thay đổi · 0 secret" → XANH. Nay là phép kiểm.
- Đổi **thứ tự khai** hai vùng lồng nhau là đổi chủ sở hữu. Nay tiền tố dài nhất thắng.
- **Xoá** một ADR đã Accepted thoát sạch; đổi tên cũng thoát. Nay bắt cả hai.
- Nhận quyền là đọc-sửa-ghi. Nay khoá nguyên tử bằng `mkdir`.

**Sửa — trang không nói dối**
- Bảng chỉ đọc "chỗ VÀNG", bỏ "chỗ ĐỎ": repo 10 đỏ / 0 vàng hiện ra 0 và đèn có thể xanh.
- Sổ migrate in lại nguyên khối khai báo vào thân bài.
- Quét secret báo XANH dù có file không đọc được.
- Ghép tên file vào chuỗi shell — bộ khung chạy trên repo người khác, tên file không do mình đặt.

**Đổi**
- Bản trích lấy phiên bản từ `package.json`, bỏ nhãn `unproven`.
- Trang xếp lại theo tần suất dùng; mục ít dùng gập lại; thêm "Bắt đầu ở đâu" và "Trang liên quan".
- `llms.txt` quay lại bản đồ file — nó vẫn được sinh, chỉ là đã rơi khỏi luật và khỏi trang.

**Đã biết, KHÔNG nằm trong 1.0**
- **Chưa có ghim phiên bản và lệnh nâng cấp.** Vá bộ khung vẫn phải chép tay sang từng repo.
  Đây là việc lớn nhất còn lại, và cố ý để sau: ghim một bản đo sai chỉ nhân cái sai ra đều hơn.
- Chưa có CI — `git push` trần vẫn đi vòng qua mọi cổng.
- Phép kiểm khoá quyền chỉ dựng được ca tuần tự, chưa dựng được ca đua thật.

## 0.3.0 — 2026-09-03 — AI là chủ nhà: sổ tay, lịch bảo trì, và bảng nói tiếng người

**Thêm**
- `docs/SO-TAY-AGENT.md` — bảy danh sách kiểm cho việc lặp lại. Chặn **drift**: một việc làm mười lần bởi mười phiên khác nhau sẽ ra mười kiểu nếu không có nó.
- `docs/BAO-TRI-DINH-KY.md` — ba nhịp quét (mỗi phiên · mỗi tuần · mỗi tháng) và ba dấu hiệu repo xuống cấp. Cả ba đều im lặng, nên phải chủ động đi tìm.
- `docs/TINH-NANG.md` — kể tính năng bằng tiếng người, mỗi mục kèm câu *"không có nó thì hỏng ra sao"*.
- Bảng tổng quan: banner tự biết tuổi · NOW/NEXT · vòng đời · đèn sức khoẻ đếm **nợ** chứ không đếm tài sản.

**Sửa**
- Bốn lỗ **gate báo xanh mà không chặn** — audit độc lập tìm ra, mutation test xác nhận từng cái.
- `safe-push` chặn luôn cú đẩy đầu tiên của một repo mới, tức chính ca harness sinh ra để làm.
- `init-repo --ten "X" <đích>` dựng repo ở thư mục tên `X` và bỏ qua `<đích>`.
- `claim.mjs` không tồn tại dù luật bắt mọi phiên dùng nó.

**Gỡ**
- Bộ sinh trang thứ hai. Hai bộ cho cùng một việc là phân mảnh — đúng thứ harness sinh ra để chữa.

## 0.2.0 — 2026-09-03 — Harness về nhà riêng, và có đủ công cụ để nhân bản

**Thêm**
- `assess` — đo một repo cách chuẩn bao xa. Mức 0–3, chi phí tách ba loại việc thật khác giá.
- `init-repo` — dựng repo mới bằng một lệnh, thay sáu bước làm tay dễ lệch thứ tự.
- `build-template-overview` — trang mô tả chính harness, sinh từ chính nó.
- Hai protocol: kiểm một repo · đưa repo cũ lên chuẩn.
- Ba workflow có lưu đồ: dựng repo mới · migrate · một phiên làm việc.
- `LEGEND.md` — tra cứu thuật ngữ. Thuật ngữ giữ tiếng Anh, giải nghĩa tiếng Việt.
- ADR-0002 — chốt cái gì đi theo bản trích, cái gì ở lại repo nhà.

**Sửa**
- Generator **cộng thêm một dòng trống mỗi lần chạy** — chỉ lộ ra khi harness tự trích lại chính
  nó, tức đúng lúc nó có nhà riêng.
- `stripNghe` ném cả ở ca lành (luật đã ở dạng chung), nên harness không tự trích lại được.
- `units.ten` — generator từng đóng cứng chữ "Extension" ở tiêu đề bảng và tên cột, nên mọi repo
  dựng từ harness đều nhận một bảng gọi mọi thứ là Extension.
- Session gate **chết ngay khi nạp** với mọi phiên: một biến dùng trước khi khai.

**Đã biết, chưa xong**
- Chưa có remote.
- Chưa từng migrate một repo thật khác nghề — nhãn `unproven` vẫn đúng.

## 0.1.0 — 2026-09-02 — Trích harness ra khỏi repo sinh ra nó

**Thêm**
- 5 công cụ vận hành: generator trang · structure gate · session gate · safe-push · đọc cấu hình.
- Luật ba tầng: luật chung · annex nghề (tuỳ chọn) · bản đồ địa phương.
- Suite seed — harness mang theo lưới đỡ của chính nó.
- Bốn bản mẫu: ADR · nghiên cứu · đề bài phiên · annex.
- ADR-0001 — harness sống ở một repo độc lập.

**Nghiệm thu**
- Repo trống + harness → structure gate 0 đỏ 0 vàng.
- Bộ máy cũ và mới sinh ra artifact giống hệt từng byte.
