import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit {

  messages: Observable<Message[]>;
  formValue: string;

  constructor(public chat: ChatService) { }

  ngOnInit() {

    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable().pipe(scan((acc, val) => acc.concat(val)));

  }

  sendMessage() {

    // Preparando Menssagem
    const userMessage = new Message();
    userMessage.content = this.formValue;
    userMessage.sentBy = 'user';
    userMessage.context = this.chat.getLastMessage()
                              .context;
    
    console.log("Contexto enviado",userMessage.context);

    // Encaminhando para o Watson
    this.chat.sendToWatson(userMessage);
    this.formValue = '';
  }

}
