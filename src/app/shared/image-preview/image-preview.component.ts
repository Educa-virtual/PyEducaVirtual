import { PrimengModule } from '@/app/primeng.module'
import { NgIf } from '@angular/common'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-image-preview',
    standalone: true,
    imports: [NgIf, FormsModule, PrimengModule],
    templateUrl: './image-preview.component.html',
    styleUrl: './image-preview.component.scss',
})
export class ImagePreviewComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() imageUrl: string | ArrayBuffer | null = null // Variable para almacenar la URL de la imagen seleccionada
    @Input() showModal: boolean = false

    zoomLevel: number = 100

    ngOnChanges(changes: any) {
        if (changes.imageUrl?.currentValue) {
            this.imageUrl = changes.imageUrl.currentValue
        }
        if (changes.showModal?.currentValue) {
            this.showModal = changes.showModal.currentValue
        }
    }

    aumentarZoom() {
        if (this.zoomLevel == 120) {
            return
        }
        this.zoomLevel = this.zoomLevel + 10
    }
    disminuirZoom() {
        if (this.zoomLevel == 50) {
            return
        }
        this.zoomLevel = this.zoomLevel - 10
    }

    accionBtn(accion, item) {
        const data = {
            accion,
            item,
        }
        this.accionBtnItem.emit(data)
    }
}
