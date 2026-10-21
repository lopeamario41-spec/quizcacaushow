/* Página de vendas estática (GitHub Pages).
   O pagamento é feito na Monetizze: todo botão com data-checkout leva para CHECKOUT_URL.
   Para trocar o link, mude só a linha abaixo. Os parâmetros da URL da página
   (utm_*, fbclid, src...) são repassados para o checkout. */
(function () {
  var CHECKOUT_URL = 'https://pay.monetizze.com.br/KLK467702?pix=1';
  var CHECKOUT_SAIDA = 'https://pay.monetizze.com.br/KDJ467952?pix=1'; // oferta de R$ 9 do pop-up de saída
  var PRECO_SAIDA = 9.00;
  var PIXELS = ['1723689928729300', '1426335359705831']; // os eventos vão para todos
  var PRECO = 29.00;

  /* ---------- pixel do Facebook ---------- */
  !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  PIXELS.forEach(function (id) { fbq('init', id); });
  fbq('track', 'PageView');

  function brl(v) { return 'R$ ' + Number(v).toFixed(2).replace('.', ','); }

  function linkCheckout(base) {
    base = base || CHECKOUT_URL;
    if (!base) return '';
    var url = new URL(base);
    new URLSearchParams(location.search).forEach(function (v, k) { if (!url.searchParams.has(k)) url.searchParams.set(k, v); });
    return url.toString();
  }

  var jaComprou = false;
  function comprar(e) {
    if (e) e.preventDefault();
    jaComprou = true;
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

  /* ---------- POP-UP DE SAÍDA: oferta de R$ 9 ----------
     Computador: o mouse sai pelo topo da janela (indo fechar a aba).
     Celular: a pessoa aperta VOLTAR (depois de ter tocado em algo na página).
     Aparece uma vez só, e nunca para quem já clicou em comprar. */
  var CHAVE = 'saida_r9_visto';
  // uma vez por pessoa a cada 24 h (guardado no aparelho)
  function jaViu() { try { return Date.now() - parseInt(localStorage.getItem(CHAVE) || '0', 10) < 864e5; } catch (e) { return false; } }
  function marcaVisto() { try { localStorage.setItem(CHAVE, String(Date.now())); } catch (e) {} }
  var pop = null;
  function abrirSaida() {
    if (jaComprou || jaViu() || pop) return false;
    marcaVisto();
    pop = document.createElement('div');
    pop.className = 'saida';
    pop.setAttribute('role', 'dialog');
    pop.innerHTML =
      '<div class="saida-caixa">' +
        '<button class="saida-x" type="button" aria-label="Fechar">&times;</button>' +
        '<p class="saida-tag">Espera! Antes de sair…</p>' +
        '<h3 class="saida-tit">Você ganhou um <span class="ouro">desconto especial</span></h3>' +
        '<p class="saida-txt">Só agora, o curso completo sai por um valor que você não vai ver de novo.</p>' +
        '<div class="saida-preco"><s>' + brl(PRECO) + '</s><b>' + brl(PRECO_SAIDA) + '</b></div>' +
        '<button class="cta saida-cta" type="button">Quero por ' + brl(PRECO_SAIDA).replace(',00', '') +
          ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>' +
        '<button class="saida-nao" type="button">Não, obrigado</button>' +
      '</div>';
    document.body.appendChild(pop);
    requestAnimationFrame(function () { pop.classList.add('show'); });
    function fechar() { pop.classList.remove('show'); }
    pop.querySelector('.saida-x').onclick = fechar;
    pop.querySelector('.saida-nao').onclick = fechar;
    pop.addEventListener('click', function (e) { if (e.target === pop) fechar(); });
    pop.querySelector('.saida-cta').onclick = function () {
      jaComprou = true;
      if (window.fbq) fbq('track', 'InitiateCheckout', { value: PRECO_SAIDA, currency: 'BRL' });
      var destino = linkCheckout(CHECKOUT_SAIDA);
      setTimeout(function () { location.href = destino; }, 250);
    };
    return true;
  }
  // computador
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget && e.clientY <= 0) abrirSaida();
  });
  // celular: depois do primeiro toque, guarda uma "página" a mais no histórico; o VOLTAR mostra o pop-up
  var armado = false;
  function armar() {
    if (armado || jaViu()) return;
    armado = true;
    try { history.pushState({ saida: 1 }, '', location.href); } catch (e) {}
  }
  document.addEventListener('touchend', armar, { passive: true, once: true });
  document.addEventListener('click', armar, { once: true });
  window.addEventListener('popstate', function () {
    if (!abrirSaida()) history.back(); // já viu ou já comprou: deixa sair de verdade
  });
  })();
