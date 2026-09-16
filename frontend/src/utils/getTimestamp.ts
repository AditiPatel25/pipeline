export const getTimestamp = (date: string | undefined) =>
    date ? new Date(date).getTime() : null;
