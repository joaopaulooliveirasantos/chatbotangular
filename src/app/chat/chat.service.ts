import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';


// Message class for displaying messages in the component
export class Message {

  public output: OutputData;
  public context: any[];
  public intents: any[];
  public content: string;
  public sentBy: string;
  public data: Date;

  constructor() {this.data = new Date();}
  
}

export class OutputData{

  public text : string;

}


@Injectable({  providedIn: 'root'})
export class ChatService {

  conversation = new BehaviorSubject<Message[]>([]);

  constructor(private http: HttpClient) { }

  sendToWatson(message: string){

    const userMessage = new Message();
    userMessage.content = message;
    userMessage.sentBy = 'user';
    this.update(userMessage);

    const body = ({
      usermessage : message,
      workspace : environment.watson.workspace,
    });


    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',                 
    }            
  
    return this.http
      .post<Message>('http://localhost:3001/api/message/', body)
      .subscribe((botMessage) => {
        //const botMessage = new Message();
        botMessage.sentBy = 'bot';
        botMessage.content = botMessage.output.text;
        botMessage.data = new Date();
        this.update(botMessage);
        console.log("Bot Message",botMessage);
      });
  }

  // Adds message to source
  update(msg: Message) {

    if (msg.content === '')
      return;
      
    this.conversation.next([msg]);
  }

}
