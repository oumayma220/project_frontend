import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TiersRequest } from '../TiersRequest';
import { Tiers } from '../tiers';
import { TiersGeneralInfoRequest } from '../TiersGeneralInfoRequest';

@Injectable({
  providedIn: 'root'
})
export class TiersService {
  private apiUrl = 'http://localhost:8080/config/admin/api/tiers'; // ton endpoint backend
  private baseUrl = 'http://localhost:8080/config/tiers'; // L'URL de ton endpoint Spring Boot
  private base ='http://localhost:8080/config/admin';

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
    const url = `${this.base}/${id}/general-info`;  // L'URL correcte pour l'API
    return this.http.put<string>(url, request, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'  // Ici, on s'attend à une réponse de type texte
    });
  }
  
  
  

  
}
