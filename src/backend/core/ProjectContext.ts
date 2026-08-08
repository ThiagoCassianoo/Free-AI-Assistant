import * as vscode from 'vscode';

export class ProjectContext {
    public async getStructureSummary(): Promise<string> {
        const files = await vscode.workspace.findFiles(
            '**/*',
            '**/{node_modules,.git,out,core,dist}/**',
            200
        );
        if (files.length === 0) return "Nenhum arquivo de projeto encontrado.";
        const relativePaths = files.map(f => vscode.workspace.asRelativePath(f)).sort();
        return `Arquivos do repositório atual (${relativePaths.length}):\n${relativePaths.join('\n')}`;
    }
}
