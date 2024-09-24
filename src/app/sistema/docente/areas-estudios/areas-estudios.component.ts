import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, OnInit, ViewChild } from '@angular/core'
import { TablePrimengComponent } from '../../../shared/table-primeng/table-primeng.component'
import { Menu } from 'primeng/menu'
import { RecursosDidacticosComponent } from './components/recursos-didacticos/recursos-didacticos.component'
import { Router } from '@angular/router'
import { Table } from 'primeng/table'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
import { ConstantesService } from '@/app/servicios/constantes.service'
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
    selector: 'app-areas-estudios',
    standalone: true,
    imports: [
        ContainerPageComponent,
        PrimengModule,
        TablePrimengComponent,
        RecursosDidacticosComponent,
    ],
    templateUrl: './areas-estudios.component.html',
    styleUrl: './areas-estudios.component.scss',
    providers: [MessageService],
})
export class AreasEstudiosComponent implements OnInit {
    @ViewChild('myMenu') menu!: Menu

    constructor(
        private router: Router,
        private GeneralService: GeneralService,
        private MessageService: MessageService,
        private ConstantesService: ConstantesService
    ) {}

    selectedData = []
    items = []
    data = []

    ngOnInit() {
        this.getCursos()
        this.items = [
            {
                label: 'Gestionar Sílabo',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.goSection('silabo')
                },
            },
            {
                label: 'Fichas de Aprendizaje',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.goSection('ficha-aprendizaje')
                },
            },
            {
                label: 'Sessiones de Aprendizaje',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.goSection('sesion-aprendizaje')
                },
            },
            {
                label: 'Gestionar Asistencia',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.goSection('asistencia')
                },
            },
            {
                label: 'Gestionar Notas',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.goSection('notas')
                },
            },
        ]
    }

    showAndHideMenu(item, $ev: Event) {
        this.selectedData = item
        // console.log($ev)
        this.menu.show($ev)
        // this.menu.hide()
        // setTimeout(() => {
        //     this.menu.hide()
        // }, 10000)
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }
    goSection(section) {
        switch (section) {
            case 'silabo':
                this.router.navigateByUrl(
                    'docente/gestionar-silabo/' +
                        this.selectedData['iCursoId'] +
                        '/' +
                        this.selectedData['cCursoNombre']
                )
                break
            case 'sesion-aprendizaje':
                this.router.navigateByUrl('docente/sesion-aprendizaje')
                break
            case 'asistencia':
                this.router.navigateByUrl(
                    'docente/asistencia/' +
                        this.selectedData['iCursoId'] +
                        '/' +
                        this.selectedData['cCursoNombre']
                )
                break
        }
    }
    getCursos() {
        const params = {
            petition: 'post',
            ruta: 'listar_cursos',
            data: {
                iPersId: this.ConstantesService.iPersId,
            },
        }
        this.GeneralService.getGral(params).subscribe({
            next: (response: Data) => {
                this.data = []
                if (!response.validated) {
                    this.MessageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: 'Vuelva a ingresar sus credenciales',
                    })
                } else {
                    this.data = response.data
                }
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
                this.MessageService.add({
                    severity: 'error',
                    summary: '¡Atención!',
                    detail: 'Las credenciales son erróneas',
                })
            },
        })
    }
}
