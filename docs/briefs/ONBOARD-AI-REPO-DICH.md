---
kind: brief
status: active
ttl_days: 365
---

# Đưa AI assistant của repo đích GO LIVE và nhận việc maintain

> **Đề bài này KHÔNG dùng để dán tay.** Sinh nó bằng lệnh, để nó mang theo số đo thật của repo đích:
>
> ```bash
> npm run giao-viec -- --viec onboard --repo "<đường-dẫn-repo-đích>" --as <tên-phiên>
> ```
>
> Đo không được thì lệnh **KHÔNG in gì**. Một đề bài onboard dựng trên số liệu đoán còn tệ hơn
> không có đề bài: nó dạy phiên AI mới tin sai về chính repo nó vừa nhận.

## Vì sao đề bài này tồn tại

Đo được sau ba lượt migrate: **3 lượt xong, 0 lượt có phiên AI ở repo đích chạy trọn một vòng làm
việc.** Bộ khung tới nơi, rồi **nằm đó**.

Đó không phải lỗi của lượt migrate. Migrate đưa *công cụ* tới; nó không đưa *người cầm* tới. Repo
có cổng kiểm mà không ai chạy, có bảng mà không ai sinh lại, có sổ nợ mà không ai ghi — và sau vài
tuần nó lệch khỏi chuẩn đúng bằng một repo chưa bao giờ migrate, chỉ khác là nó **trông như** đã
lên chuẩn.

Nên bước cuối của migrate không phải "cổng xanh". Bước cuối là: **một phiên AI ở repo đó tự chạy
được trọn một vòng, và biết ngày mai phải làm gì.**

---

## Bạn là ai trong lượt này

Bạn là **phiên AI thường trú của repo đích** — không phải phiên đi migrate. Migrate xong rồi; việc
của bạn là **nhận lấy** và **chạy tiếp một mình**.

Ba thứ bạn phải rời lượt này với:

1. **Biết repo mình đang cầm có gì và thiếu gì** — bằng số đo, không bằng đọc mô tả.
2. **Đã chạy trọn một vòng làm việc thật** — nhận khoá → làm một việc nhỏ → cổng xanh → đẩy → trả
   khoá → ghi Log. Chưa chạy hết vòng thì chưa biết vòng đó có chạy được ở đây không.
3. **Ghi lại đúng một việc kế** để phiên sau (có thể là chính bạn, sau khi mất hết ngữ cảnh) biết
   bắt đầu từ đâu.

---

## Lượt migrate đã làm 90% — bạn nhận 10% cuối, và nó là phần PHÁN ĐOÁN

Đừng bắt đầu từ số không. Phiên migrate vừa rời đi đã để lại **số đo, không phải lời dặn**:

| Đọc ở đâu | Nó đã làm sẵn gì cho bạn |
|---|---|
| `HANDOFF.md`, mục cuối | Nâng bản nào → bản nào, chỗ nào vấp, còn gì mở |
| `BACKLOG.md` | Mọi nợ tìm được, mỗi mục có `đóng khi:` — **kể cả kết quả `--trim`/`--check` đã chạy sẵn** |
| `decisions.md` | Quyết định phiên đó tự quyết trong phạm vi uỷ quyền, kèm lý do |
| `.repo-structure.json` | Bốn thước đã khai và đã siết: `budget.tokenNap` · `docs.tran_dong_khong_ke_adr` · `backlog.tran` · `handoff.tran_byte_moi_muc` |

**Vì sao 10% cuối lại là phần của BẠN, không phải của họ.** Nén bộ luật repo này đòi biết **nghề
của repo này** — câu nào thừa, câu nào đang gánh một ca hỏng thật. Phiên migrate không biết, nên
nó **đo và đính kèm phân tích** rồi dừng đúng chỗ. Thêm một lý do cứng: `rule-compiler.mjs` đóng
`ROOT` vào repo chứa nó, **không chạy từ xa được** — bản duy nhất compile được luật ở đây là bản
nằm ở đây.

Và bất biến mục 5: **người SỬA không tự NGHIỆM THU bản sửa của mình.** Phiên migrate lắp bộ nén;
nếu nó cũng dùng bộ nén đó viết lại hiến pháp repo bạn thì không còn ai độc lập soi kết quả. Bạn
là người soi.

> **Ngữ cảnh nằm trong SỔ, không nằm trong cửa sổ chat.** Cửa sổ chat của phiên migrate đã đóng;
> mọi thứ đáng giữ đều đã hạ cánh vào bốn chỗ trong bảng trên. Đọc chúng trước khi hỏi lại bất cứ
> điều gì — hỏi lại là trả tiền lần thứ hai cho một phép đo đã có số.

---

## Bảy bước, theo đúng thứ tự

### 1 · Đọc luật của CHÍNH repo này trước

`AGENTS.md` ở gốc repo đích. **Luật của repo này thắng trên đất của nó** — đừng bê luật của bộ
khung hay của repo khác sang. Rồi `HANDOFF.md`, đọc **phần cuối** file.

Repo đích có phụ lục nghề (`docs/ANNEX-*.md`) thì đọc luôn: nó chứa điều cấm riêng của nghề repo
này, và bộ khung không biết nghề đó.

### 2 · Đo mình đang thiếu tính năng nào

```bash
node scripts/features.mjs
```

Ba trạng thái, và **`[~]` MỘT PHẦN nguy hiểm hơn `[ ]` THIẾU**: mục một phần trông như đang chạy
nhưng hỏng ở chỗ không ai nhìn. Ca thật đã đo được: một repo có `scripts/session-check.mjs` nhưng
thiếu `npm run gate` — cổng có mặt mà không ai gọi được bằng tên chuẩn, nên trên thực tế nó không
tồn tại.

**Xử `[~]` trước `[ ]`.** Không xử theo thứ tự trong bảng.

### 3 · Đối chiếu với bộ khung gốc

`.ark/harness.lock.json` nói repo này đang ghim bản nào. `features.json` nói mỗi tính năng có từ
bản nào. Hai con số đó cho bạn danh sách **tính năng bộ khung đã có mà repo này chưa nhận**.

Thiếu nhiều thì **đừng tự nâng** — nâng bộ khung là việc của phiên ở repo phát hành, chạy
`upgrade.mjs`. Việc của bạn là **ghi vào sổ nợ** và nói cho người chốt biết, kèm con số.

### 4 · Chạy trọn một vòng làm việc THẬT

Không phải diễn tập. Chọn **một việc nhỏ có thật** — sửa một dòng sai trong tài liệu, khai một file
chưa vào Bản đồ file, đóng một mục nợ đã xong — rồi đi hết vòng:

```
nhận khoá → làm → cổng đóng phiên XANH TOÀN BỘ → commit (có dòng cuối `Lane: <tên-phiên>`)
          → đẩy bằng safe-push → trả khoá → commit lần hai → đẩy lần hai
```

**Hai lượt đẩy, không gộp.** Trả khoá trước commit cuối thì cổng bác ngay với *"vùng bị sửa nhưng
chưa ai đứng tên"* — và cổng đúng.

Vòng này hỏng ở bước nào thì **đó chính là phát hiện quan trọng nhất của lượt onboard**. Ghi lại
nguyên văn lỗi, đừng vá vòng vo.

### 5 · Sinh lại bảng, và kiểm bảng nói đúng

```bash
node scripts/build-dashboard.mjs && node scripts/build-overview.mjs
```

Rồi **mở bảng ra xem**. Bảng suy hoàn toàn từ HEAD, nên nó phải khớp với thứ bạn vừa đẩy. Không
khớp thì có một nguồn sự thật thứ hai ở đâu đó, và đó là lỗi nặng hơn mọi lỗi khác trong danh sách
này.

Repo này có `bang-song/` thì bật thử một lần — nhưng **đừng cài mục tự chạy lúc bật máy** nếu người
chốt chưa duyệt tường minh: đó là "tạo automation tự chạy", nằm trong danh sách phải hỏi.

### 6 · Ghi checklist tính năng vào hồ sơ migrate

Đo, đừng tự khai:

```bash
node scripts/features.mjs --migrate .
```

Dán khối đó vào hồ sơ migrate của repo này (`docs/migrations/`, hoặc chỗ repo này khai). Khối đó
mang **ngày đo** và **bản danh mục** — nên sáu tháng sau vẫn đọc được là lúc ấy repo có gì.

Hồ sơ migrate là vùng **chỉ thêm**: thêm khối mới, đừng sửa khối cũ.

### 7 · Đóng phiên đúng luật, và để lại MỘT việc kế

- Một dòng Log vào `HANDOFF.md`: làm gì · kết quả **số** · còn gì mở.
- Việc phát sinh ngoài phạm vi → `BACKLOG.md`, đừng tự làm.
- Hướng đi mới → `IDEAS.md`, **khác** sổ nợ.
- Người chốt vừa chốt gì → `decisions.md`.

Rồi ghi **đúng một việc kế** vào `STATUS.md` (hoặc chỗ repo này khai). Một việc, không phải năm.

---

## Năm việc CẤM trong lượt onboard

1. **Không nâng bộ khung.** Thiếu tính năng thì ghi vào sổ nợ, không tự kéo file từ repo khác về.
2. **Không sửa cổng kiểm cho nó xanh.** Cổng đỏ là thông tin. Sửa bug được; gỡ bảo vệ thì không.
3. **Không xoá file, không sửa dữ liệu gốc, không đụng vùng khai `append-only`.**
4. **Không tạo automation tự chạy** khi người chốt chưa duyệt tường minh.
5. **`--carry` (đẩy kèm commit phiên khác): điều kiện ở `AGENTS.md` mục 2 hàng 2 của repo đích, đọc ở đó.** Đừng nhớ theo câu này — luật đó đã đổi một lần và bản chép ở đây sai mất bốn ngày.

Ngoài năm việc này, tự làm. Nguyên tắc phía sau: **tự do trong phạm vi làm repo tốt lên và lùi lại
được. Cái gì không lùi lại được, hoặc chạm việc người khác, thì hỏi.**

---

## Báo cáo — đúng sáu dòng, rồi DỪNG

```
GO LIVE      : <vòng làm việc chạy hết chưa · hỏng ở bước nào>
TÍNH NĂNG    : <x xong · y một phần · z thiếu — theo features.mjs>
ĐÃ ĐẨY       : <mấy commit · nhánh nào · cổng xanh toàn bộ chưa>
LỆCH BỘ KHUNG: <repo ghim bản nào · bộ khung đang ở bản nào · thiếu tính năng nào>
CHỜ NGƯỜI CHỐT: <đúng những mục thuộc danh sách phải hỏi, hoặc "không có">
VIỆC KẾ      : <đúng MỘT việc, và nó đã nằm trong sổ của repo>
```

Sáu dòng này là **trần**, không phải sàn. Đừng kể thêm số commit, tên phép kiểm, hay diễn giải —
người đọc là người chốt, và họ đọc bảng chứ không đọc chat.

**Và một điều cuối, quan trọng hơn cả sáu dòng trên:** nếu lượt này có chỗ nào bạn *đoán* thay vì
*đo*, nói ra. Một bản báo cáo onboard nói "mọi thứ ổn" mà thật ra chưa kiểm thì nó làm hỏng đúng
cái nó được tạo ra để dựng — niềm tin rằng repo này đã có người cầm.
