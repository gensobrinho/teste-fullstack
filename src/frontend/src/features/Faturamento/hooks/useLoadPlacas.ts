import { useQuery } from "@tanstack/react-query";
import { FaturamentoQueryEnum } from "../types/FaturamentoQueryEnum";
import FaturamentoService from "../services/FaturamentoService";

const HOUR_IN_MILLISECONDS = 3600000;

export const useLoadPlacas = (faturaId: string | null) => {
    const { data: placas, isLoading } = useQuery({
        queryKey: [FaturamentoQueryEnum.getPlacas, faturaId],
        queryFn: () => FaturamentoService.getPlaca(faturaId!),
        enabled: !!faturaId, // Só executa quando tem um ID válido
        staleTime: HOUR_IN_MILLISECONDS,
        retry: 3,
    });

    return {
        placasData: placas ?? undefined,
        isLoading,
    }
}