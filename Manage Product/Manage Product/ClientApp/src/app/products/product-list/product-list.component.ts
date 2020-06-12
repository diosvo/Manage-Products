import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product } from 'src/app/interfaces/product';
import { Observable, Subject, Observer } from 'rxjs';
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
    ) { }

  // ---- ADD NEW PRODUCT ----
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
        });
        console.log("New Product added");
      },
      error => console.log('Could not add Product')
    )
  }

  // ---- EDIT PRODUCT ----
  // Edit Product
  onEditProduct() {
    this.modalRef = this.modalService.show(this.editmodal);
  }

  
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
      this.dtTrigger.next();
    });

    // Modal Messages
    this.modalMessage = "All fields are mandatory";

    ///// Initalizing ADD PRODUCT properties
    let validateImageUrl: string = '/(https?:\/\/.*\.(?:png|jpg))/i';
    // let validateImageUrl : string = '/assets/*.(?:png|jpg)';

    // this.insertForm = new FormGroup({
    //   name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    //   price: new FormControl('', [Validators.required, Validators.min(0)]),
    //   description: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    //   imageUrl: new FormControl('', [Validators.pattern(validateImageUrl)])
    //   // imageUrl: new FormControl('', [Validators.required])
    // });
    this.insertForm = new FormGroup ({
      name : new FormControl('', [Validators.required, Validators.maxLength(50)]),
      price : new FormControl('', [Validators.required, Validators.min(0)]),
      description : new FormControl('', [Validators.required, Validators.maxLength(150)]),
      imageUrl : new FormControl('', [Validators.pattern(validateImageUrl)])
    })
    
    this.insertForm = this.fb.group({
      'name': this.name,
      'price': this.price,
      'description': this.description,
      'imageUrl': this.imageUrl,
      'OutOfStock': true,
    });
    this.updateForm = this.fb.group({});

  }
}