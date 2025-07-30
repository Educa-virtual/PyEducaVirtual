import { PrimengModule } from '@/app/primeng.module';
import { IconComponent } from '@/app/shared/icon/icon.component';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { Component, Input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { matCalendarMonth } from '@ng-icons/material-icons/baseline';
import { RecursosListaComponent } from '@/app/shared/components/recursos-lista/recursos-lista.component';
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe';
export interface IDescripcionActividad {
  cTitle?: string;
  dInicio?: Date;
  dFin?: Date;
  iEstado?: number;
  cDescripcion?: string;
  cDocumentos?: [];
}
@Component({
  selector: 'app-tab-descripcion-actividades',
  standalone: true,
  imports: [
    ToolbarPrimengComponent,
    PrimengModule,
    IconComponent,
    RecursosListaComponent,
    RemoveHTMLPipe,
  ],
  templateUrl: './tab-descripcion-actividades.component.html',
  styleUrl: './tab-descripcion-actividades.component.scss',
  providers: [
    provideIcons({
      matCalendarMonth,
    }),
  ],
})
export class TabDescripcionActividadesComponent {
  @Input() data: IDescripcionActividad;
}
