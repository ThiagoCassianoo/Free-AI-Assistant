import * as vscode from 'vscode';

export class FileEditor {
    public async writeFile(relativePath: string, content: string): Promise<boolean> {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) return false;
        const uri = vscode.Uri.joinPath(folders[0].uri, relativePath);
        const choice = await vscode.window.showWarningMessage(
            'Criar/editar arquivo: ' + relativePath + ' ?',
            'Aplicar', 'Cancelar'
        );
        if (choice !== 'Aplicar') return false;
        await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf-8'));
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
        return true;
    }
}
