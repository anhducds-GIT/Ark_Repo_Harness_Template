# HANDOFF — bàn giao giữa các phiên

> **Chỉ THÊM dòng, không sửa dòng cũ.** Phiên sau đọc **phần CUỐI** file này trước tiên.
> Mỗi phiên ghi đúng ba thứ: làm gì · kết quả bằng số · còn gì mở.

## Trạng thái hiện tại

Repo này là **nhà riêng của bộ khung**. Nó vừa được tách ra khỏi repo sinh ra nó
(`Chrome_Extension_AI_Agentic`) theo quyết định ADR-0001.

Nó **tự dựng bằng chính bộ khung của mình** — không phải một thư mục chép tay. Và nó tự sinh lại
được bản trích trong `template/`: `npm run template -- --check` phải luôn khớp.

## Log

## 2026-09-03 — `claude-template-finish`: chuyển nhà

Bộ khung rời repo Chrome sang đây. Mang theo: 5 công cụ vận hành · luật ba tầng · 4 bản mẫu ·
suite hạt giống · và 4 công cụ chỉ dành cho nhà (bộ trích · đo độ lệch · khởi tạo repo mới ·
trang mô tả bộ khung) cùng hai quy trình.

**Bằng chứng chuyển nhà không mất gì:** bản trích sinh ra ở đây **giống hệt từng byte** bản sinh
ra ở repo cũ. Kiểm bằng `diff -r`.

**Một lỗi tìm ra đúng lúc chuyển nhà, và chỉ lộ ra vì chuyển nhà:** bộ trích **cộng thêm một dòng
trống mỗi lần chạy**. Nó lấy chỉ số đầu dòng tiêu đề nên ký tự xuống dòng phía trước bị giữ lại,
rồi bản thay lại thêm một cái nữa. Trích một lần thì không ai thấy. Trích lại **từ bản trích** —
đúng việc phải làm khi bộ khung có nhà riêng — thì lệch dần. Đã vá, và `--check` chạy hai lần
liên tiếp vẫn khớp.

**Một phép kiểm phải viết lại cho chạy được ở cả hai nhà:** đối chứng dương của phép dò từ vựng
nghề vốn mượn chính luật của repo. Ở đây luật vốn đã ở dạng chung, nên phép kiểm đó **đỏ ở đúng
cái repo làm mọi thứ đúng nhất**. Nay nó tự nhận biết: repo còn mùi nghề thì dùng luật thật làm
đối chứng, repo đã chung thì trồng đối chứng.

**Số:** 25 phép kiểm xanh · bản trích 21 file · cổng cấu trúc 0 đỏ 0 vàng.

**CÒN MỞ:**
1. **Chưa có remote.** Repo này mới chỉ ở máy. Cần một repo GitHub trống để đẩy lên.
2. **Repo cũ vẫn còn bản sao** của `template/` và 4 công cụ. Xoá bên đó cần chủ dự án duyệt —
   chưa làm. Tới lúc đó thì **có hai bản**, và đó đúng là thứ ADR-0002 nói phải tránh.
3. **Chưa từng migrate một repo thật khác nghề.** Nhãn `0.1.0-unproven` vẫn đúng.
