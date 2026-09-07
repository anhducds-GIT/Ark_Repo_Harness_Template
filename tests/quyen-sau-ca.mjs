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

function chayQuyen(cwd, args) {
  try {
    const ra = execFileSync('node', [QUYEN, ...args], { cwd, encoding: 'utf8', env: MOI_TRUONG });
    return { ma: 0, ra };
  } catch (e) {
    return { ma: e.status ?? 1, ra: `${e.stdout || ''}${e.stderr || ''}` };
  }
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
  fs.writeFileSync(path.join(A, 'goi-w.txt'), 'viec cua A\n');
  git(A, ['add', '-A']);
  git(A, ['commit', '--quiet', '-m', 'A: viec goi W']);

  // B thu hồi, nhận thế hệ 2, rồi đẩy một commit main của mình.
  chayQuyen(B, ['--thu-hoi', 'goi-w', '--as', 'lane-B', '--duc', 'Duc chot: W sang B', '--remote', remote]);
  const rB = chayQuyen(B, ['--nhan', 'goi-w', '--as', 'lane-B', '--viec', 'B lam goi W', '--remote', remote]);
  const gB = /THE_HE=(\d+)/.exec(rB.ra)[1];
  xong('thế hệ tăng sau khi cấp lại', Number(gB) === Number(gA) + 1, `${gA} → ${gB}`);

  fs.writeFileSync(path.join(B, 'goi-w-b.txt'), 'viec cua B\n');
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

  const r1 = chayQuyen(B, ['--tich-hop', 'goi-v', '--as', 'lane-B', '--the-he', g, '--sha', sha1, '--co-so', sha1, '--remote', remote]);
  xong('lượt tích hợp đầu vào được', r1.ma === 0);

  // Kết quả thứ hai dựng trên gốc CŨ, không chứa lượt đã tích hợp → phải bị từ chối.
  const r2 = chayQuyen(B, ['--tich-hop', 'goi-v', '--as', 'lane-B', '--the-he', g, '--sha', sha1, '--co-so', SHA_GOC, '--remote', remote]);
  xong('kết quả dựng trên gốc cũ bị từ chối', r2.ma === 3 && /STALE_BASE/.test(r2.ra));

  // Vế NGƯỢC — quan trọng ngang vế trên: checkout khác đang làm dở KHÔNG phải cơ sở để chặn ai.
  fs.writeFileSync(path.join(A, 'dang-lam-do.txt'), 'ban, chua commit\n');
  const banA = git(A, ['status', '--porcelain']);
  xong('checkout A thật sự đang bẩn', banA.length > 0);

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

  fs.writeFileSync(path.join(A, 'goi-u.txt'), 'xong\n');
  git(A, ['add', '-A']);
  git(A, ['commit', '--quiet', '-m', 'A: xong goi U']);
  git(A, ['push', '--quiet', 'origin', 'main']);
  const sha = git(A, ['rev-parse', 'HEAD']);

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
  fs.writeFileSync(path.join(B, 'nen-moi.txt'), 'B tien len\n');
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
