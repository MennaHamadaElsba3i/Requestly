export const formatDate = (isoString) => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
};

export const formatRelativeTime = (isoString) => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(isoString);
  } catch {
    return isoString;
  }
};

export const getActivityDescription = (type, metadata = {}) => {
  switch (type) {
    case 'REQUEST_CREATED':
      return 'created this request.';
    case 'STATUS_CHANGED':
      return `changed status from "${metadata.from ?? 'Unknown'}" to "${metadata.to ?? 'Unknown'}".`;
    case 'TITLE_CHANGED':
      return `updated title to "${metadata.to ?? ''}".`;
    case 'PRIORITY_CHANGED':
      return `changed priority from "${metadata.from ?? 'Unknown'}" to "${metadata.to ?? 'Unknown'}".`;
    case 'OWNER_CHANGED':
      return `reassigned owner to ${metadata.to ?? 'new owner'}.`;
    default:
      return 'updated request details.';
  }
};

export const ALL_STATUSES = [
  'Pending',
  'In Progress',
  'Completed',
  'Cancelled',
];

export const ALL_PRIORITIES = ['Low', 'Medium', 'High'];
