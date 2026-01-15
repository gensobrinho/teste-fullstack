import { apiDelete, apiGet, apiPost, apiPut } from "../../../api";
import { Veiculo } from "../../../shared/types";
import { VeiculoUpdateDTO } from "../types/VeiculoUpdateDTO";

const BASE_STRING = '/api/veiculos';

export class VeiculoService {
    constructor() {}

    async getVeiculo(clienteId?: string): Promise<Veiculo[]> {
        const url = clienteId 
            ? `${BASE_STRING}?clienteId=${clienteId}`
            : BASE_STRING;
        const res = await apiGet<Veiculo[]>(url);
        return res;
    }

    async createVeiculo(data: Partial<Veiculo>): Promise<Veiculo> {
        const res = await apiPost<Veiculo, Partial<Veiculo>>(BASE_STRING, data);
        return res;
    }

    async updateVeiculo(body: VeiculoUpdateDTO): Promise<Veiculo> {
        const res = await apiPut<Veiculo, Partial<Veiculo>>(`${BASE_STRING}/${body.id}`, body.data);
        return res;
    }

    async removeVeiculo(id: string): Promise<string> {
        const res = await apiDelete(`${BASE_STRING}/${id}`);
        return res;
    }
}

export default new VeiculoService();