import { PrimengModule } from '@/app/primeng.module'
import { AuthService } from '@/app/servicios/auth.service'
import { TokenStorageService } from '@/app/servicios/token.service'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'

interface Data {
    accessToken: string
    refreshToken: string
    expires_in: number
    msg?
    data?
    validated: boolean
    code: number
}

@Component({
    selector: 'app-verificacion',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './verificacion.component.html',
    styleUrl: './verificacion.component.scss',
})
export class VerificacionComponent {
    loading: boolean
    loadingText: string
    formVerify!: FormGroup

    constructor(
        private tokenStorage: TokenStorageService,
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.formVerify = this.fb.group({
            inp1: ['', Validators.required],
            inp2: ['', Validators.required],
            inp3: ['', Validators.required],
            inp4: ['', Validators.required],
            inp5: ['', Validators.required],
            inp6: ['', Validators.required],
        })
    }

    onVerify() {
        this.loading = true
        this.loadingText = 'Verificando...'
        const params = {
            codigo:
                this.formVerify.value.inp1 +
                this.formVerify.value.inp2 +
                this.formVerify.value.inp3 +
                this.formVerify.value.inp4 +
                this.formVerify.value.inp5 +
                this.formVerify.value.inp6,
        }
        this.authService.sendVerify(params).subscribe({
            next: (response: Data) => {
                this.loading = false
                if (!response.validated)
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: 'Código erróneo, vuelva a ingresar',
                    })
                this.tokenStorage.setItem('dremoPerfilVerificado', true)
                this.messageService.add({
                    severity: 'success',
                    summary: '¡Genial!',
                    detail: 'Código verificado correctamente',
                })
                // this.router.navigate(['./'])
                // setTimeout(() => {
                //   location.reload()
                // }, 350)
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
                this.messageService.add({
                    severity: 'error',
                    summary: '¡Atención!',
                    detail: 'Las credenciales son erróneas',
                })
            },
        })
    }

    goLogin() {
        //FALTA ELIMINAR CACHE Y COOKIE
        this.router.navigate(['login'])
        setTimeout(() => {
            location.reload()
        }, 350)
    }
}
