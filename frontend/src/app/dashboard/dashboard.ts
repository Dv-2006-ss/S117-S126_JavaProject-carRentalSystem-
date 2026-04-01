import { Component, HostListener, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  userName = 'User';
  scrollProgress = signal<number>(0);
  
  // Mouse Parallax Signals
  mouseX = signal<number>(0);
  mouseY = signal<number>(0);

  companyTarget = 'Velox Enterprise';

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.userName = user.name.split(' ')[0];
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Smooth progress for hero
    const progress = Math.min(scrollOffset / 800, 1);
    this.scrollProgress.set(progress);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // Normalize mouse position (-0.5 to 0.5)
    const x = (event.clientX / window.innerWidth) - 0.5;
    const y = (event.clientY / window.innerHeight) - 0.5;
    
    this.mouseX.set(x);
    this.mouseY.set(y);
  }

  onBuildClick() {
    this.router.navigate(['/campaigns-form']);
  }
}
