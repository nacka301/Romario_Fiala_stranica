// Vercel Serverless Function - Email Handler with Brevo (Sendinblue)
// API Route: /api/send-email

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // CORS headers (optional, for additional security)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const { name, email, phone, service, message } = req.body;

        // Server-side validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                message: 'Molimo popunite sva obavezna polja.' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Neispravna email adresa.' 
            });
        }

        // Get Brevo API key from environment variable
        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        const RECIPIENT_EMAIL = 'vackadavid@gmail.com';

        if (!BREVO_API_KEY) {
            console.error('BREVO_API_KEY is not set');
            return res.status(500).json({ 
                message: 'Email konfiguracija nije ispravna. Kontaktirajte nas telefonom.' 
            });
        }

        // Prepare email content
        const emailContent = {
            sender: {
                name: 'Fial Mont Web Forma',
                email: 'noreply@fialmont.hr'
            },
            to: [
                {
                    email: RECIPIENT_EMAIL,
                    name: 'Fial Mont'
                }
            ],
            subject: `Novi upit sa web stranice - ${service || 'Opći upit'}`,
            htmlContent: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #8B4513; color: white; padding: 20px; text-align: center; }
                        .content { background: #f8f8f8; padding: 20px; border-radius: 5px; margin-top: 20px; }
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
                                <div class="value">${name}</div>
                            </div>
                            <div class="field">
                                <div class="label">Email:</div>
                                <div class="value"><a href="mailto:${email}">${email}</a></div>
                            </div>
                            ${phone ? `
                            <div class="field">
                                <div class="label">Telefon:</div>
                                <div class="value"><a href="tel:${phone}">${phone}</a></div>
                            </div>
                            ` : ''}
                            ${service ? `
                            <div class="field">
                                <div class="label">Usluga:</div>
                                <div class="value">${service}</div>
                            </div>
                            ` : ''}
                            <div class="field">
                                <div class="label">Poruka:</div>
                                <div class="value">${message.replace(/\n/g, '<br>')}</div>
                            </div>
                        </div>
                        <div class="footer">
                            <p>Ova poruka je poslana putem kontakt forme na stranici Fial Mont</p>
                            <p>Datum: ${new Date().toLocaleString('hr-HR')}</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            textContent: `
Novi upit sa web stranice - ${service || 'Opći upit'}

Ime i prezime: ${name}
Email: ${email}
${phone ? `Telefon: ${phone}` : ''}
${service ? `Usluga: ${service}` : ''}

Poruka:
${message}

---
Poslano: ${new Date().toLocaleString('hr-HR')}
            `.trim(),
            replyTo: {
                email: email,
                name: name
            }
        };

        // Send email via Brevo API
        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify(emailContent)
        });

        if (!brevoResponse.ok) {
            const errorData = await brevoResponse.json();
            console.error('Brevo API error:', errorData);
            throw new Error('Failed to send email');
        }

        const result = await brevoResponse.json();
        console.log('Email sent successfully:', result);

        // Success response
        return res.status(200).json({ 
            message: 'Email uspješno poslan!',
            messageId: result.messageId 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ 
            message: 'Greška prilikom slanja emaila. Pokušajte ponovo ili nas kontaktirajte telefonom.' 
        });
    }
}
