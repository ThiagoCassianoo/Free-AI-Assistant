import { RouterConfig } from '../config/RouterConfig';

export class RouterClient {
    private lastHealthCheck = 0;
    private healthy = false;

    private async checkHealth(): Promise<boolean> {
        const now = Date.now();
        if (now - this.lastHealthCheck < 30000) return this.healthy;
        const healthUrl = RouterConfig.baseUrl.replace('/v1/chat/completions', '/health');
        const health = await fetch(healthUrl).catch(function () { return null; });
        this.healthy = health !== null && health.ok === true;
        this.lastHealthCheck = now;
        return this.healthy;
    }

    public async send(prompt: string): Promise<string> {
        const ok = await this.checkHealth();
        if (!ok) throw new Error("9router indisponivel (falha na checagem de saude).");

        const response = await fetch(RouterConfig.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + RouterConfig.apiKey
            },
            body: JSON.stringify({
                model: RouterConfig.model,
                stream: false,
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!response.ok) throw new Error("9router indisponivel. Verifique se esta rodando.");
        const data = await response.json() as any;
        return data.choices[0].message.content;
    }
}
