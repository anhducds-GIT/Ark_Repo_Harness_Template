---
status: Accepted
adr: 0009
chu_de: vai-phien
sua: 0008
date: 2026-09-08
deciders: Đức giao chấm chéo bằng Codex; ba khẳng định dưới đây do phiên Codex bác, và bác đúng
---

# ADR-0009 — Sửa ba khẳng định của ADR-0008; quyết định gốc vẫn đứng

## Vì sao có file này thay vì sửa ADR-0008

**Tôi đã sửa thẳng vào ADR-0008 sau khi nó `Accepted`, và B12 bắt được.** Luật ADR-0000 mục 1 nói
rõ, không có ngoại lệ: *"Không sửa nội dung, **kể cả sửa lỗi chính tả**"*. Tôi vừa làm đúng điều
tôi cả đêm bắt phiên khác không được làm — và tôi chỉ dừng lại vì **máy chặn**, không vì tự nhớ ra.

Nên phần thân ADR-0008 đã được hoàn nguyên về đúng bản `cb624fa`. Ba chỗ sai của nó **không bị
xoá** — chúng ở lại trong biên bản, và file này nói chúng sai ở đâu. Đó là cả điểm của một biên
bản bất biến: nó ghi cả lượt sai, không chỉ kết luận cuối.

**ADR-0008 KHÔNG bị thay thế.** Quyết định gốc — hai vai chia theo việc — vẫn nguyên hiệu lực.
Chỉ **ba khẳng định bên trong nó** sai.

---

## Sửa ⑴ — bất biến bị viết SAI, và đây là lỗi nặng nhất

**ADR-0008 mục ⑵ viết:** *"Vai ② được phát hiện, Vai ① được sửa."*

**Sai.** Phiên Codex chỉ ra câu đó dễ bị đọc thành **"người sửa không được tìm lỗi"** — một ràng
buộc vô lý: nó cấm Vai ① soi chính cái lõi nó đang giữ, tức cấm đúng việc nó tồn tại để làm.

**Đúng là:** *"**người SỬA không tự NGHIỆM THU bản sửa của mình**."* Vai nào cũng được tìm lỗi ở
bất kỳ đâu. Thứ phải tách là **người ký** khỏi **người sửa** — không phải người tìm khỏi người sửa.

Nặng vì tôi **không chỉ viết sai luật, tôi còn ghim nó**: phép kiểm trong `overview-smoke.mjs` đo
đúng thứ tự *"② phát hiện … ① sửa"*, tức nó canh **cái sai** và sẽ đỏ nếu ai đó sửa cho đúng.
Một phép ghim sai còn nguy hơn không có phép ghim: nó biến lỗi thành thứ được bảo vệ.

Đã sửa ở bốn chỗ: hiến pháp hai repo · khối hai vai trên bảng · phép ghim. Bảng có thêm một câu
**chống đọc nhầm**, vì chính tôi đọc nhầm khi viết — một câu luật đọc nhầm được thì sẽ bị đọc nhầm.
Đo đột biến sau khi sửa: **2/2 bắt được** (gỡ câu chống đọc nhầm · đổi bất biến về bản cũ).

## Sửa ⑵ — "chưa repo nào cưỡng chế đủ, nên luật chưa có răng"

Hai chỗ hỏng trong một câu:

- ⓐ *"chưa repo nào"* là khẳng định trên **toàn bộ tập repo** trong khi tôi chỉ kiểm hai.
- ⓑ **thiếu kiểm bằng máy không đồng nghĩa không có răng.** Một người có quyền từ chối nghiệm thu
  là răng thật. Tôi gộp *"máy chưa kiểm"* với *"không ai giữ"*, và gộp theo hướng tự bào chữa.

**Đúng là:** hiến pháp giữ **nghĩa vụ**; **trạng thái triển khai** thuộc về `BACKLOG.md`. Đó là
chỗ `KHUNG-8` đang nằm, và đó là chỗ đúng của nó.

## Sửa ⑶ — mục 8 chưa được thoả trọn, và tôi không cãi

Mục 8 hỏi ba câu. Lượt thêm luật hai vai trả lời được **một rưỡi**:

| Câu của mục 8 | Trả lời thật |
|---|---|
| Đã có chuyện gì xảy ra thật chưa? | **KHÔNG.** Không sự cố nào do bảng cũ gây ra. Cái đo được chỉ là bảng cũ **không đo được** — khiếm khuyết về khả năng kiểm, không phải một vụ hỏng |
| Nó thay chỗ cái nào? | **ĐẠT** — bảng chia theo hãng, đã xoá, không giữ song song |
| Dựng nổi ca hỏng cho nó không? | **MỘT PHẦN** — dựng được cho vế bàn giao và vế không-tự-nghiệm-thu; **không** dựng được cho *"phiên này có đóng đúng vai nó khai không"* |

Codex nói thẳng: *"'một vào một ra' chỉ trả lời câu thứ hai."* Đúng.

**Hệ quả phải ghi ra:** luật hai vai vào repo với **một rưỡi trên ba**. Nếu ba tháng nữa không có
sự cố nào nó ngăn được, nó là **ứng viên để xoá** — và dòng này tồn tại để lượt đó có chỗ bám.

---

## Điều KHÔNG sửa

Phần bối cảnh của ADR-0008 (không đo được hãng từ tên lane) **đã đúng ở bản `cb624fa`** — nó vốn
đã ghi phản biện Codex lượt một và đã tự sửa trước khi Accepted. Không đụng.

## Cái MẤT

- **Biên bản dài hơn:** một quyết định nay trải hai file, và người đọc phải đọc cả hai.
- **Ba khẳng định sai vẫn nằm trong repo, vĩnh viễn.** Cố ý — đó là cái giá của biên bản bất biến,
  và nó rẻ hơn cái giá của một biên bản sửa được.
