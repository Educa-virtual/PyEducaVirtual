import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private printRequest = new Subject<void>()

    printRequest$ = this.printRequest.asObservable()

    requestPrint() {
        this.printRequest.next()
    }

    convertToInlineStyles(element: HTMLElement): void {
        // Obtener estilos computados para el elemento
        const computedStyle = getComputedStyle(element)

        // Generar una cadena de estilos en línea
        let inlineStyle = ''
        for (const property of Object.keys(computedStyle)) {
            inlineStyle += `${property}: ${computedStyle.getPropertyValue(property)}; `
        }

        // Asignar los estilos en línea al elemento
        element.setAttribute('style', inlineStyle)

        // Recursivamente convertir los estilos de los hijos
        Array.from(element.children).forEach((child) =>
            this.convertToInlineStyles(child as HTMLElement)
        )
    }
}
