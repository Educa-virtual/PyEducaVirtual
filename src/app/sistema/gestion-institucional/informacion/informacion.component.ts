import { Component, OnInit } from '@angular/core'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import { MessageService } from 'primeng/api'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'

@Component({
    selector: 'app-informacion',
    standalone: true,
    imports: [
        ContainerPageComponent,
        ReactiveFormsModule,
        FormsModule,
        PrimengModule,
    ],
    templateUrl: './informacion.component.html',
    styleUrl: './informacion.component.scss',
    providers: [MessageService],
})
export class InformacionComponent implements OnInit {
    form: FormGroup

    perfil: any

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        public query: GeneralService,
        private store: LocalStoreService
    ) {}

    ngOnInit(): void {
        // throw new Error('Method not implemented.')
        this.perfil = this.store.getItem('dremoPerfil')
        //const iNivelTipoId = this.perfil.iNivelTipoId
        console.log(this.perfil)

        try {
            this.form = this.fb.group({
                cTipoConstancia: [0, Validators.required],
                cEstadoConstancia: [0, Validators.required],
                cAnioDestino: [0, Validators.required],
                cVacantesRegular: [0, Validators.required],
                cVacanteNEE: [0, Validators.required],
            })
        } catch (error) {
            //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Actualizar información de la Institución',
            text: 'Actualizar datos',
            icon: 'pi pi-save',
            accion: 'update',
            class: 'p-button-primary',
        },
    ]
}
