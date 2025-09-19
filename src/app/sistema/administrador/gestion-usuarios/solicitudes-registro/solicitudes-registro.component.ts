import { Component } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { SolicitudesRegistroService } from './services/solicitudes-registro.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-solicitudes-registro',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './solicitudes-registro.component.html',
  styleUrl: './solicitudes-registro.component.scss',
})
export class SolicitudesRegistroComponent {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  formFiltros: any;
  dataFiltroAtendida: any;
  dataSolicitudes: any;
  totalDataSolicitudes: number = 0;
  loading: boolean = false;
  private lastLazyEvent: LazyLoadEvent | undefined;

  constructor(
    private fb: FormBuilder,
    private solicitudesRegistroService: SolicitudesRegistroService,
    private messageService: MessageService
  ) {
    this.formFiltros = this.fb.group({
      bAtendida: [false],
      dtFechaSolicitud: [null],
    });

    this.dataFiltroAtendida = [
      { label: 'No atendidas', value: '0' },
      { label: 'Atendidas', value: '1' },
      { label: 'Ambas', value: '1' },
    ];
  }

  realizarBusqueda() {
    this.lastLazyEvent.first = 0;
    this.loadUsuariosLazy(this.lastLazyEvent);
  }

  obtenerSolicitudes(params: any) {
    this.solicitudesRegistroService.obtenerListaSolicitudes(params).subscribe({
      next: (respuesta: any) => {
        this.totalDataSolicitudes = respuesta.data.totalFilas;
        this.dataSolicitudes = respuesta.data.dataUsuarios;
        this.loading = false;
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener usuarios',
          detail: error.error.message,
        });
      },
    });
  }

  loadUsuariosLazy(event: any) {
    this.lastLazyEvent = event;
    this.loading = true;
    const params = new HttpParams()
      .set('offset', event.first)
      .set('limit', event.rows)
      .set('atendidas', this.formFiltros.get('bAtendida')?.value)
      .set('fechaSolicitud', this.formFiltros.get('dtFechaSolicitud')?.value);
    this.obtenerSolicitudes(params);
  }

  marcarSolicitudAtendida(data: any) {
    console.log(data);
  }
}
