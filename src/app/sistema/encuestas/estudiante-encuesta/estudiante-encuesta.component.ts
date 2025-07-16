import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'
@Component({
    selector: 'app-estudiante-encuesta',
    standalone: true,
    imports: [PrimengModule, FormsModule],
    templateUrl: './estudiante-encuesta.component.html',
    styleUrl: './estudiante-encuesta.component.scss',
})
export class EstudianteEncuestaComponent {
    title: string = 'Censo DRE/UGEL 2024'
    subtitle: string = 'SEGUIMIENTO Y MONITORIO PEDAGÓGICO'
    activeIndex: number = 0

    preguntas = [
        {
            iPreguntaId: '1001',
            cPregunta: '<p>¿Cuál es el libro sagrado del cristianismo?</p>',
            title: 'Pregunta 1',
            iMarcado: 0,
            alternativas: [
                {
                    iAlternativaId: '1001',
                    cAlternativaDescripcion: 'La Biblia',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1002',
                    cAlternativaDescripcion: 'El Corán',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1003',
                    cAlternativaDescripcion: 'La Torá',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1004',
                    cAlternativaDescripcion: 'El Bhagavad Gita',
                    iMarcado: 0,
                },
            ],
        },
        {
            iPreguntaId: '1002',
            cPregunta:
                '<p>¿Cuál de los siguientes es un ejemplo de valor moral?</p>',
            title: 'Pregunta 2',
            iMarcado: 0,
            alternativas: [
                {
                    iAlternativaId: '1005',
                    cAlternativaDescripcion: 'Honestidad',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1006',
                    cAlternativaDescripcion: 'Egoísmo',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1007',
                    cAlternativaDescripcion: 'Envidia',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1008',
                    cAlternativaDescripcion: 'Avaricia',
                    iMarcado: 0,
                },
            ],
        },
    ]
    anteriorPregunta() {
        if (this.activeIndex > 0) {
            this.activeIndex = this.activeIndex - 1
        }
    }

    siguientePregunta(index: number) {
        if (index <= this.preguntas.length - 1) {
            this.activeIndex = index + 1
        }
    }

    seleccionarPregunta(index: number) {
        this.activeIndex = index
    }

    guardarPregunta(alternativas: any[], alternativa: any) {
        alternativas.forEach((alt) => {
            alt.iMarcado = 0
        })

        alternativa.iMarcado = 1

        this.preguntas[this.activeIndex].iMarcado = 1
    }
    calcularPreguntasRespondidas(): number {
        return this.preguntas.filter((p) => p.iMarcado === 0).length
    }
}
