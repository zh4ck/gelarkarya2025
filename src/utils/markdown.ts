export function markdownToHtml(markdownText: string) {
  let html = markdownText;
  
  // buat ganti input dari AI yang pake format markdown ke strong beneran
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  html = html.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  
  html = html.replace(/\n/g, '<br />');

  return html;
}
