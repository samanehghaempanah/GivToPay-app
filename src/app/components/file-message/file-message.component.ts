import { Component, Input, OnInit } from '@angular/core';
import { ChatMessage_Model } from 'src/app/definitions/models/SignalR.model';

@Component({
  selector: 'app-file-message',
  templateUrl: './file-message.component.html',
  styleUrls: ['./file-message.component.scss'],
})
export class FileMessageComponent implements OnInit {

  @Input() Message: ChatMessage_Model = new ChatMessage_Model();

  constructor() { }

  ngOnInit() { }

}
