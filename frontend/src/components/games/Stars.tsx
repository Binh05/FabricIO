import { Star } from "lucide-react";

export const Stars = ({ rating, interactive = false, onRate = null, gameId = null }) => {
  const rounded = Math.round(rating);
  
  return (
    <div className="star-row">
      {Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        const filled = value <= rounded;
        return (
          <span 
            key={index}
            className={`star ${filled ? "filled" : ""}`} 
            style={interactive ? { cursor: 'pointer' } : {}}
            onClick={() => interactive && onRate && onRate(gameId, value)}
          >
            <Star />
          </span>
        );
      })}
      <span className="muted-text">{interactive ? `${rounded || 0}/5` : rating.toFixed(1)}</span>
    </div>
  );
};
