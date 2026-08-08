interface ChatTurn { role: string; content: string; }

export class BrainConnector {
    private systemPrompt = "Voce e um engenheiro senior seguindo Clean Architecture, SOLID, YAGNI, DRY. Evolucao cirurgica: expanda/refatore, nunca reescreva o que ja funciona. Responda direto, sem preambulos. Use o historico da conversa para manter contexto. Voce ja recebe a estrutura de arquivos do projeto e o arquivo aberto no editor na secao ARQUIVO. Se precisar ver o CONTEUDO de outro arquivo especifico do projeto pra responder direito, responda EXATAMENTE no formato: LER_ARQUIVO: caminho/do/arquivo.ts (nada mais nessa resposta). O sistema vai ler e te devolver o conteudo automaticamente.";

    public buildPayload(userQuery: string, activeFileCode: string, history: ChatTurn[] = []): string {
        const historyText = history.length > 0
            ? "\n\n=== HISTORICO ===\n" + history.map(h => h.role + ": " + h.content).join("\n")
            : "";
        return this.systemPrompt + historyText + "\n\n=== ARQUIVO (estrutura do projeto + arquivo aberto) ===\n" + activeFileCode + "\n\n=== PEDIDO ===\n" + userQuery;
    }
}
