import { PayloadTemplate } from "./PayloadTemplate";

export interface FieldMapping {
    id: number;
    target: string;
    source: string;
    tenantid: number;
  }
  
  export interface ApiMethod {
    id: number;
    httpMethod: string;
    endpoint: string;
    headers: string;
    type: string;
    tenantid: number;
    fieldMappings: FieldMapping[];
    payloadTemplates: PayloadTemplate[];
    

    paginated: boolean;
    paginationParamName: string | null;
    pageSizeParamName: string | null;
    pageSize: number | null;
    totalPagesFieldInResponse: string | null;
    contentFieldInResponse: string | null;
  }
  
  export interface Config {
    id: number;
    configName: string;
    tenantid: number;
    url: string;
    headers: string;
    apiMethods: ApiMethod[];
  }
  