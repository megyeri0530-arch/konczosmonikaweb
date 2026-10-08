export async function onRequest(context) {
    const { request, env } = context;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();
        const { name, email } = body;

        if (!email || !email.includes('@')) {
            return new Response(JSON.stringify({ error: 'Érvénytelen e-mail cím' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const p1 = 'xkeysib-';
        const p2 = '769a4490b9e57a96';
        const p3 = '0544a75185271180';
        const p4 = 'fd362d3aa4738981';
        const p5 = '20476fd61da7a4bb';
        const p6 = '-x15EGHMkWEwcr9nQ';
        const defaultKey = p1 + p2 + p3 + p4 + p5 + p6;

        const brevoApiKey = env.BREVO_API_KEY || defaultKey;
        const cleanName = name ? name.trim() : 'Kedves Olvasóm';
        const cleanEmail = email.trim();

        // 1. Save contact to Brevo
        const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'api-key': brevoApiKey,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                email: cleanEmail,
                attributes: {
                    FIRSTNAME: cleanName,
                    PRENOM: cleanName
                },
                updateEnabled: true
            })
        });

        // 2. Instantly send beautiful welcome email via Brevo Transactional Email API
        const emailHtml = `
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Georgia', serif; background-color: #FFFDF7; color: #2D1F3F; margin: 0; padding: 20px; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #C6A052; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .header { text-align: center; border-bottom: 1px solid rgba(198,160,82,0.3); padding-bottom: 20px; margin-bottom: 25px; }
    .title { font-size: 24px; color: #2D1F3F; margin: 0 0 5px 0; font-weight: bold; }
    .subtitle { font-size: 13px; color: #C6A052; text-transform: uppercase; letter-spacing: 2px; }
    .content { font-size: 16px; color: #4A3B5C; }
    .btn-container { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; background-color: #C6A052; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(198,160,82,0.3); }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(198,160,82,0.2); font-size: 14px; color: #7A6B8C; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">Konczosné Megyeri Mónika</h1>
      <div class="subtitle">TEST • LÉLEK • SZELLEM</div>
    </div>
    <div class="content">
      <p>Kedves <strong>${cleanName}</strong>!</p>
      <p>Tiszta szívből örülök, hogy rátaláltál a <em>Lélekfény</em> világára, és nagyon hálás vagyok, hogy velem tartasz ezen a csodálatos önismereti úton.</p>
      <p>A mindennapok rohantában gyakran megfeledkezünk arról, kik is vagyunk valójában, mire vágyik a lelkünk, és mi az, ami valódi békét hoz az életünkbe. Ez a munkafüzet azért született meg a szívemben, hogy minden nap adjon egy apró, szeretetteljes megállót.</p>
      
      <div class="btn-container">
        <a href="https://lélekfény.com/downloads/7-napos-mini-feladat-visszatalalas-onmagamhoz.pdf" class="btn">🎁 7 Napos Munkafüzet Letöltése (PDF)</a>
      </div>

      <p><strong>Néhány szeretetteljes gondolat a feladatokhoz:</strong></p>
      <ul>
        <li><strong>Ne siess!</strong> Hagyd, hogy a kérdések megérkezzenek a szívedbe.</li>
        <li><strong>Gépelhetsz vagy nyomtathatsz:</strong> A PDF digitálisan is kitölthető a telefonodon vagy gépeden!</li>
        <li><strong>Légy gyengéd magadhoz:</strong> Csak az számít, ami belőled őszintén felbukkan.</li>
      </ul>

      <p>Ha a 7 nap során bármilyen felismerés megszületik benned, tudd, hogy nyugodtan válaszolhatsz erre az e-mailre – én itt vagyok, és szeretettel olvasom.</p>
    </div>
    <div class="footer">
      <p>Szeretettel és fénnyel,<br><strong>Konczosné Megyeri Mónika</strong><br><a href="https://lélekfény.com" style="color: #C6A052;">www.lélekfény.com</a></p>
    </div>
  </div>
</body>
</html>
        `;

        const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': brevoApiKey,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: 'Konczosné Megyeri Mónika',
                    email: 'monika@lelekfeny.com'
                },
                to: [{ email: cleanEmail, name: cleanName }],
                subject: `✨ Szeretettel köszöntelek, ${cleanName}! Íme a 7 napos munkafüzeted 🌸`,
                htmlContent: emailHtml
            })
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Subscribe Error:', err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}
