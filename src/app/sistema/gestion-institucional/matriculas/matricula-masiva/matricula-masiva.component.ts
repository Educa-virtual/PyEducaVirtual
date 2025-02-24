import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputFileUploadComponent } from '@/app/shared/input-file-upload/input-file-upload.component'
import { DatosMatriculaService } from '../../services/datos-matricula.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-matricula-masiva',
    standalone: true,
    imports: [PrimengModule, InputNumberModule, InputFileUploadComponent],
    templateUrl: './matricula-masiva.component.html',
    styleUrl: './matricula-masiva.component.scss',
})
export class MatriculaMasivaComponent implements OnInit {
    iSedeId: string
    iYAcadId: string

    constructor(
        private fb: FormBuilder,
        private datosMatriculaService: DatosMatriculaService,
        private store: LocalStoreService,
        private constantesService: ConstantesService
    ) {}

    form: FormGroup
    visible: boolean = false

    ngOnInit(): void {
        this.iYAcadId = this.store.getItem('dremoiYAcadId')
        this.iSedeId = this.store.getItem('dremoPerfil').iSedeId
        try {
            this.form = this.fb.group({
                archivo: [null, Validators.required],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }
    }

    importarMatriculas() {
        this.visible = true
    }

    importarAulas() {
        this.visible = true
    }

    handleArchivo(event) {
        const file = (event.target as HTMLInputElement)?.files?.[0]
        this.form.patchValue({
            archivo: file,
        })
    }

    subirArchivo() {
        const formData: FormData = new FormData()
        formData.append('archivo', this.form.controls['archivo'].value)
        formData.append('iYAcadId', this.iYAcadId)
        formData.append('iSedeId', this.iSedeId)
        formData.append('iCredId', this.constantesService.iCredId)

        this.datosMatriculaService.subirArchivo(formData).subscribe({
            next: (data: any) => {
                console.log(data, 'subir archivo')
            },
            error: (error) => {
                console.error('Error subiendo archivo:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })
    }
}
