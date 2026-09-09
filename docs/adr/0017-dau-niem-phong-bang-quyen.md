---
status: Accepted
adr: 0017
chu_de: khoa
thuoc: 0012
date: 2026-09-09
deciders: Đức
---

# ADR-0017 — Dấu niêm phong bảng quyền: cưỡng chế câu luật đã viết từ lâu

## Bối cảnh — luật có, cưỡng chế không

`AGENTS.md` mục 1 viết *"Nhận và trả **bằng lệnh**, không sửa tay"* từ 02/09. Câu đó đúng, và
**không có gì kiểm nó**. `claim.mjs` bảo vệ ĐƯỜNG GHI; nó không bảo vệ chính `claims.json` khỏi
bị mở ra sửa.

Repo tiêu thụ `Chrome_Extension_AI_Agentic` đã trả giá thật ngày 03/09: **cả bốn khoá gốc bị đổi
chủ bằng một lượt sửa hàng loạt**, đi vòng qua lệnh, và phiên đang giữ khoá không hề biết. Họ xây
lớp bảo vệ này; bộ khung nhà — nơi phát hành luật đó — **không có dòng nào**.

Phát hiện 09/09 khi soát repo đích trước lượt migrate: nếu migrate bằng `--force`, bộ khung sẽ
**xoá lớp bảo vệ đó khỏi chính repo đã phát minh ra nó**. Đức chốt: kéo về nhà trước, rồi mới đẩy.

## Quyết định

Hai lớp, và **lớp ghi mới là lớp chính**:

- **`ghiBangNguyenTu`** — ghi file tạm rồi `rename`. Không còn cửa sổ nào bảng nằm dở dang; một
  lượt ghi đứt giữa chừng trước đây là mất trắng bảng quyền của mọi lane.
- **Dấu băm khối `claims` (+ `tam`)** ghi vào chính file. Sửa tay làm dấu vỡ, và cổng đóng phiên
  của **bất kỳ phiên nào** cũng thấy — kể cả phiên vừa bị mất khoá.

Mọi đường ghi đi qua **một hàm duy nhất** `ghiBang()`; phép ghim đo bằng **sự vắng mặt** của
`writeFileSync(CLAIMS_FILE…)` trong nguồn, vì một nhánh ghi thẳng là một nhánh sinh ra bảng vỡ
dấu và phiên sau lãnh đủ.

**Đóng dấu, KHÔNG so hai ảnh chụp.** Hướng hiển nhiên — so bảng cũ với bảng mới rồi bắt *"chủ đổi
thẳng từ người này sang người kia"* — **báo oan**: một khoá đi từ lane A sang lane B trong đúng
một diff, mà chuỗi thật là TRẢ rồi NHẬN. Ảnh chụp không phân biệt được "trả rồi nhận" với "ghi đè".

**`--restamp` không được là cửa sau.** Sửa tay → restamp → dấu hợp lệ là hợp thức hoá đúng việc
luật cấm. Nên nó **đối chiếu HEAD**, và khi lượt sửa đó **chuyển chủ** một khoá thì đòi
`--duc-duyet "<câu chốt>"`, và câu đó **ghi VÀO bảng** — phiên vừa mất khoá chỉ đọc bảng, không
chạy lệnh.

Cổng: gộp vào mục **"Ai đứng tên việc này"**, không thành mục thứ 26 — cùng chủ đề, và thêm một
mục để cưỡng chế một luật chống-lách thì đúng cái mục 8 cấm.

## Cái MẤT — nói thẳng

⑴ **Không chống người cố tình.** Ai muốn thì tính lại dấu được. Nó chặn **đường tắt**, không chặn
kẻ địch — và đường tắt mới là thứ đã xảy ra thật. Muốn mạnh hơn cần sổ cái chỉ-thêm cho từng lượt
nhận/trả; ghi `BACKLOG`, chưa xây vì chưa cần.

⑵ **Một trường mới trong bảng.** `_fingerprint` là chữ máy sinh nằm giữa bảng người đọc. Đổi lại:
nó nằm ĐÚNG chỗ nó bảo vệ, không phải một file thứ hai phải giữ đồng bộ.

⑶ **Bảng cũ chưa có dấu thì cổng BỎ QUA, không ĐỎ.** Ba trạng thái cố ý không gộp: *chưa đóng
dấu* ≠ *còn nguyên* ≠ *đã vỡ*. "Chưa kiểm" không được đội lốt "đã đạt", và cũng không được làm
đỏ một repo chưa kịp chạy `--restamp` lần đầu.
