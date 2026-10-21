// Kich ban 2: trang sau cua danh sach (chi phi phan trang). Trang ngau nhien trong [DEEP_MIN, DEEP_MAX].
import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, GAMES_PATH, PAGE_SIZE, requestParams, buildOptions, makeSummaryHandler } from './lib/common.js';

export const options = buildOptions();

const DEEP_MIN = Number(__ENV.DEEP_MIN || 100);
const DEEP_MAX = Number(__ENV.DEEP_MAX || 400); // voi ~9.000 game, size 20 => ~450 trang

export default function () {
  const page = DEEP_MIN + Math.floor(Math.random() * (DEEP_MAX - DEEP_MIN + 1));
  const res = http.get(
    `${BASE_URL}${GAMES_PATH}?page=${page}&size=${PAGE_SIZE}&keyword=`,
    requestParams('GET /games (deep page)')
  );
  check(res, { 'status 200': (r) => r.status === 200 });
}

const summary = makeSummaryHandler('games-list-deep');
export function handleSummary(data) {
  return summary(data);
}
