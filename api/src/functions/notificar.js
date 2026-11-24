  const { app } = require('@azure/functions');

app.http('notificar', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const body = await request.json().catch(() => ({}));
            const pagina = body.pagina || '/';
            const ip = request.headers.get('x-forwarded-for') || 'IP oculto';
            const topico = process.env.NTFY_TOPIC;

            if (!topico) {
                return { status: 500, body: 'Variavel NTFY_TOPIC nao configurada' };
            }

            await fetch(`https://ntfy.sh/${topico}`, {
                method: 'POST',
                headers: {
                    'Title': 'Novo acesso no site!',
                    'Tags': 'globe_with_meridians'
                },
                body: `Alguem acessou andersongrimaldi.cloud\nPagina: ${pagina}\nIP: ${ip}`
            });

            return { status: 200, body: 'OK' };
        } catch (error) {
            context.log('Erro:', error);
            return { status: 500, body: 'Erro interno' };
        }
    }
});
