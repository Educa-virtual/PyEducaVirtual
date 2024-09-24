import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { SilaboComponent } from '../../../silabo/silabo.component'

@Component({
    selector: 'app-gestionar-silabo',
    standalone: true,
    imports: [PrimengModule, SilaboComponent],
    templateUrl: './gestionar-silabo.component.html',
    styleUrl: './gestionar-silabo.component.scss',
})
export class GestionarSilaboComponent {
    iCursoId: number
    cCursoNombre: string
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.activatedRoute.params.subscribe((params) => {
            this.iCursoId = params['iCursoId']
            this.cCursoNombre = params['cCursoNombre']
        })
    }
    goAreasEstudio() {
        this.router.navigate(['docente/areas-estudio'])
    }
}
