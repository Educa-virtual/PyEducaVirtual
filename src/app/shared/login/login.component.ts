import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { TokenStorageService } from '@/app/servicios/token.service'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '@/app/servicios/auth.service'
import { MessageService } from 'primeng/api'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { RecoverPasswordComponent } from '../recover-password/recover-password.component'
import { SinRolAsignadoComponent } from '../../sistema/sin-rol-asignado/sin-rol-asignado.component'

interface Data {
    accessToken: string
    refreshToken: string
    expires_in: number
    msg?
    data?
    validated?: boolean
    code?: number
    user?
    modulos?
    entidades?
    perfiles?
    years?
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [PrimengModule, RecoverPasswordComponent, SinRolAsignadoComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: [MessageService],
})
export class LoginComponent implements OnInit {
    showPassword: boolean
    loading: boolean
    loadingText: string
    formLogin!: FormGroup
    modalSinRolAsignado: boolean

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
            this.router.navigate(['./inicio'])
        }
    }

    modalSinRolVisible: boolean = false

    cerrarModalSinRol() {
        this.modalSinRolVisible = false
    }
    onSubmit() {
        this.loading = true
        this.loadingText = 'Verificando...'
        this.authService.login(this.formLogin.value).subscribe({
            next: (response: Data) => {
                this.loading = false

                if (!response.user)
                    return this.messageService.add({
                        severity: 'error',
                        summary: 'Acceso Denegado!',
                        detail: 'No hay registros con las credenciales ingresadas',
                    })

                const item = response.user

                this.tokenStorage.setItem('dremoToken', response.accessToken)
                this.tokenStorage.setItem('dremoUser', response.user)

                if (
                    !response.user.perfiles ||
                    response.user.perfiles.length === 0
                ) {
                    // Si no tiene perfiles, redirigir a sin-rol-asignado
                    this.router.navigate(['/sin-rol-asignado'])
                    return
                }

                this.store.setItem('dremoModalPerfil', true)

                const user = this.store.getItem('dremoUser')
                const years = user ? user.years : null
                const year = years.length ? years[0] : null
                this.store.setItem('dremoYear', year?.iYearId)
                this.store.setItem('dremoiYAcadId', year?.iYAcadId)

                const modulos = user ? user.modulos : null
                const modulo = modulos.length ? modulos[0] : null
                this.store.setItem('dremoModulo', modulo)

                this.tokenStorage.setItem(
                    'dremoRefreshToken',
                    response.refreshToken
                )

                this.tokenStorage.setItem(
                    'dremoPerfilVerificado',
                    item.bCredVerificado == 1 ? true : false
                )

                this.tokenStorage.saveToken(response.accessToken)
                this.tokenStorage.saveRefreshToken(response.refreshToken)
                this.tokenStorage.saveUser(item)

                if (item.bCredVerificado == 1) {
                    this.router.navigate(['./inicio'])
                    setTimeout(() => {
                        location.reload()
                    }, 500)
                } else {
                    this.router.navigateByUrl('verificacion')
                }
            },
            complete: () => {},
            error: (error) => {
                // console.log(error)
                this.loading = false
                this.messageService.add({
                    severity: 'error',
                    summary: '¡Atención!',
                    detail:
                        error.pass || error.user
                            ? 'Verifica haber ingresado correctamente tu usuario y contraseña'
                            : 'Verifica tus Credenciales',
                })
            },
        })
    }

    showModal: boolean = false

    accionBtnItem(elemento): void {
        const { accion } = elemento
        // const { item } = elemento
        switch (accion) {
            case 'close-modal':
                this.showModal = false
                break
        }
    }
}
