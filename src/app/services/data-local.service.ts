import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
    providedIn: 'root'
})
export class DataLocalService {
    guardados: Registro[] = [];
    nombreFile = 'registros.csv';

    constructor(
        private storage: Storage,
        private navCtrl: NavController,
        private iab: InAppBrowser,
        private file: File,
        private emailComposer: EmailComposer
    ) {
        this.storage.get('registros').then(registros => {
            this.cargarStorage();
        });
    }

    async cargarStorage() {
        this.guardados = (await this.storage.get('registros')) || [];
    }

    async guardarRegsitro(format: string, text: string) {
        await this.cargarStorage();

        const nuevoRegistro = new Registro(format, text.toLowerCase());
        this.guardados.unshift(nuevoRegistro);

        this.storage.set('registros', this.guardados);

        this.abrirRegistro(nuevoRegistro);
    }

    abrirRegistro(registro: Registro) {
        this.navCtrl.navigateForward('/tabs/tab2');
        switch (registro.type) {
            case 'http':
                //Abrir el navgeador web por defecto (_system)
                this.iab.create(registro.text, '_system');
                break;
            case 'geo':
                //Abrir el mapa con mapbox
                this.navCtrl.navigateForward(
                    `/tabs/tab2/mapa/${registro.text}`
                );
                break;
        }
    }

    enviarCorreo() {
        const arrayTemporal = [];
        const titulos = 'Tipo, Formato, Fecha escaneado, Texto\n';

        arrayTemporal.push(titulos);
        this.guardados.forEach(registro => {
            const linea = `${registro.type}, ${registro.format}, ${
                registro.created
            }, ${registro.text.replace(',', ' ')}\n`;

            arrayTemporal.push(linea);
        });
        this.crearArchivoFisico(arrayTemporal.join(''));
    }

    crearArchivoFisico(texto: string) {
        this.file
            .checkFile(this.file.dataDirectory, this.nombreFile)
            .then(existe => {
                console.log('Existe archivo?', existe);
                return this.escribirEnArchivo(texto);
            })
            .catch(err => {
                return this.file
                    .createFile(this.file.dataDirectory, this.nombreFile, false)
                    .then(creado => this.escribirEnArchivo(texto))
                    .catch(err2 => console.log('No se peude crear el archivo'));
            });
    }

    async escribirEnArchivo(texto: string) {
        await this.file.writeExistingFile(
            this.file.dataDirectory,
            this.nombreFile,
            texto
        );

        const archivo = this.file.dataDirectory + this.nombreFile;
        console.log(archivo);
        console.log('Archivo creado');

        this.emailComposer.isAvailable().then((available: boolean) => {
            if (available) {
                //Now we know we can send
            }
        });

        const email = {
            to: '',
            attachments: [archivo],
            subject: 'Lista de escaneos',
            body: 'Aquí tienes una copia de la lista de escaneos - QR Scanner',
            isHtml: true
        };

        // Send a text message using default options
        this.emailComposer.open(email);
    }
}
