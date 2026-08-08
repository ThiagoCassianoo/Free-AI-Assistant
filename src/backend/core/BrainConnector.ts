export class BrainConnector {
    private systemPrompt = `Você é um engenheiro sênior seguindo:
- Clean Architecture, SOLID, YAGNI, DRY
- Evolução cirúrgica: expanda/refatore, nunca reescreva o que já funciona
- Mobile-first como padrão de UX (thumb zone, Hick's Law, drawers)
- Explicações técnicas resumidas: só o conceitual e a lógica, sem justificar cada detalhe
- Ao errar ou travar algo: explique o problema e guie o usuário a resolver, não corrija sozinho`;

    public buildPayload(userQuery: string, activeFileCode: string): string {
        return `${this.systemPrompt}\n\n=== CONTEXTO ===\n${activeFileCode}\n\n=== PEDIDO ===\n${userQuery}`;
    }
}