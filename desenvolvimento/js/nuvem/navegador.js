// Detecta navegadores embutidos em aplicativos (Instagram, Facebook, TikTok...).
// O Google bloqueia o login (OAuth) dentro deles ("disallowed_useragent"), então a conta Google precisa de Chrome ou Safari.
// Função pura: recebe o user agent e devolve o nome do aplicativo, ou null se for um navegador normal.
export function navegadorInterno(ua) {
  const u = String(ua != null ? ua : (typeof navigator !== 'undefined' ? navigator.userAgent : ''));
  if (/Instagram/i.test(u)) return 'Instagram';
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(u)) return 'Facebook';
  if (/TikTok|musical_ly|BytedanceWebview/i.test(u)) return 'TikTok';
  if (/Snapchat/i.test(u)) return 'Snapchat';
  if (/MicroMessenger/i.test(u)) return 'WeChat';
  if (/Twitter/i.test(u)) return 'Twitter';
  if (/LinkedInApp/i.test(u)) return 'LinkedIn';
  if (/Pinterest/i.test(u)) return 'Pinterest';
  if (/\bLine\//i.test(u)) return 'Line';
  if (/; wv\)/i.test(u)) return 'aplicativo'; // WebView genérico do Android
  return null;
}
