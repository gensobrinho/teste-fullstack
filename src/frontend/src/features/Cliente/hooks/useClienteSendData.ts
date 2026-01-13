import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Cliente } from "../../../shared/types";
import { ClienteService } from "../services";
import { ClienteQueryEnum } from "../types/ClienteQueryEnum";

export const useClienteSendData = () => {
  const qc = useQueryClient();
  const { isPending: isPendingCreate, mutate: createCliente, data: createResponse } = useMutation({
    mutationFn: (clienteData: Partial<Cliente>) => ClienteService.createCliente(clienteData),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ClienteQueryEnum.getCliente] }),
  });

  const { isPending: isPendingDelete, mutate: deleteCliente, data: deleteResponse } = useMutation({
    mutationFn: (id: string) => ClienteService.removeCliente(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ClienteQueryEnum.getCliente] }),
  })

  return {
    isLoading: isPendingCreate || isPendingDelete,
    data: createResponse || deleteResponse,
    createCliente,
    deleteCliente,
  }
};
