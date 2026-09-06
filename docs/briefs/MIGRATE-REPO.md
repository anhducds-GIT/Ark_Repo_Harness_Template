---
kind: brief
status: active
ttl_days: 180
---

# PHẦN VIỆC — đưa một repo đang sống lên chuẩn

> **Nửa dưới của một đề bài.** Nửa trên là [GIAO-VIEC-CHUNG.md](GIAO-VIEC-CHUNG.md). Ghép bằng:
> `node scripts/giao-viec.mjs --viec migrate --repo "<REPO ĐÍCH>" --as <tên-phiên>`
>
> **Luật nền của cả lượt này:** repo đích **đã có việc, đã có lịch sử, đã có người dùng**. Nên:
> *thêm vào, đừng thay thế; và không bao giờ bật chặn khi đang đỏ.*
>
> **Đừng bắt đầu khi chưa có báo cáo audit.** Lượt audit (`--viec audit`) trả lời bảy câu, trong
> đó có câu *file nào trùng tên và trùng thì mất gì*. Migrate mà chưa biết câu đó là thả file đè
> lên nội dung không có ở đâu khác.

## LUẬT CỨNG — BỐN FILE KHÔNG ĐƯỢC ĐÈ

`AGENTS.md` · `DASHBOARD.md` · `decisions.md` · `handoff.md`/`HANDOFF.md`

Repo đích đã có thì **THÊM VÀO, không thay thế** — thêm một mục mới ở cuối, giữ nguyên phần cũ.
Đo trước và sau bằng **số dòng**, không chỉ kiểm "file còn tồn tại":

```bash
wc -l AGENTS.md DASHBOARD.md decisions.md handoff.md HANDOFF.md 2>/dev/null   # TRƯỚC, ghi lại
# ... làm việc ...
wc -l AGENTS.md DASHBOARD.md decisions.md handoff.md HANDOFF.md 2>/dev/null   # SAU, phải >= TRƯỚC
```

Số dòng **giảm** ở bất kỳ file nào trong bốn = đã đè mất nội dung. **Dừng, hoàn nguyên, báo.**

## Migrate là BA việc trong một — Đức chốt 2026-09-05

| # | Việc | Xong nghĩa là gì |
|---|---|---|
| 1 | **Migrate** | bộ khung nằm trong repo đích, hình dạng repo đã khai, cổng chạy được |
| 2 | **Audit** | đã quét repo đích, nợ tìm được đã nằm trong sổ nợ của nó |
| 3 | **Assistant onboard** | một phiên AI ở repo đích **chạy được vòng làm việc của nó ngay** |

**Lượt migrate KHÔNG xong khi cổng xanh.** Xong là khi việc 3 đạt — cấu trúc đúng mà không ai
vận hành được thì migrate chưa tạo ra giá trị nào. Ba phép thử của việc 3 ở mục 8 bên dưới.

## Tám bước, theo đúng thứ tự

### 1. Đo trước, và ghi lại con số

```bash
cd "<REPO BỘ KHUNG>" && node scripts/assess.mjs "<REPO ĐÍCH>"
```

Chưa đo mà đã thả file vào là mất mốc so sánh — sau này không ai chứng minh được lượt này có
đổi gì không.

### 2. Dựng bảng quyền trước tiên

Repo đích chưa có `.agents/claims.json` thì thả bản hạt giống vào **trước mọi thứ khác**. Bắt
đầu sửa khi chưa có bảng quyền là mở đường cho đúng lỗi mà cả cơ chế này sinh ra để chặn.

### 3. Thả nhóm MÁY — chép, không nghĩ

Sinh bản trích bằng `npm run template` ở repo bộ khung, đối chiếu sau khi thả bằng
`npm run template -- --check`.

**Không sửa gì trong lúc chép.** Sửa lúc này là tạo ngay một nhánh thứ hai của bộ máy, và hai
bản thì trôi khỏi nhau.

### 4. Khai hình dạng repo — bước DUY NHẤT phải NGHĨ

Trong `.repo-structure.json`:

| Trường | Khai gì | Sai thì sao |
|---|---|---|
| `repo.name` · `units.ten` | tên repo · gọi một đơn vị công việc là gì (Extension · Gói · Dịch vụ) | bảng gọi mọi thứ là "Đơn vị" — đúng nhưng vô hồn |
| `units` | đơn vị nằm đâu, sâu mấy tầng, file nào đánh dấu. **`units.marker` BẮT BUỘC là JSON** | khai một file `.md` thì bộ sinh bảng **chết**, còn cổng cấu trúc thì không — hai công cụ nói hai đằng |
| `areas` | mỗi thư mục tầng ngoài cùng một dòng. **Chia ít thôi lúc đầu** | chia nhỏ khi chưa biết ai làm gì là tự tạo tranh chấp; gộp lại sau dễ hơn tách ra |
| `bootstrap.blocking` | **để RỖNG** | bật chặn khi repo đang đỏ là tự khoá repo ngay ở phiên đầu tiên |
| `generated_names` | khai khi repo đích **đã có** `DASHBOARD.md` / `llms.txt` / `repo-map.json` | không khai là bộ sinh **đè im lặng** lên file viết tay của chủ nhà |

Kiểm ba tên trước khi chạy bộ sinh lần đầu:

```bash
ls DASHBOARD.md llms.txt repo-map.json 2>/dev/null   # có file nào là PHẢI khai tên khác
```

Khai thiếu khoá nào thì khoá đó dùng mặc định — vướng một tên không phải khai cả ba.

### 5. Khai `scripts.test`, kể cả khi repo chưa có test riêng

Suite hạt giống đi kèm bộ khung đã chạy được ngay. Không khai thì cổng đóng phiên **báo xanh mà
không chạy một dòng nào** — và nó sẽ im như thế mãi mãi. Đây là lỗi nặng nhất từng tìm thấy
trong chính bộ khung này.

### 6. Repo đích ĐÃ CÓ cơ chế hiệp đồng riêng — bộ khung là chuẩn, Đức chốt 2026-09-06

Ca này đã gặp ở **cả hai** repo chạm tới. Sau khi lắp bộ khung, **khoá vùng + cổng đóng phiên
là chuẩn**; cơ chế cũ thôi hiệu lực.

**Vì sao phải chốt một cái thắng, chứ không "giữ cả hai":** hai hệ song song thì một AI có thể
**hợp lệ theo hệ này mà vi phạm hệ kia**, và không ai sai cả.

**KHAI TỬ luật cũ, GIỮ văn bản cũ — hai việc khác nhau, đừng gộp:**

| Được làm | Không được làm |
|---|---|
| Thêm dòng *"KHÔNG CÒN HIỆU LỰC từ &lt;ngày&gt; — xem `AGENTS.md`"* ở đầu file luật cũ | Xoá file luật cũ |
| Trỏ từ file cũ sang luật mới | Ghi đè nội dung cũ bằng nội dung bộ khung |
| Ghi một dòng vào `decisions.md` của repo đích | Coi quyết định này là giấy phép xoá |

Một luật hết hiệu lực vẫn là **bằng chứng vì sao repo từng chạy như thế**. Quyết định này KHÔNG
lật luật bốn file cấm-đè ở trên.

### 7. Sinh trang, rồi mới chạy cổng

```bash
node scripts/build-dashboard.mjs   # SAU khi đã commit nguồn — xem mục F của phần chung
node scripts/check-bootstrap.mjs
node scripts/session-check.mjs --as <tên-phiên>
```

### 8. Ba phép thử của "assistant onboard" — CHƯA LÀM LÀ CHƯA XONG

1. `npm run what-next` chạy được, và **kể đúng** việc đang mở của repo đó — không phải in bảng
   rỗng vì chưa có sổ nợ.
2. `npm run state-check` trả một trong ba mã thoát thật (`OK` / `MISMATCH` / `UNKNOWN`), không nổ.
3. Một phiên AI mở ở repo đích, đọc `AGENTS.md` → `HANDOFF.md`, **nhận một khoá và làm trọn một
   việc nhỏ tới lúc cổng xanh** — không cần ai ở bộ khung giải thích thêm.

Phép 3 **phải chạy thật**, không suy từ hai phép trên. Hai lượt migrate 03/09 đều dừng ở mức
cổng xanh, tức chưa lượt nào đi qua phép này.

### 9. Ghim phiên bản, và ghi hồ sơ — HAI BƯỚC KHÔNG ĐƯỢC BỎ

```bash
cd "<REPO BỘ KHUNG>" && node scripts/upgrade.mjs --apply "<REPO ĐÍCH>"
```

Ghi `.ark/harness.lock.json` vào repo đích. Không ghim thì lần vá sau lại là chép tay, và chép
tay là cách một bộ khung biến thành N bộ khung khác nhau.

Rồi thêm **một** file `docs/migrations/<ngày>-<tên-repo>.md` ở **repo nhà của bộ khung**, theo
khuôn các hồ sơ đã có, và chạy `npm run so-migrate` rồi commit.

**Vì sao bắt buộc:** migrate xảy ra **thưa** — vài tuần, có khi vài tháng một lần. Đúng loại việc
mà cả người lẫn AI đều quên sạch. Hồ sơ **chỉ thêm, không sửa cái cũ**.

## Bốn cạm bẫy, cả bốn đều đã xảy ra thật

| Bẫy | Hậu quả |
|---|---|
| Bật `bootstrap.blocking` ngay từ đầu | Repo bị khoá ở phiên đầu tiên, không ai vào được |
| Chia `areas` quá nhỏ khi chưa biết ai làm gì | Tự tạo tranh chấp quyền cho việc không hề chồng nhau |
| Sinh trang trước khi commit nguồn | Trang dựng từ HEAD cũ — **hỏng im lặng**, trang vẫn đẹp |
| Sửa bộ máy trong lúc chép sang | Hai nhánh của cùng một công cụ, và chúng sẽ trôi khỏi nhau |

Thêm một chỗ **đúng thiết kế nhưng dễ tưởng mình sai**: cổng đóng phiên so nhãn `Lane:` với
`origin/main`. Repo làm việc trên nhánh tính năng thì phép kiểm đó **BỎ** chứ không xanh.

## Việc KHÔNG thuộc lượt này

- **Dọn nợ cũ của repo đích.** Lên chuẩn là thêm một lớp, không phải viết lại repo. Thấy nợ thì
  ghi vào sổ việc-mở của repo đó rồi đi tiếp.
- **Đổi luật của repo đích cho giống repo nhà.** Mỗi repo có nghề riêng.

## Nghiệm thu — bằng máy, không bằng lời

```bash
cd "<REPO BỘ KHUNG>" && node scripts/assess.mjs "<REPO ĐÍCH>"   # mức 3 · chi phí 0/0/0
cd "<REPO ĐÍCH>" && node scripts/session-check.mjs --as <tên-phiên>   # XANH TOÀN BỘ
```

Không đạt cả hai thì chưa xong. **Đừng nới cổng cho nó xanh.**

Dòng `VIỆC` của báo cáo năm dòng ghi: `migrate · mức <trước> → <sau>`.
