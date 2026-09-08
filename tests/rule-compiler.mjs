/* Ghim BỘ BIÊN DỊCH LUẬT — `scripts/rule-compiler.mjs` và phép kiểm B16.
 *
 * Vì sao bộ này đáng ghim kỹ: nó là RĂNG CHỐNG PHÌNH LUẬT. Một cái răng không cắn được thì tệ
 * hơn không có răng, vì nó làm người ta yên tâm. Nên mọi vế dưới đây đều phải dựng nổi CẢ HAI
 * nhánh — khai đúng thì xanh, khai sai thì đỏ — chứ không chỉ chạy cho xanh.
 *
 * SÁU ĐỘT BIẾN ĐÃ CHẠY 09/09, ghi ở cuối file kèm cái SỐNG SÓT.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import { bienDich, chuanHoaAdr, chuDeKhaiTu, deXuat, docAdr, docFrontmatter, soatLuat } from "../scripts/rule-compiler.mjs";

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
 *
 * CÁI SỐNG SÓT dạy nhiều nhất: fixture đầu đặt đầu mối là ADR-0012 và thành viên là ADR-0013,
 * nên đầu mối TÌNH CỜ cũng là mã nhỏ nhất và ngày sớm nhất — xếp-theo-mã và xếp-theo-đầu-mối cho
 * CÙNG một kết quả. Vế 5 khi đó chỉ đang xác nhận một sự trùng hợp. Đảo lại (đầu mối 0013, thành
 * viên 0011) là đột biến chết ngay. Cùng bài học đã ghi ở `luu-do-smoke.mjs`: một vế đo KẾT QUẢ
 * CHUNG của nhiều cơ chế thì nó không ghim cơ chế nào. */

console.log(`${NL}${passed} passed, 0 failed, ${passed} total`);
