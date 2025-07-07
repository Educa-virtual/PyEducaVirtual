import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem } from 'primeng/api'
import { InformacionGeneralComponent } from '../informacion-general/informacion-general.component'
@Component({
    selector: 'app-nueva-encuesta',
    standalone: true,
    imports: [PrimengModule, CommonModule, InformacionGeneralComponent],
    templateUrl: './nueva-encuesta.component.html',
    styleUrls: ['./nueva-encuesta.component.scss'],
})
export class NuevaEncuestaComponent implements OnInit {
    title: string = 'Nueva Encuesta'

    items: MenuItem[] = []
    activeIndex: number = 0

    ngOnInit() {
        this.items = [
            {
                label: 'Información General',
            },
            {
                label: 'Población Objetivo',
            },
        ]
    }

    nextStep() {
        if (this.activeIndex < this.items.length - 1) {
            this.activeIndex++
        }
    }

    prevStep() {
        if (this.activeIndex > 0) {
            this.activeIndex--
        }
    }

    goToStep(index: number) {
        if (index >= 0 && index < this.items.length) {
            this.activeIndex = index
        }
    }

    isFirstStep(): boolean {
        return this.activeIndex === 0
    }

    isLastStep(): boolean {
        return this.activeIndex === this.items.length - 1
    }

    getCurrentStep(): number {
        return this.activeIndex
    }

    getTotalSteps(): number {
        return this.items.length
    }

    onNextFromInfoGeneral() {
        this.nextStep()
    }

    onFinish() {
        console.log('Encuesta finalizada')
    }
}
