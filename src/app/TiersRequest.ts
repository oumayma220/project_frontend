import { FieldMapping } from "./FieldMapping";
import { PayloadTemplate } from "./PayloadTemplate";

export interface TiersRequest {
    nom: string;
    email: string;
    numero: string;
    configName: string;
    url: string;
    headers: string;
    httpMethod: string;
    endpoint: string;
    methodHeaders: string;
    paginated: boolean;
    paginationParamName: string;
    pageSizeParamName: string;
    totalPagesFieldInResponse: string;
    contentFieldInResponse: string;
    type: string;
    fieldMappings: FieldMapping[];
    payloadTemplates: PayloadTemplate[];
}
