import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[stockCount]',
})
export class StockStatusDirective implements OnChanges {
  @Input() stockCount!: number;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    this.updateStockStatus();
  }

  private updateStockStatus(): void {
    this.clearStatusClasses();

    if (this.stockCount < 1) {
      this.setStatus(
        'Out of stock',
        'product-details__badge--out');

      return;
    }

    if (this.stockCount <= 10) {
      this.setStatus(
        'Almost sold out',
        'product-details__badge--out');

      return;
    }

    this.setStatus(
      'In stock',
      'product-details__badge');
  }

  private setStatus(text: string, className: string): void {
    const element = this.elementRef.nativeElement;
    this.renderer.setProperty(element, 'textContent', text);
    this.renderer.addClass(element, className);
  }

  private clearStatusClasses(): void {
    const element = this.elementRef.nativeElement;

    this.renderer.removeClass(element, 'product-details__badge--out');
  }
}
