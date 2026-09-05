# QUYẾT ĐỊNH — Đức chốt gì, ngày nào, vì sao

> **Vì sao có file này:** `AGENTS.md` mục 7 bước 2 bắt mọi phiên ghi quyết định mới của Đức vào
> đây. Tới 2026-09-05 file **chưa từng tồn tại** — nên quyết định hoặc chìm trong `HANDOFF.md`
> (nơi không ai đi tra quyết định), hoặc bốc hơi. Xem `BACKLOG.md` mục KHUNG-7.
>
> **Chỉ THÊM, không sửa mục cũ.** Đổi ý thì ghi mục mới trỏ ngược lại mục cũ — một quyết định bị
> sửa tại chỗ là một quyết định không ai truy được đã từng nói gì.
>
> **Quyết định kiến trúc có lập luận dài thì viết ADR** (`docs/adr/`), file này giữ một dòng trỏ
> sang. Đây là sổ tra nhanh *"Đức đã chốt gì"*, không phải nơi chứa lập luận.

---

## 2026-09-05 · Migrate là BA việc trong một, không phải chuẩn hoá cấu trúc

**Đức chốt.** Đưa một repo lên chuẩn gồm ba việc, làm cùng lượt:

1. **Migrate** — thả bộ khung vào, khai hình dạng repo, dựng cổng.
2. **Audit** — quét và rà soát repo đích, không chỉ kiểm cấu trúc có đúng khuôn không.
3. **Bring AI assistant onboard** — repo đích phải có một phiên AI dùng được ngay sau lượt
   migrate, chứ không phải nhận một đống file rồi tự xoay.

**Vì sao:** Đức làm việc với từng repo **qua AI assistant của repo đó** để dọn dần nợ kỹ thuật và
ý tưởng đang mở. Một repo nhận đủ cấu trúc nhưng không có assistant biết dùng cấu trúc ấy thì
migrate xong vẫn không làm được việc — cấu trúc đúng mà không ai vận hành được.

**Trách nhiệm:** thuộc **AI Assistant của repo bộ khung này**, không đẩy sang repo đích. Bộ khung
là nơi phát hành, nên nó chịu trách nhiệm cho việc thứ ba chạy được ở đầu bên kia.

**Hệ quả trực tiếp, ghi ra để không ai phải suy:**
- Quy trình migrate cần một **checklist tính năng sẽ mang sang** — hiện chưa có; sáu bước của
  `docs/protocols/CHUYEN-REPO-LEN-CHUAN.md` nói *làm gì*, không nói *mang gì*.
- Câu hỏi KHUNG-2 (*hai quy trình migrate có đi theo bản trích không?*) **đã có hướng**: việc
  migrate là việc của người **cầm** bộ khung, nên hai quy trình đó ở lại nhà — nhưng repo đích
  phải nhận đủ thứ để assistant của nó vận hành được.
- Lượt migrate thứ ba trở đi không được coi là "xong" khi cổng xanh. Xong là khi **assistant ở
  repo đích chạy được vòng làm việc của nó**.

## 2026-09-05 · Push lượt 1.3.1 dù cổng đóng phiên còn đỏ

**Đức chốt.** Đẩy 7 commit của lượt `claude-dieu-phoi-0509` lên `origin/main`, mặc dù cổng đóng
phiên còn hai mục đỏ.

**Bằng chứng đã đo trước khi chốt, không phải tin lời:**
- `npm test` → **exit 0, 145 phép xanh, 0 đỏ**.
- `tests/cong-do-that.mjs` và `tests/core-contract.mjs` chạy riêng → **exit 0**.
- Cổng vẫn báo *"Test xanh"* ĐỎ, với dòng giải thích liệt kê **toàn dòng `ok`**.

Tức mục đỏ đó là **dương tính giả của chính cổng** — ghi thành KHUNG-15 trong `BACKLOG.md` trước
khi đẩy. Mục đỏ thứ hai (*"Sự thật máy sinh còn tươi"*) là đường chưa hội tụ của cột
`changedCount`, cũng đã ghi.

**Vì sao đẩy chứ không chờ vá:** `AGENTS.md` mục 2 nói lý do bộ khung cho phép AI tự push —
commit chưa push là **vô hình** với vòng kiểm tra chéo, vì Đức không đọc code trên máy và GPT
audit qua GitHub. Giữ bản 1.3.1 trong máy để chờ vá một lỗi *của cổng* là đánh đổi sai chiều:
nó làm bản vá thật (mục đỏ vĩnh viễn) chậm tới tay hai repo đang ghim bản khung.

**Giới hạn của quyết định này — đọc kỹ trước khi lấy làm tiền lệ.** Nó áp cho **đúng lượt này**,
với **đúng bằng chứng trên**. Nó KHÔNG mở ra luật *"tin rằng cổng báo sai thì được push"*: nếu
mỗi phiên tự phán cổng sai rồi tự đẩy thì cổng thôi là cổng. Điều kiện tối thiểu để viện dẫn
lại: **đo được suite exit 0 bằng lệnh trực tiếp**, **ghi mục nợ trước khi đẩy**, và **người chốt
chốt từng lượt**.
