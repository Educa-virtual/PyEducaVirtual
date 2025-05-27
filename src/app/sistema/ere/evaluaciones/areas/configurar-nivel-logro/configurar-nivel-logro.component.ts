import { PrimengModule } from '@/app/primeng.module'
import { StringCasePipe } from '@/app/shared/pipes/string-case.pipe'
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core'
import { ApiNivelLogrosService } from '../../../services/api-nivel-logros.service'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-configurar-nivel-logro',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './configurar-nivel-logro.component.html',
    styleUrl: './configurar-nivel-logro.component.scss',
    providers: [StringCasePipe],
})
export class ConfigurarNivelLogroComponent implements OnInit {
    private nivelLogrosService = inject(ApiNivelLogrosService)
    private maxFilas: number = 4
    visible: boolean = false
    curso: ICurso
    titulo: string = ''
    nivelLogros: any[] = []
    formlogros!: FormGroup
    //@Output() archivoSubidoEvent = new EventEmitter<{ curso: ICurso }>()

    constructor(
        private stringCasePipe: StringCasePipe,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {}

    // dialog que dispara desde el icon trophy
    @Input() set mostrar(value: boolean) {
        this.visible = value
    }
    get mostrar(): boolean {
        return this.visible
    }

    @Output() mostrarChange = new EventEmitter<boolean>()

    ngOnInit() {
        this.nivelLogrosService.obtenerListaNivelLogros().subscribe((data) => {
            this.nivelLogros = data
        })
        this.formlogros = this.fb.group({
            logros: this.fb.array([this.createLogro()]),
        })
    }

    createLogro(): FormGroup {
        return this.fb.group({
            iDesde: [null],
            iHasta: [null],
            iNivelLogroId: [null],
        })
    }

    get logros(): FormArray {
        return this.formlogros.get('logros') as FormArray
    }

    addFilaLogro() {
        this.logros.push(this.createLogro())
    }

    registrarLogros() {
        this.nivelLogrosService
            .registrarNivelLogrosArea(this.curso, this.formlogros.value.logros)
            .subscribe({
                next: (respuesta) => {
                    this.messageService.add({
                        severity: respuesta['status'].toLowerCase(),
                        detail: respuesta['message'],
                    })
                    this.visible = false
                },
                error: (respuesta) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: respuesta,
                    })
                },
            })
    }

    mostrarDialog(datos: { curso: ICurso }) {
        this.curso = datos.curso

        this.titulo = `${this.stringCasePipe.transform(this.curso.cCursoNombre)} - ${this.curso.cGradoAbreviacion.toString().substring(0, 1)}° Grado
            - ${this.curso.cNivelTipoNombre.toString().replace('Educación ', '')}`
        this.obtenerNivelLogrosArea()
        this.visible = true
    }

    obtenerNivelLogrosArea() {
        this.nivelLogrosService.obtenerNivelLogrosArea(this.curso).subscribe({
            next: (respuesta) => {
                this.logros.clear()
                respuesta.data.forEach((nivelLogro: any) => {
                    const logroForm = this.fb.group({
                        iDesde: [nivelLogro.nNivelLCDesde],
                        iHasta: [nivelLogro.nNivelLCHasta],
                        iNivelLogroId: [nivelLogro.iNivelLogroId],
                    })
                    this.logros.push(logroForm)
                })
                for (let i = respuesta.data.length; i < this.maxFilas; i++) {
                    this.addFilaLogro()
                }
            },
            error: (respuesta) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: respuesta,
                })
            },
        })
    }

    onDialogHide(): void {
        this.mostrarChange.emit(false)
    }
}
