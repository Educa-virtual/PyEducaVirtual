import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
    selector: 'app-asistencia',
    standalone: true,
    imports: [ContainerPageComponent, PrimengModule, TablePrimengComponent],
    templateUrl: './asistencia.component.html',
    styleUrl: './asistencia.component.scss',
})
export class AsistenciaComponent {
    iCursoId: number
    cCursoNombre: string
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.activatedRoute.params.subscribe((params) => {
            this.iCursoId = params['iCursoId']
            this.cCursoNombre = params['cCursoNombre']
        })
    }

    // cols = [

    //     { field: 'iAsistencia', header: 'Asistencia', width: '100px' },
    //     { field: 'iInasistencia', header: 'Inasistencia', width: '100px' },
    //     { field: 'iInasistenciaJustif', header: 'Inasistencia Justificada', width: '100px' },
    //     { field: 'iTardanzas', header: 'Tardanzas', width: '100px' },
    //     { field: 'iTardanzasJustif', header: 'Tardanzas Justificada', width: '100px' },
    //     { field: 'cEstudiante', header: 'Estudiante', width: '300px' },

    // ];
    data = [
        {
            iEstudId: '1',
            cEstudiante: 'Jhoand Velasquez Durand',
            iAsistencia: '5',
            iInasistencia: '2',
            iInasistenciaJustif: '1',
            iTardanzas: '6',
            iTardanzasJustif: '2',
        },
        {
            iEstudId: '2',
            cEstudiante: 'Diana Luque Figueroa',
            iAsistencia: '15',
            iInasistencia: '3',
            iInasistenciaJustif: '2',
            iTardanzas: '2',
            iTardanzasJustif: '0',
        },
        {
            iEstudId: '3',
            cEstudiante: 'Edgar Luna Quispe',
            iAsistencia: '15',
            iInasistencia: '1',
            iInasistenciaJustif: '0',
            iTardanzas: '0',
            iTardanzasJustif: '0',
        },
        {
            iEstudId: '4',
            cEstudiante: 'Ferhat Tomas Ticona',
            iAsistencia: '10',
            iInasistencia: '2',
            iInasistenciaJustif: '0',
            iTardanzas: '4',
            iTardanzasJustif: '4',
        },
    ]

    goAreasEstudio() {
        this.router.navigate(['docente/areas-estudio'])
    }

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        console.log(item)
        console.log(accion)
        switch (accion) {
            case 'ingresar':
                this.router.navigate(['./docente/detalle-asistencia'])
                break
            default:
                break
        }
    }
}
