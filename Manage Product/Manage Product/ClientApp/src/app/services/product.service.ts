import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, first, shareReplay } from 'rxjs/operators';

import { Product } from '../interfaces/product';

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    constructor(private http: HttpClient) { }

    private baseUrl: string = "api/product/getproducts"; // get 
    private productUrl: string = "api/product/addproduct"; // insert - post
    private deleteUrl: string = "api/product/deleteproduct/";
    private updateUrl: string = "api/product/updateproduct/"; // update - put
    private product$: Observable<Product[]>;

    // Get All products
    getProducts(): Observable<Product[]> {
        if (!this.product$) {
            this.product$ = this.http.get<Product[]>(this.baseUrl).pipe(shareReplay());
        }
        // If products cache exists return it
        return this.product$;
    }

    // Get Product by its ID
    getProductById(id: number): Observable<Product> {
        return this.getProducts().pipe(flatMap(result => result), first(product => product.productId == id));
    }

    // Insert Product
    insertProduct(newProduct: Product): Observable<Product> {
        return this.http.post<Product>(this.productUrl, newProduct);
    }

    // Update Product
    updateProduct(id: number, editProduct: Product): Observable<Product> {
        return this.http.put<Product>(this.updateUrl + id, editProduct);
    }

    // Delete Product
    deleteProduct(id: number): Observable<any> {
        return this.http.delete(this.deleteUrl + id);
    }

    // Clear Cache
    clearCache() {
        this.product$ = null;
    }
}
