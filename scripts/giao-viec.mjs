#!/usr/bin/env node
/* GIAO-VIEC — ghép một đề bài ĐÃ ĐO SẴN cho một phiên AI khác (Codex, GPT…).
 *
 * VÌ SAO CÓ FILE NÀY. Đức chốt 2026-09-06: "Claude Code không thể làm hết một mình, sẽ hết
 * usage." Nên ba việc lặp lại của bộ khung — nâng · migrate · audit — phải giao được cho AI
 * khác. Lượt giao ĐẦU TIÊN (06/09, Codex CLI 0.153.4) hỏng ở đúng một chỗ, và chỗ đó không
 * phải lỗi của Codex:
 *
 *   Đề bài được viết TRƯỚC khi ai đo repo đích. Nó dạy `git add -A` vô điều kiện, trong khi
 *   repo đích đang có ba file sửa dở của phiên khác. Nếu phiên nhận việc làm theo, nó cuốn
 *   việc của người khác vào commit của mình rồi đẩy đi — `safe-push` chặn ở tầng COMMIT, nên
 *   nó không cứu được khi hai thứ đã nằm trong CÙNG một commit.
 *
 * Bài học: **đo repo đích rồi mới viết đề bài, không phải viết xong rồi mới đo.** Việc đó lặp
 * lại và máy làm được, nên nó thành lệnh chứ không thành một dòng dặn dò trong tài liệu — dòng
 * dặn dò thì lần thứ ba sẽ có người bỏ qua.
 *
 * FAIL-CLOSED. Đo không được thì DỪNG, không in đề bài. Một đề bài dựng từ số liệu đoán còn
 * nguy hiểm hơn không có đề bài, vì phiên nhận việc tin nó. */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const NL = String.fromCharCode(10);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* Ba loại việc — hằng số nằm ở `overview-doc.mjs`, không nằm ở đây.
 *
 * Vì sao ngược đời như vậy: lệnh này **ở lại repo nhà**, còn bảng thì **đi theo bản trích**.
 * Bảng cần biết ba loại việc để in ra; nếu hằng số ở đây thì bảng phải nhập từ đây, và mọi
 * repo đích nạp trang sẽ chết ngay dòng import vì file này không có ở đó. Chiều phụ thuộc phải
 * chảy từ thứ Ở LẠI sang thứ ĐI THEO. Xuất lại để người gọi cũ không phải đổi. */
export { VIEC } from "./overview-doc.mjs";
import { VIEC } from "./overview-doc.mjs";

const CHUNG = "docs/briefs/GIAO-VIEC-CHUNG.md";

/* VÙNG BỘ KHUNG — đường dẫn mà một lượt nâng/migrate sẽ ghi vào.
 *
 * Danh sách này quyết định câu hỏi đắt nhất của mục E: file sửa dở nằm TRONG hay NGOÀI. Thà
 * kể thừa còn hơn kể thiếu: kể thừa thì phiên bị DỪNG oan và người mở ra xem; kể thiếu thì
 * phiên ghi đè việc dở của ai đó và không ai biết. */
export const VUNG_BO_KHUNG = [
  "scripts/", "tests/", "docs/", ".ark/", ".agents/",
  "package.json", ".repo-structure.json", ".gitattributes",
  "AGENTS.md", "CLAUDE.md", "HANDOFF.md", "STATUS.md", "BACKLOG.md", "decisions.md",
  "STATUS.template.md", "CHANGELOG.md", "README.md"
];

export function trongVungBoKhung(rel) {
  const p = String(rel).replaceAll("\\", "/");
  return VUNG_BO_KHUNG.some((v) => (v.endsWith("/") ? p.startsWith(v) : p === v));
}

function git(repo, args) {
  try {
    /* stderr PHẢI pipe. Mặc định của `execFileSync` là để stderr chảy thẳng ra màn hình cha,
     * nên mỗi lần dò một thứ có thể không tồn tại (`@{u}`, `origin/HEAD`) là git in một dòng
     * `fatal:` vào giữa đề bài. Người đọc thấy "fatal" thì tưởng lệnh hỏng. */
    return { ok: true, out: execFileSync("git", args, { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim() };
  } catch (e) {
    return { ok: false, out: String(e.stderr || e.message || "").split(NL)[0] };
  }
}

/* `git status --porcelain` → danh sách đường dẫn. Bỏ phần trạng thái hai ký tự đầu, và xử lý
 * dạng đổi tên "R  cu -> moi" (lấy vế MỚI, vì đó là thứ sẽ bị stage). */
export function duongDanBan(porcelain) {
  const ra = [];
  for (const dong of String(porcelain).split(NL)) {
    if (!dong.trim()) continue;
    let p = dong.slice(3).trim();
    const mui = p.indexOf(" -> ");
    if (mui >= 0) p = p.slice(mui + 4).trim();
    if (p.startsWith('"') && p.endsWith('"')) p = p.slice(1, -1);
    ra.push(p);
  }
  return ra;
}

/* Bảng quyền: khoá nào đang có chủ, và chủ có phải mình không.
 * `null` (không đọc được / không phải bảng) KHÁC hẳn "trống" — người gọi phải phân biệt. */
export function chuVung(raw) {
  let j;
  try { j = JSON.parse(raw); } catch { return null; }
  const c = j?.claims;
  if (!c || typeof c !== "object") return null;
  const ra = [];
  for (const [khoa, v] of Object.entries(c)) {
    if (khoa.startsWith("_doc") || khoa.startsWith("_label")) continue;
    ra.push({ khoa, owner: v && typeof v === "object" ? (v.owner || null) : null, task: v?.task || null });
  }
  return ra;
}

function docNeuCo(p) {
  try { return fs.readFileSync(p, "utf8"); } catch { return null; }
}

function boFrontmatter(text) {
  const d = String(text).split(NL);
  if (d[0] !== "---") return text;
  const het = d.indexOf("---", 1);
  return het < 0 ? text : d.slice(het + 1).join(NL).replace(/^\n+/, "");
}

/* ĐO repo đích. Trả về { chan, canh, dong }:
 *   chan — lý do DỪNG, không in đề bài
 *   canh — cảnh báo, in VÀO đề bài để phiên nhận việc đọc
 *   dong — các dòng số liệu của khối ĐO ĐƯỢC */
export function doRepo(repoAbs, { viec, as = null, banNha = null, fsx = fs, gitx = git } = {}) {
  const chan = [];
  const canh = [];
  const dong = [];
  const cauHinh = VIEC[viec];

  if (!fsx.existsSync(repoAbs)) {
    chan.push("KHONG_TIM_THAY_REPO: không có thư mục `" + repoAbs + "`.");
    return { chan, canh, dong };
  }
  const g = gitx(repoAbs, ["rev-parse", "--show-toplevel"]);
  if (!g.ok) {
    chan.push("KHONG_PHAI_KHO_GIT: `" + repoAbs + "` không phải kho git (" + g.out + ")." + NL +
      "  → codex exec cũng từ chối chạy ở thư mục không phải kho git. Trỏ vào đúng gốc repo.");
    return { chan, canh, dong };
  }

  const nhanh = gitx(repoAbs, ["rev-parse", "--abbrev-ref", "HEAD"]);
  dong.push("- **Nhánh:** `" + (nhanh.ok ? nhanh.out : "KHÔNG ĐO ĐƯỢC") + "`");

  /* NHÁNH XA. `git fetch` không chạy được trong sandbox của codex, nên con số này là của lần
   * fetch GẦN NHẤT — có thể cũ. Nói thẳng ra, thay vì để người đọc tưởng nó tươi. */
  const up = gitx(repoAbs, ["rev-parse", "--abbrev-ref", "@{u}"]);
  if (!up.ok) {
    dong.push("- **Nhánh xa:** không có — bỏ qua phép so, và cổng sẽ BỎ phép kiểm nhãn lane.");
  } else {
    const dem = gitx(repoAbs, ["rev-list", "--left-right", "--count", up.out + "...HEAD"]);
    if (!dem.ok) {
      chan.push("KHONG_DO_DUOC_NHANH_XA: có nhánh xa `" + up.out + "` mà không đếm được (" + dem.out + ").");
    } else {
      const [sau, truoc] = dem.out.split(/\s+/).map(Number);
      dong.push("- **So với `" + up.out + "`:** " + sau + " sau · " + truoc +
        " trước *(theo lần `git fetch` gần nhất — có thể cũ)*");
      if (sau > 0 && cauHinh.ghi) {
        canh.push("**Bản trên máy đang SAU nhánh xa " + sau + " commit.** Repo đích có luật kiểu " +
          "*\"phải đồng bộ với cloud trước khi ghi\"* thì **DỪNG và báo** — đừng tự pull, đừng tự " +
          "ghi đè. Đã xảy ra thật 06/09, và phiên nhận việc dừng đúng.");
      }
    }
  }

  /* SO VỚI NHÁNH MẶC ĐỊNH, không chỉ so với upstream của chính mình.
   *
   * Vấp thật 06/09 (KHUNG-30): một repo đích đứng trên nhánh tính năng, upstream của CHÍNH
   * nhánh đó khớp hoàn toàn — "0 sau · 0 trước" — trong khi so với `origin/main` nó lệch
   * **5 sau / 48 trước**. Chỉ in con số thứ nhất là để người đọc yên tâm về một thứ không ai
   * hỏi, rồi giấu mất thứ làm cả lượt phải dừng. */
  const mac = gitx(repoAbs, ["rev-parse", "--abbrev-ref", "origin/HEAD"]);
  if (mac.ok && mac.out && (!up.ok || mac.out !== up.out)) {
    const dem2 = gitx(repoAbs, ["rev-list", "--left-right", "--count", mac.out + "...HEAD"]);
    if (dem2.ok) {
      const [sau2, truoc2] = dem2.out.split(/\s+/).map(Number);
      dong.push("- **So với nhánh mặc định `" + mac.out + "`:** " + sau2 + " sau · " + truoc2 + " trước");
      if (sau2 > 0 && cauHinh.ghi) {
        canh.push("**Nhánh này lệch nhánh mặc định `" + mac.out + "`: " + sau2 + " sau · " + truoc2 +
          " trước.** Nâng bộ khung trên một nhánh lệch xa là quyết định của người chốt, không phải " +
          "của AI. **DỪNG và báo con số này** — đừng tự chọn nhánh, đừng tự merge.");
      }
    }
  }

  /* CÂY LÀM VIỆC — câu hỏi đắt nhất của mục E, trả lời sẵn ở đây. */
  /* `-uall` BẮT BUỘC. Không có nó thì git GỘP một thư mục chưa theo dõi thành đúng một dòng
   * `?? dashboard/` — và đề bài đi bảo phiên nhận việc stage cả thư mục, không biết trong đó
   * có bao nhiêu file của ai. Đo thật lúc viết phép kiểm cho chính lệnh này. */
  const st = gitx(repoAbs, ["status", "--porcelain", "-uall"]);
  if (!st.ok) {
    chan.push("KHONG_DOC_DUOC_TRANG_THAI: `git status` hỏng (" + st.out + ").");
  } else {
    const ban = duongDanBan(st.out);
    if (!ban.length) {
      dong.push("- **Cây làm việc:** sạch — `git add -A` an toàn ở lượt này.");
    } else {
      const trong = ban.filter(trongVungBoKhung);
      const ngoai = ban.filter((p) => !trongVungBoKhung(p));
      dong.push("- **Cây làm việc:** " + ban.length + " file sửa dở — " + trong.length +
        " TRONG vùng bộ khung, " + ngoai.length + " NGOÀI.");
      if (trong.length && cauHinh.ghi) {
        chan.push("FILE_SUA_DO_TRONG_VUNG: có việc đang dở ngay trong vùng lượt này sẽ ghi:" + NL +
          trong.map((p) => "    " + p).join(NL) + NL +
          "  → DỪNG. Hỏi người chốt. Nâng/migrate lúc này là ghi đè việc đang dở của ai đó.");
      }
      // Lượt CHỈ ĐỌC không commit gì, nên cảnh báo về `git add` chỉ là nhiễu ở đó.
      if (ngoai.length && cauHinh.ghi) {
        canh.push("**TUYỆT ĐỐI không `git add -A` ở lượt này.** " + ngoai.length +
          " file dưới đây là việc đang dở của phiên khác, nằm NGOÀI vùng của bạn — chỉ stage " +
          "đúng đường dẫn của mình:" + NL + NL +
          ngoai.map((p) => "    " + p).join(NL));
      }
    }
  }

  /* BẢNG QUYỀN. */
  const rawClaims = docNeuCo(path.join(repoAbs, ".agents", "claims.json"));
  if (rawClaims === null) {
    if (viec === "migrate") {
      dong.push("- **Bảng quyền:** chưa có — bước 2 của phần việc phải thả bản hạt giống vào TRƯỚC mọi thứ khác.");
    } else {
      chan.push("KHONG_CO_BANG_QUYEN: repo đích chưa có `.agents/claims.json`." + NL +
        "  → Repo chưa lắp bộ khung. Dùng `--viec migrate` chứ không phải `--viec nang`.");
    }
  } else {
    const ds = chuVung(rawClaims);
    if (ds === null) {
      chan.push("BANG_QUYEN_HONG: `.agents/claims.json` không đọc được thành bảng quyền.");
    } else {
      const giu = ds.filter((c) => c.owner);
      const nguoiKhac = giu.filter((c) => !as || c.owner !== as);
      dong.push("- **Bảng quyền:** " + ds.length + " khoá (" + ds.map((c) => c.khoa).join(" · ") +
        ") — " + giu.length + " đang có chủ.");
      if (nguoiKhac.length && cauHinh.ghi) {
        chan.push("VUNG_CO_CHU_KHAC: những khoá sau đang bị phiên khác giữ:" + NL +
          nguoiKhac.map((c) => "    " + c.khoa + " → " + c.owner + (c.task ? " (" + c.task + ")" : "")).join(NL) + NL +
          "  → DỪNG. Giành vùng một phiên khác đang giữ là việc phải hỏi người chốt.");
      }
    }
  }

  /* SỔ GHIM — repo đã lắp bộ khung chưa, và đang ở bản nào. */
  const rawLock = docNeuCo(path.join(repoAbs, ".ark", "harness.lock.json"));
  let banDich = null;
  if (rawLock !== null) {
    try { banDich = JSON.parse(rawLock)?.version || null; } catch { banDich = null; }
  }
  if (viec === "nang") {
    if (banDich === null) {
      chan.push("CHUA_GHIM_BAN_KHUNG: repo đích không có `.ark/harness.lock.json` đọc được." + NL +
        "  → Chưa lắp bộ khung, hoặc lắp mà chưa ghim. Chạy `--viec migrate` trước.");
    } else {
      dong.push("- **Bản khung ở repo đích:** " + banDich + (banNha ? " → sẽ nâng lên " + banNha : ""));
      if (banNha && banDich === banNha) {
        canh.push("Repo đích **đã ở bản " + banNha + "** rồi. Chạy `--plan` xem có gì lệch không; " +
          "không lệch thì báo lại và dừng, đừng tạo commit rỗng.");
      }
    }
  } else if (viec === "migrate" && banDich !== null) {
    canh.push("Repo đích **đã ghim bản khung " + banDich + "** — tức đã migrate rồi. Việc bạn cần " +
      "có lẽ là `--viec nang`. Vẫn migrate thì phải nói rõ vì sao.");
  } else if (banDich !== null) {
    dong.push("- **Bản khung ở repo đích:** " + banDich);
  }

  return { chan, canh, dong };
}

export function ghepDeBai({ viec, repoAbs, as, banNha, dong, canh, chung, phanViec, ngay }) {
  const c = VIEC[viec];
  const kh = [];
  kh.push("# ĐỀ BÀI — " + c.nhan);
  kh.push("");
  kh.push("> **Dán trọn văn bản này cho phiên AI nhận việc.** Nó cố ý không giả định người đọc đã");
  kh.push("> đọc repo bộ khung. Khối ĐO ĐƯỢC ngay dưới là số liệu thật, đo lúc giao việc.");
  kh.push("");
  kh.push("## ĐO ĐƯỢC LÚC GIAO VIỆC");
  kh.push("");
  kh.push("- **Repo đích:** `" + repoAbs + "`");
  kh.push("- **Tên phiên của bạn:** `" + (as || "<CHƯA ĐẶT — tự đặt một nhãn, dùng suốt lượt>") + "`");
  if (banNha) kh.push("- **Bản khung ở repo nhà:** " + banNha);
  kh.push(...dong);
  kh.push("- **Đo lúc:** " + ngay);
  kh.push("");
  if (canh.length) {
    kh.push("### CẢNH BÁO — đọc trước khi gõ lệnh đầu tiên");
    kh.push("");
    for (const w of canh) { kh.push(w); kh.push(""); }
  }
  kh.push("---");
  kh.push("");
  kh.push(boFrontmatter(chung).trim());
  kh.push("");
  kh.push("---");
  kh.push("");
  kh.push(boFrontmatter(phanViec).trim());
  return kh.join(NL) + NL;
}

function docThamSo(argv) {
  const a = { viec: null, repo: null, as: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--viec") a.viec = argv[++i];
    else if (argv[i] === "--repo") a.repo = argv[++i];
    else if (argv[i] === "--as") a.as = argv[++i];
  }
  return a;
}

function main() {
  const a = docThamSo(process.argv.slice(2));
  const ten = Object.keys(VIEC).join(" | ");
  if (!a.viec || !VIEC[a.viec] || !a.repo) {
    process.stderr.write(
      "GIAO-VIEC — ghép một đề bài đã đo sẵn cho phiên AI khác." + NL + NL +
      "  node scripts/giao-viec.mjs --viec <" + ten + "> --repo <đường-dẫn-repo-đích> [--as <tên-phiên>]" + NL + NL +
      "Đề bài in ra stdout. Hứng vào file rồi đưa cho Codex:" + NL + NL +
      "  cd \"<REPO ĐÍCH>\" && git fetch" + NL +
      "  node scripts/giao-viec.mjs --viec nang --repo \"<REPO ĐÍCH>\" --as codex-nang > de-bai.txt" + NL +
      "  cd \"<REPO ĐÍCH>\" && codex exec -s workspace-write - < de-bai.txt" + NL);
    return 2;
  }

  const repoAbs = path.resolve(a.repo);
  let banNha = null;
  try {
    banNha = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).version || null;
  } catch { banNha = null; }

  const { chan, canh, dong } = doRepo(repoAbs, { viec: a.viec, as: a.as, banNha });
  if (chan.length) {
    process.stderr.write("KHONG_GIAO_DUOC — đo repo đích xong, có chỗ phải dừng:" + NL + NL +
      chan.map((c) => "  " + c).join(NL + NL) + NL + NL +
      "Không in đề bài. Một đề bài dựng trên nền này sẽ dạy phiên nhận việc làm sai." + NL);
    return 2;
  }

  const chung = docNeuCo(path.join(ROOT, CHUNG));
  const phanViec = docNeuCo(path.join(ROOT, VIEC[a.viec].doc));
  if (chung === null || phanViec === null) {
    process.stderr.write("THIEU_DE_BAI: không đọc được " + (chung === null ? CHUNG : VIEC[a.viec].doc) + "." + NL);
    return 2;
  }

  /* Ngày lấy từ HEAD của repo NHÀ, không lấy đồng hồ: đề bài in ra sẽ được lưu lại và đem so
   * với nhau, nên nó phải tái lập được từ cùng một HEAD. */
  const moc = git(ROOT, ["log", "-1", "--format=%cs"]);
  process.stdout.write(ghepDeBai({
    viec: a.viec, repoAbs, as: a.as, banNha, dong, canh, chung, phanViec,
    ngay: moc.ok && moc.out ? moc.out : "KHÔNG ĐO ĐƯỢC"
  }));
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main());
}
