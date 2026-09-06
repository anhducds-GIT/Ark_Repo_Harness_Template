# CHANGELOG — LƯU TRỮ, bản 1.3.0

> **CHỮ GIỮ NGUYÊN, chỉ ĐỔI CHỖ.** Cắt từ `CHANGELOG.md` bằng `npm run don`.
> Sổ phát hành là file CHỈ-THÊM nên phình vô hạn — 335 dòng / ngân sách 300.
> Không dòng nào bị sửa, không dòng nào bị bỏ. Bản mới nhất vẫn ở [CHANGELOG.md](../../CHANGELOG.md).

## 1.3.0 — 2026-09-05 — Repo mới nhận luôn hai lệnh của vai điều phối, kèm sổ tay và phép ghim

Trước bản này, một repo vừa dựng từ bộ khung nhận được bộ máy chống hai AI giẫm chân nhau, nhưng
**không nhận được gì để trả lời hai câu hỏi mà người chốt hỏi mỗi ngày**: *đang có gì* và *làm gì
tiếp*. Ai muốn có thì phải tự viết lại — tức mỗi repo một bản, và các bản trôi khỏi nhau.

Bản này đóng gói bốn thứ đi cùng nhau, cố ý không tách:

- **Lệnh kiểm trạng thái trước khi báo cáo.** Nó hỏi *"điều tôi sắp nói có đúng với nguồn thẩm
  quyền không"*, khác hẳn cổng đóng phiên vốn hỏi *"việc tôi làm đẩy được chưa"*. Ba câu trả lời,
  cố ý không gộp: khớp · lệch · **không biết**. Không đọc được thì nói không biết — gộp nó vào
  "khớp" là biến mất mạng thành tin tốt.
- **Lệnh bản đồ việc.** Giao ba nguồn vốn không giao được với nhau: ai đang giữ vùng nào · từng
  đơn vị còn nợ gì · sổ ý tưởng. Nó cưỡng chế đúng một câu về làm song song: hai việc chạy cùng
  lúc được **khi và chỉ khi** thuộc hai vùng khác nhau và cả hai đang trống chủ.
- **Sổ tay vai điều phối.** Công cụ mà không kèm hàng rào thì hàng rào là thứ đầu tiên mất: sổ
  này ghi rõ vai điều phối **không** viết mã, **không** gỡ lỗi, **không** kê bản vá.
- **Phép ghim của cả gói** — 52 phép. Khối cuối tự dựng một repo thật có hình dạng **khác hẳn**
  repo phát hành (tên vùng khác · không có đơn vị con · thiếu cả ba quyển sổ · không có nơi đối
  chiếu từ xa) rồi chạy thật trong đó. Chạy được ở repo giống nhà thì mới là chép, chưa phải mang
  đi được.

**Hai lệnh này CHỈ ĐỌC.** Chúng không nhận vùng, không sửa file, không tự chữa. Thấy lệch thì báo
và in ra câu lệnh cho người chạy — tuyệt đối không tự đẩy, không tự đóng dấu lại bảng quyền,
không tự sinh lại rồi commit. Điều đó được ghim bằng **cấu trúc**, không bằng lời hứa: mọi lệnh
chạm kho mã đi qua đúng một cửa chỉ-đọc, và cả file chỉ được phép sinh đúng một tiến trình con.

Hai chỗ phải đổi vì cổng bắt, ghi ra để đừng ai "dọn cho gọn" rồi làm bản sau không phát được:
bộ trích từ chối mọi file mang tên dự án gốc, nên một danh sách cấm trong phép ghim nay **ghép
tên từ mảnh** thay vì viết liền, và sổ tay thôi kể thẳng ba tên gói cũ.

Repo dựng từ bản này chạy được cả hai lệnh **ngay, không sửa gì**, và bộ kiểm của nó xanh từ
ngày đầu.

---

**Bản 1.2.20 trở về trước đã dời sang** [docs/archive/CHANGELOG-0.1.0-1.2.20.md](docs/archive/CHANGELOG-0.1.0-1.2.20.md) — chữ giữ nguyên từng dòng.
