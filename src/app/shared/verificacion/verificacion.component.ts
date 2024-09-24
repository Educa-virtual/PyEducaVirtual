import { PrimengModule } from '@/app/primeng.module'
import { AuthService } from '@/app/servicios/auth.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
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
    userName: string
    constructor(
        private tokenStorage: TokenStorageService,
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
        private ConstantesService: ConstantesService,
        private store: LocalStoreService
    ) {
        this.formVerify = this.fb.group({
            cCodeVerif: ['', Validators.required],
        })
        this.userName = this.store.getItem('dremoToken')
        console.log(this.userName)
    }

    onVerify() {
        this.loading = true
        this.loadingText = 'Verificando...'
        const params = {
            cCodeVerif: this.formVerify.value.cCodeVerif,
            iPersId: this.ConstantesService.iPersId,
        }
        this.authService.sendVerify(params).subscribe({
            next: (response: Data) => {
                this.loading = false
                if (!response.validated) {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: 'Código erróneo, vuelva a ingresar',
                    })
                } else {
                    this.messageService.add({
                        severity: 'success',
                        summary: '¡Genial!',
                        detail: 'Código verificado correctamente',
                    })
                    this.tokenStorage.setItem('dremoPerfilVerificado', true)
                    this.router.navigate(['./'])
                    setTimeout(() => {
                        location.reload()
                    }, 350)
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

    goLogin() {
        this.tokenStorage.signOut()
        this.store.clear()
        this.router.navigate(['login'])
        setTimeout(() => {
            location.reload()
        }, 350)
    }
}
