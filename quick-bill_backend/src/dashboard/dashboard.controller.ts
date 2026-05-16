import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('sales-chart')
  getSalesChart() {
    return this.dashboardService.getSalesChart();
  }

  @Get('top-products')
  getTopProducts() {
    return this.dashboardService.getTopProducts();
  }

  @Get('insights')
  getInsights() {
    return this.dashboardService.getInsights();
  }
}
