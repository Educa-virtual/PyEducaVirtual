import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ConfirmationService, MessageService } from 'primeng/api'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
import { Router } from '@angular/router'
import { AdministradorModule } from '../../administrador.module'


@Component({
    selector: 'app-accesos',
    standalone: true,
    imports: [
        AdministradorModule
    ],
    templateUrl: './accesos.component.html',
    styleUrl: './accesos.component.scss',
    providers: [],
})
export class AccesosComponent implements OnInit, OnChanges, OnDestroy {
    constructor(private router: Router,private step: AdministradorModule)  {}
    ngOnInit() {

    }

    ngOnChanges(changes) {}

    ngOnDestroy() {}
}
