import { PrimengModule } from '@/app/primeng.module';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { Component } from '@angular/core';
import { ConfigurarTurnosComponent } from '../configurar-turnos/configurar-turnos.component';

@Component({
  selector: 'app-configuracion-inicial',
  standalone: true,
  imports: [PrimengModule, ConfigurarTurnosComponent],
  templateUrl: './configuracion-inicial.component.html',
  styleUrl: './configuracion-inicial.component.scss',
})
export class ConfiguracionInicialComponent extends MostrarErrorComponent {
  mostrarModalConfigurarTurnos: boolean = false;
}
