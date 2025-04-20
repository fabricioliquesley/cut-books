/**
 * 
 * @param name string
 */
export function normalizeFolderName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[/\\?%*:|"<>]/g, '');
}