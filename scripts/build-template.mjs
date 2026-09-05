/* BỘ TRÍCH TEMPLATE — sinh `template/` từ chính repo này.
 *
 * Vì sao là BỘ SINH chứ không phải chép tay (K1, 2026-09-02):
 * chép tay tạo ra hai bản của cùng một thứ, và hai bản thì trôi khỏi nhau — đúng cái bệnh cả
 * chương trình này sinh ra để chữa. Là bộ sinh thì `template/` trở thành **artifact tái sinh
 * được**, và `--check` biến "template có còn khớp bản gốc không" thành một câu hỏi máy trả lời.
 *
 *   node scripts/build-template.mjs           # sinh
 *   node scripts/build-template.mjs --check   # chỉ so, không ghi; lệch thì thoát 1
 *
 * ĐÂY LÀ CHỖ Ở TẠM. Theo ADR-0001, template sẽ sống ở một repo độc lập. `template/` trong repo
 * này là bãi tập kết để chứng minh trước khi dời — dời một bản trích chưa chứng minh thì chỉ
 * chuyển chỗ cho vấn đề.
 *
 * LUẬT TRÍCH (mục 10.2 của roadmap): bộ máy và bộ luật thì ĐI; bản đồ địa phương, trạng thái,
 * trang máy sinh và bằng chứng thì Ở LẠI. Chép nhầm nhóm cuối là mọi repo cùng hiển thị trạng
 * thái của repo Chrome.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = "template";

/* Script nào đi theo template. `feature-parity.mjs` CỐ Ý không có mặt: nó so hai nhánh worker
   của riêng repo Chrome, không phải hạ tầng chung. */
const PORTABLE_SCRIPTS = [
  // `claim.mjs` PHẢI đi theo: mục 1 của luật bắt mọi phiên nhận/trả quyền bằng lệnh này, và
  // audit độc lập 03/09 bắt được đúng chỗ đó — repo nhà khai luật bắt buộc dùng một file KHÔNG
  // TỒN TẠI. Luật trỏ tới một lệnh không chạy được thì nó không phải luật, nó là chữ.
  "claim.mjs",
  "repo-structure.mjs",
  "build-dashboard.mjs",
  "check-bootstrap.mjs",
  "session-check.mjs",
  "safe-push.mjs",
  // GÓI ASSISTANT (bản 1.3.0) — hai lệnh của vai ĐIỀU PHỐI. Chúng CHỈ ĐỌC, không đòi khoá nào,
  // và cả hai đã chạy được trên một repo cố tình khác hình dạng repo nhà (tên vùng khác · không
  // đơn vị con · thiếu cả ba sổ · không remote). Suite ghim đi kèm là `tests/assistant-smoke.mjs`
  // ở khối VERBATIM bên dưới — phát một lệnh mà không phát phép ghim của nó là phát một lời hứa.
  "state-check.mjs",
  "what-next.mjs"
];

/* Chép nguyên văn, không đổi một ký tự. */
const VERBATIM = [
  ["STATUS.template.md", "STATUS.template.md"],
  ["docs/_TEMPLATE-adr.md", "docs/_TEMPLATE-adr.md"],
  ["docs/_TEMPLATE-study.md", "docs/_TEMPLATE-study.md"],
  ["docs/_TEMPLATE-brief.md", "docs/_TEMPLATE-brief.md"],
  // GIAO THỨC ĐA PHIÊN — chép nguyên văn sang mọi repo dựng từ bộ khung. Bộ khung phát ra bốn
  // cơ chế chống hai AI giẫm chân nhau (bảng chủ sở hữu · nhãn `Lane:` · cổng đóng phiên · cổng
  // xuất bản) nhưng trước 04/09 KHÔNG phát ra tài liệu nào giải thích chúng — nên repo mới nhận
  // được công cụ mà không nhận được lý do, và phiên AI đầu tiên "dọn cho gọn" là mất chốt.
  // File này cố ý KHÔNG chứa số đo, KHÔNG kiểm kê chốt hiện có, KHÔNG bảng mã lỗi: ba thứ đó
  // khác nhau ở từng repo và mục nhanh hơn ai kịp sửa. Nó chỉ giữ nguyên lý + cách bảo trì.
  ["docs/protocols/MULTIFLOW.md", "docs/protocols/MULTIFLOW.md"],
  // SUITE HẠT GIỐNG — MỘT bản dùng cho cả repo này lẫn mọi repo dựng từ bộ khung. Chép nguyên
  // văn chứ không nhúng thành chuỗi trong file này, vì hai lý do: nhúng một file JS vào một
  // template literal là mời gọi hỏng do backtick và `${`, và quan trọng hơn — chép nguyên văn
  // nghĩa là repo gốc CHẠY THẬT đúng cái nó phát cho người khác. `--check` không cho hai bản
  // trôi khỏi nhau. Bốn khối bên trong đều đã qua đột biến.
  ["tests/harness-smoke.mjs", "tests/harness-smoke.mjs"],
  // SỔ TAY VAI ĐIỀU PHỐI — bản portable. Bộ khung phát ra hai lệnh của vai đó (`state-check`,
  // `what-next`) nhưng trước 1.3.0 không phát ra tài liệu nào nói vai đó ĐƯỢC LÀM GÌ và KHÔNG
  // được làm gì. Công cụ không kèm hàng rào thì hàng rào là thứ đầu tiên mất.
  ["docs/protocols/ORCHESTRATOR.md", "docs/protocols/ORCHESTRATOR.md"],
  // PHÉP GHIM CỦA GÓI ASSISTANT — chép nguyên văn, cùng lý do như suite hạt giống: repo gốc
  // CHẠY THẬT đúng cái nó phát cho người khác, và `--check` không cho hai bản trôi khỏi nhau.
  // Khối E của nó tự dựng một repo git thật có hình dạng khác hẳn, nên nó chứng minh được
  // "chạy ở repo lạ" ngay tại repo vừa dựng, không cần ai đi kiểm hộ.
  ["tests/assistant-smoke.mjs", "tests/assistant-smoke.mjs"],
  // KIỂU XUỐNG DÒNG — phải đi theo, và đây là lý do đo được, không phải sở thích. Máy Windows
  // tự đổi kiểu xuống dòng lúc lấy file ra khỏi kho, nên CÙNG MỘT COMMIT tồn tại ở hai dạng
  // byte và `git status` nói SẠCH ở cả hai. Đo ở repo nhà ngay trước khi thêm: 75 file LF, 21
  // file CRLF, cổng vẫn xanh. Hệ quả đã cắn thật: một phép kiểm đọc mã nguồn rồi cắt theo dòng
  // XANH trên máy vừa ghi file và ĐỎ với người vừa clone — 28 lượt xanh rồi chết, và triệu
  // chứng trông như "phép kiểm tự nhiên hỏng" nên không ai tìm đúng chỗ.
  // Repo nhà vá 05/09; bản trích thì tới 05/09 mới mang theo, nên mọi repo dựng trước đó vẫn
  // dính nguyên. Không nằm trong tầng máy (`scripts/` · `tests/`) nên KHÔNG đổi dấu vân tay
  // bản phát — đã đo trước khi làm, chính vì thế lượt này không phải cắt bản mới.
  [".gitattributes", ".gitattributes"]
];

/* ADR-0000 CỐ Ý KHÔNG chép nguyên văn. Bản gốc kể lại lịch sử di trú của riêng repo gốc — ba
   file `decisions.md`, số quyết định của từng gói — và nó là bản ghi BẤT BIẾN nên không được
   sửa. Đúng hơn về mặt khái niệm: ADR-0000 của mỗi repo là *quyết định của chính repo đó* về
   việc áp dụng ADR, không phải bản sao quyết định của người khác. Nên template mang một hạt
   giống: giữ nguyên bốn luật, thay phần bối cảnh bằng bối cảnh của một repo mới. */
const ADR_SEED = `---
status: Proposed
adr: 0000
date: YYYY-MM-DD
deciders: <ai chốt>
---

> **Hạt giống — chưa có hiệu lực.** Đổi \`status\` thành \`Accepted\`, điền \`date\` và
> \`deciders\` khi chủ repo chốt. Việc đó là **hành động nhận luật**, không phải thủ tục:
> từ lúc đó mọi ADR \`Accepted\` trong repo này trở thành bất biến và phép kiểm B12 cưỡng chế.
>
> Cố ý để \`Proposed\` chứ không phải \`Accepted\`, vì hai lý do. Một: một quyết định mang ngày
> \`YYYY-MM-DD\` và người chốt \`<ai chốt>\` thì chưa ai chốt cả. Hai: B12 khoá mọi ADR đã
> \`Accepted\`, nên phát đi ở trạng thái đó là khoá luôn cả bộ sinh template — lần cập nhật
> bộ khung sau sẽ bị chính cổng kiểm chặn.

# ADR-0000 — Ghi nhận quyết định kiến trúc bằng ADR bất biến

## Bối cảnh

Repo này vừa được khởi tạo từ bộ khung. Chưa có quyết định kiến trúc nào được ghi lại.

Cách làm mặc định — ghi quyết định vào một file dài kiểu \`decisions.md\` — hỏng theo ba kiểu,
đo được ở repo mà bộ khung này rút ra:

1. **Không tra được.** Muốn biết vì sao đã chọn X thay vì Y thì phải đọc dò cả file. Không có
   địa chỉ để trỏ tới.
2. **Không bất biến.** Một dòng sửa được, và không ai biết nó đã bị sửa — trong khi bằng chứng
   vận hành, thứ yếu hơn, thì đã được cổng kiểm bảo vệ.
3. **Quan hệ thay thế viết bằng văn xuôi.** *"Thay cho dòng bên dưới"* trỏ theo vị trí vật lý;
   thêm một dòng ở giữa là lời trỏ đó sai.

## Quyết định

Quyết định kiến trúc được ghi thành **ADR** — mỗi quyết định một file, chuẩn Nygard, đúng bốn
mục: **Bối cảnh · Quyết định · Hệ quả · Trạng thái**.

**Bốn luật:**

1. **ADR ở trạng thái \`Accepted\` là BẤT BIẾN**, ngang hàng bằng chứng vận hành. Không sửa nội
   dung, kể cả sửa lỗi chính tả.
2. **Đổi ý = viết ADR MỚI.** ADR cũ chuyển sang \`Superseded by ADR-NNNN\`; **hai bên phải trỏ
   nhau** — bản mới nói nó thay cái nào, bản cũ nói nó bị cái nào thay.
3. **Hai tầng, theo phạm vi của quyết định:** quyết định của một đơn vị công việc →
   \`<đơn-vị>/docs/adr/\`; quyết định của cả repo → \`docs/adr/\` ở gốc. Đánh số liên tục trong
   phạm vi **từng thư mục**, bắt đầu \`0001\` (thư mục gốc bắt đầu từ ADR này, \`0000\`).
4. **Sổ quyết định cũ không bị xoá.** Nó là bản ghi có thật; nội dung chuyển đi thì nó trở
   thành **mục lục** trỏ sang từng ADR, kèm một dòng nói rõ chuyển đi đâu và vì sao.

Luật 1 được **cưỡng chế bằng máy**, không phải bằng lời hứa: phép kiểm **B12** trong
\`scripts/check-bootstrap.mjs\` đi ngược lịch sử git của từng file ADR, tìm commit đầu tiên đưa
nó sang \`Accepted\`, và báo lỗi nếu **phần thân** đổi sau mốc đó. Sửa riêng frontmatter thì
được — đó chính là cách một ADR bị thay thế đúng luật (luật 2).

## Hệ quả

**Được:**

- Mỗi quyết định có một địa chỉ trỏ được, thay vì "dòng thứ mấy trong một file dài".
- Quan hệ thay thế thành dữ liệu máy đọc được, không còn là văn xuôi trỏ theo vị trí.
- B12 thôi in \`KHÔNG ÁP DỤNG\` — trước khi có thư mục ADR, nó là một phép kiểm không có gì để kiểm.

**Mất, và phải nói thẳng:**

- **Ghi một quyết định tốn công hơn.** Trước: thêm một dòng. Nay: tạo file, đánh số, viết đủ bốn
  mục. Đây là chủ đích — thứ đắt hơn thì được cân nhắc kỹ hơn.
- **Sửa sai một ADR đã \`Accepted\` không còn là việc sửa file**, mà phải viết ADR mới. Với lỗi
  chính tả thì phiền; đổi lại là bản ghi đáng tin.
- **Nhiều file nhỏ.** Duyệt bằng mắt sẽ phải cuộn. Đổi lại là tra được bằng đường dẫn.

## Trạng thái

Accepted
`;

/* Gốc repo có `package.json`, tức nó LÀ một đơn vị công việc theo khối `units` — nên nó phải
   có `STATUS.md`. Phép thử repo rỗng bắt được đúng chỗ này: bản trích đầu tiên thiếu file này
   và cổng kiểm đỏ ngay ở B1. Đây là lý do phép thử tồn tại. */
const STATUS_SEED = `---
schema: extension-status/v2
id: repo-goc
name: Đổi thành tên repo của bạn
lifecycle: idea
owner: chua-khai
priority_rank: 1
next_step: "Sửa .repo-structure.json cho khớp repo này, rồi chạy cổng kiểm cấu trúc lần đầu"
version_source: package.json
current_focus: "Repo vừa khởi tạo từ bộ khung; chưa khai gì thêm"
ref_readme: README.md
ref_handoff: HANDOFF.md
---

# Trạng thái — gốc repo

> **Đây là file KHAI BẰNG TAY.** Bảng điều hành đọc phần đầu file này; đừng gõ tay số nào mà
> máy đo được. Khuôn đầy đủ và luật: \`STATUS.template.md\`.

Repo vừa được khởi tạo từ bộ khung, chưa có việc thật nào.

**Ba việc đầu tiên, theo đúng thứ tự:**

1. Sửa \`.repo-structure.json\` — khối \`units\` (đơn vị của bạn nằm đâu) và \`areas\` (mỗi thư mục
   top-level một dòng).
2. Chạy \`npm run dashboard\` để sinh cổng vào máy đọc. **Trước bước này, phép kiểm điều hướng
   sẽ báo vàng vì chưa có gì để đi từ đó** — đúng, không phải lỗi.
3. Chạy \`npm run bootstrap\` để biết repo đang nợ những gì.

Sửa xong ba bước trên thì thay toàn bộ nội dung file này bằng trạng thái thật.
`;

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");

/* Thay thế CÓ CHỦ ĐÍCH, liệt kê từng cặp để người audit thấy đúng cái gì bị đổi.
   Cố tình KHÔNG dùng regex quét bừa: quét bừa thì một ngày nào đó nó sẽ đổi một chuỗi mà không
   ai ngờ tới, và không ai phát hiện được vì không có danh sách để đối chiếu. */
const GENERIC = [
  ["`workers/duc-auto-chatgpt/v0.1.0/manifest.json` thật sự ghi version `0.3.0`",
   "`workers/<gói>/v0.1.0/manifest.json` thật sự ghi version `0.3.0`"]
];

function genericize(rel, text) {
  let out = text;
  for (const [from, to] of GENERIC) out = out.split(from).join(to);
  return out;
}

/* Phụ lục nghề — bản CÓ THẬT, không phải ví dụ bịa. Chín dòng bị tách khỏi luật chung nằm
   nguyên ở đây. Repo không làm nghề này thì xoá file đi; giữ lại một phụ lục sai nghề còn tệ
   hơn không có phụ lục. */
const ANNEX_SEED = `---
kind: annex
nghe: tự động hoá trình duyệt
status: optional
---

# PHỤ LỤC NGHỀ — tự động hoá trình duyệt

> **Tuỳ chọn.** Repo bạn không lái trình duyệt thì **xoá file này** và xoá dòng trỏ tới nó ở
> mục 6 của \`AGENTS.md\`. Giữ một phụ lục sai nghề còn tệ hơn không có phụ lục: nó dạy phiên AI
> sau tuân luật cho một việc repo này không làm.

Chín luật dưới đây từng nằm trong luật chung của repo sinh ra bộ khung. Chúng **đúng** — mỗi
dòng là một lần trả giá thật — nhưng chỉ đúng với repo lái trình duyệt. Để lẫn vào luật chung
là ép một repo tài liệu tuân luật về selector DOM.

## Phải hỏi chủ repo trước

1. **Thêm quyền (permission) mới cho extension.** Quyền là thứ người dùng cuối nhìn thấy và
   phải đồng ý; thêm âm thầm là đổi hợp đồng với họ.
2. **Chạy pilot live mới trên trang thật.** Chạy thật thì tốn lượt thật và để lại dấu vết thật.

## Luật vàng, bản của nghề này

3. **Không đoán selector.** Mọi selector phải có bằng chứng DOM thật. Cần bằng chứng mới →
   gọi \`diagnostics.dom_probe\` qua Bridge, đừng mượn mắt chủ repo.
4. **Suite không chạm DOM thật**, nên fixture bằng chứng là vàng: một bản chụp DOM có thật
   đáng giá hơn mười phép kiểm dựng trên DOM tưởng tượng.

## Vùng cấm sửa

5. **\`pilot-*/\` · \`Pilot-*/\` · \`Batch-*/\` · \`evidence/\`** — bằng chứng vận hành. Chỉ được
   THÊM mới, không sửa, không xoá, không tạo lại.
6. **Không bao giờ gán \`.innerHTML\` / \`.outerHTML\` / \`insertAdjacentHTML\`.** Trang đích là
   nội dung không tin được; gán thẳng HTML là mở cửa cho nó chạy code trong ngữ cảnh của bạn.

## Vai

7. **Vận hành Bridge** thuộc về phiên làm kiến trúc/điều phối, không phải phiên dựng UI.

## Đóng phiên

8. **Gặp lỗi mới trên trang thật** → thêm một dòng vào bảng lỗi của sổ tay vận hành. Trang thật
   đổi mà không báo trước; bảng lỗi là bộ nhớ duy nhất giữa các phiên.
9. **Mỗi lỗi mới trên trang thật cũng là ứng viên cho một phép kiểm máy** — cân nhắc thêm vào
   cổng đóng phiên. Luật nào không kiểm được bằng máy thì sớm muộn cũng bị bỏ qua.
`;

const ANNEX_TEMPLATE = `---
kind: annex
nghe: <tên nghề của repo bạn>
status: optional
---

# PHỤ LỤC NGHỀ — <tên nghề>

> Chép file này thành \`docs/ANNEX-<ten-nghe>.md\`, rồi khai một dòng vào bản đồ mục 6 của
> \`AGENTS.md\`. Không khai = không tồn tại.

**Phụ lục là gì:** luật chỉ đúng với **nghề** repo bạn làm, không đúng với mọi repo. Nếu một
dòng luật đúng với cả repo tài liệu lẫn repo hạ tầng thì nó thuộc luật chung, đừng để ở đây.

**Phép thử một câu:** *"Một repo hoàn toàn khác nghề có phải tuân dòng này không?"* — Có thì
nó là luật chung. Không thì nó thuộc phụ lục.

## Phải hỏi chủ repo trước

<Việc nào của nghề này tốn tiền thật, đổi hợp đồng với người dùng, hoặc không lùi lại được?>

## Luật vàng, bản của nghề này

<Nghề này lấy bằng chứng bằng cách nào? Cái gì ở đây dễ ĐOÁN nhất, và đoán sai thì mất gì?>

## Vùng cấm sửa

<Thư mục nào chỉ được thêm? Hàm/cấu trúc nào không bao giờ được dùng, và vì sao?>

## Đóng phiên

<Bài học nào của nghề này phải ghi lại, kẻo phiên sau vấp đúng chỗ?>

---

**Mỗi dòng phải kể được một lần trả giá.** Không nhớ nổi vì sao có dòng đó thì đừng viết —
luật không ai giải thích được là luật sẽ bị bỏ qua.
`;

/* ---- phụ lục nghề: tách luật CHUNG khỏi luật của một NGHỀ ------------------
   Repo này là repo tự động hoá trình duyệt, nên luật của NÓ nói về selector, về DOM, về chạy
   thử trên trang thật. Đúng với nó. Nhưng bản trích thì đi sang repo tài liệu, repo hạ tầng,
   repo điều phối — và ở đó chín dòng ấy là luật của một nghề mà repo đó không làm.

   Đo được (02/09): mục 0 · 1 · 6 có 0 dòng thuộc riêng nghề; mục 2 có 2, mục 3 có 3, mục 4
   có 2, mục 5 có 1, mục 7 có 1. Tổng CHÍN.

   BA TẦNG, không phải hai: luật chung (mọi repo) · phụ lục nghề (bật khi cần) · bản đồ địa
   phương (mục 6, vốn đã cắt). Chín dòng kia không bị VỨT — chúng là bài học trả giá thật —
   mà chuyển sang docs/ANNEX-tu-dong-hoa-trinh-duyet.md.

   THAY, KHÔNG XOÁ. Mục 2 có tiêu đề "Ba việc" và đúng ba mục; xoá hai mục thì tiêu đề nói dối.
   Mỗi dòng có một bản thay tương đương ở mức chung, và mỗi bản thay phải khớp ĐÚNG MỘT LẦN —
   không khớp thì NÉM, vì một dòng luật nghề lọt vào bản trích là hỏng im lặng. */
const NGHE = [
  ["## 2. Ba việc PHẢI hỏi Đức trước", "## 2. Những việc PHẢI hỏi Đức trước"],
  [
    "1. Thêm quyền (permission) mới cho extension\n2. Chạy pilot live mới trên trang thật\n3. Đổi luật an toàn (retry, halt, attribution, persistence, exact-once)",
    "1. Đổi luật an toàn của repo (thử lại · dừng khẩn · quy trách nhiệm · lưu trạng thái · làm-đúng-một-lần)\n2. Bất cứ việc nào **phụ lục nghề** của repo bạn liệt kê — xem `docs/ANNEX-*.md`"
  ],
  [
    "1. **Không đoán selector.** Mọi selector phải có bằng chứng DOM thật. Cần bằng chứng mới →\n   gọi `diagnostics.dom_probe` qua Bridge, đừng mượn mắt Đức.",
    "1. **Không đoán.** Mọi khẳng định về một hệ thống thật phải có bằng chứng ĐO ĐƯỢC. Cần bằng\n   chứng mới → tự đi lấy, đừng mượn mắt Đức. Lấy bằng cách nào là việc của phụ lục nghề."
  ],
  [
    "2. **Mỗi fix một test ghim.** Suite không chạm DOM thật, nên fixture bằng chứng là vàng.",
    "2. **Mỗi fix một test ghim.** Và fixture phải DỰNG NỔI ca hỏng — một phép kiểm không phân\n   biệt được hai nhánh là đồ trang trí, dù nó xanh."
  ],
  [
    "- `pilot-*/`, `Pilot-*/`, `Batch-*/`, `evidence/` — **bằng chứng vận hành**. Chỉ được THÊM mới,\n  không sửa, không xoá, không tạo lại.",
    "- Thư mục bằng chứng — khai `\"mutability\": \"append-only\"` trong `.repo-structure.json`.\n  **Chỉ được THÊM mới**, không sửa, không xoá, không tạo lại. Tên thư mục là việc của repo bạn."
  ],
  [
    "- Không bao giờ gán `.innerHTML` / `.outerHTML` / `insertAdjacentHTML`.",
    "- Những điều cấm riêng của nghề repo bạn — xem `docs/ANNEX-*.md`. Chưa có phụ lục thì bỏ dòng này."
  ],
  [
    "| **Claude** | Kiến trúc, phản biện, audit độc lập, điều phối, vận hành Bridge | Push khi cổng kiểm chưa xanh |",
    "| **Claude** | Kiến trúc, phản biện, audit độc lập, điều phối | Push khi cổng kiểm chưa xanh |"
  ],
  [
    "3. Gặp lỗi mới trên trang thật → thêm 1 dòng vào bảng lỗi của sổ tay, **và** cân nhắc thêm\n   1 phép kiểm vào `scripts/session-check.mjs`.",
    "3. Gặp lỗi mới ở một hệ thống bên ngoài → thêm 1 dòng vào bảng lỗi của sổ tay, **và** cân\n   nhắc thêm 1 phép kiểm vào `scripts/session-check.mjs`."
  ]
];

/* Phần luật mà `stripNghe` chịu trách nhiệm = toàn bộ TRỪ mục 6. Mục 6 là bản đồ file của
   riêng repo, bị cắt ở bước sau, nên từ vựng nghề trong đó không tính. */
function phanLuatChung(text) {
  const moc = (so) => String.fromCharCode(10) + "## " + so + ".";
  const dau = text.indexOf(moc(6));
  const cuoi = text.indexOf(moc(7));
  if (dau < 0 || cuoi < 0 || cuoi <= dau) return text;
  return text.slice(0, dau) + text.slice(cuoi);
}

/* Dấu vân tay của TOÀN BỘ phần luật chung sau khi đã tách luật-nghề. Mục 6 cố ý không tính vì đó
   là bản đồ địa phương của từng repo. Khác regex từ vựng hữu hạn, phép so này bắt MỌI thay đổi:
   thêm một luật nghề dùng từ chưa từng biết, đổi lời một luật cũ, hoặc làm mất một luật chung.
   Khi Đức duyệt đổi luật chung thật, người sửa phải cập nhật dấu vân tay cùng fixture tương ứng. */
const COMMON_LAW_SHA256 = "2229dd09be0db8be74409f58d8bde79c71b1a330ba02543760cfe073ef1022f9";
const commonLawHash = (text) => createHash("sha256").update(phanLuatChung(text), "utf8").digest("hex");

export function stripNghe(text) {
  // Chuẩn hoá xuống dòng TRƯỚC khi so. AGENTS.md trên máy Windows là CRLF, còn các đoạn thay ở
  // bảng NGHE viết bằng LF — không chuẩn hoá thì mọi đoạn nhiều dòng đều khớp 0 lần và bộ trích
  // chết ở đúng chỗ nó đang cố bảo vệ. (Bắt được ngay lần chạy đầu, nhờ fail-closed.)
  let out = text.split(String.fromCharCode(13)).join("");

  // BA CA, và ca giữa là ca mà bộ khung phải sống được: khi bộ trích chạy ở REPO NHÀ của chính
  // nó, luật nguồn VỐN ĐÃ ở dạng chung, nên không phép thay nào khớp. Bản đầu ném ngay ở phép
  // thay đầu tiên — tức bộ khung không tự trích lại được chính nó, và nhà riêng là bất khả thi.
  //
  // Nhưng "khớp 0 lần" cũng là hình dạng của một ca NGUY HIỂM: luật bị đổi lời, phép thay trượt
  // hết, và một dòng luật nghề lọt sang mọi repo khác. Hai ca trông giống hệt nhau từ phía bảng
  // NGHE. Phân biệt bằng bằng chứng chứ không bằng đoán: khớp 0 lần MÀ luật vẫn còn từ vựng
  // nghề thì đó là ca thứ hai, và phải ném.
  const soKhop = NGHE.filter(([from]) => out.split(from).length === 2).length;
  if (soKhop === 0) {
    if (commonLawHash(out) !== COMMON_LAW_SHA256) {
      throw new Error(
        "TRICH_HONG: không phép thay luật-nghề nào khớp, nhưng toàn bộ phần luật chung không " +
        "khớp dấu vân tay đã duyệt. Có luật bị đổi/mất hoặc luật nghề mới vừa lọt vào — " +
        "cập nhật bảng NGHE; chỉ cập nhật COMMON_LAW_SHA256 khi chủ repo đã duyệt đổi luật chung." +
        `${String.fromCharCode(10)}Vân tay hiện tại: ${commonLawHash(out)}`
      );
    }
    return out;   // luật đã ở dạng chung — không có gì để tách
  }
  if (soKhop !== NGHE.length) {
    throw new Error(
      `TRICH_HONG: bảng luật-nghề khớp ${soKhop}/${NGHE.length} phép thay — được ăn cả, ngã về không. ` +
      "Khớp một phần nghĩa là AGENTS.md đổi lời ở vài chỗ; tách nửa vời còn tệ hơn không tách."
    );
  }

  for (const [from, to] of NGHE) {
    const parts = out.split(from);
    if (parts.length !== 2) {
      throw new Error(
        `TRICH_HONG: bản thay luật-nghề khớp ${parts.length - 1} lần, cần đúng 1. Đoạn tìm:\n` +
        `  ${from.split("\n")[0]}\n` +
        "AGENTS.md đã đổi lời. Sửa bảng NGHE trong build-template.mjs cho khớp — ĐỪNG bỏ qua: " +
        "bỏ qua là để một dòng luật của nghề này lọt vào bộ khung của mọi repo khác."
      );
    }
    out = parts.join(to);
  }
  if (commonLawHash(out) !== COMMON_LAW_SHA256) {
    throw new Error(
      "TRICH_HONG: tách đủ các luật-nghề đã biết nhưng phần luật chung sau tách vẫn khác dấu " +
      "vân tay đã duyệt. Có thay đổi ngoài bảng NGHE; dừng để không phát tán luật sai nghề." +
      `${String.fromCharCode(10)}Vân tay hiện tại: ${commonLawHash(out)}`
    );
  }
  return out;
}

/* ---- luật: cắt bản đồ địa phương ra --------------------------------------
   `AGENTS.md` mục 6 ("Sổ tay mở khi cần") là bản đồ file của RIÊNG repo này — đo được 13 trên
   47 dòng mang tên dự án, cao gấp nhiều lần phần còn lại (1 trên 117). Nó đáng lẽ không đi
   theo template; nó là thứ mỗi repo tự viết. Cắt bằng mốc tiêu đề chứ không bằng số dòng, để
   mục 6 dài ra cũng không làm hỏng bộ trích. */
/* Mốc cắt phải là TIÊU ĐỀ THẬT và DUY NHẤT — phiên K1 chỉ ra 02/09, mục (d) của brief.
   Bản cũ dùng `text.indexOf("\n## 6.")`, tức lấy lần khớp ĐẦU TIÊN và không kiểm gì thêm. Một
   dòng văn hay một khối trích dẫn nhắc `## 6.` nằm TRƯỚC tiêu đề thật là cắt sai — và cắt sai
   âm thầm: bộ trích vẫn sinh ra `AGENTS.md`, chỉ là mất một phần mục 5. Kiểu hỏng tệ nhất.

   Hai lớp: chỉ nhận dòng BẮT ĐẦU bằng mốc (nên `> ... ## 6. ...` trong trích dẫn không tính),
   và đòi ĐÚNG MỘT dòng như vậy. Nhiều hơn một thì FAIL CLOSED kèm số dòng, để người sửa biết
   đi đâu — chứ không âm thầm chọn cái đầu. */
export function soleHeadingIndex(text, marker) {
  const lines = text.split("\n");
  const hits = [];
  let offset = 0;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].startsWith(marker)) hits.push({ index: offset, line: i + 1 });
    offset += lines[i].length + 1;
  }
  if (hits.length === 0) return { index: -1, hits };
  if (hits.length > 1) {
    throw new Error(
      `TRICH_HONG: AGENTS.md có ${hits.length} dòng bắt đầu bằng \`${marker}\` (dòng ${hits.map((h) => h.line).join(", ")}). ` +
      "Bộ trích cắt theo tiêu đề mục, nên mốc phải DUY NHẤT. Sửa AGENTS.md, đừng để bộ trích tự chọn cái đầu rồi cắt sai âm thầm."
    );
  }
  return { index: hits[0].index, hits };
}

function lawForTemplate() {
  // Thứ tự có lý do: tách luật-nghề TRƯỚC, cắt mục 6 SAU. Cắt trước thì các mốc chỉ số dời đi
  // và mọi phép thay phải tính lại — thừa một cơ hội sai mà không đổi lại được gì.
  const text = stripNghe(read("AGENTS.md"));
  const start = soleHeadingIndex(text, "## 6.").index;
  const end = soleHeadingIndex(text, "## 7.").index;
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(
      "TRICH_HONG: không tìm thấy mốc `## 6.` và `## 7.` trong AGENTS.md. Bộ trích cắt theo tiêu đề mục; " +
      "nếu đã đánh số lại các mục thì phải sửa `lawForTemplate()` cho khớp, đừng để nó cắt bừa."
    );
  }
  // KHÔNG mở đầu bằng xuống dòng. `soleHeadingIndex` trả chỉ số ĐẦU DÒNG tiêu đề, nên
  // `slice(0, start)` đã kết thúc bằng ký tự xuống dòng rồi; thêm một cái nữa là mỗi lần
  // trích cộng thêm một dòng trống.
  // một dòng trống. Trích một lần thì không ai thấy; trích lại từ bản trích — đúng việc phải
  // làm khi bộ khung có nhà riêng — thì lệch dần, và hai bản không còn bằng byte.
  const replacement = `## 6. Sổ tay mở khi cần — Tầng 2

> **Bảng này là BẢN ĐỒ RIÊNG CỦA REPO BẠN.** Bộ khung điền sẵn các dòng cho chính những file
> nó mang theo — vừa để repo mới xanh ngay, vừa làm mẫu cho định dạng. **Thêm dòng của bạn vào
> đây; đừng xoá cái đang đúng.**

Luật chung nằm ở các mục trên. Chi tiết kỹ thuật thì nằm ở các file mà bảng dưới trỏ tới —
không đọc trước, tới việc nào thì mở sổ tay đó.

| Khi bạn sắp… | Mở file |
|---|---|
| Hiểu bộ khung này gồm gì và dùng thế nào | [README.md](README.md) |
| Khai trạng thái cho một đơn vị công việc | [STATUS.template.md](STATUS.template.md) |
| Ghi một quyết định kiến trúc | bản mẫu [docs/_TEMPLATE-adr.md](docs/_TEMPLATE-adr.md) · luật [docs/adr/0000-…](docs/adr/0000-ghi-nhan-quyet-dinh-kien-truc.md) |
| Viết một tài liệu nghiên cứu | [docs/_TEMPLATE-study.md](docs/_TEMPLATE-study.md) |
| Viết đề bài cho một phiên AI | [docs/_TEMPLATE-brief.md](docs/_TEMPLATE-brief.md) |
| **Sắp làm cùng lúc với AI khác, hoặc sắp SỬA một trong bốn cơ chế đa phiên** | [docs/protocols/MULTIFLOW.md](docs/protocols/MULTIFLOW.md) — bốn cơ chế (bảng chủ sở hữu · nhãn \`Lane:\` · cổng đóng phiên · cổng xuất bản), một ngày làm việc 5 bước, **năm bất biến kèm lý do từng cái**, và quy trình đổi cơ chế có **đột biến kiểm bắt buộc**. Mục 1–3 viết cho người không code. **Cố ý không chứa số đo, không kiểm kê chốt, không bảng mã lỗi** — ba thứ đó khác nhau ở từng repo và mục nhanh hơn ai kịp sửa, nên nó chỉ đưa câu lệnh để tự đo |
| Biết phiên trước làm tới đâu | [HANDOFF.md](HANDOFF.md) — đọc phần **cuối** file |
| Biết repo đang nợ gì về cấu trúc | chạy \`npm run bootstrap\` |
| **Sắp BÁO CÁO trạng thái cho người chốt — kiểm xem điều mình sắp nói có khớp nguồn thẩm quyền không** | \`npm run state-check\` — **không phải cổng đóng phiên**: cổng kia hỏi "việc tôi làm đẩy được chưa", cái này hỏi "điều tôi sắp nói có đúng không". Ba mã thoát, cố ý không gộp: \`OK\` · \`MISMATCH\` · \`UNKNOWN\` — không đọc được thì nói KHÔNG BIẾT, không nói OK. **Chỉ đọc, không đòi khoá nào** |
| **Không biết làm gì tiếp, hoặc muốn biết việc nào chạy song song được ngay** | \`npm run what-next\` — bản đồ việc, giao ba nguồn: bảng quyền × sổ nợ từng đơn vị × sổ ý tưởng. Luật song song nó cưỡng chế chỉ một câu: hai việc song song được **khi và chỉ khi** thuộc hai khoá khác nhau và cả hai đang trống. **Chỉ đọc, không đòi khoá nào** |
| **Là phiên ĐIỀU PHỐI: người chốt hỏi "đang có gì · làm gì tiếp · việc nào chạy song song được"** | [docs/protocols/ORCHESTRATOR.md](docs/protocols/ORCHESTRATOR.md) — sổ tay vai điều phối: luật mở phiên, **hàng rào vai cứng** (vai này KHÔNG code, KHÔNG debug, KHÔNG đề xuất bản vá), luật nạp báo cáo năm mục, lối ra bàn giao cho executor. **Đọc khối cảnh báo ở đầu file trước** |
| **Một phép kiểm tự nhiên đỏ với người vừa clone mà xanh trên máy bạn** | [.gitattributes](.gitattributes) — chốt kiểu xuống dòng cho CẢ repo, cả trong kho lẫn trong cây làm việc. Không có nó thì máy Windows tự đổi lúc lấy file ra, một commit có hai dạng byte, và \`git status\` nói SẠCH ở cả hai. Chốt một nửa — chỉ \`text=auto\` — thì kho sạch mà cây làm việc vẫn CRLF, tức bệnh còn nguyên |
| Hiểu bộ khung tự kiểm mình bằng gì, hoặc thêm test của repo bạn | [tests/harness-smoke.mjs](tests/harness-smoke.mjs) — bốn khối hạt giống · [tests/assistant-smoke.mjs](tests/assistant-smoke.mjs) — phép ghim của hai lệnh trên, khối cuối tự dựng một repo hình dạng khác hẳn rồi chạy thật trong đó. Chạy cả hai bằng \`npm test\` |
| Biết luật riêng của NGHỀ repo bạn (không phải luật chung) | phụ lục nghề: [docs/ANNEX-tu-dong-hoa-trinh-duyet.md](docs/ANNEX-tu-dong-hoa-trinh-duyet.md) là bản mẫu có thật · viết cái của bạn theo [docs/_TEMPLATE-annex.md](docs/_TEMPLATE-annex.md) |

**Vì sao phải là liên kết chứ không phải chữ thường:** phép kiểm độ sâu điều hướng (B6) đi theo
liên kết từ cổng vào máy đọc. File không ai trỏ tới thì máy coi là không tới được — và một bản
mẫu không ai tới được thì đúng là sẽ không ai dùng. Đo thật lúc dựng bộ khung này: để bảng rỗng
thì **4 file** rơi ra ngoài bản đồ, kể cả chính \`README.md\`.

**Luật vàng số 4 áp ở đây:** thêm file hoặc thư mục mới thì phải khai một dòng vào bảng này.
Không khai = không tồn tại. Cổng đóng phiên có phép kiểm này.
`;
  // Mục 8 dạy đo cân nặng bằng một lệnh của repo NHÀ, mà công cụ đó Ở LẠI đây (ADR-0002).
  // Để nguyên thì bản trích phát đi một luật trỏ tới lệnh KHÔNG TỒN TẠI — cùng bệnh đã bắt được
  // ở `claim.mjs` hồi 03/09, và luật trỏ tới lệnh không chạy được thì nó là chữ, không phải luật.
  // Ném chứ không bỏ qua: mục 8 bị viết lại lời mà phép thay trượt thì phải biết ngay, không
  // được âm thầm phát đi bản cũ.
  // Ghép từ mảng chứ không viết một chuỗi nhiều dòng: khối cũ CHỨA dấu huyền ba lần (rào
  // ```bash), nên template literal là đường thẳng tới lỗi cú pháp.
  const XUONG_DONG = String.fromCharCode(10);
  const CAN_NANG_CU = [
    'Cân nặng được ĐO, không để cảm tính — cảm tính luôn nói "thêm một cái nữa thì có sao đâu":',
    "",
    "```bash",
    "npm run can-nang",
    "```",
    ""
  ].join(XUONG_DONG);
  const CAN_NANG_MOI = [
    'Cân nặng được ĐO, không để cảm tính — cảm tính luôn nói "thêm một cái nữa thì có sao đâu".',
    "Bộ khung KHÔNG mang theo công cụ đo, vì ngân sách là con số của RIÊNG repo bạn: chốt lấy vài",
    "ngưỡng (số luật · số phép kiểm · số tài liệu · số phút đóng phiên) rồi tự đếm. Quá ngưỡng thì",
    "phải BỚT trước khi nghĩ tới nới.",
    ""
  ].join(XUONG_DONG);
  const daThay = text.slice(0, start) + replacement + text.slice(end);
  if (daThay.split(CAN_NANG_CU).length !== 2) {
    throw new Error(
      "TRICH_HONG: không tìm thấy ĐÚNG MỘT khối đo cân nặng ở mục 8 của AGENTS.md. Mục đó đã bị viết " +
      "lại lời, nên phép thay trượt. Sửa phép thay cho khớp, đừng để bản trích âm thầm phát đi một lệnh không có thật."
    );
  }
  return daThay.split(CAN_NANG_CU).join(CAN_NANG_MOI);
}

/* ---- các file sinh mới ---------------------------------------------------- */

const CLAUDE_STUB = `# CLAUDE.md

Luật của repo này nằm trong \`AGENTS.md\` ở cùng thư mục — **một bản luật, nhiều cửa vào**.
Đừng chép luật sang đây; sửa luật thì sửa \`AGENTS.md\`.

@AGENTS.md
`;

const STRUCTURE_SEED = `{
  "_doc": "Hình dạng repo NÀY. Bộ sinh và cổng kiểm đọc file này thay vì đoán. Sửa cho khớp repo của bạn TRƯỚC KHI chạy cổng lần đầu.",
  "schema_version": 1,
  "repo": {
    "_doc": "Danh tính repo, dùng cho trang cổng vào máy đọc. ĐỔI NGAY khi khởi tạo — bỏ trống thì trang sinh ra sẽ nói thẳng là repo chưa đặt tên.",
    "name": "ĐỔI THÀNH TÊN REPO CỦA BẠN",
    "tagline": null
  },
  "profile": "P1",
  "_profile_doc": "P1 monorepo nhiều gói · P2 ứng dụng đơn · P3 repo tài liệu · P4 repo hạ tầng · P5 điều phối repo khác",
  "units": {
    "_doc": "Đơn vị công việc nằm ở đâu. depth = số tầng dưới root_dir cho tới đơn vị. root_dir null = repo không có đơn vị con, chỉ có đơn vị GỐC.",
    "root_dir": null,
    "marker": "package.json",
    "depth": 1,
    "ten": "Đơn vị",
    "_ten_doc": "Gọi một đơn vị công việc là gì — dùng cho tiêu đề bảng và tên cột. Đổi cho hợp repo bạn: Extension · Gói · Dịch vụ · Tài liệu."
  },
  "areas": {
    "_doc_": "Mỗi thư mục top-level phải có một dòng ở đây, nếu không cổng kiểm đếm nó là chưa khai chủ. ownership_mode: root = một chủ duy nhất; per-package = chia chủ theo từng gói con, kèm claim_prefix.",
    "_areas_doc2": "HAI CHỦ, CỐ Ý — đừng gộp về một. Một repo một-chủ làm cả lớp phân vùng thành hình nền: mọi đường dẫn quy về cùng một khoá, nên bất biến steward↔khoá quyền, phép kiểm nhãn lane, và hàm quy chủ đều ĐẠT TẦM THƯỜNG — đúng ở cả hai chiều, không ghim được gì. Đo thật ở bản trích đầu: cả bốn đường dẫn thử đều trả _root, và một đột biến phá sạch hàm quy chủ vẫn thoát. Tách docs/ ra là ca thật rẻ nhất để lớp đó có việc mà làm.",
    "docs/": { "steward": "_docs", "mutability": "rw", "ownership_mode": "root", "note": "tài liệu bốn tầng: studies, briefs, archive, adr" },
    "scripts/": { "steward": "_root", "mutability": "rw", "ownership_mode": "root", "note": "bộ sinh + cổng kiểm + đẩy an toàn" },
    "tests/": { "steward": "_root", "mutability": "rw", "ownership_mode": "root", "note": "suite gốc repo" },
    "evidence/": { "steward": "_root", "mutability": "append-only", "ownership_mode": "root", "note": "bằng chứng vận hành: chỉ thêm, không sửa, không xoá" }
  },
  "generators": ["build-dashboard.mjs"],
  "_generators_doc": "Script nào sinh ra artifact đã commit. Cổng đóng phiên đối chiếu từng cái với HEAD. CHỈ khai script repo này THẬT SỰ có — khai thừa là cổng đỏ vì thiếu file.",
  "generated": ["DASHBOARD.md", "llms.txt", "repo-map.json"],
  "_generated_doc": "FILE do các script trên sinh ra. Khai vào đây thì chúng KHÔNG đòi ai nhận quyền — nội dung tất định từ HEAD nên không ai sở hữu chúng theo nghĩa nào. Đo thật ở repo gốc: 19% lượt nhận khoá gốc tồn tại CHỈ để chạy bộ sinh; đó là tranh chấp nhân tạo.",
  "_generated_doc2": "KHÔNG làm yếu lớp bảo vệ: nội dung vẫn bị phép kiểm 'Sự thật máy sinh còn tươi' đối chiếu với HEAD ở MỌI phiên, nên sửa tay một dòng vẫn ĐỎ. Và đừng lẫn với 'generators' (khác một chữ): cái kia là SCRIPT, cái này là FILE. Khai từng file, không khai thư mục.",
  "grandfathered": [],
  "_grandfathered_doc": "Đường dẫn cũ được miễn trừ vĩnh viễn. Repo mới để RỖNG. Repo cũ đang migrate thì liệt kê ở đây thay vì đổi tên hàng loạt.",
  "bootstrap": {
    "_doc": "Phép kiểm nào ĐÓNG CỔNG khi đỏ. Repo mới nên bắt đầu với danh sách RỖNG, chạy vài phiên cho sạch, rồi mới bật dần. Bật chặn khi đang đỏ là tự khoá repo.",
    "blocking": []
  }
}
`;

const CLAIMS_SEED = `{
  "_doc": "Bảng chủ sở hữu. MỘT vùng chỉ MỘT phiên AI được ghi tại một thời điểm. Chủ không phải bạn = chỉ đọc. Muốn giành = hỏi chủ dự án. Xong việc thì đặt owner về null.",
  "_labels": "owner là nhãn phiên tự đặt, ví dụ 'claude-dashboard' — hai phiên khác nhau phải có hai nhãn khác nhau.",
  "claims": {
    "_root": { "owner": null, "ai": null, "claimed_at": null, "task": null, "released_at": null },
    "_docs": { "owner": null, "ai": null, "claimed_at": null, "task": null, "released_at": null }
  }
}
`;

const HANDOFF_SEED = `# HANDOFF — bàn giao giữa các phiên

> **Chỉ THÊM dòng, không sửa dòng cũ.** Phiên sau đọc **phần CUỐI** file này trước tiên.
> Mỗi phiên ghi đúng ba thứ: làm gì · kết quả bằng số · còn gì mở.

## Trạng thái hiện tại

Repo vừa được khởi tạo từ template. Chưa có phiên nào chạy.

**Việc đầu tiên:** mở \`.repo-structure.json\`, sửa khối \`units\` và \`areas\` cho khớp repo này,
rồi chạy cổng kiểm cấu trúc lần đầu để biết đang nợ những gì.

## Log
`;

function readme(version) {
  return `# Bộ khung repo — bản ${version}

Bộ khung để một **phiên AI lạ** vào bất kỳ repo nào cũng hiểu ngay chuyện gì đang xảy ra, không
phải quét cả cây thư mục và không phải hỏi chủ repo câu nào.

> **Trạng thái: CHƯA CHỨNG MINH NGOÀI REPO GỐC.** Bộ khung này đã chạy thật trên đúng một repo
> — nơi nó được rút ra. Nó **chưa từng được migrate sang một repo khác loại**. Đừng dùng cho
> việc quan trọng cho tới khi mốc đó đạt.

## Nguyên tắc gốc

**Mỗi câu AI phải hỏi con người = một trường dữ liệu còn thiếu trong repo.**
Không sửa bằng cách dặn AI đọc kỹ hơn. Sửa bằng cách bổ sung trường dữ liệu, và bắt cổng kiểm
chặn khi trường đó trống.

## Bốn tầng — phân theo VÒNG ĐỜI, không theo chủ đề

| Tầng | Gồm gì | Ai ghi | Đổi khi nào |
|---|---|---|---|
| **LAW** | luật, vai, kiến trúc, hướng dẫn | người | vài tháng |
| **STATE** | trạng thái, việc mở, bàn giao | người | mỗi phiên |
| **GENERATED** | số đo, bản đồ, bảng tổng | **máy** | mỗi lần sinh |
| **EVIDENCE** | bằng chứng, log, quyết định đã chốt | bất biến | **chỉ thêm** |

Luật con: không trộn hai tầng vào một file; không để hai file cùng tầng nói cùng một điều.
Nguyên tắc số một: **thứ gì máy đếm được thì máy đếm** — con số, trạng thái, ngày tháng không gõ tay.

## Trong gói này có gì


> **Hai thứ CỐ Ý không có trong bộ khung này:** công cụ *đo một repo cách chuẩn bao xa* và công cụ
> *dựng repo mới*. Chúng sống ở **repo nhà của bộ khung**, vì cả hai đều cần biết "chuẩn" là gì —
> và chuẩn phải có **một** nguồn. Phát bản sao của chuẩn đi khắp nơi là tạo ra N nguồn, rồi lúc
> chúng lệch nhau thì không ai biết tin bản nào. Repo bạn cần *sống theo chuẩn*, không cần
> *phát hành chuẩn*.
| Đường dẫn | Tầng | Việc của nó |
|---|---|---|
| \`AGENTS.md\` | LAW | Hiến pháp một trang. **Mục 6 để trống — bạn tự điền bản đồ file của repo mình** |
| \`CLAUDE.md\` | LAW | Stub trỏ về \`AGENTS.md\`, để công cụ nào cũng tìm được luật |
| \`.repo-structure.json\` | LAW | Hình dạng repo: đơn vị nằm đâu, thư mục nào có chủ nào, phép kiểm nào chặn |
| \`scripts/repo-structure.mjs\` | máy | Nguồn sự thật duy nhất về hình dạng repo — bốn script kia đều đọc nó |
| \`scripts/build-dashboard.mjs\` | máy | Sinh bảng điều hành + cổng vào máy đọc, **hoàn toàn từ HEAD** |
| \`scripts/check-bootstrap.mjs\` | máy | Cổng kiểm cấu trúc B1–B14 |
| \`scripts/session-check.mjs\` | máy | Cổng đóng phiên — đỏ thì chưa xong |
| \`scripts/safe-push.mjs\` | máy | Đẩy mà không cuốn theo commit của phiên khác |
| \`tests/harness-smoke.mjs\` | máy | **Lưới đỡ của chính bộ khung** — bốn chỗ đã hỏng thật ở repo sinh ra nó. Thêm test của bạn vào cùng thư mục, đừng xoá bốn khối này |
| [\`docs/ANNEX-tu-dong-hoa-trinh-duyet.md\`](docs/ANNEX-tu-dong-hoa-trinh-duyet.md) | LAW | **Phụ lục nghề — TUỲ CHỌN.** Chín luật của nghề tự động hoá trình duyệt, tách khỏi luật chung. Repo bạn không làm nghề đó thì **xoá file này đi** |
| [\`docs/_TEMPLATE-annex.md\`](docs/_TEMPLATE-annex.md) | LAW | Bản mẫu để viết phụ lục nghề của repo bạn |
| [\`docs/_TEMPLATE-adr.md\`](docs/_TEMPLATE-adr.md) · [\`-study\`](docs/_TEMPLATE-study.md) · [\`-brief\`](docs/_TEMPLATE-brief.md) | LAW | Bản mẫu: quyết định · nghiên cứu · đề bài phiên |
| [\`docs/adr/0000-…\`](docs/adr/0000-ghi-nhan-quyet-dinh-kien-truc.md) | EVIDENCE | Luật ghi quyết định. Đọc trước khi ghi cái đầu tiên |
| [\`STATUS.template.md\`](STATUS.template.md) | LAW | Khuôn khai trạng thái cho mỗi đơn vị công việc |
| \`STATUS.md\` | STATE | Trạng thái của gốc repo — **đã khai sẵn một bản hợp lệ** để cổng kiểm xanh ngay từ commit đầu |
| \`.agents/claims.json\` | STATE | Bảng chủ sở hữu, chống hai phiên AI giẫm chân |

Bảng trên dùng **liên kết** chứ không phải chữ thường, và đó không phải trang trí: phép kiểm
độ sâu điều hướng đi theo liên kết từ cổng vào máy đọc. File không ai trỏ tới thì máy coi là
không tới được — và một bản mẫu không ai tới được thì đúng là sẽ không ai dùng.

**Cố ý KHÔNG có trong gói:** bảng điều hành, cổng vào máy đọc, bản đồ máy đọc — ba thứ đó là
tầng GENERATED, **mỗi repo tự sinh**. Bộ sinh thì đi theo, sản phẩm của nó thì không. Chép
sản phẩm sang repo khác là làm mọi repo cùng hiển thị trạng thái của repo gốc.

Cũng không có: bằng chứng, trạng thái thật, nhật ký bàn giao thật. Chúng thuộc về từng repo.

## Dùng thế nào

1. Chép nội dung gói này vào gốc repo của bạn.
2. **Sửa \`.repo-structure.json\` trước tiên** — khối \`units\` (đơn vị của bạn nằm đâu) và
   \`areas\` (mỗi thư mục top-level một dòng). Đây là bước duy nhất bắt buộc làm bằng tay.
3. Chạy \`npm run dashboard\` — sinh bảng điều hành và cổng vào máy đọc.
   **Phải làm bước này TRƯỚC khi đo**: phép kiểm độ sâu điều hướng đi từ cổng vào máy đọc, mà
   file đó là tầng GENERATED — chưa sinh thì nó báo vàng, và đó là đúng chứ không phải lỗi.
4. Chạy \`npm run bootstrap\` — nó liệt kê repo đang nợ gì, mỗi dòng nói cả **chỗ sai** lẫn
   **cách sửa**.
5. Trả nợ dần. \`bootstrap.blocking\` để **rỗng** lúc đầu; chỉ bật chặn một phép kiểm **sau khi**
   nó đã xanh. Bật chặn khi đang đỏ là tự khoá repo.
6. Điền mục 6 của \`AGENTS.md\` — bản đồ file của repo bạn.

## Phép thử nghiệm thu

Mở một chat AI **hoàn toàn mới**, dán đúng một dòng:

> *Đọc \`llms.txt\` ở gốc repo &lt;chủ&gt;/&lt;repo&gt; rồi cho tôi biết ba điều: repo có những đơn vị
> nào và cái nào đang sống, việc ưu tiên số 1 hiện tại là gì và thuộc đơn vị nào, tôi nên đọc
> file nào tiếp theo.*

**ĐẠT** khi nó nói được cả ba, **không hỏi lại câu nào**.
**KHÔNG ĐẠT** thì ghi lại **chính xác câu nó đã hỏi** — mỗi câu hỏi là một trường dữ liệu còn
thiếu. Bổ sung trường đó rồi thử lại. **Không sửa bằng cách dặn AI đọc kỹ hơn.**
`;
}

function packageJson(version) {
  return JSON.stringify({
    name: "repo-harness",
    version,
    private: true,
    type: "module",
    description: "Bộ khung repo: cổng vào máy đọc, cổng kiểm cấu trúc, cổng đóng phiên, đẩy an toàn.",
    scripts: {
      dashboard: "node scripts/build-dashboard.mjs",
      bootstrap: "node scripts/check-bootstrap.mjs",
      gate: "node scripts/session-check.mjs",
      push: "node scripts/safe-push.mjs",
      // Hai lệnh của vai điều phối. Khai ở đây chứ không chỉ để file nằm trong `scripts/`:
      // bảng "Lệnh chạy được" đọc thẳng khối này, nên lệnh không khai = lệnh không ai thấy.
      "state-check": "node scripts/state-check.mjs",
      "what-next": "node scripts/what-next.mjs",
      // KHÔNG ĐƯỢC BỎ. `session-check.mjs` hỏi `package.json.scripts.test`; không khai thì
      // `hasRootTestScript()` false VĨNH VIỄN và cổng đóng phiên không chạy một dòng test nào
      // của repo bạn. Thêm suite của bạn vào chuỗi này, đừng thay thế suite hạt giống.
      test: "node tests/harness-smoke.mjs && node tests/assistant-smoke.mjs"
    }
  }, null, 2) + "\n";
}

/* ---- dựng danh sách file --------------------------------------------------- */

// Bản trích ĐI THEO phiên bản repo nhà. Trước đây nó tự nhận "0.1.0-unproven" trong khi repo
// đã ở 0.3.0 — hai con số cho cùng một thứ, và không ai biết tin cái nào. Nhãn `unproven`
// cũng hết đúng: bộ khung đã chạy thật trên hai repo khác nghề (Python và Node/chứng khoán).
export const TEMPLATE_VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).version;

export function buildTemplateFiles() {
  const files = new Map();
  for (const name of PORTABLE_SCRIPTS) files.set(`scripts/${name}`, read(`scripts/${name}`));
  for (const [from, to] of VERBATIM) files.set(to, genericize(to, read(from)));
  files.set("docs/adr/0000-ghi-nhan-quyet-dinh-kien-truc.md", ADR_SEED);
  files.set("AGENTS.md", lawForTemplate());
  files.set("CLAUDE.md", CLAUDE_STUB);
  files.set(".repo-structure.json", STRUCTURE_SEED);
  files.set(".agents/claims.json", CLAIMS_SEED);
  files.set("HANDOFF.md", HANDOFF_SEED);
  files.set("STATUS.md", STATUS_SEED);
  files.set("README.md", readme(TEMPLATE_VERSION));
  // Chín dòng luật-nghề mà `stripNghe()` tách khỏi luật chung phải HẠ CÁNH ở đâu đó. Không có
  // hai file này thì tách = vứt, và bộ khung im lặng đánh mất chín bài học đã trả giá.
  files.set("docs/ANNEX-tu-dong-hoa-trinh-duyet.md", ANNEX_SEED);
  files.set("docs/_TEMPLATE-annex.md", ANNEX_TEMPLATE);
  files.set("package.json", packageJson(TEMPLATE_VERSION));
  return files;
}

/* Không có file nào trong template được mang tên dự án gốc. Đây là phép tự kiểm RẺ NHẤT của
   bộ trích, và nó chạy mỗi lần sinh — không đợi ai nhớ chạy. */
const FORBIDDEN = [/duc-auto/i, /gg-flow/i, /Chrome_Extension_AI_Agentic/i, /extension-observer/i];

export function leakedNames(files) {
  const hits = [];
  for (const [rel, text] of files) {
    for (const pattern of FORBIDDEN) {
      const match = text.match(pattern);
      if (match) hits.push({ file: rel, found: match[0] });
    }
  }
  return hits;
}


/* ---- SỔ PHÁT HÀNH: một số phiên bản trỏ tới ĐÚNG MỘT nội dung -------------- */

/* Vì sao có khối này (audit độc lập 03/09). `upgrade.mjs` đã có cửa "cùng số bản, khác nội dung",
 * nhưng cửa đó CHỈ mở khi repo đích đang ở ĐÚNG số bản hiện tại. Nên chỉ cần một lần sửa file
 * tầng máy mà quên tăng phiên bản là:
 *   - repo đang ở bản CŨ  → không vào cửa đó → được nâng lên nội dung mới, đóng dấu 1.2.4;
 *   - repo đã ở 1.2.4      → vào cửa đó       → bị chặn, giữ nội dung cũ, vẫn mang dấu 1.2.4.
 * Kết quả: hai repo cùng khai 1.2.4, hai nội dung khác nhau — đúng cái bệnh mà số phiên bản
 * sinh ra để chữa, chỉ dịch đi một bước.
 *
 * Gốc rễ: bản trích và `TEMPLATE_VERSION` đều dựng từ NGUỒN ĐANG SỐNG, nên không có gì ghi lại
 * "1.2.4 là nội dung nào". Sổ này ghi lại, và nó CHỈ THÊM: sửa một dòng đã có là nói dối về một
 * bản đã phát. Đổi nội dung tầng máy mà không tăng phiên bản → sổ lệch → `npm test` và CI đỏ. */
export const SO_PHAT_HANH = "RELEASE-LEDGER.json";

const CR = String.fromCharCode(13);
export const bam = (text) => createHash("sha256")
  .update(String(text).split(CR).join("")).digest("hex").slice(0, 16);

/* Chỉ tầng MÁY được nâng cấp tự động, nên chỉ tầng máy quyết định danh tính bản phát. Luật và
   trạng thái là chữ của từng repo — chúng khác nhau ở mọi repo, và không nên làm bản phát khác đi. */
export function fileMay(chuan) {
  return [...chuan.keys()].filter((rel) => rel.startsWith("scripts/") || rel.startsWith("tests/"));
}

export function bamBanTrich(chuan) {
  return bam(fileMay(chuan).sort().map((rel) => `${rel}:${bam(chuan.get(rel))}`).join("|"));
}

/* BA TRẠNG THÁI, KHÔNG PHẢI HAI — lần thứ hai trong repo này.
 *
 * Bản đầu bắt mọi lỗi rồi trả `{}`, nên "không có file" và "file hỏng" đổ chung vào một rổ, rồi
 * rổ đó được coi là CHƯA GHI — mà CHƯA GHI thì bộ sinh tự ghi đè. Tức là **làm hỏng sổ phát hành
 * là cách vượt qua chính nó**: sửa nguồn, xoá (hoặc làm hỏng) sổ, chạy bộ sinh, và cùng một số
 * phiên bản được đóng lại với dấu vân tay mới. Không một lời cảnh báo.
 *
 * Đúng cái bẫy `SO_GHIM_HONG` đã vá ở v1.2.1, dựng lại ở một chỗ mới. Ghi ra đây để lần sau
 * nhìn thấy trước: bất cứ chỗ nào `catch` rồi trả giá trị "trống" đều là một cửa hậu. */
export function docSoPhatHanh(root = ROOT) {
  const duong = path.join(root, SO_PHAT_HANH);
  let raw;
  try { raw = fs.readFileSync(duong, "utf8"); }
  catch (e) { return e?.code === "ENOENT" ? { trangThai: "KHONG", ban: {} } : { trangThai: "HONG", loi: String(e.message).split(String.fromCharCode(10))[0] }; }
  let j;
  try { j = JSON.parse(raw); } catch (e) { return { trangThai: "HONG", loi: String(e.message).split(String.fromCharCode(10))[0] }; }
  if (!j || typeof j.ban !== "object" || j.ban === null || Array.isArray(j.ban)) {
    return { trangThai: "HONG", loi: "thiếu khối `ban` dạng object" };
  }
  return { trangThai: "CO", ban: j.ban };
}

/* CHỈ THÊM, và MÁY phải chứng minh được — không chỉ ghi trong tài liệu.
 *
 * Sửa nguồn rồi sửa luôn dòng của bản hiện tại cho khớp thì mọi phép so "nguồn ↔ sổ" đều xanh:
 * sổ tự làm chứng cho chính nó. Vật đối chiếu duy nhất không sửa kèm được trong cùng một thao
 * tác là **bản sổ đã nằm trong HEAD**. Nên: mọi khoá HEAD đã có thì phải y nguyên; chỉ được
 * THÊM khoá mới.
 *
 * Biên của nó, nói thẳng: khoá của bản ĐANG soạn chưa vào HEAD nên chưa được canh — đúng, vì lúc
 * đó bạn vẫn đang viết bản phát ấy. Và ai cố ý thì vẫn sửa được cả hai rồi commit đè; cái này
 * không chặn gian lận có chủ đích, nó chặn chuyện "sửa cho xong" và bắt gian lận phải để lại
 * một vết trong lịch sử. */
/* `chayGit` tiêm được là để phép kiểm dựng nổi ca "git hỏng GIỮA CHỪNG".
   Không tiêm được thì nhánh đó không có cách nào chạy tới — mà một nhánh không chạy tới được
   thì nó chưa bao giờ là lớp bảo vệ, nó chỉ là chữ. Đã dính đúng chuyện này một lần hôm nay. */
export function soVoiLichSu(root = ROOT, chayGit = null) {
  const git = chayGit
    ?? ((...a) => execFileSync("git", a, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));

  /* Clone nông thì lịch sử bị cắt, nên "chưa từng thấy khoá này" không còn phân biệt được với
     "commit ghi nó nằm ngoài phần đã tải". Nhân chứng cụt là nhân chứng sai — nói KHÔNG BIẾT. */
  let commits;
  try {
    if (git("rev-parse", "--is-shallow-repository").trim() === "true") {
      return { trangThai: "HONG", doi: [], loi: "kho git NÔNG (shallow) — lịch sử bị cắt nên không đủ làm nhân chứng" };
    }
    commits = git("log", "--reverse", "--format=%H", "--", SO_PHAT_HANH).split(String.fromCharCode(10)).map((x) => x.trim()).filter(Boolean);
  } catch (e) {
    /* Git hỏng KHÔNG được hoá thành "chưa có lịch sử". Đó đúng là kiểu fail-open mà cả v1.2.1
       lẫn v1.2.5 sinh ra để diệt, và nó sẽ diệt luôn chính phép kiểm này. */
    return { trangThai: "HONG", doi: [], loi: `không đọc được lịch sử git: ${String(e.message).split(String.fromCharCode(10))[0]}` };
  }

  /* NHÂN CHỨNG LÀ LẦN ĐẦU MỘT KHOÁ XUẤT HIỆN, không phải HEAD.
   *
   * Bản v1.2.5 so với `HEAD:` — mà trên CI, HEAD CHÍNH LÀ commit đang kiểm. Commit nào sửa dòng
   * `1.2.4` thì cả file hiện tại lẫn `HEAD:` đều mang giá trị đã sửa, và phép so thành ra so một
   * thứ với chính nó. Nó chỉ bắt được ca sửa-mà-chưa-commit.
   *
   * Giá trị đầu tiên của một khoá thì nằm ở một commit trong quá khứ, và commit đó không sửa kèm
   * được trong cùng một thao tác — muốn đổi phải viết lại lịch sử, và viết lại lịch sử thì thấy. */
  const nhanChung = new Map();
  for (const sha of commits) {
    /* HAI LÝ DO KHÁC HẲN NHAU, và gộp chúng là lỗ thứ tư cùng một hình dạng.
     *
     * Commit trong danh sách này là commit CHẠM tới file — kể cả commit XOÁ nó. Ở commit xoá thì
     * file không tồn tại, và bỏ qua là đúng. Nhưng "đọc không nổi" cũng rơi vào cùng một `catch`,
     * và bỏ qua ca đó thì một commit MUỘN HƠN được nhận làm "lần đầu" — tức nhân chứng bị thay
     * mà kết quả vẫn NGUYÊN VẸN. Chính cái mà cả cơ chế này sinh ra để chặn.
     *
     * `cat-file -e` trả lời đúng một câu: đường dẫn đó CÓ tồn tại ở commit này không. Có mà đọc
     * không nổi thì là KHÔNG BIẾT, và không biết thì dừng. */
    /* BA TRẠNG THÁI, KHÔNG PHẢI HAI — lần thứ năm, và lần này ở chính phép DÒ.
     *
     * `cat-file -e` trả khác 0 cho CẢ HAI: "đường dẫn không có ở commit này" và "git/kho object
     * hỏng". Bắt chung rồi `continue` là lại gọi ca thứ hai là "commit xoá file" và bỏ qua —
     * đúng cái bất biến đang theo đuổi, chỉ dịch xuống một tầng nữa.
     *
     * `ls-tree` tách được, vì nó phân biệt bằng HAI kênh khác nhau: mã thoát nói git có chạy
     * được không, còn output rỗng hay không nói đường dẫn có tồn tại không. */
    let co;
    try { co = String(git("ls-tree", sha, "--", SO_PHAT_HANH)).trim() !== ""; }
    catch (e) {
      return { trangThai: "HONG", doi: [],
        loi: `không dò được nhân chứng ở commit ${sha.slice(0, 7)} — ${String(e.message).split(String.fromCharCode(10))[0]}` };
    }
    if (!co) continue;                        // đường dẫn không có ở commit này (commit xoá nó) — bỏ qua hợp lệ

    let ban;
    try {
      const j = JSON.parse(git("show", `${sha}:${SO_PHAT_HANH}`));
      if (!j || typeof j.ban !== "object" || j.ban === null || Array.isArray(j.ban)) throw new Error("thiếu khối `ban` dạng object");
      ban = j.ban;
    } catch (e) {
      return { trangThai: "HONG", doi: [],
        loi: `nhân chứng ở commit ${sha.slice(0, 7)} có nhưng đọc không nổi — ${String(e.message).split(String.fromCharCode(10))[0]}` };
    }
    for (const [v, d] of Object.entries(ban)) if (!nhanChung.has(v)) nhanChung.set(v, { bam: d, sha });
  }

  const nay = docSoPhatHanh(root);
  if (nay.trangThai !== "CO") return { trangThai: nay.trangThai, doi: [], loi: nay.loi };

  const doi = [];
  for (const [ban, { bam: bamGoc, sha }] of nhanChung) {
    const bamNay = nay.ban[ban];
    if (bamNay === undefined) doi.push({ ban, cu: bamGoc, nay: "(đã bị xoá)", sha: sha.slice(0, 7) });
    else if (bamNay !== bamGoc) doi.push({ ban, cu: bamGoc, nay: bamNay, sha: sha.slice(0, 7) });
  }
  return { trangThai: doi.length ? "DA_SUA" : "NGUYEN_VEN", doi, soNhanChung: nhanChung.size };
}

/* Bốn câu trả lời. "Chưa ghi" KHÔNG giống "ghi rồi và khớp", không giống "ghi rồi mà lệch", và
   không giống "sổ hỏng" — chỉ ca đầu là được ghi thêm, ba ca sau đều phải dừng. */
export function kiemSoPhatHanh(chuan, root = ROOT) {
  const doc = docSoPhatHanh(root);
  const dangCo = bamBanTrich(chuan);
  if (doc.trangThai === "HONG") return { trangThai: "SO_HONG", version: TEMPLATE_VERSION, dangCo, loi: doc.loi };

  const lichSu = soVoiLichSu(root);
  if (lichSu.trangThai === "DA_SUA") {
    return { trangThai: "SUA_LICH_SU", version: TEMPLATE_VERSION, dangCo, doi: lichSu.doi };
  }
  // Không đọc được nhân chứng thì KHÔNG BIẾT, và không biết thì không được đi tiếp.
  if (lichSu.trangThai === "HONG") {
    return { trangThai: "NHAN_CHUNG_HONG", version: TEMPLATE_VERSION, dangCo, loi: lichSu.loi };
  }

  const daGhi = doc.ban[TEMPLATE_VERSION] ?? null;
  if (daGhi === null) return { trangThai: "CHUA_GHI", version: TEMPLATE_VERSION, dangCo };
  return daGhi === dangCo
    ? { trangThai: "KHOP", version: TEMPLATE_VERSION, dangCo }
    : { trangThai: "LECH", version: TEMPLATE_VERSION, dangCo, daGhi };
}

function ghiSoPhatHanh(chuan) {
  const kq = kiemSoPhatHanh(chuan);
  /* Chỉ MỘT trạng thái được ghi thêm. Mọi trạng thái còn lại — khớp rồi, lệch, sổ hỏng, lịch sử
     bị sửa — đều trả về nguyên trạng; bộ sinh không tự chữa sổ.
     ponytail: `main()` đã chặn ba ca xấu ở preflight trước khi gọi vào đây, nên dòng này không
     có phép kiểm riêng — nó không tới được. Giữ vì điều kiện đúng, và vì hàm này sẽ nguy hiểm
     nếu có ngày ai gọi nó từ chỗ khác. Bỏ preflight thì phải viết phép kiểm cho nó. */
  if (kq.trangThai !== "CHUA_GHI") return kq;
  const so = docSoPhatHanh().ban;
  so[TEMPLATE_VERSION] = kq.dangCo;
  const sapXep = Object.fromEntries(Object.keys(so).sort().map((v) => [v, so[v]]));
  fs.writeFileSync(path.join(ROOT, SO_PHAT_HANH), JSON.stringify({
    _doc: "Mỗi phiên bản bộ khung ↔ dấu vân tay tầng máy của nó. CHỈ THÊM — sửa một dòng đã có là nói dối về một bản đã phát. Sinh bởi build-template.mjs; kiểm bằng `npm test`.",
    ban: sapXep
  }, null, 2) + String.fromCharCode(10), "utf8");
  return kq;
}


/* Một chỗ diễn giải cho MỌI trạng thái sổ phát hành — `--check` và lượt sinh phải nói y hệt nhau,
   nếu không người đọc sẽ tin cái nào nhẹ hơn. */
export function loiSoPhatHanh(kq) {
  const d = [];
  if (kq.trangThai === "SO_HONG") {
    d.push(`SO_PHAT_HANH_HONG: ${SO_PHAT_HANH} có nhưng đọc không nổi — ${kq.loi}`);
    d.push("Đây KHÔNG phải 'chưa ghi'. Coi nó là chưa ghi thì làm hỏng sổ trở thành cách vượt qua");
    d.push("chính nó: sửa nguồn, xoá sổ, chạy lại, và cùng một số phiên bản mang dấu vân tay mới.");
    d.push(`Khôi phục từ git: \`git checkout -- ${SO_PHAT_HANH}\`.`);
  } else if (kq.trangThai === "NHAN_CHUNG_HONG") {
    d.push(`SO_PHAT_HANH_NHAN_CHUNG_HONG: không đối chiếu được sổ với lịch sử — ${kq.loi}`);
    d.push("Sổ chỉ có nghĩa khi có một nhân chứng không sửa kèm được. Mất nhân chứng thì đây là");
    d.push("KHÔNG BIẾT, không phải 'chưa có lịch sử' — và không biết thì không được đi tiếp.");
    d.push("Clone đủ sâu (`fetch-depth: 0` trên CI) rồi chạy lại.");
  } else if (kq.trangThai === "SUA_LICH_SU") {
    d.push(`SO_PHAT_HANH_SUA_LICH_SU: ${kq.doi.length} bản đã phát bị đổi so với lần đầu được ghi —`);
    for (const x of kq.doi) d.push(`  ${x.ban}: ${x.cu} → ${x.nay}   (ghi lần đầu ở ${x.sha})`);
    d.push("Sổ này CHỈ THÊM. Sửa một dòng đã phát là nói dối về một bản đã đi ra ngoài, và nó xoá");
    d.push("luôn khả năng đối chiếu — sổ tự làm chứng cho chính nó thì nó không chứng gì cả.");
    d.push(`Khôi phục: \`git checkout -- ${SO_PHAT_HANH}\`, rồi tăng "version" nếu bạn đang muốn phát bản mới.`);
  } else if (kq.trangThai === "LECH") {
    d.push(`SO_PHAT_HANH_LECH: bản ${kq.version} đã ghi dấu vân tay ${kq.daGhi}, mà nội dung tầng máy hiện tại là ${kq.dangCo}.`);
    d.push("Nội dung tầng máy đã đổi mà số phiên bản chưa tăng. Một số trỏ tới hai nội dung thì nó");
    d.push("không còn là mốc — và `upgrade.mjs` sẽ phát hai thứ khác nhau dưới cùng một nhãn.");
    d.push(`Sửa: tăng "version" trong package.json, rồi \`node scripts/build-template.mjs\`.`);
  } else if (kq.trangThai === "CHUA_GHI") {
    d.push(`SO_PHAT_HANH_THIEU: chưa có dòng nào cho bản ${kq.version} trong ${SO_PHAT_HANH}.`);
    d.push("Sửa: `node scripts/build-template.mjs` (lượt sinh sẽ ghi thêm dòng đó).");
  }
  return d;
}
/* ---- chạy ------------------------------------------------------------------ */

// So sánh bỏ qua ký tự xuống dòng kiểu Windows: git có thể checkout CRLF trong khi bộ sinh
// luôn viết LF. Dùng mã ký tự thay vì dấu thoát trong chuỗi — chính dòng này đã bị một tầng
// thoát nuốt mất và biến thành ngắt dòng thật khi viết bằng script.
const CARRIAGE_RETURN = String.fromCharCode(13);
const eol = (text) => text.split(CARRIAGE_RETURN).join("");

function main() {
  const checkOnly = process.argv.includes("--check");
  const files = buildTemplateFiles();

  const leaks = leakedNames(files);
  if (leaks.length) {
    console.error("TRICH_HONG: tên riêng của repo gốc lọt vào template —");
    for (const leak of leaks) console.error(`  ${leak.file}: "${leak.found}"`);
    console.error("Template mang tên dự án gốc thì không phải template. Sửa nguồn, đừng sửa phép kiểm.");
    process.exit(1);
  }

  if (checkOnly) {
    const drift = [];
    for (const [rel, want] of files) {
      const abs = path.join(ROOT, OUT, rel);
      if (!fs.existsSync(abs)) { drift.push(`${rel}: THIẾU trong ${OUT}/`); continue; }
      // So sau khi chuẩn hoá xuống dòng. Git trên Windows có thể checkout thành CRLF trong khi
      // bộ sinh luôn viết LF; so chuỗi thô thì một bản sao chép SẠCH cũng báo mọi file "lệch"
      // và `npm test` đỏ mà không ai làm gì sai. Audit độc lập bắt được 2026-09-02.
      if (eol(fs.readFileSync(abs, "utf8")) !== eol(want)) drift.push(`${rel}: LỆCH bản gốc`);
    }
    const expected = new Set([...files.keys()]);
    for (const rel of walk(path.join(ROOT, OUT))) {
      if (!expected.has(rel)) drift.push(`${rel}: THỪA — không có trong bản trích`);
    }
    if (drift.length) {
      console.error(`${OUT}/ đã lệch khỏi bản gốc (${drift.length} chỗ):`);
      for (const line of drift) console.error(`  ${line}`);
      console.error(`Sinh lại: node scripts/build-template.mjs`);
      process.exit(1);
    }
    const so = kiemSoPhatHanh(files);
    if (so.trangThai !== "KHOP") {
      for (const dong of loiSoPhatHanh(so)) console.error(dong);
      process.exit(1);
    }
    console.log(`${OUT}/ khớp bản gốc — ${files.size} file, bản ${so.version} khớp sổ phát hành.`);
    return;
  }

  /* KIỂM SỔ TRƯỚC KHI GHI MỘT BYTE NÀO.
   *
   * Bản đầu xoá `template/`, ghi lại 22 file, RỒI mới từ chối vì sổ lệch. Nên một lần chạy nhầm
   * để lại cây làm việc đã đổi kèm mã thoát khác 0 — người dùng phải tự đoán mình đang ở trạng
   * thái nào. Từ chối thì phải từ chối trước, không phải từ chối sau. */
  const soTruoc = kiemSoPhatHanh(files);
  if (soTruoc.trangThai !== "KHOP" && soTruoc.trangThai !== "CHUA_GHI") {
    console.error("");
    for (const dong of loiSoPhatHanh(soTruoc)) console.error(dong);
    console.error("Chưa ghi file nào — `template/` còn nguyên.");
    process.exit(1);
  }

  fs.rmSync(path.join(ROOT, OUT), { recursive: true, force: true });
  for (const [rel, text] of files) {
    const abs = path.join(ROOT, OUT, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, text, "utf8");
  }
  const so = ghiSoPhatHanh(files);
  console.log(`Đã sinh ${OUT}/ — ${files.size} file, bản ${TEMPLATE_VERSION}`
    + `${so.trangThai === "CHUA_GHI" ? ` (đã ghi vào ${SO_PHAT_HANH})` : ""}.`);
}

function walk(dir, prefix = "") {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walk(path.join(dir, entry.name), rel));
    else out.push(rel);
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("build-template.mjs")) main();
