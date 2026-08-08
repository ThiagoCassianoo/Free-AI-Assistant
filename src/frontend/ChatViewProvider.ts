import * as vscode from 'vscode';
import * as fs from 'fs';
import { UnifiedHarness } from '../backend/core/UnifiedHarness';

const logChannel = vscode.window.createOutputChannel('Cérebro IA - Logs');

export class ChatViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'cerebroIA.chatView';

    constructor(
        private readonly extensionUri: vscode.Uri,
        private readonly harness: UnifiedHarness
    ) {}

    resolveWebviewView(webviewView: vscode.WebviewView) {
        const startOpen = Date.now();
        webviewView.webview.options = { enableScripts: true };
        const htmlPath = vscode.Uri.joinPath(this.extensionUri, 'src', 'frontend', 'chatView.html');
        webviewView.webview.html = fs.readFileSync(htmlPath.fsPath, 'utf-8');
        logChannel.appendLine(`[ABRIR] Sidebar carregada em ${Date.now() - startOpen}ms`);
        logChannel.show(true);

        webviewView.webview.onDidReceiveMessage(async (msg: any) => {
            if (msg.type === 'jserror') {
                logChannel.appendLine(`[ERRO JS] ${msg.text}`);
                vscode.window.showErrorMessage('Erro no chat: ' + msg.text);
                return;
            }
            if (msg.type === 'runCommand') {
                await this.harness.terminalExecutor.runWithConfirmation(msg.command);
                return;
            }
            if (msg.type === 'writeFile') {
                await this.harness.fileEditor.writeFile(msg.path, msg.content);
                return;
            }
            if (msg.type === 'ask') {
                const start = Date.now();
                logChannel.appendLine(`[PERGUNTA] "${msg.text}"`);
                try {
                    const result = await this.harness.runTask(msg.text);
                    const elapsed = Date.now() - start;
                    logChannel.appendLine(`[RESPOSTA] recebida em ${elapsed}ms`);
                    webviewView.webview.postMessage({ type: 'response', text: result });
                } catch (error: any) {
                    const elapsed = Date.now() - start;
                    logChannel.appendLine(`[ERRO] falhou em ${elapsed}ms: ${error.message}`);
                    webviewView.webview.postMessage({ type: 'response', text: 'Erro: ' + error.message });
                }
            }
        });
    }
}
