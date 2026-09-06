# IDEAS — sổ ý tưởng của repo bộ khung

> **Sổ nợ ≠ sổ ý tưởng.** `BACKLOG.md` ghi thứ đang **hỏng**; file này ghi **hướng đi**. Trộn hai
> thứ vào một chỗ là mọi hướng đi trông như một lỗi cần vá gấp — và người chốt nhìn mãi một danh
> sách lỗi thì không thấy repo đang tiến, chỉ thấy nó đang nợ.
>
> **Quy ước dưới đây do máy đọc** (`scripts/what-next.mjs` và bảng HTML), sai một ký tự là mục
> biến mất: mỗi ý tưởng là `## <MÃ>-<số> · <tiêu đề>`, tiền tố **chỉ chữ cái in hoa**; các trường
> là dòng gạch đầu dòng `- **bậc:** …` · `- **việc kế:** …` · `- **chủ:** …` · `- **phạm vi:** …`.
> Bậc chỉ có bốn: `ý tưởng` · `đang xây` · `đã chứng minh` · `nghỉ`. Bậc lạ thì bộ sinh **DỪNG**
> chứ không đoán — một bậc gõ sai mà lặng lẽ rơi vào thùng "khác" là ý tưởng đó biến mất.
>
> **Bậc `nghỉ` không phải bậc thứ tư trên đường đi.** Nó là nhánh rẽ ra. Sổ giữ lại để không ai
> đề xuất lại cùng một hướng đã bị bác.

## Y-01 · Codex CLI làm người thực thi, Claude làm người thiết kế

- **bậc:** đang xây
- **việc kế:** chạy thêm hai ba lượt `npm run giao-viec` thật rồi mới quyết hình dạng lệnh nghiệm thu
- **chủ:** chưa ai nhận
- **phạm vi:** `_code` + `_docs`

**nguồn** — Đức chốt 2026-09-06, nguyên văn: *"tôi cần protocol này hoạt động được, vì Claude code ko thể làm hết 1 mình tất cả, sẽ hết usage"* và *"tối ưu việc sử dụng CodeCLI như một AI agent thực thi chứ không phải là Claude code nữa"*. Xem `decisions.md`.

**vì sao** — Một mình Claude làm hết thì hết lượt dùng giữa chừng, việc đứt. Chia vai: việc lặp lại (nâng · migrate · audit) giao Codex, việc thiết kế và phản biện để Claude, chốt vẫn là Đức. Đường này mới có **một** lượt giao thật chạy trót lọt, nên nó còn là đường mới chứ chưa phải thói quen.

**vì sao chưa làm ngay** — Chưa đủ dữ liệu. Luật `AGENTS.md` mục 8 bảo chưa có chuyện xảy ra thật thì đừng thêm cơ chế.

**đo trước khi sửa** — Đếm số lượt giao thật và số lượt phải làm lại. Dưới ba lượt thì chưa đủ để quyết gì.

## Y-02 · Lệnh nghiệm thu — đo lại năm con số mà phiên nhận việc tự khai

- **bậc:** ý tưởng
- **việc kế:** chờ đủ ba lượt giao thật, ghi lại mỗi lượt khai gì, rồi mới quyết hình dạng lệnh
- **chủ:** chưa ai nhận
- **phạm vi:** `_code`

**nguồn** — `BACKLOG.md` mục `KHUNG-31`, và một lượt audit 05/09 đã khai ba lệnh thoát mã `2/1/1` trong khi đo lại cả ba đều exit 0.

**vì sao** — Bộ khung đo repo đích rất kỹ **trước** khi giao việc, nhưng sau khi giao thì không đo gì cả. Phiên nhận việc trả về năm dòng và không ai kiểm. Một con số khai sai đã xảy ra thật một lần rồi; càng giao cho nhiều AI khác nhau thì lời tự khai càng đáng ngờ.

**vì sao chưa làm ngay** — Mới đúng một lượt giao qua đề bài mới. Viết lệnh bây giờ là đoán hình dạng của một việc chưa quan sát đủ.

**đo trước khi sửa** — Trong ba lượt giao kế tiếp, đếm bao nhiêu dòng khai lệch số đo thật. Lệch 0/15 thì đừng viết lệnh.

## Y-03 · Mỗi repo tự nuôi được một phiên AI của riêng nó

- **bậc:** đang xây
- **việc kế:** Đức mở một phiên AI ở một repo đã migrate và để nó tự làm trọn một việc nhỏ tới lúc cổng xanh
- **chủ:** chưa ai nhận
- **phạm vi:** chạy ở repo đích, không đòi khoá nào của bộ khung

**nguồn** — Đức chốt 2026-09-05: *"Đức làm việc với từng repo qua AI assistant của repo đó"*. Định nghĩa "xong" của một lượt migrate cũng do Đức đổi theo: không phải cổng xanh, mà là một phiên AI ở repo đích làm trọn một việc nhỏ **mà không cần ai ở bộ khung giải thích**.

**vì sao** — Đây là chỗ khác nhau giữa *đã lắp bộ khung* và *bộ khung đang chạy*. Repo nhận đủ file mà không ai biết dùng thì migrate xong vẫn không tạo ra giá trị nào. Ba repo đã lên chuẩn, **chưa repo nào đi qua phép thử này**.

**vì sao chưa làm ngay** — Phép thử này không tự động hoá được: nó đòi một người mở một phiên AI mới ở repo đích và **không nhắc gì**. Chỉ Đức làm được, chừng mười lăm phút mỗi repo.

**đo trước khi sửa** — Đếm số câu hỏi phiên đó phải hỏi ra ngoài repo trước khi cổng xanh. Không câu nào = đạt. Từ một câu trở lên thì câu đó chỉ đúng chỗ tài liệu còn thiếu.

## Y-04 · Ngân sách tài liệu đặt theo SỐ ĐO, không theo mong muốn

- **bậc:** ý tưởng
- **việc kế:** Đức chọn một trong hai — gọt thật và chấp nhận mất nội dung, hay đặt lại con số theo số đo hôm nay cộng biên
- **chủ:** chưa ai nhận
- **phạm vi:** `_docs` + `_root`

**nguồn** — Đức chốt 2026-09-06 về `KHUNG-11`: *"con số 2.200 không đạt được bằng cách dọn; nó là con số đặt theo mong muốn, chưa từng đặt theo số đo."*

**vì sao** — Một cái trần không bao giờ chạm tới được thì không ai còn coi nó là trần. Repo đã dọn thật, đã dựng cả một nhịp dọn, mà vẫn vượt — nghĩa là lỗi ở con số, không ở người dọn.

**vì sao chưa làm ngay** — Nới một ngân sách là nới một luật an toàn, mà `AGENTS.md` mục 2 hàng 6 bắt hỏi Đức. Không ai được tự nới cho số đo của mình đẹp lên.

**đo trước khi sửa** — `npm run can-nang` lấy tổng dòng hôm nay, rồi đếm số dòng mà **năm bản phát gần nhất** cộng thêm. Con số thứ hai mới quyết định biên nên rộng bao nhiêu.

## Y-05 · Nhịp dọn phải TỰ NHẮC, không dựa vào người nhớ chạy

- **bậc:** đang xây
- **việc kế:** cho `state-check` in một dòng cảnh báo khi nhật ký vượt ngân sách lúc mở phiên
- **chủ:** chưa ai nhận
- **phạm vi:** `_code` + `_root`

**nguồn** — Đức chốt 2026-09-06: *"KHUNG-11 có thể cần thêm cơ chế clean, vì nội dung sẽ luôn bị phình sau 1 quá trình."* Lệnh `npm run don` đã có từ bản 1.3.8.

**vì sao** — Lệnh dọn đã dựng, nhưng vẫn phải có người nhớ gõ nó. Nhật ký phình lại vượt ngân sách **ngay trong cùng ngày** dựng lệnh. Một cơ chế phải nhớ mới chạy là một cơ chế sẽ bị quên — đúng điều Đức muốn tránh khi bác cách dọn tay.

**vì sao chưa làm ngay** — Cổng đóng phiên là luật an toàn; thêm một mục vào cổng có thể làm phiên khác **không đóng được phiên**, đúng tai nạn `KHUNG-25` vừa xảy ra. Bước an toàn là nhắc trước, chặn sau, và chỉ chặn khi có số đo cho thấy nhắc không đủ.

**đo trước khi sửa** — Đếm trong mười phiên gần nhất, bao nhiêu phiên mở ra khi nhật ký đã vượt ngân sách.

## Y-06 · Bộ phép kiểm chạy dưới ba phút, hoặc nó sẽ bị bỏ qua

- **bậc:** ý tưởng
- **việc kế:** đo riêng thời gian từng suite để biết ba suite nào ăn hết thời gian
- **chủ:** chưa ai nhận
- **phạm vi:** `_code`

**nguồn** — `docs/ROADMAP-V2.md`, mục cập nhật 06/09: thời gian chạy trọn bộ phép kiểm ~300/180 giây, và mỗi bản phát lại thêm một suite.

**vì sao** — Bộ phép kiểm nay có 14 suite và đã vượt trần gần gấp đôi. Đã có lần `npm test` quá thời gian chờ mặc định phải chạy nền. Phép kiểm chậm tới mức người ta ngại chạy là phép kiểm sắp bị bỏ qua — mà bỏ qua phép kiểm là bỏ qua toàn bộ lớp bảo vệ.

**vì sao chưa làm ngay** — Chưa ai biết thời gian nằm ở đâu. Chia suite ra chạy song song hay tách tầng đều là đoán khi chưa có bảng thời gian từng suite.

**đo trước khi sửa** — Chạy từng suite riêng và ghi thời gian. Nếu ba suite chiếm quá 70% thì việc cần làm là gọt ba suite đó, không phải đổi cách chạy cả bộ.

## Y-07 · Nói thẳng giới hạn của bốn lớp chống-giẫm-chân

- **bậc:** ý tưởng
- **việc kế:** Đức chọn — chỉ ghi rõ giới hạn vào sổ tay, hay siết thật bằng chữ ký
- **chủ:** chưa ai nhận
- **phạm vi:** `_docs` nếu chỉ ghi giới hạn, `_code` nếu siết thật

**nguồn** — `BACKLOG.md` mục `KHUNG-6`, từ audit độc lập 05/09.

**vì sao** — Bảng quyền, nhãn `Lane:` trong commit, và cổng kiểm phiên đều **tin lời khai**: ai biết tên phiên khác là mạo danh được. Bốn cơ chế này sinh ra để chống **giẫm chân do vô ý**, không phải chống **mạo danh cố ý**. Người đọc dễ tưởng chúng là một lớp bảo mật — và tin nhầm một lớp bảo vệ là nguy hơn không có nó.

**vì sao chưa làm ngay** — Siết thật cần chữ ký, tức một hạng mục khác hẳn về quy mô. Còn "chỉ ghi rõ giới hạn" là đổi cách repo tự mô tả luật an toàn của mình — vẫn là việc Đức chốt.

**đo trước khi sửa** — Đếm trong sổ tay có bao nhiêu câu mô tả bốn cơ chế này bằng chữ mang nghĩa bảo mật. Đó là số câu phải sửa nếu chọn lối rẻ.

## Y-08 · Biết chắc cổng kiểm trên GitHub có chặn thật hay không

- **bậc:** ý tưởng
- **việc kế:** Đức mở Settings → Branches của repo trên GitHub và ghi lại luật branch protection đang bật
- **chủ:** chưa ai nhận
- **phạm vi:** `_root` — không đụng code

**nguồn** — `HANDOFF.md`, phát hiện của audit độc lập 05/09: `AGENTS.md` gọi CI là chỗ *"bịt lỗ hở duy nhất"* trong khi sổ phát hành nói CI chưa chặn merge.

**vì sao** — Repo này đã đếm được **sáu lần** cùng một hình dạng lỗi: một luật trỏ tới thứ không tồn tại hoặc không chạy như luật giả định. Nếu CI thật sự không chặn merge thì câu *"bịt lỗ hở duy nhất"* là lần thứ bảy — và là lần nguy hiểm nhất, vì nó khiến người đọc yên tâm sai chỗ.

**vì sao chưa làm ngay** — Không phiên AI nào đọc được cấu hình branch protection trên GitHub; nó nằm ngoài đĩa. Chỉ người có quyền quản trị repo mở trang đó ra xem được, chừng năm phút.

**đo trước khi sửa** — Hai câu trả lời trên trang Settings → Branches: nhánh `main` có bật *"Require status checks to pass before merging"* không, và có bật quét secret không.

## Y-09 · Bảng của mọi repo phải là MỘT bảng, không phải N bản fork

- **bậc:** đang xây
- **việc kế:** đưa `build-overview.mjs` vào bản trích rồi phát sang ba repo đã lắp
- **chủ:** claude-bang9tab
- **phạm vi:** `_code` + `_template`

**nguồn** — Đức chốt 2026-09-06 sau khi mở bảng của repo Chrome Extension: *"chúng ta sẽ học và đưa các cái logic cũng như là cách triển khai, UI, UX vào trong repo dashboard template"*, và chọn phương án **đi theo bản trích**.

**vì sao** — Repo Chrome Extension tự đi trước và dựng chín tab mà bộ khung chưa có. Để nguyên là hai repo có hai bảng khác nhau, và lúc chúng lệch thì không ai biết tin bản nào — đúng cái bệnh cả chương trình này sinh ra để chữa. Mang logic về một nguồn rồi phát đi thì nhìn repo nào cũng biết mục nào ở đâu.

**vì sao chưa làm ngay** — Chín tab đã dựng và đã chạy thật ở repo nhà (bản 1.3.14). Còn **một chỗ chặn đo được**: `build-overview.mjs` đang `import { VIEC } from "./giao-viec.mjs"`, mà `giao-viec.mjs` **ở lại repo nhà** — phát bộ sinh đi mà không gỡ chỗ nối này thì repo đích nạp trang là **chết ngay dòng import**. Ba lối: phát kèm `giao-viec.mjs`, hay cho chỗ nối đó hỏng êm, hay tách khối "giao việc" ra khỏi bộ sinh. Thêm nữa: `TRANG_FILE` đang đóng cứng tên file của repo nhà.

Repo Chrome Extension sẽ là **bản fork cần hợp nhất sau**, không phải nguồn.

**đo trước khi sửa** — Chạy bộ sinh trên một repo cố tình khác hình dạng repo nhà (không đơn vị con, thiếu sổ ý tưởng, tên vùng khác) và đòi nó ra trang không vỡ.
