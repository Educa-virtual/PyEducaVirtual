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
    styleUrl: './../../gestionar-encuestas/gestionar-encuestas.component.scss',
})
export class EncuestaVerComponent {
    iEncuId: number
    iMatrId: number
    perfil: any
    preguntas: Array<any>
    formPreguntas: FormGroup
    encuesta: any
    respuesta_registrada: boolean = false
    puede_editar: boolean = false

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
            this.iMatrId = params.params.matricula || 0
        })
        this.puede_editar = Number(this.perfil.iPerfilId) === 80
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
                label: 'Encuesta',
                routerLink: '/bienestar/encuesta/' + this.iEncuId,
                visible: !this.puede_editar,
            },
            {
                label: 'Respuestas',
                routerLink:
                    '/bienestar/encuesta/' + this.iEncuId + '/respuestas',
                visible: !this.puede_editar,
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
                        this.encuesta = data.data[0]
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
                        this.verRespuestas()
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

    verRespuestas() {
        this.datosEncuestas
            .verRespuesta({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEncuId: this.iEncuId,
                iMatrId: this.iMatrId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data.length) {
                        this.respuesta_registrada = true
                        const respuestas = JSON.parse(data.data[0].respuestas)
                        this.setRespuestasFormArray(respuestas)
                    }
                },
                error: (error) => {
                    console.error('Error obteniendo respuestas:', error)
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

    setRespuestasFormArray(respuestas: any[]) {
        const preguntasFA = this.formPreguntas.get('preguntas') as FormArray
        preguntasFA.controls.forEach((preguntaFG: FormGroup) => {
            const respuesta = respuestas.find(
                (respuesta: any) =>
                    respuesta.iEncuPregId ==
                    preguntaFG.get('iEncuPregId')?.value
            )
            if (respuesta) {
                preguntaFG.patchValue({
                    cEncuRptaContenido: respuesta.cEncuRptaContenido,
                })
            }
        })
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

    actualizarRespuesta() {
        this.funcionesBienestar.formControlJsonStringify(
            this.formPreguntas,
            'jsonPreguntas',
            'preguntas',
            ''
        )

        this.datosEncuestas
            .actualizarRespuesta(this.formPreguntas.value)
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Actualización exitosa',
                        detail: 'Se actualizaron los datos',
                    })
                },
                error: (error) => {
                    console.error('Error actualizando pregunta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    salir() {
        if (!this.puede_editar) {
            this.router.navigate([
                '/bienestar/encuesta/' + this.iEncuId + '/respuestas',
            ])
        } else {
            this.router.navigate(['/bienestar/gestionar-encuestas'])
        }
    }
}
