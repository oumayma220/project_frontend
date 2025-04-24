import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {
  constructor() { }
  private userLoginSubject = new Subject<number>();
  public userLogin$ = this.userLoginSubject.asObservable();
  private panierChangedSubject = new Subject<void>();
  public panierChanged$ = this.panierChangedSubject.asObservable();
  emitUserLogin(userId: number) {
    this.userLoginSubject.next(userId);
  }
  emitPanierChanged() {
    this.panierChangedSubject.next();
  }

}
