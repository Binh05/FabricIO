// Kich ban 1: trang dau danh sach game (khong tim kiem)
import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, GAMES_PATH, PAGE_SIZE, requestParams, buildOptions, makeSummaryHandler } from './lib/common.js';

export const options = buildOptions();

export default function () {
  const res = http.get(
    `${BASE_URL}${GAMES_PATH}?page=0&size=${PAGE_SIZE}&keyword=`,
    requestParams('GET /games (page 0)')
  );
  check(res, { 'status 200': (r) => r.status === 200 });
}

const summary = makeSummaryHandler('games-list');
export function handleSummary(data) {
  return summary(data);
}
