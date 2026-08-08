import * as vscode from 'vscode';
import { UnifiedHarness } from './backend/core/UnifiedHarness';
import { registerCommands } from './frontend/commands';

export function activate(context: vscode.ExtensionContext) {
    const harness = new UnifiedHarness();
    registerCommands(context, harness);
}

export function deactivate() {}
