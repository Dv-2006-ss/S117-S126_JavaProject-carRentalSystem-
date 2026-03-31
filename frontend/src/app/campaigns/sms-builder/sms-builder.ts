import { Component, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast';
import { CampaignService } from '../../core/services/campaign';

@Component({
    selector: 'app-sms-builder',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './sms-builder.html',
    styleUrls: ['./sms-builder.scss']
})
export class SmsBuilderComponent implements OnInit {

    dataset: any = null;
    campaign: any = null;
    smsContent = '';
    isDirectAccess = false;
    isEditMode = false;
    companyName = 'Company';
    
    // Scheduled Fields
    scheduledDateStr = '';
    scheduledTimeStr = '';
    scheduleMode: 'immediate' | 'later' = 'immediate';
    scheduledDate = '';
    userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // 3D Dashboard-Style Signals
    mouseX = signal(0);
    mouseY = signal(0);
    scrollProgress = signal(0);
    rotateX = signal(0);
    rotateY = signal(0);

    @HostListener('window:scroll', [])
    onScroll() {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress.set(scroll / Math.max(height, 1));
    }

    onMouseMove(event: MouseEvent) {
      const x = (event.clientX / window.innerWidth) - 0.5;
      const y = (event.clientY / window.innerHeight) - 0.5;
      this.mouseX.set(x);
      this.mouseY.set(y);
      this.rotateY.set(x * 30);
      this.rotateX.set(y * -30);
    }

    constructor(private router: Router, private toast: ToastService, private campaignService: CampaignService) { }

    ngOnInit() {
        const currentUser = JSON.parse(localStorage.getItem('user') || localStorage.getItem('currentUser') || '{}');
        this.companyName = currentUser.companyName || 'Company';

        const navState = history.state;

        if (!navState || !navState.campaign) {
            this.isDirectAccess = true;
        }

        this.dataset = navState?.dataset || JSON.parse(localStorage.getItem('active_dataset') || 'null');
        this.campaign = navState?.campaign || { name: 'New SMS Campaign', type: 'sms' };

        if (!this.dataset || !this.campaign) {
            this.router.navigate(['/campaigns-form']);
            return;
        }

        if (navState?.isEdit) {
            this.isEditMode = true;
            let cleanMessage = this.campaign.message || '';
            cleanMessage = cleanMessage.replace(/<[^>]*>?/gm, '').replace(/undefined/g, '').trim();
            this.smsContent = cleanMessage;
        }
    }

    goBack() {
        if (this.isDirectAccess) {
            this.router.navigate(['/']);
        } else {
            this.router.navigate(['/campaigns-form']);
        }
    }

    insertVariable(variable: string) {
        this.smsContent += variable;
    }

    async insertLink() {
        const url = await this.toast.prompt("Enter the URL to link:", "https://yourwebsite.com/offer");
        if (url) {
            this.smsContent += ` ${url} `;
        }
    }

    insertOptOut() {
        this.smsContent += "\n\nReply STOP to opt out.";
    }

    confirmFinalSms() {
        if (this.isDirectAccess) {
            this.toast.show("Action restricted: Please start a campaign from the Campaign Engine page first.", "error");
            return;
        }
        if (!this.smsContent.trim()) {
            this.toast.show("SMS content cannot be empty.", "error");
            return;
        }
        this.campaign.message = this.smsContent;

        if (this.scheduleMode === 'later') {
            if (!this.scheduledDateStr || !this.scheduledTimeStr) {
                this.toast.show("Please select both a date and time to schedule this campaign.", "error");
                return;
            }
            this.scheduledDate = `${this.scheduledDateStr}T${this.scheduledTimeStr}`;
        } else {
            this.scheduledDate = '';
        }

        const navState: any = { dataset: this.dataset, campaign: this.campaign, scheduledDate: this.scheduledDate };
        if (this.isEditMode) navState.autoUpdateOnly = true;
        else navState.autoSend = true;

        this.router.navigate(['/campaigns-form'], { state: navState });
    }

    async deleteCampaign() {
        if (!this.campaign || !this.campaign._id) return;
        if (await this.toast.confirm("Are you sure you want to completely delete this campaign?")) {
            this.campaignService.deleteHistory(this.campaign._id).subscribe({
                next: () => {
                    this.toast.show("Campaign deleted.", "info");
                    this.router.navigate(['/campaigns-form']);
                },
                error: () => this.toast.show("Failed to delete campaign.", "error")
            });
        }
    }
}
