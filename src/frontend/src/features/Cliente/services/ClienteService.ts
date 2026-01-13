import { apiDelete, apiGet, apiPost } from "../../../api";
import { Cliente, IPageResponse } from "../../../shared/types";

const BASE_URL = '/api/clientes';

interface IGetClientesParams {
    pagina?: number;
    tamanho?: number;
    filtro?: string;
    mensalista?: string;
}
export class ClienteService {
    constructor() {}

        private async _getClientes(params?: IGetClientesParams): Promise<IPageResponse<Cliente>> {
        const {
            pagina = 1,
            tamanho = 20,
            filtro = '',
            mensalista = 'all'
        } = params || {};

        const queryParams = new URLSearchParams({
            pagina: pagina.toString(),
            tamanho: tamanho.toString(),
            mensalista: mensalista,
        });

        if (filtro) {
            queryParams.append('filtro', filtro);
        }

        const res = await apiGet<IPageResponse<Cliente>>(
            `${BASE_URL}?${queryParams.toString()}`
        );
        return res;
    }

    async getClienteFiltrado(filtro: string, mensalista: string): Promise<IPageResponse<Cliente>> {
        return this._getClientes({ filtro, mensalista });
    }

    async getClientes(): Promise<IPageResponse<Cliente>> {
        return this._getClientes({ tamanho: 100 });
    }

    async createCliente(data: Partial<Cliente>) {
        const res = apiPost<Partial<Cliente>, Partial<Cliente> >(`${BASE_URL}`, data);
        return res;
    }

    async removeCliente(id: string) {
        const res = apiDelete(`${BASE_URL}/${id}`);
        return res;
    }


}

export default new ClienteService();