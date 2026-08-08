import * as vscode from 'vscode';
import { BrainConnector } from './BrainConnector';
import { RouterConfig } from '../config/RouterConfig';

export class UnifiedHarness {
    private brainConnector: BrainConnector;

    constructor() {
        this.brainConnector = new BrainConnector();
    }

    private getActiveEditorContext(): string {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return "Nenhum arquivo aberto no momento.";
        const document = editor.document;
        const selection = editor.selection;
        const codeText = selection.isEmpty ? document.getText() : document.getText(selection);
        return `[Arquivo: ${document.fileName}]\n${codeText.slice(0, 3000)}`;
    }

    public async runTask(userPrompt: string): Promise<string> {
        const context = this.getActiveEditorContext();
        const payload = this.brainConnector.buildPayload(userPrompt, context);

        const response = await fetch(RouterConfig.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RouterConfig.apiKey}`
            },
            body: JSON.stringify({
                model: RouterConfig.model,
                stream: false,
                messages: [{ role: "user", content: payload }]
            })
        });

        if (!response.ok) throw new Error("9router indisponível. Verifique se está rodando.");
        const data = await response.json() as any;
        return data.choices[0].message.content;
    }
}
