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
        this.authService.login(this.formLogin.value).subscribe({
            next: (data: Data) => {
                this.tokenStorage.setItem('mpiToken', data)

                this.tokenStorage.saveToken(data.accessToken)
                this.tokenStorage.saveRefreshToken(data.refreshToken)
                this.tokenStorage.saveUser(data)
                this.loading = false
                this.router.navigate(['./'])
                setTimeout(() => {
                    location.reload()
                }, 350)
            },
            complete: () => {},
            error: (err) => {
                console.log(err)
                this.loading = false
                if (err.status == 401) {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Acceso Denegado!',
                        detail: err.error.error,
                    })
                }
                if (err.status == 403) {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Acceso Prohibido!',
                        detail: err.error.error,
                    })
                }
                if (err.error.password.length) {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: err.error.password[0],
                    })
                }
            },
        })
    }
}
