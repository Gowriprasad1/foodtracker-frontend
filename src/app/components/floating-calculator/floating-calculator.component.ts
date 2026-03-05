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

    // Draggable Button State
    position = { x: 0, y: 0 };
    isDragging = false;
    dragStartPosition = { x: 0, y: 0 };
    lastPosition = { x: 0, y: 0 };
    dragThreshold = 5; // pixels before considered a drag

    toggleCalculator(event?: Event) {
        if (event) {
            event.stopPropagation();
        }

        // Don't toggle if we just finished a drag
        if (this.isDragging) {
            return;
        }

        this.isOpen = !this.isOpen;
    }

    onDragStart(event: MouseEvent | TouchEvent) {
        if (this.isOpen) return; // Don't drag when modal is open

        this.isDragging = false;
        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

        this.dragStartPosition = { x: clientX, y: clientY };
        this.lastPosition = { ...this.position };
    }

    onDragMove(event: MouseEvent | TouchEvent) {
        if (this.isOpen || (this.dragStartPosition.x === 0 && this.dragStartPosition.y === 0)) return;

        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

        const deltaX = clientX - this.dragStartPosition.x;
        const deltaY = clientY - this.dragStartPosition.y;

        // If moved beyond threshold, mark as dragging
        if (Math.abs(deltaX) > this.dragThreshold || Math.abs(deltaY) > this.dragThreshold) {
            this.isDragging = true;
        }

        if (this.isDragging) {
            let newX = this.lastPosition.x + deltaX;
            let newY = this.lastPosition.y + deltaY;

            // the object starts fixed at bottom: 24px, right: 24px, and is 56x56
            // clamping it so it doesn't move off screen
            const maxX = 24;
            const minX = -window.innerWidth + 80; // 56 (width) + 24 (right gap)

            const maxY = 24;
            const minY = -window.innerHeight + 80; // 56 (height) + 24 (bottom gap)

            this.position = {
                x: Math.max(minX, Math.min(newX, maxX)),
                y: Math.max(minY, Math.min(newY, maxY))
            };
        }
    }

    onDragEnd(event: MouseEvent | TouchEvent) {
        // Reset start position so move doesn't keep firing
        this.dragStartPosition = { x: 0, y: 0 };

        // We defer resetting isDragging so the click event doesn't trigger the modal immediately
        if (this.isDragging) {
            setTimeout(() => {
                this.isDragging = false;
            }, 50);
        }
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
