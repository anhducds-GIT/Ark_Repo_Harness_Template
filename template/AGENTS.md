# AGENTS.md — Hiến pháp repo (đọc đầu tiên, mọi AI)

> Đây là **Tầng 1**: luật chung, cố tình giữ ngắn 1 trang. Đọc hết trước khi gõ dòng đầu tiên.
> Chi tiết kỹ thuật KHÔNG nằm ở đây — xem mục "Sổ tay mở khi cần" bên dưới.
> Chủ dự án là **Đức** (non-tech, tiếng Việt, câu ngắn). Đức là người chốt duy nhất.

## 0. Ba việc phải làm, theo đúng thứ tự

1. **Mở phiên:** đọc file này → đọc `AGENTS.md` của package mình sắp đụng → đọc `HANDOFF.md`
   của package đó (phần cuối = trạng thái mới nhất).
2. **Làm việc:** một việc một lúc. Phát sinh việc ngoài phạm vi → ghi vào `BACKLOG.md`, không tự làm.
3. **Đóng phiên:** chạy cổng kiểm dưới đây. Đỏ thì chưa xong.

```bash
node scripts/session-check.mjs --as <tên-phiên-của-bạn>
```

Không được báo "xong" khi cổng kiểm chưa xanh. Không được tự sửa cổng kiểm cho nó xanh.

### 0b. THỨ TỰ ĐÓNG PHIÊN — sai thứ tự là tự nhân đôi thời gian

`sửa → commit → sinh lại artifact → commit → npm test → cổng → safe-push`

- **`npm test` chạy SAU commit.** *Dấu xác nhận* buộc vào HEAD + băm cây làm việc, nên cổng không
  chạy lại suite; commit sau khi chạy là đổi cây → dấu hỏng. Đo 08/09: đúng thứ tự cổng **22 giây**, sai **~9 phút**.
- **Trong lúc làm đừng chạy đủ bộ** — `node scripts/chay-test.mjs --chi <tên-suite>`, cố ý KHÔNG
  ghi dấu. Đủ bộ chạy **một lần**, ở cuối.
- **Bộ sinh ghi vào sổ CÓ RÀNG BUỘC thì chạy MỘT LẦN, sau khi suite xanh** — sổ phát hành cưỡng chế *một số một nội dung*; 08/09 đốt **bảy số bản** vì làm ngược.

**Push thì KHÔNG dùng `git push`** — dùng:

```bash
node scripts/safe-push.mjs --as <tên-phiên-của-bạn>
```

Lý do: nhiều phiên AI dùng chung một thư mục git, nên `git push` của bạn **cuốn theo commit của
mọi phiên khác** — đã xảy ra thật 26/08. `safe-push` liệt kê rõ sắp đẩy gì của ai, và từ chối
nếu bạn đang cuốn theo việc người khác.

## 1. Ai giữ package nào — chống hai AI giẫm chân

Bảng chủ sở hữu là `.agents/claims.json`. **Một vùng chỉ có MỘT phiên AI được ghi tại một thời
điểm.** Nhận và trả quyền **bằng lệnh** — sửa tay là đọc-sửa-ghi, và 02/09 một quyền đã **bị ghi
đè im lặng** vì thế. Vùng có chủ khác thì **chỉ đọc**; muốn giành thì xem mục 2.

**MẶC ĐỊNH LÀ KHOÁ MỨC FILE, khoá vùng để dành.** Đức chốt 08/09: *"chỉ giữ khóa đúng ở file mà AI
đó đang sửa … giữ và trả ngay trước và sau khi sửa. Nếu chỉ đọc ko cần giữ khóa."* Đo: **57%** lượt
chặn hôm nay là **chặn oan** — khác file hoàn toàn mà vẫn bị khoá vùng chặn.

```bash
node scripts/claim.mjs --sua <file>… --as <phiên>   # NGAY TRƯỚC lượt ghi · nhận cả mẻ
node scripts/claim.mjs --xong --het --as <phiên>    # NGAY SAU khi COMMIT · cổng ĐỎ nếu treo
node scripts/claim.mjs --soat --as <phiên>          # TRƯỚC `git commit` · là LỆNH, không phải cổng
node scripts/claim.mjs --list                       # ai đang giữ gì
node scripts/claim.mjs --take|--release <khoá> --as <phiên> --task "một câu"   # cả VÙNG
```

**Chứa nhau hai chiều:** vùng có chủ khác → khoá file bị từ chối; trong vùng còn khoá file người
khác → nhận cả vùng bị từ chối. Và `--soat` tồn tại vì **khoá không giữ file, *git* giữ**: chung một
cây làm việc thì `git commit -a` vẫn cuốn file lane khác vừa dàn, và khoá file làm chỗ đó **xấu đi**
vì nó bỏ bớt sự serial hoá.

**MỘT mốc trả, không có mốc thứ hai:** khoá **file** trả NGAY SAU commit chứa lượt ghi · khoá **vùng**
trả sau khi ĐÃ ĐẨY. Cổng ĐỎ khi khoá file còn treo là **lưới đỡ**, không phải hạn chót được phép xài.
Khoá file không mang trách nhiệm truy nguồn — nhãn `Lane:` mang.

**KHÔNG nhả khoá của LANE KHÁC**, kể cả khi `--list` báo *"repo chưa thấy dấu vết"*. Tín hiệu đó nói
repo chưa thấy gì, **không** nói lane kia rảnh — lane cẩn thận dựng nháp ngoài repo rồi mới ghi vào;
06/09 nhả hộ một lần, lane kia mất phần đã xong. Thấy thì **HỎI**. **MÁY cũng không tự nhả:** quá 30
phút `--list` chỉ NÊU TÊN lane đang giữ — hết hạn KHÔNG phải một đường trả khoá. Ba đường hợp lệ:
chính lane đó trả · lane đó đã kết thúc · Đức chốt chuyển khoá.

**Gốc repo chia làm NHIỀU khoá.** Nhận đúng vùng mình đụng, không nhận cả gốc repo. Cổng đóng phiên
sẽ nói tên khoá còn thiếu. Ai chia vùng thì khai `steward` trong khối `areas` của `.repo-structure.json`.

**Hai file được MIỄN:** `.agents/claims.json` (không miễn thì không ai trả lại được quyền) và `HANDOFF.md` ở gốc
(luật mục 7 bắt MỌI phiên ghi Log) — nhưng **chỉ miễn khi chỉ THÊM dòng**; sửa hay xoá dòng cũ là viết lại lịch sử phiên khác.

## 2. Sáu việc PHẢI hỏi Đức trước

> **Đây là BẢN DUY NHẤT của danh sách này trong cả repo.** File khác chỉ được trỏ sang đây,
> tuyệt đối không chép lại — ba bản chép tay đã từng nói ba kiểu khác nhau.

| # | Việc | Vì sao không lùi lại được |
|---|---|---|
| 1 | Xoá file, hoặc sửa dữ liệu gốc | Mất là mất, không dựng lại được |
| 2 | `--carry` khi cổng CHƯA xanh toàn bộ, hoặc có commit không quy thuộc được | Công bố việc chưa ai duyệt |
| 3 | Giành vùng một phiên khác đang giữ | Người kia mất việc mà không biết |
| 4 | Gửi bất cứ gì ra ngoài (mail, tin nhắn, đăng công khai) | Ra rồi thì không rút về được |
| 5 | Tạo automation tự chạy | Nó chạy cả lúc không ai nhìn |
| 6 | Đổi luật an toàn của repo | Đổi luật là đổi thứ đang canh mọi thứ khác |

Ngoài sáu việc này, AI tự làm. **AI tự do trong phạm vi làm repo tốt lên và lùi lại được; cái gì
không lùi lại được, hoặc chạm tới việc người khác, thì hỏi.** *"Luật an toàn"* ở hàng 6 là năm thứ
nào — xem [docs/LEGEND.md](docs/LEGEND.md). Phụ lục nghề (`docs/ANNEX-*.md`) chỉ được **thêm** việc
phải hỏi, không được bớt.

**Commit và push tự làm** — Đức chốt 26/08 — khi đủ ba: (1) việc hoàn tất trọn vẹn; (2) cổng XANH
TOÀN BỘ, code thì đã qua audit độc lập; (3) đẩy bằng `safe-push.mjs`. **Đủ ba điều đó thì `--carry`
cũng tự làm**, miễn mọi commit mang nhãn `Lane:` quy thuộc được — Đức chốt 09/09, sau ba lượt phải
dừng hỏi trong hai ngày. Lý do: commit chưa push là **vô hình** với vòng kiểm tra chéo. Cái mất:
Đức thôi được báo từng lượt việc của lane khác lên GitHub.

Vẫn phải hỏi: force-push, sửa lịch sử, merge vào `main`.

## 3. Năm luật vàng

1. **Không đoán.** Mọi khẳng định về một hệ thống thật phải có bằng chứng ĐO ĐƯỢC. Cần bằng
   chứng mới → tự đi lấy, đừng mượn mắt Đức. Lấy bằng cách nào là việc của phụ lục nghề.
2. **Mỗi fix một test ghim.** Và fixture phải DỰNG NỔI ca hỏng — một phép kiểm không phân
   biệt được hai nhánh là đồ trang trí, dù nó xanh.
3. **Không làm yếu lớp bảo vệ đã có** để cho test xanh. Sửa bug được; gỡ bảo vệ thì không.
4. **Kiểm chứng độc lập mọi báo cáo của AI khác.** Tự chạy lại test, tự đọc lại diff.
   Agent phụ báo "xong" không phải bằng chứng.
5. **Viết cho mắt Đức đọc.** Đức đọc không hiểu = lỗi hệ thống, viết lại đơn giản hơn.
   Chữ operator nhìn thấy: tiếng Việt. Mã lỗi (CODE): tiếng Anh.

## 4. Vùng cấm sửa

- Thư mục bằng chứng — khai `"mutability": "append-only"` trong `.repo-structure.json`. **Chỉ được THÊM mới**, không sửa, không xoá, không tạo lại. Tên thư mục là việc của repo bạn.
- Không bao giờ để token / mật khẩu / file pairing vào repo.
- Những điều cấm riêng của nghề repo bạn — xem `docs/ANNEX-*.md`. Chưa có phụ lục thì bỏ dòng này.

## 5. Vai từng AI — chia theo VIỆC, không chia theo hãng

Vai là của **PHIÊN**, không của hãng; một phiên đóng **đúng một vai**. Lý lẽ và số đo: ADR — mục 6.

| Vai | Việc chính | KHÔNG được |
|---|---|---|
| **Đức** | Chốt mọi thứ | — |
| **① Giữ lõi** | luật · bộ máy · trạng thái. Mỗi bản vá kèm **một phép kiểm ghim** | nới lớp bảo vệ cho cổng xanh · **tự ký nghiệm thu việc của mình** |
| **② Phát & thu** | cửa duy nhất ra ngoài. **Mang chỗ vấp về** thành mục sổ nợ | sửa lõi để bên ngoài chạy được · báo ĐẠT khi chưa chạy thật |

**Bất biến: người SỬA không tự NGHIỆM THU bản sửa của mình.** Vai nào cũng được tìm lỗi ở bất kỳ đâu
— tách "ai tìm" khỏi "ai sửa" là cấm Vai ① soi chính lõi nó giữ. Bàn giao qua sổ, không qua tin nhắn:
② ghi `BACKLOG.md` kèm `đóng khi:`, ① đóng bằng bản vá cộng một phép ghim. Hai vai chạy cùng lúc được, nhưng **khác vùng**.

## 6. Sổ tay mở khi cần — Tầng 2

> **Bảng này là BẢN ĐỒ RIÊNG CỦA REPO BẠN.** Bộ khung điền sẵn các dòng cho chính những file
> nó mang theo — vừa để repo mới xanh ngay, vừa làm mẫu cho định dạng. **Thêm dòng của bạn vào
> đây; đừng xoá cái đang đúng.**

Luật chung ở các mục trên; chi tiết kỹ thuật ở các file bảng dưới trỏ tới — đừng đọc trước cả bảng, tới việc nào thì mở sổ tay đó.

| Khi bạn sắp… | Mở file |
|---|---|
| Hiểu bộ khung này gồm gì và dùng thế nào | [README.md](README.md) |
| Khai trạng thái cho một đơn vị công việc | [STATUS.template.md](STATUS.template.md) |
| Ghi một quyết định kiến trúc | bản mẫu [docs/_TEMPLATE-adr.md](docs/_TEMPLATE-adr.md) · luật [docs/adr/0000-…](docs/adr/0000-ghi-nhan-quyet-dinh-kien-truc.md) |
| **Tra nhanh người chốt đã chốt gì, ngày nào** | [decisions.md](decisions.md) — sổ quyết định, **chỉ thêm**, luật mục 7 bắt ghi vào đây. Lập luận dài thì viết ADR, file này giữ một dòng trỏ sang |
| Viết một tài liệu nghiên cứu | [docs/_TEMPLATE-study.md](docs/_TEMPLATE-study.md) |
| Viết đề bài cho một phiên AI | [docs/_TEMPLATE-brief.md](docs/_TEMPLATE-brief.md) |
| **Sắp làm cùng lúc với AI khác, hoặc sắp SỬA một trong bốn cơ chế đa phiên** | [docs/protocols/MULTIFLOW.md](docs/protocols/MULTIFLOW.md) — bốn cơ chế (bảng chủ sở hữu · nhãn `Lane:` · cổng đóng phiên · cổng xuất bản), một ngày làm việc 5 bước, **năm bất biến kèm lý do từng cái**, và quy trình đổi cơ chế có **đột biến kiểm bắt buộc**. Mục 1–3 viết cho người không code. **Cố ý không chứa số đo, không kiểm kê chốt, không bảng mã lỗi** — ba thứ đó khác nhau ở từng repo và mục nhanh hơn ai kịp sửa, nên nó chỉ đưa câu lệnh để tự đo |
| Biết phiên trước làm tới đâu | [HANDOFF.md](HANDOFF.md) — đọc phần **cuối** file |
| Biết repo đang nợ gì về cấu trúc | chạy `npm run bootstrap` |
| **Đến hạn bảo trì · repo im ắng lâu ngày · muốn biết repo đang NẶNG bao nhiêu** | [docs/BAO-TRI-DINH-KY.md](docs/BAO-TRI-DINH-KY.md) — ba nhịp giữ repo đúng, cộng **nhịp DỌN** giữ repo rẻ. Đo bằng `npm run can-nang`; ngân sách khai được ở `budget` trong `.repo-structure.json` |
| **Mới vào, hoặc cần tra một thuật ngữ** (gate · claim · lane · fail-closed…) | [docs/HUONG-DAN.md](docs/HUONG-DAN.md) — hai phần: cho người, và cho phiên AI; đọc trước mọi sổ tay khác · [docs/LEGEND.md](docs/LEGEND.md) — từ điển, thuật ngữ **giữ nguyên tiếng Anh** vì dịch sang tiếng Việt thì tra cứu mất |
| **Phát sinh việc ngoài phạm vi phiên mình — chỗ ghi nợ, luật mục 0 bắt** | [BACKLOG.md](BACKLOG.md) — nhóm `## P<n>`, mỗi mục `### <MÃ>-<số> · <tiêu đề>`, đóng thì **gạch mã** chứ đừng xoá. `npm run what-next` đọc thẳng file này; sai quy ước một ký tự là mục biến mất khỏi bản đồ việc |
| **Sắp BÁO CÁO trạng thái cho người chốt — kiểm xem điều mình sắp nói có khớp nguồn thẩm quyền không** | `npm run state-check` — **không phải cổng đóng phiên**: cổng kia hỏi "việc tôi làm đẩy được chưa", cái này hỏi "điều tôi sắp nói có đúng không". Ba mã thoát, cố ý không gộp: `OK` · `MISMATCH` · `UNKNOWN` — không đọc được thì nói KHÔNG BIẾT, không nói OK. **Chỉ đọc, không đòi khoá nào** |
| **Không biết làm gì tiếp, hoặc muốn biết việc nào chạy song song được ngay** | `npm run what-next` — bản đồ việc, giao ba nguồn: bảng quyền × sổ nợ từng đơn vị × sổ ý tưởng. Luật song song nó cưỡng chế chỉ một câu: hai việc song song được **khi và chỉ khi** thuộc hai khoá khác nhau và cả hai đang trống. **Chỉ đọc, không đòi khoá nào** |
| **Là phiên ĐIỀU PHỐI: người chốt hỏi "đang có gì · làm gì tiếp · việc nào chạy song song được"** | [docs/protocols/ORCHESTRATOR.md](docs/protocols/ORCHESTRATOR.md) — sổ tay vai điều phối: luật mở phiên, **hàng rào vai cứng** (vai này KHÔNG code, KHÔNG debug, KHÔNG đề xuất bản vá), luật nạp báo cáo năm mục, lối ra bàn giao cho executor. **Đọc khối cảnh báo ở đầu file trước** |
| **Một phép kiểm tự nhiên đỏ với người vừa clone mà xanh trên máy bạn** | [.gitattributes](.gitattributes) — chốt kiểu xuống dòng cho CẢ repo, cả trong kho lẫn trong cây làm việc. Không có nó thì máy Windows tự đổi lúc lấy file ra, một commit có hai dạng byte, và `git status` nói SẠCH ở cả hai. Chốt một nửa — chỉ `text=auto` — thì kho sạch mà cây làm việc vẫn CRLF, tức bệnh còn nguyên |
| Hiểu bộ khung tự kiểm mình bằng gì, hoặc thêm test của repo bạn | [tests/harness-smoke.mjs](tests/harness-smoke.mjs) — bốn khối hạt giống · [tests/assistant-smoke.mjs](tests/assistant-smoke.mjs) — phép ghim của hai lệnh trên, khối cuối tự dựng một repo hình dạng khác hẳn rồi chạy thật trong đó. Chạy cả hai bằng `npm test` |
| Biết luật riêng của NGHỀ repo bạn (không phải luật chung) | phụ lục nghề: [docs/ANNEX-tu-dong-hoa-trinh-duyet.md](docs/ANNEX-tu-dong-hoa-trinh-duyet.md) là bản mẫu có thật · viết cái của bạn theo [docs/_TEMPLATE-annex.md](docs/_TEMPLATE-annex.md) |

**Phải là liên kết bấm được, không phải chữ thường:** phép kiểm độ sâu điều hướng (B6) đi theo
liên kết từ cổng vào máy đọc, nên file không ai trỏ tới thì máy coi là không tới được. Đo thật lúc
dựng bộ khung: để bảng rỗng thì **4 file** rơi ra ngoài bản đồ, kể cả chính `README.md`. **Thêm
file hay thư mục mới thì khai một dòng vào đây** — không khai = không tồn tại, và cổng đóng phiên bắt.
## 7. Đóng phiên — ghi lại 3 thứ

1. Một dòng Log vào `HANDOFF.md` của package: làm gì, kết quả số, còn gì mở.
2. Quyết định mới của Đức → `decisions.md`.
3. Gặp lỗi mới ở một hệ thống bên ngoài → xếp nhà theo **mục 8 câu 4** (lỗi sẽ gặp lại → sổ tay
   agent · thứ đang hỏng → `BACKLOG.md`), **và** cân nhắc thêm 1 phép kiểm vào cổng đóng phiên.

> Luật nào không kiểm được bằng máy thì sớm muộn cũng bị bỏ qua. Đó là lý do có cổng kiểm.

## 8. Thêm một luật thì phải bớt một luật

Mỗi luật ở đây đều hợp lý **lúc thêm vào**. Cộng lại thì không: AI mất nửa phiên chỉ để đọc luật,
luật mâu thuẫn nhau, đóng phiên lâu tới mức người ta bỏ qua cổng. Bộ khung chết vì phình, hiếm
khi chết vì thiếu. Nên trước khi thêm một luật, một phép kiểm hay một tài liệu, trả lời đủ năm câu:

1. **Đã có chuyện gì xảy ra thật chưa?** Chưa thì đừng thêm — viết vào `BACKLOG` và chờ.
2. **Nó thay chỗ cái nào?** Không thay được cái nào thì nói rõ vì sao đáng thêm hẳn.
3. **Dựng nổi ca hỏng cho nó không?** Không dựng nổi thì nó là chữ, không phải luật.
4. **Nó thuộc NHÓM nào?** Mỗi luật có ĐÚNG MỘT nhà, chỗ khác chỉ trỏ sang: luật áp cho mọi repo →
   file này · Đức vừa chốt → `decisions.md`, một dòng · lý lẽ dài, có số đo, có **cái MẤT** →
   `docs/adr/`, bất biến, sửa thì viết ADR mới · thứ đang HỎNG → `BACKLOG.md` kèm `đóng khi:` ·
   việc lặp lại, hay hướng đi chưa hỏng → sổ riêng, khai vào bảng mục 6. Chọn không nổi = chưa đủ rõ.
5. **Nó có CHỦ NGỮ không, và nó phủ luật nào?** Luật mới phủ luật cũ thì **XOÁ luật cũ ngay lượt đó** — Đức chốt 09/09.
   Hai bản cạnh nhau là hai câu trả lời cho một câu hỏi, và phiên sau bốc trúng câu sai; lịch sử ở
   `git log` và ADR, không ở chỗ đang cưỡng chế. Ca thật: *"quá 30 phút thì nêu tên, KHÔNG tự nhả"* thiếu chủ ngữ → một phiên đọc thành "đừng trả khoá của mình".

Cân nặng được ĐO, không để cảm tính — cảm tính luôn nói "thêm một cái nữa thì có sao đâu".
Bộ khung KHÔNG mang công cụ đo, vì ngân sách là con số RIÊNG của repo bạn: chốt vài ngưỡng (số
luật · số phép kiểm · số tài liệu · số phút đóng phiên) rồi tự đếm. Quá thì BỚT, đừng nới.

