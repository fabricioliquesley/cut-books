/**
 * Returns the date in the format **dd/mm/yy**.
 * @param date
 */
export function formatDate(date: Date) {
  const dateInBrFormat = new Intl.DateTimeFormat("pt-br").format(date);

  return dateInBrFormat.replace(/\//g, "-");
}
