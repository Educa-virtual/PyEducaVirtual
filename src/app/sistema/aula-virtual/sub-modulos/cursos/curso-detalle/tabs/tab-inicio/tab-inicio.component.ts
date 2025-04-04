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
            console.log(this.guardarComunicado.value)
            this.guardarComunicado.reset()
        }
    }
    // obtener anciados de curso
    obtenerAnuncios() {
        const iCursosNivelGradId = 1
        const idDocCursoId = 1
        const iCredId = 1

        const paramst = [iCursosNivelGradId, idDocCursoId, iCredId]
        this._aulaService.obtenerAnuncios(paramst).subscribe((Data) => {
            this.data = Data['data']
            console.log(this.data)
        })
    }
}
