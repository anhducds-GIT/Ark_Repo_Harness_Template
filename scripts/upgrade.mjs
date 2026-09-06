/* GHIM PHIÊN BẢN VÀ NÂNG CẤP — để vá bộ khung không còn phải chép tay sang từng repo.
 *
 *   node scripts/upgrade.mjs --plan  <đường-dẫn-repo>    # chỉ xem, KHÔNG ghi
 *   node scripts/upgrade.mjs --apply <đường-dẫn-repo>    # ghi, và cập nhật sổ ghim
 *
 * VÌ SAO CÓ FILE NÀY. Ngày 03/09, trong đúng một phiên, tôi phải chép tay `session-check.mjs`
 * sang hai repo **ba lần** vì vá liên tục. Với 21 repo thì mỗi vòng vá là 63 lần chép tay, và
 * mỗi lần chép tay là một cơ hội để hai bản trôi khỏi nhau. Đó chính là cách "một bộ khung" biến
 * thành "21 bộ khung khác nhau" — đúng cái bệnh cả chương trình này sinh ra để chữa.
 *
 * SỔ GHIM `.ark/harness.lock.json` ở repo ĐÍCH trả lời ba câu mà trước đây không ai trả lời được:
 *   - repo này đang dùng bản khung nào?
 *   - file máy nào là của bộ khung (được phép ghi đè), file nào là của repo?
 *   - từ lần ghim tới nay, có ai sửa tay file của bộ khung không?
 *
 * CÂU THỨ BA LÀ LÝ DO CHÍNH. Không có nó thì nâng cấp = ghi đè mù, và một bản vá tại chỗ của
 * người khác biến mất không dấu vết. Nên `--apply` **TỪ CHỐI** khi file đích đã bị sửa tay, trừ
 * khi nói rõ `--force`.
 *
 * CHỈ ĐỌC khi `--plan`. Không ghi một byte nào.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { bam, bamBanTrich, buildTemplateFiles, fileMay, kiemSoPhatHanh,
  loiSoPhatHanh, TEMPLATE_VERSION } from "./build-template.mjs";

/* Ba hàm này mô tả BẢN TRÍCH, không mô tả việc nâng cấp, nên nhà của chúng là
   `build-template.mjs`. Giữ lại lối vào cũ ở đây để không bẻ nơi đang gọi. */
export { bamBanTrich, fileMay };

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NL = String.fromCharCode(10);
const SO_GHIM = ".ark/harness.lock.json";


/* BA TRẠNG THÁI, KHÔNG PHẢI HAI.
 *
 * Bản đầu bắt mọi lỗi rồi trả `null`, nên JSON cắt cụt / sai schema / không đọc được đều rơi
 * vào nhánh "chưa từng ghim" — mà nhánh đó thì ĐƯỢC GHI ĐÈ. Tức là **làm hỏng sổ ghim là cách
 * vượt qua lớp bảo vệ sửa tay**: xoá nửa file lock rồi chạy `--apply` là mọi bản vá tại chỗ
 * biến mất hợp lệ. Audit độc lập bắt được 03/09. */
export function docSoGhim(repo) {
  const duong = path.join(repo, ...SO_GHIM.split("/"));
  let raw;
  try { raw = fs.readFileSync(duong, "utf8"); }
  catch (e) { return e?.code === "ENOENT" ? { trangThai: "KHONG" } : { trangThai: "HONG", loi: String(e.message).split(NL)[0] }; }
  let so;
  try { so = JSON.parse(raw); } catch (e) { return { trangThai: "HONG", loi: String(e.message).split(NL)[0] }; }
  if (!so || typeof so.managed !== "object" || so.managed === null || typeof so.version !== "string") {
    return { trangThai: "HONG", loi: "thiếu trường bắt buộc: version (chuỗi) và managed (khối)" };
  }
  return { trangThai: "CO", so };
}

/* SO BA CHIỀU, không phải hai.
 *
 * Hai chiều ("bản khung" vs "bản ở repo") chỉ nói được KHÁC hay GIỐNG. Nó không phân biệt được
 * hai ca hoàn toàn khác nhau: repo đang ghim một bản CŨ hợp lệ, và repo có người SỬA TAY file
 * của bộ khung. Ca đầu nâng cấp là xong; ca sau nâng cấp là mất việc của người ta.
 *
 * Chiều thứ ba là dấu vân tay đã ghi trong sổ ghim lúc lắp. */
export function soSanh(repo, chuan, soGhim) {
  const ra = [];
  /* FILE ĐÃ BỊ LOẠI KHỎI BẢN KHUNG cũng phải hiện ra. Bản đầu chỉ duyệt file của bản MỚI, nên
     một file từng nằm trong `managed` mà bản mới đã bỏ sẽ ở lại repo mãi mãi, rồi biến mất khỏi
     sổ ghim lần sau — thành rác vô chủ mà không công cụ nào kể tên. */
  const daBiet = { ...(soGhim?.managed ?? {}), ...(soGhim?.retired ?? {}) };
  for (const rel of Object.keys(daBiet)) {
    if (chuan.has(rel)) continue;
    let coTrenDia = true;
    try { fs.readFileSync(path.join(repo, ...rel.split("/"))); } catch { coTrenDia = false; }
    if (coTrenDia) ra.push({ rel, trangThai: "ĐÃ BỎ", bamGhim: daBiet[rel] ?? null });
  }
  for (const rel of fileMay(chuan)) {
    const moi = chuan.get(rel);
    let dangCo = null;
    try { dangCo = fs.readFileSync(path.join(repo, ...rel.split("/")), "utf8"); } catch { /* thiếu */ }
    const bamMoi = bam(moi);
    const bamCo = dangCo === null ? null : bam(dangCo);
    const bamGhim = soGhim?.managed?.[rel] ?? null;

    if (dangCo === null) { ra.push({ rel, trangThai: "THIẾU" }); continue; }
    if (bamCo === bamMoi) { ra.push({ rel, trangThai: "ĐÃ MỚI" }); continue; }
    // Khác bản khung. Câu hỏi thật: khác vì bộ khung tiến lên, hay vì repo bị sửa tay?
    if (bamGhim !== null && bamCo !== bamGhim) { ra.push({ rel, trangThai: "SỬA TAY" }); continue; }
    ra.push({ rel, trangThai: bamGhim === null ? "CHƯA GHIM" : "CŨ" });
  }
  return ra;
}


/* TÀI LIỆU BẢN TRÍCH MÀ REPO ĐÍCH CHƯA CÓ — chỉ mang cái THIẾU, không đụng cái đã có.

   VÌ SAO CÓ. Vấp thật 06/09, lượt nâng `ALL_SKILL_MANAGEMENT` từ 1.3.8 lên 1.3.11: bản trích
   vừa thêm `docs/LEGEND.md` và `docs/HUONG-DAN.md`, nhưng `upgrade.mjs` chỉ đẩy tầng MÁY nên
   hai file đó không tới, phải chép tay. Nghĩa là mọi repo đã lắp **đóng băng ở tầng tài liệu**
   tại thời điểm lắp — mà repo đang sống mới là chỗ cần sổ tay.

   VÌ SAO CHỈ MANG CÁI THIẾU. Tài liệu là chữ mà repo đích ĐƯỢC PHÉP sửa cho nghề của mình —
   khác hẳn tầng máy. Ghi đè một `MULTIFLOW.md` đã được sửa cho repo đó là xoá việc của người
   ta, và `upgrade.mjs` tồn tại chính vì nó TỪ CHỐI làm thế. Nên: thiếu thì mang, có thì kể tên
   và để người tự trộn.

   Cố ý KHÔNG tính vào dấu vân tay bản phát: dấu vân tay chỉ gồm tầng máy, vì chỉ tầng máy được
   nâng tự động và chỉ nó quyết định danh tính một bản. */
export function fileTaiLieu(chuan) {
  return [...chuan.keys()].filter((rel) => rel.startsWith("docs/"));
}

export function soSanhTaiLieu(repo, chuan) {
  const ra = [];
  for (const rel of fileTaiLieu(chuan)) {
    let dangCo = null;
    try { dangCo = fs.readFileSync(path.join(repo, ...rel.split("/")), "utf8"); } catch { /* thiếu */ }
    if (dangCo === null) { ra.push({ rel, trangThai: "THIẾU" }); continue; }
    ra.push({ rel, trangThai: bam(dangCo) === bam(chuan.get(rel)) ? "ĐÃ MỚI" : "KHÁC" });
  }
  return ra;
}

/* `giuLai` = file bản khung ĐÃ BỎ nhưng vẫn còn nằm ở repo đích.
 *
 * Không có tham số này thì `ĐÃ BỎ` chỉ kể tên được ĐÚNG MỘT LẦN: sổ ghim mới dựng lại `managed`
 * thuần từ bản khung hiện hành, nên ngay sau `--apply` cái tên đó rơi khỏi sổ, và lần xem sau
 * file lại thành rác vô chủ y như trước khi có cửa này. Nó nằm ở khối `retired` riêng, không lẫn
 * vào `managed`: `managed` là "bộ khung sẽ ghi đè file này", còn `retired` là "bộ khung từng đặt
 * file này ở đây, nay không phát nữa — người quyết xoá hay giữ". Xoá khỏi đĩa thì tự rụng khỏi sổ. */
export function soGhimMoi(chuan, cu, giuLai = {}) {
  const managed = {};
  for (const rel of fileMay(chuan)) managed[rel] = bam(chuan.get(rel));
  const x = new Date();
  const z = (n) => String(n).padStart(2, "0");
  return {
    _doc: "Repo này đang dùng bản khung nào, và file máy nào là của bộ khung. SINH TỰ ĐỘNG bởi upgrade.mjs — đừng sửa tay.",
    source: "https://github.com/anhducds-GIT/Ark_Repo_Harness_Template",
    version: TEMPLATE_VERSION,
    bundle_digest: bamBanTrich(chuan),
    applied_at: `${x.getFullYear()}-${z(x.getMonth() + 1)}-${z(x.getDate())}`,
    previous_version: cu?.version ?? null,
    managed,
    ...(Object.keys(giuLai).length ? { retired: giuLai } : {})
  };
}

/* ---- chạy ------------------------------------------------------------------ */

const THIS = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(THIS)) {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const force = args.includes("--force");
  const dich = args.find((a) => !a.startsWith("--"));
  if (!dich || (!apply && !args.includes("--plan"))) {
    console.error("Dùng: node scripts/upgrade.mjs --plan|--apply <đường-dẫn-repo> [--force]");
    process.exit(2);
  }
  const repo = path.resolve(dich);
  let dang;
  try { dang = fs.statSync(repo); } catch { dang = null; }
  if (!dang?.isDirectory()) {
    console.error(`TU_CHOI: "${repo}" không phải một thư mục repo.`);
    process.exit(2);
  }

  const chuan = buildTemplateFiles();

  /* CỬA THỨ NHẤT: NGUỒN PHẢI TỰ NHẤT QUÁN — trước khi nhìn repo đích một chút nào.
   *
   * Cửa "cùng số bản, khác nội dung" ở dưới CHỈ mở khi repo đích đang ở đúng số bản hiện tại.
   * Nên một lần sửa file tầng máy mà quên tăng phiên bản là đủ để phát hai nội dung dưới cùng
   * một nhãn: repo đang ở bản cũ đi lọt (không vào cửa đó) và được đóng dấu bản mới, còn repo
   * đã ở bản mới thì bị chặn và giữ nội dung cũ. Hai repo, cùng một con số, hai nội dung.
   *
   * Sổ phát hành ghi lại "bản này là nội dung nào", nên chỗ này so được. Và nó phải chặn ở ĐÂY,
   * không phải ở cửa dưới: lỗi nằm ở repo NHÀ, nên nó sai với MỌI repo đích. */
  const nguon = kiemSoPhatHanh(chuan);
  if (nguon.trangThai !== "KHOP") {
    console.error(`${NL}NGUON_KHONG_NHAT_QUAN: bộ khung ở đây không phát được.`);
    for (const dong of loiSoPhatHanh(nguon)) console.error(dong);
    console.error(`Chưa đọc repo đích, chưa ghi gì. Sửa ở repo NHÀ rồi chạy lại.${NL}`);
    process.exit(3);
  }

  const doc = docSoGhim(repo);

  // SỔ GHIM HỎNG THÌ DỪNG NGAY, trước cả khi so sánh. Coi nó như "chưa từng ghim" biến việc
  // làm hỏng file lock thành đường vòng qua mọi lớp bảo vệ phía dưới.
  if (doc.trangThai === "HONG") {
    console.error(`${NL}SO_GHIM_HONG: ${SO_GHIM} có nhưng đọc không nổi — ${doc.loi}`);
    console.error("Đây KHÔNG phải 'chưa từng ghim'. Sửa hoặc xoá hẳn file đó rồi chạy lại;");
    console.error(`xoá thì repo quay về trạng thái chưa ghim, và lần \`--apply\` sau sẽ ghim lại.${NL}`);
    process.exit(3);
  }
  const soGhim = doc.trangThai === "CO" ? doc.so : null;

  /* CỬA THỨ HAI: KHÔNG HẠ CẤP.
   *
   * Chỗ so sánh chỉ nhìn NỘI DUNG, không nhìn thứ tự phiên bản. Nên chạy bộ khung 1.2.3 lên một
   * repo đã ghim 1.3.0 thì file của 1.3.0 bị gọi là `CŨ` — sai hẳn nghĩa: nó MỚI HƠN — rồi
   * `--apply` ghi bản cũ đè lên. Đã dựng lại được ca này ngày 03/09: repo mất nguyên nội dung
   * 1.3.0 và sổ ghim tụt về 1.2.3, thoát 0, không một lời cảnh báo.
   *
   * Đây gần như luôn là chạy nhầm máy (một máy chưa `git pull`), nên mặc định là DỪNG. `--force`
   * mở được, vì hạ cấp CÓ LÚC là việc cố ý — lùi một bản vá hỏng chẳng hạn. */
  const soSanhBan = (a, b) => {
    const p = (v) => String(v).split(".").map((x) => Number.parseInt(x, 10) || 0);
    const [x, y] = [p(a), p(b)];
    for (let i = 0; i < 3; i += 1) { if (x[i] !== y[i]) return x[i] - y[i]; }
    return 0;
  };
  const haCap = soGhim && soSanhBan(soGhim.version, TEMPLATE_VERSION) > 0;
  if (haCap) {
    console.error(`${NL}HA_CAP: repo đích đang ở bản ${soGhim.version}, MỚI HƠN bản khung ở máy này (${TEMPLATE_VERSION}).`);
    console.error("Nâng cấp lúc này là ghi bản cũ đè bản mới — và chỗ so sánh sẽ gọi file mới hơn là `CŨ`,");
    console.error("nên bảng kế hoạch cũng không cứu được bạn.");
    console.error("Gần như luôn là máy này chưa `git pull` ở repo bộ khung. Kéo về trước.");
    console.error(`Cố ý muốn lùi (ví dụ lùi một bản vá hỏng) thì chạy lại kèm --force.${NL}`);
    if (!force) process.exit(3);
    console.error(`(--force: vẫn hạ cấp theo yêu cầu.)${NL}`);
  }

  const dong = soSanh(repo, chuan, soGhim);
  const dem = (t) => dong.filter((d) => d.trangThai === t);

  console.log(`${NL}GHIM PHIÊN BẢN — ${repo}${NL}`);
  console.log(`  bản khung ở đây : ${TEMPLATE_VERSION}`);
  console.log(`  repo đích ghim  : ${soGhim ? soGhim.version : "CHƯA GHIM BAO GIỜ"}`);

  /* CÙNG SỐ PHIÊN BẢN MÀ KHÁC NỘI DUNG — một số phiên bản phải trỏ tới đúng một nội dung, nếu
   * không nó chỉ là một cái nhãn. Ca này có thật: bản trích dựng thẳng từ cây làm việc.
   *
   * VÀ THIẾU DẤU VÂN TAY CŨNG PHẢI DỪNG. Bản đầu chỉ so khi `bundle_digest` là chuỗi, nên **xoá
   * đúng một dòng trong sổ ghim là tắt được cả cửa này** — cùng đúng kiểu đường vòng mà `SO_GHIM_HONG`
   * sinh ra để chặn. Thiếu căn cứ không phải là "không sao"; nó là KHÔNG BIẾT, mà không biết thì
   * không được đi tiếp. Sổ ghim của bản khung CŨ thì mang số phiên bản khác, nên nó không rơi vào
   * đây — nó đi đường nâng cấp bình thường và được ghi lại dấu vân tay mới. */
  const digestMoi = bamBanTrich(chuan);
  const cungBan = soGhim && soGhim.version === TEMPLATE_VERSION;
  const digestGhim = typeof soGhim?.bundle_digest === "string" ? soGhim.bundle_digest : null;
  const lechNoiDung = cungBan && digestGhim !== digestMoi;
  if (lechNoiDung) {
    const ma = digestGhim === null ? "THIEU_DAU_VAN_TAY" : "CUNG_BAN_KHAC_NOI_DUNG";
    console.log(`${NL}  ⚠ ${ma}: repo ghim ${soGhim.version}, cùng số với bản khung ở đây, nhưng`);
    console.log(digestGhim === null
      ? "    sổ ghim KHÔNG có `bundle_digest` — không có gì để đối chiếu nội dung."
      : `    dấu vân tay bản trích khác (${digestGhim} ≠ ${digestMoi}).`);
    console.log("    Tăng phiên bản ở repo nhà trước, rồi nâng cấp — đừng để một số trỏ tới hai nội dung.");
  }
  console.log("");
  const tl = soSanhTaiLieu(repo, chuan);
  const tlThieu = tl.filter((d) => d.trangThai === "THIẾU");
  const tlKhac = tl.filter((d) => d.trangThai === "KHÁC");

  for (const t of ["ĐÃ BỎ", "SỬA TAY", "CŨ", "THIẾU", "CHƯA GHIM", "ĐÃ MỚI"]) {
    const ds = dem(t);
    if (!ds.length) continue;
    console.log(`  ${t.padEnd(10)} ${String(ds.length).padStart(2)} file${t === "ĐÃ MỚI" ? "" : `: ${ds.map((d) => d.rel).join(", ")}`}`);
  }

  const suaTay = dem("SỬA TAY");
  if (suaTay.length && !force) {
    console.log(`${NL}  ⚠ ${suaTay.length} file máy đã bị SỬA TAY sau lần ghim. Nâng cấp sẽ xoá các sửa đó.`);
    console.log("    Đọc `git diff` ở repo đích trước. Cố ý muốn bỏ thì chạy lại kèm --force.");
  }

  /* TẦNG TÀI LIỆU in RIÊNG, không trộn vào bảng trên — hai tầng có hai luật khác nhau, và trộn
     chúng lại là mời người đọc tưởng `KHÁC` ở tài liệu cũng sẽ bị ghi đè như `CŨ` ở máy. */
  if (tlThieu.length || tlKhac.length) {
    console.log("");
    console.log("  TÀI LIỆU:");
    if (tlThieu.length) console.log(`    THIẾU  ${String(tlThieu.length).padStart(2)} file: ${tlThieu.map((d) => d.rel).join(", ")}`);
    if (tlKhac.length) {
      console.log(`    KHÁC   ${String(tlKhac.length).padStart(2)} file: ${tlKhac.map((d) => d.rel).join(", ")}`);
      console.log("           → CHỈ kể tên, KHÔNG bao giờ ghi đè. Tài liệu là chữ repo đích được phép");
      console.log("             sửa cho nghề của mình; ghi đè là xoá việc của người ta.");
    }
  }


  /* CÂU CUỐI CỦA `--plan` PHẢI LÀ ĐIỀU `--apply` SẼ LÀM THẬT.
   *
   * Bản đầu chỉ đếm số file rồi kết luận. Nó nói sai theo cả hai chiều:
   *   - bảo "chạy lại với --apply" cho ca CHƯA GHIM, mà `--apply` sẽ TỪ CHỐI ca đó;
   *   - bảo "không có gì để nâng cấp" khi nội dung đã khớp nhưng SỐ GHIM ở đích còn là bản cũ —
   *     `--apply` lúc đó có việc thật (đóng lại dấu phiên bản), và bỏ qua thì câu trả lời cho
   *     "repo này đang dùng bản nào" sai vĩnh viễn.
   * Một bản kế hoạch không khớp với việc sẽ làm thì nó không phải bản kế hoạch. */
  if (!apply) {
    const canLam = dem("CŨ").length + dem("THIẾU").length + dem("CHƯA GHIM").length;
    const canChot = soGhim && soGhim.version !== TEMPLATE_VERSION;
    let cau;
    if (lechNoiDung) cau = "`--apply` sẽ TỪ CHỐI: số phiên bản ở repo nhà không trỏ đúng nội dung. Tăng phiên bản ở nhà trước.";
    else if (dem("SỬA TAY").length) cau = "`--apply` sẽ TỪ CHỐI vì có file bị sửa tay. Đọc `git diff` ở repo đích, rồi quyết — cố ý bỏ thì thêm `--force`.";
    else if (dem("CHƯA GHIM").length) cau = "`--apply` sẽ TỪ CHỐI: file đã khác mà repo chưa có sổ ghim, không đủ căn cứ. Đọc `git diff` ở đích, chắc chắn thì thêm `--force`.";
    else if (canLam || tlThieu.length) cau = `Chạy lại với --apply để ghi ${canLam} file máy`
      + (tlThieu.length ? ` và mang thêm ${tlThieu.length} file tài liệu repo đích chưa có.` : ".");
    else if (canChot) cau = `Nội dung đã khớp, không phải ghi file nào — nhưng sổ ghim ở đích còn ghi ${soGhim.version}. Chạy --apply để đóng lại dấu ${TEMPLATE_VERSION}.`;
    else cau = "Không có gì để nâng cấp.";
    console.log(`${NL}${cau}${NL}`);
    process.exit(0);
  }

  /* SỐ PHIÊN BẢN NÓI DỐI THÌ DỪNG — và `--force` KHÔNG mở được cửa này.
   *
   * `--force` có nghĩa "tôi biết repo đích bị sửa tay, cứ ghi đè". Nó không nói gì về việc số
   * phiên bản ở repo NHÀ có trỏ đúng nội dung hay không. Ghi đè lúc này là in một cái nhãn sai
   * lên repo đích: sổ ghim sẽ ghi 1.3.0 cho một nội dung khác với 1.3.0 mà repo bên cạnh đang
   * có, và từ đó không lệnh nào phát hiện được nữa. Cách sửa là tăng phiên bản ở nhà, không
   * phải ép. */
  if (lechNoiDung) {
    console.error(`${NL}TU_CHOI: repo đích ghim đúng số ${TEMPLATE_VERSION} mà nội dung không đối chiếu được.`);
    console.error("Không ghi một byte nào. Tăng phiên bản ở repo bộ khung (package.json) rồi chạy lại.");
    console.error(`\`--force\` KHÔNG bỏ qua được cửa này — nó nói về repo đích, còn lỗi này ở repo nhà.${NL}`);
    process.exit(3);
  }

  if (suaTay.length && !force) {
    console.error(`${NL}TU_CHOI: có file bị sửa tay. Xem ở trên, rồi quyết — không tự ghi đè việc của người khác.${NL}`);
    process.exit(3);
  }

  /* CHƯA GHIM MÀ FILE ĐÃ KHÁC cũng phải DỪNG.
   *
   * Tài liệu vẫn nói "không đủ căn cứ thì báo, không đoán" — nhưng vòng ghi lại ghi mọi thứ trừ
   * ĐÃ MỚI, nên repo cũ chưa ghim có file máy đã khác sẽ bị ghi đè MẶC ĐỊNH. Đó chính là ca
   * nguy hiểm nhất: repo đã sống lâu, và không ai còn nhớ file đó khác vì lý do gì.
   *
   * THIẾU thì vẫn ghi — thiếu file là ca lắp lần đầu, không có gì để mất. */
  const chuaGhim = dem("CHƯA GHIM");
  if (chuaGhim.length && !force) {
    console.error(`${NL}TU_CHOI: ${chuaGhim.length} file máy đã khác bản khung, mà repo CHƯA có sổ ghim`);
    console.error(`nên không đủ căn cứ nói đó là bản cũ hay bản vá tại chỗ: ${chuaGhim.map((d) => d.rel).join(", ")}.`);
    console.error("Đọc `git diff` ở repo đích. Chắc chắn bỏ được thì chạy lại kèm --force.");
    console.error(`(Repo khớp hoàn toàn hoặc chỉ THIẾU file thì \`--apply\` chạy bình thường.)${NL}`);
    process.exit(3);
  }

  let daGhi = 0;
  for (const d of dong) {
    // ĐÃ BỎ = file bản khung không còn phát nữa. Chỉ kể tên, KHÔNG tự xoá: xoá file trong repo
    // người khác là việc không lùi lại được, và nó phải do người quyết.
    if (d.trangThai === "ĐÃ MỚI" || d.trangThai === "ĐÃ BỎ") continue;
    const dest = path.join(repo, ...d.rel.split("/"));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    // Ghi ra file tạm rồi đổi tên: đổi tên là thao tác nguyên tử, nên một lần ngắt giữa chừng
    // không để lại file cụt. Ghi thẳng thì có thể bỏ lại một `session-check.mjs` mất nửa cuối.
    const tam = `${dest}.tam-${process.pid}`;
    fs.writeFileSync(tam, chuan.get(d.rel), "utf8");
    fs.renameSync(tam, dest);
    daGhi += 1;
  }
  /* Tài liệu THIẾU thì mang sang — không có gì để mất. Tài liệu KHÁC thì tuyệt đối không đụng:
     đã kể tên ở trên, người quyết. Đây là toàn bộ khác biệt giữa tầng tài liệu và tầng máy. */
  let daGhiTaiLieu = 0;
  for (const d of tlThieu) {
    const dest = path.join(repo, ...d.rel.split("/"));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const tam = `${dest}.tam-${process.pid}`;
    fs.writeFileSync(tam, chuan.get(d.rel), "utf8");
    fs.renameSync(tam, dest);
    daGhiTaiLieu += 1;
  }

  // Nhớ tiếp những file ĐÃ BỎ còn nằm trên đĩa, để lần xem sau vẫn kể được tên chúng.
  const giuLai = {};
  for (const d of dem("ĐÃ BỎ")) giuLai[d.rel] = d.bamGhim ?? null;

  const thuMucSo = path.join(repo, ".ark");
  fs.mkdirSync(thuMucSo, { recursive: true });
  fs.writeFileSync(path.join(thuMucSo, "harness.lock.json"),
    `${JSON.stringify(soGhimMoi(chuan, soGhim, giuLai), null, 2)}${NL}`, "utf8");

  console.log(`${NL}Đã ghi ${daGhi} file máy và cập nhật ${SO_GHIM} → ${TEMPLATE_VERSION}.`);
  if (daGhiTaiLieu) console.log(`Đã mang thêm ${daGhiTaiLieu} file tài liệu repo đích chưa có — nhớ khai vào Bản đồ file, cổng đóng phiên bắt.`);
  if (tlKhac.length) console.log(`${tlKhac.length} file tài liệu khác bản trích — KHÔNG đụng tới, xem danh sách ở trên.`);
  if (Object.keys(giuLai).length) {
    console.log(`${Object.keys(giuLai).length} file ĐÃ BỎ vẫn còn ở repo — ghi vào khối \`retired\` của sổ ghim, chưa xoá.`);
  }
  console.log(`Bước kế ở repo đích: chạy \`npm test\`, rồi cổng đóng phiên.${NL}`);
}
