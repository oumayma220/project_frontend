import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { importProvidersFrom } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '../Service/user.service';
import { User } from '../User';
import { CommonModule } from '@angular/common';
import { SidenavService } from '../sidenav.service';



@Component({
  selector: 'app-success',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
  MatListModule,
   MatIconModule,
  MatButtonModule,
  RouterLink,
  RouterOutlet,
  CommonModule,
  RouterModule

  ],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit, AfterViewInit  {
  @ViewChild('sidenav', {static: true}) sidenav!: MatSidenav;
    isExpanded = true;
  isMobile = false;

 currentUser: User | null = null;
  isAdmin: boolean = false;
  // @ViewChild('sidenav') sidenav!: MatSidenav;
  constructor(private userService: UserService, private router: Router, private sidenavService: SidenavService,
  ) {
    this.checkScreenSize();
  }
    ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.roles.includes('ADMIN') || false;
    });  }
    ngAfterViewInit() {
      this.sidenavService.setSidenav(this.sidenav);
    }
  
     // Écouteur d'événement pour détecter les changements de taille d'écran
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  // Fonction pour vérifier la taille de l'écran
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // 768px est une largeur typique pour détecter les appareils mobiles
    
    // Fermer automatiquement la sidebar sur mobile
    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
    }
  }
  logout(): void {
    this.userService.logout();
  }
  closeSidenavOnMobile() {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }



}
