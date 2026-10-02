// ==========================================
// Fiala Mont - glavna skripta
// ==========================================

// Navigacija (mobilni izbornik)
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');

function setMenu(open) {
    navMenu.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
}
navToggle?.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
navMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) { setMenu(false); navToggle.focus(); }
});

// Aktivni link prema sekciji
const navLinks = [...document.querySelectorAll('.nav-link')];
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
    });
}, { rootMargin: '-40% 0px -55% 0px' });
navLinks.forEach(l => {
    const target = document.querySelector(l.getAttribute('href'));
    if (target) sectionObserver.observe(target);
});

// Galerija: "Prikaži više"
const galleryMore = document.getElementById('galleryMore');
const extras = document.querySelectorAll('#galleryGrid [data-extra]');
if (galleryMore) {
    if (!extras.length) galleryMore.hidden = true;
    galleryMore.addEventListener('click', () => {
        const expanded = galleryMore.getAttribute('aria-expanded') === 'true';
        extras.forEach(el => { el.hidden = expanded; });
        galleryMore.setAttribute('aria-expanded', String(!expanded));
        galleryMore.textContent = expanded ? 'Prikaži više radova' : 'Prikaži manje';
    });
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
let lbIndex = 0;
let lbOpener = null;

const visibleButtons = () => [...document.querySelectorAll('#galleryGrid .gallery-item:not([hidden]) .gallery-btn')];

function showLightbox(i) {
    const btns = visibleButtons();
    lbIndex = (i + btns.length) % btns.length;
    const btn = btns[lbIndex];
    lightboxImg.src = btn.dataset.full;
    lightboxImg.alt = btn.querySelector('img').alt;
}
function openLightbox(btn) {
    lbOpener = btn;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    showLightbox(visibleButtons().indexOf(btn));
    lightbox.querySelector('.lightbox-close').focus();
}
function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.removeAttribute('src');
    document.body.style.overflow = '';
    lbOpener?.focus();
}
document.getElementById('galleryGrid')?.addEventListener('click', e => {
    const btn = e.target.closest('.gallery-btn');
    if (btn) openLightbox(btn);
});
lightbox?.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox?.querySelector('.prev').addEventListener('click', () => showLightbox(lbIndex - 1));
lightbox?.querySelector('.next').addEventListener('click', () => showLightbox(lbIndex + 1));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
    if (e.key === 'Tab') { // fokus ostaje unutar lightboxa
        const f = [...lightbox.querySelectorAll('button')];
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
});

// Reveal animacije (sadržaj je vidljiv i bez JS-a)
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.card, .steps li, .contact-item, .cta-inner').forEach(el => {
        el.classList.add('reveal');
        io.observe(el);
    });
}

// ==========================================
// Kontakt forma
// ==========================================
const contactForm = document.getElementById('contactForm');
const formStartTimeInput = document.getElementById('formStartTime');
const formMessage = document.querySelector('.form-message');

if (contactForm) {
    formStartTimeInput.value = Date.now();
    let formStartSet = false;
    contactForm.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', () => {
            if (!formStartSet && input.name !== 'website') {
                formStartTimeInput.value = Date.now();
                formStartSet = true;
            }
        });
    });
    contactForm.addEventListener('submit', handleFormSubmit);
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (type === 'success') setTimeout(() => { formMessage.style.display = 'none'; }, 8000);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm));
    contactForm.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

    // Anti-spam: honeypot i minimalno vrijeme na formi (3 s)
    if (data.website) { showFormMessage('Došlo je do greške. Pokušajte ponovo.', 'error'); return; }
    if (Date.now() - parseInt(data.formStartTime, 10) < 3000) {
        showFormMessage('Molimo vas da popunite formu pažljivije.', 'error');
        return;
    }
    delete data.website;
    delete data.formStartTime;

    const missing = ['name', 'email', 'message'].filter(k => !String(data[k] || '').trim());
    if (missing.length) {
        missing.forEach(k => contactForm.elements[k].classList.add('invalid'));
        contactForm.elements[missing[0]].focus();
        showFormMessage('Molimo popunite sva obavezna polja.', 'error');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        contactForm.elements.email.classList.add('invalid');
        contactForm.elements.email.focus();
        showFormMessage('Molimo unesite ispravnu email adresu.', 'error');
        return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Šaljem...';

    try {
        // Lokalno (npr. "serve") API ne postoji pa se slanje simulira; "vercel dev" ima API pa ide stvarno.
        const isLocalhost = ['localhost', '127.0.0.1'].includes(location.hostname);
        const res = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).catch(err => { if (isLocalhost) return null; throw err; });

        if (res && res.ok) {
            showFormMessage('Hvala! Vaša poruka je uspješno poslana. Javit ćemo vam se uskoro.', 'success');
            contactForm.reset();
            formStartTimeInput.value = Date.now();
        } else if (!res || (isLocalhost && res.status === 404)) {
            showFormMessage('TEST MOD (lokalno): API nije dostupan, ništa nije poslano. Forma je ispravno popunjena.', 'success');
            contactForm.reset();
            formStartTimeInput.value = Date.now();
        } else {
            const error = await res.json().catch(() => ({}));
            showFormMessage(error.message || 'Došlo je do greške. Pokušajte ponovo.', 'error');
        }
    } catch (err) {
        showFormMessage('Došlo je do greške prilikom slanja. Pokušajte ponovo ili nas nazovite.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}
