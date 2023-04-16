export const formatDate = (date = new Date()) => {
  const dd = String(new Date(date).getDate()).padStart(2, '0');
  const mm = String(new Date(date).getMonth() + 1).padStart(2, '0');
  const yyyy = new Date(date).getFullYear();

  return `${yyyy}-${mm}-${dd}`;
};
