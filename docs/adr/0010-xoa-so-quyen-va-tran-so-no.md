---
status: Accepted
adr: 0010
chu_de: tran-ngan-sach
dau_moi: true
date: 2026-09-08
deciders: Đức uỷ quyền tường minh — "hai chốt đó bạn chủ động chọn cho phù hợp cho tôi"
---

# ADR-0010 — Xoá sổ quyền chưa ai gọi; đặt trần sổ nợ 25 và cho máy canh nó

## Bối cảnh

Đêm 07–08/09 tôi dựng `scripts/quyen.mjs` (787 dòng) + `tests/quyen-sau-ca.mjs` (929 dòng): một
sổ quyền dạng append-only trên nhánh git riêng `refs/ark/quyen`, dùng compare-and-swap để phân
xử ai được ghi vùng nào. Nó ra đời để chặn bug **02/09**: hai phiên cùng đọc bảng quyền thấy
"trống", cùng ghi, người ghi sau thắng, người ghi trước mất quyền mà không hề biết.

Bản giao việc để lại đúng một câu hỏi: **nối sổ quyền vào đường ghi khoá, hay xoá?** Đức nghiêng
về *"nối"*, rồi 08/09 giao lại cho tôi tự chốt. Bốn số đo, lấy ngày 08/09:

1. **`quyen.mjs` không được gọi từ đâu cả.** `grep` toàn repo: chỉ chính nó và test của nó. Mọi
   chỗ khác là văn xuôi trong `BACKLOG.md` / `HANDOFF.md`.
2. **`refs/ark/quyen` chưa từng tồn tại trên remote.** `git ls-remote origin 'refs/ark/*'` trả về
   rỗng — sổ chưa ghi một dòng nào trong đời.
3. **Nó không nằm trong `template/`,** nên không repo nào khác nhận được nó.
4. **Cái nó định chặn thì `claim.mjs` đã chặn rồi, và chặn đúng.** `claim.mjs:400` có một mutex
   thật bằng `mkdir` (nguyên tử trên mọi hệ điều hành), dọn khoá mồ côi sau 30 giây, **đọc lại
   bảng sau khi có khoá**, nhả khoá trên mọi đường ra. Chú thích ngay trên nó nói đúng cửa sổ đua
   của bug 02/09 và vì sao đọc-lại-kiểm không đủ.

Số ⑷ là số quyết định, và tôi chỉ thấy nó vì **mở file ra đọc trước khi sửa**: tôi đã sắp viết
một khoá độc quyền thứ hai vào cùng một đường ghi — đúng thứ giới hạn ② của `AGENTS.md` cấm
("cấm cài một tính năng hai lần").

Sổ quyền còn một lỗ do vai SẢN PHẨM chấm ra và **chứng minh bằng cách chạy thật**: bản đồ vùng
đi vào qua `--ban-do`, tức do **bên bị kiểm** tự chọn; một bản đồ giả đúng hình dạng đi qua cửa
với mã 0 (`KHUNG-45`). Lỗ đó sống nguyên qua **97 ca xanh và 27/27 đột biến** — vì đột biến chỉ
bắt được lớp *"ai đó gỡ mất một dòng bảo vệ"*, nó mù với lớp *"dữ liệu này đến từ đâu"*.

Chốt thứ hai: **sổ nợ bộ khung có 23 mục mở và không ai đặt trần**, trong khi repo
`Chrome_Extension_AI_Agentic` đặt trần 15 **mà không cưỡng chế** — mục thứ 11 vào sổ, không gì đỏ
lên, và trần phải nâng sau khi đã vỡ. Một con số không có máy canh thì nó không phải trần, nó là
lời khuyên.

## Quyết định

**⑴ Xoá `scripts/quyen.mjs` và `tests/quyen-sau-ca.mjs`.** Gỡ khỏi `npm test` và `test:quyen`.
Không nối vào `claim.mjs`. Việc phân xử quyền ghi ở lại nguyên chỗ nó đang chạy tốt: mutex `mkdir`
trong `claim.mjs`, cộng dấu niêm phong bảng quyền cho đường sửa tay.

**⑵ Đặt trần sổ nợ bộ khung = 25, khai ở `backlog.tran` của `.repo-structure.json`, và cho cổng
đóng phiên cưỡng chế** bằng phép kiểm thứ 12 *"Sổ nợ dưới trần"*. Bộ đếm **dùng lại**
`parseBacklog` của `what-next.mjs`, không viết bộ thứ hai. Repo **không khai** `backlog.tran` thì
phép kiểm xanh — bản khung phát đi không đặt trần hộ repo nào.

## Hệ quả

**Được:** repo nhẹ đi 1.716 dòng phải nuôi mãi mãi, và mất một lối đi sai — một sổ quyền nằm đó
không ai gọi là thứ phiên sau sẽ tưởng đang chạy. Nhận/trả khoá **không cần mạng**, tức không
đánh thuế mạng lên thao tác chạy nhiều nhất trong hệ. Trần sổ nợ từ nay đỏ được, và
`tests/cong-do-that.mjs` khối 10 chứng minh cả ba chiều: vượt trần **ĐỎ** · gạch mã một mục
**XANH lại** · repo không khai trần **XANH**. Hai đột biến (bỏ so sánh trần · bỏ cửa fail-open)
đều bị bắt.

**Mất — nói thẳng, đây là mặt xấu thật:**

- **Mất phân xử giữa nhiều máy.** Mutex `mkdir` chỉ chặn được các tiến trình trên **cùng một máy,
  cùng một cây làm việc**. Hôm nay đó là toàn bộ số bên chạy `claim.mjs`, nên chưa mất gì. **Ngày
  nào có phiên chạy `claim.mjs` từ máy thứ hai, mutex này không còn đủ** — đó là điều kiện duy
  nhất khiến nên dựng lại sổ quyền, và khi dựng thì mở lại `KHUNG-45` trước khi viết dòng đầu.
- **Mất luôn phần "một kết quả một vùng"** — vế cưỡng chế bằng máy của bất biến *"người sửa không
  tự nghiệm thu bản sửa của mình"* (ADR-0008). Từ nay bất biến đó là **chữ, không phải luật máy
  kiểm**. `AGENTS.md` mục 7 nói rõ luật máy không kiểm được thì sớm muộn cũng bị bỏ qua, nên đây
  là một khoản nợ có thật, không phải một chi tiết. Ghi thẳng ra để không ai tin nhầm rằng nó
  đang được canh.
- **Trần 25 chỉ còn 2 chỗ trống.** Phiên nào ghi mục nợ thứ 26 sẽ bị cổng chặn cho tới khi đóng
  một mục — kể cả khi mục nợ đó không liên quan gì đến việc họ đang làm. Đó là **cố ý**: sổ nợ là
  của chung, và một trần không bao giờ chạm tới thì không phải trần. Thấy quá chặt thì **hỏi
  Đức**, sửa `backlog.tran`, đừng sửa script.

**Khôi phục:** cả hai file còn nguyên trong lịch sử git.
`git show 4005c4b:scripts/quyen.mjs` đọc lại được từng dòng, kèm bảng *"AI NÓI ĐIỀU NÀY?"* — bảng
đó là thứ duy nhất bắt được lớp lỗi mà đột biến mù, nên **đọc lại nó trước** nếu có ngày dựng lại.

## Trạng thái

Accepted
