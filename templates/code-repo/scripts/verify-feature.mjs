#!/usr/bin/env node
// The gate: the ONLY thing allowed to change states in feature_list.json.
// Agents run it; the script decides. Zero dependencies.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'feature_list.json');

const die = (msg) => { console.error(msg); process.exit(1); };
const load = () => JSON.parse(readFileSync(FILE, 'utf8'));
const save = (d) => {
  d.last_updated = new Date().toISOString().slice(0, 10);
  writeFileSync(FILE, JSON.stringify(d, null, 2) + '\n');
};

const [cmd, id, ...rest] = process.argv.slice(2);
const data = load();
const find = (fid) =>
  data.features.find((f) => f.id === fid) ??
  die(`ERROR: no feature '${fid}'.\nFIX: node scripts/verify-feature.mjs status`);

switch (cmd) {
  case 'status': {
    for (const f of data.features)
      console.log(`${f.status.padEnd(12)} P${f.priority}  ${f.id}  ${f.title}`);
    const active = data.features.filter((f) => f.status === 'active');
    console.log(`\nactive: ${active.length}/1${active.length ? ` (${active[0].id})` : ''}`);
    break;
  }

  case 'activate': {
    if (!id) die('usage: verify-feature.mjs activate <id>');
    const f = find(id);
    const cur = data.features.find((x) => x.status === 'active');
    if (cur && cur.id !== id)
      die(`ERROR: '${cur.id}' is already active.\nWHY: single_active_feature (WIP=1) — finishing beats starting.\nFIX: node scripts/verify-feature.mjs verify ${cur.id}  (or block it with a reason)`);
    if (f.status === 'passing') die(`ERROR: '${id}' already passed — passing is irreversible.`);
    f.status = 'active';
    save(data);
    console.log(`${id} → active. To reach 'passing', these must succeed:`);
    for (const v of f.verification ?? []) console.log(`  ${v}`);
    break;
  }

  case 'verify': {
    if (!id) die('usage: verify-feature.mjs verify <id>');
    const f = find(id);
    if (f.status !== 'active')
      die(`ERROR: '${id}' is '${f.status}', not 'active'.\nWHY: only the active feature can be verified (state machine).\nFIX: node scripts/verify-feature.mjs activate ${id}`);
    if (!f.verification?.length)
      die(`ERROR: '${id}' has no verification commands.\nWHY: passing_requires_evidence — a feature without executable verification can never be done.\nFIX: add commands to its "verification" array first.`);
    for (const v of f.verification) {
      console.log(`RUN ${v}`);
      try {
        execSync(v, { cwd: ROOT, stdio: 'inherit', shell: '/bin/bash' });
      } catch {
        die(`\nFAILED: ${v}\nWHY: '${id}' does not meet its own definition of done.\nFIX: fix the behavior and re-run. State stays 'active' — do not edit states by hand.`);
      }
    }
    let commit = 'no-git';
    try { commit = execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch {}
    f.status = 'passing';
    (f.evidence ??= []).push(
      `${new Date().toISOString().slice(0, 10)} commit ${commit} — ${f.verification.length} verification command(s) passed`
    );
    save(data);
    console.log(`\n${id} → passing. Evidence recorded. Pick the next feature: node scripts/verify-feature.mjs status`);
    break;
  }

  case 'block': {
    if (!id) die('usage: verify-feature.mjs block <id> <reason>');
    const f = find(id);
    if (f.status === 'passing') die(`ERROR: '${id}' already passed — passing is irreversible.`);
    const reason = rest.join(' ');
    if (!reason) die(`ERROR: a block needs a reason.\nWHY: 'blocked' without a note is invisible work loss.\nFIX: node scripts/verify-feature.mjs block ${id} "<what blocks it, who unblocks it>"`);
    f.status = 'blocked';
    f.notes = reason;
    save(data);
    console.log(`${id} → blocked: ${reason}`);
    break;
  }

  case 'unblock': {
    if (!id) die('usage: verify-feature.mjs unblock <id>');
    const f = find(id);
    if (f.status !== 'blocked') die(`ERROR: '${id}' is '${f.status}', not blocked.`);
    f.status = 'not_started';
    save(data);
    console.log(`${id} → not_started (re-activate when ready).`);
    break;
  }

  default:
    console.log('usage: node scripts/verify-feature.mjs <status | activate <id> | verify <id> | block <id> <reason> | unblock <id>>');
}
