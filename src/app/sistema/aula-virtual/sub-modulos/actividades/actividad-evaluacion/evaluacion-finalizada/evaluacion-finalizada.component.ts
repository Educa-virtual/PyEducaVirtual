import { Component, OnInit } from '@angular/core'
//import { EmptySectionComponent } from "../../../../../../shared/components/empty-section/empty-section.component";
//import { RecursosListaComponent } from "../../../../../../shared/components/recursos-lista/recursos-lista.component";

@Component({
    standalone: true,
    selector: 'app-evaluacion-finalizada',
    templateUrl: './evaluacion-finalizada.component.html',
    styleUrls: ['./evaluacion-finalizada.component.css'],
    imports: [],
})
export class EvaluacionFinalizadaComponent implements OnInit {
    evaluacion: any
    cTareaEstudianteComentarioDocente: any

    ngOnInit() {
        console.log()
    }
}
