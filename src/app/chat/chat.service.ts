import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';


// Message class for displaying messages in the component
export class Message {

  public output: OutputData;
  public context: any[];
  public intents: Intent[];
  public content: string;
  public sentBy: string;
  public data: Date;
  public visible: boolean;

  constructor() {
    this.data = new Date(); 
    this.visible = true;
  }
  
}

export class Intent{
  public intent: string;
}

export class OutputData{
  public text : string;
}


@Injectable({  providedIn: 'root'})
export class ChatService {

  conversation = new BehaviorSubject<Message[]>([]);

  constructor(private http: HttpClient) { }

  sendToWatson(message: Message){

    /* const userMessage = new Message();
    userMessage.content = message;
    userMessage.sentBy = 'user';
    userMessage.context = this.getLastMessage()
                              .context;
    console.log("Contexto enviado",userMessage.context); */

    this.update(message);

    const body = ({
      usermessage : message.content,
      workspace : environment.watson.workspace,
      context : message.context,
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

        // call to action
        // TODO: implementar envio de informações ao watson 
        //this.callToAction(botMessage);

        this.update(botMessage);
        console.log("Bot Message",botMessage);

      });
  }

  callToAction(msg : Message){
    
    if (msg.intents.length === 0)
      return;

    if (msg.intents[0].intent === 'solicitar-baixa'){

      console.log("solicitou baixa");
      this.intecaoSolicitarBaixa(msg);
    }

  }

  // Adds message to source
  update(msg: Message) {

    if (msg.content === '')
      return;

    if (msg.visible === false )
      return;

    console.log("Message Atual",this.conversation.value);  
    this.conversation.next([msg]);
  }

  // retornar ultima menssagem
  getLastMessage() : Message {

    if (this.conversation.value.length === 0)
      return new Message();

    return this.conversation.value[0];

  }

  // Intent solicitar-baixa
  intecaoSolicitarBaixa(msg: Message){
    msg.visible = false;

    //TODO: buscar informações do mutuario, incluir no contexto e reenviar ao watson
    this.sendToWatson(msg);
  }

}
