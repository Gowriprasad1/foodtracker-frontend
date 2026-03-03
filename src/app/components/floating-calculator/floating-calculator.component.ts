import { Component } from '@angular/core';

@Component({
    selector: 'app-floating-calculator',
    templateUrl: './floating-calculator.component.html',
    styleUrls: ['./floating-calculator.component.css']
})
export class FloatingCalculatorComponent {
    isOpen = false;
    display = '0';
    firstOperand: number | null = null;
    operator: string | null = null;
    waitingForSecondOperand = false;

    toggleCalculator() {
        this.isOpen = !this.isOpen;
    }

    inputDigit(digit: string) {
        if (this.waitingForSecondOperand) {
            this.display = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.display = this.display === '0' ? digit : this.display + digit;
        }
    }

    inputDecimal() {
        if (!this.display.includes('.')) {
            this.display += '.';
        }
    }

    handleOperator(nextOperator: string) {
        const inputValue = parseFloat(this.display);

        if (this.operator && this.waitingForSecondOperand) {
            this.operator = nextOperator;
            return;
        }

        if (this.firstOperand === null) {
            this.firstOperand = inputValue;
        } else if (this.operator) {
            const result = this.calculate(this.firstOperand, inputValue, this.operator);
            this.display = String(result);
            this.firstOperand = result;
        }

        this.waitingForSecondOperand = true;
        this.operator = nextOperator;
    }

    calculate(firstOperand: number, secondOperand: number, operator: string) {
        if (operator === '+') return firstOperand + secondOperand;
        if (operator === '-') return firstOperand - secondOperand;
        if (operator === '*') return firstOperand * secondOperand;
        if (operator === '/') return firstOperand / secondOperand;
        return secondOperand;
    }

    resetCalculator() {
        this.display = '0';
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = false;
    }

    handleEquals() {
        if (this.operator === null || this.firstOperand === null) return;
        const inputValue = parseFloat(this.display);
        const result = this.calculate(this.firstOperand, inputValue, this.operator);
        this.display = String(result);
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = false;
    }
}
