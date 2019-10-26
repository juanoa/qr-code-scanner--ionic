import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class DataLocalService {
    guardados: Registro[] = [];

    constructor(private storage: Storage) {
        this.storage.get('registros').then(registros => {
            this.cargarStorage();
        });
    }

    async cargarStorage() {
        this.guardados = (await this.storage.get('registros')) || [];
    }

    guardarRegsitro(format: string, text: string) {
        const nuevoRegistro = new Registro(format, text);
        this.guardados.unshift(nuevoRegistro);

        this.storage.set('registros', this.guardados);
    }
}
