---
kind: brief
status: active
ttl_days: 180
---

# PHẦN CHUNG — luật cho MỌI phiên AI nhận việc từ bộ khung

> **Đừng đọc file này một mình.** Nó là nửa trên của một đề bài; nửa dưới là phần việc cụ thể.
> Lệnh `node scripts/giao-viec.mjs` ghép hai nửa lại và **đo repo đích trước khi ghép** — dùng
> lệnh đó, đừng chép tay hai file rồi dán.
>
> **Vì sao tách ra làm hai nửa:** ba loại việc (nâng · migrate · audit) dùng chung đúng bộ luật
> này. Chép nó ba lần là ba bản sẽ trôi khỏi nhau — repo này đã có ba bản chép tay của một danh
> sách nói ba kiểu khác nhau, và đó là lý do luật gốc cấm chép.

## A. Bạn đang làm việc trong repo của người khác

Repo đích **có luật riêng của nó**, thường nằm ở `AGENTS.md` hoặc `CLAUDE.md` ở gốc.

**Luật của chủ nhà THẮNG đề bài này.** Thấy repo đích cấm điều đề bài bảo làm thì **DỪNG và
báo** — đừng tự chọn một trong hai, đó là quyết định của người chốt.

Đo thật 2026-09-06: một repo đích có luật *"Cloud Sync Hold"* cấm ghi khi bản trên máy còn sau
bản trên cloud. Phiên Codex nhận việc đã **dừng đúng** và báo lại. Đó là kết quả tốt nhất có
thể, không phải một lượt thất bại.

## B. Ba giới hạn của `codex exec` — biết trước thì không mất phiên

Đo thật 06/09, lượt giao đầu tiên. Cả ba đều làm một phiên dừng giữa chừng:

| Giới hạn | Hệ quả | Ai lo |
|---|---|---|
| **Không chạy được `git fetch`** — sandbox từ chối ghi `.git/FETCH_HEAD` | Không đọc được nhánh xa; repo nào có luật "đồng bộ trước khi ghi" là dừng | **NGƯỜI GIAO** phải `git fetch` ở repo đích trước |
| **Từ chối chạy ngoài kho git** (`Not inside a trusted directory`) | Phiên chết ngay lệnh đầu | **NGƯỜI GIAO** phải `cd` vào repo đích rồi mới gọi |
| **Một lượt, không hỏi lại được** | Gặp chỗ phải xin phép là hết đường đi tiếp | Nên đề bài phải nói rõ **dừng ở đâu và báo cái gì** |

Lệnh gọi đúng:

```bash
cd "<REPO ĐÍCH>" && git fetch
node "<REPO BỘ KHUNG>/scripts/giao-viec.mjs" --viec <nang|migrate|audit> --repo "<REPO ĐÍCH>" --as <tên-phiên> > de-bai.txt
cd "<REPO ĐÍCH>" && codex exec -s workspace-write -c windows.sandbox='"unelevated"' - < de-bai.txt
```

## C. Tên phiên — đặt một lần, dùng suốt lượt

`<tên-phiên>` là nhãn bạn tự đặt, đặt theo **việc** chứ không theo ngày: `codex-nang-1314`,
không phải `phien-3`. Nó đi vào ba chỗ và **cả ba phải khớp nhau**:

- `--as` của mọi lệnh `claim.mjs`, `session-check.mjs`, `safe-push.mjs`
- dòng cuối của mỗi lời commit: `Lane: <tên-phiên>`
- bảng quyền `.agents/claims.json`

**`Lane:` là TÊN PHIÊN, không phải tên vùng.** Vấp thật: viết tên khoá vùng vào đó thì
`safe-push` báo bạn đang cuốn theo commit của người khác và **từ chối đẩy**, phải viết lại
lịch sử mới gỡ được.

## D. Nhận quyền trước khi chạm file

```bash
node scripts/claim.mjs --list
node scripts/claim.mjs --take <khoá> --as <tên-phiên> --task "một câu"
```

- Vùng **trống** → nhận rồi làm.
- Vùng **có chủ khác** → **DỪNG**, hỏi người chốt. Không tự giành.
- **Đừng sửa `.agents/claims.json` bằng tay.** Sửa tay là đọc-sửa-ghi, và hai phiên cùng đọc
  thấy "trống" rồi cùng ghi thì người ghi sau đè im lặng lên người ghi trước. Đã xảy ra thật.

## E. Cây làm việc bẩn — hỏi ĐÚNG một câu, đừng vội `git add -A`

Câu đó là: *những file đang sửa dở nằm TRONG hay NGOÀI vùng việc của mình?*

| Nằm ở | Làm gì |
|---|---|
| **TRONG** | **DỪNG** — hỏi người chốt. Bạn sắp ghi đè việc đang dở của ai đó |
| **NGOÀI** | làm tiếp, nhưng **TUYỆT ĐỐI không `git add -A`** — stage đúng đường dẫn của mình |

Khối **ĐO ĐƯỢC** ở đầu đề bài đã trả lời sẵn câu này và in luôn danh sách đường dẫn được phép
stage. Đọc nó, đừng đo lại bằng cảm tính.

Đo thật 06/09: một repo đích có ba file sửa dở, **cả ba ngoài** vùng bộ khung. `git add -A` lúc
đó là cuốn việc của phiên khác vào commit của mình rồi đẩy đi — đúng thứ `safe-push` sinh ra để
chặn, nhưng nó chặn ở tầng **commit**, không cứu nổi nếu đã trộn chung **một** commit.

## F. Chạy máy — thứ tự này không đổi được

```bash
npm test                       # phải exit 0
npm run bootstrap              # phải 0 chỗ ĐỎ (vàng thì được)
```

**Commit nguồn TRƯỚC, sinh artifact SAU, và bằng HAI commit riêng:**

```bash
git add <đúng đường dẫn của mình>
git status --porcelain          # kiểm lại: phần đã stage KHÔNG được có file lạ
git commit -m "<lời commit>

Lane: <tên-phiên>"

node scripts/build-dashboard.mjs
git add <đúng những artifact vừa sinh>
git commit -m "chore: sinh lai artifact theo HEAD

Lane: <tên-phiên>"
```

**Vì sao:** bộ sinh đọc **hoàn toàn từ HEAD**, không đọc cây làm việc. Sinh trước khi commit
nguồn thì trang phản ánh HEAD **cũ**, cổng đỏ, và nó hỏng **im lặng** — trang vẫn sinh ra đẹp
đẽ, chỉ là nói về một quá khứ khác. Đã vấp thật nhiều lần.

## G. Ghi Log, rồi cổng đóng phiên

Thêm **một mục mới ở CUỐI** `HANDOFF.md` của repo đích. **CHỈ THÊM.** Sửa hay xoá dòng cũ là
viết lại lịch sử của phiên khác, và cổng bắt được.

Mục Log phải có ba thứ: làm gì · **kết quả SỐ** (`npm test` bao nhiêu xanh, cổng bao nhiêu đỏ) ·
còn gì mở.

```bash
node scripts/session-check.mjs --as <tên-phiên>
```

**`XANH TOÀN BỘ` mới được báo xong.** Mỗi dòng đỏ đã nói luôn cách sửa.
**`CHƯA ĐỦ BẰNG CHỨNG` cũng chưa xong** — cổng chưa nhìn thấy được thứ nó phải canh.

## H. Đẩy và trả quyền — HAI lượt đẩy, đừng gộp

```bash
node scripts/safe-push.mjs --as <tên-phiên>          # lượt 1: việc
node scripts/claim.mjs --release <khoá> --as <tên-phiên>   # lặp cho từng khoá
git add .agents/claims.json && git commit -m "chore(quyen): tra khoa

Lane: <tên-phiên>"
node scripts/safe-push.mjs --as <tên-phiên>          # lượt 2: chỉ bảng quyền
```

**KHÔNG dùng `git push` trần.** Nhiều phiên AI dùng chung một thư mục git, nên `git push` của
bạn cuốn theo commit của mọi phiên khác — đã xảy ra thật.

**Vì sao hai lượt:** trả khoá trước commit cuối thì cổng bác (vùng bị sửa mà không ai đứng tên);
trả khoá sau một lượt đẩy duy nhất thì trên máy trống mà **trên remote vẫn ghi là đang bị giữ**.

## I. Năm việc BẠN KHÔNG ĐƯỢC TỰ LÀM

1. **Xoá file**, hoặc sửa dữ liệu gốc của repo đích.
2. **Ghi đè** một file mà công cụ báo là đã bị sửa tay.
3. **Giành vùng** một phiên khác đang giữ.
4. **Sửa cổng kiểm** cho nó xanh. Sửa bug thì được; gỡ bảo vệ thì không.
5. **`git push` trần**, force-push, hay merge vào `main`.

Gặp năm việc này → **DỪNG, mô tả rõ đang định làm gì, báo người chốt.**

## J. Báo cáo lại — năm dòng, không dài hơn

```
REPO       : <tên>
VIỆC       : <nâng | migrate | audit> · <chi tiết một cụm>
MÁY        : npm test <N> xanh · bootstrap <M> đỏ
CỔNG       : XANH TOÀN BỘ / còn đỏ mục nào
CÒN MỞ     : <một câu, hoặc "không có">
```

Dừng giữa chừng thì **vẫn báo đủ năm dòng**, và viết lý do dừng vào `CÒN MỞ`. Người chốt cần
**số**, không cần nhật ký từng bước.
