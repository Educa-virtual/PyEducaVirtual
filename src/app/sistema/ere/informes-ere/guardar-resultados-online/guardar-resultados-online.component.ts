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
    // {
    //     labelTooltip: 'guardar',
    //     icon: 'pi pi-plus',
    //     accion: 'guardar',
    //     type: 'item',
    //     class: 'p-button-rounded p-button-primary p-button-text',
    //     isVisible: (rowData) => {
    //         console.log('rowData');
    //         console.log(rowData);

    //         return rowData.sexo == "F"
    //     }
    // },
  ];
  columnas: IColumn[] = [
    // {
    //     type: 'item-checkbox',
    //     width: '1rem',
    //     field: 'seleccionado',
    //     header: 'Elegir',
    //     text_header: 'center',
    //     text: 'center',
    // },
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
    // this.curso = datos.curso
    // this.form.reset()
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

        /* const respuestasMapeadas: any = {};

                 for (let i = 1; i <= 6; i++) {
                     respuestasMapeadas[`respuestas${i.toString().padStart(2, '0')}`] =
                         respuestas.find(r => r.iPreguntaOrden === i)?.cAlternativaLetra ?? null;
                 }   */
        this.estudiantes = this.estudiantes.map(alumno => {
          const respuestas = JSON.parse(alumno.respuestas ?? '[]');

          return {
            ...alumno,
            respuesta01: respuestas.find(r => r.iPreguntaOrden === 1)?.cAlternativaLetra ?? null,
            respuesta02: respuestas.find(r => r.iPreguntaOrden === 2)?.cAlternativaLetra ?? null,
            respuesta03: respuestas.find(r => r.iPreguntaOrden === 3)?.cAlternativaLetra ?? null,
            respuesta04: respuestas.find(r => r.iPreguntaOrden === 4)?.cAlternativaLetra ?? null,
            respuesta05: respuestas.find(r => r.iPreguntaOrden === 5)?.cAlternativaLetra ?? null,
            respuesta06: respuestas.find(r => r.iPreguntaOrden === 6)?.cAlternativaLetra ?? null,
            respuesta07: respuestas.find(r => r.iPreguntaOrden === 7)?.cAlternativaLetra ?? null,
            respuesta08: respuestas.find(r => r.iPreguntaOrden === 8)?.cAlternativaLetra ?? null,
            respuesta09: respuestas.find(r => r.iPreguntaOrden === 9)?.cAlternativaLetra ?? null,
            respuesta10: respuestas.find(r => r.iPreguntaOrden === 10)?.cAlternativaLetra ?? null,
            respuesta11: respuestas.find(r => r.iPreguntaOrden === 11)?.cAlternativaLetra ?? null,
            respuesta12: respuestas.find(r => r.iPreguntaOrden === 12)?.cAlternativaLetra ?? null,
            respuesta13: respuestas.find(r => r.iPreguntaOrden === 13)?.cAlternativaLetra ?? null,
            respuesta14: respuestas.find(r => r.iPreguntaOrden === 14)?.cAlternativaLetra ?? null,
            respuesta15: respuestas.find(r => r.iPreguntaOrden === 15)?.cAlternativaLetra ?? null,
            respuesta16: respuestas.find(r => r.iPreguntaOrden === 16)?.cAlternativaLetra ?? null,
            respuesta17: respuestas.find(r => r.iPreguntaOrden === 17)?.cAlternativaLetra ?? null,
            respuesta18: respuestas.find(r => r.iPreguntaOrden === 18)?.cAlternativaLetra ?? null,
            respuesta19: respuestas.find(r => r.iPreguntaOrden === 19)?.cAlternativaLetra ?? null,
            respuesta20: respuestas.find(r => r.iPreguntaOrden === 20)?.cAlternativaLetra ?? null,
          };
        });
      },
      error: error => {
        console.error('Error subiendo archivo:', error);
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
  // acciones de la tabla
  // accionesTabla({ accion, item }) {
  //     switch (accion) {
  //         case 'guardar':
  //             // this.query.insertarCuestionarioNotas(item).subscribe({
  //             //     next: (res) => console.log('Respuesta del backend:', res),
  //             //     error: (err) => console.error('Error:', err),
  //             // })
  //             this.getCuestionarioNotas(item)
  //             break
  //     }
  // }
  accionBtn(elemento: any): void {
    const { accion } = elemento;
    switch (accion) {
      case 'guardar':
        this.getCuestionarioNotas(elemento);
        break;
      case 'subir-archivo':
        this.openFileDialog(elemento);
        break;
    }
  }

  // BACKUP
  // getCuestionarioNotas(event: any) {
  //     const item = event.item
  //     console.log(item, 'item')
  //     this.subirArchivo(item)
  //     // this.query.insertarCuestionarioNotas(item).subscribe({
  //     //     next: (res) => {
  //     //         this.subirArchivo(
  //     //             // Aquí mandas los datos de la tabla
  //     //             this.alumnos
  //     //         )
  //     //         console.log('Respuesta del backend:', res)
  //     //     },
  //     //     error: (err) => console.error('Error:', err),
  //     // })
  // }
  getCuestionarioNotas(event: any) {
    const item = event.item;
    //this.subirArchivo(item) // Ahora item completo será enviado
    this.dialogConfirm.openConfirm({
      header: `Se va a guardar los resultados ingresados del estudiante \n ${item.paterno} ${item.materno} ${item.nombres}. ¿Desea continuar?`,
      accept: () => {
        /* this.alumnosFiltrados = this.alumnosFiltrados.map((alumno) => {
                    if (alumno.documento == item.documento) {

                        return {
                            ...alumno,
                            iEstado: 0,
                            bActive: 1, // Asignar un valor por defecto a bActive
                          //  ...respuestasMapeadas

                        }
                    } else {
                        return {
                            ...alumno,
                        }
                    }
                })*/
        this.subirArchivo([item]);
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
        complete: () => {
          console.log(this.secciones, 'secciones obtenidas'); // Verifica que se obtuvieron las secciones
        },
      });
  }
  // subirArchivo(item: any) {
  //     // const iCursosNivelGradId =
  //     //     this.formCurso.get('iCursosNivelGradId').value
  //     // const cCursoNombre = this.formCurso.get('cCursoNombre').value
  //     // const cGradoAbreviacion = this.formCurso.get('cGradoAbreviacion').value
  //     // this.curso.iCursosNivelGradId = iCursosNivelGradId
  //     // this.curso.cCursoNombre = cCursoNombre
  //     // this.curso.cGradoAbreviacion = cGradoAbreviacion

  //     // console.log('Item completo que se enviará:', JSON.stringify(item))
  //     // console.log('iYAcadId:', this.iYAcadId)
  //     // console.log('iSedeId:', this.iSedeId)
  //     // console.log('dremoperfil:', this.store.getItem('dremoPerfil'))
  //     // console.log('IevaluacionHashed:', this.curso.iEvaluacionIdHashed)
  //     // console.log('cEvaluacionNombre:', this.curso.cCursoNombre)
  //     // console.log('Curso nivel Grado', this.curso.iCursosNivelGradId)
  //     // console.log('CgradoAbreviacion:', this.curso.cGradoAbreviacion)

  //     // Aquí mandas los datos de la tabla
  //     this.datosInformesService
  //         .importarOffLine({
  //             tipo: 'resultados', // puedes mantenerlo, aunque Laravel no lo usa
  //             json_resultados: JSON.stringify(item), //  aquí lo envías como JSON string
  //             iYAcadId: this.iYAcadId,
  //             iSedeId: this.iSedeId,
  //             iCredId: this.store.getItem('dremoPerfil')?.iCredId,
  //             iEvaluacionIdHashed: this.curso.iEvaluacionIdHashed ?? null,
  //             cCursoNombre: this.curso.cCursoNombre ?? null,
  //             cGradoAbreviacion: this.curso.cGradoAbreviacion ?? null,
  //             iCursosNivelGradId: this.curso.iCursosNivelGradId ?? null,
  //         })
  //         .subscribe({
  //             next: (res) => {
  //                 console.log('Datos subidos:', res)
  //             },
  //             error: (error) => {
  //                 console.error('Error subiendo archivo:', error)
  //                 this._messageService.add({
  //                     severity: 'error',
  //                     summary: 'Error',
  //                     detail: error.message || 'Error al subir archivo',
  //                 })
  //             },
  //             complete: () => {
  //                 console.log('Subida completada.')
  //             },
  //         })
  // }
  filtrado(event: any) {
    // Aquí puedes manejar el evento de cambio si es necesario
    const seccionIdSeleccionada = event.value;

    this.alumnosFiltrados = this.alumnos.filter(
      alumno => alumno.iSeccionId === Number(seccionIdSeleccionada)
    );
    /*
        this.alumnosFiltrados = this.alumnosFiltrados.map((item) => ({
            ...item,
            iEstado: 1,
            bActive: 0, // Asignar un valor por defecto a bActive
        })) */
  }

  async subirArchivo(datos_hojas: Array<object>) {
    const subirArchivo = {
      iSedeId: Number(this.iSedeId), // Number()
      iSemAcadId: Number(this.iSemAcadId), // Number()
      iYAcadId: Number(this.iYAcadId), // Number()
      iCredId: Number(this.store.getItem('dremoPerfil').iCredId), // Number()
      iEvaluacionIdHashed: this.curso.iEvaluacionIdHashed ?? null,
      iCursosNivelGradId: this.curso.iCursosNivelGradId ?? null,
      codigo_modular: this.perfil.cIieeCodigoModular,
      curso: this.curso.cCursoNombre ?? null,
      //curso: cursoNormalizado,
      nivel: this.curso.cNivelTipoNombre ?? null,
      grado: this.curso.cGradoAbreviacion ?? null,
      tipo: 'resultados',
      json_resultados: JSON.stringify(datos_hojas),
    };
    /*const subirArchivo = {
            // datos_hojas: datos_hojas,
            iSedeId: Number(this.iSedeId),
            iSemAcadId: Number(this.iSemAcadId),
            iYAcadId: Number(this.iYAcadId),
            iCredId: Number(this.store.getItem('dremoPerfil').iCredId),
            iEvaluacionIdHashed: this.curso.iEvaluacionIdHashed ?? null,
            iCursosNivelGradId: this.curso.iCursosNivelGradId ?? null, //curso_nivel_grado
            codigo_modular: this.perfil.cIieeCodigoModular,
            curso: this.curso.cCursoNombre ?? null,
            nivel: this.curso.cNivelTipoNombre ?? null, //nivel_tipo_nombre
            grado: this.curso.cGradoAbreviacion ?? null,

            tipo: 'resultados',
            json_resultados: JSON.stringify(datos_hojas), //  aquí lo envías como JSON string
        }*/
    console.log('subirArchivo', subirArchivo);

    // this.datosInformesService.importarOffLine(subirArchivo).subscribe({
    //     next: (data: any) => {
    //         console.log('Datos Subidas de Importar Resultados:', data)
    //     },
    //     error: (error) => {
    //         console.error('Error subiendo archivo:', error)
    //         this._messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: error,
    //         })
    //     },
    //     complete: () => {
    //         console.log('Request completed')
    //     },
    // })
    this.datosInformesService.importarOffLine(subirArchivo).subscribe({
      next: (data: any) => {
        const documento = datos_hojas.length > 0 ? datos_hojas[0]['documento'] : null;
        this.alumnosFiltrados.map(alumno => {
          if (alumno.documento === documento) {
            alumno.bActive = 1;
            alumno.iEstado = 0;
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

  openFileDialog(row: any) {
    this.alumnoSeleccionado = row;
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && this.alumnoSeleccionado) {
      const file = input.files[0];

      const formData = new FormData();
      formData.append('file', file);
      formData.append('rowId', this.alumnoSeleccionado.id);
      this.datosInformesService.subirHojaDesarrollo(formData).subscribe({
        next: (data: any) => {
          this._messageService.add({
            severity: 'success',
            summary: 'Archivo subido',
            detail: data.message,
          });
          this.alumnoSeleccionado.bTieneArchivo = 1;
        },
        error: error => {
          console.error('Error subiendo archivo:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error al subir archivo',
            detail: error.error.message || 'Error desconocido',
          });
        },
      });
      /*this.http.post('/api/upload', formData).subscribe({
              next: () => alert(`Archivo de ${this.alumnoSeleccionado.nombre} subido correctamente`),
              error: (err) => console.error('Error al subir archivo', err)
            });*/

      // Reseteamos
      input.value = '';
      this.alumnoSeleccionado = null;
    }
  }
  // Angular: componente donde se envía el JSON
  // async subirArchivo(datos_hojas: Array<object>) {
  //     const payload = {
  //         iYAcadId: this.iYAcadId,
  //         iSedeId: this.iSedeId,
  //         iCredId: this.store.getItem('dremoPerfil').iCredId,
  //         iEvaluacionIdHashed: this.curso.iEvaluacionIdHashed ?? null,
  //         cCursoNombre: this.curso.cCursoNombre ?? null,
  //         cGradoAbreviacion: this.curso.cGradoAbreviacion ?? null,
  //         iCursosNivelGradId: this.curso.iCursosNivelGradId ?? null,
  //         tipo: 'resultados',
  //         json_resultados: JSON.stringify(datos_hojas), // este se envía como string
  //     }

  //     this.datosInformesService.importarResultados(payload).subscribe({
  //         next: (data: any) => {
  //             console.log('Respuesta del servidor:', data)
  //         },
  //         error: (error) => {
  //             console.error('Error subiendo archivo:', error)
  //             this._messageService.add({
  //                 severity: 'error',
  //                 summary: 'Error',
  //                 detail: error.message || 'Error inesperado',
  //             })
  //         },
  //         complete: () => {
  //             console.log('Petición finalizada')
  //         },
  //     })
  // }
}
