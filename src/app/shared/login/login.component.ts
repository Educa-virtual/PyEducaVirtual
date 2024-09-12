import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit, HostListener } from '@angular/core'
import { BtnLoadingComponent } from '../btn-loading/btn-loading.component'
import { TokenStorageService } from '@/app/servicios/token.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [PrimengModule, BtnLoadingComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    showPassword: boolean
    width: number = window.innerWidth
    loading: boolean
    loadingText: string

    constructor(
        private tokenStorage: TokenStorageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.showPassword = false
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.width = (event.target as Window).innerWidth
    }
    signin() {
        this.loading = true
        this.loadingText = 'Verificando...'
        setTimeout(() => {
            const data = {
                access_token:
                    'ANB7xKhiUZmwltVd3f1odcHHM9VAwg02kwmLwtZwHv3SxGCOWLUf5W4G7X22PRjmR9StvFUqzpVZ1suOfyfOigdi-rnohxyEaSSuZceeLw_9OBW7fXldOG05HEgkeK3N-DBZZZyilodmjA1JWZHbgI3IU7Rmz5IPGyi-sDxHN3KlOr1BDZlLZpXPdFPwEyb6idq-z8AL-blKTSMtNI3_fz3oNBisfrHGUv5tXHoQT4B7FYcvdrap16gTOO7_wNt1zmgLJiUHvyxZgsgBchm_AhohVL-AYgcfCbCR0v7d2hgI4ag35pnZNeujDiBLfnCFcVMlqQGq8UEVZrmU9a8y4pVAGih_EImmghqmSrkxLPYZ800-vIWX-lw',
                token_type: 'Bearer',
                expires_in: 300,
            }
            this.tokenStorage.saveToken(data.access_token)
            this.loading = false
            this.router.navigate(['./'])
        }, 200)
        setTimeout(() => {
            location.reload()
        }, 350)
    }
}
