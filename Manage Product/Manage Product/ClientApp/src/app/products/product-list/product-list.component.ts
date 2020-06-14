import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  insertForm: FormGroup;
  name: FormGroup;
  price: FormGroup;
  description: FormGroup;
  imageUrl: FormGroup;

  // Updating the Product
  updateForm: FormGroup;
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

  constructor(private productService: ProductService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef
  ) { }

  ///// ---->>> ADD NEW PRODUCT <<<----
  // Modal
  onAddProduct() {
    this.modalRef = this.modalService.show(this.modal);
  }

  // Method 
  onSubmit() {
    let newProduct = this.insertForm.value;

    this.productService.insertProduct(newProduct).subscribe(
      result => {
        this.productService.clearCache();
        this.product$ = this.productService.getProducts();

        this.product$.subscribe(newlist => {
          this.products = newlist;
          this.modalRef.hide();
          this.insertForm.reset();
          this.rerender();
        });
        console.log("New Product added");
      },
      error => console.log('Could not add Product')
    )
  }

  //// ---->>> EDIT PRODUCT <<<----
  // Modal
  onUpdateModal(id) {
    this.modalRef = this.modalService.show(this.editmodal);
  }

  // Method to update an existing Product
  onUpdate() {
    let editProduct = this.updateForm.value;
    this.productService.updateProduct(editProduct.id, editProduct).subscribe(
      result => {
        console.log('Product Updated');
        this.productService.clearCache();
        this.product$ = this.productService.getProducts();
        this.product$.subscribe(updateList => {
          this.products = updateList;
          this.modalRef.hide();
          this.rerender();
        }, error => console.log('Could not update product'))
      }
    )
  }

  ////// ---- System ----
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 9,
      autoWidth: true,
      order: [[0, 'desc']]
    };

    this.product$ = this.productService.getProducts(); // Show data on web
    this.product$.subscribe(result => {
      this.products = result;
      this.chRef.detectChanges();
      this.dtTrigger.next();
    });

    // Modal Messages
    this.modalMessage = "All fields are mandatory";

    ///// Initalizing ADD PRODUCT properties
    let validateImageUrl: string = '/(https?:\/\/.*\.(?:png|jpg))/i';

    this.insertForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      imageUrl: new FormControl('', [Validators.pattern(validateImageUrl)])
    });

    this.insertForm = this.fb.group({
      'name': this.name,
      'price': this.price,
      'description': this.description,
      'imageUrl': this.imageUrl,
      'OutOfStock': true,
    });

    ///// Initalizing EDIT PRODUCT properties
    this.updateForm = new FormGroup({
      _name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      _price: new FormControl('', [Validators.required, Validators.min(0)]),
      _description: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      _imageUrl: new FormControl('', [Validators.pattern(validateImageUrl)]),
      _id: new FormControl()
    });

    this.updateForm = this.fb.group({
      'id': this._id,
      'name': this._name,
      'price': this._price,
      'description': this._description,
      'imageUrl': this._imageUrl,
      'OutOfStock': true
    });
  }

  // Do not forget unsubcribe
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
  // Method to destroy old table and re-render new table
  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next()
    });
  }
}