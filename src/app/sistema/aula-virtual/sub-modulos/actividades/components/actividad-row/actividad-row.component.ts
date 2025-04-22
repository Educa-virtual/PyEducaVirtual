import {
    EVALUACION,
    FORO,
    IActividad,
    TAREA,
} from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { CommonModule } from '@angular/common'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    inject,
} from '@angular/core'

import { IconComponent } from '@/app/shared/icon/icon.component'
import { ActividadConfigPipe } from '@/app/sistema/aula-virtual/pipes/actividad-config.pipe'
import { MenuItem } from 'primeng/api'
import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { IsIconTypePipe } from '@/app/shared/pipes/is-icon-type.pipe'
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes'
import { Router, ActivatedRoute } from '@angular/router'
import { DialogService } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-actividad-row',
    standalone: true,
    imports: [
        CommonModule,
        IconComponent,
        ActividadConfigPipe,
        PrimengModule,
        IsIconTypePipe,
    ],
    templateUrl: './actividad-row.component.html',
    styleUrl: './actividad-row.component.scss',
})
export class ActividadRowComponent implements OnInit {
    @Input({ required: true }) actividad: IActividad
    @Output() actionSelected = new EventEmitter<{
        actividad: IActividad
        action: string
    }>()

    public accionesActividad: MenuItem[] | undefined

    constructor(
        private _dialogService: DialogService,
        private router: Router,
        private _activatedRoute: ActivatedRoute
    ) {}

    private _constantesService = inject(ConstantesService)
    iPerfilId: number = null
    public DOCENTE = DOCENTE
    public ESTUDIANTE = ESTUDIANTE

    ngOnInit() {
        this.iPerfilId = this._constantesService.iPerfilId
        console.log('actividad', this.actividad)
    }
    onAction(action: string, event: Event) {
        //console.log(this.actividad, action, event)
        this.actionSelected.emit({ actividad: this.actividad, action })
        event.stopPropagation()
    }
    obtenerStyleActividad(iEstadoActividad) {
        let styleActividad = ''
        switch (Number(iEstadoActividad)) {
            case 1: //PROCESO
                styleActividad = 'border-left:15px solid var(--green-500);'
                break
            case 2: //NO PUBLICADO
                styleActividad = 'border-left:15px solid var(--yellow-500);'
                break
            case 0: //CULMINADO
                styleActividad = 'border-left:15px solid var(--red-500);'
                break
        }
        return styleActividad
    }
    // asignar el color de los caracteres del titulo
    asignarColorActividad(): string {
        if (this.actividad.iActTipoId === TAREA) {
            return 'background-tarea'
        }
        if (this.actividad.iActTipoId === EVALUACION) {
            return 'background-evaluacion'
        }
        if (this.actividad.iActTipoId === FORO) {
            return 'background-foro'
        }
        return 'background-default'
    }

    actividadSelected
    accionSeleccionada
    actionSelect({
        actividad,
        action,
    }: {
        actividad: IActividad
        action: string
    }) {
        this.actividadSelected = actividad
        this.accionSeleccionada = action

        if (actividad.iActTipoId === TAREA) {
            this.handleTareaAction(action, actividad)
            return
        }

        if (actividad.iActTipoId === EVALUACION) {
            this.handleEvaluacionAction(action, actividad)
            return
        }

        if (actividad.iActTipoId === FORO) {
            this.handleForoAction(action, actividad)
            return
        }
    }
    handleEvaluacionAction(action: string, actividad: IActividad) {
        this.router.navigate(
            [
                '../',
                'actividad',
                actividad.iProgActId,
                actividad.ixActivadadId,
                actividad.iActTipoId,
            ],
            {
                queryParams: {
                    iEvaluacionId: this.actividadSelected['iEvaluacionId'],
                    // iCursoId: this.iCursoId,
                    // idDocCursoId: this.idDocCursoId,
                },
                relativeTo: this._activatedRoute,
            }
        )
    }

    handleTareaAction(action: string, actividad: IActividad) {
        this.router.navigate([
            'aula-virtual/areas-curriculares/' +
                'actividad' +
                '/' +
                actividad.iProgActId +
                '/' +
                actividad.ixActivadadId +
                '/' +
                actividad.iActTipoId,
        ])
    }
    handleForoAction(action: string, actividad: IActividad) {
        this.router.navigate(
            [
                '../',
                'actividad',
                actividad.iProgActId,
                actividad.ixActivadadId,
                actividad.iActTipoId,
            ],
            {
                queryParams: {
                    iEvaluacionId: this.actividadSelected['iForo'],
                    // iCursoId: this.iCursoId,
                    // idDocCursoId: this.idDocCursoId,
                },
                relativeTo: this._activatedRoute,
            }
        )
    }
}
