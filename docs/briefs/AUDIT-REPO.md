---
kind: brief
status: active
ttl_days: 180
---

# PHẦN VIỆC — audit một repo TRƯỚC khi đưa nó lên chuẩn

> **Nửa dưới của một đề bài.** Nửa trên là [GIAO-VIEC-CHUNG.md](GIAO-VIEC-CHUNG.md). Ghép bằng:
> `node scripts/giao-viec.mjs --viec audit --repo "<REPO ĐÍCH>" --as <tên-phiên>`
>
> Việc này **CHỈ ĐỌC**. Không nhận khoá nào, không ghi một byte nào vào repo đích. Mục D và F
> tới H của phần chung **không áp cho lượt này** — bạn không commit, không đẩy, không trả quyền.

## Vì sao audit đứng TRƯỚC, và vì sao KHÔNG tự audit

Repo đang sống thường **đã có sẵn file trùng tên** với thứ bộ khung sắp thả vào. Đo thật ở
`ALL_SKILL_MANAGEMENT`: bốn file trùng tên đang giữ **1824 dòng nội dung riêng** — `AGENTS.md`
(26 luật riêng), `DASHBOARD.md` (viết tay, có bản mirror sang Google Sheet), `decisions.md`,
`handoff.md` (**1225 dòng** nhật ký vận hành). Thả đè là mất sạch, và mất theo cách **không ai
nhận ra ngay**.

Người sắp migrate **không nên tự audit repo mình sắp sửa** — đó là tự chấm bài mình. Nên lượt
audit giao cho một AI khác, và người nhận báo cáo **phải tự kiểm chứng lại từng phát hiện**.

> Trial 05/09: một phiên audit báo ba lệnh thoát mã `2/1/1`. Đo lại thì **cả ba exit 0**. Tin
> thẳng là đi sửa ba thứ không hỏng.

## Chạy trên BẢN CLONE, không chạy trên repo thật

```bash
git clone "<REPO ĐÍCH>" "<thư-mục-tạm>"
cd "<thư-mục-tạm>"
```

Tác nhân ngoài không có lý do gì được quyền ghi vào một repo đang sống. Clone rồi đọc.

## Bảy câu phải trả lời — câu 6 và 7 là hai câu đắt nhất

1. **Repo này là gì** — một đoạn cho người không đọc code.
2. **Chia mấy khoá vùng**, gồm thư mục nào, vì sao. Chỗ nào **bắt buộc chung một khoá**.
3. **File nào máy sinh**, sinh bằng lệnh gì.
4. **Xung đột luật** — repo đã có cơ chế phân quyền / khoá / phân vai riêng chưa, nó chọi với
   khoá vùng của bộ khung ở đâu.
5. **Một phiên AI mới sẽ vấp ở đâu** — nêu chỗ cụ thể, không nêu cảm tưởng.
6. **File nào trùng tên với thứ bộ khung sắp ghi vào, và trùng thì mất gì.**
7. **Repo đã có `DASHBOARD.md` · `llms.txt` · `repo-map.json` chưa** — có thì phải khai
   `generated_names` lúc migrate, chứ **không** đổi tên file của chủ nhà.

Câu 6 và 7 đo bằng lệnh, không đoán:

```bash
ls AGENTS.md CLAUDE.md DASHBOARD.md decisions.md handoff.md HANDOFF.md STATUS.md BACKLOG.md llms.txt repo-map.json .repo-structure.json 2>/dev/null
wc -l AGENTS.md DASHBOARD.md decisions.md handoff.md HANDOFF.md 2>/dev/null
```

**Ghi lại số dòng.** Lượt migrate sau sẽ đo lại và so — số dòng **giảm** ở bất kỳ file nào trong
bốn file cấm-đè là bằng chứng đã đè mất nội dung.

## Ba điều dễ đọc sai khi chấm mức

Nếu bạn chạy được `node scripts/assess.mjs "<REPO ĐÍCH>"` từ repo bộ khung thì thêm kết quả vào
báo cáo. Ba điều đừng đọc sai:

**① Luật lệch bản chuẩn KHÔNG phải nợ.** Mỗi repo sửa luật cho nghề của mình — đó là thiết kế.
Chỉ tầng **máy** lệch mới đáng mở ra xem.

**② Thiếu `scripts.test` là lỗi nặng riêng, không gộp vào ba con số chi phí.** Thiếu nó thì cổng
đóng phiên **báo xanh mà không chạy một dòng test nào** — xanh, im, vô dụng.

**③ Mức 3 không có nghĩa repo đó tốt.** Nó có nghĩa repo đó **có đủ đồ nghề**.

Ba con số chi phí cố ý **không** quy về một phần trăm: **thả** (chép là xong) · **viết** (người
phải ngồi viết, đây là phần thật sự tốn) · **soi** (có sẵn nhưng lệch, phải mở ra đọc).
*"Repo này 72% đạt chuẩn"* nghe gọn mà không ai hành động được.

## Báo cáo — bảy câu, rồi năm dòng

Trả lời bảy câu ở trên, mỗi câu ngắn gọn. Rồi đóng bằng đúng khối năm dòng của mục J:

```
REPO       : <tên>
VIỆC       : audit · mức <n> · chi phí thả/viết/soi <a>/<b>/<c>
MÁY        : <lệnh đã chạy được / không chạy được>
CỔNG       : không áp — lượt này chỉ đọc
CÒN MỞ     : <file trùng tên nguy hiểm nhất, hoặc "không có">
```

**Không đề xuất bản vá, không sửa gì.** Lượt này chỉ trả lời câu hỏi. Người chốt đọc xong mới
quyết có migrate hay không.
