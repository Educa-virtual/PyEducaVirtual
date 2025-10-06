import { PrimengModule } from '@/app/primeng.module';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.services';
import { MenuItem, MessageService } from 'primeng/api';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-gestion-plantillas',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './gestion-plantillas.component.html',
  styleUrl: './gestion-plantillas.component.scss',
  providers: [SlicePipe],
})
export class GestionPlantillasComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;

  active: number = 0;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  iCateId: number;
  categoria: any;

  perfil: any;
  iYAcadId: number;

  selectedItem: any;
  iPlanIdSeccionado: number;
  plantillas: any[] = [];
  plantillas_filtradas: any[] = [];

  plantilla: any;

  perfiles: Array<object>;
  distritos: Array<object>;
  nivel_tipos: Array<object>;
  nivel_grados: Array<object>;
  areas: Array<object>;
  secciones: Array<object>;
  zonas: Array<object>;
  tipo_sectores: Array<object>;
  ugeles: Array<object>;
  instituciones_educativas: Array<object>;
  sexos: Array<object>;
  estados: Array<object>;
  ies: Array<object>;
  participantes: Array<object>;
  permisos: Array<object>;

  constructor(
    private route: ActivatedRoute,
    private encuestasService: EncuestasService,
    private messageService: MessageService,
    private store: LocalStoreService,
    private router: Router,
    private slicePipe: SlicePipe
  ) {
    this.route.params.subscribe(params => {
      this.iCateId = params['iCateId'];
    });
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
  }

  ngOnInit(): void {
    if (this.iCateId) {
      this.verCategoria();
      this.listarPlantillas();
    }
  }

  verCategoria() {
    this.encuestasService
      .verCategoria({
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.categoria = data.data;
          this.setBreadCrumbs();
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

  setBreadCrumbs() {
    this.breadCrumbItems = [
      { label: 'Encuestas' },
      { label: 'Categorías', routerLink: '/encuestas/categorias' },
      {
        label: this.categoria?.cCateNombre
          ? String(this.slicePipe.transform(this.categoria?.cCateNombre, 0, 20))
          : 'Categoría',
      },
      { label: 'Gestionar plantillas' },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  verPlantillas() {
    this.plantilla = null;
  }

  filtrarPlantillas() {
    const filtro = this.filtro.nativeElement.value;
    this.plantillas_filtradas = this.plantillas.filter(plantilla => {
      if (
        plantilla.cPlanNombre &&
        plantilla.cPlanNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return plantilla;
      if (
        plantilla?.dtUltimaModificacion &&
        plantilla.dtUltimaModificacion.toString().includes(filtro)
      )
        return null;
    });
  }

  listarPlantillas() {
    this.encuestasService
      .listarPlantillas({
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.plantillas = data.data;
          this.plantillas_filtradas = this.plantillas;
        },
        error: error => {
          console.error('Error obteniendo lista de plantillas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  verPlantilla(iPlanId) {
    this.iPlanIdSeccionado = iPlanId;
    this.encuestasService
      .verPlantilla({
        iPlanId: iPlanId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.plantilla = data.data;
        },
        error: error => {
          console.error('Error obteniendo lista de plantillas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  agregarPlantilla() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/nueva-plantilla`]);
  }

  salir() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-plantillas`]);
  }

  generarEncuestaDesdePlantilla() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/encuesta-de-plantilla`]);
  }

  accionBtnItemTable({ accion, item }) {
    this.selectedItem = item;
    switch (accion) {
      case 'ver':
        this.verPlantilla(item.iPlanId);
        break;
    }
  }

  actions_plantillas: IActionTable[] = [
    {
      labelTooltip: 'Ver detalle',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
  ];

  columns_plantillas = [
    {
      type: 'item',
      width: '5%',
      field: '',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '40%',
      field: 'cPlanNombre',
      header: 'Plantilla',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '30%',
      field: 'cCreador',
      header: 'Creador',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'date',
      width: '20%',
      field: 'dtUltimaModificacion',
      header: 'Modificado en',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'actions',
      width: '5%',
      field: '',
      header: 'Ver',
      text_header: 'right',
      text: 'right',
    },
  ];
}
