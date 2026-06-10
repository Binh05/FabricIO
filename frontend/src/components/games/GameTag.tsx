import type { GameTag } from "@/types/Game";

const GameTag = ({ tag }: { tag: GameTag }) => {
  return (
    <span
      key={tag.id}
      className="text-muted border-border rounded-full border bg-white/5 px-3 py-1 text-[13px]"
    >
      {tag.name}
    </span>
  );
};

export default GameTag;
