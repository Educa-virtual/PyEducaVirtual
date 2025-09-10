import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestasService } from '../services/encuestas.services';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { SlicePipe } from '@angular/common';
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
      this.listarEncuestas();
    }
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
        next: (resp: any) => {
          this.encuestas = resp.data;
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
      if (encuesta.cEncNombre && encuesta.cEncNombre.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      if (
        encuesta.cEncCatNombre &&
        encuesta.cEncCatNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return encuesta;
      if (
        encuesta.cEncDurNombre &&
        encuesta.cEncDurNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return encuesta;
      if (encuesta.dEncInicio && encuesta.dEncInicio.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      if (encuesta.dEncFin && encuesta.dEncFin.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      return null;
    });
  }

  verEncuesta() {
    this.router.navigate([
      `/encuestas/categorias/${this.iCateId}/lista-encuestas/${this.selectedItem.iEncuId}`,
    ]);
  }

  getColorEncuesta(encuesta: any) {
    if (encuesta.iEstado === this.ESTADO_BORRADOR) {
      return 'card-alerta';
    } else if (encuesta.iEstado === this.ESTADO_APROBADA) {
      return 'card-regular';
    }
    return 'card-regular';
  }

  responderEncuesta(encuesta: any) {
    this.router.navigate([`/bienestar/encuesta/${encuesta.iEncuId}/respuestas`]);
  }

  verRespuestas(encuesta: any) {
    this.router.navigate([`/bienestar/encuesta/${encuesta.iEncuId}/resumen`]);
  }
}
