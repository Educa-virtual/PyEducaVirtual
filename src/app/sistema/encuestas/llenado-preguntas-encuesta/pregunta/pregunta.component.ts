import { PrimengModule } from '@/app/primeng.module';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pregunta',
  standalone: true,
  imports: [PrimengModule, EditorComponent],
  templateUrl: './pregunta.component.html',
  styleUrl: './pregunta.component.scss',
  providers: [
    {
      provide: TINYMCE_SCRIPT_SRC,
      useValue: 'tinymce/tinymce.min.js',
    },
  ],
})
export class PreguntaComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() iEncuId: number;
  @Input() iSeccionId: number;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() AgregarSeccionEncuesta = new EventEmitter<any>();

  nuevaSeccion: string = '';
  pregunta: any;

  // EDITOR
  initEnunciado: EditorComponent['init'] = {
    base_url: '/tinymce',
    suffix: '.min',
    menubar: false,
    selector: 'textarea',
    placeholder: 'Escribe aqui...',
    height: 250,
    plugins: 'lists image table',
    toolbar:
      'undo redo | forecolor backcolor | bold italic underline strikethrough | ' +
      'alignleft aligncenter alignright alignjustify fontsize | bullist numlist | ' +
      'image table',
  };

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    console.log('OnInit');
  }

  agregarAlternativa(pregunta: any) {
    const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const nuevaLetra = letras[pregunta.alternativas.length];

    if (nuevaLetra) {
      pregunta.alternativas.push({
        iAlternativaId: Date.now(),
        cAlternativaLetra: nuevaLetra,
        cAlternativaDescripcion: `Opción ${nuevaLetra}`,
        bAlternativaCorrecta: false,
        cAlternativaExplicacion: '',
      });
    }
  }

  eliminarAlternativa(pregunta: any, index: number) {
    if (pregunta.alternativas.length > 2) {
      pregunta.alternativas.splice(index, 1);
      const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      pregunta.alternativas.forEach((alt: any, i: number) => {
        alt.cAlternativaLetra = letras[i];
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe tener al menos 2 alternativas',
      });
    }
  }

  cambiarEstadoCheckbox(iAlternativaId: any, alternativas: any[]) {
    alternativas.forEach(alternativa => {
      if (alternativa.iAlternativaId != iAlternativaId) {
        alternativa.bAlternativaCorrecta = false;
        alternativa.cAlternativaExplicacion = '';
      }
    });
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  cancelar() {
    this.onHide();
  }

  finalizar() {
    this.onHide();
  }
}
