import { RouterConfig } from '../config/RouterConfig';

export class RouterClient {
    public async send(prompt: string): Promise<string> {
        const response = await fetch(RouterConfig.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RouterConfig.apiKey}`
            },
            body: JSON.stringify({
                model: RouterConfig.model,
                stream: false,
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!response.ok) throw new Error("9router indisponível. Verifique se está rodando.");
        const data = await response.json() as any;
        return data.choices[0].message.content;
    }
}
