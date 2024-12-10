import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StepConfirmationService } from '@/app/servicios/confirm.service';
import { ComponentesComponent } from './componentes.component';

const routes: Routes = [
    {
        path: '',
        component: ComponentesComponent,
        children: [
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full',
            },
            {
                path: '',
                component: ComponentesComponent
            },
        ]
    },
];

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
