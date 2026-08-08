import * as vscode from 'vscode';
import { UnifiedHarness } from './backend/core/UnifiedHarness';
import { registerCommands } from './frontend/commands';
import { ChatViewProvider } from './frontend/ChatViewProvider';

export function activate(context: vscode.ExtensionContext) {
    const harness = new UnifiedHarness();
    registerCommands(context, harness);

    const provider = new ChatViewProvider(context.extensionUri, harness);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(ChatViewProvider.viewType, provider)
    );
}

export function deactivate() {}
