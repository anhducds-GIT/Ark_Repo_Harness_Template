# AGENTS.md — Hiến pháp repo (đọc đầu tiên, mọi AI)

> **Tầng 1: LUẬT, không phải lý lẽ.** Ở đây chỉ giữ thứ **máy không kịp nói cho bạn** — cơ chế nào
> máy tự chặn và tự giải thích lúc hỏng thì không nằm ở đây. Bằng chứng, số đo, và năm câu phải
> trả lời trước khi THÊM một luật: [VI-SAO-LUAT](docs/VI-SAO-LUAT.md).
> **Máy nào canh mục nào:** `features.json` → `luat_nha.canh`. **CÓ MẶT ≠ ĐANG BẬT · CHẬN ≠ BÁO.**
> **Trống mục 4 · 5 · 7 là CỐ Ý** — gộp vào mục 2 · 3 · 0; ~250 chỗ trỏ vào mục theo SỐ.
> Chủ dự án là **Đức** (non-tech, tiếng Việt, câu ngắn), người chốt duy nhất.

## 0. Ba việc phải làm, theo đúng thứ tự

1. **Mở phiên:** đọc file này → `STATUS.md` (một trang: đang ở đâu, việc kế, còn gì mở). Vùng bạn
   sắp GHI có `AGENTS.md` riêng hay `docs/ANNEX-*.md` thì đọc **trước lượt ghi đầu tiên** — phụ lục
   chỉ thêm điều cấm, và không đọc thì bạn không biết mình đang bị cấm. `HANDOFF.md` là Tầng 2,
   **không nạp mặc định**; mở khi cần biết phiên trước **vấp** gì.
2. **Làm việc:** một việc một lúc. Việc ngoài phạm vi → ghi `BACKLOG.md`, không tự làm.
3. **Đóng phiên:** chạy cổng kiểm. Đỏ thì chưa xong.

```bash
node scripts/session-check.mjs --as <tên-phiên-của-bạn>
```

**Không được BÁO "xong" khi cổng chưa xanh** — và đây là chỗ không máy nào đỡ được bạn: cổng biết
nó đỏ, nhưng không có gì ngăn một phiên gõ chữ *"xong"*. Cũng không được tự sửa cổng cho nó xanh.

> Luật nào không kiểm được bằng máy thì sớm muộn cũng bị bỏ qua. Đó là lý do có cổng kiểm.

**Đóng phiên ghi lại ba thứ** *(mục 7 cũ)*: một dòng Log vào `HANDOFF.md` — làm gì · kết quả SỐ ·
còn gì mở; trạng thái đổi thì sửa `STATUS.md`; quyết định mới của Đức → `decisions.md`; lỗi mới ở
một hệ thống bên ngoài → xếp nhà theo mục 8.

### 0b. THỨ TỰ ĐÓNG PHIÊN — sai thứ tự là tự nhân đôi thời gian

`sửa → commit → sinh lại artifact → commit → npm test → cổng → safe-push`

`npm test` chạy **SAU** commit (dấu xác nhận buộc vào HEAD): đúng thứ tự cổng **22 giây**, sai
**~9 phút**. **MỖI commit làm hỏng dấu, nên GOM commit** — chia việc thành 4 commit là trả giá 4
lượt đủ bộ, đo 09/09: **~28 phút**. Đang làm thì chạy **một** suite (`node scripts/chay-test.mjs
--chi <tên-suite>`); **đủ bộ chạy MỘT lần, ở cuối**, và bộ sinh ghi vào sổ có ràng buộc cũng chạy
**một lần**, sau khi suite xanh.

**Commit thì NÊU ĐƯỜNG DẪN; push thì KHÔNG dùng `git push`.** Một cây làm việc có ĐÚNG MỘT index,
nên mẻ `git add` của lane khác nằm trong commit của bạn (10/09: hai lần, hai chiều) — và cửa index
chỉ chặn được file lane khác **ĐANG KHOÁ**, việc chưa khoá thì không ai đỡ. `git push` trần **không
hook nào chặn**, và nó cuốn theo commit của mọi phiên khác.

```bash
git commit --only <đường dẫn>… -m "…"     # chỉ ĐƯỜNG DẪN bạn nêu — KHÔNG lọc theo tác giả
node scripts/safe-push.mjs --as <tên-phiên-của-bạn>
```

Sửa dở của lane khác **trong chính file bạn nêu** vẫn bị cuốn — nên soát index trước khi commit:
`node scripts/claim.mjs --soat --as <phiên>` (rộng hơn cửa index).

## 1. Ai giữ package nào — chống hai AI giẫm chân

Bảng chủ sở hữu là `.agents/claims.json`; nhận và trả **bằng lệnh**, không sửa tay.
**MẶC ĐỊNH LÀ KHOÁ MỨC FILE, khoá vùng để dành.** Khoá file chỉ sống trong **đúng lượt ghi**: nhận
**ngay trước** khi ghi, đúng những file mình sửa, và trả **ngay sau commit** chứa lượt ghi đó.
**Đọc · suy nghĩ · chạy test · chờ — KHÔNG được giữ khoá.** Cần ghi tiếp thì **nhận lại**, nhận
lại không tốn gì. **Chỉ đọc thì không cần khoá.** Mốc là **COMMIT**, không phải lúc gõ
xong — giứa hai nhịp đó, lane khác nhận được khoá và `git commit --only` cuốn luôn việc của họ.

```bash
node scripts/claim.mjs --sua <file>… --as <phiên>   # NGAY TRƯỚC lượt ghi · nhận cả mẻ
node scripts/claim.mjs --xong --het --as <phiên>    # NGAY SAU khi COMMIT · cổng ĐỎ nếu treo
node scripts/claim.mjs --list                       # ai đang giữ gì
node scripts/claim.mjs --take|--release <khoá> --as <phiên> --task "một câu"   # cả VÙNG
```

**MỖI LOẠI KHOÁ ĐÚNG MỘT MỐC, không loại nào có mốc thứ hai:** khoá **file** như trên · khoá
**vùng** trả sau khi ĐÃ ĐẨY. Mục cổng đỏ vì khoá file còn treo là **lưới đỡ cuối phiên, KHÔNG phải
hạn chót**; còn khoá VÙNG treo thì không mục cổng nào đỏ, nên mốc đó chỉ có bạn giữ.

**KHÔNG nhả khoá của LANE KHÁC, và không giành vùng lane khác đang giữ — đúng BA đường, không có
đường thứ tư:** chính lane đó trả · lane đó đã kết thúc · **Đức chốt**. Tín hiệu *"repo chưa thấy
dấu vết"* nói repo chưa thấy gì, **không** nói lane kia rảnh.

Ba luật cơ chế còn lại — chứa nhau hai chiều · chia gốc repo thành nhiều khoá · hai file được miễn —
máy tự chặn và tự nêu tên khoá thiếu: [MULTIFLOW](docs/protocols/MULTIFLOW.md).

## 2. Điều CẤM · BA việc phải hỏi Đức — mọi việc khác AI tự quyết

> **BẢN DUY NHẤT của danh sách này trong cả repo.** File khác chỉ được trỏ sang đây, không chép lại.

| # | Việc | Vì sao Đức, không phải máy |
|---|---|---|
| 1 | Xoá file, hoặc sửa dữ liệu gốc | Mất là mất, và đó là tài sản của chủ repo |
| 2 | Gửi bất cứ gì ra ngoài (mail, tin nhắn, đăng công khai) | Ra rồi thì không rút về |
| 3 | Tạo automation tự chạy | Nó chạy cả lúc không ai nhìn |

**BA thao tác nữa cũng phải hỏi, và chúng KHÔNG thuộc bảng trên** — loại khác: không lùi lại
được trên lịch sử git. Force-push · sửa lịch sử · merge vào `main`.

**Đức quyết ĐÁNH ĐỔI, máy quyết ĐÚNG/SAI.** Sáu cửa xuống ba (10/09); cái MẤT là **quyền phủ
quyết TRƯỚC** — [decisions](decisions.md).

**Điều CẤM** *(mục 4 cũ)* — không phải câu hỏi, và **không xin phép được**:

- `--carry` khi cổng chưa XANH TOÀN BỘ, hoặc có commit không quy thuộc được. `--carry` gõ tay
  **không máy nào chặn** (`KHUNG-56`) — điều cấm này hiện chỉ có bạn cưỡng chế.
- Để token / mật khẩu / file pairing vào repo. Cổng đọc thật từng file được track, nhưng nó
  **không chạy trong CI** và `git push` trần đi qua được nó.
- Sửa thư mục bằng chứng khai `"mutability": "append-only"` — **chỉ được THÊM**, không sửa, không
  xoá, không tạo lại.

**Phụ lục nghề** — `docs/ANNEX-*.md`, KHÔNG phải điều cấm mà là nguồn **THÊM** việc phải hỏi: nó
chỉ được thêm, không được bớt, và không máy nào kiểm chiều đó. Chưa có phụ lục thì bỏ đoạn này.

**Đổi luật an toàn: AI tự quyết** — đủ ba: audit độc lập sạch · `decisions.md` nói cái **MẤT** ·
không làm yếu lớp bảo vệ mà không **gọi tên** thứ mất đi.

**Commit và push tự làm** khi đủ ba: (1) việc hoàn tất trọn vẹn; (2) cổng XANH TOÀN BỘ, code thì
đã qua audit độc lập; (3) đẩy bằng `safe-push.mjs`. Đủ ba đó thì **`--carry` cũng tự làm**, miễn
mọi commit quy thuộc được.

## 3. Năm luật vàng — và ai nghiệm thu

1. **Không đoán.** Mọi khẳng định về một hệ thống thật phải có bằng chứng ĐO ĐƯỢC, và **báo ĐẠT khi
   chưa chạy thật là nói dối**. Cần bằng chứng mới → tự đi lấy, đừng mượn mắt Đức.
2. **Mỗi fix một test ghim.** Fixture phải DỰNG NỔI ca hỏng — phép kiểm không phân biệt được hai
   nhánh là đồ trang trí, dù nó xanh.
3. **Không làm yếu lớp bảo vệ đã có** để cho test xanh. Sửa bug được; gỡ bảo vệ thì không.
4. **Kiểm chứng độc lập mọi báo cáo của AI khác.** Tự chạy lại test, tự đọc lại diff. Agent phụ báo
   "xong" không phải bằng chứng.
5. **Viết cho mắt Đức đọc.** Đức đọc không hiểu = lỗi hệ thống, **viết lại đơn giản hơn**. Chữ
   operator nhìn thấy: tiếng Việt. Mã lỗi (CODE): tiếng Anh.

**Vai** *(mục 5 cũ)* **là của PHIÊN, không của hãng; một phiên đóng đúng một vai.** **① Giữ lõi** —
luật · bộ máy · trạng thái, mỗi bản vá kèm một phép kiểm ghim; KHÔNG nới lớp bảo vệ cho cổng xanh,
KHÔNG **tự ký nghiệm thu** việc của mình. **② Phát & thu** — cửa duy nhất ra ngoài, mang chỗ vấp về
thành mục sổ nợ; KHÔNG sửa lõi để bên ngoài chạy được, KHÔNG báo ĐẠT khi chưa chạy thật.

**Bất biến: người SỬA không tự NGHIỆM THU bản sửa của mình.** **Vai nào cũng được tìm lỗi ở bất kỳ
đâu** — tách "ai tìm" khỏi "ai sửa" là cấm Vai ① soi chính lõi nó giữ. Bàn giao qua sổ, không qua
tin nhắn: ② ghi `BACKLOG.md` kèm `đóng khi:`, ① đóng bằng bản vá cộng một phép ghim. Hai vai chạy
cùng lúc được, nhưng **khác vùng**.

## 6. Sổ tay mở khi cần — Tầng 2

**[BAN-DO-CHI-TIET](docs/BAN-DO-CHI-TIET.md) là bản đồ file chính thức** — mọi file, kèm *vì sao ·
có gì bên trong · đã vấp ở đâu*, **và mọi cửa vào Tầng 2**.
`.repo-structure.json` khai nó là bản đồ chính thức, nên **thêm file mới thì khai ở ĐÓ**; file
không ai trỏ tới thì coi như không có.

Không biết làm gì tiếp, hay sắp BÁO CÁO cho Đức: `npm run what-next` · `npm run state-check`.

## 8. Thêm một luật thì phải bớt một luật

Bộ khung chết vì phình, hiếm khi chết vì thiếu. **Mỗi luật có ĐÚNG MỘT nhà, chỗ khác chỉ trỏ
sang:** luật áp cho mọi repo → file này · Đức vừa chốt → `decisions.md`, một dòng · lý lẽ dài có
số đo và có **cái MẤT** → `docs/adr/` · thứ đang HỎNG → `BACKLOG.md` kèm `đóng khi:` · bằng chứng
sinh ra một luật đã có → `docs/VI-SAO-LUAT.md` · việc lặp lại hay hướng đi → sổ riêng.

**Luật mới phủ luật cũ thì XOÁ luật cũ ngay lượt đó** — hai bản cạnh nhau là hai câu trả lời cho
một câu hỏi, và phiên sau bốc trúng câu sai. Máy chỉ canh được **chỗ KHAI** (mỗi chủ đề một đầu
mối, `CLAUDE.md` không chứa luật lạ); nó **KHÔNG** đọc được rằng bản cũ đã bị xoá. Lịch sử ở `git log` và ADR, không ở chỗ đang cưỡng chế.

**CÃI một luật, hay THÊM một luật · một phép kiểm · một tài liệu — năm câu phải trả lời trước:**
[VI-SAO-LUAT](docs/VI-SAO-LUAT.md) · bộ biên dịch luật: `npm run luat`.
Cân nặng được ĐO, không để cảm tính:

```bash
npm run can-nang
```
