import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ToastModule } from 'primeng/toast'
import { DialogModule } from 'primeng/dialog'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { AccesosComponent } from './accesos/accesos.component'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
import { AuditoriaComponent } from './auditoria.component'

const routes: Routes = [
    {
        path: '',
        component: AuditoriaComponent,
        children: [
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full',
            },
            {
                path: '',
                component: AccesosComponent,
            },
        ],
    },
]

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ToastModule,
        DialogModule,
        ConfirmDialogModule,
    ],
    providers: [StepConfirmationService],
    exports: [RouterModule, ToastModule],
})
export class AuditoriaModule {}
