---
kind: brief
status: active
ttl_days: 180
---

# PHẦN VIỆC — đưa một repo đang sống lên chuẩn

> **Nửa dưới của một đề bài.** Nửa trên là [GIAO-VIEC-CHUNG.md](GIAO-VIEC-CHUNG.md). Ghép bằng:
> `node scripts/giao-viec.mjs --viec migrate --repo "<REPO ĐÍCH>" --as <tên-phiên>`
>
> **Luật nền:** repo đích **đã có việc, đã có lịch sử, đã có người dùng** — nên *thêm vào, đừng
> thay thế; và không bao giờ bật chặn khi đang đỏ.*
>
> **Đừng bắt đầu khi chưa có báo cáo audit** (`--viec audit`). Nó trả lời câu *file nào trùng tên
> và trùng thì mất gì*; chưa biết câu đó là thả file đè lên nội dung không có ở đâu khác.

## LUẬT CỨNG — hai điều, và cả hai đều là *đừng xoá việc của người ta*

**⑴ BỐN FILE KHÔNG ĐƯỢC ĐÈ:** `AGENTS.md` · `DASHBOARD.md` · `decisions.md` ·
`handoff.md`/`HANDOFF.md`. Repo đích đã có thì **THÊM VÀO** — mục mới ở cuối, giữ nguyên phần cũ.
Đo bằng **số dòng** trước và sau, không chỉ kiểm "file còn tồn tại"; **giảm một dòng = đã đè mất
nội dung → dừng, hoàn nguyên, báo.**

```bash
wc -l AGENTS.md DASHBOARD.md decisions.md handoff.md HANDOFF.md 2>/dev/null   # TRƯỚC và SAU
```

Bốn file này chỉ là bốn ca **nặng nhất**; nguyên tắc rộng hơn: **mọi file repo đích ĐÃ CÓ đều là
hợp nhất, không phải thay thế.** Đo 09/09 ở `n8n_Local host`: chép cả bản trích sang thì
`.gitignore` bộ khung đè bản của họ — mà bản của họ có dòng `.env`, file chứa API key. Không mất
chữ nào, mất một lớp an ninh.

**⑵ REPO ĐÍCH CÓ THỂ ĐI TRƯỚC BỘ KHUNG** — đừng cho rằng nó chỉ cũ hơn. Đo 09/09 ở
`Chrome_Extension_AI_Agentic`: thiếu 22 file của bộ khung **và** có một lớp bảo vệ bộ khung KHÔNG
có (dấu niêm phong `.agents/claims.json`). Lệch **cả hai chiều**.

```bash
comm -3 <(grep -ho 'export function [a-zA-Z]*' template/scripts/*.mjs | sort -u)         <(grep -ho 'export function [a-zA-Z]*' "<REPO ĐÍCH>"/scripts/*.mjs | sort -u)
```

`--force` khi họ đi trước là **xoá lớp bảo vệ của họ** — luật vàng 3 cấm. Đường đúng: **KÉO VỀ
NHÀ TRƯỚC → phát bản mới → rồi mới đẩy xuống.** **Và so theo NĂNG LỰC, đừng so theo TÊN HÀM:**
cùng lượt đó tôi đếm tên rồi báo Đức *"họ hơn ta 11 thứ"*, soát theo năng lực thì thật sự thiếu
**MỘT** — suýt bỏ nửa ngày chép về thứ đã có. Mỗi tên lạ phải hỏi: *bộ khung làm được việc này
chưa, dù gọi tên khác?*

## Migrate là BA việc trong một

Nhà của quyết định này là [decisions.md](../../decisions.md) — Đức chốt 2026-09-05. Tóm tắt vận
hành: ⑴ **migrate** (bộ khung vào, hình dạng đã khai, cổng chạy được) · ⑵ **audit** (đã quét, nợ
đã nằm trong sổ nợ của repo đó) · ⑶ **assistant onboard** (một phiên AI ở đó chạy được vòng làm
việc của nó ngay).

**Lượt migrate KHÔNG xong khi cổng xanh** — xong là khi việc ⑶ đạt; ba phép thử ở mục 8.

## Mười hai bước, theo đúng thứ tự

### 1–3. Đo · bảng quyền · thả nhóm MÁY — ba bước không phải nghĩ, nhưng ĐÚNG THỨ TỰ

```bash
cd "<REPO BỘ KHUNG>" && node scripts/assess.mjs "<REPO ĐÍCH>"   # 1 · chưa đo là mất mốc so sánh
npm run template                                                # 3 · sinh bản trích
npm run template -- --check                                     # 3 · đối chiếu sau khi thả
```

**Bước 2 nằm GIỮA hai bước trên:** repo đích chưa có `.agents/claims.json` thì thả bản hạt giống
vào **trước mọi thứ khác** — bắt đầu sửa khi chưa có bảng quyền là mở đường cho đúng lỗi mà cả cơ
chế này sinh ra để chặn.

**Không sửa gì trong lúc chép.** Sửa lúc này là tạo ngay một nhánh thứ hai của bộ máy, và hai bản
thì trôi khỏi nhau.

### 4. Khai hình dạng repo — bước DUY NHẤT phải NGHĨ

Trong `.repo-structure.json`:

| Trường | Khai gì | Sai thì sao |
|---|---|---|
| `repo.name` · `units.ten` | tên repo · gọi một đơn vị công việc là gì (Extension · Gói · Dịch vụ) | bảng gọi mọi thứ là "Đơn vị" — đúng nhưng vô hồn |
| `units` | đơn vị nằm đâu, sâu mấy tầng, file nào đánh dấu. **`units.marker` BẮT BUỘC là JSON** | khai một file `.md` thì bộ sinh bảng **chết**, còn cổng cấu trúc thì không — hai công cụ nói hai đằng |
| `areas` | mỗi thư mục tầng ngoài cùng một dòng. **Chia ít thôi lúc đầu** | chia nhỏ khi chưa biết ai làm gì là tự tạo tranh chấp; gộp lại sau dễ hơn tách ra |
| `bootstrap.blocking` | repo LẮP MỚI: **để RỖNG**. Repo ĐÃ GHIM bản cũ: xem ngay dưới bảng | bật chặn khi repo đang đỏ là tự khoá repo ngay ở phiên đầu tiên |
| `generated_names` | khai khi repo đích **đã có** `DASHBOARD.md` / `llms.txt` / `repo-map.json` | không khai là bộ sinh **đè im lặng** lên file viết tay của chủ nhà |

**Repo ĐÃ GHIM bản cũ thì `bootstrap.blocking` của nó SẼ GÃY**: nó khai mã mà bản mới đã **gộp**
(1.8.0 gộp `B5`+`B7` vào `B2`). Cổng ném `CHAN_MA_LA` và **từ chối chạy** — đúng, vì một mã gõ sai
là một phép kiểm tưởng đang chặn mà thật ra không chặn gì. Sửa cho khớp mã bản mới.

**Và "để RỖNG" chỉ đúng nếu có ai QUAY LẠI BẬT.** Đo 09/09 ở `n8n-orchestrator`: rỗng suốt bốn
ngày — cổng cấu trúc không cưỡng chế gì, không ai nhận ra. Hai vế: bật mọi mã đã **đo XANH** ở
repo đó; **không bao giờ** bật mã đang đỏ.

Kiểm ba tên trước khi chạy bộ sinh lần đầu:

```bash
ls DASHBOARD.md llms.txt repo-map.json 2>/dev/null   # có file nào là PHẢI khai tên khác
```

Khai thiếu khoá nào thì khoá đó dùng mặc định — vướng một tên không phải khai cả ba.

### 5. Khai `scripts.test`, kể cả khi repo chưa có test riêng

Suite hạt giống chạy được ngay. Không khai thì cổng **báo xanh mà không chạy một dòng nào**, và
im như thế mãi mãi — lỗi nặng nhất từng tìm thấy trong chính bộ khung này.

### 6. Repo đích ĐÃ CÓ cơ chế hiệp đồng riêng — bộ khung là chuẩn, Đức chốt 2026-09-06

Gặp ở **mọi** repo chạm tới tới giờ. Sau khi lắp, **khoá vùng + cổng đóng phiên là chuẩn**; cơ
chế cũ thôi hiệu lực. **Vì sao không "giữ cả hai":** hai hệ song song thì một AI có thể **hợp lệ
theo hệ này mà vi phạm hệ kia**, và không ai sai cả.

**KHAI TỬ luật cũ, GIỮ văn bản cũ — hai việc khác nhau, đừng gộp.** ĐƯỢC: thêm dòng *"KHÔNG CÒN
HIỆU LỰC từ &lt;ngày&gt; — xem `AGENTS.md`"* ở đầu file luật cũ · trỏ từ file cũ sang luật mới ·
ghi một dòng vào `decisions.md` của repo đích. **KHÔNG ĐƯỢC:** xoá file luật cũ · ghi đè nội dung
cũ bằng nội dung bộ khung · coi quyết định này là giấy phép xoá.

Một luật hết hiệu lực vẫn là **bằng chứng vì sao repo từng chạy như thế**, và quyết định này
KHÔNG lật luật bốn-file-cấm-đè ở trên.

### 7. Sinh trang, rồi mới chạy cổng — **MỌI thứ ở đây đọc HEAD, không đọc đĩa**

Sinh trang trước khi commit nguồn → trang dựng từ HEAD cũ, **hỏng im lặng** mà vẫn đẹp. Sửa
`.repo-structure.json` rồi chạy lại cổng mà vẫn thấy lỗi cũ → **bạn chưa commit**; đi sửa tiếp là
sửa một thứ đã đúng. Cùng bẫy `last_verified_commit`. Một chỗ **đúng thiết kế mà dễ tưởng mình
sai**: cổng so nhãn `Lane:` với `origin/main`, nên repo chạy trên nhánh tính năng thì phép kiểm
đó **BỎ**, không xanh.

```bash
node scripts/build-dashboard.mjs   # SAU khi đã commit nguồn — xem mục F của phần chung
node scripts/check-bootstrap.mjs
node scripts/session-check.mjs --as <tên-phiên>
```

### 8. Đo FEATURE, đừng đo FILE — `assess` xanh không có nghĩa feature đã sang

```bash
node scripts/features.mjs --migrate "<REPO ĐÍCH>"    # khối checklist, dán vào hồ sơ migrate
cd "<REPO ĐÍCH>" && node tests/features-smoke.mjs    # ĐỎ nếu có mục MỘT PHẦN
```

**`assess` đếm FILE, `features` đếm NĂNG LỰC.** Đo 09/09 ở `n8n_Local host`: `assess` báo **3/3,
chi phí 0/0/0**, `features-smoke` ĐỎ vì thiếu `F4.7` — **nội dung bên trong một file cấm đè**,
`--apply` không mang nổi. Vá bằng cách **THÊM một mục**, không viết lại.

Bốn dấu: `[~]` **một phần** nguy hơn `[ ]` **thiếu** (một nửa hỏng im lặng, thiếu thì còn đợi
được); `[!]` **có nhưng bản CŨ** là việc **NÂNG**, không thuộc lượt này — cùng lý do với dòng
*"việc NÂNG"* mà khối checklist tự in ra khi một cơ chế ra đời sau bản repo đích đang ghim.

### 9. Bốn thước, và bàn giao phần PHÁN ĐOÁN qua SỔ

`upgrade --apply` không mang được thước nào — tất cả nằm trong `.repo-structure.json`, file cố ý
thuộc repo đích. Khai đủ **bốn**, rồi đo và siết về **số thật + biên 30%**:

| Thước | Đo bằng | Chưa khai thì |
|---|---|---|
| `budget.tokenNap` | `node scripts/rule-compiler.mjs --nap` | bộ nén hạ cánh **TẮT**, cổng vẫn XANH |
| `docs.tran_dong_khong_ke_adr` | cổng tự in ở mục *Ngân sách* | kho chữ phình vô hình |
| `backlog.tran` | cổng tự in | sổ nợ phình vô hình |
| `handoff.tran_byte_moi_muc` | cổng tự in | trần mục nhật ký báo **BỎ QUA** = *"chưa kiểm được gì"* |

**Thước chỉ được SIẾT.** Và đây là **phần cơ học** — đo được, cộng thêm, lùi lại được, nên lượt
migrate làm hết, không để lại.

**Phần PHÁN ĐOÁN thì KHÔNG làm ở đây** — nén/gộp bộ luật sẵn có của repo đích. Ba lý do: ⑴
`rule-compiler.mjs` đóng cứng `ROOT`, **không có `--repo`** ⑵ câu nào thừa là phán đoán về
**NGHỀ của họ** ⑶ mục 5: người SỬA không tự NGHIỆM THU. **Nhưng đừng vứt phân tích đi** — chạy
chế độ ĐỌC tại repo đích rồi dán nguyên kết quả vào `BACKLOG.md` của họ, kèm `đóng khi:`:

```bash
cd "<REPO ĐÍCH>" && node scripts/rule-compiler.mjs --trim      # mục nào đáng cắt
cd "<REPO ĐÍCH>" && node scripts/rule-compiler.mjs --check     # luật nào trùng/mâu thuẫn
```

Phiên sau mở sổ ra là **đã có sẵn danh sách kèm số đo** — chỉ phải quyết, không phải phân tích
lại: **ngữ cảnh nằm trong SỔ, không nằm trong cửa sổ chat.**

### 10. Ba phép thử của "assistant onboard" — CHƯA LÀM LÀ CHƯA XONG

1. `npm run what-next` chạy được, và **kể đúng** việc đang mở của repo đó — không phải in bảng
   rỗng vì chưa có sổ nợ.
2. `npm run state-check` trả một trong ba mã thoát thật (`OK` / `MISMATCH` / `UNKNOWN`), không nổ.
3. Một phiên AI mở ở repo đích, đọc `AGENTS.md` → `HANDOFF.md`, **nhận một khoá và làm trọn một
   việc nhỏ tới lúc cổng xanh** — không cần ai ở bộ khung giải thích thêm.

Phép 3 **phải chạy thật**, không suy từ hai phép trên.

### 11. Ghim phiên bản, và ghi hồ sơ — HAI BƯỚC KHÔNG ĐƯỢC BỎ

```bash
cd "<REPO BỘ KHUNG>" && node scripts/upgrade.mjs --apply "<REPO ĐÍCH>"
```

Ghi `.ark/harness.lock.json` vào repo đích. Không ghim thì lần vá sau lại là chép tay — cách một
bộ khung biến thành N bộ khung khác nhau.

**HAI THỨ NỮA `--apply` KHÔNG MANG SANG** (bốn thước ở bước 9 là nhóm thứ ba). Tầng máy chỉ gồm
`.mjs` · `.cmd` · `features.json`; `.repo-structure.json` thì cố ý thuộc repo đích.

| Thứ | Thiếu thì sao | Làm gì |
|---|---|---|
| `STATUS.md` ở **GỐC** repo | `B2` **ĐỎ** — đơn vị gốc không có trang trạng thái | Dựng từ trạng thái THẬT của repo đó, khuôn ở `STATUS.template.md`. **Đừng bịa số** |
| `bang-song/` khai trong `areas` | `B3` **ĐỎ** — thư mục top-level không ai khai | Thêm một dòng `areas`; file `.mjs`/`.cmd` bên trong thì `--apply` đã mang |

Rồi thêm **một** file `docs/migrations/<ngày>-<tên-repo>.md` ở **repo nhà của bộ khung**, theo
khuôn các hồ sơ đã có, và chạy `node scripts/build-so-migrate.mjs` rồi commit.

**Vì sao bắt buộc:** migrate xảy ra **thưa** — đúng loại việc cả người lẫn AI đều quên sạch.
Hồ sơ **chỉ thêm, không sửa cái cũ**.

### 12. Sinh đề bài BÀN GIAO — lượt migrate làm 90%, đừng để 10% cuối rơi

```bash
npm run giao-viec -- --viec onboard --repo "<REPO ĐÍCH>" --as <tên-phiên-thường-trú>
```

In ra đề bài **đã mang số đo thật** của repo đó, cho phiên AI **thường trú** ở repo đích. Không
sinh thì 10% còn lại — quyết định nén luật, và vòng làm việc đầu tiên — không có ai nhận, và bộ
khung **nằm đó**: 3 lượt migrate đầu đều xong mà 0 lượt có phiên AI ở repo đích chạy trọn một vòng.

## Việc KHÔNG thuộc lượt này

- **Dọn nợ cũ của repo đích.** Lên chuẩn là thêm một lớp, không phải viết lại repo — thấy nợ thì
  ghi vào sổ việc-mở của repo đó rồi đi tiếp.
- **QUYẾT xem luật nào của repo đích đáng cắt.** Mỗi repo có nghề riêng, và người sửa không tự
  nghiệm thu. Lượt này **đo và đính kèm phân tích** (bước 9); người quyết là phiên thường trú.

## Nghiệm thu — bằng máy, không bằng lời

```bash
cd "<REPO BỘ KHUNG>" && node scripts/assess.mjs "<REPO ĐÍCH>"   # mức 3 · chi phí 0/0/0
cd "<REPO ĐÍCH>" && node scripts/session-check.mjs --as <tên-phiên>   # XANH TOÀN BỘ
```

Không đạt cả hai thì chưa xong. **Đừng nới cổng cho nó xanh.** Dòng `VIỆC` của báo cáo năm dòng
ghi: `migrate · mức <trước> → <sau>`.
