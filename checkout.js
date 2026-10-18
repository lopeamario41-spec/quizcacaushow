/* Página de vendas estática (GitHub Pages).
   O pagamento é feito na Kiwify: todo botão com data-checkout leva para KIWIFY_URL.
   Para trocar o link, mude só a linha abaixo. Os parâmetros da URL da página
   (utm_*, fbclid, src...) são repassados para o checkout. */
(function () {
  var KIWIFY_URL = ''; // ex.: 'https://pay.kiwify.com.br/XXXXXXX'
  var PIXEL_ID = '1723689928729300';
  var PRECO = 9.00;

  /* ---------- pixel do Facebook ---------- */
  !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  function brl(v) { return 'R$ ' + Number(v).toFixed(2).replace('.', ','); }

  function linkCheckout() {
    if (!KIWIFY_URL) return '';
    var url = new URL(KIWIFY_URL);
    new URLSearchParams(location.search).forEach(function (v, k) { if (!url.searchParams.has(k)) url.searchParams.set(k, v); });
    return url.toString();
  }

  function comprar(e) {
    if (e) e.preventDefault();
    var destino = linkCheckout();
    if (!destino) { alert('Checkout em configuração. Tente novamente em instantes.'); return; }
    if (window.fbq) fbq('track', 'InitiateCheckout', { value: PRECO, currency: 'BRL' });
    setTimeout(function () { location.href = destino; }, 250);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-checkout]');
    if (a) comprar(e);
  });

  /* ---------- barra fixa de compra (celular) ---------- */
  var b = document.createElement('div');
  b.className = 'ckr-barra';
  b.innerHTML = '<div class="ckr-bp"><s>' + brl(279) + '</s><b>' + brl(PRECO) + '</b></div><button class="ckr-btn" type="button" data-checkout>Comprar agora</button>';
  document.body.appendChild(b);
  document.body.classList.add('ckr-tem-barra');
  function ver() { b.classList.toggle('show', window.scrollY > 350); }
  window.addEventListener('scroll', ver, { passive: true });
  ver();
})();
