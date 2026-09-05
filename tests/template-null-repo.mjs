
/* CONG CO BA TRANG THAI, KHONG PHAI HAI (tu 03/09):
 *   0 = xanh toan bo · 1 = co muc DO · 2 = khong muc nao do nhung co muc KHONG KIEM DUOC.
 * Fixture nay chay `--quick`, tuc co tinh khong chay suite — nen no LUON o trang thai 2.
 * Doi `status === 0` o day la doi cong noi doi. Dieu that su can ghim la: KHONG MUC NAO DO. */
function khongCoDo(result, thongDiep) {
  assert.notEqual(result.status, 1, thongDiep + String.fromCharCode(10) + result.out);
  assert.ok(!result.out.includes("[ĐỎ"), thongDiep + String.fromCharCode(10) + result.out);
}
/* PHÉP THỬ REPO RỖNG — tiêu chí nghiệm thu của bộ trích template.
 *
 * Dựng một repo git **trống hoàn toàn**, thả bộ khung vào, làm đúng những gì README bảo làm,
 * rồi chạy cổng kiểm cấu trúc. **Không được có chỗ ĐỎ nào.**
 *
 * Vì sao phép thử này quan trọng hơn nó trông có vẻ: nó bắt kiểu hỏng mà mọi phép kiểm khác
 * đều mù — **template THIẾU thứ gì đó**. Chạy cổng trong repo gốc thì mọi thứ đều xanh, vì
 * repo gốc có đủ mọi file; chỉ khi bê bộ khung sang một chỗ trống mới lộ ra cái gì không đi
 * theo. Đo thật: bản trích đầu tiên đỏ B1 (quên `STATUS.md` cho gốc repo) và vàng B6 ở 4 chỗ
 * (bản đồ mục 6 để rỗng nên chính `README.md` cũng nằm ngoài đường điều hướng). Cả hai đều
 * KHÔNG thể phát hiện được từ trong repo gốc.
 *
 * Cặp đôi của nó là phép thử ngược — bộ máy cũ và mới sinh ra bảng giống hệt từng byte — bắt
 * kiểu hỏng ngược lại: **trích ra làm MẤT thứ gì đó**. Thiếu một trong hai là hụt.
 */

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildTemplateFiles, leakedNames, soleHeadingIndex, stripNghe, TEMPLATE_VERSION } from "../scripts/build-template.mjs";

let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };

const files = buildTemplateFiles();

/* Dựng repo thật có origin/main để các fixture của cổng đo được cả commit chưa push. Mỗi ca
   dùng một repo + bare remote riêng; không mượn trạng thái Git của repo đang chạy suite. */
function withGateRepo({ area = "evidence/", oldFile = null, declared = [] }, body) {
  const tempRoot = mkdtempSync(join(tmpdir(), "khoi-a-gate-"));
  const bare = mkdtempSync(join(tmpdir(), "khoi-a-bare-"));
  const label = "khoi-a-fixture";
  try {
    const fixture = new Map(files);
    const structure = JSON.parse(fixture.get(".repo-structure.json"));
    if (!structure.areas[area]) {
      structure.areas[area] = {
        steward: "_root", mutability: "append-only", ownership_mode: "root", note: "fixture"
      };
    }
    fixture.set(".repo-structure.json", JSON.stringify(structure, null, 2) + "\n");

    const claims = JSON.parse(fixture.get(".agents/claims.json"));
    claims.claims._root.owner = label;
    claims.claims._root.task = "fixture Khoi A";
    fixture.set(".agents/claims.json", JSON.stringify(claims, null, 2) + "\n");

    if (declared.length) {
      const rows = declared.map((rel) => `| Fixture Khoi A | \`${rel}\` |`).join("\n");
      fixture.set("AGENTS.md", fixture.get("AGENTS.md").replace("\n## 7.", `\n${rows}\n\n## 7.`));
    }
    for (const [rel, content] of fixture) {
      const abs = join(tempRoot, ...rel.split("/"));
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, content, "utf8");
    }
    if (oldFile) {
      const abs = join(tempRoot, ...oldFile.split("/"));
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, "ban goc\n", "utf8");
    }

    const gitAt = (...args) => execFileSync("git", ["-c", "core.quotepath=false", ...args], { cwd: tempRoot, encoding: "utf8" });
    gitAt("init", "-q", "-b", "main");
    gitAt("config", "user.name", "Khoi A Fixture");
    gitAt("config", "user.email", "khoi-a@example.invalid");
    gitAt("config", "core.autocrlf", "false");
    gitAt("add", ".");
    gitAt("commit", "-q", "-m", "baseline fixture");
    execFileSync(process.execPath, [join(tempRoot, "scripts", "build-dashboard.mjs")], { cwd: tempRoot, encoding: "utf8" });
    gitAt("add", "DASHBOARD.md", "llms.txt", "repo-map.json");
    gitAt("commit", "-q", "-m", "baseline generated artifacts");
    execFileSync("git", ["init", "-q", "--bare", "-b", "main", bare], { encoding: "utf8" });
    gitAt("remote", "add", "origin", bare);
    gitAt("push", "-q", "-u", "origin", "main");

    const runGate = () => {
      const result = spawnSync(process.execPath,
        [join(tempRoot, "scripts", "session-check.mjs"), "--as", label, "--quick"],
        { cwd: tempRoot, encoding: "utf8" });
      return { status: result.status, out: String(result.stdout || "") + String(result.stderr || "") };
    };
    body({ tempRoot, gitAt, runGate, label });
  } finally {
    assert.ok(tempRoot.startsWith(join(tmpdir(), "khoi-a-gate-")), "chi don repo fixture Khoi A");
    assert.ok(bare.startsWith(join(tmpdir(), "khoi-a-bare-")), "chi don bare fixture Khoi A");
    rmSync(tempRoot, { recursive: true, force: true });
    rmSync(bare, { recursive: true, force: true });
  }
}

/* ---- 1. Không mang tên riêng của repo gốc -------------------------------- */
{
  const leaks = leakedNames(files);
  assert.deepEqual(leaks, [], `template mang ten rieng cua repo goc: ${JSON.stringify(leaks)}`);

  // MẪU ĐỐI CHỨNG DƯƠNG — bắt buộc. Không có nó thì phép kiểm trên RỖNG NGHĨA: template hiện
  // đã sạch, nên "không thấy gì" đúng ở cả hai chiều, và một đột biến xoá sạch danh sách mẫu
  // dò vẫn thoát. Đo thật: đột biến đó ĐÃ thoát ở bản đầu của phép kiểm này.
  // TRỒNG ĐỦ BỐN MẪU, không chỉ một. Bản trước chỉ trồng `duc-auto`, nên ba mẫu còn lại
  // (`gg-flow`, tên repo gốc, `extension-observer`) CHƯA TỪNG được chứng minh là bắt được: một
  // đột biến xoá riêng chúng khỏi danh sách sẽ thoát sạch. Phiên K1 chỉ ra 02/09, mục (a) của
  // brief. Bài học lặp lại: đối chứng dương phải phủ TỪNG phần tử của bộ dò, không phủ "một cái
  // đại diện" — một cái đại diện chỉ chứng minh đúng cái đó.
  // Mỗi mẫu một chuỗi trồng RIÊNG, và chuỗi đó chỉ được khớp ĐÚNG mẫu đang thử. Bản đầu của
  // chính đối chứng này trồng "workers/duc-auto-gg-flow-video" — khớp CẢ HAI mẫu một lúc, nên
  // nó đếm ra 2 và không chứng minh được mẫu nào cả. Đúng bệnh nó đang đi chữa.
  const MAU_PHAI_BAT = [
    ["gia/mot.md", "duong dan workers/duc-auto-gemini/v0.2.0 lot vao", "duc-auto"],
    ["gia/hai.md", "nhac nhanh gg-flow-video trong van", "gg-flow"],
    ["gia/ba.md", "duong dan C:/X/Chrome_Extension_AI_Agentic/y", "Chrome_Extension_AI_Agentic"],
    ["gia/bon.md", "nhac goi extension-observer o day", "extension-observer"]
  ];
  for (const [file, text, expected] of MAU_PHAI_BAT) {
    const hits = leakedNames(new Map([[file, text], ["gia/sach.md", "khong co gi dang ngo"]]));
    assert.equal(hits.length, 1, `bo do phai bat DUNG MOT lan ten cam trong ${file}, dang bat ${hits.length}`);
    assert.equal(hits[0].file, file, `phai chi dung file co ten cam, khong bao oan ${hits[0].file}`);
    assert.equal(hits[0].found.toLowerCase(), expected.toLowerCase(),
      `phai bat dung mau "${expected}", dang bat "${hits[0].found}"`);
  }
  const planted = leakedNames(new Map([
    ["gia/mot.md", "duong dan workers/duc-auto-gemini/v0.2.0 lot vao"],
    ["gia/hai.md", "khong co gi dang ngo"]
  ]));
  assert.equal(planted.length, 1, "bo do phai bat duoc ten du an cam khi co that");
  assert.equal(planted[0].file, "gia/mot.md", "phai chi dung file co ten cam");
  ok(`bo khung ${TEMPLATE_VERSION} khong mang ten rieng cua repo goc (${files.size} file), va bo do co that su bat duoc`);
}

/* ---- 2. KHÔNG mang theo tầng GENERATED ----------------------------------- */
{
  // Chép trang máy sinh sang repo khác là làm MỌI repo cùng hiển thị trạng thái của repo gốc.
  // Đây là kiểu hỏng tệ nhất vì nó im lặng: bảng vẫn đẹp, chỉ có điều nói về repo khác.
  for (const forbidden of ["DASHBOARD.md", "llms.txt", "repo-map.json", "FEATURE-PARITY.md"]) {
    assert.ok(!files.has(forbidden),
      `${forbidden} thuoc tang GENERATED — bo SINH thi di theo, san pham cua no thi KHONG`);
  }
  // Và cũng không mang bằng chứng của repo gốc. SOI CẢ BA HÌNH DẠNG, không chỉ `evidence/`:
  // luật vùng bằng chứng của repo (AGENTS.md mục 4) gồm `pilot-*` · `Pilot-*` · `Batch-*` nữa,
  // nên chỉ soi một tiền tố là bỏ sót hai hình dạng còn lại. Phiên K1 chỉ ra 02/09, mục (b).
  const VUNG_BANG_CHUNG = /^(evidence|pilots?|pilot-|Pilot-|Batch-|batch-)/;
  for (const rel of files.keys()) {
    assert.ok(!VUNG_BANG_CHUNG.test(rel), `${rel}: bang chung cua repo nao la cua repo do`);
  }
  // Đối chứng dương cho chính bộ dò trên — không có nó thì phép kiểm rỗng nghĩa y như mục 1.
  for (const gia of ["evidence/x.md", "pilots/v0/x.md", "pilot-07/x.md", "Pilot-07/x.md", "Batch-01/x.md"]) {
    assert.ok(VUNG_BANG_CHUNG.test(gia), `bo do phai coi ${gia} la vung bang chung`);
  }
  assert.ok(!VUNG_BANG_CHUNG.test("docs/pilot-ghi-chu.md"), "khong duoc bao oan file chi NHAC chu pilot o giua duong dan");
  ok("khong mang theo trang may sinh, khong mang theo bang chung");
}

/* ---- 2b0. BẢN TRÍCH PHẢI KHAI ĐỦ LỆNH, không chỉ mang đủ file ------------- */
/* Đo thật 05/09, và đây là ca hỏng đã dựng được TRƯỚC khi viết phép kiểm này: bỏ một **script**
   khỏi bản trích thì cổng đỏ (dấu vân tay tầng máy đổi → sổ phát hành bắt). Bỏ một **dòng khai
   lệnh** trong `package.json` mà bản trích sinh ra thì KHÔNG cổng nào đỏ — `--check` vẫn nói
   *khớp bản gốc*, sổ phát hành vẫn khớp, `npm test` vẫn xanh toàn bộ. Repo mới dựng từ khuôn
   im lặng thôi chạy nguyên một suite, và người dựng repo đó không có cách nào biết.

   Ba vế, cả ba SUY TỪ chính bản trích chứ không gõ sẵn danh sách. Gõ sẵn là thêm một chỗ phải
   nhớ cập nhật, mà chỗ nào phải nhớ thì chỗ đó sẽ quên — đúng cái bệnh đang đi chữa. */
{
  const pkg = JSON.parse(files.get("package.json"));
  const lenh = pkg.scripts || {};

  // (1) Suite nào bản trích MANG THEO thì chuỗi `test` phải GỌI nó. Đây là lỗ đã đo được.
  const suite = [...files.keys()].filter((f) => f.startsWith("tests/") && f.endsWith(".mjs"));
  assert.ok(suite.length > 0, "ban trich khong mang mot suite nao — phep kiem nay mat doi tuong, sua no dung cach");
  for (const f of suite) {
    assert.ok(String(lenh.test || "").includes(f),
      "ban trich mang `" + f + "` nhung chuoi `test` khong goi no — repo moi se IM LANG thoi chay suite do");
  }

  // (2) Chiều ngược lại: lệnh trỏ tới file nào thì file đó phải có mặt. Không có vế này thì
  // khai một lệnh trỏ vào hư không vẫn xanh, và repo mới chết ở `Cannot find module`.
  const troToi = [...new Set(Object.values(lenh).join(" ").match(/(?:scripts|tests)\/[A-Za-z0-9._-]+\.mjs/g) || [])];
  assert.ok(troToi.length > 0, "khong doc ra duoc duong dan nao tu khoi `scripts` — mau do da hong");
  for (const f of troToi) {
    assert.ok(files.has(f), "lenh trong `package.json` tro toi `" + f + "` ma ban trich khong mang file do");
  }

  // (3) Tài liệu ĐI THEO bản trích dạy chạy `npm run X` thì X phải là một lệnh đã khai.
  // Luật trỏ tới một lệnh không chạy được thì nó không phải luật, nó là chữ — cùng câu đã viết
  // cho `claim.mjs` trong `PORTABLE_SCRIPTS`. Vế này bắt được một chỗ có thật ngay lượt đầu:
  // mục 8 của luật dạy đo cân nặng bằng một lệnh mà bản trích không mang theo.
  for (const [rel, text] of files) {
    if (!rel.endsWith(".md")) continue;
    for (const m of text.match(/npm run [a-z][a-z0-9-]*/g) || []) {
      const ten = m.slice("npm run ".length);
      assert.ok(Object.prototype.hasOwnProperty.call(lenh, ten),
        rel + " day chay `" + m + "` nhung ban trich KHONG khai lenh do");
    }
  }
  ok("ban trich khai du lenh: " + suite.length + " suite deu nam trong chuoi `test`, "
    + troToi.length + " duong dan lenh deu co file, moi `npm run` trong tai lieu deu duoc khai");
}


/* ---- 2b1. SỔ TAY VAI ĐIỀU PHỐI không mang định danh của repo nào --------- */
/* Từ bản 1.3.0 sổ tay này ĐI THEO bản trích, nên nó ra tới repo khác. Cổng `leakedNames` ở
   mục 1 chỉ canh BỐN tên dự án gốc — nó KHÔNG canh mã việc, KHÔNG canh tên khoá vùng, KHÔNG
   canh tên riêng của người chốt. Ba thứ đó đúng là ba thứ đã phải bóc tay lúc port sổ này
   sang, và là ba thứ dễ lẻn về nhất ở lượt sửa sau: sửa một câu, tiện tay đưa lại một ví dụ
   có số hiệu.

   ĐỌC CẢ HAI BẢN, cố ý. Bản trong khuôn (`files`) là bản THẬT SỰ ra ngoài — nó đi qua một
   lượt thay chuỗi, nên "bản nhà sạch" không tự nó kéo theo "bản phát đi sạch". Bản nhà đọc
   thẳng từ đĩa, vì đó là bản người ta sửa.

   Phép ghim này ĐẶT Ở ĐÂY chứ không đặt trong suite đi theo bản trích, và đây là quyết định
   chứ không phải tiện tay. Hai lý do. Một: luật "không được nhắc tên khoá vùng" là luật của
   NGƯỜI PHÁT HÀNH — ở một repo dựng từ khuôn, viết `_root` vào sổ tay của chính nó là việc
   ĐÚNG, nên bê phép kiểm này xuống đó là phát đi một luật sai chỗ, và việc đầu tiên repo mới
   làm sẽ là xoá nó. Hai: mọi file trong bản trích dưới `scripts/` và `tests/` đều tính vào
   dấu vân tay bản phát, nên sửa một suite ĐI THEO là buộc phải cắt bản mới. */
{
  const banSoTay = [];
  const relSoTay = "docs/protocols/ORCHESTRATOR.md";
  if (files.has(relSoTay)) banSoTay.push(["bản trong khuôn", files.get(relSoTay)]);
  banSoTay.push(["bản ở repo nhà", readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", relSoTay), "utf8")]);

  // Bỏ khối chú thích HTML TRƯỚC KHI dò. Chú thích là chỗ giải thích VÌ SAO đã bỏ, nên nó bắt
  // buộc phải nhắc lại chuỗi bị cấm; dò cả chú thích thì phép kiểm này chỉ dạy người ta xoá
  // lời giải thích. Vế thứ hai bên dưới canh rằng nhánh miễn trừ này THẬT SỰ chạy tới được.
  const CHU_THICH_HTML = /<!--[\s\S]*?-->/g;

  // Biên chữ TỰ VIẾT, không dùng `\b`. `\b` dựa trên [A-Za-z0-9_], nên cạnh một chữ có dấu
  // (Đ, ế…) không có biên nào và mẫu khớp RỖNG mà im lặng — bẫy đã cắn hai lần trong một giờ.
  const MA_VIEC = /(^|[^A-Za-z0-9])[A-Z]-\d+([^A-Za-z0-9]|$)/;

  // CỐ Ý KHÔNG dò TÊN DỰ ÁN ở đây. Mục 1 đã dò, và nó chạy trước — đo thật: trồng một tên gói
  // của repo gốc vào sổ tay thì mục 1 đỏ, phép kiểm này chưa kịp chạy tới. Chép lại danh sách
  // đó vào đây là ba dòng KHÔNG BAO GIỜ đỏ được, tức ba dòng chỉ tốn công đọc ở mọi lượt sau.
  // Chỗ này canh ĐÚNG cái mục 1 bỏ trống: mã việc, mã defect, tên khoá vùng, tên người chốt.
  const CAM = [
    [MA_VIEC, "ma viec dang chu-gach-so"],
    [/[A-Z]+-DRIFT-\d+/i, "ma defect cua repo goc"]
  ];

  assert.ok(banSoTay.length === 2, "phai doc duoc CA HAI ban so tay — thieu mot ban la mat nua doi tuong");
  for (const [ten, text] of banSoTay) {
    const ma = text.replace(CHU_THICH_HTML, "");
    for (const [mau, vi] of CAM) {
      const moc = ma.match(mau);
      assert.ok(!moc, ten + " con " + vi + ": " + (moc && moc[0].trim()));
    }
    for (const khoa of ["_root", "_docs", "_code", "_template"]) {
      assert.ok(!ma.includes(khoa),
        ten + " con dong cung ten khoa vung `" + khoa + "` — repo khac khai vung khac, ten do tro vao hu khong");
    }
    assert.ok(!ma.includes("Đức"), ten + " con ten rieng cua nguoi chot — tai lieu phai dung tu chi vai");

    // NHÁNH BỎ CHÚ THÍCH KHÔNG ĐƯỢC LÀ ĐỒ TRANG TRÍ. Đo thật lúc dựng nguyên mẫu: bỏ HẲN
    // nhánh đó đi mà phép kiểm vẫn XANH — tức nó chưa bao giờ chạy tới, vì chú thích vô tình
    // né hết chuỗi cấm. Một nhánh miễn trừ không chứng minh được là có tác dụng thì nó không
    // phải miễn trừ, nó là chữ.
    const khoi = text.match(CHU_THICH_HTML) || [];
    assert.ok(khoi.length > 0, ten + " khong con khoi chu thich giai thich vi sao da bo dinh danh");
    assert.ok(khoi.some((c) => c.includes("_root") && MA_VIEC.test(c)),
      ten + " chu thich thoi khong chua chuoi bi cam — nhanh bo chu thich thanh do trang tri");
  }
  ok("so tay vai dieu phoi khong mang ma viec / ten khoa vung / ten nguoi chot — ca ban trong khuon lan ban o repo nha");
}
/* ---- 2b. Mốc cắt mục 6 phải là TIÊU ĐỀ THẬT và DUY NHẤT ------------------ */
/* Phiên K1 chỉ ra 02/09, mục (d). Bản cũ dùng `indexOf("\n## 6.")` — lấy lần khớp ĐẦU TIÊN,
   không kiểm gì. Một dòng văn hay khối trích dẫn nhắc `## 6.` nằm TRƯỚC tiêu đề thật là cắt
   sai, và cắt sai ÂM THẦM: bộ trích vẫn sinh ra `AGENTS.md`, chỉ là mất một phần mục 5. */
{
  const f = soleHeadingIndex;

  // Chỉ nhận dòng BẮT ĐẦU bằng mốc. Nhắc trong trích dẫn hay giữa câu thì không tính.
  const trichDan = "# Luat\n\n> muc `## 6.` noi rang ...\n\nvan xuoi nhac ## 6. o giua cau\n\n## 6. So tay\n\nthan\n";
  const hit = f(trichDan, "## 6.");
  assert.equal(hit.hits.length, 1, "chi duoc tinh dong BAT DAU bang moc, khong tinh nhac trong trich dan hay giua cau");
  assert.equal(trichDan.slice(hit.index, hit.index + 12), "## 6. So tay", "phai tro dung tieu de THAT");

  // ĐÂY LÀ CA HỎNG: hai tiêu đề thật thì FAIL CLOSED, không âm thầm chọn cái đầu.
  assert.throws(() => f("## 6. Mot\n\nthan\n\n## 6. Hai\n", "## 6."), /TRICH_HONG/,
    "hai moc that thi phai NEM, khong duoc tu chon cai dau roi cat sai");
  // Và thông báo phải nói SỐ DÒNG, để người sửa biết đi đâu — tiêu chí nghiệm thu của Đức.
  try {
    f("## 6. Mot\n\nthan\n\n## 6. Hai\n", "## 6.");
    assert.fail("phai nem");
  } catch (error) {
    assert.match(error.message, /dòng 1, 5/, "phai chi dung so dong cua tung moc: " + error.message);
  }

  assert.equal(f("khong co moc nao\n", "## 6.").index, -1, "khong co moc thi tra -1, de ben goi tu bao loi");

  // Và trên AGENTS.md THẬT: mỗi mốc đúng một dòng. Nếu repo này vi phạm thì bộ trích phải đỏ
  // ở đây trước khi nó kịp sinh ra một bản trích bị cắt sai.
  const luatThat = readFileSync(new URL("../AGENTS.md", import.meta.url), "utf8");
  for (const moc of ["## 6.", "## 7."]) {
    assert.equal(f(luatThat, moc).hits.length, 1, `AGENTS.md that phai co DUNG MOT dong bat dau bang \`${moc}\``);
  }
  ok("moc cat muc 6 la tieu de THAT va DUY NHAT; hai moc thi FAIL CLOSED kem so dong");
}

/* ---- 2c. Luật CHUNG không được mang từ vựng của một NGHỀ ------------------ */
/* Ba tầng: luật chung (mọi repo) · phụ lục nghề (bật khi cần) · bản đồ địa phương (mục 6, vốn
   đã cắt). Trước K1, bản trích mang cả chín dòng chỉ đúng với repo lái trình duyệt — nên một
   repo tài liệu dựng từ bộ khung sẽ nhận luật về selector DOM và lệnh cấm gán `.innerHTML`.
   Đúng với repo gốc, vô nghĩa với nó. */
{
  const NGHE_TU_VUNG = /selector|dom_probe|innerHTML|outerHTML|insertAdjacentHTML|Bridge|pilot-|Pilot-|Batch-|trang thật/;

  const luatTrich = files.get("AGENTS.md");
  assert.ok(luatTrich, "ban trich phai co AGENTS.md");
  const dinh = luatTrich.split("\n").filter((d) => NGHE_TU_VUNG.test(d));
  assert.deepEqual(dinh, [], "luat CHUNG cua ban trich con mang tu vung nghe:\n" + dinh.join("\n"));

  // ĐỐI CHỨNG DƯƠNG — bắt buộc, nếu không phép kiểm trên rỗng nghĩa: một bộ dò hỏng (regex sai,
  // hay biến rỗng) cũng cho "khong thay gi". AGENTS.md THẬT của repo này PHẢI khớp, vì repo này
  // đúng là repo lái trình duyệt và luật của nó nói đúng chuyện đó.
  const luatGoc = readFileSync(new URL("../AGENTS.md", import.meta.url), "utf8");
  const dinhGoc = luatGoc.split("\n").filter((d) => NGHE_TU_VUNG.test(d));

  // PHẢI CHẠY ĐÚNG Ở CẢ HAI NHÀ. Ở repo sinh ra bộ khung, luật còn mùi nghề nên chính nó là đối
  // chứng dương tốt nhất. Ở REPO NHÀ của bộ khung, luật vốn đã ở dạng chung — và một phép kiểm
  // đòi "luật phải có từ vựng nghề" sẽ ĐỎ ở đúng cái repo làm mọi thứ đúng nhất. Đo được ngay
  // lần chạy đầu sau khi chuyển nhà.
  if (dinhGoc.length > 0) {
    assert.ok(dinhGoc.length >= 5,
      `luat repo nay con mui nghe thi phai bat duoc nhieu dong, dang bat ${dinhGoc.length}`);
  } else {
    // Luật đã chung: đối chứng dương phải TRỒNG, không mượn được từ repo.
    assert.ok(NGHE_TU_VUNG.test("- Khong bao gio gan `.innerHTML` cho node nao."),
      "bo do phai bat duoc tu vung nghe khi co that");
    assert.ok(!NGHE_TU_VUNG.test("- Moi fix mot test ghim."),
      "bo do khong duoc bao oan mot dong luat chung");
  }
  // TÁCH KHÔNG PHẢI VỨT. Chín dòng đó phải hạ cánh nguyên vẹn ở phụ lục, nếu không bộ khung
  // im lặng đánh mất chín bài học đã trả giá.
  const phuLuc = files.get("docs/ANNEX-tu-dong-hoa-trinh-duyet.md");
  assert.ok(phuLuc, "tach luat nghe ra thi phai co file phu luc de no ha canh");
  for (const tu of ["selector", "dom_probe", "innerHTML", "Bridge", "pilot-", "trang thật"]) {
    assert.ok(phuLuc.includes(tu), `phu luc phai giu lai "${tu}" — tach la CHUYEN CHO, khong phai vut`);
  }
  assert.ok(files.has("docs/_TEMPLATE-annex.md"), "phai co ban mau de repo khac tu viet phu luc nghe cua minh");

  // Và mục 2 không được nói dối: tiêu đề cũ là "Ba việc" với đúng ba mục; thay hai mục mà giữ
  // nguyên tiêu đề là để lại một câu sai trong chính hiến pháp.
  assert.doesNotMatch(luatTrich, /## 2\. Ba việc/,
    "muc 2 khong con ba muc thi tieu de khong duoc noi 'Ba viec'");
  ok(`luat chung sach tu vung nghe (${dinhGoc.length} dong nhu the o ban goc, deu chuyen sang phu luc)`);
}

/* ---- 2d. Tách luật-nghề: được ăn cả, ngã về không ------------------------ */
/* Ba ca, và ca giữa là ca mà bộ khung phải sống được để có nhà riêng: khi bộ trích chạy ở REPO
   NHÀ của chính nó, luật nguồn VỐN ĐÃ ở dạng chung nên không phép thay nào khớp. Bản đầu ném
   ngay ở phép thay đầu tiên — tức bộ khung không tự trích lại được chính nó. */
{
  const luatGoc = readFileSync(new URL("../AGENTS.md", import.meta.url), "utf8");

  // ① Luật nguồn phải tách được — dù còn mùi nghề (repo gốc) hay đã chung (repo nhà).
  assert.doesNotThrow(() => stripNghe(luatGoc), "luat nguon phai tach duoc, o ca hai nha");
  const daChung = stripNghe(luatGoc);
  // Chỉ soi PHẦN LUẬT CHUNG: mục 6 là bản đồ địa phương, bị cắt ở bước sau, nên từ vựng nghề
  // trong đó không tính. Bản đầu soi cả file và báo động nhầm 4 dòng — tất cả đều ở mục 6.
  const phanChung = daChung.split("## 6.")[0] + (daChung.split("## 7.")[1] || "");
  assert.ok(!/selector|dom_probe|innerHTML/.test(phanChung),
    "tach xong thi phan luat chung phai sach tu vung nghe");
  assert.doesNotThrow(() => stripNghe(daChung), "luat da o dang chung thi tach lai phai la khong-lam-gi");
  assert.equal(stripNghe(daChung), daChung, "tach lan hai khong duoc doi mot ky tu nao");

  // ③ Luật ĐỔI LỜI: cũng khớp 0 lần, nhưng vẫn còn từ vựng nghề → PHẢI ném. Hai ca ② và ③ trông
  // giống hệt nhau từ phía bảng thay; phân biệt bằng bằng chứng, không bằng đoán.
  const doiLoi = daChung + String.fromCharCode(10) + "- Khong bao gio gan `.innerHTML` cho node nao." + String.fromCharCode(10);
  assert.throws(() => stripNghe(doiLoi), /TRICH_HONG/,
    "con tu vung nghe ma khong phep thay nao khop thi phai NEM");

  // A4: dựng đúng ca mà regex hữu hạn cũ KHÔNG THỂ thấy — một luật nghề mới không chứa bất kỳ
  // từ nào trong danh sách selector/Bridge/pilot/DOM. Dấu vân tay toàn phần vẫn phải bắt nó.
  const ngheNgoaiTuVung = daChung + String.fromCharCode(10)
    + "- Moi ban ve ket cau phai duoc kien truc su ky xac nhan." + String.fromCharCode(10);
  assert.throws(() => stripNghe(ngheNgoaiTuVung), /TRICH_HONG/,
    "luat nghe dung tu NGOAI danh sach van phai NEM, khong duoc lot sang moi repo");
  ok("tách luật-nghề: tách được · tách lại không đổi · mọi luật lạ ngoài Mục 6 đều bị chặn");
}

/* ---- 2e. Khối A: ba fixture Git thật cho cổng đóng phiên ------------------- */
{
  // A1 — file evidence cũ bị sửa rồi COMMIT. `git status` lúc này sạch; chỉ phép so với
  // origin/main mới dựng nổi ca hỏng đã xác nhận trong roadmap.
  withGateRepo({ oldFile: "evidence/old.txt" }, ({ tempRoot, gitAt, runGate, label }) => {
    writeFileSync(join(tempRoot, "evidence", "old.txt"), "da bi sua va commit\n", "utf8");
    gitAt("add", "evidence/old.txt");
    gitAt("commit", "-q", "-m", `pha evidence da commit\n\nLane: ${label}`);
    const result = runGate();
    assert.notEqual(result.status, 0, "A1: sua evidence da commit phai lam cong DO");
    assert.match(result.out, /Sửa\/xoá bằng chứng vận hành: evidence\/old\.txt/,
      "A1: cong phai chi dung file evidence cu da commit");
  });

  // Đối chứng: thêm file mới trong cùng vùng append-only là hợp lệ. Khai chính đường dẫn trong
  // bản đồ từ baseline để phép A3 không che kết quả của phép evidence.
  withGateRepo({ declared: ["evidence/new.txt"] }, ({ tempRoot, runGate }) => {
    mkdirSync(join(tempRoot, "evidence"), { recursive: true });
    writeFileSync(join(tempRoot, "evidence", "new.txt"), "them moi\n", "utf8");
    // Ghi Log — vi tu 03/09 cong doi MOI phien cham vung goc phai them mot dong vao HANDOFF.md.
    // Truoc do luat nay chi ap cho package, nen repo khong co package con thi khong bao gio bi
    // cuong che. Fixture cu khong ghi Log; do la fixture thieu thuc te, khong phai cong qua chat.
    appendFileSync(join(tempRoot, "HANDOFF.md"), "- them evidence moi" + String.fromCharCode(10), "utf8");
    const result = runGate();
    khongCoDo(result, "them evidence moi da khai phai duoc phep:\n");
    assert.match(result.out, /\[XANH\] Vùng bằng chứng không bị sửa/,
      "doi chung A1 phai di qua nhanh XANH cua chinh gate evidence");
  });

  // A2 — tên `records/` không có trong regex cũ. Chỉ cấu hình mutability mới nói đây là vùng
  // append-only; sửa file cũ rồi commit phải bị bắt y như evidence/.
  withGateRepo({ area: "records/", oldFile: "records/old.txt" }, ({ tempRoot, gitAt, runGate, label }) => {
    writeFileSync(join(tempRoot, "records", "old.txt"), "da bi sua va commit\n", "utf8");
    gitAt("add", "records/old.txt");
    gitAt("commit", "-q", "-m", `pha records da commit\n\nLane: ${label}`);
    const result = runGate();
    assert.notEqual(result.status, 0, "A2: records append-only bi sua phai lam cong DO");
    assert.match(result.out, /Sửa\/xoá bằng chứng vận hành: records\/old\.txt/,
      "A2: cong phai doc records tu mutability trong cau hinh");
  });

  withGateRepo({ area: "records/", declared: ["records/new.txt"] }, ({ tempRoot, runGate }) => {
    mkdirSync(join(tempRoot, "records"), { recursive: true });
    writeFileSync(join(tempRoot, "records", "new.txt"), "them moi\n", "utf8");
    appendFileSync(join(tempRoot, "HANDOFF.md"), "- ghi Log phien nay" + String.fromCharCode(10), "utf8");
    const result = runGate();
    khongCoDo(result, "them records moi da khai phai duoc phep:\n");
    assert.match(result.out, /\[XANH\] Vùng bằng chứng không bị sửa/,
      "doi chung A2 phai di qua nhanh XANH cua chinh gate append-only");
  });

  // A3 — AGENTS có nhiều chữ `scripts/`, nhưng không có đường dẫn file lạ này trong Mục 6.
  withGateRepo({}, ({ tempRoot, runGate }) => {
    writeFileSync(join(tempRoot, "scripts", "cong-cu-la.mjs"), "export {};\n", "utf8");
    const result = runGate();
    assert.notEqual(result.status, 0, "A3: file moi chua khai duong dan phai lam cong DO");
    assert.match(result.out, /Chưa khai vào Bản đồ file[^\n]*scripts\/cong-cu-la\.mjs/,
      "A3: phai bao DUNG duong dan, khong duoc chap nhan moi ten thu muc scripts");
  });

  withGateRepo({ declared: ["scripts/cong-cu-la.mjs"] }, ({ tempRoot, runGate }) => {
    writeFileSync(join(tempRoot, "scripts", "cong-cu-la.mjs"), "export {};\n", "utf8");
    appendFileSync(join(tempRoot, "HANDOFF.md"), "- ghi Log phien nay" + String.fromCharCode(10), "utf8");
    const result = runGate();
    khongCoDo(result, "A3: khai dung duong dan trong Muc 6 thi file moi phai duoc chap nhan:\n");
    assert.match(result.out, /\[XANH\] File mới đã khai vào Bản đồ file/,
      "doi chung A3 phai di qua nhanh XANH cua chinh gate ban do");
  });

  ok("Khối A gate: commit evidence · mutability records · đường dẫn thật — đều có ca hỏng và đối chứng");
}

/* ---- 3. Repo rỗng + bộ khung → cổng kiểm KHÔNG có chỗ đỏ ------------------ */
{
  const tempRoot = mkdtempSync(join(tmpdir(), "template-null-repo-"));
  try {
    const at = (cmd, args) => execFileSync(cmd, args, { cwd: tempRoot, encoding: "utf8" });
    const gitAt = (...args) => at("git", ["-c", "core.quotepath=false", ...args]);

    for (const [rel, text] of files) {
      const abs = join(tempRoot, ...rel.split("/"));
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, text, "utf8");
    }

    gitAt("init", "-q", "-b", "main");
    gitAt("config", "user.name", "Null Repo Test");
    gitAt("config", "user.email", "nullrepo@example.invalid");
    gitAt("add", "-A");
    gitAt("commit", "-q", "-m", "khoi tao tu bo khung");

    // Bước README bảo làm: sinh trang TRƯỚC khi đo. Bỏ bước này là đo một repo chưa có cổng
    // vào máy đọc, và phép kiểm điều hướng sẽ vàng — đúng, nhưng không phải điều đang thử.
    at(process.execPath, [join(tempRoot, "scripts", "build-dashboard.mjs")]);
    gitAt("add", "-A");
    gitAt("commit", "-q", "-m", "sinh trang lan dau");

    let out;
    try {
      out = at(process.execPath, [join(tempRoot, "scripts", "check-bootstrap.mjs")]);
    } catch (error) {
      throw new Error(`cong kiem cau truc thoat khac 0 tren repo rong:\n${error.stdout ?? ""}${error.stderr ?? ""}`);
    }

    const summary = out.split("\n").find((line) => line.startsWith("TỔNG:")) ?? "";
    // ĐỌC SỐ, đừng dò chuỗi. Bản đầu dùng một mẫu dò không chặn biên số nên nó khớp cả
    // "10 chỗ ĐỎ" lẫn "40 chỗ ĐỎ" — phép kiểm nghiệm thu sẽ XANH kể cả khi repo có 40 chỗ đỏ.
    // Audit độc lập bắt được 2026-09-02. Con số 0 tôi báo là thật, nhưng không gì bảo vệ nó.
    const count = (label) => {
      const m = summary.match(new RegExp("([0-9]+)[^0-9]*chỗ[^0-9]*" + label));
      assert.ok(m, `khong doc duoc so "${label}" tu dong tong ket: "${summary}"`);
      return Number(m[1]);
    };
    assert.equal(count("ĐỎ"), 0, `repo rong phai KHONG co cho do: "${summary}"`);
    assert.equal(count("VÀNG"), 0, `repo rong nen sach ca VANG: "${summary}"`);

    // CỔNG ĐÓNG PHIÊN cũng phải chạy được. Bản đầu CHỈ chạy cổng cấu trúc nên nó mù hoàn toàn
    // với việc cổng đóng phiên đòi một script mà bộ khung cố ý không mang theo — repo dựng từ
    // bộ khung hỏng ngay ở cổng của chính nó. Phép thử nghiệm thu phải chạy ĐỦ MỌI CỔNG mà
    // người dùng thật sẽ chạy; nếu không nó chỉ chứng minh đúng phần mình đã nghĩ tới.
    let gate = "";
    try {
      gate = at(process.execPath, [join(tempRoot, "scripts", "session-check.mjs"), "--as", "phep-thu-repo-rong"]);
    } catch (error) {
      gate = String(error.stdout || "") + String(error.stderr || "");
    }
    assert.ok(!/Cannot find module|ENOENT|KHONG_CHAY_DUOC/i.test(gate),
      "cong dong phien phai CHAY DUOC tren repo dung tu bo khung: " + gate.slice(0, 900));
    assert.ok(!/feature-parity/i.test(gate),
      "cong dong phien khong duoc doi script ma bo khung khong mang theo: " + gate.slice(0, 900));

    // CỔNG KHÔNG ĐƯỢC IM LẶNG BÁO XANH KHI NÓ CHƯA KIỂM GÌ — nửa chưa vá của lỗi nặng số 1,
    // phiên K1 tìm ra 02/09. Dây chuyền: bộ khung không mang `tests/` và `package.json` của nó
    // không khai `scripts.test` → `hasRootTestScript()` false VĨNH VIỄN → phép kiểm Test trả
    // XANH kèm câu "Không package nào của bạn có suite bị ảnh hưởng". Repo gốc hết bệnh sau bản
    // vá trước, bộ khung thì vẫn nguyên — mà bộ khung mới là thứ sắp nhân ra nhiều repo. Nhân
    // một cổng kiểm rỗng ra 21 repo còn tệ hơn không có bộ khung.
    //
    // Ba vế, và cả ba đều cần: nói ĐÚNG chuyện gì đang xảy ra · KHÔNG nói câu gây hiểu nhầm là
    // đã kiểm · và hiện ở mức BỎ QUA chứ không phải XANH.
    // Ca trên chạy với một phiên KHÔNG giữ khoá nào, và khi đó "không có suite nào bị ảnh
    // hưởng" là câu ĐÚNG. Ca hỏng thật là: phiên CÓ giữ khoá gốc, CÓ sửa file, mà repo không có
    // suite — lúc đó cổng phải nói ra, không được im. Dựng đúng ca đó, không dựng ca dễ.
    writeFileSync(join(tempRoot, ".agents", "claims.json"),
      JSON.stringify({ claims: { _root: { owner: "phep-thu-co-khoa", ai: null, claimed_at: null, task: "thu", released_at: null } } }, null, 2), "utf8");
    writeFileSync(join(tempRoot, "README.md"), "# Repo\n\nmot dong moi de co gi cho cong kiem\n", "utf8");
    let gateOwned = "";
    try {
      gateOwned = at(process.execPath, [join(tempRoot, "scripts", "session-check.mjs"), "--as", "phep-thu-co-khoa"]);
    } catch (error) {
      gateOwned = String(error.stdout || "") + String(error.stderr || "");
    }
    // BỘ KHUNG NAY MANG THEO SUITE CUA CHINH NO (K1 muc 1b, 02/09). Truoc do ban trich mang 5
    // script ma khong mang mot phep kiem nao, va `package.json` khong khai `scripts.test` — nen
    // `hasRootTestScript()` false VINH VIEN va cong dong phien cua MOI repo dung tu bo khung
    // khong chay mot dong test nao. Cong co, ma khong co rang.
    //
    // Nen o day khong con doi cau "REPO CHUA CO SUITE GOC" nua: doi CHINH suite do CHAY THAT.
    assert.doesNotMatch(gateOwned, /REPO CHƯA CÓ SUITE GỐC/,
      "bo khung phai MANG THEO suite cua chinh no, khong duoc de repo moi khong co gi de chay: " + gateOwned.slice(0, 900));
    assert.doesNotMatch(gateOwned, /Không package nào của bạn có suite bị ảnh hưởng/,
      "cau nay ngu y ĐA KIEM va khong thay gi — sai o mot repo co suite that");
    assert.match(gateOwned, /suite gốc repo: [0-9]+ passed, 0 failed/,
      "cong phai CHAY suite hat giong va bao so, khong duoc bo qua: " + gateOwned.slice(0, 900));

    // ĐỐI CHỨNG NGƯỢC — giữ lại lớp bảo vệ mà phiên `claude-k2-design` thêm ngày 02/09, đừng để
    // nó mất theo thay đổi trên. Repo NÀO ĐÓ vẫn có thể gỡ `scripts.test` đi; lúc ấy cổng phải
    // NÓI TO là chưa kiểm được gì, chứ không được im lặng báo xanh. Dựng đúng ca đó.
    {
      const pkgPath = join(tempRoot, "package.json");
      const gốc = readFileSync(pkgPath, "utf8");
      const pkg = JSON.parse(gốc);
      delete pkg.scripts.test;
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + String.fromCharCode(10), "utf8");
      let gateNoSuite = "";
      try {
        gateNoSuite = at(process.execPath, [join(tempRoot, "scripts", "session-check.mjs"), "--as", "phep-thu-co-khoa"]);
      } catch (error) {
        gateNoSuite = String(error.stdout || "") + String(error.stderr || "");
      }
      writeFileSync(pkgPath, gốc, "utf8");
      assert.match(gateNoSuite, /REPO CHƯA CÓ SUITE GỐC/,
        "go `scripts.test` di thi cong phai NOI TO, khong duoc im lang bao xanh: " + gateNoSuite.slice(0, 900));
      assert.match(gateNoSuite, /\[BỎ  \] Test xanh/,
        "chua kiem duoc gi thi phai hien la BO QUA, khong duoc doi lot XANH");
    }

    // CÙNG HỌ VỚI FAIL-OPEN CỦA `safe-push`, khác chỗ: repo tam nay KHONG co remote, nen
    // `git diff origin/main...HEAD` fail va `unpushed` RONG — cong lang le bo qua moi commit
    // chua push. Chua co teeth (chon moc so thay the la mot quyet dinh that), nhung PHAI thoi
    // im lang. Do duoc: truoc ban va, stderr in `fatal: bad revision 'origin/main'` roi moi
    // thu van xanh, va khong mot dong nao tren man hinh noi cho nguoi doc biet.
    assert.match(gateOwned, /KHÔNG SO ĐƯỢC VỚI origin\/main/,
      "khong phan giai duoc origin/main thi cong phai NOI RA, khong duoc im: " + gateOwned.slice(0, 600));
    assert.match(gateOwned, /git remote -v/, "va phai chi luon lenh de tu kiem");

    // NỘI DUNG trang sinh ra không được mang danh tính repo gốc. Kiểm DANH SÁCH file mang theo
    // là chưa đủ: bộ sinh từng đóng cứng tên repo gốc ngay trong trang cổng vào, nên mọi repo
    // dùng bộ khung đều sinh ra một trang TỰ NHẬN LÀ repo gốc, và mọi phép kiểm cũ đều xanh.
    for (const artifact of ["llms.txt", "DASHBOARD.md", "repo-map.json"]) {
      const text = readFileSync(join(tempRoot, artifact), "utf8");
      assert.ok(!/Chrome Extension AI Agentic/i.test(text),
        artifact + " sinh ra trong repo la MANG TEN repo goc — bo sinh dang dong cung danh tinh");
      // Và cũng không được mang TÊN GỌI ĐƠN VỊ của repo gốc. Bộ sinh từng đóng cứng chữ
      // "Extension" ở tiêu đề bảng và tên cột, nên một repo tài liệu dựng từ bộ khung vẫn nhận
      // "Bảng điều hành Extension". Danh tính rò rỉ theo hai đường; bịt một đường là chưa đủ.
      assert.ok(!/Bảng điều hành Extension/.test(text),
        artifact + " mang TEN GOI DON VI cua repo goc — bo sinh phai doc units.ten");
    }
    ok("repo rong: cong cau truc 0/0 · cong dong phien chay duoc · trang sinh ra khong mang ten repo goc");
  } finally {
    assert.ok(tempRoot.startsWith(join(tmpdir(), "template-null-repo-")), "chi don dung temp fixture cua phep kiem nay");
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

console.log(`\n${passed} passed, 0 failed, ${passed} total`);
