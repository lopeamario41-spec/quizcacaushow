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

// Contagem regressiva de 24h (fica guardada no aparelho)
(function () {
  var KEY = 'cd_end_v1', end = 0, el = document.getElementById('cd');
  try { end = parseInt(localStorage.getItem(KEY) || '0', 10); } catch (e) {}
  if (!end || end < Date.now()) end = Date.now() + 864e5;
  try { localStorage.setItem(KEY, end); } catch (e) {}
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var d = Math.max(0, end - Date.now());
    var h = Math.floor(d / 36e5); d -= h * 36e5;
    var m = Math.floor(d / 6e4); d -= m * 6e4;
    if (el) el.textContent = pad(h) + ':' + pad(m) + ':' + pad(Math.floor(d / 1000));
  }
  tick(); setInterval(tick, 1000);
})();

// Carrossel de depoimentos no celular: bolinhas acompanham a rolagem
(function () {
  var reel = document.getElementById('reel'), dots = document.getElementById('dots');
  if (!reel || !dots) return;
  var items = reel.children;
  for (var i = 0; i < items.length; i++) dots.appendChild(document.createElement('i'));
  function mark() {
    var c = reel.scrollLeft + reel.clientWidth / 2, best = 0, dist = 1e9;
    for (var i = 0; i < items.length; i++) {
      var mid = items[i].offsetLeft + items[i].offsetWidth / 2, dd = Math.abs(mid - c);
      if (dd < dist) { dist = dd; best = i; }
    }
    for (var j = 0; j < dots.children.length; j++) dots.children[j].classList.toggle('on', j === best);
  }
  reel.addEventListener('scroll', mark, { passive: true });
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
