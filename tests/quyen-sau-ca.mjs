#!/usr/bin/env node
// quyen-sau-ca.mjs — sáu ca hành vi của lõi cấp quyền (brief LAT-CAT-HAI-VAI-01 mục 2).
//
// Dựng thật: một remote git cục bộ + HAI checkout, tất cả trong thư mục tạm, NGOÀI repo.
// Không đụng repo đang làm việc, không cần mạng.
//
// Vì sao có ca "hợp lệ" ở cuối: năm ca chặn mà không có ca thông thì chỉ chứng minh được
// "chặn được mọi thứ" — kể cả việc đúng. Ca ⑥ là ca duy nhất chứng minh cửa còn mở.
//
// Vì sao vài ca dựng commit sự kiện BẰNG TAY thay vì gọi lệnh: mấy ca đó là ca ĐUA, và lệnh
// tự đồng bộ lại ở đầu mỗi lượt nên cửa sổ đua đóng trước khi test chạm tới. Dựng tay là cách
// duy nhất đặt được một phiên vào đúng tình trạng "đang cầm bản sổ cũ" — và nó cũng có nghĩa
// test không tin bất kỳ hàm nào của chính mã đang được chấm.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QUYEN = path.join(GOC, 'scripts', 'quyen.mjs');
const REF = 'refs/ark/quyen';
const TEP = 'su-kien.jsonl';

let dat = 0;
let truot = 0;

function xong(ten, ok, ghiChu = '') {
  if (ok) { dat += 1; console.log(`  ok   ${ten}${ghiChu ? ` — ${ghiChu}` : ''}`); }
  else { truot += 1; console.log(`  SAI  ${ten}${ghiChu ? ` — ${ghiChu}` : ''}`); }
}

// San thu dung SOM, vi moi truong git ben duoi can mot file cau hinh rong nam trong do.
// `os.devNull` tren Windows tro vao thiet bi nul, va git KHONG doc duoc no — nen dung file that.
const san = fs.mkdtempSync(path.join(os.tmpdir(), 'quyen-sau-ca-'));
const CAU_HINH_TRONG = path.join(san, 'gitconfig-trong');
fs.writeFileSync(CAU_HINH_TRONG, '');

const MOI_TRUONG = {
  ...process.env,
  GIT_AUTHOR_NAME: 'thu', GIT_AUTHOR_EMAIL: 'thu@ark.local',
  GIT_COMMITTER_NAME: 'thu', GIT_COMMITTER_EMAIL: 'thu@ark.local',
  GIT_CONFIG_GLOBAL: CAU_HINH_TRONG, GIT_CONFIG_SYSTEM: CAU_HINH_TRONG,
};

function git(cwd, args, input) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', env: MOI_TRUONG, input }).trim();
}

function gitThu(cwd, args, input) {
  try { return { ma: 0, ra: git(cwd, args, input) }; }
  catch (e) { return { ma: e.status ?? 1, ra: `${e.stdout || ''}${e.stderr || ''}` }; }
}

function chayTho(cwd, args) {
  try {
    const ra = execFileSync('node', [QUYEN, ...args], { cwd, encoding: 'utf8', env: MOI_TRUONG });
    return { ma: 0, ra };
  } catch (e) {
    return { ma: e.status ?? 1, ra: `${e.stdout || ''}${e.stderr || ''}` };
  }
}

/* BẢN ĐỒ VÙNG cho sân thử. Mỗi vùng là một thư mục cùng tên, cộng ba mục để ghim ba luật mà một
 * bản đồ toàn-thư-mục-phẳng không ghim được: một vùng của bên KHÁC (`tai-lieu/`), chế độ chia chủ
 * theo gói (`goi/`), và một mục con thắng mục cha nhờ tiền tố dài hơn (`goi/_chung/`). */
const TEN_VUNG = ['goi-f', 'goi-g', 'goi-h', 'goi-j', 'goi-k', 'goi-m', 'goi-m2', 'goi-n',
  'goi-aa', 'goi-p', 'goi-q', 'goi-r', 'goi-s', 'goi-t', 'goi-u', 'goi-v', 'goi-w', 'goi-x', 'goi-y', 'goi-z'];
const BAN_DO = path.join(san, 'ban-do.json');
{
  const areas = { _doc: 'ban do vung cho san thu' };
  for (const v of TEN_VUNG) areas[`${v}/`] = { steward: v, ownership_mode: 'root' };
  areas['tai-lieu/'] = { steward: 'vung-khac', ownership_mode: 'root' };
  areas['goi/'] = { steward: null, ownership_mode: 'per-package', claim_prefix: 'goi/' };
  areas['goi/_chung/'] = { steward: '_root', ownership_mode: 'root' };
  fs.writeFileSync(BAN_DO, JSON.stringify({ areas }, null, 1));
}

/* Hai cờ bản đồ được TIÊM ở đây, không rải ra 23 chỗ gọi. Lý do: mọi ca cũ nói về thẩm quyền,
 * không nói về bản đồ, nên thêm cùng một cặp cờ vào 23 dòng là tạo ra 23 chỗ để gõ sai một chỗ —
 * và một ca gõ sai cờ sẽ TRƯỢT VÌ LÝ DO KHÁC mà vẫn trông như đang đo điều nó khai.
 * Ca nào cần THIẾU cờ, hoặc cần một bản đồ khác, thì gọi `chayTho` trực tiếp. */
function chayQuyen(cwd, args) {
  const canBanDo = args.includes('--tich-hop') || args.includes('--xac-nhan');
  const them = [];
  if (canBanDo && !args.includes('--ban-do')) them.push('--ban-do', BAN_DO);
  if (canBanDo && !args.includes('--con-lai')) them.push('--con-lai', '_root');
  return chayTho(cwd, [...args, ...them]);
}

// Dựng một commit sự kiện bằng tay, đặt cha là ĐÚNG commit ta chỉ định (kể cả commit đã cũ).
// Đây là cách đặt một phiên vào tình trạng "cầm sổ cũ" mà lệnh thật không cho phép.
function dungSuKienTay(cwd, cha, soCu, suKien) {
  const noiDung = `${[...soCu, suKien].map((e) => JSON.stringify(e)).join('\n')}\n`;
  const blob = git(cwd, ['hash-object', '-w', '--stdin'], noiDung);
  const tree = git(cwd, ['mktree'], `100644 blob ${blob}\t${TEP}\n`);
  const args = ['commit-tree', tree, '-m', 'su kien dung tay'];
  if (cha) args.push('-p', cha);
  return git(cwd, args);
}

/* Bên kiểm là một BÊN KHÁC, và đó là cả điểm của nó: một tờ xác nhận do bên bị kiểm ký là lời
 * tự khai. Trong bản thật bên kiểm là workflow `cong-kiem` chạy trên máy GitHub; ở đây nó là một
 * cái tên khác gọi cùng lệnh. */
function xacNhan(cwd, remoteDuong, vung, boi, theHe, sha, coSo) {
  /* Bên kiểm phải LẤY VỀ trước: nó kiểm commit của bên khác, và cửa từ chối một SHA nó không tự
   * kiểm được (`UNKNOWN_COMMIT`). Bản thật cũng vậy — workflow clone rồi mới chấm.
   *
   * Lấy cả `refs/ark/*`, vì ỨNG VIÊN không nằm trên `main`. Phát hiện lúc dựng ca ⑪: nếu ứng viên
   * chỉ nằm trong checkout của A thì bên kiểm **không thấy được nó**, và cửa từ chối đúng
   * (`UNKNOWN_COMMIT`). Nên luồng phải có một chỗ công bố ứng viên **không phải `main`** — y như
   * nhánh của một pull request. Ở đây là `refs/ark/ung-vien/<lane>`. */
  gitThu(cwd, ['fetch', '--quiet', 'origin']);
  gitThu(cwd, ['fetch', '--quiet', 'origin', '+refs/ark/ung-vien/*:refs/ark/ung-vien/*']);
  return chayQuyen(cwd, ['--xac-nhan', vung, '--as', boi, '--the-he', theHe,
    '--sha', sha, '--co-so', coSo, '--remote', remoteDuong]);
}

/* Ghi một file trong sân thử, tạo cả thư mục cha. Cần vì từ 08/09 mỗi vùng là một THƯ MỤC —
 * bản đồ vùng quy theo tiền tố đường dẫn, nên một file phẳng ở tầng ngoài cùng quy về `--con-lai`
 * chứ không về vùng nào. */
function ghi(...phan) {
  const noiDung = phan.pop();
  const duong = path.join(...phan);
  fs.mkdirSync(path.dirname(duong), { recursive: true });
  fs.writeFileSync(duong, noiDung);
  return duong;
}

function docSoTu(cwd, ref = REF) {
  const r = gitThu(cwd, ['show', `${ref}:${TEP}`]);
  if (r.ma !== 0) return [];
  return r.ra.split('\n').filter(Boolean).map((d) => JSON.parse(d));
}

// ── Dựng sân ───────────────────────────────────────────────────────────────────────────────────

const remote = path.join(san, 'remote.git').replace(/\\/g, '/');
const A = path.join(san, 'A').replace(/\\/g, '/');
const B = path.join(san, 'B').replace(/\\/g, '/');

git(san, ['init', '--quiet', '--bare', '--initial-branch=main', remote]);
git(san, ['clone', '--quiet', remote, A]);
git(san, ['clone', '--quiet', remote, B]);

fs.writeFileSync(path.join(A, 'san-pham.txt'), 'goc\n');
git(A, ['add', '-A']);
git(A, ['commit', '--quiet', '-m', 'goc']);
git(A, ['push', '--quiet', 'origin', 'main']);
git(B, ['fetch', '--quiet', 'origin']);
git(B, ['reset', '--quiet', '--hard', 'origin/main']);

const SHA_GOC = git(A, ['rev-parse', 'HEAD']);

console.log(`sân thử: ${san}\n`);

// ── Ca ① — xin đồng thời: đúng một bên được cấp ────────────────────────────────────────────────

console.log('Ca ① — xin quyền đồng thời');
{
  const rA = chayQuyen(A, ['--nhan', 'goi-x', '--as', 'lane-A', '--viec', 'viec cua A', '--remote', remote]);
  xong('A nhận được quyền', rA.ma === 0 && /đã nhận/.test(rA.ra));

  const rB = chayQuyen(B, ['--nhan', 'goi-x', '--as', 'lane-B', '--viec', 'viec cua B', '--remote', remote]);
  xong('B nhận TỪ CHỐI, không nhận thành công', rB.ma === 3 && /TỪ CHỐI/.test(rB.ra));
  xong('câu từ chối nói rõ ai đang giữ', /lane-A/.test(rB.ra));

  // ①b — chốt so-và-đổi: B cầm sổ CŨ và cố đẩy → git phải từ chối.
  // Không có vế này thì đường LOST_RACE là mã chưa bao giờ chạy.
  git(B, ['fetch', '--quiet', remote, `+${REF}:${REF}`]);
  const tipCu = git(B, ['rev-parse', REF]);
  const soCu = docSoTu(B);
  // A ghi thêm một sự kiện → remote tiến lên, bản của B thành cũ.
  chayQuyen(A, ['--tra', 'goi-x', '--as', 'lane-A', '--remote', remote]);
  const commitCu = dungSuKienTay(B, tipCu, soCu, { viec: 'nhan', vung: 'goi-x', lane: 'lane-B', the_he: 2, luc: 'x' });
  const day = gitThu(B, ['push', remote, `${commitCu}:${REF}`]);
  xong('đẩy sổ CŨ bị git từ chối (so-và-đổi)', day.ma !== 0 && /reject|non-fast-forward|fetch first/i.test(day.ra));
}

// ── Ca ② — phiên mất quyền quay lại ────────────────────────────────────────────────────────────

console.log('\nCa ② — phiên mất quyền quay lại ghi kết quả');
{
  const rA = chayQuyen(A, ['--nhan', 'goi-y', '--as', 'lane-A', '--viec', 'A lam goi Y', '--remote', remote]);
  const g = /THE_HE=(\d+)/.exec(rA.ra)[1];

  const rThu = chayQuyen(B, ['--thu-hoi', 'goi-y', '--as', 'lane-B', '--duc', 'Duc chot: chuyen goi Y sang B', '--remote', remote]);
  xong('B thu hồi được khi có câu chốt của Đức', rThu.ma === 0);

  const rKhongDuc = chayQuyen(B, ['--thu-hoi', 'goi-x', '--as', 'lane-B', '--remote', remote]);
  xong('thu hồi KHÔNG có câu chốt thì bị từ chối', rKhongDuc.ma === 3 && /NO_DUC_DECISION/.test(rKhongDuc.ra));

  const rTich = chayQuyen(A, ['--tich-hop', 'goi-y', '--as', 'lane-A', '--the-he', g, '--sha', SHA_GOC, '--co-so', SHA_GOC, '--remote', remote]);
  xong('kết quả của A bị từ chối', rTich.ma === 3 && /AUTHORITY_REVOKED/.test(rTich.ra));
  xong('lý do đọc được: nói lúc nào và bằng lượt gì', /Mất lúc .* bằng lượt/.test(rTich.ra));
  xong('câu chốt của Đức nằm TRONG sổ, in ra được', /chuyen goi Y sang B/.test(rTich.ra));

  const so = docSoTu(A);
  xong('sổ giữ được câu chốt của Đức', so.some((e) => e.viec === 'thu-hoi' && e.duc_chot));
}

// ── Ca ③ — thu hồi chen giữa lượt kiểm và lượt ghi ─────────────────────────────────────────────

console.log('\nCa ③ — thu hồi chen vào ĐÚNG giữa lượt kiểm và lượt tích hợp');
{
  chayQuyen(A, ['--nhan', 'goi-z', '--as', 'lane-A', '--viec', 'A lam goi Z', '--remote', remote]);
  git(A, ['fetch', '--quiet', remote, `+${REF}:${REF}`]);

  // A đã kiểm xong, đang cầm sổ ở commit này, chuẩn bị ghi kết quả.
  const tipLucKiem = git(A, ['rev-parse', REF]);
  const soLucKiem = docSoTu(A);

  // Chen: B thu hồi, đẩy trước.
  const rChen = chayQuyen(B, ['--thu-hoi', 'goi-z', '--as', 'lane-B', '--duc', 'Duc chot: doi chu goi Z', '--remote', remote]);
  xong('lượt thu hồi của B vào được', rChen.ma === 0);

  // A ghi kết quả trên sổ lúc kiểm → phải bị từ chối tại cửa, không phải phát hiện sau khi đã ghi.
  const commitA = dungSuKienTay(A, tipLucKiem, soLucKiem, {
    viec: 'tich-hop', vung: 'goi-z', lane: 'lane-A', the_he: 1, sha: SHA_GOC, luc: 'x',
  });
  const day = gitThu(A, ['push', remote, `${commitA}:${REF}`]);
  xong('kết quả của A KHÔNG lọt qua cửa', day.ma !== 0);

  git(B, ['fetch', '--quiet', remote, `+${REF}:${REF}`]);
  const soThat = docSoTu(B);
  xong('sổ trên remote không có kết quả nào của lane-A ở goi-z',
    !soThat.some((e) => e.viec === 'tich-hop' && e.vung === 'goi-z' && e.lane === 'lane-A'),
    `${soThat.length} sự kiện`);
}

// ── Ca ③b — chen ĐÚNG vào khe giữa `fetch` và `push` của chính lệnh ────────────────────────────

// Ca ③ ở trên dựng commit bằng tay, nên nó kiểm hành vi của GIT, không kiểm lượt đẩy của MÃ.
// Đột biến đo 07/09: đổi lượt đẩy thành `--force` thì cả 33 phép kiểm vẫn xanh — tức phép
// so-và-đổi, thứ chịu toàn bộ việc phân xử, KHÔNG có gì canh.
//
// Chen được deterministic bằng hook `pre-push`: hook chạy TRƯỚC khi lượt đẩy được gửi, nên nó
// là chỗ duy nhất từ bên ngoài chạm được vào khe giữa `fetch` và `push` bên trong lệnh.
console.log('\nCa ③b — thu hồi chen vào khe fetch/push của chính lệnh');
{
  const r = chayQuyen(A, ['--nhan', 'goi-r', '--as', 'lane-A', '--viec', 'A lam goi R', '--remote', remote]);
  const g = /THE_HE=(\d+)/.exec(r.ra)[1];

  // Phải có tờ xác nhận trước, không thì lệnh dừng ở `NO_CHECK` và không tới lượt đẩy — tức hook
  // không nổ và ca đua này không kiểm được gì. Một ca đua dừng trước cửa đua là ca đua rỗng.
  xacNhan(B, remote, 'goi-r', 'lane-B', g, SHA_GOC, SHA_GOC);

  const co = path.join(san, 'da-chen').replace(/\\/g, '/');
  const hook = path.join(A, '.git', 'hooks', 'pre-push');
  fs.writeFileSync(hook, [
    '#!/bin/sh',
    `[ -f "${co}" ] && exit 0`,
    `: > "${co}"`,
    `cd "${B}" && node "${QUYEN.replace(/\\/g, '/')}" --thu-hoi goi-r --as lane-B --duc "chen giua khe" --remote "${remote}" >/dev/null 2>&1`,
    'exit 0',
  ].join('\n'));
  fs.chmodSync(hook, 0o755);

  const rTich = chayQuyen(A, ['--tich-hop', 'goi-r', '--as', 'lane-A', '--the-he', g, '--sha', SHA_GOC, '--co-so', SHA_GOC, '--remote', remote]);
  fs.rmSync(hook);

  xong('hook thật sự đã chen', fs.existsSync(co));
  xong('lượt đẩy của lệnh bị từ chối tại cửa', rTich.ma === 3 && /RACE_AT_GATE/.test(rTich.ra));

  git(B, ['fetch', '--quiet', remote, `+${REF}:${REF}`]);
  const so = docSoTu(B);
  xong('lượt thu hồi của B KHÔNG bị ghi đè',
    so.some((e) => e.viec === 'thu-hoi' && e.vung === 'goi-r'));
  xong('kết quả của A KHÔNG có trong sổ',
    !so.some((e) => e.viec === 'tich-hop' && e.vung === 'goi-r'));
}

// ── Ca ③c — bản ref cục bộ hoá cũ NGAY SAU lượt fetch ─────────────────────────────────────────

// Ca ③b chen vào trong MỘT kết nối đẩy, và ở đó git tự bảo vệ: nó gửi kèm giá-trị-cũ lấy từ
// lượt quảng bá ref, nên server từ chối kể cả khi có `--force`. Đo 07/09: đột biến đổi lượt đẩy
// thành `--force` vẫn xanh cả 37 phép kiểm vì thế.
//
// Cửa sổ THẬT nằm ở chỗ khác: remote tiến lên SAU lượt `fetch` mà TRƯỚC lúc mở kết nối đẩy.
// Lúc đó bản cục bộ đã cũ, và `--force` ghi đè — xoá luôn sự kiện thu hồi của bên kia. Đo tay:
// đẩy trần bị từ chối, `--force` "forced update" thành công.
//
// Chen được deterministic bằng hook `reference-transaction`: nó nổ đúng lúc lượt `fetch` bên
// trong lệnh cập nhật ref cục bộ.
console.log('\nCa ③c — remote tiến lên sau lượt fetch, trước lượt đẩy');
{
  const r = chayQuyen(A, ['--nhan', 'goi-q', '--as', 'lane-A', '--viec', 'A lam goi Q', '--remote', remote]);
  const g = /THE_HE=(\d+)/.exec(r.ra)[1];

  xacNhan(B, remote, 'goi-q', 'lane-B', g, SHA_GOC, SHA_GOC);

  const nap = path.join(san, 'nap-chen-q').replace(/\\/g, '/');
  const daNo = path.join(san, 'da-no-q').replace(/\\/g, '/');
  const hook = path.join(A, '.git', 'hooks', 'reference-transaction');
  fs.writeFileSync(hook, [
    '#!/bin/sh',
    '[ "$1" = "committed" ] || exit 0',
    `[ -f "${nap}" ] || exit 0`,
    `[ -f "${daNo}" ] && exit 0`,
    `: > "${daNo}"`,
    `cd "${B}" && node "${QUYEN.replace(/\\/g, '/')}" --thu-hoi goi-q --as lane-B --duc "chen sau fetch" --remote "${remote}" >/dev/null 2>&1`,
    'exit 0',
  ].join('\n'));
  fs.chmodSync(hook, 0o755);
  fs.writeFileSync(nap, '');

  const rTich = chayQuyen(A, ['--tich-hop', 'goi-q', '--as', 'lane-A', '--the-he', g, '--sha', SHA_GOC, '--co-so', SHA_GOC, '--remote', remote]);
  fs.rmSync(hook);
  fs.rmSync(nap);

  xong('hook nổ đúng khe sau fetch', fs.existsSync(daNo));
  xong('lệnh KHÔNG báo thành công', rTich.ma !== 0, `mã ${rTich.ma}`);

  git(B, ['fetch', '--quiet', remote, `+${REF}:${REF}`]);
  const so = docSoTu(B);
  xong('lượt thu hồi của B còn nguyên trên remote',
    so.some((e) => e.viec === 'thu-hoi' && e.vung === 'goi-q'));
  xong('kết quả của A không lọt vào sổ',
    !so.some((e) => e.viec === 'tich-hop' && e.vung === 'goi-q'));
}

// ── Ca ④ — CA CHỊU TẢI: quyền cũ SAU fetch + rebase ────────────────────────────────────────────

console.log('\nCa ④ — quyền cũ sau fetch + rebase  ⬅ ca đã bác được ADR-0018');
{
  const rA = chayQuyen(A, ['--nhan', 'goi-w', '--as', 'lane-A', '--viec', 'A lam goi W', '--remote', remote]);
  const gA = /THE_HE=(\d+)/.exec(rA.ra)[1];

  // A làm việc trên main.
  ghi(A, 'goi-w', 'a.txt', 'viec cua A\n');
  git(A, ['add', '-A']);
  git(A, ['commit', '--quiet', '-m', 'A: viec goi W']);

  // B thu hồi, nhận thế hệ 2, rồi đẩy một commit main của mình.
  chayQuyen(B, ['--thu-hoi', 'goi-w', '--as', 'lane-B', '--duc', 'Duc chot: W sang B', '--remote', remote]);
  const rB = chayQuyen(B, ['--nhan', 'goi-w', '--as', 'lane-B', '--viec', 'B lam goi W', '--remote', remote]);
  const gB = /THE_HE=(\d+)/.exec(rB.ra)[1];
  xong('thế hệ tăng sau khi cấp lại', Number(gB) === Number(gA) + 1, `${gA} → ${gB}`);

  ghi(B, 'goi-w', 'b.txt', 'viec cua B\n');
  git(B, ['add', '-A']);
  git(B, ['commit', '--quiet', '-m', 'B: viec goi W']);
  git(B, ['push', '--quiet', 'origin', 'main']);

  // Lượt đẩy main của A bị từ chối — đúng như ADR-0018 mô tả.
  const dayTruoc = gitThu(A, ['push', 'origin', 'main']);
  xong('A đẩy main bị từ chối lúc đầu', dayTruoc.ma !== 0);

  // A rebase rồi đẩy lại — LỌT. Đây chính là chỗ ADR-0018 bị bác.
  git(A, ['fetch', '--quiet', 'origin']);
  git(A, ['rebase', '--quiet', 'origin/main']);
  const daySau = gitThu(A, ['push', 'origin', 'main']);
  xong('sau rebase, A đẩy main THÀNH CÔNG (lỗ của ADR-0018 tái lập được)', daySau.ma === 0);

  // Nhưng cửa quyền vẫn từ chối: sổ quyền nằm trên ref RIÊNG, rebase main không chạm được.
  const shaSauRebase = git(A, ['rev-parse', 'HEAD']);
  const rTich = chayQuyen(A, ['--tich-hop', 'goi-w', '--as', 'lane-A', '--the-he', gA, '--sha', shaSauRebase, '--co-so', shaSauRebase, '--remote', remote]);
  xong('cửa quyền VẪN từ chối kết quả của A sau rebase', rTich.ma === 3, /AUTHORITY_REVOKED|STALE/.exec(rTich.ra)?.[0] || '');

  // Và A không lách được bằng cách khai thế hệ mới: nó không phải chủ.
  const rGian = chayQuyen(A, ['--tich-hop', 'goi-w', '--as', 'lane-A', '--the-he', gB, '--sha', shaSauRebase, '--co-so', shaSauRebase, '--remote', remote]);
  xong('khai thế hệ của người khác cũng bị từ chối', rGian.ma === 3 && /AUTHORITY_REVOKED/.test(rGian.ra));

  // Chốt cấu trúc: ref quyền KHÔNG nằm trong lịch sử main.
  const trongMain = gitThu(A, ['merge-base', '--is-ancestor', git(A, ['rev-parse', REF]), 'HEAD']);
  xong('ref quyền nằm NGOÀI lịch sử main', trongMain.ma !== 0);
}

// ── Ca ④b — cùng lane, nhưng thế hệ đã cũ ───────────────────────────────────

// Một lane trả quyền rồi nhận lại thì nó VẪN là chủ — nên phép kiểm "còn là chủ không"
// không bắt được ca này. Chỉ số THỢ HỆ bắt được. Không có ca này thì đượng STALE_GENERATION
// là mã chưa bao giờ chạy.
console.log('\nCa ④b — cùng lane nhưng kết quả mang thế hệ cũ');
{
  const r1 = chayQuyen(B, ['--nhan', 'goi-s', '--as', 'lane-B', '--viec', 'luot dau', '--remote', remote]);
  const g1 = /THE_HE=(\d+)/.exec(r1.ra)[1];
  chayQuyen(B, ['--tra', 'goi-s', '--as', 'lane-B', '--remote', remote]);
  const r2 = chayQuyen(B, ['--nhan', 'goi-s', '--as', 'lane-B', '--viec', 'luot hai', '--remote', remote]);
  const g2 = /THE_HE=(\d+)/.exec(r2.ra)[1];
  xong('nhận lại thì thế hệ tăng', Number(g2) === Number(g1) + 1, `${g1} → ${g2}`);

  const rCu = chayQuyen(B, ['--tich-hop', 'goi-s', '--as', 'lane-B', '--the-he', g1, '--sha', SHA_GOC, '--co-so', SHA_GOC, '--remote', remote]);
  xong('kết quả mang thế hệ cũ bị từ chối dù vẫn đúng chủ', rCu.ma === 3 && /STALE_GENERATION/.test(rCu.ra));

  xacNhan(A, remote, 'goi-s', 'lane-A', g2, SHA_GOC, SHA_GOC);
  const rMoi = chayQuyen(B, ['--tich-hop', 'goi-s', '--as', 'lane-B', '--the-he', g2, '--sha', SHA_GOC, '--co-so', SHA_GOC, '--remote', remote]);
  xong('thế hệ đúng thì vào được', rMoi.ma === 0);
  chayQuyen(B, ['--tra', 'goi-s', '--as', 'lane-B', '--remote', remote]);
}

// ── Ca ⑤ — đích đã đổi, và chỗ KHÔNG được chặn ─────────────────────────────────────────────────

console.log('\nCa ⑤ — đích đã đổi khiến kết quả không còn tương thích');
{
  const rB = chayQuyen(B, ['--nhan', 'goi-v', '--as', 'lane-B', '--viec', 'B lam goi V', '--remote', remote]);
  const g = /THE_HE=(\d+)/.exec(rB.ra)[1];

  git(B, ['fetch', '--quiet', 'origin']);
  git(B, ['reset', '--quiet', '--hard', 'origin/main']);
  const sha1 = git(B, ['rev-parse', 'HEAD']);

  xacNhan(A, remote, 'goi-v', 'lane-A', g, sha1, sha1);
  const r1 = chayQuyen(B, ['--tich-hop', 'goi-v', '--as', 'lane-B', '--the-he', g, '--sha', sha1, '--co-so', sha1, '--remote', remote]);
  xong('lượt tích hợp đầu vào được', r1.ma === 0);

  // Kết quả thứ hai dựng trên gốc CŨ, không chứa lượt đã tích hợp → phải bị từ chối.
  const r2 = chayQuyen(B, ['--tich-hop', 'goi-v', '--as', 'lane-B', '--the-he', g, '--sha', sha1, '--co-so', SHA_GOC, '--remote', remote]);
  xong('kết quả dựng trên gốc cũ bị từ chối', r2.ma === 3 && /STALE_BASE/.test(r2.ra));

  // Vế NGƯỢC — quan trọng ngang vế trên: checkout khác đang làm dở KHÔNG phải cơ sở để chặn ai.
  fs.writeFileSync(path.join(A, 'dang-lam-do.txt'), 'ban, chua commit\n');
  const banA = git(A, ['status', '--porcelain']);
  xong('checkout A thật sự đang bẩn', banA.length > 0);

  xacNhan(A, remote, 'goi-v', 'lane-A', g, sha1, sha1);
  const r3 = chayQuyen(B, ['--tich-hop', 'goi-v', '--as', 'lane-B', '--the-he', g, '--sha', sha1, '--co-so', sha1, '--remote', remote]);
  xong('B vẫn tích hợp được dù A đang làm dở (không chặn quá rộng)', r3.ma === 0);
  fs.rmSync(path.join(A, 'dang-lam-do.txt'));
}

// ── Ca ⑥ — một ca HỢP LỆ phải đi hết được ──────────────────────────────────────────────────────

console.log('\nCa ⑥ — đường hợp lệ đi hết được');
{
  const rNhan = chayQuyen(A, ['--nhan', 'goi-u', '--as', 'lane-A', '--viec', 'A lam goi U', '--remote', remote]);
  xong('nhận quyền', rNhan.ma === 0);
  const g = /THE_HE=(\d+)/.exec(rNhan.ra)[1];

  ghi(A, 'goi-u', 'xong.txt', 'xong\n');
  git(A, ['add', '-A']);
  git(A, ['commit', '--quiet', '-m', 'A: xong goi U']);
  git(A, ['push', '--quiet', 'origin', 'main']);
  const sha = git(A, ['rev-parse', 'HEAD']);

  xacNhan(B, remote, 'goi-u', 'lane-B', g, sha, sha);
  const rTich = chayQuyen(A, ['--tich-hop', 'goi-u', '--as', 'lane-A', '--the-he', g, '--sha', sha, '--co-so', sha, '--remote', remote]);
  xong('ghi nhận tích hợp', rTich.ma === 0);

  // Trả HỘ người khác: vùng phải ĐANG có chủ, nếu không thì phép kiểm đạt vì lý do sai
  // (`NOT_HELD` thay vì `NOT_YOURS`) và đường thật không bao giờ được chạy.
  const rTraHo = chayQuyen(B, ['--tra', 'goi-u', '--as', 'lane-B', '--remote', remote]);
  xong('trả quyền HỘ người khác bị từ chối đúng lý do', rTraHo.ma === 3 && /NOT_YOURS/.test(rTraHo.ra));

  const rTra = chayQuyen(A, ['--tra', 'goi-u', '--as', 'lane-A', '--remote', remote]);
  xong('chủ thật trả được quyền', rTra.ma === 0);

  const rLai = chayQuyen(B, ['--nhan', 'goi-u', '--as', 'lane-B', '--viec', 'B tiep goi U', '--remote', remote]);
  xong('vùng đã trả thì bên kia nhận được ngay', rLai.ma === 0);
}

// ── Ca ⑦ — thông tin kết quả phải KHỚP commit thật ─────────────────────────────────────────────

// Ba ca này do phiên Codex tìm được (audit r01, 07/09). Trước khi vá, cả ba đều ĐƯỢC NHẬN:
// cửa chỉ kiểm "có điền không", không kiểm "điền có đúng không". Bắt buộc điền là chưa đủ.
console.log('\nCa ⑦ — thông tin kết quả phải khớp commit thật');
{
  const r = chayQuyen(A, ['--nhan', 'goi-n', '--as', 'lane-A', '--viec', 'A lam goi N', '--remote', remote]);
  const g = /THE_HE=(\d+)/.exec(r.ra)[1];

  git(A, ['fetch', '--quiet', 'origin']);
  git(A, ['rebase', '--quiet', 'origin/main']);
  const dinh = git(A, ['rev-parse', 'HEAD']);

  const KHONG_CO = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  const rMa = chayQuyen(A, ['--tich-hop', 'goi-n', '--as', 'lane-A', '--the-he', g,
    '--sha', KHONG_CO, '--co-so', dinh, '--remote', remote]);
  xong('SHA không tồn tại bị từ chối', rMa.ma === 3 && /UNKNOWN_COMMIT/.test(rMa.ra));

  const rThieu = chayQuyen(A, ['--tich-hop', 'goi-n', '--as', 'lane-A', '--the-he', g,
    '--sha', dinh, '--remote', remote]);
  xong('thiếu --co-so bị từ chối', rThieu.ma === 3 && /MISSING_DATA/.test(rThieu.ra));

  // Khai một nền mà commit kết quả KHÔNG chứa. Trước khi vá, cửa chỉ so nền với lượt tích hợp
  // trước — nó chưa bao giờ so nền với chính commit kết quả.
  git(B, ['fetch', '--quiet', 'origin']);
  git(B, ['reset', '--quiet', '--hard', 'origin/main']);
  ghi(B, 'goi-n', 'nen-moi.txt', 'B tien len\n');
  git(B, ['add', '-A']);
  git(B, ['commit', '--quiet', '-m', 'B: tien len']);
  git(B, ['push', '--quiet', 'origin', 'main']);
  const dinhMoi = git(B, ['rev-parse', 'HEAD']);
  // A phải fetch về, không thì cửa dừng ở UNKNOWN_COMMIT và ta không kiểm được
  // đúng chốt cần kiểm. Hai chốt khác nhau, đừng để chốt này che chốt kia.
  git(A, ['fetch', '--quiet', 'origin']);

  const rLech = chayQuyen(A, ['--tich-hop', 'goi-n', '--as', 'lane-A', '--the-he', g,
    '--sha', dinh, '--co-so', dinhMoi, '--remote', remote]);
  xong('nền khai KHÔNG nằm trong commit kết quả thì bị từ chối',
    rLech.ma === 3 && /BASE_NOT_IN_RESULT/.test(rLech.ra));

  xacNhan(B, remote, 'goi-n', 'lane-B', g, dinh, dinh);
  const rDung = chayQuyen(A, ['--tich-hop', 'goi-n', '--as', 'lane-A', '--the-he', g,
    '--sha', dinh, '--co-so', dinh, '--remote', remote]);
  xong('thông tin khớp thật thì vào được', rDung.ma === 0);
  chayQuyen(A, ['--tra', 'goi-n', '--as', 'lane-A', '--remote', remote]);
}

// ── Ca ⑧ — sổ HỎNG khác sổ TRỐNG ───────────────────────────────────────────────────────────────

// Phiên Codex dựng ca này: ref quyền tồn tại nhưng thiếu file sổ. Trước khi vá, công cụ vừa in
// lỗi đọc file vừa CẤP QUYỀN ở thế hệ 1 — tức nó coi "không đọc được" là "chưa ai giữ gì".
// Trạng thái không đọc được phải làm hệ thống DỪNG. Vắng ref và sổ hỏng là hai chuyện khác nhau.
console.log('\nCa ⑧ — sổ quyền hỏng phải làm hệ thống dừng, không thành sổ trống');
{
  chayQuyen(A, ['--nhan', 'goi-m', '--as', 'lane-A', '--viec', 'A lam goi M', '--remote', remote]);
  git(A, ['fetch', '--quiet', remote, `+${REF}:${REF}`]);
  const laLanh = git(A, ['rev-parse', REF]);

  const treTrong = git(A, ['mktree'], '');
  const cmHong = git(A, ['commit-tree', treTrong, '-p', laLanh, '-m', 'so hong: thieu file']);
  git(A, ['push', '--quiet', remote, `${cmHong}:${REF}`]);

  const rHong = chayQuyen(B, ['--nhan', 'goi-m', '--as', 'lane-B', '--viec', 'B thu', '--remote', remote]);
  xong('sổ hỏng thì KHÔNG cấp quyền', rHong.ma !== 0, `mã ${rHong.ma}`);
  xong('nói rõ là sổ hỏng, không nói là trống', /LEDGER_UNREADABLE/.test(rHong.ra));

  const rXem = chayQuyen(B, ['--xem', '--remote', remote]);
  xong('lệnh xem cũng dừng thay vì báo trống', rXem.ma !== 0 && /LEDGER_UNREADABLE/.test(rXem.ra));

  // Phục hồi để các ca sau còn chạy được: đưa ref về lá lành cuối cùng.
  git(A, ['push', '--quiet', '--force', remote, `${laLanh}:${REF}`]);
  const rSau = chayQuyen(B, ['--xem', '--remote', remote]);
  xong('đưa về lá lành thì đọc lại được', rSau.ma === 0 && /goi-m/.test(rSau.ra));
  chayQuyen(A, ['--tra', 'goi-m', '--as', 'lane-A', '--remote', remote]);
}

// ── Ca ⑨ — xin quyền CẠNH TRANH THẬT, không phải gọi lần lượt ───────────────────────────────────

// Phiên Codex chỉ đúng: ca ① gọi A rồi mới gọi B, nên nhãn "đồng thời" của nó không đúng sự thật.
// Ở đây hai lượt NHẬN thật sự chen nhau: hook `reference-transaction` cho B nhận quyền đúng lúc
// lượt `fetch` của A vừa xong, tức A đang cầm bản sổ nói rằng vùng còn trống.
console.log('\nCa ⑨ — hai lượt nhận quyền cạnh tranh thật');
{
  const nap = path.join(san, 'nap-dua').replace(/\\/g, '/');
  const daNo = path.join(san, 'da-no-dua').replace(/\\/g, '/');
  const hook = path.join(A, '.git', 'hooks', 'reference-transaction');
  fs.writeFileSync(hook, [
    '#!/bin/sh',
    '[ "$1" = "committed" ] || exit 0',
    `[ -f "${nap}" ] || exit 0`,
    `[ -f "${daNo}" ] && exit 0`,
    `: > "${daNo}"`,
    `cd "${B}" && node "${QUYEN.replace(/\\/g, '/')}" --nhan goi-p --as lane-B --viec "B chen" --remote "${remote}" >/dev/null 2>&1`,
    'exit 0',
  ].join('\n'));
  fs.chmodSync(hook, 0o755);
  fs.writeFileSync(nap, '');

  const rA = chayQuyen(A, ['--nhan', 'goi-p', '--as', 'lane-A', '--viec', 'A chen', '--remote', remote]);
  fs.rmSync(hook);
  fs.rmSync(nap);

  xong('B thật sự đã chen vào giữa', fs.existsSync(daNo));
  xong('A KHÔNG nhận được báo thành công', rA.ma !== 0, `mã ${rA.ma}`);

  const rXem = chayQuyen(B, ['--xem', '--remote', remote]);
  const chuP = /GIỮ  goi-p  →  (\S+)/.exec(rXem.ra);
  xong('đúng MỘT bên giữ goi-p, và đó là bên vào trước', chuP?.[1] === 'lane-B', chuP?.[1] || 'không ai giữ');
}

// ── Ca ⑩ — CHUỖI CODEX: xác nhận đã xanh, rồi quyền bị thu hồi TRƯỚC lúc tích hợp ─────────────

/* Đây là ca phiên Codex đặt ra ở #14 và nhắc lại ở #19, và nó bác một câu tôi kết luận sớm:
 * *"bật `enforce_admins` cộng một bước Actions là bịt được khe quyền/main."* Codex chỉ đúng lý do:
 * **required status check gắn vào COMMIT** — xanh cho C thì xanh mãi cho C, còn nguồn quyền đổi
 * ĐỘC LẬP sau đó, và không gì chấm lại lúc tích hợp.
 *
 * Chốt ở đây không đòi GitHub chấm lại. Nó đổi CÂU HỎI: không hỏi *"có tờ xác nhận nào không"*
 * mà hỏi *"tờ xác nhận có phải điều CUỐI CÙNG xảy ra với vùng này không"*. Sổ quyền có thứ tự và
 * mọi lượt ghi đi qua một phép so-và-đổi, nên một lượt thu hồi chen vào **buộc phải** nằm sau tờ
 * xác nhận — và lúc đó tờ xác nhận hết hiệu lực. */
console.log('\nCa ⑩ — xác nhận xanh rồi quyền bị thu hồi trước lúc tích hợp  ⬅ chuỗi Codex');
{
  const r = chayQuyen(A, ['--nhan', 'goi-k', '--as', 'lane-A', '--viec', 'A lam goi K', '--remote', remote]);
  const g = /THE_HE=(\d+)/.exec(r.ra)[1];

  const rXac = xacNhan(B, remote, 'goi-k', 'lane-B', g, SHA_GOC, SHA_GOC);
  xong('bên thứ ba xác nhận được kết quả của A', rXac.ma === 0 && /đã xác nhận/.test(rXac.ra));

  // Kết quả KHÔNG đổi. Chỉ nguồn quyền đổi — đúng ca Codex mô tả.
  const rThu = chayQuyen(B, ['--thu-hoi', 'goi-k', '--as', 'lane-B', '--duc', 'Duc chot: K sang B', '--remote', remote]);
  xong('quyền của A bị thu hồi SAU khi xác nhận đã xanh', rThu.ma === 0);

  const rTich = chayQuyen(A, ['--tich-hop', 'goi-k', '--as', 'lane-A', '--the-he', g,
    '--sha', SHA_GOC, '--co-so', SHA_GOC, '--remote', remote]);
  xong('tích hợp BỊ TỪ CHỐI dù tờ xác nhận vẫn còn trong sổ', rTich.ma === 3);
  xong('lý do là mất quyền, không phải "thiếu xác nhận"',
    /AUTHORITY_REVOKED/.test(rTich.ra), /\[([A-Z_]+)\]/.exec(rTich.ra)?.[1] || '');

  const so = docSoTu(A);
  xong('sổ KHÔNG có lượt tích hợp nào cho goi-k',
    !so.some((e) => e.viec === 'tich-hop' && e.vung === 'goi-k'));
  xong('tờ xác nhận vẫn nằm đó — nó hết hiệu lực, không bị xoá',
    so.some((e) => e.viec === 'xac-nhan' && e.vung === 'goi-k'));
}

// ── Ca ⑩b — tờ xác nhận CŨ: có việc khác xảy ra sau nó ────────────────────────────────────────

/* Ca ⑩ bị chặn bởi phép kiểm "còn là chủ không", tức lớp cũ. Ca này kiểm ĐÚNG lớp mới: A VẪN là
 * chủ, thế hệ VẪN đúng, tờ xác nhận VẪN của A — nhưng có một việc khác chen vào sau nó. */
console.log('\nCa ⑩b — tờ xác nhận không còn là điều cuối cùng xảy ra');
{
  const r = chayQuyen(A, ['--nhan', 'goi-j', '--as', 'lane-A', '--viec', 'A lam goi J', '--remote', remote]);
  const g = /THE_HE=(\d+)/.exec(r.ra)[1];

  xacNhan(B, remote, 'goi-j', 'lane-B', g, SHA_GOC, SHA_GOC);
  // Việc khác chen vào CÙNG VÙNG: một tờ xác nhận thứ hai cho một SHA khác.
  git(A, ['fetch', '--quiet', 'origin']);
  const shaKhac = git(A, ['rev-parse', 'HEAD']);
  /* Cả hai tờ khai nền BẰNG CHÍNH kết quả, cố ý: ca này đo THỨ TỰ của tờ xác nhận, không đo bản
   * đồ vùng. Nếu khai nền là `SHA_GOC` thì khoảng đo trải qua commit của goi-w/goi-u ở các ca
   * trước, và ca này sẽ trượt vì `AREA_MISMATCH` — tức trượt vì một lý do nó không hề khai. */
  const rXac2 = xacNhan(B, remote, 'goi-j', 'lane-B', g, shaKhac, shaKhac);
  xong('tờ xác nhận thứ hai ghi được', rXac2.ma === 0, `mã ${rXac2.ma}`);

  const rCu = chayQuyen(A, ['--tich-hop', 'goi-j', '--as', 'lane-A', '--the-he', g,
    '--sha', SHA_GOC, '--co-so', SHA_GOC, '--remote', remote]);
  xong('tờ xác nhận bị tờ mới hơn thay thế thì không dùng được',
    rCu.ma === 3 && /CHECK_MISMATCH/.test(rCu.ra));

  const rMoi = chayQuyen(A, ['--tich-hop', 'goi-j', '--as', 'lane-A', '--the-he', g,
    '--sha', shaKhac, '--co-so', shaKhac, '--remote', remote]);
  xong('tờ xác nhận MỚI NHẤT thì dùng được', rMoi.ma === 0, `mã ${rMoi.ma}`);
  chayQuyen(A, ['--tra', 'goi-j', '--as', 'lane-A', '--remote', remote]);
}

// ── Ca ⑩c — bên bị kiểm không được tự xác nhận mình ──────────────────────────────────────────

/* Vế làm cho tờ xác nhận có nghĩa gì cả. Chính tôi nêu câu này rồi tự quên nó ở bản đầu:
 * *"một status check chỉ là hàng rào thật nếu thứ GỬI trạng thái không phải thứ ĐANG BỊ kiểm."* */
console.log('\nCa ⑩c — tự xác nhận cho chính mình');
{
  const r = chayQuyen(A, ['--nhan', 'goi-h', '--as', 'lane-A', '--viec', 'A lam goi H', '--remote', remote]);
  const g = /THE_HE=(\d+)/.exec(r.ra)[1];

  const rTu = xacNhan(A, remote, 'goi-h', 'lane-A', g, SHA_GOC, SHA_GOC);
  xong('chủ vùng KHÔNG tự xác nhận được', rTu.ma === 3 && /SELF_ATTESTATION/.test(rTu.ra));

  const rKhongXac = chayQuyen(A, ['--tich-hop', 'goi-h', '--as', 'lane-A', '--the-he', g,
    '--sha', SHA_GOC, '--co-so', SHA_GOC, '--remote', remote]);
  xong('không có xác nhận thì không tích hợp được', rKhongXac.ma === 3 && /NO_CHECK/.test(rKhongXac.ra));

  const rBen = xacNhan(B, remote, 'goi-h', 'lane-B', g, SHA_GOC, SHA_GOC);
  xong('bên KHÁC thì xác nhận được', rBen.ma === 0);

  const rXong = chayQuyen(A, ['--tich-hop', 'goi-h', '--as', 'lane-A', '--the-he', g,
    '--sha', SHA_GOC, '--co-so', SHA_GOC, '--remote', remote]);
  xong('có xác nhận của bên khác thì đi được', rXong.ma === 0);

  const so = docSoTu(A);
  const th = [...so].reverse().find((e) => e.viec === 'tich-hop' && e.vung === 'goi-h');
  xong('sổ ghi lại AI đã xác nhận', th?.xac_nhan_boi === 'lane-B', th?.xac_nhan_boi || 'không ghi');
  chayQuyen(A, ['--tra', 'goi-h', '--as', 'lane-A', '--remote', remote]);
}

// ── Ca ⑩d — việc ở vùng KHÁC không làm hỏng tờ xác nhận ──────────────────────────────────────

/* Vế chống chặn quá rộng. Nếu "điều cuối cùng xảy ra" tính trên CẢ SỔ thì hai vai chạy song song
 * sẽ liên tục làm hết hiệu lực tờ xác nhận của nhau — đúng thứ kiến trúc này sinh ra để tránh. */
console.log('\nCa ⑩d — việc ở vùng khác không làm hết hiệu lực tờ xác nhận');
{
  const rG = chayQuyen(A, ['--nhan', 'goi-g', '--as', 'lane-A', '--viec', 'A lam goi G', '--remote', remote]);
  const gG = /THE_HE=(\d+)/.exec(rG.ra)[1];
  xacNhan(B, remote, 'goi-g', 'lane-B', gG, SHA_GOC, SHA_GOC);

  // Vùng khác hoạt động rôm rả ở giữa.
  chayQuyen(B, ['--nhan', 'goi-f', '--as', 'lane-B', '--viec', 'B lam goi F', '--remote', remote]);
  chayQuyen(B, ['--tra', 'goi-f', '--as', 'lane-B', '--remote', remote]);

  const rTich = chayQuyen(A, ['--tich-hop', 'goi-g', '--as', 'lane-A', '--the-he', gG,
    '--sha', SHA_GOC, '--co-so', SHA_GOC, '--remote', remote]);
  xong('A vẫn tích hợp được dù vùng khác vừa có hai lượt ghi', rTich.ma === 0, `mã ${rTich.ma}`);
  chayQuyen(A, ['--tra', 'goi-g', '--as', 'lane-A', '--remote', remote]);
}

// ── Ca ⑪ — QUAN SÁT `main` THẬT: xác nhận → ghi nhận → thu hồi → thử đưa mã vào `main` ────────

/* Phiên Codex (#21) chỉ đúng chỗ mọi ca trên còn thiếu: chúng kiểm **việc ghi sổ**, không kiểm
 * **việc cập nhật `main`**. Ca này đọc **SHA thật của `main`** ở cả hai phía mỗi lượt thử.
 *
 * Và nó cố ý đo CẢ HAI ĐƯỜNG. Nếu chỉ đo đường "đi qua cửa" thì tôi đang chứng minh đúng cái mình
 * muốn tin; đường "bỏ qua cửa" là đường nói ra khoảng trống còn lại, và con số đó phải nằm trên
 * giấy. */
console.log('\nCa ⑪ — thu hồi sau khi đã ghi nhận, rồi thử đưa mã vào `main`  ⬅ quan sát main thật');
{
  const r = chayQuyen(A, ['--nhan', 'goi-m2', '--as', 'lane-A', '--viec', 'A lam goi M2', '--remote', remote]);
  const g = /THE_HE=(\d+)/.exec(r.ra)[1];

  git(A, ['fetch', '--quiet', 'origin']);
  git(A, ['reset', '--quiet', '--hard', 'origin/main']);
  const nen = git(A, ['rev-parse', 'HEAD']);
  ghi(A, 'goi-m2', 'ket-qua.txt', 'ket qua cua A\n');
  git(A, ['add', '-A']);
  git(A, ['commit', '--quiet', '-m', 'A: ket qua goi M2']);
  const C = git(A, ['rev-parse', 'HEAD']);

  // Công bố ỨNG VIÊN ở một ref riêng — bên kiểm đọc được mà `main` không bị chạm.
  git(A, ['push', '--quiet', 'origin', `${C}:refs/ark/ung-vien/lane-A`]);
  const mainSauCongBo = git(A, ['ls-remote', remote, 'main']).split(/\s+/)[0];

  xacNhan(B, remote, 'goi-m2', 'lane-B', g, C, nen);
  const rTich = chayQuyen(A, ['--tich-hop', 'goi-m2', '--as', 'lane-A', '--the-he', g,
    '--sha', C, '--co-so', nen, '--remote', remote]);
  xong('công bố ứng viên KHÔNG chạm `main`', mainSauCongBo === nen,
    `main vẫn ở ${String(mainSauCongBo).slice(0, 8)}`);
  xong('ghi nhận tích hợp xong', rTich.ma === 0, rTich.ma === 0 ? '' : `mã ${rTich.ma}`);

  const rTruoc = chayQuyen(A, ['--cho-day', 'goi-m2', '--as', 'lane-A', '--sha', C, '--remote', remote]);
  xong('trước khi thu hồi: cửa CHO công bố', rTruoc.ma === 0 && /được phép công bố/.test(rTruoc.ra));

  // Giấy phép gắn vào ĐÚNG MỘT SHA và ĐÚNG MỘT lane — không phải một tấm vé dùng chung.
  const rLechSha = chayQuyen(A, ['--cho-day', 'goi-m2', '--as', 'lane-A', '--sha', nen, '--remote', remote]);
  xong('giấy phép không dùng được cho SHA khác', rLechSha.ma === 3 && /SHA_MISMATCH/.test(rLechSha.ra));

  const rLechLane = chayQuyen(B, ['--cho-day', 'goi-m2', '--as', 'lane-B', '--sha', C, '--remote', remote]);
  xong('giấy phép của lane khác không dùng được', rLechLane.ma === 3 && /NOT_YOURS/.test(rLechLane.ra));

  // Thu hồi SAU khi đã ghi nhận. Kết quả C không đổi một byte.
  const rThu = chayQuyen(B, ['--thu-hoi', 'goi-m2', '--as', 'lane-B', '--duc', 'Duc chot: dung lai M2', '--remote', remote]);
  xong('quyền bị thu hồi SAU lượt ghi nhận', rThu.ma === 0);

  const mainTruoc = git(A, ['ls-remote', remote, 'main']).split(/\s+/)[0];

  // ĐƯỜNG 1 — đi qua cửa.
  const rSau = chayQuyen(A, ['--cho-day', 'goi-m2', '--as', 'lane-A', '--sha', C, '--remote', remote]);
  xong('sau khi thu hồi: cửa TỪ CHỐI công bố', rSau.ma === 3 && /NOT_CLEARED/.test(rSau.ra));
  xong('câu từ chối nói rõ quyền bị thu hồi lúc nào', /Quyền đã bị thu hồi lúc/.test(rSau.ra));
  xong('kèm câu chốt của Đức', /dung lai M2/.test(rSau.ra));

  const mainGiua = git(A, ['ls-remote', remote, 'main']).split(/\s+/)[0];
  xong('`main` KHÔNG đổi khi bên đẩy tuân thủ cửa', mainGiua === mainTruoc,
    `${String(mainTruoc).slice(0, 8)} → ${String(mainGiua).slice(0, 8)}`);

  // ĐƯỜNG 2 — BỎ QUA cửa. Đây là khoảng trống, và nó phải được đo chứ không được che.
  const rDay = gitThu(A, ['push', 'origin', 'main']);
  const mainSau = git(A, ['ls-remote', remote, 'main']).split(/\s+/)[0];
  xong('BỎ QUA cửa thì mã VẪN vào `main` — khoảng trống còn nguyên',
    rDay.ma === 0 && mainSau === C,
    `main ${String(mainTruoc).slice(0, 8)} → ${String(mainSau).slice(0, 8)}`);

  // Và sổ quyền nói ngược lại với `main`: đó chính là hình dạng của khoảng trống.
  const rVanTuChoi = chayQuyen(A, ['--cho-day', 'goi-m2', '--as', 'lane-A', '--sha', C, '--remote', remote]);
  xong('sổ quyền VẪN nói không được phép, dù mã đã nằm trong `main`', rVanTuChoi.ma === 3);
  xong('nên khoảng trống PHÁT HIỆN ĐƯỢC, chỉ chưa NGĂN được',
    mainSau === C && rVanTuChoi.ma === 3);
}

// ── Ca ⑫ — tên vùng phải khớp đường dẫn thật ───────────────────────────────────────────────────
//
// Chỗ hở phiên Codex đo được 07/09: nó khai vùng `wrong-area` cho một thay đổi ở `product.txt`
// và cửa nói ĐẠT. Ca này đo lớp bịt chỗ đó, và đo cả hai chiều — chặn được cái sai, và KHÔNG
// chặn cái đúng.

console.log('\nCa ⑫ — tên vùng phải khớp đường dẫn thật  ⬅ chỗ hở Codex khai `wrong-area`');
{
  const r = chayQuyen(A, ['--nhan', 'goi-aa', '--as', 'lane-A', '--viec', 'A lam goi AA', '--remote', remote]);
  const g = /THE_HE=(\d+)/.exec(r.ra)[1];

  /* A GIỮ CẢ HAI VÙNG, cố ý — và đây là điều khiến ca này đo được thứ nó khai.
   * Bản đầu để A chỉ giữ `goi-aa` rồi khai `goi-t`, và cả ba mục trượt vì `AUTHORITY_REVOKED`:
   * phép kiểm "còn là chủ không" bắt trước, nên phép kiểm đường dẫn KHÔNG BAO GIỜ CHẠY và ca chỉ
   * đo lại lớp cũ. Ca nguy hiểm thật là lane giữ hai vùng và đưa việc của vùng này qua tờ xác
   * nhận của vùng kia — lúc đó thứ duy nhất chặn được là bản đồ đường dẫn. */
  const rT = chayQuyen(A, ['--nhan', 'goi-t', '--as', 'lane-A', '--viec', 'A giu ca goi-t', '--remote', remote]);
  const gT = /THE_HE=(\d+)/.exec(rT.ra)[1];

  git(A, ['fetch', '--quiet', 'origin']);
  git(A, ['reset', '--quiet', '--hard', 'origin/main']);
  const nen = git(A, ['rev-parse', 'HEAD']);

  // Kết quả SẠCH: chỉ chạm vùng goi-aa.
  ghi(A, 'goi-aa', 'x.txt', 'ket qua trong vung\n');
  git(A, ['add', '-A']);
  git(A, ['commit', '--quiet', '-m', 'goi-aa: mot file trong vung']);
  const sachP = git(A, ['rev-parse', 'HEAD']);
  git(A, ['push', '--quiet', 'origin', `+HEAD:refs/ark/ung-vien/lane-A`]);

  // ⓐ Khai SAI vùng — cùng một kết quả, chỉ đổi tên vùng.
  const rSai = chayQuyen(A, ['--tich-hop', 'goi-t', '--as', 'lane-A', '--the-he', gT,
    '--sha', sachP, '--co-so', nen, '--remote', remote]);
  xong('khai sai vùng thì bị TỪ CHỐI', rSai.ma === 3, `mã ${rSai.ma}`);
  xong('lý do là AREA_MISMATCH, không phải "không có quyền"',
    /AREA_MISMATCH/.test(rSai.ra), /\[([A-Z_]+)\]/.exec(rSai.ra)?.[1] || '');
  xong('câu từ chối chỉ ra ĐƯỜNG DẪN nào và thuộc vùng nào',
    /goi-aa\/x\.txt → goi-aa/.test(rSai.ra));

  // ⓑ Bên KIỂM cũng không ký được cho kết quả ngoài vùng.
  const rXacSai = xacNhan(B, remote, 'goi-t', 'lane-B', gT, sachP, nen);
  xong('bên kiểm cũng bị chặn khi vùng không khớp',
    rXacSai.ma === 3 && /AREA_MISMATCH/.test(rXacSai.ra), `mã ${rXacSai.ma}`);

  // ⓒ MỘT KẾT QUẢ, HAI VÙNG — không ai duyệt gộp.
  ghi(A, 'tai-lieu', 'y.md', 'ghi chu\n');
  git(A, ['add', '-A']);
  git(A, ['commit', '--quiet', '-m', 'them mot file o vung khac']);
  const haiVung = git(A, ['rev-parse', 'HEAD']);
  git(A, ['push', '--quiet', 'origin', `+HEAD:refs/ark/ung-vien/lane-A`]);
  const rHai = chayQuyen(A, ['--tich-hop', 'goi-aa', '--as', 'lane-A', '--the-he', g,
    '--sha', haiVung, '--co-so', nen, '--remote', remote]);
  xong('kết quả trải hai vùng bị TỪ CHỐI dù khai đúng một trong hai',
    rHai.ma === 3 && /AREA_MISMATCH/.test(rHai.ra), `mã ${rHai.ma}`);
  xong('và nó chỉ ra vùng kia, không nói chung chung', /tai-lieu\/y\.md → vung-khac/.test(rHai.ra));

  // ⓓ Bản đồ KHÔNG PHỦ tới đường dẫn, và không khai `--con-lai` → từ chối, không cho qua.
  const rHo = chayTho(A, ['--tich-hop', 'goi-aa', '--as', 'lane-A', '--the-he', g,
    '--sha', sachP, '--co-so', nen, '--remote', remote, '--ban-do', BAN_DO]);
  xong('bản đồ phủ đủ thì thiếu --con-lai vẫn đi được', rHo.ma !== 3 || !/UNMAPPED_PATH/.test(rHo.ra));

  const banDoHep = path.join(san, 'ban-do-hep.json');
  fs.writeFileSync(banDoHep, JSON.stringify({ areas: { 'tai-lieu/': { steward: 'vung-khac', ownership_mode: 'root' } } }));
  const rKhongPhu = chayTho(A, ['--tich-hop', 'goi-aa', '--as', 'lane-A', '--the-he', g,
    '--sha', sachP, '--co-so', nen, '--remote', remote, '--ban-do', banDoHep]);
  xong('đường dẫn bản đồ không phủ tới bị TỪ CHỐI, không được cho qua',
    rKhongPhu.ma === 3 && /UNMAPPED_PATH/.test(rKhongPhu.ra), `mã ${rKhongPhu.ma}`);

  // ⓔ THIẾU bản đồ — cửa không chạy ở chế độ không kiểm. Đây là vế fail-closed của cả lớp này:
  // nếu thiếu cờ mà vẫn đi qua thì mọi ca trên chỉ chứng minh "cờ có tác dụng khi được đưa".
  const rThieuBanDo = chayTho(A, ['--tich-hop', 'goi-aa', '--as', 'lane-A', '--the-he', g,
    '--sha', sachP, '--co-so', nen, '--remote', remote]);
  xong('THIẾU --ban-do thì cửa DỪNG, không bỏ qua phép kiểm',
    rThieuBanDo.ma === 2 && /MISSING_MAP/.test(rThieuBanDo.ra), `mã ${rThieuBanDo.ma}`);

  const banDoHong = path.join(san, 'ban-do-hong.json');
  fs.writeFileSync(banDoHong, '{ khong phai json');
  const rHongBanDo = chayTho(A, ['--tich-hop', 'goi-aa', '--as', 'lane-A', '--the-he', g,
    '--sha', sachP, '--co-so', nen, '--remote', remote, '--ban-do', banDoHong]);
  xong('bản đồ hỏng cũng DỪNG, không thành bản đồ trống',
    rHongBanDo.ma === 2 && /MAP_UNREADABLE/.test(rHongBanDo.ra), `mã ${rHongBanDo.ma}`);

  // ⓕ ĐƯỜNG HỢP LỆ — vế duy nhất chứng minh cửa còn mở sau khi thêm lớp này.
  const rXac = xacNhan(B, remote, 'goi-aa', 'lane-B', g, sachP, nen);
  xong('bên kiểm ký được cho kết quả TRONG vùng', rXac.ma === 0, `mã ${rXac.ma}`);
  const rDat = chayQuyen(A, ['--tich-hop', 'goi-aa', '--as', 'lane-A', '--the-he', g,
    '--sha', sachP, '--co-so', nen, '--remote', remote]);
  xong('kết quả đúng vùng vẫn đi hết được', rDat.ma === 0, `mã ${rDat.ma}`);
  chayQuyen(A, ['--tra', 'goi-aa', '--as', 'lane-A', '--remote', remote]);
}

// ── Ca ⑫b — hai luật quy vùng mà một bản đồ phẳng không ghim được ──────────────────────────────

console.log('\nCa ⑫b — chia chủ theo gói, và tiền tố dài nhất thắng');
{
  const r = chayQuyen(A, ['--nhan', 'goi/scouter', '--as', 'lane-A', '--viec', 'A lam scouter', '--remote', remote]);
  xong('nhận được một vùng kiểu chia-chủ-theo-gói', r.ma === 0, `mã ${r.ma}`);
  const g = /THE_HE=(\d+)/.exec(r.ra)[1];

  git(A, ['fetch', '--quiet', 'origin']);
  git(A, ['reset', '--quiet', '--hard', 'origin/main']);
  const nen = git(A, ['rev-parse', 'HEAD']);

  ghi(A, 'goi', 'scouter', 'a.js', '// scouter\n');
  git(A, ['add', '-A']);
  git(A, ['commit', '--quiet', '-m', 'goi/scouter: mot file']);
  const sha = git(A, ['rev-parse', 'HEAD']);
  git(A, ['push', '--quiet', 'origin', `+HEAD:refs/ark/ung-vien/lane-A`]);

  // `goi/scouter/a.js` phải quy về `goi/scouter`, không về `goi/`.
  const rK = chayQuyen(A, ['--nhan', 'goi/khac', '--as', 'lane-A', '--viec', 'A giu ca goi/khac', '--remote', remote]);
  const gK = /THE_HE=(\d+)/.exec(rK.ra)[1];
  const rKhac = chayQuyen(A, ['--tich-hop', 'goi/khac', '--as', 'lane-A', '--the-he', gK,
    '--sha', sha, '--co-so', nen, '--remote', remote]);
  xong('gói khác trong cùng thư mục cha là VÙNG KHÁC',
    rKhac.ma === 3 && /goi\/scouter\/a\.js → goi\/scouter/.test(rKhac.ra), `mã ${rKhac.ma}`);

  xacNhan(B, remote, 'goi/scouter', 'lane-B', g, sha, nen);
  const rDat = chayQuyen(A, ['--tich-hop', 'goi/scouter', '--as', 'lane-A', '--the-he', g,
    '--sha', sha, '--co-so', nen, '--remote', remote]);
  xong('đúng gói thì đi qua', rDat.ma === 0, `mã ${rDat.ma}`);

  /* TIỀN TỐ DÀI NHẤT THẮNG. `goi/_chung/` khai steward `_root`, còn `goi/` là chia-chủ-theo-gói.
   * Không có luật này thì `goi/_chung/x.js` quy về `goi/_chung` — một khoá không ai giữ, và mã
   * dùng chung sẽ đòi một chủ không tồn tại. */
  ghi(A, 'goi', '_chung', 'x.js', '// dung chung\n');
  git(A, ['add', '-A']);
  git(A, ['commit', '--quiet', '-m', 'goi/_chung: mot file']);
  const shaChung = git(A, ['rev-parse', 'HEAD']);
  git(A, ['push', '--quiet', 'origin', `+HEAD:refs/ark/ung-vien/lane-A`]);
  const rChung = chayQuyen(A, ['--tich-hop', 'goi/scouter', '--as', 'lane-A', '--the-he', g,
    '--sha', shaChung, '--co-so', sha, '--remote', remote]);
  xong('mục con thắng mục cha: goi/_chung quy về _root, không về goi/_chung',
    rChung.ma === 3 && /goi\/_chung\/x\.js → _root/.test(rChung.ra), `mã ${rChung.ma}`);

  /* ĐỔI TÊN FILE — CHIỀU VÀO, và chiều là cả điểm của ca này.
   *
   * Bản đầu của ca này dựng chiều RA (chuyển file từ vùng mình sang vùng khác) và **đột biến
   * "bật dò-đổi-tên" LỌT**: 97 đạt · 0 sai. Lý do, đo rồi mới thấy: `--name-only` với dò-đổi-tên
   * vẫn in tên MỚI, mà ở chiều ra tên mới nằm ở vùng khác — nên ca vẫn đỏ dù lớp bảo vệ đã bị gỡ.
   * Ca đo đúng thứ nó khai chỉ ở CHIỀU VÀO: chuyển một file TỪ vùng khác VÀO vùng mình. Lúc đó
   * tên mới nằm trong vùng mình, và phía NGUỒN là thứ duy nhất tố giác — mà dò-đổi-tên xoá đúng
   * phía đó. Không có `--no-renames` thì một lane hút file của vùng khác về mà cửa không thấy gì. */
  git(A, ['reset', '--quiet', '--hard', sha]);
  ghi(A, 'tai-lieu', 'nguon.md', 'file cua vung khac\n');
  git(A, ['add', '-A']);
  git(A, ['commit', '--quiet', '-m', 'tai-lieu: mot file cua vung khac']);
  const shaNguon = git(A, ['rev-parse', 'HEAD']);

  git(A, ['mv', 'tai-lieu/nguon.md', 'goi/scouter/nguon.md']);
  git(A, ['commit', '--quiet', '-m', 'hut file cua vung khac ve vung minh']);
  const shaDoiTen = git(A, ['rev-parse', 'HEAD']);
  git(A, ['push', '--quiet', 'origin', `+HEAD:refs/ark/ung-vien/lane-A`]);

  const rDoiTen = chayQuyen(A, ['--tich-hop', 'goi/scouter', '--as', 'lane-A', '--the-he', g,
    '--sha', shaDoiTen, '--co-so', shaNguon, '--remote', remote]);
  xong('hút file TỪ vùng khác về vùng mình bị thấy, không bị dò-đổi-tên che',
    rDoiTen.ma === 3 && /tai-lieu\/nguon\.md → vung-khac/.test(rDoiTen.ra), `mã ${rDoiTen.ma}`);

  chayQuyen(A, ['--tra', 'goi/scouter', '--as', 'lane-A', '--remote', remote]);
}

// ── Fail-closed ────────────────────────────────────────────────────────────────────────────────

console.log('\nFail-closed — không đọc được nguồn quyền');
{
  const hong = path.join(san, 'khong-ton-tai.git').replace(/\\/g, '/');
  const r = chayQuyen(A, ['--nhan', 'goi-t', '--as', 'lane-A', '--viec', 'thu', '--remote', hong]);
  xong('không tới được remote thì KHÔNG cấp quyền', r.ma === 4 && /REMOTE_UNREACHABLE/.test(r.ra));

  const rThieu = chayQuyen(A, ['--tich-hop', 'goi-x', '--as', 'lane-A', '--sha', SHA_GOC, '--remote', remote]);
  xong('thiếu --the-he thì không báo hợp lệ', rThieu.ma === 3 && /MISSING_DATA/.test(rThieu.ra));
}

// ── Kết ────────────────────────────────────────────────────────────────────────────────────────

console.log(`\n${dat} đạt · ${truot} sai`);
if (truot === 0) fs.rmSync(san, { recursive: true, force: true });
else console.log(`sân thử GIỮ LẠI để soi: ${san}`);
process.exit(truot === 0 ? 0 : 1);
