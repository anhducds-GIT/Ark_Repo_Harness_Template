/* KHOÁ ĐANG GIỮ MÀ REPO CHƯA THẤY DẤU VẾT — phép ghim cho cơ chế đa phiên.
 *
 * Đây là cơ chế đa phiên, nên `docs/protocols/MULTIFLOW.md` mục 5 bắt ĐỘT BIẾN KIỂM, không phải
 * gợi ý. Bốn đột biến đã chạy thật khi viết file này, mỗi cái làm ĐỎ đúng vế của nó:
 *
 *   1. gỡ hẳn khối ghi chú khỏi `session-check.mjs`      → vế 7 ĐỎ
 *   2. đổi ghi chú thành một `check(...)` thật            → vế 7 ĐỎ (số phép kiểm đổi)
 *   3. đảo nhánh "file sửa dở" trong `xetDauVet`         → vế 1 ĐỎ
 *   4. cho nhánh git-hỏng trả `CHUA` thay vì `KHONG_DO`  → vế 4 ĐỎ
 *   5. `mocCoGio` luôn trả `true` (dựng lại đúng con số ma) → vế 9 ĐỎ
 *   6. `dangNhac` bỏ qua độ chính xác của mốc            → vế 9 ĐỎ
 *
 * MỨC NGHIÊM TRỌNG LÀ PHẦN CỦA HỢP ĐỒNG. Vế 7 ghim rằng tín hiệu này **không đổi mã thoát của
 * cổng**. Nếu ai đó thấy nó "quan trọng quá nên phải chặn", họ đang dạy mọi lane ghi bừa một
 * byte để giữ khoá cho hợp lệ — và lúc đó phép kiểm biến thành thứ ngược lại chính nó.
 */

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { ageHours, ageLabel, dangNhac, DAU_VET, GIO_NHAC, mocCoGio, noiDauVet, xetDauVet } from "../scripts/claim.mjs";
import { khoiDangLamGi } from "../scripts/build-overview.mjs";

let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const NL = String.fromCharCode(10);

const MOC = "2026-09-06T10:00:00Z";
const TRUOC = "2026-09-06T09:00:00Z";
const SAU = "2026-09-06T11:00:00Z";

/* ---- 1. File sửa dở trong vùng = ĐÃ THẤY -------------------------------- */
{
  const r = xetDauVet("_code", MOC, [], [{ key: "_code" }]);
  assert.equal(r, DAU_VET.THAY, "vung co file sua do tren dia thi repo DA thay dau vet");
  // Đối chứng: file sửa dở ở vùng KHÁC không tính cho vùng này.
  assert.equal(xetDauVet("_code", MOC, [], [{ key: "_docs" }]), DAU_VET.CHUA,
    "file sua do o vung khac khong duoc tinh cho vung nay");
  ok("1 · file sửa dở trong vùng → ĐÃ THẤY, ở vùng khác → không tính");
}

/* ---- 2. Commit SAU lúc nhận khoá = ĐÃ THẤY ------------------------------ */
{
  assert.equal(xetDauVet("_code", MOC, [{ key: "_code", khi: SAU }], []), DAU_VET.THAY,
    "commit cham vung sau luc nhan khoa thi repo DA thay dau vet");
  ok("2 · commit sau lúc nhận khoá → ĐÃ THẤY");
}

/* ---- 3. Chỉ có commit TRƯỚC lúc nhận khoá = CHƯA THẤY -------------------
 *
 * Vế này là lý do phép đo phải so mốc, không chỉ đếm commit. Không có nó thì một vùng có lịch sử
 * dày sẽ MÃI MÃI trông như "đang có người làm", và tín hiệu không bao giờ bật — một phép kiểm
 * không thể đỏ trông giống hệt một phép kiểm chưa từng đỏ. */
{
  assert.equal(xetDauVet("_code", MOC, [{ key: "_code", khi: TRUOC }], []), DAU_VET.CHUA,
    "commit truoc luc nhan khoa KHONG phai dau vet cua luot giu nay");
  ok("3 · chỉ có commit trước lúc nhận khoá → CHƯA THẤY");
}

/* ---- 4. Không đo được ≠ chưa thấy — chiều fail-closed ------------------- */
{
  assert.equal(xetDauVet("_code", MOC, null, []), DAU_VET.KHONG_DO, "git hong thi phai noi KHONG DO DUOC");
  assert.equal(xetDauVet("_code", MOC, [], null), DAU_VET.KHONG_DO, "khong doc duoc dia thi phai noi KHONG DO DUOC");
  assert.notEqual(xetDauVet("_code", MOC, null, null), DAU_VET.CHUA,
    "khong do duoc TUYET DOI khong duoc nga ve 'chua thay' — do la nhanh khien nguoi ta nghi toi nha khoa");
  ok("4 · không đo được → KHÔNG ĐO ĐƯỢC, không ngã về CHƯA THẤY");
}

/* ---- 5. Mốc nhận khoá hỏng, và commit không đọc được mốc ---------------- */
{
  assert.equal(xetDauVet("_code", null, [], []), DAU_VET.KHONG_DO, "khong biet nhan khoa tu khi nao thi khong ket luan duoc");
  assert.equal(xetDauVet("_code", "hom qua", [], []), DAU_VET.KHONG_DO, "moc khong doc duoc thi khong ket luan duoc");
  // Commit không đọc được mốc thì nhầm về phía "lane đang làm" — nhầm an toàn.
  assert.equal(xetDauVet("_code", MOC, [{ key: "_code", khi: "???" }], []), DAU_VET.THAY,
    "commit khong doc duoc moc phai tinh la CO dau vet, khong duoc bo qua");
  ok("5 · mốc hỏng → KHÔNG ĐO ĐƯỢC · commit mốc hỏng → nhầm về phía an toàn");
}

/* ---- 6. TÊN CỦA TÍN HIỆU LÀ PHẦN CỦA HỢP ĐỒNG --------------------------
 *
 * Bản đầu của đề bài gọi nó là "vùng chưa bị chạm", và người đọc — kể cả chính phiên viết ra nó —
 * đọc thành "lane đang rảnh". Khoảng cách giữa hai câu đó đã trả giá thật 06/09. Vế này ghim
 * rằng chữ "rảnh" không được lẻn vào, ở bất kỳ trạng thái nào. */
{
  assert.match(noiDauVet(DAU_VET.CHUA), /repo chưa thấy dấu vết/, "cau in ra phai la 'repo chua thay dau vet'");
  assert.equal(noiDauVet(DAU_VET.THAY), "", "da thay dau vet thi khong noi gi them");
  assert.match(noiDauVet(DAU_VET.KHONG_DO), /không đo được/, "khong do duoc thi phai NOI ra");
  for (const t of Object.values(DAU_VET)) {
    assert.doesNotMatch(noiDauVet(t), /rảnh|nhàn|không làm gì|đang chờ/,
      `"${noiDauVet(t)}" — tin hieu nay noi REPO CHUA THAY GI, no khong noi lane dang ranh`);
  }
  ok("6 · câu in ra đúng chữ đã chốt, và không chỗ nào nói 'rảnh'");
}

/* ---- 7. CỔNG: hiện ra, VÀNG, và KHÔNG đổi mã thoát --------------------- */
{
  const SCRIPTS = ["session-check.mjs", "repo-structure.mjs", "claim.mjs", "check-bootstrap.mjs", "build-dashboard.mjs"];
  const cha = mkdtempSync(join(tmpdir(), "dau-vet-"));
  try {
    const kho = join(cha, "kho");
    const bare = join(cha, "bare.git");
    execFileSync("git", ["init", "-q", "--bare", bare], { encoding: "utf8" });
    mkdirSync(kho, { recursive: true });
    const at = (...a) => execFileSync("git", a, { cwd: kho, encoding: "utf8" });
    at("init", "-q", "-b", "main");
    at("config", "user.name", "t");
    at("config", "user.email", "t@e.invalid");
    for (const d of ["scripts", ".agents", "docs", "tests", "evidence"]) mkdirSync(join(kho, d), { recursive: true });
    for (const f of SCRIPTS) copyFileSync(join(ROOT, "scripts", f), join(kho, "scripts", f));
    const ct = JSON.parse(readFileSync(join(ROOT, ".repo-structure.json"), "utf8"));
    writeFileSync(join(kho, ".repo-structure.json"), JSON.stringify(ct, null, 2) + NL, "utf8");
    const bang = (claimedAt) => {
      /* `_root` LUÔN có mặt, kể cả khi repo không khai vùng nào — `repo-structure.mjs` bắt buộc
       * khoá đó tồn tại. Suite này ĐI THEO BẢN TRÍCH nên nó phải chạy được cả ở một repo có khối
       * `areas` rỗng; không có dòng này thì bảng quyền dựng ra rỗng và cổng nổ vì lý do khác hẳn
       * thứ đang được ghim. (Bài học lặp lại: một vế chỉ đúng ở repo nhà.) */
      const khoa = { _root: { owner: "thu", ai: null, claimed_at: claimedAt, task: "nen", released_at: null } };
      for (const v of Object.values(ct.areas || {})) {
        if (v && v.steward) khoa[v.steward] = { owner: "thu", ai: null, claimed_at: claimedAt, task: "nen", released_at: null };
      }
      writeFileSync(join(kho, ".agents", "claims.json"), JSON.stringify({ claims: khoa }, null, 2) + NL, "utf8");
    };
    bang(null);
    writeFileSync(join(kho, "docs", "a.md"), "# a" + NL, "utf8");
    writeFileSync(join(kho, "evidence", "cu.txt"), "bang chung cu" + NL, "utf8");
    at("add", "-A");
    at("commit", "-q", "-m", "nen" + NL + NL + "Lane: thu");
    at("remote", "add", "origin", bare);
    at("push", "-q", "-u", "origin", "main");

    const chay = () => {
      const r = spawnSync(process.execPath, [join(kho, "scripts", "session-check.mjs"), "--as", "thu"],
        { cwd: kho, encoding: "utf8" });
      return { ma: r.status, out: String(r.stdout || "") + String(r.stderr || "") };
    };

    /* ĐỐI CHỨNG trước. Mốc `null` thì không kết luận được, nên KHÔNG được có câu nào. Không có
     * vế này thì một phiên bản in câu đó cho MỌI lượt cũng qua được khối dưới. */
    const nen = chay();
    assert.doesNotMatch(nen.out, /repo chưa thấy dấu vết/,
      "moc null thi khong ket luan duoc — khong duoc in cau do");

    // Giờ mốc là BÂY GIỜ, vùng chưa ai chạm gì kể từ đó.
    bang(new Date().toISOString());
    const co = chay();
    assert.match(co.out, /VÀNG/, "phai hien ra, va phai tu khai la VANG");
    assert.match(co.out, /repo chưa thấy dấu vết/, "phai noi dung chu da chot");
    assert.match(co.out, /claim\.mjs --release/, "phai chi ra cach tu tra khoa — noi van de ma khong noi loi ra la nua viec");

    /* MÃ THOÁT KHÔNG ĐỔI. Đây là vế ghim mức nghiêm trọng, và là vế đắt nhất của file này.
     * Hai lượt chạy khác nhau ĐÚNG một trường `claimed_at` — `claims.json` được MIỄN khoá nên
     * nó không kéo theo phép kiểm nào khác. */
    assert.equal(co.ma, nen.ma,
      `tin hieu nay la VANG: no KHONG duoc doi ma thoat cua cong (nen=${nen.ma}, co-tin-hieu=${co.ma})`);
    assert.doesNotMatch(co.out, /^ {2}\[ĐỎ {2}\].*dấu vết/mi, "tin hieu nay khong duoc xuat hien nhu mot muc DO");

    /* Và nó không được len vào danh sách phép kiểm — ở đó nó sẽ thành ĐỎ ở lần sửa sau.
     *
     * HAI PHÉP GHIM, không phải một, và đây là chỗ file này suýt nói dối. Bản đầu chỉ so mã
     * thoát — nhưng kho nền vốn đã đỏ vì lý do khác (thiếu `AGENTS.md`, thiếu artifact), nên mã
     * thoát là 1 ở CẢ HAI lượt và một đột biến nâng mức nghiêm trọng vẫn lọt. Số phép kiểm và
     * câu kết luận thì độc lập với nền: biến ghi chú thành `check(...)` là đổi cả hai ngay. */
    const soMuc = (t) => (t.match(/^ {2}\[(XANH|ĐỎ {2}|BỎ {2})\]/gm) || []).length;
    assert.equal(soMuc(co.out), soMuc(nen.out), "so phep kiem phai y nguyen — day la GHI CHU, khong phai phep kiem");
    const ketLuan = (t) => (t.match(/^(XANH TOÀN BỘ|CHƯA XONG|CHƯA ĐỦ BẰNG CHỨNG|CỔNG BỊ SỬA).*/m) || [""])[0];
    assert.equal(ketLuan(co.out), ketLuan(nen.out),
      `cau ket luan cua cong phai y nguyen — tin hieu nay la VANG${NL}  nen: ${ketLuan(nen.out)}${NL}  co : ${ketLuan(co.out)}`);
    ok(`7 · cổng hiện tín hiệu, tự khai VÀNG, mã thoát y nguyên (${nen.ma})`);
  } finally { rmSync(cha, { recursive: true, force: true }); }
}

/* ---- 8. BẢNG: ba chỗ hiển thị phải nói CÙNG một câu --------------------- */
{
  const khoa = [
    { khoa: "_code", owner: "lane-a", task: "sua bo may", tu: MOC },
    { khoa: "_docs", owner: "lane-b", task: "viet tai lieu", tu: MOC }
  ];
  const h = khoiDangLamGi(khoa, "2026-09-06", new Map([["_code", DAU_VET.THAY], ["_docs", DAU_VET.CHUA]]));
  const dong = h.split(NL);
  const dCode = dong.find((d) => d.includes("_code"));
  const dDocs = dong.find((d) => d.includes("_docs"));
  assert.doesNotMatch(dCode, /chưa thấy dấu vết/, "vung DA thay dau vet thi khong duoc gan nhan");
  assert.match(dDocs, /repo chưa thấy dấu vết/, "vung CHUA thay phai gan nhan, dung chu cua noiDauVet");
  assert.match(h, /Đừng nhả khoá của luồng khác vì con số này|đừng nhả khoá/i,
    "khoi nay phai noi ro no KHONG cho phep nha khoa ho");
  /* MỌI DÒNG MANG DỮ LIỆU KHOÁ phải có nhãn dễ đổi. Dòng chữ tĩnh thì không cần — nó không đổi.
   * Không có vế này thì tín hiệu (đo LÚC SINH, nên đổi mỗi lượt) làm trang lệch HEAD, cổng đỏ
   * với một câu không nói gì về nguyên nhân, và người ta sẽ gỡ tín hiệu chứ không gỡ nguyên nhân. */
  for (const d of dong) {
    if (!/lane-a|lane-b|_code|_docs|Đang làm gì/.test(d)) continue;
    assert.ok(d.trimStart().startsWith("<!--khoa-->"), `dong mang du lieu khoa ma khong co nhan de doi: ${d.slice(0, 70)}`);
  }
  ok("8 · bảng: đúng vùng được gắn nhãn, cùng một câu, và mọi dòng đều dễ đổi");
}

/* ---- 9. CON SỐ MA: mốc chỉ có NGÀY không được báo giờ ------------------
 *
 * ĐO ĐƯỢC 06/09, Đức nhìn thấy trước: bảng quyền báo ba khoá *"giữ 16h ⚠ quá 6h"* trong khi cả
 * ba vừa nhận **hai tiếng trước**. Mốc là `"2026-09-06"` — chỉ ngày — nên `Date.parse` đọc thành
 * nửa đêm UTC và tới chiều thì phép trừ ra 16 tiếng.
 *
 * Vế này ghim cả hai vế của lỗi, vì sửa một nửa là chưa sửa: (a) chữ không được nói giờ, và
 * (b) **⚠ không được bật**. Một cái ⚠ sai vài lần thì lần thứ ba không ai nhìn nữa — lúc đó một
 * khoá kẹt thật cũng trôi qua, và tín hiệu thành thứ ngược lại chính nó. */
{
  const gioTruoc = new Date("2026-09-06T16:00:00Z");
  const chiNgay = "2026-09-06";
  const coGio = "2026-09-06T14:00:00Z";

  assert.equal(mocCoGio(chiNgay), false, "moc chi co ngay thi mocCoGio phai la false");
  assert.equal(mocCoGio(coGio), true, "moc co gio thi mocCoGio phai la true");

  const hNgay = ageHours(chiNgay, gioTruoc);
  assert.ok(hNgay > 6, "doi chung: phep tru VAN ra 16h — day chinh la con so ma");
  assert.doesNotMatch(ageLabel(hNgay, false), /\d+\s*h|phút/,
    `moc chi-ngay KHONG duoc noi gio, dang noi: "${ageLabel(hNgay, false)}"`);
  assert.match(ageLabel(hNgay, false), /hôm nay/, "moc chi-ngay trong ngay thi noi 'nhan trong hom nay'");
  assert.equal(dangNhac(hNgay, false), false,
    "⚠ KHONG duoc bat tren mot con so khong do duoc — mot canh bao sai vai lan la khong ai nhin nua");

  // Đối chứng ngược: mốc CÓ giờ thì mọi thứ vẫn chạy như cũ, không bị vế trên làm câm.
  assert.match(ageLabel(ageHours(coGio, gioTruoc), true), /^2h$/, "moc co gio van phai noi dung so gio");
  assert.equal(dangNhac(GIO_NHAC + 1, true), true, "moc co gio va qua han thi ⚠ VAN phai bat");
  // Mốc chỉ-ngày qua hẳn một ngày thì được nhắc — độ phân giải ngày đủ để khẳng định điều đó.
  assert.equal(dangNhac(30, false), true, "qua han mot ngay thi moc chi-ngay cung du chac de nhac");
  ok("9 · mốc chỉ có ngày: không bịa ra giờ, và KHÔNG bật ⚠ — con số ma Đức bắt được 06/09");
}

console.log(`khoa-dau-vet: ${passed} vế xanh`);
