import { Component, OnInit, inject, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
    ContainerPageComponent,
    //IActionContainer,, Input, inject inject,
} from '@/app/shared/container-page/container-page.component'
import {
    TablePrimengComponent,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'
import { TabViewModule } from 'primeng/tabview'
import { IconComponent } from '@/app/shared/icon/icon.component'
import {
    matAccessTime,
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
} from '@ng-icons/material-icons/baseline'
import { provideIcons } from '@ng-icons/core'
import { TableModule } from 'primeng/table'
//import para el select
import { DropdownModule } from 'primeng/dropdown'
import { InputGroupModule } from 'primeng/inputgroup'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { ContainerPageAccionbComponent } from './container-page-accionb/container-page-accionb.component'
//El buscar
import { InputTextModule } from 'primeng/inputtext'
import { InputIconModule } from 'primeng/inputicon'
import { IconFieldModule } from 'primeng/iconfield'
import { ButtonModule } from 'primeng/button'
// nueva importaciones:
import { OrderListModule } from 'primeng/orderlist'
//import { Message, MessageService } from 'primeng/api'
import { ApiAulaService } from '../../aula-virtual/services/api-aula.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { EditorModule } from 'primeng/editor'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'

@Component({
    selector: 'app-informes',
    standalone: true,
    templateUrl: './informes.component.html',
    styleUrls: ['./informes.component.scss'],
    imports: [
        ContainerPageComponent,
        CommonModule,
        EditorModule,
        TabViewModule,
        IconComponent,
        TableModule,
        DropdownModule,
        InputGroupModule,
        CommonInputComponent,
        InputGroupAddonModule,
        ContainerPageAccionbComponent,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        ButtonModule,
        OrderListModule,
        RemoveHTMLPipe,
        TablePrimengComponent,
    ],
    providers: [
        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,
        }),
    ],
})
export class InformesComponent implements OnInit {
    private _aulaService = inject(ApiAulaService)

    perfil: any[] = []
    curso: any[] = []
    notaEstudianteSelect: any[] = []
    public estudianteMatriculadosxGrado = []

    @Input() iCursoId

    constructor(private store: LocalStoreService) {
        this.perfil = this.store.getItem('dremoPerfil')
    }
    public columnasTabla: IColumn[] = [
        {
            type: 'item',
            width: '0.5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cCursoNombre',
            header: 'Área Curricular',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'iCalifIdPeriodo1',
            header: 'TRIM 01',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'iCalifIdPeriodo2',
            header: 'TRIM 02',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'iCalifIdPeriodo3',
            header: 'TRIM 03',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'text',
            width: '10rem',
            field: 'cDetMatConclusionDescPromedio',
            header: 'Conclusión descriptiva',
            text_header: 'center',
            text: 'center',
        },
        // {
        //     type: 'actions',
        //     width: '1rem',
        //     field: '',
        //     header: 'Acciones',
        //     text_header: 'center',
        //     text: 'center',
        // },
    ]

    ngOnInit() {
        this.obtenerEstudianteXCurso()
    }
    //un load para el boton guardar
    loading: boolean = false
    load() {
        this.loading = true

        setTimeout(() => {
            this.loading = false
        }, 2000)
    }
    //Obtener datos del estudiantes y sus logros alcanzados x cursos
    obtenerEstudianteXCurso() {
        // @iSedeId INT,
        // @iSeccionId INT,
        // @iYAcadId INT,
        // @iNivelGradoId INT
        const iSedeId = this.perfil['iSedeId']
        this._aulaService
            .generarReporteDeLogroFinalDeYear({
                iSedeId: iSedeId,
            })
            .subscribe((data) => {
                // const registro = data['data']
                // this.curso = JSON.parse(registro.json_cursos);
                this.estudianteMatriculadosxGrado = data['data']
                console.log(this.estudianteMatriculadosxGrado)
            })
    }
    obtenerCursoEstudiante(estudiante) {
        this.notaEstudianteSelect = estudiante.Estudiante
        const id = estudiante.iEstudianteId
        const filteredData = this.estudianteMatriculadosxGrado.filter(
            (item) => item.iEstudianteId === id
        )
        this.curso = JSON.parse(filteredData[0].json_cursos)
        console.log(filteredData[0].json_cursos)
    }
}
