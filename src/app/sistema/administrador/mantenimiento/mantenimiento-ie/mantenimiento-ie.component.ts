import { Component, inject, OnInit, signal } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { EditarMantenimientoIeComponent } from './editar-mantenimiento-ie/editar-mantenimiento-ie.component';
import { MessageService, MenuItem } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { AgregarMantenimientoIeComponent } from './agregar-mantenimiento-ie/agregar-mantenimiento-ie.component';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { GeneralService } from '@/app/servicios/general.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { DatosInformesService } from '@/app/sistema/ere/services/datos-informes.service';
import { GestionUsuariosService } from '../../gestion-usuarios/services/gestion-usuarios.service';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';

@Component({
  selector: 'app-mantenimiento-ie',
  standalone: true,
  imports: [
    TablePrimengComponent,
    PrimengModule,
    EditarMantenimientoIeComponent,
    AgregarMantenimientoIeComponent,
    NoDataComponent,
  ],
  templateUrl: './mantenimiento-ie.component.html',
  styleUrl: './mantenimiento-ie.component.scss',
})
export class MantenimientoIeComponent implements OnInit {
  private _LocalStoreService = inject(LocalStoreService);
  private _FormBuilder = inject(FormBuilder);
  private _GeneralService = inject(GeneralService);
  private _ConstantesService = inject(ConstantesService);
  private _GestionUsuariosService = inject(GestionUsuariosService);
  private _DatosInformesService = inject(DatosInformesService);

  title: string = 'Mantenimiento Instituciones Educativas';
  selectedItem: any;
  titleEditarMantenimiento: string = 'Editar Institución Educativa';
  titleAgregarMantenimiento: string = 'Agregar Institución Educativa';
  mostrarEditarMantenimiento: boolean = false;
  mostrarAgregarMantenimiento: boolean = false;
  dataMantenimiento: any[] = [];
  loading: boolean = false;
  totalRegistros: number = 0;
  paginaActual: number = 1;
  registrosPorPagina: number = 10000;
  institucionSeleccionada: any;

  data = signal<any[]>([]);
  nivelTipos = signal<any[]>([]);
  instituciones = signal<any[]>([]);
  institucionesxiNivelTipoId = signal<any[]>([]);
  sedes = signal<any[]>([]);

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  columns = [
    {
      type: 'text',
      width: '10%',
      field: 'cIieeCodigoModular',
      header: 'Cód. Mod.',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '25%',
      field: 'cIieeNombre',
      header: 'Instituciones Educativas',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cDsttNombre',
      header: 'Distrito',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cUgelNombre',
      header: 'UGEL',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cIieeRUC',
      header: 'RUC',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cZonaNombre',
      header: 'Zona',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'Estado',
      width: '10%',
      field: 'iEstado',
      header: 'estado',
      text_header: 'center',
      customFalsy: {
        trueText: 'Activo',
        falseText: 'Inactivo',
      },
      text: 'center',
    },
    {
      type: 'actions',
      width: '15%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
  perfil = this._LocalStoreService.getItem('dremoPerfil');

  formMantenimiento = this._FormBuilder.nonNullable.group({
    iCredEntPerfId: [this.perfil?.iCredEntPerfId ?? null, Validators.required],
    iYAcadId: [this._ConstantesService.iYAcadId ?? null, Validators.required],
    iNivelTipoId: [null],
    iIieeId: [null],
    iSedeId: [null],
  });

  constructor(
    private messageService: MessageService,
    private confirmationModalService: ConfirmationModalService
  ) {
    this.breadCrumbItems = [
      {
        label: 'Mantenimiento Instituciones Educativas',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit() {
    this.getNivelTipos();
    this.getIntitucionEducativa();
  }

  getNivelTipos() {
    this._DatosInformesService
      .obtenerParametros(this.formMantenimiento.value)
      .subscribe((data: any) => {
        this.nivelTipos.set(this._DatosInformesService.getNivelesTipos(data?.nivel_tipos));
      });
  }

  getIntitucionEducativa() {
    this._GeneralService
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'institucion_educativas',
        campos: '*',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          const instituciones = (data.data ?? []).map((institucion: any) => ({
            ...institucion,
            cNombre:
              institucion.cIieeCodigoModular +
              ' - ' +
              institucion.cIieeNombre +
              ' - ' +
              (Number(institucion.iNivelTipoId) === 3 ? 'PRIMARIA' : 'SECUNDARIA'),
          }));

          this.instituciones.set(instituciones);
        },
        error: error => {
          console.error('Error fetching Tipo documentos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: 'Error en ejecución',
          });
        },
      });
  }

  obtenerSedesIe() {
    this.sedes.set([]);

    if (!this.formMantenimiento.value.iIieeId) return;
    this.data.set([]);
    this._GestionUsuariosService
      .obtenerSedesInstitucionEducativa(this.formMantenimiento.value.iIieeId)
      .subscribe({
        next: (respuesta: any) => {
          this.sedes.set(
            respuesta.data.map(sede => ({
              value: sede.iSedeId,
              label: sede.cSedeNombre,
            }))
          );
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al obtener sedes',
            detail: error,
          });
        },
      });
  }

  obtenerInstituciones() {
    this.sedes.set([]);
    this.institucionesxiNivelTipoId.set([]);

    this.formMantenimiento.controls.iIieeId.setValue(null);
    this.formMantenimiento.controls.iSedeId.setValue(null);

    if (!this.formMantenimiento.value.iNivelTipoId) return;
    this.institucionesxiNivelTipoId.set(
      this.instituciones().filter(
        item => Number(item.iNivelTipoId) === this.formMantenimiento.value.iNivelTipoId
      )
    );
  }

  obtenerIE() {
    this.data.set([]);
    this._GeneralService
      .searchCalendario({
        json: JSON.stringify(this.formMantenimiento.value),
        _opcion: 'getInstitucionesIE',
      })
      .subscribe({
        next: (data: any) => {
          this.data.set(data.data);
          console.log(this.data());
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: 'Error. No se proceso petición ' + error,
          });
        },
      });
  }

  accionBtnItemTable(event: any) {
    const accion = event.accion;
    const item = event.item;
    switch (accion) {
      case 'editar':
        this.selectedItem = item;
        this.mostrarEditarMantenimiento = true;
        this.institucionSeleccionada = item;
        break;
      case 'eliminar':
        //this.eliminarMantenimiento(item);
        break;
    }
  }

  actions: IActionTable[] = [
    {
      labelTooltip: 'Ver sedes',
      icon: 'pi pi-eye',
      accion: 'ver_sedes',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
    {
      labelTooltip: 'Editar institución',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Eliminar institución',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];
}
