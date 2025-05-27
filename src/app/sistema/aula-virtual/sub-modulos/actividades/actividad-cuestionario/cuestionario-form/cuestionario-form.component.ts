import { PrimengModule } from '@/app/primeng.module'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
import { DatePipe } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'

@Component({
    selector: 'app-cuestionario-form',
    standalone: true,
    templateUrl: './cuestionario-form.component.html',
    styleUrls: ['./cuestionario-form.component.scss'],
    imports: [PrimengModule, TypesFilesUploadPrimengComponent],
})
export class CuestionarioFormComponent implements OnInit {
    private _formBuilder = inject(FormBuilder)

    // Crea una instancia de la clase DatePipe para formatear fechas en español
    pipe = new DatePipe('es-ES')
    date = this.ajustarAHorarioDeMediaHora(new Date())

    typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: false,
    }
    constructor() {}

    public formCuestionario = this._formBuilder.group({
        cTareaTitulo: ['', [Validators.required]],
        cCapDescripcion: ['', [Validators.required]],
        dtInicio: [this.date, Validators.required],
        dtFin: [
            new Date(
                this.ajustarAHorarioDeMediaHora(new Date()).setHours(
                    this.date.getHours() + 1
                )
            ),
            Validators.required,
        ],
    })

    ngOnInit() {
        console.log('hola')
    }
    // metodo para guardar el cuestionario
    GUARDARxProgActxiCuestionarioId() {
        const formValue = this.formCuestionario.value
        const data = {
            ...formValue,
            dtInicio: this.pipe.transform(
                formValue.dtInicio,
                'yyyy-MM-ddTHH:mm:ss'
            ),
            dtFin: this.pipe.transform(formValue.dtFin, 'yyyy-MM-ddTHH:mm:ss'),
            files: this.filesUrl,
        }
        console.log('formValue', data)
    }
    ajustarAHorarioDeMediaHora(fecha) {
        const minutos = fecha.getMinutes() // Obtener los minutos actuales
        const minutosAjustados = minutos <= 30 ? 30 : 0 // Decidir si ajustar a 30 o 0 (hora siguiente)
        if (minutos > 30) {
            fecha.setHours(fecha.getHours() + 1) // Incrementar la hora si los minutos pasan de 30
        }
        fecha.setMinutes(minutosAjustados) // Ajustar los minutos
        fecha.setSeconds(0) // Opcional: Resetear los segundos a 0
        fecha.setMilliseconds(0) // Opcional: Resetear los milisegundos a 0
        return fecha
    }
    filesUrl = []
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        // let params
        switch (accion) {
            case 'close-modal':
                // this.showModal = false
                break
            case 'subir-file-tareas':
                this.filesUrl.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
            case 'url-tareas':
                this.filesUrl.push({
                    type: 2, //2->url
                    nameType: 'url',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
            case 'youtube-tareas':
                this.filesUrl.push({
                    type: 3, //3->youtube
                    nameType: 'youtube',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
        }
    }
}
