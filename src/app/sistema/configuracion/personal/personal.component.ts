import { Component, OnInit, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

import { StepsModule } from 'primeng/steps'
import { ConfirmationService, MessageService } from 'primeng/api'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
import { Router } from '@angular/router'
import { ToastModule } from 'primeng/toast'

@Component({
    selector: 'app-personal',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        StepsModule,
        ToastModule,
    ],
    templateUrl: './personal.component.html',
    styleUrl: './personal.component.scss',
    providers: [StepConfirmationService, ConfirmationService, MessageService],
})
export class PersonalComponent implements OnInit, OnDestroy {
    constructor(private router: Router) {}
    ngOnDestroy(): void {
        throw new Error('Method not implemented.')
    }

    ngOnInit(): void {
        throw new Error('Method not implemented.')
    }
    // ngOnInit() {}

    // ngOnChanges(changes) {}

    // ngOnDestroy() {}
}
