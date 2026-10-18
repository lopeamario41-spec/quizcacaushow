
// Textos traduzíveis. A página em inglês define window.__I18N__ antes deste
// script; sem ela, tudo cai no português padrão e nada muda.
const T = window.__I18N__ || {};

// Smooth scroll
document.querySelectorAll('[data-scroll]').forEach(el=>{
  el.addEventListener('click',e=>{
    const t=document.querySelector(el.dataset.scroll);
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
  });
});

// Video play/pause universal
document.querySelectorAll('.video-wrap').forEach(wrap => {
  const v = wrap.querySelector('video');
  const btn = wrap.querySelector('.video-toggle');
  if (!v || !btn) return;
  const play = btn.querySelector('svg:first-child');
  const pause = btn.querySelector('svg:last-child');
  
  function toggle() {
    if (v.paused) {
      document.querySelectorAll('video').forEach(vid => {
         if(vid !== v && !vid.paused) vid.pause();
      });
      v.play();
    } else {
      v.pause();
    }
  }
  
  btn.addEventListener('click', toggle);
  v.addEventListener('click', toggle);
  
  v.addEventListener('play', () => {
    wrap.classList.add('playing');
    if(play) play.style.display = 'none';
    if(pause) pause.style.display = 'block';
    btn.setAttribute('aria-label', T.pausar || 'Pausar vídeo');
  });

  v.addEventListener('pause', () => {
    wrap.classList.remove('playing');
    if(play) play.style.display = 'block';
    if(pause) pause.style.display = 'none';
    btn.setAttribute('aria-label', T.reproduzir || 'Reproduzir vídeo');
  });
});

// Countdown 24h
(function(){
  const KEY='cd_end_v1';
  let end=parseInt(localStorage.getItem(KEY)||'0',10);
  const now=Date.now();
  if(!end||end<now) end=now+1000*60*60*24;
  localStorage.setItem(KEY,end);
  const h=document.getElementById('cd-h'),m=document.getElementById('cd-m'),s=document.getElementById('cd-s');
  function tick(){
    let d=Math.max(0,end-Date.now());
    const H=Math.floor(d/3.6e6);d-=H*3.6e6;
    const M=Math.floor(d/6e4);d-=M*6e4;
    const S=Math.floor(d/1000);
    if(h) h.textContent=String(H).padStart(2,'0');
    if(m) m.textContent=String(M).padStart(2,'0');
    if(s) s.textContent=String(S).padStart(2,'0');
  }
  tick();setInterval(tick,1000);
})();

// Reveal
const io=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}});
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Popup rotativo
const nomes=T.nomes||['Carlos Henrique','Ricardo Almeida','Bruno Oliveira','Fernando Costa','Marcelo Santos','Rafael Lima','Thiago Ribeiro','André Souza','Luiz Fernando','Paulo Vinícius','Diego Martins','Eduardo Rocha','Gustavo Pereira','Rodrigo Nunes','Vinicius Barbosa','Leandro Cardoso','Felipe Araújo','Rogério Melo','Anderson Silva','Marcos Vieira','Renato Duarte','Cláudio Pinheiro','Otávio Ramos','Sérgio Machado','Julio César'];
const cidades=T.cidades||['Campinas - SP','São Paulo - SP','Rio de Janeiro - RJ','Belo Horizonte - MG','Curitiba - PR','Porto Alegre - RS','Salvador - BA','Fortaleza - CE','Recife - PE','Brasília - DF','Goiânia - GO','Manaus - AM','Belém - PA','Florianópolis - SC','Vitória - ES','Natal - RN','João Pessoa - PB','Cuiabá - MT','Uberlândia - MG','Ribeirão Preto - SP','Sorocaba - SP','Niterói - RJ','Londrina - PR','Joinville - SC','Maceió - AL'];
const popupTexto=T.popupTexto||'acabou de adquirir o método em ';
const p=document.getElementById('popup'),pn=document.getElementById('popup-name'),pc=document.getElementById('popup-city');
function showPopup(){
  if(!p||!pn||!pc) return;
  const n=nomes[Math.floor(Math.random()*nomes.length)];
  const c=cidades[Math.floor(Math.random()*cidades.length)];
  pn.textContent=n;pc.textContent=popupTexto+c;
  p.classList.add('show');
  setTimeout(()=>p.classList.remove('show'),5500);
}
setTimeout(showPopup,4000);
setInterval(showPopup,20000);
(function(){
  const hvDelay = document.getElementById('heroVideo');
  if (hvDelay) {
    hvDelay.addEventListener('timeupdate', () => {
      if (hvDelay.currentTime >= 130) {
        const s = document.getElementById('delay-style');
        if (s) s.remove();
        const pcDelay = document.querySelector('.price-card');
        const cbDelay = document.querySelector('.cta-lg');
        if (pcDelay) pcDelay.style.display = '';
        if (cbDelay) cbDelay.style.display = '';
      }
    });
  }
})();