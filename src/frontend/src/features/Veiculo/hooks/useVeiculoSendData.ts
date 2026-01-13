import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Veiculo } from "../../../shared/types";
import { VeiculoQueryEnum } from "../types/VeiculoQueryEnum";
import { VeiculoService } from "../services";

export const useVeiculoSendData = () => {
  const qc = useQueryClient();

  const {
    isPending: isPendingCreate,
    mutate: createVeiculo,
    data: createResponse,
  } = useMutation({
    mutationFn: (veiculoData: Partial<Veiculo>) =>
      VeiculoService.createVeiculo(veiculoData),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [VeiculoQueryEnum.getVeiculo] }),
  });

  const {
    isPending: isPendingUpdate,
    mutate: mutateUpdate,
    data: updateResponse,
  } = useMutation({
    mutationFn: ([id, data]: [string, Partial<Veiculo>]) =>
      VeiculoService.updateVeiculo(id, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [VeiculoQueryEnum.getVeiculo] }),
  });

  const {
    isPending: isPendingDelete,
    mutate: deleteVeiculo,
    data: deleteResponse,
  } = useMutation({
    mutationFn: (id: string) => VeiculoService.removeVeiculo(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [VeiculoQueryEnum.getVeiculo] }),
  });

  const updateVeiculo = (id: string, data: Partial<Veiculo>) => {
    mutateUpdate([id, data]);
  };

  return {
    isLoading: isPendingCreate || isPendingUpdate || isPendingDelete,
    data: createResponse || updateResponse || deleteResponse,
    createVeiculo,
    updateVeiculo,
    deleteVeiculo,
  };
};