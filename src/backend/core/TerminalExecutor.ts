import * as vscode from 'vscode';

export class TerminalExecutor {
    private terminal: vscode.Terminal | null = null;

    private getTerminal(): vscode.Terminal {
        if (!this.terminal || this.terminal.exitStatus !== undefined) {
            this.terminal = vscode.window.createTerminal('Cérebro IA - Execução');
        }
        return this.terminal;
    }

    public async runWithConfirmation(command: string): Promise<boolean> {
        const choice = await vscode.window.showWarningMessage(
            'Executar no terminal: "' + command + '" ?',
            'Executar',
            'Cancelar'
        );
        if (choice !== 'Executar') return false;
        const term = this.getTerminal();
        term.show();
        term.sendText(command);
        return true;
    }
}
