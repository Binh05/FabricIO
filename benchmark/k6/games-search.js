// Kich ban 3: tim kiem theo keyword (LIKE '%...%'). Keyword lay tu benchmark/data/keywords.txt
import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import { BASE_URL, GAMES_PATH, PAGE_SIZE, requestParams, buildOptions, makeSummaryHandler, parseLines, pick } from './lib/common.js';

export const options = buildOptions();

const keywords = new SharedArray('keywords', () => parseLines(open('../data/keywords.txt')));

export default function () {
  const kw = encodeURIComponent(pick(keywords));
  const res = http.get(
    `${BASE_URL}${GAMES_PATH}?page=0&size=${PAGE_SIZE}&keyword=${kw}`,
    requestParams('GET /games (search)')
  );
  check(res, { 'status 200': (r) => r.status === 200 });
}

const summary = makeSummaryHandler('games-search');
export function handleSummary(data) {
  return summary(data);
}
