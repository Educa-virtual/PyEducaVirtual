import { PrimengModule } from '@/app/primeng.module';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { GeneralService } from '@/app/servicios/general.service';

import { DatosInformesService } from '../../services/datos-informes.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
@Component({
  selector: 'app-guardar-resultados-online',
  standalone: true,
  templateUrl: './guardar-resultados-online.component.html',
  styleUrls: ['./guardar-resultados-online.component.scss'],
  imports: [PrimengModule, TablePrimengComponent],
})
export class GuardarResultadosOnlineComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  curso: ICurso;
  visible: boolean = false;
  titulo: string = '';
  iYAcadId: number;
  iSedeId: number;
  estudiantes: any;
  perfil: any;
  cabecera: string = '';
  alumnosFiltrados: any[] = [];
  iSemAcadId: number; // ID del semestre académico
  mensaje: string = ''; // Mensaje para mostrar en la tabla

  secciones = []; // Secciones obtenidas de la base de datos
  alumnos = []; // Alumnos obtenidos de la base de datos
  formCurso: FormGroup;
  alumnoSeleccionado: any = null;

  constructor(
    private store: LocalStoreService,
    private query: GeneralService,
    private datosInformesService: DatosInformesService,
    private dialogConfirm: ConfirmationModalService,
    private _messageService: MessageService,
    private _formBuilder: FormBuilder
  ) {
    this.formCurso = this._formBuilder.group({
      cCursoNombre: ['', [Validators.required]],
      cGradoAbreviacion: ['', [Validators.required]],
      cNivelTipoNombre: ['', [Validators.required]],
      iCursosNivelGradId: ['', [Validators.required]], // GRADO DEL AREA CURRICULAR
      cNombreDocente: [''],
      iSeccionId: ['', [Validators.required]], // ID DE LA SECCION
    });
  }

  ngOnInit() {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.iSedeId = this.store.getItem('dremoPerfil').iSedeId;
    this.perfil = this.store.getItem('dremoPerfil');
    const semestres = JSON.parse(this.perfil.semestres_acad);
    const semestreSeleccionado = semestres.find(s => Number(s.iYAcadId) === Number(this.iYAcadId));

    this.iSemAcadId = semestreSeleccionado ? Number(semestreSeleccionado.iSemAcadId) : null;
    this.cabecera = localStorage.getItem('cEvaluacionNombre');
    this.getSeccion();
  }
  botonesTabla: IActionTable[] = [
    {
      labelTooltip: 'Guardar',
      icon: 'pi pi-check',
      accion: 'guardar',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      isVisible: rowData => {
        return rowData.iEstado === 1;
      },
    },
    {
      labelTooltip: 'Subir archivo',
      icon: 'pi pi-paperclip',
      accion: 'subir-archivo',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      isVisible: rowData => {
        return rowData.bTieneArchivo == 0;
      },
    },
    {
      labelTooltip: 'Descargar archivo',
      icon: 'pi pi-download',
      accion: 'descargar-archivo',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      isVisible: rowData => {
        return rowData.bTieneArchivo == 1;
      },
    },
    {
      labelTooltip: 'Eliminar archivo',
      icon: 'pi pi-times-circle',
      accion: 'eliminar-archivo',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      isVisible: rowData => {
        return rowData.bTieneArchivo == 1;
      },
    },
  ];
  columnas: IColumn[] = [
    {
      type: 'item',
      width: '0.5rem',
      field: 'index',
      header: 'Nº',
      text_header: 'center',
      text: 'center',
    },
    {
      field: 'documento',
      header: 'DNI',
      type: 'text',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'paterno',
      header: 'APELLIDO PATERNO',
      type: 'text',
      width: '4rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'materno',
      header: 'APELLIDO MATERNO',
      type: 'text',
      width: '4rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'nombres',
      header: 'NOMBRES',
      type: 'text',
      width: '4rem',
      text: 'center',
      text_header: 'center',
    },

    {
      field: 'sexo',
      header: 'Sexo',
      type: 'text',
      width: '4rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta01',
      header: '1',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta02',
      header: '2',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta03',
      header: '3',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta04',
      header: '4',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta05',
      header: '5',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta06',
      header: '6',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta07',
      header: '7',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta08',
      header: '8',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta09',
      header: '9',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta10',
      header: '10',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta11',
      header: '11',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta12',
      header: '12',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta13',
      header: '13',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta14',
      header: '14',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta15',
      header: '15',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta16',
      header: '16',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta17',
      header: '17',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta18',
      header: '18',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta19',
      header: '19',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: 'respuesta20',
      header: '20',
      type: 'cell-editor',
      width: '2rem',
      text: 'center',
      text_header: 'center',
    },
    {
      field: '',
      header: 'Acciones',
      type: 'actions',
      width: '3rem',
      text: 'center',
      text_header: 'center',
    },
  ];

  mostrarDialog(datos: { curso: ICurso }) {
    this.titulo = `Importar resultados: ${datos.curso.cCursoNombre} - ${datos.curso.cGradoAbreviacion.toString().substring(0, 1)}° Grado
         - ${datos.curso.cNivelTipoNombre.toString().replace('Educación ', '')}`;
    this.visible = true;
    this.formCurso.get('cCursoNombre').patchValue(datos.curso.cCursoNombre);
    this.formCurso.get('cGradoAbreviacion').patchValue(datos.curso.cGradoAbreviacion);
    this.formCurso.get('cNivelTipoNombre').patchValue(datos.curso.cNivelTipoNombre);
    this.formCurso.get('cNombreDocente').patchValue('Nombre del Docente');
    this.formCurso.get('iCursosNivelGradId').patchValue(datos.curso.iCursosNivelGradId);
    this.curso = datos.curso;
    this.alumnosFiltrados = [];
    this.formCurso.get('iSeccionId').patchValue(null);
    this.getEstudiante();
  }

  getEstudiante() {
    const iCursosNivelGradId = this.formCurso.get('iCursosNivelGradId').value;
    const body = {
      iSedeId: this.iSedeId,
      iYAcadId: this.iYAcadId,
      iCursosNivelGradId: iCursosNivelGradId,
      iCredEntPerfId: this.perfil.iCredEntPerfId,
      iEvaluacionId: this.curso.iEvaluacionIdHashed,
    };

    this.query.obtenerEstudiantesMatriculados(body).subscribe({
      next: (data: any) => {
        this.estudiantes = data.data;
        this.estudiantes = this.estudiantes.map(alumno => {
          const respuestas = JSON.parse(alumno.respuestas ?? '[]');

          return {
            ...alumno,
            respuesta01: respuestas.find(r => r.iPreguntaOrden === 1)?.cAlternativaLetra,
            respuesta02: respuestas.find(r => r.iPreguntaOrden === 2)?.cAlternativaLetra,
            respuesta03: respuestas.find(r => r.iPreguntaOrden === 3)?.cAlternativaLetra,
            respuesta04: respuestas.find(r => r.iPreguntaOrden === 4)?.cAlternativaLetra,
            respuesta05: respuestas.find(r => r.iPreguntaOrden === 5)?.cAlternativaLetra,
            respuesta06: respuestas.find(r => r.iPreguntaOrden === 6)?.cAlternativaLetra,
            respuesta07: respuestas.find(r => r.iPreguntaOrden === 7)?.cAlternativaLetra,
            respuesta08: respuestas.find(r => r.iPreguntaOrden === 8)?.cAlternativaLetra,
            respuesta09: respuestas.find(r => r.iPreguntaOrden === 9)?.cAlternativaLetra,
            respuesta10: respuestas.find(r => r.iPreguntaOrden === 10)?.cAlternativaLetra,
            respuesta11: respuestas.find(r => r.iPreguntaOrden === 11)?.cAlternativaLetra,
            respuesta12: respuestas.find(r => r.iPreguntaOrden === 12)?.cAlternativaLetra,
            respuesta13: respuestas.find(r => r.iPreguntaOrden === 13)?.cAlternativaLetra,
            respuesta14: respuestas.find(r => r.iPreguntaOrden === 14)?.cAlternativaLetra,
            respuesta15: respuestas.find(r => r.iPreguntaOrden === 15)?.cAlternativaLetra,
            respuesta16: respuestas.find(r => r.iPreguntaOrden === 16)?.cAlternativaLetra,
            respuesta17: respuestas.find(r => r.iPreguntaOrden === 17)?.cAlternativaLetra,
            respuesta18: respuestas.find(r => r.iPreguntaOrden === 18)?.cAlternativaLetra,
            respuesta19: respuestas.find(r => r.iPreguntaOrden === 19)?.cAlternativaLetra,
            respuesta20: respuestas.find(r => r.iPreguntaOrden === 20)?.cAlternativaLetra,
          };
        });
      },
      error: error => {
        this._messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: 'No se encontraron estudiantes matriculados error:' + error,
        });
      },
      complete: () => {
        this.alumnos = this.estudiantes.map(est => ({
          seccion: est.cSeccionNombre,
          bTieneArchivo: est.bTieneArchivo,
          tipo_documento: est.cPersTipoDocumento,
          documento: est.cPersDocumento,
          paterno: est.cPersPaterno,
          materno: est.cPersMaterno,
          sexo: est.cPersSexo,
          nombres: est.cPersNombre,
          iEstudianteId: est.iEstudianteId,
          iSeccionId: +est.iSeccionId, // convertir a number
          icon: 'pi pi-fw pi-home',
          routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
          respuesta01: est.respuesta01,
          respuesta02: est.respuesta02,
          respuesta03: est.respuesta03,
          respuesta04: est.respuesta04,
          respuesta05: est.respuesta05,
          respuesta06: est.respuesta06,
          respuesta07: est.respuesta07,
          respuesta08: est.respuesta08,
          respuesta09: est.respuesta09,
          respuesta10: est.respuesta10,
          respuesta11: est.respuesta11,
          respuesta12: est.respuesta12,
          respuesta13: est.respuesta13,
          respuesta14: est.respuesta14,
          respuesta15: est.respuesta15,
          respuesta16: est.respuesta16,
          respuesta17: est.respuesta17,
          respuesta18: est.respuesta18,
          respuesta19: est.respuesta19,
          respuesta20: est.respuesta20,
          iEstado: est.num_respuestas > 0 ? 0 : 1, // Estado inicia
          bActive: est.num_respuestas > 0 ? 1 : 0, // Estado inicial
        }));
        this._messageService.add({
          severity: 'warn',
          summary: 'Mensaje del sistema',
          detail: 'Debe seleccionar la sección',
        });
      },
    });
  }

  accionBtn(elemento: any): void {
    const { accion } = elemento;
    switch (accion) {
      case 'guardar':
        this.getCuestionarioNotas(elemento);
        break;
      case 'subir-archivo':
        this.openFileDialogHojaDesarrollo(elemento);
        break;
      case 'descargar-archivo':
        this.descargarHojaDesarrolloEstudiante(elemento);
        break;
      case 'eliminar-archivo':
        this.preguntarEliminarArchivoHojaDesarrollo(elemento);
        break;
    }
  }

  getCuestionarioNotas(event: any) {
    this.alumnoSeleccionado = event.item;
    this.dialogConfirm.openConfirm({
      header: `Se va a guardar los resultados de ${this.alumnoSeleccionado.paterno} ${this.alumnoSeleccionado.materno} ${this.alumnoSeleccionado.nombres}. `,
      message: '¿Desea continuar?',
      accept: () => {
        this.subirArchivo();
      },
    });
  }

  getSeccion() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'secciones',
        campos: '*',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.secciones = data.data;
        },
        error: error => {
          console.error('Error fetching Años Académicos:', error);
          this._messageService.add({
            severity: 'danger',
            summary: 'Mensaje',
            detail: 'Error en ejecución',
          });
        },
      });
  }

  filtrado(event: any) {
    // Aquí puedes manejar el evento de cambio si es necesario
    const seccionIdSeleccionada = event.value;

    this.alumnosFiltrados = this.alumnos.filter(
      alumno => alumno.iSeccionId === Number(seccionIdSeleccionada)
    );
    console.log(this.alumnosFiltrados);
  }

  async subirArchivo() {
    const datos_hojas: Array<object> = [this.alumnoSeleccionado];
    const subirArchivo = {
      iSedeId: Number(this.iSedeId), // Number()
      iSemAcadId: Number(this.iSemAcadId), // Number()
      iYAcadId: Number(this.iYAcadId), // Number()
      iCredId: Number(this.store.getItem('dremoPerfil').iCredId), // Number()
      iEvaluacionIdHashed: this.curso.iEvaluacionIdHashed,
      iCursosNivelGradId: this.curso.iCursosNivelGradId,
      codigo_modular: this.perfil.cIieeCodigoModular,
      curso: this.curso.cCursoNombre,
      //curso: cursoNormalizado,
      nivel: this.curso.cNivelTipoNombre,
      grado: this.curso.cGradoAbreviacion,
      tipo: 'resultados',
      json_resultados: JSON.stringify(datos_hojas),
    };

    this.datosInformesService.importarOffLine(subirArchivo).subscribe({
      next: (data: any) => {
        const documento = datos_hojas.length > 0 ? datos_hojas[0]['documento'] : null;
        this.alumnosFiltrados.map(alumno => {
          if (alumno.documento === documento) {
            alumno.bActive = 1;
            alumno.iEstado = 0;
            this.alumnoSeleccionado = null;
          }
        });
        console.log('Datos Subidas de Importar Resultados:', data);
      },
      error: error => {
        console.error('Error subiendo archivo:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
      complete: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Mensaje del sistema',
          detail: 'Se aactualizo la tabla de resultados',
        });
      },
    });
  }

  openFileDialogHojaDesarrollo(row: any) {
    this.alumnoSeleccionado = row.item;
    this.fileInput.nativeElement.click();
  }

  onFileSelectedHojaDesarrollo(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && this.alumnoSeleccionado) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('archivo', file);

      this.datosInformesService
        .guardarHojaDesarrolloEstudiante(
          formData,
          this.curso.iEvaluacionIdHashed,
          this.curso.iCursosNivelGradId,
          this.alumnoSeleccionado.iEstudianteId
        )
        .subscribe({
          next: (data: any) => {
            this._messageService.add({
              severity: 'success',
              summary: 'Archivo subido',
              detail: data.message,
            });
            this.alumnoSeleccionado.bTieneArchivo = 1;
            input.value = '';
            this.alumnoSeleccionado = null;
          },
          error: error => {
            this._messageService.add({
              severity: 'error',
              summary: 'Error al subir archivo',
              detail: error.error.message || 'Error desconocido',
            });
          },
        });
    }
  }

  descargarHojaDesarrolloEstudiante(event: any) {
    this.alumnoSeleccionado = event.item;
    this.datosInformesService
      .descargarHojaDesarrolloEstudiante(
        this.curso.iEvaluacionIdHashed,
        this.curso.iCursosNivelGradId,
        this.alumnoSeleccionado.iEstudianteId
      )
      .subscribe({
        next: (response: Blob) => {
          let filename = `Hoja desarrollo - ${this.alumnoSeleccionado.documento}`;
          if (!filename.includes('.') && response.type) {
            const ext = response.type.split('/')[1];
            filename += '.' + ext;
          }
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: error => {
          this._messageService.add({
            severity: 'error',
            summary: 'Problema al descargar el archivo',
            detail: error.error?.message || 'No se pudo descargar el archivo',
          });
        },
      });
  }

  preguntarEliminarArchivoHojaDesarrollo(event: any) {
    this.alumnoSeleccionado = event.item;
    this.dialogConfirm.openConfirm({
      header: `Se va a eliminar el archivo subido para el estudiante ${this.alumnoSeleccionado.paterno} ${this.alumnoSeleccionado.materno} ${this.alumnoSeleccionado.nombres}. ¿Desea continuar?`,
      message: '¿Desea continuar?',
      accept: () => {
        this.eliminarHojaDesarrolloEstudiante();
      },
    });
  }

  eliminarHojaDesarrolloEstudiante() {
    this.datosInformesService
      .eliminarHojaDesarrolloEstudiante(
        this.curso.iEvaluacionIdHashed,
        this.curso.iCursosNivelGradId,
        this.alumnoSeleccionado.iEstudianteId
      )
      .subscribe({
        next: (response: any) => {
          this._messageService.add({
            severity: 'success',
            summary: 'Archivo eliminado',
            detail: response.message,
          });
          this.alumnoSeleccionado.bTieneArchivo = 0;
          this.alumnoSeleccionado = null;
        },
        error: error => {
          this._messageService.add({
            severity: 'error',
            summary: 'Problema al descargar el archivo',
            detail: error.error?.message || 'No se pudo descargar el archivo',
          });
        },
      });
  }
}
