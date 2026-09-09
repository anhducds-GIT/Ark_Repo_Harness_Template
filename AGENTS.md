# AGENTS.md — Hiến pháp repo (đọc đầu tiên, mọi AI)

> **Tầng 1: LUẬT, không phải lý lẽ.** Ở đây chỉ giữ thứ **máy không kịp nói cho bạn** — cơ chế nào
> máy tự chặn và tự giải thích lúc hỏng thì không nằm ở đây. Bằng chứng, số đo, ngày tháng, và
> năm câu phải trả lời trước khi THÊM một luật: [VI-SAO-LUAT](docs/VI-SAO-LUAT.md).
> Chủ dự án là **Đức** (non-tech, tiếng Việt, câu ngắn), người chốt duy nhất.

## 0. Ba việc phải làm, theo đúng thứ tự

1. **Mở phiên:** đọc file này → `STATUS.md` (một trang: đang ở đâu, việc kế, còn gì mở). Vùng bạn
   sắp GHI có `AGENTS.md` riêng hay `docs/ANNEX-*.md` thì đọc **trước lượt ghi đầu tiên** — phụ lục
   chỉ thêm điều cấm, và không đọc thì bạn không biết mình đang bị cấm. Cần biết phiên trước **vấp**
   gì thì mở `HANDOFF.md` — Tầng 2, không nạp mặc định.
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
**vùng** trả sau khi ĐÃ ĐẨY. Cổng ĐỎ khi khoá file còn treo là **lưới đỡ**, không phải hạn chót.
Khoá file không mang trách nhiệm truy nguồn — nhãn `Lane:` mang.

**KHÔNG nhả khoá của LANE KHÁC**, kể cả khi `--list` báo *"repo chưa thấy dấu vết"* — tín hiệu đó
nói repo chưa thấy gì, không nói lane kia rảnh. **MÁY cũng không tự nhả:** quá 30 phút `--list`
chỉ NÊU TÊN lane đang giữ. Ba đường hợp lệ: chính lane đó trả · lane đó đã kết thúc · Đức chốt.

Ba luật cơ chế còn lại — chứa nhau hai chiều · chia gốc repo thành nhiều khoá · hai file được miễn —
máy tự chặn và tự nêu tên khoá thiếu: [MULTIFLOW](docs/protocols/MULTIFLOW.md).

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
5. **Viết cho mắt Đức đọc.** Đức đọc không hiểu = lỗi hệ thống, **viết lại đơn giản hơn**. Chữ operator nhìn thấy: tiếng Việt. Mã lỗi (CODE): tiếng Anh.

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

**Bất biến: người SỬA không tự NGHIỆM THU bản sửa của mình.** **Vai nào cũng được tìm lỗi ở bất
kỳ đâu** — tách "ai tìm" khỏi "ai sửa" là cấm Vai ① soi chính lõi nó giữ. Bàn giao qua sổ, không
qua tin nhắn: ② ghi `BACKLOG.md` kèm `đóng khi:`, ① đóng bằng bản vá cộng một phép ghim. Hai vai
chạy cùng lúc được, nhưng **khác vùng**.

## 6. Sổ tay mở khi cần — Tầng 2

> **Bản đồ file đầy đủ ở [BAN-DO-CHI-TIET](docs/BAN-DO-CHI-TIET.md)** — mọi file, kèm *vì sao · có
> gì bên trong · đã vấp ở đâu*. `.repo-structure.json` khai nó là bản đồ chính thức, nên **thêm
> file mới thì khai ở ĐÓ**. Dưới đây là bảy cửa hay dùng nhất.

| Khi bạn sắp… | Mở file |
|---|---|
| **Cãi một luật, hay THÊM một luật** | [VI-SAO-LUAT](docs/VI-SAO-LUAT.md) · [rule-compiler](scripts/rule-compiler.mjs) |
| **Tra nhanh Đức đã chốt gì, ngày nào** | [decisions](decisions.md) |
| **Ghi việc ngoài phạm vi, hay xem repo còn nợ gì** | [BACKLOG](BACKLOG.md) · [IDEAS](IDEAS.md) |
| **Biết phiên trước vấp gì** | [HANDOFF](HANDOFF.md) |
| **Làm cùng lúc với AI khác, hay tra một thuật ngữ** | [MULTIFLOW](docs/protocols/MULTIFLOW.md) · [LEGEND](docs/LEGEND.md) |
| **Mới vào, hay làm một việc lặp lại** | [HUONG-DAN](docs/HUONG-DAN.md) · [SO-TAY-AGENT](docs/SO-TAY-AGENT.md) · [README](README.md) |
| **Không biết làm gì tiếp / sắp BÁO CÁO cho Đức** | `npm run what-next` · `npm run state-check` |

**Phải là liên kết bấm được, không phải chữ thường.** Máy kiểm xem mỗi file có được file nào trỏ
tới không; **file không ai trỏ tới thì coi như không có**.

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

**Luật mới phủ luật cũ thì XOÁ luật cũ ngay lượt đó** — hai bản cạnh nhau là hai câu trả lời cho
một câu hỏi, và phiên sau bốc trúng câu sai. Lịch sử ở `git log` và ADR, không ở chỗ đang cưỡng chế.

**Năm câu phải trả lời trước khi thêm một luật, một phép kiểm HAY một tài liệu:**
[VI-SAO-LUAT](docs/VI-SAO-LUAT.md).

Cân nặng được ĐO, không để cảm tính — cảm tính luôn nói "thêm một cái nữa thì có sao đâu":

```bash
npm run can-nang
```
