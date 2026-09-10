# CHANGELOG

> Mỗi bản một khối. **Chỉ thêm, không sửa khối cũ.** Máy đọc file này để dựng mục Nhật ký trên
> bảng, nên giữ đúng định dạng: `## <phiên bản> — <ngày> — <một câu>`.

## 1.9.39 — 2026-09-11 — Đức hỏi cách chặn typo từ gốc: 8 chỗ gõ tay → 1 nhà

**Câu hỏi của Đức:** *"có cách nào tránh được lỗi typo không? từ issue nhỏ thành issue lớn, làm
drift và miss direction ngay từ gốc."*

**Đo trước khi trả lời — cả sáu ca drift hôm qua đều là MỘT SỰ THẬT VIẾT Ở HAI CHỖ**, typo chỉ là
cái bật công tắc:

| Đã hỏng | Gốc thật |
|---|---|
| 4 con trỏ chết vào `## 7.` | mốc tiêu đề **gõ tay 8 chỗ** |
| 2 phép kiểm xanh mà đo số 0 | `replace`/`split` không khớp = **không-làm-gì** |
| `F4.7` mất mục tiêu | phép dò khớp **0 mục** vẫn xanh |
| mốc thứ ba trong output cổng | một luật, **5 chỗ phát biểu** |

**VÁ ⑴ — MỘT NHÀ cho hai mốc tiêu đề.** `MOC_BAN_DO` · `MOC_SAU_BAN_DO` nay `export` từ
`repo-structure.mjs`; `build-template`, `build-overview` và `template-null-repo` đều **nhập**.
Đo: **8 chỗ gõ tay → 1**. Đổi số mục nay là sửa một dòng, và gõ sai tên hằng là `ReferenceError`
ngay, chứ không phải một phép kiểm im lặng đi qua. Đây là mục 8 (*mỗi luật một nhà*) áp cho
**HẰNG SỐ**. Ba chuỗi `"## 6."` còn lại là **fixture tổng hợp** — đầu vào của phép kiểm, cố ý literal.

**VÁ ⑵ — phép dò MẤT MỤC TIÊU là ĐỎ.** Vế `5e` nay đòi mọi `trong_file` vào `AGENTS.md` khớp **ít
nhất một mục**. Đây là chỗ vế 5 KHÔNG thấy: vế 5 kiểm chuỗi có mặt trong **FILE**, nên chuỗi rải ra
**hai mục khác nhau** thì nó xanh trong khi phép dò không còn chứng nhận mục nào. Đột biến dựng
đúng ca đó (chuỗi rời mục 3 sang cuối file) → **ĐỎ**.

**BÀI HỌC LẶP LẠI LẦN THỨ HAI trong hai lượt:** cả hai đột biến đầu **chết ở cửa khác** — dấu vân
tay luật chung chặn trước khi tới `5e`. Phải **hoà giải cửa đó** rồi mới đo. *Một phép ghim chỉ đỏ
nhờ cửa khác thì nó chưa được thử* — nay đã ghi hai lần, vì tôi rơi vào nó hai lần.

**CHỖ MÁY KHÔNG LÀM ĐƯỢC, nói thẳng:** máy bắt được **con trỏ đứt**; nó không bắt được **câu sai**.
Mốc thứ ba hôm qua là một câu sai, và thứ tìm ra nó là **Đức đọc output của máy**. Cách duy nhất
giảm số câu sai là giảm số CHỖ có thể sai — từ 5 xuống 1.

## 1.9.38 — 2026-09-10 — Đức đọc OUTPUT của cổng và bắt được MỐC THỨ BA

**Đức chốt hai việc** (`decisions.md`): khoá FILE **chỉ sống trong đúng lượt ghi**, và **giữ** quyền
bypass branch protection.

**Anh bắt được gì:** thông điệp `KHOA_FILE_CON_TREO` của cổng nêu mốc là *cuối phiên*, trong khi
`AGENTS.md` mục 1 · `MULTIFLOW` · `cua-index` · sổ đổi vân tay đều nói **NGAY SAU commit chứa lượt
ghi**. Lời anh: *"cuối phiên khác với cả kết thúc sửa file."*

| | |
|---|---|
| Chỗ phát biểu mốc trả khoá FILE | **5** |
| Nói đúng | **4** |
| Nói sai | **1** — và đó là chỗ **operator ĐỌC** |

Đây là bệnh **ba-mốc** mà quyết định 09/09 đã đóng một lần. Nó quay lại **trong output của máy**,
tức chỗ không tài liệu nào soi.

**Vá:** mục 1 nhận nguyên lời Đức, kèm bốn trạng thái bị cấm nêu thẳng — **đọc · suy nghĩ · chạy
test · chờ**. Thông điệp cổng nay nêu mốc commit và tự gọi mình là **LƯỚI ĐỠ**, không phải hạn chót.
Bỏ câu *"quá 30 phút máy chỉ nêu tên"* khỏi Tầng 1 — nó là hành vi MÁY, đã `CHUYỂN SANG MÁY` ở
`ADR-0018` mà tôi để sót.

**MỘT CHỖ TÔI KHÔNG LÀM THEO NGUYÊN VĂN:** giữ mốc ở **COMMIT**, không phải *"ngay khi ghi xong"*.
Giữa gõ-xong và commit, lane khác nhận được khoá rồi sửa cùng file, và `git commit --only` cuốn
luôn việc của họ — đúng ca `KHUNG-59`, đã xảy ra **hai lần** ngày 10/09. Ý của Đức (*không giữ khoá
qua lúc rảnh*) lấy trọn bằng bốn trạng thái bị cấm.

**GHIM — và phép ghim này bắt chính ghi chú của tôi trước:** `F20` nay đòi hai chiều — không file
cưỡng chế nào được phát biểu mốc kiểu *hết-phiên*, và thông điệp cổng **phải** nêu mốc commit cùng
chữ *LƯỚI ĐỠ*. Lượt đầu nó ĐỎ vì tôi trích **nguyên văn câu sai** vào comment giải thích: một câu
sai nằm trong file cưỡng chế thì đọc y như một lời phát biểu, dù nó là lời kể chuyện.

**Bốn đột biến, và cả bốn lúc đầu chết Ở CHỖ KHÁC** — dấu vân tay luật chung và sổ phát hành chặn
trước khi tới `F20`. Một phép ghim chỉ "đỏ" nhờ một cửa khác thì nó **chưa được thử**. Harness đột
biến nay **hoà giải hai cửa đó** (dập lại vân tay + cắt bản) rồi mới đo `F20`.

## 1.9.36 — 2026-09-10 — Codex CHẠY THẬT: bản đồ máy canh cho một TÀI LIỆU đóng vai máy

Đức sửa sandbox Codex, nên vòng audit thứ ba **chạy được lệnh** — thứ hai vòng trước (chỉ soi chữ)
không làm được. Nó bắt **2 chỗ NGHIÊM TRỌNG** trong chính vế `5e` tôi vừa dựng, và cả hai là
**xanh mà đo số 0**:

| Codex làm gì | Vế `5e` trả lời | Sai ở đâu |
|---|---|---|
| đổi `scripts/handoff.mjs` → `AGENTS.md` | **XANH**, "9 máy khai" | `isFile()` đúng với MỌI file — một trang **tài liệu** đóng vai máy được |
| khai 3 **bí danh** của `.githooks/commit-msg` trong MỘT mục | **XANH**, "8 máy khai" | chuẩn hoá chỉ dùng cho tổng toàn bản đồ, không cấm trùng trong từng mục |

**Vá:** máy phải khớp `scripts|bang-song/*.mjs|cmd` hoặc `.githooks/*` — tức **một thứ chạy được
của repo này** — và mỗi mục phải có `Set(may).size === may.length`. Thêm một loại máy mới (ví dụ
workflow CI) thì phải **nới danh sách**, cố ý để nó ĐỎ và bắt người thêm nhìn vào.

Nhãn của vế đổi theo cho khỏi nói quá: *"9 máy khai, file có thật"* → **"9 máy CHẠY ĐƯỢC, không bí
danh"**. Đột biến: **6 ca, cả 6 ĐỎ** (4 ca cũ + 2 ca Codex mở).

**BA VÒNG AUDIT, BA LOẠI LỖI KHÁC NHAU — và đây là số đo đáng giữ:**

| Vòng | Codex làm được gì | Bắt được loại lỗi nào |
|---|---|---|
| 1–2 | chỉ đọc CHỮ (`stdin`) | **11 câu mệnh lệnh** bị rụng hoặc nói quá |
| 3 | chạy lệnh + đột biến | **2 phép kiểm xanh mà đo số 0** |

Chữ và chạy bắt hai loại khác nhau; **không cái nào thay được cái nào**. Bốn con trỏ chết vào mốc
`## 7.` (bản 1.9.35) thì **cả ba vòng đều không thấy** — tôi tự tìm bằng `grep`.

**Giới hạn của vòng 3, Codex tự nói:** trong sandbox của nó, Node không tạo được tiến trình con
`git` (`spawnSync git EPERM`), nên `npm test` · `template-null-repo` · `check-bootstrap` · cổng
đóng phiên **không chạy được** — *"lỗi môi trường audit, không phải xanh"*. Phần đó vẫn là tôi.

## 1.9.35 — 2026-09-10 — BỐN con trỏ chết vào `## 7.` trong MÃ, hai cái làm phép kiểm mất răng

Lượt gộp 9 mục → 6 bỏ mục 7 (nhập vào mục 0). Tôi đã sửa **17** chỗ nói *"AGENTS.md mục N"* bằng
chữ, nhưng bỏ sót **bốn** chỗ ghim vào **mốc tiêu đề** `## 7.` trong mã. Hai trong bốn cái đó
không làm đỏ gì — chúng làm phép kiểm **xanh mà đo số 0**:

| Chỗ | Ghim `## 7.` gây ra gì |
|---|---|
| `tests/template-null-repo.mjs` fixture | `replace` không khớp → **KHÔNG-LÀM-GÌ**, nên fixture thiếu đúng mấy dòng bản đồ nó vừa định thêm, và vế chạy trên nền rỗng |
| `tests/template-null-repo.mjs` `phanChung` | `split(...)[1]` là `undefined` → `|| ""` → phép soi từ vựng nghề **BỎ QUA cả mục 8** mà vẫn xanh |
| `tests/template-null-repo.mjs` vế mốc cắt | ghim CẶP mốc sai → xanh trong khi bộ trích cắt sai |
| `scripts/build-overview.mjs` `docBanDo` | không thấy mốc kết → lấy tới **HẾT FILE**, bốc theo mọi dòng `\|` của các mục sau bản đồ |

Cả bốn nay dùng mốc `## 8.` và **ĐÒI mốc có thật** (`assert` trước khi dùng), chứ không để
`replace`/`split` không-khớp đi qua im lặng.

**Một hệ quả cố ý, ghi ra để không ai tưởng là lỗi:** mục 6 của repo NHÀ nay là một đoạn trỏ,
không còn bảng, nên `docBanDo` trả **0 dòng ở nhà** — bảng cho Đức mất 7 dòng cửa-nhanh, phần
bản đồ đầy đủ vẫn còn (`docBanDoChiTiet`). Ở **repo đích** thì bản trích vẫn phát mục 6 CÓ bảng,
và `docBanDo` đọc được **11 dòng** — đã đo trên `template/AGENTS.md`.

**Đây là loại lỗi mà audit CHỮ không thể thấy:** Codex chỉ được đưa văn bản `AGENTS.md`, nên nó
không đọc được bộ sinh và các phép ghim đang trỏ vào mốc nào. Chỗ hở của vòng audit này, nói rõ.

## 1.9.34 — 2026-09-10 — Audit Codex qua `stdin`: hai vòng, bác 12 chỗ, vá 11

**Đức chốt:** *"cần audit độc lập bạn gọi Codex CLI"*, rồi *"codex cli hãy dùng stdin"*. Sandbox
của `codex exec` hỏng trên máy này (`apply deny-read ACLs`; thử `read-only` ·`workspace-write` ·
`disk-full-read-access`, và `codex update` lên `0.154.0` — vẫn hỏng), nên nó **không chạy được
lệnh nào**. Đường đi được: **đưa cả bản cũ và bản mới của `AGENTS.md` vào thẳng prompt qua `stdin`**
(23 KB). Nó soi được CHỮ; **không** dựng được đột biến — phần đó vẫn là tôi.

| Vòng | Codex bác | Tôi kiểm lại | Đã vá |
|---|---:|---|---:|
| 1 | **10** | đúng **9** | 9 |
| 2 | **7/9 bản vá ĐỦ** + 2 chỗ mới + 5 dương tính giả | đúng **2** | 2 |

**PHÉP SO CỦA TÔI BỎ SÓT CẢ 9 CHỖ VÒNG MỘT — và đây là bài học của lượt này.** Tôi so **TỪ VỰNG**
(câu nào mất chữ), Codex so **NGHĨA** (nghĩa vụ nào mất hiệu lực). Ba cái nặng nhất tôi tự cho là
"đã gộp" nhưng thật ra đã rụng: lệnh cấm **nhả khoá của LANE KHÁC** (đã xảy ra thật —`KHUNG-62`) ·
quyền **tự dùng `--carry` khi đủ ba** · **"mọi việc khác AI tự quyết"**. Và hai chỗ tôi **nói quá**:
`git commit --only` không lọc theo TÁC GIẢ, và máy chỉ canh **CHỖ KHAI** chứ không đọc được rằng
bản luật cũ đã bị xoá.

**VÒNG HAI: CODEX SAI MỘT CHỖ, và tôi bác lại có bằng chứng.** Nó đọc *"MỘT mốc trả"* thành *một
mốc cho CẢ HAI loại khoá* rồi đề nghị gộp — gộp lại là trả khoá VÙNG **trước khi đẩy**, đúng ca
`KHUNG-63`. Giữ hai mốc, nhưng sửa lời: **MỖI LOẠI KHOÁ ĐÚNG MỘT MỐC TRẢ**.

**NĂM MỤC VÒNG HAI LÀ DƯƠNG TÍNH GIẢ DO LỖI CỦA TÔI:** vòng hai tôi **không nhắc lại** danh sách
luật CỐ Ý rời Tầng 1, nên nó báo rụng năm cái đã có máy hoặc đã bỏ có lý do. Nếp: **đề bài audit
phải mang theo danh sách đã-cố-ý-bỏ**, không thì auditor tốn lượt vào chỗ đã quyết.

**Một chỗ cũng đã sửa: mâu thuẫn CÓ SẴN từ bản cũ** — khoá file có HAI mốc trả (*"trả ngay sau
lượt ghi"* và *"ngay sau commit"*); ghi xong không phải commit xong. Đúng bệnh ba-mốc mà bộ biên
dịch luật sinh ra để chặn, và nó nằm trong hiến pháp suốt từ đó.

## 1.9.31 — 2026-09-10 — Hiến pháp 9 mục → 6, và 111 mục luật rà lại còn 43

**Đức uỷ quyền AI chốt** bản rà 111 mục do Đức và GPT lập: *"đó chỉ là proposal thôi, bạn review
và là người quyết định cuối cùng"*. Quyết định: [ADR-0018](docs/adr/0018-ra-lai-111-muc-luat.md).
Sáu chỗ lượt THI HÀNH dạy lại: [ADR-0019](docs/adr/0019-sua-bay-cho-cua-adr-0018.md).

| | Trước | Sau |
|---|---:|---:|
| Mục trong `AGENTS.md` | 9 | **6** (vạch `R0` ≤ 6 — **ĐẠT**) |
| Mục luật ở Tầng 1 | 111 | **43** |
| Câu trong hiến pháp | 77 | **69** |
| Token nạp mỗi phiên | 4.196 | **4.099** (vạch 3.000 — **KHÔNG ĐẠT**) |
| Con trỏ "AGENTS.md mục N" bị chết | — | **0** (sửa 17 chỗ) |

**KHÔNG ĐÁNH SỐ LẠI, và đó là quyết định có số đo.** Mục còn 0 · 1 · 2 · 3 · 6 · 8 — có chỗ trống
ở 4 · 5 · 7. Vì **~250 chỗ** trong mã và tài liệu trỏ vào các mục **theo SỐ**; đánh số lại là tạo
hàng trăm con trỏ chết, chính thứ mục 8 gọi là *hai câu trả lời cho một câu hỏi*. Giữ số thì chỉ
**17** chỗ phải sửa.

**MỘT PHÉP DÒ MẤT MỤC TIÊU MÀ KHÔNG AI ĐỎ.** `F4.7` đo tầng luật ở repo đích bằng chuỗi
`tự ký nghiệm thu`; lượt gộp bỏ bảng vai — nơi duy nhất chứa chuỗi đó — nên phép dò khớp **0 mục**
và `5e` **vẫn xanh**. Đúng bệnh cả ngày: **máy còn nguyên, mục tiêu của nó biến mất, biểu hiện
giống hệt lúc đang chạy.** Trả lại chuỗi thành một mệnh lệnh thật, rồi ghim: bỏ nó ra → ĐỎ.

**BẢY MỤC `HẠ THÀNH HƯỚNG DẪN` KHÔNG CÓ NHÀ TẦNG 2 NÀO** — hạ chúng là XOÁ. Sáu mục thành `GỘP`
(chúng là mệnh đề của một luật đang giữ), một mục (`R-096`) thành `BỎ`: nó khuyên thêm phép kiểm
trong khi `R3` đang đóng băng việc thêm phép kiểm.

**GỌN CHỈ 2%, nói thẳng lý do:** ADR-0016 đã nén một lượt rồi, nên 68 mục bị cắt phần lớn là mệnh
đề trong câu. Và lượt này **THÊM ~200 token** nói thẳng chỗ máy KHÔNG canh. Đánh đổi cố ý:
**trung thực về chỗ hở đắt hơn gọn.**

**AUDIT ĐỘC LẬP CHƯA CHẠY ĐƯỢC.** `codex exec` hỏng sandbox trên máy này (`apply deny-read ACLs`,
ba cấu hình, cả bản copy lẫn repo thật) và **tự báo đúng** là không có kết luận. Nên commit này
mang nhãn `Audit: chua-co` và **`safe-push` TỪ CHỐI đẩy** — máy đang làm đúng việc của nó.

## 1.9.30 — 2026-09-10 — Lần đầu có máy trả lời "mục luật này ai canh" — và nó lôi ra 2 lỗ THẬT

**VẤN ĐỀ.** Vạch đích `R0` đặt đích *"luật không có máy canh → 0"* rồi đọc con số hiện tại từ
`features.json` → `luat_nha.mien`. Hai câu hỏi khác nhau dùng chung một con số: `mien` đo **luật
có đường tới repo đích hay không**, KHÔNG đo **máy nào cưỡng chế nó**.

**VÁ.** `luat_nha.canh`: mỗi mục `##` của `AGENTS.md` khai `may` (đường dẫn máy cưỡng chế nó) ·
`canh_gi` (nó chặn gì) · `khong` (phần KHÔNG máy nào canh). Vế `5e` đòi đủ ba, và đòi mỗi đường
dẫn trong `may` **là một FILE có thật** sau khi chuẩn hoá đường dẫn.

**HAI LỖ MÁY THẬT, do audit độc lập đo được — không phải lỗi lời khai, là lỗ của `safe-push`:**

| Điều luật viết | Máy thật làm gì |
|---|---|
| mục 2: *"**CẤM** `--carry` khi cổng chưa XANH TOÀN BỘ"* | `--carry` **gõ tay** chỉ in một dòng rồi đẩy. Dấu cổng chỉ được đọc ở nhánh carry **TỰ ĐỘNG** |
| mục 0: cổng đóng phiên là việc 3 | Đẩy phần **của mình** thì `safe-push` **không đọc dấu cổng** — `if (blocked.length && !carry)` |

Cả hai đã dựng lại được trong kho thử: đẩy thành công khi **chưa từng có dấu cổng nào**. Ghi vào
`BACKLOG.md` → `KHUNG-56` kèm `đóng khi:` — **không** vá trong lượt này, vì vá là đổi hành vi
`safe-push` và nó cần vòng audit riêng.

| | Trước | Sau |
|---|---:|---:|
| Máy canh được ĐO | **0** — không phép kiểm nào hỏi | **9** đường dẫn, là file có thật |
| Mục còn phần không ai canh | *không ai biết* | **9/9** |
| Lỗ máy thật lôi ra được | — | **2** |
| Đột biến dựng nổi ca hỏng | — | **5**, cả năm ĐỎ |

**"CÓ MẶT" MUA ĐƯỢC ÍT HƠN TÔI VIẾT LÚC ĐẦU — audit bác đúng.** Bản đầu tôi viện *"4/9 lỗi hôm
nay là máy đã tắt"*, nhưng ở cả bốn ca đó **file vẫn có mặt**, nên `existsSync` xanh. Phép kiểm
sự-có-mặt chỉ mua được **máy bị XOÁ hoặc ĐỔI TÊN**. `core.hooksPath` bị bỏ thì hai hook chết mà
`5e` vẫn xanh — cổng có mục `cửa index` cho `commit-msg`, còn `post-commit` **không máy nào canh**.
Câu đó nay nằm trong `canh._doc` để không ai đọc lời khai mạnh hơn thực tế.

**CHẶN KHÁC BÁO, và nó đổi ba con số.** Chỉ `B1 B2 B3 B4 B10 B12 B16` thuộc nhóm CHẶN; `B15` và
`B9` chỉ VÀNG. Nên: mục 3 — **cả NĂM luật vàng** không có gì đỏ, không phải bốn. Mục 1 — **không**
được canh kín: khoá nhận SAU lượt ghi vẫn qua · khoá VÙNG treo cuối phiên không mục nào đỏ · không
ai đo bạn dùng khoá mức nào. Vì vậy con số thật là **9/9**, không phải 8/9.

**KHÔNG PHẢI THÊM PHÉP KIỂM** — `R3` đóng băng việc thêm. Vẫn đúng một vế `5e`, đúng một `ok()`,
cổng vẫn 12 mục: lượt này **đổi một phép đo sai câu hỏi thành đúng câu hỏi**.

**CÁI MẤT, gọi tên:** `canh` nặng **6.440 byte** và đi theo bản trích tới mọi repo đích, nơi nhánh
`5e` **luôn BỎ QUA** — trả chỗ trong bản phát hành cho một câu hỏi chỉ repo nhà hỏi.

## 1.9.29 — 2026-09-10 — Lỗi 9: bản trích đòi một tính chất **DỮ LIỆU** của repo đích

**LỖI 9.** `handoff-smoke` đòi *"mục dài nhất trong lịch sử phải vượt trần"* — lý lẽ: một trần cao
hơn mọi thứ từng viết là trần trang trí. Đúng **ở repo nhà**, nơi trần 2600 sinh ra VÌ đã có mục
dài hơn. Nhưng bản trích mang vế này sang mọi repo đích, và một repo có nhật ký **vốn gọn** thì
Đỏ — trong khi nó không sai gì: trần ở đó chỉ là **chưa ràng buộc**.

| Repo | `laNoiPhatHanh` | số mục | mục dài nhất | trần |
|---|---|---|---|---|
| `Ark_Repo_Harness` | **true** | 18 | **71.810 byte** | 2600 |
| `n8n_Local host` | false | 1 | 1.611 byte | 2600 |

Sửa: câu đó chỉ hỏi ở **nơi phát hành** (`laNoiPhatHanh`) — cơ chế repo này đã dựng cho đúng lớp
câu hỏi *"chỉ có nghĩa ở nhà"*. **Không mất lưới nào**: khả năng phân biệt của `handoffCapFrom`
đã được bốn dòng ngay trên ghim bằng **fixture**, không bằng dự liệu repo.

**Lỗi 8 và 9 cùng một họ, và đây là bài của cả lượt đóng gói:** một vế trong bản trích được phép
đòi **hành vi của mã**; đòi **chính sách** hay **dự liệu** của repo thì phải có điều kiện, và phải
**nêu tên phần bỏ**. Không thế thì lượt migrate giao cho repo đích một cổng **không thể xanh**.

## 1.9.27 — 2026-09-10 — Bản trích thôi cưỡng chế chính sách mà repo đích chưa nhận

**LỖI 8.** Vế 8b của `bang-song` đóng cứng `DASHBOARD-Ark-Repo-Harness.html` — **tên trang của
riêng repo nhà** — rồi đòi nó bị `.gitignore` bỏ qua và đòi repo khai `generators: []`. Bản trích
mang vế này sang **mọi repo đích**, nên ở đó nó Đỏ vì **một tên file không tồn tại** — không phải
vì repo đó sai. Đo ở `n8n_Local host`: *"trang HTML PHAI bi .gitignore bo qua"* Đỏ, trong khi
trang của nó mang tên khác.

**Tách đúng hai loại:**

| Phần | Là gì | Chạy ở đâu |
|---|---|---|
| (1)(2) | **hành vi của mã** — `generatorsFrom` nhận `[]`, vắng khoá vẫn mặc định, sai kiểu thì ném lỗi | **mọi repo** |
| (3)(4) | **chính sách `R1` của repo** — trang HTML ra khỏi cây HEAD | **chỉ repo đã khai `generators: []`** |

Repo chưa khai thì vế **nêu tên phần bỏ**, không đỏ oan. Tên trang **suy từ khai báo của chính
repo** (`tenTrang`), không đóng cứng nữa.

**Câu đáng giữ:** một phép kiểm cưỡng chế chính sách mà repo chưa nhận thì **không phải lưới —
nó là thuế bắt buộc đóng mà không ai báo trước.** Và đây là lỗi thứ **TÁM** trong ngày thuộc cùng
một họ: bộ khung chưa tự đi qua con đường nó bán cho người khác.

## 1.9.26 — 2026-09-10 — `Audit:` là trailer · phép kiểm đếm vế tự mất đối tượng đo

**LỖI 6 (tìm ra ở một repo đích — họ tự vá, lõi thì chưa).** `auditFromMessage` quét **cả dòng
tiêu đề**, mà `Audit:` là một TRAILER — trailer không bao giờ nằm ở dòng đầu. Ba ca đã dựng lại:

| Thông điệp | Trước | Nay |
|---|---|---|
| tiêu đề `audit: MOC 2 FAIL …` | khai = *"moc 2 fail …"* → `AUDIT_NGOAI_DANH_SACH`, **chặn push** | không phải nhãn, không chặn |
| trailer thật `Audit: codex` | đúng | đúng (không tắt cả cửa) |
| **cả hai** | 2 nhãn → `AUDIT_XUNG_DOT` | 1 nhãn, không lỗi |

Ca thứ ba nặng nhất: nó **cản đúng cái commit đã làm đúng**. Ghim: `khoa-dau-vet` vế 13, ba ca.

**LỖI 7 (phép kiểm tự lộ).** Vế *"số vế khai = số vế chạy"* ghép **liên kết** và **cửa sổ 400 ký
tự** vào MỘT biểu thức, nên `lastIndex` nhảy qua cả cửa sổ: **mọi liên kết nằm trong đó không bao
giờ được quét**. Đây là loại lỗi **càng viết thêm càng nặng**: văn xuôi quanh một liên kết dài ra
là số file đo được giảm đi, êm ru.

Đo được: `bang-song` khai **12** trong khi chạy **14** và cổng **VẪN XANH** suốt — nó bị một cửa sổ
trước đó ăn mất. Sau một lượt viết thêm hôm nay, số file đo được tụt về **0** — và lưới
`soDo >= 3` bắt đúng lúc đó. **Lưới đó là lý do phép kiểm này không xanh rỗng mãi mãi — giữ nó.**

Sửa: tìm liên kết riêng, rồi **cắt** cửa sổ từ chuỗi. Nay đo **6 file** thay vì 4, và `bang-song`
lần đầu được đo. Ghim: chuỗi dựng sẵn có hai liên kết gần nhau — biểu thức cũ thấy **1/2**, bản
mới thấy **2/2**.

## 1.9.24 — 2026-09-10 — `md()` treo vô hạn: một lõi CPU chạy hết công suất **18 tiếng**

**Số đo.** Một tiến trình `build-overview.mjs` ở repo đích đã đốt **65.765 giây CPU** — bắt đầu
**23:33 ngày 09/09**, phát hiện **18:30 ngày 10/09**. Không ai thấy, vì biểu hiện của nó là
*"lệnh chưa xong"*, không phải một thông báo lỗi.

**Gốc.** Nhánh đoạn văn của `md()` dừng ở mọi dòng khớp
`/^(#{1,4}\s|\||>|```|\s*[-*]\s|\d+\.\s)/`, nhưng nhánh bảng **chỉ vào khi DÒNG SAU là hàng ngăn
cách**. Gặp một dòng mở bằng `|` không thành bảng thì **không nhánh nào ăn nó**, `i` không
tăng, vòng ngoài quay vô hạn. Tức **mẫu DẮNG rộng hơn tập ăn ĐƯỢC** — và chính lỗ hỏng giữa hai
tập đó là nơi tiến trình rơi vào.

**Sửa bằng MỘT chốt, không đi nới từng mẫu:** `doan` rỗng thì ăn một dòng rồi đi tiếp. Nới cho hai
mẫu khớp nhau là việc phải làm lại **mỗi lần thêm một nhánh**; bất biến *"mỗi vòng ăn ít nhất một
dòng"* thì đúng mãi.

**Ghim: `luu-do-smoke` vế 11, chạy ở TIẾN TRÌNH CON.** Vòng lặp là đồng bộ, nên `setTimeout`
trong cùng tiến trình **không bao giờ nổ**: một vế viết kiểu đó sẽ **treo cả suite thay vì báo
Đỏ**, và một suite treo không bằng một suite đỏ — nó không nói gì cả. Ba ca: `|` đơn lẻ · `|` ở
cuối file · đúng một dấu `|`. Đột biến: gỡ chốt → Đỏ *"md() KHONG KET THUC"*, **không treo**.

**Cách tìm ra, ghi để dùng lại:** `--prof` của V8 ghi log **liên tục**, nên một tiến trình treo vẫn
đọc được chỗ nóng. `--cpu-prof` thì **không**: nó chỉ ghi lúc thoát. Một lệnh
`node --prof-process` chỉ thẳng `md file:.../md-mini.mjs:49`.

## 1.9.22 — 2026-09-10 — Vòng audit sau đóng gói: `--local` thay `--get`; câu Đỏ đúng đơn vị

**Ba chỗ lọt, cả ba dựng lại được:**

1. `git config --get core.hooksPath` **đọc cả global và system**. Đo: đặt khoá global rồi `--get`
   trả `.githooks` trong khi `--local` **trống**. Nghĩa là trên một máy có khoá global,
   `upgrade.mjs` báo *"cửa index: đã bật từ trước"* và **không bao giờ đặt config local** — cửa
   vẫn TẮT, câu thông báo nói dối. Cùng họ với chính lỗi thiếu `import` vừa sửa ở 1.9.20:
   **một cơ chế đã tắt, kèm một dòng chữ nói nó đang bật.**
2. Vế 25 cũng đọc `--get`, nên nó **xanh giả** trên máy có khoá global. Nay `--local`.
3. Vế 14 bỏ hết log (`log() {}`), nên **xoá cả nhánh cảnh báo vẫn xanh** — mà nhánh đó là thứ
   duy nhất đọc `behaviourOpts`. Nay thu log và đòi **đúng một** cảnh báo cho vùng `goi/mot`,
   đếm đúng 1 file `.js`. Hai đột biến đã chạy: `if (false)` → đỏ 0 cảnh báo; trả về
   `behaviourOpts` → đỏ nguyên văn *"behaviourOpts is not defined"*.

**Thêm ca chưa ai ghim:** repo đích đã có `core.hooksPath` **RIÊNG** thì không được ghi đè, và
phải **nêu tên** chỗ nó đang trỏ tới. Ghi đè là xoá hook của người ta và hỏng **im lặng** vì
`--apply` vẫn thoát 0.

**Một lỗi của cổng, do cổng tự lộ ra:** thước *"phần nạp"* phán xử bằng `napToken` nhưng
nhánh Đỏ in `napDong` và nói *"dòng"* — cổng in **`200/4200 dòng`** rồi bảo VƯỢT TRẦN, một
câu vô nghĩa. Nhánh XANH vẫn in token đúng, nên **sai chỉ hiện đúng lúc Đức cần đọc số**.
Ghim `core-contract` F23 đo **ở nguồn**: cả hai nhánh là hai chuỗi của cùng một hàm, nên dựng ca
Đỏ thật đòi một repo fixture có `AGENTS.md` phình quá trần — đắt hơn nhiều mà canh cùng một
sự thật. **Đột biến đầu của tôi là GIẢ**: câu XANH và câu Đỏ dùng chuỗi giống nhau, nên
`String.replace` sửa **nhánh xanh** rồi báo thành công — phải **neo vào mã lỗi**, và **đọc lại
file sau khi ghi** mới được tin là đột biến đã lành.

## 1.9.20 — 2026-09-10 — T1+T2+T3: cổng 12,2→3,0s · hai cửa máy · 5 repo lên một bản

| Việc | Đầu ngày | Nay |
|---|---|---|
| Cổng đóng phiên | 12,2s | **3,0s** |
| Suite đủ bộ | 850,7s | **451,1s** |
| `check-bootstrap` | 11035ms | **2162ms** |
| `B6` điều hướng | 4370ms | **40ms** |
| Repo ở cùng một bản | 0/5 (3 bản khác nhau) | **5/5 tại 1.9.20** |
| Migrate một repo | chưa đo | **8s** |
| `core.hooksPath` ở repo đích | 0/5 | **5/5** |

**T1** — `createHeadDeps` đọc cả cây bằng một lệnh mỗi đường: kiểu ← `ls-tree -r -t`, nội dung
← `cat-file --batch` (**kiểm số byte và LF cuối**, thiếu thì bỏ cả bản đọc một-lượt), ngày ← một
lượt `log --name-only`. Ghim: `bang-song` vế 13/13b — đối chiếu 212 file/ngày, **0 sai lệch**,
kể cả tên có dấu cách và tiếng Việt.

**T2** — hai cửa máy cho luật mà trường hợp nào cũng chỉ là chữ: cửa tầng máy trong `--cua-index`
(chặn commit sửa tầng máy mà chưa cắt bản — chặn thật một commit trong **0,2s**) và `post-commit`
tự trả khoá file (trả thật **8 khoá**, giữ khoá của file chưa commit). `post-commit` được chọn vì
**mã thoát của nó không thể ảnh hưởng `git commit`** — đo được: hook thoát 7, `git` thoát 0.

**T3** — và chính lượt đóng gói lôi ra hai lỗi đã ẩn trong lõi nhiều ngày:

1. `upgrade.mjs` dùng `execFileSync` mà **không import**. `try/catch` biến `ReferenceError` thành
   một dòng cảnh báo, nên **cửa index chưa từng bật ở bất kỳ repo nào đã nâng cấp** — một cơ
   chế đã tắt có triệu chứng y hệt lúc chưa mang gì. Ghim: `upgrade-smoke` vế 25, **đo
   `core.hooksPath`** chứ không đọc chữ in ra — vì chính chữ in ra đã nói dối một cách êm ái.
2. `runDashboard` đọc `behaviourOpts` ngoài phạm vi → **chết cả bộ sinh trang** khi có vùng khác
   `_root` đang bẩn. Repo này khai `units.root_dir: null` nên `rows` chỉ có `_root` và lỗi **nằm
   ngủ** ở nhà, trong khi nó đã **nổ thật** ở một repo đích. Ghim: `bang-song` vế 14 — phải **tự
   dựng repo có vùng con**; đo trên repo này thì vế xanh mà không kiểm được gì.

**Một lỗi của chính tôi, lượt T1:** tôi dán vế 13/13b **sau** dòng tổng kết của `bang-song`, nên
nó in **12** trong khi chạy **14** — và tài liệu khai theo con số in ra. Phép kiểm *"số vế khai =
số vế chạy"* không bắt được vì nó **không đo file này**. Đã đưa tổng kết về cuối file, doc → 15.

## 1.9.6 — 2026-09-10 — R1 + R7: cổng thôi đòi bảng khớp HEAD; suite 850s → 445s

Đo 7 ngày trước khi sửa: **522 commit, 191 (37%) không làm việc gì** — chỉ sinh lại bảng. Gốc là
một mục cổng: *"Sự thật máy sinh còn tươi"* đòi artifact ĐÃ COMMIT phải khớp `HEAD`.

Vòng lặp: `commit → HEAD đổi → bảng cũ → sinh lại → commit → HEAD đổi`. Mỗi commit đó còn làm
hỏng dấu xác nhận suite, tức **~10 phút** nữa. Hôm nay tôi sửa **một câu** trong `STATUS.md` và
ba file phải sinh lại — cổng ĐỎ đúng ở mục đó, 11 mục kia xanh.

| | Trước | Sau |
|---|---|---|
| Commit chỉ để sinh bảng | 191 / 522 = **37%** | **0** — không ai còn BẮT BUỘC sinh lại |
| Bộ sinh cổng đòi khớp HEAD | 2 | **0** (`generators: []`) |
| Artifact bị host ghi đè mà vẫn trong git | 1 (trang HTML) | **0** |

**Thuốc là `generators: []`, không phải bỏ file khỏi git.** `generatorsFrom` trước đó coi mảng
rỗng là gõ sai, nên repo **không có cách nào khai** *"tôi không commit artifact nào"* — muốn thoát
vòng lặp thì phải sửa chính hàm đó. Nay `[]` hợp lệ; **vắng khoá thì vẫn dùng mặc định**, vì bỏ
quên khác khai rỗng và tắt một lớp bảo vệ phải là hành động cố ý.

Chỉ `DASHBOARD-*.html` ra khỏi git — host tự chạy nên nó đổi byte sau lưng mọi lane, và cây bẩn
làm suite từ chối đóng dấu. **`llms.txt` · `DASHBOARD.md` · `repo-map.json` Ở LẠI.**

**Bản đầu của R1 đẩy cả bốn ra ngoài, và đó là sai.** `llms.txt` là GỐC ĐIỀU HƯỚNG của phép kiểm
B6: mất nó thì bản đồ mất gốc và mọi tài liệu thành không-với-tới-được — vàng **27 → 75** ở repo
nhà, **0 → 18** ở repo rỗng. `template-null-repo` bắt được. Hai bản cắt hụt `1.9.0` và `1.9.1`
nằm trong sổ phát hành nhưng **chưa từng đẩy**; sổ là vùng chỉ-thêm nên không gỡ, và không nên gỡ.

**Ghim:** `tests/bang-song.mjs` vế `8b`, ba vế — `generators` rỗng · HTML ngoài git · ba file text
ở lại. Ba đột biến đã chạy thật, mỗi cái ĐỎ đúng vế của nó. Vế thứ ba tồn tại chính vì cái sai ở
trên, nên đừng "dọn" nó đi.

**KIỂM TOÁN ĐỘC LẬP TÌM RA 5 LỖI, HAI CÁI P1 — và bản này là bản ĐÃ VÁ chúng.**

1. `generators: []` khiến cổng chạy hết vòng lặp mà **không kiểm gì**, rồi trả câu XANH *"artifact
   đã commit đều khớp với HEAD"*. Một cổng nói dối theo kiểu tệ nhất: nó không sai, nó khiến người
   đọc tin sai. Nay nói thẳng **KHÔNG ÁP DỤNG**, kèm câu artifact hiện không ai canh.
2. `generated` không rỗng + `generators` rỗng là một **LỖ mở được bằng cấu hình**: commit bất cứ
   gì vào artifact rồi được miễn suite, mà không còn ai đối chiếu nội dung. Chú thích của chính
   nhánh miễn trừ đã tự nêu tiền đề *"đã có phép kiểm riêng canh chúng"* — R1 tắt đúng nó. Nay lời
   miễn trừ **chết theo** khi không còn bộ sinh nào canh.
3. Ghim `8b` bản đầu chỉ so **cấu hình** với `[]`, không gọi hàm. Khôi phục đúng bug R1 chữa thì
   nó **vẫn xanh** — dựng lại ca hỏng và xác nhận. Nay gọi thẳng `generatorsFrom` và đòi hành vi.
4. Ghim đọc `git ls-files` là đọc **index dùng chung**: lane khác `git add` là kết quả đổi dù HEAD
   chưa đổi. Nay hỏi `git ls-tree -r HEAD`.
5. Bốn chỗ chú thích vẫn mang giả định của bản vá **đã bỏ** ("bốn bảng ra khỏi git"). Đã sửa cả bốn.

**THÔI TUYÊN BỐ "KHÔNG LÀM YẾU LỚP BẢO VỆ".** R1 **có** làm yếu: ba file `DASHBOARD.md`,
`llms.txt`, `repo-map.json` vẫn nằm trong git mà nay không còn ai đối chiếu với HEAD — sửa tay một
dòng thì không cổng nào kêu. Đó là đánh đổi có chủ ý để bỏ vòng lặp 37% commit, và chỗ đúng để nói
ra là **ngay tại cổng**, không phải trong một dòng sổ mà chẳng ai đọc lúc cần.

**HAI LỖI NẶNG NHẤT LẠI KHÔNG PHẢI DO R1 GÂY RA — R1 CHỈ LÀM CHÚNG HIỆN LÊN.** Cả hai đã nằm
sẵn trong repo, ẩn sau một nền đang đỏ vì lý do khác:

6. **Cổng SẬP khi thiếu `package.json`.** `danhSachSuite` ném `ENOENT` thô, bên gọi giữ lỗi rồi
   ném ra **đúng trên đường thành công** — nên một cổng đã xanh hết mục lại kết luận *"CHƯA ĐỦ
   BẰNG CHỨNG — không ghi được kết quả cổng: ENOENT..."*, một câu chẳng nói gì cho người đọc.
   Trước R1, mục "còn tươi" luôn đỏ ở fixture nên đường đó **không bao giờ tới được**. Vá tại gốc:
   vắng hoặc hỏng `package.json` = KHÔNG CÓ SUITE, cùng câu trả lời với "không khai
   `scripts.test`" → `REPO CHƯA CÓ SUITE GỐC`, BỎ QUA, mã thoát 2. Cổng vẫn không được báo
   xong; nó chỉ thôi sập. Chữa ở fixture thì dễ hơn — nhưng thế là che lỗi để nó đợi ở repo thật.

7. **Bản vá lỗ số 2 gộp HAI lời miễn trừ khác lý do làm một.** Artifact được miễn suite vì CÓ ai
   đối chiếu chúng, nên bỏ `generators` đi thì lời miễn phải chết theo — đúng. Nhưng
   `.agents/claims.json` được miễn vì **lý do khác hẳn**: không phải file hành vi, có dấu niêm
   phong riêng canh, và mọi suite tự dựng bảng quyền trong fixture của nó. Buộc cả hai vào
   `generators` là **một phiên chỉ NHẬN hay TRẢ KHOÁ bị cổng báo "chưa kiểm"** — mà mỗi lượt
   `--sua`/`--xong` đều ghi file đó, tức gần như MỌI phiên. Nay tách rõ hai nguồn.

**MỘT PHÉP GHIM CHỈ ĐÚNG NHỜ NỀN ĐANG HỎNG THÌ NÓ ĐANG GHIM SỐ 0.** `khoa-dau-vet` vế 7 chỉ bắt
được lỗi ⑦ **sau khi** R1 làm fixture xanh lên; trước đó hai lượt chạy đều đỏ vì lý do khác nên mã
thoát khớp nhau và vế đó xanh mà chẳng đo gì. Cùng hình dạng với lỗi ③ và ⑤ trong ngày — ba lần,
ba chỗ, một bệnh.

**VÒNG BA CÒN BẮT ĐƯỢC BỐN, VÀ MỘT CÁI NẰM TRONG CHÍNH BẢN VÁ "TẠI GỐC" CỦA TÔI:**

8. `catch { return []; }` **lẫn "vắng" với "hỏng"** — một repo có `package.json` sai cú pháp bị
   gọi là "không có suite", che nguyên nhân. Và `JSON.parse` không đủ để tin: `"null"`, `"123"`,
   `"[1,2]"` đều qua được rồi `pkg.scripts` ném `TypeError` **ngoài** `catch`. Đã dựng lại cả
   bốn ca. Nay: chỉ `ENOENT` trả rỗng · hỏng thì thành `PACKAGE_JSON_HONG` có tên · truy cập `?.`.
9. **`khoa-dau-vet` vế 7 so hai lượt chạy CÙNG ĐỎ.** Nền là một repo tối giản nên dãy B đỏ
   (`nen.ma = 1`, đo được) — mọi so sánh khớp và vế xanh mà không đo gì. Nó đã che lỗi ⑦ cho tới
   khi R1 tình cờ làm nền xanh lên. **Không chữa bằng cách đòi nền phải xanh** (một phép ghim đòi
   điều kiện nó không dựng nổi thì sẽ bị ai đó nới ra) mà bằng cách **gỡ cơ chế che**: so TỪNG MỤC
   theo TÊN. Đột biến xác nhận: gỡ `FILE_HANH_CHINH` là vế này ĐỎ.
10. **Ca `b2` chỉ đi qua nhánh ĐƯỢC MIỄN**, chưa bao giờ thử nhánh KHÔNG miễn. Thêm ca `b3`:
   chỉ đổi `.agents/claims.json` + `generators: []` → PHẢI được miễn. Đột biến ĐỎ đúng vế.
11. Chú thích nói *"CÓ AI ĐÓ ĐỐI CHIẾU chúng"* **mạnh hơn** điều kiện mã bảo đảm. Sửa cho đúng mức.

**R7 — SUITE 850,7s → 445,5s, KHÔNG BỎ MỘT VẾ KIỂM NÀO.** `template-null-repo` (505s, nặng nhất
trong 24 suite) chạy `session-check` ĐỦ trên repo giả — mà repo giả dựng từ bản trích có 11 suite
riêng, tức một lượt **suite lồng** mà **không vế nào đọc kết quả của nó**. Đổi sang `--quick`:
505s → 179s. Lượt thứ hai vẫn chạy đủ và vẫn đòi đúng chuỗi `suite gốc repo: N passed, 0 failed`.

**`HANDOFF.md`: mục viết ở mức `###` LÁCH ĐƯỢC trần byte** — `RE_TIEU_DE_MUC = /^##[ 	]/` chỉ
khớp đúng hai dấu `#`, nên mục `###` bị gộp vào mục `##` phía trên. Cổng báo "3918 byte" và
**quy cho lane migrate**, trong khi mục của họ chỉ 1329 byte và phần thừa là của tôi. Suýt đi sửa
nhật ký của lane khác vì tin câu cổng in ra. Sửa mục của mình về `##`; lỗ ghi `KHUNG-65`.

**VÒNG NĂM VÀ SÁU — BỐN PHÉP GHIM CỦA TÔI HOÁ RA KHÔNG ĐO GÌ, và đó là phần đáng giữ nhất của
bản này.** Không phải bốn lỗi rời: cùng một bệnh — phép kiểm không phân biệt được hai nhánh, mà
vẫn xanh nên không ai nghi.

12. `bangMuc` bản đầu đòi ĐÚNG hai dấu cách trong nhãn; tôi "sửa" thành `[^]]{1,8}` để bất biến
    với độ đệm — đó là **NỚI**, không phải siết: `[B1]` lọt vào bản đồ như một mục giả, và
    `[^]]` nhận cả xuống dòng. Nay giới hạn vào ba nhãn có thật, chỉ cho ĐỆM tự do.
13. **Ba cửa xanh giả:** `b2` dùng `notEqual(…,"XANH")` nên nhận cả ĐỎ vì lý do chẳng liên quan
    (bản vá bị hoàn nguyên mà ca vẫn "đỏ như mong đợi") · `b3` chỉ đòi XANH, không đòi LÝ DO, nên
    một bản vá làm cổng MÙ cũng qua · vế 7 so hai lượt nên **cùng sai giống nhau ở cả hai vẫn
    qua**. Nay: đòi đúng trạng thái + đúng câu, và **NEO giá trị kỳ vọng**.
14. Tiền đề ca `b3` **thừa hưởng** từ hai ca trên; `git diff origin/main HEAD` lại khác định nghĩa
    với `sessionChanges`. Nay hỏi thẳng git ngay tại chỗ, và đòi **cây sạch** để hai định nghĩa
    trùng nhau.
15. `docMuc` tìm dòng "có `[` và có tên mục" ở bất kỳ đâu, rồi **mặc định XANH khi không nhận ra
    nhãn** — im lặng ngả về phía tốt. Nay neo đúng khuôn dòng mục và đòi đọc được nhãn.
16. `new RegExp("^ {2}\[…")` mất một dấu gạch chéo khi qua tay tôi: `"["` thành `[`, regex thành
    một **lớp ký tự**. `node --check` vẫn xanh vì cú pháp không sai. Và phép thử đầu của tôi cũng
    nói dối vì nó bóc chuỗi bằng regex, **không đi qua bước escape của JS**. Chữa bằng **regex
    literal** — bỏ cơ chế sinh ra lỗi, không vá từng lần.
17. Chú thích `khoa-dau-vet` nói *"CHÉP CẢ `scripts/`"* trong khi mã chỉ lấy `.mjs` tầng đầu. Chú
    thích đó tồn tại để chống đúng một lỗi đã xảy ra thật — **một chú thích chống lỗi mà tự nói
    sai thì nó là lỗi tiếp theo.**

**VÒNG SÁU: KHÔNG CÒN FAIL-OPEN MỚI.** Còn lại đúng một, đã biết và có tên: `KHUNG-64`. Kiểm toán
**bác cách tôi xếp loại nó** — *"đường bảo vệ không chạy, ghi sổ nợ không đổi phân loại này"* —
nên nó mang nhãn `[FAIL-OPEN]`. Đã cân nhắc đóng bằng cách xoá nửa artifact của lời miễn trừ (sau
R1 nó là mã chết ở đây) và **không làm**: `upgrade` không thay `.repo-structure.json` của repo
đích, nên 5 repo đã migrate vẫn commit artifact — xoá là chặn cổng của họ.

**Áp cho cả repo đích** qua bản trích và `.gitignore`. Repo đã migrate bản cũ cần chạy `upgrade`.

## 1.8.12 — 2026-09-10 — KHUNG-63: bộ sinh trang thôi đọc đồng hồ treo tường

`build-overview.mjs` đọc `new Date()` để tính tuổi khoá, nên **cùng một HEAD sinh ra hai trang
khác nhau** nếu chạy cách nhau vài phút — mà cổng lại đòi trang khớp HEAD. Vòng lặp không lối ra:
sinh lại → khác → commit → cổng vẫn đỏ.

Chữa bằng `mocHEADLuc()` — lấy mốc thời gian từ `%cI` của HEAD. Thuốc này **đã có sẵn** trong
`build-so-migrate.mjs` từ trước; một file đã học, một file chưa. Đường đọc đồng hồ thật giữ
nguyên cho bảng SỐNG (`--khoa-song`), vì bảng sống thì phải sống.

**Ghim:** `tests/khoa-dau-vet.mjs` vế 12 — hai mốc giả cách nhau 19 phút phải cho ra y hệt nhau.

## 1.8.11 — 2026-09-10 — Bảng tính năng thôi nói dối về BẢN, và có chuông cho cả đội hình

Đức hỏi: *"migrate phiên bản mới thì tính năng cũ đã có bản cập nhật, ta có mang sang không?"*
Đo trước khi trả lời, và số đo tệ hơn dự đoán.

| Đo 10/09 | Kết quả |
|---|---|
| ba repo vừa migrate hôm trước, bảng tính năng nói | `33 xong · 0 một phần` — **xanh tuyệt đối** |
| `upgrade --plan` cùng ngày, cùng ba repo | **7 file CŨ · 2 file THIẾU** ở cả ba |
| bản vá FAIL-OPEN của 1.8.3 có mặt ở ba repo đó | `session-check.mjs` chứa dấu hiệu: **0 · 0 · 0** |
| file tầng máy không phép đo nào chạm tới | **9/38** |
| repo đã migrate đang tụt lại | **5/5. Không cổng nào ở đó đỏ** |

**Gốc bệnh: `[x]` trả lời *"có chưa"*, không trả lời *"có bản nào"*.** Với một bộ khung phát
hành liên tục thì câu thứ hai mới tốn tiền. Và `tu_ban` — trường tưởng để trả lời câu đó — chỉ
được IN RA: hai chỗ dùng trong cả repo, cả hai đều `console`.

**Năm chỗ vá, không thêm một trường khai tay nào.**

1. **Phép ghim chiều-ngược hỏi BỘ DỰNG, không bới mã nguồn.** Nó từng đọc `build-template.mjs`
   rồi bới đúng mảng `PORTABLE_SCRIPTS` bằng regex — bắt được scripts, mù với mọi thứ khác. Nay
   hỏi `fileMay(buildTemplateFiles())`, tức chính định nghĩa mà `bamBanTrich` dùng. Chín file
   lộ ra, trong đó có **cả cơ chế cửa index của 1.8.8** và `bang-song/Xem-bang.cmd` — **cửa
   chính** của đúng cái tính năng tự gọi mình là *"ba cửa"*. Thêm `F3.6` cho cửa index.
2. **Trạng thái thứ năm `[!]` CÓ NHƯNG BẢN CŨ.** Dùng lại phép so BA chiều của `upgrade.mjs`
   (bản chuẩn ↔ bản ở repo ↔ dấu vân tay sổ ghim), **không chép lại phép so**. `features.mjs`
   đi theo bản trích còn `upgrade.mjs` ở lại nhà, nên nhập ĐỘNG trong try/catch: thiếu thì trả
   `null`, và `null` **khác tập rỗng** — bản in phải nói *"CHƯA đối chiếu"*, vì một bảng không
   có `[!]` nào trông y hệt nhau ở hai ca ngược nhau. Repo B đọc lại: `25 xong · 8 bản cũ`.
3. **`npm run doi-hinh` — quét cả đội hình.** Câu *"repo nào đang tụt lại"* chỉ trả lời được ở
   repo nhà. Danh sách repo suy từ `duong_dan` trong `docs/migrations/`; **đo sống, không đẻ
   thêm sổ** — một cuốn sổ *"repo X ở bản Y"* sẽ mục ngay lượt nâng đầu tiên không ai nhớ ghi,
   và lúc đó nó nói DỐI thay vì nói thiếu. Repo đọc không được thành một dòng có lý do.
4. **Sổ phát hành mang thêm Ý NGHĨA.** Khối `chi_tiet` mới, song song với `ban` (140 mục,
   **không đụng tới** — sửa một mục cũ ở đó là `SUA_LICH_SU`). Nay `doi-hinh` nói được *"bỏ lỡ
   1.8.3 — vá một FAIL-OPEN của cổng"* thay vì chỉ liệt kê tên file. Bản chưa khai ý nghĩa được
   **đếm riêng**, không lặng lẽ rơi khỏi danh sách.
5. **`tu_ban` gánh việc thật.** Một cơ chế ra đời ở bản SAU bản repo đích đang ghim thì nó là
   việc **NÂNG**, không phải lỗi của lượt migrate. Đổ nhầm cột là đổ việc cho nhầm người.

**Và một vế bịt chiều OMISSION ở tầng LUẬT** (`5e`): mỗi mục `##` trong `AGENTS.md` của repo nhà
phải có một phép dò `trong_file`, **hoặc** một lời miễn có lý do trong `features.json`. Tầng luật
là chữ nằm trong file repo đích tự sở hữu, `upgrade` không bao giờ ghi — nên luật mới ở nhà không
có đường nào tự tới. Đã hỏng đúng kiểu đó hai lần (`F4.7` báo `[x]` ở 4 repo trong khi grep ra
0/4; `F5.1` thiếu ở cả 3 repo). Hiện 2 mục có dò, 7 mục miễn có lý do — nợ ở `KHUNG-61`.

Ghim: `features-smoke` 11 → **13 vế** · `doi-hinh` **5 vế** mới. Đột biến đã chạy và đều ĐỎ: gỡ
một file khỏi `can` · bộ dựng trả rỗng · `CU` che mất `MỘT PHẦN` · in giống nhau ở hai ca
đã-đo/chưa-đo · thêm một mục `##` mà quên khai · lời miễn rỗng · gỡ một lời miễn.

Trần giữ nguyên: kho chữ **3117/3117** (bốn luật lượt nâng và mục `doi-hinh` trả bằng dedup tại
chỗ), nạp **4195/4200** — không chạm `AGENTS.md`.

## 1.8.10 — 2026-09-10 — Sổ phát hành KHÔNG thấy cái hook, và bản trích phát phép ghim mà không phát thứ nó ghim

Đức hỏi *"đổi hook thế này thì có phải nâng version không?"*. Có — và tôi ĐÃ nâng (1.8.8→1.8.9).
Nhưng đo lại thì **máy không hề bắt tôi phải nâng**, và chỗ đó mới là lỗi:

| Đo | Kết quả |
|---|---|
| dấu vân tay bản trích | `5af2e421f591117b` |
| ...sau khi **vô hiệu hoá hoàn toàn** `.githooks/commit-msg` | `5af2e421f591117b` — **không đổi một ký tự** |
| đối chứng: sửa `scripts/claim.mjs` | ĐÃ ĐỔI — bắt được |

Tầng máy định nghĩa theo **ĐUÔI FILE** (`.mjs`, `.cmd`). Git hook **bắt buộc không có đuôi** — git
gọi đúng cái tên `commit-msg`. Nên nó ra khỏi `bamBanTrich`, và **sổ phát hành nói dối về một bản
đã phát** — đúng câu đã viết sẵn cho `features.json` ở chính chỗ đó.

**Hệ quả thứ hai, nặng hơn, dựng lại được:** `upgrade --plan` kể `tests/cua-index.mjs` là THIẾU mà
**không hề nhắc** `.githooks/commit-msg`. Repo đích nhận **phép ghim** mà không nhận **thứ nó
ghim** → suite bên đó chết `ENOENT` ngay lượt đầu. Đây là ca `bang-song/` 1.3.26 **nguyên văn**,
lần thứ tư cùng một lớp lỗi.

**Vá bằng QUY TẮC, không bằng danh sách:** hai byte `#!` là lời tự khai *"tôi chạy được"* của
chính file. Một danh sách gõ tay thì đợi người sau nhớ — ba lần trước cho thấy không ai nhớ.
`TEP_CUA_REPO_DICH` vẫn thắng: `package.json` · `.repo-structure.json` · `.agents/claims.json`
không bao giờ vào tầng máy, kể cả nếu một ngày chúng mọc ra dòng `#!`.

**Phép ghim cũ cũng hỏi sai câu:** vế *"không bỏ sót thứ chạy được"* quét `/\.(mjs|cmd)$/` — tức
nó ghim CHÍNH cái định nghĩa đang sai, nên nó XANH suốt. Nay hỏi bằng đuôi **hoặc** `#!`.

**Và một vế của tôi hoá ra rỗng:** *"file repo đích không được vào tầng máy"* vẫn xanh cả khi lớp
chặn bị gỡ hẳn — vì ba file đó không có shebang, nên câu hỏi không chạm gì. Nay vế đó **nhét
shebang vào chính ba file đó** rồi mới hỏi. Đột biến ⑿ nay ĐỎ.

`tests/upgrade-smoke.mjs`: **24 vế**. Đột biến: ⑾ quay lại quy tắc chỉ-theo-đuôi → ĐỎ *"1 file
chạy được bị BỎ QUÊN"* · ⑿ gỡ lớp chặn repo đích → ĐỎ, nêu tên cả ba file.

**Chính sổ phát hành đã trả lời câu hỏi của Đức:** sau bản vá, `upgrade` từ chối bằng
`SO_PHAT_HANH_LECH: bản 1.8.9 đã ghi 5af2e421…, nội dung tầng máy hiện tại là 2fb2ff87…` và bắt
tăng số. Trước bản vá nó im lặng.

## 1.8.9 — 2026-09-10 — Vòng audit độc lập trả REVISE, và cả bốn chỗ đều đúng

Bản 1.8.8 cắt xong thì đưa audit độc lập. Kết luận **`REVISE`**, bốn chỗ. Tự dựng lại từng ca rồi
mới tin (luật vàng 4) — **cả bốn là fail-open THẬT** trong bản của tôi.

| Mã | Ca hỏng dựng lại được | Vá |
|---|---|---|
| `CUA_INDEX_AMEND_BYPASS` | commit KHÔNG nhãn (cửa im lặng, cố ý) → `git commit --amend` thêm nhãn của mình. Index bằng HEAD nên mẻ RỖNG → cửa cho qua. Commit cuối mang tên tôi, chứa việc lane khác, **cổng không thấy gì lạ vì nhãn đã có** | mẻ rỗng thì soi lại nội dung so `HEAD^` |
| `CUA_INDEX_PATH_LOSS` | git TRÍCH DẪN đường dẫn ngoài ASCII, tên trích dẫn không khớp bảng quyền → file CÓ CHỦ đọc thành VÔ CHỦ | `-z` + `core.quotepath=false`, không `trim`, ở CẢ hai cửa |
| `CUA_INDEX_LANE_AMBIGUOUS` | hook tự đọc nhãn bằng `sed` = bộ đọc THỨ HAI. `lane: A` + `Lane: B` lọt cửa dưới tên A rồi được cổng quy cho B | hook chuyển FILE lời nhắn; dùng `laneFromMessage`. Nhãn không quy thuộc được → TỪ CHỐI |
| `CUA_INDEX_ACTIVATION_GAP` | cổng chỉ hỏi *"file hook có tồn tại không"* → **xoá file hook là cổng XANH** | tách *"repo theo dõi mà file mất"* (ĐỎ) khỏi *"repo chưa nhận cửa"* (bỏ qua) |

**BÀI HỌC TẦNG, không phải bài học dòng:** ba trong bốn chỗ là **tôi tự viết bản thứ hai của một
thứ đã có** — bộ đọc nhãn, cách đọc tên file từ index, cách hỏi *"cửa có đó không"*. Cùng họ với
bài học hôm qua *"vá ba lần cùng một chỗ = vá SAI TẦNG"*, chỉ khác hình dạng: lần này không phải
vá ba lần, mà là **dựng một nguồn sự thật thứ hai ngay lượt đầu**. Luật mục 8 đã nói trước — *một
khái niệm một nhà* — và tôi vẫn làm, vì bộ đọc `sed` ba dòng "trông như" không phải một bộ đọc.

**Hai chỗ Codex nêu mà tôi KHÔNG sửa, kèm lý do:** ⑴ *"khoá file thuộc A, vùng thuộc B thì B qua"*
— trạng thái đó không dựng nổi bằng lệnh (`khoaFileTrongVung` là CHIỀU HAI của luật chứa nhau,
đã ghim ở `tests/khoa-file.mjs`); ⑵ *"lane không gọi `--sua`, không chạy cổng"* — đúng, nhưng
không máy nào với tới: lane đó bỏ qua mọi lớp, đây là đường bỏ-qua-hết chứ không phải đường lách.

`tests/cua-index.mjs`: 8 → **12 vế**, **9 đột biến đã chạy, 9 lượt ĐỎ**. Ghi thêm MỘT đột biến
XANH vì nó nói điều khác: bỏ `-z` mà giữ `core.quotepath=false` thì vế vẫn xanh, và ngược lại —
hai cái mỗi cái tự đủ, ca hỏng cần thiếu CẢ HAI. Nên vế đó ghim *"có ít nhất một trong hai"*,
không ghim `-z` là thứ chịu lực. Nói sai chỗ chịu lực là để phiên sau gỡ đúng cái đang đỡ.

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
