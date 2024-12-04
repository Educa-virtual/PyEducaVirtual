import { Component, OnInit } from '@angular/core'
import { StepsModule } from 'primeng/steps'
import { PrimengModule } from '@/app/primeng.module'
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MenuItem, MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import { TypesFilesUploadPrimengComponent } from '../../../../../shared/types-files-upload-primeng/types-files-upload-primeng.component'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-config-plan-estudios',
    standalone: true,
    imports: [
        StepsModule,
        PrimengModule,
        ContainerPageComponent,
        TablePrimengComponent,
        TypesFilesUploadPrimengComponent,
    ],
    templateUrl: './config-plan-estudios.component.html',
    styleUrl: './config-plan-estudios.component.scss',
})
export class ConfigPlanEstudiosComponent implements OnInit {
    items: MenuItem[]
    planes: []
    form: FormGroup
    formNivelGrado: FormGroup
    caption: string
    visible: boolean = false
    configuracion: any[]
    uploadedFiles: any[] = []
    typesFiles = {
        //archivos
        file: true,
        url: false,
        youtube: false,
        repository: false,
        image: false,
    }
    filesUrl = [] //archivos
    enlace: string
    event: string
    selectedItems = []

    nivelesCiclos = []
    niveles = []
    dynamicColumns = []
    groupedData = []
    lista: any = []

    constructor(
        private stepService: AdmStepGradoSeccionService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService,
        private msg: StepConfirmationService
    ) {
        this.items = this.stepService.itemsStep
        this.configuracion = this.stepService.configuracion
    }

    ngOnInit(): void {
        console.log('implemntacion')

        try {
            //bd iiee_ambientes
            //this.visible = true
            this.form = this.fb.group({
                iPlanes: [0], //codigo de tabla_iiee_ambientes
                cPlanes: ['', Validators.required], // tabla_iiee_ambientes (FK)
                cUrlPlanes: ['', Validators.required], // tabla_iiee_ambientes (FK)
                cObsPlanes: [''],

                iYAcadId: [this.configuracion[0].iYAcadId], // tabla_iiee_ambientes (FK)
                iSedeId: [this.configuracion[0].iSedeId], // tabla_iiee_ambientes (FK)

                // ambiente: [''],
                cYAcadNombre: [this.configuracion[0].cYAcadNombre], // campo adicional para la vista
            })
        } catch (error) {
            console.error('Error initializing form:', error)
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }

        this.formNivelGrado = this.fb.group({
            //   iNivelGradoId : [0],
            cGradoNombre: [''],
            cCicloNombre: [''],
            cNivelNombre: [''],
            cNivelTipoNombre: [''],
        })
        this.getCursosNivelGrado()
    }

    getCursosNivelGrado() {
        //alert(this.stepService.iNivelTipoId )
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

                    console.log(this.lista, 'grados y cursos')
                    this.nivelesCiclos = data.data

                    console.log(this.nivelesCiclos, 'console data')
                    const grouped = this.nivelesCiclos.reduce((acc, item) => {
                        //     const ciclo = item.cCicloRomanos;

                        //     if (!acc[ciclo]) {
                        //       acc[ciclo] = {
                        //         cNivelNombre: item.cNivelNombre,
                        //         cNivelTipoNombre: item.cNivelTipoNombre,
                        //         cCicloNombre: item.cCicloNombre,
                        //         grades: {},
                        //       };
                        //     }

                        //     acc[ciclo].grades[item.cGradoNombre] = item.cGradoAbreviacion;
                        //     return acc;
                        //   }, {});

                        const curso = item.cCursoNombre
                        const grado =
                            item.cGradoNombre + '(' + item.cCicloRomanos + ')' //item.cGradoNombre; // Nombre ded grado
                        const hora = item.iCursoTotalHoras // hora total

                        if (!acc[curso]) {
                            acc[curso] = {
                                cCursoNombre: item.cCursoNombre,
                                cNivelNombre: item.cNivelNombre,
                                cNivelTipoNombre: item.cNivelTipoNombre,
                                cCicloNombre: item.cCicloNombre,
                                grades: {},
                            }
                        }
                        console.log(acc[curso])
                        acc[curso].grades[grado] = hora + ' hrs'

                        //acc[curso].push(hora)
                        //acc[curso].horas[item.cGradoNombre]= item.item.iCursoTotalHoras
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

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        console.log(this.filesUrl, 'files URL')
        switch (accion) {
            case 'close-modal':
                // this.accionBtnItem.emit({ accion, item })
                break

            case 'subir-file-configuracion-iiee':
                const url = this.query.baseUrlPublic()
                if (this.filesUrl.length < 1) {
                    console.log(item)
                    this.filesUrl.push({
                        type: 1, //1->file
                        nameType: 'file',
                        name: item.file.name,
                        size: item.file.size,
                        ruta: item.name,
                    })

                    this.form
                        .get('cConfigUrlRslAprobacion')
                        ?.setValue(this.filesUrl[0].ruta)

                    this.enlace = url + '/' + this.filesUrl[0].ruta
                } else {
                    alert('No puede subir mas de un archivo')
                }
                console.log(this.filesUrl, 'subir-file-configuracion-iiee')
                break
        }
    }

    accionBtnItemTable({ accion, item }) {
        this.event = item
        if (accion === 'retornar') {
            alert('Desea retornar')
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
        if (accion === 'agregar') {
            this.visible = true
            this.caption = 'Registrar plan de estudios'
            console.log(item, 'btnTable')
        }
    }

    accionBtnItem(accion) {
        if (accion === 'guardar') {
            if (this.form.valid) {
                this.query
                    .addAmbienteAcademico({
                        json: JSON.stringify(this.form.value),
                        _opcion: 'addConfig',
                    })
                    .subscribe({
                        next: (data: any) => {
                            console.log(data, 'id', data.data[0].id)

                            // Asegurar inicialización
                            // this.configuracion = this.configuracion || [{}]
                            // this.stepService.configuracion[0] = this.stepService
                            //     .configuracion || [{}]
                            // Actualizar valores
                            this.form
                                .get('iConfigId')
                                ?.setValue(data.data[0].id)
                            this.configuracion[0] = this.form.value
                            this.stepService.configuracion[0] =
                                this.configuracion[0]
                        },
                        error: (error) => {
                            console.error(
                                'Error fetching configuración:',
                                error
                            )
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Mensaje',
                                detail: 'Error. No se proceso petición ',
                            })
                        },
                        complete: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Mensaje',
                                detail: 'Proceso exitoso',
                            })
                            console.log('Request completed')
                            // this.router.navigate([
                            //     '/gestion-institucional/ambiente',
                            // ])
                        },
                    })
            } else {
                console.log('Formulario no válido', this.form.invalid)
            }
        }
    }

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Crear Plan de estudio',
            text: 'Crear Plan de estudio',
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
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    columns = [
        {
            type: 'item',
            width: '5rem',
            field: 'item',
            header: 'NRO',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cYAcadNombre',
            header: 'Año',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cConfigDescripcion',
            header: 'Modelo o servicio educativo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cSedeNombre',
            header: 'Fase',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cSedeNombre',
            header: 'Ciclo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cConfigNroRslAprobacion',
            header: 'Grados',
            text_header: 'center',
            text: 'center',
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
}
