/* Ghim BỘ BIÊN DỊCH LUẬT — `scripts/rule-compiler.mjs` và phép kiểm B16.
 *
 * Vì sao bộ này đáng ghim kỹ: nó là RĂNG CHỐNG PHÌNH LUẬT. Một cái răng không cắn được thì tệ
 * hơn không có răng, vì nó làm người ta yên tâm. Nên mọi vế dưới đây đều phải dựng nổi CẢ HAI
 * nhánh — khai đúng thì xanh, khai sai thì đỏ — chứ không chỉ chạy cho xanh.
 *
 * TÁM ĐỘT BIẾN ĐÃ CHẠY 09/09, ghi ở cuối file kèm HAI cái SỐNG SÓT.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import { bienDich, chuanHoaAdr, chuDeKhaiTu, deXuat, deXuatTrim, docAdr, docFrontmatter, napContext, soatLuat } from "../scripts/rule-compiler.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NL = String.fromCharCode(10);
let passed = 0;
const ok = (msg) => { passed += 1; console.log(`  ok  ${msg}`); };

const adr = (ma, them = {}) => {
  const fm = ["---", `status: ${them.status ?? "Accepted"}`, `adr: ${ma}`];
  for (const [k, v] of Object.entries(them)) { if (k !== "status") fm.push(`${k}: ${v}`); }
  fm.push("---", "", `# ADR-${ma} — tieu de ${ma}`, "", "## Boi canh", "", "than.");
  return chuanHoaAdr(`docs/adr/${ma}-x.md`, fm.join(NL) + NL);
};
const CHU_DE = new Map([["khoa", "Khoá"], ["bang", "Bảng"]]);
const maLoi = (ds) => ds.map((v) => v.ma).sort();

/* ---- 1. Chuẩn hoá: đọc được khai báo, và KHÔNG lấy mã từ tên file --------- */
{
  const a = adr("0012", { chu_de: "khoa", dau_moi: "true" });
  assert.equal(a.ma, "0012");
  assert.equal(a.chuDe, "khoa");
  assert.equal(a.dauMoi, true);

  /* MÃ LẤY TỪ FRONTMATTER, KHÔNG TỪ TÊN FILE. B12 dùng `--follow` chính vì đổi tên ADR là
   * chuyện có thật; lấy mã từ tên file thì một lượt đổi tên là mọi quan hệ trỏ vào hư không. */
  const b = chuanHoaAdr("docs/adr/9999-ten-file-noi-doi.md",
    ["---", "status: Accepted", "adr: 0007", "chu_de: bang", "---", "", "# ADR-0007 — x"].join(NL));
  assert.equal(b.ma, "0007", "ma phai lay tu frontmatter `adr:`, khong lay tu ten file");

  // Không có frontmatter thì phải nói KHÔNG ĐỌC ĐƯỢC, không được đoán.
  assert.equal(docFrontmatter("# khong co frontmatter").coFm, false);
  assert.equal(chuanHoaAdr("x.md", "# tran").coFm, false);
  ok("1 · chuẩn hoá: đọc khai báo · mã lấy từ frontmatter chứ không từ tên file · không có FM thì nói không đọc được");
}

/* ---- 2. Thiếu khai báo là VI PHẠM, không phải cảnh báo -------------------- */
{
  // Đây là cái răng chính: thêm một luật mà không nói nó thuộc nhóm nào thì bị chặn.
  const thieu = soatLuat([adr("0001", { dau_moi: "true" })], CHU_DE);
  assert.ok(maLoi(thieu).includes("THIEU_CHU_DE"), `thieu chu_de phai la vi pham, dang: ${JSON.stringify(maLoi(thieu))}`);

  // Chủ đề gõ sai KHÔNG được lặng lẽ đẻ ra một nhóm mới.
  const la = soatLuat([adr("0001", { chu_de: "khoaa", dau_moi: "true" })], CHU_DE);
  assert.ok(maLoi(la).includes("CHU_DE_LA"), `chu de chua khai phai la vi pham, dang: ${JSON.stringify(maLoi(la))}`);

  // Đối chứng: khai đủ thì SẠCH. Không có vế này thì phép kiểm chỉ cần luôn-đỏ là "đạt".
  const du = soatLuat([adr("0012", { chu_de: "khoa", dau_moi: "true" })], CHU_DE);
  assert.deepEqual(du, [], `khai du phai sach, dang: ${JSON.stringify(du)}`);
  ok("2 · thiếu `chu_de` ĐỎ · chủ đề chưa khai ĐỎ · khai đủ thì SẠCH");
}

/* ---- 3. Một chủ đề phải có ĐÚNG MỘT đầu mối ------------------------------ */
{
  /* Đây là vế biến "27 file, đọc bốn cái rồi tự đoán" thành "mở đúng một khối". Thiếu đầu mối
   * hay hai đầu mối đều đưa ta về đúng bệnh cũ, nên cả hai phải đỏ. */
  const khongDauMoi = soatLuat([adr("0012", { chu_de: "khoa" }), adr("0013", { chu_de: "khoa" })], CHU_DE);
  assert.ok(maLoi(khongDauMoi).includes("CHU_DE_KHONG_DAU_MOI"),
    `chu de khong dau moi phai DO, dang: ${JSON.stringify(maLoi(khongDauMoi))}`);

  const haiDauMoi = soatLuat(
    [adr("0012", { chu_de: "khoa", dau_moi: "true" }), adr("0013", { chu_de: "khoa", dau_moi: "true" })], CHU_DE);
  assert.ok(maLoi(haiDauMoi).includes("CHU_DE_HAI_DAU_MOI"),
    `hai dau moi phai DO, dang: ${JSON.stringify(maLoi(haiDauMoi))}`);

  const dung = soatLuat(
    [adr("0012", { chu_de: "khoa", dau_moi: "true" }), adr("0013", { chu_de: "khoa", bo_sung: "0012" })], CHU_DE);
  assert.deepEqual(dung, [], `mot dau moi + mot bo sung phai SACH, dang: ${JSON.stringify(dung)}`);

  /* ADR ĐÃ CẮT (superseded) KHÔNG tính vào phép đếm đầu mối — nếu tính thì một chủ đề bị khoá
   * vĩnh viễn ngay khi có bản thay thế đầu tiên, và đó là cái bẫy khoá cả repo. */
  const daCat = soatLuat([
    adr("0012", { chu_de: "khoa", dau_moi: "true" }),
    adr("0011", { chu_de: "khoa", dau_moi: "true", status: "superseded" })
  ], CHU_DE);
  assert.deepEqual(daCat, [], `ADR superseded khong duoc tinh vao dem dau moi, dang: ${JSON.stringify(daCat)}`);
  ok("3 · chủ đề: 0 đầu mối ĐỎ · 2 đầu mối ĐỎ · 1 đầu mối SẠCH · ADR đã cắt không tính vào phép đếm");
}

/* ---- 4. Quan hệ phải trỏ tới ADR CÓ THẬT --------------------------------- */
{
  // Trỏ vào hư không = bộ luật tưởng mình có thứ tự mà thật ra không có.
  const treo = soatLuat([adr("0013", { chu_de: "khoa", dau_moi: "true", bo_sung: "9999" })], CHU_DE);
  assert.ok(maLoi(treo).includes("QUAN_HE_TREO"), `quan he tro vao hu khong phai DO, dang: ${JSON.stringify(maLoi(treo))}`);

  const vong = soatLuat([adr("0013", { chu_de: "khoa", dau_moi: "true", sua: "0013" })], CHU_DE);
  assert.ok(maLoi(vong).includes("QUAN_HE_VONG"), `quan he tro vao chinh no phai DO, dang: ${JSON.stringify(maLoi(vong))}`);
  ok("4 · quan hệ trỏ vào hư không ĐỎ · trỏ vào chính nó ĐỎ");
}

/* ---- 5. Biên dịch: đầu mối đứng trước, ADR đã cắt ra khỏi bộ hiệu lực ----- */
{
  /* ĐẦU MỐI PHẢI CÓ MÃ LỚN HƠN VÀ NGÀY MUỘN HƠN thành viên của nó. Bản fixture đầu đặt đầu mối
   * là 0012 và thành viên là 0013 — tức đầu mối cũng tình cờ là mã nhỏ nhất, nên xếp-theo-mã và
   * xếp-theo-đầu-mối cho CÙNG kết quả, và đột biến ⑶ sống sót. Ca hỏng phải phân biệt được hai
   * cách xếp, không thì vế này chỉ đang xác nhận một sự trùng hợp. */
  const { khoi, daCat } = bienDich([
    adr("0011", { chu_de: "khoa", bo_sung: "0013", date: "2026-09-01" }),
    adr("0013", { chu_de: "khoa", dau_moi: "true", date: "2026-09-08" }),
    adr("0006", { chu_de: "bang", dau_moi: "true", date: "2026-09-07" }),
    adr("0002", { chu_de: "khoa", status: "superseded", date: "2026-08-01" })
  ], CHU_DE);
  assert.equal(khoi.length, 2, "phai ra dung hai chu de");
  const khoa = khoi.find((k) => k.chuDe === "khoa");
  assert.equal(khoa.ds[0].ma, "0013",
    "dau moi PHAI dung dau khoi KE CA khi ma va ngay cua no deu lon hon — ca gia tri cua viec gom nhom nam o day");
  assert.equal(khoa.ds[1].ma, "0011", "thanh vien xep sau dau moi");
  assert.equal(khoa.ten, "Khoá", "phai dung ten hien thi da khai, khong in ra ma slug");
  assert.equal(daCat.length, 1, "ADR superseded phai ra khoi bo hieu luc");
  assert.equal(daCat[0].ma, "0002");
  // TRIM KHÁC DELETE: nó vẫn phải nằm trong kết quả, ở ngăn "đã cắt".
  assert.ok(!khoa.ds.some((a) => a.ma === "0002"), "ADR da cat khong duoc con trong bo hieu luc");
  ok("5 · biên dịch: đầu mối đứng đầu khối · tên hiển thị · ADR đã cắt ra khỏi bộ hiệu lực mà KHÔNG biến mất");
}

/* ---- 6. Đề xuất là ĐỀ XUẤT, không phải vi phạm --------------------------- */
{
  /* Bất biến Đức chốt: AI được NÊU, không được tự sửa luật. Nên chỗ "đáng xem lại" phải nằm
   * ngoài `soatLuat` — trộn hai thứ vào nhau là cách một cổng bắt đầu bị bỏ qua. */
  const ds = [adr("0012", { chu_de: "khoa", dau_moi: "true" }), adr("0013", { chu_de: "khoa" })];
  assert.deepEqual(soatLuat(ds, CHU_DE), [], "ADR khong khai quan he KHONG duoc la vi pham — no chi dang xem lai");
  const dx = deXuat(ds);
  assert.equal(dx.length, 1, `phai neu dung mot de xuat, dang: ${JSON.stringify(dx)}`);
  assert.ok(dx[0].vi.includes("0013"), "de xuat phai NEU TEN ADR roi rac");
  assert.ok(dx[0].lam && dx[0].lam.length > 10, "de xuat phai noi CACH LAM, khong chi noi 'co van de'");
  ok("6 · đề xuất tách khỏi vi phạm: máy NÊU tên và cách làm, người quyết");
}

/* ---- 7. Chạy trên repo THẬT: bộ luật của chính repo này phải biên dịch được */
{
  const ds = docAdr(ROOT);
  assert.ok(Array.isArray(ds) && ds.length >= 10, `repo nay phai co it nhat 10 ADR, dang: ${ds && ds.length}`);
  const ct = JSON.parse(fs.readFileSync(path.join(ROOT, ".repo-structure.json"), "utf8"));
  const khai = chuDeKhaiTu(ct);
  assert.ok(khai && khai.size >= 3, "repo nay PHAI khai `luat.chu_de` — khong khai thi B16 do");
  assert.deepEqual(soatLuat(ds, khai), [],
    "bo luat cua CHINH repo nay khong bien dich duoc — sua ADR hoac khai them chu de");
  // Mỗi chủ đề đã khai phải có ADR thật. Khai thừa là bản đồ nói có nhóm mà nhóm rỗng.
  const dung = new Set(ds.map((a) => a.chuDe));
  const thua = [...khai.keys()].filter((k) => !dung.has(k));
  assert.deepEqual(thua, [], `khai chu de ma khong ADR nao dung: ${thua.join(", ")}`);
  ok(`7 · repo thật: ${ds.length} ADR / ${khai.size} chủ đề, 0 vi phạm, 0 chủ đề rỗng`);
}

/* ---- 8. B16 phải ĐỎ THẬT được, và ĐỎ ở đúng chỗ -------------------------- */
{
  /* Một phép kiểm chưa từng đỏ và một phép kiểm KHÔNG THỂ đỏ trông giống hệt nhau. Dựng một
   * thư mục ADR giả rồi đòi B16 đỏ đúng chỗ — không mượn kết quả của repo nhà. */
  const { checkB16 } = await import("../scripts/check-bootstrap.mjs");
  const cha = mkdtempSync(path.join(tmpdir(), "luat-"));
  try {
    mkdirSync(path.join(cha, "docs", "adr"), { recursive: true });
    const ghi = (ten, fm) => writeFileSync(path.join(cha, "docs", "adr", ten),
      ["---", ...fm, "---", "", "# ADR", "", "than."].join(NL) + NL, "utf8");
    const cauTruc = (luat) => writeFileSync(path.join(cha, ".repo-structure.json"),
      JSON.stringify(luat ? { luat } : {}, null, 2) + NL, "utf8");

    // ⑴ Hai ADR mà repo KHÔNG khai chủ đề → ĐỎ. Đây là cửa thoát duy nhất, phải đóng.
    ghi("0001-a.md", ["status: Accepted", "adr: 0001"]);
    ghi("0002-b.md", ["status: Accepted", "adr: 0002"]);
    cauTruc(null);
    let kq = checkB16({ root: cha });
    assert.equal(kq.state, "fail", `khong khai chu de ma co 2 ADR phai DO, dang: ${kq.state} — ${kq.note}`);
    assert.equal(kq.findings[0].tag, "LUAT-KHONG-KHAI-CHU-DE");
    assert.ok(kq.findings[0].fix.length >= 2, "phai noi cach sua, khong chi noi sai");

    // ⑵ Khai chủ đề rồi nhưng ADR chưa khai chỗ đứng → vẫn ĐỎ, và nêu ĐÚNG mã lỗi.
    cauTruc({ chu_de: { khoa: "Khoá" } });
    kq = checkB16({ root: cha });
    assert.equal(kq.state, "fail", `ADR thieu chu_de phai DO, dang: ${kq.state}`);
    assert.ok(kq.findings.some((f) => f.tag === "THIEU_CHU_DE"), `phai neu THIEU_CHU_DE, dang: ${kq.findings.map((f) => f.tag)}`);

    // ⑶ Khai đủ → XANH. Cửa ra phải mở, không thì người ta sẽ tháo phép kiểm.
    ghi("0001-a.md", ["status: Accepted", "adr: 0001", "chu_de: khoa", "dau_moi: true"]);
    ghi("0002-b.md", ["status: Accepted", "adr: 0002", "chu_de: khoa", "thuoc: 0001"]);
    kq = checkB16({ root: cha });
    assert.equal(kq.state, "ok", `khai du phai XANH, dang: ${kq.state} — ${JSON.stringify(kq.findings)}`);

    // ⑷ Repo chưa có ADR nào → BỎ QUA, không đỏ oan. Repo mới dựng là ca thật và hợp lệ.
    rmSync(path.join(cha, "docs", "adr"), { recursive: true, force: true });
    mkdirSync(path.join(cha, "docs", "adr"), { recursive: true });
    kq = checkB16({ root: cha });
    assert.equal(kq.state, "skip", `repo chua co ADR phai BO QUA chu khong DO oan, dang: ${kq.state}`);
    ok("8 · B16 đỏ thật được: không khai chủ đề ĐỎ · ADR thiếu nhà ĐỎ · khai đủ XANH · repo chưa có ADR thì BỎ QUA");
  } finally { rmSync(cha, { recursive: true, force: true }); }
}

/* NĂM ĐỘT BIẾN ĐÃ CHẠY THẬT 09/09 (mỗi lượt đều kiểm `diff` để chắc nó ĐÃ áp dụng — một đột
 * biến không áp dụng được thì nó chứng minh KHÔNG GÌ CẢ, và tôi đã tự lừa mình bằng đúng cách đó
 * ở một lượt trước trong ngày):
 *   ⑴ `soatLuat` bỏ vế THIEU_CHU_DE                → chết ở vế 2
 *   ⑵ đếm đầu mối tính cả ADR `superseded`         → chết ở vế 3, nhánh cuối
 *   ⑶ `bienDich` thôi xếp đầu-mối-trước            → SỐNG SÓT lượt đầu, xem ngay dưới
 *   ⑷ `chuanHoaAdr` lấy mã từ TÊN FILE             → chết ở vế 1
 *   ⑸ B16 trả `skip` khi repo không khai chủ đề    → chết ở vế 8, nhánh ⑴
 *   ⑹ bỏ vế `đang hiệu lực` ở bước CẮT             → chết ở vế 9
 *   ⑺ `napContext` luôn trả `dat: true`            → chết ở vế 10
 *   ⑻ bỏ vế `còn trỏ tới ADR sống thì GIỮ`         → SỐNG SÓT lượt đầu, xem dưới
 *
 * CÁI SỐNG SÓT THỨ HAI, và nó lặp đúng bài học của cái thứ nhất: fixture vế 9 dựng thư mục
 * `docs/adr/` nhưng để RỖNG, nên `adrSong` luôn rỗng và vế *trỏ tới ADR sống thì giữ* không bao
 * giờ chạy tới. Phá nó đi mà không gì đỏ. Đã thêm một ADR thật và một mục sổ trỏ tới nó.
 *
 * CÁI SỐNG SÓT dạy nhiều nhất: fixture đầu đặt đầu mối là ADR-0012 và thành viên là ADR-0013,
 * nên đầu mối TÌNH CỜ cũng là mã nhỏ nhất và ngày sớm nhất — xếp-theo-mã và xếp-theo-đầu-mối cho
 * CÙNG một kết quả. Vế 5 khi đó chỉ đang xác nhận một sự trùng hợp. Đảo lại (đầu mối 0013, thành
 * viên 0011) là đột biến chết ngay. Cùng bài học đã ghi ở `luu-do-smoke.mjs`: một vế đo KẾT QUẢ
 * CHUNG của nhiều cơ chế thì nó không ghim cơ chế nào. */

/* ---- 9. CẮT: may KHONG tu suy, chi cat thu DA KHAI -----------------------
 *
 * VE NAY GHIM BAI HOC DAT NHAT CUA CA BO. Ban dau `--trim` de xuat cat theo TIN HIEU do duoc
 * ("muc chi con nhac ma viec da dong"), va no bat oan BA LUOT LIEN TIEP 09/09:
 *   ⑴ "Tran so no giu 25"        — tran 25 VAN dang cuong che hom nay
 *   ⑵ "Migrate la BA viec trong mot" — la DINH NGHIA mot quy trinh dang dung
 *   ⑶ "Co che suite song song..."    — chua nguyen tac "moi co che phai co mot muc trong
 *      features.json", va nguyen tac do vua duoc ap lai cung ngay
 *
 * Ket luan, va no la thu dang ghim: **mot muc so quyet dinh thuong chua CA bang chung mot viec
 * da xong LAN mot nguyen tac van dang song.** Nen may khong duoc suy — no chi cat thu da KHAI,
 * dung dieu Duc chot: *AI de xuat, khai bao tuong minh moi lam doi bo luat.* */
{
  const cha = mkdtempSync(path.join(tmpdir(), "trim-"));
  try {
    const ghiSo = (muc) => writeFileSync(path.join(cha, "decisions.md"), ["# Quyet dinh", "", ...muc].join(NL) + NL, "utf8");
    mkdirSync(path.join(cha, "docs", "adr"), { recursive: true });
    /* MOT ADR CON HIEU LUC, de dung nen cho ve ⑸ ben duoi. Thieu file nay thi `adrSong` rong va
       ve "tro toi ADR song thi GIU" khong bao gio chay toi — dot bien DB-C da SONG SOT dung vi
       fixture ban dau khong co ADR nao. Fixture thieu mot ca thi phep kiem mu o dung ca do. */
    writeFileSync(path.join(cha, "docs", "adr", "0001-x.md"),
      ["---", "status: Accepted", "adr: 0001", "chu_de: x", "dau_moi: true", "---", "", "# ADR-0001 — x"].join(NL) + NL, "utf8");
    writeFileSync(path.join(cha, "BACKLOG.md"),
      ["# BACKLOG", "", "## P1", "", "### ~~KHUNG-1~~ · da dong", "", "### KHUNG-2 · con mo", ""].join(NL) + NL, "utf8");

    const muc = (ten, than) => [`## ${ten}`, "", ...than, ""];
    ghiSo([
      ...muc("2026-01-01 · chi nhac viec da dong", ["Lam xong KHUNG-1."]),
      ...muc("2026-01-02 · khai da thi hanh", ["> **trạng thái:** đã thi hành — ban ghi mot luot.", "", "KHUNG-1 xong."]),
      ...muc("2026-01-03 · khai dang hieu luc", ["> **trạng thái:** đang hiệu lực — nguyen tac con ap.", "", "KHUNG-1 xong nhung luat con."]),
      ...muc("2026-01-04 · con nhac viec dang mo", ["KHUNG-1 xong, KHUNG-2 chua."]),
      ...muc("2026-01-05 · tro toi ADR con hieu luc", ["KHUNG-1 xong. Ly le day du: ADR-0001."])
    ]);

    const ds = deXuatTrim(cha);
    const ten = (x) => x.tieuDe;
    // ⑴ Muc con nhac viec DANG MO → khong bao gio duoc neu.
    assert.ok(!ds.some((m) => /con nhac viec dang mo/.test(ten(m))),
      "muc con nhac viec dang mo phai duoc GIU, khong duoc neu");
    // ⑵ Muc khai "dang hieu luc" → khong bao gio duoc neu, du moi tin hieu deu chi ve phia cat.
    assert.ok(!ds.some((m) => /khai dang hieu luc/.test(ten(m))),
      "khai `dang hieu luc` PHAI thang moi tin hieu — day la ve chan ba lan bat oan 09/09");
    /* ⑸ Muc con tro toi mot ADR DANG HIEU LUC → GIU, du no chi nhac viec da dong. ADR la tang
       LY LE: con tro toi mot ADR song nghia la quyet dinh do van dang do cho mot luat song.
       Ve nay them sau khi dot bien "bo ve ADR song" SONG SOT — fixture cu khong co ADR nao. */
    assert.ok(!ds.some((m) => /tro toi ADR con hieu luc/.test(ten(m))),
      "muc tro toi ADR CON HIEU LUC phai duoc GIU — ve nay chan ca 'Tran so no giu 25' hom 09/09");
    // ⑶ Muc khai "da thi hanh" → neu ra VA danh dau cat duoc ngay.
    const daKhai = ds.filter((m) => m.daKhai);
    assert.equal(daKhai.length, 1, `dung mot muc duoc phep cat, dang: ${JSON.stringify(ds.map(ten))}`);
    assert.match(daKhai[0].tieuDe, /khai da thi hanh/);
    // ⑷ Muc CHUA KHAI ma co tin hieu → van duoc NEU, nhung KHONG duoc danh dau cat duoc.
    const chuaKhai = ds.filter((m) => !m.daKhai);
    assert.equal(chuaKhai.length, 1, `dung mot muc chua khai, dang: ${JSON.stringify(chuaKhai.map(ten))}`);
    assert.match(chuaKhai[0].tieuDe, /chi nhac viec da dong/);
    ok("9 · cắt: khai `đang hiệu lực` thắng mọi tín hiệu · chỉ `đã thi hành` mới cắt được · chưa khai thì NÊU chứ không cắt");
  } finally { rmSync(cha, { recursive: true, force: true }); }
}

/* ---- 10. NẠP (Context Compiler): thứ nạp phải nhỏ, và đo được -------------
 *
 * Buoc ⑹ *compile + sort* cua vong doi luat. So cai duoc phep phinh vo han; thu NAP thi khong.
 * Con so dang nhin nhat khong phai tong da nap, ma la tong KHONG nap — no do bang muc 6 dang
 * tiet kiem bao nhieu. Bang do mat tac dung thi con so kia tut, va thay ngay. */
{
  const kq = napContext(ROOT, 300);
  assert.ok(kq.nhan.length >= 2, "phan NAP phai co it nhat NHAN + TRANG THAI");
  assert.ok(kq.nhan.some((t) => t.file === "AGENTS.md"), "AGENTS.md PHAI nam trong phan nap — no la nhan");
  assert.ok(kq.napDong > 0 && kq.napDong <= kq.tran,
    `phan nap phai duoi tran: ${kq.napDong}/${kq.tran}`);
  assert.equal(kq.dat, true);
  // Doi chung: vuot tran thi `dat` phai FALSE. Khong co ve nay thi `dat` co the luon true.
  assert.equal(napContext(ROOT, 10).dat, false, "tran 10 dong thi phai bao VUOT — neu khong, co le `dat` luon true");
  // Va phan KHONG nap phai lon hon han phan nap, khong thi bang muc 6 dang vo dung.
  assert.ok(kq.khongNap > kq.napDong * 3,
    `phan KHONG nap (${kq.khongNap}) phai lon hon han phan nap (${kq.napDong}) — neu khong, tai lieu tang hai dang bi nap het`);
  ok(`10 · nạp: ${kq.napDong}/${kq.tran} dòng · không nạp ${kq.khongNap} dòng (${Math.round(kq.napDong * 100 / (kq.napDong + kq.khongNap))}% nạp)`);
}

console.log(`${NL}${passed} passed, 0 failed, ${passed} total`);
