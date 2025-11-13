import {
  Component,
  input,
  output,
  OnChanges,
  SimpleChanges,
  OnInit,
  signal,
  Input,
} from '@angular/core';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import { ToastModule } from 'primeng/toast';
import { PrimengModule } from '@/app/primeng.module';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';

@Component({
  selector: 'app-form-merito',
  standalone: true,
  imports: [ContainerPageComponent, PrimengModule, ToastModule],
  templateUrl: './form-merito.component.html',
  styleUrl: './form-merito.component.scss',
})
export class FormMeritoComponent implements OnInit, OnChanges {
  @Input() perfil: any = {};
  @Input() data: any = {};
  dremoiYAcadId = input<number>(null);
  @Input() bUpdate: boolean = false;
  closeModal = output<{ accion: string; item: any[] }>();

  formMerito: FormGroup;
  mensaje: string =
    'Para buscar el documento, debe ingresar el tipo de documento y el número de documento.';
  _severity: string = 'info';
  tipo_documento: any[] = [];
  persona: any;

  tipo_merito = signal<any[]>([]);

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService
  ) {}
  ngOnInit() {
    this.getTipoDocumento();
    this.getTipoMerito();
    this.initi();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['perfil']) {
      this.perfil = changes['perfil']?.currentValue;
      console.log(this.perfil, ' perfil ');
      this.initi();
      this.formMerito.patchValue({
        iSesionId: Number(this.perfil.iCredId),
        iCredEnt: Number(this.perfil.iCredEntId),
        iCredEntPerfId: Number(this.perfil.iCredEntPerfId),
        iSedeId: Number(this.perfil.iSedeId),
      });
    }
    if (changes['dremoiYAcadId']) {
      this.dremoiYAcadId = changes['dremoiYAcadId']?.currentValue;
    }
    if (changes['data']) {
      this.data = changes['data']?.currentValue;
      if (this.bUpdate) {
        this.validarDatos(this.data);
      } else {
        this.formMerito.reset();
      }
    }
    if (changes['bUpdate']) {
      this.bUpdate = changes['bUpdate']?.currentValue;
      if (this.bUpdate) {
        this.validarDatos(this.data);
      } else {
        this.formMerito.reset();
      }
    }
    if (changes['dremoiYAcadId']) {
      this.dremoiYAcadId = changes['dremoiYAcadId']?.currentValue;
    }
  }

  initi(): void {
    try {
      this.formMerito = this.fb.group({
        iMeritoId: [null],
        iPersId: [null, Validators.required],
        iTipoMeritoId: [null, Validators.required],
        cMeritoDescripcion: ['', [Validators.required, Validators.maxLength(200)]],
        iMeritoPuntaje: [0, [Validators.max(100)]],
        iMeritoPuesto: [0, [Validators.max(100)]],
        iEstado: [1, Validators.required],
        cMeritoRef: [null],
        dMeritoFecha: [null, Validators.required],
        iYAcadId: [this.dremoiYAcadId],
        iSedeId: [null],
        iSesionId: [null, Validators.required],
        iCredEnt: [null],
        iCredEntPerfId: [null],
        iTipoIdentId: [null, Validators.required],
        cDocumento: [null, [Validators.required, Validators.maxLength(20)]],
        bDocumentoVerificado: [false, [Validators.required, Validators.requiredTrue]],
      });
    } catch (error) {
      console.error('Error al inicializar el formulario de méritos:', error);
    }
  }

  accionBtnItemTable(event: any): void {
    console.log('accionBtnItemTable', event);
  }

  getTipoDocumento(): void {
    //const params :string = `iYAcadId=${this.dremoiYAcadId} AND iSedeId=${this.perfil.iSedeId}`;
    this.query
      .searchCalAcademico({
        esquema: 'grl',
        tabla: 'tipos_Identificaciones',
        campos: '*',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.tipo_documento = data.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'danger',
            summary: 'Mensaje del Sistema',
            detail: 'Error. al cargar tipo de documentos: ' + error.error.message,
          });
        },
      });
  }

  getTipoMerito() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'tipo_meritos',
        campos: '*',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.tipo_merito.set(data.data);
        },
        error: error => {
          this.messageService.add({
            severity: 'danger',
            summary: 'Mensaje del Sistema',
            detail: 'Error. al cargar los tipos de neritos: ' + error.error.message,
          });
        },
      });
  }

  getPersona(iPersId: number): void {
    let params: string;

    const iTipoIdentId = Number(this.formMerito.get('iTipoIdentId')?.value);
    const cDocumento = "'" + String(this.formMerito.get('cDocumento')?.value) + "'";

    if (iPersId > 0) {
      params = `iPersId=${iPersId}`;
    } else {
      this.formMerito.reset();
      params = `iTipoIdentId=${iTipoIdentId} AND cPersDocumento=${cDocumento}`;
    }

    this.query
      .searchCalAcademico({
        esquema: 'grl',
        tabla: 'personas',
        campos: 'iPersId, iTipoIdentId, cPersDocumento, cPersPaterno, cPersMaterno, cPersNombre',
        condicion: params,
      })
      .subscribe({
        next: (data: any) => {
          this.persona = data.data;
          console.log(this.persona);
        },
        error: error => {
          let message = error?.error?.message || 'Sin conexión a la bd';
          const match = message.match(/]([^\]]+?)\./);
          if (match && match[1]) {
            message = match[1].trim() + '.';
          }
          message = decodeURIComponent(message);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: message,
          });
          this.formMerito.patchValue({
            bDocumentoVerificado: false,
          });
        },
        complete: () => {
          if (this.persona.length > 0) {
            this.formMerito.patchValue({
              bDocumentoVerificado: true,
              iPersId: Number(this.persona[0].iPersId),
              iTipoIdentId: this.persona[0].iTipoIdentId,
              cDocumento: this.persona[0].cPersDocumento,
              iSesionId: Number(this.perfil.iCredId),
              iCredEnt: Number(this.perfil.iCredEntId),
              iCredEntPerfId: Number(this.perfil.iCredEntPerfId),
              iSedeId: Number(this.perfil.iSedeId),
            });
            console.log(this.formMerito.value);
            const nombre =
              this.persona[0].cPersPaterno +
              ' ' +
              this.persona[0].cPersMaterno +
              ', ' +
              this.persona[0].cPersNombre;

            this.mensaje = nombre;
            this._severity = 'success';
          } else {
            this._severity = 'warn';
            this.mensaje = 'La persona no se encuentra registrada en el sistema.';
            this.messageService.add({
              severity: 'warn',
              summary: 'Mensaje del Sistema',
              detail: 'La persona no se encuentra registrada en el sistema.',
            });
            this.formMerito.patchValue({
              bDocumentoVerificado: false,
            });
          }
        },
      });
  }

  validarDatos(data: any): void {
    this.formMerito.patchValue({
      iMeritoId: data?.iMeritoId || null,
      iPersId: data?.iPersId || null,
      iTipoMeritoId: data?.iTipoMeritoId || null,
      cMeritoDescripcion: data?.cMeritoDescripcion || '',
      iMeritoPuntaje: data?.iMeritoPuntaje || 0,
      iMeritoPuesto: data?.iMeritoPuesto || 0,
      iEstado: data?.iEstado || 1,
      cMeritoRef: data?.cMeritoRef || null,
      dMeritoFecha: data?.dMeritoFecha ? new Date(data.dMeritoFecha) : new Date(),
      iYAcadId: data?.iYAcadId || this.dremoiYAcadId,

      iSesionId: Number(this.perfil.iCredId),
      iCredEnt: Number(this.perfil.iCredEntId),
      iCredEntPerfId: Number(this.perfil.iCredEntPerfId),
      iSedeId: Number(this.perfil.iSedeId),

      //iTipoIdentId: data?.iTipoIdentId || null,
      // cDocumento: data?.cDocumento || null,
      //bDocumentoVerificado: data?.bDocumentoVerificado || false,
      //cNombre: data?.cNombre || null,
    });

    this.getPersona(data?.iPersId || 0);
  }
  guardarMerito() {
    // 🔹 Verificar si el formulario es inválido
    this.formMerito.patchValue({
      iTipoMeritoId: Number(this.formMerito.get('iTipoMeritoId')?.value ?? 0),
      iYAcadId: this.dremoiYAcadId,
      iSesionId: Number(this.perfil.iCredId),
      iCredEnt: Number(this.perfil.iCredEntId),
      iCredEntPerfId: Number(this.perfil.iCredEntPerfId),
      iSedeId: Number(this.perfil.iSedeId),
    });

    const payload = this.formMerito.value;
    console.log('Datos a guardar:', payload);

    if (this.formMerito.invalid) {
      // 🔹 Marcar todos los controles como "tocados" para mostrar los errores en la vista
      this.formMerito.markAllAsTouched();

      // 🔹 Mostrar mensaje de advertencia
      this.messageService.add({
        severity: 'warn',
        summary: 'Mensaje del Sistema',
        detail: 'Por favor, complete todos los campos requeridos antes de guardar.',
      });
      return;
    }

    // 🔹 Si el formulario es válido, puedes continuar con tu lógica de guardado
    //const payload = this.formMerito.value;

    //ejecutamos CRUD

    this.query
      .addCalAcademico({
        json: JSON.stringify(payload),
        _opcion: 'addMerito',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del Sistema',
            detail: error.error.message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del Sistema',
            detail: 'Registro exitoso',
          });

          const param = { accion: 'merito', item: [] };
          this.closeModal.emit(param);
        },
      });

    // Aquí iría tu llamada al servicio o lógica de guardado
    // this._GeneralService.saveMerito(payload).subscribe({...})
  }
}
