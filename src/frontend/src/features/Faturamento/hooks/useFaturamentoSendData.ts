import { useMutation } from "@tanstack/react-query";
import { FaturamentoService } from "../services";
import { FaturamentoRequestDTO } from "../types/FaturamentoRequestDTO";

export const useFaturamentoSendData = () => {
  const { isPending, mutate: createFatura, data } = useMutation({
    mutationFn: (dto: FaturamentoRequestDTO) => FaturamentoService.generateFatura(dto),
  });

  return {
    isPending ,
    data: data ?? undefined,
    createFatura,
  }
};