import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Cliente } from "../../../shared/types";
import { ClienteService } from "../services";
import { ClienteQueryEnum } from "../types/ClienteQueryEnum";
import { ClienteUpdateDTO } from "../types/ClienteUpdateDTO";

export const useClienteSendData = () => {
  const qc = useQueryClient();
  const { isPending: isPendingCreate, mutate: createCliente, data: createResponse } = useMutation({
    mutationFn: (clienteData: Partial<Cliente>) => ClienteService.createCliente(clienteData),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ClienteQueryEnum.getCliente] }),
  });

  const { isPending: isPendingDelete, mutate: deleteCliente, data: deleteResponse } = useMutation({
    mutationFn: (id: string) => ClienteService.removeCliente(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ClienteQueryEnum.getCliente] }),
  });

  const { isPending: isPendingUpdate, mutate: updateCliente, data: updateResponse } = useMutation({
    mutationFn: (data: ClienteUpdateDTO) => ClienteService.updateCliente(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ClienteQueryEnum.getCliente]}),
  });

  return {
    isLoading: isPendingCreate || isPendingDelete || isPendingUpdate,
    data: createResponse || deleteResponse || updateResponse,
    createCliente,
    deleteCliente,
    updateCliente
  }
};
