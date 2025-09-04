import { PrimengModule } from '@/app/primeng.module';
import { Component, Input, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-pregunta-opcion-simple',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './pregunta-opcion-simple.component.html',
  styleUrl: './pregunta-opcion-simple.component.scss',
})
export class PreguntaOpcionSimpleComponent {
  @Input() switchControl: FormControl = new FormControl();

  @Input() addonLabel: string = 'Campo';

  @Input() infoAdicional!: TemplateRef<any>;

  @Input() iPregId!: number;

  @Input() controlDisabled: boolean = false;

  @Input() jsonAlternativas: string = '';

  @Input() alternativas: Array<any> = [];

  ngOnInit() {
    if (this.controlDisabled) {
      this.switchControl.disable();
    }
    if (this.jsonAlternativas) {
      this.alternativas = [];
      const alternativas = JSON.parse(this.jsonAlternativas);
      alternativas.forEach((alternativa: any) => {
        this.alternativas.push({
          label: alternativa.cEncuAlterNombre,
          value: alternativa.iEncuAlterOrden,
        });
      });
    } else if (this.alternativas) {
      this.alternativas.forEach((alternativa: any) => {
        alternativa.value = alternativa.iAlternativaId;
        alternativa.label = alternativa.cAlternativaContenido;
      });
    }
  }
}
