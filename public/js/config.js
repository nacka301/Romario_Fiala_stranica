// ==========================================
// KONFIGURACIJA STRANICE - OVDJE PROMIJENI PODATKE
// ==========================================

const siteConfig = {
    // OSNOVNI PODACI O FIRMI
    companyName: "Fiala Mont ",
    companySlogan: "Vaš partner za savršene podove",
    
    // KONTAKT PODACI
    phone: "+385 97 725 1303",
    phoneClean: "385977251303", // bez razmaka i znakova (za tel: linkove)
    email: "romario.fiala@gmail.com",
    
    // LOKACIJA
    location: "Daruvar, Hrvatska",
    locationCity: "Daruvar",
    locationCountry: "HR",
    gpsLatitude: "45.8150",
    gpsLongitude: "15.9819",
    
    // RADNO VRIJEME
    workingHours: "Kontaktirajte nas za dogovor",
    // Primjer ako ima fiksno: "Pon-Pet: 08:00-17:00, Sub: 09:00-13:00"
    
    // DRUŠTVENE MREŽE
    instagram: "VAŠPROFIL", // samo username (npr: "fialmont_official")
    facebook: "VAŠID", // ID ili username (npr: "100012345678901" ili "fialmont")
    
    // DOMENA (ako imaš custom domenu, inače ostavi Vercel)
    website: "https://fialmont.vercel.app",
    
    // HERO SEKCIJA
    heroTitle: "Kvalitetno postavljanje podova",
    heroSubtitle: "Stručno postavljanje parketa, laminata i vinil podova. Brušenje i renoviranje starog parketa.",
    
    // O NAMA TEKST
    aboutText1: "Nudimo kvalitetne usluge postavljanja i obnavljanja podova za vaš dom ili poslovni prostor.",
    aboutText2: "Koristimo moderne tehnike i pažljiv pristup kako bi vaš pod bio savršeno postavljen.",
    
    // META PODACI (za Google)
    metaDescription: "Profesionalno postavljanje parketa, laminata, vinil podova, tepiha i brušenje parketa. Iskustvo, kvalitet i preciznost.",
    metaKeywords: "parket, laminat, vinil podovi, brušenje parketa, postavljanje podova",
    
    // OPCIONO: Poslovni podaci (ostavi prazno ako nema)
    oib: "04563960184", // npr: "12345678901"
    maticniBroj: "", // npr: "98765432"
    adresa: "Frante Buriana 5,43500 Daruvar", // npr: "Ulica 123, 10000 Zagreb"
};

// ==========================================
// NE DIRAJ OVO ISPOD - automatski primjenjuje promjene
// ==========================================

// Čeka da se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    updatePageContent();
});

function updatePageContent() {
    // IME FIRME
    const companyNameElements = document.querySelectorAll('.company-name, .nav-brand h1, .footer-section h3');
    companyNameElements.forEach(el => {
        if (el) el.textContent = siteConfig.companyName;
    });
    
    // HERO SEKCIJA
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroTitle) heroTitle.textContent = siteConfig.heroTitle;
    if (heroSubtitle) heroSubtitle.textContent = siteConfig.heroSubtitle;
    
    // TELEFON
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.href = `tel:+${siteConfig.phoneClean}`;
        if (link.textContent.includes('+385') || link.textContent.includes('📞')) {
            link.textContent = link.textContent.includes('📞') ? `📞 ${siteConfig.phone}` : siteConfig.phone;
        }
    });
    
    const phoneTexts = document.querySelectorAll('.contact-item a[href^="tel:"], .footer-section p');
    phoneTexts.forEach(el => {
        if (el.textContent.includes('📞')) {
            el.textContent = `📞 ${siteConfig.phone}`;
        }
    });
    
    // EMAIL
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.href = `mailto:${siteConfig.email}`;
        if (!link.querySelector('img')) { // ako nije dugme sa slikom
            link.textContent = siteConfig.email;
        }
    });
    
    const emailTexts = document.querySelectorAll('.footer-section p');
    emailTexts.forEach(el => {
        if (el.textContent.includes('📧')) {
            el.textContent = `📧 ${siteConfig.email}`;
        }
    });
    
    // LOKACIJA
    const locationElements = document.querySelectorAll('.contact-item p');
    locationElements.forEach(el => {
        if (el.textContent.includes('Zagreb') || el.textContent.includes('Hrvatska')) {
            el.textContent = siteConfig.location;
        }
    });
    
    // RADNO VRIJEME
    const workingHoursEl = document.querySelector('.contact-item:last-child p');
    if (workingHoursEl && workingHoursEl.textContent.includes('dogovor')) {
        workingHoursEl.textContent = siteConfig.workingHours;
    }
    
    // DRUŠTVENE MREŽE
    const instagramLinks = document.querySelectorAll('a[href*="instagram"]');
    instagramLinks.forEach(link => {
        link.href = `https://www.instagram.com/${siteConfig.instagram}`;
    });
    
    const facebookLinks = document.querySelectorAll('a[href*="facebook"]');
    facebookLinks.forEach(link => {
        link.href = `https://www.facebook.com/${siteConfig.facebook}`;
    });
    
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.href = `https://wa.me/${siteConfig.phoneClean}`;
    });
    
    // O NAMA TEKST
    const aboutTexts = document.querySelectorAll('.about-text p');
    if (aboutTexts.length >= 2) {
        aboutTexts[0].textContent = siteConfig.aboutText1;
        aboutTexts[1].textContent = siteConfig.aboutText2;
    }
    
    // FOOTER SLOGAN
    const footerSlogan = document.querySelector('.footer-section p');
    if (footerSlogan && footerSlogan.textContent.includes('partner')) {
        footerSlogan.textContent = siteConfig.companySlogan;
    }
    
    // Ako ima OIB i druge podatke, dodaj u footer
    if (siteConfig.oib || siteConfig.adresa) {
        addBusinessInfo();
    }
    
    // Ažuriraj page title
    document.title = `${siteConfig.companyName} - Postavljanje Parketa, Laminata, Vinila i Brušenje`;
    
    // Ažuriraj meta tagove
    updateMetaTags();
}

function addBusinessInfo() {
    const footerContent = document.querySelector('.footer-content');
    if (!footerContent || document.querySelector('.business-info')) return;
    
    const businessInfo = document.createElement('div');
    businessInfo.className = 'footer-section business-info';
    businessInfo.innerHTML = '<h4>Podaci o tvrtki</h4>';
    
    if (siteConfig.oib) {
        businessInfo.innerHTML += `<p>OIB: ${siteConfig.oib}</p>`;
    }
    if (siteConfig.maticniBroj) {
        businessInfo.innerHTML += `<p>MB: ${siteConfig.maticniBroj}</p>`;
    }
    if (siteConfig.adresa) {
        businessInfo.innerHTML += `<p>${siteConfig.adresa}</p>`;
    }
    
    footerContent.appendChild(businessInfo);
}

function updateMetaTags() {
    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = siteConfig.metaDescription;
    
    // Meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.content = siteConfig.metaKeywords;
    
    // Open Graph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${siteConfig.companyName} - Postavljanje i Brušenje Podova`;
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = siteConfig.metaDescription;
    
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = siteConfig.website;
    
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.content = `${siteConfig.website}/images/posao_3/IMG-20251028-WA0014.jpg`;
}

// Export za korištenje u drugim fileovima ako treba
if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteConfig;
}
