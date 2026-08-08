interface ChatTurn { role: string; content: string; }

export class BrainConnector {
    private systemPrompt = "Voce e um engenheiro senior seguindo Clean Architecture, SOLID, YAGNI, DRY. Evolucao cirurgica: expanda/refatore, nunca reescreva o que ja funciona. Responda direto, sem preambulos. Use o historico da conversa para manter contexto.";

    public buildPayload(userQuery: string, activeFileCode: string, history: ChatTurn[] = []): string {
        const historyText = history.length > 0
            ? "\n\n=== HISTORICO ===\n" + history.map(h => h.role + ": " + h.content).join("\n")
            : "";
        return this.systemPrompt + historyText + "\n\n=== ARQUIVO ===\n" + activeFileCode + "\n\n=== PEDIDO ===\n" + userQuery;
    }
}
