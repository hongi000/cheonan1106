(() => {
'use strict';
const slides = window.CHEONAN_SLIDES;
const $ = id => document.getElementById(id);
let current=1,autoplay=null,touchStart=null,toastTimeout=null;
const pad=n=>String(n).padStart(2,'0');
const thumbHTML=s=>`<button class="thumb" data-slide="${s.id}" aria-label="${s.id}번 슬라이드 ${escapeHTML(s.label)}"><img src="${s.image}" alt="" loading="lazy"><span>${pad(s.id)}</span></button>`;
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderNav(){ $('filmstrip').innerHTML=slides.map(thumbHTML).join(''); $('overviewGrid').innerHTML=slides.map(s=>`<button class="overview-tile" data-slide="${s.id}"><img src="${s.image}" alt="" loading="lazy"><span>${pad(s.id)}. ${escapeHTML(s.label)}</span></button>`).join(''); }
function goto(n,{updateHash=true,animate=true}={}){
 const v=Math.max(1,Math.min(slides.length,Number(n)||1));const previous=current;current=v; const s=slides[v-1];
 const img=$('slideImage');img.src=s.image;img.alt=`${v}번 슬라이드. ${s.texts.join('. ').replaceAll('\n',' ')}`;
 $('chapterLabel').textContent=s.label;$('slideCounter').textContent=`${pad(v)} — ${pad(slides.length)}`;
 $('progressBar').style.width=`${v/slides.length*100}%`;
 $('prevBtn').disabled=v===1;$('nextBtn').disabled=v===slides.length;
 document.querySelectorAll('[data-slide]').forEach(el=>{el.classList.toggle('active',Number(el.dataset.slide)===v);if(Number(el.dataset.slide)===v)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
 document.querySelectorAll('[data-jump]').forEach(el=>el.classList.toggle('active',Number(el.dataset.jump)=== (v>=9?9:v>=4?4:v>=2?2:1)));
 if(animate&&previous!==v){const shell=$('slideShell');shell.classList.remove('enter-next','enter-prev');void shell.offsetWidth;shell.classList.add(v>previous?'enter-next':'enter-prev');}
 if(updateHash)history.replaceState(null,'',`#slide=${v}`);
 document.querySelector('.thumb.active')?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'nearest'});
 if(!$('details').hidden)fillDetails();
}
function fillDetails(){const s=slides[current-1];$('detailTitle').textContent=`${pad(current)}. ${s.label}`; $('detailsBody').innerHTML=`<div class="source-heading">슬라이드 원문</div><ul class="slide-text-list">${s.texts.map(t=>`<li>${escapeHTML(t)}</li>`).join('')}</ul>${s.note?`<div class="source-heading">발표자 메모</div><div class="note-box">${escapeHTML(s.note)}</div>`:''}<div class="source-heading">자료 출처 (${s.sources.length})</div>${s.sources.map((url,i)=>`<a class="source-link" target="_blank" rel="noopener noreferrer" href="${escapeHTML(url)}">${i+1}. ${escapeHTML(url)}</a>`).join('')||'<p>외부 출처가 별도로 표기되지 않았습니다.</p>'}`;}
function toggleModal(id,open){const el=$(id);el.hidden=!open;document.body.style.overflow=(!+$('overview').hidden||!+$('details').hidden)?'hidden':'';if(open){if(id==='details')fillDetails();el.querySelector('.close-btn')?.focus();}}
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),2200);}
function stopAuto(){if(autoplay){clearInterval(autoplay);autoplay=null;}$('autoBtn').setAttribute('aria-pressed','false');$('autoState').textContent='OFF';}
function toggleAuto(){if(autoplay){stopAuto();return;}if(current===slides.length)goto(1);autoplay=setInterval(()=>{if(current===slides.length){stopAuto();toast('마지막 슬라이드입니다.');}else goto(current+1);},6500);$('autoBtn').setAttribute('aria-pressed','true');$('autoState').textContent='ON';}
renderNav();
const match=location.hash.match(/slide=(\d+)/);goto(match?Number(match[1]):1,{updateHash:false,animate:false});
$('prevBtn').onclick=()=>goto(current-1);$('nextBtn').onclick=()=>goto(current+1);
$('overviewBtn').onclick=()=>toggleModal('overview',true);
$('detailBtn').onclick=$('toggleNote').onclick=()=>toggleModal('details',true);
$('autoBtn').onclick=toggleAuto;
$('fullscreenBtn').onclick=async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch(e){toast('이 브라우저에서는 전체 화면이 제한됩니다.');}};
document.querySelectorAll('[data-jump]').forEach(el=>el.onclick=()=>goto(el.dataset.jump));
document.addEventListener('click',e=>{const jump=e.target.closest('[data-slide]');if(jump){goto(jump.dataset.slide);toggleModal('overview',false);}const close=e.target.closest('[data-close]');if(close)toggleModal(close.dataset.close,false);});
window.addEventListener('hashchange',()=>{const m=location.hash.match(/slide=(\d+)/);if(m)goto(+m[1],{updateHash:false});});
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select'))return;if(!$('overview').hidden||!$('details').hidden){if(e.key==='Escape'){toggleModal('overview',false);toggleModal('details',false);}return;}switch(e.key){case'ArrowRight':case'PageDown':e.preventDefault();goto(current+1);break;case'ArrowLeft':case'PageUp':e.preventDefault();goto(current-1);break;case'Home':e.preventDefault();goto(1);break;case'End':e.preventDefault();goto(slides.length);break;case'Escape':stopAuto();break;case'i':case'I':toggleModal('details',true);break;case'g':case'G':toggleModal('overview',true);break;}});
$('deckRegion').addEventListener('touchstart',e=>{touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});
$('deckRegion').addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.3)goto(current+(dx<0?1:-1));touchStart=null;},{passive:true});
let wheelLock=0;$('deckRegion').addEventListener('wheel',e=>{if(!e.shiftKey)return;e.preventDefault();const now=Date.now();if(now-wheelLock<560)return;wheelLock=now;goto(current+(e.deltaY>0||e.deltaX>0?1:-1));},{passive:false});
})();
