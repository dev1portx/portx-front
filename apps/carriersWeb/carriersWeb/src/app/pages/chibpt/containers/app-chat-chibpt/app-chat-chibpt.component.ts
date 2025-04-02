import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-app-chat-chibpt',
    templateUrl: './app-chat-chibpt.component.html',
    styleUrls: ['./app-chat-chibpt.component.scss'],
    standalone: false
})
export class AppChatChibptComponent {
  @Input() chatId: string = '';
}
