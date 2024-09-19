import { Component, OnInit } from '@angular/core'
import { PrimeNGConfig } from 'primeng/api'
import { TokenStorageService } from './servicios/token.service'
import { Router, RouterOutlet } from '@angular/router'
import { AppLayoutComponent } from './layout/app.layout.component'
import { ConstantesService } from './servicios/constantes.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet, AppLayoutComponent],
})
export class AppComponent implements OnInit {
    isLoggedIn: boolean = false
    username: string
    bVerificado: boolean = false
    constructor(
        private primengConfig: PrimeNGConfig,
        private tokenStorageService: TokenStorageService,
        private router: Router,
        private ConstantesService: ConstantesService
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true
        this.isLoggedIn = !!this.tokenStorageService.getToken()
        this.bVerificado = this.ConstantesService.verificado || false

        if (!this.isLoggedIn) {
            this.router.navigate(['login'])
        }
    }
}
