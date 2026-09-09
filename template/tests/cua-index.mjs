/* PHÉP GHIM CHO CỬA INDEX — KHUNG-59.
 *
 * CA HỎNG THẬT, hai lượt trong ngày 10/09, hai chiều ngược nhau, hai lane khác nhau: một cây
 * làm việc git có ĐÚNG MỘT index, nên giữa `git add` của lane A và `git commit` của lane A, bất
 * kỳ `git commit` nào của lane B cũng gom trọn mẻ của A vào commit của B. Không mất nội dung —
 * mất TRUY NGUỒN, đúng thứ nhãn `Lane:` sinh ra để giữ.
 *
 * VÌ SAO FILE NÀY CHẠM ĐĨA, khác `tests/khoa-file.mjs` (mọi vế ở đó là hàm thuần): thứ phải ghim
 * ở đây là HÀNH VI CỦA GIT, không phải một quyết định của ta. Một vế thuần chỉ chứng minh hàm
 * `cuaIndex` phân loại đúng — nó KHÔNG chứng minh git gọi hook, không chứng minh hook thấy đúng
 * mẻ, không chứng minh commit bị huỷ. Đó là "phép ghim không phân biệt được hai nhánh".
 *
 * ĐO ĐƯỢC 10/09 trên fixture rời: git đặt `GIT_INDEX_FILE` sang index TẠM cho cả
 * `commit --only` và `commit -a`, nên `git diff --cached` trong `commit-msg` thấy đúng mẻ sắp
 * vào commit. Hook thoát khác 0 thì commit bị huỷ VÀ index còn nguyên.
 *
 * BỐN VẾ CUỐI (3e · 3f · 3g · 5) SINH TỪ MỘT VÒNG AUDIT ĐỘC LẬP 10/09, không từ tôi đọc lại
 * code. Cả bốn là fail-open THẬT trong bản đầu của tôi. Danh sách đột biến đã chạy ở CUỐI file.
 *
 * FIXTURE TỰ DỰNG, không mượn repo nhà: vế ở đây phải chạy được ở repo tiêu thụ.
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { cuaIndex, EXIT, soatDanHang, xetCuaIndex } from "../scripts/claim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let so = 0;
const ok = (t) => { so += 1; console.log(`  ok  ${t}`); };
const vungCua = (d) => (d.startsWith("scripts/") ? "_code" : "_root");
const LUC = "2026-09-10T10:00:00.000Z";

/* ---- 1. HÀM THUẦN: cửa index HẸP HƠN `--soat`, và hẹp đúng chỗ ----------
 *
 * Vế này ghim MỘT QUYẾT ĐỊNH: file vô chủ được qua cửa. Bỏ nó thì cửa chặn cả lượt commit hợp
 * lệ của lane quên nhận khoá, và một cửa chặn oan sẽ bị mở `--no-verify` cho mọi lượt. */
{
  const doiSo = {
    daDan: ["scripts/cua-toi.mjs", "scripts/cua-ho.mjs", "vo-chu.md"],
    tam: { "scripts/cua-toi.mjs": { owner: "lane-a", luc: LUC }, "scripts/cua-ho.mjs": { owner: "lane-b", luc: LUC } },
    claims: {},
    as: "lane-a",
    mienKhoa: [],
    maySinh: [],
    vungCua,
  };
  const hep = cuaIndex(doiSo).map((x) => x.duongDan);
  assert.deepEqual(hep, ["scripts/cua-ho.mjs"], "cua index chi chan file CO CHU va chu khong phai toi");

  // ĐỐI CHIẾU trong cùng một vế: `--soat` rộng hơn — nó cũng chặn file vô chủ. Hai cửa khác
  // nhau là CHỦ Ý; ghim cả hai cạnh nhau để phiên sau không "thống nhất" chúng lại.
  const rong = soatDanHang(doiSo).la.map((x) => x.duongDan);
  assert.deepEqual(rong, ["scripts/cua-ho.mjs", "vo-chu.md"], "--soat van rong hon: file vo chu cung bi chan");
  ok("1 · cửa index chặn ĐÚNG file có chủ khác · file vô chủ qua · `--soat` vẫn rộng hơn");
}

/* ---- 2. Cửa index chặn theo KHOÁ VÙNG, không chỉ khoá file --------------- */
{
  const la = cuaIndex({
    daDan: ["scripts/x.mjs"],
    tam: {},
    claims: { _code: { owner: "lane-b" } },
    as: "lane-a",
    mienKhoa: [], maySinh: [], vungCua,
  });
  assert.equal(la.length, 1);
  assert.equal(la[0].chuVung, "lane-b");

  // Chính tôi giữ vùng: qua.
  assert.deepEqual(cuaIndex({
    daDan: ["scripts/x.mjs"], tam: {}, claims: { _code: { owner: "lane-a" } },
    as: "lane-a", mienKhoa: [], maySinh: [], vungCua,
  }), []);
  ok("2 · vùng của lane khác cũng chặn · vùng của chính mình thì qua");
}

/* ---- 3. FIXTURE GIT THẬT — các ca của ngày 10/09 ------------------------ */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ark-cua-index-"));
const g = (...a) => execFileSync("git", a, { cwd: tmp, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const commit = (msg, ...them) => {
  try {
    return { ma: 0, ra: execFileSync("git", ["commit", ...them, "-m", msg], { cwd: tmp, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) };
  } catch (e) {
    return { ma: e.status ?? 1, ra: `${e.stdout || ""}${e.stderr || ""}` };
  }
};
const daDan = () => g("diff", "--cached", "--name-only").split("\n").map((x) => x.trim()).filter(Boolean);
const bang = (tam) => {
  const noi = { claims: { _code: { owner: null }, _root: { owner: null } }, tam };
  fs.writeFileSync(path.join(tmp, ".agents", "claims.json"), `${JSON.stringify(noi, null, 2)}\n`);
};

try {
  g("init", "-q", ".");
  g("config", "user.email", "t@t");
  g("config", "user.name", "t");
  fs.mkdirSync(path.join(tmp, ".agents"), { recursive: true });
  fs.mkdirSync(path.join(tmp, "scripts"), { recursive: true });
  fs.mkdirSync(path.join(tmp, ".githooks"), { recursive: true });
  /* Bản đồ vùng của fixture. Cửa hỏi chính bộ quy vùng của repo, nên fixture phải khai thật. */
  fs.writeFileSync(path.join(tmp, ".repo-structure.json"), `${JSON.stringify({
    schema_version: 1,
    repo: "fixture",
    areas: {
      "scripts/": { steward: "_code", mutability: "rw", ownership_mode: "root" },
      ".agents/": { steward: "_root", mutability: "rw", ownership_mode: "root" },
    },
  }, null, 2)}\n`);
  bang({});
  fs.writeFileSync(path.join(tmp, "scripts", "cua-toi.mjs"), "// toi\n");
  fs.writeFileSync(path.join(tmp, "scripts", "cua-ho.mjs"), "// ho\n");
  g("add", "-A");
  g("commit", "-q", "-m", "goc");

  /* Hook y HỆT bản của repo, chỉ trỏ `claim.mjs` về repo nhà — fixture không có `scripts/` của
     bộ khung. Chép nội dung thay vì viết lại: viết lại là ghim một hook KHÁC hook đang chạy. */
  const goc = fs.readFileSync(path.join(ROOT, ".githooks", "commit-msg"), "utf8");
  assert.match(goc, /--cua-index/, "hook that phai goi `--cua-index`; ghim nay vo nghia neu no goi thu khac");
  /* `--goc` là thứ chính fixture này lôi ra 10/09: thiếu nó thì cửa đọc index của cây ĐANG
     commit bằng gốc repo KHÁC, git nổ `fatal: unable to read <oid>`, và cửa fail-closed chặn
     MỌI commit. Ghim ở đây vì `KHUNG-50` sắp dựng một `git worktree` có gốc khác gốc module. */
  assert.match(goc, /--goc "\$goc"/, "hook phai truyen --goc: thieu no thi cua doc index cua cay khac");
  /* HOOK KHÔNG ĐƯỢC TỰ ĐỌC NHÃN. Vòng audit 10/09 ca ⑶: bản đầu đọc bằng `sed 's/^[Ll]ane:…'`,
     tức bộ đọc thứ hai cho một khái niệm đã có nhà (`laneFromMessage`). Hai bộ lệch nhau ở chữ
     thường, ở nhiều nhãn, ở nhãn có khoảng trắng — nên viết được lời nhắn lọt cửa dưới tên A
     rồi được cổng quy cho tên B. Vế 3g dựng lại đúng lời nhắn đó. */
  assert.match(goc, /--loi-nhan "\$1"/, "hook phai chuyen FILE loi nhan cho claim.mjs, khong tu doc nhan");
  // Soi THÂN hook, bỏ dòng chú thích — chú thích có quyền nhắc `sed` để kể lại chỗ vấp.
  const thanHook = goc.split("\n").filter((l) => !l.trim().startsWith("#")).join("\n");
  assert.doesNotMatch(thanHook, /sed|[Ll]ane:/, "than hook KHONG duoc chua mot bo doc nhan thu hai");
  fs.writeFileSync(
    path.join(tmp, ".githooks", "commit-msg"),
    goc.replace('exec node "$goc/scripts/claim.mjs"', `exec node ${JSON.stringify(path.join(ROOT, "scripts", "claim.mjs"))}`),
    { mode: 0o755 },
  );
  g("config", "core.hooksPath", ".githooks");

  /* ⒜ Lượt 10/09: lane-b dàn file của mình, lane-a chạy `git commit -a`. */
  bang({ "scripts/cua-ho.mjs": { owner: "lane-b", luc: LUC } });
  fs.appendFileSync(path.join(tmp, "scripts", "cua-ho.mjs"), "// ho viet\n");
  fs.appendFileSync(path.join(tmp, "scripts", "cua-toi.mjs"), "// toi viet\n");
  g("add", "scripts/cua-ho.mjs");
  const a = commit("feat: viec cua toi\n\nLane: lane-a", "-a");
  assert.notEqual(a.ma, 0, "CA HONG CHINH: `commit -a` cua lane-a KHONG duoc di qua");
  assert.match(a.ra, /CUA_INDEX_CUON_VIEC_LANE_KHAC/);
  assert.match(a.ra, /scripts\/cua-ho\.mjs/, "phai NEU TEN duong dan bi cuon");
  assert.match(a.ra, /lane-b/, "phai NEU TEN lane bi cuon — khong ten thi khong biet hoi ai");
  assert.equal(g("log", "--oneline").trim().split("\n").length, 1, "commit phai bi HUY, HEAD khong doi");
  assert.deepEqual(daDan(), ["scripts/cua-ho.mjs"], "index con NGUYEN me cua lane-b sau khi bi tu choi");
  ok("3a · lane khác đã `git add` thì `git commit -a` của tôi BỊ HUỶ, nêu tên file và tên lane, index còn nguyên");

  /* ⒝ Cách xử mà chính thông báo mách: `--only` phần của mình. Phải QUA, và phải không cuốn. */
  const b = commit("feat: viec cua toi\n\nLane: lane-a", "--only", "scripts/cua-toi.mjs");
  assert.equal(b.ma, 0, `--only phan cua minh phai QUA. Ra: ${b.ra}`);
  assert.match(g("show", "--stat", "--oneline", "HEAD"), /cua-toi\.mjs/);
  assert.doesNotMatch(g("show", "--stat", "--oneline", "HEAD"), /cua-ho\.mjs/, "`--only` khong duoc cuon file lane khac");
  assert.deepEqual(daDan(), ["scripts/cua-ho.mjs"], "me cua lane-b van con dan, cho chinh ho commit");
  ok("3b · `git commit --only <phần của mình>` ĐI QUA · không cuốn file lane khác · mẻ của họ còn nguyên");

  /* ⒞ Chính chủ commit mẻ của mình: phải QUA. Một cửa fail-closed mà chặn cả chính chủ thì nó
     là cửa không ai dùng được, và nó sẽ bị mở `--no-verify` trong một ngày. */
  const c = commit("feat: viec cua lane-b\n\nLane: lane-b");
  assert.equal(c.ma, 0, `chinh chu phai commit duoc me cua minh. Ra: ${c.ra}`);
  assert.match(g("show", "--stat", "--oneline", "HEAD"), /cua-ho\.mjs/);
  ok("3c · chính chủ commit mẻ của mình thì ĐI QUA");

  /* ⒟ Nhãn `Lane:` thiếu: cửa này KHÔNG chặn — cửa đó là phép kiểm "Nhãn lane trong commit" của
     cổng đóng phiên và của `safe-push`. Ghim vế này để phiên sau không thêm cửa thứ hai canh
     cùng một điều (AGENTS.md mục 8). */
  bang({ "scripts/cua-ho.mjs": { owner: "lane-b", luc: LUC } });
  fs.appendFileSync(path.join(tmp, "scripts", "cua-ho.mjs"), "// ho viet nua\n");
  g("add", "scripts/cua-ho.mjs");
  const d = commit("chore: khong nhan lane");
  assert.equal(d.ma, 0, "thieu nhan Lane: thi cua INDEX im lang — canh o cong dong phien va safe-push");
  ok("3d · thiếu nhãn `Lane:` thì cửa index im lặng, không giành việc của cửa khác");

  /* ⒠ VÒNG AUDIT 10/09, ca ⑴ `CUA_INDEX_AMEND_BYPASS` — đường lách HAI BƯỚC.
     Commit KHÔNG nhãn (cửa im lặng theo ⒟) rồi `git commit --amend` thêm nhãn của mình: index
     bằng HEAD nên `diff --cached` RỖNG, và bản đầu của tôi cho qua ở đúng dòng đó. Commit cuối
     mang tên tôi mà chứa việc lane khác, và cổng đóng phiên KHÔNG thấy gì lạ — nhãn đã có. */
  bang({ "scripts/cua-ho.mjs": { owner: "lane-b", luc: LUC } });
  fs.appendFileSync(path.join(tmp, "scripts", "cua-ho.mjs"), "// buoc mot\n");
  g("add", "scripts/cua-ho.mjs");
  const e1 = commit("chore: khong nhan lane");
  assert.equal(e1.ma, 0, "buoc mot phai qua — do la he qua CO Y cua ⒟");
  const e2 = commit("feat: viec cua toi\n\nLane: lane-a", "--amend");
  assert.notEqual(e2.ma, 0, "buoc hai (`--amend` them nhan) KHONG duoc di qua");
  assert.match(e2.ra, /CUA_INDEX_CUON_VIEC_LANE_KHAC/);
  assert.match(e2.ra, /cua-ho\.mjs/, "phai soi lai NOI DUNG dang duoc dong lai, khong chi me index");
  ok("3e · đường lách `--amend`: commit không nhãn rồi thêm nhãn — cửa soi lại nội dung, BỊ HUỶ");

  /* ⒡ VÒNG AUDIT 10/09, ca ⑵ `CUA_INDEX_PATH_LOSS` — đường dẫn ngoài ASCII.
     `--name-only` trần thì git TRÍCH DẪN tên thành `"scripts/k\341\273\271…"`, và tên đã trích
     dẫn không khớp hàng nào trong bảng quyền — nên file CÓ CHỦ đọc thành VÔ CHỦ, cửa cho qua.
     Repo phát hành có sẵn cả một danh sách `grandfathered` toàn đường dẫn tiếng Việt có dấu,
     nên đây là ca thật. */
  const tenCoDau = "scripts/kỹ-thuật.mjs";
  fs.writeFileSync(path.join(tmp, tenCoDau), "// cua ho\n");
  bang({ [tenCoDau]: { owner: "lane-b", luc: LUC } });
  g("add", tenCoDau);
  const f = commit("feat: viec cua toi\n\nLane: lane-a");
  assert.notEqual(f.ma, 0, "duong dan tieng Viet co dau van phai bi CHAN");
  assert.match(f.ra, /CUA_INDEX_CUON_VIEC_LANE_KHAC/);
  assert.match(f.ra, /lane-b/);
  /* ĐO 10/09, ba đột biến: bỏ `-z` mà giữ `core.quotepath=false` thì vế này VẪN XANH, và ngược
     lại cũng xanh — mỗi cái tự đủ. Ca hỏng chỉ dựng lại được khi thiếu CẢ HAI, và đó đúng là
     bản đầu. Nên vế này ghim "có ít nhất một trong hai", không ghim `-z` là thứ chịu lực. */
  ok("3f · đường dẫn tiếng Việt có dấu vẫn bị chặn — index đọc không qua lớp trích dẫn của git");

  /* ⒢ VÒNG AUDIT 10/09, ca ⑶ `CUA_INDEX_LANE_AMBIGUOUS` — HAI bộ đọc nhãn trả HAI tên.
   *
   * DỰNG ĐÚNG CHIỀU LÁCH, không phải chiều ngược. Bản đầu để hook đọc bằng `sed
   * 's/^[Ll]ane:…' | head -1` nên nó lấy dòng ĐẦU và nhận cả chữ thường. `laneFromMessage`
   * (thứ cổng và `safe-push` dùng) chỉ nhận `Lane:` hoa. Nên lời nhắn dưới đây tách hai bộ:
   *   - bộ `sed`           → "lane-a"  → lane-a LÀ chủ file → cho qua
   *   - `laneFromMessage`  → "lane-b"  → cổng quy commit cho lane-b
   * Tức lane-b cuốn được việc của lane-a, và cổng vẫn thấy một commit có nhãn hợp lệ.
   *
   * Ca này KHÔNG dựng nổi nếu khoá file thuộc lane-b — lúc đó cửa từ chối vì lý do khác, và
   * phép ghim xanh mà chẳng chứng minh gì. Vế đầu tôi viết đúng sai chỗ đó. */
  bang({ "scripts/cua-ho.mjs": { owner: "lane-a", luc: LUC } });
  fs.appendFileSync(path.join(tmp, "scripts", "cua-ho.mjs"), "// cua lane-a\n");
  g("add", "scripts/cua-ho.mjs");
  const g1 = commit("feat: hai bo doc\n\nlane: lane-a\nLane: lane-b");
  assert.notEqual(g1.ma, 0, "`lane:` chu thuong KHONG duoc thanh mot bo doc thu hai");
  assert.match(g1.ra, /CUA_INDEX_CUON_VIEC_LANE_KHAC/);
  assert.match(g1.ra, /"lane-b"/, "cua phai dung DUNG ten ma cong se dung: lane-b");

  const g2 = commit("feat: hai nhan\n\nLane: lane-a\nLane: lane-b");
  assert.notEqual(g2.ma, 0, "hai nhan khac nhau: cua KHONG duoc tu chon mot cai");
  assert.match(g2.ra, /CUA_INDEX_NHAN_KHONG_QUY_THUOC_DUOC/);

  const g3 = commit("feat: nhan rong\n\nLane:");
  assert.notEqual(g3.ma, 0, "nhan RONG: khong biet la ai thi khong biet file nao cua minh");
  assert.match(g3.ra, /CUA_INDEX_NHAN_KHONG_QUY_THUOC_DUOC/);
  ok("3g · một bộ đọc nhãn duy nhất: `lane:` chữ thường · hai nhãn khác nhau · nhãn rỗng — đều BỊ CHẶN");

  /* ⒣ THÁO CỬA RA thì ca hỏng ⒜ QUAY LẠI. Đây là vế chứng minh phép ghim này ghim thật — không
     có nó thì mọi vế trên vẫn xanh khi hook chỉ còn là một file rỗng. */
  g("config", "--unset", "core.hooksPath");
  const e = commit("feat: khong co cua\n\nLane: lane-b");
  assert.equal(e.ma, 0, "khong co cua thi git cho qua — day la trang thai TRUOC ban va");
  assert.match(g("show", "--stat", "--oneline", "HEAD"), /cua-ho\.mjs/, "va no CUON file cua lane-a: dung ca hong KHUNG-59");
  ok("3h · tháo cửa ra thì ca hỏng KHUNG-59 QUAY LẠI — phép ghim trên phân biệt được hai nhánh");
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

/* ---- 4. Hợp đồng mã thoát với git --------------------------------------- */
{
  assert.equal(EXIT.REFUSED, 3, "hook dua ma thoat cua `claim.mjs` cho git; doi so nay la doi hop dong voi git");
  ok("4 · mã TỪ CHỐI vẫn là 3 — git huỷ commit khi hook thoát khác 0");
}

/* ---- 5. CỬA ĐÃ BẬT CHƯA — ba nhánh, và một trong ba là fail-open đã có thật
 *
 * VÒNG AUDIT 10/09, ca ⑷: bản đầu chỉ hỏi *"file hook có tồn tại không"*, nên XOÁ file hook đi
 * là cổng chuyển sang XANH (bỏ qua) — cửa biến mất mà cổng nói không sao. Cả cơ chế vô nghĩa
 * nếu nó không được bật, nên phép kiểm bật/tắt cũng phải có phép ghim. */
{
  const batRoi = xetCuaIndex({ coTrenDia: true, daTheoDoi: true, hooksPath: ".githooks\n" });
  assert.equal(batRoi.ok, true);
  assert.ok(!batRoi.skipped, "cua dang bat thi DAT, khong phai bo qua");

  const tat = xetCuaIndex({ coTrenDia: true, daTheoDoi: true, hooksPath: "" });
  assert.equal(tat.ok, false);
  assert.match(tat.msg, /CUA_INDEX_TAT/);
  assert.match(tat.msg, /core\.hooksPath \.githooks/, "phai NEU CACH BAT, khong chi neu loi");

  const troNoiKhac = xetCuaIndex({ coTrenDia: true, daTheoDoi: true, hooksPath: ".hooks-cua-ai-do" });
  assert.equal(troNoiKhac.ok, false);
  assert.match(troNoiKhac.msg, /\.hooks-cua-ai-do/, "phai NEU TEN cho no dang tro toi");
  assert.match(troNoiKhac.msg, /HỎI người đặt trước/, "KHONG duoc day phien sau ghi de cau hinh cua nguoi khac");

  /* ĐÂY là ca fail-open đã có thật: file bị xoá nhưng repo VẪN THEO DÕI nó. */
  const biThao = xetCuaIndex({ coTrenDia: false, daTheoDoi: true, hooksPath: ".githooks" });
  assert.equal(biThao.ok, false, "repo theo doi file hook ma file khong con tren dia: DO, khong duoc bo qua");
  assert.match(biThao.msg, /CUA_INDEX_BI_THAO/);

  /* Còn repo TIÊU THỤ chưa bao giờ nhận bản trích thì bỏ qua là đúng — chặn nó là chặn oan, và
     một cổng chặn oan ở repo người khác thì họ tắt cả cổng. */
  const chuaNhan = xetCuaIndex({ coTrenDia: false, daTheoDoi: false, hooksPath: "" });
  assert.equal(chuaNhan.ok, true);
  assert.equal(chuaNhan.skipped, true, "repo chua nhan cua thi BO QUA, khong DO");
  ok("5 · bật · tắt · trỏ nơi khác · BỊ THÁO (đỏ) · chưa nhận cửa (bỏ qua) — bốn nhánh khác nhau");
}

console.log(`\n${so} passed, 0 failed, ${so} total — SUITE XANH`);

/* ---- ĐỘT BIẾN ĐÃ CHẠY — chín lượt, chín lượt ĐỎ --------------------------
 *
 * ⑴ `cuaIndex` trả `[]`                              → vế 1 đỏ
 * ⑵ `cuaIndex` trả nguyên `la` (rộng bằng `--soat`)   → vế 1 đỏ
 * ⑶ hook rỗng (`exit 0`)                              → vế 3a đỏ
 * ⑷ hook không truyền `--goc`                         → vế đọc chữ hook đỏ
 * ⑸ `core.hooksPath` tắt                              → vế 3a đỏ
 * ⑹ bỏ đường soi lại khi mẻ RỖNG (`--amend`)          → vế 3e đỏ
 * ⑺ bỏ CẢ `-z` và `core.quotepath=false`              → vế 3f đỏ
 * ⑻ nhãn không quy thuộc được thì CHO QUA             → vế 3g đỏ
 * ⑼ đọc nhãn bằng bộ thứ hai (chữ thường, dòng đầu)   → vế 3g đỏ
 * ⑽ `xetCuaIndex` bỏ qua khi file mất, bất kể theo dõi → vế 5 đỏ
 *
 * ĐỘT BIẾN XANH — ghi lại vì nó nói một điều khác: bỏ `-z` mà giữ `core.quotepath=false` thì
 * vế 3f VẪN xanh, và ngược lại cũng xanh. Hai cái mỗi cái tự đủ; ca hỏng chỉ dựng lại được khi
 * thiếu CẢ HAI. Nên vế 3f ghim "có ít nhất một trong hai", không ghim `-z` là thứ chịu lực.
 */
