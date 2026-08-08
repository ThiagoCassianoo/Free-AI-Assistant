import * as vscode from 'vscode';
import { UnifiedHarness } from '../backend/core/UnifiedHarness';

export function registerCommands(context: vscode.ExtensionContext, harness: UnifiedHarness) {
    let askCommand = vscode.commands.registerCommand('meu-copilot.perguntar', async () => {
        const input = await vscode.window.showInputBox({
            prompt: "O que o Cérebro de IA deve fazer?",
            placeHolder: "Ex: Refatore a função para tratar erros"
        });
        if (!input) return;
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Cérebro pensando (Roteando IAs)...",
            cancellable: false
        }, async () => {
            try {
                const result = await harness.runTask(input);
                const doc = await vscode.workspace.openTextDocument({ content: result, language: 'markdown' });
                await vscode.window.showTextDocument(doc);
            } catch (error: any) {
                vscode.window.showErrorMessage(error.message);
            }
        });
    });
    context.subscriptions.push(askCommand);
}
