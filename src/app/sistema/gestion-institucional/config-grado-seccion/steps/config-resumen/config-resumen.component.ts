import { Component, OnInit } from '@angular/core'
import { StepsModule } from 'primeng/steps'
import { PrimengModule } from '@/app/primeng.module'
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'
import { MenuItem, MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'

@Component({
    selector: 'app-config-resumen',
    standalone: true,
    imports: [StepsModule, PrimengModule, ContainerPageComponent],
    templateUrl: './config-resumen.component.html',
    styleUrl: './config-resumen.component.scss',
})
export class ConfigResumenComponent implements OnInit {
    items: MenuItem[]

    constructor(
        private stepService: AdmStepGradoSeccionService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService,
        private msg: StepConfirmationService
    ) {
        this.items = this.stepService.itemsStep
    }

    ngOnInit(): void {
        console.log('implemntacion')
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            console.log(item, 'btnTable')
        }
    }
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'generar resumen',
            text: 'Generar resumen',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]
}
