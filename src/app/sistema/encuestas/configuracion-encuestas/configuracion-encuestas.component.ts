import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, OnInit } from '@angular/core'
import { StepsModule } from 'primeng/steps'
import { actionsContainer } from './config/actions/container'
import { steps } from './config/steps'
import { MenuItem } from 'primeng/api'

@Component({
    selector: 'app-configuracion-encuestas',
    standalone: true,
    imports: [StepsModule, ContainerPageComponent],
    templateUrl: './configuracion-encuestas.component.html',
    styleUrl: './configuracion-encuestas.component.scss',
})
export class ConfiguracionEncuestasComponent implements OnInit {
    actionsContainer = actionsContainer

    items: MenuItem[] | undefined

    activeIndex: number = 0
    title: string = 'CENSO DRE/UGEL 2024'

    ngOnInit(): void {
        this.items = steps
    }

    onActiveIndexChange(event: number) {
        this.activeIndex = event
    }

    handleActions(e) {
        console.log(e)
    }
}
