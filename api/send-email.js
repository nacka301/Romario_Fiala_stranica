// Vercel Serverless Function - Email Handler with Brevo (Sendinblue)
// API Route: /api/send-email

const SibApiV3Sdk = require('sib-api-v3-sdk');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const { name, email, phone, service, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Molimo popunite sva obavezna polja.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Neispravna email adresa.' });
        }

        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'romario.fiala@gmail.com';

        if (!apiKey.apiKey) {
            console.error('BREVO_API_KEY is not set');
            return res.status(500).json({ message: 'Email konfiguracija nije ispravna.' });
        }

        const escapeHtml = (text) => {
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return text.replace(/[&<>"']/g, m => map[m]);
        };

        const safe = (v) => v ? escapeHtml(String(v)) : '';
        const safeName = safe(name);
        const safeEmail = safe(email);
        const safePhone = phone ? safe(phone) : 'Nije navedeno';
        const safeMessage = safe(message);
        const safeService = service ? safe(service) : 'Opći upit';

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.to = [{ email: RECIPIENT_EMAIL, name: 'Fiala Mont' }];
        sendSmtpEmail.sender = { email: 'romario.fiala@gmail.com', name: 'Fiala Mont Web Forma' };
        sendSmtpEmail.replyTo = { email: email, name: name };
        sendSmtpEmail.subject = `Novi upit sa web stranice - ${safeService}`;
        sendSmtpEmail.htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #8B4513; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f8f8f8; padding: 20px; border-radius: 0 0 5px 5px; margin-top: 20px; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #8B4513; }
                    .value { margin-top: 5px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Novi upit sa web stranice</h1>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="label">Ime i prezime:</div>
                            <div class="value">${safeName}</div>
                        </div>
                        <div class="field">
                            <div class="label">Email:</div>
                            <div class="value"><a href="mailto:${email}">${safeEmail}</a></div>
                        </div>
                        <div class="field">
                            <div class="label">Telefon:</div>
                            <div class="value">${safePhone}</div>
                        </div>
                        ${service ? `
                        <div class="field">
                            <div class="label">Usluga:</div>
                            <div class="value">${safeService}</div>
                        </div>
                        ` : ''}
                        <div class="field">
                            <div class="label">Poruka:</div>
                            <div class="value">${safeMessage.replace(/\n/g, '<br>')}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Ova poruka je poslana putem kontakt forme na stranici Fiala Mont</p>
                        <p>Datum: ${new Date().toLocaleString('hr-HR')}</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        sendSmtpEmail.textContent = `Novi upit sa web stranice - ${safeService}

Ime i prezime: ${name}
Email: ${email}
Telefon: ${phone || 'Nije navedeno'}
${service ? `Usluga: ${service}` : ''}

Poruka:
${message}

---
Poslano: ${new Date().toLocaleString('hr-HR')}`;

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        
        console.log('Email sent successfully:', result);

        return res.status(200).json({ message: 'Email uspješno poslan!', messageId: result.messageId });

    } catch (error) {
        console.error('Error:', error);
        console.error('Response:', error.response);
        return res.status(500).json({ message: 'Greška prilikom slanja emaila.', debug: error.message });
    }
};
