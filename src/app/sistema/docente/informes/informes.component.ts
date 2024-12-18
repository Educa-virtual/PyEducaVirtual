import { Component, OnInit, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
    ContainerPageComponent,
    //IActionContainer,, Input, inject inject,
} from '@/app/shared/container-page/container-page.component'
import { TabViewModule } from 'primeng/tabview'
import { IconComponent } from '@/app/shared/icon/icon.component'
import {
    matAccessTime,
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
} from '@ng-icons/material-icons/baseline'
import { provideIcons } from '@ng-icons/core'
import { TableModule } from 'primeng/table'
//import para el select
import { DropdownModule } from 'primeng/dropdown'
import { InputGroupModule } from 'primeng/inputgroup'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { ContainerPageAccionbComponent } from './container-page-accionb/container-page-accionb.component'
//El buscar
import { InputTextModule } from 'primeng/inputtext'
import { InputIconModule } from 'primeng/inputicon'
import { IconFieldModule } from 'primeng/iconfield'
import { ButtonModule } from 'primeng/button'
// nueva importaciones:
import { OrderListModule } from 'primeng/orderlist'
//import { Message, MessageService } from 'primeng/api'
//import { ApiAulaService } from '../../aula-virtual/services/api-aula.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'

@Component({
    selector: 'app-informes',
    standalone: true,
    templateUrl: './informes.component.html',
    styleUrls: ['./informes.component.scss'],
    imports: [
        ContainerPageComponent,
        CommonModule,
        TabViewModule,
        IconComponent,
        TableModule,
        DropdownModule,
        InputGroupModule,
        CommonInputComponent,
        InputGroupAddonModule,
        ContainerPageAccionbComponent,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        ButtonModule,
        OrderListModule,
    ],
    providers: [
        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,
        }),
    ],
})
export class InformesComponent implements OnInit {
    //private _aulaService = inject(ApiAulaService);
    perfil = []

    @Input() iCursoId

    constructor(private store: LocalStoreService) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(this.store)
        console.log(perfil)
    }

    ngOnInit() {
        this.obtenerEstudianteXCurso
    }
    //Obtener datos del estudiantes y sus logros alcanzados x cursos

    obtenerEstudianteXCurso() {
        // $iIeCursoId = 1;
        // $iSeccionId = 2;
        // $iYAcadId = 3;
        const idDocente = this.iCursoId
        console.log(idDocente)
        console.log('datos de perfil', this.perfil)
    }
}
