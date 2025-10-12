import { Component, inject, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { QRCodeModule } from 'angularx-qrcode';

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
  descargarImagenQR() {
    const canvasElement = document.querySelector('canvas') as HTMLCanvasElement;
    const dataUrl = canvasElement.toDataURL();

    // converts base 64 encoded image to blobData
    const blobData = this.convertBase64ToBlob(dataUrl);
    const nav = window.navigator as any;
    if (window.navigator && nav.msSaveOrOpenBlob) {
      //IE
      nav.msSaveOrOpenBlob(blobData, 'Qrcode');
    } else {
      // chrome
      const blob = new Blob([blobData], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qr-code';
      link.click();
    }
  }
  private convertBase64ToBlob(Base64Image: any) {
    // SPLIT INTO TWO PARTS
    const parts = Base64Image.split(';base64,');
    // HOLD THE CONTENT TYPE
    const imageType = parts[0].split(':')[1];
    // DECODE BASE64 STRING
    const decodedData = window.atob(parts[1]);
    // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
    const uInt8Array = new Uint8Array(decodedData.length);
    // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // RETURN BLOB IMAGE AFTER CONVERSION
    return new Blob([uInt8Array], { type: imageType });
  }
}
