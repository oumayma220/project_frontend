import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserService } from './Service/user.service';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './Service/authentication.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from './User';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { SidenavService } from './sidenav.service';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { PanierService } from './Service/panier.service';
import { MatBadgeModule } from '@angular/material/badge';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule, MatTooltipModule,MatIconModule,MatSidenavModule,MatButtonModule,
    MatBadgeModule

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  title = 'auth_frontend';
  isAuthenticated = false;
  currentUser$: Observable<User | null> | undefined;
  nombreItemsPanier: number = 0;

  constructor( private userService: UserService, private router: Router,public sidenavService: SidenavService,private panierService: PanierService) {
    this.currentUser$ = this.userService.currentUser$;
  }
  ngOnInit(): void {
    this.updatePanierCount();
    
    // S'abonner aux changements du panier
    this.panierService.panierChanges.subscribe(() => {
      this.updatePanierCount();
    }); 
   }
   updatePanierCount(): void {
    this.nombreItemsPanier = this.panierService.getNombreItems();
  }

  toggleSidenav() {
    this.sidenavService.toggle();
}
  

    logout(): void {
      this.userService.logout();
    }
}
