import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
interface Data {
    accessToken: string
    refreshToken: string
    expires_in: number
    msg?
    data?
    validated?: boolean
    code?: number
}
@Component({
    selector: 'app-asistencia',
    standalone: true,
    imports: [ContainerPageComponent, PrimengModule, TablePrimengComponent],
    templateUrl: './asistencia.component.html',
    styleUrl: './asistencia.component.scss',
})
export class AsistenciaComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<boolean>()

    iCursoId: number
    cCursoNombre: string
    constructor(
        private GeneralService: GeneralService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.activatedRoute.params.subscribe((params) => {
            this.iCursoId = params['iCursoId']
            this.cCursoNombre = params['cCursoNombre']
        })
    }
    ngOnInit() {
        this.getObtenerAsitencias()
    }
    // cols = [

    //     { field: 'iAsistencia', header: 'Asistencia', width: '100px' },
    //     { field: 'iInasistencia', header: 'Inasistencia', width: '100px' },
    //     { field: 'iInasistenciaJustif', header: 'Inasistencia Justificada', width: '100px' },
    //     { field: 'iTardanzas', header: 'Tardanzas', width: '100px' },
    //     { field: 'iTardanzasJustif', header: 'Tardanzas Justificada', width: '100px' },
    //     { field: 'cEstudiante', header: 'Estudiante', width: '300px' },

    // ];

    dates = [
        { dtFecha: 'ENERO' },
        { dtFecha: 'FEBRERO' },
        { dtFecha: 'MARZO' },
        { dtFecha: 'ABRIL' },
        { dtFecha: 'MAYO' },
        { dtFecha: 'JUNIO' },
        { dtFecha: 'JULIO' },
        { dtFecha: 'AGOSTO' },
        { dtFecha: 'SETIEMBRE' },
        { dtFecha: 'OCTUBRE' },
        { dtFecha: 'NOBIEMBRE' },
        { dtFecha: 'DICIEMBRE' },
    ]

    mes = new Date().getMonth()

    valSelect1: string = ''
    valSelect2: number = 0
    carouselResponsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3,
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1,
        },
    ]
    data = [
        // {
        //     iEstudId: '1',
        //     cEstudiante: 'Jhoand Velasquez Durand',
        //     iAsistencia: '5',
        //     iInasistencia: '2',
        //     iInasistenciaJustif: '1',
        //     iTardanzas: '6',
        //     iTardanzasJustif: '2',
        // },
        // {
        //     iEstudId: '2',
        //     cEstudiante: 'Diana Luque Figueroa',
        //     iAsistencia: '15',
        //     iInasistencia: '3',
        //     iInasistenciaJustif: '2',
        //     iTardanzas: '2',
        //     iTardanzasJustif: '0',
        // },
    ]

    goAreasEstudio() {
        this.router.navigate(['aula-virtual/areas-curriculares'])
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
    showModal = false
    getObtenerAsitencias() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'asistencia',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR',
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, false)
    }
    getInformation(params, api) {
        this.GeneralService.getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Data) => {
                    if (api) {
                        this.showModal = false
                        this.getObtenerAsitencias()
                    } else {
                        this.data = response.data
                    }
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
    }
    ngOnDestroy() {
        this.unsubscribe$.next(true)
    }
}
