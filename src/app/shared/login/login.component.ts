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
                    item.bCredVerificado == 1 ? true : false
                )

                this.tokenStorage.setItem('auth-token', response.accessToken)
                this.tokenStorage.setItem(
                    'auth-refreshtoken',
                    response.refreshToken
                )

                this.tokenStorage.saveToken(response.accessToken)
                this.tokenStorage.saveRefreshToken(response.refreshToken)
                this.tokenStorage.saveUser(item)

                if (item.bCredVerificado == 1) {
                    this.router.navigate(['./'])
                    setTimeout(() => {
                        location.reload()
                    }, 500)
                } else {
                    this.router.navigateByUrl('verificacion')
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
    }
}
