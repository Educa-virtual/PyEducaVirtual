import { Component, inject, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { QRCodeModule } from 'angularx-qrcode';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
@Component({
  selector: 'app-codigo-qr',
  standalone: true,
  imports: [PrimengModule, QRCodeModule],
  templateUrl: './codigo-qr.component.html',
  styleUrl: './codigo-qr.component.scss',
})
export class CodigoQrComponent implements OnInit {
  private _ConstantesService = inject(ConstantesService);
  private _GeneralService = inject(GeneralService);

  codigo: any;

  ngOnInit() {
    this.obtenerCodigo();
  }

  obtenerCodigo() {
    const parametros = {
      petition: 'post',
      group: 'asi',
      prefix: 'grupos',
      ruta: 'obtener_codigo',
      data: {
        iYAcadId: this._ConstantesService.iYAcadId,
        iPersId: this._ConstantesService.iPersId,
        iSedeId: this._ConstantesService.iSedeId,
      },
    };

    this._GeneralService.getRecibirDatos(parametros).subscribe({
      next: response => {
        const respuesta = response.data;
        this.codigo = respuesta['cPersDocumento'] + '|' + respuesta['cMatrNumero'];
      },
      error: error => {
        console.log(error);
      },
    });
  }
}
