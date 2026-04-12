import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _messages: string[] = [];
  get messages(): readonly string[] {
    return this._messages;
  }
  add(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this._messages = [`[${timestamp}] ${message}`, ...this._messages].slice(0,
      20);
  }
  clear(): void {
    this._messages = [];
  }
}