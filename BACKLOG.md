# BACKLOG — sổ nợ của repo bộ khung

> **Vì sao có file này:** `AGENTS.md` mục 0 bước 2 bắt mọi phiên *"việc ngoài phạm vi → ghi vào
> `BACKLOG.md`, không tự làm"*. `MULTIFLOW.md` trỏ theo, và `what-next.mjs` đọc nó ở 6 chỗ.
> **Nhưng tới 2026-09-05 file này chưa từng tồn tại.** Nên suốt từ đầu, luật bảo AI ghi nợ vào
> một chỗ không có, và `npm run what-next` báo *"0 việc mở"* cho mọi vùng — không phải vì hết
> việc, mà vì không có chỗ để việc rơi vào. Đây đúng bệnh repo này từng bắt với `claim.mjs`:
> *luật trỏ tới thứ không tồn tại thì nó không phải luật, nó là chữ.*

**Quy ước sổ — `what-next.mjs` đọc đúng ba thứ này, sai một ký tự là mục biến mất:**

- Nhóm ưu tiên: một dòng `## P1` … `## P9`. Mục nằm dưới nhóm nào ăn ưu tiên nhóm đó.
- Mỗi mục: `### KHUNG-<số> · <tiêu đề>`.
- Đóng một mục: **gạch ngang mã** — `### ~~KHUNG-1~~ · …`. Giữ lại, đừng xoá: sổ còn dùng để
  tra lịch sử. Viết `ĐÓNG` mà quên gạch thì lệnh **nêu tên mục đó** là khai sai, không im lặng.

---

## P1

### KHUNG-1 · Mục đỏ "Sự thật máy sinh còn tươi" — hai bug xếp chồng, cổng không đóng được

Cổng đóng phiên có **một mục đỏ vĩnh viễn**. Đuổi tới cùng ngày 05/09, ra hai nguyên nhân:

1. Khối `MAY_SINH` trong `build-dashboard.mjs` chỉ miễn trừ `llms.txt`, `repo-map.json`,
   `DASHBOARD.md`. Hai trang `DASHBOARD-<repo>.html` và `SO-MIGRATE-<repo>.html` **cũng do bộ
   sinh viết ra** nhưng mang đuôi `.html` nên bị `isBehaviourFile()` đếm là "code đã đổi" — mỗi
   lượt sinh lại tự cộng thêm một vào chính con số nó phải khớp. Đúng vòng lặp mà chú thích ngay
   trên khối đó mô tả và tin là đã chặn; chặn cho ba file, sót hai file thêm vào sau.
2. **Bộ sinh và bộ kiểm bất đồng đúng một đơn vị:** sinh lại `DASHBOARD.md` tại HEAD sạch ra
   `CÓ (11 commit)`, `state-check` cùng lúc cùng HEAD đòi `CÓ (12 commit)`.

(2) nặng hơn (1): còn bất đồng thì mục này **không đóng được bằng bất kỳ thứ tự commit nào**.

Hệ quả nếu để lâu: mục đỏ vĩnh viễn thì người ta thôi đọc cổng — chính điều `AGENTS.md` mục 8
cảnh báo. Vùng: `_code`. **Sửa là đổi dấu vân tay tầng máy → buộc cắt 1.3.1 → chạm hai repo
đang ghim bản khung. Cần người chốt trước khi làm.**

## P2

### KHUNG-2 · Hai quy trình migrate không đi theo bản trích — chốt hướng, không phải chốt code

`KIEM-MOT-REPO.md` và `CHUYEN-REPO-LEN-CHUAN.md` ở lại repo nhà; bản trích chỉ mang `MULTIFLOW`
và `ORCHESTRATOR`. Đây là **câu hỏi thật, không phải chỗ sót**: hai file đó nói về việc *đưa một
repo lên chuẩn* — việc của người **cầm** bộ khung, chưa chắc là việc của repo **đã dựng ra** từ
nó. Chốt xong mới biết có việc để làm hay không. Vùng: `_docs` + `_code`.

### KHUNG-3 · Hai pilot migrate chưa đo lại ở bản khung hiện tại

`nav_platform_main` và `Project 3 AI Agent Unify` migrate ngày 03/09 ở bản **0.3.0**; nay là
**1.3.0**. Không ai biết chúng còn khớp không, và không ai biết bao nhiêu thứ đã trôi. Đo rẻ:
`npm run assess -- <đường-dẫn-repo>` cho từng repo, rồi so với `muc_sau` ghi trong hồ sơ
`docs/migrations/`. **Chỉ đọc, không đòi khoá nào.**

## P3

### KHUNG-4 · Ba luật lớn của vai điều phối chưa có phép kiểm máy

`ORCHESTRATOR.md` tự khai: hàng rào chống trượt vai · query-driven · luật nạp báo cáo năm mục —
cả ba **chưa có phép kiểm nào canh**. Ở repo sinh ra sổ này, một phép kiểm cho hàng rào **đã
được viết nhưng chưa đi theo bộ khung**. `AGENTS.md` mục 7: *luật nào máy không kiểm được thì
sớm muộn cũng bị bỏ qua* — nên ba mục đó hiện là quy ước, không phải chốt. Vùng: `_code`.
