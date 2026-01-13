export interface Cliente {
  id: string;
  nome: string;
  telefone?: string;
  endereco?: string;
  mensalista: boolean;
  valorMensalidade?: number;
}