import * as vscode from 'vscode';
import { BrainConnector } from './BrainConnector';
import { RouterClient } from './RouterClient';
import { ProjectContext } from './ProjectContext';
import { TerminalExecutor } from './TerminalExecutor';
import { FileEditor } from './FileEditor';
import { CodeSearch } from './CodeSearch';

interface ChatTurn { role: string; content: string; }

export class UnifiedHarness {
    private brainConnector: BrainConnector;
    private routerClient: RouterClient;
    private projectContext: ProjectContext;
    public terminalExecutor: TerminalExecutor;
    public fileEditor: FileEditor;
    public codeSearch: CodeSearch;
    private history: ChatTurn[] = [];
    private projectSummaryCache: string | null = null;
    private storage: vscode.Memento;

    constructor(storage: vscode.Memento) {
        this.brainConnector = new BrainConnector();
        this.routerClient = new RouterClient();
        this.projectContext = new ProjectContext();
        this.terminalExecutor = new TerminalExecutor();
        this.fileEditor = new FileEditor();
        this.codeSearch = new CodeSearch();
        this.storage = storage;
        this.history = this.storage.get<ChatTurn[]>('chatHistory', []);
    }

    private getActiveEditorContext(): string {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return "Nenhum arquivo aberto no momento.";
        const document = editor.document;
        const selection = editor.selection;
        const codeText = selection.isEmpty ? document.getText() : document.getText(selection);
        return "[Arquivo: " + document.fileName + "]\n" + codeText.slice(0, 3000);
    }

    public async runTask(userPrompt: string): Promise<string> {
        if (!this.projectSummaryCache) {
            this.projectSummaryCache = await this.projectContext.getStructureSummary();
        }
        const editorContext = this.getActiveEditorContext();
        const fullContext = this.projectSummaryCache + "\n\n" + editorContext;

        const payload = this.brainConnector.buildPayload(userPrompt, fullContext, this.history);
        const response = await this.routerClient.send(payload);

        this.history.push({ role: 'user', content: userPrompt });
        this.history.push({ role: 'assistant', content: response });
        if (this.history.length > 12) this.history = this.history.slice(-12);

        return response;
    }
}
