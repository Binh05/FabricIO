import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface IToolCardProps {
  name: string;
  description?: string;
  imgUrl?: string;
  tags?: [];
  startReview?: number;
  runCount?: number;
}

const ToolCard = ({
  name,
  description,
  imgUrl,
  tags,
  startReview,
  runCount,
}: IToolCardProps) => {
  return (
    <Card className="relative w-full max-w-xs pt-0">
      <div className="aspect-video bg-black/50"></div>
      <CardHeader>
        <CardTitle>{name.charAt(0).toUpperCase() + name.slice(1)}</CardTitle>
        <CardDescription
          className="line-clamp-2 min-h-11 overflow-hidden leading-relaxed"
          title={description}
        >
          {description}
        </CardDescription>
        <div className="my-2 w-full space-x-2 truncate overflow-hidden">
          <Badge variant="secondary" className="p-4">
            Tags
          </Badge>
        </div>
        <div className="flex w-full items-center justify-between">
          <div>start review</div>
          <div>run counts</div>
        </div>
      </CardHeader>
      <CardFooter className="grid-cols-2 gap-2">
        <Button
          variant="secondary"
          className="col-start-1 w-1/2 cursor-pointer"
        >
          View
        </Button>
        <Button
          variant="secondary"
          className="col-start-2 w-1/2 cursor-pointer"
        >
          Run
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
