---
kind: features
status: active
ttl_days: 365
---

# Nó làm được gì cho bạn

> Viết cho người **không đọc code**. Mỗi mục trả lời đúng một câu: *việc gì được làm hộ, và nếu
> không có nó thì hỏng ra sao.* Câu lệnh để ở cuối mục, chữ nhỏ — ai cần thì dùng, không cần thì
> bỏ qua.

## Canh cửa

### Không cho báo "xong" khi việc chưa xong
Trước khi một phiên làm việc được phép kết thúc, nó phải qua một cửa kiểm. Cửa này chạy toàn bộ
bài kiểm tra, đối chiếu các trang tự sinh với lịch sử thật, và xem người làm có đụng vào phần của
người khác không. **Đỏ thì chưa xong. Không có đường vòng, và không được nới cửa cho nó xanh.**

*Không có nó:* "xong rồi" trở thành lời tự khai, và không ai kiểm được.
`npm run gate -- --as <tên-phiên>`

### Không cho hai người sửa cùng một chỗ
Repo chia thành vài vùng. Mỗi vùng chỉ một người giữ tại một thời điểm. Ai muốn sửa thì nhận
vùng; vùng đã có chủ thì chỉ được đọc.

*Không có nó:* hai AI cùng sửa một file, người ghi sau xoá việc người ghi trước — và **không ai
biết**, vì cả hai đều báo xong.
`npm run claim -- --take <vùng> --as <tên-phiên>`

### Không cho đẩy nhầm việc của người khác
Nhiều phiên dùng chung một thư mục. Lệnh đẩy thông thường sẽ cuốn theo việc dở dang của mọi
phiên khác. Lệnh ở đây liệt kê rõ sắp đẩy gì của ai, và **từ chối** nếu bạn đang cuốn theo việc
người khác.

*Không có nó:* việc chưa được duyệt bị công bố ra ngoài. Chuyện này đã xảy ra thật một lần.
`npm run push -- --as <tên-phiên>`

## Bảng và giấy tờ

### Bảng trạng thái tự viết, không ai gõ tay
Trang tổng quan của repo được **sinh ra từ lịch sử thật**, không phải gõ. Và cửa kiểm đối chiếu
lại mỗi phiên, nên một trang cũ không thể lặng lẽ cũ.

*Không có nó:* bảng nói một đằng, repo một nẻo — và bảng thì luôn đẹp hơn.
`npm run dashboard` · `npm run overview <file.html>`

### Bản đồ "khi bạn sắp làm X thì mở file nào"
Một bảng duy nhất trả lời câu hỏi thường gặp nhất của người mới vào: *tôi định làm việc này, đọc
gì trước?* Thêm file mới mà không khai vào bản đồ thì cửa kiểm báo đỏ.

*Không có nó:* tài liệu vẫn có, nhưng không ai tìm ra, nên coi như không có.

## Mở rộng ra repo khác

### Đo một repo cách chuẩn bao xa — trước khi bỏ công
Chấm điểm 0–3 và tách chi phí làm **ba loại việc khác giá**: *thả* (chép là xong) · *viết* (người
phải ngồi viết) · *soi* (có rồi nhưng lệch, phải mở ra đọc).

Cố ý **không** gộp thành một phần trăm — *"72% đạt chuẩn"* có thể là nửa giờ, cũng có thể là một
buổi, và bạn không lên lịch được bằng con số đó.

*Không có nó:* quyết định làm hay không làm dựa trên cảm giác.
`npm run assess -- <đường-dẫn-repo>`

### Dựng một repo mới bằng một lệnh
Thay cho sáu bước làm tay mà **thứ tự quan trọng** — và làm sai thứ tự thì hỏng im lặng. Repo
dựng ra sạch ngay: cửa kiểm xanh, bài kiểm tra chạy được từ phút đầu.

*Không có nó:* mỗi repo mới là một lần chép tay, và mỗi lần chép tay là một lần lệch đi một chút.
`npm run init -- <thư-mục> --ten "Tên repo"`

## Giữ cho không trôi

### Sổ tay bắt buộc cho việc lặp lại
Việc nào làm nhiều lần thì có một danh sách kiểm cố định. AI đọc sổ tay rồi làm theo, không tự
nghĩ ra cách mới mỗi lần.

*Không có nó:* mỗi phiên làm một kiểu, và sau mười phiên thì không còn "cách làm của repo này"
nữa.

### Lịch bảo trì định kỳ
Repo tự có lịch quét: liên kết chết, tài liệu quá hạn, cảnh báo tồn đọng, quyền bị bỏ quên. Đến
hạn thì AI làm, không chờ ai nhắc.

*Không có nó:* nợ tích dần cho tới lúc không ai dám động vào.
