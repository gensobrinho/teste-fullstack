import { UploadError } from "./UploadError";

export interface UploadLog {
    processados: number;
    inseridos: number;
    erros: UploadError[];
    sucesso?: boolean;
}