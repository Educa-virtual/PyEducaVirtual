import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    // URL del servidor de WebSocket, puede cambiar a producción
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
    });
  }

  listen(eventName: string): Observable<any> {
    return new Observable(subscriber => {
      this.socket.on(eventName, data => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
