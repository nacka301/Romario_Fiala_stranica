// Zajednička skripta za demo stranice
document.documentElement.classList.add('js');
const navT = document.querySelector('.nav-toggle'), navM = document.querySelector('.nav-menu');
if (navT && navM) {
    const set = o => { navM.classList.toggle('open', o); navT.setAttribute('aria-expanded', String(o)); };
    navT.addEventListener('click', () => set(navT.getAttribute('aria-expanded') !== 'true'));
    navM.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
}
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
// Demo forme: ništa se ne šalje, samo se prikaže potvrda
window.demoSubmit = (form, msgEl, text) => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        msgEl.textContent = text; msgEl.hidden = false;
        msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        form.reset();
    });
};
