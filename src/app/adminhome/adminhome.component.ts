import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { importProvidersFrom } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../Service/user.service';
import { User } from '../User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adminhome',
  standalone: true,
  imports: [MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
],
  templateUrl: './adminhome.component.html',
  styleUrl: './adminhome.component.css'
})
export class AdminhomeComponent implements OnInit {
  currentUser: User | null = null;
  isAdmin: boolean = false;
  // @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded = true; 
  constructor(private userService: UserService, private router: Router) {}
  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.roles.includes('ADMIN') || false;
    });  }
  logout(): void {
    this.userService.logout();
  }



}
