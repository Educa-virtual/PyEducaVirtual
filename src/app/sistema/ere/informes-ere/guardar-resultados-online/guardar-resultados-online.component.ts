import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'

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

    // formulario guardar resultados online
    public formCurso: FormGroup = this._formBuilder.group({
        cCursoNombre: ['', [Validators.required]],
        cGradoAbreviacion: ['', [Validators.required]],
        cNivelTipoNombre: ['', [Validators.required]],
    })
    secciones = [
        {
            label: 'A',
            idSeccion: 1,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
        {
            label: 'B',
            idSeccion: 2,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
        {
            label: 'UNICA',
            idSeccion: 3,
            icon: 'pi pi-fw pi-home',
            routerLink: '/sistema/ere/informes-ere/guardar-resultados-online',
        },
    ]
    alumnos = [
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

    constructor() {}

    ngOnInit() {
        console.log('jj')
    }
    botonesTabla: IActionTable[] = [
        {
            labelTooltip: 'guardar',
            icon: 'pi pi-check',
            accion: 'ver',
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
        // this.curso = datos.curso
        // this.form.reset()
        console.log(datos, 'datos')
    }
    // acciones de la tabla
    accionesTabla({ accion, item }) {
        switch (accion) {
            case 'ver':
                console.log('visto')
                break
            case 'setearDataxseleccionado':
                console.log(item, 'item')
                break
        }
    }
}
