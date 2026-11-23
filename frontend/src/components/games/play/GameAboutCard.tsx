import { Card } from "@/components/ui/card";
import type { Game } from "@/types/Game";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface GameAboutCardProps {
  game: Game;
}

export function GameAboutCard({ game }: GameAboutCardProps) {
  return (
    <Card className="border-border-subtle bg-surface-container-low rounded-sm p-6 sm:p-7">
      <div className="flex items-center gap-2.5">
        <div
          aria-hidden="true"
          className="text-primary flex shrink-0 flex-col gap-1"
        >
          <span className="bg-primary h-0.5 w-4 rounded-full" />
          <span className="bg-primary h-0.5 w-2.5 rounded-full" />
          <span className="bg-primary h-0.5 w-3.5 rounded-full" />
        </div>
        <h2 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">
          About the Game
        </h2>
      </div>
      <div className="text-muted-foreground [&_a]:text-primary [&_blockquote]:border-primary/50 [&_code]:bg-surface-container-high [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_pre]:bg-surface-container-high [&_strong]:text-foreground mt-3 text-xs leading-relaxed sm:text-sm [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h3]:mb-1 [&_h3]:font-bold [&_li]:ml-4 [&_li]:list-disc [&_ol]:space-y-1 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:p-3 [&_ul]:space-y-1">
        {game.description?.trim() ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {game.description}
          </ReactMarkdown>
        ) : (
          <p>Chưa có nội dung mô tả cho trò chơi này.</p>
        )}
      </div>
    </Card>
  );
}
