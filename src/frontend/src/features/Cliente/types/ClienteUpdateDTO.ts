import { Cliente } from "../../../shared/types";

export interface ClienteUpdateDTO {
    id: string;
    data: Partial<Cliente>
}