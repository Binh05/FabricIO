// Dung chung cho cac kich ban k6 cua FabricIO.
// QUAN TRONG: luon chay k6 tu THU MUC GOC du an (de duong dan ket qua dung).

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
export const GAMES_PATH = __ENV.GAMES_PATH || '/api/v1/games';
export const PAGE_SIZE = Number(__ENV.PAGE_SIZE || 20);

export function requestParams(name) {
  const headers = { Accept: 'application/json' };
  if (__ENV.TOKEN) headers.Authorization = `Bearer ${__ENV.TOKEN}`;
  // tag "name" gom cac URL dong (id ngau nhien) thanh mot nhom
  return { headers, tags: { name } };
}

// Doc file text: bo BOM (PowerShell 5.1 them BOM), tach dong, bo dong trong
export function parseLines(text) {
  return text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// "2m" -> 120, "90s" -> 90, "1m30s" -> 90
export function toSeconds(str) {
  const units = { h: 3600, m: 60, s: 1 };
  let total = 0;
  const re = /(\d+)(h|m|s)/g;
  let m;
  while ((m = re.exec(str)) !== null) total += Number(m[1]) * units[m[2]];
  return total;
}

// 2 scenario noi tiep nhau: warmup (khong tinh) roi measure (tinh so lieu)
export function buildOptions() {
  const vus = Number(__ENV.VUS || 20);
  const warmup = __ENV.WARMUP || '30s';
  const duration = __ENV.DURATION || '2m';
  return {
    scenarios: {
      warmup: { executor: 'constant-vus', vus, duration: warmup, gracefulStop: '0s' },
      measure: { executor: 'constant-vus', vus, duration, startTime: warmup, gracefulStop: '5s' },
    },
    summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
    thresholds: {
      // 2 threshold dau luon dung: chi de k6 tao so lieu rieng cho scenario "measure"
      'http_req_duration{scenario:measure}': ['max>=0'],
      'http_reqs{scenario:measure}': ['count>=0'],
      // loi > 1% thi lan do coi nhu khong hop le (k6 thoat voi ma khac 0)
      'http_req_failed{scenario:measure}': ['rate<0.01'],
    },
  };
}

const metricValues = (data, metric) => {
  const m = data.metrics[metric];
  return m ? m.values || m : {};
};

export function makeSummaryHandler(name) {
  return function (data) {
    const label = __ENV.LABEL || 'b0';
    const run = Number(__ENV.RUN || 1);
    const vus = Number(__ENV.VUS || 20);
    const duration = __ENV.DURATION || '2m';
    const secs = toSeconds(duration);

    const dur = metricValues(data, 'http_req_duration{scenario:measure}');
    const reqs = metricValues(data, 'http_reqs{scenario:measure}');
    const failed = metricValues(data, 'http_req_failed{scenario:measure}');

    const r1 = (x) => (typeof x === 'number' ? Math.round(x * 10) / 10 : null);
    // k6 tinh rate theo ca thoi gian test (gom warmup) nen tu tinh req/s tu so request trong pha measure
    const rps = secs > 0 && typeof reqs.count === 'number' ? reqs.count / secs : null;

    const compact = {
      label,
      scenario: name,
      run,
      vus,
      duration,
      requests: reqs.count,
      rps: r1(rps),
      avg: r1(dur.avg),
      p50: r1(dur.med),
      p90: r1(dur['p(90)']),
      p95: r1(dur['p(95)']),
      p99: r1(dur['p(99)']),
      max: r1(dur.max),
      failed_rate: failed.rate,
    };

    const dir = __ENV.RESULT_DIR || `benchmark/results/${label}`;
    const text =
      `\n[${label} run${run}] ${name}: ${compact.requests} req, ${compact.rps} req/s, ` +
      `p50=${compact.p50}ms p95=${compact.p95}ms p99=${compact.p99}ms, ` +
      `loi=${((compact.failed_rate || 0) * 100).toFixed(2)}%\n`;

    return {
      stdout: text,
      [`${dir}/${name}-run${run}.json`]: JSON.stringify(compact, null, 2),
      [`${dir}/${name}-run${run}-full.json`]: JSON.stringify(data, null, 2),
    };
  };
}
