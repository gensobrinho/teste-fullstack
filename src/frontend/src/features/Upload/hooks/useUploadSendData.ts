import { useMutation } from "@tanstack/react-query";
import { UploadService } from "../services";
import { UploadLog } from "../types/UploadLog";

export const useUploadSendData = () => {
  const { isPending, mutate: upload, data } = useMutation<
    UploadLog,
    Error,
    FormData
  >({
    mutationFn: (data: FormData) => UploadService.postUpload(data),
  });

  return {
    isPending,
    upload,
    data,
  };
};