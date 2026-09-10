/* GHIM PHIÊN BẢN + NÂNG CẤP — phép kiểm phá.
 *
 * Điều đáng canh nhất KHÔNG phải "có chép file sang không" (chép thì dễ), mà là **có biết dừng
 * lại khi file đích đã bị sửa tay không**. Không có vế đó thì `upgrade` chỉ là `cp -r` có nghi
 * thức, và nó sẽ xoá bản vá tại chỗ của người khác mà không để lại dấu vết nào.
 *
 * NAM DOT BIEN DA CHAY THAT cho ve 20 (tang TEN LENH, 07/09) — ca nam deu bi bat:
 *   1. ghi de ca khoa lenh DA CO                              -> do
 *   2. doc khong ra `package.json` thi coi nhu khong thieu gi  -> do
 *   3. mot MANG cung tinh la `package.json`                    -> do
 *   4. khoa co gia tri KHAC cung xep vao THIEU                 -> do
 *   5. ghep lam mat cac truong khac cua `package.json`         -> do
 *
 * Ve 20 con bat duoc mot loi CUA CHINH MA NGUON luc viet: `soSanhLenh("[]")` — mot mang co
 * `typeof === "object"`, nen phep kiem "la object" cho no di lot roi tra `{}`, tuc noi "khong
 * thieu lenh nao" ve mot file khong phai `package.json`.
 */

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { bamBanTrich, buildTemplateFiles, kiemSoPhatHanh, loiSoPhatHanh, soVoiLichSu, TEP_CUA_REPO_DICH, TEP_MAY_THEM } from "../scripts/build-template.mjs";
import { docSoGhim, fileMay, fileTaiLieu, fileTuyChon, ghepLenh, soGhimMoi, soSanh, soSanhLenh } from "../scripts/upgrade.mjs";

let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };
const NL = String.fromCharCode(10);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Toàn bộ đột biến chạy trong bản sao có lịch sử git; không sửa ledger của lane đang làm việc.
if (process.env.ARK_UPGRADE_FIXTURE !== ROOT) {
  const cha = mkdtempSync(join(tmpdir(), "ark-upgrade-fixture-"));
  const rieng = join(cha, "source");
  try {
    execFileSync("git", ["clone", "--quiet", "--no-hardlinks", "--no-checkout", ROOT, rieng]);
    execFileSync("git", ["reset", "--mixed", "HEAD"], { cwd: rieng, stdio: "pipe" });
    const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
      { cwd: ROOT, encoding: "utf8" }).split("\0").filter(Boolean);
    for (const rel of new Set(files)) {
      if (!existsSync(join(ROOT, rel))) continue;
      mkdirSync(dirname(join(rieng, rel)), { recursive: true });
      cpSync(join(ROOT, rel), join(rieng, rel), { recursive: true });
    }
    const child = spawnSync(process.execPath, [join(rieng, "tests", "upgrade-smoke.mjs")],
      { cwd: rieng, env: { ...process.env, ARK_UPGRADE_FIXTURE: rieng }, stdio: "inherit" });
    if (child.error) throw child.error;
    process.exitCode = child.status ?? 1;
  } finally {
    assert.ok(resolve(cha).startsWith(resolve(tmpdir()) + "/") || resolve(cha).startsWith(resolve(tmpdir()) + "\\"));
    rmSync(cha, { recursive: true, force: true });
  }
  process.exit(process.exitCode ?? 0);
}
const chuan = buildTemplateFiles();

const dungRepo = (ghiSoGhim) => {
  const root = mkdtempSync(join(tmpdir(), "upgrade-"));
  for (const rel of fileMay(chuan)) {
    mkdirSync(join(root, dirname(rel)), { recursive: true });
    writeFileSync(join(root, rel), chuan.get(rel), "utf8");
  }
  if (ghiSoGhim) {
    mkdirSync(join(root, ".ark"), { recursive: true });
    writeFileSync(join(root, ".ark", "harness.lock.json"), JSON.stringify(soGhimMoi(chuan, null), null, 2), "utf8");
  }
  return root;
};

/* ---- 1. Chỉ tầng MÁY được nâng cấp -------------------------------------- */
{
  // Luật và trạng thái là chữ của repo đích. Ghi đè chúng là xoá công của người ta — đúng thứ
  // quy trình migrate cấm ("thêm vào, đừng thay thế").
  const ds = fileMay(chuan);
  const tap = new Set(ds);

  /* CHIỀU 1 — KHÔNG được nuốt chữ của repo đích. Đây là vế cũ, giữ nguyên sức. */
  assert.ok(ds.every((r) => !r.endsWith(".md")),
    `tai lieu KHONG duoc nam trong tap tu dong ghi de: ${ds.filter((r) => r.endsWith(".md")).join(", ")}`);
  assert.ok(!tap.has("AGENTS.md") && !tap.has("STATUS.md") && !tap.has("HANDOFF.md"),
    "luat va trang thai KHONG duoc nam trong tap tu dong ghi de");
  /* CẤU HÌNH `.json` là thứ repo đích khai cho nghề của nó — không được ghi đè.
   *
   * Vế này từng là "KHÔNG file `.json` nào ở tầng máy", và nó BẮT ĐƯỢC tôi ngày 07/09 lúc tôi
   * kéo `features.json` vào tầng máy. Đúng chỗ nó phải bắt. Nên không gỡ nó — **thu hẹp** nó:
   * `.json` ở tầng máy phải được KHAI TƯỜNG MINH trong `TEP_MAY_THEM`, và vế 21 canh tiếp là
   * mọi tên khai đều có thật, còn `package.json` · `.repo-structure.json` · `.agents/claims.json`
   * thì tuyệt đối không được lọt vào. Một ngoại lệ có tên và có phép ghim khác hẳn một cái cửa
   * mở: cửa mở thì lần sau ai cũng đẩy được một file cấu hình qua, không ai thấy. */
  const jsonLot = ds.filter((r) => r.endsWith(".json") && !TEP_MAY_THEM.includes(r));
  assert.deepEqual(jsonLot, [],
    `cau hinh la thu repo dich khai cho nghe cua no, khong duoc ghi de: ${jsonLot.join(", ")}`);

  /* CHIỀU 2 — và KHÔNG được bỏ sót thứ chạy được. Vế này thêm sau khi nó cắn thật.
   *
   * Bản trước hỏi "mọi file máy có nằm trong scripts/ hay tests/ không" — tức nó ghim CHÍNH cái
   * định nghĩa đang sai, nên nó xanh trong khi `upgrade.mjs` bỏ quên cả một thư mục mã. Bản 1.3.26
   * thêm `bang-song/`; hệ quả: repo đích nhận `tests/bang-song.mjs` mà KHÔNG nhận thứ nó kiểm, và
   * suite của repo đích gãy ngay lượt đầu vì một lý do không nói gì về nguyên nhân.
   *
   * Hỏi ngược lại mới có răng: quét bản trích tìm MỌI file chạy được, rồi đòi từng cái phải nằm
   * trong tập nâng cấp. Câu hỏi này còn đúng khi bộ khung mọc thêm thư mục mã lần sau. */
  /* HỎI BẰNG ĐUÔI FILE LÀ HỎI LẠI CHÍNH ĐỊNH NGHĨA ĐANG SAI — lần thứ hai của vế này.
   *
   * Bản trước quét `/\.(mjs|cmd)$/`, nên nó mù với thứ chạy được KHÔNG CÓ ĐUÔI. Đo 10/09:
   * `.githooks/commit-msg` (git gọi đúng cái tên đó) lọt khỏi tầng máy và vế này vẫn XANH.
   *
   * MÁY DÒ, KHÔNG PHẢI QUY TẮC SỞ HỮU. Vòng audit độc lập bắt bản vá đầu của tôi: cho `#!`
   * quyết định tư cách tầng máy là để tư cách phụ thuộc vào chính nội dung đang cần băm — gỡ
   * dòng `#!` là file rơi khỏi tập băm, nên `exit 0` và `exit 1` cho CÙNG một dấu vân tay.
   * Nên tư cách đi theo ĐƯỜNG DẪN (`TEP_MAY_THEM`), còn `#!` ở lại ĐÂY: nó chặn phát hành khi
   * bộ khung mọc thêm một file chạy được mà chưa ai khai. */
  const chayDuoc = [...chuan.keys()].filter((r) =>
    /\.(mjs|cmd)$/.test(r) || String(chuan.get(r) ?? "").startsWith("#!"));
  const bo = chayDuoc.filter((r) => !tap.has(r));
  assert.deepEqual(bo, [],
    `${bo.length} file chay duoc bi BO QUEN khoi tap nang cap: ${bo.join(", ")}`
    + " — repo dich se nhan phep ghim ma khong nhan thu no kiem. Khai duong dan do vao TEP_MAY_THEM.");
  assert.ok(chayDuoc.some((r) => !/\.(mjs|cmd)$/.test(r)),
    "ban trich phai co it nhat MOT file chay duoc khong co duoi (git hook), neu khong ve tren khong ghim gi");

  /* MÁY DÒ PHẢI CÒN RĂNG khi bộ khung mọc thêm hook thứ hai — dựng nổi ca đó, đừng chỉ soi bản
     trích hôm nay. Một file chạy được mới mà chưa ai khai thì vế trên PHẢI đỏ. */
  {
    const themHook = new Map(chuan);
    themHook.set(".githooks/pre-push", "#!/bin/sh\nexit 0\n");
    const soHoLot = [...themHook.keys()].filter((r) =>
      String(themHook.get(r) ?? "").startsWith("#!") && !new Set(fileMay(themHook)).has(r));
    assert.deepEqual(soHoLot, [".githooks/pre-push"],
      "them mot hook moi ma khong khai thi phep ghim PHAI bat duoc — neu khong, may do nay la do trang tri");
  }

  /* CHIỀU 3 — file của repo đích KHÔNG BAO GIỜ vào tầng máy.
   *
   * GÕ THẲNG BA TÊN, không đọc `TEP_CUA_REPO_DICH`. Vòng audit 10/09 nêu đúng chỗ này: vế đọc
   * chính danh sách nó canh thì XOÁ một tên khỏi danh sách là vế tự thu hẹp theo, và nó xanh.
   * Một phép kiểm đọc cùng nguồn với thứ nó kiểm thì không kiểm gì. */
  for (const rel of ["package.json", ".repo-structure.json", ".agents/claims.json"]) {
    assert.ok(!tap.has(rel), `${rel} la file CUA REPO DICH, khong duoc vao tang may`);
  }

  /* VÀ ĐÂY LÀ ĐƯỜNG DUY NHẤT CÒN LẠI để một file repo đích lọt vào: có người khai tên nó vào
   * `TEP_MAY_THEM`. Lớp chặn `TEP_CUA_REPO_DICH` trong `fileMay` là dây an toàn; vế này là cái
   * nói ra trước khi ai đó phải dựa vào dây.
   *
   * Vế cũ của tôi ở chỗ này NHÉT `#!` vào ba file rồi hỏi lại — nó có răng khi tư cách tầng máy
   * đọc từ NỘI DUNG. Tư cách nay đọc từ ĐƯỜNG DẪN, nên phép nhét ấy không còn chạm gì: đột biến
   * ⒂ (gỡ hẳn lớp chặn) vẫn XANH. Giữ một vế đã hết răng là tự nói dối về mức che phủ. */
  const trung = TEP_MAY_THEM.filter((r) => TEP_CUA_REPO_DICH.includes(r));
  assert.deepEqual(trung, [],
    `khai file CUA REPO DICH vao tang may la ghi de repo cua nguoi ta: ${trung.join(", ")}`);

  assert.ok(ds.length >= 6, `phai co it nhat 6 file may, dang ${ds.length}`);
  ok(`chỉ tầng máy được nâng cấp — ${ds.length} file chạy được (kể cả không-đuôi), 0 file chữ`);
}

/* ---- 1b. PHỤ LỤC NGHỀ: kể tên, KHÔNG tự mang ----------------------------
 *
 * Vấp thật 07/09, bắt được lúc đọc bản `--plan` cho một repo CHỨNG KHOÁN: lệnh định mang sang
 * phụ lục nghề "tự động hoá trình duyệt". Ngay dòng đầu của chính file đó viết *"Repo bạn không
 * lái trình duyệt thì XOÁ file này… giữ một phụ lục sai nghề còn tệ hơn không có phụ lục"*.
 *
 * File TỰ NÓI RA là nó không dành cho repo đó, mà lệnh vẫn mang. Luật "thiếu thì mang" đúng với
 * sổ tay dùng chung, KHÔNG đúng với phụ lục nghề — và khác biệt ấy đã khai sẵn ở frontmatter,
 * chỉ là chưa ai đọc.
 *
 * Đột biến đã chạy: cho `laTuyChon` luôn trả `false` → vế này ĐỎ.
 */
{
  const tuyChon = fileTuyChon(chuan);
  const tuDong = new Set(fileTaiLieu(chuan));

  assert.ok(tuyChon.length >= 1, "ban trich phai co it nhat mot phu luc nghe de ve nay co viec ma lam");
  for (const rel of tuyChon) {
    assert.ok(!tuDong.has(rel), `${rel} tu khai 'status: optional' nhung VAN nam trong tap tu dong mang sang`);
    assert.match(chuan.get(rel), /status:\s*optional/, `${rel} phai that su tu khai optional`);
  }

  // Chiều ngược: sổ tay dùng chung thì VẪN phải được mang. Không có vế này thì một bản "không mang
  // gì cả" cũng qua được vế trên.
  assert.ok(tuDong.has("docs/protocols/MULTIFLOW.md"),
    "so tay dung chung PHAI duoc mang sang — repo da lap ma khong nhan so tay la dong bang o tang tai lieu");
  assert.ok(tuDong.size >= 4, `phai mang it nhat 4 tai lieu dung chung, dang ${tuDong.size}`);
  ok(`phụ lục nghề (${tuyChon.length}) chỉ kể tên · sổ tay dùng chung (${tuDong.size}) vẫn mang`);
}

/* ---- 2. Repo khớp bản khung → không có việc gì --------------------------- */
{
  const root = dungRepo(true);
  try {
    const dong = soSanh(root, chuan, docSoGhim(root).so);
    assert.ok(dong.every((d) => d.trangThai === "ĐÃ MỚI"),
      `repo vua lap thi moi file phai la DA MOI, dang co: ${dong.filter((d) => d.trangThai !== "ĐÃ MỚI").map((d) => `${d.rel}=${d.trangThai}`).join(", ")}`);
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("repo khớp bản khung: không có gì để nâng cấp");
}

/* ---- 3. SỬA TAY phải phân biệt được với CŨ ------------------------------- */
{
  // Đây là toàn bộ lý do sổ ghim tồn tại. Hai ca dưới đây trông GIỐNG HỆT nhau nếu chỉ so
  // "bản khung" với "bản ở repo" — cả hai đều KHÁC. Chỉ dấu vân tay ghi lúc lắp mới tách được:
  //   CŨ      = repo giữ nguyên bản đã ghim, bộ khung tiến lên  → nâng cấp thoải mái
  //   SỬA TAY = repo đã lệch khỏi bản đã ghim                    → nâng cấp là XOÁ việc người ta
  const mot = fileMay(chuan)[0];

  // (a) SỬA TAY: repo có sổ ghim, và file đã lệch khỏi bản đã ghim.
  {
    const root = dungRepo(true);
    try {
      writeFileSync(join(root, mot), `${chuan.get(mot)}\n// mot ban va tai cho cua nguoi khac\n`, "utf8");
      const d = soSanh(root, chuan, docSoGhim(root).so).find((x) => x.rel === mot);
      assert.equal(d.trangThai, "SỬA TAY",
        "file lech khoi ban DA GHIM la SUA TAY — nang cap se xoa viec cua nguoi ta");
    } finally { rmSync(root, { recursive: true, force: true }); }
  }

  // (b) CŨ: repo giữ đúng bản đã ghim, nhưng BẢN KHUNG đã tiến lên.
  //     Dựng bằng cách ghim một dấu vân tay khớp với file đang có, rồi giả vờ bản khung mới hơn.
  {
    const root = dungRepo(true);
    try {
      const khungMoi = new Map(chuan);
      khungMoi.set(mot, `${chuan.get(mot)}\n// ban khung tien len\n`);
      const d = soSanh(root, khungMoi, docSoGhim(root).so).find((x) => x.rel === mot);
      assert.equal(d.trangThai, "CŨ",
        "repo giu dung ban da ghim ma bo khung tien len thi la CU, khong phai SUA TAY");
    } finally { rmSync(root, { recursive: true, force: true }); }
  }

  // (c) ĐỐI CHỨNG: KHÔNG có sổ ghim thì không thể kết luận là sửa tay — phải nói "CHƯA GHIM".
  //     Đoán bừa "sửa tay" ở đây sẽ chặn mọi repo migrate trước khi có cơ chế ghim.
  {
    const root = dungRepo(false);
    try {
      writeFileSync(join(root, mot), `${chuan.get(mot)}\n// khac\n`, "utf8");
      const d = soSanh(root, chuan, docSoGhim(root).so).find((x) => x.rel === mot);
      assert.equal(d.trangThai, "CHƯA GHIM",
        "khong co so ghim thi khong du can cu goi la SUA TAY");
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
  ok("phân biệt được SỬA TAY · CŨ · CHƯA GHIM — ba ca trông giống nhau nếu chỉ so hai chiều");
}

/* ---- 4. `--apply` TỪ CHỐI khi có file bị sửa tay ------------------------- */
{
  // Không có vế này thì `upgrade` chỉ là `cp -r` có nghi thức: nó sẽ xoá bản vá tại chỗ của
  // người khác, im lặng, và không ai biết cho tới lúc thứ gì đó hỏng.
  const root = dungRepo(true);
  try {
    const mot = fileMay(chuan)[0];
    const daSua = `${chuan.get(mot)}\n// mot ban va tai cho\n`;
    writeFileSync(join(root, mot), daSua, "utf8");
    // Ép bản khung khác đi để `--apply` thật sự có việc phải ghi.
    const r = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), "--apply", root], { encoding: "utf8" });
    assert.notEqual(r.status, 0, "co file bi sua tay thi --apply phai TU CHOI");
    assert.match(String(r.stdout) + String(r.stderr), /TU_CHOI|SỬA TAY/, "phai noi ro vi sao tu choi");
    assert.equal(readFileSync(join(root, mot), "utf8"), daSua,
      "tu choi thi phai KHONG dung mot byte nao cua file da sua");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("--apply từ chối khi có file bị sửa tay, và không đụng vào file đó");
}


/* ---- 5. Sổ ghim HỎNG phải DỪNG, không được coi như chưa từng ghim -------- */
{
  // `docSoGhim` bắt mọi lỗi rồi trả `null`. Hậu quả: JSON cắt cụt, sai schema, hay không đọc
  // được đều rơi vào nhánh CHƯA GHIM — và CHƯA GHIM thì bị ghi đè. Tức là **làm hỏng sổ ghim
  // là cách để vượt qua lớp bảo vệ sửa tay**. Ba trạng thái, không phải hai: KHÔNG · CÓ · HỎNG.
  const root = dungRepo(true);
  try {
    writeFileSync(join(root, ".ark", "harness.lock.json"), "{ day la json cut", "utf8");
    const kq = docSoGhim(root);
    assert.equal(kq?.trangThai, "HONG", "so ghim hong phai la HONG, khong duoc lan sang KHONG");
    const r = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), "--apply", root], { encoding: "utf8" });
    assert.notEqual(r.status, 0, "so ghim hong thi --apply phai DUNG");
    assert.match(String(r.stdout) + String(r.stderr), /SO_GHIM_HONG/, "phai noi ro so ghim hong");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("sổ ghim hỏng → dừng, không lẫn sang 'chưa ghim'");
}

/* ---- 6. CHƯA GHIM mà file đã khác → DỪNG --------------------------------- */
{
  // Tài liệu hứa "không đủ căn cứ thì báo, không đoán" — nhưng vòng ghi lại ghi mọi thứ trừ
  // ĐÃ MỚI. Repo cũ chưa ghim mà có file máy đã khác sẽ bị ghi đè MẶC ĐỊNH. Đó đúng là ca
  // nguy hiểm nhất: repo đã sống lâu, không ai biết file đó khác vì sao.
  const root = dungRepo(false);
  try {
    const mot = fileMay(chuan)[0];
    const daSua = `${chuan.get(mot)}\n// khac, va khong biet vi sao\n`;
    writeFileSync(join(root, mot), daSua, "utf8");
    const r = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), "--apply", root], { encoding: "utf8" });
    assert.notEqual(r.status, 0, "chua ghim ma file da khac thi --apply phai DUNG");
    assert.equal(readFileSync(join(root, mot), "utf8"), daSua, "khong duoc dung vao file do");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("chưa ghim mà file đã khác → dừng, không ghi đè");
}

/* ---- 7. File bị LOẠI khỏi bản khung phải hiện ra ------------------------- */
{
  // So sánh chỉ duyệt file của bản MỚI. File từng nằm trong `managed` mà bản mới đã bỏ sẽ ở lại
  // repo mãi mãi, rồi biến mất khỏi sổ ghim lần sau — thành rác vô chủ mà không công cụ nào kể.
  const root = dungRepo(true);
  try {
    const khungMoi = new Map(chuan);
    const bo = fileMay(chuan)[0];
    khungMoi.delete(bo);
    const dong = soSanh(root, khungMoi, docSoGhim(root).so);
    const d = dong.find((x) => x.rel === bo);
    assert.ok(d, "file bi loai khoi ban khung PHAI van hien trong ket qua so sanh");
    assert.equal(d.trangThai, "ĐÃ BỎ", "phai goi ten no la DA BO, khong duoc im lang");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("file bị loại khỏi bản khung hiện ra là ĐÃ BỎ, không thành rác vô chủ");
}

/* ---- 8. Cùng phiên bản mà khác nội dung → DỪNG, và không ghi gì ---------- */
{
  // Bản trích dựng thẳng từ cây làm việc, còn số phiên bản chỉ đọc từ `package.json`. Nên nội
  // dung đổi mà số vẫn nguyên — và chính phép thử "giả bản vá ở bộ khung" của tôi đã đi qua
  // đúng ca này. Một số phiên bản trỏ tới hai nội dung khác nhau thì nó không còn là mốc.
  //
  // Bản kiểm ĐẦU chỉ soi thông báo trên `--plan`. Nó xanh trong khi `--apply` vẫn nâng cấp và
  // vẫn ghi lại sổ ghim — tức là một phép kiểm mang đúng tiêu đề mà không canh gì cả. Nay phải
  // chứng minh cả ba: thoát khác 0 · file trên đĩa không đổi · sổ ghim không đổi.
  for (const [ten, lamHong, ma] of [
    ["dấu vân tay khác", (so) => { so.bundle_digest = "0".repeat(16); }, /CUNG_BAN_KHAC_NOI_DUNG/],
    // Xoá đúng MỘT dòng trong sổ ghim là tắt được cả cửa này, nếu chỉ so khi digest là chuỗi.
    ["không có dấu vân tay", (so) => { delete so.bundle_digest; }, /THIEU_DAU_VAN_TAY/]
  ]) {
    const root = dungRepo(true);
    try {
      const duongSo = join(root, ".ark", "harness.lock.json");
      const so = JSON.parse(readFileSync(duongSo, "utf8"));
      assert.ok(so.bundle_digest, "so ghim phai mang dau van tay cua CA BAN TRICH, khong chi so phien ban");
      lamHong(so);
      writeFileSync(duongSo, JSON.stringify(so, null, 2), "utf8");
      const soTruoc = readFileSync(duongSo, "utf8");

      // Xoá một file máy để `--apply` THẬT SỰ có việc phải ghi — không có vế này thì "không ghi
      // byte nào" đúng một cách rỗng, vì vốn chẳng có gì để ghi.
      const mot = fileMay(chuan)[0];
      rmSync(join(root, mot));

      for (const co of [["--plan"], ["--apply"], ["--apply", "--force"]]) {
        const r = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), ...co, root], { encoding: "utf8" });
        const noi = String(r.stdout) + String(r.stderr);
        assert.match(noi, ma, `${co.join(" ")}: phai goi ten loi (${ten})`);
        if (co.includes("--apply")) {
          // `--force` nói về repo ĐÍCH bị sửa tay; nó không nói gì về số phiên bản ở repo NHÀ,
          // nên nó KHÔNG được mở cửa này.
          assert.notEqual(r.status, 0, `${co.join(" ")}: phai DUNG, khong duoc nang cap tiep`);
          assert.throws(() => readFileSync(join(root, mot)), "khong duoc ghi mot byte nao");
          assert.equal(readFileSync(duongSo, "utf8"), soTruoc, "so ghim phai nguyen ven");
        }
      }
    } finally { rmSync(root, { recursive: true, force: true }); }
    ok(`cùng phiên bản mà ${ten} → dừng, không ghi gì, --force cũng không mở`);
  }
}

/* ---- 9. `ĐÃ BỎ` phải sống sót qua `--apply` ------------------------------ */
{
  // Sổ ghim mới dựng lại `managed` THUẦN từ bản khung hiện hành. Nên tên file đã bỏ rơi khỏi sổ
  // ngay sau lần apply đầu tiên: kể tên đúng một lần rồi im lặng mãi mãi, và file lại thành rác
  // vô chủ y như trước khi có cửa này.
  const root = dungRepo(true);
  try {
    const duongSo = join(root, ".ark", "harness.lock.json");
    const so = JSON.parse(readFileSync(duongSo, "utf8"));
    const daBo = "scripts/mot-file-khung-cu.mjs";
    so.managed[daBo] = "deadbeefdeadbeef";
    writeFileSync(join(root, "scripts", "mot-file-khung-cu.mjs"), "// ban khung cu tung dat o day\n", "utf8");

    const truoc = soSanh(root, chuan, so).find((d) => d.rel === daBo);
    assert.equal(truoc?.trangThai, "ĐÃ BỎ", "lan dau phai keu ten no");

    // Đúng cái sổ ghim mà `--apply` sẽ viết ra.
    const soSau = soGhimMoi(chuan, so, { [daBo]: truoc.bamGhim });
    assert.ok(soSau.retired?.[daBo], "phai nho tiep trong khoi `retired`, khong duoc lan vao `managed`");
    assert.equal(soSau.managed[daBo], undefined, "`managed` la 'se ghi de' — file da bo khong thuoc ve do");

    const sau = soSanh(root, chuan, soSau).find((d) => d.rel === daBo);
    assert.equal(sau?.trangThai, "ĐÃ BỎ", "sau apply van phai keu ten no, khong duoc quen");

    // Người xoá file đi thì nó tự rụng khỏi sổ — không để lại tên ma.
    rmSync(join(root, "scripts", "mot-file-khung-cu.mjs"));
    assert.equal(soSanh(root, chuan, soSau).find((d) => d.rel === daBo), undefined,
      "xoa khoi dia thi phai rung khoi so, khong de lai ten ma");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("ĐÃ BỎ sống sót qua --apply, và tự rụng khi file bị xoá thật");
}

/* ---- 10. Nguon khong nhat quan → DUNG, voi MOI repo dich ---------------- */
{
  // Cua "cung ban khac noi dung" CHI mo khi repo dich dang o dung so ban hien tai. Nen mot lan
  // sua file tang may ma quen tang phien ban la du de phat HAI noi dung duoi CUNG MOT NHAN:
  // repo o ban cu di lot va duoc dong dau ban moi; repo da o ban moi thi bi chan va giu noi dung
  // cu. Hai repo, cung mot con so, hai noi dung — dung cai benh ma so phien ban sinh ra de chua.
  //
  // Loi nay o repo NHA, nen no sai voi MOI repo dich — phai chan truoc khi nhin dich.
  const soPhat = join(ROOT, "RELEASE-LEDGER.json");
  const goc = readFileSync(soPhat, "utf8");
  const root = dungRepo(true);
  try {
    const j = JSON.parse(goc);
    const ban = Object.keys(j.ban).sort().at(-1);
    j.ban[ban] = "f".repeat(16);              // so ghi mot dang, nguon dang song mot neo
    writeFileSync(soPhat, JSON.stringify(j, null, 2), "utf8");

    // Xoa mot file may de --apply THAT SU co viec phai ghi.
    const mot = fileMay(chuan)[0];
    rmSync(join(root, mot));
    for (const co of [["--plan"], ["--apply"], ["--apply", "--force"]]) {
      const r = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), ...co, root], { encoding: "utf8" });
      const noi = String(r.stdout) + String(r.stderr);
      assert.notEqual(r.status, 0, `${co.join(" ")}: nguon khong nhat quan thi phai DUNG`);
      assert.match(noi, /NGUON_KHONG_NHAT_QUAN/, "phai goi ten loi, va noi ro loi o repo NHA");
      assert.throws(() => readFileSync(join(root, mot)), "khong duoc ghi mot byte nao");
    }
  } finally {
    writeFileSync(soPhat, goc, "utf8");
    rmSync(root, { recursive: true, force: true });
  }
  ok("sổ phát hành lệch nguồn → dừng với mọi repo đích, kể cả --force");
}

/* ---- 11. KHONG duoc ha cap repo dich ------------------------------------ */
{
  // Cho so sanh chi nhin NOI DUNG, khong nhin thu tu phien ban. Nen chay bo khung 1.2.3 len mot
  // repo da ghim 1.3.0 thi file cua 1.3.0 bi goi la `CU` — sai han nghia, no MOI HON — roi
  // --apply ghi ban cu de len. Da dung lai duoc ca nay that: repo mat noi dung 1.3.0, so ghim
  // tut ve 1.2.3, thoat 0, khong mot loi canh bao.
  const root = dungRepo(true);
  try {
    const duongSo = join(root, ".ark", "harness.lock.json");
    const so = JSON.parse(readFileSync(duongSo, "utf8"));
    so.version = "99.0.0";                     // dich o ban MOI HON han
    writeFileSync(duongSo, JSON.stringify(so, null, 2), "utf8");

    const mot = fileMay(chuan)[0];
    const rieng = chuan.get(mot) + NL + "// noi dung rieng cua ban moi hon" + NL;
    writeFileSync(join(root, mot), rieng, "utf8");

    const r = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), "--apply", root], { encoding: "utf8" });
    assert.notEqual(r.status, 0, "dich moi hon thi --apply phai DUNG");
    assert.match(String(r.stdout) + String(r.stderr), /HA_CAP/, "phai goi ten no la HA CAP");
    assert.equal(readFileSync(join(root, mot), "utf8"), rieng, "khong duoc ghi ban cu de len ban moi");
    assert.equal(JSON.parse(readFileSync(duongSo, "utf8")).version, "99.0.0", "so ghim khong duoc tut lui");

    // --force van ha cap duoc: lui mot ban va hong LA viec co that.
    const r2 = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), "--apply", "--force", root], { encoding: "utf8" });
    assert.equal(r2.status, 0, "--force phai ha cap duoc — do la mot viec co that, chi can noi ro");
    assert.match(String(r2.stdout) + String(r2.stderr), /HA_CAP/, "ha cap co y thi VAN phai noi to");
  } finally { rmSync(root, { recursive: true, force: true }); }
  ok("repo đích mới hơn → dừng, không ghi đè; --force vẫn lùi được nhưng phải nói to");
}

/* ---- 12. `npm test` / CI phai bat duoc so phat hanh lech ---------------- */
{
  // `upgrade.mjs` chan luc PHAT. Nhung luc do da muon: nguoi van hanh moi biet minh sai khi
  // dang dung truoc mot repo dich. Cho dung de biet la o repo NHA, ngay khi chay bo phep kiem —
  // va do cung la cho CI nhin thay. Khong co ve nay thi cua kia chi la mot cai phanh tay.
  const soPhat = join(ROOT, "RELEASE-LEDGER.json");
  const goc = readFileSync(soPhat, "utf8");
  try {
    const truoc = spawnSync(process.execPath, [join(ROOT, "scripts", "build-template.mjs"), "--check"], { encoding: "utf8" });
    assert.equal(truoc.status, 0, "doi chung: chua dong gi thi --check phai xanh");

    const j = JSON.parse(goc);
    const ban = Object.keys(j.ban).sort().at(-1);
    j.ban[ban] = "0".repeat(16);
    writeFileSync(soPhat, JSON.stringify(j, null, 2), "utf8");
    const r = spawnSync(process.execPath, [join(ROOT, "scripts", "build-template.mjs"), "--check"], { encoding: "utf8" });
    assert.notEqual(r.status, 0, "so phat hanh lech thi `npm test` phai DO");
    // Hai ma deu dung, va cai nao keu la co nghia: neu ban do DA nam trong HEAD thi phep so lich
    // su bat truoc va noi SUA_LICH_SU (cu the hon); neu chua thi moi toi phep so nguon ↔ so.
    assert.match(String(r.stdout) + String(r.stderr), /SO_PHAT_HANH_LECH|SUA_LICH_SU/, "phai goi ten loi");

    // Va bo sinh KHONG duoc tu sua dong cu cho xong chuyen — do la noi doi ve mot ban da phat.
    const g = spawnSync(process.execPath, [join(ROOT, "scripts", "build-template.mjs")], { encoding: "utf8" });
    assert.notEqual(g.status, 0, "bo sinh phai TU CHOI, khong duoc tu ghi de dong cu");
    assert.equal(JSON.parse(readFileSync(soPhat, "utf8")).ban[ban], "0".repeat(16),
      "dong cu phai con nguyen — nguoi quyet, khong phai may");
  } finally { writeFileSync(soPhat, goc, "utf8"); }
  ok("sổ phát hành lệch → npm test đỏ, và bộ sinh từ chối tự sửa dòng cũ");
}

/* ---- 13. So phat hanh HONG / THIEU → DUNG, khong tu ghi lai ------------- */
{
  // Ban dau bat moi loi roi tra `{}`, nen "khong co file" va "file hong" do chung mot ro, va ro
  // do duoc coi la CHUA GHI — ma CHUA GHI thi bo sinh TU GHI DE. Tuc la lam hong so phat hanh la
  // cach vuot qua chinh no: sua nguon, xoa so, chay lai, va cung mot so phien ban duoc dong lai
  // voi dau van tay moi. DUNG cai bay SO_GHIM_HONG da va o v1.2.1, dung lai o mot cho moi.
  const soPhat = join(ROOT, "RELEASE-LEDGER.json");
  const goc = readFileSync(soPhat, "utf8");
  const root = dungRepo(true);
  try {
    for (const [ten, lamHong] of [
      ["hỏng", () => writeFileSync(soPhat, "{ day la json cut", "utf8")],
      ["thiếu khối `ban`", () => writeFileSync(soPhat, JSON.stringify({ _doc: "x" }), "utf8")],
      // KHONG doc duoc, ma cung KHONG phai "khong ton tai". Chi ENOENT moi la "chua co so";
      // moi loi doc khac (khong du quyen, duong dan la thu muc, dia hong) la KHONG BIET — va
      // khong biet thi khong duoc di tiep. Dung thu muc de dung lai ca nay o moi he dieu hanh.
      ["đọc không được", () => { rmSync(soPhat, { force: true }); mkdirSync(soPhat, { recursive: true }); }]
    ]) {
      lamHong();
      const g = spawnSync(process.execPath, [join(ROOT, "scripts", "build-template.mjs")], { encoding: "utf8" });
      assert.notEqual(g.status, 0, `so ${ten}: bo sinh phai DUNG, khong duoc tu ghi lai`);
      assert.match(String(g.stdout) + String(g.stderr), /SO_PHAT_HANH_HONG/, "phai goi ten no la HONG");
      let noiDungSau = "";
      try { noiDungSau = readFileSync(soPhat, "utf8"); } catch { /* la thu muc */ }
      assert.equal(noiDungSau.includes(String.fromCharCode(34) + "ban" + String.fromCharCode(34)), false,
        "KHONG duoc tu dung lai so — do la cach vuot qua chinh no");

      const c = spawnSync(process.execPath, [join(ROOT, "scripts", "build-template.mjs"), "--check"], { encoding: "utf8" });
      assert.notEqual(c.status, 0, `so ${ten}: --check phai DO`);

      const u = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), "--apply", "--force", root], { encoding: "utf8" });
      assert.notEqual(u.status, 0, `so ${ten}: upgrade phai DUNG, ke ca --force`);
      assert.match(String(u.stdout) + String(u.stderr), /NGUON_KHONG_NHAT_QUAN/, "phai noi loi o repo NHA");
    }
  } finally {
    rmSync(soPhat, { recursive: true, force: true });
    writeFileSync(soPhat, goc, "utf8");
    rmSync(root, { recursive: true, force: true });
  }
  ok("sổ phát hành hỏng / sai schema / đọc không được → dừng ở cả ba đường, KHÔNG tự dựng lại");
}

/* ---- 14. Sua doi mot ban DA PHAT → DUNG (doi bien theo cap) ------------- */
{
  // Ve yeu nhat cua so: no TU LAM CHUNG cho chinh no. Sua nguon roi sua luon dong cua ban hien
  // tai cho khop thi moi phep so "nguon ↔ so" deu xanh. Vat doi chieu duy nhat khong sua kem
  // duoc trong cung mot thao tac la ban so DA NAM TRONG HEAD.
  const soPhat = join(ROOT, "RELEASE-LEDGER.json");
  const goc = readFileSync(soPhat, "utf8");
  try {
    const trongHEAD = spawnSync("git", ["show", "HEAD:RELEASE-LEDGER.json"], { cwd: ROOT, encoding: "utf8" });
    if (trongHEAD.status !== 0) { ok("(bỏ qua 14: sổ chưa có trong HEAD — chưa có mốc để đối chiếu)"); }
    else {
      const cu = JSON.parse(trongHEAD.stdout).ban;
      const banCu = Object.keys(cu).sort()[0];
      const j = JSON.parse(goc);
      j.ban[banCu] = "1".repeat(16);        // doi bien theo cap: sua dong CUA MOT BAN DA PHAT
      writeFileSync(soPhat, JSON.stringify(j, null, 2), "utf8");
      for (const lenh of [["build-template.mjs", "--check"], ["build-template.mjs"], ["upgrade.mjs", "--plan", ROOT]]) {
        const r = spawnSync(process.execPath, [join(ROOT, "scripts", lenh[0]), ...lenh.slice(1)], { encoding: "utf8" });
        assert.notEqual(r.status, 0, `${lenh.join(" ")}: sua mot ban DA PHAT thi phai DUNG`);
        assert.match(String(r.stdout) + String(r.stderr), /SUA_LICH_SU/, "phai goi ten no la sua lich su");
      }
      // Va xoa han mot dong cu cung phai bi bat, khong chi doi gia tri.
      const k = JSON.parse(goc); delete k.ban[banCu];
      writeFileSync(soPhat, JSON.stringify(k, null, 2), "utf8");
      const r2 = spawnSync(process.execPath, [join(ROOT, "scripts", "build-template.mjs"), "--check"], { encoding: "utf8" });
      assert.notEqual(r2.status, 0, "xoa mot dong da phat cung la sua lich su");
      ok("sửa (hoặc xoá) một bản ĐÃ PHÁT → dừng — sổ không còn tự làm chứng cho chính nó");
    }
  } finally { writeFileSync(soPhat, goc, "utf8"); }
}

/* ---- 15. Tu choi thi phai tu choi TRUOC khi ghi template/ --------------- */
{
  // Ban dau xoa `template/`, ghi lai 22 file, ROI moi tu choi vi so lech. Nen mot lan chay nham
  // de lai cay lam viec da doi kem ma thoat khac 0 — nguoi dung phai tu doan minh dang o dau.
  const soPhat = join(ROOT, "RELEASE-LEDGER.json");
  const goc = readFileSync(soPhat, "utf8");
  const motFile = join(ROOT, "template", "scripts", "claim.mjs");
  const truoc = readFileSync(motFile, "utf8");
  try {
    writeFileSync(soPhat, "{ hong", "utf8");
    const r = spawnSync(process.execPath, [join(ROOT, "scripts", "build-template.mjs")], { encoding: "utf8" });
    assert.notEqual(r.status, 0, "so hong thi bo sinh phai DUNG");
    assert.equal(readFileSync(motFile, "utf8"), truoc, "tu choi thi template/ phai con NGUYEN");
  } finally { writeFileSync(soPhat, goc, "utf8"); }
  ok("từ chối trước khi ghi — template/ còn nguyên, không để lại trạng thái nửa vời");
}

/* ---- 16. Nhan chung phai la LICH SU, khong phai HEAD ------------------- */
{
  // v1.2.5 so voi `HEAD:RELEASE-LEDGER.json`. Tren CI, HEAD CHINH LA commit dang kiem — nen mot
  // commit sua dong `1.2.4` thi ca file hien tai lan `HEAD:` deu mang gia tri da sua, va phep so
  // thanh ra so mot thu voi chinh no. No chi bat duoc ca sua-ma-CHUA-commit.
  //
  // Nhan chung that: gia tri LAN DAU mot khoa xuat hien. No nam o mot commit da qua, khong sua
  // kem duoc trong cung mot thao tac.
  const cha = mkdtempSync(join(tmpdir(), "witness-"));
  const so = join(cha, "RELEASE-LEDGER.json");
  const git = (...a) => spawnSync("git", a, { cwd: cha, encoding: "utf8" });
  try {
    git("init", "-q", "-b", "main");
    git("config", "user.name", "fixture");
    git("config", "user.email", "fixture@thu.invalid");
    const ghi = (ban) => writeFileSync(so, JSON.stringify({ _doc: "thu", ban }, null, 2), "utf8");

    ghi({ "1.0.0": "aaaaaaaaaaaaaaaa" });
    git("add", "-A"); git("commit", "-q", "-m", "phat 1.0.0");
    assert.equal(soVoiLichSu(cha).trangThai, "NGUYEN_VEN", "vua phat xong thi phai nguyen ven");

    // Them mot ban moi la HOP LE — so nay CHI THEM.
    ghi({ "1.0.0": "aaaaaaaaaaaaaaaa", "1.1.0": "bbbbbbbbbbbbbbbb" });
    git("add", "-A"); git("commit", "-q", "-m", "phat 1.1.0");
    assert.equal(soVoiLichSu(cha).trangThai, "NGUYEN_VEN", "them khoa moi la hop le");

    // VA DAY LA CA v1.2.5 BO LOT: sua mot ban da phat RỒI COMMIT.
    ghi({ "1.0.0": "cccccccccccccccc", "1.1.0": "bbbbbbbbbbbbbbbb" });
    git("add", "-A"); git("commit", "-q", "-m", "sua len mot ban da phat");
    const kq = soVoiLichSu(cha);
    assert.equal(kq.trangThai, "DA_SUA", "sua mot ban DA PHAT roi COMMIT thi van phai bi bat");
    assert.equal(kq.doi[0].ban, "1.0.0");
    assert.equal(kq.doi[0].cu, "aaaaaaaaaaaaaaaa", "phai lay gia tri LAN DAU lam nhan chung");

    // Va xoa han mot ban da phat, cung da commit.
    ghi({ "1.1.0": "bbbbbbbbbbbbbbbb" });
    git("add", "-A"); git("commit", "-q", "-m", "xoa mot ban da phat");
    assert.equal(soVoiLichSu(cha).trangThai, "DA_SUA", "xoa mot ban da phat cung la sua lich su");
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("nhân chứng là lần đầu khoá xuất hiện — sửa một bản đã phát rồi COMMIT vẫn bị bắt");
}

/* ---- 17. Mat nhan chung → KHONG BIET, khong phai "chua co" -------------- */
{
  // `catch → CHUA_CO_TRONG_HEAD` la dung kieu fail-open ma v1.2.1 va v1.2.5 sinh ra de diet — va
  // no se diet luon chinh phep kiem nay. Khong doc duoc lich su thi phai noi KHONG BIET.
  const cha = mkdtempSync(join(tmpdir(), "witness-hong-"));
  try {
    writeFileSync(join(cha, "RELEASE-LEDGER.json"), JSON.stringify({ ban: { "1.0.0": "a".repeat(16) } }), "utf8");
    const kq = soVoiLichSu(cha);          // KHONG phai kho git
    assert.equal(kq.trangThai, "HONG", "khong doc duoc lich su thi la HONG, khong duoc lan sang 'chua co'");
    assert.match(String(kq.loi), /lịch sử git|NÔNG/, "phai noi ro vi sao khong doc duoc");

    // VA PHAI NOI DUOC RA NGOAI. Ham bao HONG ma `kiemSoPhatHanh` nuot mat thi CI — von chi goi
    // qua duong do — van xanh, va ca phep kiem tren chi la mot ham dep khong ai hoi.
    const truyen = kiemSoPhatHanh(chuan, cha);
    assert.equal(truyen.trangThai, "NHAN_CHUNG_HONG", "kiemSoPhatHanh phai truyen HONG ra, khong duoc nuot");
    assert.ok(loiSoPhatHanh(truyen).join(" ").includes("NHAN_CHUNG_HONG"), "va phai co cau giai thich cho nguoi doc");
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("mất nhân chứng → KHÔNG BIẾT (fail-closed), và nói được ra tới cổng kiểm");
}

/* ---- 18. Kho git NONG cung la mat nhan chung ---------------------------- */
{
  // Day dung la cach CI hay lam mac dinh (`actions/checkout` clone nong). Lich su bi cat thi
  // "chua tung thay khoa nay" khong con phan biet duoc voi "commit ghi no nam ngoai phan da tai".
  // Nhan chung cut la nhan chung SAI — te hon khong co, vi no van bao NGUYEN VEN.
  const cha = mkdtempSync(join(tmpdir(), "witness-nong-"));
  const goc = join(cha, "goc");
  const nong = join(cha, "nong");
  try {
    mkdirSync(goc, { recursive: true });
    const g = (...a) => spawnSync("git", a, { cwd: goc, encoding: "utf8" });
    g("init", "-q", "-b", "main");
    g("config", "user.name", "fixture");
    g("config", "user.email", "fixture@thu.invalid");
    for (const [v, d] of [["1.0.0", "a"], ["1.1.0", "b"]]) {
      const truoc = v === "1.0.0" ? {} : { "1.0.0": "a".repeat(16) };
      writeFileSync(join(goc, "RELEASE-LEDGER.json"),
        JSON.stringify({ ban: { ...truoc, [v]: d.repeat(16) } }, null, 2), "utf8");
      g("add", "-A"); g("commit", "-q", "-m", `phat ${v}`);
    }
    const c = spawnSync("git", ["clone", "-q", "--depth", "1", `file://${goc.split("\\").join("/")}`, nong],
      { cwd: cha, encoding: "utf8" });
    if (c.status !== 0) { ok("(bỏ qua 18: máy này không clone nông được)"); }
    else {
      const kq = soVoiLichSu(nong);
      assert.equal(kq.trangThai, "HONG", "kho NONG thi khong du lich su lam nhan chung — phai la HONG");
      assert.match(String(kq.loi), /NÔNG/, "phai noi ro la kho nong, de nguoi ta biet sua bang fetch-depth");
      ok("kho git nông (clone --depth 1) → HỎNG, không được nhận là nguyên vẹn");
    }
  } finally { rmSync(cha, { recursive: true, force: true }); }
}

/* ---- 19. Nhan chung DOC KHONG NOI ≠ nhan chung CHUA CO ------------------ */
{
  // Lo thu tu cung mot hinh dang. Vong doc lich su co `catch { continue }`: mot commit nhan chung
  // parse loi thi bi BO QUA IM LANG, va mot commit MUON HON duoc nhan lam "lan dau". Tuc nhan
  // chung bi thay ma ket qua van NGUYEN VEN — dung cai ma ca co che nay sinh ra de chan.
  //
  // Hai ly do khac han nhau: commit XOA file (bo qua dung) va commit co file ma doc khong noi
  // (KHONG BIET). `cat-file -e` tach duoc hai ca do.
  const cha = mkdtempSync(join(tmpdir(), "witness-doc-"));
  try {
    const git = (...a) => spawnSync("git", a, { cwd: cha, encoding: "utf8" });
    const so = join(cha, "RELEASE-LEDGER.json");
    git("init", "-q", "-b", "main");
    git("config", "user.name", "fixture");
    git("config", "user.email", "fixture@thu.invalid");

    // Hai kieu hong khac nhau, va ca hai deu phai chan: JSON cut, va JSON LANH ma SAI SCHEMA.
    // Kieu thu hai am hiem hon: `JSON.parse` di qua binh thuong, chi toi luc duyet `ban` moi vo.
    //
    // MOI KIEU MOT KHO RIENG. Nhet ca hai vao mot lich su thi vong doc dung o commit hong DAU
    // TIEN va khong bao gio toi kieu thu hai — phep kiem se xanh vi khong chay toi, chu khong
    // phai vi dung. (Da dinh dung bay do o luot dau: dot bien "bo phep kiem schema" van xanh.)
    for (const hong of ["{ day la json cut", JSON.stringify({ _doc: "khong co khoi ban" })]) {
      const rieng = mkdtempSync(join(tmpdir(), "witness-kieu-"));
      try {
        const g = (...a) => spawnSync("git", a, { cwd: rieng, encoding: "utf8" });
        const f = join(rieng, "RELEASE-LEDGER.json");
        g("init", "-q", "-b", "main");
        g("config", "user.name", "fixture");
        g("config", "user.email", "fixture@thu.invalid");
        writeFileSync(f, hong, "utf8");
        g("add", "-A"); g("commit", "-q", "-m", "so hong");
        writeFileSync(f, JSON.stringify({ ban: { "0.9.0": "w".repeat(16) } }, null, 2), "utf8");
        g("add", "-A"); g("commit", "-q", "-m", "so lanh");
        const k = soVoiLichSu(rieng);
        assert.equal(k.trangThai, "HONG", `nhan chung kieu "${hong.slice(0, 24)}" phai bi bat`);
        assert.match(String(k.loi), /đọc không nổi/, "phai noi ro doc khong noi");
      } finally { rmSync(rieng, { recursive: true, force: true }); }
    }

    // Commit 1 cua kho chinh: so HONG — day la NHAN CHUNG DAU TIEN, va no doc khong noi.
    writeFileSync(so, "{ day la json cut", "utf8");
    git("add", "-A"); git("commit", "-q", "-m", "so hong");
    // Commit 2: so lanh lan, mang mot gia tri KHAC.
    writeFileSync(so, JSON.stringify({ ban: { "1.0.0": "z".repeat(16) } }, null, 2), "utf8");
    git("add", "-A"); git("commit", "-q", "-m", "so lanh");

    const kq = soVoiLichSu(cha);
    assert.equal(kq.trangThai, "HONG",
      "nhan chung doc khong noi thi phai la HONG — bo qua no la de mot commit muon hon lam 'lan dau'");
    assert.match(String(kq.loi), /đọc không nổi/, "phai noi ro commit nao, va vi sao");
    assert.match(String(kq.loi), /^.*[0-9a-f]{7}/, "phai chi ra commit cu the de nguoi ta di xem");

    // DOI CHUNG: commit XOA file thi bo qua LA DUNG — khong duoc lan sang HONG, neu khong thi
    // mot lan xoa roi tao lai la khoa vinh vien ca bo khung.
    rmSync(so); git("add", "-A"); git("commit", "-q", "-m", "xoa so");
    writeFileSync(so, JSON.stringify({ ban: { "1.0.0": "z".repeat(16) } }, null, 2), "utf8");
    git("add", "-A"); git("commit", "-q", "-m", "tao lai so");
    const kq2 = soVoiLichSu(cha);
    assert.equal(kq2.trangThai, "HONG", "commit hong o dau lich su van con do, van phai HONG");

    // Va tren mot lich su SACH co commit xoa, thi commit xoa phai duoc bo qua binh thuong.
    const cha2 = mkdtempSync(join(tmpdir(), "witness-xoa-"));
    try {
      const g2 = (...a) => spawnSync("git", a, { cwd: cha2, encoding: "utf8" });
      const so2 = join(cha2, "RELEASE-LEDGER.json");
      g2("init", "-q", "-b", "main");
      g2("config", "user.name", "fixture");
      g2("config", "user.email", "fixture@thu.invalid");
      writeFileSync(so2, JSON.stringify({ ban: { "1.0.0": "y".repeat(16) } }, null, 2), "utf8");
      g2("add", "-A"); g2("commit", "-q", "-m", "phat 1.0.0");
      rmSync(so2); g2("add", "-A"); g2("commit", "-q", "-m", "lo tay xoa");
      writeFileSync(so2, JSON.stringify({ ban: { "1.0.0": "y".repeat(16) } }, null, 2), "utf8");
      g2("add", "-A"); g2("commit", "-q", "-m", "khoi phuc");
      assert.equal(soVoiLichSu(cha2).trangThai, "NGUYEN_VEN",
        "commit XOA file phai duoc bo qua binh thuong — khong thi mot lan xoa la khoa vinh vien");
    } finally { rmSync(cha2, { recursive: true, force: true }); }
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("nhân chứng đọc không nổi → HỎNG; còn commit XOÁ file thì bỏ qua bình thường");
}

/* ---- 20. Phep DO cung phai ba trang thai --------------------------------- */
{
  // Lo thu NAM cung mot hinh dang, va lan nay o chinh phep do su ton tai.
  // `cat-file -e` tra khac 0 cho CA HAI: "duong dan khong co o commit nay" va "git/kho object
  // hong". Bat chung roi `continue` la lai goi ca thu hai la "commit xoa file" va bo qua.
  //
  // Ca "git hong GIUA CHUNG" khong dung noi bang mot kho that: git da chay duoc cho `log` thi no
  // chay duoc cho `ls-tree`. Nen ham nhan mot bo chay git tiem vao — khong tiem duoc thi nhanh
  // do khong co cach nao chay toi, ma nhanh khong chay toi duoc thi no chua bao gio la lop bao ve.
  const cha = mkdtempSync(join(tmpdir(), "witness-do-"));
  try {
    const g = (...a) => spawnSync("git", a, { cwd: cha, encoding: "utf8" });
    const so = join(cha, "RELEASE-LEDGER.json");
    g("init", "-q", "-b", "main");
    g("config", "user.name", "fixture");
    g("config", "user.email", "fixture@thu.invalid");
    writeFileSync(so, JSON.stringify({ ban: { "1.0.0": "v".repeat(16) } }, null, 2), "utf8");
    g("add", "-A"); g("commit", "-q", "-m", "phat 1.0.0");

    assert.equal(soVoiLichSu(cha).trangThai, "NGUYEN_VEN", "doi chung: kho lanh phai nguyen ven");

    // Bo chay git that, tru dung lenh `ls-tree` — mo phong kho object hong giua chung.
    const that = (...a) => execFileSync("git", a, { cwd: cha, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    const hongDo = (...a) => {
      if (a[0] === "ls-tree") throw new Error("fatal: not a tree object");
      return that(...a);
    };
    const kq = soVoiLichSu(cha, hongDo);
    assert.equal(kq.trangThai, "HONG",
      "do khong duoc thi la KHONG BIET — khong duoc goi la 'commit xoa file' roi bo qua");
    assert.match(String(kq.loi), /không dò được/, "phai noi ro la KHONG DO DUOC, khong phai 'khong co'");

    // DOI CHUNG DUONG: `ls-tree` chay duoc va tra RONG thi dung la khong co — phai bo qua binh
    // thuong. Khong co ve nay thi mot commit xoa file la khoa vinh vien ca bo khung.
    const rong = (...a) => (a[0] === "ls-tree" ? "" : that(...a));
    assert.equal(soVoiLichSu(cha, rong).trangThai, "NGUYEN_VEN",
      "ls-tree chay duoc ma tra rong = duong dan khong co o commit do — bo qua hop le");
  } finally { rmSync(cha, { recursive: true, force: true }); }
  ok("phép dò ba trạng thái: không có → bỏ qua · dò không được → HỎNG");
}

/* ---- 20. TEN LENH: thieu thi mang sang, KHAC thi khong bao gio ghi de ----
 *
 * Ca that do 07/09 tai `ALL_SKILL_MANAGEMENT`: co `scripts/session-check.mjs` ma khong co
 * `npm run gate`. Ba luot migrate deu dua CONG toi ma khong dua TEN GOI toi, vi lenh nang cap
 * chep file va chua bao gio cham `package.json`. Cong co mat ma khong ai goi duoc bang ten
 * chuan thi tren thuc te no khong ton tai — va bang thi dem ra "co file".
 */
{
  const chuan = JSON.stringify({ name: "t", scripts: {
    gate: "node scripts/session-check.mjs",
    push: "node scripts/safe-push.mjs",
    test: "node tests/harness-smoke.mjs"
  } });

  // THIEU thi ke ten de mang sang.
  const a = soSanhLenh(JSON.stringify({ name: "d", scripts: { push: "node scripts/safe-push.mjs" } }), chuan);
  assert.deepEqual(a.thieu.map((x) => x[0]).sort(), ["gate", "test"]);
  assert.deepEqual(a.khac, []);

  // KHAC thi CHI ke ten. Repo dich da tu quyet gia tri do — ghi de la xoa quyet dinh cua
  // nguoi ta, va hong IM LANG: `npm test` van xanh, chi la no khong con chay dung cai cu.
  const b = soSanhLenh(JSON.stringify({ scripts: { test: "vitest run", gate: "node scripts/session-check.mjs", push: "x" } }), chuan);
  assert.deepEqual(b.khac.map((x) => x[0]).sort(), ["push", "test"]);
  assert.deepEqual(b.thieu, []);
  const daGhep = JSON.parse(ghepLenh(JSON.stringify({ scripts: { test: "vitest run" } }), b.thieu.concat(a.thieu)));
  assert.equal(daGhep.scripts.test, "vitest run", "GHI DE mot khoa da co — dung ra phai giu nguyen");
  assert.equal(daGhep.scripts.gate, "node scripts/session-check.mjs");

  // GHEP KHONG DUOC LAM MAT gi khac trong package.json: ten, phien ban, phu thuoc.
  const day = JSON.stringify({ name: "d", version: "9.9.9", type: "module",
    dependencies: { x: "1" }, scripts: { push: "node scripts/safe-push.mjs" } });
  const g = JSON.parse(ghepLenh(day, soSanhLenh(day, chuan).thieu));
  assert.equal(g.name, "d");
  assert.equal(g.version, "9.9.9");
  assert.equal(g.type, "module");
  assert.deepEqual(g.dependencies, { x: "1" });
  assert.equal(Object.keys(g.scripts).length, 3);

  // DOC KHONG RA = KHONG BIET, khong phai "khong thieu gi". Thieu han file, hong cu phap,
  // hay khong phai mot khoi — ca ba phai tra `null`, va `--apply` khong cham mot byte nao.
  // Lam tron ve `{thieu:[]}` la mot repo `package.json` hong lang le khong bao gio nhan lenh.
  assert.equal(soSanhLenh(null, chuan), null, "thiếu package.json phải là KHÔNG BIẾT");
  assert.equal(soSanhLenh("{ hong", chuan), null, "package.json hỏng cú pháp phải là KHÔNG BIẾT");
  assert.equal(soSanhLenh("[]", chuan), null, "package.json không phải khối phải là KHÔNG BIẾT");
  assert.equal(soSanhLenh(chuan, null), null, "bản trích đọc không ra cũng phải là KHÔNG BIẾT");

  // Khong co khoi `scripts` la con so 0, KHAC voi doc khong ra.
  const khongScripts = soSanhLenh(JSON.stringify({ name: "d" }), chuan);
  assert.notEqual(khongScripts, null, "package.json đọc được mà chưa có `scripts` KHÁC với đọc không ra");
  assert.equal(khongScripts.thieu.length, 3);

  // BAN TRICH THAT phai mang du ten lenh cho moi file may that phat di. Ve nay la ve chong
  // TROI: them mot script moi vao `scripts/` roi quen khai lenh la repo dich nhan file ma
  // khong nhan ten goi — dung ca da xay ra ba lan.
  const chuanThat = buildTemplateFiles();
  const lenhThat = JSON.parse(chuanThat.get("package.json")).scripts;
  const rong = soSanhLenh(JSON.stringify({ name: "moi" }), chuanThat.get("package.json"));
  assert.equal(rong.thieu.length, Object.keys(lenhThat).length,
    "repo trắng phải nhận ĐỦ mọi tên lệnh bản trích khai");
  for (const [k, v] of Object.entries(lenhThat)) {
    for (const m of String(v).matchAll(/node ((?:scripts|tests|bang-song)\/[\w.-]+)/g)) {
      assert.ok(chuanThat.has(m[1]),
        `lệnh \`npm run ${k}\` gọi ${m[1]} mà bản trích KHÔNG phát file đó — repo đích sẽ gõ một lệnh chết`);
    }
  }
  ok(`tên lệnh: thiếu thì mang · khác thì chỉ kể tên · đọc không ra là KHÔNG BIẾT · ${Object.keys(lenhThat).length} lệnh bản trích đều trỏ tới file có thật`);
}

/* ---- 21. DU LIEU MAY: bo do phai di CUNG thu no do -----------------------
 *
 * Cung mot lo, lan thu ba. 1.3.26: `bang-song/` bi loai vi tang may dinh nghia theo TEN THU MUC.
 * 1.3.35: ten lenh khong duoc phat vi khong tang nao nhan `package.json`. 07/09: `features.json`
 * bi loai vi phep "theo duoi file" chi nhan thu CHAY DUOC — nen `--apply` gui `features.mjs` toi
 * ma khong gui thu no doc, va tinh nang `F9.2` cua chinh danh muc do khong bao gio xanh o repo
 * dich. Ve nay dong lo do lai bang mot CAU HOI, khong bang mot danh sach ten file.
 *
 * BON DOT BIEN DA CHAY THAT (07/09) — moi cai chet o DUNG mot phep khac nhau:
 *   1. bo `features.json` khoi tang may  -> [3] "scripts/features.mjs nhac features.json"
 *   2. go sai ten trong danh sach        -> [1] "khai feature.json ma ban trich KHONG co"
 *   3. keo `package.json` vao tang may   -> [2] "la cua repo dich ma tang may nhan no"
 *   4. dau van tay chi phu file chay duoc -> [4] "dau van tay khong phu du lieu may"
 *
 * LUOT DO DAU TIEN KHONG DUNG. Ca bon dot bien "chet", nhung chet vi cong dau van tay ban
 * phat no TRUOC — ve 21 chua he chay. Mot dot bien chet vi ly do khac doc y het mot dot bien
 * bi bat, va no chung minh khong gi ca. Phai chay rieng bon phep nay moi thay duoc, va luc do
 * lo ra rang phep [3] con dang HONG: no nem SyntaxError chu khong assert.
 */
{
  const chuan = buildTemplateFiles();
  const may = new Set(fileMay(chuan));

  // 1. Moi ten khai trong danh sach phai CO THAT trong ban trich. Mot ten go sai la mot file
  //    im lang khong bao gio duoc phat — dung kieu hong ma ve nay sinh ra de chan.
  for (const rel of TEP_MAY_THEM) {
    assert.ok(chuan.has(rel), `TEP_MAY_THEM khai "${rel}" mà bản trích KHÔNG có file đó`);
    assert.ok(may.has(rel), `"${rel}" khai là dữ liệu máy mà fileMay() không nhận`);
  }

  // 2. KHONG duoc keo file CUA REPO DICH vao tang may. Ghi de `package.json` hay
  //    `.repo-structure.json` cua ho la xoa repo cua ho, va no hong IM LANG.
  for (const rel of TEP_CUA_REPO_DICH) {
    assert.ok(chuan.has(rel), `phép ghim đang canh "${rel}" mà bản trích không có — sửa danh sách`);
    assert.ok(!may.has(rel), `"${rel}" là file CỦA REPO ĐÍCH mà tầng máy lại nhận nó`);
  }

  // 3. CAU HOI TONG QUAT: file may nao DOC mot file du lieu o goc repo bang ten, thi file do
  //    phai nam trong tang may. Quet chinh ma nguon, khong doc mot danh sach nao — them mot
  //    file du lieu moi roi quen khai thi ve nay DO, chu khong doi ai nho.
  const goc = [...chuan.keys()].filter((r) => !r.includes("/") && /\.(json|txt)$/.test(r));
  const thieu = [];
  for (const rel of fileMay(chuan)) {
    if (!rel.endsWith(".mjs")) continue;
    const ma = String(chuan.get(rel));
    for (const ten of goc) {
      if (TEP_CUA_REPO_DICH.includes(ten) || may.has(ten)) continue;
      /* PHEP DO PHAI DON GIAN DEN MUC KHONG THE VIET SAI.
       *
       * Ban dau cho nay dung mot `new RegExp` ghep tu chuoi, va no HONG: dau cheo bi an mot
       * lop nen bieu thuc thanh `Unterminated group` — tuc phep kiem NEM SyntaxError chu khong
       * assert. Va no khong lo ra o lan chay xanh, vi nhanh nay chi vao khi co file chua duoc
       * phat: dung mot phep kiem KHONG BAO GIO DO. Do duoc 07/09 luc dot bien that.
       *
       * Nen doi sang phep tim chuoi thuan: ten file co xuat hien trong ngoac o ma nguon hay
       * khong. Tho hon — mot ten nhac trong chu cung tinh — nhung khong the viet sai, va khi
       * no bao thi cach xu dung la PHAT file do, khong phai noi long phep kiem. */
      const nhac = [String.fromCharCode(34), "'", "`"].some((q) => ma.includes(q + ten + q));
      if (nhac) thieu.push(`${rel} nhắc ${ten}`);
    }
  }
  assert.deepEqual(thieu, [],
    `file máy đọc một file dữ liệu mà file đó KHÔNG được phát: ${thieu.join(" · ")}`);

  // 4. Dau van tay ban phat phai PHU du lieu may. Khong phu thi doi noi dung `features.json`
  //    ma khong tang phien ban se di lot, va so phat hanh noi doi ve mot ban DA PHAT.
  const doi = new Map(chuan);
  doi.set("features.json", String(chuan.get("features.json")).replace('"version"', '"ban_doi_roi"'));
  assert.notEqual(bamBanTrich(doi), bamBanTrich(chuan),
    "đổi features.json mà dấu vân tay bản phát không đổi — sổ phát hành sẽ nói dối");

  /* VÀ PHỦ CẢ CÁI HOOK — ca thật của 1.8.9, cộng ca mà vòng audit 10/09 lôi ra.
     Hai hook TRÁI NGƯỢC nhau và ĐỀU mất dòng `#!` vẫn phải cho hai dấu vân tay khác nhau. Bản vá
     đầu của tôi cho chúng cùng một dấu, vì tư cách tầng máy khi đó đọc từ nội dung. */
  const hookTat = new Map(chuan);
  hookTat.set(".githooks/commit-msg", "#!/bin/sh\nexit 0\n");
  assert.notEqual(bamBanTrich(hookTat), bamBanTrich(chuan),
    "vo hieu hoa cua index ma dau van tay khong doi — dung ca ban 1.8.9");
  const khongShebang0 = new Map(chuan); khongShebang0.set(".githooks/commit-msg", "exit 0\n");
  const khongShebang1 = new Map(chuan); khongShebang1.set(".githooks/commit-msg", "exit 1\n");
  assert.notEqual(bamBanTrich(khongShebang0), bamBanTrich(khongShebang1),
    "hai hook trai nguoc nhau, deu mat dong #!, van phai khac dau van tay — tu cach tang may KHONG duoc doc tu noi dung");
  ok(`dữ liệu máy: ${TEP_MAY_THEM.length} file khai đều có thật · ${TEP_CUA_REPO_DICH.length} file của repo đích đều bị loại · bộ đo đi cùng thứ nó đo · dấu vân tay phủ được`);
}

/* VE 25 — CUA INDEX PHAI BAT THAT O REPO DICH, khong chi in ra mot cau.
 * `core.hooksPath` la cau hinh MOI BAN SAO: mang `.githooks/commit-msg` sang ma khong bat la
 * mang mot co che DA TAT, va trieu chung y het luc chua mang gi. Ca that 10/09: `upgrade.mjs`
 * dung `execFileSync` ma KHONG import no; `catch` quanh cho nuot `ReferenceError` thanh mot
 * dong canh bao, nen cua nay chua tung bat o BAT KY repo nao da nang cap. Lop `try/catch` mem
 * bien mot loi cu phap thanh mot cai nhun vai — nen ve nay do CHINH CAU HINH, khong doc chu in.
 */
{
  const rieng = mkdtempSync(join(tmpdir(), "ark-cua-index-"));
  try {
    execFileSync("git", ["init", "--quiet"], { cwd: rieng, stdio: "pipe" });
    const ra = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), rieng, "--apply"],
      { encoding: "utf8" });
    assert.equal(ra.status, 0, `--apply phai xong: ${ra.stdout}${ra.stderr}`);
    assert.ok(existsSync(join(rieng, ".githooks", "commit-msg")),
      "phai mang duoc .githooks/commit-msg sang, khong co no thi ve nay do rong");
    /* `--local`, KHONG `--get`: `--get` doc ca global/system, nen tren mot may co
       `core.hooksPath` global ve nay se XANH ma khong chung minh gi ve repo dich. Codex neu 10/09.
       `--local` THOAT 1 khi khoa chua dat -> khong bat thi ve do bang stack trace, va Duc doc mot
       dong "Command failed" thay vi biet cua nao chua bat. */
    let troToi = "(chưa đặt)";
    try {
      troToi = execFileSync("git", ["config", "--local", "--get", "core.hooksPath"],
        { cwd: rieng, encoding: "utf8" }).trim();
    } catch { /* chua dat — de nguyen nhan de cau ĐỎ noi duoc */ }
    assert.equal(troToi, ".githooks",
      `core.hooksPath phai bang ".githooks" o repo dich, dang "${troToi}" — cua index chua bat`);
    assert.ok(!/không bật được/.test(ra.stdout),
      `--apply in ra canh bao khong bat duoc cua: ${ra.stdout}`);
  } finally { rmSync(rieng, { recursive: true, force: true }); }

  /* CA THU HAI: repo dich DA co hooksPath RIENG cua no -> KHONG duoc ghi de. Nhanh nay co trong
     ma nhung chua ai ghim; Codex neu 10/09. Ghi de la xoa hook cua nguoi ta, va hong IM LANG vi
     `--apply` van thoat 0. */
  {
    const rieng2 = mkdtempSync(join(tmpdir(), "ark-hook-rieng-"));
    try {
      execFileSync("git", ["init", "--quiet"], { cwd: rieng2, stdio: "pipe" });
      execFileSync("git", ["config", "--local", "core.hooksPath", ".hook-cua-toi"], { cwd: rieng2, stdio: "pipe" });
      const ra2 = spawnSync(process.execPath, [join(ROOT, "scripts", "upgrade.mjs"), rieng2, "--apply"],
        { encoding: "utf8" });
      assert.equal(ra2.status, 0, `--apply phai xong: ${ra2.stdout}${ra2.stderr}`);
      const con = execFileSync("git", ["config", "--local", "--get", "core.hooksPath"],
        { cwd: rieng2, encoding: "utf8" }).trim();
      assert.equal(con, ".hook-cua-toi",
        `hooksPath RIENG cua repo dich bi ghi de thanh "${con}" — do la xoa hook cua nguoi ta`);
      assert.match(ra2.stdout, /hook-cua-toi/,
        `khong ghi de thi phai NEU TEN cho no dang tro toi, im lang la de nguoi ta tuong cua da bat: ${ra2.stdout}`);
    } finally { rmSync(rieng2, { recursive: true, force: true }); }
  }
  ok("cửa index BẬT THẬT ở repo đích — đo `core.hooksPath`, không đọc chữ in");
}

console.log(`
${passed} passed, 0 failed, ${passed} total`);
