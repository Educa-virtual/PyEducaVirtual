import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'
import { BtnLoadingComponent } from '../../../shared/btn-loading/btn-loading.component'
import { Router } from '@angular/router'

@Component({
    selector: 'app-sesion-aprendizaje',
    standalone: true,
    imports: [PrimengModule, BtnLoadingComponent],
    templateUrl: './sesion-aprendizaje.component.html',
    styleUrl: './sesion-aprendizaje.component.scss',
})
export class SesionAprendizajeComponent {
    constructor(private router: Router) {}
    activeIndex: number = 0
    items = [
        {
            label: 'Datos de la Actividad',
        },
        {
            label: 'Descripción de la Actividad',
        },
    ]
    onActiveIndexChange(event: number) {
        this.activeIndex = event
    }
    goStep(opcion: string) {
        switch (opcion) {
            case 'next':
                if (this.activeIndex !== 1) {
                    this.activeIndex++
                }
                break
            case 'back':
                if (this.activeIndex !== 0) {
                    this.activeIndex--
                }
                break
        }
    }
    goAreasEstudio() {
        this.router.navigate(['docente/areas-estudio'])
    }
}
