import {
    Component,
    OnInit,
    // SimpleChanges,
} from '@angular/core'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import {
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'

import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
//import { ButtonModule } from 'primeng/button'
//import { CheckboxModule } from 'primeng/checkbox'
//import { DialogModule } from 'primeng/dialog'
//import { DropdownModule } from 'primeng/dropdown'
import { ActivatedRoute } from '@angular/router'
import { TrasladoExternoComponent } from './traslado-externo/traslado-externo.component'
import { TrasladoInternoComponent } from './traslado-interno/traslado-interno.component'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'

@Component({
    selector: 'app-gestion-traslados',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        //    CheckboxModule,
        ReactiveFormsModule,
        FormsModule,
        //  ButtonModule,
        //   DialogModule,
        //    DropdownModule,
        TrasladoExternoComponent,
        TrasladoInternoComponent,
        PrimengModule,
    ],
    templateUrl: './gestion-traslados.component.html',
    styleUrl: './gestion-traslados.component.scss',
    providers: [MessageService],
})
export class GestionTrasladosComponent implements OnInit {
    form: FormGroup
    visible: boolean = false
    modal: string = ''
    anio_escolar: any // calendario académico
    registros_traslados: any[] = []
    perfil: any
    title: string
    tipo_traslados: any[] /*= [
        {ITipoTrasladoIEId: 0, cTipoTrasladoIE: 'Todos'},
        {ITipoTrasladoIEId: 1, cTipoTrasladoIE: 'Cambio de IE'},
        {ITipoTrasladoIEId: 2, cTipoTrasladoIE: 'Revalidación / Convalidación'},
        {ITipoTrasladoIEId: 3, cTipoTrasladoIE: 'Pueba de ubicación'},
        {ITipoTrasladoIEId: 4, cTipoTrasladoIE: 'Reingreso'}, ]*/

    estados: any[] = [
        { iEstadoTraslado: 0, cEstadoTraslado: 'Pendiente' },
        { iEstadoTraslado: 1, cEstadoTraslado: 'Atendido' },
        { iEstadoTraslado: 2, cEstadoTraslado: 'Derivado' },
    ]

    constructor(
        private fb: FormBuilder,
        public route: ActivatedRoute,
        private messageService: MessageService,
        public query: GeneralService,
        private store: LocalStoreService
    ) {}

    // ngOnDestroy(): void {
    //     throw new Error('Method not implemented.')
    // }
    // ngOnChanges(changes: SimpleChanges): void {
    //     throw new Error('Method not implemented.', changes)
    //     this.showModeCreateDialog();
    // }
    ngOnInit(): void {
        // throw new Error('Method not implemented.')
        this.perfil = this.store.getItem('dremoPerfil')

        this.getAnioCalendario()
        this.getTipoTraslado() //

        try {
            this.form = this.fb.group({
                //Declaracion de variables
                cTipoConstancia: [0, Validators.required],
                cEstadoConstancia: [0, Validators.required],
                cAnioDestino: [0, Validators.required],
                cTipoTraslado: [
                    { value: null, disabled: true },
                    Validators.required,
                ],
                cEstadoTraslado: [
                    { value: null, disabled: true },
                    Validators.required,
                ],
                cAnioTraslado: [null, Validators.required],
            })
        } catch (error) {
            //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }

    getAnioCalendario(): void {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'year_academicos',
                campos: 'iYAcadId, iYearId',
                condicion: '1= 1',
            })
            .subscribe({
                next: (data: any) => {
                    this.anio_escolar = data.data
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    // console.log('Request completed')
                },
            })
    }

    trasladar(elemento): void {
        const { accion } = elemento
        switch (accion) {
            case 'externo':
                this.visible = true
                this.modal = 'externo'
                this.title = 'REGISTRAR TRASLADO EXTERNO'
                // this.messageService.add({
                //     severity: 'success',
                //     summary: 'Mensaje',
                //     detail: 'El registro de datos en el SIAGIE es de total y estricta responsabilidad del director de la IE, incluyendo el registro de traslados; por lo que, la generación de un traslado de manera innecesaria o irregular (sin autorización del tutor del menor) por parte de la IE destino, conllevará a una sanción administrativa y/o legal. Los datos a ser llenados poseen carácter de declaración jurada',
                // })
                break
            default:
                this.visible = true
                this.modal = 'interno'
                this.title = 'REGISTRAR TRASLADO INTERNO'
                break
        }
    }

    // ngOnInit() {}

    // ngOnChanges(changes) {}

    // ngOnDestroy() {}
    accionCboItem(id: number, elemento: string): void {
        switch (elemento) {
            case 'cAnioTraslado':
                this.form.controls['cTipoTraslado'].enable()
                this.form.controls['cEstadoTraslado'].enable()
                this.searchTraslados(id, this.perfil.iSedeId)

                break
            default:
                this.form.controls['cTipoTraslado'].disable()
                this.form.controls['cEstadoTraslado'].disable()

                break
        }
    }
    searchTraslados(id: number, iSedeId: number) {
        const params = 'iYAcadId = ' + id + ' AND iSedeIdDestino = ' + iSedeId
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'traslados_ies',
                campos: '*',
                condicion: params,
            })
            .subscribe({
                next: (data: any) => {
                    this.registros_traslados = data.data
                },
                error: (error) => {
                    console.error('Error fetching Traslados:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    // console.log('Request completed')
                },
            })
    }

    getTipoTraslado(): void {
        // consulta tipo de traslados
        this.query.searhTipoTraslados().subscribe({
            next: (data: any) => {
                this.tipo_traslados = data.data
            },
            error: (error) => {
                console.error('Error fetching tipos de traslados:', error)
            },
            complete: () => {
                this.tipo_traslados.unshift({
                    iTipoTrasladoIEId: '0',
                    cTipoTrasladoIE: 'Todos',
                })
            },
        })
    }

    mensajeIformativo(): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Mensaje',
            detail: 'El registro de datos en el SIAGIE es de total y estricta responsabilidad del director de la IE, incluyendo el registro de traslados; por lo que, la generación de un traslado de manera innecesaria o irregular (sin autorización del tutor del menor) por parte de la IE destino, conllevará a una sanción administrativa y/o legal. Los datos a ser llenados poseen carácter de declaración jurada',
        })
    }

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Traslado Externo',
            text: 'Solicitud Externa',
            icon: 'pi pi-file',
            accion: 'externo',
            class: 'p-button-warning',
        },
        {
            labelTooltip: 'Traslado Interno',
            text: 'Traslado Interno',
            icon: 'pi pi-address-book',
            accion: 'interno',
            class: 'p-button-primary',
        },
    ]

    columns: IColumn[] = [
        {
            type: 'text',
            width: '5rem',
            field: 'cTasladoDocumento',
            header: 'Cod. Estudiante',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cModalServNombre',
            header: 'Estudiante',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'dtAperTurnoInicio',
            header: 'Cod. Mod Origen',
            text_header: 'Hora inicio',
            text: 'left',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'I.E Origen',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'Fecha Matricula Origen',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'Nivel Origen',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'Grado Destino',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'Año Destino',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'dtAperTurnoFin',
            header: 'N° de Resolución',
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
