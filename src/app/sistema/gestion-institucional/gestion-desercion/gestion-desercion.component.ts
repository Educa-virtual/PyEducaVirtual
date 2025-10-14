import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';

import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { FormDesercionComponent } from './form-desercion/form-desercion.component';
import { HistorialDesercionComponent } from './historial-desercion/historial-desercion.component';

@Component({
  selector: 'app-gestion-desercion',
  standalone: true,
  imports: [
    ContainerPageComponent,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule,
    TablePrimengComponent,
    FormDesercionComponent,
    HistorialDesercionComponent,
  ],
  templateUrl: './gestion-desercion.component.html',
  styleUrl: './gestion-desercion.component.scss',
})
export class GestionDesercionComponent implements OnInit {
  //private backendApi: string = environment.backendApi;

  showModal: boolean = false;
  anio_actual: number;

  perfil: any;
  dremoiYAcadId: any;
  matriculas: any = [];
  matriculas_desercion: any = [];
  matriculas_activas: any = [];
  matriculas_filtradas: any = [];

  headerS: string = 'Formulario de registro de deserción';
  update: boolean = false;

  gradosSecciones: any[] = [];
  grados: any[] = [];
  secciones: any[] = [];
  iGradoId: string = '';
  iSeccionId: string = '';

  grado: string = '';

  estudiante: string = '';
  tipo_desercion: any[] = [];
  matricula: any = {};
  activeIndex: number = 0;
  deserciones: any[] = [];
  desercion: any = {};

  constructor(
    private messageService: MessageService,
    private store: LocalStoreService,
    private fb: FormBuilder,
    public query: GeneralService,
    private http: HttpClient // Inyectar HttpClient,
  ) {
    const usuario = this.store.getItem('dremoPerfil');

    this.perfil = usuario;
    this.dremoiYAcadId = this.store.getItem('dremoiYAcadId');
    this.anio_actual = store.getItem('dremoYear');
  }

  ngOnInit(): void {
    this.obtenerGradoSeccion();
    this.getDesercion();
    this.getTiposDesercion();
  }

  obtenerGradoSeccion() {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iSedeId: this.perfil.iSedeId,
          iYAcadId: this.dremoiYAcadId,
        }),
        _opcion: 'getGradoSeccionXiSedeIdXiYAcadId',
      })
      .subscribe({
        next: (data: any) => {
          this.gradosSecciones = data.data;
          this.grados = this.removeDuplicatesByiGradoId(this.gradosSecciones);
        },
        error: error => {
          this.messageService.add({
            summary: 'Mensaje de sistema',
            detail: 'Error al cargar secciones de IE.' + error.error.message,
            life: 3000,
            severity: 'error',
          });
        },
      });
  }

  removeDuplicatesByiGradoId(array: any[]): any[] {
    const seen = new Set<number>();
    return array.filter(item => {
      if (seen.has(item.iGradoId)) {
        return false;
      }
      seen.add(item.iGradoId);
      return true;
    });
  }

  getDesercion() {
    this.matricula = {};
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iSedeId: Number(this.perfil.iSedeId),
          iYAcadId: Number(this.dremoiYAcadId),
          iNivelGradoId: Number(this.iGradoId ?? 0),
          iSeccionId: Number(this.iSeccionId ?? 0),
        }),
        _opcion: 'getDeserciones',
      })
      .subscribe({
        next: (data: any) => {
          this.matriculas = data.data;
        },
        error: error => {
          this.messageService.add({
            summary: 'Mensaje de sistema',
            detail: 'Error al cargar deserciones de IE.' + error.error.message,
            life: 3000,
            severity: 'error',
          });
        },
        complete: () => {
          this.messageService.add({
            summary: 'Mensaje de sistema',
            detail: 'Carga de deserciones de IE exitosa.',
            life: 3000,
            severity: 'success',
          });

          this.matriculas_desercion = this.matriculas.filter(
            (matricula: any) => matricula.iMatrEstado === '3'
          );
          //matriculas activas
          const gradoId = Number(this.iGradoId);
          const seccionId = Number(this.iSeccionId);

          this.matriculas_activas = this.matriculas.filter((matricula: any) => {
            const activo = String(matricula.iMatrEstado) === '1';
            const mismoGrado = gradoId > 0 ? Number(matricula.iNivelGradoId) === gradoId : true;
            const mismaSeccion = seccionId > 0 ? Number(matricula.iSeccionId) === seccionId : true;
            return activo && mismoGrado && mismaSeccion;
          });

          // Obtener el nombre del grado (solo si hay un grado seleccionado)
          if (gradoId > 0) {
            const nivel = this.grados.find(n => Number(n.iGradoId) === gradoId);
            this.grado = nivel?.cGradoNombre ?? '';
          }
          this.matriculas_filtradas = this.matriculas_activas;
        },
      });
  }

  obtenerSecciones() {
    this.secciones = this.gradosSecciones.filter(item => item.iGradoId === this.iGradoId);
    // this.formDesercion.get('iNivelGradoId')?.setValue(this.iGradoId); // Reiniciar el valor del dropdown de secciones
  }

  accionBtnItem(elemento: any): void {
    const { accion, item } = elemento;
    switch (accion) {
      case 'mostrar':
        this.update = false;
        this.headerS = 'Formulario para agregar deserciones.';
        // this.formDesercion.get('cSeccion')?.enable();
        // this.formDesercion.get('iNivelGradoId')?.enable();
        this.showModal = true;
        break;

      case 'guardar':
        this.matricula = {};
        this.update = false;
        this.headerS = 'Formulario para agregar nueva deserciones (' + this.grado + ')';
        this.showModal = true;
        this.desercion = {};
        // this.deserciones = [];
        this.selectTab(0);
        this.getDesercion();

        break;

      case 'registrar':
        this.addDesercion(item);
        break;

      case 'agregar':
        this.matricula = item;
        this.deserciones = [];
        this.selectTab(1);
        this.getDesercionesByMatriculaActivas(item.iMatrId);
        break;

      case 'actualizar':
        this.updDesercion(item);
        this.showModal = false;
        break;

      case 'imprimir':
        this.imprimirDeserciones();
        break;

      case 'cerrar':
        this.showModal = false;
        this.matricula = {};
        break;

      case 'historial':
        this.matricula = {};
        // this.deserciones = [];

        this.update = true;
        this.headerS = 'Formulario de historial de deserción.';
        this.iGradoId = item.iNivelGradoId;
        this.iSeccionId = item.iSeccionId;
        this.matricula = item;
        this.showModal = true;
        this.getDesercionesByMatricula(item.iMatrId);
        break;

      case 'editar_desercion':
        this.desercion = {};
        this.update = true;
        this.headerS = 'Formulario de editar deserción.';
        this.matriculas_filtradas = this.matriculas_desercion;
        this.desercion = item;

        break;
      default:
        break;
    }
  }

  addDesercion(item) {
    const params: any = {
      iMatrId: item.iMatrId,
      iTipoDesercionId: item.iTipoDesercionId,
      cMotivoDesercion: item.cMotivoDesercion,
      dInicioDesercion: item.dInicioDesercion,
      dFinDesercion: item.dFinDesercion,
      iEstado: Number(item.iEstado ?? 0),
      iSesionId: Number(this.perfil.iCredId),
    };
    this.query
      .addCalAcademico({
        json: JSON.stringify(params),
        _opcion: 'addDesercion',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error.' + error.error.message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje',
            detail: 'Proceso exitoso',
          });
          //this.showModal = false;
          this.getDesercion();
          //  this.getPerfilUsuario(this.usuario)
        },
      });
  }
  updDesercion(item: any) {
    const params: any = {
      iDesercionId: item.iDesercionId,
      iMatrId: item.iMatrId,
      iTipoDesercionId: item.iTipoDesercionId,
      cMotivoDesercion: item.cMotivoDesercion,
      dInicioDesercion: item.dInicioDesercion,
      dFinDesercion: item.dFinDesercion,
      iEstado: Number(item.iEstado ?? 0),
      iSesionId: Number(this.perfil.iCredId),
    };
    this.query
      .updateCalAcademico({
        json: JSON.stringify(params),
        _opcion: 'updateDesercion',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error.' + error.error.message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje',
            detail: 'Proceso exitoso',
          });
          //this.showModal = false;
          this.getDesercion();
        },
      });
  }

  imprimirDeserciones() {
    //actualizar
    const params = {
      petition: 'post',
      group: 'acad',
      prefix: 'gestionInstitucional',
      ruta: 'reportePDFResumenVacantes',
      data: {
        deserciones: this.matriculas,
        perfil: this.perfil,
        anio_actual: this.anio_actual,
      },
    };

    this.query.generarPdf(params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_deserciones.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      complete: () => {},
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: 'Error en el procesamiento: ' + error.error.message,
        });
      },
    });
  }

  getTiposDesercion() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'tipo_deserciones',
        campos: '*',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.tipo_desercion = data.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'danger',
            summary: 'Mensaje del Sistema',
            detail: 'Error. al cargar los datos del horario: ' + error.error.message,
          });
        },
      });
  }

  getDesercionesByMatricula(iMatrId: number) {
    const registro = this.matriculas_desercion.filter(
      (desercion: any) => desercion.iMatrId === iMatrId
    );
    this.deserciones = JSON.parse(registro[0].deserciones ?? []);
  }

  getDesercionesByMatriculaActivas(iMatrId: number) {
    const registro = this.matriculas_activas.filter(
      (desercion: any) => desercion.iMatrId === iMatrId
    );
    this.deserciones = JSON.parse(registro[0].deserciones ?? []);
  }
  // Cambiar de pestaña desde otro componente o botón
  selectTab(index: number) {
    this.activeIndex = index;
  }
  changeGrado() {
    const gradoId = Number(this.iGradoId);
    const nivel = this.grados.find(n => Number(n.iGradoId) === gradoId);
    this.grado = nivel?.cGradoNombre ?? '';
  }

  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Registrar deserciones',
      text: 'Registrar deserciones',
      icon: 'pi pi-save',
      accion: 'mostrar',
      class: 'p-button-primary',
    },
    {
      labelTooltip: 'Imprimir deserciones',
      text: 'Imprimir deserciones',
      icon: 'pi pi-print',
      accion: 'imprimir',
      class: 'p-button-danger',
    },
  ];
  //----------------------------------------
  selectedItems = [];

  actions: IActionTable[] = [
    {
      labelTooltip: 'Mostrar historial',
      icon: 'pi pi-address-book',
      accion: 'historial',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      // isVisible: rowData => {
      //   return rowData.iEstado !== '1'; // Mostrar solo si el estado es 1 (activo)
      // },
    },
  ];

  actionsValidar: IActionTable[] = [
    {
      labelTooltip: 'agregar',
      icon: 'pi pi-check',
      accion: 'agregar',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
  ];

  columns: IColumn[] = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: 'Item',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'cEstCodigo',
      header: 'Código',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'cPersDocumento',
      header: 'Dni / CE',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '12rem',
      field: 'estudiante',
      header: 'Estudiante',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '4rem',
      field: 'cSeccionNombre',
      header: 'Sec',
      text_header: 'center',
      text: 'left',
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
