---
kind: guide
status: active
ttl_days: 365
---

# VÌ SAO có luật này — bằng chứng, và cách thêm một luật mới

> **File này có ĐÚNG MỘT luật, và nó là luật về việc THÊM LUẬT** — năm câu ngay dưới đây, và
> đây là nhà duy nhất của chúng (`AGENTS.md` mục 8 chỉ trỏ sang). Phần còn lại **không phát biểu
> luật**: nó là **sổ bằng chứng** — sự cố nào, ngày nào, đo được gì, đã mất gì — mở khi bạn định
> cãi một luật.
>
> Tách ra khỏi `AGENTS.md` ngày 09/09: lý lẽ chiếm gần một nửa thứ MỌI phiên phải nạp, ở MỌI
> repo, trong khi nó chỉ cần đọc **một lần trong đời**, lúc có người muốn đổi luật.

## Năm câu phải trả lời trước khi thêm một luật, một PHÉP KIỂM hay một TÀI LIỆU

Cả ba thứ, không riêng luật — một phép kiểm thừa và một tài liệu thừa cũng phình y hệt. Mỗi luật
đều hợp lý **lúc thêm vào**; cộng lại thì không: AI mất nửa phiên chỉ để đọc luật, luật mâu thuẫn
nhau, đóng phiên lâu tới mức người ta bỏ qua cổng.

1. **Đã có chuyện gì xảy ra thật chưa?** Chưa thì đừng thêm — viết vào `BACKLOG.md` và chờ.
2. **Nó thay chỗ cái nào?** Không thay được cái nào thì nói rõ vì sao đáng thêm hẳn.
3. **Dựng nổi ca hỏng cho nó không?** Không dựng nổi thì nó là chữ, không phải luật.
4. **Nó thuộc NHÓM nào?** Sáu nhà, xem `AGENTS.md` mục 8. **Máy canh câu này.**
5. **Nó có CHỦ NGỮ không, và nó phủ luật nào?** Ca thật: câu *"quá 30 phút thì nêu tên, KHÔNG tự
   nhả"* thiếu chủ ngữ, và một phiên đọc thành *"đừng trả khoá của mình"*.

## Mục 0b — thứ tự đóng phiên

Con số đo được 08/09 nằm ở `AGENTS.md` mục 0b — **một con số một chỗ**. Đây là nguyên nhân của
nó: *dấu xác nhận* buộc vào HEAD cộng băm cây làm việc, nên cổng không phải chạy lại suite;
commit SAU khi chạy test là đổi cây, dấu hỏng, cổng chạy lại từ đầu.

Cùng ngày, chạy bộ sinh trước khi suite xanh đã **đốt bảy số bản** — sổ phát hành cưỡng chế *một
số một nội dung*, nên mỗi lần sinh lại là một số mới không thu hồi được.

## Mục 0b — vì sao cấm `git push`

26/08: một phiên chạy `git push` và **cuốn theo commit của mọi phiên khác** đang dùng chung cây
git. Không ai cố ý, và không có cách nào lùi lại sau khi đã lên remote. `safe-push.mjs` liệt kê
rõ sắp đẩy gì của ai và từ chối khi bạn đang cuốn theo việc người khác.

## Mục 1 — khoá

**Vì sao nhận/trả bằng LỆNH, không sửa tay:** 02/09 một quyền đã **bị ghi đè im lặng** vì sửa tay
là đọc-sửa-ghi, hai phiên đọc cùng một bản rồi ghi đè nhau.

**Vì sao mặc định là khoá FILE, không phải khoá vùng** — Đức chốt 08/09: *"chỉ giữ khóa đúng ở
file mà AI đó đang sửa … giữ và trả ngay trước và sau khi sửa. Nếu chỉ đọc ko cần giữ khóa."*
Số đo hôm đó: **57%** lượt chặn là **chặn oan** — khác file hoàn toàn mà vẫn bị khoá vùng chặn.

**Vì sao có `--soat`:** khoá không giữ file, *git* giữ. Chung một cây làm việc thì `git commit -a`
vẫn cuốn file lane khác vừa dàn, và khoá mức file làm chỗ đó **xấu đi** vì nó bỏ bớt sự serial hoá.

**Vì sao không nhả khoá hộ lane khác:** 06/09 nhả hộ một lần vì `--list` báo *"repo chưa thấy dấu
vết"* — lane kia đang dựng nháp ngoài repo rồi mới ghi vào, và **mất phần đã xong**. Tín hiệu đó
nói repo chưa thấy gì, không nói lane kia rảnh.

**Vì sao `HANDOFF.md` và `claims.json` được miễn khoá vùng:** không miễn thì không ai trả lại
được quyền, và luật mục 7 bắt MỌI phiên ghi Log. Miễn chỉ khi **THÊM dòng** — sửa hay xoá dòng cũ
là viết lại lịch sử phiên khác.

## Mục 2 — sáu việc phải hỏi

Danh sách này từng có **ba bản chép tay nói ba kiểu khác nhau**. Nay `AGENTS.md` giữ bản duy nhất
và file khác chỉ được trỏ sang.

Luật `--carry` đổi 09/09 sau ba lượt phải dừng hỏi trong hai ngày: đủ ba điều kiện thì tự làm.
Bản duy nhất ở `AGENTS.md` mục 2. Cái được: commit chưa push là **vô hình** với vòng kiểm tra
chéo, nên đẩy sớm là an toàn hơn. Cái mất: Đức thôi được báo từng lượt việc của lane khác lên
GitHub. Cùng ngày phát hiện **bốn bản chép trôi lệch** trong một ngày — hai bản dạy khoá vùng
làm mặc định, hai bản dạy luật `--carry` cũ; ghim thành `core-contract` F20.

## Mục 6 — vì sao bảng tra tách ra

09/09: bảng tra đầy đủ chiếm **10.029 / 13.799 token — 73%** của thứ mọi phiên phải nạp, để rốt
cuộc mở một hai file. Luật thật chỉ 3.770. Bảng đầy đủ sang `docs/BAN-DO-CHI-TIET.md`, được
`.repo-structure.json` khai là bản đồ chính thức.

Cũng 09/09, phép ĐO bị phát hiện sai đơn vị: `--nap` đếm **DÒNG** và báo `284/300 — ĐẠT` trong
khi thực tế 13.800 token. Đếm dòng là đo một đại lượng không liên quan tới cái đang tốn tiền. Nay
`--nap`, cổng đóng phiên và `can-nang` dùng chung một phép đo bằng **token** (`budget.tokenNap`).

**Vì sao bảng phải là liên kết bấm được:** đo thật lúc dựng bộ khung — để bảng rỗng thì 4 file
rơi ra ngoài bản đồ, kể cả chính `README.md`.

## Mục 0 — vì sao mở phiên đọc `STATUS.md`, không đọc `HANDOFF.md`

`HANDOFF.md` là sổ **chỉ-thêm**: nó dài mãi, và phần đuôi là *một lượt việc*, không phải *trạng
thái*. Một phiên mở ra cần biết đang ở đâu và việc kế là gì — đó đúng là `STATUS.md`, một trang,
khai bằng tay, và đã là nguồn cho bảng trạng thái. Phiên nào cần biết phiên trước **vấp** gì thì
mở `HANDOFF.md`, Tầng 2. Đức chốt 09/09.
