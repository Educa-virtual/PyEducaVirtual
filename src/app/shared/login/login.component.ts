import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { BtnLoadingComponent } from '../btn-loading/btn-loading.component'
import { TokenStorageService } from '@/app/servicios/token.service'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '@/app/servicios/auth.service'
import { MessageService } from 'primeng/api'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'

interface Data {
    accessToken: string
    refreshToken: string
    expires_in: number
    msg?
    data?
    validated?: boolean
    code?: number
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
        private messageService: MessageService,
        private ConstantesService: ConstantesService,
        private store: LocalStoreService
    ) {
        this.formLogin = this.fb.group({
            user: ['', Validators.required],
            pass: ['', Validators.required],
        })
    }

    ngOnInit() {
        this.showPassword = false
        const isLoggedIn = !!this.tokenStorage.getToken()
        if (isLoggedIn) {
            this.router.navigate(['./'])
        }
    }

    onSubmit() {
        this.loading = true
        this.loadingText = 'Verificando...'
        this.authService.login(this.formLogin.value).subscribe({
            next: (response: Data) => {
                this.loading = false
                if (!response.data.length)
                    return this.messageService.add({
                        severity: 'error',
                        summary: 'Acceso Denegado!',
                        detail: 'No hay registros con las credenciales ingresadas',
                    })

                const item = response.data[0]

                this.tokenStorage.setItem('dremoToken', item)
                this.tokenStorage.setItem(
                    'dremoPerfilVerificado',
                    item.bCodeVerif == 1 ? true : false
                )

                this.tokenStorage.setItem('auth-token', response.accessToken)
                this.tokenStorage.setItem(
                    'auth-refreshtoken',
                    response.refreshToken
                )

                this.tokenStorage.saveToken(response.accessToken)
                this.tokenStorage.saveRefreshToken(response.refreshToken)
                this.tokenStorage.saveUser(item)

                if (item.bCodeVerif == 1) {
                    this.router.navigate(['./'])
                    setTimeout(() => {
                        location.reload()
                    }, 350)
                } else {
                    this.sendEmail()
                    // this.router.navigate(['verificacion'])
                    // setTimeout(() => {
                    //     location.reload()
                    // }, 350)
                }
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
                this.loading = false
                this.messageService.add({
                    severity: 'error',
                    summary: '¡Atención!',
                    detail: 'Las credenciales son erróneas',
                })
            },
        })
        // setTimeout(() => {
        //     const data: Data = {
        //         accessToken:
        //             'ANB7xKhiUZmwltVd3f1odcHHM9VAwg02kwmLwtZwHv3SxGCOWLUf5W4G7X22PRjmR9StvFUqzpVZ1suOfyfOigdi-rnohxyEaSSuZceeLw_9OBW7fXldOG05HEgkeK3N-DBZZZyilodmjA1JWZHbgI3IU7Rmz5IPGyi-sDxHN3KlOr1BDZlLZpXPdFPwEyb6idq-z8AL-blKTSMtNI3_fz3oNBisfrHGUv5tXHoQT4B7FYcvdrap16gTOO7_wNt1zmgLJiUHvyxZgsgBchm_AhohVL-AYgcfCbCR0v7d2hgI4ag35pnZNeujDiBLfnCFcVMlqQGq8UEVZrmU9a8y4pVAGih_EImmghqmSrkxLPYZ800-vIWX-lw',
        //         refreshToken: 'Bearer',
        //         expires_in: 300,
        //     }
        //     this.tokenStorage.saveToken(data.accessToken)
        //     this.loading = false
        //     this.router.navigate(['./'])
        // }, 200)
        // setTimeout(() => {
        //     location.reload()
        // }, 350)
    }
    sendEmail() {
        const user = this.store.getItem('dremoToken')
        const params = {
            iPersId: user ? user.iPersId : null,
        }
        this.authService.sendEmail(params).subscribe({
            next: (response: Data) => {
                if (!response.validated) {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: 'Vuelva a ingresar sus credenciales',
                    })
                } else {
                    this.router.navigate(['verificacion'])
                    setTimeout(() => {
                        location.reload()
                    }, 350)
                }
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
                this.messageService.add({
                    severity: 'error',
                    summary: '¡Atención!',
                    detail: 'No se pudo enviar el correo',
                })
            },
        })
    }
}
