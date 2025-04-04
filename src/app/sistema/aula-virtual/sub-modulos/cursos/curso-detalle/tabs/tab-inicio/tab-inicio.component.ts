import { Component, inject, Input, OnInit } from '@angular/core'
import { ICurso } from '../../../interfaces/curso.interface'
import { TableModule } from 'primeng/table'
import { PrimengModule } from '@/app/primeng.module'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
//Message,
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { ButtonModule } from 'primeng/button'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
@Component({
    selector: 'app-tab-inicio',
    standalone: true,
    imports: [TableModule, PrimengModule, ButtonModule],
    templateUrl: './tab-inicio.component.html',
    styleUrl: './tab-inicio.component.scss',
})
export class TabInicioComponent implements OnInit {
    @Input() curso: ICurso
    @Input() anuncios = []
    @Input() iCursoId
    @Input() _iSilaboId
    @Input() idDocCursoId

    private _formBuilder = inject(FormBuilder)
    private _aulaService = inject(ApiAulaService)
    private GeneralService = inject(GeneralService)
    private _constantesService = inject(ConstantesService)
    private _confirmService = inject(ConfirmationModalService)

    public DOCENTE = DOCENTE
    public ESTUDIANTE = ESTUDIANTE

    iPerfilId: number
    anunciosDocente: any[] = []
    data: any[]

    //form para obtener la variable
    public guardarComunicado: FormGroup = this._formBuilder.group({
        numero: [''],
        titulo: ['', [Validators.required]],
        descripcion: [''],
    })
    //para los alert
    constructor(private messageService: MessageService) {}

    //Inicializamos
    ngOnInit(): void {
        this.iPerfilId = this._constantesService.iPerfilId
        this.obtenerAnuncios()
    }

    // guardar anunciado:
    guardarComunicadoSubmit() {
        if (this.guardarComunicado.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Formulario inválido',
            })
        } else {
            this._confirmService.openConfiSave({
                message: 'Recuerde que son datos de ayuda',
                header: `¿Esta seguro de descargar en PDF el nivel de logro de: ?`,
                accept: () => {
                    const iCursosNivelGradId = 1
                    const iCredId = 1
                    const data = {
                        iCursosNivelGradId: iCursosNivelGradId,
                        idDocCursoId: this.idDocCursoId,
                        iCredId: iCredId,
                        cTitulo: this.guardarComunicado.value.titulo,
                        cContenido: this.guardarComunicado.value.descripcion,
                    }
                    this._aulaService.guardarAnuncio(data).subscribe({
                        next: (resp: any) => {
                            // para refrescar la pagina
                            if (resp?.validated) {
                                this.obtenerAnuncios()
                                // this.guardarComunicado.get('cForoRptaPadre')?.reset()
                            }
                        },
                        error: (error) => {
                            console.error('Comentario:', error)
                        },
                    })
                },
                reject: () => {
                    // Mensaje de cancelación (opcional)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Cancelado',
                        detail: 'Acción cancelada',
                    })
                },
            })

            console.log(this.guardarComunicado.value)
            this.guardarComunicado.reset()
        }
    }

    // metodo para eliminar el anuncio
    eliminarComunicado(id: string): void {
        this._confirmService.openConfiSave({
            message: 'Recuerde que al eliminarlo no podra recuperarlo',
            header: `¿Esta seguro de Eliminar: ?`,
            accept: () => {
                const iCredId = 1
                const params = {
                    iAnuncioId: id,
                    iCredId: iCredId,
                }
                this._aulaService.eliminarAnuncio(params).subscribe({
                    next: (response) => {
                        console.log(
                            'Elemento eliminado correctamente:',
                            response
                        )
                    },
                    error: (err) => {
                        console.error('Error al eliminar:', err)
                    },
                })

                // Si quieres además eliminarlo del array local:
                this.data = this.data.filter((item) => item.iAnuncioId !== id)
            },
            reject: () => {
                // Mensaje de cancelación (opcional)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Acción cancelada',
                })
            },
        })
    }

    // metodo para fijar el anuncio
    fijarAnuncio(): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Se ha fijado el anuncio correctamente',
        })
    }

    // obtener anciados de curso
    obtenerAnuncios() {
        const iCursosNivelGradId = 1
        const iCredId = 1

        const paramst = {
            iCursosNivelGradId: iCursosNivelGradId,
            idDocCursoId: this.idDocCursoId,
            iCredId: iCredId,
        }

        this._aulaService.obtenerAnuncios(paramst).subscribe((Data) => {
            this.data = Data['data']
            console.log(this.data)
        })
    }
}
