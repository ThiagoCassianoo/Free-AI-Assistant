import * as vscode from 'vscode';
import { UnifiedHarness } from './core/UnifiedHarness';
import { registerCommands } from './ui/commands';

export function activate(context: vscode.ExtensionContext) {
    const harness = new UnifiedHarness();
    registerCommands(context, harness);
}

export function deactivate() {}
