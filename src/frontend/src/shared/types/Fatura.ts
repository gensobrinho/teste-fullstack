import { FaturaVeiculo } from "./FaturaVeiculo";

export interface Fatura {
    id: string;
    competencia: string;
    clienteId: string;
    valor: number;
    criadaEm: Date;
    veiculos: FaturaVeiculo[];
}