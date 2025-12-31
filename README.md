<div align="center">

# 📊 Dashboard Analytics App

A modern, feature-rich analytics dashboard built with React 19, TypeScript, and Tailwind CSS.  
Real-time data visualization, interactive charts, and comprehensive reporting tools.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 📈 Analytics & Visualization
- **Interactive Charts** — Area, Bar, Line, and Pie charts powered by Recharts
- **KPI Cards** — Real-time metrics with sparkline trend indicators
- **Growth Indicators** — Visual trend analysis with percentage changes
- **Trend Analysis** — Historical data comparison and forecasting

### 💰 Sales Management
- **Sales Dashboard** — Comprehensive sales metrics and performance tracking
- **Advanced Tables** — Sortable, filterable data tables with search functionality
- **Top Products** — Best-performing products with revenue breakdown
- **Category Analysis** — Sales distribution across product categories

### 👥 User & Performance Tracking
- **User Statistics** — Detailed user activity and engagement metrics
- **Leaderboard** — Top performers with sparkline visualizations
- **Team Performance** — Department-wise performance comparison
- **User Comparison** — Side-by-side user metrics analysis

### 🔴 Real-time Updates
- **Live Data Simulation** — Auto-updating metrics and charts
- **Activity Feed** — Real-time event stream with animations
- **Notification Center** — Alerts for important changes and milestones
- **Auto-refresh Toggle** — Configurable refresh intervals (5s, 10s, 30s, 60s)
- **Last Updated Timestamp** — Always know when data was refreshed

### 📤 Export & Reporting
- **CSV Export** — Export tables and data to CSV format
- **JSON Export** — Full data export in JSON format
- **PDF Generation** — Print-ready reports with charts
- **Print-friendly Styles** — Optimized layouts for printing

### 🎨 User Experience
- **Dark/Light Mode** — Theme switching with system preference detection
- **Responsive Design** — Optimized for desktop, tablet, and mobile
- **Keyboard Navigation** — Full keyboard accessibility support
- **ARIA Labels** — Screen reader compatible
- **Error Boundaries** — Graceful error handling with recovery options
- **Empty States** — Informative placeholders when no data available
- **Loading Skeletons** — Smooth loading experience

### ⚡ Performance
- **React.memo** — Optimized component re-rendering
- **Lazy Loading** — Code splitting for faster initial load
- **React Query** — Intelligent data caching and synchronization
- **Zustand** — Lightweight state management

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19.2 |
| **Language** | TypeScript 5.9 |
| **Build Tool** | Vite 7.2 |
| **Styling** | Tailwind CSS 3.4 |
| **State Management** | Zustand 5.0 |
| **Data Fetching** | TanStack React Query 5.9 |
| **Charts** | Recharts 3.5 |
| **Icons** | Lucide React |
| **Routing** | React Router DOM 7.10 |
| **Linting** | ESLint 9 + Prettier |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx         # Button variants
│   │   ├── Card.tsx           # Card container
│   │   ├── Input.tsx          # Form inputs
│   │   ├── Select.tsx         # Dropdown select
│   │   ├── Badge.tsx          # Status badges
│   │   ├── Avatar.tsx         # User avatars
│   │   ├── Tooltip.tsx        # Hover tooltips
│   │   ├── Skeleton.tsx       # Loading skeletons
│   │   ├── EmptyState.tsx     # Empty data states
│   │   ├── ErrorBoundary.tsx  # Error handling
│   │   ├── ExportButton.tsx   # Export dropdown
│   │   ├── ExportModal.tsx    # Export options modal
│   │   └── LoadingSpinner.tsx # Loading indicator
│   │
│   ├── charts/                # Chart components
│   │   ├── AreaChartComponent.tsx
│   │   ├── BarChartComponent.tsx
│   │   ├── LineChartComponent.tsx
│   │   ├── PieChartComponent.tsx
│   │   ├── SparklineChart.tsx
│   │   ├── InteractiveAreaChart.tsx
│   │   ├── InteractiveBarChart.tsx
│   │   ├── InteractivePieChart.tsx
│   │   ├── ChartCard.tsx
│   │   ├── ChartTooltip.tsx
│   │   └── ChartLegend.tsx
│   │
│   ├── dashboard/             # Dashboard components
│   │   ├── MetricCard.tsx
│   │   ├── KPICard.tsx
│   │   ├── GrowthIndicator.tsx
│   │   ├── TrendAnalysisCard.tsx
│   │   ├── SalesTable.tsx
│   │   ├── TopProductsTable.tsx
│   │   ├── TopPerformers.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── UserStatsCard.tsx
│   │   ├── UserComparisonTable.tsx
│   │   ├── TeamPerformanceCard.tsx
│   │   ├── ActivityFeed.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── LiveIndicator.tsx
│   │   ├── AutoRefreshToggle.tsx
│   │   ├── FilterBar.tsx
│   │   └── FilterPills.tsx
│   │
│   └── layout/                # Layout components
│       ├── Layout.tsx
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
│
├── pages/                     # Page components
│   ├── Dashboard.tsx          # Main dashboard
│   ├── Analytics.tsx          # Analytics page
│   ├── Sales.tsx              # Sales page
│   ├── Users.tsx              # Users page
│   ├── Performance.tsx        # Performance page
│   ├── Reports.tsx            # Reports page
│   ├── Settings.tsx           # Settings page
│   └── Help.tsx               # Help page
│
├── hooks/                     # Custom React hooks
│   ├── useDashboardData.ts    # Dashboard data fetching
│   ├── useSalesData.ts        # Sales data fetching
│   ├── useUserData.ts         # User data fetching
│   ├── useRealTimeData.ts     # Real-time updates
│   ├── useTheme.ts            # Theme management
│   └── useFilterSync.ts       # Filter synchronization
│
├── services/                  # API services
│   ├── api.ts                 # API client
│   ├── dashboardService.ts    # Dashboard API
│   ├── salesService.ts        # Sales API
│   ├── userService.ts         # User API
│   └── mockData.ts            # Mock data generators
│
├── store/                     # Zustand stores
│   ├── dashboardStore.ts      # Dashboard state
│   ├── filterStore.ts         # Filter state
│   ├── realtimeStore.ts       # Real-time state
│   └── themeStore.ts          # Theme state
│
├── types/                     # TypeScript types
│   ├── dashboard.ts           # Dashboard types
│   ├── chart.ts               # Chart types
│   └── api.ts                 # API types
│
├── utils/                     # Utility functions
│   ├── formatters.ts          # Number/date formatters
│   ├── helpers.ts             # General helpers
│   ├── dateHelpers.ts         # Date utilities
│   ├── dataHelpers.ts         # Data manipulation
│   └── exportHelpers.ts       # Export utilities
│
└── lib/                       # Library configurations
    └── queryClient.ts         # React Query setup
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0+ or **yarn** 1.22+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/dashboard-analytics-app.git

# Navigate to project directory
cd dashboard-analytics-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at **http://localhost:5173**

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript type checking |

---

## 🎨 Theming

The application supports **dark** and **light** themes with CSS custom properties.

### Theme Variables

```css
:root {
  --color-primary    /* Primary brand color */
  --color-success    /* Success/positive states */
  --color-warning    /* Warning states */
  --color-danger     /* Error/danger states */
  --bg-primary       /* Main background */
  --bg-secondary     /* Secondary background */
  --bg-card          /* Card backgrounds */
  --text-primary     /* Primary text */
  --text-secondary   /* Secondary text */
  --border-color     /* Border colors */
}
```

### Toggle Theme

Click the theme toggle in the header or use keyboard shortcut to switch between modes.

---

## 📊 Pages Overview

| Page | Description |
|------|-------------|
| **Dashboard** | Main overview with KPIs, charts, and activity feed |
| **Analytics** | Detailed analytics with trend analysis and comparisons |
| **Sales** | Sales metrics, tables, and category breakdowns |
| **Users** | User statistics, activity charts, and search |
| **Performance** | User comparison tables, leaderboards, and team metrics |
| **Reports** | Generate and export reports in multiple formats |
| **Settings** | Application preferences and configurations |
| **Help** | Documentation and support resources |

---

## ♿ Accessibility

This application follows **WCAG 2.1** guidelines:

- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader compatibility
- ✅ Sufficient color contrast
- ✅ Skip navigation links

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Dashboard Analytics
VITE_ENABLE_MOCK=true
```

### Customization

- **Colors**: Edit `tailwind.config.js` and `src/index.css`
- **Charts**: Modify theme in `src/components/charts/chartTheme.ts`
- **Mock Data**: Adjust generators in `src/services/mockData.ts`

---

## 📈 Performance Optimizations

- **Code Splitting** — Lazy loading for route-based components
- **Memoization** — React.memo for expensive components
- **Query Caching** — React Query for efficient data management
- **Virtual Lists** — Efficient rendering for large datasets
- **Image Optimization** — Lazy loading and compression
- **Bundle Analysis** — Tree shaking and dead code elimination

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Run `npm run lint` before committing
- Write meaningful commit messages
- Add tests for new features

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

[⬆ Back to Top](#-dashboard-analytics-app)

</div>
