export interface Fatura {
    id: string;
    competencia: string;
    clienteId: string;
    valor: number;
    criadaEm: Date;
    observacao?: string;
}