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
| **Giao hẳn một việc cho AI khác làm** (nâng · migrate · audit) | [5b](#5b) | 2 phút |
| Chạy bảo trì định kỳ | [6](#6) | 20 phút |
| Dựng repo mới / đưa repo cũ lên chuẩn | [7](#7) | xem workflow |

---

## 1. Mở phiên {#1}

- [ ] Đọc `AGENTS.md` — hiến pháp, một trang
- [ ] Đọc mục 6 của nó — bản đồ "sắp làm X thì mở file nào"
- [ ] Đọc **phần cuối** `HANDOFF.md` — phiên trước làm tới đâu
- [ ] Nhận vùng mình sắp sửa: `node scripts/claim.mjs --take <vùng> --as <tên-phiên>`
- [ ] **Vùng có chủ khác → chỉ đọc.** Muốn giành thì hỏi chủ dự án, không tự lấy
- [ ] Chạy cửa kiểm **trước khi làm gì**: `npm run gate -- --as <tên-phiên>`
- [ ] Đỏ sẵn từ trước → **dừng và báo nguyên văn**. Đừng tự sửa cho nó xanh

> Đặt tên phiên theo việc, không theo ngày: `codex-khoi-a` chứ không phải `phien-3`.

## 2. Đóng phiên {#2}

**Thứ tự này không đổi được, và nó có lưu đồ.** Làm theo
[workflows/03 — một phiên làm việc](workflows/03-mot-phien-lam-viec.md). Quy trình đóng phiên
chỉ được vẽ ở **một chỗ**; đừng chép nó về đây.

Dưới đây chỉ là **lệnh chính xác**, để khỏi phải nhớ. Thứ tự thì xem lưu đồ:

| Bước trong lưu đồ | Lệnh |
|---|---|
| commit nguồn | `git add` **từng file** — không `-A`, không `-u`. Rồi commit, dòng cuối là `Lane: <tên-phiên>` |
| session gate | `npm run gate -- --as <tên-phiên>` |
| safe-push | `npm run push -- --as <tên-phiên>` |
| trả vùng — **sau** khi push | `node scripts/claim.mjs --release <vùng> --as <tên-phiên>` |

> **`Lane:` là gì.** Dòng cuối cùng của lời commit phải là `Lane: <tên-phiên>` — đó là chữ ký
> để sau này biết commit này của phiên nào.

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

## 5b. Giao hẳn một việc cho AI khác {#5b}

**Đừng viết đề bài bằng tay.** Đức chốt 06/09: Claude Code không làm hết một mình được, nên ba
việc lặp lại — **nâng · migrate · audit** — giao cho Codex CLI là mặc định.

- [ ] `cd "<REPO ĐÍCH>" && git fetch` — **người giao phải làm**, `codex exec` không chạy được
      `git fetch` (sandbox từ chối ghi `.git/FETCH_HEAD`)
- [ ] `npm run giao-viec -- --viec <nang|migrate|audit> --repo "<REPO ĐÍCH>" --as <tên-phiên> > de-bai.txt`
- [ ] Lệnh **DỪNG và không in gì** thì đọc mã lỗi trên stderr — đừng lách, mỗi mã là một chỗ
      thật sự không được đi tiếp
- [ ] `cd "<REPO ĐÍCH>" && codex exec -s workspace-write - < de-bai.txt` — **phải chạy từ TRONG
      repo đích**, Codex từ chối thư mục không phải kho git
- [ ] Nhận báo cáo năm dòng → **tự kiểm chứng lại từng con số** (luật vàng 4). Báo cáo là lời
      tự khai, chưa có lệnh nào đo lại — đó là `KHUNG-31`
- [ ] Phiên nhận việc báo **DỪNG vì luật của repo đích** → đó là kết quả ĐÚNG, không phải thất
      bại. Đưa lên người chốt, đừng bảo nó làm tiếp

> Đo thật 06/09: lượt giao đầu tiên dùng đề bài viết tay, và đề bài đó dạy `git add -A` vào một
> repo đang có ba file sửa dở của phiên khác. Lỗi ở đề bài, không ở phiên nhận việc.

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
