import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { trigger, transition, style, animate, state } from '@angular/animations';

interface ChatMessage {
    text: string;
    isBot: boolean;
    options?: string[];
}

@Component({
    selector: 'app-prediction-chatbot',
    templateUrl: './prediction-chatbot.component.html',
    styleUrls: ['./prediction-chatbot.component.css'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(10px)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
            ])
        ]),
        trigger('slideInOut', [
            state('void', style({ transform: 'scale(0.8) translateY(100%)', opacity: 0 })),
            state('*', style({ transform: 'scale(1) translateY(0)', opacity: 1 })),
            transition('void <=> *', animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'))
        ])
    ]
})
export class PredictionChatbotComponent implements OnInit {
    isOpen = false;
    messages: ChatMessage[] = [];
    isTyping = false;
    dataRange: any = null;
    predictionOptions = [
        'based on last year',
        'based on last 6 months',
        'based on last 3 months',
        'based on last one month',
        'based on last one week'
    ];

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.apiService.getDataRange().subscribe(data => {
            this.dataRange = data;
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen && this.messages.length === 0) {
            this.startConversation();
        }
    }

    startConversation() {
        this.addBotMessage('Greetings! I am your Sales Prediction Assistant. 🤖');
        setTimeout(() => {
            this.addBotMessage('Please select the future prediction time:', this.predictionOptions);
        }, 1000);
    }

    addBotMessage(text: string, options?: string[]) {
        this.isTyping = true;
        setTimeout(() => {
            this.messages.push({ text, isBot: true, options });
            this.isTyping = false;
        }, 1000);
    }

    selectOption(option: string) {
        this.messages.push({ text: option, isBot: false });

        // Check data sufficiency (User mentioned having 2 days of data as of now)
        // We'll calculate the difference between now and the earliest date.
        const now = new Date();
        const earliest = this.dataRange?.earliest_date ? new Date(this.dataRange.earliest_date) : now;
        const diffDays = Math.floor((now.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 365) {
            setTimeout(() => {
                this.addBotMessage(`As of now, we only have ${diffDays} day(s) of data. I need more historical data to give you an accurate prediction. 📊`);
            }, 500);
            setTimeout(() => {
                this.addBotMessage('Please continue using this application for future predictions! The more you use it, the smarter I get. 🚀');
            }, 1500);
        } else {
            // Future implementation for sales prediction logic
            setTimeout(() => {
                this.addBotMessage(`Analysis for ${option} is coming soon! Our brain is processing the algorithms... 🧠`);
            }, 500);
        }
    }
}
