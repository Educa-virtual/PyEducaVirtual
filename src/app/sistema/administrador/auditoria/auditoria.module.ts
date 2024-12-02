import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AccesosComponent } from './accesos/accesos.component';
import { StepConfirmationService } from '@/app/servicios/confirm.service';
import { AuditoriaComponent } from './auditoria.component';
import { PanelGraficoComponent } from './panel-grafico/panel-grafico.component';
import { AccesosFallidosComponent } from './accesos-fallidos/accesos-fallidos.component';
import { AuditoriaDatabaseComponent } from './auditoria-database/auditoria-database.component';
import { AuditoriaBackendComponent } from './auditoria-backend/auditoria-backend.component';

const routes: Routes = [
    {
        path: '',
        component: AuditoriaComponent,
        children: [
            {
                path: '',
                redirectTo: 'panel-grafico',
                pathMatch: 'full',
            },
            {
                path: 'panel-grafico',
                component: PanelGraficoComponent
            },
            {
                path: 'accesos',
                component: AccesosComponent
            },
            {
                path: 'accesos-fallidos',
                component: AccesosFallidosComponent
            },
            {
                path: 'auditoria-database',
                component: AuditoriaDatabaseComponent
            },
            {
                path: 'auditoria-backend',
                component: AuditoriaBackendComponent
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
