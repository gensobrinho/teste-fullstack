import { Veiculo } from "../../../shared/types";

export interface VeiculoUpdateDTO {
    id: string;
    data: Partial<Veiculo>;
}