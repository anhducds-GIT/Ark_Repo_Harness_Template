---
status: Accepted
adr: 0020
chu_de: ranh-gioi
thuoc: 0001
date: 2026-09-11
deciders: AI (Đức uỷ quyền — `AGENTS.md` mục 2 "Đổi luật an toàn")
---

# ADR-0020 — Bản trích phát cửa audit mà không phát ổ khoá, nên cửa đó chỉ nói được "không"

## Chỗ hỏng, đo được chứ không đoán

`safe-push` có một cửa audit đọc `audit.nguoi_duyet` từ `.repo-structure.json` **trên đĩa**
(`repo-structure.mjs` → `nguoiDuyetFrom`). Cửa vào bộ khung ngày 10/09, bản `1.8.6`.

`.repo-structure.json` nằm trong tập **"cấu hình của repo đích"** (`build-template.mjs:1434`) nên
`upgrade` **không bao giờ** ghi đè nó — đúng, và cố ý. Nhưng `STRUCTURE_SEED` **không hề có** khối
`audit`. Nên bộ khung phát **cái cửa** đi mà **ổ khoá thì không đi theo**.

Đo 11/09 trên cả **5 repo** đã nhận bộ khung — `n8n-orchestrator` · `n8n_Local host` ·
`ALL_SKILL_MANAGEMENT` · `Project 3 AI Agent Unify` · `Chrome_Extension_AI_Agentic`: **5/5 khai
`audit` = `null`**. Hệ quả ở đó:

| Commit | Cửa audit làm gì |
|---|---|
| KHÔNG có nhãn `Audit:` | **ĐI QUA.** Và chỉ commit chạm `scripts/` hoặc `tests/` mới được một dòng ⚠; commit chỉ chạm CHỮ thì cửa **im lặng hoàn toàn** |
| CÓ nhãn, bất kể tên gì | **CHẶN** — mọi tên đều NGOÀI DANH SÁCH vì danh sách rỗng |

Tức ở repo đích, nhãn `Audit:` **chỉ có thể làm HẠI, không bao giờ giúp**. Ca thật phát hiện ra
nó: lượt nâng `n8n-orchestrator` lên `1.9.39` bị `safe-push` từ chối vì hai commit tự khai
`Audit: codex` — một nhãn nói **thật** lại là thứ khoá cửa lại.

Đây đúng bất biến vòng này đang đi sửa: **CÓ MẶT ≠ ĐANG BẬT** — máy còn nguyên, ổ khoá của nó
không tới, và triệu chứng giống hệt lúc đang chạy.

## Quyết định

1. `STRUCTURE_SEED` khai `audit.nguoi_duyet: ["codex", "duc"]`, kèm ba dòng `_doc` nói **vì sao
   phát kèm tên** và **"ĐỔI CHO KHỚP REPO BẠN"**. Mảng **RỖNG không sửa được bệnh, nó chỉ đổi tên
   bệnh** — cửa vẫn không nói được `đạt`.
2. `upgrade.mjs` ghép khối `audit` còn **THIẾU** vào repo đã có, **đúng khuôn phép ghép tên lệnh
   `package.json`** đã tồn tại: **THIẾU thì mang sang · ĐÃ CÓ thì chỉ kể tên, không ghi đè.** Ai
   được duyệt là quyết định của chủ repo đích.
3. Trạng thái thứ ba `RONG_VO_HIEU`: khai rồi mà **không tên nào có hiệu lực** (`{}` ·
   `nguoi_duyet: 5` · `[]` · tên sai khuôn như `"Codex"`) thì **NÊU TÊN, KHÔNG tự vá** — một danh
   sách rỗng **có thể là chủ repo cố ý** (*"không ai được duyệt ở đây"*).
4. Phép lọc tên **dùng chính `nguoiDuyetFrom` của `safe-push`**, không viết lại regex thứ hai.

## Cái MẤT — lời của người duyệt độc lập, không phải lời tôi

Codex, vòng audit 11/09, câu 6:

> *"bản vá mở quyền đi qua cho trailer tự khai `Audit: codex` hoặc `Audit: duc` ngay sau nâng cấp,
> trước khi chủ repo đổi danh sách; thứ mất là trạng thái fail-closed trước đó, nơi mọi trailer
> `Audit:` đều bị chặn ở repo chưa khai người duyệt."*

Nhận đúng như vậy, và nói rõ đánh đổi: trạng thái fail-closed đó là **cửa không nói `đạt` được bao
giờ**, nên nó không bảo vệ điều gì — nó chỉ đóng luôn con đường trung thực. Sau bản vá, repo đích
**vào cùng thế với repo nhà**: nhãn `Audit:` là **lời TỰ KHAI**, và **không máy nào kiểm được rằng
Codex đã thật sự chạy** — nợ đã mở sẵn ở `KHUNG-56`. Cái đổi được: một lượt audit thật **ghi lại
được**, và một danh sách người duyệt **nhìn thấy được** để chủ repo sửa.

## Hai chỗ audit độc lập sửa lại chính bản vá này

⑴ Tôi viết *"commit không nhãn thì đi qua với một dòng cảnh báo"* — **nói quá**. Cảnh báo chỉ áp
cho commit chạm `scripts/` hoặc `tests/` (`safe-push.mjs:337`); commit chỉ chạm chữ thì **không có
dòng nào**. Đã sửa cả trong mã lẫn trong chú thích.

⑵ Bản vá đầu đọc `audit: {}` · `nguoi_duyet: 5` · `[]` thành **`DA CO`**, nên `upgrade` bỏ qua
trong khi `safe-push` đọc ra danh sách rỗng — **đúng con bệnh đang sửa, ở một nhánh khác**. Sinh ra
trạng thái `RONG_VO_HIEU` ở mục 3.

## Phép ghim — năm đột biến, cả năm ĐỎ đúng vế của nó

| # | Đột biến | Vế đỏ |
|---|---|---|
| 1 | `ghepAudit` bỏ cửa chặn ghi đè | *"DA CO ma bi ghi de… hong IM LANG"* |
| 2 | `THIEU` bị đọc thành `DA CO` | *"repo khong khai `audit` phai la THIEU"* |
| 3 | Bỏ khối `audit` khỏi `STRUCTURE_SEED` | *"ban trich PHAI khai `audit.nguoi_duyet`"* |
| 4 | Khai tên sai khuôn `"Codex"` | *"ten nguoi duyet `Codex` SAI KHUON"* |
| 5 | Bỏ nhánh `RONG_VO_HIEU` | *"khong co ten nao co hieu luc… de nguyen mot CUA CHET"* |

Đột biến 3 và 4 đổi dấu vân tay tầng máy nên **sổ phát hành chặn trước** — chạy tách riêng đúng vế
đang đo, không kết luận từ một màu đỏ ở cửa khác (nếp bắt buộc số 3 của `docs/ROADMAP-V2.md`).
