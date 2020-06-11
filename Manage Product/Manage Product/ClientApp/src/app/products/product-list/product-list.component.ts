import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Product } from 'src/app/interfaces/product';
import { Observable, Subject } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  // FormControl - Adding Product
  insertFrom: FormGroup;
  name: FormGroup;
  price: FormGroup;
  description: FormGroup;
  imageUrl: FormGroup;

  // Updating the Product
  updateFrom: FormGroup;
  _name: FormGroup;
  _price: FormGroup;
  _description: FormGroup;
  _imageUrl: FormGroup;
  _id: FormGroup;

  // Add Modal
  @ViewChild('template') modal: TemplateRef<any>;

  // Update Modal
  @ViewChild('editTemplate') editmodal: TemplateRef<any>;

  // Modal Messages
  modalMessage: string;
  modalRef: BsModalRef;
  selectedProduct: Product;
  product$: Observable<Product[]>;

  // Data Tables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      autoWidth: true,
      order: [[0, 'desc']]
    };

    this.product$ = this.productService.getProducts();
    this.product$.subscribe(result => { 
      this.products = result;
      this.dtTrigger.next();
    });
  }

  insertForm() {

  }

  updateForm() {

  }

}
