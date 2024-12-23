import { Component, inject, Input, OnInit } from '@angular/core'
import { ICurso } from '../../../interfaces/curso.interface'
import { TableModule } from 'primeng/table'
import { PrimengModule } from '@/app/primeng.module'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
//Message,
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
@Component({
    selector: 'app-tab-inicio',
    standalone: true,
    imports: [TableModule, PrimengModule],
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

    anunciosDocente: any[] = []

    //form para obtener la variable
    public guardarPublicacion: FormGroup = this._formBuilder.group({
        iForo: [''],
        cForoDescripcion: ['', [Validators.required]],
        iForoCatId: [4],
    })
    //para los alert
    constructor(private messageService: MessageService) {}
    //Inicializamos
    ngOnInit(): void {
        this.obtenerAnuncios()
    }
    // metodo para limpiar las etiquetas
    limpiarHTML(html: string): string {
        const temporal = document.createElement('div') // Crear un div temporal
        temporal.innerHTML = html // Insertar el HTML
        return temporal.textContent || '' // Obtener solo el texto
    }
    //Guardamos el anuncio que el docente hico para los alumnos
    guardarPublicacionDocente() {
        const descripcion = this.guardarPublicacion.value
        const descripcionLimpia = this.limpiarHTML(descripcion.cForoDescripcion)
        const registro: any = {
            iForoCatId: descripcion.iForoCatId,
            idDocCursoId: this.idDocCursoId,
            cForoDescripcion: descripcionLimpia,
        }
        console.log('hola where', registro)
        this._aulaService.guardarAnucio(registro).subscribe({
            next: (response) => {
                this.obtenerAnuncios()
                console.log(response)
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Se Guardo correctamente el anuncio.',
                })
            },
            error: (error) => {
                console.log('Error en la actualización:', error)
            },
        })

        this.guardarPublicacion.reset()
    }
    //el button para leer mas o menos
    toggleExpand(comment: any) {
        comment.expanded = !comment.expanded
    }
    //datos de los anuncios
    obtenerAnuncios() {
        const idForo = 4
        const idDocente = this.idDocCursoId
        this._aulaService
            .obtenerAnunciosDocnt({
                iForoCatId: idForo,
                iDocenteId: idDocente,
            })
            .subscribe((data) => {
                this.anunciosDocente = data['data']
                console.log(this.anunciosDocente)
            })
    }
}
