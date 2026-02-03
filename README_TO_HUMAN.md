# ClawdMetrics Dashboard 👋

> **To Human**: A beautiful metrics dashboard for tracking leaderboard data with real-time updates.

## 🎯 What is ClawdMetrics?

ClawdMetrics is a modern, dark-themed dashboard built with Next.js that displays leaderboard metrics in real-time. It connects to your Supabase database to fetch and visualize ranking data.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase project with PostgreSQL database
- PostgreSQL function `get_leaderboard` created in your database

### Installation

```bash
# Clone the repository
git clone https://github.com/josecookai/clawdmetrics.git
cd clawdmetrics

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your dashboard.

## 📊 Features

- 📈 **Real-time Leaderboard**: Live data from Supabase PostgreSQL
- 🎨 **Dark Theme UI**: Beautiful, modern interface
- 📱 **Responsive Design**: Works on all devices
- 🔄 **Auto-refresh**: Automatically fetches latest data
- 📊 **Interactive Charts**: Powered by Tremor and Recharts

## 🏗️ Architecture

```
┌─────────────┐
│   Browser   │
│  (Next.js)  │
└──────┬──────┘
       │
       │ supabase.rpc()
       │
┌──────▼──────────┐
│   Supabase      │
│  PostgreSQL     │
│  RPC Function   │
└─────────────────┘
```

## 📝 User Flow

### 1. **Initial Load**
- User opens the dashboard
- App connects to Supabase
- Calls `get_leaderboard` PostgreSQL function
- Displays loading state

### 2. **Data Display**
- Leaderboard data fetched successfully
- Data rendered in:
  - **Bar Chart**: Visual representation of scores
  - **Table**: Detailed ranking information

### 3. **Error Handling**
- If connection fails → Shows error message
- If function missing → Clear error guidance
- If no data → Shows "暂无数据" message

## 🛠️ Development

### Project Structure

```
clawdmetrics/
├── app/
│   ├── page.tsx          # Main dashboard page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── lib/
│   └── supabaseClient.ts  # Supabase client configuration
└── skills/
    └── clawdmetrics/
        └── scripts/       # Utility scripts
```

### Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Supabase**: Backend-as-a-Service
- **Tremor**: UI component library
- **Recharts**: Chart library

## 📋 TODO List

### 🔴 High Priority

- [ ] **Database Setup**
  - [ ] Create `get_leaderboard` PostgreSQL function in Supabase
  - [ ] Set up proper database schema for leaderboard data
  - [ ] Configure RLS (Row Level Security) policies

- [ ] **Environment Configuration**
  - [ ] Set up Vercel environment variables
  - [ ] Verify Supabase credentials are correct
  - [ ] Test production deployment

### 🟡 Medium Priority

- [ ] **Features**
  - [ ] Add refresh button for manual data update
  - [ ] Add time range selector (7 days, 30 days, all time)
  - [ ] Add user search/filter functionality
  - [ ] Add export to CSV/JSON functionality

- [ ] **UI Improvements**
  - [ ] Add loading skeletons instead of simple text
  - [ ] Add animations for data updates
  - [ ] Improve mobile responsiveness
  - [ ] Add dark/light theme toggle

### 🟢 Low Priority

- [ ] **Performance**
  - [ ] Implement data caching
  - [ ] Add pagination for large datasets
  - [ ] Optimize chart rendering

- [ ] **Documentation**
  - [ ] Add API documentation
  - [ ] Create video tutorial
  - [ ] Write deployment guide

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🐛 Troubleshooting

### Common Issues

**"Invalid API key" error**
- Check environment variables in Vercel
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after changing environment variables

**"Function not found" error**
- Verify `get_leaderboard` function exists in Supabase
- Check function permissions for `anon` role

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more help.

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Supabase Function Guide](./SUPABASE_FUNCTION_GUIDE.md)
- [Vercel Environment Setup](./VERCEL_ENV_SETUP.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- UI components from [Tremor](https://www.tremor.so/)

---

**Made with ❤️ for tracking metrics**
