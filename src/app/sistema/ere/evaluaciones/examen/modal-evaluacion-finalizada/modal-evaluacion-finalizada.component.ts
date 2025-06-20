import { PrimengModule } from '@/app/primeng.module'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { TokenStorageService } from '@/app/servicios/token.service'
import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'app-modal-evaluacion-finalizada',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './modal-evaluacion-finalizada.component.html',
    styleUrl: './modal-evaluacion-finalizada.component.scss',
})
export class ModalEvaluacionFinalizadaComponent implements OnInit {
    @Input() grado: string
    @Input() cerrarSesion: boolean = false
    visible: boolean = true
    mostrarBotonEncuesta: boolean = false

    constructor(
        private store: LocalStoreService,
        private router: Router,
        private tokenStorageService: TokenStorageService
    ) {}

    ngOnInit() {
        //Desactivado porque solo era para el piloto
        this.mostrarBotonEncuesta = false
        /*switch (this.grado) {
            case '2do.':
            case '4to.':
                this.mostrarBotonEncuesta = true
                break
        }*/
    }

    irEncuesta() {
        switch (this.grado) {
            case '2do.':
                window.open(
                    'https://docs.google.com/forms/d/e/1FAIpQLSd1g5gBdZRKrtOs8ct5JRgt5Rq2VusvHn10pjtxgUjrLA3LzQ/viewform',
                    '_blank'
                )
                break
            case '4to.':
                window.open(
                    'https://docs.google.com/forms/d/e/1FAIpQLSfLd84JJWdx6fZhUdW7TBGEs7uGFOQaX_JPTyI2hhwzzkDK6w/viewform',
                    '_blank'
                )
                break
        }
    }

    logout(): void {
        if (this.cerrarSesion) {
            this.store.clear()
            this.tokenStorageService.signOut()
            window.location.reload()
        } else {
            this.router.navigate(['/'])
        }
    }
}
