---
status: Accepted
adr: 0005
date: 2026-09-05
deciders: Đức (chốt 05/09 mở chặng B của đề bài đưa gói Assistant vào bộ khung)
---

# ADR-0005 — Gói Assistant phát hành từ bộ khung; repo nào dùng thì là người tiêu thụ

## Bối cảnh

Hai lệnh của vai điều phối — kiểm trạng thái trước khi báo cáo, và bản đồ việc — được xây và
chứng minh ở một repo sản phẩm, không phải ở đây. Cùng với chúng là một sổ tay ghi rõ vai điều
phối được làm gì và không được làm gì, và một bộ phép ghim.

Bốn thứ đó có giá trị ở **mọi** repo chạy nhiều phiên AI song song, không riêng repo đã sinh ra
chúng. Nhưng chúng đang nằm ở repo đó, nên repo thứ hai muốn dùng chỉ có hai đường: chép tay,
hoặc viết lại. Cả hai đều đẻ ra bản thứ hai của cùng một thứ — đúng cái bệnh bộ khung này sinh
ra để chữa.

Có một cản trở thật, phải nói thẳng: **ADR-0003 đã chuyển bộ khung sang chế độ bảo trì**, và một
trong ba điều nó chốt là *không mở hệ thống con mới nếu chưa có lỗi thật dựng được ca hỏng*. Gói
này là một hệ thống con mới.

## Quyết định

**Bộ khung là nơi phát hành gói Assistant, kể từ bản 1.3.0.** Repo đã sinh ra gói này trở thành
**người tiêu thụ và bản tham chiếu**, không còn là nơi giữ bản chuẩn.

Đây là một **ngoại lệ có tên** của ADR-0003, không phải việc mở lại chế độ phát triển. Ba lý do,
theo đúng ba câu hỏi mà luật bắt trả lời trước khi thêm bất cứ gì:

1. **Đã có chuyện xảy ra thật.** Trong một ngày làm việc, vai điều phối trượt vai một lần, một
   sai lệch trạng thái phải để người chốt tự bắt, và một lượt báo cáo dựa trên bảng đã cũ. Cả ba
   đều là ca hỏng dựng lại được, không phải lo xa.
2. **Nó thay chỗ một thứ đang có.** Không có gói này thì mỗi repo tự viết một bản. Phát từ một
   nơi là bớt đi n bản, không phải thêm một bản.
3. **Dựng nổi ca hỏng.** 52 phép ghim đi kèm, và khối cuối tự dựng một repo có hình dạng khác
   hẳn rồi chạy thật trong đó.

Kèm theo quyết định, **hai bất biến không được đổi khi ai đó vá gói này về sau**:

- **Không biết là một trạng thái riêng.** Đọc không được thì trả lời *không biết*, mã thoát
  riêng. Gộp nó vào *khớp* là biến mất mạng thành tin tốt, và một cổng nói "mọi thứ khớp" khi nó
  chưa nhìn thấy gì thì tệ hơn không có cổng.
- **Cấm tự sửa.** Thấy lệch thì báo và in câu lệnh cho người chạy. Không tự đẩy, không tự đóng
  dấu lại bảng quyền, không tự sinh lại rồi commit. Điều này được ghim bằng **cấu trúc** —
  một cửa chỉ-đọc duy nhất cho mọi lệnh chạm kho mã, cộng với phép đếm tiến trình con — chứ
  không bằng một dòng chữ dặn dò.

**Cố ý KHÔNG phát hành:** phép đối chiếu văn xuôi giữa bản khai trạng thái và nhật ký làm việc.
Nó suy đoán theo chữ, dễ báo oan, và một cổng hay báo oan sẽ bị phớt lờ.

## Hệ quả

**Được:**

- Repo dựng từ bộ khung nhận cả bốn thứ ngay, không phải chép tay.
- Một bản duy nhất được vá, và các repo nhận bản vá qua đường nâng cấp sẵn có.
- Bộ trích kiểm hộ một điều mà trước nay không ai kiểm: gói này có thật sự mang đi được không.
  Chính lượt phát hành đầu tiên đã bị chặn hai lần vì còn dấu vết tên dự án gốc.

**Mất, và phải nói thẳng:**

- **Chế độ bảo trì có thêm một ngoại lệ.** Ngoại lệ thứ hai sẽ dễ xin hơn ngoại lệ thứ nhất. Ghi
  ra đây để lần sau còn thấy cái giá đó.
- **Bộ khung nặng thêm hai lệnh, một sổ tay, một bộ phép ghim.** Cân nặng có ngân sách; lần đo
  định kỳ sau phải nhìn lại con số này.
- **Repo đã sinh ra gói mất quyền sở hữu bản chuẩn.** Từ nay sửa gói thì sửa ở đây. Việc ghi lại
  điều đó ở phía repo kia là một lượt riêng, cần quyền bên đó.

## Trạng thái

Accepted
