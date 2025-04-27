import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandeDTO } from '../CommandeDTO';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private baseUrl = 'http://localhost:8070/api/commandes'; 
  constructor(private http: HttpClient) {}
    private getAuthHeaders(): HttpHeaders {
        const accessToken = localStorage.getItem("accessToken");
        return new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
      }
  passerCommandePourTiers(commande: CommandeDTO): Observable<string> {
    return this.http.post(`${this.baseUrl}/tiers`, commande, { 
      headers: this.getAuthHeaders(), 
      responseType: 'text' });
  }
}
