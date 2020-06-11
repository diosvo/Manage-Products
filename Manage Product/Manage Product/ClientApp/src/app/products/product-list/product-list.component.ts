import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef} from 'ngx-bootstrap/modal';
import { Product } from 'src/app/interfaces/product';
import { Observable } from 'rxjs';

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
  products: Product[] = [];

  // Data Tables Properties

  constructor() { }

  ngOnInit(): void {
  }

}
