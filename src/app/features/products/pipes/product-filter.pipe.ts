import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product';
import { FilterState } from '../models/facetOption';
import { ProductFilterService } from '../service/fiter.service';

@Pipe({
  name: 'productFilterPipe',
  standalone: false,
})
export class ProductFilterPipe implements PipeTransform {
  constructor(private productFilterService: ProductFilterService) {}

  transform(products: Product[], filterState: FilterState): Product[] {
    return this.productFilterService.filter(products, filterState);
  }

}
