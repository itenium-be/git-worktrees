// PROTOTYPE chrome: scale the fixed 1920x1080 stage to the viewport, walk the two slides,
// and forward digit keys up so the bake-off index can switch variants while a deck has focus.
const deck = document.querySelector('.deck');
const slides = [...document.querySelectorAll('.slide')];
let i = 0;

function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  deck.style.transform = `scale(${s})`;
}
function show(n) {
  i = (n + slides.length) % slides.length;
  slides.forEach((el, k) => el.classList.toggle('active', k === i));
}

addEventListener('resize', fit);
addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') show(i + 1);
  else if (e.key === 'ArrowLeft') show(i - 1);
  else if ('12345'.includes(e.key)) parent.postMessage({ type: 'switchVariant', key: 'abcde'['12345'.indexOf(e.key)] }, '*');
});
document.getElementById('fit').addEventListener('click', () => show(i + 1));

fit();
show(0);
