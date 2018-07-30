import { Component } from '@angular/core';
import { ChatService } from './chat/chat.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'chatbotangular';

  
  constructor(chatService: ChatService){

       chatService.sendToWatson('');
        
    

  }

  
}
