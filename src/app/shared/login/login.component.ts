import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { BtnLoadingComponent } from '../btn-loading/btn-loading.component'
import { TokenStorageService } from '@/app/servicios/token.service'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '@/app/servicios/auth.service'
import { MessageService } from 'primeng/api'

interface Data {
    accessToken: string
    refreshToken: string
    expires_in: number
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [PrimengModule, BtnLoadingComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: [MessageService],
})
export class LoginComponent implements OnInit {
    showPassword: boolean
    loading: boolean
    loadingText: string
    formLogin!: FormGroup

    constructor(
        private tokenStorage: TokenStorageService,
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.formLogin = this.fb.group({
            cEmail: ['', Validators.required],
            cPassword: ['', Validators.required],
        })
    }

    ngOnInit() {
        this.showPassword = false
    }

    onSubmit() {
        this.loading = true
        this.loadingText = 'Verificando...'
        // this.authService.login(this.formLogin.value).subscribe({
        //     next: (data: Data) => {
        //         this.tokenStorage.setItem('mpiToken', data)

        //         this.tokenStorage.saveToken(data.accessToken)
        //         this.tokenStorage.saveRefreshToken(data.refreshToken)
        //         this.tokenStorage.saveUser(data)
        //         this.loading = false
        //         this.router.navigate(['./'])
        //         setTimeout(() => {
        //             location.reload()
        //         }, 350)
        //     },
        //     complete: () => {},
        //     error: (err) => {
        //         console.log(err)
        //         this.loading = false
        //         if (err.status == 401) {
        //             this.messageService.add({
        //                 severity: 'error',
        //                 summary: '¡Acceso Denegado!',
        //                 detail: err.error.error,
        //             })
        //         }
        //         if (err.status == 403) {
        //             this.messageService.add({
        //                 severity: 'error',
        //                 summary: '¡Acceso Prohibido!',
        //                 detail: err.error.error,
        //             })
        //         }
        //         if (err.error.password.length) {
        //             this.messageService.add({
        //                 severity: 'error',
        //                 summary: '¡Atención!',
        //                 detail: err.error.password[0],
        //             })
        //         }
        //     },
        // })
        setTimeout(() => {
            const data: Data = {
                accessToken:
                    'ANB7xKhiUZmwltVd3f1odcHHM9VAwg02kwmLwtZwHv3SxGCOWLUf5W4G7X22PRjmR9StvFUqzpVZ1suOfyfOigdi-rnohxyEaSSuZceeLw_9OBW7fXldOG05HEgkeK3N-DBZZZyilodmjA1JWZHbgI3IU7Rmz5IPGyi-sDxHN3KlOr1BDZlLZpXPdFPwEyb6idq-z8AL-blKTSMtNI3_fz3oNBisfrHGUv5tXHoQT4B7FYcvdrap16gTOO7_wNt1zmgLJiUHvyxZgsgBchm_AhohVL-AYgcfCbCR0v7d2hgI4ag35pnZNeujDiBLfnCFcVMlqQGq8UEVZrmU9a8y4pVAGih_EImmghqmSrkxLPYZ800-vIWX-lw',
                refreshToken: 'Bearer',
                expires_in: 300,
            }
            this.tokenStorage.saveToken(data.accessToken)
            this.loading = false
            this.router.navigate(['./'])
        }, 200)
        setTimeout(() => {
            location.reload()
        }, 350)
    }
}
