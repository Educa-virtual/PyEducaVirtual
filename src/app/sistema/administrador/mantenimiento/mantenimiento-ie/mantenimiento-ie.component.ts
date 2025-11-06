import { Component, inject, OnInit, signal } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';

import { MenuItem } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { GeneralService } from '@/app/servicios/general.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { DatosInformesService } from '@/app/sistema/ere/services/datos-informes.service';
import { GestionUsuariosService } from '../../gestion-usuarios/services/gestion-usuarios.service';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { CardOrderListComponent } from '@/app/shared/card-orderList/card-orderList.component';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { AgregarMantenimientoIeComponent } from './agregar-mantenimiento-ie/agregar-mantenimiento-ie.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { FormSedesComponent } from './form-sedes/form-sedes.component';

@Component({
  selector: 'app-mantenimiento-ie',
  standalone: true,
  imports: [
    PrimengModule,
    NoDataComponent,
    ToolbarPrimengComponent,
    CardOrderListComponent,
    TablePrimengComponent,
    AgregarMantenimientoIeComponent,
    FormSedesComponent,
  ],
  templateUrl: './mantenimiento-ie.component.html',
  styleUrl: './mantenimiento-ie.component.scss',
})
export class MantenimientoIeComponent extends MostrarErrorComponent implements OnInit {
  private _LocalStoreService = inject(LocalStoreService);
  private _FormBuilder = inject(FormBuilder);
  private _GeneralService = inject(GeneralService);
  private _ConstantesService = inject(ConstantesService);
  private _GestionUsuariosService = inject(GestionUsuariosService);
  private _DatosInformesService = inject(DatosInformesService);
  private _ConfirmationModalService = inject(ConfirmationModalService);

  title: string = 'Mantenimiento Instituciones Educativas';
  loading: boolean = false;
  institucionSeleccionada = signal<any>({});
  itemSelected = signal<any | null>(null);
  itemSelectedSede = signal<any | null>(null);

  nivelTipos = signal<any[]>([]);
  instituciones = signal<any[]>([]);
  institucionesxiNivelTipoId = signal<any[]>([]);
  sedes = signal<any[]>([]);
  showModal = signal<boolean>(false);
  showModalSedes = signal<boolean>(false);

  isLoadingDatosIniciales = signal<boolean>(false);

  breadCrumbItems: MenuItem[] = [
    {
      label: this.title,
    },
  ];

  breadCrumbHome: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/',
  };

  perfil = this._LocalStoreService.getItem('dremoPerfil');

  formMantenimiento = this._FormBuilder.nonNullable.group({
    iCredEntPerfId: [this.perfil?.iCredEntPerfId ?? null, Validators.required],
    iYAcadId: [this._ConstantesService.iYAcadId ?? null, Validators.required],
    iNivelTipoId: [null],
    iIieeId: [null],
    iSedeId: [null],
    iEstado: [null],
  });

  accionesSedes = signal<any[]>([
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-succes p-button-text',
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ]);

  public columnasSedes = signal<any[]>([
    {
      type: 'item',
      width: '0.5rem',
      field: 'index',
      header: 'Nro',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cSedeNombre',
      header: 'Nombre',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'cSedeDireccion',
      header: 'Dirección',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'cSedeTelefono',
      header: 'Teléfono',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '1rem',
      field: 'iEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '1rem',
      field: '',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ]);

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
            iEstado: Number(institucion.iEstado) === 2 ? 0 : institucion.iEstado,
            cTitulo: `${institucion.cIieeNombre} `,
            cImgUrl: institucion.cIieeLogo,
            cDescripcion: institucion.cIieeEmail || '-',
          }));

          this.instituciones.set([...instituciones]);
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }

  obtenerSedesIe(iIieeId) {
    if (!iIieeId) return;
    this.sedes.set([]);

    this._GestionUsuariosService.obtenerSedesInstitucionEducativa(iIieeId).subscribe({
      next: (respuesta: any) => {
        this.sedes.set(respuesta?.data || []);
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }

  obtenerInstituciones() {
    this.sedes.set([]);
    this.institucionesxiNivelTipoId.set([]);

    this.formMantenimiento.controls.iIieeId.setValue(null);
    this.formMantenimiento.controls.iSedeId.setValue(null);

    const { iNivelTipoId, iEstado } = this.formMantenimiento.value;

    const institucionesFiltradas = this.instituciones().filter(item => {
      const coincideNivel = iNivelTipoId == null || Number(item.iNivelTipoId) === iNivelTipoId;
      const coincideEstado = iEstado == null || Number(item.iEstado) === iEstado;
      return coincideNivel && coincideEstado;
    });

    this.institucionesxiNivelTipoId.set(institucionesFiltradas);
  }

  obtenerInformacionIE(evn) {
    this.institucionSeleccionada.set(evn);
    this.obtenerSedesIe(this.institucionSeleccionada()?.iIieeId);
  }

  abrirEnMaps() {
    if (this.institucionSeleccionada().cIieeNlat && this.institucionSeleccionada().cIieeNlog) {
      const url = `https://www.google.com/maps?q=${this.institucionSeleccionada().cIieeNlat},${this.institucionSeleccionada().cIieeNlog}`;
      window.open(url, '_blank');
    }
  }

  eliminarIE(item) {
    const data = item;
    this._ConfirmationModalService.openConfirm({
      header:
        '¿Esta seguro de eliminar la institución :  ' +
        data.cIieeNombre +
        ' - ' +
        data.cIieeCodigoModular +
        ' ?',
      accept: () => {
        const params = {
          esquema: 'acad',
          tabla: 'institucion_educativas',
          campo: 'iIieeId',
          valorId: data.iIieeId,
        };

        // Servicio para obtener los instructores
        this._GeneralService.deleteAcademico(params).subscribe({
          next: (resp: any) => {
            if (resp.validated) {
              this.messageService.add({
                severity: 'success',
                summary: 'Acción exitosa',
                detail: resp.message,
              });
              this.instituciones.set([]);
              this.getIntitucionEducativa();
              this.obtenerInstituciones();
            }
          },
          error: error => {
            this.mostrarErrores(error);
          },
        });
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Acción cancelada',
        });
      },
    });
  }

  eliminarSede(item) {
    const data = item;
    this._ConfirmationModalService.openConfirm({
      header: '¿Esta seguro de eliminar la sede :  ' + data.cSedeNombre + ' ?',
      accept: () => {
        const params = {
          esquema: 'acad',
          tabla: 'sedes',
          campo: 'iSedeId',
          valorId: data.iSedeId,
        };

        // Servicio para obtener los instructores
        this._GeneralService.deleteAcademico(params).subscribe({
          next: (resp: any) => {
            if (resp.validated) {
              this.messageService.add({
                severity: 'success',
                summary: 'Acción exitosa',
                detail: resp.message,
              });
              this.sedes.set([]);
              this.obtenerSedesIe(this.institucionSeleccionada()?.iIieeId);
            }
          },
          error: error => {
            this.mostrarErrores(error);
          },
        });
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Acción cancelada',
        });
      },
    });
  }

  accionBtn({ accion, item }: { accion: string; item?: any }): void {
    switch (accion) {
      case 'editar':
        this.itemSelectedSede.set(item);
        this.showModalSedes.set(true);
        break;
      case 'eliminar':
        this.eliminarSede(item);
        break;
    }
  }
}
