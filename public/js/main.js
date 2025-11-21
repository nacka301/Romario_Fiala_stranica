// ==========================================
// Navigation & Scroll Effects
// ==========================================

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ==========================================
// Gallery Lightbox
// ==========================================

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay span');
        
        lightbox.classList.add('active');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (caption) {
            lightboxCaption.textContent = caption.textContent;
        }
        
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// ==========================================
// Contact Form Handler
// ==========================================

const contactForm = document.getElementById('contactForm');
const formStartTimeInput = document.getElementById('formStartTime');
const formMessage = document.querySelector('.form-message');

// Set form start time when page loads
if (formStartTimeInput) {
    formStartTimeInput.value = Date.now();
}

// Reset form start time when user starts interacting with form
if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    let formStartSet = false;
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (!formStartSet && input.name !== 'website') {
                formStartTimeInput.value = Date.now();
                formStartSet = true;
            }
        });
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Anti-spam checks
    // 1. Honeypot check
    if (data.website) {
        console.log('Spam detected: honeypot filled');
        showFormMessage('Došlo je do greške. Pokušajte ponovo.', 'error');
        return;
    }
    
    // 2. Time-on-form check (minimum 3 seconds)
    const formStartTime = parseInt(data.formStartTime);
    const currentTime = Date.now();
    const timeSpent = currentTime - formStartTime;
    
    if (timeSpent < 3000) {
        console.log('Spam detected: form filled too quickly');
        showFormMessage('Molimo vas da popunite formu pažljivije.', 'error');
        return;
    }
    
    // Remove honeypot and timestamp from data
    delete data.website;
    delete data.formStartTime;
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
        showFormMessage('Molimo popunite sva obavezna polja.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFormMessage('Molimo unesite ispravnu email adresu.', 'error');
        return;
    }
    
    // Disable submit button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Šaljem...';
    
    try {
        // Check if we're on localhost (API endpoint won't work locally)
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocalhost) {
            // Simulate successful submission on localhost
            console.log('📧 LOCALHOST TEST MOD - Forma bi bila poslana s ovim podacima:');
            console.log('-----------------------------------');
            console.log('Ime:', data.name);
            console.log('Email:', data.email);
            console.log('Telefon:', data.phone || 'nije uneseno');
            console.log('Usluga:', data.service || 'nije odabrano');
            console.log('Poruka:', data.message);
            console.log('-----------------------------------');
            showFormMessage('✅ TEST MOD: Forma bi bila uspješno poslana! (Na production Vercel serveru email će biti stvarno poslan)', 'success');
            contactForm.reset();
            formStartTimeInput.value = Date.now();
            return;
        }
        
        // Send to API endpoint (only works on Vercel)
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (response.ok) {
            showFormMessage('Hvala! Vaša poruka je uspješno poslana. Javit ćemo vam se uskoro.', 'success');
            contactForm.reset();
            formStartTimeInput.value = Date.now();
        } else {
            const error = await response.json();
            showFormMessage(error.message || 'Došlo je do greške. Pokušajte ponovo.', 'error');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('Došlo je do greške prilikom slanja. Pokušajte ponovo ili nas kontaktirajte telefonom.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 8 seconds for success, keep error visible
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 8000);
    }
}

if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// Intersection Observer for Animations
// ==========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and gallery items
const animatedElements = document.querySelectorAll('.service-card, .gallery-item');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Log page view (for analytics)
console.log('Page loaded:', window.location.pathname);
