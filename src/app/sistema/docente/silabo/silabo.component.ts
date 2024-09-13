import { PrimengModule } from '@/app/primeng.module'
import { BtnLoadingComponent } from '@/app/shared/btn-loading/btn-loading.component'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'

interface Area_Estudio {
    iAreaEstudioId: number
    cAreaEstudio: string
}

interface Menu {
    iMenuId: number
    cMenu: string
}

@Component({
    selector: 'app-silabo',
    standalone: true,
    imports: [
        ContainerPageComponent,
        PrimengModule,
        BtnLoadingComponent,
        TablePrimengComponent,
    ],
    templateUrl: './silabo.component.html',
    styleUrl: './silabo.component.scss',
})
export class SilaboComponent implements OnInit {
    areas: Area_Estudio[] | undefined
    menu: Menu[]
    selectedMenu: number = null
    actions = []
    columnsRecursos = [
        {
            type: 'text',
            width: '10rem',
            field: 'cNombreRecursoDidáctico',
            header: 'Nombre del Recurso Didáctico',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '15rem',
            field: 'cDescripcion',
            header: 'Descripcion',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    columnsActividades = [
        {
            type: 'text',
            width: '5rem',
            field: 'cNumero',
            header: 'Núm.',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cNombre',
            header: 'Nombre',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cConcepto',
            header: 'Concepto',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'cElementos',
            header: 'Elementos',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'cActitudes',
            header: 'Actitudes',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cProcedi10iento',
            header: 'Procedimiento',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    columnsBibliografia = [
        {
            type: 'text',
            width: '10rem',
            field: 'cTitulo',
            header: 'Título',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'cAutor',
            header: 'Autor',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    ngOnInit() {
        this.areas = [
            { iAreaEstudioId: 1, cAreaEstudio: 'Matemáticas' },
            { iAreaEstudioId: 2, cAreaEstudio: 'Comunicación' },
            { iAreaEstudioId: 3, cAreaEstudio: 'Arte' },
            { iAreaEstudioId: 4, cAreaEstudio: 'Ciencias Sociales' },
            { iAreaEstudioId: 5, cAreaEstudio: 'Religión' },
        ]
        this.menu = [
            { iMenuId: 1, cMenu: 'INFORMACIÓN GENERAL' },
            { iMenuId: 2, cMenu: 'RECURSOS DIDÁCTICOS' },
            { iMenuId: 3, cMenu: 'ACTIVIDADES DE APRENDIZAJE' },
            { iMenuId: 4, cMenu: 'BIBLIOGRAFÍA' },
        ]
    }
}
