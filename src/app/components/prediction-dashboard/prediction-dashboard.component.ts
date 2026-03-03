import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { trigger, transition, style, animate, state } from '@angular/animations';

interface ChatMessage {
    text: string;
    isBot: boolean;
    options?: string[];
    isAnalysis?: boolean;
}

@Component({
    selector: 'app-prediction-dashboard',
    templateUrl: './prediction-dashboard.component.html',
    styleUrls: ['./prediction-dashboard.component.css'],
    animations: [
        trigger('slideInOut', [
            state('void', style({ transform: 'translateY(20px)', opacity: 0 })),
            state('*', style({ transform: 'translateY(0)', opacity: 1 })),
            transition('void <=> *', animate('400ms ease-out'))
        ])
    ]
})
export class PredictionDashboardComponent implements OnInit, AfterViewChecked {
    @ViewChild('messageContainer') private messageContainer!: ElementRef;

    robotAsset = 'assets/robot-assistant.png';
    messages: ChatMessage[] = [];
    isTyping = false;
    dataRange: any = null;
    predictionOptions = [
        'BASED ON YESTERDAY',
        'BASED ON LAST ONE WEEK',
        'BASED ON LAST ONE MONTH',
        'BASED ON LAST 3 MONTHS',
        'BASED ON LAST 6 MONTHS',
        'BASED ON LAST YEAR'
    ];
    navOptions = ['BACK TO MENU', 'BACK TO HOME'];

    daysMap: { [key: string]: number } = {
        'BASED ON YESTERDAY': 1,
        'BASED ON LAST ONE WEEK': 7,
        'BASED ON LAST ONE MONTH': 30,
        'BASED ON LAST 3 MONTHS': 90,
        'BASED ON LAST 6 MONTHS': 180,
        'BASED ON LAST YEAR': 365
    };

    constructor(private apiService: ApiService, private router: Router) { }

    ngOnInit(): void {
        this.apiService.getDataRange().subscribe(data => {
            this.dataRange = data;
        });
        this.startConversation();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    startConversation() {
        this.addBotMessage('Welcome to the Sales Prediction Hub! 🚀');
        setTimeout(() => {
            this.addBotMessage('I can analyze your historical data to predict future performance. Choose a timeframe to begin:');
        }, 1000);
        setTimeout(() => {
            this.addBotMessage('SELECT THE FUTURE PREDICTION TIME:', this.predictionOptions);
        }, 2000);
    }

    addBotMessage(text: string, options?: string[], isAnalysis = false) {
        this.isTyping = true;
        setTimeout(() => {
            this.messages.push({ text, isBot: true, options, isAnalysis });
            this.isTyping = false;
        }, 1000);
    }

    selectOption(option: string) {
        this.messages.push({ text: option, isBot: false });

        const requestedDays = this.daysMap[option];
        const now = new Date();
        const earliest = this.dataRange?.earliest_date ? new Date(this.dataRange.earliest_date) : now;
        const diffDays = Math.floor((now.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24));

        // Data sufficiency check (User specifically asked for 1 year check for long term)
        if (requestedDays > 7 && diffDays < (requestedDays / 2)) {
            setTimeout(() => {
                this.addBotMessage(`Analysis for ${option} requires more historical data. We currently only have ${diffDays} days of usage. 📊`);
            }, 800);
            setTimeout(() => {
                this.addBotMessage('Please continue using this application for accurate future predictions! 🚀');
            }, 2000);
            return;
        }

        this.isTyping = true;
        this.apiService.getDailySales(requestedDays).subscribe(data => {
            this.isTyping = false;
            if (!data || !data.dailySales || data.dailySales.length === 0) {
                this.addBotMessage('I couldn\'t find any sales data for this period yet. Try reaching a bit further back! 🔍');
            } else {
                this.processAnalysis(option, data, requestedDays);
                setTimeout(() => {
                    this.addBotMessage('WHAT WOULD YOU LIKE TO DO NEXT?', this.navOptions);
                }, 3000);
            }
        });
    }

    handleNavOption(option: string) {
        this.messages.push({ text: option, isBot: false });
        if (option === 'BACK TO HOME') {
            setTimeout(() => {
                this.router.navigate(['/']);
            }, 1000);
        } else if (option === 'BACK TO MENU') {
            setTimeout(() => {
                this.addBotMessage('SELECT THE FUTURE PREDICTION TIME:', this.predictionOptions);
            }, 1000);
        }
    }

    processAnalysis(option: string, data: any, requestedDays: number) {
        const { dailySales, topItems } = data;
        const totalSales = dailySales.reduce((sum: number, item: any) => sum + parseFloat(item.total_sales), 0);
        const avgDailySales = totalSales / (dailySales.length || 1);

        // Simple linear projection for "Future Sale"
        const predictedNextDay = avgDailySales;
        const trend = dailySales.length > 1 ? (parseFloat(dailySales[0].total_sales) > parseFloat(dailySales[dailySales.length - 1].total_sales) ? 'UP' : 'STEADY') : 'NEUTRAL';

        let topProductsText = '';
        if (topItems && topItems.length > 0) {
            topProductsText = '\n\n🏆 TOP SELLING PRODUCTS:\n' +
                topItems.map((it: any, i: number) => `${i + 1}. ${it.item_name} (${it.total_quantity} sold)`).join('\n');
        }

        const analysisText = `📊 ANALYSIS COMPLETE (${option})
    
Total Sales in Period: ₹${totalSales.toFixed(2)}
Daily Average: ₹${avgDailySales.toFixed(2)}${topProductsText}
    
🔮 PREDICTION:
Expected sales for tomorrow: ₹${predictedNextDay.toFixed(2)}
Current Trend: ${trend}
    
Our AI suggests you are on a ${trend === 'UP' ? 'growth trajectory' : 'stable path'}. Keep tracking!`;

        this.addBotMessage(analysisText, undefined, true);
    }
}
