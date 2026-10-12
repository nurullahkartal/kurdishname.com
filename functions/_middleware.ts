export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  // İsim sayfası isteği mi?
  if (path.startsWith('/names/') || 
      path.match(/^\/(tr|en|de|ar)\/(isim|name|اسم)\//)) {
    // Statik dosyayı dene
    const response = await context.next();
    
    // Bulunduysa sun
    if (response.status === 200) return response;
    
    // Bulunamadıysa 404 dön
    return new Response('Aradığınız isim bulunamadı - 404 Not Found', { status: 404 });
  }
  
  return context.next();
};
