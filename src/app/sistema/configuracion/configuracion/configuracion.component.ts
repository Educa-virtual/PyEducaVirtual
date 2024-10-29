import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

import { RegistroComponent } from './registro/registro.component'
import { YearsComponent } from './years/years.component'
import { ResumenComponent } from './resumen/resumen.component'
import { StepsModule } from 'primeng/steps'

import { Router } from '@angular/router';

import { TicketService } from './registro/service/ticketservice'

@Component({
    selector: 'app-configuracion',
    standalone: true,
    imports: [ContainerPageComponent, TablePrimengComponent, RegistroComponent, YearsComponent, ResumenComponent, StepsModule],
    templateUrl: './configuracion.component.html',
    styleUrl: './configuracion.component.scss',
    providers: [TicketService]
})
export class ConfiguracionComponent implements OnInit, OnChanges, OnDestroy {

    constructor(private router: Router) {}
    ngOnInit() {}


    ngOnChanges(changes) {}



    ngOnDestroy() {}
}
