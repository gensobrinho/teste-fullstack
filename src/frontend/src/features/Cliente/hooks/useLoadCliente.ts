import { useQuery } from "@tanstack/react-query"
import { ClienteQueryEnum } from "../types/ClienteQueryEnum"
import { ClienteService } from "../services"

const HOUR_IN_MILLISECONDS = 3600000;

export const useLoadCliente = ( filtro: string, mensalista: string ) => {
    const { data, isLoading } = useQuery({
        queryKey: [ClienteQueryEnum.getCliente],
        queryFn: () => ClienteService.getCliente(filtro, mensalista),
        staleTime: HOUR_IN_MILLISECONDS,
        retry: 3,
    });

    return {
        data: data ?? undefined,
        loading: isLoading
    }
}