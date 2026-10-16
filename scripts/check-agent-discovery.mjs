import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist/client');
const ORIGIN = 'sametcelikbicak.com';

const REQUIRED = [
  'index.html',
  'robots.txt',
  '_headers',
  'llms.txt',
  'index.md',
  'auth.md',
  'openapi.json',
  'mcp',
  'status/health.json',
  'docs/api.md',
  'docs/agent-discovery.md',
  'docs/oauth.md',
  '.well-known/ai-catalog.json',
  '.well-known/api-catalog',
  '.well-known/agent-card.json',
  '.well-known/agent-skills/index.json',
  '.well-known/agent-skills/profile-summary/SKILL.md',
  '.well-known/jwks.json',
  '.well-known/mcp/server-card.json',
  '.well-known/poppy.json',
  '.well-known/oauth-authorization-server',
  '.well-known/oauth-protected-resource',
  '.well-known/openid-configuration',
];

const read = (path) => readFileSync(join(DIST, path), 'utf8');
// The build inlines the stylesheet into index.html. That used to depend on the
// order two Vite builds happened to close in, and when it failed nothing said so:
// the HTML just grew a <link rel="stylesheet"> and the page took an extra
// render-blocking request on the critical path.
const indexHtml = read('index.html');
if (/<link[^>]*rel=["']stylesheet["']/i.test(indexHtml)) {
  throw new Error(
    'index.html links an external stylesheet; the build should inline it'
  );
}

const missing = REQUIRED.filter((path) => !existsSync(join(DIST, path)));
assert.deepEqual(
  missing,
  [],
  `agent discovery files missing from dist: ${missing}`
);

const catalog = JSON.parse(read('.well-known/ai-catalog.json'));
assert.ok(
  typeof catalog.specVersion === 'string' && catalog.specVersion,
  'ai-catalog: specVersion required'
);
assert.ok(catalog.host?.displayName, 'ai-catalog: host.displayName required');
assert.ok(catalog.host?.identifier, 'ai-catalog: host.identifier required');
assert.ok(catalog.entries?.length > 0, 'ai-catalog: entries must not be empty');

for (const entry of catalog.entries) {
  const id = entry.identifier || '<no identifier>';
  assert.ok(
    entry.identifier?.startsWith(`urn:air:${ORIGIN}:`),
    `${id}: must be urn:air:${ORIGIN}:<ns>:<name>`
  );
  assert.ok(entry.displayName, `${id}: displayName required`);
  assert.ok(
    /^[\w.+-]+\/[\w.+-]+$/.test(entry.type),
    `${id}: "${entry.type}" is not an IANA media type`
  );
  assert.ok(
    ['url', 'data'].filter((key) => key in entry).length === 1,
    `${id}: exactly one of url or data`
  );
  const queries = entry.representativeQueries || [];
  assert.ok(
    queries.length >= 2 && queries.length <= 5,
    `${id}: 2-5 representativeQueries required`
  );
}

const poppy = JSON.parse(read('.well-known/poppy.json'));
assert.ok(poppy.protocol_version, 'poppy.json: protocol_version required');
assert.ok(poppy.organization?.name, 'poppy.json: organization.name required');
assert.equal(
  poppy.organization?.domain,
  ORIGIN,
  'poppy.json: organization.domain must match the request hostname'
);

// The site has no authorization server. Advertising one would send agents to
// endpoints that do not exist: the token endpoint 404s, the JWKS is empty, and
// docs/oauth.md says so in prose. The readiness scanner only validates `issuer`,
// so nothing catches the contradiction.
const OAUTH_CLAIMS = ['authorization_endpoint', 'token_endpoint', 'jwks_uri'];
for (const file of [
  '.well-known/openid-configuration',
  '.well-known/oauth-authorization-server',
  '.well-known/oauth-protected-resource',
]) {
  const doc = JSON.parse(read(file));
  const claimed = OAUTH_CLAIMS.filter((key) => key in doc);
  assert.deepEqual(
    claimed,
    [],
    `${file} advertises ${claimed.join(', ')} but this site issues no tokens`
  );
}

const robots = read('robots.txt');
assert.match(
  robots,
  /Content-Signal:[^\n]*ai-train=/,
  'robots.txt: ai-train preference missing'
);
assert.match(
  robots,
  /Content-Signal:[^\n]*search=/,
  'robots.txt: search preference missing'
);
assert.match(
  robots,
  /Content-Signal:[^\n]*ai-input=/,
  'robots.txt: ai-input preference missing'
);

const headers = read('_headers');
const worker = readFileSync(join(process.cwd(), 'src/worker.ts'), 'utf8');
const typed = new Set([
  ...headers
    .split('\n')
    .filter((line) => line.startsWith('/'))
    .map((line) => line.trim()),
  ...[...worker.matchAll(/\['(\/[^']+)',\s*'application/g)].map((m) => m[1]),
]);
// .txt and .md get a sane type from the asset server. Everything else needs an
// explicit Content-Type or agents receive text/html.
const untyped = REQUIRED.filter(
  (path) =>
    path !== '_headers' &&
    !path.endsWith('.txt') &&
    !path.endsWith('.md') &&
    !typed.has(`/${path}`)
);
assert.deepEqual(untyped, [], 'discovery files with no explicit Content-Type');

console.log(
  `agent discovery gate: ${REQUIRED.length} files, ${catalog.entries.length} catalog entries — ok`
);
