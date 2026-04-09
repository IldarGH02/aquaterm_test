import { buildApp } from './app';

let app: any = null;

export default async function handler(req: any, res: any) {
    if (!app) {
        app = await buildApp({
            enableTelegramWorker: false
        });
        await app.ready();
    }

    const response = await app.inject({
        method: req.method,
        url: req.url,
        headers: req.headers,
        payload: req.body,
        query: req.query,
    });

    res.status(response.statusCode);
    Object.entries(response.headers).forEach(([key, value]) => {
        if (value) res.setHeader(key, value as string);
    });
    res.send(response.payload);
}