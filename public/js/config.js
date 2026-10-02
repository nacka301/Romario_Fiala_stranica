// ==========================================
// KONFIGURACIJA STRANICE - OVDJE PROMIJENI PODATKE
// ==========================================

const siteConfig = {
    // OSNOVNI PODACI O FIRMI
    companyName: "Fiala Mont",
    companySlogan: "Vaš partner za savršene podove",
    
    // KONTAKT PODACI
    phone: "+385 97 725 1303",
    phoneClean: "385977251303", // bez razmaka i znakova (za tel: linkove)
    email: "romario.fiala@gmail.com",
    
    // LOKACIJA
    location: "Daruvar, Hrvatska",
    locationCity: "Daruvar",
    locationCountry: "HR",
    gpsLatitude: "45.5911",
    gpsLongitude: "17.2251",
    
    // RADNO VRIJEME
    workingHours: "Kontaktirajte nas za dogovor",
    // Primjer ako ima fiksno: "Pon-Pet: 08:00-17:00, Sub: 09:00-13:00"
    
    // DRUŠTVENE MREŽE
    instagram: "VAŠPROFIL", // samo username (npr: "fialmont_official")
    facebook: "61583937603737", // ID ili username (npr: "100012345678901" ili "fialmont")
    
    // DOMENA (ako imaš custom domenu, inače ostavi Vercel)
    website: "https://fialamont.com",
    
    // HERO SEKCIJA
    heroTitle: "Kvalitetno postavljanje podova",
    heroSubtitle: "Stručno postavljanje parketa, laminata i vinil podova. Brušenje i renoviranje starog parketa.",
    
    // O NAMA TEKST
    aboutText1: "Nudimo kvalitetne usluge postavljanja i obnavljanja podova za vaš dom ili poslovni prostor.",
    aboutText2: "Koristimo moderne tehnike i pažljiv pristup kako bi vaš pod bio savršeno postavljen.",
    
    // META PODACI (za Google)
    metaDescription: "Profesionalno postavljanje parketa, laminata i vinil podova te brušenje i obnova parketa. Daruvar i okolica. Besplatna procjena — kontaktirajte nas!",
    metaKeywords: "parket, laminat, vinil podovi, brušenje parketa, postavljanje podova",
    
    // OPCIONO: Poslovni podaci (ostavi prazno ako nema)
    oib: "04563960184", // npr: "12345678901"
    maticniBroj: "", // npr: "98765432"
    adresa: "Frante Buriana 5, 43500 Daruvar", // npr: "Ulica 123, 10000 Zagreb"
};

// ==========================================
// NE DIRAJ OVO ISPOD - primjenjuje podatke odozgo na stranicu
// Elementi se pune preko atributa: data-cfg="phone|email|adresa|workingHours",
// data-cfg-tel / data-cfg-mail / data-cfg-wa / data-cfg-fb (linkovi).
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-cfg]').forEach(function (el) {
        var v = siteConfig[el.dataset.cfg];
        if (v) el.textContent = v;
    });
    document.querySelectorAll('[data-cfg-tel]').forEach(function (a) { a.href = 'tel:+' + siteConfig.phoneClean; });
    document.querySelectorAll('[data-cfg-mail]').forEach(function (a) { a.href = 'mailto:' + siteConfig.email; });
    document.querySelectorAll('[data-cfg-wa]').forEach(function (a) { a.href = 'https://wa.me/' + siteConfig.phoneClean; });
    document.querySelectorAll('[data-cfg-fb]').forEach(function (a) { a.href = 'https://www.facebook.com/' + siteConfig.facebook; });
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteConfig;
}
