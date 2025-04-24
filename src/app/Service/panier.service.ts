import { forwardRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { PanierItem } from '../PanierItem';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from './user.service';
import { EventServiceService } from './event-service.service';


@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private panierItems: PanierItem[] = [];
  private isBrowser: boolean;
  private currentUserId: number | null = null;
  
  private panierSubject = new BehaviorSubject<void>(undefined);
  public panierChanges = this.panierSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private eventService: EventServiceService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Récupérer l'utilisateur courant depuis localStorage si disponible
    if (this.isBrowser) {
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          this.currentUserId = currentUser?.id || null;
        } catch (e) {
          console.error('Erreur lors de la récupération de l\'utilisateur courant', e);
        }
      }
    }
    
    this.chargerPanier();
    
    // S'abonner aux événements de connexion utilisateur
    this.eventService.userLogin$.subscribe(userId => {
      this.currentUserId = userId;
      this.migrerPanierGuestVersUtilisateur(userId);
      this.chargerPanier();
    });
  }

  private getPanierKey(): string {
    return this.currentUserId ? `panier_${this.currentUserId}` : 'panier_guest';
  }

  private chargerPanier(): void {
    if (this.isBrowser) {
      const panierKey = this.getPanierKey();
      const savedPanier = localStorage.getItem(panierKey);
      
      this.panierItems = savedPanier ? JSON.parse(savedPanier) : [];
      this.panierSubject.next();
      this.eventService.emitPanierChanged();
    }
  }

  private sauvegarderPanier(): void {
    if (this.isBrowser) {
      const panierKey = this.getPanierKey();
      localStorage.setItem(panierKey, JSON.stringify(this.panierItems));
      this.panierSubject.next();
      this.eventService.emitPanierChanged();
    }
  }

  // Migrer le panier guest vers le panier utilisateur après connexion
  public migrerPanierGuestVersUtilisateur(userId: number): void {
    if (this.isBrowser) {
      const panierGuest = localStorage.getItem('panier_guest');
      if (panierGuest) {
        localStorage.setItem(`panier_${userId}`, panierGuest);
        localStorage.removeItem('panier_guest');
        this.chargerPanier();
      }
    }
  }
  
  getPanierItems(): PanierItem[] {
    return [...this.panierItems];
  }

  getNombreItems(): number {
    return this.panierItems.reduce((sum, item) => sum + item.quantite, 0);
  }

  getMontantTotal(): number {
    return this.panierItems.reduce((sum, item) => sum + (item.prixUnitaire * item.quantite), 0);
  }

  // ajouterProduit(item: PanierItem): void {
  //   const existingItemIndex = this.panierItems.findIndex(
  //     i => i.produitId === item.produitId
  //   );
    
  //   if (existingItemIndex !== -1) {
  //     this.panierItems[existingItemIndex].quantite += item.quantite;
  //   } else {
  //     this.panierItems.push(item);
  //   }
    
  //   this.sauvegarderPanier();
  // }
  ajouterProduit(item: PanierItem, confirmerChangementTiers?: () => void): void {
    const currentTierId = this.panierItems.length > 0 ? this.panierItems[0].tierId : null;
  
    if (currentTierId !== null && currentTierId !== item.tierId) {
      if (confirmerChangementTiers) {
        confirmerChangementTiers(); // Délégué au composant pour afficher un message
      }
      return;
    }
  
    const existingItemIndex = this.panierItems.findIndex(
      i => i.produitId === item.produitId
    );
  
    if (existingItemIndex !== -1) {
      this.panierItems[existingItemIndex].quantite += item.quantite;
    } else {
      this.panierItems.push(item);
    }
  
    this.sauvegarderPanier();
  }
  

  modifierQuantite(produitId: string, nouvelleQuantite: number): void {
    const itemIndex = this.panierItems.findIndex(item => item.produitId === produitId);
    
    if (itemIndex !== -1) {
      if (nouvelleQuantite <= 0) {
        this.supprimerProduit(produitId);
      } else {
        this.panierItems[itemIndex].quantite = nouvelleQuantite;
        this.sauvegarderPanier();
      }
    }
  }

  supprimerProduit(produitId: string): void {
    this.panierItems = this.panierItems.filter(item => item.produitId !== produitId);
    this.sauvegarderPanier();
  }

  viderPanier(): void {
    this.panierItems = [];
    this.sauvegarderPanier();
  }
}