// Kich ban 4: chi tiet game theo id ngau nhien. Id lay tu benchmark/data/game-ids.csv
import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import { BASE_URL, GAMES_PATH, requestParams, buildOptions, makeSummaryHandler, parseLines, pick } from './lib/common.js';

export const options = buildOptions();

const ids = new SharedArray('game-ids', () => parseLines(open('../data/game-ids.csv')));

export default function () {
  const res = http.get(`${BASE_URL}${GAMES_PATH}/${pick(ids)}`, requestParams('GET /games/{id}'));
  check(res, { 'status 200': (r) => r.status === 200 });
}

const summary = makeSummaryHandler('game-detail');
export function handleSummary(data) {
  return summary(data);
}
