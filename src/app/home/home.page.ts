import {Component, OnInit} from '@angular/core';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {ActionSheetController} from '@ionic/angular';
import {ToastController} from '@ionic/angular';
import {formatCurrency} from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    public data: any = {
        nameTenant: undefined,
        area: undefined,
        type: undefined,
        valueTenant: undefined,
        dateTenant: undefined,
        localTenant: undefined
    };
    readonly EMAIL = 'EMAIL';
    readonly WHATSAPP = 'WHATSAPP';

    constructor(
        private socialSharing: SocialSharing,
        public toastController: ToastController,
        public actionSheetController: ActionSheetController) {
    }


    async shareSocial(chose: string) {

        const message = `
            Nome do arrendatario: ${this.data.nameTenant || 'NÃO INFORMADO'}\n
            Area: ${this.data.area || 'NÃO INFORMADA'} ${this.data.type}\n
            Valor do arrendamento: ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(this.data.valueTenant || 0)} \n
            Data do errendamento: ${this.data.dateTenant || this.getArrendamentoDate()}\n
            Local: ${this.data.localTenant || 'NÃO INFORMADA'}\n
            Data da criação do registro: ${this.getArrendamentoDate()}
        `;

        console.log(message);

        try {
            if (chose === this.EMAIL) {
                const socialShare = await this.socialSharing.shareViaEmail(message, 'Subject', null);
                await this.presentToastWithOptions('Enviado com sucesso!');
            } else {
                const socialShare = await this.socialSharing.shareViaWhatsApp(message, null);
                await this.presentToastWithOptions('Enviado com sucesso!');
            }
        } catch (e) {
            await this.presentToastWithOptions('Não foi possivel encontrar um cliente de email.' + e);
        }
    }

    async presentToastWithOptions(message: string) {
        const toast = await this.toastController.create({
            message: message,
            showCloseButton: true,
            position: 'top',
            closeButtonText: 'fechar'
        });
        toast.present();
    }

    handleSubmit() {
        console.log(this.data);
        this.presentActionSheet();
    }

    getArrendamentoDate() {
        return new Date().toLocaleDateString('pt-BR');
    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Compartilhar',
            translucent: true,
            keyboardClose: false,
            buttons: [{
                text: 'Whatsapp',
                icon: 'logo-whatsapp',
                handler: () => {
                    this.shareSocial(this.WHATSAPP);
                }
            }, {
                text: 'Email',
                icon: 'mail',
                handler: () => {
                    this.shareSocial(this.EMAIL);
                }
            }, {
                text: 'Cancelar',
                icon: 'close',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
        });
        await actionSheet.present();
    }

}
