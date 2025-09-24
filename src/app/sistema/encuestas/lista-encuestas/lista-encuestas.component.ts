import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestasService } from '../services/encuestas.services';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { formatDate, SlicePipe } from '@angular/common';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
//import { GestionEncuestaConfiguracionComponent } from './gestion-encuesta-configuracion/gestion-encuesta-configuracion.component'

@Component({
  selector: 'app-lista-encuestas',
  standalone: true,
  imports: [PrimengModule, NoDataComponent],
  templateUrl: './lista-encuestas.component.html',
  styleUrl: './../lista-categorias/lista-categorias.component.scss',
  providers: [SlicePipe],
})
export class ListaEncuestasComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;
  iCateId: number = null;
  categoria: any = null;
  selectedItem: any;
  mostrarDialogoNuevaEncuesta: boolean = false;
  mostrarDialogoAccesosEncuesta: boolean = false;
  iYAcadId: number;
  perfil: any;
  cCateNombre: string;

  encuestas: Array<any> = [];
  encuestas_filtradas: Array<any> = [];

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  ESTADO_BORRADOR: number = this.encuestasService.ESTADO_BORRADOR;
  ESTADO_APROBADA: number = this.encuestasService.ESTADO_APROBADA;

  USUARIO_ENCUESTADO: number = this.encuestasService.USUARIO_ENCUESTADO;

  constructor(
    private messageService: MessageService,
    private encuestasService: EncuestasService,
    private confirmService: ConfirmationModalService,
    private route: ActivatedRoute,
    private store: LocalStoreService,
    private router: Router,
    private slicePipe: SlicePipe
  ) {
    this.route.params.subscribe(params => {
      this.iCateId = params['iCateId'];
    });
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.setBreadCrumbs();
  }

  ngOnInit() {
    if (this.iCateId) {
      this.verCategoria();
      this.listarEncuestas();
    }
  }

  verCategoria() {
    this.encuestasService
      .verCategoria({
        iCateId: this.iCateId,
      })
      .subscribe({
        next: (data: any) => {
          this.categoria = data.data;
          this.setBreadCrumbs();
        },
        error: error => {
          console.error('Error obteniendo categoria:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  setBreadCrumbs() {
    this.breadCrumbItems = [
      { label: 'Encuestas' },
      { label: 'Categorías', routerLink: '/encuestas/categorias' },
      {
        label: this.categoria?.cCateNombre
          ? String(this.slicePipe.transform(this.categoria?.cCateNombre, 0, 20))
          : 'Categoría',
      },
      { label: 'Listar encuestas' },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  listarEncuestas() {
    this.encuestasService
      .listarEncuestas({
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
        iTipoUsuario: this.USUARIO_ENCUESTADO,
      })
      .subscribe({
        next: (data: any) => {
          this.encuestas = data.data;
          this.encuestas_filtradas = this.encuestas;
        },
        error: error => {
          console.error('Error obteniendo lista de encuestas:', error);
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
    this.encuestas_filtradas = this.encuestas.filter(encuesta => {
      if (encuesta.cEncuNombre && encuesta.cEncuNombre.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      if (
        encuesta.cTiemDurNombre &&
        encuesta.cTiemDurNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return encuesta;
      const dEncuInicio = formatDate(encuesta.dEncuInicio, 'dd/MM/yyyy', 'es-PE');
      if (encuesta.dEncuInicio && dEncuInicio.includes(filtro)) return encuesta;
      const dEncuFin = formatDate(encuesta.dEncuFin, 'dd/MM/yyyy', 'es-PE');
      if (encuesta.dEncuFin && dEncuFin.includes(filtro)) return encuesta;
      return null;
    });
  }

  verEncuesta() {
    this.router.navigate([
      `/encuestas/categorias/${this.iCateId}/lista-encuestas/${this.selectedItem.iEncuId}`,
    ]);
  }

  getColorEncuesta(encuesta) {
    if (Number(encuesta.puede_responder) === 0) {
      return 'card-disabled';
    }
    if (Number(encuesta.alerta) === 1) {
      return 'card-alerta';
    } else {
      const respuestas_blanco =
        Number(encuesta.count_preguntas) - Number(encuesta.count_respuestas);
      if (respuestas_blanco > 0) {
        return 'card-warning';
      }
      return 'card-regular';
    }
  }

  responderEncuesta(encuesta: any) {
    this.router.navigate([
      `/encuestas/categorias/${encuesta.iCateId}/lista-encuestas/${encuesta.iEncuId}/ver`,
    ]);
  }

  verRespuestas(encuesta: any) {
    this.router.navigate([
      `/encuestas/categorias/${encuesta.iCateId}/lista-encuestas/${encuesta.iEncuId}/ver`,
    ]);
  }

  formatearTiempoRestante(encuesta: any) {
    const iMinutosRestantes = Number(encuesta?.iMinutosRestantes);
    if (Number(encuesta?.iTiempDurId) === 0) return '';
    else if (iMinutosRestantes === 0) return '(Tiempo expirado)';
    else if (iMinutosRestantes > 0 && iMinutosRestantes < 60)
      return `(${iMinutosRestantes} minutos restantes)`;
    else if (iMinutosRestantes >= 60 && iMinutosRestantes < 1440)
      return `(${Math.floor(iMinutosRestantes / 60)} horas restantes)`;
    else if (iMinutosRestantes >= 1440) return `(más de 1 día restante)`;
    return '';
  }
}
