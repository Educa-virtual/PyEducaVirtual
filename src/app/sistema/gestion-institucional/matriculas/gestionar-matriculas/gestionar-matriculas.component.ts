import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import { DatosMatriculaService } from '../../services/datos-matricula.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatriculaApoderadoComponent } from '../matricula-apoderado/matricula-apoderado.component';
import { FormDesercionComponent } from '../../gestion-desercion/form-desercion/form-desercion.component';
import { HistorialDesercionComponent } from '../../gestion-desercion/historial-desercion/historial-desercion.component';
import { GestionarDesercionesComponent } from '../gestionar-deserciones/gestionar-deserciones.component';
import { formatDate } from '@angular/common';
import { DIRECTOR_IE } from '@/app/servicios/perfilesConstantes';

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
    GestionarDesercionesComponent,
  ],
  templateUrl: './gestionar-matriculas.component.html',
  styleUrl: './gestionar-matriculas.component.scss',
})
export class GestionMatriculasComponent implements OnInit {
  @Input() soloLectura: boolean = false;
  @Input() titulo: string;
  @ViewChild('vacantesSeccion') vacantesSeccion: ElementRef;

  form: FormGroup;
  sede: any[];
  iSedeId: number;
  iYAcadId: number;
  matriculas: any[];
  matriculas_filtradas: any[];
  option: boolean = false;
  iEstudianteId: number = 0; //id del estudiante
  iMatrId: number = 0; //id del matricula

  visible: boolean = false; //mostrar dialogo
  caption: string = ''; // titulo o cabecera de dialogo
  c_accion: string; //valos de las acciones
  bApoderado: boolean = false; //para mostrar el formulario de apoderado
  bDesercion: boolean = false; //para mostrar el formulario de desercion

  grado_seccion_turno: Array<object>;
  nivel_grados: Array<object>;
  secciones: Array<object>;
  perfil: any;

  tipo_desercion: any[];
  visible_desercion: boolean = false;
  matricula: any = {};
  grado: string = '';
  update: boolean = false;
  desercion: any = {};
  activeIndex: number = 0;
  deserciones: any[] = [];

  es_director: boolean = false;

  breadCrumbHome = { icon: 'pi pi-home', routerLink: '/' };
  breadCrumbItems: MenuItem[] = [
    {
      label: 'Gestionar matrículas',
    },
  ];

  selectedItems = [];
  estudianteSeleccionado: any;
  estudianteNombreCompleto: string;
  cantMatriculasFiltradas: number = 0;
  cantVacantesSeccion: number = 0;

  ESTADO_DEFINITIVA = this.matriculaService.ESTADO_DEFINITIVA;
  ESTADO_PROCESO = this.matriculaService.ESTADO_PROCESO;

  actionsLista: IActionTable[];

  @ViewChild(TablePrimengComponent) tablePrimeng: TablePrimengComponent;

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
      field: 'cTieneNEE',
      header: 'NEE',
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

  constructor(
    private store: LocalStoreService,
    private matriculaService: DatosMatriculaService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationModalService
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.iSedeId = this.perfil.iSedeId;
    this.soloLectura = ![DIRECTOR_IE].includes(Number(this.perfil.iPerfilId));
  }

  ngOnInit(): void {
    this.visualizarAcciones();

    try {
      this.form = this.fb.group({
        iNivelGradoId: [null],
        iSeccionId: [null],
        textoBusqueda: [null],
      });
    } catch (error) {
      console.error(error, 'error de formulario');
    }

    this.matriculaService
      .crearMatricula({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe((data: any) => {
        this.grado_seccion_turno = this.matriculaService.getGradoSeccionTurno(
          data?.grado_seccion_turno
        );
        this.nivel_grados = this.matriculaService.getNivelGrados(data?.grado_seccion_turno);
      });

    this.form.get('iNivelGradoId').valueChanges.subscribe(value => {
      this.filtrarTabla();
      this.secciones = [];
      this.form.get('iSeccionId')?.setValue(null);
      if (value) {
        this.filterSecciones(value);
        if (this.secciones.length === 1) {
          this.form.get('iSeccionId')?.setValue(this.secciones[0]['value']);
        }
      }
    });
    this.form.get('iSeccionId').valueChanges.subscribe(value => {
      this.filtrarTabla();
      if (value) {
        const seccion = this.secciones.find(
          (seccion: any) => Number(seccion.value) === Number(value)
        );
        this.cantVacantesSeccion = seccion['iDetConfCantEstudiantes'] ?? 0;
      } else {
        this.cantVacantesSeccion = 0;
      }
    });

    this.listarMatriculas();
  }

  visualizarAcciones() {
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
          labelTooltip: 'Gestionar deserciones',
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
        {
          labelTooltip: 'Anular matrícula',
          icon: 'pi pi-trash',
          accion: 'anular',
          type: 'item',
          class: 'p-menuitem-link text-red-500',
        },
      ];
    }
  }

  filtrarTabla() {
    const textoBusqueda = this.form.get('textoBusqueda')?.value;
    if (!this.matriculas) {
      return [];
    }
    const iNivelGradoId = this.form.get('iNivelGradoId')?.value;
    const iSeccionId = this.form.get('iSeccionId')?.value;
    this.matriculas_filtradas = this.matriculas.filter(matricula => {
      if (iNivelGradoId && Number(matricula.iNivelGradoId) !== Number(iNivelGradoId)) {
        return null;
      }
      if (iSeccionId && Number(matricula.iSeccionId) !== Number(iSeccionId)) {
        return null;
      }
      if (textoBusqueda) {
        if (
          matricula.cEstCodigo &&
          matricula.cEstCodigo.toLowerCase().includes(textoBusqueda.toLowerCase())
        )
          return matricula;
        if (
          matricula.cPersTipoNumDocumento &&
          matricula.cPersTipoNumDocumento.toLowerCase().includes(textoBusqueda.toLowerCase())
        )
          return matricula;
        if (
          matricula.cPersNombreCompleto &&
          matricula.cPersNombreCompleto.toLowerCase().includes(textoBusqueda.toLowerCase())
        )
          return matricula;
        if (
          matricula.cGrado &&
          matricula.cGrado.toLowerCase().includes(textoBusqueda.toLowerCase())
        )
          return matricula;
        if (
          matricula.cSeccionNombre &&
          matricula.cSeccionNombre.toLowerCase().includes(textoBusqueda.toLowerCase())
        )
          return matricula;
        if (
          matricula.cTieneNEE &&
          matricula.cTieneNEE.toLowerCase().includes(textoBusqueda.toLowerCase())
        )
          return matricula;
        if (
          matricula.cTipoEstadoMatricula &&
          matricula.cTipoEstadoMatricula.toLowerCase().includes(textoBusqueda.toLowerCase())
        )
          return matricula;
        const dtMatrFecha = formatDate(matricula.dtMatrFecha, 'dd/MM/yyyy', 'es-PE');
        if (matricula.dtMatrFecha && dtMatrFecha.includes(textoBusqueda)) return matricula;
        return null;
      } else {
        return matricula;
      }
    });
    this.cantMatriculasFiltradas = this.contarMatriculas();
    return null;
  }

  contarMatriculas() {
    let cantMatriculasFiltradas = 0;
    this.matriculas_filtradas.map(matricula => {
      if (
        [Number(this.ESTADO_DEFINITIVA), Number(this.ESTADO_PROCESO)].includes(
          Number(matricula.iMatrEstado)
        )
      ) {
        cantMatriculasFiltradas++;
      }
    });
    return cantMatriculasFiltradas ?? 0;
  }

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'editar':
        const iMatrId = item?.iMatrId;
        this.router.navigate([`/gestion-institucional/matricula-individual/${iMatrId}/editar`]);
        break;
      case 'apoderado':
        this.iEstudianteId = item?.iEstudianteId;
        this.estudianteNombreCompleto = item?.cPersNombreCompleto;
        this.estudianteSeleccionado = item;
        this.bApoderado = true; // muestra dialogo de apoderado
        break;
      case 'desercion':
        this.iMatrId = item?.iMatrId;
        this.estudianteNombreCompleto = item?.cPersNombreCompleto;
        this.estudianteSeleccionado = item;
        this.bDesercion = true; // muestra dialogo de apoderado
        break;
      case 'anular':
        this.confirmationService.openConfirm({
          message: '¿Está seguro de anular la matrícula seleccionada?',
          header: 'Anular matrícula',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.borrarMatricula(item?.iMatrId);
          },
        });
        break;
    }
  }

  limpiarModalApoderado() {
    this.bApoderado = false;
    this.iEstudianteId = null;
    this.estudianteSeleccionado = null;
    this.estudianteNombreCompleto = null;
  }

  limpiarModalDesercion() {
    this.bDesercion = false;
    this.iMatrId = null;
    this.estudianteSeleccionado = null;
    this.estudianteNombreCompleto = null;
  }

  listarMatriculas() {
    this.matriculaService
      .listarMatriculas({
        iSedeId: this.iSedeId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.matriculas = data.data;
          this.matriculas_filtradas = this.matriculas;
          this.cantMatriculasFiltradas = this.contarMatriculas();
        },
        error: error => {
          console.error('Error al obtener matriculas:', error);
        },
        complete: () => {},
      });
  }

  filterSecciones(iNivelGradoId: any) {
    this.secciones = this.grado_seccion_turno.reduce((prev: any, current: any) => {
      const x = prev.find(
        item => item.id === current.iSeccionId && item.nombre === current.cSeccionNombre
      );
      if (!x && Number(current.iNivelGradoId) === Number(iNivelGradoId)) {
        return prev.concat([
          {
            value: current.iSeccionId,
            label: current.cSeccionNombre,
            iDetConfCantEstudiantes: current.iDetConfCantEstudiantes,
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
    this.matriculaService
      .borrarMatricula({
        iMatrId: iMatrId,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/gestion-institucional/gestionar-matriculas']);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        },
      });
  }
}
