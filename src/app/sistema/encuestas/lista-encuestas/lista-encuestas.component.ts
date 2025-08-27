import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestasService } from '../services/encuestas.services';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
//import { GestionEncuestaConfiguracionComponent } from './gestion-encuesta-configuracion/gestion-encuesta-configuracion.component'

@Component({
  selector: 'app-lista-encuestas',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './lista-encuestas.component.html',
  styleUrl: './../lista-categorias/lista-categorias.component.scss',
})
export class ListaEncuestasComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;
  iCateId: number = null;
  categoria: any = null;
  selectedItem: any;
  mostrarDialogoNuevaEncuesta: boolean = false;
  mostrarDialogoAccesosEncuesta: boolean = false;
  iYAcadId: number;

  dataEncuestas: Array<any> = [];

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  constructor(
    private messageService: MessageService,
    private encuestasService: EncuestasService,
    private confirmService: ConfirmationModalService,
    private route: ActivatedRoute,
    private store: LocalStoreService,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      this.iCateId = params['iCateId'];
    });
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.breadCrumbItems = [
      {
        label: 'Evaluaciones',
      },
      {
        label: 'Categorías',
        routerLink: '/encuestas/categorias',
      },
      {
        label: 'Categoría',
      },
      {
        label: 'Encuestas',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit() {
    this.verCategoria();
    this.listarEncuestas();
  }

  agregarEncuesta() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/nueva-encuesta`]);
  }

  verCategoria() {
    this.encuestasService
      .verCategoria({
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          console.log(data.data);
          this.categoria = data.data;
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message ?? 'Ocurrió un error',
          });
        },
      });
  }

  listarEncuestas() {
    this.encuestasService
      .listarEncuestas({
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (resp: any) => {
          this.dataEncuestas = resp.data;
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
    this.dataEncuestas = this.dataEncuestas.filter(encuesta => {
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
    console.log('Ver encuesta:', this.selectedItem);
    this.messageService.add({
      severity: 'info',
      summary: 'Ver encuesta',
      detail: `Viendo encuesta: ${this.selectedItem.cTituloEncuesta}`,
    });
  }

  editarEncuesta() {
    console.log('Editar encuesta:', this.selectedItem);
    this.messageService.add({
      severity: 'info',
      summary: 'Editar encuesta',
      detail: `Editando encuesta: ${this.selectedItem.cTituloEncuesta}`,
    });
  }

  eliminarEncuesta() {
    this.confirmService.openConfirm({
      header: '¿Está seguro de eliminar la encuesta ' + this.selectedItem.cConfEncNombre + ' ?',
      accept: () => {
        this.encuestasService.borrarEncuesta(this.selectedItem.iConfEncId).subscribe({
          next: (resp: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Encuesta eliminada',
              detail: resp.message,
            });
            this.dataEncuestas = this.dataEncuestas.filter(
              encuesta => encuesta.iEncId !== this.selectedItem.iConfEncId
            );
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
      },
    });
    console.log('Eliminar encuesta:', this.selectedItem);
  }

  abrirDialogoNuevaEncuesta() {
    this.mostrarDialogoNuevaEncuesta = true;
  }

  cerrarDialogoNuevaEncuesta() {
    this.mostrarDialogoNuevaEncuesta = false;
  }

  abrirDialogoAccesosEncuesta() {
    this.mostrarDialogoAccesosEncuesta = true;
  }
  cerrarDialogoAccesosEncuesta() {
    this.mostrarDialogoAccesosEncuesta = false;
  }

  accionBtnItemTable({ accion, item }) {
    this.selectedItem = item;
    switch (accion) {
      case 'accesos':
        /*this.verEncuesta()
                this.abrirDialogoAccesosEncuesta()*/
        this.abrirDialogoAccesosEncuesta();
        break;
      case 'editar':
        this.editarEncuesta();
        break;
      case 'eliminar':
        this.eliminarEncuesta();
        break;
    }
  }

  actions: IActionTable[] = [
    {
      labelTooltip: 'Gestionar accesos',
      icon: 'pi pi-user-plus',
      accion: 'accesos',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
    {
      labelTooltip: 'Editar encuesta',
      icon: 'pi pi-pen-to-square',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Eliminar encuesta',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];

  columns: IColumn[] = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '8rem',
      field: 'cEncNombre',
      header: 'Título de encuesta',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'cEncDurNombre',
      header: 'Tiempo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '3rem',
      field: 'dEncInicio',
      header: 'Desde',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '3rem',
      field: 'dEncFin',
      header: 'Hasta',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '3rem',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
