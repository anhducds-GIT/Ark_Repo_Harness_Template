---
kind: guide
status: active
ttl_days: 365
---

# Bản đồ file — bản ĐẦY ĐỦ

> **Vì sao file này tồn tại.** Bảng tra ở `AGENTS.md` mục 6 từng mang trọn phần giải thích này,
> và nó chiếm **10.029 / 13.799 token — 73%** của thứ MỌI phiên phải nạp, ở MỌI repo. Một phiên
> nạp 10k token để rốt cuộc mở một hai file. Đo 2026-09-09.
>
> Nay `AGENTS.md` giữ **bảy cửa hay dùng nhất**, còn *vì sao · có gì bên trong · đã vấp ở đâu*
> nằm ở đây — **mở khi cần**, không nạp mỗi lượt. Đây cũng là **bản đồ file chính thức** của repo:
> `.repo-structure.json` khai `docs.file_map` trỏ vào đây, nên cổng *"File mới đã khai"* đối
> chiếu với bản ĐẦY ĐỦ này, và **file mới thì khai ở ĐÂY**, không khai vào hiến pháp.
>
> **Chữ giữ nguyên từng byte, chỉ đổi chỗ.** Thêm một file mới thì thêm một mục ở đây.

### Cãi một luật, hay sắp THÊM một luật — bằng chứng sinh ra nó

[docs/VI-SAO-LUAT.md](docs/VI-SAO-LUAT.md) — **sổ bằng chứng, không phát biểu luật.** Sự cố nào,
ngày nào, đo được gì, đã mất gì; kèm **năm câu phải trả lời trước khi thêm một luật**. Tách khỏi
`AGENTS.md` ngày 09/09 vì lý lẽ chiếm gần một nửa thứ mọi phiên phải nạp, trong khi nó chỉ cần
đọc một lần trong đời — lúc có người muốn đổi luật.

### Trạng thái repo lúc MỞ PHIÊN — đang ở đâu, việc kế là gì

[STATUS.md](STATUS.md) — **một trang, khai bằng tay, và là thứ MỌI phiên đọc ngay sau hiến pháp.**
Đức chốt 09/09: phần đuôi `HANDOFF.md` là *một lượt việc*, không phải *trạng thái*, nên nó rời
đường nạp sang Tầng 2. Bảng trạng thái đọc frontmatter của file này; đừng gõ số nào mà máy đo được.

### Hiểu bộ khung này gồm gì và dùng thế nào

[README.md](README.md)

### Khai trạng thái cho một đơn vị công việc

[STATUS.template.md](STATUS.template.md)

### Ghi một quyết định kiến trúc

bản mẫu [docs/_TEMPLATE-adr.md](docs/_TEMPLATE-adr.md) · luật [docs/adr/0000-…](docs/adr/0000-ghi-nhan-quyet-dinh-kien-truc.md)

### Tra nhanh Đức đã chốt gì, ngày nào

[decisions.md](decisions.md) — sổ quyết định, **chỉ thêm**. Lập luận dài thì viết ADR, file này giữ một dòng trỏ sang

### Có một Ý TƯỞNG, hay muốn biết repo đang có những hướng nào chờ làm

[IDEAS.md](IDEAS.md) — sổ ý tưởng, **KHÁC sổ nợ**: sổ nợ ghi thứ đang *hỏng*, sổ này ghi *hướng đi*. Trộn hai thứ là mọi hướng đi trông như lỗi cần vá gấp. Quy ước máy đọc: `## <MÃ>-<số> · <tiêu đề>` (tiền tố **chỉ chữ in hoa**) kèm bốn dòng `- **bậc:**` · `- **việc kế:**` · `- **chủ:**` · `- **phạm vi:**`. Bậc chỉ có bốn — bậc lạ thì bộ sinh **DỪNG**, không đoán. Hai chỗ đọc sổ này: `npm run what-next` và tab **Ý tưởng** của bảng

### Viết một tài liệu nghiên cứu

[docs/_TEMPLATE-study.md](docs/_TEMPLATE-study.md)

### Viết đề bài cho một phiên AI

[docs/_TEMPLATE-brief.md](docs/_TEMPLATE-brief.md)

### Sắp làm cùng lúc với AI khác, hoặc sắp SỬA một trong bốn cơ chế đa phiên

[docs/protocols/MULTIFLOW.md](docs/protocols/MULTIFLOW.md) — bốn cơ chế (bảng chủ sở hữu · nhãn `Lane:` · cổng đóng phiên · cổng xuất bản), một ngày làm việc 5 bước, **năm bất biến kèm lý do từng cái**, và quy trình đổi cơ chế có **đột biến kiểm bắt buộc**. Mục 1–3 viết cho người không code. **Cố ý không chứa số đo, không kiểm kê chốt, không bảng mã lỗi** — ba thứ đó khác nhau ở từng repo và mục nhanh hơn ai kịp sửa, nên nó chỉ đưa câu lệnh để tự đo

### Muốn biết bộ khung và một repo đã lắp nó đang LỆCH nhau ở đâu

**ĐÃ LƯU KHO 09/09** (đo ở bản 1.3.19, việc hoà giải đã xong): [docs/archive/HOA-GIAI-BO-KHUNG-VS-TIEU-THU.md](docs/archive/HOA-GIAI-BO-KHUNG-VS-TIEU-THU.md) — đo 06/09, mỗi khối lệch rơi vào **đúng một** trong ba ô: `KÉO XUỐNG` · `ĐẨY LÊN` · `CỐ Ý KHÁC`. Ô thứ ba là ô hay bị bỏ sót nhất: repo tiêu thụ lớn hơn vì nó **phản ứng với sự cố thật của riêng nó**, không vì nó tốt hơn — chép mù bản của nó là nhập cả những luật chỉ đúng ở đó

### Biết phiên trước làm tới đâu

[HANDOFF.md](HANDOFF.md) — đọc phần **cuối** file. **Trần 2.600 byte MỘT MỤC** và **xoay theo tháng** ([ADR-0011](docs/adr/0011-cam-rang-cho-ba-tran-kho-chu.md)): cổng chỉ chặn **mục bạn vừa thêm**, không chặn mục cũ. Đo: `npm run handoff -- --check` · xoay: `npm run handoff -- --rotate HANDOFF.md`. Kho chữ `docs/` có **thước cóc** (`docs.tran_dong_khong_ke_adr`) — chỉ đỏ khi **phình**, và **không tính `docs/adr/`** vì ADR bất biến

### Biết repo đang nợ gì về cấu trúc

chạy `npm run bootstrap`

### Phát sinh việc ngoài phạm vi phiên mình — chỗ ghi nợ, luật mục 0 bắt

[BACKLOG.md](BACKLOG.md) — nhóm `## P<n>`, mỗi mục `### KHUNG-<số> · <tiêu đề>`, đóng thì **gạch mã** chứ đừng xoá. `npm run what-next` đọc thẳng file này; sai quy ước một ký tự là mục biến mất khỏi bản đồ việc. **Trần 25 mục mở, cổng đóng phiên ĐỎ khi vượt** ([ADR-0010](docs/adr/0010-xoa-so-quyen-va-tran-so-no.md)): đóng một mục là xanh lại; thấy trần quá chặt thì **hỏi Đức** rồi sửa `backlog.tran` trong `.repo-structure.json`, đừng sửa script

### Sắp BÁO CÁO trạng thái cho Đức — kiểm xem điều mình sắp nói có khớp nguồn thẩm quyền không

`npm run state-check` — **không phải cổng đóng phiên**: cổng kia hỏi "việc tôi làm push được chưa", cái này hỏi "điều tôi sắp nói có đúng không". Đối chiếu bảng quyền · artifact máy sinh · nhánh xa. Ba mã thoát, cố ý không gộp: `OK` · `MISMATCH` · `UNKNOWN` — không đọc được thì nói KHÔNG BIẾT, không nói OK. **Chỉ đọc, không đòi khoá nào**

### Không biết làm gì tiếp, hoặc muốn biết việc nào chạy song song được ngay

`npm run what-next` — bản đồ việc, giao ba nguồn mà trước nay không giao được với nhau: bảng quyền × sổ nợ từng đơn vị × sổ ý tưởng. Luật song song nó cưỡng chế chỉ một câu: hai việc song song được **khi và chỉ khi** thuộc hai khoá khác nhau và cả hai đang trống. **Chỉ đọc, không đòi khoá nào**

### Lắp bộ khung vào một repo mới — lấy bản nào

**thẻ `v1.2.17`**, mốc Stable Baseline — [ADR-0003](docs/adr/0003-dong-bang-stable-baseline.md). `git clone --branch v1.2.17 <repo>` — **đừng thêm `--depth 1`**: sổ phát hành đối chiếu với lịch sử, clone nông thì bộ khung từ chối phát (`NHAN_CHUNG_HONG`, đã thử thật 04/09). Lắp từ mốc, đừng lắp từ HEAD đang chạy: HEAD là thứ **đang chạy**, không phải thứ **dùng được**. Thẻ có thật trên remote — không phải một con số gõ tay trong tài liệu

### Tra một lượt bàn giao CŨ, một bản phát CŨ, hay lộ trình đã xong

[docs/archive/](docs/archive/HANDOFF-2026-09.md) — kho **LƯU TRỮ**, **máy sinh bằng `npm run don`**. Chữ giữ nguyên từng dòng, chỉ đổi chỗ. Thư mục này **KHÔNG tính vào ngân sách tài liệu**: ngân sách đo thứ MỌI phiên phải nạp, mà lưu trữ theo định nghĩa là thứ không nạp mỗi lần. Cất vào đây thì **đừng sửa** — cổng đóng phiên đối chiếu từng byte với chỗ đã cắt ra

### Biết vì sao bộ khung có hình dạng hôm nay

[docs/archive/ROADMAP-V1.md](docs/archive/ROADMAP-V1.md) — **LỊCH SỬ, đã xong**. Bốn khối A→D dẫn tới v1.0, mỗi lỗ kèm cách chứng minh nó có thật. Việc đang làm thì đọc [STATUS.md](STATUS.md), từng bản đóng gì thì đọc [CHANGELOG.md](CHANGELOG.md)

### Biết việc đang mở được xếp thứ tự thế nào, việc nào chạy song song được

[docs/ROADMAP-V2.md](docs/ROADMAP-V2.md) — lớp ĐIỀU PHỐI: **trạng thái hiện hành của thứ tự việc** — kế hoạch sáu đợt cũ đã dời sang kho lưu trữ 09/09 (7 trong 13 mã việc nó nhắc đã đóng). Thứ tự SỐNG thì chạy `npm run what-next`, đừng đọc số ở đây. Thứ tự · phân luồng theo khoá · phụ thuộc · chỗ chờ người chốt · luật gom bản phát. **Cố ý không chứa nội dung từng mục nợ** (ở [BACKLOG.md](BACKLOG.md)), không chứa ngày tháng, không chứa bản vá kỹ thuật

### GIAO một việc lặp lại cho AI khác — nâng · migrate · audit

`npm run giao-viec -- --viec <nang\|migrate\|audit> --repo "<repo-đích>" --as <tên-phiên>` → in ra stdout một đề bài **đã đo sẵn repo đích** (nhánh · lệch nhánh mặc định · file sửa dở trong/ngoài vùng · bảng quyền · bản khung đang ghim). **Đo không được thì KHÔNG in gì** — một đề bài dựng trên số liệu đoán còn nguy hiểm hơn không có đề bài. Nửa trên là [docs/briefs/GIAO-VIEC-CHUNG.md](docs/briefs/GIAO-VIEC-CHUNG.md) (luật chung: tên phiên · khoá vùng · hai lượt đẩy · năm việc cấm · mẫu báo cáo năm dòng, và **ba giới hạn đo được của `codex exec`**); nửa dưới là phần việc: [nâng](docs/briefs/NANG-BO-KHUNG.md) · [migrate](docs/briefs/MIGRATE-REPO.md) · [audit](docs/briefs/AUDIT-REPO.md). **Đức chốt 06/09**: Claude Code không làm hết một mình được. Đề bài viết TRƯỚC khi đo repo đích đã dạy sai một lượt thật — nên việc đo thành LỆNH, không thành dòng dặn dò

### Nhờ một AI khác brainstorm cho repo này

**ĐÃ LƯU KHO 09/09** (đề bài đưa bộ khung tới v1.0; nay đã 1.6.0): [docs/archive/BRAINSTORM-GPT-V1.md](docs/archive/BRAINSTORM-GPT-V1.md) — dán trọn, đừng tóm tắt hộ

### Việc lặp lại — làm theo danh sách kiểm, đừng tự nghĩ lại

[docs/SO-TAY-AGENT.md](docs/SO-TAY-AGENT.md) — bảy mục, mỗi mục một checklist. **Việc nào có mục ở đó thì phải làm theo mục đó**

### Repo đích đã có file trùng tên với artifact máy sinh

khai `generated_names` trong `.repo-structure.json` — từ bản 1.3.11 ba tên `DASHBOARD.md` · `llms.txt` · `repo-map.json` **không còn đóng cứng**. Khai thiếu khoá nào thì khoá đó dùng mặc định; gõ sai tên khoá, để dấu gạch chéo, hay khai hai artifact trùng tên đều bị **từ chối thẳng** chứ không lùi về mặc định im lặng. Ghim ở `F17`

### Muốn biết bộ khung LÀM ĐƯỢC GÌ, hay repo đích đã nhận đủ tính năng chưa

[features.json](features.json) — **danh mục tính năng, 9 khối · 44 mục**, và mỗi mục có **phép đo** chứ không chỉ có mô tả. Chạy `npm run features` để đo chính repo này, `node scripts/features.mjs <repo>` để đo một repo đã lắp, `--migrate <repo>` để sinh khối checklist dán vào hồ sơ migrate (mang **ngày đo** và **bản danh mục**). Ba trạng thái, và **`[~]` MỘT PHẦN nguy hiểm hơn `[ ]` THIẾU**: mục một phần trông như đang chạy nhưng hỏng ở chỗ không ai nhìn — ca thật đo được ở một repo đã lắp: có `session-check.mjs` mà thiếu `npm run gate`, nên cổng có mặt mà không ai gọi được bằng tên chuẩn. Mỗi mục khai `tu_ban`, nên phiên AI ở repo đích đối chiếu được với `.ark/harness.lock.json` để biết mình thiếu tính năng nào của bản mới. Ghim ở [tests/features-smoke.mjs](tests/features-smoke.mjs) — vế 5 đòi **mọi thứ danh mục khai phải CÓ THẬT** ở repo phát hành, nên danh mục không trôi khỏi thực tế trong im lặng

### Vừa migrate xong một repo — đưa AI assistant của repo đó GO LIVE và nhận việc maintain

`npm run giao-viec -- --viec onboard --repo "<repo>" --as <tên-phiên>` → [docs/briefs/ONBOARD-AI-REPO-DICH.md](docs/briefs/ONBOARD-AI-REPO-DICH.md). **Đo được sau ba lượt migrate: 3 lượt xong, 0 lượt có phiên AI ở repo đích chạy trọn một vòng làm việc** — migrate đưa CÔNG CỤ tới, nó không đưa NGƯỜI CẦM tới, và repo có cổng mà không ai chạy thì sau vài tuần lệch chuẩn đúng bằng repo chưa migrate, chỉ khác là nó **trông như** đã lên chuẩn. Đề bài sinh ra mang theo **checklist tính năng đã đo tại repo đích**, và bắt phiên nhận việc chạy **trọn một vòng thật** (nhận khoá → làm → cổng xanh → hai lượt đẩy → trả khoá → ghi Log) chứ không diễn tập. Báo cáo **sáu dòng**, khác khuôn năm dòng của ba việc kia — vì nó trả lời *"repo này từ giờ có người cầm chưa"*, không phải *"tôi đã làm gì"*

### Muốn F5 là thấy trạng thái MỚI NHẤT, không phải nhờ AI sinh lại bảng

[bang-song/](bang-song/loi.mjs) — **ba cửa, một lõi**: nhấp đúp `Xem-bang.cmd` · máy chủ tại chỗ `npm run bang-song:may-chu` (chỉ `127.0.0.1`, **ba đường, chỉ GET/HEAD, không một đường ghi nào**) · tiến trình nền tự chạy lúc bật máy (`Bat-tu-chay.cmd`, gỡ bằng `Tat-tu-chay.cmd`) — **Đức duyệt tường minh 07/09**, luật mục 2 hàng 5 bắt hỏi. Bản ra nằm **NGOÀI git**, cố ý: nó đọc bảng quyền từ ĐĨA nên đổi byte mỗi lượt ai nhận/trả khoá, và commit nó là máy của Đức làm bẩn cây làm việc của mọi lane. Bản ĐÃ COMMIT vẫn là [DASHBOARD-Ark-Repo-Harness.html](DASHBOARD-Ark-Repo-Harness.html), vẫn suy hoàn toàn từ HEAD — hai file, hai việc, **đừng gộp**. Vì sao cần: đo 06/09, bốn khoá một phiên giữ suốt lượt làm việc nằm trong **0/6 commit**, nên bảng suy từ HEAD nói *"không có luồng nào chạy"* trong khi có bốn. Bốn chốt an toàn + ghim ở [tests/bang-song.mjs](tests/bang-song.mjs), **bảy đột biến đã chạy**

### Sắp sửa `bang-song/` — thêm một đường vào máy chủ, hay nới chốt an toàn

[tests/bang-song.mjs](tests/bang-song.mjs) — 11 vế. Vế 7 canh **hàng rào `KHOA_SONG`**: gỡ nó là bản commit ở gốc repo cũng đọc bảng quyền từ đĩa, và lúc đó cổng *"Sự thật máy sinh còn tươi"* ĐỎ với MỌI phiên mỗi lượt có ai nhận khoá — một tiến trình trên máy Đức chặn push cả repo. Đầu file ghi bảy đột biến đã chạy, **kèm cái SỐNG SÓT lượt đầu**: vế 1 từng lặp qua chính danh sách nó phải canh

### Sắp thêm một lưu đồ vào tài liệu, hay thấy lưu đồ trên bảng hiện ra là CHỮ

[scripts/luu-do.mjs](scripts/luu-do.mjs) — vẽ khối ```mermaid``` thành **SVG nội tuyến lúc sinh trang**, không nạp thư viện nào. Vì sao không dùng CDN: trang là file tĩnh đem gửi người khác mở, và một lưu đồ chỉ hiện khi có mạng thì đúng lúc cần nhất nó lại là chữ. **Tập con hẹp, cố ý** — `flowchart TD | LR`, `A["nhãn"]`, `A{quyết định}`, `A --> B`, `A -- nhãn --> B`, `-.->`, `-.-`, `---`, chuỗi nhiều nút. Ngoài tập con thì **trả `null`, không ném**, và bên gọi in lại mã nguồn KÈM một dòng nói rõ là chưa vẽ được — lùi im lặng chính là cách lỗi cũ sống 5 tháng. Ghim ở [tests/luu-do-smoke.mjs](tests/luu-do-smoke.mjs), **10 vế · 8 đột biến đã chạy, 3 cái SỐNG SÓT lượt đầu** vì ba cơ chế giữ nhãn che cho nhau

### Nhật ký / sổ phát hành phình quá ngân sách — DỌN đi, đừng xoá

`npm run don` — **NHỊ P DỌN**. Dời phần cũ của `HANDOFF.md` và `CHANGELOG.md` sang `docs/archive/`, **giữ nguyên từng chữ**. Mặc định là **xem trước, không ghi gì**; ghi thật thì `npm run don -- --apply`. Hai file đó chỉ có MỘT CHIỀU là tăng (luật cấm sửa/xoá dòng cũ), nên chúng cần một **nhịp** chứ không phải một lượt — Đức chốt 2026-09-06. Lệnh tự đối chiếu byte trước khi ghi; cổng đóng phiên kiểm lại một lần nữa độc lập. **Dọn xong thì commit phần dọn và phần ghi Log bằng HAI commit riêng**

### Đến hạn bảo trì · repo im ắng lâu ngày · repo đang NẶNG bao nhiêu

[docs/BAO-TRI-DINH-KY.md](docs/BAO-TRI-DINH-KY.md) — ba nhịp giữ repo **đúng**, cộng **nhịp DỌN** giữ repo **rẻ**: bốn chỗ tốn token xếp theo mức đau, và luật *dời chỗ chứ không xoá*. Đo bằng `npm run can-nang`; ngân sách khai ở `budget` trong `.repo-structure.json`. **Đi theo bản trích từ 1.3.4**

### Giải thích repo này cho người không đọc code

[docs/TINH-NANG.md](docs/TINH-NANG.md) — mỗi tính năng kèm câu "không có nó thì hỏng ra sao"

### Tra một thuật ngữ (gate · claim · lane · fail-closed…)

[docs/LEGEND.md](docs/LEGEND.md) — thuật ngữ giữ tiếng Anh, giải nghĩa tiếng Việt

### Mới vào, chưa biết bắt đầu từ đâu

[docs/HUONG-DAN.md](docs/HUONG-DAN.md) — hai phần: cho người, và cho phiên AI

### Xem các bước của một việc, có lưu đồ

[docs/workflows/](docs/workflows/01-dung-repo-moi.md) — [dựng repo mới](docs/workflows/01-dung-repo-moi.md) · [migrate](docs/workflows/02-dua-repo-cu-len-chuan.md) · [một phiên làm việc](docs/workflows/03-mot-phien-lam-viec.md)

### Biết bản này vừa đổi gì so với bản trước

[CHANGELOG.md](CHANGELOG.md) — chỉ thêm, không sửa khối cũ

### Là phiên ĐIỀU PHỐI: người chốt hỏi "đang có gì · làm gì tiếp · việc nào chạy song song được"

[docs/protocols/ORCHESTRATOR.md](docs/protocols/ORCHESTRATOR.md) — sổ tay vai điều phối: luật mở phiên, **hàng rào vai cứng** (vai này KHÔNG code, KHÔNG debug, KHÔNG đề xuất bản vá), luật chỉ-trả-lời-khi-được-hỏi, luật nạp báo cáo năm mục, lối ra bàn giao cho executor. **Đọc khối cảnh báo ở đầu file trước**: ba luật lớn trong đó hiện CHƯA có phép kiểm máy ở repo này

### Đo một repo khác cách bộ khung bao xa

`npm run assess -- <đường-dẫn-repo>` · quy trình đọc kết quả: [docs/protocols/KIEM-MOT-REPO.md](docs/protocols/KIEM-MOT-REPO.md)

### Dựng một repo mới từ bộ khung

`npm run init -- <thư-mục> --ten "Tên repo"`

### Đưa một repo đang sống lên chuẩn

[docs/protocols/CHUYEN-REPO-LEN-CHUAN.md](docs/protocols/CHUYEN-REPO-LEN-CHUAN.md) — **đã chạy thật 3 lần** (03/09 ×2 · 06/09), hồ sơ từng lượt ở [docs/migrations/](docs/migrations/). Đọc hồ sơ trước: chỗ vấp thật nằm ở đó, không nằm trong quy trình

### Sinh lại bản trích trong `template/`

`npm run template` · chỉ kiểm không ghi: `npm run template -- --check`

### Biết vì sao công cụ ở đây mà không đi theo bản trích

[docs/adr/0002](docs/adr/0002-cong-cu-va-quy-trinh-o-repo-nha.md) · vì sao bộ khung tách ra ở riêng: [docs/adr/0001](docs/adr/0001-template-o-repo-doc-lap-project-3ai-nghi.md)

### Sắp đổi VAI của một phiên, hay thắc mắc vì sao bỏ bảng chia-theo-hãng

[ADR-0008](docs/adr/0008-hai-vai-assistant.md) — số đo, và vì sao không đo được HÃNG từ repo. **Đọc kèm [ADR-0009](docs/adr/0009-sua-ba-khang-dinh-cua-adr-0008.md)**, nó sửa ba khẳng định của 0008 — trong đó có **bất biến bị viết sai rồi ghim nhầm**

### Sắp gom hay tách một TAB của bảng

[ADR-0007](docs/adr/0007-tab-migrate-tach-rieng.md) — vì sao tab Migrate tách ra khỏi lượt gộp của ADR-0006, và phép ghim đo **hai nửa một việc phải cùng một tab**

### Sắp SỬA BẢNG — thêm một khối, đổi một nhóm, hay nới luật một-chỗ

[docs/adr/0006](docs/adr/0006-bang-mot-khai-niem-mot-cho.md) — **đọc trước khi gõ**: IA trước/sau, bằng chứng đếm được về chỗ trùng lặp, và **phần MẤT** của cả bốn quyết định. Hai luật cưỡng chế bằng máy ở `tests/overview-doc-smoke.mjs` vế 13–15, **tám đột biến đã chạy, cả tám chết ở đúng vế nó đo**. Lỗ đã biết, ghi trong ADR: luật một-chỗ đếm **tiêu đề** khối nên đổi tên là lách được

### Biết vì sao hai lệnh của vai điều phối lại phát đi từ đây, dù bộ khung đang ở chế độ bảo trì

[docs/adr/0005](docs/adr/0005-goi-assistant-phat-hanh-tu-bo-khung.md) — từ bản 1.3.0 bộ khung là **nơi phát hành** gói này; repo đã sinh ra nó thành người tiêu thụ. Hai bất biến cấm đổi ghi ngay trong ADR

### Hiểu bộ khung tự kiểm mình bằng gì, hoặc thêm test của repo bạn

`tests/` — [tests/harness-smoke.mjs](tests/harness-smoke.mjs) là các khối hạt giống; [tests/assistant-smoke.mjs](tests/assistant-smoke.mjs) ghim hai lệnh của vai điều phối, khối cuối tự dựng một repo hình dạng khác hẳn rồi chạy thật trong đó; chạy tất cả bằng `npm test`; [tests/giao-viec-smoke.mjs](tests/giao-viec-smoke.mjs) dựng kho git thật rồi đòi lệnh giao việc DỪNG đúng chỗ

### Nhìn lại đã migrate repo nào, ngày nào, bản nào, còn treo gì

**Tab "Migrate"** của [DASHBOARD-Ark-Repo-Harness.html](DASHBOARD-Ark-Repo-Harness.html) — bảng đối chiếu mọi lượt, rồi **mỗi lượt một tab con**. Đức chốt 06/09: quy về một mối, vì đường dẫn sang trang riêng nằm lẫn trong khối "Trang liên quan" nên trên thực tế không ai tìm ra. Trang riêng **thôi được nuôi từ bản 1.3.20** (Đức chốt 06/09: *"chỉ maintain tab Migrate"*) — bản cuối nằm ở [docs/archive/](docs/archive/SO-MIGRATE-Ark-Repo-Harness.html), lệnh `npm run so-migrate` vẫn chạy nếu cần gửi riêng sổ cho ai đó, nhưng nó **không còn là artifact repo phải giữ tươi**. Nguồn là `docs/migrations/`: mỗi lần migrate MỘT hồ sơ, **chỉ thêm**. Việc này xảy ra thưa nên không ghi là quên sạch. **Từ bản 1.3.35 bảng mốc có thêm cột _Tính năng_** — đọc từ khối checklist do `node scripts/features.mjs --migrate <repo>` sinh và dán vào hồ sơ, kèm **ngày đo** và **bản danh mục**; bảng lấy khối **CUỐI**, nên đo lại thì dán thêm khối mới xuống dưới chứ đừng sửa khối cũ. Ô ghi *chưa đo* nói về HỒ SƠ, không nói về repo

### Vá bộ khung rồi đẩy bản vá sang các repo đã lắp

`scripts/upgrade.mjs` — `npm run upgrade -- --plan <repo>` xem trước, `--apply` ghi. Sổ ghim `.ark/harness.lock.json` ở repo đích. **TỪ CHỐI ghi đè file đã bị sửa tay** — đó là lý do nó tồn tại, không phải để chép file

### Nạp hiểu cả repo trong một lần đọc (cho AI mới vào)

`llms.txt` ở gốc — cổng vào chuẩn llmstxt.org, **MÁY SINH**. Bản đồ máy đọc đi kèm: `repo-map.json`. Bảng cho người: `DASHBOARD.md`. Cả ba sinh lại bằng `node scripts/build-dashboard.mjs`, đừng sửa tay

### Xem bảng trạng thái trực quan (trang mẹ)

[DASHBOARD-Ark-Repo-Harness.html](DASHBOARD-Ark-Repo-Harness.html) ở gốc repo — **MÁY SINH, đừng sửa tay**. Mở thẳng bằng trình duyệt, không cần AI đăng hộ. Sinh lại: `npm run overview` (ghi đè file ở gốc, **có commit**); xem thử mà không chạm repo: `npm run overview -- <file-tạm.html>`. **BỐN NHÓM, không phải mười tab** (đổi 07/09 sau audit UX, [ADR-0006](docs/adr/0006-bang-mot-khai-niem-mot-cho.md)): **Tổng quan** đúng BA CÂU — đang làm gì · cần Đức làm gì · chỗ đang chặn — không gì khác · **Công việc** là thứ hành động được (việc chờ chốt · khoá vùng · sổ nợ · sổ ý tưởng · migrate) · **Hệ thống** là repo này chạy thế nào · **Lịch sử** là chuyện đã qua. **Mỗi khái niệm chỉ vẽ ĐẦY ĐỦ ở một nhóm**; chỗ khác chỉ một câu tóm tắt kèm liên kết — bản trước vẽ bản đồ file **ba lần** và năm khái niệm khác hai lần, và hậu quả không phải dài mà là **bảng nói hai con số khác nhau cho cùng một câu hỏi**. **Nhóm Lịch sử KHÔNG BAO GIỜ sinh ra việc**: dấu `@Đức:bấm` chỉ được đọc ở sổ CÒN SỐNG (`BACKLOG` · `IDEAS` · `STATUS`, khai ở hằng số `SO_CON_SONG`) — quét cả nhật ký thì mỗi lần một phiên KỂ LẠI một việc chờ là việc đó nhân thêm một lần, vĩnh viễn; đo được 8 trong 13 dấu là ảo. Tên file suy từ `repo.name`, muốn tên khác thì khai `generated_names.overview`. Nội dung suy **hoàn toàn từ HEAD**, cố ý: bộ sinh nhìn đồng hồ thì sang ngày là mọi phiên bị chặn đẩy dù không dữ liệu nào đổi. Ba file bộ sinh đi cùng nhau: `build-overview.mjs` dựng trang · `overview-doc.mjs` bộ đọc · `md-mini.mjs` đổi markdown

### Bảy chỗ hợp đồng lõi đã từng vỡ, và phép kiểm phá cho từng chỗ

`tests/core-contract.mjs` — bộ đo nói dối · đo được nghề khác · vòng đời một bảng · git hỏng không hoá số 0 · quy chủ theo tiền tố dài nhất · ADR xoá cũng bị bắt · khoá quyền nguyên tử

### Biết cổng đóng phiên có ĐỎ THẬT được không

[tests/cong-do-that.mjs](tests/cong-do-that.mjs) — mỗi khối dựng một kho thật, phá đúng MỘT thứ, rồi đòi ĐÚNG phép kiểm ấy đỏ. Một phép kiểm chưa từng đỏ và một phép kiểm **không thể** đỏ trông giống hệt nhau trên bảng — và bảng thì luôn xanh. **Đo 09/09: 12 trên 16 mục cổng có ca đỏ ở đây.** Bốn mục CHƯA có, và nói ra để không ai đọc file này như thể nó phủ cả cổng: *Khoá file đã trả hết* · *Sự thật máy sinh còn tươi* · *Cổng kiểm cấu trúc B1–B14* · *HANDOFF: mục mới trong trần*. Sửa cổng thì cập nhật lại con số này — nó là **số đo**, không phải lời hứa

### Sắp sửa cơ chế KHOÁ VÙNG — nhận, giữ, hay trả

[tests/khoa-dau-vet.mjs](tests/khoa-dau-vet.mjs) — 11 vế ghim tín hiệu *"repo chưa thấy dấu vết"*. Vế 7 ghim **mức nghiêm trọng**: tín hiệu này là VÀNG, nó **không** được đổi mã thoát của cổng — chặn một lane đang đọc kỹ là dạy mọi lane ghi bừa một byte để giữ khoá cho hợp lệ. Bốn đột biến đã chạy thật, ghi trong đầu file

### Sắp sửa KHOÁ MỨC FILE, hay thắc mắc vì sao có HAI loại khoá

[docs/adr/0012-khoa-muc-file.md](docs/adr/0012-khoa-muc-file.md) — số đo của CHÍNH repo này (620 cặp va chạm, **57% là chặn oan**, p90 **12 file** một lượt sửa), sáu quyết định, và một mục **"cái này KHÔNG chữa"** phải đọc trước khi tin: khoá không giữ file, *git* giữ, và khoá file làm chỗ đó **xấu đi** vì nó bỏ bớt sự serial hoá. Ghim ở [tests/khoa-file.mjs](tests/khoa-file.mjs) — 8 vế, 6 đột biến đã chạy

### Một cửa TỪ CHỐI đã trả lời đúng mà vẫn không chặn được gì

[docs/adr/0013-cua-tu-choi-mat-tin-hieu.md](docs/adr/0013-cua-tu-choi-mat-tin-hieu.md) — bổ sung ADR-0012. Ca thật 08/09: `claim.mjs --sua` TỪ CHỐI (mã thoát 3) nhưng lệnh chạy trong một **ống dẫn**, nên mã thoát của cả cụm là mã của `head` = 0, `&&` cho qua, và 67 dòng ghi vào vùng lane khác đang giữ. **Lớp bảo vệ có mặt, đã chạy, đã trả lời đúng — và vẫn không chặn được gì.** Cùng họ với `--soat`: tín hiệu mất trên đường. **Chưa vá bằng máy, và ghi rõ là chưa**

### Biết một số phiên bản bộ khung ứng với nội dung nào

[RELEASE-LEDGER.json](RELEASE-LEDGER.json) — mỗi bản ↔ dấu vân tay tầng máy, **CHỈ THÊM**. Sửa một dòng đã có là nói dối về một bản đã phát. Đổi nội dung `scripts/` hay `tests/` mà không tăng `version` thì sổ lệch, và ba chỗ cùng chặn: `npm test` · bộ sinh từ chối tự sửa · `upgrade.mjs` không phát đi được với **mọi** repo đích

### Git đối xử với file thế nào — để ngoài git, hay chốt kiểu xuống dòng

[.gitignore](.gitignore) — thứ nào **một tiến trình ghi đè liên tục** thì để ngoài git (hiện là ba file bản ra của [bang-song/](bang-song/loi.mjs)), vì commit nó là mọi phiên khác mở repo ra thấy cây làm việc bẩn. **Đừng lẫn với artifact máy sinh** (`DASHBOARD*` · `llms.txt` · `repo-map.json`) — mấy cái đó tất định từ HEAD nên **phải** commit, và cổng đối chiếu chúng mỗi phiên. · [.gitattributes](.gitattributes) — chốt kiểu xuống dòng cho CẢ repo, cả trong kho lẫn trong cây làm việc; không có nó thì máy Windows tự đổi lúc lấy file ra, một commit có hai dạng byte, và `git status` nói SẠCH ở cả hai (đo trước khi thêm: cùng một cây làm việc, 75 file LF và 21 file CRLF). Ngoại lệ duy nhất `*.cmd text eol=crlf` — đo thật bằng cách chạy CHÍNH một file `.cmd` ở hai dạng: LF thoát 1, CRLF thoát 0

### Biết cổng nào còn chạy sau khi mã rời máy

[.github/workflows/](.github/workflows/) — `cong-kiem.yml` chạy trên GitHub: bộ phép kiểm · cấu trúc B1–B15 · artifact máy sinh còn tươi. Nó KHÔNG thay cổng đóng phiên (cổng đó hỏi những câu chỉ có nghĩa trong một phiên: bạn tên gì, giữ vùng nào, đã ghi Log chưa), mà bịt chỗ hở duy nhất còn lại: mọi lớp bảo vệ khác chạy trên máy người dùng nên `git push` trần đi qua hết

### Sắp THÊM một luật, hay muốn biết luật nào đang hiệu lực về một chủ đề

`npm run luat` — **bộ biên dịch luật**, [scripts/rule-compiler.mjs](scripts/rule-compiler.mjs). Ba tầng, đừng lẫn: **sổ cái** (`docs/adr/` · `decisions.md` · `docs/archive/`, chỉ thêm, là LỊCH SỬ) → **bộ biên dịch** → **luật hiệu lực** (thứ một phiên thật sự phải đọc). Mỗi ADR khai `chu_de`, mỗi chủ đề có đúng một `dau_moi`, nên **mở một khối là ra câu trả lời** thay vì đọc bốn file rồi tự đoán cái nào thắng. Năm lệnh, đúng vòng đời `append → merge → supersede → trim → compile`: `--so-cai` xem SỔ CÁI · `--de-xuat` NÊU chỗ đáng gộp · `--check` chỉ kiểm · `--trim` nêu mục đáng cắt (**chỉ cắt thứ ĐÃ KHAI** `> **trạng thái:** đã thi hành`; ba lượt bắt oan 09/09 cho thấy một mục thường chứa CẢ việc đã xong LẪN một nguyên tắc còn sống) · **`--nap` là CONTEXT COMPILER** — in đúng thứ một phiên phải đọc, và con số đáng nhìn là tổng **KHÔNG** nạp: đo 09/09 nạp **284/300 dòng**, không nạp **4.499** — tức bảng này đang giữ 94% kho chữ ngoài mỗi lượt. **AI được đề xuất, KHÔNG được tự sửa hay xoá luật** — chỉ khai báo tường minh trong frontmatter mới làm đổi bộ luật, nên hai lượt chạy trên cùng HEAD luôn ra cùng kết quả. Cưỡng chế ở **B16** (nhóm CHẶN). Vì sao không gộp file ADR cho gọn: ADR `Accepted` là **bất biến** (B12) — ta gộp CÂU TRẢ LỜI, không gộp file. Ghim [tests/rule-compiler.mjs](tests/rule-compiler.mjs), 10 vế · 8 đột biến đã chạy, **2 sống sót lượt đầu** (cả hai cùng bệnh: fixture thiếu đúng ca cần phân biệt)

### Biết bộ khung đang nặng bao nhiêu, và luật nào chưa từng chặn được gì

`scripts/can-nang.mjs` (`npm run can-nang`) — bốn con số có ngân sách; quá thì phải BỚT trước khi nghĩ tới nới. Nhịp tháng, cố ý KHÔNG nằm trong cổng đóng phiên
