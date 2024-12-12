import { Component, Input, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
    selector: 'app-rubrica-form-header',
    templateUrl: './rubrica-form-header.component.html',
    styleUrl: './rubrica-form-header.component.scss',
})
export class RubricaFormHeaderComponent implements OnInit {
    @Input() rubricas
    @Input() mode

    match
    @Input() rubricaForm: FormGroup

    filterRubricas = []

    buscarSugerencias(event: any) {
        const query = event.query ?? event.value.cInstrumentoNombre; // Entrada del usuario
        this.filterRubricas = this.rubricas.filter(item => {

            
            if(item.cInstrumentoNombre.toLowerCase() === query.toLowerCase() && event.value){
                console.log('match');
                this.match = event
                console.log(this.match);
            }
            
            
            // console.log(item.cInstrumentoNombre.toLowerCase() == query.toLowerCase());
            

            return item.cInstrumentoNombre.toLowerCase().includes(query.toLowerCase())
        } 
          
        );
    }

    ngOnInit(): void {

        this.filterRubricas = this.rubricas
        console.log('rubricas')
        console.log(this.mode)
        console.log(this.rubricas)
    }

}
