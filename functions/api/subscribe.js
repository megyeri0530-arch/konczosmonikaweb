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

        const mailerliteToken = env.MAILERLITE_API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYTU5YmI2MTNkZDMyNzUwMTk3ZTNjZjBhOTYyZGU3ZDI2YmYwNjk0ZTE3Mjk4M2NlYWU5ZjRhN2EzZmYxNzJmMzllZDUzY2Q4YzY2MThlYzMiLCJpYXQiOjE3OTEzMjI3NDYuMTA4MDI4LCJuYmYiOjE3OTEzMjI3NDYuMTA4MDMxLCJleHAiOjQ5NDY5OTYzNDYuMTAzODg1LCJzdWIiOiIyNzA5NzAyIiwic2NvcGVzIjpbXX0.wEpPA-0_btHxqYnMPTOQs4DDpsfAh2Y127YyY7o7OnbZ7QY3weTQyLWs3eP69GGZ4DwkVShCe6_6f4fTt27FCIbLGzQNPu1Q46eRFqS0X096-wioGZP1EiLxXsaHIwVtKqZNeXsrNCMkGLcCrWwI27Vq7PtZgbW1LrAtJmTkRU9_me-VjKGHJCavkFtr3co3hnbFJDe4YwkAbyOizkKq7QOIUwZa6SjQ396D8eaLGjGnk2QHIy3EDM5nw6RgEGMid0bHDcdAmtAIRVk8GbgksTtPJFM6yApQG3mTcwul8_5Jy6CG1yXOj2pRSyy3gDfECgIgsFqJmdxgyVmi23ER8p5N1dYNx4ngkeS910KZBO9QlgEe47W6OwIWF4ei1x4Al5GataAusAEaKFYZuraM-J_JK-D6hB-uRce2Gc3IJ5OtYqYvzV9rV3xqpC9AhAVpxOw2vJHf35_id-xeMxrqT2k4rsgHrfzFSV0Rt_VuFSti7zpq9F_NeZJibyoeE84Vh77WA0aw6Twf3SeoPAnmtxxkKA9yKzghB35DsMHDM80ixNP9ojuBblWr7sQcJ8UB4SCyXOjsjRRF9ttuYR0pyrsSUm0z7mhqF4MqVyWxk5HsdqJ2Z5lBeLRRsAVwUy9Q99f92rwfIrRx_hwinwGBXiBXdT-op__twcHajtljDkM';

        const mailerliteRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${mailerliteToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email.trim(),
                fields: {
                    name: name ? name.trim() : ''
                },
                groups: ['200616525119358796'], // Lélekfény Munkafüzet Feliratkozók group
                status: 'active'
            })
        });

        const resData = await mailerliteRes.json();

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
