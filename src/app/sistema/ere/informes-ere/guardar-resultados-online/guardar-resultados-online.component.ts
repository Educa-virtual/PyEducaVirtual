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

    // formulario guardar resultados online
    public formCurso: FormGroup = this._formBuilder.group({
        cIeNombre: ['', [Validators.required]],
        cCursoNombre: ['', [Validators.required]],
        cGradoAbreviacion: ['', [Validators.required]],
        cNivelTipoNombre: ['', [Validators.required]],
        iCursosNivelGradId: ['', [Validators.required]], // GRADO DEL AREA CURRICULAR
        cNombreDistrito: ['', [Validators.required]],
        cNombreGestion: ['', [Validators.required]],
        cDniDocente: ['', [Validators.required]],
        cNombreDocente: ['', [Validators.required]],
        iSeccionId: ['', [Validators.required]], // ID DE LA SECCION
    })
    secciones = [
        {
            label: 'A',
            idSeccion: 1,
            icon: 'pi pi-fw pi-home',
        },
        {
            label: 'B',
            idSeccion: 2,
            icon: 'pi pi-fw pi-home',
        },
        {
            label: 'UNICA',
            idSeccion: 3,
            icon: 'pi pi-fw pi-home',
        },
    ]
    // datos de prueba
    alumnos = [
        {
            label: 'B',
            dni: '12345678',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nombres: 'maria',
            idSeccion: 2,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
        {
            label: 'UNICA',
            dni: '12345678',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nombres: 'JUAN',
            idSeccion: 3,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
        {
            label: 'A',
            dni: '12345678',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nombres: 'JUAN',
            idSeccion: 1,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
        {
            label: 'B',
            dni: '12345678',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nombres: 'maria',
            idSeccion: 2,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
        {
            label: 'UNICA',
            dni: '12345678',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nombres: 'JUAN',
            idSeccion: 3,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
        {
            label: 'A',
            dni: '12345678',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nombres: 'JUAN',
            idSeccion: 1,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
        {
            label: 'B',
            dni: '12345678',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nombres: 'maria',
            idSeccion: 2,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
        {
            label: 'UNICA',
            dni: '12345678',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nombres: 'JUAN',
            idSeccion: 3,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
        {
            label: 'A',
            dni: '12345678',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nombres: 'JUAN',
            idSeccion: 1,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
        {
            label: 'B',
            dni: '12345678',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nombres: 'maria',
            idSeccion: 2,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
        {
            label: 'UNICA',
            dni: '12345678',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nombres: 'JUAN',
            idSeccion: 3,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
    ]
    private _messageService = inject(MessageService)

    constructor(
        private store: LocalStoreService,
        private query: GeneralService
    ) {}

    ngOnInit() {
        console.log('AQUI ngOnInit')
        this.iYAcadId = this.store.getItem('dremoiYAcadId')
        this.iSedeId = this.store.getItem('dremoPerfil').iSedeId
        this.perfil = this.store.getItem('dremoPerfil')
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
        console.log(datos, 'datos')

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
                    idSeccion: +est.iSeccionId, // convertir a number
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

    getCuestionarioNotas(event: any) {
        const item = event.item
        console.log(item, 'item')
        this.query.insertarCuestionarioNotas(item).subscribe({
            next: (res) => console.log('Respuesta del backend:', res),
            error: (err) => console.error('Error:', err),
        })
    }
}
