import { PrimengModule } from '@/app/primeng.module'
import { SharedAnimations } from '@/app/shared/animations/shared-animations'
import { RecursosListaComponent } from '@/app/shared/components/recursos-lista/recursos-lista.component'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
import { Component, Input, OnChanges } from '@angular/core'

@Component({
    selector: 'app-tarea-room-estudiantes',
    standalone: true,
    imports: [
        PrimengModule,
        IconComponent,
        RecursosListaComponent,
        TypesFilesUploadPrimengComponent,
    ],
    templateUrl: './tarea-room-estudiantes.component.html',
    styleUrl: './tarea-room-estudiantes.component.scss',
    animations: [SharedAnimations],
})
export class TareaRoomEstudiantesComponent implements OnChanges {
    @Input() data
    @Input() FilesTareas = []

    typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: true,
    }
    filesUrl = []
    ngOnChanges(changes) {
        if (changes.data?.currentValue) {
            this.data = changes.data.currentValue
        }
        if (changes.FilesTareas?.currentValue) {
            this.FilesTareas = changes.FilesTareas.currentValue
        }
    }
}
