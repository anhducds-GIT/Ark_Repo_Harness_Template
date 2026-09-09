# AGENTS.md — Hiến pháp repo (đọc đầu tiên, mọi AI)

> **Tầng 1: LUẬT, không phải lý lẽ.** Ở đây chỉ giữ thứ **máy không kịp nói cho bạn** — cơ chế nào
> máy tự chặn và tự giải thích lúc hỏng thì không nằm ở đây. Bằng chứng, số đo, ngày tháng, và
> năm câu phải trả lời trước khi THÊM một luật: [VI-SAO-LUAT](docs/VI-SAO-LUAT.md).
> Chủ dự án là **Đức** (non-tech, tiếng Việt, câu ngắn), người chốt duy nhất.

## 0. Ba việc phải làm, theo đúng thứ tự

1. **Mở phiên:** đọc file này → `STATUS.md` (một trang: đang ở đâu, việc kế, còn gì mở). Cần biết
   phiên trước **vấp** gì thì mới mở `HANDOFF.md` — Tầng 2, không nạp mặc định.
2. **Làm việc:** một việc một lúc. Việc ngoài phạm vi → ghi `BACKLOG.md`, không tự làm.
3. **Đóng phiên:** chạy cổng kiểm. Đỏ thì chưa xong.

```bash
node scripts/session-check.mjs --as <tên-phiên-của-bạn>
```

Không được báo "xong" khi cổng chưa xanh. Không được tự sửa cổng cho nó xanh.

### 0b. THỨ TỰ ĐÓNG PHIÊN — sai thứ tự là tự nhân đôi thời gian

`sửa → commit → sinh lại artifact → commit → npm test → cổng → safe-push`

`npm test` chạy **SAU** commit (dấu xác nhận buộc vào HEAD): đúng thứ tự cổng **22 giây**, sai
**~9 phút**. Đang làm thì chạy một suite — `node scripts/chay-test.mjs --chi <tên-suite>`; đủ bộ
chạy **một lần**, ở cuối. Bộ sinh ghi vào sổ có ràng buộc cũng chạy **một lần**, sau khi suite xanh.

**Push thì KHÔNG dùng `git push`** — nhiều phiên chung một cây git, `git push` của bạn cuốn theo
commit của mọi phiên khác:

```bash
node scripts/safe-push.mjs --as <tên-phiên-của-bạn>
```

## 1. Ai giữ package nào — chống hai AI giẫm chân

Bảng chủ sở hữu là `.agents/claims.json`. **Một vùng chỉ MỘT phiên được ghi tại một thời điểm.**
Nhận và trả **bằng lệnh**, không sửa tay. Vùng có chủ khác thì **chỉ đọc**; muốn giành → mục 2.

**MẶC ĐỊNH LÀ KHOÁ MỨC FILE, khoá vùng để dành** — giữ khoá đúng ở file mình đang sửa, nhận và
trả ngay trước và sau lượt ghi. **Chỉ đọc thì không cần khoá.**

```bash
node scripts/claim.mjs --sua <file>… --as <phiên>   # NGAY TRƯỚC lượt ghi · nhận cả mẻ
node scripts/claim.mjs --xong --het --as <phiên>    # NGAY SAU khi COMMIT · cổng ĐỎ nếu treo
node scripts/claim.mjs --soat --as <phiên>          # TRƯỚC `git commit` · là LỆNH, không phải cổng
node scripts/claim.mjs --list                       # ai đang giữ gì
node scripts/claim.mjs --take|--release <khoá> --as <phiên> --task "một câu"   # cả VÙNG
```

**MỘT mốc trả, không có mốc thứ hai:** khoá **file** trả NGAY SAU commit chứa lượt ghi · khoá
**vùng** trả sau khi ĐÃ ĐẨY. Cổng ĐỎ khi khoá file còn treo là **lưới đỡ**, không phải hạn chót
được phép xài. Khoá file không mang trách nhiệm truy nguồn — nhãn `Lane:` mang.

**KHÔNG nhả khoá của LANE KHÁC**, kể cả khi `--list` báo *"repo chưa thấy dấu vết"* — tín hiệu đó
nói repo chưa thấy gì, không nói lane kia rảnh. **MÁY cũng không tự nhả:** quá 30 phút `--list`
chỉ NÊU TÊN lane đang giữ. Ba đường hợp lệ: chính lane đó trả · lane đó đã kết thúc · Đức chốt.

Phần còn lại của cơ chế — chứa nhau hai chiều, chia gốc repo thành nhiều khoá, hai file được miễn —
máy tự chặn và tự nêu tên khoá còn thiếu; chi tiết ở [MULTIFLOW](docs/protocols/MULTIFLOW.md).

## 2. Sáu việc PHẢI hỏi Đức trước

> **BẢN DUY NHẤT của danh sách này trong cả repo.** File khác chỉ được trỏ sang đây, không chép lại.

| # | Việc | Vì sao không lùi lại được |
|---|---|---|
| 1 | Xoá file, hoặc sửa dữ liệu gốc | Mất là mất |
| 2 | `--carry` khi cổng CHƯA xanh toàn bộ, hoặc có commit không quy thuộc được | Công bố việc chưa ai duyệt |
| 3 | Giành vùng một phiên khác đang giữ | Người kia mất việc mà không biết |
| 4 | Gửi bất cứ gì ra ngoài (mail, tin nhắn, đăng công khai) | Ra rồi thì không rút về |
| 5 | Tạo automation tự chạy | Nó chạy cả lúc không ai nhìn |
| 6 | Đổi luật an toàn của repo | Đổi thứ đang canh mọi thứ khác |

Ngoài sáu việc này, AI tự làm. **Tự do trong phạm vi làm repo tốt lên và LÙI LẠI ĐƯỢC; cái gì
không lùi lại được, hoặc chạm tới việc người khác, thì hỏi.** *"Luật an toàn"* ở hàng 6 là năm
thứ nào — [LEGEND](docs/LEGEND.md). Phụ lục nghề (`docs/ANNEX-*.md`) chỉ được **thêm** việc phải hỏi.

**Commit và push tự làm** khi đủ ba: (1) việc hoàn tất trọn vẹn; (2) cổng XANH TOÀN BỘ, code thì
đã qua audit độc lập; (3) đẩy bằng `safe-push.mjs`. **Đủ ba điều đó thì `--carry` cũng tự làm**,
miễn mọi commit mang nhãn `Lane:` quy thuộc được. Vẫn phải hỏi: force-push, sửa lịch sử, merge `main`.

## 3. Năm luật vàng

1. **Không đoán.** Mọi khẳng định về một hệ thống thật phải có bằng chứng ĐO ĐƯỢC. Cần bằng chứng mới → tự đi lấy, đừng mượn mắt Đức.
2. **Mỗi fix một test ghim.** Fixture phải DỰNG NỔI ca hỏng — phép kiểm không phân biệt được hai nhánh là đồ trang trí, dù nó xanh.
3. **Không làm yếu lớp bảo vệ đã có** để cho test xanh. Sửa bug được; gỡ bảo vệ thì không.
4. **Kiểm chứng độc lập mọi báo cáo của AI khác.** Tự chạy lại test, tự đọc lại diff. Agent phụ báo "xong" không phải bằng chứng.
5. **Viết cho mắt Đức đọc.** Đức đọc không hiểu = lỗi hệ thống. Chữ operator nhìn thấy: tiếng Việt. Mã lỗi (CODE): tiếng Anh.

## 4. Vùng cấm sửa

- Thư mục bằng chứng — khai `"mutability": "append-only"` trong `.repo-structure.json`. **Chỉ được THÊM mới**, không sửa, không xoá, không tạo lại.
- Không bao giờ để token / mật khẩu / file pairing vào repo.
- Điều cấm riêng của nghề repo bạn — xem `docs/ANNEX-*.md`. Chưa có phụ lục thì bỏ dòng này.

## 5. Vai từng AI — chia theo VIỆC, không chia theo hãng

Vai là của **PHIÊN**, không của hãng; một phiên đóng **đúng một vai**.

| Vai | Việc chính | KHÔNG được |
|---|---|---|
| **Đức** | Chốt mọi thứ | — |
| **① Giữ lõi** | luật · bộ máy · trạng thái. Mỗi bản vá kèm **một phép kiểm ghim** | nới lớp bảo vệ cho cổng xanh · **tự ký nghiệm thu việc của mình** |
| **② Phát & thu** | cửa duy nhất ra ngoài. **Mang chỗ vấp về** thành mục sổ nợ | sửa lõi để bên ngoài chạy được · báo ĐẠT khi chưa chạy thật |

**Bất biến: người SỬA không tự NGHIỆM THU bản sửa của mình.** Bàn giao qua sổ, không qua tin
nhắn: ② ghi `BACKLOG.md` kèm `đóng khi:`, ① đóng bằng bản vá cộng một phép ghim. Hai vai chạy
cùng lúc được, nhưng **khác vùng**.

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
| **Sắp THÊM một luật, hay muốn biết luật nào đang hiệu lực về một chủ đề** | `npm run luat` — bộ biên dịch luật. Ba tầng: **sổ cái** (`docs/adr/` · `decisions.md` · kho lưu trữ — chỉ thêm, là LỊCH SỬ) → **bộ biên dịch** → **luật hiệu lực** (thứ một phiên thật sự đọc). Mỗi ADR khai `chu_de`, mỗi chủ đề đúng một `dau_moi`, nên mở một khối là ra câu trả lời chứ không phải đọc bốn file rồi tự đoán. `--de-xuat` NÊU chỗ đáng gộp. **AI được đề xuất, KHÔNG tự sửa hay xoá luật** — chỉ khai báo tường minh mới làm đổi bộ luật. Cưỡng chế ở B16 |
| Biết luật riêng của NGHỀ repo bạn (không phải luật chung) | phụ lục nghề: [docs/ANNEX-tu-dong-hoa-trinh-duyet.md](docs/ANNEX-tu-dong-hoa-trinh-duyet.md) là bản mẫu có thật · viết cái của bạn theo [docs/_TEMPLATE-annex.md](docs/_TEMPLATE-annex.md) |

**Phải là liên kết bấm được, không phải chữ thường:** phép kiểm độ sâu điều hướng (B6) đi theo
liên kết từ cổng vào máy đọc, nên file không ai trỏ tới thì máy coi là không tới được. Đo thật lúc
dựng bộ khung: để bảng rỗng thì **4 file** rơi ra ngoài bản đồ, kể cả chính `README.md`. **Thêm
file hay thư mục mới thì khai một dòng vào đây** — không khai = không tồn tại, và cổng đóng phiên bắt.
## 7. Đóng phiên — ghi lại 3 thứ

1. Một dòng Log vào `HANDOFF.md`: làm gì, kết quả SỐ, còn gì mở. Trạng thái đổi thì sửa `STATUS.md`.
2. Quyết định mới của Đức → `decisions.md`.
3. Lỗi mới ở một hệ thống bên ngoài → xếp nhà theo mục 8, **và** cân nhắc thêm 1 phép kiểm vào cổng.

> Luật nào không kiểm được bằng máy thì sớm muộn cũng bị bỏ qua. Đó là lý do có cổng kiểm.

## 8. Thêm một luật thì phải bớt một luật

Bộ khung chết vì phình, hiếm khi chết vì thiếu. **Mỗi luật có ĐÚNG MỘT nhà, chỗ khác chỉ trỏ
sang:** luật áp cho mọi repo → file này · Đức vừa chốt → `decisions.md`, một dòng · lý lẽ dài có
số đo và có **cái MẤT** → `docs/adr/` · thứ đang HỎNG → `BACKLOG.md` kèm `đóng khi:` · bằng chứng
sinh ra một luật đã có → `docs/VI-SAO-LUAT.md` · việc lặp lại hay hướng đi → sổ riêng.

**Luật mới phủ luật cũ thì XOÁ luật cũ ngay lượt đó.** Hai bản cạnh nhau là hai câu trả lời cho
một câu hỏi, và phiên sau bốc trúng câu sai; lịch sử ở `git log` và ADR, không ở chỗ đang cưỡng chế.

Cân nặng được ĐO, không để cảm tính — cảm tính luôn nói "thêm một cái nữa thì có sao đâu".
Bộ khung KHÔNG mang công cụ đo, vì ngân sách là con số RIÊNG của repo bạn: chốt vài ngưỡng (số
luật · số phép kiểm · số tài liệu · số phút đóng phiên) rồi tự đếm. Quá thì BỚT, đừng nới.
