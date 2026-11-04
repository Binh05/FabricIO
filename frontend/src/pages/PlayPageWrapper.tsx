import { useParams } from "react-router-dom";
import { Play } from "@/pages/Play.tsx";

export default function PlayPageWrapper() {
  const { id } = useParams<{ id: string}>();
  return <Play key={id} />
}