import { Component, inject, Input, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';

import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { DatosMatriculaService } from '../../services/datos-matricula.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneralService } from '@/app/servicios/general.service';
import { MatriculaApoderadoComponent } from '../matricula-apoderado/matricula-apoderado.component';
import { FormDesercionComponent } from '../../gestion-desercion/form-desercion/form-desercion.component';
import { HistorialDesercionComponent } from '../../gestion-desercion/historial-desercion/historial-desercion.component';

@Component({
  selector: 'app-gestionar-matriculas',
  standalone: true,
  imports: [
    PrimengModule,
    InputNumberModule,
    TablePrimengComponent,
    MatriculaApoderadoComponent,
    FormDesercionComponent,
    HistorialDesercionComponent,
  ],
  templateUrl: './gestionar-matriculas.component.html',
  styleUrl: './gestionar-matriculas.component.scss',
})
export class GestionMatriculasComponent implements OnInit {
  @Input() soloLectura: boolean = false;
  @Input() titulo: string;
  form: FormGroup;
  sede: any[];
  iSedeId: number;
  iYAcadId: number;
  matriculas: any[];
  matriculas_filtradas: any[];
  option: boolean = false;
  iEstudianteId: number = 0; //id del estudiante

  visible: boolean = false; //mostrar dialogo
  caption: string = ''; // titulo o cabecera de dialogo
  c_accion: string; //valos de las acciones
  bApoderado: boolean = false; //para mostrar el formulario de apoderado

  tipos_matriculas: Array<object>;
  grados_secciones_turnos: Array<object>;
  tipo_documentos: Array<object>;
  nivel_grados: Array<object>;
  turnos: Array<object>;
  secciones: Array<object>;
  tipo_matriculas: Array<object>;
  estados_civiles: Array<object>;
  sexos: Array<object>;
  iCredId: number;

  tipo_desercion: any[];
  visible_desercion: boolean = false;
  matricula: any = {};
  grado: string = '';
  update: boolean = false;
  desercion: any = {};
  activeIndex: number = 0;
  deserciones: any[] = [];

  breadCrumbHome = { icon: 'pi pi-home', routerLink: '/' };
  breadCrumbItems: MenuItem[] = [
    {
      label: 'Gestionar matrículas',
    },
  ];

  selectedItems = [];
  estudianteSeleccionado: any;
  estudianteNombreCompleto: string;

  actionsLista: IActionTable[];

  actions: IActionTable[] = [];
  columns = [
    {
      type: 'date',
      width: '10%',
      field: 'dtMatrFecha',
      header: 'Fecha',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cEstCodigo',
      header: 'Código',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cPersTipoNumDocumento',
      header: 'Documento',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '25%',
      field: 'cPersNombreCompleto',
      header: 'Estudiante',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cGrado',
      header: 'Grado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5%',
      field: 'cSeccionNombre',
      header: 'Seccion',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cTurnoNombre',
      header: 'Turno',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'tag',
      width: '10%',
      field: 'cTipoEstadoMatricula',
      header: 'Estado',
      text_header: 'center',
      styles: {
        Definitivo: 'success',
        Traslado: 'danger',
        Abandono: 'danger',
        'En proceso': 'warning',
      },
      text: 'center',
    },
    {
      type: 'dropdown-actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
  private _MessageService = inject(MessageService); // dialog Mensaje simple
  private _confirmService = inject(ConfirmationModalService); // componente de dialog mensaje

  constructor(
    private router: Router,
    private query: GeneralService,
    private store: LocalStoreService,
    private constantesService: ConstantesService,
    private datosMatriculaService: DatosMatriculaService,
    private fb: FormBuilder
  ) {
    const perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.iSedeId = perfil.iSedeId;
  }

  ngOnInit(): void {
    if (this.soloLectura) {
      this.actions = [
        {
          labelTooltip: 'Ver apoderados',
          icon: 'pi pi-eye',
          accion: 'apoderado',
          type: 'item',
          class: 'p-menuitem-link text-primary',
        },
      ];
    } else {
      this.actions = [
        {
          labelTooltip: 'Editar matrícula',
          icon: 'pi pi-pencil',
          accion: 'editar',
          type: 'item',
          class: 'p-menuitem-link text-orange-500',
        },
        {
          labelTooltip: 'Agregar deserción',
          icon: 'pi pi-ban',
          accion: 'desercion',
          type: 'item',
          class: 'p-menuitem-link text-red-500',
        },
        {
          labelTooltip: 'Gestionar apoderados',
          icon: 'pi pi-user-plus',
          accion: 'apoderado',
          type: 'item',
          class: 'p-menuitem-link text-primary',
        },
      ];
    }

    try {
      this.form = this.fb.group({
        iNivelGradoId: [null],
        iTurnoId: [null],
        iSeccionId: [null],
        iTipoMatrId: [null],
      });
    } catch (error) {
      console.log(error, 'error de formulario');
    }
    this.listarMatriculas();

    this.form.get('iNivelGradoId').valueChanges.subscribe(value => {
      this.filtrarTabla();
      this.secciones = [];
      this.turnos = [];
      this.form.get('iTurnoId')?.setValue(null);
      this.form.get('iSeccionId')?.setValue(null);
      if (value) {
        this.filterTurnos(value);
      }
    });
    this.form.get('iTurnoId').valueChanges.subscribe(value => {
      this.filtrarTabla();
      this.secciones = [];
      this.form.get('iSeccionId')?.setValue(null);
      if (value) {
        const iNivelGradoId = this.form.get('iNivelGradoId')?.value;
        this.filterSecciones(iNivelGradoId, value);
      }
    });

    this.form.get('iSeccionId').valueChanges.subscribe(() => {
      this.filtrarTabla();
    });

    this.form.get('iTipoMatrId').valueChanges.subscribe(() => {
      this.filtrarTabla();
    });
  }

  filtrarTabla() {
    if (!this.matriculas) {
      return [];
    }
    const iNivelGradoId = this.form.get('iNivelGradoId')?.value;
    const iTurnoId = this.form.get('iTurnoId')?.value;
    const iSeccionId = this.form.get('iSeccionId')?.value;
    const iTipoMatrId = this.form.get('iTipoMatrId')?.value;
    this.matriculas_filtradas = this.matriculas.filter(matricula => {
      if (iNivelGradoId && matricula.iNivelGradoId !== iNivelGradoId) {
        return null;
      }
      if (iTurnoId && matricula.iTurnoId !== iTurnoId) {
        return null;
      }
      if (iSeccionId && matricula.iSeccionId !== iSeccionId) {
        return null;
      }
      if (iTipoMatrId && matricula.iTipoMatrId !== iTipoMatrId) {
        return null;
      }
      return matricula;
    });
    return null;
  }

  accionBtnItemTable({ accion, item }) {
    if (accion === 'editar') {
      const iMatrId = item?.iMatrId;
      this.router.navigate([`/gestion-institucional/matricula-individual/${iMatrId}/editar`]);
    }
    if (accion === 'apoderado') {
      this.iEstudianteId = item?.iEstudianteId;
      this.estudianteNombreCompleto = item?.cPersNombreCompleto;
      this.iCredId = this.constantesService.iCredId;
      this.estudianteSeleccionado = item;
      this.bApoderado = true; // muestra dialogo de apoderado
    }

    if (accion === 'actualizar') {
      this.updDesercion(item);

      //this.visible_desercion = false;
    }

    if (accion === 'registrar') {
      this.addDesercion(item);
      //this.visible_desercion = false;
    }
    if (accion === 'editar_desercion') {
      this.desercion = {};
      this.update = true;
      this.caption = 'Actualizar deserción de : ' + this.matricula.cPersNombreCompleto;
      this.desercion = item;
    }

    if (accion === 'desercion') {
      this.caption = 'Agregar deserción de : ' + item?.cPersNombreCompleto;
      this.c_accion = 'agregar';
      this.matricula = item;
      this.iEstudianteId = item?.iEstudianteId;
      this.visible_desercion = true;
      this.grado = item.cGradoNombre;
      //this.getDesercionesByMatricula(item);
      this.getDesercion(item.iMatrId);
    }

    if (accion === 'anular') {
      this._confirmService.openConfirm({
        message: '¿Está seguro de anular la matrícula seleccionada?',
        header: 'Anular matrícula',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.borrarMatricula(item?.iMatrId);
        },
      });
    }
  }
  accionBtnItem(accion) {
    switch (accion) {
      case 'agregar':
        this.router.navigate(['/gestion-institucional/matricula-individual']);
        break;
    }
  }

  limpiarModalApoderado() {
    this.bApoderado = false;
    this.iEstudianteId = null;
    this.estudianteSeleccionado = null;
    this.estudianteNombreCompleto = null;
  }

  listarMatriculas() {
    this.datosMatriculaService
      .listarMatriculas({
        iSedeId: this.iSedeId,
        iYAcadId: this.iYAcadId,
        iCredSesionId: this.constantesService.iCredId,
      })
      .subscribe({
        next: (data: any) => {
          this.matriculas = data.data;
          this.matriculas_filtradas = this.matriculas;
        },
        error: error => {
          console.error('Error al obtener matriculas:', error);
        },
        complete: () => {},
      });
  }

  searchGradoSeccionTurno() {
    this.datosMatriculaService
      .searchGradoSeccionTurno({
        opcion: 'TODO',
        iSedeId: this.iSedeId,
        iYAcadId: this.iYAcadId,
        iCredSesionId: this.constantesService.iCredId,
      })
      .subscribe({
        next: (data: any) => {
          this.grados_secciones_turnos = data.data;
          this.filterGrados();
        },
        error: error => {
          console.error('Error consultando nivel grados:', error);
        },
      });
  }

  getDesercion(iMatrId: number) {
    this.deserciones = [];
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iMatrId: iMatrId,
        }),
        _opcion: 'getDesercionesMatriculas',
      })
      .subscribe({
        next: (data: any) => {
          this.deserciones = data.data;
        },
        error: error => {
          this._MessageService.add({
            summary: 'Mensaje de sistema',
            detail: 'Error al cargar deserciones de IE.' + error.error.message,
            life: 3000,
            severity: 'error',
          });
        },
        complete: () => {},
      });
  }

  filterGrados() {
    this.nivel_grados = this.grados_secciones_turnos.reduce((prev: any, current: any) => {
      const x = prev.find(item => item.id === current.iNivelGradoId);
      if (!x) {
        return prev.concat([
          {
            id: current.iNivelGradoId,
            nombre: current.cGradoAbreviacion + ' ' + current.cGradoNombre,
          },
        ]);
      } else {
        return prev;
      }
    }, []);
  }

  filterTurnos(iNivelGradoId: any) {
    this.turnos = this.grados_secciones_turnos.reduce((prev: any, current: any) => {
      const x = prev.find(
        item => item.id === current.iTurnoId && item.nombre === current.cTurnoNombre
      );
      if (!x && current.iNivelGradoId === iNivelGradoId) {
        return prev.concat([
          {
            id: current.iTurnoId,
            nombre: current.cTurnoNombre,
          },
        ]);
      } else {
        return prev;
      }
    }, []);
    if (this.turnos.length === 1) {
      this.form.get('iTurnoId')?.setValue(this.turnos[0]['id']);
    }
  }

  filterSecciones(iNivelGradoId: any, iTurnoId: any) {
    this.secciones = this.grados_secciones_turnos.reduce((prev: any, current: any) => {
      const x = prev.find(
        item => item.id === current.iSeccionId && item.nombre === current.cSeccionNombre
      );
      if (!x && current.iNivelGradoId === iNivelGradoId && current.iTurnoId === iTurnoId) {
        return prev.concat([
          {
            id: current.iSeccionId,
            nombre: current.cSeccionNombre,
          },
        ]);
      } else {
        return prev;
      }
    }, []);
    if (this.secciones.length === 1) {
      this.form.get('iSeccionId')?.setValue(this.secciones[0]['id']);
    }
  }

  agregarMatricula() {
    this.router.navigate(['/gestion-institucional/matricula-individual']);
  }

  borrarMatricula(iMatrId: any) {
    this.datosMatriculaService
      .borrarMatricula({
        iMatrId: iMatrId,
        iCredSesionId: this.constantesService.iCredId,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/gestion-institucional/gestionar-matriculas']);
        },
        error: error => {
          this._MessageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
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
          this._MessageService.add({
            severity: 'danger',
            summary: 'Mensaje del Sistema',
            detail: 'Error. al cargar los datos del horario: ' + error.error.message,
          });
        },
      });
  }

  getDesercionesByMatricula(res: any = null) {
    this.deserciones = [];
    if (res?.deserciones) {
      this.deserciones =
        typeof res.deserciones === 'string' ? JSON.parse(res.deserciones) : res.deserciones;
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
      iSesionId: Number(this.iCredId),
    };
    this.query
      .addCalAcademico({
        json: JSON.stringify(params),
        _opcion: 'addDesercion',
      })
      .subscribe({
        error: error => {
          this._MessageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error: ' + error.error.message,
          });
        },
        complete: () => {
          this._MessageService.add({
            severity: 'success',
            summary: 'Mensaje',
            detail: 'Proceso exitoso',
          });
          //this.showModal = false;
          this.getDesercion(item.iMatrId);
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
      iSesionId: Number(this.iCredId),
    };
    this.query
      .updateCalAcademico({
        json: JSON.stringify(params),
        _opcion: 'updateDesercion',
      })
      .subscribe({
        error: error => {
          this._MessageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error : ' + error.error.message,
          });
        },
        complete: () => {
          this._MessageService.add({
            severity: 'success',
            summary: 'Mensaje',
            detail: 'Proceso exitoso',
          });
          //this.showModal = false;
          this.getDesercion(item.iMatrId);
          this.desercion = null;
          this.update = false;
        },
      });
  }
}
