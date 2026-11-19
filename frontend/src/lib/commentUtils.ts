export const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (Number.isNaN(diffInSeconds) || diffInSeconds < 60) {
    return "Vừa xong";
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  const diffInHours = Math.floor(diffInSeconds / 3600);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  const diffInDays = Math.floor(diffInSeconds / 86400);
  if (diffInDays === 1) {
    return "Hôm qua";
  }
  if (diffInDays < 30) {
    return `${diffInDays} ngày trước`;
  }
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} năm trước`;
};

export const getAvatarInitials = (name: string): string => {
  if (!name) return "?";
  const clean = name.trim();
  const parts = clean.split(/[\s_]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  const camelMatches = clean.match(/[A-Z]/g);
  if (camelMatches && camelMatches.length >= 2) {
    return (camelMatches[0] + camelMatches[1]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
};

export const getAvatarBgColor = (name: string): string => {
  const colors = [
    "bg-slate-800 text-slate-200",
    "bg-emerald-950/80 text-emerald-300",
    "bg-amber-950/80 text-amber-200",
    "bg-rose-950/80 text-rose-300",
    "bg-indigo-950/80 text-indigo-300",
    "bg-cyan-950/80 text-secondary-foreground",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
