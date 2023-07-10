import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  private host: string;

  constructor() {
    this.host = ''
  }

  setHost(host: string): void {
    this.host = host;
  }

  getHost(): string {
    return this.host;
  }
}
