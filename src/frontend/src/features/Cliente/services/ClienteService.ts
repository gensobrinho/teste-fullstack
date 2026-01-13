import { apiDelete, apiGet, apiPost } from "../../../api";
import { Cliente, IPageResponse } from "../../../shared/types";

const BASE_STRING = '/api/clientes';

export class ClienteService {
    constructor() {}

    async getCliente(filtro: string, mensalista: string) {
        const res = apiGet<IPageResponse<Cliente>>(`${BASE_STRING}?pagina=1&tamanho=20&filtro=${encodeURIComponent(filtro)}&mensalista=${mensalista}`);
        return res;
    }

    async createCliente(data: Partial<Cliente>) {
        const res = apiPost<Partial<Cliente>, Partial<Cliente> >(`${BASE_STRING}`, data);
        return res;
    }

    async removeCliente(id: string) {
        const res = apiDelete(`${BASE_STRING}/${id}`);
        return res;
    }


}

export default new ClienteService();