import { PrimengModule } from '@/app/primeng.module'
import { environment } from '@/environments/environment'
import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

interface IRucurso {
    type: number
    nameType: string
    name: string
    size: number
    ruta: string
}

@Component({
    selector: 'app-recursos-lista',
    standalone: true,
    imports: [CommonModule, PrimengModule],
    templateUrl: './recursos-lista.component.html',
    styleUrl: './recursos-lista.component.scss',
})
export class RecursosListaComponent {
    @Input({ required: true }) files: IRucurso[]

    openLink(item: IRucurso) {
        let ruta = item.ruta
        if ([1].includes(item.type)) {
            ruta = environment.backend + '/' + item.ruta
        }
        window.open(ruta, '_blank')
    }
}
