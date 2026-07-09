import { Component, OnInit, signal } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { GeneralService } from '@/app/servicios/general.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { DatosInformesService } from '@/app/sistema/ere/services/datos-informes.service';
import { GestionUsuariosService } from '../../gestion-usuarios/services/gestion-usuarios.service';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { AgregarMantenimientoIeComponent } from './agregar-mantenimiento-ie/agregar-mantenimiento-ie.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { FormSedesComponent } from './form-sedes/form-sedes.component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-mantenimiento-ie',
  standalone: true,
  imports: [
    PrimengModule,
    TablePrimengComponent,
    AgregarMantenimientoIeComponent,
    FormSedesComponent,
  ],
  templateUrl: './mantenimiento-ie.component.html',
  styleUrl: './mantenimiento-ie.component.scss',
})
export class MantenimientoIeComponent implements OnInit {
  title: string = 'Mantenimiento Instituciones Educativas';
  loading: boolean = false;
  institucionSeleccionada = signal<any>({});
  itemSelected = signal<any | null>(null);
  itemSelectedSede = signal<any | null>(null);

  nivelTipos = signal<any[]>([]);
  instituciones: any[] = [];

  institucionesxiNivelTipoId = signal<any[]>([]);

  sedes = signal<any[]>([]);
  showModal = signal<boolean>(false);
  showModalSedes = signal<boolean>(false);

  showDialogConfirmacion: boolean = false;
  sede: any = {};
  periodos: any = [];

  activeTab: number = 0;

  isLoadingDatosIniciales = signal<boolean>(false);

  bUpdateInstitucion = false;

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

  constructor(
    private _LocalStoreService: LocalStoreService,
    private _GeneralService: GeneralService,
    private _ConstantesService: ConstantesService,
    private _GestionUsuariosService: GestionUsuariosService,
    private _DatosInformesService: DatosInformesService,
    private _ConfirmationModalService: ConfirmationModalService,
    private _FormBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  columnas: IColumn[] = [
    {
      type: 'item',
      width: '10%',
      field: 'index',
      header: 'Nro',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '50%',
      field: 'cTitulo',
      header: 'Código modular - Institución Educativa',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '20%',
      field: 'cNivelDescripcion',
      header: 'Descripción',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'actions',
      width: '15%',
      field: 'acciones',
      header: 'Acciones',
      text_header: 'left',
      text: 'left',
    },
  ];

  acciones: IActionTable[] = [
    {
      labelTooltip: 'Seleccionar',
      icon: 'pi pi-arrow-right',
      accion: 'seleccionar',
      type: 'item',
      class: 'p-button-rounded p-button-info p-button-text',
    },
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];

  onAccionBtn(event: { accion: string; item: any }) {
    switch (event.accion) {
      case 'seleccionar':
        this.institucionSeleccionada.set(event.item);
        this.obtenerInformacionIE(event.item);
        this.activeTab = 1;
        break;
      case 'editar':
        this.showModal.set(true);
        this.itemSelected.set(event.item);
        this.institucionSeleccionada.set(event.item);
        this.isLoadingDatosIniciales.set(true);
        break;
    }
  }

  formMantenimiento = this._FormBuilder.nonNullable.group({
    iCredEntPerfId: [this.perfil?.iCredEntPerfId ?? null, Validators.required],
    iYAcadId: [this._ConstantesService.iYAcadId ?? null, Validators.required],
    iNivelTipoId: [null],
    iIieeId: [null],
    iSedeId: [null],
    iEstado: [null],
  });

  formApertura = this._FormBuilder.nonNullable.group({
    iCredId: [this.perfil?.iCredId ?? null, Validators.required],
    iCredEntPerfId: [this.perfil?.iCredEntPerfId ?? null, Validators.required],
    iPerioEvalId: [0, Validators.required],
    iYAcadId: [this._ConstantesService.iYAcadId ?? null, Validators.required],
  });

  accionesSedes = signal<any[]>([
    {
      labelTooltip: 'Aperturar calendario',
      icon: 'pi pi-power-off',
      accion: 'aperturar',
      type: 'item',
      class: 'p-button-rounded p-button-succes p-button-text',
    },
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
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
    this.getPeriodosEvaluacion();
    // this.getIntitucionEducativa();
  }

  getNivelTipos() {
    this._DatosInformesService
      .obtenerParametros(this.formMantenimiento.value)
      .subscribe((data: any) => {
        this.nivelTipos.set(this._DatosInformesService.getNivelesTipos(data?.nivel_tipos));
      });
  }

  actionInstituciones(event: { action: string }) {
    switch (event.action) {
      case 'editar_iiee':
        this.refrecarIntitucionEducativa();
        this.getIntitucionEducativa();
        this.bUpdateInstitucion = true;
        break;
      case 'agregar_iiee':
        this.instituciones = null;
        this.getIntitucionEducativa();
        this.obtenerInstituciones();
        this.bUpdateInstitucion = false;
        break;
    }
  }

  refrecarIntitucionEducativa() {
    const where = 'iIieeId = ' + String(this.institucionSeleccionada()?.iIieeId);

    this._GeneralService
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'institucion_educativas',
        campos: '*',
        condicion: where,
      })
      .subscribe({
        next: (data: any) => {
          const item = data.data[0] || {};
          this.institucionSeleccionada.set(item);
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
        },
        complete: () => {
          // this.getIntitucionEducativa();
          const lista = this.institucionesxiNivelTipoId();
          const seleccionado = this.institucionSeleccionada();

          const actualizarInstituciones = lista.map(inst => {
            if (inst.iIieeId === seleccionado.iIieeId) {
              // Combina el registro anterior con los nuevos datos
              return { ...inst, ...seleccionado };
            }
            return inst;
          });

          this.obtenerInstituciones();

          this.institucionesxiNivelTipoId.set(actualizarInstituciones);

          this.institucionSeleccionada.set(seleccionado);

          this.obtenerInformacionIE(seleccionado);
        },
      });
  }

  getIntitucionEducativa() {
    return this._GeneralService
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'institucion_educativas',
        campos: '*',
        condicion: '1=1',
      })
      .pipe(
        map((data: any) => {
          const instituciones = (data.data ?? []).map((institucion: any) => ({
            ...institucion,
            iEstado: Number(institucion.iEstado) === 2 ? 0 : institucion.iEstado,
            cTitulo: `${institucion.cIieeNombre} `,
            cImgUrl: institucion.cIieeLogo,
            cDescripcion: institucion.cIieeEmail || '-',
          }));

          // actualizamos la señal
          this.instituciones = instituciones;
          return instituciones; // ✅ devolvemos el resultado
        }),
        catchError(error => {
          console.error('Error obteniendo datos:', error);
          return of([]); // devolvemos un observable vacío para evitar que rompa
        })
      );
  }

  obtenerSedesIe(iIieeId) {
    if (!iIieeId) return;
    this.sedes.set([]);

    this._GestionUsuariosService.obtenerSedesInstitucionEducativa(iIieeId).subscribe({
      next: (respuesta: any) => {
        this.sedes.set(respuesta?.data || []);
      },
      error: error => {
        console.error('Error obteniendo datos:', error);
      },
    });
  }

  obtenerInstituciones() {
    this.getIntitucionEducativa().subscribe(instituciones => {
      //  console.log('✅ Finalizó la carga', instituciones);
      this.sedes.set([]);
      this.institucionesxiNivelTipoId.set(null);
      this.formMantenimiento.controls.iIieeId.setValue(null);
      this.formMantenimiento.controls.iSedeId.setValue(null);

      console.log(instituciones, 'instituciones');

      const { iNivelTipoId, iEstado } = this.formMantenimiento.value;
      const institucionesFiltradas = instituciones.filter(item => {
        const coincideNivel = iNivelTipoId == null || Number(item.iNivelTipoId) === iNivelTipoId;
        //Nueva condicion para filtrar
        const estadoFiltro = iEstado != null ? Number(iEstado) : null;

        const coincideEstado =
          estadoFiltro == null
            ? true
            : estadoFiltro === 1
              ? Number(item.iEstado) === 1
              : Number(item.iEstado) !== 1;

        //Validar formulario
        const estado = this.formMantenimiento.value.iEstado;
        this.formMantenimiento.patchValue({
          iEstado: estado === '1' ? '1' : '0',
        });

        return coincideNivel && coincideEstado;
      });

      //console.log('✅ Filtrado después de cargar instituciones', institucionesFiltradas);
      this.institucionesxiNivelTipoId.set(institucionesFiltradas);
    });
  }

  obtenerInformacionIE(evn) {
    this.institucionSeleccionada.set(evn);
    this.obtenerSedesIe(this.institucionSeleccionada()?.iIieeId);
    //Se agrego una nueva variable
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
              this.instituciones = null;
              this.getIntitucionEducativa();
              this.obtenerInstituciones();
            }
          },
          error: error => {
            console.error('Error obteniendo datos:', error);
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

  generarCalendario() {
    // Lógica para generar el calendario
    const data = this.sede;

    this._ConfirmationModalService.openConfirm({
      header: '¿Esta seguro que quiere aperturar calendario a :  ' + data.cSedeNombre + ' ?',
      accept: () => {
        const params = {
          iCredId: this.formApertura.value.iCredId ?? null,
          iCredEntPerfId: this.formApertura.value.iCredEntPerfId ?? null,
          iPerioEvalId: this.formApertura.value.iPerioEvalId ?? null,
          iYAcadId: this.formApertura.value.iYAcadId ?? null,
          iSedeId: data.iSedeId ?? null,
        };

        // Servicio para obtener los instructores
        this._GeneralService.aperturarSede(params).subscribe({
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
            let message = error?.error?.message || 'Sin conexión a la bd';
            const match = message.match(/]([^\]]+?)\./);
            if (match && match[1]) {
              message = match[1].trim() + '.';
            }
            message = decodeURIComponent(message);
            this.messageService.add({
              severity: 'error',
              summary: 'Mensaje del sistema',
              detail: message,
            });
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
            console.error('Error obteniendo datos:', error);
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

  getPeriodosEvaluacion() {
    this._GeneralService.getPeriodos().subscribe({
      next: (data: any) => {
        this.periodos = data.data || [];
      },
      error: error => {
        console.error('Error obteniendo datos:', error);
      },
    });
  }

  accionBtn({ accion, item }: { accion: string; item?: any }): void {
    //sede
    switch (accion) {
      case 'agregarIE':
        this.formMantenimiento.value.iNivelTipoId ? this.showModal.set(true) : null;
        this.isLoadingDatosIniciales.set(true);
        this.itemSelected.set(null);
        this.institucionSeleccionada.set(null);

        break;
      case 'agregar':
        this.formMantenimiento.controls.iIieeId.setValue(this.institucionSeleccionada()?.iIieeId);
        this.itemSelectedSede.set([]);
        //this.sedes.set([]);
        this.showModalSedes.set(true);

        this.institucionSeleccionada().set({});
        break;
      case 'editar':
        this.itemSelectedSede.set(item);
        console.log(this.itemSelectedSede());
        this.showModalSedes.set(true);

        break;
      case 'eliminar':
        this.eliminarSede(item);
        break;
      case 'aperturar':
        this.sede = item;
        this.formApertura.get('iPerioEvalId')?.setValue(null);

        this.itemSelectedSede.set(item);
        this.showDialogConfirmacion = true;
        break;
    }
  }

  actualizarItem(itemActualizado: any) {
    const nuevaLista = this.institucionesxiNivelTipoId().map(inst =>
      inst.iIieeId === itemActualizado.iIieeId ? itemActualizado : inst
    );
    this.institucionesxiNivelTipoId.set([...nuevaLista]); // 👈 Nueva referencia
  }
}
