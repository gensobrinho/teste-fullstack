import { apiGet, apiPost } from "../../../api";
import { FaturamentoRequestDTO } from "../types/FaturamentoRequestDTO";
import { FaturamentoResponseDTO } from "../types/FaturamentoResponseDTO";

const BASE_URL = '/api/faturas'

class FaturamentoService {
    constructor(){}

    async getFaturas(comp: string){
        const res = apiGet<FaturamentoResponseDTO[]>(`${BASE_URL}/?competencia=${comp}`);
        return res;
    }

    async generateFatura(dto: FaturamentoRequestDTO){
        const res = apiPost<{ criadas: number }, FaturamentoRequestDTO>(`${BASE_URL}/gerar`, dto);
        return res;
    }

    async getPlaca(id: string | null) {
        if (!id) {
            return [];
        }
        const res = apiGet<string[]>(`${BASE_URL}/${id}/placas`);
        return res;
    }


}

export default new FaturamentoService();