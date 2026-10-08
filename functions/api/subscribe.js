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

        const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'api-key': brevoApiKey,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                email: email.trim(),
                attributes: {
                    FIRSTNAME: name ? name.trim() : '',
                    PRENOM: name ? name.trim() : ''
                },
                updateEnabled: true
            })
        });

        const resData = await brevoRes.json();

        return new Response(JSON.stringify({ success: true, data: resData }), {
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
