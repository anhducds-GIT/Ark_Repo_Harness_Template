---
kind: guidebook
status: active
ttl_days: 365
---

# Sổ tay AI Agent — danh sách kiểm cho việc lặp lại

> **Vì sao có sổ tay này.** Một việc làm mười lần bởi mười phiên khác nhau sẽ ra mười kiểu, và
> sau mười lần thì không còn "cách làm của repo này" nữa — đó gọi là **drift**. Sổ tay chặn drift
> bằng cách biến trí nhớ thành danh sách kiểm: AI không cần nhớ, chỉ cần đọc.
>
> **Luật dùng sổ tay:** việc nào có mục ở đây thì **phải làm theo mục đó**. Thấy sổ tay sai thì
> sửa sổ tay trước, rồi mới làm theo bản đã sửa. **Tuyệt đối không "lần này làm khác cho nhanh"**
> — đó chính là bước đầu tiên của mọi lần drift.

## Bảng tra nhanh

| Bạn sắp… | Đọc mục | Mất bao lâu |
|---|---|---|
| Mở một phiên làm việc | [1](#1) | 2 phút |
| Đóng một phiên làm việc | [2](#2) | 5 phút + thời gian chạy cửa kiểm |
| Sửa một lỗi | [3](#3) | tuỳ lỗi |
| Thêm một công cụ hoặc tài liệu mới | [4](#4) | 10 phút |
| Nhờ một AI khác audit | [5](#5) | 15 phút chuẩn bị |
| Chạy bảo trì định kỳ | [6](#6) | 20 phút |
| Dựng repo mới / đưa repo cũ lên chuẩn | [7](#7) | xem workflow |

---

## 1. Mở phiên {#1}

- [ ] Đọc `AGENTS.md` — hiến pháp, một trang
- [ ] Đọc mục 6 của nó — bản đồ "sắp làm X thì mở file nào"
- [ ] Đọc **phần cuối** `HANDOFF.md` — phiên trước làm tới đâu
- [ ] Nhận vùng mình sắp sửa: `npm run claim -- --take <vùng> --as <tên-phiên>`
- [ ] **Vùng có chủ khác → chỉ đọc.** Muốn giành thì hỏi chủ dự án, không tự lấy
- [ ] Chạy cửa kiểm **trước khi làm gì**: `npm run gate -- --as <tên-phiên>`
- [ ] Đỏ sẵn từ trước → **dừng và báo nguyên văn**. Đừng tự sửa cho nó xanh

> Đặt tên phiên theo việc, không theo ngày: `codex-khoi-a` chứ không phải `phien-3`.

## 2. Đóng phiên {#2}

**Thứ tự này không đổi được.** Ba chỗ dưới đây đã trả giá thật.

- [ ] `git add` **từng file**. Không `-A`, không `-u` — cả hai đều cuốn theo việc chưa commit của
      phiên khác, và chúng chỉ khác nhau một chữ cái
- [ ] Đọc lại `git status --short`: có file của ai khác lọt vào không?
- [ ] Commit nguồn, dòng cuối là `Lane: <tên-phiên>`
- [ ] **Rồi mới** chạy bộ sinh trang — nó đọc hoàn toàn từ lịch sử đã commit, nên chạy trước là
      dựng lại từ một quá khứ cũ, và trang vẫn sinh ra đẹp
- [ ] Commit trang sinh ra bằng **một commit riêng**
- [ ] `npm run gate -- --as <tên-phiên>` → **phải XANH TOÀN BỘ**
- [ ] `npm run push -- --as <tên-phiên>`
- [ ] Kiểm bằng máy chủ, **đừng tin `git status`**:
      `git ls-remote origin refs/heads/main` rồi `git merge-base --is-ancestor <sha> <sha-remote>`
- [ ] Ghi một dòng vào `HANDOFF.md`: làm gì · kết quả bằng số · còn gì mở
- [ ] **Chỉ sau khi push mới** trả vùng: `npm run claim -- --release <vùng> --as <tên-phiên>`

> Trả vùng trước khi push thì commit của bạn thành "việc không chủ", và cửa kiểm của phiên sau
> báo đỏ oan.

## 3. Sửa một lỗi {#3}

- [ ] **Tái hiện lỗi trước khi sửa.** Chưa dựng được ca hỏng thì chưa hiểu lỗi
- [ ] Sửa
- [ ] Viết một phép kiểm ghim đúng hành vi vừa sửa
- [ ] **Tự hỏi: fixture này có dựng nổi ca CÓ lỗi không?** Không thì phép kiểm đó là đồ trang trí
- [ ] **Commit trước khi thử phá** — bước khôi phục thường là `git checkout`, và nó xoá sạch việc
      chưa commit đang được thử
- [ ] **Thử phá:** cố ý làm hỏng lại đúng chỗ vừa sửa. Phép kiểm **phải đỏ**
- [ ] Phép kiểm không đỏ → nó chưa từng bảo vệ gì. Viết lại
- [ ] Đột biến "thoát" → nghi **đột biến của mình quá yếu** trước khi nghi phép kiểm

> Trong ba ngày đầu, repo này phát hiện **bảy** phép kiểm rỗng nghĩa — xanh mà không phân biệt
> được hai nhánh. Sáu do tự bắt, một do audit bắt.

## 4. Thêm công cụ hoặc tài liệu mới {#4}

- [ ] Đặt vào đúng thư mục theo tầng: `scripts/` máy · `docs/` luật và tài liệu · `tests/` phép kiểm
- [ ] **Khai một dòng vào mục 6 của `AGENTS.md`.** Không khai = không tồn tại, và cửa kiểm bắt
- [ ] Có lệnh chạy được thì thêm vào `package.json` → mục `scripts`
- [ ] Kèm phép kiểm, và làm theo mục [3](#3)
- [ ] Thư mục top-level mới thì phải khai vào `areas` của `.repo-structure.json`

## 5. Nhờ AI khác audit {#5}

- [ ] **Đóng băng một mốc.** Commit hết, push, ghi lại mã commit
- [ ] Viết đề bài nói rõ: đã đổi gì · tuyên bố nào cần kiểm · chỗ nào mình hay sai nhất
- [ ] Ghi rõ **"đã biết trước, không cần báo lại"** — kẻo nhận về một danh sách toàn thứ đã biết
- [ ] **KHÔNG đụng repo** cho tới khi có báo cáo
- [ ] Nhận báo cáo → **tự kiểm chứng từng phát hiện**. Báo cáo của AI khác không phải bằng chứng
- [ ] Sửa → thử phá → audit lại trên một mốc mới

> Vòng audit đầu tiên của repo này trả về `REJECT — STALE_EVIDENCE` vì mốc đổi **ba lần** trong
> lúc auditor đang chạy. Không ai nghiệm thu nổi một mục tiêu đang di chuyển.

## 6. Bảo trì định kỳ {#6}

Xem [BAO-TRI-DINH-KY.md](BAO-TRI-DINH-KY.md). Tóm tắt: mỗi phiên quét nhanh, mỗi tuần quét sâu,
mỗi tháng soát lại luật.

## 7. Dựng repo mới / đưa repo cũ lên chuẩn {#7}

Không tóm tắt ở đây — làm theo đúng workflow, vì thứ tự trong đó quan trọng:

- [Dựng repo mới](workflows/01-dung-repo-moi.md)
- [Đưa repo cũ lên chuẩn](workflows/02-dua-repo-cu-len-chuan.md)

---

## Bảy điều không bao giờ làm

| | Vì sao |
|---|---|
| Báo "xong" khi cửa kiểm chưa xanh | "Xong" thành lời tự khai, không kiểm được |
| **Nới cửa kiểm cho nó xanh** | Sửa lỗi thì được; gỡ bảo vệ thì không |
| `git add -A` hoặc `-u` | Cuốn theo việc chưa commit của phiên khác |
| `git push` trần | Đẩy kèm việc chưa được duyệt của người khác |
| Sửa vùng của phiên khác | Ghi đè im lặng — người bị mất việc không hề biết |
| Sửa file do máy sinh | Mất trắng ở lần sinh sau, và không ai hiểu vì sao |
| Tin `git status` sau khi đẩy | Nó đọc con trỏ trên máy, đúng thứ đang bị nghi |
