import { apiPost } from "../../../api";

const BASE_URL = '/api/import/csv';

export class UploadService {
    constructor() {}

    async postUpload(data: FormData) {
        const res = apiPost(BASE_URL, data);
        return res;
    }
}

export default new UploadService();