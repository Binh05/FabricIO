import { Star } from "lucide-react";

export const Stars = ({ rating, interactive = false, onRate = null, gameId = null }) => {
  const rounded = Math.round(rating);
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          const filled = value <= rounded;
          return (
            <span 
              key={index}
              className={`${filled ? "text-yellow-400" : "text-white/10"} transition-colors duration-200`} 
              style={interactive ? { cursor: 'pointer' } : {}}
              onClick={() => interactive && onRate && onRate(gameId, value)}
            >
              <Star size={18} fill={filled ? "currentColor" : "none"} />
            </span>
          );
        })}
      </div>
      <span className="text-muted text-sm font-medium">{interactive ? `${rounded || 0}/5` : rating.toFixed(1)}</span>
    </div>
  );
};
