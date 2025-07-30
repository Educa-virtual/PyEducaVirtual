import { PrimengModule } from '@/app/primeng.module';
import { RecursosListaComponent } from '@/app/shared/components/recursos-lista/recursos-lista.component';
import { IconComponent } from '@/app/shared/icon/icon.component';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-descripcion-actividades',
  standalone: true,
  templateUrl: './descripcion-actividades.component.html',
  styleUrls: ['./descripcion-actividades.component.scss'],
  imports: [PrimengModule, IconComponent, RecursosListaComponent],
})
export class DescripcionActividadesComponent {
  @Input() data: any;
  @Input() isDocente: boolean;
}
