import { PrimengModule } from '@/app/primeng.module'
import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { SilaboComponent } from '../../../silabo/silabo.component'

@Component({
    selector: 'app-gestionar-silabo',
    standalone: true,
    imports: [PrimengModule, SilaboComponent],
    templateUrl: './gestionar-silabo.component.html',
    styleUrl: './gestionar-silabo.component.scss',
})
export class GestionarSilaboComponent {
    @Input() idDocCursoId: string
    @Input() cCursoNombre: string
    @Input() iAvanceSilabo: number

    constructor(private router: Router) {}
    goAreasEstudio() {
        this.router.navigate(['aula-virtual/areas-curriculares'])
    }
}
