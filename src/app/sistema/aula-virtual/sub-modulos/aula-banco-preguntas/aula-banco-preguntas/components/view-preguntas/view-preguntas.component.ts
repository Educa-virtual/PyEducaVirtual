import { PrimengModule } from '@/app/primeng.module'
import { environment } from '@/environments/environment'
import { CommonModule, NgFor, NgIf } from '@angular/common'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgxDocViewerModule } from 'ngx-doc-viewer'

@Component({
    selector: 'app-view-preguntas',
    standalone: true,
    imports: [
        PrimengModule,
        NgFor,
        NgIf,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxDocViewerModule,
    ],
    templateUrl: './view-preguntas.component.html',
    styleUrl: './view-preguntas.component.scss',
})
export class ViewPreguntasComponent implements OnChanges {
    @Input() showDetallePregunta: boolean = false
    @Input() detallePreguntas
    @Input() titulo: string

    @Output() accionBtnItem = new EventEmitter()

    environment = environment.backend
    ngOnChanges(changes) {
        if (changes.showDetallePregunta?.currentValue) {
            this.showDetallePregunta = changes.showDetallePregunta.currentValue
        }
        if (changes.detallePreguntas?.currentValue) {
            this.detallePreguntas = changes.detallePreguntas.currentValue

            this.detallePreguntas.forEach((i) => {
                i.alternativas = i.alternativas
                    ? JSON.parse(i.alternativas)
                    : []
            })
            console.log(this.detallePreguntas)
        }
        if (changes.titulo?.currentValue) {
            this.titulo = changes.titulo.currentValue
        }
    }

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({
                    accion: 'close-modal',
                    item,
                })
                break
        }
    }
}
