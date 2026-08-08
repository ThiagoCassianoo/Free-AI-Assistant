import * as vscode from 'vscode';

export class CodeSearch {
    public async grep(term: string): Promise<string> {
        const files = await vscode.workspace.findFiles(
            '**/*.{ts,js,json,md}',
            '**/{node_modules,.git,out,core,dist}/**',
            50
        );
        const matches: string[] = [];
        for (const file of files) {
            const doc = await vscode.workspace.openTextDocument(file);
            const text = doc.getText();
            if (text.includes(term)) {
                const line = text.split('\n').findIndex(l => l.includes(term));
                matches.push(vscode.workspace.asRelativePath(file) + ':' + (line + 1));
            }
            if (matches.length >= 15) break;
        }
        return matches.length > 0 ? "Ocorrências de \"" + term + "\":\n" + matches.join('\n') : "Nenhuma ocorrência de \"" + term + "\" encontrada.";
    }
}
