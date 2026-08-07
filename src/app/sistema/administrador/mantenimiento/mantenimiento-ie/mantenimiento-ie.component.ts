import { Component, OnInit, signal } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { AgregarMantenimientoIeComponent } from './agregar-mantenimiento-ie/agregar-mantenimiento-ie.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { MantenimientoIeService } from './mantenimiento-ie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mantenimiento-ie',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, AgregarMantenimientoIeComponent],
  templateUrl: './mantenimiento-ie.component.html',
  styleUrl: './mantenimiento-ie.component.scss',
})
export class MantenimientoIeComponent implements OnInit {
  iYAcadId: number;
  perfil: any;

  formFiltroIe: FormGroup;
  formApertura: FormGroup;

  nivel_tipos: Array<object> = [];
  zonas: Array<object> = [];
  tipos_sectores: Array<object> = [];
  ugeles: Array<object> = [];
  provincias: Array<object> = [];
  distritos: Array<object> = [];

  instituciones: any[] = [];
  instituciones_filtradas: any[] = [];
  sedes: any[] = [];

  loading: boolean = false;
  institucionSeleccionada = signal<any>({});
  itemSelected = signal<any | null>(null);
  itemSelectedSede = signal<any | null>(null);

  institucionesxiNivelTipoId = signal<any[]>([]);

  showModal = signal<boolean>(false);
  showModalSedes = signal<boolean>(false);

  showDialogConfirmacion: boolean = false;
  sede: any = {};

  activeTab: number = 0;

  isLoadingDatosIniciales = signal<boolean>(false);

  bUpdateInstitucion = false;

  breadCrumbHome: MenuItem = { icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [{ label: 'Gestionar Instituciones Educativas' }];

  constructor(
    private store: LocalStoreService,
    private ieService: MantenimientoIeService,
    private confirmService: ConfirmationModalService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
  }

  ngOnInit() {
    try {
      this.formFiltroIe = this.fb.nonNullable.group({
        iNivelTipoId: [null],
        iEstado: [null],
        iUgelId: [null],
        cTextoBusqueda: [''],
      });
    } catch (error) {
      console.error(error, 'Error al inicializar el formulario');
    }
    this.ieService.crearInstitucionEducativa({}).subscribe((data: any) => {
      this.nivel_tipos = this.ieService.getNivelTipos(data?.nivel_tipos);
      this.zonas = this.ieService.getZonas(data?.zonas);
      this.tipos_sectores = this.ieService.getTiposSectores(data?.tipos_sectores);
      this.ugeles = this.ieService.getUgeles(data?.ugeles);
      this.provincias = this.ieService.getProvincias(data?.provincias);
      this.distritos = this.ieService.getDistritos(data?.distritos);
    });
    this.listarInstitucionesEducativas();
  }

  filtrarIes() {
    const textoBusqueda = this.formFiltroIe.value.cTextoBusqueda;
    const iUgelId = this.formFiltroIe.value.iUgelId;
    const iNivelTipoId = this.formFiltroIe.value.iNivelTipoId;
    const iEstado = this.formFiltroIe.value.iEstado;
    this.instituciones_filtradas = this.instituciones.filter(institucion => {
      if (iNivelTipoId && Number(institucion.iNivelTipoId) !== Number(iNivelTipoId)) {
        return null;
      }
      if (iUgelId && Number(institucion.iUgelId) !== Number(iUgelId)) {
        return null;
      }
      if (iEstado && Number(institucion.iEstado) !== Number(iEstado)) {
        return null;
      }
      if (textoBusqueda) {
        if (
          institucion.cIieeCodigoModular &&
          institucion.cIieeCodigoModular.toLowerCase().includes(textoBusqueda.toLowerCase())
        )
          return institucion;
        if (
          institucion.cIieeNombre &&
          institucion.cIieeNombre.toLowerCase().includes(textoBusqueda.toLowerCase())
        )
          return institucion;
        if (
          institucion.cNivelTipoNombre &&
          institucion.cNivelTipoNombre.toLowerCase().includes(textoBusqueda.toLowerCase())
        )
          return institucion;
        if (
          institucion.cUgelNombre &&
          institucion.cUgelNombre.toLowerCase().includes(textoBusqueda.toLowerCase())
        )
          return institucion;
        return null;
      } else {
        return institucion;
      }
    });
    return null;
  }

  listarInstitucionesEducativas() {
    this.ieService.listarInstitucionesEducativas({}).subscribe({
      next: (data: any) => {
        this.instituciones = data.data;
        this.instituciones_filtradas = this.instituciones;
      },
      error: (error: any) => {
        console.error(error.error.message);
      },
    });
  }

  obtenerInformacionIE(evn) {
    this.institucionSeleccionada.set(evn);
    this.listarSedes();
    //Se agrego una nueva variable
  }

  abrirEnMaps(item: any) {
    if (item.cIieeNlat && item.cIieeNlog) {
      const url = `https://www.google.com/maps?q=${item.cIieeNlat},${item.cIieeNlog}`;
      window.open(url, '_blank');
    }
  }

  eliminarInstitucionEducativa(item) {
    this.ieService
      .eliminarInstitucionEducativa({
        iIieeId: item.iIieeId,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Acción exitosa',
            detail: 'Institución eliminada correctamente',
          });
          this.listarInstitucionesEducativas();
        },
        error: error => {
          console.error('Error al eliminar la institución:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al eliminar la institución',
            detail: 'Institución no eliminada',
          });
        },
      });
  }

  listarSedes() {
    this.ieService
      .listarSedes({
        iIieeId: this.institucionSeleccionada().iIieeId,
      })
      .subscribe({
        next: (data: any) => {
          this.sedes = data.data;
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
        },
      });
  }

  eliminarSede(item) {
    this.ieService
      .eliminarSede({
        iSedeId: item.iSedeId,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Acción exitosa',
            detail: 'Sede eliminada correctamente',
          });
          this.listarSedes();
        },
        error: error => {
          console.error('Error al eliminar la sede:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al eliminar la sede',
            detail: 'Sede no eliminada',
          });
        },
      });
  }

  agregarInstitucion() {
    this.formFiltroIe.value.iNivelTipoId ? this.showModal.set(true) : null;
    this.isLoadingDatosIniciales.set(true);
    this.itemSelected.set(null);
    this.institucionSeleccionada.set(null);
  }

  actualizarItem(itemActualizado: any) {
    const nuevaLista = this.institucionesxiNivelTipoId().map(inst =>
      inst.iIieeId === itemActualizado.iIieeId ? itemActualizado : inst
    );
    this.institucionesxiNivelTipoId.set([...nuevaLista]); // 👈 Nueva referencia
  }

  accionBtnInstituciones({ accion, item }) {
    switch (accion) {
      case 'sedes':
        this.router.navigate([`administrador/mantenimiento-ie/${item.iIieeId}/sedes`]);
        break;
      case 'editar':
        this.showModal.set(true);
        this.itemSelected.set(item);
        this.institucionSeleccionada.set(item);
        this.isLoadingDatosIniciales.set(true);
        break;
      case 'mapa':
        this.abrirEnMaps(item);
        break;
    }
  }

  /* Datos de tabla IEs */
  columnas: IColumn[] = [
    {
      type: 'text',
      width: '10%',
      field: 'cIieeCodigoModular',
      header: 'Codigo modular',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '30%',
      field: 'cIieeNombre',
      header: 'Institución Educativa',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cNivelTipoNombre',
      header: 'Nivel',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '20%',
      field: 'cUgelNombre',
      header: 'UGEL',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'estado-activo',
      width: '10%',
      field: 'iEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '15%',
      field: 'acciones',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];

  acciones: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Gestionar sedes',
      icon: 'pi pi-list',
      accion: 'sedes',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
    {
      labelTooltip: 'Ver en mapa',
      icon: 'pi pi-map-marker',
      accion: 'mapa',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];

  columnasSedes: IColumn[] = [
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
      width: '35%',
      field: 'cSedeNombre',
      header: 'Nombre',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '25%',
      field: 'cSedeDireccion',
      header: 'Dirección',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cSedeTelefono',
      header: 'Teléfono',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '10%',
      field: 'iEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '10%',
      field: '',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
