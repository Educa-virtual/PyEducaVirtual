import { PrimengModule } from '@/app/primeng.module';
import { Component, inject } from '@angular/core';
import { HistorialAsistenciaComponent } from './historial-asistencia/historial-asistencia.component';
import { ConfiguracionAsistenciaComponent } from './configuracion-asistencia/configuracion-asistencia.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
@Component({
  selector: 'app-auxiliar',
  standalone: true,
  imports: [PrimengModule, HistorialAsistenciaComponent, ConfiguracionAsistenciaComponent],
  templateUrl: './auxiliar.component.html',
  styleUrl: './auxiliar.component.scss',
})
export class AuxiliarComponent {
  mensaje: any[] | undefined;
  datos: any;
  grupo: boolean = false;
  iSedeId: string;
  habilitarGrupo: boolean = true;

  private generalService = inject(GeneralService);
  private constantesService = inject(ConstantesService);

  constructor() {
    this.iSedeId = this.constantesService.iSedeId;
  }
  // ngOnInit() {
  //   this.verificarCreacionGrupos()
  // }

  verificarCreacionGrupos() {
    const params = {
      petition: 'post',
      group: 'asi',
      prefix: 'grupos',
      ruta: 'verificar-grupo-asistencia',
      data: {
        iSedeId: this.iSedeId,
      },
    };
    this.getInformation(params, 'verificar_grupos');
  }

  getInformation(params, accion) {
    this.generalService.getGralPrefix(params).subscribe({
      next: (response: any) => {
        this.accionBtnItem({ accion, item: response?.data });
      },
      error: error => {
        const mensaje = error.error.message;
        this.mensaje = [
          {
            severity: 'error',
            summary: mensaje,
          },
        ];
      },
      complete: () => {},
    });
  }
  accionBtnItem(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;

    switch (accion) {
      case 'verificar_grupos':
        console.log(item);
        this.mensaje = [
          {
            severity: 'success',
            summary: 'Se creo con exito los grupos de Asistencia',
          },
        ];
        break;
      default:
        break;
    }
  }
}
