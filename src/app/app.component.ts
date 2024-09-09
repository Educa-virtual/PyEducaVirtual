import { Component, OnInit } from '@angular/core'
import { PrimeNGConfig } from 'primeng/api'
import { TokenStorageService } from './servicios/token.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    isLoggedIn = false
    username: string
    constructor(
        private primengConfig: PrimeNGConfig,
        private tokenStorageService: TokenStorageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true
        this.isLoggedIn = !!this.tokenStorageService.getToken()

        if (!this.isLoggedIn) {
            this.router.navigate(['login'])
        }
    }
}
