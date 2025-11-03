import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStoreService } from './local-store.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  // 🔁 Fuentes reactivas (BehaviorSubject mantiene el último valor)
  private yearsSource = new BehaviorSubject<any[]>([]);
  private selectedYearSource = new BehaviorSubject<any>(null);

  // 🔍 Observables públicos (los componentes se suscriben a estos)
  years$ = this.yearsSource.asObservable();
  selectedYear$ = this.selectedYearSource.asObservable();

  constructor(private localStore: LocalStoreService) {
    // Recuperar valores iniciales del localStorage
    const user = this.localStore.getItem('dremoUser');
    const year = this.localStore.getItem('dremoYear');

    if (user?.years) {
      this.yearsSource.next(user.years);
    }

    if (year) {
      this.selectedYearSource.next(year);
    }
  }

  /** ✅ Actualizar lista de años académicos */
  updateYears(years: any[]) {
    this.yearsSource.next(years);

    const user = this.localStore.getItem('dremoUser');
    if (user) {
      user.years = years;
      this.localStore.setItem('dremoUser', user);
    }
  }

  /** ✅ Cambiar año seleccionado */
  setSelectedYear(year: any) {
    this.selectedYearSource.next(year);
    this.localStore.setItem('dremoYear', year.iYearId);
  }

  /** 🧹 Limpiar todo el estado (por ejemplo, al cerrar sesión) */
  clearState() {
    this.yearsSource.next([]);
    this.selectedYearSource.next(null);
    this.localStore.clear();
  }
}
