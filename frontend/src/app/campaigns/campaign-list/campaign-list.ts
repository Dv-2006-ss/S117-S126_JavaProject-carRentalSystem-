import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignEngine } from '../../core/campaign-engine';
import { CampaignService } from '../../core/services/campaign';

import { EmailLoaderComponent } from '../../shared/loaders/email-loader/email-loader';
@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [CommonModule, EmailLoaderComponent],
  templateUrl: './campaign-list.html'
})
export class CampaignListComponent implements OnInit {

  campaigns: any[] = [];
  datasets: any[] = [];
  campaignHistory: any[] = [];
  isLoading = false; // ✅ Added for skeleton loader

  constructor(private engine: CampaignEngine, private campaignService: CampaignService) { }

  ngOnInit() {

    this.refresh();

    const userObj = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const user = typeof userObj === 'string' ? userObj : userObj.name || localStorage.getItem('username') || 'User';

    this.datasets = JSON.parse(
      localStorage.getItem(`datasets_${user}`) || '[]'
    );
    this.isLoading = true; // ✅ Start loading

    this.campaignService.getHistory().subscribe({
      next: (res) => {
        this.isLoading = false; // ✅ End loading
        this.campaignHistory = res;
      },
      error: (err) => {
        this.isLoading = false; // ✅ End loading on error
        console.error("Could not fetch history in campaign-list", err);
      }
    });
  }

  refresh() {
    this.campaigns = this.engine.getAll();
  }

  create(d: any) {
    this.engine.create(d);
    this.refresh();
  }

  start(id: number) {
    this.engine.start(id);
  }

  pause(id: number) {
    this.engine.pause(id);
  }

  resume(id: number) {
    this.engine.resume(id);
  }

  cancel(id: number) {
    this.engine.cancel(id);
    this.refresh();
  }

}
