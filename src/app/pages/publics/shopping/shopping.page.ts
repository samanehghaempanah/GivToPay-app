import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { IonContent, IonModal, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { itemModel } from 'src/app/definitions/models/Entities.model';
import { OrderStatus, OrderType } from 'src/app/definitions/models/DataTypes.model';
import { ChatMessage_Model, MessageStatus, MessageType, } from 'src/app/definitions/models/SignalR.model';
import { StorageService } from 'src/app/services/storage.service';
import { OrderService } from 'src/app/services/order.service';
import { AudioRecordingService } from 'src/app/services/audio-recording.service';
import { FileUploaderService } from 'src/app/services/file-uploader.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.page.html',
  styleUrls: ['./shopping.page.scss'],
})
export class ShoppingPage implements OnInit {

  @ViewChild(IonContent) content: IonContent | any;
  @ViewChild(IonModal) modal: IonModal | any;

  public data = [
    'Milk',
    'Limon Juice',
    'Bread',
    'Yogurt',
    'Apple',
    'Rice',
    'Banana',
    'cake',
    'salt',
    'pasta',
  ];
  
  public results = [...this.data];

  currentMessage = new ChatMessage_Model();
  // notFirstMsg: any;
  isModalOpen = false;

  MessageStatus = MessageStatus;
  MessageType = MessageType;
  OrderType = OrderType;
  OrderStatus = OrderStatus;
  Messages: ChatMessage_Model[] = [];
  orders: any[] = [];
  itemData = new itemModel();
  private subscriptions = new Subscription();

  PageData = {
    Waiting: false, Loaded: false, isTyping: false,
    OrderNumber: '', SendMessageText: '',
    submitType: OrderType.NotDefined,
    alertText: '', alertIsOpen: false,
    AudioRecorder: {
      Status: null as unknown as null | 'recording' | 'ready' | 'uploading',
      recordedTime: null as any,
      blobUrl: null as any,
      blob: null as any
    }
  };

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.PageData.alertIsOpen = false;
      },
    },
    {
      text: 'Submit',
      // role: 'confirm',
      handler: () => {
        this.submitOrder();
      },
    },
  ];

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    public storageService: StorageService,
    public appComponent: AppComponent,
    public orderService: OrderService,
    private audioRecordingService: AudioRecordingService,
    public fileUploaderService: FileUploaderService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {

    this.PageData.OrderNumber = this.route.snapshot.paramMap.get('ordernumber') ?? '';

    this.subscriptions.add(this.appComponent.ChatHUB.onReceiveMessage$.subscribe((data: any) => { this.onReceiveMessage(data); }));
    this.subscriptions.add(this.appComponent.ChatHUB.onReceiveTyping$.subscribe((data: any) => { this.onReceiveTyping(data); }));

    this.subscriptions.add(this.fileUploaderService.onUploadFinished$.subscribe((data: any) => { this.onFileUploaded(data); }));

    this.subscriptions.add(this.audioRecordingService.recordingFailed().subscribe(() => (this.PageData.AudioRecorder.Status = null)));
    this.subscriptions.add(this.audioRecordingService.getRecordedTime().subscribe(time => (this.PageData.AudioRecorder.recordedTime = time)));
    this.subscriptions.add(this.audioRecordingService.getRecordedBlob().subscribe(data => { this.PageData.AudioRecorder.blob = data; this.PageData.AudioRecorder.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob)); }));

    // this.loadData();
    // this.loadOrders();

    setTimeout(() => { if (this.content) { this.content.scrollToBottom(500); } }, 500);

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.audioRecordingService.abortRecording();
  }

  ionViewDidEnter() {
    this.loadData();
    this.loadOrders();
    console.log('this.Messages', this.Messages);
    // this.notFirstMsg = this.Messages.find((msg) => (msg.IsCustomer === true))
  }

  async loadData() {

    try {

      let messages = await this.appComponent.ChatHUB.Messages(this.PageData.OrderNumber);

      if (messages) { messages.forEach((messageItem: any) => { this.addMessage(messageItem); }); }

    } catch { }

    this.PageData.Loaded = true;

    let shoppingResult = await this.orderService.Last();

    if (shoppingResult) {

      if (shoppingResult.Status === OrderStatus.Draft) { this.navCtrl.navigateRoot('shopping/' + shoppingResult.OrderNumber); }

      else if (shoppingResult.Status === OrderStatus.InProgress) {

        if (shoppingResult.Type === OrderType.Buy) { this.navCtrl.navigateRoot('order/' + shoppingResult.OrderNumber); }

        else { this.navCtrl.navigateRoot('suggestion/' + shoppingResult.OrderNumber); }
      }

      else if (shoppingResult.Status === OrderStatus.Ready) { this.navCtrl.navigateRoot('basket/' + shoppingResult.OrderNumber); }

      else { this.navCtrl.navigateRoot('history/'); }
    }
  }

  async loadOrders() {
    let result = await this.orderService.GET();
    if (result) {
      this.orders = result.Items;
      console.log('this.orders:', this.orders);
    }
  }

  onWellcome() {
    this.appComponent.ChatHUB.Wellcome(this.PageData.OrderNumber);
  }

  onRecording() {

    if (this.PageData.AudioRecorder.Status === 'recording') {
      this.PageData.AudioRecorder.Status = 'ready';
      this.audioRecordingService.stopRecording();
    }

    else if (this.PageData.AudioRecorder.Status !== 'uploading') {
      this.PageData.AudioRecorder.Status = 'recording';
      this.audioRecordingService.startRecording();
    }
  }

  cancelRecording() {
    this.PageData.AudioRecorder.Status = null;
    this.PageData.AudioRecorder.blobUrl = null;
    this.PageData.AudioRecorder.blob = null;
  }

  async onFileUploaded(data: any) {

    let messageModel = new ChatMessage_Model();
    messageModel.Message = data.FileURL;
    messageModel.OrderNumber = this.PageData.OrderNumber;
    messageModel.ClientMessage_Id = crypto.randomUUID();
    messageModel.MessageType = MessageType.Voice;
    messageModel.MessageStatus = MessageStatus.Draft;
    messageModel.Creation_date = new Date();
    messageModel.IsCustomer = true;
    messageModel.Editable = true;

    this.addMessage(messageModel);

    this.cancelRecording();
    setTimeout(() => { if (this.content) { this.content.scrollToBottom(500); } }, 500);

    await this.appComponent.ChatHUB.Send_Message(messageModel);

  }

  onReceiveMessage(data: ChatMessage_Model) {

    if (data.OrderNumber === this.PageData.OrderNumber) {

      if (data.MessageType_Title === "ShoppingList") {

        let oldShoppingList = this.Messages.find(
          (msg) => (msg.MessageType_Title === data.MessageType_Title && msg.ClientMessage_Id != data.ClientMessage_Id)
        )

        oldShoppingList ? oldShoppingList.Editable = false : null;
      }
      
      this.addMessage(data);

      setTimeout(() => { if (this.content) { this.content.scrollToBottom(500); } }, 500);

    }
  }

  onReceiveTyping(data: string) {

    if (data === this.PageData.OrderNumber) {

      this.PageData.isTyping = true;

      setTimeout(() => { this.PageData.isTyping = false; }, 1000);

    }
  }

  sendTyping() { this.appComponent.ChatHUB.Send_Typing(this.PageData.OrderNumber); }

  private addMessage(item: ChatMessage_Model) {

    if (item.MessageStatus !== MessageStatus.Seen && !item.IsCustomer) {
      item.MessageStatus = MessageStatus.Seen;
      this.appComponent.ChatHUB.Seen_Message(item);
    }

    let index = this.Messages.findIndex((x) => x.ClientMessage_Id === item.ClientMessage_Id);

    if (index !== -1) { this.Messages[index] = item; }

    else {
      this.Messages.push(item);
      // this.Messages.sort((a, b) => new Date(a.Creation_date).getTime() - new Date(b.Creation_date).getTime());
    }

  }

  async sendMessage() {

    if (!this.PageData.Waiting) {

      this.PageData.Waiting = true;

      try {

        // TEXT MESSAGE
        if (this.PageData.SendMessageText.trim().length > 0) {

          let messageModel = new ChatMessage_Model();
          messageModel.Message = this.PageData.SendMessageText;
          messageModel.OrderNumber = this.PageData.OrderNumber;
          messageModel.ClientMessage_Id = crypto.randomUUID();
          messageModel.MessageType = MessageType.Text;
          messageModel.MessageStatus = MessageStatus.Draft;
          messageModel.Creation_date = new Date();
          messageModel.IsCustomer = true;
          messageModel.Editable = true;

          this.addMessage(messageModel);

          this.PageData.SendMessageText = '';
          setTimeout(() => { if (this.content) { this.content.scrollToBottom(500); } }, 500);

          await this.appComponent.ChatHUB.Send_Message(messageModel);

        }

        // FILE MESSAGE
        else if (this.PageData.AudioRecorder.Status === 'ready') {

          this.PageData.AudioRecorder.Status = 'uploading';
          this.fileUploaderService.Upload_Blob(this.PageData.AudioRecorder.blob.blob, this.PageData.AudioRecorder.blob.title)
        }

      } catch { }

      this.PageData.Waiting = false;
    }
  }

  async onDeleteItem(message: ChatMessage_Model, item: itemModel) {
    let result = await this.orderService.Item_DELETE(item.Id);
    if (result) {
      console.log('result after delete', result);
      let items = this.Messages.find(
        (msg) => msg.ClientMessage_Id === message.ClientMessage_Id
      )?.OrderItems.filter((i) => i.Id !== item.Id);
      items ? (message.OrderItems = items) : [];
    }
  }

  onEditItem(msg: ChatMessage_Model, item: itemModel) {
    console.log("item", item);
    this.currentMessage = msg;
    this.itemData = item;
    this.setOpen(true);
  }

  async onSaveItem() {
    let result = await this.orderService.Item_PUT(this.itemData.Id, this.itemData);
    if (result) {
      console.log('result after edit', result);
      let itemFound = this.Messages.find(
        (msg) => msg.ClientMessage_Id === this.currentMessage.ClientMessage_Id
      )?.OrderItems.find((i) => i.Id === result.Id);
      if (itemFound) {
        itemFound.Title = this.itemData.Title;
        itemFound.Quantity = this.itemData.Quantity;
        itemFound.Unit = this.itemData.Unit;
        itemFound.Brand = this.itemData.Brand;
      }
      console.log('this.Messages in edit', this.Messages);
    }
  }

  onSubmit(submitType: OrderType) {
    this.PageData.submitType = submitType;
    this.PageData.alertText =
      submitType === OrderType.Suggestion
        ? 'Now I Will select the best list of suggestions for you'
        : 'Now I Will select the best prices and prepare a receipt for payment for you';
    this.PageData.alertIsOpen = true;
  }

  async submitOrder() {
    let result = await this.orderService.Submit(
      this.PageData.OrderNumber,
      this.PageData.submitType
    );
    if (result) {
      if (this.PageData.submitType === OrderType.Buy) {
        this.router.navigate(['./order', this.PageData.OrderNumber]);
      } else {
        this.router.navigate(['./suggestion', this.PageData.OrderNumber]);
      }
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.isModalOpen = false;
  }

  confirm() {
    this.onSaveItem();
    this.isModalOpen = false;
  }

  handleInput(event:any) {
    const query = event.target.value.toLowerCase();
    this.results = this.data.filter((d) => d.toLowerCase().indexOf(query) > -1);
  }
}
