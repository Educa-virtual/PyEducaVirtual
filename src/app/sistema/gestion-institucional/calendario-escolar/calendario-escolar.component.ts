import { PrimengModule } from '@/app/primeng.module';
import { Component, inject } from '@angular/core';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { TabsPrimengComponent } from '@/app/shared/tabs-primeng/tabs-primeng.component';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { Router } from '@angular/router';
import { ConfiguracionInicialComponent } from './configuracion-inicial/configuracion-inicial.component';
import { PeriodosAcademicosComponent } from './periodos-academicos/periodos-academicos.component';
import { ResumenComponent } from './resumen/resumen.component';

@Component({
  selector: 'app-calendario-escolar',
  standalone: true,
  imports: [
    PrimengModule,
    ToolbarPrimengComponent,
    TabsPrimengComponent,
    ConfiguracionInicialComponent,
    PeriodosAcademicosComponent,
    ResumenComponent,
  ],
  templateUrl: './calendario-escolar.component.html',
  styleUrl: './calendario-escolar.component.scss',
})
export class CalendarioEscolarComponent extends MostrarErrorComponent {
  private _Router = inject(Router);

  selectTab: number = 0;
  tabSeleccionado: string = 'configuracion';
  tabs = [
    {
      title: 'Configuración Inicial',
      icon: 'pi pi-book',
      tab: 'configuracion',
    },
    {
      title: 'Periodos Académicos',
      icon: 'pi pi-home',
      tab: 'periodos',
    },
    {
      title: 'Resumen',
      icon: 'pi pi-home',
      tab: 'resumen',
    },
  ];

  updateTab(event): void {
    // this._Router.navigate([], {
    //   queryParams: { tab: tab },
    //   queryParamsHandling: 'merge',
    // });
    // console.log(tab);
    this.tabSeleccionado = event.tab;
  }
}
