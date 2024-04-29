import * as signalR from "@aspnet/signalr";
import { Subject } from "rxjs";
import { BaseService } from "src/app/services/base.service";
import { StorageService } from "src/app/services/storage.service";
import { FilteringModel } from "./Filtering.model";
import { itemModel, orderModel } from "./Entities.model";

export class SignalR_HUB {

    private hubConnection: signalR.HubConnection | undefined;

    private _isConnected: boolean = false;

    private onConnected = new Subject<any>(); public onConnected$ = this.onConnected.asObservable();
    private onDisconnected = new Subject<any>(); public onDisconnected$ = this.onDisconnected.asObservable();
    private onReceiveTyping = new Subject<any>(); public onReceiveTyping$ = this.onReceiveTyping.asObservable();
    private onReceiveMessage = new Subject<any>(); public onReceiveMessage$ = this.onReceiveMessage.asObservable();
    private onOrderChanged = new Subject<any>(); public onOrderChanged$ = this.onOrderChanged.asObservable();

    private setupEvents() {
        if (this.hubConnection) {
            this.hubConnection.on('onConnected', (data: any) => { this.hubConnected(data); });
            this.hubConnection.on('onDisconnected', (data: any) => { this.hubDisconnected(data); });
            this.hubConnection.onclose((data: any) => { this.hubDisconnected(data); });
            this.hubConnection.on('onReceiveTyping', (data: any) => { this.hubReceivedTyping(data); });
            this.hubConnection.on('onReceiveMessage', (data: any) => { this.hubReceivedMessage(data); });
            this.hubConnection.on('onOrderChanged', (data: any) => { this.hubonOrderChanged(data); });
        }
    }

    private async hubConnected(data: any) {
        this._isConnected = true;

        this.onConnected.next(data);
    }

    private hubDisconnected(data: any) {
        this._isConnected = false;

        this.onDisconnected.next(data);
    }

    private hubReceivedTyping(data: any) {
        this.onReceiveTyping.next(data);
    }

    private hubReceivedMessage(data: ChatMessage_Model) {

        this.addMessage(data);

        if (!data.IsCustomer && (data.MessageStatus === MessageStatus.Draft || data.MessageStatus === MessageStatus.ReceivedByServer)) {
            this.Deliver_Message(data);
        }

        this.onReceiveMessage.next(data);
    }

    private hubonOrderChanged(data: any) {
        this.onOrderChanged.next(data);
    }

    constructor(
        private connectionURL: string,
        private apiURL: string,
        private storageService: StorageService,
        private baseService: BaseService) { }

    public get isConnect(): boolean { return this._isConnected; }


    public async Messages(orderNumber: string, filteringModel: FilteringModel | null = null) {

        try {

            let clearStorage: boolean = false;

            if (!filteringModel) {

                filteringModel = new FilteringModel();
                filteringModel.PageSize = 200;

                clearStorage = true;
            }

            let result: any = await this.baseService.httpGET('', filteringModel, false, this.apiURL + orderNumber);

            if (clearStorage) { this.storageService.setChatMessages(orderNumber, []); }

            if (result && result.Items) {
                result.Items.forEach((element: ChatMessage_Model) => { this.addMessage(element); });
            }
        } catch { }

        return this.storageService.getChatMessages(orderNumber);
    }

    public async Connect() {

        if (!this._isConnected) {

            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(this.connectionURL, { accessTokenFactory: () => this.storageService.Token })
                .build();

            this.setupEvents();

            await this.hubConnection.start();

            // //// ---- JUST FOR ADMIN ---- \\\\
            // await this.JoinToSupportGroup();
        }

        return;
    }

    public async Disconnect() {

        if (this.hubConnection) {

            // //// ---- JUST FOR ADMIN ---- \\\\
            // await this.RemoveFromSupportGroup();

            return await this.hubConnection.stop();
        }

        return;
    }

    public async Start(orderNumber: string): Promise<any> {

        // Connect to server
        if (!this.isConnect) { await this.Connect(); }

        // invoke send message service
        if (this.hubConnection) {

            let messageModel = await this.hubConnection.invoke('Start', orderNumber);

            this.addMessage(messageModel);

            return messageModel;
        }

        return null;
    }

    public async Send_Message(messageModel: ChatMessage_Model): Promise<any> {

        // Connect to server
        if (!this.isConnect) { await this.Connect(); }

        // add message to array
        this.addMessage(messageModel);

        // invoke send message service
        if (this.hubConnection) { this.hubConnection.invoke('SendMessage', JSON.stringify(messageModel)); }

        // return result
        return messageModel;
    }

    public async Send_Typing(orderNumber: string): Promise<any> {

        // Connect to server
        if (!this.isConnect) { await this.Connect(); }

        // invoke send typing service
        if (this.hubConnection) {
            this.hubConnection.invoke('SendTyping', orderNumber);
        }
    }

    public async Wellcome(orderNumber: string): Promise<any> {

        // Connect to server
        if (!this.isConnect) { await this.Connect(); }

        // invoke send typing service
        if (this.hubConnection) {
            this.hubConnection.invoke('Wellcome', orderNumber);
        }
    }

    public async Order_Changed(orderNumber: string): Promise<any> {

        // Connect to server
        if (!this.isConnect) { await this.Connect(); }

        // invoke send typing service
        if (this.hubConnection) {
            this.hubConnection.invoke('OrderChanged', orderNumber);
        }
    }

    public async Deliver_Message(message: ChatMessage_Model): Promise<any> {

        // Connect to server
        if (!this.isConnect) { await this.Connect(); }

        // invoke send message service
        if (this.hubConnection) {

            await this.hubConnection.invoke('DeliverMessage', message.ClientMessage_Id);

            message.MessageStatus = MessageStatus.Delivered;

            this.addMessage(message);
        }
    }

    public async Seen_Message(message: ChatMessage_Model): Promise<any> {

        // Connect to server
        if (!this.isConnect) { await this.Connect(); }

        // invoke send message service
        if (this.hubConnection) {

            await this.hubConnection.invoke('SeenMessage', message.ClientMessage_Id);

            message.MessageStatus = MessageStatus.Seen;

            this.addMessage(message);
        }
    }

    private async JoinToSupportGroup() {
        try {
            if (this.hubConnection) {

                let result: any = await this.hubConnection.invoke('JoinToSupportGroup');

                return result;
            }
            return null;

        } catch { }
    }

    private async RemoveFromSupportGroup() {
        try {
            if (this.hubConnection) {

                let result: any = await this.hubConnection.invoke('RemoveFromSupportGroup');

                return result;
            }

            return null;

        } catch { }
    }

    private addMessage(item: ChatMessage_Model) {

        let messages = this.storageService.getChatMessages(item.OrderNumber);

        if (!messages) { messages = []; }

        let index = messages.findIndex((x) => x.ClientMessage_Id === item.ClientMessage_Id);

        if (index !== -1) { messages[index] = item; }

        else { messages.push(item); }

        this.storageService.setChatMessages(item.OrderNumber, messages);
    }
}

export class ChatMessage_Model {
    ClientMessage_Id: string = '';
    Message: string = '';
    MessageType: MessageType = MessageType.Text;
    MessageType_Title: string = '';
    MessageStatus: MessageStatus = MessageStatus.Draft;
    MessageStatus_Title: string = '';
    IsCustomer: boolean = false;
    Editable: boolean = false;
    User_Id: string = '';
    OrderNumber: string = '';
    Creation_date: any;
    OrderItems: itemModel[] = [];
}

export enum MessageType {
    Text = 0,
    Image = 1,
    Video = 2,
    PDF = 3,
    Voice = 4,
    ShoppingList = 10
}

export enum MessageStatus {
    Draft = 0,
    ReceivedByServer = 1,
    Delivered = 2,
    Seen = 3
}
