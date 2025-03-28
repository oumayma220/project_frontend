import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TiersRequest } from '../TiersRequest';
import { Tiers } from '../tiers';
import { TiersGeneralInfoRequest } from '../TiersGeneralInfoRequest';
import { Config } from '../Config';
import { text } from 'stream/consumers';
import { FieldMapping } from '../FieldMapping';
import { Product } from '../Product';
import { ConfigGeneralInfoRequest } from '../ConfigGeneralInfoRequest';
import { ApiMethodGeneralInfoRequest } from '../ApiMethodGeneralInfoRequest';

@Injectable({
  providedIn: 'root'
})
export class TiersService {
  private apiUrl = 'http://localhost:8080/config/admin/api/tiers'; 
  private baseUrl = 'http://localhost:8080/config/tiers';
  private base ='http://localhost:8080/config/admin';
  private baseapi = 'http://localhost:8080/config';


  constructor(private http: HttpClient) {}
    private getAuthHeaders(): HttpHeaders {
      const accessToken = localStorage.getItem("accessToken");
      return new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    }

  createTiers(request: TiersRequest): Observable<string> {
    return this.http.post<any>(this.apiUrl, request, { headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'  
    });
  }
 
  getAllTiers(): Observable<Tiers[]> {
    return this.http.get<Tiers[]>(this.baseUrl,{ headers: this.getAuthHeaders()});
  }
  deleteTiers(tiersId: number): Observable<string> {
    const url = `${this.base}/${tiersId}/delete`;
    return this.http.delete(url, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
  updateTiersGeneralInfo(id: number, request: TiersGeneralInfoRequest): Observable<string> {
    const url = `${this.base}/${id}/general-info`;  
    return this.http.put<string>(url, request, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'  
    });
  }
  updateConfigGeneralInfo(id: number, request: ConfigGeneralInfoRequest): Observable<string> {
    const url = `${this.base}/${id}/update-config`;  
    return this.http.put<string>(url, request, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'  
    });
  }
  updateApiMethod(id: number, request: ApiMethodGeneralInfoRequest): Observable<string> {
    const url = `${this.base}/${id}/update-method`;  
    return this.http.put<string>(url, request, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'  
    });
  }
  getConfigsByTiersId(tiersId: number): Observable<Config[]> {
    return this.http.get<Config[]>(`${this.base}/tiers/configs/${tiersId}`, {
      headers: this.getAuthHeaders()
    });
  }
  getTiersById(id: number): Observable<Tiers> {
    return this.http.get<Tiers>(`${this.baseUrl}/${id}`, {
        headers: this.getAuthHeaders()
      }
    );
  }
  addConfigToTiers(tiersId: number, request: TiersRequest): Observable<any> {
    const url = `${this.base}/${tiersId}/configs`;
    return this.http.post<any>(url, request, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'  

    });
  }
  addApiMethodAndFieldMappings(configId: number, request: TiersRequest): Observable<any> {
    const url = `${this.base}/addApiMethodAndFieldMappings/${configId}`;
    return this.http.post<any>(url, request,{
      headers:this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
    }
    addFieldMappings(methodId: number, request: FieldMapping[]): Observable<any> {
      const url = `${this.base}/add/${methodId}`;
      return this.http.post<any>(url, request,{
        headers:this.getAuthHeaders(),
        responseType: 'text' as 'json'
      });
      }
      deleteconfig(configId: number): Observable<string> {
        const url = `${this.base}/delete/config/${configId}`;
        return this.http.delete(url, {
          headers: this.getAuthHeaders(),
          responseType: 'text'
        });
      }
      deleteapimethod(methodId: number): Observable<string> {
        const url = `${this.base}/delete/method/${methodId}`;
        return this.http.delete(url, {
          headers: this.getAuthHeaders(),
          responseType: 'text'
        });
      }
      deletefieldmapping(methodId: number): Observable<string> {
        const url = `${this.base}/delete/field/${methodId}`;
        return this.http.delete(url, {
          headers: this.getAuthHeaders(),
          responseType: 'text'
        });
      }
      importProducts(request: TiersRequest): Observable<Product[]> {
        const importUrl = `${this.baseapi}/import`; 
        return this.http.post<Product[]>(importUrl, request, { headers: this.getAuthHeaders() });
      }
  

  
}
