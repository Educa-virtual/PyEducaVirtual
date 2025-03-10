import { Injectable } from '@angular/core'
import { PDFDocument, rgb } from 'pdf-lib'

@Injectable({
    providedIn: 'root',
})
export class PdfService {
    async createPdfFromText(text: string): Promise<Uint8Array> {
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([600, 400])

        // const font = await pdfDoc.embedStandardFont('Helvetica')
        // const size = 12;

        // Dibuja el texto
        page.drawText(text, {
            x: 50,
            y: 350,
            // font,
            // size,
            color: rgb(0, 0, 0),
        })

        const pdfBytes = await pdfDoc.save()
        return pdfBytes
    }
}
