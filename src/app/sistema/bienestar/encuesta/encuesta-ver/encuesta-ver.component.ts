import { PrimengModule } from '@/app/primeng.module'
import { Component, inject } from '@angular/core'
import { DatosEncuestaService } from '../../services/datos-encuesta.service'
import { MenuItem, MessageService } from 'primeng/api'
import { FuncionesBienestarService } from '../../services/funciones-bienestar.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ActivatedRoute, Router } from '@angular/router'
import { PreguntaCerradaComponent } from '../shared/pregunta-cerrada/pregunta-cerrada.component'
import { PreguntaAbiertaComponent } from '../shared/pregunta-abierta/pregunta-abierta.component'
import { PreguntaEscalaComponent } from '../shared/pregunta-escala/pregunta-escala.component'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-encuesta-ver',
    standalone: true,
    imports: [
        PrimengModule,
        PreguntaCerradaComponent,
        PreguntaAbiertaComponent,
        PreguntaEscalaComponent,
    ],
    templateUrl: './encuesta-ver.component.html',
    styleUrl: './encuesta-ver.component.scss',
})
export class EncuestaVerComponent {
    iEncuId: number
    cEncuNombre: string
    cEncuDescripcion: string
    dEncuHasta: Date
    perfil: any
    preguntas: Array<any>
    formPreguntas: FormGroup

    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    get preguntasFormArray() {
        return this.formPreguntas.get('preguntas') as FormArray
    }

    private _messageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private datosEncuestas: DatosEncuestaService,
        private funcionesBienestar: FuncionesBienestarService,
        private store: LocalStoreService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        this.route.paramMap.subscribe((params: any) => {
            this.iEncuId = params.params.id || 0
        })
    }

    ngOnInit(): void {
        try {
            this.formPreguntas = this.fb.group({
                iEncuId: [this.iEncuId, Validators.required],
                iCredEntPerfId: [this.perfil.iCredEntPerfId],
                preguntas: this.fb.array([]),
                jsonPreguntas: [null],
            })
        } catch (error) {
            console.error('Error creando formulario:', error)
        }
        if (this.iEncuId) {
            this.verEncuesta()
            this.listarPreguntas()
        }
        this.breadCrumbItems = [
            {
                label: 'Gestionar encuestas',
                routerLink: '/bienestar/gestionar-encuestas',
            },
            {
                label: 'Responder encuesta',
            },
        ]
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/',
        }
    }

    verEncuesta() {
        this.datosEncuestas
            .verEncuesta({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEncuId: this.iEncuId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data.length) {
                        this.cEncuNombre = data.data[0].cEncuNombre
                        this.cEncuDescripcion = data.data[0].cEncuDescripcion
                        this.dEncuHasta = data.data[0].dEncuHasta
                    }
                },
                error: (error) => {
                    console.error('Error obteniendo encuesta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    listarPreguntas() {
        this.datosEncuestas
            .listarPreguntas({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEncuId: this.iEncuId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data.length) {
                        this.preguntas = data.data
                        this.setPreguntasFormArray(this.preguntas)
                    } else {
                        this.preguntas = null
                        this.preguntasFormArray.clear()
                    }
                },
                error: (error) => {
                    console.error('Error guardando pregunta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    setPreguntasFormArray(preguntas: any[]) {
        const preguntasFGs = preguntas.map((p) =>
            this.fb.group({
                iEncuPregId: [p.iEncuPregId],
                iEncuPregTipoId: [p.iEncuPregTipoId],
                cEncuRptaContenido: [null, Validators.required],
            })
        )
        const formArray = this.fb.array(preguntasFGs)
        this.formPreguntas.setControl('preguntas', formArray)
    }

    guardarRespuesta() {
        this.funcionesBienestar.formControlJsonStringify(
            this.formPreguntas,
            'jsonPreguntas',
            'preguntas',
            ''
        )

        this.datosEncuestas
            .guardarRespuesta(this.formPreguntas.value)
            .subscribe({
                next: () => {
                    this.listarPreguntas()
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Registro exitoso',
                        detail: 'Se registraron los datos',
                    })
                },
                error: (error) => {
                    console.error('Error guardando pregunta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    salir() {
        this.router.navigate(['/bienestar/gestionar-encuestas'])
    }
}
