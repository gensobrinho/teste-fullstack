import { useQuery } from "@tanstack/react-query";
import { FaturamentoQueryEnum } from "../types/FaturamentoQueryEnum";
import FaturamentoService from "../services/FaturamentoService";

const HOUR_IN_MILLISECONDS = 3600000;

export const useLoadFaturamento = (comp: string, id: string | null) => {
  const {
    data: faturas,
    isLoading: isLoadingFaturas,
    refetch: refetchFaturas,
  } = useQuery({
    queryKey: [FaturamentoQueryEnum.getFatura, comp],
    queryFn: () => FaturamentoService.getFaturas(comp),
    staleTime: HOUR_IN_MILLISECONDS,
    retry: 3,
  });

  const {
    data: placas,
    isLoading: isLoadingPlacas,
  } = useQuery({
    queryKey: [FaturamentoQueryEnum.getPlacas, id],
    queryFn: () => FaturamentoService.getPlaca(id!),
    enabled: !!id,
    staleTime: HOUR_IN_MILLISECONDS,
    retry: 3,
  });

  return {
    faturasData: faturas,
    placasData: placas,
    isLoadingFaturas,
    isLoadingPlacas,
    refetchFaturas
  };
};
