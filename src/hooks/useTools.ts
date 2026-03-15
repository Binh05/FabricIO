import { toolServices } from "@/services/toolService";
import { setLoading, setToolState } from "@/store/features/tool/toolSlice";
import { useAppDispatch } from "@/store/hooks";

export function useTools() {
  const dispatch = useAppDispatch();

  async function fetchAllTool(page: number = 1, pageSize: number = 8) {
    try {
      dispatch(setLoading(true));

      const data = await toolServices.FetchAllTool(page, pageSize);

      console.log(data);
      dispatch(setToolState(data));
    } catch (error) {
      console.error("Loi khi fetch all tool: ", error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { fetchAllTool };
}
