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
  /* `rule-compiler.mjs` PHẢI đi theo vì `check-bootstrap.mjs` (ngay trên) `import` nó cho B16 —
     thiếu nó thì cổng kiểm cấu trúc của MỌI repo tiêu thụ chết ngay lúc nạp, không phải đỏ mà là
     `MODULE_NOT_FOUND`. Đây là lần thứ hai trong ngày một `import` mới suýt đi một mình: nay có
     phép ghim `tests/template-null-repo.mjs` chạy thật cổng cấu trúc trong bản trích, nên chuyện
     này đỏ thay vì lọt. Và nó đáng phát đi vì lý do riêng: bộ khung phát đi LUẬT, nên nó phải
     phát cả cái giữ cho luật khỏi phình. */
  "rule-compiler.mjs",
  "session-check.mjs",
  "safe-push.mjs",
  // GÓI ASSISTANT (bản 1.3.0) — hai lệnh của vai ĐIỀU PHỐI. Chúng CHỈ ĐỌC, không đòi khoá nào,
  // và cả hai đã chạy được trên một repo cố tình khác hình dạng repo nhà (tên vùng khác · không
  // đơn vị con · thiếu cả ba sổ · không remote). Suite ghim đi kèm là `tests/assistant-smoke.mjs`
  // ở khối VERBATIM bên dưới — phát một lệnh mà không phát phép ghim của nó là phát một lời hứa.
  "state-check.mjs",
  "what-next.mjs",
  // CÂN NẶNG — phải đi theo, vì "clean up đều đặn" mà không có thước thì là lời khuyên, không
  // phải nhịp. Đo được ở repo nhà 05/09: `HANDOFF.md` 1237/600 dòng, tổng tài liệu 3462/2200 —
  // và không ai biết cho tới khi có lệnh đo. Repo migrate thừa hưởng đúng bệnh đó nếu không
  // mang theo thước. Ngân sách khai được trong `.repo-structure.json` nên repo khác kích thước
  // không bị ép theo số của bộ khung.
  "can-nang.mjs",
  "don.mjs",
  /* NHẬT KÝ: trần một mục + xoay theo tháng (bản 1.3.51). Cơ chế sinh ra ở repo TIÊU THỤ
     `Chrome_Extension_AI_Agentic` (ADR-0011 của repo đó, 06/09) rồi mang LÊN đây 08/09 — tức nó
     đã chạy thật ở một repo trước khi được phát đi, không phải một ý tưởng phát sống.
     `can-nang.mjs` ngay trên đo được nhật ký vượt trần, nhưng ĐO không phải CHỮA: thứ đưa file
     về dưới trần là lượt xoay, và không repo nào có nó. Phép ghim đi kèm: `tests/handoff-smoke.mjs`
     ở khối VERBATIM bên dưới. */
  "handoff.mjs",
  /* CHẠY SUITE SONG SONG + DẤU XÁC NHẬN (bản 1.3.60). Đo 08/09 ở repo này: chuỗi suite 535s, và
     cổng đóng phiên gọi lại đúng chuỗi đó — một vòng làm việc tốn hơn 17 phút, nửa sau không
     kiểm thêm gì. Repo đích thừa hưởng NGUYÊN cấu trúc đó vì cổng là thứ được phát đi, nên chỗ
     chữa cũng phải được phát đi. `session-check.mjs` NHẬP file này, nên thiếu nó là cổng ném lúc
     nạp module. Phép ghim: `tests/dau-suite-smoke.mjs` ở khối VERBATIM. */
  "chay-test.mjs",
  // BẢNG CHO NGƯỜI XEM (bản 1.3.17) — Đức chốt 06/09 sau khi mở bảng của repo Chrome Extension
  // và thấy bảng bộ khung thiếu hẳn năm tab: "đưa cách triển khai, UI, UX vào repo template".
  //
  // Trước bản này mỗi repo tự dựng bảng của mình, và repo Chrome Extension đã đi trước với chín
  // tab mà bộ khung không có. Để nguyên là N repo có N bảng, và lúc chúng lệch nhau thì không ai
  // biết tin bản nào — đúng cái bệnh cả chương trình này sinh ra để chữa.
  //
  // BA FILE ĐI CÙNG NHAU, không tách được: `build-overview` dựng trang, `overview-doc` là bộ đọc
  // (phần kiểm được bằng phép kiểm thuần), `md-mini` đổi markdown sang HTML. Thiếu một là hai
  // file kia nạp không nổi. Suite ghim đi kèm là `tests/overview-doc-smoke.mjs` ở khối VERBATIM —
  // phát một lệnh mà không phát phép ghim của nó là phát một lời hứa.
  //
  // BỐN, từ bản 1.3.68: `luu-do.mjs` vẽ khối mermaid thành SVG. `md-mini` GỌI THẲNG nó, nên
  // thiếu file này thì `md-mini` nạp không nổi và cả trang chết. Nó cũng là lý do bộ vẽ ở đây
  // chứ không ở `build-overview`: chỗ cần vẽ là chỗ đọc markdown.
  "md-mini.mjs",
  "luu-do.mjs",
  "overview-doc.mjs",
  "build-overview.mjs"
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
  // BẢO TRÌ ĐỊNH KỲ — ba nhịp giữ repo ĐÚNG, cộng một nhịp giữ repo RẺ (mục "Nhịp DỌN").
  // Không phát cái này thì mỗi repo migrate tự phình theo cách riêng, và người chốt phát hiện
  // ra khi đã muộn — lúc mỗi phiên AI phải nạp một đống chữ đã hết việc.
  ["docs/BAO-TRI-DINH-KY.md", "docs/BAO-TRI-DINH-KY.md"],
  // TỪ ĐIỂN THUẬT NGỮ + BẢN HƯỚNG DẪN CHO NGƯỜI MỚI. Thiếu ở bản trích tới tận 06/09, và
  // vấp thật lượt migrate `ALL_SKILL_MANAGEMENT`: viết Bản đồ file cho repo đích trỏ tới hai
  // file này vì repo nhà có, kiểm lại thì CẢ HAI KHÔNG TỒN TẠI — đúng hình dạng lỗi "luật trỏ
  // tới một thứ không tồn tại" đã đếm năm lần.
  // Trớ trêu: đây là hai file repo mới CẦN NHẤT — một cuốn từ điển cho `gate` · `claim` · `lane`
  // · `fail-closed`, và một bản hướng dẫn cho phiên AI đầu tiên. Repo vừa lắp bộ khung là lúc
  // cần nhất, và trước bản này là lúc duy nhất không có.
  ["docs/LEGEND.md", "docs/LEGEND.md"],
  ["docs/HUONG-DAN.md", "docs/HUONG-DAN.md"],
  // PHÉP GHIM CỦA GÓI ASSISTANT — chép nguyên văn, cùng lý do như suite hạt giống: repo gốc
  // CHẠY THẬT đúng cái nó phát cho người khác, và `--check` không cho hai bản trôi khỏi nhau.
  // Khối E của nó tự dựng một repo git thật có hình dạng khác hẳn, nên nó chứng minh được
  // "chạy ở repo lạ" ngay tại repo vừa dựng, không cần ai đi kiểm hộ.
  ["tests/assistant-smoke.mjs", "tests/assistant-smoke.mjs"],
  ["tests/handoff-smoke.mjs", "tests/handoff-smoke.mjs"],
  ["tests/dau-suite-smoke.mjs", "tests/dau-suite-smoke.mjs"],
  // KIỂU XUỐNG DÒNG — phải đi theo, và đây là lý do đo được, không phải sở thích. Máy Windows
  // tự đổi kiểu xuống dòng lúc lấy file ra khỏi kho, nên CÙNG MỘT COMMIT tồn tại ở hai dạng
  // byte và `git status` nói SẠCH ở cả hai. Đo ở repo nhà ngay trước khi thêm: 75 file LF, 21
  // file CRLF, cổng vẫn xanh. Hệ quả đã cắn thật: một phép kiểm đọc mã nguồn rồi cắt theo dòng
  // XANH trên máy vừa ghi file và ĐỎ với người vừa clone — 28 lượt xanh rồi chết, và triệu
  // chứng trông như "phép kiểm tự nhiên hỏng" nên không ai tìm đúng chỗ.
  // Repo nhà vá 05/09; bản trích thì tới 05/09 mới mang theo, nên mọi repo dựng trước đó vẫn
  // dính nguyên. Không nằm trong tầng máy (`scripts/` · `tests/`) nên KHÔNG đổi dấu vân tay
  // bản phát — đã đo trước khi làm, chính vì thế lượt này không phải cắt bản mới.
  [".gitattributes", ".gitattributes"],
  // Phép ghim của bộ đọc bảng. Phát ba file máy mà không phát suite ghim của chúng là phát một
  // lời hứa: repo đích sẽ có bảng, và sẽ không có gì bắt được lúc bảng đọc sai.
  ["tests/overview-doc-smoke.mjs", "tests/overview-doc-smoke.mjs"],
  /* Phép ghim của bộ vẽ lưu đồ. Đi theo vì lỗi nó vá là lỗi KHÔNG AI ĐỎ được: trang vẫn sinh ra,
   * chỉ là lưu đồ hiện dưới dạng mã nguồn. Repo đích nhận bộ vẽ mà không nhận vế "mọi khối
   * mermaid trong docs/ phải ra SVG" thì nó nhận lại đúng cái lỗ đã sống 5 tháng ở đây. */
  ["tests/luu-do-smoke.mjs", "tests/luu-do-smoke.mjs"],
  /* Phép ghim của khoá mức FILE. `MULTIFLOW.md` mục 5 bắt mọi cơ chế đa phiên phải có đột biến
   * kiểm; phát cơ chế mà không phát phép ghim là phát một lời hứa. Suite này dùng HÀM THUẦN,
   * không chạm đĩa, nên nó chạy được cả ở repo vừa dựng chưa có bảng quyền. */
  ["tests/khoa-file.mjs", "tests/khoa-file.mjs"],
  /* Cơ chế đa phiên → `MULTIFLOW.md` mục 5 bắt đột biến kiểm, và phát một cơ chế mà không phát
   * phép ghim của nó là phát một lời hứa. Suite này tự dựng kho git riêng và đọc `areas` của
   * repo đích, nên nó chạy được cả ở repo khai khối `areas` rỗng. */
  ["tests/khoa-dau-vet.mjs", "tests/khoa-dau-vet.mjs"],
  /* CỬA INDEX + phép ghim của nó. ĐI THEO BẢN TRÍCH, và không có lựa chọn nào khác: luật chung
   * mục 0b GỌI TÊN `.githooks/commit-msg`, nên repo đích không nhận nó là nhận một luật trỏ tới
   * thứ không tồn tại — đúng bẫy đã bắt được năm lần ở sổ này. Bệnh nó vá là bệnh CỦA MỌI repo
   * nhiều lane: một cây làm việc có đúng một index. Phép ghim tự dựng kho git riêng và tự khai
   * `areas`, nên nó chạy ở repo đích y như ở đây. */
  [".githooks/commit-msg", ".githooks/commit-msg"],
  ["tests/cua-index.mjs", "tests/cua-index.mjs"],
  /* BẢNG SỐNG — ba cửa, một lõi. Đi theo bản trích vì chỗ hỏng nó vá là chỗ MỌI repo dựng từ bộ
   * khung đều có: bảng suy từ HEAD trả lời câu về QUÁ KHỨ, mà câu người chốt hỏi là câu về BÂY
   * GIỜ. Đo ở repo nhà 06/09 — bốn khoá một phiên giữ suốt lượt làm việc nằm trong 0/6 commit.
   *
   * Không đóng cứng tên khoá ở đây: `khoaChanSinhFrom` suy chủ của `scripts/` và `template/` từ
   * `.repo-structure.json`, nên chốt ⑴ còn nổ ở repo đặt tên khoá khác. Một danh sách gõ tay ở
   * đây là chốt im lặng không bao giờ nổ — đúng loại lỗi chính nó sinh ra để chặn. */
  ["bang-song/loi.mjs", "bang-song/loi.mjs"],
  ["bang-song/may-chu.mjs", "bang-song/may-chu.mjs"],
  ["bang-song/mot-luot.mjs", "bang-song/mot-luot.mjs"],
  ["bang-song/Xem-bang.cmd", "bang-song/Xem-bang.cmd"],
  ["bang-song/Mo-may-chu.cmd", "bang-song/Mo-may-chu.cmd"],
  ["bang-song/Bat-tu-chay.cmd", "bang-song/Bat-tu-chay.cmd"],
  ["bang-song/Tat-tu-chay.cmd", "bang-song/Tat-tu-chay.cmd"],
  ["tests/bang-song.mjs", "tests/bang-song.mjs"],
  /* Bản ra PHẢI nằm ngoài git ở repo đích y như ở đây, không thì repo đó commit bảng sống và
   * mọi phiên của nó thấy cây làm việc bẩn mỗi lượt có ai nhận khoá. */
  [".gitignore", ".gitignore"],
  /* DANH MỤC TÍNH NĂNG — cả ba file, và phát thiếu một là phát một nửa.
   *
   * Điểm của danh mục là để phiên AI ở REPO ĐÍCH tự đo mình: "tôi đang thiếu tính năng nào so
   * với bản mới của bộ khung". Phát bộ đo mà không phát danh mục thì nó không có gì để đọc; phát
   * danh mục mà không phát bộ đo thì nó là một file chữ. */
  ["features.json", "features.json"],
  ["scripts/features.mjs", "scripts/features.mjs"],
  ["tests/features-smoke.mjs", "tests/features-smoke.mjs"]
];

/* ADR-0000 CỐ Ý KHÔNG chép nguyên văn. Bản gốc kể lại lịch sử di trú của riêng repo gốc — ba
   file `decisions.md`, số quyết định của từng gói — và nó là bản ghi BẤT BIẾN nên không được
   sửa. Đúng hơn về mặt khái niệm: ADR-0000 của mỗi repo là *quyết định của chính repo đó* về
   việc áp dụng ADR, không phải bản sao quyết định của người khác. Nên template mang một hạt
   giống: giữ nguyên bốn luật, thay phần bối cảnh bằng bối cảnh của một repo mới. */
/* HẠT GIỐNG ADR mang sẵn `chu_de` và `dau_moi` — không phải để cho phép kiểm B16 xanh, mà vì
   repo mới học bằng cách CHÉP cái nó thấy. Hạt giống không khai chỗ đứng thì ADR thứ hai, thứ ba
   cũng sẽ không khai, và tới lúc có mười cái thì không ai đi khai ngược lại nữa. Khai từ cái đầu
   tiên là rẻ nhất. Kèm theo: `.repo-structure.json` của bản trích khai sẵn `luat.chu_de`. */
const ADR_SEED = `---
status: Proposed
adr: 0000
chu_de: ghi-quyet-dinh
dau_moi: true
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
  /* LỆNH CHỈ CÓ Ở REPO NHÀ phải bị gỡ khỏi bản trích, không chỉ đổi tên.
     `npm run overview` sinh trang HTML — công cụ NHÀ, cố ý không đi theo bản trích (ADR-0002).
     Sổ tay bảo trì dạy nó ở mục "một tháng nữa mới quay lại"; chép nguyên văn sang bản trích là
     phát đi một lệnh repo đích KHÔNG CÓ. Phép ghim của bộ trích bắt đúng chỗ này 05/09 —
     "dạy `npm run overview` nhưng bản trích KHÔNG khai lệnh đó". */
  if (rel === "docs/BAO-TRI-DINH-KY.md") {
    out = out.split(String.fromCharCode(10))
      .filter((l) => !l.includes("npm run overview"))
      .join(String.fromCharCode(10));
  }

  /* BẢN HƯỚNG DẪN nhắc ba thứ CHỈ repo bộ khung có: `npm run assess` (đo một repo khác cách
     chuẩn bao xa), khoá vùng `_template`, và câu tự giới thiệu "bộ khung này". Repo đích không
     có lệnh đó, không có thư mục đó — dạy nó là phát đi một lệnh gõ vào sẽ báo lỗi, đúng cái
     bẫy mà bộ lọc `BAO-TRI-DINH-KY.md` ngay trên đã bịt.
     Cắt theo KHỐI, không cắt theo dòng: bỏ một dòng lệnh mà để lại tiêu đề với bảng giải thích
     thì người đọc thấy một mục cụt, còn khó hiểu hơn là không có mục nào. */
  if (rel === "docs/HUONG-DAN.md") {
    const NL = String.fromCharCode(10);
    const dong = out.split(NL);
    const ra = [];
    let boQua = false;
    for (const d of dong) {
      if (/^#{2,4} /.test(d)) boQua = d.includes("Repo kia còn cách chuẩn bao xa");
      if (boQua) continue;
      if (d.includes("_template")) continue;
      ra.push(d.replace("bộ khung này để làm gì", "repo này để làm gì"));
    }
    out = ra.join(NL);
  }
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
/* SỔ ĐỔI DẤU VÂN TAY — mỗi lượt đổi phải để lại một dòng ở đây, kèm AI DUYỆT và ĐỔI GÌ.
 * Không có sổ này thì một hằng số 64 ký tự đổi lặng lẽ trông y hệt một lượt đổi được duyệt, và
 * đó đúng là kiểu "restamp cho xong việc" mà bảng quyền đã phải học một lần rồi.
 *
 *   2026-09-08 · Đức duyệt · mục 5 "Vai từng AI" đổi từ chia-theo-hãng sang HAI VAI chia theo
 *   việc (① giữ lõi · ② phát & thu). Lý do đo được: 14 ngày / 306 commit — Antigravity 0,
 *   Codex 1 (0,33%), và lane lớn nhất 112 commit có tên không nói hãng nào. Đức chốt cho lan
 *   sang mọi repo tiêu thụ, nguyên văn: "Template repo AI sẽ đồng bộ đến các Repo khác".
 *   Vân tay trước lượt đổi: a69e334f455b2056d7d3338f6924c70bde1088ed914dbd4d986a9db04decfe55
 *
 *   2026-09-08 (cùng lượt, viết gọn lại) · CÙNG quyết định trên, không phải quyết định thứ hai.
 *   Bản chữ đầu làm `template/AGENTS.md` dài 200 → 218 dòng và **B9 đỏ** (trần 200 dòng cho hiến
 *   pháp). Nên mục 5 bị nén lại cho vừa đúng chỗ cái bảng nó thay — tức "một luật vào một luật
 *   ra" ở đây do MÁY cưỡng chế, không do người tự giác. Nội dung luật không đổi một ý nào.
 *   Nén hai lượt: bản chữ đầu c35949d4… (218 dòng, B9 đỏ) → bản nén 4f87d44f… (210, vẫn đỏ) →
 *   bản này, sau khi CHUYỂN số đo và lý lẽ sang ADR-0008. Chỗ của lý lẽ là ADR, không phải hiến
 *   pháp — tôi đặt sai chỗ ở hai lượt đầu, và B9 là thứ bắt được. */
/* 2026-09-08 — Đức duyệt tường minh: "tìm được điểm improve ta cần ghi vào rules & protocol để
 *   tối ưu tốc độ xử lý task của toàn bộ hệ thống", kèm chỉ thị chạy không dừng, không hỏi lại.
 *   Đổi gì: thêm mục 0b "THỨ TỰ ĐÓNG PHIÊN" vào luật chung — ba luật tốc độ, mỗi luật có số đo
 *   đứng sau: chạy `npm test` SAU commit (đúng thứ tự cổng 22s, sai ~9 phút) · trong lúc làm dùng
 *   `--chi <suite>` thay vì đủ bộ · phát bản trích MỘT LẦN sau khi suite xanh (08/09 đốt 7 số bản
 *   vì làm ngược). Vân tay trước: 8a414ccaf80728686d35d0a36a5f238c731909a76d61857dc77b7e6884ebc4b1
 *   Bản đầu (0f6f62e0…) gọi thẳng tên lệnh `npm run template` trong luật CHUNG — sai, vì repo
 *   tiêu thụ không có lệnh đó, và phép kiểm "tài liệu dạy lệnh nào thì bản trích phải khai lệnh
 *   đó" bắt đúng. Bản này nói về "bộ sinh ghi vào một sổ có ràng buộc", không nêu tên lệnh.
 *   MỘT LUẬT VÀO THÌ MỘT LUẬT RA, và B9 là thứ cưỡng chế: thêm mục 0b đẩy bản trích lên 228/200
 *   dòng. Chỗ trả lại là **sơ đồ mermaid ở mục 2** — nó nói lại đúng điều bảng sáu việc và câu
 *   nguyên tắc ngay dưới đã nói, tức bản thứ BA của một luật. Nén 0b (29→14 dòng) + bỏ sơ đồ
 *   (10 dòng) đưa bản trích về dưới trần mà không mất một luật nào. */
/* 2026-09-08 (khuya) — Đức duyệt tường minh, nguyên văn: "AI Assistant chỉ giữ khóa đúng ở file
 *   mà AI đó đang sửa, các file khác không giữ, khóa được giữ và trả ngay trước và sau khi AI sửa
 *   … Nếu chỉ đọc ko cần giữ khóa." Đổi gì: thêm khối "Khoá mức FILE" vào mục 1 của luật chung —
 *   ba lệnh (`--sua` · `--xong --het` · `--soat`), luật chứa nhau hai chiều, mốc trả là HẾT PHIÊN
 *   chứ không phải ĐÃ ĐẨY, và một dòng nói thẳng `--soat` KHÔNG phải cổng.
 *   Vân tay trước: 16d502f385b1f4db7505c0a4dfbc48754db8df3ce38a28be13f87ed84eec7c8d
 *   Bản đầu (1c448903…) để một dòng trỏ sang ADR-0012 NGAY TRONG luật chung — sai, vì bản trích
 *   không mang ADR đó, và phép kiểm "luật trong khuôn trỏ tới file bản trích KHÔNG mang" bắt
 *   đúng. Cùng hình dạng cái bẫy đã cắn hai lượt trước: luật CHUNG không được trỏ tới thứ chỉ
 *   NƠI PHÁT HÀNH mới có. Liên kết ADR nay nằm ở bản đồ file mục 6 — chỗ mỗi repo tự viết.
 *   Số đo dựng nên nó, đo ở CHÍNH repo này chứ không mượn của repo tiêu thụ: 620 cặp commit khác
 *   lane trong 1 giờ cùng vùng, 57% khác file hoàn toàn — hơn nửa số lượt chặn hôm nay là chặn
 *   OAN. Lý lẽ đầy đủ và mục "cái này KHÔNG chữa": ADR-0012.
 *   MỘT LUẬT VÀO THÌ MỘT LUẬT RA — xem dòng B9 ngay sau lượt này. */
/* 2026-09-09 — Đức duyệt tường minh: chọn "Đẩy đi, và từ nay khỏi hỏi nếu cổng đã xanh", sau
 *   BA lượt phải dừng hỏi trong hai ngày cho cùng một hình dạng (commit của lane khác nằm dưới
 *   commit của mình, đẩy cái trên là buộc đẩy cái dưới).
 *   Đổi gì: mục 2 hàng 2 thôi cấm `--carry` nói chung; nay chỉ cấm khi cổng CHƯA xanh toàn bộ
 *   hoặc có commit không quy thuộc được. Thêm một đoạn nêu ĐIỀU KIỆN và nêu CÁI MẤT: Đức thôi
 *   được báo từng lượt việc của lane khác lên GitHub.
 *   Vân tay trước: 3bc47c94b718e38ebbf34eeae099dafcaed4cb019d859b54f1deb4769500b2f5
 *   ĐÂY LÀ NỚI MỘT LỚP BẢO VỆ, không phải chữa mâu thuẫn — khác hẳn hai lượt miễn thước kho chữ
 *   hôm qua (những lượt đó làm thước CHẶT hơn). Ghi rõ để lượt sau đọc không lẫn hai loại. */
/* 2026-09-09 (lượt 2) — Đức duyệt tường minh, nguyên văn: "tôi đồng ý, gộp, xóa, sử dụng decision
 *   mới nhất, bỏ các cái cũ đã bị obsolete để ko gây confuse."
 *   ĐÂY LÀ XOÁ MÂU THUẪN, KHÔNG PHẢI NỚI BẢO VỆ — không luật nào mất, một luật CHẾT được gỡ.
 *
 *   Ca thật Đức bắt được: một phiên nhớ luật *"quá 30 phút thì nêu tên, tuyệt đối không tự nhả"*
 *   rồi áp nó cho khoá của CHÍNH NÓ — nên nó giữ khoá suốt phiên, ngược hẳn luật mới nhất. Đọc
 *   lại thì câu đó **không có chủ ngữ**: "KHÔNG tự nhả" ai? Ý gốc là MÁY không được tự hết hạn
 *   khoá của lane khác. Câu thiếu chủ ngữ nằm cạnh khối khoá file, nên đọc thành "đừng trả khoá
 *   của mình".
 *
 *   Và chỗ hỏng nặng hơn nằm ngay trong SỔ NÀY: ghi chú 08/09 (dòng trên) chép nguyên văn lời Đức
 *   *"trả ngay trước và sau khi AI sửa"* rồi ngay câu sau tự viết *"mốc trả là HẾT PHIÊN"*. Một
 *   đoạn văn nói hai mốc khác nhau. Mục 1 của luật chung khi đó có BA mốc trả cùng lúc: "trả ngay
 *   sau khi sửa" · "NGAY SAU khi COMMIT" (khối lệnh) · "hết phiên". Ba câu, một câu hỏi.
 *
 *   Đổi gì: mục 1 nay nói MỘT mốc mỗi loại khoá — file trả ngay sau commit chứa lượt ghi, vùng
 *   trả sau khi đã đẩy — và nói rõ cổng ĐỎ chỉ là LƯỚI ĐỠ chứ không phải hạn chót được phép xài.
 *   Câu "30 phút" nhận chủ ngữ (MÁY) và dời xuống cạnh luật "KHÔNG nhả khoá của LANE KHÁC", là
 *   chỗ nó vốn thuộc về.
 *
 *   CÙNG LƯỢT, Đức bổ sung: "hãy phân nhóm cho chúng, giữ luật bằng tiếng việt để tôi cùng đọc
 *   bản cuối." → ⑴ mục 8 nhận câu hỏi thứ TƯ ("nó thuộc NHÓM nào?") kèm bảng sáu nhà, để một luật
 *   mới có ĐÚNG MỘT chỗ đứng thay vì được nối thêm vào chỗ gần nhất; ⑵ ghi thành luật cái vừa xảy
 *   ra — luật mới phủ luật cũ thì XOÁ luật cũ ngay lượt đó, và mỗi luật phải có CHỦ NGỮ; ⑶ mục 6
 *   thôi nói "sáu phép kiểm" (số của 05/09, khi cổng có 11 mục) — nay ghi số đo 09/09 là **11/15**
 *   và NÊU TÊN bốn mục chưa có ca đỏ, đóng KHUNG-10.
 *   NGÔN NGỮ: tiếng Việt, Đức chốt — bỏ hẳn hướng dịch luật sang tiếng Anh để tiết kiệm token.
 *   Lý do Đức nêu: anh phải đọc được bản cuối. Luật anh không đọc được thì anh không chốt được.
 *
 *   MỘT LUẬT VÀO THÌ MỘT LUẬT RA — B9 cưỡng chế, và lượt này trả đúng giá. Bản chữ đầu đẩy bản
 *   trích lên **220/200 dòng**. Không một luật nào bị bỏ; **20 dòng gọt là chữ, không phải luật**:
 *   bảng sáu-nhà (9 dòng) nén thành một câu liệt kê 4 dòng · mở đầu mục 8 và đuôi "cân nặng" mỗi
 *   chỗ bớt một dòng · mục 2 gộp hai đoạn nguyên tắc · mục 5 bỏ câu dặn operator (*"AI nào không
 *   tự nạp file này thì Đức dán…"* — lời nhắc, không phải luật) · mục 4 và mục 1 gộp dòng gãy.
 *   BẪY BẮT ĐƯỢC TRƯỚC KHI PHÁT, lần thứ năm cùng hình dạng: bản chữ đầu của câu 4 trỏ tên
 *   `docs/SO-TAY-AGENT.md` và `IDEAS.md` — **bản trích KHÔNG mang hai file đó**. Sửa thành mô tả
 *   VAI TRÒ ("sổ riêng, khai vào bảng mục 6"), đúng bài học cũ: luật chung tả HÀNH VI, không gọi
 *   tên thứ chỉ nơi phát hành mới có.
 *   Vân tay trước: 51d31f3eda172dea51e5c5a7d259657cb050c535517efb289a975c7dfaaac7e4
 *
 * ĐỔI 09/09 — NÉN LUẬT, Đức chốt và uỷ quyền: *"tôi ủy quyền cho bạn duy trì tự động cơ chế nén
 *   rules, tái tổ chức và cấu tạo lại kiến trúc… mục tiêu không phải đạt ngưỡng, mà phải nhỏ hơn
 *   ngưỡng margin 30-40%"*. KHÔNG một luật nào bị bỏ; ba thứ ĐỔI CHỖ, mỗi thứ có nhà mới khai
 *   trong bản đồ: ⑴ lý lẽ và số đo lịch sử → `docs/VI-SAO-LUAT.md` · ⑵ ba luật cơ chế khoá mà
 *   `claim.mjs` tự cưỡng chế và tự nêu tên khoá thiếu (chứa nhau hai chiều · chia gốc repo ·
 *   hai file được miễn) → `docs/protocols/MULTIFLOW.md` · ⑶ bảng tra mục 6 rút còn bảy cửa, bản
 *   đầy đủ đã ở `docs/BAN-DO-CHI-TIET.md` từ lượt trước. Và một luật ĐỔI THẬT: mở phiên đọc
 *   `STATUS.md` thay cho phần đuôi `HANDOFF.md` — ghi ở `decisions.md`.
 *   Đo: phần MỌI phiên phải nạp **4.907 → 3.202 token** cho hiến pháp, tổng nạp **5.804 → 3.761**.
 *   Kiểm chứng độc lập: audit Codex 09/09 nêu BỐN chỗ luật bị làm yếu ở bản nén đầu — kiểm lại
 *   thì cả bốn đúng, và đã trả lại nguyên văn (đọc luật của vùng sắp đụng · "phép kiểm hay tài
 *   liệu" ở năm câu · quyền "vai nào cũng được tìm lỗi ở bất kỳ đâu" · "viết lại đơn giản hơn").
 *   BÀI HỌC: nén văn xuôi làm RỤNG MỆNH LỆNH PHỤ, và người nén không thấy vì họ vẫn nhớ câu gốc.
 *   Vân tay trước: b539c11a59872c42325963bc9dd6a778d9e70f5658ed7eaa63f95380f405f8be
 *
 * ĐỔI 10/09 — CỬA INDEX, mục 0b. Đức giao *"chạy KHUNG-59"*, và điều kiện `đóng khi:` của mục
 *   đó (viết từ trước, ở `BACKLOG.md`) đòi đúng chữ này: *"`AGENTS.md` mục 0b nêu cách gọi git đã
 *   chốt"*. Nên lượt đổi luật này nằm TRONG việc được giao, không phải ngoài lề nó.
 *
 *   THÊM, KHÔNG BỚT — đã soi từng mệnh lệnh bằng `diff`: cả bốn câu cũ của mục 0b còn nguyên văn
 *   (thứ tự đóng phiên · `npm test` SAU commit với 22 giây/9 phút/28 phút · một suite lúc đang
 *   làm, đủ bộ một lần ở cuối · bộ sinh sau khi suite xanh · KHÔNG `git push`). Thêm hai điều:
 *   `git commit --only <đường dẫn>` và cửa `.githooks/commit-msg`.
 *
 *   BẪY CŨ BẮT ĐƯỢC LẦN THỨ SÁU, ngay lượt này: bản chữ đầu của tôi NÉN mục 0b cho vừa trần
 *   token, và làm rụng ba mệnh lệnh phụ — `node scripts/` biến mất khỏi lệnh chạy một suite (lệnh
 *   không còn chạy được), *"ghi vào sổ có ràng buộc"* và *"sau khi suite xanh"* biến mất khỏi luật
 *   bộ sinh. Chính dấu vân tay này chặn lại. Đúng bài học ghi ở lượt 09/09 phía trên: **nén văn
 *   xuôi làm rụng mệnh lệnh phụ, và người nén không thấy vì họ vẫn nhớ câu gốc.** Trả lại nguyên
 *   văn, rồi gọt token ở chỗ TRÙNG THẬT: `STATUS.md` có hai trường nói cùng một câu.
 *   Đo: phần nạp **4.161 → 4.194/4.200 token** — còn 6 token dư, mục 0b không nhận thêm được gì.
 *
 *   LUẬT CHUNG GỌI TÊN MỘT FILE, nên file đó PHẢI đi theo bản trích: `.githooks/commit-msg` và
 *   `tests/cua-index.mjs` vào danh sách ngay lượt này. Bẫy *"luật trỏ tới thứ chỉ nơi phát hành
 *   mới có"* đã bắt được năm lần ở sổ này; lần này chặn trước khi phát.
 *   Vân tay trước: 956bd6f139a744ff96062b34f615e9c6a9bc744d4f5211bc07b51ebeb3e438cd */
const COMMON_LAW_SHA256 = "6cce53b34852abf0920f1dd3acc7834d0252f7aa52633eb8c73313b97db1339c";
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

> **Bản đồ file ĐẦY ĐỦ của repo bạn ở [docs/BAN-DO-CHI-TIET.md](docs/BAN-DO-CHI-TIET.md)** —
> \`.repo-structure.json\` khai nó là bản đồ chính thức, nên **thêm file mới thì khai ở ĐÓ**.
> Bảng dưới đây chỉ là các cửa hay dùng nhất; bộ khung điền sẵn để repo mới xanh ngay.

| Khi bạn sắp… | Mở file |
|---|---|
| **Không thấy việc mình ở bảng này** | [docs/BAN-DO-CHI-TIET.md](docs/BAN-DO-CHI-TIET.md) — bản ĐẦY ĐỦ |
| **Cãi một luật, hay tìm sự cố sinh ra nó** | [docs/VI-SAO-LUAT.md](docs/VI-SAO-LUAT.md) |
| **Biết repo NẶNG bao nhiêu, một phiên nạp bao nhiêu token** | \`npm run can-nang\` · \`npm run luat -- --nap\` |
| **Tra nhanh người chốt đã chốt gì, ngày nào** | [decisions.md](decisions.md) |
| **Sắp làm cùng lúc với AI khác, hoặc sắp SỬA một trong bốn cơ chế đa phiên** | [docs/protocols/MULTIFLOW.md](docs/protocols/MULTIFLOW.md) |
| Biết phiên trước làm tới đâu | [HANDOFF.md](HANDOFF.md) |
| **Mới vào, hoặc cần tra một thuật ngữ** (gate · claim · lane · fail-closed…) | [docs/HUONG-DAN.md](docs/HUONG-DAN.md) · [docs/LEGEND.md](docs/LEGEND.md) |
| **Phát sinh việc ngoài phạm vi phiên mình — chỗ ghi nợ, luật mục 0 bắt** | [BACKLOG.md](BACKLOG.md) |
| **Không biết làm gì tiếp, hoặc muốn biết việc nào chạy song song được ngay** | \`npm run what-next\` |
| **Sắp THÊM một luật, hay muốn biết luật nào đang hiệu lực về một chủ đề** | \`npm run luat\` |
| Biết luật riêng của NGHỀ repo bạn (không phải luật chung) | [docs/ANNEX-tu-dong-hoa-trinh-duyet.md](docs/ANNEX-tu-dong-hoa-trinh-duyet.md) · [docs/_TEMPLATE-annex.md](docs/_TEMPLATE-annex.md) |

**Phải là liên kết bấm được, không phải chữ thường:** phép kiểm độ sâu điều hướng (B6) đi theo
liên kết từ cổng vào máy đọc, nên file không ai trỏ tới thì máy coi là không tới được. Đo thật lúc
dựng bộ khung: để bảng rỗng thì **4 file** rơi ra ngoài bản đồ, kể cả chính \`README.md\`.
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
  /* Câu cũ nói "bộ khung KHÔNG mang công cụ đo" — SAI từ lúc `can-nang.mjs` thành portable:
     bản trích mang cả nó lẫn `npm run can-nang`. Một dòng luật nói ngược thứ repo thật sự có
     thì phiên đọc luật sẽ không bao giờ đi đo. Sửa 09/09 khi soát bốn tính năng qua migrate. */
  const CAN_NANG_MOI = [
    'Cân nặng được ĐO, không để cảm tính — cảm tính luôn nói "thêm một cái nữa thì có sao đâu":',
    "",
    "```bash",
    "npm run can-nang        # kho chữ · sổ nợ · TOKEN mọi phiên phải nạp",
    "npm run luat -- --nap   # chính xác thứ một phiên phải đọc, và thứ KHÔNG phải đọc",
    "```",
    "",
    "Ngưỡng khai ở `budget` và `docs` trong `.repo-structure.json`, điền sẵn một bộ chạy được.",
    "**Thước chỉ được SIẾT.** Quá thì BỚT, đừng nới.",
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
  "handoff": {
    "_doc": "Trần độ dài MỘT mục nhật ký trong HANDOFF.md, tính bằng byte UTF-8. Cổng đóng phiên chỉ chặn MỤC VỪA THÊM trong phiên này — mục cũ KHÔNG bị chặn, vì chặn cả file là mọi lane đỏ ngay vì chữ của người khác.",
    "_vi_sao_phat_kem_con_so": "Phát công cụ mà không phát thước thì repo mới nhận một lệnh không ai gọi. 2600 là số đo được ở repo đầu tiên dùng cơ chế này: vừa trên mục ĐẦY ĐỦ MÀ GỌN nhất đang có, và nằm trong một khoảng TRỐNG của phân bố nên xê dịch ±200 byte không đổi kết quả. Repo bạn thấy chật thì đổi số ở ĐÂY, đừng sửa script.",
    "tran_byte_moi_muc": 2600
  },
  "bang": {
    "_doc": "Danh sách nhóm (tab) của bảng tổng quan — HỢP ĐỒNG, khai ở ĐÚNG MỘT NƠI. Các suite đọc từ đây; không suite nào được gõ cứng lại danh sách này.",
    "_vi_sao_o_day": "Hợp đồng nằm trong chính bộ sinh thì một lượt thêm tab sửa cả hai vế của phép so sánh cùng lúc, và phép kiểm xanh với MỌI danh sách — tức nó không còn canh gì. Khai ở file dữ liệu này thì đổi số nhóm là phải sửa hai chỗ có chủ ý.",
    "_xuat_xu": "KHUNG-46 ở repo phát hành (đo 2026-09-08): danh sách này từng bị assert.deepEqual ở HAI file test, và một lượt sửa lệch nhau đã làm cổng đỏ thêm một vòng 9 phút.",
    "nhom": ["tong-quan", "cong-viec", "migrate", "he-thong", "lich-su"]
  },
  "test": {
    "_doc": "Suite nào PHẢI chạy MỘT MÌNH. Bộ chạy scripts/chay-test.mjs chạy song song những suite còn lại; suite đọc git của CÂY LÀM VIỆC CHÍNH thì hai tiến trình tranh index.lock và báo ra một lỗi NỘI DUNG trông y hệt lỗi thật.",
    "_khong_sao_neu_thieu": "Khai sót không nguy hiểm: bộ chạy tự chạy lại MỘT MÌNH mỗi suite đỏ trước khi kết luận, nên tranh chấp bị loại trừ chứ không bị báo nhầm thành lỗi.",
    "_ghi_de_file_that": "TIÊU CHÍ THỨ HAI, và ở đây khai sót thì NGUY HIỂM: suite nào GHI ĐÈ một file ĐÃ COMMIT ở gốc repo cũng phải khai vào đây. Đột biến kiểm của nó đứng ở cây làm việc THẬT, không ở thư mục tạm. Đo ở repo phát hành 2026-09-08: một suite ghi đè một dòng sổ phát hành rồi khôi phục trong finally; chạy song song thì bên đọc thấy sổ đang hỏng (đỏ oan), và hai lượt chồng nhau thì lớp khôi phục ghi đè một ảnh chụp ĐÃ HỎNG — mất hẳn một dòng của một sổ chỉ-thêm. Một commit đã mang theo dòng hỏng vì thế.",
    "serial": ["bang-song.mjs", "khoa-dau-vet.mjs", "features-smoke.mjs", "overview-doc-smoke.mjs"]
  },
  "areas": {
    "_doc_": "Mỗi thư mục top-level phải có một dòng ở đây, nếu không cổng kiểm đếm nó là chưa khai chủ. ownership_mode: root = một chủ duy nhất; per-package = chia chủ theo từng gói con, kèm claim_prefix.",
    "_areas_doc2": "HAI CHỦ, CỐ Ý — đừng gộp về một. Một repo một-chủ làm cả lớp phân vùng thành hình nền: mọi đường dẫn quy về cùng một khoá, nên bất biến steward↔khoá quyền, phép kiểm nhãn lane, và hàm quy chủ đều ĐẠT TẦM THƯỜNG — đúng ở cả hai chiều, không ghim được gì. Đo thật ở bản trích đầu: cả bốn đường dẫn thử đều trả _root, và một đột biến phá sạch hàm quy chủ vẫn thoát. Tách docs/ ra là ca thật rẻ nhất để lớp đó có việc mà làm.",
    "docs/": { "steward": "_docs", "mutability": "rw", "ownership_mode": "root", "note": "tài liệu bốn tầng: studies, briefs, archive, adr" },
    "scripts/": { "steward": "_root", "mutability": "rw", "ownership_mode": "root", "note": "bộ sinh + cổng kiểm + đẩy an toàn" },
    "tests/": { "steward": "_root", "mutability": "rw", "ownership_mode": "root", "note": "suite gốc repo" },
    "evidence/": { "steward": "_root", "mutability": "append-only", "ownership_mode": "root", "note": "bằng chứng vận hành: chỉ thêm, không sửa, không xoá" },
    "bang-song/": { "steward": "_root", "mutability": "rw", "ownership_mode": "root", "note": "ba cửa vào bảng SỐNG — bản ra (BANG.html, trang-thai.json) nằm NGOÀI git, xem .gitignore" }
  },
  "generators": ["build-dashboard.mjs"],
  "_generators_doc": "Script nào sinh ra artifact đã commit. Cổng đóng phiên đối chiếu từng cái với HEAD. CHỈ khai script repo này THẬT SỰ có — khai thừa là cổng đỏ vì thiếu file.",
  "generated": ["DASHBOARD.md", "llms.txt", "repo-map.json"],
  "_generated_doc": "FILE do các script trên sinh ra. Khai vào đây thì chúng KHÔNG đòi ai nhận quyền — nội dung tất định từ HEAD nên không ai sở hữu chúng theo nghĩa nào. Đo thật ở repo gốc: 19% lượt nhận khoá gốc tồn tại CHỈ để chạy bộ sinh; đó là tranh chấp nhân tạo.",
  "_generated_doc2": "KHÔNG làm yếu lớp bảo vệ: nội dung vẫn bị phép kiểm 'Sự thật máy sinh còn tươi' đối chiếu với HEAD ở MỌI phiên, nên sửa tay một dòng vẫn ĐỎ. Và đừng lẫn với 'generators' (khác một chữ): cái kia là SCRIPT, cái này là FILE. Khai từng file, không khai thư mục.",
  "docs": {
    "_doc": "file_map = BAN DO FILE chinh thuc. Cong doi chieu file moi voi file nay. Bo trong thi mac dinh la AGENTS.md — nhung ban do nam trong hien phap la thu MOI phien phai nap, nen bo khung tach san ra mot file rieng.",
    "file_map": "docs/BAN-DO-CHI-TIET.md",
    "_doc_thuoc": "THUOC COC cho kho chu, KHONG phai tran ly tuong. Khong ke docs/adr/, docs/archive/, docs/migrations/ — ca ba la ban ghi viec DA XAY RA, chi to len duoc, nen tinh vao thi moi quyet dinh moi lam cong do va nguoi ta se noi con so cho xong. Ban trich mang san 1.456 dong; 2.200 la cho repo ban tu viet them. MOI LUOT XOA THI HA CON SO NAY XUONG — cho da ha khong quay lai duoc.",
    "tran_dong_khong_ke_adr": 2200
  },
  "backlog": {
    "_doc": "Tran so no. Cong dong phien DO khi so muc MO vuot tran. Khong khai khoi nay = khong co tran va cong van XANH — tuc so no phinh vo hinh. Doi con so phai hoi nguoi chot (ADR-0010).",
    "tran": 25
  },
  "budget": {
    "_doc_nap": "tokenNap = TRAN TOKEN cho phan MOI phien phai nap (AGENTS.md + STATUS.md). Day la con so DUY NHAT trong file nay nhan theo (so repo x so phien), nen no dat hon moi muc khac. Ban trich vua lap nap ~4.100 token, nen 6.000 cho ban ~31% bien — dung nguyen tac: KHONG nham dat nguong, ma phai o DUOI nguong 30-40%, vi he thong se phinh lai. Do bang DONG la do sai don vi: co luc bao 284/300 dong DAT trong khi that su la ~13.800 token. Do bang: npm run luat -- --nap",
    "tokenNap": 6000
  },
  "grandfathered": [],
  "_grandfathered_doc": "Đường dẫn cũ được miễn trừ vĩnh viễn. Repo mới để RỖNG. Repo cũ đang migrate thì liệt kê ở đây thay vì đổi tên hàng loạt.",
  "bootstrap": {
    "_doc": "Phép kiểm nào ĐÓNG CỔNG khi đỏ. Repo mới nên bắt đầu với danh sách RỖNG, chạy vài phiên cho sạch, rồi mới bật dần. Bật chặn khi đang đỏ là tự khoá repo.",
    "blocking": []
  },
  "luat": {
    "_doc": "Chủ đề của bộ luật. MỖI ADR khai đúng một \`chu_de\` ở đây, và mỗi chủ đề có đúng một ADR khai \`dau_moi: true\`. Nhờ vậy muốn biết luật về một chuyện thì mở ĐÚNG MỘT khối, không phải đọc bốn file rồi tự đoán cái nào thắng. Xem: npm run luat. Cưỡng chế: B16.",
    "_doc2": "THÊM chủ đề khi thật sự có một chuyện KHÁC HẲN cần luật riêng — đừng thêm cho mỗi ADR một chủ đề, làm thế là quay lại đúng chỗ cũ với thêm một lớp thủ tục. Chủ đề chưa khai mà ADR trỏ tới thì B16 ĐỎ, cố ý: một lỗi gõ không được lặng lẽ đẻ ra một nhóm mới.",
    "chu_de": {
      "ghi-quyet-dinh": "Cách ghi một quyết định"
    }
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

/* HAI SỔ MÀ LUẬT BẮT DÙNG — hạt giống, không phải file rỗng cho đủ mặt.
 *
 * VÌ SAO PHẢI ĐI THEO, đo được 05/09: luật trong khuôn bắt ghi việc ngoài phạm vi vào
 * `BACKLOG.md` (mục 0 bước 2) và quyết định của người chốt vào `decisions.md` (mục 7 bước 2) —
 * mà bản trích KHÔNG mang file nào trong hai. Nên repo dựng từ khuôn SINH RA ĐÃ MANG SẴN đúng
 * bệnh repo nhà mất bốn lượt mới vá xong: luật trỏ tới thứ không tồn tại.
 *
 * Hậu quả đã đo ở repo nhà, không suy: `what-next.mjs` đọc `BACKLOG.md` ở sáu chỗ, nên thiếu
 * file thì bản đồ việc báo "0 việc mở" VĨNH VIỄN — không phải hết việc, mà không có chỗ để việc
 * rơi vào. Và quyết định của người chốt thì chìm vào `HANDOFF.md`, nơi không ai đi tra quyết định.
 *
 * MANG THEO QUY ƯỚC SỔ, KHÔNG CHỈ MANG TIÊU ĐỀ. `what-next.mjs` phân tích cú pháp rất chặt —
 * sai một ký tự là mục biến mất khỏi bản đồ mà không báo gì. File rỗng không dạy được điều đó. */
const BACKLOG_SEED = `# BACKLOG — sổ nợ của repo

> **Luật mục 0 bước 2 bắt ghi vào đây:** việc phát sinh ngoài phạm vi phiên mình thì ghi lại,
> **không tự làm**. Thiếu file này thì luật trỏ vào khoảng không, và \`npm run what-next\` báo
> "0 việc mở" mãi mãi — không phải vì hết việc, mà vì việc không có chỗ rơi vào.

**Quy ước sổ — \`what-next.mjs\` đọc đúng ba thứ này, sai một ký tự là mục biến mất:**

- Nhóm ưu tiên: một dòng \`## P1\` … \`## P9\`. Mục nằm dưới nhóm nào ăn ưu tiên nhóm đó.
- Mỗi mục: \`### <MÃ>-<số> · <tiêu đề>\` — chọn một tiền tố mã cho repo này rồi giữ nguyên.
- Đóng một mục: **gạch ngang mã** — \`### ~~<MÃ>-1~~ · …\`. Giữ lại, đừng xoá: sổ còn dùng để
  tra lịch sử. Viết \`ĐÓNG\` mà quên gạch thì lệnh **nêu tên mục đó** là khai sai, không im lặng.
- Mục cần người chốt quyết: thêm một dòng **\`> **CHỜ NGƯỜI CHỐT:** <quyết gì>\`** trong thân mục.
  Bản đồ việc gom chúng vào mục C. **Phải khai tường minh** — một câu văn xuôi có chữ "chờ người
  chốt" KHÔNG được tính, cố ý: dò chữ trong văn xuôi thì đổi cách xưng hô một chữ là mục biến
  mất khỏi bảng, và không ai biết.

---

## P1

_(chưa có mục nào — phiên đầu tiên gặp việc ngoài phạm vi thì ghi vào đây)_
`;

const DECISIONS_SEED = `# QUYẾT ĐỊNH — người chốt đã chốt gì, ngày nào, vì sao

> **Luật mục 7 bước 2 bắt ghi vào đây.** Thiếu file này thì quyết định hoặc chìm trong
> \`HANDOFF.md\` (nơi không ai đi tra quyết định), hoặc bốc hơi.
>
> **Chỉ THÊM, không sửa mục cũ.** Đổi ý thì ghi mục mới trỏ ngược lại mục cũ — một quyết định bị
> sửa tại chỗ là một quyết định không ai truy được đã từng nói gì.
>
> **Quyết định có lập luận dài thì viết ADR** (\`docs/adr/\`), file này giữ một dòng trỏ sang.
> Đây là sổ tra nhanh, không phải nơi chứa lập luận.

---

## YYYY-MM-DD · <một câu nói rõ đã chốt gì>

**<Ai> chốt.** <Nội dung quyết định.>

**Vì sao:** <lý do — phần này quan trọng hơn phần trên, vì người sau đọc để biết quyết định còn
đúng không khi hoàn cảnh đổi.>

**Hệ quả trực tiếp:** <cái gì đổi ngay sau quyết định này.>
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
| \`scripts/check-bootstrap.mjs\` | máy | Cổng kiểm cấu trúc (dãy B) |
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
    "can-nang": "node scripts/can-nang.mjs",
    "don": "node scripts/don.mjs",
      // BỘ BIÊN DỊCH LUẬT. Phải khai, không chỉ để file nằm trong `scripts/`: mục 8 của luật
      // chung bảo "máy canh câu này", và một luật trỏ tới lệnh không gọi được thì nó là chữ.
      // Phép ghim `template-null-repo` bắt đúng chỗ này ngay lượt đầu.
      luat: "node scripts/rule-compiler.mjs",
      // BẢNG CHO NGƯỜI XEM. Không khai lệnh thì file nằm đó mà không ai chạy — và bảng là thứ
      // người chốt mở, không phải AI. Trang ghi ra `DASHBOARD-<tên-repo>.html` ở gốc repo, suy
      // từ `repo.name`; muốn tên khác thì khai `generated_names.overview`.
      overview: "node scripts/build-overview.mjs",
      /* BẢNG SỐNG. File có mà không khai lệnh thì trên thực tế tính năng đó KHÔNG tồn tại — đo
         được ở một repo đã lắp: có `scripts/session-check.mjs` mà thiếu `npm run gate`, nên cổng
         có mặt mà không ai gọi được bằng tên chuẩn. `features.mjs` bắt đúng ca đó. */
      "bang-song": "node bang-song/mot-luot.mjs",
      "bang-song:may-chu": "node bang-song/may-chu.mjs",
      /* DANH MỤC TÍNH NĂNG — lệnh phiên AI của repo này dùng để tự đo mình đang thiếu gì so với
         bộ khung. Không có lệnh thì không ai chạy, và checklist migrate quay về lời tự khai. */
      features: "node scripts/features.mjs",
      /* NHẬT KÝ — thước trần mỗi mục và nhịp xoay theo tháng. Bản trích phát `scripts/handoff.mjs`
         từ 1.3.58 mà QUÊN phát alias, nên repo mới nhận công cụ không ai gọi được bằng tên chuẩn
         — đúng ca `[~]` MỘT PHẦN mà danh mục cảnh báo, và nó sống cho tới khi vế chiều-ngược của
         `features-smoke` bắt được ở repo hạt giống (08/09). Đo được, không suy. */
      handoff: "node scripts/handoff.mjs",
      // KHÔNG ĐƯỢC BỎ. `session-check.mjs` hỏi `package.json.scripts.test`; không khai thì
      // `hasRootTestScript()` false VĨNH VIỄN và cổng đóng phiên không chạy một dòng test nào
      // của repo bạn. Thêm suite của bạn vào chuỗi này, đừng thay thế suite hạt giống.
      // `test` gọi bộ chạy SONG SONG; chuỗi thật nằm ở `test:tuan-tu` và bộ chạy đọc từ đó.
      // Repo đích nhận cả hai, nên nó có đường nhanh ngay từ ngày đầu — và vẫn còn đường tuần tự
      // để so khi nghi ngờ tranh chấp.
      test: "node scripts/chay-test.mjs",
      "test:tuan-tu": "node tests/harness-smoke.mjs && node tests/assistant-smoke.mjs && node tests/handoff-smoke.mjs && node tests/dau-suite-smoke.mjs && node tests/overview-doc-smoke.mjs && node tests/luu-do-smoke.mjs && node tests/khoa-file.mjs && node tests/cua-index.mjs && node tests/khoa-dau-vet.mjs && node tests/bang-song.mjs && node tests/features-smoke.mjs"
    }
  }, null, 2) + "\n";
}

/* ---- dựng danh sách file --------------------------------------------------- */

// Bản trích ĐI THEO phiên bản repo nhà. Trước đây nó tự nhận "0.1.0-unproven" trong khi repo
// đã ở 0.3.0 — hai con số cho cùng một thứ, và không ai biết tin cái nào. Nhãn `unproven`
// cũng hết đúng: bộ khung đã chạy thật trên hai repo khác nghề (Python và Node/chứng khoán).
export const TEMPLATE_VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).version;

/* HẠT GIỐNG SỔ BẰNG CHỨNG. Hiến pháp trỏ tới file này ở hai chỗ (đầu file và mục 8), nên bản
   trích BẮT BUỘC mang theo — bắt được 09/09 bởi chính phép kiểm "luật trỏ tới file bản trích
   không mang". Nội dung là KHUNG RỖNG có chủ đích: bằng chứng của repo NHÀ là sự cố của repo
   nhà, chép sang repo khác thì thành chữ vô nghĩa. Cái đáng mang đi là **thói quen tách lý lẽ
   ra khỏi luật**, vì đó là thứ giữ hiến pháp mỏng. */
const VI_SAO_SEED = `---
kind: guide
status: active
ttl_days: 365
---

# VÌ SAO có luật này — bằng chứng, và cách thêm một luật mới

> **File này KHÔNG phát biểu luật.** Luật ở \`AGENTS.md\`, một bản duy nhất. Đây là **sổ bằng
> chứng**: sự cố nào, ngày nào, đo được gì, đã mất gì — mở khi bạn định cãi một luật, hoặc khi
> bạn định thêm một luật mới.
>
> Tách ra khỏi \`AGENTS.md\` là cố ý: lý lẽ chỉ cần đọc **một lần trong đời**, lúc có người muốn
> đổi luật, còn luật thì MỌI phiên phải nạp. Trộn hai thứ là bắt mọi phiên trả tiền cho lý lẽ.

## Năm câu phải trả lời trước khi thêm một luật

1. **Đã có chuyện gì xảy ra thật chưa?** Chưa thì đừng thêm — viết vào \`BACKLOG.md\` và chờ.
2. **Nó thay chỗ cái nào?** Không thay được cái nào thì nói rõ vì sao đáng thêm hẳn.
3. **Dựng nổi ca hỏng cho nó không?** Không dựng nổi thì nó là chữ, không phải luật.
4. **Nó thuộc NHÓM nào?** Sáu nhà, xem \`AGENTS.md\` mục 8. **Máy canh câu này.**
5. **Nó có CHỦ NGỮ không, và nó phủ luật nào?** Luật thiếu chủ ngữ bị đọc ngược, và đã bị đọc
   ngược thật ít nhất một lần ở repo sinh ra bộ khung này.

## Bằng chứng của repo BẠN

Mỗi lần một luật ở \`AGENTS.md\` sinh ra hoặc đổi, ghi vào đây MỘT mục: luật nào · ngày nào · sự
cố gì · đo được gì · đã mất gì. Chưa có mục nào là bình thường — nghĩa là repo bạn chưa phải trả
giá lần nào.
`;

/* HẠT GIỐNG BẢN ĐỒ ĐẦY ĐỦ. Mục 6 của hiến pháp từng mang trọn phần văn xuôi này, và đo 09/09
   nó chiếm 2.193 / 5.225 token — 42% của BẢN TRÍCH: mọi repo đích nhận thêm 2k token nạp mỗi
   phiên chỉ để tra một hai file. Nay hiến pháp giữ bảng mỏng, phần *vì sao · có gì bên trong*
   nằm ở đây, và `.repo-structure.json` khai nó là bản đồ chính thức.
   HÀNG PHỤ LỤC NGHỀ CỐ Ý Ở LẠI `AGENTS.md`: `init-repo.mjs` xoá dòng trỏ tới phụ lục khi người
   dựng không giữ nó, và nó CHỈ soi `AGENTS.md`. Để hàng đó ở hai chỗ là để lại một liên kết chết. */
const BAN_DO_SEED = `---
kind: guide
status: active
ttl_days: 365
---

# Bản đồ file — bản ĐẦY ĐỦ

> **Đây là bản đồ file CHÍNH THỨC của repo bạn.** Cổng đóng phiên đối chiếu file mới với file
> này, nên **thêm file hay thư mục mới thì thêm một mục ở ĐÂY** — không khai = không tồn tại.
> \`AGENTS.md\` mục 6 chỉ giữ vài cửa hay dùng nhất.

### Hiểu bộ khung này gồm gì và dùng thế nào

[README.md](README.md)

### Khai trạng thái cho một đơn vị công việc

[STATUS.template.md](STATUS.template.md)

### Ghi một quyết định kiến trúc

bản mẫu [docs/_TEMPLATE-adr.md](docs/_TEMPLATE-adr.md) · luật [docs/adr/0000-…](docs/adr/0000-ghi-nhan-quyet-dinh-kien-truc.md)

### Tra nhanh người chốt đã chốt gì, ngày nào

[decisions.md](decisions.md) — sổ quyết định, **chỉ thêm**, luật mục 7 bắt ghi vào đây. Lập luận dài thì viết ADR, file này giữ một dòng trỏ sang

### Viết một tài liệu nghiên cứu

[docs/_TEMPLATE-study.md](docs/_TEMPLATE-study.md)

### Viết đề bài cho một phiên AI

[docs/_TEMPLATE-brief.md](docs/_TEMPLATE-brief.md)

### Sắp làm cùng lúc với AI khác, hoặc sắp SỬA một trong bốn cơ chế đa phiên

[docs/protocols/MULTIFLOW.md](docs/protocols/MULTIFLOW.md) — bốn cơ chế (bảng chủ sở hữu · nhãn \`Lane:\` · cổng đóng phiên · cổng xuất bản), một ngày làm việc 5 bước, **năm bất biến kèm lý do từng cái**, và quy trình đổi cơ chế có **đột biến kiểm bắt buộc**. Mục 1–3 viết cho người không code. **Cố ý không chứa số đo, không kiểm kê chốt, không bảng mã lỗi** — ba thứ đó khác nhau ở từng repo và mục nhanh hơn ai kịp sửa, nên nó chỉ đưa câu lệnh để tự đo

### Biết phiên trước làm tới đâu

[HANDOFF.md](HANDOFF.md) — đọc phần **cuối** file

### Biết repo đang nợ gì về cấu trúc

chạy \`npm run bootstrap\`

### Đến hạn bảo trì · repo im ắng lâu ngày · muốn biết repo đang NẶNG bao nhiêu

[docs/BAO-TRI-DINH-KY.md](docs/BAO-TRI-DINH-KY.md) — ba nhịp giữ repo đúng, cộng **nhịp DỌN** giữ repo rẻ. Đo bằng \`npm run can-nang\`; ngân sách khai được ở \`budget\` trong \`.repo-structure.json\`

### Mới vào, hoặc cần tra một thuật ngữ (gate · claim · lane · fail-closed…)

[docs/HUONG-DAN.md](docs/HUONG-DAN.md) — hai phần: cho người, và cho phiên AI; đọc trước mọi sổ tay khác · [docs/LEGEND.md](docs/LEGEND.md) — từ điển, thuật ngữ **giữ nguyên tiếng Anh** vì dịch sang tiếng Việt thì tra cứu mất

### Phát sinh việc ngoài phạm vi phiên mình — chỗ ghi nợ, luật mục 0 bắt

[BACKLOG.md](BACKLOG.md) — nhóm \`## P<n>\`, mỗi mục \`### <MÃ>-<số> · <tiêu đề>\`, đóng thì **gạch mã** chứ đừng xoá. \`npm run what-next\` đọc thẳng file này; sai quy ước một ký tự là mục biến mất khỏi bản đồ việc

### Sắp BÁO CÁO trạng thái cho người chốt — kiểm xem điều mình sắp nói có khớp nguồn thẩm quyền không

\`npm run state-check\` — **không phải cổng đóng phiên**: cổng kia hỏi "việc tôi làm đẩy được chưa", cái này hỏi "điều tôi sắp nói có đúng không". Ba mã thoát, cố ý không gộp: \`OK\` · \`MISMATCH\` · \`UNKNOWN\` — không đọc được thì nói KHÔNG BIẾT, không nói OK. **Chỉ đọc, không đòi khoá nào**

### Không biết làm gì tiếp, hoặc muốn biết việc nào chạy song song được ngay

\`npm run what-next\` — bản đồ việc, giao ba nguồn: bảng quyền × sổ nợ từng đơn vị × sổ ý tưởng. Luật song song nó cưỡng chế chỉ một câu: hai việc song song được **khi và chỉ khi** thuộc hai khoá khác nhau và cả hai đang trống. **Chỉ đọc, không đòi khoá nào**

### Là phiên ĐIỀU PHỐI: người chốt hỏi "đang có gì · làm gì tiếp · việc nào chạy song song được"

[docs/protocols/ORCHESTRATOR.md](docs/protocols/ORCHESTRATOR.md) — sổ tay vai điều phối: luật mở phiên, **hàng rào vai cứng** (vai này KHÔNG code, KHÔNG debug, KHÔNG đề xuất bản vá), luật nạp báo cáo năm mục, lối ra bàn giao cho executor. **Đọc khối cảnh báo ở đầu file trước**

### Một phép kiểm tự nhiên đỏ với người vừa clone mà xanh trên máy bạn

[.gitattributes](.gitattributes) — chốt kiểu xuống dòng cho CẢ repo, cả trong kho lẫn trong cây làm việc. Không có nó thì máy Windows tự đổi lúc lấy file ra, một commit có hai dạng byte, và \`git status\` nói SẠCH ở cả hai. Chốt một nửa — chỉ \`text=auto\` — thì kho sạch mà cây làm việc vẫn CRLF, tức bệnh còn nguyên

### Hiểu bộ khung tự kiểm mình bằng gì, hoặc thêm test của repo bạn

[tests/harness-smoke.mjs](tests/harness-smoke.mjs) — bốn khối hạt giống · [tests/assistant-smoke.mjs](tests/assistant-smoke.mjs) — phép ghim của hai lệnh trên, khối cuối tự dựng một repo hình dạng khác hẳn rồi chạy thật trong đó. Chạy cả hai bằng \`npm test\`

### Sắp THÊM một luật, hay muốn biết luật nào đang hiệu lực về một chủ đề

\`npm run luat\` — bộ biên dịch luật. Ba tầng: **sổ cái** (\`docs/adr/\` · \`decisions.md\` · kho lưu trữ — chỉ thêm, là LỊCH SỬ) → **bộ biên dịch** → **luật hiệu lực** (thứ một phiên thật sự đọc). Mỗi ADR khai \`chu_de\`, mỗi chủ đề đúng một \`dau_moi\`, nên mở một khối là ra câu trả lời chứ không phải đọc bốn file rồi tự đoán. \`--de-xuat\` NÊU chỗ đáng gộp. **AI được đề xuất, KHÔNG tự sửa hay xoá luật** — chỉ khai báo tường minh mới làm đổi bộ luật. Cưỡng chế ở B16
`;

export function buildTemplateFiles() {
  const files = new Map();
  for (const name of PORTABLE_SCRIPTS) files.set(`scripts/${name}`, read(`scripts/${name}`));
  for (const [from, to] of VERBATIM) files.set(to, genericize(to, read(from)));
  files.set("docs/adr/0000-ghi-nhan-quyet-dinh-kien-truc.md", ADR_SEED);
  files.set("docs/VI-SAO-LUAT.md", VI_SAO_SEED);
  files.set("docs/BAN-DO-CHI-TIET.md", BAN_DO_SEED);
  files.set("AGENTS.md", lawForTemplate());
  files.set("CLAUDE.md", CLAUDE_STUB);
  files.set(".repo-structure.json", STRUCTURE_SEED);
  files.set(".agents/claims.json", CLAIMS_SEED);
  files.set("HANDOFF.md", HANDOFF_SEED);
  files.set("BACKLOG.md", BACKLOG_SEED);
  files.set("decisions.md", DECISIONS_SEED);
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
/* TẦNG MÁY = THỨ CHẠY ĐƯỢC, không phải "hai thư mục tên là scripts và tests".
 *
 * Bản đầu liệt kê hai tiền tố thư mục, và nó SAI ngay lần đầu bộ khung mọc thêm một thư mục mã:
 * bản 1.3.26 thêm `bang-song/`, nên `upgrade.mjs` đẩy `tests/bang-song.mjs` sang repo đích mà
 * KHÔNG đẩy chính thứ phép ghim đó kiểm — suite của repo đích gãy ngay lượt chạy đầu, vì một lý
 * do không nói gì về nguyên nhân. Bắt được lúc đọc bản `--plan`, trước khi ghi.
 *
 * Sâu hơn: `bamBanTrich` cũng dùng hàm này, nên `bang-song/` không hề vào dấu vân tay bản phát —
 * tức sổ phát hành nói dối về nội dung của một bản đã phát.
 *
 * Nên định nghĩa theo ĐUÔI FILE, không theo tên thư mục: `.mjs` và `.cmd` là thứ chạy được, phần
 * còn lại (`.md` là chữ, `.json` là cấu hình) thì không. Quy tắc này tự đúng khi bộ khung mọc
 * thêm thư mục mã, chứ không đợi ai nhớ sửa một danh sách. */
export const DUOI_MAY = Object.freeze([".mjs", ".cmd"]);

/* DỮ LIỆU MÁY — cùng một lỗ, lần thứ ba, và lần này là một file `.json`.
 *
 * `features.json` KHÔNG chạy được, nên phép "theo đuôi file" ở trên loại nó ra — mà
 * `scripts/features.mjs` thì ĐỌC nó, và cả `npm run features` lẫn phép ghim của nó gãy nếu
 * thiếu. Đo 07/09: `--plan` ở một repo đã lắp kể `scripts/features.mjs` là THIẾU nhưng **không
 * kể `features.json`**, nên `--apply` gửi bộ đo tới mà không gửi thứ nó đo. Tính năng `F9.2`
 * của chính danh mục đó không bao giờ xanh được ở repo đích.
 *
 * Và sâu hơn, đúng như `bang-song/` hồi 1.3.26: `bamBanTrich` dùng hàm này, nên đổi nội dung
 * `features.json` mà không tăng phiên bản thì **sổ phát hành nói dối** về một bản đã phát.
 *
 * Danh sách này KHAI TAY, cố ý. Không có phép suy nào tách được "dữ liệu của bộ khung" khỏi
 * "cấu hình của repo đích" — `package.json` · `.repo-structure.json` · `.agents/claims.json`
 * cũng là `.json` trong bản trích, và ghi đè bất kỳ cái nào là xoá repo của người ta. Nên thà
 * một danh sách ngắn có phép ghim canh, hơn một quy tắc rộng đoán sai một lần là mất dữ liệu. */
export const TEP_MAY_THEM = Object.freeze(["features.json"]);

/* Ba file này là CỦA REPO ĐÍCH, không bao giờ được vào tầng máy. Phép ghim đọc danh sách này
   chứ không gõ lại tên — hai bản chép sẽ lệch. */
export const TEP_CUA_REPO_DICH = Object.freeze([
  "package.json", ".repo-structure.json", ".agents/claims.json"
]);

/* THỨ CHẠY ĐƯỢC MÀ KHÔNG CÓ ĐUÔI — cùng một lỗ, lần thứ TƯ, và lần này là một git hook.
 *
 * Quy tắc "theo đuôi file" ở trên tự đúng khi bộ khung mọc thêm THƯ MỤC mã. Nó KHÔNG tự đúng
 * khi bộ khung mọc thêm một file chạy được **không có đuôi** — và git hook thì bắt buộc phải
 * thế: git gọi đúng cái tên `commit-msg`, không gọi `commit-msg.mjs`.
 *
 * ĐO 10/09, ngay sau khi phát 1.8.9: `.githooks/commit-msg` có trong bản trích nhưng KHÔNG vào
 * `bamBanTrich`. Vô hiệu hoá hoàn toàn cửa index → dấu vân tay **không đổi một ký tự**. Tức sổ
 * phát hành nói dối về một bản đã phát, đúng câu đã viết cho `features.json` ở trên. Và hệ quả
 * thứ hai, đúng nguyên văn ca `bang-song/` 1.3.26: `upgrade --plan` kể `tests/cua-index.mjs` là
 * THIẾU mà không hề nhắc `.githooks/commit-msg` — repo đích nhận phép ghim, không nhận thứ nó
 * ghim, và suite bên đó chết `ENOENT` ngay lượt đầu. Dựng lại được cả hai.
 *
 * DÙNG QUY TẮC, KHÔNG DÙNG DANH SÁCH: `#!` ở hai byte đầu là lời tự khai *"tôi chạy được"* của
 * chính file. Một danh sách gõ tay thì đợi người sau nhớ, và ba lần trước đã cho thấy không ai
 * nhớ. Khác `TEP_MAY_THEM` cho `.json` — ở đó không có phép suy nào tách được dữ liệu bộ khung
 * khỏi cấu hình repo đích, nên phải khai tay. Ở đây có.
 *
 * `TEP_CUA_REPO_DICH` vẫn thắng: không file nào của repo đích được vào tầng máy, kể cả nếu một
 * ngày nào đó nó mọc ra dòng `#!`. */
export const laShebang = (noiDung) => String(noiDung ?? "").startsWith("#!");

export function fileMay(chuan) {
  return [...chuan.keys()].filter((rel) => {
    if (TEP_CUA_REPO_DICH.includes(rel)) return false;
    return DUOI_MAY.some((d) => rel.endsWith(d)) || TEP_MAY_THEM.includes(rel) || laShebang(chuan.get(rel));
  });
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
