import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { Router } from '@angular/router';
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'app-search-crypto',
  standalone: true,
  templateUrl: './search-crypto.component.html',
  styleUrl: './search-crypto.component.scss',
  imports: [FormsModule, MatFormFieldModule, MatIconModule, NgIf, NgFor, MatInputModule, SearchComponent, MatAutocompleteModule]

})
export class SearchCryptoComponent {
  searchInput: string = '';
  searchResults: any;
  resultOpened: boolean = false;
  constructor(private apiService: ApiService, private router: Router) {

  }
  getSearchResults() {
    if (this.searchInput.length >= 3)
      this.apiService.getSearchResults(this.searchInput).subscribe((data) => {
        data.coins = data.coins.filter((coin: any) => coin.market_cap_rank > 0)
        if (data && data.coins && data.coins.length > 5) {
          this.searchResults = data.coins.slice(0, 5);
        } else {
          this.searchResults = data.coins;
        }
      })
  }
  getCoinDetails(coin: any) {
    console.log(this.router.url)
    let currentUrl: any = this.router.url;
    if (currentUrl) {
      currentUrl = '/' + this.router.url.split('/')[1]
      if (coin && coin.id)
        this.apiService.getCoinInfo(coin.id).subscribe((data) => {
          this.apiService.coinDetails.next(data);
          this.searchResults = [];
          this.searchInput = '';
          this.router.navigate([coin.id])
        })
    }
  }
}
