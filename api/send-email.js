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

        const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'vackadavid@gmail.com';

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
        sendSmtpEmail.to = [{ email: RECIPIENT_EMAIL, name: 'Fial Mont' }];
        sendSmtpEmail.sender = { email: 'vackadavid@gmail.com', name: 'Fial Mont Web Forma' };
        sendSmtpEmail.replyTo = { email: email, name: name };
        sendSmtpEmail.subject = `Novi upit sa web stranice - ${safeService}`;
        sendSmtpEmail.htmlContent = `<html><body style="font-family: Arial;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: #8B4513; color: white; padding: 20px; text-align: center;"><h1>Novi upit</h1></div><div style="background: #f8f8f8; padding: 20px; margin-top: 20px;"><p><strong>Ime:</strong> ${safeName}</p><p><strong>Email:</strong> <a href="mailto:${email}">${safeEmail}</a></p><p><strong>Telefon:</strong> ${safePhone}</p>${service ? `<p><strong>Usluga:</strong> ${safeService}</p>` : ''}<p><strong>Poruka:</strong></p><p>${safeMessage.replace(/\n/g, '<br>')}</p></div><div style="text-align: center; margin-top: 20px; color: #666;"><p>Poslano: ${new Date().toLocaleString('hr-HR')}</p></div></div></body></html>`;
        sendSmtpEmail.textContent = `Novi upit\n\nIme: ${name}\nEmail: ${email}\nTelefon: ${phone || 'Nije navedeno'}\n${service ? `Usluga: ${service}\n` : ''}\nPoruka:\n${message}\n\nPoslano: ${new Date().toLocaleString('hr-HR')}`;

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
