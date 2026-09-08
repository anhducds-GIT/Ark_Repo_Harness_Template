---
status: Accepted
adr: 0012
chu_de: khoa
dau_moi: true
date: 2026-09-08
deciders: Đức
---

# ADR-0012 — Khoá mức file: giữ ngắn, trả ngay; chỉ đọc thì không khoá

## Bối cảnh

Đức nêu 2026-09-08, nguyên văn:

> *"AI Assistant chỉ giữ khóa đúng ở file mà AI đó đang sửa, các file khác không giữ, khóa được
> giữ và trả ngay trước và sau khi AI sửa → tỉ lệ dẫm chân lên nhau giữa 2 AI sẽ giảm đi đáng kể
> … Nếu chỉ đọc ko cần giữ khóa. → giảm thời gian giữ khóa hàng tiếng nếu tác vụ dài xuống chỉ
> còn vài phút khi nào cần sửa."*

Cơ chế đã chạy thật ở repo tiêu thụ `Chrome_Extension_AI_Agentic` trước (ADR-0025 của repo đó).
Đây là lượt mang **lên nơi phát hành** để mọi repo cùng có.

### Số đo — đo lại ở CHÍNH repo này, không mượn số của họ

Repo tiêu thụ đo được 70% số lượt chặn là chặn oan. Con số đó là của họ; luật buộc phải đo lại.
7 ngày (`--since=2026-09-01`), **384 commit**, **381 có nhãn `Lane:`**, **41 lane khác nhau**:

| Đo | Số |
|---|---|
| Cặp commit **khác lane**, cách nhau **≤ 1 giờ**, **cùng vùng** | **620** |
| ├ trong đó **dùng chung ít nhất một FILE** — khoá file không gỡ được | 265 (**43%**) |
| └ trong đó **khác file hoàn toàn** — khoá file GỠ ĐƯỢC | **355 (57%)** |
| File / commit: trung vị · p90 · p99 · max | 3 · **12** · 30 · 42 |

**Hơn một nửa số lượt chặn hôm nay là chặn oan.** Thấp hơn repo tiêu thụ (57% so với 70%) — hợp lý,
vì repo này nhỏ hơn và nhiều commit chạm cùng mấy file luật.

**Và p90 = 12 file một lượt sửa, cao gần gấp đôi repo tiêu thụ (7).** Con số đó quyết định hình
dạng lệnh: `--sua` **phải** nhận cả mẻ đường dẫn trong MỘT lệnh. Bắt gọi mười hai lệnh là bảo đảm
luật *"nhận ngay trước lượt ghi"* quay về làm chữ, vì làm đúng quá phiền.

Luật *"nhận khoá NGAY TRƯỚC lượt ghi đầu tiên"* **đã có** trong `AGENTS.md` mục 1 từ trước. Không
ai theo, và **không gì đo nó** — đúng hình dạng một luật-là-chữ. Bằng chứng của chính phiên viết
ADR này: bốn khoá vùng nhận lúc mở phiên và giữ suốt, trong khi phần lớn thời gian là đọc.

## Quyết định

**⑴ Mặc định là khoá FILE.** `--sua <đường-dẫn>… --as <phiên>` trước lượt ghi,
`--xong --het --as <phiên>` ngay sau. Khoá vùng vẫn còn, để dành cho lượt thật sự sửa khắp vùng.

**⑵ Chỉ đọc thì không khoá gì.** Không đổi luật — nói lại cho rõ, và nay có đường thay thế đủ rẻ
để không ai còn cớ nhận cả vùng "cho chắc".

**⑶ Chứa nhau HAI CHIỀU.** Vùng có chủ khác → khoá file bị từ chối (giữ cả vùng là được ghi mọi
file trong đó). Bên trong còn khoá file của người khác → nhận cả vùng bị từ chối. **Thiếu một
chiều là hai lane cùng tin mình được ghi, và không lớp nào kêu.**

**⑷ Cổng đóng phiên ĐỎ nếu còn treo khoá file.** Mốc là *hết phiên*, **không** phải *đã đẩy* — và
đây là chỗ khác khoá vùng, đừng lẫn. Khoá vùng trả sau khi đẩy vì commit chưa đẩy trong một vùng
vô chủ để lại mục đỏ cho phiên sau. Khoá file **không mang trách nhiệm truy nguồn** — nhãn `Lane:`
mang. Nên nó chỉ cần biến mất khi bạn ngừng gõ.

**⑸ Quá 30 phút thì NÊU TÊN, tuyệt đối không tự nhả.** Tự nhả là tự động hoá đúng vụ nhả-khoá-hộ
06/09 — lần đó một người làm và một lane mất phần đã xong; nếu máy làm thì không ai kịp thấy.

**⑹ Khối RIÊNG `tam`, không nhét vào `claims`.** Hàng trong `claims` là vùng sở hữu, vĩnh viễn; cổng
có bất biến *"mỗi khoá vùng gốc phải có thư mục khai steward, và ngược lại"* — một đường dẫn file
nằm đó làm bất biến ấy đỏ. Trả khoá thì **xoá hàng**, không để `owner: null`: khoá file là tạm, giữ
hàng trống thì sau một ngày bảng đầy xác đường dẫn.

## Cái này KHÔNG chữa — và nó làm chỗ đó XẤU ĐI

Ghi thẳng ra, vì mang một cơ chế mà chỉ mang phần đẹp là bán một lời hứa.

**Khoá không giữ file; GIT giữ.** Hai lane dùng chung một cây làm việc, nên `git commit -a` của
lane này vẫn cuốn file lane kia vừa dàn, và `git commit -o <file>` vẫn cuốn sửa đổi của lane kia
trên chính file đó. Khoá vùng trước đây **serial hoá** hai lane, nên hai lỗi ấy ít có dịp nổ.
**Khoá file bỏ đúng sự serial hoá đó, nên chúng nổ DÀY HƠN.**

`--soat` là thứ mua lại: nó liệt kê file đã dàn mà bạn không có quyền ghi. Nhưng nó **chỉ là một
LỆNH, không phải một cổng** — cổng đóng phiên chạy lúc index đã rỗng nên nó mù ở đúng chỗ này. Ai
quên gọi thì không gì nhắc.

Repo này chưa gặp ca đó (chưa có hook `commit-msg`); repo tiêu thụ đã gặp hai lần và đang vá bằng
một hook. Nếu ca đó nổ ở đây, **mở lại ADR này** thay vì vá điểm.

## Hệ quả

- `scripts/claim.mjs` thêm ba nhánh CLI và bảy hàm thuần. Mutex `mkdir` tách thành `giuBangQuyen()`
  vì đường ghi khoá file phải đi qua **đúng cái khoá đó** — hai đường ghi một file mà chỉ một
  đường có mutex thì mutex ấy không còn nghĩa gì.
- `scripts/session-check.mjs` thêm phép kiểm thứ **15**. `EXPECTED_CHECKS` phải tăng theo — chốt tự
  canh của cổng bắt đúng chỗ này ngay lượt đầu, và đó là nó làm đúng việc.
- `tests/khoa-file.mjs` — 6 vế, **6 đột biến đã chạy, cả 6 bị bắt**.

## Cái giá

- **Một khái niệm nữa để học.** Hai loại khoá, hai vòng đời, hai mốc trả. Bù lại: cái mặc định
  (khoá file) là cái rẻ, và cái đắt (khoá vùng) thành ngoại lệ.
- **`--soat` phải nhớ gọi.** Không có cổng nào bắt được. Đây là món nợ ghi rõ, không phải chỗ giấu.
- **Bảng quyền dài hơn** trong lúc có người đang sửa. Chấp nhận: hàng bị xoá ngay khi trả.

## Không chọn gì, và vì sao

- **Khoá file tự hết hạn.** Đã bỏ. Xem ⑸.
- **Bỏ hẳn khoá vùng.** Không: 43% số cặp va chạm vẫn dùng chung file, và có lượt thật sự sửa khắp
  vùng. Bỏ đi là đổi một loại chặn oan lấy một loại giẫm chân thật.
- **Dấu niêm phong phủ khối `tam`.** Repo này chưa có dấu niêm phong bảng quyền, nên không áp dụng.
  Repo nào có thì **khối rỗng phải băm y hệt cũ** — băm thẳng `{claims, tam}` là làm mọi bảng đang
  tồn tại báo `DAU_VO` ngay lượt sau, tức một cải tiến làm cổng của người khác đỏ.

## Một luật vào thì một luật ra — B9 cưỡng chế, không phải lời hứa

Thêm khối "Khoá mức FILE" đẩy bản trích từ **200 → 222 dòng**, vượt trần B9. Đây là chỗ luật mục 8
được **máy** cưỡng chế. Bốn chỗ trả lại, và cả bốn là gộp thật chứ không phải gọt chữ:

1. **Đoạn "nhận khoá ngay trước lượt ghi đầu tiên"** — luật đó nay CHÍNH LÀ `--sua`, nên nó vào
   dòng chú thích của lệnh. Một luật, một chỗ.
2. **Hai khối lệnh gộp thành một.** Khoá file và khoá vùng là hai lối của cùng một câu hỏi.
3. **Dòng *"muốn giành vùng người khác → hỏi Đức"*** — bản chép của mục 2 hàng 3, mà mục 2 tự khai
   là **BẢN DUY NHẤT** của danh sách đó. Xoá bản chép là làm đúng luật đã có.
4. **Số đo "98/127 commit (77%) chạm gốc repo"** — nó biện minh cho việc CHIA gốc repo thành nhiều
   vùng, không biện minh cho khối miễn trừ nó đang nằm; và nó đã bị số đo mới ở trên thay thế
   (57% chặn oan, đo hôm nay). Chỗ của số đo là ADR — nên nó ở đây, không ở hiến pháp.

Kết quả: **200/200 khít**, không mất một luật nào.
