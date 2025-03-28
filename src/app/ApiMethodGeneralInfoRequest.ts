export interface ApiMethodGeneralInfoRequest {
    httpMethod: string;
    endpoint: string;
    methodHeaders: string;
    paginated: boolean;
    paginationParamName: string;
    pageSizeParamName: string;
    totalPagesFieldInResponse: string;
    contentFieldInResponse: string;
    type: string; 
}