---
kind: brief
status: active
ttl_days: 180
---

# ĐỀ BÀI — nâng bộ khung cho một repo đã lắp

> **Dán trọn file này cho AI nào cũng được** (Codex, GPT, Claude). Nó cố ý **không giả định**
> bạn đã đọc repo bộ khung.
>
> **Vì sao có file này:** Đức chốt 2026-09-06 — *"Claude Code không thể làm hết một mình, sẽ hết
> usage"*. Việc nâng bộ khung là việc **lặp lại, có checklist, đo được bằng máy** — đúng loại
> việc giao cho AI khác. Nếu bạn đọc file này mà vẫn không làm nổi thì **đó là lỗi của file
> này**, không phải lỗi của bạn: ghi lại chỗ vấp vào `BACKLOG.md` của repo bộ khung.

## 0. Hai đường dẫn bạn cần

- **REPO BỘ KHUNG** — nơi chạy lệnh nâng cấp.
- **REPO ĐÍCH** — repo được nâng.

Lệnh nâng cấp **chạy ở repo bộ khung**, trỏ vào repo đích. Đừng chạy ngược lại.

## 0b. NGƯỜI GIAO VIỆC phải làm hai thứ TRƯỚC khi dán đề bài này

Đo thật 06/09, lượt giao đầu tiên cho Codex CLI — cả hai đều làm phiên đó dừng giữa chừng:

1. **Chạy `git fetch` ở repo đích trước.** `codex exec -s workspace-write` **không** chạy được
   `git fetch` — sandbox từ chối ghi `.git/FETCH_HEAD`. Phiên AI sẽ không đọc được trạng thái
   nhánh xa, và nếu repo đích có luật kiểu *"phải đồng bộ với cloud trước khi ghi"* thì nó dừng.

2. **Chạy lệnh từ TRONG repo đích, không từ thư mục cha.** Codex từ chối chạy ở thư mục không
   phải kho git (`Not inside a trusted directory`).

Và một câu nhắc cho **phiên nhận việc**: repo đích có luật riêng của nó. **Luật của chủ nhà
thắng đề bài này.** Thấy repo đích cấm điều đề bài bảo làm thì **DỪNG và báo**, đừng chọn một
trong hai — đó là quyết định của người chốt.

## 1. Trước khi chạm gì — đo, và nhận quyền

```bash
cd "<REPO ĐÍCH>"
git status --porcelain
node scripts/claim.mjs --list
```

**Cây làm việc bẩn thì đọc kỹ, đừng vội dừng và cũng đừng vội `git add -A`.** Hỏi đúng một câu:
*những file đang sửa dở đó có nằm trong vùng bộ khung không?* Vùng bộ khung là `scripts/` ·
`tests/` · `docs/` · `.ark/` · `package.json` · `.repo-structure.json` · Bản đồ file.

| File sửa dở nằm ở | Làm gì |
|---|---|
| **TRONG** vùng bộ khung | **DỪNG** — hỏi người chốt. Nâng cấp sẽ ghi đè việc đang dở của ai đó |
| **NGOÀI** vùng bộ khung | làm tiếp, nhưng **TUYỆT ĐỐI không `git add -A`** — xem mục 5 |

Đo thật 06/09 ở `Project 3 AI Agent Unify`: ba file đang sửa dở, **cả ba đều ngoài** vùng bộ
khung. `git add -A` lúc đó là cuốn việc của phiên khác vào commit của mình và đẩy đi — đúng thứ
`safe-push` sinh ra để chặn, nhưng nó chặn ở tầng **commit**, không cứu được nếu bạn đã trộn
chúng vào **cùng một commit**.

Nhận **mọi vùng** bạn sắp đụng. Nâng bộ khung chạm `scripts/` + `tests/` + `docs/` + gốc repo,
nên thường là ba tới bốn khoá:

```bash
node scripts/claim.mjs --take _code --as <tên-phiên> --task "nang bo khung"
node scripts/claim.mjs --take _docs --as <tên-phiên> --task "so tay moi"
node scripts/claim.mjs --take _root --as <tên-phiên> --task "ban do file + nhat ky"
```

`<tên-phiên>` là nhãn bạn tự đặt, ví dụ `codex-nang-1313`. **Dùng đúng một nhãn suốt lượt.**

Vùng nào **đã có chủ khác** thì **DỪNG** — hỏi người chốt, đừng giành.

## 2. Xem trước, rồi mới ghi

```bash
cd "<REPO BỘ KHUNG>"
node scripts/upgrade.mjs --plan "<REPO ĐÍCH>"
```

Đọc kỹ bảng. Sáu trạng thái, và **hai trạng thái làm bạn phải DỪNG**:

| Trạng thái | Nghĩa | Làm gì |
|---|---|---|
| `ĐÃ MỚI` | khớp bản khung | không làm gì |
| `CŨ` | bản cũ hợp lệ | `--apply` vá |
| `THIẾU` | repo đích chưa có | `--apply` mang sang |
| `ĐÃ BỎ` | bộ khung không phát nữa | **chỉ kể tên** — người quyết xoá hay giữ |
| **`SỬA TAY`** | **có người sửa file của bộ khung** | **DỪNG.** Đọc `git diff` ở repo đích, hỏi người chốt |
| **`CHƯA GHIM`** | file đã khác mà repo chưa có sổ ghim | **DỪNG.** Không đủ căn cứ nói đó là bản cũ hay bản vá tại chỗ |

Riêng khối **TÀI LIỆU** in ra sau, ba trạng thái, luật **khác hẳn** tầng máy:

| | Làm gì |
|---|---|
| `THIẾU` | `--apply` mang sang |
| `KHÁC` | **KHÔNG BAO GIỜ ghi đè** — chỉ kể tên, người tự trộn |
| `ĐÃ MỚI` | không làm gì |

**Vì sao khác:** tài liệu là chữ repo đích **được phép sửa** cho nghề của mình. Ghi đè là xoá
việc của người ta.

Không có `SỬA TAY` và `CHƯA GHIM` thì ghi:

```bash
node scripts/upgrade.mjs --apply "<REPO ĐÍCH>"
```

**Đừng dùng `--force` nếu bạn không tự đo được rằng file khác chỉ vì nó là bản cũ.**
Cách đo: ở repo đích chạy `git log --oneline -- scripts/` — nếu `scripts/` chỉ có đúng commit
lắp đặt thì không ai sửa tay, `--force` an toàn. Có commit khác thì **hỏi người chốt**.

## 3. Khai lệnh mới vào `package.json` của repo đích

Bản nâng có thể mang script mới mà repo đích chưa khai lệnh. Kiểm:

```bash
cd "<REPO ĐÍCH>"
ls scripts/*.mjs
node -e "console.log(Object.keys(require('./package.json').scripts))"
```

Script có mà lệnh chưa khai thì thêm vào `package.json`. Hai lệnh hay thiếu nhất:
`"can-nang": "node scripts/can-nang.mjs"` và `"don": "node scripts/don.mjs"`.

## 4. Khai file mới vào Bản đồ file — **cổng sẽ bắt nếu quên**

Bản đồ file nằm ở file mà `.repo-structure.json` khai trong `docs.file_map` (mặc định
`AGENTS.md`). **Mỗi file mới phải có một dòng.** Không khai = không tồn tại.

Một dòng gồm: *khi nào cần mở nó* → *liên kết bấm được* → *một câu nói nó giải quyết chuyện gì*.

## 5. Chạy máy — theo ĐÚNG thứ tự này

```bash
cd "<REPO ĐÍCH>"
npm test                       # phải exit 0
npm run bootstrap              # phải 0 chỗ ĐỎ (vàng thì được)
```

Rồi **commit nguồn TRƯỚC**, sau đó mới sinh artifact:

**Cây làm việc SẠCH từ đầu** thì `git add -A` an toàn:

```bash
git add -A
git commit -m "feat: nang bo khung <cu> -> <moi>

Lane: <tên-phiên>"
```

**Cây làm việc có file sửa dở NGOÀI vùng bộ khung** thì stage **đúng đường dẫn của mình**:

```bash
git add scripts tests docs .ark package.json .repo-structure.json AGENTS.md HANDOFF.md
git status --porcelain          # kiểm lại: KHÔNG được có file lạ trong phần đã stage
git commit -m "feat: nang bo khung <cu> -> <moi>

Lane: <tên-phiên>"
```

Sau khi commit, `git status` **vẫn phải còn** đúng những file sửa dở của người khác, y nguyên.

**Bây giờ mới** sinh lại bảng, và commit nó bằng **một commit RIÊNG**:

```bash
node scripts/build-dashboard.mjs      # hoặc npm run dashboard / npm run overview
git add <đúng những artifact vừa sinh>
git commit -m "chore: sinh lai artifact theo HEAD

Lane: <tên-phiên>"
```

**Vì sao phải đúng thứ tự này:** bộ sinh đọc **HOÀN TOÀN từ HEAD**, không đọc cây làm việc.
Sinh trước khi commit nguồn thì trang phản ánh HEAD **cũ**, và cổng sẽ đỏ. Đã vấp thật nhiều lần.

## 6. Ghi Log, rồi cổng đóng phiên

Thêm **một mục mới ở CUỐI** `HANDOFF.md` của repo đích. **Chỉ THÊM** — sửa hay xoá dòng cũ là
viết lại lịch sử của phiên khác, và cổng bắt.

Mục Log phải có: làm gì · **kết quả SỐ** (`npm test` bao nhiêu xanh, cổng bao nhiêu đỏ) · còn gì mở.

```bash
node scripts/session-check.mjs --as <tên-phiên>
```

**`XANH TOÀN BỘ` mới được báo xong.** Đỏ thì mỗi dòng đỏ đã nói luôn cách sửa.
**`CHƯA ĐỦ BẰNG CHỨNG` cũng chưa xong** — cổng chưa nhìn thấy được thứ nó phải canh.

**Tuyệt đối không sửa cổng cho nó xanh.**

## 7. Đẩy và trả quyền — **HAI lượt đẩy, đừng gộp**

```bash
node scripts/safe-push.mjs --as <tên-phiên>      # lượt 1: việc
node scripts/claim.mjs --release _code --as <tên-phiên>
node scripts/claim.mjs --release _docs --as <tên-phiên>
node scripts/claim.mjs --release _root --as <tên-phiên>
git add -A && git commit -m "chore(quyen): tra khoa

Lane: <tên-phiên>"
node scripts/safe-push.mjs --as <tên-phiên>      # lượt 2: chỉ bảng quyền
```

**KHÔNG dùng `git push`.** Nhiều phiên AI dùng chung một thư mục git, nên `git push` của bạn
cuốn theo commit của phiên khác — đã xảy ra thật.

**Vì sao hai lượt:** trả khoá trước commit cuối thì cổng bác (vùng bị sửa mà không ai đứng tên);
trả khoá sau lượt đẩy duy nhất thì trên máy trống mà **trên remote vẫn ghi là đang bị giữ**.

## 8. Bốn việc BẠN KHÔNG ĐƯỢC TỰ LÀM

1. **Xoá file** hoặc sửa dữ liệu gốc của repo đích.
2. **`--force`** khi bạn chưa tự đo được rằng file khác chỉ vì nó là bản cũ.
3. **Giành vùng** một phiên khác đang giữ.
4. **Sửa cổng kiểm** để nó xanh.

Gặp bốn việc này → **DỪNG, mô tả rõ đang định làm gì, hỏi người chốt.**

## 9. Báo cáo lại — năm dòng, không dài hơn

```
REPO       : <tên>
BẢN KHUNG  : <cũ> → <mới>
MÁY        : npm test <N> xanh · bootstrap <M> đỏ
CỔNG       : XANH TOÀN BỘ / còn đỏ mục nào
CÒN MỞ     : <một câu, hoặc "không có">
```

Không kể lại từng bước. Người chốt cần **số**, không cần nhật ký.
