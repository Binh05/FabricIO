import { api } from "@/lib/axios";

async function FetchAllTool(page: number = 1, pageSize: number = 8) {
  const res = await api.get(`/tool?page=${page}&pageSize=${pageSize}`);

  return res.data;
}

export const toolServices = { FetchAllTool };
