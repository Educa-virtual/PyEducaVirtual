import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { MessageService } from 'primeng/api'
import { FormsModule } from '@angular/forms'
@Component({
    selector: 'app-registrar-logro-alcanzado',
    standalone: true,
    imports: [PrimengModule, FormsModule],
    templateUrl: './registrar-logro-alcanzado.component.html',
    styleUrl: './registrar-logro-alcanzado.component.scss',
    providers: [MessageService],
})
export class RegistrarLogroAlcanzadoComponent implements OnInit {
    @Input() selectedItem: any
    @Output() registraLogroAlcanzado = new EventEmitter<boolean>()
    mostrarBotonFinalizar: boolean = false
    competenciasMatematica = [
        {
            descripcion:
                'Analiza y aplica procedimientos matemáticos para resolver situaciones que involucran cantidades.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
        {
            descripcion:
                'Interpreta y modela relaciones algebraicas y funciones en diversos contextos.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
        {
            descripcion:
                'Argumenta afirmaciones sobre propiedades geométricas y transformaciones en el espacio.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
        {
            descripcion:
                'Organiza, analiza e interpreta datos para la toma de decisiones bajo condiciones de incertidumbre.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
    ]

    competenciasComunicacion = [
        {
            descripcion: 'Se comunica oralmente en su lengua materna.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
        {
            descripcion:
                'Lee diversos tipos de textos escritos en su lengua materna.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
        {
            descripcion:
                'Escribe diversos tipos de textos en su lengua materna.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
    ]

    competenciasIngles = [
        {
            descripcion:
                'Se comunica oralmente en inglés como lengua extranjera.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
        {
            descripcion:
                'Lee diversos tipos de textos escritos en inglés como lengua extranjera.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
        {
            descripcion:
                'Escribe diversos tipos de textos en inglés como lengua extranjera.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
    ]

    competenciasPersonalSocial = [
        {
            descripcion: 'Construye su identidad.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
        {
            descripcion:
                'Convive y participa democráticamente en la búsqueda del bien común.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
        {
            descripcion: 'Construye interpretaciones históricas.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
    ]

    competenciasReligiosa = [
        {
            descripcion:
                'Construye su identidad como persona humana, amada por Dios.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
        {
            descripcion:
                'Asume la experiencia del encuentro personal y comunitario con Dios.',
            b1_nl: '',
            b1_desc: '',
            b2_nl: '',
            b2_desc: '',
            b3_nl: '',
            b3_desc: '',
            b4_nl: '',
            b4_desc: '',
            nl_final: '',
        },
    ]
    constructor(private messageService: MessageService) {}

    ngOnInit() {
        console.log('registrar-logro-alcanzado')
    }

    cerrarDialog() {
        this.registraLogroAlcanzado.emit(false)
    }

    finalizarRegistro() {
        this.registraLogroAlcanzado.emit(false)
        this.mostrarBotonFinalizar = false
    }

    guardarLogro() {
        this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'Guardado Exitosamente',
            life: 3000,
        })
        const datosCompletos = {
            estudiante: this.selectedItem,
            matematica: this.competenciasMatematica,
            comunicacion: this.competenciasComunicacion,
            ingles: this.competenciasIngles,
            personalSocial: this.competenciasPersonalSocial,
            religiosa: this.competenciasReligiosa,
        }

        this.mostrarBotonFinalizar = true

        console.log('Datos a guardar:', datosCompletos)

        //this.registraLogroAlcanzado.emit(true)
    }
}
