export interface IPageResponse<T> {
    itens: T[];
    total: number;
    pagina: number;
    tamanho: number;
}