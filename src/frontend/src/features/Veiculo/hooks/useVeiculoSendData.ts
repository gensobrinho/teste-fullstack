import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Veiculo } from "../../../shared/types";
import { VeiculoQueryEnum } from "../types/VeiculoQueryEnum";
import { VeiculoService } from "../services";
import { VeiculoUpdateDTO } from "../types/VeiculoUpdateDTO";

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
    mutate: updateVeiculo,
    data: updateResponse,
  } = useMutation({
    mutationFn: (body: VeiculoUpdateDTO) =>
      VeiculoService.updateVeiculo(body),
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

  return {
    isLoading: isPendingCreate || isPendingUpdate || isPendingDelete,
    data: createResponse || updateResponse || deleteResponse,
    createVeiculo,
    updateVeiculo,
    deleteVeiculo,
  };
};