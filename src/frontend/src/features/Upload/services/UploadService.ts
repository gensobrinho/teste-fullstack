import { apiPost } from "../../../api";
import { UploadLog } from "../types/UploadLog";

const BASE_URL = '/api/import/csv';
export class UploadService {
    constructor() {}

    async postUpload(data: FormData): Promise<UploadLog> {
        const res = await apiPost<UploadLog, FormData>(BASE_URL, data);
        return res;
    }
}

export default new UploadService();