import type { GameTag as GameTagData } from "@/types/Game";

const GameTagChip = ({ tag }: { tag: GameTagData }) => {
  return (
    <span
      key={tag.id}
      className="rounded-sm border border-border-chip bg-surface-container-low px-2.5 py-1 text-xs text-foreground"
    >
      {tag.name}
    </span>
  );
};

export default GameTagChip;
