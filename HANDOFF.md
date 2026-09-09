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
<!-- HANDOFF-THANG: 2026-09 -->

### 2026-09-09 (15) · harness-loi-01 · TÁI KIẾN TRÚC token nạp: 13.800 → 5.660

**Đức chốt:** giảm token mỗi phiên xuống **4.000–6.000**. Đo trước khi động: `AGENTS.md`
**~13.799 token**, và **mục 6 một mình chiếm 10.029 — 73%**. Luật thật (mục 0–5, 7, 8) chỉ 3.770.
**Luật đã vừa khổ; thứ ăn hết là BẢNG TRA.**

**Việc làm:** tách bảng tra làm hai. `AGENTS.md` giữ **16 cửa vào** (chỉ mục mỏng, kèm mọi liên
kết vì B6 đi theo liên kết); **43 mục còn lại** kèm trọn văn xuôi sang `docs/BAN-DO-CHI-TIET.md`,
và `.repo-structure.json` khai nó là **bản đồ chính thức** (`docs.file_map`) — nên cổng *"File mới
đã khai"* đối chiếu với bản ĐẦY ĐỦ.

**Số:** `AGENTS.md` **13.799 → 4.907 token** (244 → 202 dòng). Phần nạp mỗi phiên
**~5.660/6.000 — ĐẠT**. Đối chiếu độc lập: **0 file rơi khỏi bản đồ** (67 liên kết trước, 68 sau).

**Phép đo cũng phải sửa, và đây là chỗ đáng nhớ:** `--nap` trước đo **DÒNG** và báo `284/300 —
ĐẠT` trong khi thực tế là 13.800 token. Đếm dòng là đo một đại lượng **không liên quan tới cái
đang tốn tiền**. Nay ba chỗ (`--nap` · cổng · `can-nang`) dùng chung `napContext` và đo bằng
**token**; ngân sách đổi từ `docBatBuoc` (dòng) sang `tokenNap` (token).

**Ba lỗi tự gây trong lượt này, ghi vì cả ba sẽ lặp:** ⑴ `split("|")` làm mất nửa sau mọi ô có
pipe thoát `\|` → **5 file rơi khỏi bản đồ**, phải làm lại từ HEAD bằng bộ tách đúng; ⑵ chọn hàng
giữ lại **theo chỉ số** → lệch 2 và giữ nhầm gần hết, mất cả `decisions.md`/`MULTIFLOW`/`LEGEND` —
đổi sang chọn theo TỪ KHOÁ; ⑶ `sed` thay hàng loạt `datTran(2)` làm **hỏng vế 10** của
`cong-do-that` (ca ĐỎ biến thành ca XANH) — đã khôi phục và đọc lại cả khối.

**Thước kho chữ NỚI 3.173 → 3.427**, lần duy nhất trong ngày, và có lý do: ta **đổi 10k token ra
khỏi đường nạp** vào thư viện tra cứu. Từ đây lại CHỈ ĐƯỢC SIẾT.

Bản **1.5.0**.

### 2026-09-09 (16) · harness-loi-01 · HIẾN PHÁP MỎNG: nạp mỗi phiên 5.804 → 3.943 token

**Đức chốt ba điều:** ⑴ *"mục tiêu không phải đạt ngưỡng, mà phải nhỏ hơn ngưỡng margin là
30-40%"* · ⑵ *"mục 1 đổi từ 'đọc cuối HANDOFF.md' sang 'đọc STATUS.md'"* · ⑶ uỷ quyền thường
trực cho AI tự nén và tái kiến trúc luật.

**Chẩn đoán:** lượt trước cắt bảng tra (73% token). Thứ thừa lần này **không phải bảng** mà là
**LÝ LẼ** — mỗi luật mang theo sự cố sinh ra nó, và sự cố chỉ cần đọc **một lần trong đời**.

**Việc làm — KHÔNG xoá luật nào, chỉ ĐỔI CHỖ, mỗi thứ có nhà đã khai trong bản đồ:**
lý lẽ · số đo · sự cố → `docs/VI-SAO-LUAT.md` (mới) · ba luật cơ chế khoá mà `claim.mjs` **tự
chặn và tự nêu tên khoá thiếu** → `MULTIFLOW.md` · cách lắp repo mới → `README.md`. Tiêu chí
chia **không phải độ dài mà là**: *luật nào máy KHÔNG chặn được thì ở lại Tầng 1*.

**Số:** `AGENTS.md` **4.907 → 3.386** · TRẠNG THÁI **897 → 557** (đuôi `HANDOFF` → `STATUS.md`)
· **tổng nạp 5.804 → 3.943/4.200 — ĐẠT**. So mốc đầu 13.799: **giảm 71%**. `budget.tokenNap`
siết **6.000 → 4.200**, tức **vạch biên 30%** dưới trần thật, để cổng ĐỎ **sớm**.

**AUDIT ĐỘC LẬP CODEX — và đây là phần đáng nhớ nhất của lượt.** Codex đọc diff (sandbox của nó
không đọc được repo, phải đưa nội dung qua stdin) và nêu **bốn chỗ luật bị LÀM YẾU**. Kiểm lại
từng cái: **cả bốn đúng**, đã trả lại nguyên văn — ⑴ mục 0 mất lệnh đọc luật của VÙNG sắp đụng ·
⑵ năm câu thu hẹp còn "thêm một luật", mất *"phép kiểm hay tài liệu"* · ⑶ mất QUYỀN *"vai nào
cũng được tìm lỗi ở bất kỳ đâu"* · ⑷ mất mệnh lệnh *"viết lại đơn giản hơn"*.
**Bài học: nén văn xuôi làm RỤNG MỆNH LỆNH PHỤ, và người nén không thấy vì họ vẫn nhớ câu gốc.**
Ghi cạnh dấu vân tay trong `build-template.mjs` để lượt nén sau đọc trước khi cắt.

Codex cũng bắt hai chỗ trùng/mâu thuẫn, đã sửa: `VI-SAO-LUAT.md` tự nhận *"không phát biểu
luật"* trong khi năm câu chính là luật → nói thẳng nó có ĐÚNG MỘT luật và là nhà duy nhất ·
số đo 22 giây/9 phút nằm hai chỗ → **một con số một chỗ**. Và ADR-0015 còn dạy *"TRẠNG THÁI =
phần cuối HANDOFF"* → **ADR-0016** khai `sua: 0015`.

**Ba lỗi tự gây, ghi vì sẽ lặp:** ⑴ heredoc bash chết giữa chừng với văn bản dài có rào ```` ``` ````
— đổi sang công cụ ghi file · ⑵ `last_verified_commit` viết băm 7 ký tự, B2 đòi 40 — và nó đọc
từ **HEAD**, nên sửa trên đĩa không đủ, phải commit rồi mới kiểm lại · ⑶ dấu vân tay luật chung
phải cập nhật **hai lần** vì tôi sửa `AGENTS.md` sau khi đã chốt băm.

**Bản trích nay mang `docs/VI-SAO-LUAT.md`** (hạt giống khung rỗng): hiến pháp trỏ tới nó ở hai
chỗ, và phép kiểm *"luật trỏ tới file bản trích không mang"* bắt đúng chỗ đó.

Bản **1.6.0**. `npm test` **22/22 xanh**. Bộ luật: **17 ADR · 6 chủ đề · 0 vi phạm**.

### 2026-09-09 (17) · harness-loi-01 · ĐÍNH CHÍNH số nạp cuối: 3.943 → 4.002

Mục (16) và [ADR-0016](docs/adr/0016-hien-phap-mong.md) ghi **3.943 token** — đúng **lúc chốt**,
sai **lúc đóng**: sau đó tôi còn ghim thêm luật *GOM COMMIT* vào mục 0b, tốn **59 token**.

**Số cuối, đo trên HEAD:** `AGENTS.md` **3.432** · `STATUS.md` **570** · **tổng nạp 4.002/4.200**.
So mốc đầu ngày (14.696): **giảm 73%**. So trần thật 6.000 của Đức: **thấp hơn 33%**.

**Không sửa đè lên hai chỗ kia, và đây là lý do đáng ghi:** thân ADR đã `Accepted` là bất biến
(B12 chặn), `HANDOFF.md` là sổ CHỈ-THÊM. Sửa đè để con số đẹp lên chính là *"làm yếu lớp bảo vệ
đã có"* — luật vàng 3. Sổ chỉ-thêm đính chính bằng cách **thêm**, không bằng cách tẩy.

### 2026-09-09 · codex-audit-architecture · Audit độc lập kiến trúc Harness 1.6.0

Audit mã tại `1b3dee8bca0c8bc2a1c3037cef047350f1d0703d`; HEAD sau đó `d15da7fc` chỉ đổi claims, sổ và dashboard. Không sửa code, luật hoặc proposal. `npm test` chạy trong clone cô lập: **22/22 pass, 602 giây**. Bộ trích: **61 file khớp**; Rule Compiler: **17 ADR, 6 chủ đề, 0 vi phạm**. Đây không phải chứng nhận cổng cuối của cây dùng chung hay các repo tiêu thụ.

**P1, đã tái hiện:** `scripts/chay-test.mjs:54` băm trạng thái/tên file, không băm nội dung: file đã bẩn đổi A sang B vẫn được `xetDau` chấp nhận. `scripts/safe-push.mjs:262` dùng dấu SUITE làm bằng chứng CỔNG: fixture chỉ chạy suite, không có session-check, vẫn tự cho carry commit lane khác trong dry-run (exit 0). Không đẩy fixture ra ngoài máy.

**Nợ còn sống qua đọc code:** KHUNG-51: test sửa ledger ngay cây nguồn; KHUNG-53: khoá FILE chưa nối đầy đủ vào cổng. **P2:** init không ghi pin, nên file máy đổi ở bản sau thành CHƯA GHIM (đã thử builder + upgrade planner); thứ tự đóng ở AGENTS 0b và mở phiên ở docs/SO-TAY-AGENT còn mâu thuẫn.

**Verdict:** giữ kiến trúc, bảo trì có mục tiêu; chưa chứng nhận ổn định để nhân rộng mặc định. Ưu tiên tính đúng bằng chứng suite/cổng và cô lập mutation test; nối hết đường khoá file, init/upgrade. Không thêm Context Router. Không suy ổn định downstream từ số suite xanh. Chi tiết/ca phản chứng trong báo cáo audit gửi Đức; chờ Đức quyết thứ tự giao sửa, audit này không implement.

### 2026-09-09 (18) · harness-loi-01 · BẢN TRÍCH cũng nén: repo đích nạp 5.634 → 4.119 token

**Lỗ tìm ra khi Đức hỏi "đã sẵn sàng migrate chưa".** Đo thử thứ một repo ĐÍCH thật sự nhận:
`template/AGENTS.md` **5.225 token — NẶNG HƠN bản nhà (3.432)**. Nguyên nhân: **mục 6 của bản
trích 2.193 token, 42%** — đúng căn bệnh vừa chữa ở nhà, còn nguyên trong thứ đi migrate.

**Việc làm:** áp cùng kiến trúc cho hạt giống. Mục 6 của bản trích còn **10 cửa mỏng**; **18 mục
văn xuôi** sang hạt giống `docs/BAN-DO-CHI-TIET.md`, và `.repo-structure.json` hạt giống nay khai
`docs.file_map` trỏ vào đó — nên repo mới dựng lên là **đã đúng kiến trúc ngay từ commit đầu**,
không phải chờ ai nén hộ.

**Hàng phụ lục nghề CỐ Ý ở lại `AGENTS.md`:** `init-repo.mjs` xoá dòng trỏ tới phụ lục khi người
dựng không giữ nó, và nó **chỉ soi `AGENTS.md`**. Để hàng đó ở hai chỗ là để lại một liên kết chết
ở repo vừa dựng — ấn tượng đầu tiên tệ nhất có thể.

**Số:** `template/AGENTS.md` **5.225 → 3.710** · nạp mỗi phiên ở repo đích **5.634 → 4.119**.
Dấu vân tay luật chung **KHÔNG đổi** — mục 6 vốn không thuộc phần luật chung, đúng như thiết kế.

**Đính chính đã ghi bằng cách THÊM** (mục 17): số nạp cuối của repo nhà là **4.002**, không phải
3.943. Thân ADR đã `Accepted` bất biến (B12), sổ chỉ-thêm đính chính bằng cách thêm.

Bản **1.7.0**.

### 2026-09-09 · codex-harness-hooks · Vá tối thiểu bằng chứng suite/cổng

Đức giao trực tiếp sửa Ark, giữ rules, flow compile và trần context. Phạm vi: băm nội dung/index thay vì tên file; cổng xanh thật mới cấp bằng chứng cho tự carry; suite/cổng kiểm cây trước và sau lượt chạy; upgrade-smoke đột biến trong clone riêng. Không đổi luật hay thêm bước vận hành. Test mục tiêu: **14/14 xanh**, gồm đường suite → cổng → safe-push qua remote Git cục bộ và các ca cây đổi giữa lượt. Đang chờ audit độc lập, sinh bản trích và suite cuối; chưa nghiệm thu, chưa push.

### 2026-09-09 · codex-harness-hooks · Audit PASS, chuẩn bị bản 1.7.1

Auditor độc lập nghiệm thu mã `e46492a`: **PASS**, tự chạy dấu/cổng **14/14**, upgrade **24/24**, template-null **9/9**; bản thử trong clone khớp **62 file**. Tôi thử ba đột biến (bỏ băm nội dung, dùng dấu suite thay cổng, bỏ so cây trước/sau): cả ba bị ca hành vi bắt. Khi chạy upgrade, **3.117 lần đọc ledger nguồn mỗi 50 ms**, không lần nào thấy nội dung đổi. Bản 1.7.1 giữ nguyên luật, flow compile, trần context và số mục cổng. Suite/cổng cuối là bước sau commit và sinh artifact; chưa tuyên bố đã xanh ở đây.

### 2026-09-09 (19) · harness-loi-01 · SOÁT BỐN TÍNH NĂNG QUA MIGRATE — vá ba lỗ ở hạt giống

**Đức chốt bốn thứ PHẢI sống sót khi migrate:** hai vai AI · khoá mức FILE · bộ nén + giao thức
nén context · khả năng audit và đưa repo đích lên chuẩn. Tôi soát bằng cách **đọc chính
`template/`**, không tin trí nhớ. Hai cái đầu ĐỦ. Hai cái sau lộ **ba lỗ**:

**⒜ Bộ nén ship ở trạng thái TẮT.** `template/.repo-structure.json` **không khai một ngân sách
nào** — không `budget.tokenNap`, không `backlog.tran`, không `docs.tran_dong_khong_ke_adr`. Repo
đích nhận đủ `rule-compiler.mjs` + `can-nang.mjs`, nhưng cổng báo *"chưa khai thước thì không
đo"* **và vẫn XANH**. Đây là hình dạng nguy hiểm nhất: máy có, luật có, mà **không có gì bị canh**.
Nay hạt giống khai sẵn `tokenNap 6000` · `backlog.tran 25` · `docs 2200`.

**⒝ Luật của bản trích nói SAI về chính bản trích.** Mục 8 viết *"Bộ khung KHÔNG mang công cụ
đo"* — sai từ lúc `can-nang.mjs` thành portable: bản trích mang cả nó lẫn `npm run can-nang`.
Một phiên đọc luật đó sẽ **không bao giờ đi đo**. Nay mục 8 đưa thẳng hai lệnh.

**⒞ Mục 6 mỏng không có cửa nào cho việc ĐO.** Thêm một hàng.

**Số ở repo đích:** nạp **4.207 / 6.000 token — biên 30%**, đúng nguyên tắc *không nhắm đạt
ngưỡng, phải ở dưới ngưỡng 30–40%*. Trước lượt tách hạt giống: 5.634.

**Kiểm chứng độc lập bản 1.7.1 của Codex — cả ba điểm ĐÚNG, đã dựng lại ca hỏng:**
⑴ dấu suite cũ băm `git status --porcelain` (chỉ TÊN + trạng thái), nên **file đã bẩn rồi sửa
tiếp thì băm KHÔNG đổi** — tôi dựng lại ca đó và xác nhận: băm cũ *không đổi*, băm mới *đổi*.
⑵ `safe-push` trước đọc **dấu SUITE** để tự `--carry`, trong khi luật mục 2 đòi **cổng XANH TOÀN
BỘ** — suite xanh ≠ cổng xanh, tức code nới hơn luật; nay có dấu cổng riêng, buộc theo `--as` và
mốc remote. Gọi thẳng `xetDauCong(null, …)` và `xetDauCong({loai:"suite"}, …)`: **cả hai từ chối**.
⑶ test phá sổ phát hành nay chạy trong bản sao git riêng, không chạm cây làm việc chung.

Bản **1.7.2**.

### 2026-09-09 (20) · harness-loi-01 · KÉO LỚP BẢO VỆ VỀ NHÀ trước khi migrate — bản 1.8.0

**Đức giao migrate `Chrome_Extension_AI_Agentic` từ mốc 1.7.2, kèm: xem bên đó hơn/kém gì.**
Audit xong thì **không migrate được ngay**, và lý do đáng ghi.

**Repo đó KHÔNG cũ hơn ta — nó lệch CẢ HAI CHIỀU.** Họ thiếu 22 file · 10 lệnh (toàn bộ bộ nén,
`STATUS.md`, `VI-SAO-LUAT`, `BAN-DO-CHI-TIET`, ngân sách). Nhưng họ **có dấu niêm phong
`.agents/claims.json`** — thứ cưỡng chế đúng câu luật mục 1 của ta mà **ta viết ra và chưa bao
giờ kiểm**. `--force` là xoá lớp bảo vệ đó khỏi chính repo phát minh ra nó.

**Hai đường đều hỏng, đo được:** ⑴ `--force` ghi đè 14 file máy của họ. ⑵ Chỉ thả file còn thiếu
cũng hỏng — `can-nang.mjs` nhập `THU_MUC_DOCS_KHONG_TINH` mà `repo-structure.mjs` bản của họ
**không xuất**, nên bộ nén hạ cánh ở trạng thái GÃY. `upgrade.mjs` từ chối là ĐÚNG, không phải kẹt.

**ĐÍNH CHÍNH SỐ CỦA CHÍNH TÔI:** tôi báo Đức *"họ hơn ta 11 năng lực"* — đó là đếm theo **TÊN
HÀM**. Soát lại theo **NĂNG LỰC** thì `DAU_VET`, trần HANDOFF, kiểm artifact theo HEAD, cắt kho
nhật ký… ta đều đã có dưới tên khác. Thật sự thiếu **MỘT**. **Đếm tên không phải đếm năng lực** —
và tôi suýt bỏ nửa ngày chép về những thứ đã có.

**Đã kéo về:** ghi nguyên tử + dấu niêm phong + `--restamp` không-phải-cửa-sau (đối chiếu HEAD,
đòi `--duc-duyet` khi CHUYỂN CHỦ, ghi câu chốt VÀO bảng). Cổng gộp vào mục *"Ai đứng tên việc
này"* — không thành mục thứ 26. Ghim: `khoa-file` **8 → 12 vế**, mỗi vế có ca ĐỎ dựng được.

**Đo tại chỗ:** đóng dấu → sửa tay `_docs.owner` → `--list` thoát **mã 3** kèm `DAU_VO`; trả nội
dung về → dấu nguyên trở lại, mã 0.

Bản **1.8.0**. ADR-0017. Còn nợ: `handoffSoMucCapFrom` và **ONE LOADING LAW** của họ.

### 2026-09-09 (21) · harness-loi-02 · Cổng thôi đòi khoá VÙNG — và một thước bị lane khác làm đỏ

**Số:** `ROADMAP-V2.md` **108 → 97 dòng** (cắt 71 dòng lịch sử đã có nhà ở `CHANGELOG` +
`docs/archive/`; thêm thứ tự bốn đợt) · `IDEAS.md` +2 mục (`Y-12` ONE LOADING LAW · `Y-13`
**bác** trần thứ ba cho HANDOFF) · `cong-do-that.mjs` **14 khối, 0 đỏ**, khối 1 từ 1 → **3 vế**,
khối 7 → **4 vế**.

**KHUNG-53 — bản vá có trong HEAD, MỤC VẪN MỞ.** Cổng hỏi *"ai đứng tên"* trong bảng khoá VÙNG,
mà từ 08/09 khoá vùng trả ngay sau commit — nên phiên làm đúng luật mới bị ĐỎ. Nay nhãn `Lane:`
của **chính phiên đang hỏi** cũng là câu trả lời, y như nhãn người khác. **Nửa mục nợ chưa nêu:**
`rootSuite` cũng suy từ `myRootAreas`, nên *"Test xanh"* rơi vào **BỎ** — vá luôn, và đó là vế
SIẾT LẠI: trước bản này, phiên chỉ dùng khoá file thoát cả *Test xanh*, *ghi Log*, và *vùng
chỉ-thêm* trong im lặng.

**Ba đột biến trên bản chép cách ly, mỗi lượt revert một dòng, mỗi lượt ĐỎ đúng vế của nó:** bỏ
nhãn khỏi `myRootAreas` → 7(d) *"suite PHẢI chạy, đang BỎ"* · chỉ miễn nhãn người khác → 1⑴
*"ĐỎ, chưa ai đứng tên _docs"* · coi commit KHÔNG NHÃN là quy thuộc → 1⑶ *"đường lách, XANH"*.

**CHƯA XONG, không phải vì code:** Codex **hết lượt tới 10/09 01:25** → bản vá lõi chưa qua audit
độc lập. Mục 5 cấm tự ký nghiệm thu, nên `KHUNG-53` để MỞ và **chưa đẩy**. Phiên sau: đừng
`--carry` commit này trước khi có audit.

**KHUNG-15 kiểm chứng, không sửa:** nửa *"liệt kê toàn dòng ok"* đã đóng nhờ `KHUNG-52`. Nửa còn
lại **không đo được** — sổ cổng chỉ lưu TÊN phép kiểm: *"Test xanh"* ĐỎ **68/260 lượt** mà không
lượt nào truy được là đỏ thật hay đỏ oan.

**Còn mở → `KHUNG-55`:** `doKhoChu` lấy danh sách từ `git ls-files` nhưng đọc nội dung từ **ĐĨA**.
HEAD **3.371** = đúng thước, đĩa **3.398**: phần thêm là `docs/briefs/MIGRATE-REPO.md` **+38** của
`harness-migrate-3repo` đang sửa dở, phần tôi là **−11**. Một lane sửa dở làm đỏ cổng lane khác.

### 2026-09-09 (21) · harness-migrate-3repo · MIGRATE BA REPO lên 1.8.0 — hai cơ chế hạ cánh ở trạng thái TẮT

| Repo | Bản khung | Nạp mỗi phiên | Mã CHẶN đỏ | Đẩy |
|---|---|---|---|---|
| `nav_platform_main` | 1.3.76 → **1.8.0** | chưa đo → **9.052/11.800** | 0 | **CHƯA** — xem dưới |
| `n8n-orchestrator` | 1.3.76 → **1.8.0** | chưa đo → **5.816/7.600** | 0 | xong, cổng XANH TOÀN BỘ |
| `n8n_Local host` | **chưa từng ghim** → 1.8.0 | chưa đo → **3.415/4.500** | 0 | xong, cổng XANH TOÀN BỘ · dãy B **0 đỏ 0 vàng** |

Cả ba **mức 1/3 → 3/3**. Bốn file cấm-đè: không file nào ngắn đi ở bất kỳ repo nào.

**MỘT BỆNH, BA REPO: `upgrade --apply` không mang được thứ nằm trong `.repo-structure.json`** —
file cố ý thuộc repo đích (`TEP_CUA_REPO_DICH`). Nên `budget.tokenNap` **chưa repo nào khai**, và
cổng báo *"chưa khai thước thì không đo"* rồi **XANH**. Bộ nén luật đã tới ba repo từ hôm nay mà
nằm không, không phép kiểm nào kể tên. Cùng họ `KHUNG-48`. `bang-song/` trong `areas` cùng gốc
bệnh nhưng ít nguy hơn vì nó **đỏ** (`B3`).

**`bootstrap.blocking` là hai ca ngược nhau, và cả hai đều sai theo hướng riêng:** `nav_platform`
khai `B5`,`B7` — bản 1.8.0 đã gộp vào `B2` — nên cổng ném `CHAN_MA_LA` và **từ chối chạy** (đúng).
`n8n-orchestrator` thì để **RỖNG suốt bốn ngày**: cổng cấu trúc không cưỡng chế gì mà không ai
nhận ra. *"Để rỗng lúc lắp"* chỉ đúng nếu có ai quay lại bật.

**Tên phiên tôi được giao có KHOẢNG TRẮNG, máy từ chối** (`LANE_CO_KHOANG_TRANG`), và
`session-check:1173` so nhãn `Lane:` với `--as`. Phát hiện **sau** commit đầu, nên
`nav_platform_main` còn một commit của tôi không nhãn. Không tự sửa lịch sử — mục 2 bắt hỏi.

**Bốn bài học 09/09 đã gấp vào `docs/briefs/MIGRATE-REPO.md`** (+52 dòng). Ba hồ sơ ở
`docs/migrations/2026-09-09-*.md`.

**Còn mở:** ⑴ `nav_platform_main` có **6 commit chưa đẩy**, 2 không nhãn `Lane:` (1 của lane
trước, 1 của tôi) — chỉ Đức gỡ được bằng `--carry`. ⑵ `build-overview.mjs` **treo >300s** ở
`n8n_Local host` (đường dẫn có dấu cách) — chưa ghi được vào `BACKLOG.md` vì lane `harness-loi-02`
đang giữ khoá file đó.

### 2026-09-09 (22) · harness-migrate-3repo · TÔI COMMIT NHẦM VIỆC ĐANG DỞ CỦA LANE KHÁC — và cách hoàn nguyên không cần sửa lịch sử

Commit `69e0a84` cuốn theo `scripts/build-dashboard.mjs` và `scripts/repo-structure.mjs` — **bản
đang sửa dở của lane `harness-loi-02`**. Nguyên nhân đúng một dòng: tôi chạy `git add -A` **rồi
mới** đọc `claim.mjs --soat`. `--soat` đã nói thẳng *"2 file bạn KHÔNG có quyền ghi"*, nhưng tôi
nối nó vào một chuỗi `&&` sau `tail -2` — nên **mã thoát của nó bị `tail` nuốt** và `git commit`
vẫn chạy. Lỗi ở cách tôi gọi, không ở công cụ.

**Cách hoàn nguyên, không đụng lịch sử** (`AGENTS.md` mục 2 bắt hỏi trước khi sửa lịch sử):

```bash
git checkout <HEAD-trước> -- <hai file>     # đưa NỘI DUNG về bản cũ, bằng một commit mới
git commit                                  # 75449ff
git restore --source=69e0a84 --worktree -- <hai file>   # trả bản của họ về CÂY LÀM VIỆC
```

Kết quả đo được: `git diff 69e0a84 -- <hai file>` → **0 dòng** (cây làm việc khớp đúng bản họ
đang sửa) và `git diff dcb4e4a HEAD -- scripts/` → **0 dòng** (HEAD về đúng trước lúc tôi phạm
lỗi). Họ **không mất một dòng nào**, và bản của họ còn nguyên trong lịch sử ở `69e0a84`.

**Rút ra, và nó đáng thành luật:** `--soat` là **CỔNG**, không phải bản in. Chạy nó **trước**
`git add`, đọc bằng mắt, và **đừng bao giờ** nối nó qua `tail`/`head` trong một chuỗi `&&` — làm
thế là tự tay tắt đúng cái phép kiểm mình vừa gọi.

**Còn mở:** cây làm việc repo nhà đang giữ 4 file sửa dở của `harness-loi-02` — **không đụng**.

### 2026-09-10 (22) · harness-loi-02 · `KHUNG-15` có gốc: dấu băm cả bảng quyền — bản 1.8.2

**Đức chỉ ra 90 phút là quá dài và yêu cầu đo.** Số tự tố cáo cơ chế:

| Lượt | Thời gian | Suite | Dấu | Cổng nói |
|---|---|---|---|---|
| `npm test` #1 | 514.8s | 22/22 xanh | không ghi được | — |
| `npm test` #2 | 524.2s | 22/22 xanh | không ghi được | — |
| cổng | 702s | 22/22 xanh | không ghi được | **"suite gốc repo ĐỎ"** |
| | **29 phút** | **0 đỏ** | **0 dấu** | **1 kết luận sai** |

**Gốc, hai lớp:** ⑴ `dauCay()` băm `.agents/claims.json` — file bị MỌI lane ghi lại mỗi lượt
`--sua`/`--xong`, nên repo hai lane thì dấu **không bao giờ ghi được**. ⑵ `chay-test.mjs` trả mã 2
khi thiếu dấu dù suite xanh; cổng thấy mã ≠ 0 rồi báo *"không đọc được TÊN suite đỏ"* — không đọc
được vì **không có suite nào đỏ**. *Chập chờn* của `KHUNG-15` giải thích xong: phụ thuộc lane khác
có gõ trong cửa sổ ~9 phút hay không.

**ĐÍNH CHÍNH CHÍNH TÔI:** lượt (21) tôi ghi nửa này *"không đo được vì sổ cổng chỉ lưu tên phép
kiểm"*. Sai — chỉ cần bắt lượt đỏ lúc nó đang xảy ra, và nó tới ngay phiên sau. Đã sửa `KHUNG-15`.

**Tôi ĐỔI Ý giữa đường, lý do đáng ghi:** đã hứa với Đức *"cho `TREE_CHANGED` thoát mã 0"*. Đọc
`dau-suite-smoke.mjs` thì **hai vế đã ghim đúng hành vi đó** — cây đổi giữa lượt thì KHÔNG được cấp
dấu, và đó là chủ ý ĐÚNG. Làm theo lời hứa của tôi là **xoá một lớp bảo vệ**. Vá hẹp lại: sửa BĂM
(bỏ file hành chính), không sửa mã thoát; cộng sửa **LỜI** của cổng.

**Một nhà cho một khái niệm:** `FILE_HANH_CHINH` vào `repo-structure.mjs`, dùng chung bởi
`build-dashboard` và `chay-test`. Repo ghim ý này từ 06/09 (`isBehaviourFile` = false) — chỉ bộ
chạy suite chưa hề nghe.

**Ghim:** `dau-suite-smoke.mjs` **14 → 16 vế**. Ba đột biến, mỗi lượt ĐỎ đúng vế của nó, kể cả
hướng **fail-OPEN**.

**Bản 1.8.2, đã vào bản trích** — cả 4 file kèm phép ghim. `KHUNG-15` + `KHUNG-53` **chờ audit độc
lập** (Codex hết lượt tới 01:25), nên **chưa đẩy**.

### 2026-09-10 (23) · harness-loi-02 · Lời cảnh báo của tôi bị vượt sau 20 phút — `KHUNG-56`

**Cổng lượt này XANH cả 12 mục** (Test xanh: 22/22 trong 528.8s · kho chữ 3371/3371 · nạp
4055/4200). Không ghi được dấu cổng: **mốc remote đổi giữa lượt** — và đó chính là chuyện phải ghi.

**5 commit của tôi ĐÃ LÊN `origin/main`, do lane khác `safe-push` cuốn theo:** `a33166d` ·
`1cb9011` · `f711bed` · `b4f8b6c` · `020f971` — tức bản **1.8.1 + 1.8.2**, gồm cả bản vá
`session-check.mjs` / `chay-test.mjs` / `repo-structure.mjs` **CHƯA qua audit độc lập**.

Lượt (21) và (22) tôi ghi đúng câu *"đừng `--carry` commit này trước khi có audit"*. Nó nằm trong
`HANDOFF.md` — **Tầng 2, không nạp mặc định**. Lane `harness-migrate-3repo` **không làm gì sai**:
cổng của họ xanh, mọi commit mang nhãn `Lane:` quy thuộc được — đủ đúng ba điều kiện mà **máy**
biết kiểm. Vế *"đã qua audit độc lập"* của mục 2 **không có phép kiểm nào**.

`AGENTS.md` mục 7 tự nói: *"Luật nào không kiểm được bằng máy thì sớm muộn cũng bị bỏ qua."* Ở đây
*"sớm muộn"* = **20 phút**. Vào sổ: `KHUNG-56`, kèm hai lối vá và đối chứng ngược.

**Chưa làm, và cố ý:** không force-push, không sửa lịch sử — mục 2 đòi Đức chốt. Bản vá vẫn cần
audit, chỉ là nay nó là audit **sau khi phát** thay vì trước. Đề bài 7 câu đã soạn sẵn.

### 2026-09-10 (24) · harness-loi-02 · Audit độc lập bắt một FAIL-OPEN của chính bản vá tôi vừa phát

**Codex có lượt lúc 01:11, chạy được đề bài 7 câu. Nó tìm ra MỘT lỗi thật.**

Bản 1.8.2 nhận ra *"suite xanh"* bằng cách khớp **một dòng tổng bất kỳ**. Ở repo nhà vô hại. Nhưng
cổng **được phát đi**, và ở repo tiêu thụ `scripts.test` là runner khác — jest, vitest, script
riêng. **Đã tự dựng lại ca hỏng và đo** (luật vàng 4, không tin lời Codex): một runner in
`12 passed, 0 failed, 12 total` cho dự án 1 rồi `FAIL` dự án 2 và thoát 1, không tiêu đề `──` nào →
1.8.2 **hạ một suite ĐỎ THẬT xuống BỎ**. Hướng fail-OPEN.

**Vá 1.8.3:** cổng chỉ tin bằng chứng DƯƠNG của chính bộ chạy — hậu tố `— SUITE XANH` và không có
chuỗi `SUITE ĐỎ`. Ghim: `dau-suite-smoke` **16 → 17 vế**; đột biến trả điều kiện về nghĩa 1.8.2 →
vế mới ĐỎ. Thêm `size > 0` cho `nhanHopLe` (`[].every(Boolean)` trả `true` — fail-open, hôm nay
không tới được, và **ghi rõ là không có fixture** thay vì để lượt sau tưởng có). Xoá `rootMine` +
`rootTouched`: code chết, chỗ dùng duy nhất là `rootIsMine` không ai đọc.

**AUDIT KHÔNG KÝ NGHIỆM THU, và lý do là lỗi của TÔI trong cách giao đề.** Ba câu Codex trả lời
*"chưa đủ bằng chứng để nghiệm thu"* — vì sandbox nó không đọc được repo, nên nó chỉ thấy
`git diff`, không thấy thân các phép kiểm nó cần đọc để kết luận. **Lượt sau: nhét cả thân hàm
liên quan vào stdin, đừng chỉ nhét diff.** Hai chỗ nó nêu mà chưa dựng nổi ca hỏng → `KHUNG-58`.

**Câu 7 tôi cố ý đặt để nó soi chính tôi** — *"quyết định tự bác kế hoạch `TREE_CHANGED → exit 0`
đúng hay sai"* — Codex trả lời **đúng**: *"suite xanh không chứng minh trạng thái cuối lượt đã được
kiểm nếu cây đổi giữa chừng"*.

`KHUNG-15` và `KHUNG-53` vẫn **MỞ**. Bản 1.8.1+1.8.2 đã ở trên `origin/main` (xem lượt 23);
1.8.3 là bản sửa đè lên đó, không phải bản rút lại.

### 2026-09-10 (25) · harness-loi-02 · Vế "đã qua audit" lần đầu có máy canh — bản 1.8.4

**Đức giao: vá hết để tối ưu mới ổn và được áp dụng từ nay về sau, hook tốt.** Hook đúng chỗ ở
repo này là `safe-push`, không phải `.git/hooks` — repo chưa từng có hook git nào, và *"gate
hooks"* ở 1.7.1 là nói về dấu xác nhận.

**Đã vá `KHUNG-56`** — cái lỗ đã làm chính 5 commit của tôi lên `origin/main` khi chưa duyệt.
Nhãn `Audit:` trong commit; `safe-push` từ chối khi có commit **tự khai** `Audit: chua-co`. Nhà
của nhãn: `auditFromMessage` cạnh `laneFromMessage` trong `repo-structure.mjs`.

Bốn quyết định, mỗi cái tránh một cách hỏng đã biết: **không khai = không chặn** (chặn tuốt là
khoá repo, bẫy 509 commit cũ) · **`Audit:` rỗng = chưa duyệt** (không thì gõ rỗng là qua cửa) ·
**`--carry` KHÔNG mở được** (Đức chốt 09/09 là về *quy thuộc*, không về *duyệt* — dùng lời chốt
cho việc A để làm việc B là chỗ dễ sai nhất) · **cờ riêng `--duc-duyet-chua-audit`**.

Kèm một dòng **⚠ tự dạy** lúc sắp đẩy code mà không commit nào khai `Audit:`, không đổi mã thoát.
Nhãn không ai biết là có thì không ai gõ. **KHÔNG thêm chữ vào `AGENTS.md`** — hiến pháp nói cơ
chế nào máy tự chặn và tự giải thích thì không nằm ở đó; và kho chữ đang **3371/3371**, hết chỗ.

Ghim: `dau-suite-smoke` **17 → 18 vế**. Đột biến: gỡ cửa · cho `--carry` mở · chặn tuốt — mỗi lượt
ĐỎ đúng vế của nó.

**HAI VIỆC CỐ Ý KHÔNG LÀM, và lý do:**

· `KHUNG-58⒜` (hợp đồng dấu cho repo tiêu thụ) — **năm câu ở `VI-SAO-LUAT` câu 1 nói KHÔNG**:
  *"đã có chuyện gì xảy ra thật chưa? Chưa thì đừng thêm — viết vào BACKLOG và chờ."* Chưa repo
  nào viết suite đọc `claims.json`. Nó đã ở trong sổ, để nguyên đó.
· `KHUNG-50` (suite chạy trong worktree riêng) — đây mới là **nửa còn lại** của bài toán tốc độ,
  và nó có ca thật (3 lượt hôm nay). Nhưng nó sửa chính bộ chạy tôi vừa vá, ở cuối một phiên dài.
  Sửa lõi lúc mệt là cách 1.8.2 sinh ra lỗ fail-open. Để nguyên, ưu tiên đầu cho phiên sau.

### 2026-09-10 (26) · harness-loi-02 · Cửa audit vừa dựng TỰ CÓ hai lối fail-open — bản 1.8.5

**Audit độc lập cho 1.8.4 nói CẦN SỬA, và nó đúng.** Lần thứ hai trong một phiên, một bản vá của
tôi tự mở một lỗ mới — và cả hai lần đều là **fail-open**, cả hai lần đều do audit bắt, không do
tôi.

`auditFromMessage` bản 1.8.4 hỏi ngược chiều: *"có đúng bằng `chua-co` không? Không thì coi là tên
người duyệt."* Tôi đã **tự đo lại** ba biến thể (luật vàng 4):

| Nhãn | 1.8.4 đọc thành |
|---|---|
| `Audit: chua-co (dang cho Codex)` | **ĐÃ DUYỆT** |
| `Audit: chua co` | **ĐÃ DUYỆT** |
| `AUDIT: chua-co` | lời khai **mất im lặng** |

Ca đầu là câu **một người cẩn thận sẽ tự viết** — thêm ghi chú cho rõ, và cửa mở ra. Cơ chế mà
viết cẩn thận hơn thì mất an toàn thì không phải cơ chế an toàn.

**1.8.5 hỏi đúng chiều:** chỉ một thẻ ĐÚNG KHUÔN `^[a-z0-9][a-z0-9._-]*$` mới là "đã duyệt"; rỗng,
mở đầu `chua`, hay không đọc được → **CHƯA** kèm mã `AUDIT_KHONG_DOC_DUOC`. Khoá so không phân biệt
hoa thường.

**Ba chỗ nữa audit nêu, đã sửa:** câu *"đã gỡ lời khai cũ"* in cả khi **không gỡ được cái nào** ·
dòng ⚠ tự dạy tắt cho MỌI commit code khi chỉ MỘT commit có nhãn · đọc thông điệp commit hai lượt.

**BÀI HỌC VỀ PHÉP GHIM, và nó đắt hơn ba lỗi trên:** audit nêu rằng `doesNotMatch` một mình **xanh
được khi tiến trình chết vì lý do khác**. Tôi đã dính đúng bẫy đó **trong chính lượt viết phép
ghim này** — một vế báo xanh mà không chứng minh gì. Nay mỗi vế thành công đòi **mã thoát 0** cộng
một chuỗi **DƯƠNG**. Từ nay: *một phép ghim chỉ gồm phủ định thì nó chưa ghim gì.*

Ghim: khối `Audit:` **8 vế**. Sáu đột biến, mỗi lượt ĐỎ đúng vế của nó.

**Giới hạn audit nêu, CHƯA vá, có lý do:** commit khai tên người duyệt **không bị ràng buộc** với
khoảng commit thật sự đã soi — nó gỡ theo *thứ tự*, không theo *phạm vi*. Vá đúng cần `Y-02`. Nên
cơ chế này là *"đưa một lời tự khai tới máy"*, **KHÔNG phải** máy canh *"đã qua audit độc lập"*.
Câu đó phải giữ nguyên, đừng nói gọn thành "đã có máy canh".

### 2026-09-10 (27) · harness-loi-02 · Ba vòng audit mới tới hình dạng đúng — bản 1.8.6

**Hai vòng đầu tôi vá SAI TẦNG, và đây là bài học đáng giữ nhất của phiên này.**

| Bản | Nó hỏi gì | Cái gì lọt |
|---|---|---|
| 1.8.4 | *"có đúng bằng `chua-co`?"* | `chua-co (dang cho)` · `chua co` → **ĐÃ DUYỆT** |
| 1.8.5 | *"có đúng khuôn một thẻ?"* | `pending` · `none` · `todo` · `not-reviewed` → **ĐÃ DUYỆT** |
| 1.8.6 | *"tên này có trong danh sách repo khai?"* | — |

Tôi tự đo lại cả sáu biến thể (luật vàng 4). Mẹo `/^chua/` của 1.8.5 còn **chặn oan** `chuan`.

**Gốc bệnh không phải regex:** tôi để **người viết commit** tự định nghĩa *"đã duyệt"*. Chuỗi tự
do thì không có cách nào phân biệt `codex-r03` với `pending` — cả hai chỉ là chữ. Mỗi vòng tôi bịt
một chuỗi, vòng sau lòi ra chuỗi khác. **Vá ba lần cùng một chỗ là dấu hiệu đang vá sai tầng.**

Nay đổi CHỦ NGỮ: `.repo-structure.json` khai `audit.nguoi_duyet`, **repo** nói trước ai được duyệt,
ngoài danh sách là CHƯA. Và đây là **BỚT luật**: một phép so danh sách thay chỗ hai mẹo dò chuỗi.

**Hai chỗ nữa đã sửa:** ` Audit:` / `Audit :` bị bỏ qua → lời khai mất im lặng · **lời khuyên SAI**
của cổng (*"đẩy riêng phần còn lại"* — không làm được khi commit chưa duyệt là TỔ TIÊN; nay nói
cherry-pick sang nhánh khác).

**BÀI HỌC VỀ PHÉP GHIM:** vế từ chối chỉ kiểm `status === 1` thì **xanh cả khi chết ở cửa khác**.
Nay vế từ chối đòi đúng **thông báo của cửa audit**; vế thành công đòi mã 0 **cộng** chuỗi dương.
Cộng bài học lượt (26): *phép ghim chỉ gồm phủ định thì chưa ghim gì.*

**Giới hạn CÒN NGUYÊN, đừng nói gọn:** nhãn duyệt **không bị ràng buộc** với khoảng commit thật sự
đã soi — gỡ theo *thứ tự*, không theo *phạm vi*. Cơ chế này là *"đưa một lời tự khai tới máy"*,
**KHÔNG phải** máy canh *"đã qua audit độc lập"*. Cần `Y-02`.

**Còn mở:** `KHUNG-56` (chờ một vòng audit không tìm thêm lối fail-open) · `KHUNG-58` ·
`KHUNG-50` (worktree riêng — nửa còn lại của bài toán tốc độ, chưa làm, có lý do ở lượt 25).

### 2026-09-10 (28) · harness-loi-02 · Vòng audit 4: *"logic ĐẠT"* — bản 1.8.7, và cửa audit đóng

**Vòng 4 kết luận: *"Logic bản vá: ĐẠT. Không xác định được lỗi bắt buộc sửa ngay."*** Nó tự chạy
lại parser, báo **27/27 ca đạt kỳ vọng**, và nói thêm một câu tôi giữ nguyên vào sổ: *"Không dùng
giới hạn đó để buộc thêm một vòng vá chuỗi."*

Bản 1.8.7 làm **đúng một** việc vòng 4 nêu: `nguoiDuyetFrom` `filter` thẳng, nên repo khai `Duc`
hay `nguyen van a` thì tên đó **rơi mất không một tiếng nào** — người khai tưởng đã cấp quyền
duyệt mà chưa. Nay `safe-push` **nêu đích danh**, và **chỉ nêu, không đổi mã thoát**. Ghim vế ⑼.

**BỐN VÒNG AUDIT — hình dạng đường đi, đáng giữ hơn bản thân bản vá:**

| Vòng | Kết luận | Cái nó bắt |
|---|---|---|
| 1 | CẦN SỬA | cổng nhận *một dòng tổng bất kỳ* là suite xanh → fail-open ở repo TIÊU THỤ |
| 2 | CẦN SỬA | `chua-co (dang cho)` → **ĐÃ DUYỆT** |
| 3 | CẦN SỬA | `pending` · `none` · `todo` → **ĐÃ DUYỆT** |
| 4 | **logic ĐẠT** | một chỗ fail-silent ở cấu hình |

**Ba vòng đầu, mỗi vòng bắt một FAIL-OPEN tôi không tự thấy.** Không vòng nào thừa. Cả ba lần tôi
tự dựng lại ca hỏng trước khi tin — có hình dạng không tới được ở repo nhà nhưng tới được ở **repo
tiêu thụ**, nên vẫn là lỗi thật.

**Hai bài học về CÁCH GIAO ĐỀ, cho phiên sau:** ⑴ sandbox Codex không đọc được repo → phải nhét
cả **thân hàm**, không chỉ `git diff`; vòng 2 nó nói *"chưa đủ bằng chứng"* đúng vì tôi giao thiếu.
⑵ đặt một câu bắt nó soi **chính quyết định của tôi** — vòng 2 câu 7 hỏi *"tôi tự bác kế hoạch đã
hứa với Đức, đúng hay sai?"*, và nó trả lời **đúng**, kèm lý do tôi chưa nghĩ tới.

**Bài học về phép ghim, cộng dồn ba lượt:** vế thành công đòi **mã 0 + chuỗi dương**; vế từ chối
đòi **đúng thông báo của cửa** (mã 1 một mình không phân biệt chết ở cửa nào); *phép ghim chỉ gồm
phủ định thì chưa ghim gì*.

**Còn mở:** `KHUNG-58` · `KHUNG-50` (worktree riêng). Giới hạn đã công bố: ai cũng viết được
`Audit: codex` — danh sách kiểm **tên được phép**, không chứng minh đã duyệt. Cần `Y-02`.

### 2026-09-10 · harness-migrate-3repo · Protocol migrate: 8 → 12 bước, và một bản TRÙNG NHÀ 335 dòng về lưu trữ

**Đức chốt:** lượt migrate làm **90% từ phía repo nhà**, rồi sinh một đề bài bàn giao cho phiên AI
thường trú của repo đích làm nốt 10% + ghi lịch sử. Rà lại thì protocol **thiếu đúng hai việc anh
nêu**, grep ra 0 kết quả cho cả `features` lẫn `rule-compiler` trong brief.

**Hai bước mới:**

- **8 · Đo FEATURE, đừng đo FILE.** `assess` đếm file, `features` đếm năng lực, và hai số lệch
  thật: 09/09 ở `n8n_Local host` `assess` báo **3/3 · 0/0/0** trong khi `features-smoke` ĐỎ vì
  thiếu `F4.7`. `--apply` không mang nổi vì đó là **nội dung trong một file cấm đè**.
- **9 · Bốn thước + bàn giao phần PHÁN ĐOÁN qua SỔ.** Trước chỉ có `budget.tokenNap`; nay đủ bốn.
  Phần cơ học (khai + siết thước) lượt migrate làm hết. Phần nén luật thì **KHÔNG**, ba lý do:
  `rule-compiler.mjs` đóng `ROOT` vào repo chứa nó nên **không có `--repo`, không chạy từ xa
  được** · câu nào thừa là phán đoán về NGHỀ của họ · mục 5 cấm người sửa tự nghiệm thu.

**Giữ ngữ cảnh mà không đốt lại token:** chạy `--trim`/`--check` **tại repo đích**, dán nguyên
kết quả vào `BACKLOG.md` của họ kèm `đóng khi:`. Ngữ cảnh nằm trong **SỔ**, không nằm trong cửa
sổ chat. Bước **12** sinh đề bài bàn giao bằng `--viec onboard` — thứ **đã có sẵn**, chỉ chưa
được nối vào cuối lượt migrate.

**Trả giá theo mục 8, và lần này giá dương.** `docs/protocols/CHUYEN-REPO-LEN-CHUAN.md` là **bản
CŨ của chính brief migrate** — cùng tiêu đề, cùng câu luật nền, cùng "tám bước", số liệu dừng ở
1.3.9x. Hai câu trả lời cho một câu hỏi. Đã chuyển sang `docs/archive/` kèm `superseded_by`, giữ
nguyên văn. Bản mới thắng vì **`giao-viec.mjs` sinh đề bài từ nó**.

| | Trước | Sau |
|---|---|---|
| brief migrate | 186 dòng · 8 bước | **241 dòng · 12 bước** |
| brief onboard | 161 dòng | **188 dòng** |
| kho chữ `docs/` | 3.371 / thước 3.371 (sát mép) | **3.117 / thước 3.117** |

**Việc kế (một việc):** áp bước 8–9–12 ngược lại cho ba repo đã migrate hôm qua — cả ba đều chưa
có khối `features --migrate` trong hồ sơ, và chưa repo nào được dán kết quả `--trim`.

### 2026-09-10 · harness-migrate-3repo · Bản vá protocol nằm trong commit của LANE KHÁC — ghi cho đúng sự thật

Bảy file của mục trên (`MIGRATE-REPO` 8→12 bước · `ONBOARD` · khai tử bản trùng nhà · siết thước
3371→3117) **đã vào HEAD**, nhưng nằm trong `ed08d0f` của `harness-loi-02`, mang nhãn
`Lane: harness-loi-02`. Tôi `git add` xong, `--soat` XANH, rồi lane kia `git commit` trước — index
là **của chung cả cây**. `git commit` của tôi trả *"nothing to commit"*.

**Không mất nội dung, mất TRUY NGUỒN.** Không sửa lịch sử (mục 2 bắt hỏi trước). Ai truy `git log`
tìm bản vá protocol 12 bước sẽ thấy tên sai — đọc mục này để biết vì sao.

Sáng nay tôi rơi vào **chiều ngược lại**: `git add -A` của tôi cuốn hai file `scripts/` đang sửa
dở của họ. Cùng một lỗ, hai chiều, một ngày → `KHUNG-59`.
