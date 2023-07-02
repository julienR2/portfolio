export const formatDate = (date: string | undefined | null) =>
  !date
    ? ''
    : new Date(date).toLocaleString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      })
