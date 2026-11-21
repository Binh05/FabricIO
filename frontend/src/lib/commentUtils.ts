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
    "bg-slate-800 text-slate-200 border border-slate-700",
    "bg-emerald-900 text-emerald-200 border border-emerald-700/60",
    "bg-amber-900 text-amber-200 border border-amber-700/60",
    "bg-rose-900 text-rose-200 border border-rose-700/60",
    "bg-indigo-900 text-indigo-200 border border-indigo-700/60",
    "bg-cyan-900 text-cyan-200 border border-cyan-700/60",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
