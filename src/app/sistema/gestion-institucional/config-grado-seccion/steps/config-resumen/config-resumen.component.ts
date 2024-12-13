import { Component, OnInit } from '@angular/core'
import { StepsModule } from 'primeng/steps'
import { PrimengModule } from '@/app/primeng.module'
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'
import { MenuItem, MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import {
    TablePrimengComponent,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
@Component({
    selector: 'app-config-resumen',
    standalone: true,
    imports: [
        StepsModule,
        PrimengModule,
        ContainerPageComponent,
        TablePrimengComponent,
    ],
    templateUrl: './config-resumen.component.html',
    styleUrl: './config-resumen.component.scss',
})
export class ConfigResumenComponent implements OnInit {
    items: MenuItem[]
    customers: any = []

    nivelesCiclos: any = []
    lista: any
    groupedData: any
    dynamicColumns: any

    constructor(
        private stepService: AdmStepGradoSeccionService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService
    ) {
        this.items = this.stepService.itemsStep
    }

    ngOnInit(): void {
        console.log('implemntacion')
        this.getCursosNivelGrado()
    }

    getCursosNivelGrado() {
        alert(this.stepService.iNivelTipoId)
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iNivelGradoId: this.stepService.iNivelTipoId,
                }),
                _opcion: 'getCursosNivelGrado',
            })
            .subscribe({
                next: (data: any) => {
                    this.lista = this.extraerAsignatura(data.data)
                    this.nivelesCiclos = data.data
                    const grouped = this.nivelesCiclos.reduce((acc, item) => {
                        const curso = item.cCursoNombre
                        const grado =
                            item.cGradoNombre + '(' + item.cCicloRomanos + ')' //item.cGradoNombre; // Nombre ded grado
                        const hora = item.nCursoTotalHoras // hora total
                        if (!acc[curso]) {
                            acc[curso] = {
                                cCursoNombre: item.cCursoNombre,
                                cNivelNombre: item.cNivelNombre,
                                cNivelTipoNombre: item.cNivelTipoNombre,
                                cCicloNombre: item.cCicloNombre,
                                grades: {},
                            }
                        }
                        acc[curso].grades[grado] = hora + ' hrs'
                        return acc
                    }, {})

                    // this.groupedData  = Object.values(grouped);
                    this.groupedData = Object.values(grouped)

                    // Generar columnas dinámicas (grados únicos)
                    const allGrades = this.nivelesCiclos.map(
                        (item) =>
                            item.cGradoNombre + '(' + item.cCicloRomanos + ')'
                    )
                    this.dynamicColumns = Array.from(new Set(allGrades))
                },

                error: (error) => {
                    console.error('Error fetching  seccionesAsignadas:', error)
                },
                complete: () => {
                    // console.log(this.lista, 'desde getSeccionesAsignadas')
                },
            })
    }

    extraerAsignatura(Asignatura) {
        // Agrupar las secciones por grado
        const agruparSeccionesPorGrado = (
            datos: any[]
        ): Record<string, string[]> => {
            return datos.reduce(
                (acumulador, item) => {
                    const curso = item.cCursoNombre // Nombre del curso
                    const grado = item.cGradoNombre // Nombre ded grado
                    const hora = item.iCursoTotalHoras // hora total

                    // Si el grado no existe en el acumulador, inicializarlo como un array vacío
                    if (!acumulador[curso]) {
                        acumulador[curso] = []
                    }
                    // Agregar la sección al grado (evitando duplicados)
                    if (!acumulador[curso].includes(grado)) {
                        acumulador[curso].push(grado)
                        acumulador[curso].push(hora)
                    }
                    return acumulador
                },
                {} as Record<string, string[]>
            )
        }
        // Usar la función para agrupar las secciones
        const resultado = agruparSeccionesPorGrado(Asignatura)
        return resultado
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            console.log(item, 'btnTable')
        }
    }
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'generar resumen',
            text: 'Generar resumen',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]
    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]
    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: 'N°',
            text_header: 'left',
            text: 'left',
        },

        {
            type: 'text',
            width: '7rem',
            field: 'cCursoNombre',
            header: 'Area curricular',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'nombre_completo',
            header: 'Docente',
            text_header: 'center',
            text: 'left',
        },
    ]
}
