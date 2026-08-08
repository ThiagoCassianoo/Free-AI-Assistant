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
        return matches.length > 0 ? "Ocorrencias de \"" + term + "\":\n" + matches.join('\n') : "Nenhuma ocorrencia de \"" + term + "\" encontrada.";
    }

    public async readFile(relativePath: string): Promise<string> {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) return "Nenhum workspace aberto.";
        const uri = vscode.Uri.joinPath(folders[0].uri, relativePath);
        try {
            const bytes = await vscode.workspace.fs.readFile(uri);
            return Buffer.from(bytes).toString('utf-8').slice(0, 5000);
        } catch (error) {
            return "Arquivo nao encontrado: " + relativePath;
        }
    }
}
