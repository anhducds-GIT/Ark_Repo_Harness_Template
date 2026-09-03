/* GHIM PHIÊN BẢN + NÂNG CẤP — phép kiểm phá.
 *
 * Điều đáng canh nhất KHÔNG phải "có chép file sang không" (chép thì dễ), mà là **có biết dừng
 * lại khi file đích đã bị sửa tay không**. Không có vế đó thì `upgrade` chỉ là `cp -r` có nghi
 * thức, và nó sẽ xoá bản vá tại chỗ của người khác mà không để lại dấu vết nào.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildTemplateFiles, kiemSoPhatHanh, loiSoPhatHanh, soVoiLichSu } from "../scripts/build-template.mjs";
import { docSoGhim, fileMay, soGhimMoi, soSanh } from "../scripts/upgrade.mjs";

let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };
const NL = String.fromCharCode(10);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
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
  assert.ok(ds.every((r) => r.startsWith("scripts/") || r.startsWith("tests/")),
    "chi duoc nang cap scripts/ va tests/");
  assert.ok(!ds.includes("AGENTS.md") && !ds.includes("STATUS.md") && !ds.includes("HANDOFF.md"),
    "luat va trang thai KHONG duoc nam trong tap tu dong ghi de");
  assert.ok(ds.length >= 6, `phai co it nhat 6 file may, dang ${ds.length}`);
  ok("chỉ tầng máy được nâng cấp — luật và trạng thái không bị đụng");
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

console.log(`
${passed} passed, 0 failed, ${passed} total`);
