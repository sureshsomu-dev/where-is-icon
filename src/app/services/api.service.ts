import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  selectedCoin = new BehaviorSubject<any>(null);
  coinDetails = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }
  public getSearchResults(params: any): Observable<any> {
    const url = 'https://api.coingecko.com/api/v3/search?query=' + params;
    return this.http.get<any>(url)
  }
  public getTrendingCoins(): Observable<any> {
    const url = 'https://api.coingecko.com/api/v3/search/trending';
    return this.http.get<any>(url)
  }
  public getCoinInfo(coindID: any): Observable<any> {
    console.log('REACHED SERVICE FOR GET DATA', coindID)
    const url = 'https://api.coingecko.com/api/v3/coins/' + coindID
    return this.http.get<any>(url)
  }

}
