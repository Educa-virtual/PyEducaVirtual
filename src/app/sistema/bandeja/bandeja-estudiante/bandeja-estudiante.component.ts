import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { CommonModule } from '@angular/common';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-bandeja-estudiante',
  standalone: true,
  imports: [PrimengModule, CommonModule],
  templateUrl: './bandeja-estudiante.component.html',
  styleUrl: './bandeja-estudiante.component.scss',
  providers: [MessageService],
})
export class BandejaEstudianteComponent implements OnInit {
  bandeja: any[] = [];
  bandejaFiltrada: any[] = [];
  iYAcadId: string;
  iSedeId: string;
  iPerfilId: number;
  iEstudianteId: number;

  constructor(
    private ConstantesService: ConstantesService,
    private generalService: GeneralService,
    private mensaje: MessageService
  ) {
    this.iYAcadId = this.ConstantesService.iYAcadId;
    this.iSedeId = this.ConstantesService.iSedeId;
    this.iPerfilId = this.ConstantesService.iPerfilId;
    this.iEstudianteId = this.ConstantesService.iEstudianteId;
  }

  ngOnInit() {
    this.obtenerBandejaEstudiante();
  }

  filtrar(tipo: number = 0) {
    if (tipo === 0) {
      this.bandejaFiltrada = [...this.bandeja];
    } else {
      this.bandejaFiltrada = this.bandeja.filter(lista => Number(lista.iActTipoId) === tipo);
    }
  }

  obtenerBandejaEstudiante() {
    const params = {
      petition: 'post',
      group: 'acad',
      prefix: 'bandejaEntrante',
      ruta: 'bandeja-estudiante', // Ruta definida en el backend
      data: {
        iYAcadId: this.iYAcadId,
        iEstudianteId: this.iEstudianteId,
        iSedeId: this.iSedeId,
      },
    };
    this.getInformation(params, 'obtenerBandejaEstudiante');
  }

  getInformation(params, accion) {
    this.generalService.getGralPrefix(params).subscribe({
      next: (response: any) => {
        this.accionBtnItem({ accion, item: response?.data });
      },
      error: error => {
        const mensaje = error.error.message;
        this.mensajeError(mensaje);
      },
      complete: () => {},
    });
  }
  accionBtnItem(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;

    switch (accion) {
      case 'obtenerBandejaEstudiante':
        this.bandeja = item;
        this.mensajeExitoso('Se Obtuvo los datos Exitosomente');
        break;
      default:
        break;
    }
  }
  mensajeError(contenido: string) {
    this.mensaje.add({
      severity: 'error',
      summary: 'Error',
      detail: contenido,
    });
  }
  mensajeExitoso(contenido: string) {
    this.mensaje.add({
      severity: 'success',
      summary: 'Solicitud Exitosa',
      detail: contenido,
    });
  }
}
