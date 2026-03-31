import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CampaignService } from '../../core/services/campaign';
import { ToastService } from '../../core/services/toast';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'email' | 'newsletter' | 'promo' | 'sms' | 'social';
  thumbnail: string;
  blocks: any[];
}

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './templates.html',
  styleUrls: ['./templates.scss']
})
export class TemplatesComponent {
  
  categories = ['All', 'Email', 'SMS', 'Promo', 'Newsletter'];
  selectedCategory = 'All';
  showCreateModal = false;

  templates: Template[] = [
    {
      id: 't-01',
      name: 'Welcome Series',
      description: 'A beautiful glassmorphic welcome email for new users.',
      category: 'email',
      thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&q=80',
      blocks: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80' },
        { type: 'text', content: 'Welcome to Velox! We are thrilled to have you.' },
        { type: 'button', text: 'Get Started', url: 'https://velox.com' }
      ]
    },
    {
      id: 't-02',
      name: 'Neumorphism Promo',
      description: 'Soft tactile UI design for exclusive subscriber discounts.',
      category: 'promo',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80',
      blocks: [
        { type: 'text', content: 'Huge Summer Sale!' },
        { type: 'divider' },
        { type: 'button', text: '50% OFF - Claim Now', url: 'https://velox.com/sale' }
      ]
    },
    {
      id: 't-03',
      name: 'Skeuomorphic Alert',
      description: 'Hyper-realistic button and alert templates.',
      category: 'newsletter',
      thumbnail: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=300&q=80',
      blocks: [
        { type: 'text', content: 'Important Account Update' },
        { type: 'button', text: 'View Secure Message', url: '#' },
        { type: 'text', content: 'If you did not request this, please ignore.' }
      ]
    },
    {
      id: 't-04',
      name: 'Quick Flash SMS',
      description: 'Urgent notification style SMS with deep-linked CTA.',
      category: 'sms',
      thumbnail: 'https://images.unsplash.com/photo-1512428559083-a401a3dd7d45?w=300&q=80',
      blocks: [
        { type: 'text', content: 'Velox: YOUR ORDER IS READY. View details here: https://vx.ly/a3j' }
      ]
    },
    {
      id: 't-05',
      name: 'OTP Verification',
      description: 'Clean SMS template for one-time passwords.',
      category: 'sms',
      thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=300&q=80',
      blocks: [
        { type: 'text', content: 'Your Velox code is: 482931. Valid for 5 mins.' }
      ]
    }
  ];

  get filteredTemplates() {
    if (this.selectedCategory === 'All') return this.templates;
    return this.templates.filter(t => t.category.toLowerCase() === this.selectedCategory.toLowerCase());
  }

  constructor(
    private router: Router,
    private campaignService: CampaignService,
    private toast: ToastService
  ) {}

  useTemplate(template: Template) {
    const isSms = template.category === 'sms';
    const builderRoute = isSms ? '/sms-builder' : '/email-builder';

    const newCampaign = {
      name: `Draft: ${template.name}`,
      subject: template.name,
      product: 'General',
      offer: 'None',
      blocks: template.blocks,
      template: { blocks: template.blocks }
    };
    
    // Auto-populate signals
    if (isSms) {
      this.campaignService.smsBlocks.set([...template.blocks]);
    } else {
      this.campaignService.emailBlocks.set([...template.blocks]);
    }
    
    this.router.navigate([builderRoute], {
      state: {
        campaign: newCampaign,
        dataset: { name: 'Demo Canvas List' },
        isEdit: true
      }
    });

    this.toast.show(`Loaded "${template.name}" into ${isSms ? 'SMS' : 'Email'} Canvas Builder`, 'success');
  }

  createBlank(type: 'email' | 'sms') {
    this.showCreateModal = false;
    const route = type === 'email' ? '/email-builder' : '/sms-builder';
    this.router.navigate([route]);
  }
}
