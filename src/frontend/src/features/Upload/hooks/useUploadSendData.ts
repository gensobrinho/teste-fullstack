import { useMutation } from "@tanstack/react-query"
import { UploadService } from "../services";

export const useUploadSendData = () => {
    const {isPending, mutate: upload, data} = useMutation({
        mutationFn: (data: FormData) => UploadService.postUpload(data)
    });

    return {
        isPending,
        upload,
        data,
    }
}