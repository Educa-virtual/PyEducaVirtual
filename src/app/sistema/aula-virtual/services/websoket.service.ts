import { Injectable } from '@angular/core'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { Observable, Subject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    private socket$: WebSocketSubject<any>
    private serverUrl = 'ws://localhost:8080' // Cambia esta URL a tu servidor WebSocket
    private messagesSubject = new Subject<any>()
    public messages$ = this.messagesSubject.asObservable()

    constructor() {
        // Crear la conexión WebSocket utilizando WebSocketSubject
        this.socket$ = webSocket(this.serverUrl)

        // Escuchar los mensajes entrantes del servidor
        this.socket$.subscribe(
            (message) => {
                // Verificar si el mensaje es una cadena y procesarlo
                if (typeof message === 'string') {
                    try {
                        const parsedMessage = JSON.parse(message)
                        this.messagesSubject.next(parsedMessage) // Enviar el mensaje procesado al observable
                    } catch (error) {
                        console.error(
                            'Error al procesar el mensaje recibido:',
                            error
                        )
                    }
                } else {
                    // Si el mensaje ya es un objeto, lo enviamos tal cual
                    this.messagesSubject.next(message)
                }
            },
            (error) => console.error('Error en WebSocket:', error),
            () => console.warn('WebSocket cerrado')
        )
    }

    // Enviar un mensaje al servidor
    sendMessage(message: any): void {
        try {
            const jsonMessage = JSON.stringify(message) // Asegurarse de que el mensaje esté en formato JSON
            this.socket$.next(jsonMessage) // Enviar el mensaje al servidor
        } catch (error) {
            console.error('Error al enviar el mensaje:', error)
        }
    }

    // Método para escuchar eventos específicos del servidor (tipo de evento)
    listen(event: string): Observable<any> {
        return new Observable((observer) => {
            // Suscribirse a los mensajes que se emiten desde el WebSocketSubject
            this.socket$.subscribe({
                next: (data) => {
                    if (data.type === event) {
                        observer.next(data) // Emitir el evento de tipo específico
                    }
                },
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
            })
        })
    }

    // Cerrar la conexión WebSocket
    close(): void {
        this.socket$.complete() // Completar la suscripción y cerrar la conexión
    }
}
