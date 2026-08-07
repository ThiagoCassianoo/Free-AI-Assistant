import * as vscode from 'vscode';
import { BrainConnector } from './BrainConnector';

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

        const response = await fetch("http://localhost:20128/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [{ role: "user", content: payload }] })
        });

        if (!response.ok) throw new Error("9router indisponível. Verifique se está rodando (npm start).");
        const data = await response.json() as any;
        return data.choices[0].message.content;
    }
}