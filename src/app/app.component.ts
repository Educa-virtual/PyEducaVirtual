import { Component, OnInit } from '@angular/core'
import { PrimeNGConfig } from 'primeng/api'
import { TokenStorageService } from './servicios/token.service'
import { Router, RouterOutlet } from '@angular/router'
import { AppLayoutComponent } from './layout/app.layout.component'
import { ConstantesService } from './servicios/constantes.service'
import localEs from 'primelocale/es.json'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet, AppLayoutComponent],
})
export class AppComponent implements OnInit {
    isLoggedIn: boolean = false
    username: string
    bCredVerificado: boolean = false
    constructor(
        private primengConfig: PrimeNGConfig,
        private tokenStorageService: TokenStorageService,
        private router: Router,
        private ConstantesService: ConstantesService
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true
        this.primengConfig.setTranslation(localEs.es)
        //const store = new LocalStoreService()
        const user = localStorage.getItem('dremoToken')

        const accessToken = localStorage.getItem('auth-token')
        const refreshToken = localStorage.getItem('auth-refreshtoken')
        if (user) {
            this.tokenStorageService.saveUser(user.replaceAll('"', ''))
            this.tokenStorageService.saveToken(accessToken)
            this.tokenStorageService.saveRefreshToken(refreshToken)
        } else {
            localStorage.clear()
            this.tokenStorageService.signOut()
        }

        this.isLoggedIn = !!this.tokenStorageService.getToken()
        const verificado = localStorage.getItem('dremoPerfilVerificado')
        this.bCredVerificado = verificado == 'true' || false

        if (!this.isLoggedIn) {
            this.router.navigate(['login'])
        }
    }
}
