import * as vscode from 'vscode';
import { BrainConnector } from './BrainConnector';
import { RouterClient } from './RouterClient';

export class UnifiedHarness {
    private brainConnector: BrainConnector;
    private routerClient: RouterClient;

    constructor() {
        this.brainConnector = new BrainConnector();
        this.routerClient = new RouterClient();
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
        return this.routerClient.send(payload);
    }
}
