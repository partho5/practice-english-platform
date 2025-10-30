
export const statusLabels = {
    pending: 'Pending',
    connected: 'Connected',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
};

// Derive the type from the data
export type StatusKey = keyof typeof statusLabels;
export type StatusLabel = typeof statusLabels[StatusKey];
