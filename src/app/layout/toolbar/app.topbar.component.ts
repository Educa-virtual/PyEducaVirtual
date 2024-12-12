import { Component, ElementRef, ViewChild, OnInit, inject } from '@angular/core'
import { LayoutService } from '../service/app.layout.service'
import { LocalStoreService } from '../../servicios/local-store.service'
import { TokenStorageService } from '../../servicios/token.service'
import { Router, RouterLink } from '@angular/router'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { MenuModule } from 'primeng/menu'
import { RolesDropdownComponent } from './roles-dropdown/roles-dropdown.component'
import { AnioEscolarComponent } from './roles-dropdown/anio-escolar/anio-escolar.component'
import { PrimengModule } from '@/app/primeng.module'
import { UserAccountComponent } from './roles-dropdown/user-account/user-account.component'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
import { NgIcon, NgIconComponent, provideIcons } from '@ng-icons/core'
import { mat10k } from '@ng-icons/material-icons/baseline'

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    standalone: true,
    imports: [
        RouterLink,
        DropdownModule,
        FormsModule,
        MenuModule,
        RolesDropdownComponent,
        AnioEscolarComponent,
        UserAccountComponent,
        PrimengModule,
        NgIconComponent,
        NgIcon,
    ],
    styleUrl: './app.topbar.component.scss',
    viewProviders: [provideIcons({ mat10k })],
})
export class AppTopBarComponent implements OnInit {
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    years = []
    selectedYear: string

    perfiles = []
    selectedPerfil: string

    modulos = []
    selectedModulo: string

    @ViewChild('menubutton') menuButton!: ElementRef
    // @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef
    @ViewChild('topbarmenu') menu!: ElementRef

    items = []
    constructor(
        public layoutService: LayoutService,
        private store: LocalStoreService,
        private tokenStorageService: TokenStorageService,
        private router: Router
    ) {}

    ngOnInit() {
        const user = this.store.getItem('dremoUser')

        const year = this.store.getItem('dremoYear')
        this.years = user.years
        this.selectedYear = year ? year : null

        const perfil = this.store.getItem('dremoPerfil')
        this.perfiles = user.perfiles
        const perfil_data = {
            iPerfilId: 0,
            cPerfilNombre: '-',
            cEntNombreLargo: '-',
        }
        this.selectedPerfil = perfil ? perfil : perfil_data

        const modulo = this.store.getItem('dremoModulo')
        this.modulos = user.modulos
        this.selectedModulo = modulo ? modulo.iModuloId : null

        if (user.iDocenteId) {
            this.notificacionDocente(user.iDocenteId)
        }
        if (user.iEstudianteId) {
            this.notificacionEstudiante(user.iEstudianteId)
        }
    }

    changeModulo(value) {
        this.router.navigate(['./'])
        this.store.setItem('dremoModulo', value)
        setTimeout(() => {
            window.location.reload()
        }, 200)
    }
    changePerfile(value) {
        this.router.navigate(['./'])
        this.store.setItem('dremoPerfil', value)
        setTimeout(() => {
            window.location.reload()
        }, 200)
    }
    changeYear(value) {
        this.router.navigate(['./'])
        this.store.setItem('dremoYear', value)
        setTimeout(() => {
            window.location.reload()
        }, 200)
    }

    logout(): void {
        this.store.clear()
        this.tokenStorageService.signOut()
        window.location.reload()
    }
    notificaciones = []
    totalNotificaciones: number = 0
    actionTopBar(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        const data = []
        switch (accion) {
            case 'year':
                this.changeYear(item)
                break
            case 'logout':
                console.log(accion)
                this.logout()
                break
            case 'modulo':
                this.changeModulo(item)
                break
            case 'notificacion_docente':
                item.forEach((i) => {
                    i.notificar = i.notificar ? JSON.parse(i.notificar) : []
                    i.notificar.forEach((j) => {
                        this.notificaciones.push(j)
                    })
                })
                this.notificaciones = this.notificaciones.filter(
                    (i) => i.cForoRptaRespuesta
                )
                this.notificaciones.forEach((i) => {
                    data.push({
                        label: i.cForoRptaRespuesta,
                        icon: 'pi pi-book',
                        sublabel: i.distancia,
                    })
                })
                this.totalNotificaciones = data.length
                this.items = [
                    {
                        label: 'Notificaciones',
                        items: data,
                    },
                ]
                break
            case 'notificacion_estudiante':
                item.forEach((i) => {
                    data.push({
                        label: i.cForoTitulo,
                        icon: 'pi pi-book',
                        sublabel: i.distancia,
                    })
                })
                this.totalNotificaciones = data.length
                this.items = [
                    {
                        label: 'Notificaciones',
                        items: data,
                    },
                ]
                break
        }
    }
    notificacionDocente(iDocenteId) {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'notificacion_docente',
            ruta: 'mostrar_notificacion',
            data: {
                iDocenteId: iDocenteId,
            },
        }
        this.getInformation(params, params.prefix)
    }
    notificacionEstudiante(iEstudianteId) {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'notificacion_estudiante',
            ruta: 'mostrar_notificacion',
            data: {
                iEstudianteId: iEstudianteId,
            },
        }
        this.getInformation(params, params.prefix)
    }
    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.actionTopBar({ accion, item: response?.data })
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }
}
