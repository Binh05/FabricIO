import { useAppSelector } from "@/store/hooks";
import ToolCard from "./ToolCard";
import { toolSelector } from "@/store/selector";

function ToolList() {
  const { tools } = useAppSelector(toolSelector);

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          name={tool?.name ?? "unknow"}
          description={tool?.description ?? ""}
        />
      ))}
      <ToolCard
        key={"123"}
        name={"tool name"}
        description={
          "tool description nhung chu nhau nhien toi viet alo 1 2 3 mot hai bon sau tam thu va sai"
        }
      />
    </div>
  );
}

export default ToolList;
