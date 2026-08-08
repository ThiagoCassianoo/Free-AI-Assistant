import * as vscode from 'vscode';
import * as fs from 'fs';
import { UnifiedHarness } from '../backend/core/UnifiedHarness';

export class ChatViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'cerebroIA.chatView';

    constructor(
        private readonly extensionUri: vscode.Uri,
        private readonly harness: UnifiedHarness
    ) {}

    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = { enableScripts: true };
        const htmlPath = vscode.Uri.joinPath(this.extensionUri, 'src', 'frontend', 'chatView.html');
        webviewView.webview.html = fs.readFileSync(htmlPath.fsPath, 'utf-8');

        webviewView.webview.onDidReceiveMessage(async (msg: any) => {
            if (msg.type === 'ask') {
                try {
                    const result = await this.harness.runTask(msg.text);
                    webviewView.webview.postMessage({ type: 'response', text: result });
                } catch (error: any) {
                    webviewView.webview.postMessage({ type: 'response', text: 'Erro: ' + error.message });
                }
            }
        });
    }
}
