---
kind: migration
repo: n8n_Local host
duong_dan: C:\WORKING ZONE\n8n_Local host
ngay: 2026-09-09
ban_khung: 1.8.0
nghe: n8n chạy trên máy bằng Docker — Đức mô tả automation bằng tiếng Việt, ba AI dựng workflow, xem sơ đồ ở localhost:5678
muc_truoc: 1
muc_sau: 3
chi_phi_truoc: thả 28 · viết 30 · soi 0
chi_phi_sau: thả 0 · viết 0 · soi 0
cong_dong_phien: XANH TOÀN BỘ · dãy B 0 đỏ 0 vàng
trang_thai: xong
loi_tim_ra: 2
viec_audit: xong
viec_assistant: xong
viec_ke: `NLH-1` — `build-overview.mjs` treo ở repo này, cần một phép ghim dựng được ca treo
khai_boi: harness-migrate-3repo 2026-09-09
---

## Lượt LẮP MỚI đầu tiên, không phải lượt nâng

Hai repo còn lại hôm nay đều đã ghim 1.3.76. Repo này **chưa từng ghim**: `assess` đo **0/62**
file khớp bản chuẩn, và **không có `package.json`** — tức trước lượt này không lệnh nào ở đây
chạy được một phép kiểm nào.

Nó vẫn ở mức 1/3 chứ không phải 0, vì bốn file luật viết tay đã có sẵn và **tốt**:
`design_brief.md` · `AGENTS.md` · `decisions.md` · `handoff.md`. Bộ khung thêm bộ máy, không
thêm luật nghề.

`init-repo.mjs` **không dùng được** ở đây — nó fail-closed khi thư mục không rỗng, và đúng như
thế. Đường đi: chép tay bản trích (bỏ file bị cấm đè) → khai hình dạng repo → ghim bằng
`upgrade --apply`.

## Suýt xoá mất một lớp bảo vệ — bằng một lệnh `cp`

Chép cả bản trích sang thì `.gitignore` của bộ khung **đè lên** `.gitignore` của repo đích. Bản
của họ có dòng `.env` — file đó chứa **API key n8n**. Đè là gỡ tấm chắn duy nhất giữa một API
key và một commit công khai.

Bắt được ngay bằng `git diff` sau bước chép, và hợp nhất lại: nội dung cũ trước, khối bộ khung
nối sau, đo lại **0 dòng bị xoá**.

**Luật bốn-file-cấm-đè chưa đủ.** Nó kể tên bốn file *tài liệu*. `.gitignore` không nằm trong đó,
mà đè nó thì mất một lớp an ninh chứ không mất chữ. Nguyên tắc đúng rộng hơn: **mọi file repo
đích ĐÃ CÓ đều là hợp nhất, không phải thay thế** — bốn file kia chỉ là bốn ca nặng nhất.

## `laneFromMessage` từ chối tên phiên có khoảng trắng — và nó đúng

Tên phiên tôi được giao có dấu cách. `session-check.mjs:1173` so nhãn `Lane:` trong commit với
`--as`, và `laneFromMessage` ném `LANE_CO_KHOANG_TRANG`: *"nhãn phiên là một từ"*. Nhãn có dấu
cách thì **không commit nào quy thuộc được**, và cổng đúng ra phải đỏ.

Tôi phát hiện **sau** commit đầu ở `nav_platform_main`, nên repo đó còn lại một commit không
nhãn — xem hồ sơ của nó. Từ đó đổi sang `harness-migrate-3repo` cho cả ba repo.

**Đã ghi luật này vào `AGENTS.md` của repo đích** (mục ba-việc-mở-phiên), vì phiên AI đầu tiên ở
đó sẽ đâm vào đúng chỗ này.

## Khai tử luật cũ mà GIỮ văn bản — ca thật đầu tiên của bước 6

Repo này có luật **"1 phiên"**: chỉ một phiên Claude được ghi file. Nó ra đời 25/08 sau khi hai
phiên Claude ghi đè `handoff.md` của nhau — tức **luật cũ dựa vào trí nhớ, và đã hỏng thật ngay
hôm nó sinh ra**.

Xử theo đúng bước 6: thêm dòng *"KHÔNG CÒN HIỆU LỰC từ 2026-09-09"* ngay dưới tiêu đề, **giữ
nguyên toàn bộ văn bản cũ**, trỏ sang mục khoá vùng mới, và ghi một dòng vào `decisions.md` của
repo đích. `AGENTS.md` 85 → 152 dòng: **chỉ thêm, không mất một chữ nào**.

## Đo tại chỗ

| | Trước | Sau |
|---|---|---|
| mức | 1/3 | **3/3** |
| file khớp bản chuẩn | 0/62 | **51/62** |
| `AGENTS.md` | 85 dòng | 152 dòng (thêm lớp bộ khung) |
| `HANDOFF.md` | 178 dòng | 181 dòng |
| nạp mỗi phiên | **chưa đo được** | **3.415 / 4.500 token** |
| dãy B | không chạy được | **0 đỏ · 0 vàng** |
| `npm test` | không có lệnh | **10 suite xanh** |

Cổng đóng phiên **XANH TOÀN BỘ**, đã đẩy. `state-check` → **STATE OK**.

## Nợ mang về

`NLH-1` ở repo đích: `node scripts/build-overview.mjs` **treo quá 300 giây, không output, không
lỗi** — cùng lệnh chạy xong trong vài giây ở hai repo kia. Thu hẹp được một nửa: nạp bằng
`import()` thì xong ngay, nên treo nằm ở nhánh chạy-trực-tiếp; nghi `execSync("node
scripts/check-bootstrap.mjs")` ở `build-overview.mjs:2289`, và đường dẫn repo này **có dấu cách**.

**Không làm đỏ cổng nào** vì `generators` của repo đó chỉ khai `build-dashboard.mjs` — đúng kiểu
hỏng im lặng mà bộ khung sinh ra để chặn. Gốc bệnh ở bộ khung; **chưa ghi được vào `BACKLOG.md`
của repo nhà vì lane `harness-loi-02` đang giữ khoá file đó.**
