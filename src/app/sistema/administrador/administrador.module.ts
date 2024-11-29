import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common'
import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { StepsModule } from 'primeng/steps'
import { ConfirmationService, MessageService } from 'primeng/api'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
import { ToastModule } from 'primeng/toast'
import { AccesosComponent } from './auditoria/accesos/accesos.component'
import { DialogModule } from 'primeng/dialog'

@NgModule({
    providers: [StepConfirmationService],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: AccesosComponent,
                children: [
                    {
                        path: 'registro',
                        component: AccesosComponent,
                        children: [
                            {
                                path: '',
                                redirectTo: 'fechas',
                                pathMatch: 'full',
                            },
                        ],
                    },

                    { path: '', redirectTo: 'years', pathMatch: 'full' },
                ],
            },
        ]),
    ],

    exports: [RouterModule, ToastModule, DialogModule, ConfirmDialogModule],
})
export class AdministradorModule {
    constructor(stepConfirmationService: StepConfirmationService) {}
}
