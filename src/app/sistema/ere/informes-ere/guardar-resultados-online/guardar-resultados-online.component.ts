import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { GeneralService } from '@/app/servicios/general.service'

import { DatosInformesService } from '../../services/datos-informes.service'
@Component({
    selector: 'app-guardar-resultados-online',
    standalone: true,
    templateUrl: './guardar-resultados-online.component.html',
    styleUrls: ['./guardar-resultados-online.component.scss'],
    imports: [PrimengModule, TablePrimengComponent],
})
export class GuardarResultadosOnlineComponent implements OnInit {
    private _formBuilder = inject(FormBuilder)
    curso: ICurso
    visible: boolean = false
    titulo: string = ''
    iYAcadId: number
    iSedeId: number
    estudiantes: any
    perfil: any
    cabecera: string = ''
    alumnosFiltrados: any[] = []

    // formulario guardar resultados online
    public formCurso: FormGroup = this._formBuilder.group({
        cCursoNombre: ['', [Validators.required]],
        cGradoAbreviacion: ['', [Validators.required]],
        cNivelTipoNombre: ['', [Validators.required]],
        iCursosNivelGradId: ['', [Validators.required]], // GRADO DEL AREA CURRICULAR
        cNombreDistrito: ['', [Validators.required]],
        // cNombreGestion: ['', [Validators.required]],
        //  cDniDocente: ['', [Validators.required]],
        cNombreDocente: ['', [Validators.required]],
        iSeccionId: ['', [Validators.required]], // ID DE LA SECCION
    })
    secciones = [] // Secciones obtenidas de la base de datos
    alumnos = [] // Alumnos obtenidos de la base de datos
    private _messageService = inject(MessageService)

    constructor(
        private store: LocalStoreService,
        private query: GeneralService,
        private datosInformesService: DatosInformesService
    ) {}

    ngOnInit() {
        console.log('AQUI ngOnInit')
        this.iYAcadId = this.store.getItem('dremoiYAcadId')
        this.iSedeId = this.store.getItem('dremoPerfil').iSedeId
        this.perfil = this.store.getItem('dremoPerfil')
        console.log('this.store', this.store)
        this.getSeccion()
    }
    botonesTabla: IActionTable[] = [
        {
            labelTooltip: 'guardar',
            icon: 'pi pi-check',
            accion: 'guardar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]
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
            field: 'dni',
            header: 'DNI',
            type: 'text',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'apellidoPaterno',
            header: 'APELLIDO PATERNO',
            type: 'text',
            width: '4rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'apellidoMaterno',
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
            field: 'Num1',
            header: '1',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num2',
            header: '2',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num3',
            header: '3',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num4',
            header: '4',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num5',
            header: '5',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num6',
            header: '6',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num7',
            header: '7',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num8',
            header: '8',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num9',
            header: '9',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num10',
            header: '10',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num11',
            header: '11',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num12',
            header: '12',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num13',
            header: '13',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num14',
            header: '14',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num15',
            header: '15',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num16',
            header: '16',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num17',
            header: '17',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num18',
            header: '18',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Num19',
            header: '19',
            type: 'cell-editor',
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'Nun20',
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
    ]
    mostrarDialog(datos: { curso: ICurso }) {
        this.titulo = `Importar resultados: ${datos.curso.cCursoNombre} - ${datos.curso.cGradoAbreviacion.toString().substring(0, 1)}° Grado
         - ${datos.curso.cNivelTipoNombre.toString().replace('Educación ', '')}`
        this.visible = true
        this.formCurso.get('cCursoNombre').patchValue(datos.curso.cCursoNombre)
        this.formCurso
            .get('cGradoAbreviacion')
            .patchValue(datos.curso.cGradoAbreviacion)
        this.formCurso
            .get('cNivelTipoNombre')
            .patchValue(datos.curso.cNivelTipoNombre)
        this.formCurso
            .get('iCursosNivelGradId')
            .patchValue(datos.curso.iCursosNivelGradId)
        // this.curso = datos.curso
        // this.form.reset()
        this.curso = datos.curso
        console.log(datos, 'datos')
        this.cabecera = 'CONSOLIDADO DE RESULTADOS DE AULA - ERE INICIO 2025'
        this.getEstudiante()
    }

    getEstudiante() {
        const iCursosNivelGradId =
            this.formCurso.get('iCursosNivelGradId').value
        const body = {
            iSedeId: this.iSedeId,
            iYAcadId: this.iYAcadId,
            iCursosNivelGradId: iCursosNivelGradId,
            iCredEntPerfId: this.perfil.iCredEntPerfId,
        }

        this.query.obtenerEstudiantesMatriculados(body).subscribe({
            next: (data: any) => {
                console.log(data, 'estudiantes')
                this.estudiantes = data.data
                console.log(this.estudiantes, 'estudiantes')
            },
            error: (error) => {
                console.error('Error subiendo archivo:', error)
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
            complete: () => {
                console.log('Request completed')
                this.alumnos = this.estudiantes.map((est) => ({
                    label: est.cSeccionNombre,
                    dni: est.cPersDocumento,
                    apellidoPaterno: est.cPersPaterno,
                    apellidoMaterno: est.cPersMaterno,
                    nombres: est.cPersNombre,
                    iSeccionId: +est.iSeccionId, // convertir a number
                    icon: 'pi pi-fw pi-home',
                    routerLink:
                        '/sistema/ere/informes-ere/guardar-resultados-online',
                }))
            },
        })
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
        const { accion } = elemento

        switch (accion) {
            case 'close-modal':
                // this.archivoSubidoEvent.emit({
                //     curso: this.curso,
                // })
                console.log('cerrar modal')
                break
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
        const item = event.item
        // console.log('Item recibido:', item)

        //this.subirArchivo(item) // Ahora item completo será enviado
        this.subirArchivo([item])
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
                    this.secciones = data.data
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                    this._messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    console.log(this.secciones, 'secciones obtenidas') // Verifica que se obtuvieron las secciones
                },
            })
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
        const seccionIdSeleccionada = event.value

        console.log('Sección seleccionada:', seccionIdSeleccionada)

        this.alumnosFiltrados = this.alumnos.filter(
            (alumno) => alumno.iSeccionId === Number(seccionIdSeleccionada)
        )

        console.log(
            this.alumnosFiltrados,
            'alumnosFiltrados antes del filtrado'
        )
    }

    async subirArchivo(datos_hojas: Array<object>) {
        const subirArchivo = {
            // datos_hojas: datos_hojas,
            iSedeId: this.iSedeId,
            iSemAcadId: this.store.getItem('dremoPerfil').iSemAcadId,
            iYAcadId: this.iYAcadId,
            iCredId: this.store.getItem('dremoPerfil').iCredId,
            iEvaluacionIdHashed: this.curso.iEvaluacionIdHashed ?? null,
            iCursosNivelGradId: this.curso.iCursosNivelGradId ?? null, //curso_nivel_grado
            codigo_modular: this.store.getItem('dremoPerfil').cCodigoModular,
            curso: this.curso.cCursoNombre ?? null,
            nivel: this.curso.cNivelTipoNombre ?? null, //nivel_tipo_nombre
            grado: this.curso.cGradoAbreviacion ?? null,

            tipo: 'resultados',
            json_resultados: JSON.stringify(datos_hojas), //  aquí lo envías como JSON string
        }
        console.log('subirArchivo', subirArchivo)

        /*this.datosInformesService.importarOffLine(subirArchivo).subscribe({
            next: (data: any) => {
                console.log('Datos Subidas de Importar Resultados:', data)
            },
            error: (error) => {
                console.error('Error subiendo archivo:', error)
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
            complete: () => {
                console.log('Request completed')
            },
        })*/
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
