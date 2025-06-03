import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, Input, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { Location } from '@angular/common'
import { matListAlt, matPeople } from '@ng-icons/material-icons/baseline'
import { DialogService } from 'primeng/dynamicdialog'
import { provideIcons } from '@ng-icons/core'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { CuestionarioPreguntasComponent } from '../cuestionario-preguntas/cuestionario-preguntas.component'
@Component({
    selector: 'app-cuestionario-room',
    standalone: true,
    templateUrl: './cuestionario-room.component.html',
    styleUrls: ['./cuestionario-room.component.scss'],
    imports: [
        PrimengModule,
        IconComponent,
        ToolbarPrimengComponent,
        RemoveHTMLPipe,
        CuestionarioPreguntasComponent,
    ],
    providers: [provideIcons({ matListAlt, matPeople }), DialogService],
})
export class CuestionarioRoomComponent implements OnInit {
    @Input() ixActivadadId: string
    @Input() iProgActId: string
    @Input() iActTopId: number
    @Input() contenidoSemana

    private _constantesService = inject(ConstantesService)
    private GeneralService = inject(GeneralService)

    items: MenuItem[] | undefined
    home: MenuItem | undefined
    cuestionario: any = {}

    constructor(private location: Location) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Mis Áreas Curriculares',
                routerLink: '/aula-virtual/areas-curriculares',
            },
            {
                label: 'Contenido',
                command: () => this.goBack(),
                routerLink: '/',
            },
            { label: 'Cuestionario' },
        ]

        this.home = { icon: 'pi pi-home', routerLink: '/' }
        // -----------------
        this.obtenerInformacion()
    }
    goBack() {
        this.location.back()
    }

    // Obtener datos del cuestionario:
    obtenerInformacion() {
        const data = {
            petition: 'get',
            group: 'aula-virtual',
            prefix: 'cuestionarios',
            ruta: this.ixActivadadId.toString(),
            params: {
                iCredId: this._constantesService.iCredId, // Asignar el ID del crédito
            },
        }
        this.GeneralService.getGralPrefixx(data).subscribe({
            next: (resp) => {
                this.cuestionario = resp.data.length ? resp.data[0] : {}
                console.log('Respuesta del cuestionario:', this.cuestionario)
            },
            error: (err) => {
                console.error('Error obteniendo cuestionario:', err)
            },
        })
    }
}
