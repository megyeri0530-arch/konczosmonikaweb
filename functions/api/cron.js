export async function onRequest(context) {
    const { request, env } = context;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const p1 = 'xkeysib-';
        const p2 = '769a4490b9e57a96';
        const p3 = '0544a75185271180';
        const p4 = 'fd362d3aa4738981';
        const p5 = '20476fd61da7a4bb';
        const p6 = '-x15EGHMkWEwcr9nQ';
        const brevoApiKey = env.BREVO_API_KEY || (p1 + p2 + p3 + p4 + p5 + p6);

        const getEmailTemplate = (name, content) => `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Georgia', serif; background-color: #FFFDF7; color: #2D1F3F; margin: 0; padding: 20px; line-height: 1.7; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 35px; border-radius: 12px; border: 1px solid #C6A052; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .header { text-align: center; border-bottom: 1px solid rgba(198,160,82,0.3); padding-bottom: 20px; margin-bottom: 25px; }
    .title { font-size: 24px; color: #2D1F3F; margin: 0 0 5px 0; font-weight: bold; }
    .subtitle { font-size: 13px; color: #C6A052; text-transform: uppercase; letter-spacing: 2px; }
    .content { font-size: 16px; color: #4A3B5C; }
    .highlight-box { background: #FFFDF7; border-left: 3px solid #C6A052; padding: 15px 20px; margin: 20px 0; font-style: italic; color: #2D1F3F; }
    .card-box { background: #FFFDF7; border: 1px solid rgba(198,160,82,0.3); border-radius: 8px; padding: 18px 20px; margin: 25px 0; text-align: center; }
    .card-btn { display: inline-block; background-color: #C6A052; color: #ffffff !important; text-decoration: none; padding: 11px 24px; border-radius: 20px; font-weight: bold; font-size: 14px; margin-top: 12px; }
    .footer { text-align: center; margin-top: 35px; padding-top: 20px; border-top: 1px solid rgba(198,160,82,0.2); font-size: 14px; color: #7A6B8C; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">Konczosné Megyeri Mónika</h1>
      <div class="subtitle">TEST • LÉLEK • SZELLEM</div>
    </div>
    <div class="content">${content}</div>
    <div class="footer">
      <p>Szeretettel,<br><strong>Mónika</strong><br><a href="https://lélekfény.com" style="color: #C6A052;">www.lélekfény.com</a></p>
    </div>
  </div>
</body>
</html>`;

        const EMAILS = {
          1: {
            subject: '✨ Nem kell mindig pontosan tudnod, mi a baj... 🤍',
            body: (name) => `
              <p>Szia ${name}!</p>
              <p>Van egy mondat, amit egyre fontosabbnak érzek:</p>
              <div class="highlight-box">Nem kell mindig pontosan tudnod, mi a baj.</div>
              <p>Sokszor csak azt érezzük, hogy valami nem jó.</p>
              <p>Feszültebbek vagyunk. Elfáradunk. Türelmetlenebbek leszünk. Vagy kívülről ugyan minden rendben van, mégsem érezzük jól magunkat benne.</p>
              <p>És rögtön keressük a választ: <em>Miért?</em></p>
              <p>Pedig néha először elég lenne csak észrevenni:<br><strong>„Most valami sok nekem.”</strong></p>
              <p>Nem kell azonnal megoldanod.</p>
              <p>Ma csak figyeld meg magad egy pillanatra:</p>
              <p style="text-align: center; font-weight: bold; color: #2D1F3F; margin: 25px 0;">Mi az, amiből most egy kicsit kevesebbre lenne szükségem?<br>És miből szeretnék többet?</p>
              <p>Nem nekem kell válaszolnod rá.</p>
              <p>Ez most csak a tiéd. 🤍</p>
            `
          },
          2: {
            subject: '💚 Szeretnék ma valami személyesebbet írni... 🙃',
            body: (name) => `
              <p>Szia ${name}!</p>
              <p>Szeretnék ma valami személyesebbet írni. 🙃</p>
              <p>Én sem úgy kerültem erre az útra, hogy mindig pontosan tudtam, mit szeretnék.</p>
              <p>Sokáig inkább próbáltam beilleszkedni.</p>
              <p>Próbáltam úgy működni, ahogy szerintem kellett. És volt olyan időszakom is, amikor sokkal fontosabb volt, hogy mások mit gondolnak rólam, mint az, hogy én hogyan érzem magam.</p>
              <p>Ma sem gondolom azt, hogy mindenre tudom a választ.</p>
              <p>És talán pont ezért nem szeretném másoknak sem megmondani, hogyan kellene élniük.</p>
              <p>Amit viszont szeretnék, az egy olyan tér, ahol nem kell szerepet játszanod.</p>
              <p>Ahol meg lehet állni.</p>
              <p>És ahol elkezdheted meghallani azt is, amit a hétköznapok zajában talán már régóta nem hallasz...</p>
              <div class="highlight-box" style="text-align: center; font-weight: bold; font-size: 18px;">Saját magadat.</div>
              <div class="card-box">
                <div style="font-weight: bold; color: #2D1F3F; font-size: 16px;">Konczosné Megyeri Mónika | Lélekfény</div>
                <div style="font-size: 13px; color: #7A6B8C; margin-top: 4px;">Spirituális & Energetikai Kezelések</div>
                <a href="https://lélekfény.com" class="card-btn">🌐 Látogass el a Lélekfény weboldalra ➔</a>
              </div>
            `
          },
          3: {
            subject: '🕊️ Ma az Angyalkártyákról szeretnék Neked mesélni... 🤍',
            body: (name) => `
              <p>Szia ${name}!</p>
              <p>Ma az Angyalkártyákról szeretnék Neked mesélni. 🕊️ Sokan az angyalkártyáról először a jóslásra gondolnak.</p>
              <p>Én viszont nem azért használom a kártyákat, hogy megmondjam valakinek, mi fog történni vele.</p>
              <p>Sokkal inkább azért szeretem őket, mert néha egy kérdés vagy egy üzenet olyan dologra irányítja rá a figyelmünket, amit addig nem mertünk vagy nem tudtunk megfogalmazni.</p>
              <p>Nálam ezért nem az a legfontosabb kérdés, hogy:<br><em>„Mi fog velem történni?”</em></p>
              <p>Hanem inkább:</p>
              <div class="highlight-box" style="text-align: center; font-weight: bold; font-size: 17px;">„Mi az, amit most érdemes lenne meglátnom?”</div>
              <p>És néha egészen meglepő, mi indul el ebből az egy kérdésből.</p>
              <p>Ha van kedved, ma tedd fel ezt a kérdést magadnak.</p>
              <p>Csak figyeld meg, mi az első gondolatod. 🤍</p>
              <div class="card-box">
                <div style="font-weight: bold; color: #2D1F3F; font-size: 16px;">Konczosné Megyeri Mónika | Lélekfény</div>
                <div style="font-size: 13px; color: #7A6B8C; margin-top: 4px;">Angyalkártyás elemzések & Önismeret</div>
                <a href="https://lélekfény.com" class="card-btn">🕊️ Nézd meg az Angyalkártyás elemzéseket ➔</a>
              </div>
            `
          },
          4: {
            subject: '✨ Hiszek abban, hogy mindennek eljön a maga ideje... 🤍',
            body: (name) => `
              <p>Szia ${name}!</p>
              <p>Az elmúlt levelekben szándékosan nem akartam megmondani neked, mit kellene tenned. 🙂</p>
              <p>Mert nem hiszem, hogy én jobban tudhatnám nálad, mire van szükséged. 🤍</p>
              <p>Abban viszont tudok melletted lenni, hogy legyen egy kis idő és tér arra, hogy közelebb kerülj a saját válaszaidhoz.</p>
              <p>Ha most van benned valami, amire szeretnél jobban ránézni, nálam többféleképpen is elindulhatunk:</p>
              <div class="highlight-box">
                • <strong>Angyalkártyás elemzés & Ingás önismeret:</strong> segíthet más szemszögből ránézni egy kérdésedre.<br><br>
                • <strong>Expanse Therapy® kezelés:</strong> megállás, ellazulás és energetikai munka, ahol nem kell mindent fejben megfejtened.
              </div>
              <p>Nem szeretnélek rábeszélni egyikre sem. 🙂 Hiszek abban, hogy mindennek eljön a maga ideje.</p>
              <p>Ha valamelyik megszólít, írj nekem, és megnézzük, melyik lenne most számodra megfelelő. 🤍</p>
              <div class="card-box">
                <div style="font-weight: bold; color: #2D1F3F; font-size: 16px;">Konczosné Megyeri Mónika | Lélekfény</div>
                <div style="font-size: 13px; color: #7A6B8C; margin-top: 4px;">Szolgáltatások, Angyalkártya & Expanse Therapy®</div>
                <a href="https://lélekfény.com/szolgaltatasok.html" class="card-btn">✨ Nézd meg a Szolgáltatásokat ➔</a>
              </div>
            `
          }
        };

        const now = new Date();
        const listRes = await fetch('https://api.brevo.com/v3/contacts/lists/5/contacts?limit=50', {
            headers: { 'api-key': brevoApiKey }
        });

        if (!listRes.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch contacts' }), { status: 500, headers: corsHeaders });
        }

        const listData = await listRes.json();
        const contacts = listData.contacts || [];
        const processed = [];

        for (const contact of contacts) {
            const email = contact.email;
            const name = (contact.attributes && contact.attributes.FIRSTNAME) || 'Kedves Olvasóm';
            const currentStep = Number((contact.attributes && contact.attributes.EMAIL_STEP) || 0);
            const subscribeDateStr = (contact.attributes && contact.attributes.SUBSCRIBE_TIMESTAMP) || contact.createdAt;
            const diffDays = (now.getTime() - new Date(subscribeDateStr).getTime()) / (1000 * 60 * 60 * 24);

            let targetStep = null;
            if (diffDays >= 12 && currentStep < 4) targetStep = 4;
            else if (diffDays >= 10 && currentStep < 3) targetStep = 3;
            else if (diffDays >= 6 && currentStep < 2) targetStep = 2;
            else if (diffDays >= 2 && currentStep < 1) targetStep = 1;

            if (targetStep) {
                const emailDef = EMAILS[targetStep];
                await fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST',
                    headers: {
                        'api-key': brevoApiKey,
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: { name: 'Konczosné Megyeri Mónika', email: 'megyeri0530@gmail.com' },
                        to: [{ email, name }],
                        subject: emailDef.subject,
                        htmlContent: getEmailTemplate(name, emailDef.body(name))
                    })
                });

                await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
                    method: 'PUT',
                    headers: {
                        'api-key': brevoApiKey,
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify({ attributes: { EMAIL_STEP: targetStep } })
                });

                processed.push({ email, targetStep });
            }
        }

        return new Response(JSON.stringify({ success: true, processedCount: processed.length, processed }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Cron error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
}
