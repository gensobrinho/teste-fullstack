import { useQuery } from "@tanstack/react-query";
import { Veiculo } from "../../../shared/types";
import { VeiculoService } from "../services";
import { VeiculoQueryEnum } from "../types/VeiculoQueryEnum";
import { ClienteService } from "../../Cliente/services";

const HOUR_IN_MILLISECONDS = 3600000;

export const useLoadVeiculo = (clienteId?: string) => {
    const { data: veiculos, isLoading: isLoadingClientes } = useQuery<Veiculo[]>({
        queryKey: [VeiculoQueryEnum.getVeiculo, clienteId],
        queryFn: () => VeiculoService.getVeiculo(clienteId),
        staleTime: HOUR_IN_MILLISECONDS,
        retry: 3,
    });

    const { data: clientes, isLoading: isLoadingVeiculos } = useQuery({
            queryKey: [VeiculoQueryEnum.getClientesVeiculo],
            queryFn: () => ClienteService.getClientes(),
            staleTime: HOUR_IN_MILLISECONDS,
            retry: 3,
        });

    return {
        dataVeiculos: veiculos ?? undefined,
        dataClientes: clientes?.itens ?? undefined,
        loading: isLoadingClientes || isLoadingVeiculos
    }
}