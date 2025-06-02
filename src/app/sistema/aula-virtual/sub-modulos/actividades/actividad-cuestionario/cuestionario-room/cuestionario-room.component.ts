import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { Location } from '@angular/common'
import { matListAlt, matPeople } from '@ng-icons/material-icons/baseline'
import { DialogService } from 'primeng/dynamicdialog'
import { provideIcons } from '@ng-icons/core'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { TabViewModule } from 'primeng/tabview'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
@Component({
    selector: 'app-cuestionario-room',
    standalone: true,
    templateUrl: './cuestionario-room.component.html',
    styleUrls: ['./cuestionario-room.component.scss'],
    imports: [
        PrimengModule,
        IconComponent,
        TabViewModule,
        ToolbarPrimengComponent,
    ],
    providers: [provideIcons({ matListAlt, matPeople }), DialogService],
})
export class CuestionarioRoomComponent implements OnInit {
    @Input() ixActivadadId: string
    @Input() iProgActId: string
    @Input() iActTopId: number
    @Input() contenidoSemana

    items: MenuItem[] | undefined
    home: MenuItem | undefined

    constructor(private location: Location) {}

    ngOnInit() {
        console.log('datos de cuestionario', this.contenidoSemana)
        //  this.items = [{ icon: 'pi pi-home', route: '/' },
        //     { label: 'Mis Áreas Curriculares' , route: '/aula-virtual/areas-curriculares' },
        //     { label: 'Cuestionario' }];
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
    }
    goBack() {
        this.location.back()
    }
}
