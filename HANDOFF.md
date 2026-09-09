# HANDOFF — bàn giao giữa các phiên

> **Chỉ THÊM dòng, không sửa dòng cũ.** Phiên sau đọc **phần CUỐI** file này trước tiên.
> Mỗi phiên ghi đúng ba thứ: làm gì · kết quả bằng số · còn gì mở.

## Trạng thái hiện tại

Repo này là **nhà riêng của bộ khung**. Nó vừa được tách ra khỏi repo sinh ra nó
(`Chrome_Extension_AI_Agentic`) theo quyết định ADR-0001.

Nó **tự dựng bằng chính bộ khung của mình** — không phải một thư mục chép tay. Và nó tự sinh lại
được bản trích trong `template/`: `npm run template -- --check` phải luôn khớp.

## Log
**Phần CŨ hơn đã dời sang kho lưu trữ** — [`docs/archive/`](docs/archive/) · chữ giữ nguyên từng dòng, cắt bằng `npm run don`.




> **Lượt CŨ hơn đã dời sang** [docs/archive/HANDOFF-202609.md](docs/archive/HANDOFF-202609.md) — chữ giữ nguyên từng dòng.


## 2026-09-08 (khuya, tiếp) · harness-loi-01 · Khoá mức FILE lên nơi phát hành · bảng chảy thành cột

**⑴ BẢNG: tab Migrate phải cuộn 10.607px.** Gốc bệnh KHÔNG phải danh sách một cột — là **cái ô
chứa nó**: `.xep` là lưới thẻ `minmax(268px,1fr)`, nên bốn hồ sơ migrate thành bốn cột rộng
**296px** giữa trang rộng **1.213px**. Vá hai vế: khung hồ sơ span trọn bề ngang · danh sách khai
`column-width` (không `column-count` — số cột phải suy từ màn hình). Kèm **tay kéo** nhớ trong
trình duyệt. Đo: khối checklist **1.943 → 1.023px** (3 cột). **8 đột biến, cả 8 bị bắt** — hai cái
sống sót lượt đầu vì cửa sổ dò `try` rộng 90 ký tự nên `try` BAO NGOÀI lọt vào; siết còn 24.

**⑵ KHOÁ MỨC FILE — mang từ repo tiêu thụ lên đây rồi phát lại.** Đo LẠI ở repo này: **620** cặp
commit khác lane trong 1h cùng vùng, **57% khác file hoàn toàn** (họ: 70%), file/commit p90 **12**
(họ: 7). Hơn nửa số lượt chặn hôm nay là **chặn oan** — và p90 12 là lý do `--sua` phải nhận cả mẻ.

Khối riêng `tam` · trả thì XOÁ HÀNG · chứa nhau HAI CHIỀU · cổng ĐỎ khi còn treo (mốc là HẾT PHIÊN,
không phải ĐÃ ĐẨY) · quá 30 phút NÊU TÊN, **không tự nhả**. Ghim 6 vế, **6+2 đột biến đều bị bắt**.

**BA CHỐT AN TOÀN CHẶN TÔI, cả ba đúng:** ⓐ `EXPECTED_CHECKS` — thêm phép kiểm thứ 15 mà không
khai là cổng DỪNG. ⓑ vân tay luật chung — đổi `AGENTS.md` thì bộ trích **từ chối phát** cho tới khi
ghi câu duyệt của Đức vào sổ. ⓒ "luật chung trỏ tới file bản trích KHÔNG mang" — bản đầu để liên
kết ADR ngay trong luật chung; **lần thứ ba trong ngày** cùng bẫy đó.

**B9 cưỡng chế "một luật vào một luật ra":** khối mới đẩy bản trích **200 → 222 dòng**. Trả lại
bốn chỗ, cả bốn là **gộp thật** chứ không gọt chữ (chi tiết ở ADR-0012) → **200/200 khít**.

**Đức yêu cầu giữa chừng: "tạm nhả khóa, bao giờ ghi file hãy lấy lại"** — đã làm, và lượt còn
lại của phiên chạy **đúng cơ chế vừa port**: trả cả 4 khoá vùng, rồi mỗi lượt ghi mới `--sua` đúng
file đang sửa và `--xong --het` ngay sau. Đây là lượt chạy thật đầu tiên của nó ở repo này.

**Còn mở:** `KHUNG-47` · `KHUNG-50` · `KHUNG-51` · `KHUNG-52`.

## 2026-09-08 (khuya, tiep) · harness-phat-01 · Duc chot dong KHUNG-42, giu dong VANG

**Duc chot:** *"ok dong KHUNG-42 di, giu dong vang."* — co che khoa **tu het han** bo han, vi
ADR-0012 ⑸ noi nguoc no. Giu lai **dung mot** viec: dong VANG cuoi cong, chi **neu ten**, khong
doi ma thoat. Muc moi la **`KHUNG-54`** (51/52/53 lane ① da dung).

**BAN VA DA SOAN SAN, chua ghi duoc vi khoa `_root` dang o lane ①** (16:35, dong ban 1.3.76).
Ba viec, tu-kiem truoc khi ghi, khong doan:
`node "…/scratchpad/ap-khung42.mjs"` — gach ma KHUNG-42 + chen khoi ly do · them KHUNG-54 ·
them muc quyet dinh vao `decisions.md`. Duong day day du o Log phien nay.

**Va mot canh bao cho ①, dung cho chuong dang lam:** dong VANG nay roi vao `scripts/session-check.mjs`
— dung file lane ① dang giu khoa muc file luc 16:36. Neu ① lam luon thi khoi trung; neu khong,
`KHUNG-54` cho o so.

**Toi SUA lai mot chan doan cua chinh minh:** hai lan `RELEASE-LEDGER.json` hong hom nay toi ghi vao
`KHUNG-50` la "dua ghi khong nguyen tu". SAI. Nguon that la `tests/upgrade-smoke.mjs` doi but sổ
THAT o goc repo roi khoi phuc trong `finally`; mot luot bi cat giua duong de lai `1.2.10 →
1111111111111111` trong cay lam viec. Lane ① tim ra doc lap va da ghi thanh `KHUNG-51`.
Toi da khoi phuc file tu HEAD (ban sao dot bien luu o scratchpad truoc khi khoi phuc).

**Con mo:** `KHUNG-54` (chua ghi vao so) · 3 commit chua day, trong do `b399d2a` la cua toi nam
TREN hai commit cua ①, nen day rieng se phai `--carry` — de ① day cung luot 1.3.76 thi khong can.

## 2026-09-08 (khuya, tiếp) · harness-loi-01 · Chạy thật khoá file → lộ hai lỗ, vá cả hai

**Đức yêu cầu giữa chừng: *"tạm nhả khóa, bao giờ ghi file hãy lấy lại"*.** Làm ngay, và phần còn
lại của phiên chạy **đúng cơ chế vừa port**. Lượt dùng thật đầu tiên lộ ra hai chỗ:

**⑴ `--sua` chặn OAN artifact máy sinh — chính thứ nó sinh ra để bỏ.** Lane kia giữ `_root`, và
`--sua DASHBOARD-*.html` bị từ chối vì bảng nằm trong `_root` — trong khi luật của repo khai nó ở
khối `generated` với câu *"nội dung tất định từ HEAD nên không ai sở hữu chúng theo nghĩa nào"*.
`--soat` miễn nhóm đó từ đầu, `--sua` thì quên: **hai cửa của một cơ chế nói hai điều khác nhau**.
Vá + vế 5b + 2 đột biến. Tổng khoá file: **7 vế · 8 đột biến, tất cả bị bắt**.

**⑵ Cổng đóng phiên CHƯA BIẾT tới khoá file** — vẫn đòi khoá VÙNG cho mọi commit, nên cơ chế mới
chỉ dùng được TRONG LÚC LÀM, không dùng được để ĐÓNG PHIÊN. Đây là mâu thuẫn thật giữa luật mới và
cổng cũ: cổng hỏi *"ai chịu trách nhiệm"* và tìm câu trả lời trong bảng khoá vùng, trong khi
ADR-0012 nói rõ khoá file **không mang** trách nhiệm truy nguồn — nhãn `Lane:` mang. **KHÔNG vá
bằng cách nới cổng.** Ghi `KHUNG-53`, hai lối đề xuất, điều kiện đóng là một lệnh chạy được.

**⑶ Nhân đó đóng `KHUNG-52`** (cổng in tên ba suite CHẬM thay vì suite ĐỎ — sáng nay nó tốn của
tôi bốn lượt đo). Ca hỏng: repo có một suite ĐỎ-nhưng-NHANH và một suite XANH-nhưng-CHẬM; vế đòi
cả hai chiều. **Nhánh thành thật tự chứng minh mình có ích ngay trong lượt vá**: bản đầu chỉ đọc
`stdout` nên in *"không đọc được TÊN suite đỏ"* — và chính câu đó chỉ ra tên nằm ở `stderr`. Lùi
im lặng thì lỗi sống thêm một vòng. 3 đột biến, cả 3 bị bắt.

**Đức chốt chuyển `_root`** lần hai để đóng bản — đã ghi vào bảng quyền, trả ngay sau khi đẩy.

**Số:** bản **1.3.76** · sổ nợ **25/25** · suite **22 suite** · `cong-do-that` **11 → 12 vế** ·
`khoa-file` **7 vế**.

**Còn mở:** `KHUNG-47` · `KHUNG-50` · `KHUNG-51` · `KHUNG-53`.

## 2026-09-09 · harness-loi-01 · Bảng: liệt kê sổ nợ + ô tìm — và một byte BACKSPACE nữa

**Đức nêu:** *"tôi tìm khung 30, 40, 53 trong dashboard nhưng rất mơ hồ? ta có thể thêm tính năng
search không?"* — **gốc bệnh không phải thiếu search.** Đo trước khi gõ: `KHUNG-53` xuất hiện
**0 lần** trên cả trang dù đang mở; `KHUNG-30` chỉ hiện như một chữ nhắc trong thân mục khác.
Bảng có hai CON SỐ sổ nợ và một đoạn giải thích cách đếm, **không liệt kê mục nào**. Tìm kiếm
trên một trang không chứa thứ cần tìm cũng không ra.

**⑴ Bảng liệt kê đủ 25 mục** — mã · mức ưu tiên · tiêu đề · cờ chờ-chốt, chảy thành cột. Dữ liệu
vốn đã có; bảng chỉ đếm rồi vứt đi. Đó là kiểu thiếu tệ nhất của một bảng trạng thái: nó KHẲNG
ĐỊNH có 25 việc rồi không cho tra 25 việc đó là gì.

**⑵ Ô tìm quét CẢ NHÓM ĐANG ẨN.** Ctrl+F không đủ vì bốn trong năm nhóm đang `hidden` — thứ người
xem cần *"không có trên trang"* trong khi nó có. Kết quả nói rõ nhóm nào; bấm là nhảy.

**BYTE BACKSPACE, LẦN THỨ HAI** (rồi lần thứ BA ngay trong lượt viết nhật ký này). Regex dựng
bằng chuỗi Python, mà `\b` là escape HỢP LỆ của Python → **byte 0x08 thật** lọt vào mã nguồn:
regex không khớp gì, cả 25 mục mang `P?`, **không phép kiểm nào đỏ**. Nay có vế đếm **byte điều
khiển thô = 0**.

**Và `--take` chặn OAN artifact máy sinh — LẦN THỨ HAI trong một ngày.** Đức chốt chuyển `_root`,
lệnh TỪ CHỐI vì `DASHBOARD-*.html` "đang sửa dở" — file mà chính lệnh sinh lại mỗi lượt, và luật
khai rõ **không ai sở hữu**. Vá + vế `5c` đo **sự ĐỒNG Ý giữa ba cửa**, không đo từng cửa.

**8 đột biến, cả 8 bị bắt** — trong đó một cái nhét lại byte BACKSPACE vào regex → đỏ.

**Ghi `decisions.md` 7 quyết định của Đức** (08–09/09) — trước đó chỉ nằm trong nhật ký và ADR,
không ở chỗ người ta đi tra.

**B12 chặn tôi, và đúng:** Đức chốt *"ghép `KHUNG-55` vào ADR-0012"*; tôi làm đúng thế và ADR đã
`Accepted` là **BẤT BIẾN**. Lối đúng: **ADR-0013 bổ sung**, tiền lệ ADR-0009. Trần sổ nợ vẫn 25.

**Còn mở:** `KHUNG-47` · `KHUNG-50` · `KHUNG-51` · `KHUNG-53` · `KHUNG-54`.

## 2026-09-09 · harness-loi-01 · `--carry` thôi phải hỏi khi cổng đã xanh — nới có ghi giá

**Ba lượt trong hai ngày, cùng một hình dạng, Đức duyệt cả ba:** commit của lane khác nằm dưới
commit của mình; git xếp theo thứ tự nên đẩy cái trên là buộc đẩy cái dưới. **Một cửa mà lần nào
cũng mở thì nó không còn là cửa** — nó là thủ tục, và thủ tục lặp lại bị bỏ qua trước khi bị gỡ.

**Đức chốt:** *"Đẩy đi, và từ nay khỏi hỏi nếu cổng đã xanh."* `AGENTS.md` mục 2 hàng 2 nay chỉ
cấm `--carry` khi **cổng CHƯA xanh toàn bộ** hoặc có commit **không quy thuộc được**.

**GHI RÕ ĐÂY LÀ NỚI, không phải chữa mâu thuẫn.** Hai lượt miễn thước kho chữ hôm qua làm thước
**chặt hơn** (chúng sửa phép đo cho khớp luật đã có). Lượt này đổi **chính luật**, và cái mất có
thật: Đức thôi được báo từng lượt việc của lane khác lên GitHub. Đổi lại, commit chưa push là
**vô hình** với vòng audit chéo — đẩy sớm là được soi sớm.

**B9 lại cưỡng chế "một luật vào một luật ra":** bản trích 200 → 204 dòng. Trả lại bằng cách
**gộp** đoạn *"commit và push tự làm"* (26/08) với đoạn mới — sau lượt này hai đoạn nói cùng một
điều về cùng một câu hỏi *"khi nào AI được tự công bố"*. Về **200/200 khít**.

**Đã ghi ba chỗ:** vân tay luật chung + lý do trong sổ đổi vân tay · `decisions.md` · luật ở
`AGENTS.md`. Đổi luật an toàn mà chỉ nhớ miệng thì lượt sau không ai biết vì sao nó khác.

**Còn mở:** `KHUNG-47` · `KHUNG-50` · `KHUNG-51` · `KHUNG-53` · `KHUNG-54`.

## 2026-09-09 · harness-phat-01 · Phat 1.3.76 ra 3 repo — 1 xanh, 2 BI CHINH LUAT CUA BO KHUNG CHAN

**Ket qua:** `n8n-orchestrator` 1.3.67 -> 1.3.76 xong tron, cong XANH TOAN BO, da day, da tra khoa.
`nav_platform_main` va `ALL_SKILL_MANAGEMENT` da nang xong o may nhung **KHONG DAY DUOC**.

### ⑴ Ca thu SAU ho KHUNG-47 — nay dung o tinh nang dau bang

`upgrade` mang FILE `tests/khoa-file.mjs` sang, nhung cho duy nhat goi duoc no la `test:tuan-tu`
— dung cai lenh `upgrade` BI CAM ghi de (va cam la dung: no giu 3 suite san pham cua nav_platform).
Nen tinh nang khoa file toi repo dich voi **0 phep ghim**, cong van XANH.

**Lo chi can repo DA CO `test:tuan-tu` tu truoc.** `ALL_SKILL` chua co nen `upgrade` duoc phep TAO
MOI, va ban moi da gom `khoa-file.mjs` — do lai 10 file no goi: deu co that, khong bo sot suite nao.
Da noi tay o nav_platform va n8n; chay thu ca hai: 7/7 ve xanh.

### ⑵ HAI LUAT CUA BO KHUNG KHOA LAN NHAU — do duoc o ALL_SKILL

`handoff-smoke` doi dong tieu de dung `## Log` (`RE_MO_LOG`, va no la moc `--rotate` tim cho cat).
Repo viet `## Log (append-only)` -> `laNhatKy` FALSE, `docMucTuFile` thay **0 muc** trong khi co **7**.
Nhung `session-check` **cam xoa dong** cua `HANDOFF.md, chi cho DOI CHO.

Doi tieu de = xoa mot dong => do. Khong doi => `handoff-smoke` do. **Khong co nuoc di nao o phia repo.**
Da do ba duong, ca ba tac: them lai duoi dang tieu de thi no thanh mot MUC bao tron phan Log cu ->
vuot tran; them lai dang chu thuong thi khong CUNG BYTE nen van tinh la xoa; tu nhet vao
`docs/archive/` thi lam hong chinh phep doi chieu tung byte cua cong.

**Va mot he qua thu hai:** khi bo do sang lai thi moc so la `origin/main` — noi no van thay 0 muc
— nen **ca 7 muc cu deu thanh "muc MOI"** va 3 muc vuot tran. Bai toan CHUYEN TIEP MOT LAN,
khong phai loi cua muc nao. Da hoan nguyen ban va, ghi thanh `SKILL-1` voi 6 dieu kien dong.

### ⑶ Phat hien nang nhat: 2/3 repo da migrate CHUA BAO GIO co cong xanh

`origin/main` cua `ALL_SKILL` **chua tung khai** `handoff.tran_byte_moi_muc` -> muc do luon [BO],
cong luon thoat **2**. `nav_platform` co 12 file van ban >2MB -> bo do secret luon [BO], cong luon
thoat **2**. Nghia la dieu kien "day khi cong XANH TOAN BO" o hai repo nay **chua tung dat duoc**,
nhung ca hai da tung duoc day. Luat da bi di qua ma khong ai thay.

Toi tu doc thay cong o nav_platform: 12 file, 89,3 MB, **du 8 mau cat thang tu `session-check.mjs`**
-> **0 khop, sach**. **Cho Duc chot 3 cau**, da neu trong bao cao phien.

## 2026-09-09 · harness-loi-01 · Luật mới không có máy cưỡng chế thì vẫn là chữ

**Ngay sau khi đổi luật `--carry`, tôi chạy `safe-push` — và nó VẪN TỪ CHỐI.** Tôi đổi `AGENTS.md`
nhưng chưa dạy công cụ. Đó đúng cái repo gọi là *"luật là chữ"*, và nó lộ ra trong vòng một phút.

**Vá thay vì ghi nợ.** `safe-push.mjs` nay tự cho qua khi đủ **HAI** điều kiện, cả hai do MÁY xét:

- ⑴ **mọi commit sắp đẩy đều quy thuộc được** (có nhãn `Lane:`) — đó là thứ `--carry` thực sự mua;
- ⑵ **dấu xác nhận suite còn hiệu lực trên ĐÚNG cây làm việc này** — dấu buộc vào HEAD + băm cây,
  nên không mượn được của lượt trước.

**Vế ⑵ là chỗ dễ bỏ nhất, và bỏ nó là hỏng cả luật:** còn lại sẽ là *"có nhãn Lane thì đẩy được"*,
tức một lane đẩy việc của lane khác đi **trong lúc cổng đang ĐỎ** — đúng thứ mục 2 hàng 2 sinh ra
để chặn. Đọc dấu thất bại thì coi là CHƯA xanh (fail-closed).

**Tự chứng minh ngay lượt đầu:** lệnh từ chối với lý do *"cây làm việc đã đổi kể từ lượt chạy đó"*
— vì tôi vừa sửa chính `safe-push.mjs`. Thứ tự đúng vẫn là commit → suite → cổng → đẩy.

**3 đột biến, cả 3 bị bắt** (bỏ vế dấu · nối bằng HOẶC · fail-open khi đọc dấu hỏng).

**Vế ghim này YẾU HƠN một ca chạy thật, và ghi rõ thế:** nó đọc mã nguồn, vì `safe-push.mjs` chạy
phần chính ngay lúc nạp module nên không suite nào `import` nổi. Ca thật cần một remote giả —
đáng làm, chưa làm.

**Còn mở:** `KHUNG-47` · `KHUNG-50` · `KHUNG-51` · `KHUNG-53` · `KHUNG-54`.

## 2026-09-09 (tiep) · harness-phat-01 · Co che khoa khong co nuoc di cho "xong ma cong chan"

Duc hoi: *"vi sao ban ko tu nha? luat la sua xong file thi nha chu nhi?"* — hoi dung, va cau tra
loi lo ra mot lo cua chinh co che.

**Toi giu khoa vi ly do SAI.** Toi ap luat *"qua 30 phut thi neu ten, tuyet doi khong tu nha"* cho
khoa CUA CHINH TOI. Luat do noi ve khoa cua **lane khac** (AGENTS.md muc 1, ADR-0012 ⑸).

**Nhung tra khoa cung bi chan, boi mot luat khac.** `claim.mjs --release` tu choi khi con commit
chua day: *"de lai commit chua cong bo ma khong ai dung ten"* — ban va cua `KHUNG-33`.

### Trang thai thu ba khong ai luong

| Trang thai | Tra khoa? |
|---|---|
| Sua xong, DA DAY | tra ngay — luat Duc chot 08/09 |
| Dang sua | giu |
| **Sua xong, cong TU CHOI nen chua day duoc** | **ca hai duong deu sai** |

O trang thai thu ba: **giu** = khoa vo thua nhan, dung thu Duc phan doi; **tra** = commit vo chu,
va cong cu canh bao *"Lane TIEP THEO se KHONG day duoc: safe-push tu choi vi no cuon theo commit
cua ban. Chi Duc go duoc."*

Da tra bang `--du-biet` theo lenh Duc, o ca ba khoa (nav_platform `_root`; ALL_SKILL `_root`+`_code`),
ly do ghi vao bang. **Cai gia da tao ra:** hai repo do gio chan duong day cua moi phien sau —
3 va 7 commit. Go bang: Duc duyet `--carry`, HOAC Duc chot 2 cau de toi day not (re hon).

**Goc benh:** co che khoa gia dinh **moi viec xong deu day duoc**. Khi cong chan hop le — o day la
nguong 2MB cua bo do secret, va deadlock hai luat nhat ky — thi khong co nuoc di nao dung ca.
Can mot trang thai thu ba tuong minh: *"da xong phan minh, dang cho nguoi chot"* — khoa duoc tra,
commit khong bi coi la vo chu, va lane sau doc duoc ly do ma khong phai xin `--carry`.

## 2026-09-09 · harness-loi-01 · Thêm một `import` là thêm một ràng buộc "đi cùng nhau"

**Ba suite đỏ ngay sau lượt vá trên**, cùng một gốc: `safe-push.mjs` nay `import` `chay-test.mjs`
(để đọc dấu xác nhận), mà **fixture của ba suite chỉ chép sang `safe-push.mjs` + `repo-structure.mjs`**.
Thiếu một file thì lệnh chết **ngay lúc nạp module** — không phải đỏ một vế, mà không chạy dòng nào.

**Cùng hình dạng bản 1.3.26 đã vấp:** thêm `bang-song/` rồi `upgrade.mjs` đẩy `tests/bang-song.mjs`
sang repo đích mà không đẩy thứ nó kiểm. Bài học cũ, chỗ mắc mới: lần đó là **danh sách phát**,
lần này là **danh sách fixture**.

**Vá:** ba chỗ chép fixture nay mang cả `chay-test.mjs`, kèm một dòng nói vì sao. Bản trích không
phải sửa — `chay-test.mjs` vốn đã nằm trong `PORTABLE_SCRIPTS`.

**Chỗ này chưa có máy canh, ghi ra để không ai tưởng nó kín:** không phép kiểm nào đối chiếu *"file
X import gì"* với *"fixture chép gì"*. Lần sau ai thêm một import vào một script được fixture chép
thì lại vấp y hệt — và triệu chứng là `MODULE_NOT_FOUND` ở một suite trông không liên quan.

**Còn mở:** `KHUNG-47` · `KHUNG-50` · `KHUNG-51` · `KHUNG-53` · `KHUNG-54`.

### 2026-09-09 · harness-loi-01 · Dọn luật trùng + trả nợ rổ D

**Làm gì:** ⑴ phân loại 25 mục nợ thành 4 rổ, Đức duyệt gộp/xoá; ⑵ xoá `KHUNG-24` (ca hỏng không
dựng nổi — `units.root_dir = null`), gộp `KHUNG-31`→`KHUNG-6` và `KHUNG-3`→`KHUNG-14` (cả hai tự
khai trùng hình dạng); ⑶ đóng `KHUNG-8` và `KHUNG-10`; ⑷ sửa mâu thuẫn trong luật chung mục 1.

**Số:** sổ nợ **25 → 20 mục mở** (trần 25). Luật chung mục 1 trước đây nói **BA mốc trả khoá khác
nhau** cùng lúc → nay **MỘT mốc mỗi loại khoá**. Câu *"quá 30 phút … KHÔNG tự nhả"* thiếu chủ ngữ
→ nay có chủ ngữ (MÁY), và dời xuống cạnh luật về khoá lane khác. Bảng tra mục 6 nói *"6 trên 11
mục cổng có ca đỏ"* — số của 05/09; đo lại 09/09 là **11 trên 15**, nay ghi đúng và nêu tên 4 mục
chưa có. Bản trích **220 → 200/200 dòng** (B9): 20 dòng gọt đều là chữ, **không luật nào mất**.

**Ghim:** `tests/core-contract.mjs` F12 nhận vế thứ ba — F12 cũ chỉ đọc **link markdown**, nên tên
file trong **dấu nháy ngược** lọt hết. Lượt này bản chữ đầu suýt phát đi luật gọi tên
`docs/SO-TAY-AGENT.md` và `IDEAS.md` — bản trích không mang cả hai, F12 vẫn XANH, tôi phải bắt bằng
tay. **4 đột biến đã chạy, 2 cái SỐNG SÓT lượt đầu** (bảng miễn trừ chưa từng chặn gì → đã gỡ;
và vế chính không thể đỏ ở repo sạch → thêm đoạn giả lập chạy qua đúng phép lọc).

**Còn mở:** 20 mục, trong đó **6 chờ Đức** (`KHUNG-6` · `KHUNG-11` · `KHUNG-14` · `KHUNG-30` ·
`KHUNG-37` · `KHUNG-40` mang dấu `@Đức`). Rổ A còn `KHUNG-9` · `KHUNG-15` · `KHUNG-39` · `KHUNG-50`
· `KHUNG-51` chưa đóng. Hướng dịch luật sang tiếng Anh **đã đóng** — Đức chốt giữ tiếng Việt.

### 2026-09-09 (2) · harness-loi-01 · Gộp luật KHOÁ, và lắp răng cho sổ quyết định

**Làm gì:** ⑴ gộp **3 quyết định về khoá** (06/09 · 08/09 ×2) thành MỘT mục trạng-thái-cuối, dời
ba mục cũ nguyên văn sang `docs/archive/DECISIONS-khoa-2026-09.md`; ⑵ phát hiện `decisions.md`
khai *"chỉ thêm"* trong luật mà **không phép kiểm máy nào canh** — cơ chế *dời-chỗ-chứ-không-xoá*
trước nay chỉ chạy cho `HANDOFF.md`. Lắp răng bằng đúng cỗ máy đó.

**Số:** `decisions.md` **30 → 28 quyết định**, 640 → 628 dòng, 6.828 → 6.693 từ. Dời **37 dòng**,
đối chiếu độc lập bằng `git diff`: 0 dòng mất. Cổng **15 → 16 phép kiểm** (khai ở `EXPECTED_CHECKS`).
`cong-do-that.mjs` **12 vế → 13**, và độ phủ cổng **11/15 → 12/16** — bảng tra mục 6 đã cập nhật.
Bản **1.3.81**. Bản trích vẫn **200/200** (vân tay luật chung KHÔNG đổi — sửa nằm ở bảng tra riêng
của repo, không nằm trong luật chung).

**Ghim:** `tests/cong-do-that.mjs` vế 13 — bốn nhánh: chỉ thêm XANH · xoá mất hẳn ĐỎ · **bản lưu
trữ lệch MỘT ký tự vẫn ĐỎ** · dời khớp byte XANH lại. Vế thứ ba là vế chống lách bằng file rỗng;
vế thứ tư giữ cho cổng không chặn oan lượt dọn đúng luật.

**Hai chỗ tự vấp, ghi lại vì cả hai sẽ tái phát:** ⑴ viết `*` `/archive/` `*` vào khối chú thích
`/* */` là **đóng luôn khối chú thích**, cả file chết lúc nạp; ⑵ fixture đặt `decisions.md` là file
MỚI TINH thì mọi dòng đều là dòng THÊM, nên xoá bao nhiêu cũng không hiện ra — phải đẩy sổ lên
**mốc so** trước. Ca ⑵ làm vế đỏ báo XANH, tức suýt ghim một phép kiểm không thể đỏ.

**Còn mở:** sổ nợ **20 mục** (6 chờ Đức). Rà luật mới xong `AGENTS.md` + cụm KHOÁ của
`decisions.md`; **chưa rà** 14 ADR (11.150 từ) · `ORCHESTRATOR.md` (5.160) · `SO-TAY-AGENT.md` ·
`MULTIFLOW.md` · `LEGEND.md`. Cụm **BẢNG** (6 quyết định) và mục #2 *"Push dù cổng còn đỏ"* là hai
cụm nhiễu kế tiếp đã khoanh được.

### 2026-09-09 (3) · harness-loi-01 · BỘ BIÊN DỊCH LUẬT + B16

**Làm gì:** Đức chốt cơ chế *append → merge → supersede → trim → compile*. Dựng
`scripts/rule-compiler.mjs` (6 bước, tất định) + phép kiểm **B16** (nhóm CHẶN) + ghim
`tests/rule-compiler.mjs`. **Không gộp file ADR** như repo Extension làm — B12 khai ADR `Accepted`
bất biến; ta gộp **câu trả lời** bằng `chu_de`/`dau_moi` trong frontmatter, thứ B12 cho phép sửa.

**Số:** **15 ADR → 6 chủ đề**, mỗi chủ đề đúng một đầu mối, 0 vi phạm. Cổng cấu trúc **15 → 16**
phép kiểm. Suite **21 → 22**. Bản **1.3.82**. Bản trích **200/200** dòng, nay mang thêm
`scripts/rule-compiler.mjs` + khai sẵn `luat.chu_de` + hạt giống ADR có `chu_de`.

**Bốn con số gõ tay đã sai, sửa bằng cách cho máy ĐẾM:** bộ kiểm cấu trúc tự xưng *"15 phép kiểm
B1…B15"* (nay đếm) · cổng phiên gọi nó *"B1–B14"* (nay bỏ số khỏi tên mục) · bảng tra nói *"6 trên
11"* (đã sửa lượt trước) · bảng lệnh trong bản trích cũng ghi *"B1–B14"*.

**Ghim:** 8 vế · **5 đột biến chạy thật, 1 SỐNG SÓT lượt đầu** — fixture đặt đầu mối trùng luôn là
mã nhỏ nhất, nên xếp-theo-mã và xếp-theo-đầu-mối cho CÙNG kết quả; vế đó chỉ đang xác nhận một sự
trùng hợp. Đảo fixture là đột biến chết. Mọi lượt đột biến đều kiểm `diff` để chắc nó ĐÃ áp dụng.

**Hai bẫy cũ lại suýt cắn, cả hai bị phép ghim CŨ bắt:** ⑴ `check-bootstrap.mjs` `import`
`rule-compiler.mjs` mà bản trích không mang → `MODULE_NOT_FOUND` ở mọi repo tiêu thụ; ⑵ luật trong
bản trích gọi `npm run luat` mà bản trích chưa khai lệnh đó — `template-null-repo` bắt đúng chỗ.

**Còn mở:** sổ nợ 20 mục. Rà luật: xong `AGENTS.md` · cụm KHOÁ · **14 ADR đã phân nhóm**. Chưa rà
`ORCHESTRATOR.md` (5.160 từ) · `SO-TAY-AGENT.md` · `MULTIFLOW.md` · `LEGEND.md`, và cụm **BẢNG**
(6 quyết định) + mục *"Push dù cổng còn đỏ"* trong `decisions.md`.

### 2026-09-09 (4) · harness-loi-01 · Tài liệu dạy mặc định CŨ — đo, sửa, ghim

**Làm gì:** rà kho tài liệu tìm chỗ chép lại luật đã bị thay thế.

**Số:** lệnh khoá MỚI `--sua` có ở **1 file**, lệnh CŨ `--take` ở **4 file**. Nặng nhất:
`docs/briefs/GIAO-VIEC-CHUNG.md` — đề bài giao cho AI khác, nên **mọi phiên được giao việc** đều
học mặc định đã bị thay thế. Đã sửa 4 file (`SO-TAY-AGENT` · `TINH-NANG` · `MULTIFLOW` ·
`GIAO-VIEC-CHUNG`) trỏ về `AGENTS.md` mục 1 thay vì chép luật. Sổ quyết định **29 → 28**: dời mục
06/09 *"Bảng phải tự tươi — chưa làm"* sang kho (nó sai sự thật: 07/09 đã cài, `Y-10` bậc *đã
chứng minh*), đối chiếu byte 0 dòng mất.

**Ghim:** `core-contract` **F20** — file nào nhắc `--take` phải nhắc cả `--sua`. Một đột biến đã
chạy: trả `GIAO-VIEC-CHUNG.md` về bản cũ → F20 nêu đúng tên file.

**Bản đầu của F20 tự nó là ca hỏng:** dò chuỗi đầy đủ `claim.mjs --take` nên chỉ thấy 1 file và
**bỏ sót đúng file nặng nhất**. Phép đo hẹp hơn thực tế thì nó báo xanh ở chỗ đang hỏng.

**Chỗ khoanh SAI, sửa lại:** lượt trước tôi khoanh quyết định 05/09 *"Push dù cổng còn đỏ"* là
nhiễu. Đọc kỹ thì nó **tự giới hạn tường minh** (*"KHÔNG mở ra luật"*, kèm ba điều kiện viện dẫn)
— giữ nguyên.

**Memory của phiên:** trước nay TRỐNG. Đã dựng theo đúng luật vừa viết — `MEMORY.md` nói rõ
**luật của repo KHÔNG ghi vào memory** (luật có nhà riêng); memory chỉ giữ thứ repo không ghi
được. Hai mục: Đức uỷ quyền chuỗi dài · Đức đọc SỐ không đọc tính từ.

**Còn mở:** sổ nợ 20 mục. Chưa rà: `ORCHESTRATOR.md` (ba luật lớn chưa có phép kiểm máy = `KHUNG-4`,
đã có mục nợ nên không mở mục mới) · `LEGEND.md` · `HUONG-DAN.md`.

### 2026-09-09 (5) · harness-loi-01 · Trả giá cho phần vừa thêm — thước cóc SIẾT xuống

**Vì sao có mục này:** cổng ĐỎ ở *Kho chữ không phình* sau lượt sửa tài liệu (+12 dòng). Ba cửa
ra là gọt · chuyển sang ADR · **nới thước**. Nới thước là nới một lớp bảo vệ nên không dùng.

**Làm gì:** ⑴ nén lại chính phần mình vừa thêm ở ba file (−5 dòng); ⑵ tìm được chỗ nhiễu thật —
`docs/ROADMAP-V2.md` chứa **kế hoạch sáu đợt** đã bị hai khối *Cập nhật* phía trên phủ lên, và
chính file đó ghi *"mục này thay phần xếp đợt bên dưới ở những chỗ mâu thuẫn"*. Một file nói hai
thứ tự rồi dặn đọc cái nào trước — đúng hình dạng `ADR-0014` sinh ra để cắt.

**Số:** đo trước khi dời: **7 trong 13** mã việc kế hoạch cũ nhắc tới **đã đóng**. Dời **71 dòng**
sang `docs/archive/ROADMAP-V2-dot-0-den-5.md`, đối chiếu byte 0 dòng mất. `ROADMAP-V2.md`
**179 → 120 dòng**. Kho chữ **3.260 → 3.196**. **Thước cóc 3.248 → 3.196** — SIẾT, không nới.
Bản **1.3.86**.

**Chỗ thay vào:** một mục ngắn nói thứ tự hiện hành nằm ở đâu (`npm run what-next`), và giữ lại
luật còn hiệu lực *GOM BẢN PHÁT*.

### 2026-09-09 (6) · harness-loi-01 · Sáu con số gõ tay trong luật đều sai — ghim F21

**Làm gì:** quét mọi khẳng định bằng số trong `AGENTS.md`, đối chiếu với thực tế.

**Số:** **6 con số sai**: `features.json` 41→**44** mục · `bang-song` "chín"→**11** vế ·
`khoa-file` 6→**8** vế · `khoa-dau-vet` "tám"→**11** vế · hàng ROADMAP còn nói *"12 mục nợ xếp
thành 5 đợt"* (các đợt đã dời sang kho) · cộng ba con số dãy B đã sửa ở lượt trước. Đã sửa cả sáu.

**Ghim:** `core-contract` **F21** — mọi khẳng định *"N vế"* kèm liên kết `tests/*.mjs` phải khớp
số vế thật. 5 khẳng định đang được đo.

**Lỗ của chính F21, đột biến tìm ra:** bản đầu chỉ đọc CHỮ SỐ, nên đổi *"11 vế"* → *"chín vế"* là
khẳng định đó rơi khỏi tập đo và phép kiểm vẫn xanh — mà *"chín vế"* chính là một trong sáu con số
sai. Nới ra đọc cả số viết bằng chữ (`một`…`mười`) thì nó **bắt ngay con số sai thứ sáu**
(`khoa-dau-vet`) mà tôi chưa hề biết. Bài học: một phép kiểm chừa ca hỏng của chính nó là đồ trang trí.

**Cũng sửa:** con trỏ treo do chính tôi tạo ở `ROADMAP-V2.md` (dòng *"thay phần xếp đợt bên dưới"*
trong khi khối đó đã dời đi), và câu *"lên đợt 1"* nay bỏ số hiệu vì các đợt không còn.

**Còn mở:** sổ nợ 20 mục. Rà luật: xong `AGENTS.md` · `decisions.md` · 15 ADR · `ROADMAP-V2` ·
`MULTIFLOW` · `SO-TAY-AGENT` · `TINH-NANG` · `GIAO-VIEC-CHUNG`. **Chưa rà:** `ORCHESTRATOR.md`
(vấn đề đã có mục nợ `KHUNG-4`) · `CHUYEN-REPO-LEN-CHUAN.md` · `BAO-TRI-DINH-KY.md` · `LEGEND.md`.

### 2026-09-09 (7) · harness-loi-01 · ROADMAP-V2 tự vi phạm luật của chính nó

**Đo:** mục *"Việc còn mở"* trong `docs/ROADMAP-V2.md` liệt kê tay 12 mã việc — **5 trong 12 đã
đóng hoặc đã xoá**. Và nó vi phạm chính luật ở cuối file đó: *"Không nhắc lại nội dung từng mục
nợ — hai nguồn sự thật cho cùng một việc là đúng bệnh bộ khung sinh ra để chữa."*

**Chốt:** bỏ danh sách tay, trỏ sang nguồn SỐNG (`npm run what-next` + `BACKLOG.md`), giữ lại
phần file này ĐƯỢC nói: thứ tự ưu tiên và con số vượt trần chưa ai xử.

**Số:** `ROADMAP-V2.md` **120 → 109 dòng**. Kho chữ **3.197 → 3.185**. Thước cóc **3.196 → 3.185**
(SIẾT lần thứ hai trong phiên). Bản **1.3.89**.

### 2026-09-09 (8) · harness-loi-01 · Quét cả kho tài liệu — chốt phiên rà soát luật

**Quét máy toàn bộ tài liệu** (trừ `adr/` · `archive/` · `migrations/`) tìm ba hình dạng:
liên kết trỏ vào hư không · mã việc đã đóng bị nói như đang mở · số gõ tay.

**Số:** **0 liên kết treo**. 4 file nhắc mã đã đóng — ba là kể chuyện lịch sử (hợp lệ), riêng
`KHUNG-31` là mã tôi vừa gộp vào `KHUNG-6` sáng nay nên hai chỗ đã trỏ lại. Kho chữ **3.185**,
đúng bằng thước cóc. Bộ luật: **15 ADR · 6 chủ đề · 0 vi phạm · 0 đề xuất tồn đọng**.

**Tổng cả phiên (bảy lượt commit):** sổ nợ **25 → 20** · sổ quyết định **30 → 28** (dời 4 mục
sang kho, 0 dòng mất) · 15 ADR **chưa phân nhóm → 6 chủ đề** có đầu mối · cổng cấu trúc **15 → 16**
phép kiểm · cổng phiên **15 → 16** · suite **21 → 22** · kho chữ **3.260 → 3.185** (thước SIẾT hai
lần, **không lần nào nới**) · **6 con số gõ tay trong luật** đều sai, đã sửa và ghim.

**Ba phép ghim mới:** `F20` (tài liệu không được dạy mặc định đã bị thay thế) · `F21` (số trong
luật phải khớp thực tế) · `tests/rule-compiler.mjs` 8 vế + `B16`.

**Còn mở:** sổ nợ 20 mục, **6 chờ Đức** (`KHUNG-6` · `11` · `14` · `30` · `37` · `40`).
`ORCHESTRATOR.md` chưa rà sâu — vấn đề của nó đã có mục nợ `KHUNG-4` nên không mở mục mới.

### 2026-09-09 (9) · harness-loi-01 · Rà ORCHESTRATOR.md — ba bản chép luật đều đã sai

**Làm gì:** rà file tài liệu lớn nhất (464 dòng) theo luật vừa dựng — không tìm lỗi diễn đạt, tìm
**bản chép của luật có nhà ở nơi khác**.

**Số — ba chỗ, cộng một chỗ ở file khác:** ⑴ mục 5b nói *"`--carry` phải hỏi"*, sai từ 09/09;
⑵ mục 2 viết luật song song dạng *"khi và chỉ khi"*, **hẹp hơn luật thật** từ 08/09 (khoá file cho
phép hai việc cùng vùng khác file chạy song song); ⑶ khối cảnh báo đầu file từng nói ngược, sai
1.3.0→05/09; ⑷ `docs/briefs/ONBOARD-AI-REPO-DICH.md` cũng chép luật `--carry` cũ. **Hai trong bốn
ca nằm trong ĐỀ BÀI GIAO CHO AI KHÁC** — chỗ bản chép sai lan xa nhất.

**Ghim:** mở rộng **F20** — một **đoạn văn** nhắc `--carry` phải nhắc cả `AGENTS.md`. Đang đo 4
đoạn. Một đột biến đã chạy: trả `ONBOARD` về câu cũ → F20 nêu đúng tên file.

**Bài học về phép đo, lần thứ ba trong ngày:** bản đầu của vế này đo theo DÒNG và báo lệch hai chỗ
LÀNH (một bảng đối chiếu kỹ thuật, một dòng NỐI của đoạn đã trỏ đúng). Đo theo ĐOẠN thì sạch. Phép
đo **chặt hơn** thực tế cũng nguy như **lỏng hơn** — người ta sẽ tắt nó.

**Trả giá đúng luật mục 8:** kho chữ giữ nguyên **3.185/3.185**. Phần thêm ở `ORCHESTRATOR.md`
được trả bằng cách nén hai khối cũ trong chính file đó. Bản **1.3.90**.

**KHÔNG mở mục nợ mới:** ba luật của vai này vẫn chưa có phép kiểm máy — đó là `KHUNG-4`, đã có
mục, không nhân thêm. Bảng "có răng chưa" ở đầu file vẫn đúng: **1 trong 5** mục có phép kiểm.

### 2026-09-09 (10) · harness-loi-01 · Ba trong bốn chỗ vượt ngân sách: đóng bằng cơ chế sẵn có

**`KHUNG-11` — làm được phần không cần Đức:** ⑴ `HANDOFF.md` **1264 → 480**/600 bằng nhịp dọn;
⑵ mục nợ đã đóng **64% → 0%**, dời 35/55 mục (922 dòng) sang kho, `BACKLOG.md` **1496 → 574**;
⑶ tổng tài liệu **6012 → 3602** — không phải cắt chữ, mà vì `can-nang` chỉ trừ `archive/` trong
khi cổng trừ cả `adr/` và `migrations/`. **Hai phép đo cùng một thứ, hai kết quả** (3.185 vs
6.012), và nó đếm cả `docs/adr/` là thứ luật bắt BẤT BIẾN — tức mỗi ADR mới làm nó đỏ hơn và
không có đường hợp lệ nào hạ xuống. Nay dùng chung `THU_MUC_DOCS_KHONG_TINH`.

**Trước khi dời mục đã đóng, phải dạy bộ sinh đọc cả kho:** thẻ *"Đã xong"* của bảng đọc thẳng
`BACKLOG.md`. Dời đi mà không sửa là thẻ RỖNG. Đã kiểm sau khi dời: vẫn **35 việc**.

**Một lỗi của chính nhịp dọn:** nó dọn tới **đúng trần** (600/600), nên dòng Log kế tiếp là 601 —
đỏ lại ngay. Một "nhịp" phải chạy mỗi lượt thì nó là thuế. Nay chừa **20%**; trần không đổi.

**`KHUNG-14` — nửa ĐO đã xong:** `npm run assess` chạy thật. `n8n-orchestrator` 30/60 (thiếu 1,
lệch 12) · `ALL_SKILL_MANAGEMENT` 30/60 · `Project 3 AI Agent Unify` 29/60 · `nav_platform_main`
**không có trên máy này**. **Suýt báo sai:** cả ba in `MỨC 1/3` trong khi hồ sơ khai `muc_sau: 3`
— không phải hồ sơ khai vống, mà là ba repo tụt lại **24 bản khung**. Chỗ hỏng thật nằm ở `assess`:
nó gộp *thiếu bộ máy* với *bộ máy bản cũ* thành một mức, nên repo đứng yên vẫn tụt hạng.

**`KHUNG-30` đổi trạng thái:** nhánh repo đích trước lệch *5 sau/48 trước*, nay **0 sau/63 trước**
— hết lệch. Chốt chặn còn lại là luật *Cloud Sync Hold* của chính repo đó (mục 8A), vẫn còn.

Bản **1.3.91**. Còn chờ Đức: ngân sách tài liệu · số phép kiểm · `KHUNG-6` · `37` · `40`.
<!-- HANDOFF-THANG: 2026-09 -->

### 2026-09-09 (11) · harness-loi-01 · Bốn chốt của Đức: đóng 2 mục, gộp 32 phép kiểm còn 25

**Đức chốt bốn việc.** Hai đóng ngay, một làm xong, một còn đang đo.

**`KHUNG-6` ĐÓNG** — Đức chọn *ghi rõ giới hạn*, không siết bằng chữ ký. `MULTIFLOW.md` nay có mục
nói thẳng: bốn cơ chế chống **giẫm chân do vô ý**, KHÔNG chống **mạo danh cố ý**; cả bốn chốt quy
trách nhiệm chỉ so chuỗi. Cái hại thật nó chặn: ai đó đọc chúng như một lớp bảo mật.

**`KHUNG-30` ĐÓNG** — Đức chốt để nguyên, không nâng. Nhánh repo đích đã hết lệch (0 sau/63 trước)
nhưng luật *Cloud Sync Hold* của chính nó vẫn chặn, và phiên ở đó **DỪNG đúng luật** — hành vi ĐÚNG.

**Phép kiểm 32 → 25, bằng GỘP chứ không xoá.** Xếp hạng xong thì thấy không cần xoá cái nào: sáu
cặp trả lời **cùng một câu hỏi** bằng hai mục riêng — trùng ở lớp BÁO CÁO, không phải hai lớp bảo vệ.
Cổng phiên **16 → 12** (ai đứng tên · vùng chỉ-thêm · HANDOFF · ngân sách). Dãy B **16 → 13** (B8
nuốt B13 và nay nhận CẢ danh sách artifact đọc từ cấu hình; B2 nuốt B5+B7). Bất biến của hàm gộp:
**một con đỏ thì cả mục ĐỎ**, và lời nhắn nêu đích danh phép đo con — đã kiểm trên hai mục đỏ thật.
**Cái mất, nói thẳng:** danh sách chặn nay bật/tắt được cả cụm B2, không bật riêng B5/B7.

**Ba phép ghim gãy vì việc gộp, và cả ba gãy cùng một lý do:** chúng khoá vào **cú pháp đăng ký**
(`check("<tên mục>"`) chứ không vào hành vi. Đúng bài học `KHUNG-47`. Đã neo lại vào tên hàm, và
thêm một vế *"mất đối tượng đo"* để lần sau đổi cách viết thì nó ĐỎ chứ không xanh rỗng.

**Kho chữ:** trả giá cho mục `KHUNG-6` mới thêm bằng cách dọn `HOA-GIAI-BO-KHUNG-VS-TIEU-THU.md` —
hàng đợi 3 việc **đã đóng cả 3**, bảng số đo ở bản 1.3.19 (nay 1.3.9x) đã bỏ, giữ lại KẾT LUẬN. Và
**hai hàng sai**: nó ghi `handoffCapFrom`/`tran_byte_moi_muc` là *"bộ khung KHÔNG lấy"* — sai từ khi
ADR-0011 vào; `canDayTruocKhiTra` ghi *"nhận sau"* — đã nhận 07/09. Kho chữ giữ **3.185/3.185**.

**Còn chờ Đức:** ngân sách tài liệu (3.602/2.200) — anh muốn xem bản xếp hạng trước khi quyết.
`KHUNG-37` (giết tiến trình nền, 22 tiến trình `node`, cũ nhất 10,1h) · `KHUNG-14` (mở một phiên AI
ở repo đã migrate) · `KHUNG-40` (số đã đo lại, chờ anh đặt trần).

### 2026-09-09 (12) · harness-loi-01 · RULE COMPILER V1 đủ vòng đời + CONTEXT COMPILER

**Đức giao quyền lead, không dừng hỏi.** Chốt thiết kế V1: `append → merge → supersede → trim →
compile`, rồi gắn vào Context Compiler. Nay đủ **năm lệnh**:

| Lệnh | Bước | Làm gì |
|---|---|---|
| `--so-cai` | append | 35 quyết định từng ghi: **30 sống · 5 đã cắt** |
| `--de-xuat` | merge | nêu ADR chưa khai quan hệ với đầu mối |
| (frontmatter) | supersede | `sua:` · `bo_sung:` · `thuoc:` — khai báo, không suy diễn |
| `--trim` | trim | **chỉ cắt thứ ĐÃ KHAI**; chưa khai thì NÊU kèm bằng chứng |
| `--nap` | compile | **CONTEXT COMPILER** |

**Con số của `--nap`, và nó là câu trả lời cho lo ngại "tài liệu 3.602/2.200":** một phiên nạp
**284/300 dòng** (`AGENTS.md` + 40 dòng cuối `HANDOFF.md`). Phần **KHÔNG nạp: 4.499 dòng** trong
39 file `docs/`. Tức **6% nạp, 94% để dành** — kho tài liệu không phải chi phí ngữ cảnh, nó là
thư viện tra cứu. Thứ phải giữ nhỏ là **phần NẠP**, và nó đang trong trần.

**BÀI HỌC ĐẮT NHẤT CỦA CẢ BỘ — ba lượt bắt oan liên tiếp.** `--trim` bản đầu đề xuất cắt theo tín
hiệu *"mục chỉ còn nhắc mã việc đã đóng"*, và cả ba lần đều sai: ⑴ *Trần sổ nợ giữ 25* — trần vẫn
đang cưỡng chế; ⑵ *Migrate là BA việc trong một* — là ĐỊNH NGHĨA đang dùng; ⑶ *Cơ chế suite song
song…* — chứa nguyên tắc *mọi cơ chế phải có một mục trong `features.json`*, mà tôi vừa áp lại
sáng nay. **Kết luận: một mục sổ quyết định thường chứa CẢ bản ghi việc đã xong LẪN một nguyên
tắc đang sống — nên không tín hiệu máy nào cắt an toàn được.** Máy nay chỉ cắt thứ đã KHAI.

**Ghim:** `tests/rule-compiler.mjs` **8 → 10 vế**, **8 đột biến đã chạy, HAI cái sống sót lượt
đầu** — và cả hai cùng một bệnh fixture: cái đầu đặt đầu mối trùng luôn là mã nhỏ nhất; cái sau
dựng `docs/adr/` nhưng để RỖNG nên vế *"trỏ tới ADR sống thì giữ"* không bao giờ chạy tới.

**Đã cắt thật 1 mục** (`KHUNG-23 đã THI HÀNH`, 37 dòng) sang `docs/archive/DECISIONS-da-thi-hanh-2026-09.md`,
đối chiếu byte 0 dòng mất. Sổ quyết định **31 → 30**. Bản **1.3.98**.

### 2026-09-09 (13) · harness-loi-01 · Cổng cấu trúc đã CHẾT trong fixture cả ngày — không ai thấy

**Lỗ này HANDOFF đã ghi là "chưa có phép kiểm", và hôm nay nó cắn thật.**

Sáng nay tôi thêm `import ... from "./rule-compiler.mjs"` vào `check-bootstrap.mjs`. **Năm chỗ**
trong `tests/` chép một DANH SÁCH SCRIPT GÕ TAY sang thư mục tạm, và không chỗ nào có file đó.
Kết quả: trong mọi fixture, `check-bootstrap.mjs` chết ngay lúc NẠP với `ERR_MODULE_NOT_FOUND` —
tức **cổng kiểm cấu trúc đã chết trong fixture suốt cả ngày** — và **toàn bộ 22 suite vẫn XANH**,
vì không vế nào đòi cổng đó phải CHẠY ĐƯỢC.

**Một lớp bảo vệ không bao giờ đỏ VÌ NÓ KHÔNG BAO GIỜ CHẠY** là hình dạng lỗi tệ nhất ở repo này,
và nó không bao giờ tự lộ ra.

**Chữa ở GỐC, không ở chỗ đỏ:** bỏ danh sách gõ tay ở cả **5 chỗ**, chép cả thư mục `scripts/`.
Lớp lỗi biến mất theo cấu trúc, không cần ai nhớ.

**Ghim `F22`** — cấm gõ tay danh sách script trong fixture. Đo hai hình dạng: dùng ngay tại chỗ,
và **đặt tên rồi dùng ở dòng khác** (hình dạng thứ hai làm đột biến SỐNG SÓT lượt đầu — cửa sổ
ngữ cảnh 200 ký tự không với tới `copyFileSync`). Và nó từng báo oan `khoa-dau-vet.mjs`, nơi mảng
đó dùng để QUÉT MÃ NGUỒN chứ không chép — đã thu hẹp về đúng ngữ cảnh `copyFileSync`.

Bản **1.4.1**.

### 2026-09-09 (14) · harness-loi-01 · Context Compiler có RĂNG + ADR-0015

**Gắn `--nap` vào cổng đóng phiên**, gộp vào mục *"Ngân sách trong trần"* — **không** thành mục
thứ 26, vì thêm một phép kiểm để cưỡng chế luật chống-phình thì tự mâu thuẫn. Số phép kiểm vẫn
**25**. Ghim ca ĐỎ THẬT: `cong-do-that` vế 14 — hạ trần xuống 2 thì cổng ĐỎ kèm mã
`PHAN_NAP_VUOT_TRAN`, trả trần về thì XANH lại (cửa ra phải mở, không thì người ta tháo cổng).

**ADR-0015** ghi hai thứ ADR-0014 chưa có: ⑴ Context Compiler và số đo **6% nạp**; ⑵ **máy KHÔNG
được tự cắt luật** — ba lượt bắt oan liên tiếp chứng minh một mục sổ quyết định thường chứa CẢ
bản ghi việc đã xong LẪN một nguyên tắc đang sống.

Bản **1.4.3**. Bộ luật: **16 ADR · 6 chủ đề · 0 vi phạm**.
