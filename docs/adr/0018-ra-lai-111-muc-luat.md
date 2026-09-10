---
status: Accepted
adr: 0018
chu_de: ghi-quyet-dinh
sua: 0016
date: 2026-09-10
deciders: AI (Đức uỷ quyền)
---

# ADR-0018 — Rà lại 111 mục luật: giữ 43, và BẢY mục không được chuyển sang một cái máy không tồn tại

**Bổ sung [ADR-0016](0016-hien-phap-mong.md)** ở đúng một điểm: tiêu chí *"Tầng 1 chỉ giữ thứ máy
không kịp nói cho bạn"* vẫn đúng, nhưng áp nó đòi biết **máy nào có thật và có CHẶN**. Trước lượt
này không phép kiểm nào trả lời được câu đó, nên tiêu chí được áp bằng cảm nhận.

## Vấn đề

Đức và GPT rà `AGENTS.md` + `CLAUDE.md` thành **111 mục** (`R-001`→`R-111`), mỗi mục một trong năm
số phận. Đức chốt 10/09: *"đó chỉ là proposal thôi, bạn review và là người quyết định cuối cùng"* —
mục đích *"core rule lean hơn và consistent hơn"*. Mục 2 của luật chung cho AI tự quyết việc đổi
luật an toàn khi đủ ba điều kiện; file này là điều kiện thứ hai (nói cái MẤT).

**Bản đề xuất rất chắc ở phần lý lẽ, và nó tự dàn xếp được một mâu thuẫn tôi đang treo:** `R6`
mang ba định nghĩa ngược nhau trong repo, còn đề xuất chia theo *hình dạng của luật* — không máy +
là **thủ tục** → hạ thành hướng dẫn; không máy + là **điều cấm/bắt buộc** → giữ; máy làm được →
chuyển sang máy. Cách chia đó không đụng ADR-0016: cả sáu luật vàng đều `GIỮ` dù không máy nào canh.

**Chỗ nó thiếu là DỮ KIỆN, không phải lý lẽ.** Đề xuất giao **23 mục** cho máy mà không kiểm cái
máy đó có tồn tại và có chặn hay không.

## Cái làm đổi bản rà — bốn số đo, lấy trong ngày

⑴ **`9/9` mục luật còn phần KHÔNG máy nào canh** (`luat_nha.canh`, vế `5e`). Không phải 7/9: số đó
lấy từ `mien`, thứ đo *luật có đường tới repo đích hay không* — câu khác.

⑵ **CHẶN ≠ BÁO.** Chỉ `B1 B2 B3 B4 B10 B12 B16` thuộc nhóm CHẶN của dãy B. `B6 B8 B9 B11 B14 B15`
chỉ VÀNG. Nên mục 3 mất **cả NĂM** luật vàng, không phải bốn; và `B9` (trần 200 dòng hiến pháp)
không chặn gì.

⑶ **CÓ MẶT ≠ ĐANG BẬT.** Bỏ `core.hooksPath` thì hai hook chết trong khi vế `5e` vẫn xanh. Cổng có
mục `cửa index` cho `commit-msg`; `post-commit` **không máy nào canh**.

⑷ **HAI LỖ MÁY THẬT** ở `safe-push.mjs`, dựng lại được trong kho không có dấu cổng nào:

| Đường | Máy làm | Luật viết |
|---|---|---|
| đẩy phần **của mình** | **không đọc** dấu cổng (`:265`) | mục 0: đóng phiên phải chạy cổng |
| `--carry` **gõ tay** | **in một dòng** rồi đẩy (`:316`) | mục 2: **CẤM** `--carry` khi cổng chưa XANH |

Ghi ở `BACKLOG.md` → `KHUNG-56`, **không vá trong lượt này**: vá là đổi hành vi `safe-push`.

## Quyết định

| Số phận | Đề xuất | **Tôi chốt** |
|---|---:|---:|
| `GIỮ` ở Tầng 1 | 36 | **43** |
| `GỘP` vào mục khác | 27 | **31** |
| `HẠ THÀNH HƯỚNG DẪN` | 24 | **21** |
| `CHUYỂN SANG MÁY` | 23 | **15** |
| `BỎ` | 1 | **1** |
| | 111 | **111** · Tầng 1 **111 → 43 (−61%)** |

**Khác đề xuất ở 14 chỗ, và tám chỗ cùng một lý do: không được giao một luật cho cái máy không có.**

| Mục | Đề xuất | Tôi chốt | Vì sao — số đo |
|---|---|---|---|
| `R-019` đừng `git push` trần | máy (`server-side policy`) | **GIỮ** | không hook nào chặn `git push`; `server-side policy` **không tồn tại** |
| `R-048` CẤM `--carry` khi cổng chưa xanh | máy (`gate`) | **GIỮ** | `--carry` gõ tay **không** bị chặn — lỗ ⑷ |
| `R-036` khoá vùng trả sau khi đẩy | máy (`gate`) | **GIỮ** | khoá VÙNG treo cuối phiên: **0** mục cổng đỏ |
| `R-058` ANNEX chỉ được THÊM việc phải hỏi | máy (`structural check`) | **GIỮ** | không phép kiểm nào đọc ANNEX theo chiều đó |
| `R-104` luật mới phủ luật cũ thì xoá cũ | máy (`structural check`) | **GIỮ** | `B16` canh *mỗi luật một nhà*, **không** canh việc bản cũ đã xoá |
| `R-068` không để token vào repo | máy | **GIỮ** *(và vẫn có máy)* | cổng đọc thật, nhưng **không chạy trong CI** và `git push` trần đi qua. Một dòng, và sai thì không rút lại được |
| `R-092` file không ai trỏ tới = không có | máy (`structural check`) | **HẠ** | `B6` chỉ VÀNG, và hôm nay đã 23 chỗ vàng |
| `R-091` tham chiếu phải là liên kết bấm được | máy (`lint`) | **BỎ** | không có `lint`, và đây là tính chất hình thức — giữ một luật không ai canh cho một việc hình thức đúng là thứ `R6` phải cắt |
| `R-010` không được BÁO xong khi cổng chưa xanh | gộp → `R-009` (đi sang máy) | **GIỮ** | `R-009` sang máy được, nhưng **máy không ngăn tôi gõ chữ "xong"** — nửa danh dự phải ở lại |
| `R-018` commit nêu đường dẫn | hạ | **GIỮ** | cửa index chỉ chặn file lane khác **ĐANG KHOÁ**; việc chưa khoá vẫn bị cuốn — **2 lần trong một ngày** |
| `R-012` `R-013` `R-014` thứ tự đóng phiên · gom commit | hạ (cả ba) | **GỘP thành MỘT dòng, ở lại** | sai thứ tự: **22 giây → ~9 phút** mỗi lượt; chia 4 commit là **~28 phút**. Một dòng mua lại được, còn số đo thì xuống Tầng 2 |
| `R-049` CẤM giành vùng phiên khác | **BỎ** | **GỘP → `R-025`** | mâu thuẫn là thật, nhưng `BỎ` để lại mục 2 nói *CẤM* và mục 1 nói *"Đức chốt được"* — **vẫn hai câu trả lời**. Gộp về ba đường của mục 1 mới là một câu |
| `R-055` `R-056` `R-057` force-push · sửa lịch sử · merge `main` | gộp vào `R-044` | gộp thành **một dòng RIÊNG** trong cùng mục | Đức chốt 10/09 *"sáu xuống ba"*; nhập cả sáu vào một câu là dựng lại danh sách sáu, và cột *"vì sao Đức"* chỉ đúng cho ba |
| `R-006` HANDOFF không nạp mặc định · `R-062` fixture dựng nổi ca hỏng | giữ riêng | **GỘP** (`→R-004` · `→R-061`) | trong hiến pháp hôm nay mỗi cặp là **một** gạch đầu dòng; tách ra là tạo hai mục cho một luật |

**Năm đích `GỘP` của đề xuất tự đi sang máy** — `R-009` `R-022` `R-030` `R-097` `R-104`. Chín mục
gộp vào chúng vì thế rời Tầng 1 **trong một nhịp**, không phải hai. Sau khi tôi giữ `R-010` và
`R-104`, còn **ba** đích như vậy (`R-022` `R-030` `R-097`), và cả ba đều có máy CHẶN đo được:
`claim.mjs` · `post-commit` cộng cổng · `B10`+`B16`.

## Cái MẤT — gọi tên, vì nó có thật

⑴ **`R-091` bị BỎ hẳn.** Sẽ không bao giờ có ai nói cho ta biết một tham chiếu đã tụt xuống thành
chữ thường. Tài liệu trôi âm thầm. Nhận, vì cái trôi ở đây là hình thức.

⑵ **`R-092` xuống hướng dẫn.** Tài liệu mồ côi chỉ còn `B6` **VÀNG** canh, và hôm nay đã 23 chỗ.

⑶ **21 mục xuống Tầng 2.** Phiên không mở sổ tay sẽ không thấy chúng. Nặng nhất là số đo của thứ
tự đóng phiên — nhưng dòng nêu thứ tự thì **ở lại**, chỉ số đo đi.

⑷ **`R-049`: chữ *CẤM* ở mục 2 mất đi.** Trong bản mới, giành vùng của phiên khác là việc **xin
Đức được**. Hành vi không đổi — mục 1 vốn đã cho *"Đức chốt"* là một trong ba đường hợp lệ — nên
cái mất là một câu tuyệt đối, và cái được là **thôi có hai câu trả lời cho một câu hỏi**.

⑸ **15 mục sang máy = 15 luật nay sống bằng việc cái máy còn BẬT.** Và tôi vừa đo được rằng
**CÓ MẶT ≠ ĐANG BẬT**: `post-commit` không có máy nào canh nó còn chạy hay không. Đây là cái mất
lớn nhất của cả lượt rà, và nó **không có bù trừ nào** trong lượt này.

## Không làm trong ADR này

Chưa sửa một chữ nào trong `AGENTS.md` — nên mọi số dòng `AGENTS.md:3-165` trong bản rà của Đức
**còn đúng nguyên**. Lượt viết lại là một mẻ riêng và phải có vòng audit riêng: ADR-0016 ghi lại
rằng lượt nén văn xuôi lần trước **làm rụng bốn mệnh lệnh phụ**, và người nén không nhìn ra vì họ
vẫn nhớ câu gốc.

## Kiểm chứng độc lập

Audit độc lập 10/09 trên nhát ĐO — không đọc lời tôi, tự dựng lại ca hỏng trong bốn bản copy — nêu
**4 chỗ NGHIÊM TRỌNG + 5 NÊN SỬA**; kiểm lại thì **đúng cả chín**, và tất cả đã vào bản này: ba lời
khai của tôi mạnh hơn sự thật (mục 1 *"canh kín"* · mục 0 *"safe-push đòi dấu cổng"* · mục 2
*"`--carry` có máy"*), lý lẽ *"sự-có-mặt là đúng răng"* bị chính bằng chứng của nó phản lại, và hai
đường làm vế `5e` **xanh mà đo số 0** (khai THƯ MỤC làm máy · bảy **bí danh** của cùng một file bơm
số máy qua vạch). Vá hai dòng; năm đột biến nay ĐỎ cả năm.

**Lặp lại lần thứ hai trong một ngày:** tôi đọc lời khai của chính mình mạnh hơn thực tế, ở hai chỗ
khác nhau. Hai câu `CÓ MẶT ≠ ĐANG BẬT` và `CHẶN ≠ BÁO` nay in ngay trong nhãn của vế `5e` và trong
`canh._doc`, để lần sau máy nói trước khi tôi kịp tự tin.
