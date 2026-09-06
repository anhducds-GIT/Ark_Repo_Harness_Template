# Bản đồ hoà giải — bộ khung ↔ repo tiêu thụ

> Đo ngày **2026-09-06**, bộ khung ở bản **1.3.19**, repo tiêu thụ là `Chrome_Extension_AI_Agentic`.
> Tài liệu này **không sửa một dòng mã nào**. Nó chỉ trả lời một câu cho mỗi khối lệch:
> **kéo xuống · đẩy lên · hay cố ý khác.**
>
> Đọc lại số đo bằng lệnh, đừng tin bảng: `wc -l` ba bản, rồi `comm` danh sách hàm tầng ngoài.

## 0. Số đo gốc

| File | bộ khung | bản trích | repo tiêu thụ |
|---|---:|---:|---:|
| `scripts/claim.mjs` | 272 | 272 | **564** |
| `scripts/session-check.mjs` | **1149** | 1149 | 912 |
| `scripts/safe-push.mjs` | 287 | 287 | **302** |
| `scripts/repo-structure.mjs` | 631 | 631 | **730** |
| `docs/protocols/MULTIFLOW.md` | 170 | 170 | **195** |

**Bản gốc và bản trích khớp từng dòng ở cả năm file** — bộ sinh bản trích đang khoẻ. Lệch nằm
hoàn toàn ở repo tiêu thụ, và lệch **cả hai chiều**: nó thừa ở `claim.mjs`, thiếu ở `session-check.mjs`.

**Một cảnh báo về cách đo:** so tên hàm tầng ngoài thì một hành vi *viết lồng vào chỗ khác* sẽ hiện
ra như "thiếu" trong khi nó có thật. Nên mọi dòng dưới đây được kiểm lại lần hai bằng **đếm từ khoá
hành vi**, không chỉ đếm tên biến.

## 1. KÉO XUỐNG — bộ khung đúng, repo tiêu thụ thiếu

| Khối | Nó canh gì | Vì sao repo tiêu thụ nên lấy |
|---|---|---|
| `laHangGia` + `DAU_HANG_GIA` | bắt hàng giả trong bảng, ví dụ dòng mẫu chép nhầm thành dòng thật | bảng có hàng giả thì mọi số đọc từ nó đều sai, và không ai nghi |
| `KHAI_BAN_DO` / `FILE_BAN_DO` | repo tự khai file nào là bản đồ file | đóng cứng `AGENTS.md` là repo đặt tên khác thì phép kiểm mù |
| `LA_LUU_TRU` | vùng `archive/` không tính vào ngân sách | thiếu nó thì dọn xong cân vẫn nặng y nguyên → không ai dọn nữa |
| `verifierMatchesHead` | bộ sinh đang chạy có khớp HEAD không | một bản sửa dở của chính bộ sinh sẽ tự khen mình là tươi |
| `KHOA_AREA` / `KHOA_UNITS` / `kiemKhoaLa` | gốc repo chia nhiều khoá + bắt khoá lạ | **liên quan thẳng tới việc ②**: một khoá gốc duy nhất là điểm nghẽn đã đo được (77% commit) |
| `TEN_MAY_SINH_MAC_DINH` / `tenMaySinhFrom` | `generated_names` cho phép đổi tên artifact | repo đích đã có file trùng tên thì hiện nay bị ghi đè im lặng |
| so với `upstream` trong `safe-push` | *(đếm từ khoá: bộ khung 3, tiêu thụ **0**)* | không so upstream thì `--carry` mất một nửa tác dụng |

## 2. ĐẨY LÊN — repo tiêu thụ đúng, bộ khung nên nhận

| Khối | Nó làm gì | Quyết |
|---|---|---|
| `GIO_NHAC` · `ageHours` · `ageLabel` | in **thời gian đã giữ**, ⚠ khi quá 6h, kèm nguyên văn *"CŨ KHÔNG CÓ NGHĨA LÀ CHẾT"* | **KHÔNG PHẢI ĐẨY LÊN — bộ khung ĐÃ CÓ**, ở `what-next.mjs` chứ không ở `claim.mjs`, nên phép so tên hàm theo file nói nhầm là "thiếu". Việc thật chỉ là **dời chỗ**: sang `claim.mjs` (file GHI `claimed_at`), và cho `--list` in ra. Đã làm ở bản 1.3.20. **Đây là ca thật của luật vàng 4** — số đo trong bản giao việc gửi sang đúng, nhưng kết luận rút từ nó thì sai, và chỉ chạy `grep` mới thấy |
| `canDayTruocKhiTra` + `--du-biet` | từ chối trả khoá khi còn commit chưa đẩy, và cửa thoát có ghi lý do | **NHẬN SAU, thành một lượt riêng.** Hai vế phải đi cùng nhau: chỉ lấy vế chặn là lane bị chặn đẩy sẽ kẹt khoá vĩnh viễn. Xem `KHUNG-33` |

## 3. CỐ Ý KHÁC — cả hai đúng cho hoàn cảnh của mình

Ô này là ô dễ chép mù nhất. Repo tiêu thụ lớn hơn vì nó **phản ứng với sự cố thật của riêng nó**
(khoảng 20 lane trong một ngày), không vì nó tốt hơn.

| Khối (repo tiêu thụ) | Vì sao nó đúng ở đó | Vì sao bộ khung KHÔNG lấy |
|---|---|---|
| Dấu niêm phong bảng quyền (`FINGERPRINT_FIELD`, `baselineDaNiemPhong`) | ~20 lane/ngày, sửa tay bảng quyền là chuyện có thật | Bộ khung chạy 1–3 phiên. Niêm phong làm **cổng đỏ với MỌI phiên** khi một người sửa tay — cái giá đó chỉ đáng khi số lane đủ đông. Ví dụ này do chính bản giao việc nêu ra |
| `--restamp` (12 chỗ) | chuyển khoá có câu chốt của Đức | **Bộ khung đã có đường tương đương**: `--take` lên vùng có chủ đòi câu chốt và **từ chối khi vùng còn file sửa dở**. Thêm cửa thứ hai cho cùng một việc là thêm chỗ để hai cửa nói khác nhau |
| `append_only_exempt` cấu hình được | nhiều thư mục chỉ-thêm, mỗi cái một luật | Bộ khung miễn **đúng hai file, mỗi file một lý do khác nhau**, ghi thẳng trong `AGENTS.md` §1. Cho khai tự do nghĩa là repo tự miễn cho mình bất cứ đâu — mất luôn thứ đang canh |
| `handoffCapFrom` · `tran_byte_moi_muc` | trần byte cho mỗi mục Log | `HANDOFF.md` bộ khung tăng chậm và đã có **nhịp `npm run don`**. Trần byte chữa triệu chứng, dọn chữa nguyên nhân |
| `QUET_TOI_DA` | trần quét, repo lớn hơn nhiều | Chưa đo được lượt chạy nào chậm ở đây. Thêm trần chưa có ca thật = luật mục 8 cấm |
| `VO_DAU` · `canon` | bỏ dấu tên phiên | Tên phiên ở bộ khung theo quy ước ASCII. Chưa có ca hỏng |
| `CHUA_DAY` · `commitChuaDay` (số commit chưa đẩy nhúng vào artifact) | tiện cho phiên điều phối | **Bộ khung cố ý bỏ hình dạng này.** Đo thật 06/09 ở hai repo đích: bảng nhúng số commit chưa đẩy thì mỗi commit mới làm bảng lệch — nó **tự đuổi theo đuôi mình**, và cổng đỏ vì một lý do không nói gì về nguyên nhân |
| `kiemArtifactTuHead` trong `safe-push` | kiểm artifact tươi **lúc đẩy** | Bộ khung kiểm ở **cổng đóng phiên** (*"Sự thật máy sinh còn tươi"*) **và** ở CI. Chỗ thứ ba là thêm một chỗ để ba chỗ trôi khỏi nhau |
| `MULTIFLOW.md` +25 dòng (đổi tên hai mục, thêm `## 8. Đọc thêm`) | danh sách đọc thêm của riêng repo đó | Mục "Đọc thêm" trỏ tới file chỉ repo đó có. Kéo về là bản đồ trỏ vào chỗ trống — đúng bệnh repo này đếm được sáu lần |

## 4. Một chỗ bản giao việc nói khác chính nó

Bản tin gửi sang bộ khung viết: *"Máy HIỆN RA, người điều phối **QUYẾT**."*
File brief gốc (`BRIEF-K2-KHOA-RANH-01.md` mục 2b) đã sửa lại thành: *"Máy hiện ra, người điều phối
**HỎI** — không phải quyết"*, vì đúng ngày hôm đó phiên điều phối đã **quyết một lần, sai**: nó nhả
khoá hộ một lane đang làm thật ở thư mục ngoài repo, và lane đó phải hoàn nguyên phần đã xong.

**Bộ khung đi theo bản đã sửa.** Ca 14 phút vẫn được nhắc, nhưng là **dương giả** — nó là bằng chứng
cho mục 2b, không phải bằng chứng cho nguyên nhân ①.

## 5. Hàng đợi rơi ra từ bản đồ này

| Mã | Việc | Nguồn |
|---|---|---|
| ~~`KHUNG-32`~~ | Tín hiệu *"repo chưa thấy dấu vết"* + luật nhận khoá muộn — **XONG, bản 1.3.20** | §2 hàng 1 · việc ② |
| `KHUNG-33` | `canDayTruocKhiTra` + `--du-biet`, một lượt riêng | §2 hàng 2 |
| `KHUNG-34` | Tám cái bẫy đo được 06/09 — phân loại, nhận cái nào đáng | việc ③ |

Ô **KÉO XUỐNG** không sinh việc cho bộ khung: bộ khung đã có sẵn cả bảy. Việc ở đó là của
phía repo tiêu thụ, sau khi bộ khung phát hành.
