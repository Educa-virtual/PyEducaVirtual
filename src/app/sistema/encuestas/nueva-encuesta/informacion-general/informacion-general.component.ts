import { TiemposDuracionService } from './../../services/tiempos-duracion.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { MessageService, SelectItem } from 'primeng/api';
import { EncuestasService } from '../../services/encuestas.services';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-informacion-general',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    ButtonModule,
    ReactiveFormsModule,
    EditorComponent,
  ],
  templateUrl: './informacion-general.component.html',
  styleUrl: './informacion-general.component.scss',
  providers: [{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
})
export class InformacionGeneralComponent implements OnInit, OnChanges {
  form: FormGroup;
  dataTiemposDuracion: SelectItem[] = [];
  store = new LocalStoreService();
  @Input() categoria: any = null;

  initConsideraciones: EditorComponent['init'] = {
    base_url: '/tinymce',
    suffix: '.min',
    menubar: false,
    selector: 'textarea',
    placeholder: 'Escriba aquí...',
    height: 200,
    toolbar: false,
    paste_as_text: true,
    branding: false,
    statusbar: false,
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tiemposDuracionService: TiemposDuracionService,
    private encuestasService: EncuestasService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      iConfEncId: [0],
      cConfEncNombre: ['', Validators.required],
      cConfEncSubNombre: [''],
      cConfEncDesc: [''],
      dConfEncInicio: ['', Validators.required],
      dConfEncFin: ['', Validators.required],
      iTiemDurId: ['', Validators.required],
      iCategoriaEncuestaId: [this.categoria?.iCategoriaEncuestaId, Validators.required],
      bDirigidoDirectores: [0],
      bDirigidoDocentes: [0],
      bDirigidoEstudiantes: [0],
      bDirigidoApoderados: [0],
      bDirigidoEspDremo: [0],
      bDirigidoEspUgel: [0],
      iYAcadId: [this.store.getItem('dremoiYAcadId')],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoria']) {
      this.form.patchValue({
        iCategoriaEncuestaId: this.categoria?.iCategoriaEncuestaId,
      });
    }
  }

  ngOnInit(): void {
    this.obtenerTIemposDuracion();
  }

  obtenerTIemposDuracion() {
    this.tiemposDuracionService.obtenerTiemposDuracion().subscribe({
      next: (resp: any) => {
        this.dataTiemposDuracion = resp.data.map((item: any) => ({
          label: item.cTiemDurNombre,
          value: item.iTiemDurId,
        }));
      },
      error: error => {
        console.error('Error al obtener los tiempos de duración', error);
      },
    });
  }

  guardarConfiguracion(): Promise<boolean> {
    if (this.form.valid) {
      return new Promise(resolve => {
        this.encuestasService.guardarEncuesta(this.form).subscribe({
          next: (resp: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Configuración guardada',
              detail: resp.message,
            });
            resolve(true);
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al guardar',
              detail: error.error.message,
            });
            resolve(false);
          },
        });
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos.',
      });
      return Promise.resolve(false);
    }
  }

  nextRoute() {
    this.router.navigate(['/encuestas/configuracion-encuesta/poblacion-objetivo']);
  }
}
