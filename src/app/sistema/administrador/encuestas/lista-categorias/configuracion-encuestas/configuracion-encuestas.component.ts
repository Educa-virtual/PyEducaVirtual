import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core'
import { StepsModule } from 'primeng/steps'
import { actionsContainer } from './config/actions/container'
import { steps } from './config/steps'
import { MenuItem } from 'primeng/api'
import { Router } from '@angular/router'
// navegacion necesaria
import { NavigationEnd, ActivatedRoute } from '@angular/router'
import { filter } from 'rxjs/operators'
import { RouterOutlet } from '@angular/router'

@Component({
    selector: 'app-configuracion-encuestas',
    standalone: true,
    imports: [StepsModule, ContainerPageComponent, RouterOutlet],
    templateUrl: './configuracion-encuestas.component.html',
    styleUrl: './configuracion-encuestas.component.scss',
})
export class ConfiguracionEncuestasComponent implements OnInit {
    @Input() visible: boolean = false
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() ConfiguracionEncuestas = new EventEmitter<any>()

    actionsContainer = actionsContainer

    items: MenuItem[] | undefined

    activeIndex: number = 0
    title: string = 'Gestionar encuesta'

    ngOnInit(): void {
        this.items = steps

        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.updateActiveIndex()
            })

        this.updateActiveIndex()
    }

    private updateActiveIndex(): void {
        const currentUrl = this.router.url

        if (currentUrl.includes('informacion-general')) {
            this.activeIndex = 0
        } else if (currentUrl.includes('poblacion-objetivo')) {
            this.activeIndex = 1
        }
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {}

    onActiveIndexChange(event: number) {
        this.activeIndex = event

        const targetRoute = this.items![event].routerLink
        if (targetRoute) {
            this.router.navigate([targetRoute], { relativeTo: this.route })
        }
    }

    handleActions({ accion }) {
        switch (accion) {
            case 'regresar':
                this.router.navigate(['/encuestas/configuracion-encuesta'])

                break

            default:
                break
        }
    }
}
