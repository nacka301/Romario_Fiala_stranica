# Fial Mont - Website

Profesionalna jednostranična web stranica za usluge postavljanja i brušenja podova.

## 🚀 Tehnologije

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Email**: Brevo (Sendinblue) API
- **Hosting**: Vercel (automatski deploy iz GitHub-a)
- **Analytics**: Vercel Web Analytics (bez kolačića)

## 📁 Struktura projekta

```
romario_stranica/
├── public/
│   ├── index.html          # Glavna stranica (Fial Mont)
│   ├── css/
│   │   └── styles.css      # Stilovi i responsive layout
│   ├── js/
│   │   └── main.js         # Navigacija, lightbox, forma
│   ├── images/
│   │   ├── posao_1/        # Fotke projekta 1 (koriste se za hero)
│   │   ├── posao_2/        # Fotke projekta 2 (koristi se za "O nama")
│   │   └── posao_3/        # Fotke projekta 3 (koriste se za OG i galeriju)
│   ├── sitemap.xml         # SEO sitemap
│   └── robots.txt          # Robots konfiguracija
├── api/
│   └── send-email.js       # Serverless funkcija za kontakt formu
├── vercel.json             # Vercel konfiguracija (security & caching)
├── package.json            # NPM skripte i dev dependency (vercel)
├── .env.example            # Primjer env varijabli
└── README.md               # Ovaj dokument
```

## 🎨 Značajke

### Frontend
- ✅ Moderni responzivni dizajn bez build alata
- ✅ Fixirana navigacija sa smooth-scroll anchorima
- ✅ Hero sekcija s pozadinskom fotografijom stvarnog projekta
- ✅ Sekcija "O nama" sa provjerenim alt tekstom
- ✅ Galerija 23 stvarne fotografije + lightbox
- ✅ Lazy loading za bolje performanse
- ✅ Animacije pri skrolanju preko Intersection Observera

### Backend & Sigurnost
- ✅ Vercel serverless API (`/api/send-email`)
- ✅ Brevo (Sendinblue) integracija preko API ključa
- ✅ Anti-spam (honeypot + minimalno vrijeme na formi)
- ✅ Validacija emaila i obaveznih polja na klijentu i serveru
- ✅ Security headers (CSP nije potreban jer nema third-party skripti)
- ✅ Cache-control za statičke resurse

## 🔧 Postavljanje

### 1. Konfiguriraj okruženje

1. Napravi Brevo račun i generiraj API ključ.
2. U Vercel projektu postavi env varijable:

```bash
BREVO_API_KEY=...      # Brevo API ključ
RECIPIENT_EMAIL=...    # Email na koji dolaze upiti (npr. info@fialmont.hr)
```

Lokalno koristi `.env` datoteku (kopiraj `.env.example`).

### 2. Pokreni lokalno

```powershell
cd .\public
python -m http.server 8000
```

Otvorite `http://localhost:8000` i testirajte izgled. Kontakt forma lokalno ne šalje email (nema serverless okruženja), ali validacija radi.

### 3. Deploy na Vercel (GitHub workflow)

1. Inicijaliziraj git repo i push-aj na GitHub.
2. Na Vercel-u importiraj repo, dodaj env varijable i pokreni deploy.
3. Aktiviraj Vercel Web Analytics po želji (Settings → Analytics).

### 4. Ažuriranje sadržaja

- **Hero background**: `public/css/styles.css` → `.hero { background-image: ... }`
- **About slika**: `public/index.html` → `/images/posao_2/IMG-20251028-WA0011.jpg`
- **OG preview**: `<meta property="og:image">` i JSON-LD `image` pokazuje na `/images/posao_3/IMG-20251028-WA0014.jpg`
- **Kontakt**: Telefon `+385 97 725 1303`, email `info@fialmont.hr`
- **Grad**: trenutno "Zagreb" u tekstu i JSON-LD – promijeni ako je potrebno.

Ako dodaš nove projekte, samo ubaci fotke u `public/images/<novi_folder>/` i proširi galeriju u `index.html`.

## 📱 Sekcije

1. **Hero** – brend poruka i CTA
2. **O nama** – kratka priča i benefiti
3. **Usluge** – šest kartica (parket, laminat, vinil, tepih, brušenje, održavanje)
4. **Galerija** – 23 stvarne fotografije s lightbox pregledom
5. **Kontakt** – info kartice + forma
6. **Footer** – osnovni podaci i autorska prava

## 🔒 Sigurnosne napomene

- Honeypot polje `website` i time-on-form (min 3 sekunde).
- Server provjerava email format i obavezna polja.
- Security headers postavljeni u `vercel.json`.
- Preporuka: nakon deploya provjeri Vercel logs ako forma ne šalje.

## 🎯 SEO & Performanse

- Meta description, keywords, Open Graph tagovi
- JSON-LD (`LocalBusiness`) sa telefonom i lokacijom
- `sitemap.xml` i `robots.txt` već generirani
- Lazy loading i responsive slike
- Lighthouse rezultat 90+ uz trenutne slike (po potrebi optimiziraj rezolucije)

## � Licenca

ISC License – slobodno koristi, mijenjaj i prilagođavaj.

---

Za pitanja ili dodatne izmjene, javi se! 🚀

### Dodavanje novih sekcija

1. Dodajte HTML u `public/index.html`
2. Dodajte link u navigaciju
3. Stilove dodajte u `public/css/styles.css`
4. Ako treba JS, dodajte u `public/js/main.js`

## 📊 Performance

- Lazy loading slika
- CSS & JS optimizacija
- Minimalan broj HTTP zahtjeva
- Cache headers za statične resurse
- No external dependencies (pure vanilla)

## 🐛 Troubleshooting

### Email se ne šalje

1. Provjerite Brevo API ključ u Vercel environment variables
2. Pogledajte Vercel funkciju logove: `vercel logs`
3. Testirajte Brevo API direktno preko dashboard-a

### Forme spam

- Honeypot i time tracking bi trebali blokirati većinu botova
- Ako i dalje imate problema, možete dodati Google reCAPTCHA

### Slike se ne učitavaju

- Provjerite putanje do slika u `index.html`
- Budite sigurni da su slike u `public/images/` folderu
- Provjerite da imena slika odgovaraju onima u HTML-u

## 📞 Podrška

Za bilo kakva pitanja ili pomoć, kontaktirajte developera.

## 📄 Licenca

ISC License - Slobodno koristite i modificirajte za svoje potrebe.

---

**Sretno sa vašim projektom! 🚀**
