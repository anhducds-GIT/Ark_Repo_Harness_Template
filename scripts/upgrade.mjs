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

import { execFileSync } from "node:child_process";
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
  return [...chuan.keys()].filter((rel) => rel.startsWith("docs/") && !laTuyChon(chuan.get(rel)));
}

/* TÀI LIỆU TỰ KHAI `status: optional` THÌ KHÔNG TỰ MANG SANG.
 *
 * Vấp thật 07/09, bắt được lúc đọc bản `--plan` cho một repo CHỨNG KHOÁN: lệnh định mang sang
 * `docs/ANNEX-tu-dong-hoa-trinh-duyet.md` — phụ lục nghề lái trình duyệt. Ngay dòng đầu của
 * chính file đó viết: *"Repo bạn không lái trình duyệt thì XOÁ file này… Giữ một phụ lục sai
 * nghề còn tệ hơn không có phụ lục: nó dạy phiên AI sau tuân luật cho một việc repo này không
 * làm."*
 *
 * Tức file tự nói ra là nó không dành cho repo đó, mà lệnh vẫn mang. "Thiếu thì mang" đúng với
 * sổ tay dùng chung; nó KHÔNG đúng với phụ lục nghề — và khác biệt ấy đã được khai sẵn trong
 * frontmatter, chỉ là chưa ai đọc.
 *
 * Vẫn KỂ TÊN ở bản kế hoạch, để người đọc biết bộ khung có sẵn nó mà tự quyết chép hay không. */
export function laTuyChon(noiDung) {
  const kh = /^---\r?\n([\s\S]*?)\r?\n---/.exec(String(noiDung || ""));
  return kh ? /^status:\s*optional\s*$/m.test(kh[1]) : false;
}

export function fileTuyChon(chuan) {
  return [...chuan.keys()].filter((rel) => rel.startsWith("docs/") && laTuyChon(chuan.get(rel)));
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

/* ---- TANG THU BA: TEN LENH -------------------------------------------------
 *
 * VI SAO CO TANG NAY. Do 07/09 tai `ALL_SKILL_MANAGEMENT`: **ba muc `[~]` MOT PHAN** — co
 * `scripts/session-check.mjs`, co `scripts/safe-push.mjs`, co `scripts/build-dashboard.mjs`,
 * nhung KHONG co `npm run gate`, `npm run push`, `npm run dashboard`. Lenh nay chep file va
 * **chua bao gio cham `package.json` cua repo dich**, nen ba luot migrate deu dua CONG toi ma
 * khong dua TEN GOI toi. Cong co mat ma khong ai goi duoc bang ten chuan thi tren thuc te no
 * khong ton tai — va do la ca nguy hiem hon thieu han, vi bang do dem ra "co file".
 *
 * LUAT O DAY GIONG HET TANG TAI LIEU, co y: **THIEU thi mang sang · KHAC thi CHI KE TEN.**
 * Mot khoa lenh da co gia tri khac la repo dich da tu quyet — de `test` chay bo phep kiem
 * rieng cua no chang han. Ghi de la xoa quyet dinh cua nguoi ta, va hong IM LANG: `npm test`
 * van xanh, chi la no khong con chay dung nhung thu no tung chay.
 */
export function soSanhLenh(rawDich, rawChuan) {
  const doc = (raw) => {
    if (raw === null || raw === undefined) return null;
    /* MOT KHOI, KHONG PHAI MOT MANG. `JSON.parse("[]")` cho ra thu co `typeof === "object"`,
     * nen phep kiem "la object" cho mot mang di lot — va luc do `j.scripts` la `undefined`,
     * roi ham tra `{}`, tuc noi "khong thieu lenh nao" ve mot file KHONG phai package.json.
     * Phep kiem cua chinh ve nay bat duoc, 07/09. */
    const laKhoi = (x) => x !== null && typeof x === "object" && !Array.isArray(x);
    try {
      const j = JSON.parse(String(raw));
      if (!laKhoi(j)) return null;
      if (j.scripts === undefined) return {};
      return laKhoi(j.scripts) ? j.scripts : null;
    } catch { return null; }
  };
  const chuan = doc(rawChuan);
  const dich = doc(rawDich);
  /* DOC KHONG RA THI KHONG BIET, khong phai "khong thieu gi". `null` di het duong len tan cho
   * in ra, va `--apply` khong ghi gi ca: sua mot `package.json` ma minh khong parse noi la
   * cach nhanh nhat de lam hong repo cua nguoi khac. */
  if (chuan === null || dich === null) return null;
  const thieu = [];
  const khac = [];
  for (const [k, v] of Object.entries(chuan)) {
    if (!(k in dich)) thieu.push([k, v]);
    else if (String(dich[k]) !== String(v)) khac.push([k, String(dich[k]), String(v)]);
  }
  return { thieu, khac };
}

/** Ghep lenh THIEU vao `package.json` cua repo dich, GIU NGUYEN moi thu khac. */
export function ghepLenh(rawDich, thieu) {
  const j = JSON.parse(String(rawDich));
  j.scripts = j.scripts && typeof j.scripts === "object" ? j.scripts : {};
  for (const [k, v] of thieu) if (!(k in j.scripts)) j.scripts[k] = v;
  return JSON.stringify(j, null, 2) + NL;
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
  /* TEN LENH — tang thu ba, doc cung mot luc voi hai tang kia. */
  const docTep = (rel) => { try { return fs.readFileSync(path.join(repo, ...rel.split("/")), "utf8"); } catch { return null; } };
  const lenhSo = soSanhLenh(docTep("package.json"), chuan.get("package.json"));

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
  /* Phụ lục nghề tự khai `status: optional`: KỂ TÊN nhưng KHÔNG tự mang. Xem `laTuyChon`. */
  const tuyChon = fileTuyChon(chuan).filter((rel) => {
    try { fs.readFileSync(path.join(repo, ...rel.split("/"))); return false; } catch { return true; }
  });

  /* TEN LENH in RIENG mot khoi. Tron vao bang tren la nguoi doc tuong day cung la file. */
  if (lenhSo === null) {
    console.log("");
    console.log("  TÊN LỆNH: KHÔNG ĐỌC ĐƯỢC `package.json` (thiếu, hoặc hỏng cú pháp).");
    console.log("           → `--apply` sẽ KHÔNG chạm tới nó. Sửa ở repo đích rồi chạy lại.");
  } else if (lenhSo.thieu.length || lenhSo.khac.length) {
    console.log("");
    console.log("  TÊN LỆNH (`package.json` → `scripts`):");
    if (lenhSo.thieu.length) {
      console.log(`    THIẾU  ${String(lenhSo.thieu.length).padStart(2)} lệnh: ${lenhSo.thieu.map((x) => "npm run " + x[0]).join(", ")}`);
      console.log("           → SẼ THÊM. File có mà tên gọi không có thì cổng có mặt mà không ai");
      console.log("             gọi được bằng tên chuẩn — đo thật 07/09: ba lượt migrate đưa công cụ");
      console.log("             tới mà không đưa tên gọi tới, và bảng đếm ra `[~] MỘT PHẦN`.");
    }
    if (lenhSo.khac.length) {
      console.log(`    KHÁC   ${String(lenhSo.khac.length).padStart(2)} lệnh: ${lenhSo.khac.map((x) => x[0]).join(", ")}`);
      console.log("           → CHỈ kể tên, KHÔNG bao giờ ghi đè — như tầng tài liệu. Repo đích đã tự");
      console.log("             quyết giá trị đó (`test` chạy bộ phép kiểm riêng chẳng hạn); ghi đè là");
      console.log("             xoá quyết định của người ta, và hỏng IM LẶNG vì `npm test` vẫn xanh.");
    }
  }

  if (tlThieu.length || tlKhac.length || tuyChon.length) {
    console.log("");
    console.log("  TÀI LIỆU:");
    if (tlThieu.length) console.log(`    THIẾU  ${String(tlThieu.length).padStart(2)} file: ${tlThieu.map((d) => d.rel).join(", ")}`);
    if (tlKhac.length) {
      console.log(`    KHÁC   ${String(tlKhac.length).padStart(2)} file: ${tlKhac.map((d) => d.rel).join(", ")}`);
      console.log("           → CHỈ kể tên, KHÔNG bao giờ ghi đè. Tài liệu là chữ repo đích được phép");
      console.log("             sửa cho nghề của mình; ghi đè là xoá việc của người ta.");
    }
    if (tuyChon.length) {
      console.log(`    TUỲ CHỌN ${String(tuyChon.length).padStart(2)} file: ${tuyChon.join(", ")}`);
      console.log("           → bộ khung CÓ sẵn nhưng KHÔNG tự mang: đây là phụ lục NGHỀ, tự khai");
      console.log("             `status: optional`. Repo đích không làm nghề đó thì một phụ lục sai");
      console.log("             nghề còn tệ hơn không có — nó dạy phiên AI sau tuân luật cho một");
      console.log("             việc repo này không làm. Cần thì tự chép sang.");
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
    else if (canLam || tlThieu.length || lenhSo?.thieu.length) cau = `Chạy lại với --apply để ghi ${canLam} file máy`
      + (tlThieu.length ? `, mang thêm ${tlThieu.length} file tài liệu repo đích chưa có` : "")
      + (lenhSo?.thieu.length ? `, và thêm ${lenhSo.thieu.length} tên lệnh vào package.json` : "")
      + ".";
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
  /* THEM TEN LENH THIEU. Doc lai file NGAY LUC GHI, khong dung ban da doc luc lap ke hoach:
   * giua hai thoi diem do co the co phien khac sua `package.json`, va ghi lai ban cu la xoa
   * viec cua ho. Doc lai roi ghep — chi them khoa chua co. */
  let daThemLenh = 0;
  if (lenhSo && lenhSo.thieu.length) {
    const duong = path.join(repo, "package.json");
    const rawNay = docTep("package.json");
    const soNay = soSanhLenh(rawNay, chuan.get("package.json"));
    if (soNay && soNay.thieu.length) {
      const tam = `${duong}.tam-${process.pid}`;
      fs.writeFileSync(tam, ghepLenh(rawNay, soNay.thieu), "utf8");
      fs.renameSync(tam, duong);
      daThemLenh = soNay.thieu.length;
    }
  }

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
  if (daThemLenh) console.log(`Đã thêm ${daThemLenh} tên lệnh vào package.json — giờ \`npm run\` gọi được chúng bằng tên chuẩn.`);
  if (lenhSo === null) console.log("KHÔNG chạm tới package.json: đọc không ra. Sửa ở repo đích rồi chạy lại.");
  else if (lenhSo.khac.length) console.log(`${lenhSo.khac.length} tên lệnh có giá trị khác bản trích — KHÔNG đụng tới, xem ở trên.`);
  if (tlKhac.length) console.log(`${tlKhac.length} file tài liệu khác bản trích — KHÔNG đụng tới, xem danh sách ở trên.`);
  if (Object.keys(giuLai).length) {
    console.log(`${Object.keys(giuLai).length} file ĐÃ BỎ vẫn còn ở repo — ghi vào khối \`retired\` của sổ ghim, chưa xoá.`);
  }
  /* BẬT CỬA INDEX Ở REPO ĐÍCH. `core.hooksPath` là cấu hình MỖI BẢN SAO nên nó KHÔNG đi theo
     file — mang `.githooks/commit-msg` sang mà không bật là mang một cơ chế đã tắt, và triệu
     chứng y hệt lúc chưa mang gì. Repo đích nào đã trỏ hooksPath đi nơi khác thì NÊU TÊN, không
     ghi đè: đó có thể là hook của chính họ, và cổng đóng phiên bên đó sẽ nói tiếp. */
  if (fs.existsSync(path.join(repo, ".githooks", "commit-msg"))) {
    let troToi = "";
    /* `--local`, KHONG phai `--get`: `--get` doc ca global va system, nen mot may co
         `core.hooksPath` global se lam cua nay bao "da bat tu truoc" va KHONG BAO GIO dat
         config local — dung loai ghi nhan SAI nhu chinh loi thieu import o tren. Codex neu
         10/09; da dung lai: dat global roi `--get` tra ".githooks" trong khi `--local` trong. */
      try { troToi = execFileSync("git", ["config", "--local", "--get", "core.hooksPath"], { cwd: repo, encoding: "utf8" }).trim(); } catch { /* chưa đặt */ }
    if (troToi === ".githooks") console.log("Cửa index: đã bật từ trước.");
    else if (troToi) console.log(`⚠ Cửa index KHÔNG bật được: core.hooksPath ở repo đích đang trỏ "${troToi}". Hỏi chủ repo trước, đừng ghi đè.`);
    else {
      try {
        execFileSync("git", ["config", "core.hooksPath", ".githooks"], { cwd: repo, stdio: "ignore" });
        console.log("Cửa index: ĐÃ BẬT (core.hooksPath = .githooks) — chặn `git commit` cuốn theo file lane khác.");
      } catch (e) { console.log(`⚠ Cửa index không bật được: ${String(e.message).split(NL)[0]}`); }
    }
  }
  console.log(`Bước kế ở repo đích: chạy \`npm test\`, rồi cổng đóng phiên.${NL}`);
}
