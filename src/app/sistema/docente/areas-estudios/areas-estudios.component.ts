import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, OnInit, ViewChild } from '@angular/core'
import { TablePrimengComponent } from '../../../shared/table-primeng/table-primeng.component'
import { Menu } from 'primeng/menu'

@Component({
    selector: 'app-areas-estudios',
    standalone: true,
    imports: [ContainerPageComponent, PrimengModule, TablePrimengComponent],
    templateUrl: './areas-estudios.component.html',
    styleUrl: './areas-estudios.component.scss',
})
export class AreasEstudiosComponent implements OnInit {
    @ViewChild('myMenu') menu!: Menu

    activeStepper: number = 0
    selectedItem: number = 0
    selectedTitle: string
    selectedData = []
    items = []
    data = [
        {
            iCurso: 1,
            cCurso: 'Matemática I',
            cGrado: '4to',
            cSeccion: 'A',
            iEstudiantes: 45,
            iAvanceSilabo: 50,
            iAvanceAsistencia: 45,
            iAvanceNotas: 69,
        },
        {
            iCurso: 2,
            cCurso: 'Comunicación I',
            cGrado: '5to',
            cSeccion: 'B',
            iEstudiantes: 5,
            iAvanceSilabo: 10,
            iAvanceAsistencia: 90,
            iAvanceNotas: 56,
        },
        {
            iCurso: 3,
            cCurso: 'Religión',
            cGrado: '2to',
            cSeccion: 'C',
            iEstudiantes: 65,
            iAvanceSilabo: 90,
            iAvanceAsistencia: 15,
            iAvanceNotas: 96,
        },
        {
            iCurso: 4,
            cCurso: 'Historia',
            cGrado: '1to',
            cSeccion: 'D',
            iEstudiantes: 95,
            iAvanceSilabo: 80,
            iAvanceAsistencia: 25,
            iAvanceNotas: 9,
        },
    ]
    silabo = [
        { iSilabo: 1, cSilaboTitle: 'Información General' },
        { iSilabo: 2, cSilaboTitle: 'Perfil del Egreso' },
        {
            iSilabo: 3,
            cSilaboTitle:
                'Descripción de la Unidad Didáctica, Capacidad y Metodología',
        },
        { iSilabo: 4, cSilaboTitle: 'Recursos Didácticos' },
        {
            iSilabo: 5,
            cSilaboTitle:
                'Desarrollo de Actividades de Aprendizaje y de Evaluación',
        },
        { iSilabo: 6, cSilaboTitle: 'Evaluación' },
        { iSilabo: 7, cSilaboTitle: 'Bibliografía' },
    ]
    ngOnInit() {
        this.items = [
            {
                label: 'Gestionar Sílabo',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.getSilabo()
                },
            },
            {
                label: 'Fichas de Aprendizaje',
                icon: 'pi pi-angle-right',
            },
            {
                label: 'Sessiones de Aprendizaje',
                icon: 'pi pi-angle-right',
            },
            {
                label: 'Gestionar Asistencia',
                icon: 'pi pi-angle-right',
            },
            {
                label: 'Gestionar Notas',
                icon: 'pi pi-angle-right',
            },
        ]
    }

    showAndHideMenu(item, $ev: Event) {
        this.selectedData = item
        this.menu.show($ev)
        setTimeout(() => {
            this.menu.hide()
        }, 3000)
    }

    getSilabo() {
        this.selectedItem = 1
        this.selectedTitle = this.selectedData['cCurso']
    }
}
