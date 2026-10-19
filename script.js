// Player próprio (sem controle nativo): toque para tocar/pausar, barra dourada de progresso.
// Só um vídeo toca por vez.
var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
players.forEach(function (p) {
  var v = p.querySelector('video');
  var btn = p.querySelector('.play');
  var bar = p.querySelector('.bar span');
  function toggle() {
    if (v.paused) {
      players.forEach(function (o) { var ov = o.querySelector('video'); if (ov !== v && !ov.paused) ov.pause(); });
      v.play();
    } else v.pause();
  }
  btn.addEventListener('click', toggle);
  v.addEventListener('click', toggle);
  v.addEventListener('play', function () { p.classList.add('playing', 'started'); });
  v.addEventListener('pause', function () { p.classList.remove('playing'); });
  v.addEventListener('ended', function () { p.classList.remove('playing'); });
  v.addEventListener('timeupdate', function () { if (v.duration) bar.style.width = (v.currentTime / v.duration * 100) + '%'; });
});

// Contagem regressiva até a meia-noite de HOJE (relógio do aparelho) + data de hoje
(function () {
  var h = document.getElementById('cd-h'), m = document.getElementById('cd-m'), s = document.getElementById('cd-s'), d = document.getElementById('hoje');
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var agora = new Date(), fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1);
    var r = Math.max(0, fim - agora);
    var H = Math.floor(r / 36e5); r -= H * 36e5;
    var M = Math.floor(r / 6e4); r -= M * 6e4;
    if (h) h.textContent = pad(H);
    if (m) m.textContent = pad(M);
    if (s) s.textContent = pad(Math.floor(r / 1000));
    if (d) {
      var sem = agora.toLocaleDateString('pt-BR', { weekday: 'long' });
      d.textContent = sem.charAt(0).toUpperCase() + sem.slice(1) + ', ' + pad(agora.getDate()) + '/' + pad(agora.getMonth() + 1) + '/' + agora.getFullYear();
    }
  }
  tick(); setInterval(tick, 1000);
})();

// Carrossel de depoimentos no celular: bolinhas acompanham a rolagem
(function () {
  var reel = document.getElementById('reel'), dots = document.getElementById('dots');
  if (!reel || !dots) return;
  var items = reel.children;
  var prev = document.getElementById('prev'), next = document.getElementById('next'), atual = 0, trava = 0;
  function ir(i) {
    i = Math.max(0, Math.min(items.length - 1, i));
    atual = i; trava = Date.now() + 700; pinta(i);
    var it = items[i];
    reel.scrollTo({ left: it.offsetLeft - (reel.clientWidth - it.offsetWidth) / 2, behavior: 'smooth' });
  }
  for (var i = 0; i < items.length; i++) {
    var d = document.createElement('i');
    d.setAttribute('aria-label', 'Vídeo ' + (i + 1));
    d.addEventListener('click', ir.bind(null, i));
    dots.appendChild(d);
  }
  if (prev) prev.addEventListener('click', function () { ir(atual - 1); });
  if (next) next.addEventListener('click', function () { ir(atual + 1); });
  function mark() {
    var c = reel.scrollLeft + reel.clientWidth / 2, best = 0, dist = 1e9;
    for (var i = 0; i < items.length; i++) {
      var mid = items[i].offsetLeft + items[i].offsetWidth / 2, dd = Math.abs(mid - c);
      if (dd < dist) { dist = dd; best = i; }
    }
    if (Date.now() < trava) return; // enquanto a seta anima, vale o destino dela
    atual = best; pinta(best);
  }
  function pinta(n) {
    for (var j = 0; j < dots.children.length; j++) dots.children[j].classList.toggle('on', j === n);
    if (prev) prev.disabled = n === 0;
    if (next) next.disabled = n === items.length - 1;
  }
  reel.addEventListener('scroll', mark, { passive: true });
  reel.addEventListener('scrollend', function () { trava = 0; mark(); });
  mark();
})();

// Aviso de compra rotativo
(function () {
  var nomes = ['Carlos H.', 'Ricardo A.', 'Bruno O.', 'Fernando C.', 'Marcelo S.', 'Rafael L.', 'Thiago R.', 'André S.', 'Luiz F.', 'Paulo V.', 'Diego M.', 'Eduardo R.', 'Gustavo P.', 'Rodrigo N.', 'Vinicius B.', 'Leandro C.', 'Felipe A.', 'Anderson S.', 'Marcos V.', 'Renato D.'];
  var cidades = ['Campinas, SP', 'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Curitiba, PR', 'Porto Alegre, RS', 'Salvador, BA', 'Fortaleza, CE', 'Recife, PE', 'Brasília, DF', 'Goiânia, GO', 'Manaus, AM', 'Florianópolis, SC', 'Vitória, ES', 'Natal, RN', 'Uberlândia, MG', 'Ribeirão Preto, SP', 'Londrina, PR', 'Joinville, SC', 'Maceió, AL'];
  var t = document.getElementById('toast'), n = document.getElementById('toast-name'), c = document.getElementById('toast-city');
  if (!t) return;
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function show() {
    n.textContent = pick(nomes);
    c.textContent = 'garantiu o acesso · ' + pick(cidades);
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 5000);
  }
  setTimeout(show, 6000);
  setInterval(show, 22000);
})();
