import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ComunicadosService } from '../services/comunicados.services';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { formatDate, SlicePipe } from '@angular/common';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';

@Component({
  selector: 'app-lista-comunicados',
  standalone: true,
  imports: [PrimengModule, NoDataComponent],
  templateUrl: './lista-comunicados.component.html',
  styleUrl: './lista-comunicados.component.scss',
  providers: [SlicePipe],
})
export class ListaComunicadosComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;
  selectedItem: any;
  mostrarDialogoNuevaComunicado: boolean = false;
  mostrarDialogoAccesosComunicado: boolean = false;
  iYAcadId: number;
  perfil: any;
  seleccionarLista: any;
  bBandeja: boolean = false;

  comunicados: Array<any> = [];
  comunicados_filtrados: Array<any> = [];

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  USUARIO_RECIPIENTE: number = this.comunicadosService.USUARIO_RECIPIENTE;

  constructor(
    private messageService: MessageService,
    private comunicadosService: ComunicadosService,
    private store: LocalStoreService,
    private router: Router
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.setBreadCrumbs();
  }

  ngOnInit() {
    this.listarComunicados();
  }

  setBreadCrumbs() {
    this.breadCrumbItems = [{ label: 'Comunicados' }, { label: 'Listar comunicados' }];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  listarComunicados() {
    this.comunicadosService
      .listarComunicados({
        iYAcadId: this.iYAcadId,
        iTipoUsuario: this.USUARIO_RECIPIENTE,
      })
      .subscribe({
        next: (data: any) => {
          this.comunicados = data.data;
          this.comunicados_filtrados = this.comunicados;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  filtrarTabla() {
    const filtro = this.filtro.nativeElement.value;
    this.comunicados_filtrados = this.comunicados.filter(comunicado => {
      if (
        comunicado.cComunicadoTitulo &&
        comunicado.cComunicadoTitulo.toLowerCase().includes(filtro.toLowerCase())
      )
        return comunicado;
      if (
        comunicado.cComunicadoDescripcion &&
        comunicado.cComunicadoDescripcion.toLowerCase().includes(filtro.toLowerCase())
      )
        return comunicado;
      const dtComunicadoEmision = formatDate(
        comunicado.dtComunicadoEmision,
        'dd/MM/yyyy HH:mm',
        'es-PE'
      );
      if (comunicado.dtComunicadoEmision && dtComunicadoEmision.includes(filtro)) return comunicado;
      const dtComunicadoHasta = formatDate(
        comunicado.dtComunicadoHasta,
        'dd/MM/yyyy HH:mm',
        'es-PE'
      );
      if (comunicado.dtComunicadoHasta && dtComunicadoHasta.includes(filtro)) return comunicado;
      return null;
    });
  }

  getColorComunicado(comunicado) {
    if (Number(comunicado.puede_responder) === 0) {
      return 'card-disabled';
    }
    if (Number(comunicado.alerta) === 1) {
      return 'card-alerta';
    } else {
      const respuestas_blanco =
        Number(comunicado.count_preguntas) - Number(comunicado.count_respuestas);
      if (respuestas_blanco > 0) {
        return 'card-warning';
      }
      return 'card-regular';
    }
  }

  seleccionarBandeja($event: any) {
    const datos = $event.data;
    console.log('ver datos ', datos);

    this.bBandeja = true;
  }
}
