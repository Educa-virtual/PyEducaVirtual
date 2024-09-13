import { Component, OnInit } from '@angular/core'
import { PrimeNGConfig } from 'primeng/api'
import { TokenStorageService } from './servicios/token.service'
import { Router, RouterOutlet } from '@angular/router'
import { AppLayoutComponent } from './layout/app.layout.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet, AppLayoutComponent],
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
