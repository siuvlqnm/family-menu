# Family Menu Web Application

A comprehensive web application for family meal planning, shopping list management, and nutrition tracking.

## Phase 1 Implementation

### Deployment Strategy
- Frontend: Cloudflare Pages
- Backend: Cloudflare Pages Functions
- Database: Cloudflare D1 (SQLite)
- API Framework: Hono.js
- ORM: Drizzle

### Phase 1 Features
1. User Management
   - Basic authentication (email/password)
   - Family group management

2. Recipe Management
   - CRUD operations for recipes
   - Ingredient and step management
   - Recipe search and filtering

3. Basic UI
   - Responsive design
   - Modern component library
   - Form handling and validation

## Requirements and Progress

### User Management
- [x] User registration and login system
- [x] Family group creation and management
- [ ] User profile management
- [ ] Family member roles and permissions
- [ ] Family group invitation system

### Recipe Management
- [x] Recipe creation with title, description, and category
- [x] Ingredient management with units and amounts
- [x] Step-by-step cooking instructions
- [x] Recipe categorization (main dish, side dish, etc.)
- [x] Recipe difficulty levels
- [x] Recipe search and filtering
- [ ] Recipe ratings and reviews
- [ ] Recipe sharing within family groups
- [ ] Recipe image upload and management
- [ ] Cooking time tracking
- [ ] Portion size adjustment

### Menu Planning
- [ ] Weekly/monthly menu planning
- [ ] Drag-and-drop menu builder
- [ ] Menu templates
- [ ] Menu sharing with family members
- [ ] Meal rotation suggestions
- [ ] Special diet and preference consideration

### Shopping List
- [ ] Automatic shopping list generation from menu
- [ ] Manual item addition to shopping list
- [ ] Item categorization by store sections
- [ ] Real-time list sharing and updates
- [ ] Price tracking
- [ ] List history

### Inventory Management
- [ ] Pantry inventory tracking
- [ ] Low stock alerts
- [ ] Expiration date tracking
- [ ] Automatic inventory updates from shopping
- [ ] Barcode scanning support

### Health and Nutrition
- [ ] Nutritional information display
- [ ] Dietary restriction management
- [ ] Calorie tracking
- [ ] Allergy alerts
- [ ] Nutritional goals tracking

### Additional Features
- [ ] Family gathering event planning
- [ ] Recipe cost calculation
- [ ] Shopping budget tracking
- [ ] Usage statistics and reports
- [ ] Data export/import
- [ ] Mobile responsiveness

## Completed Frontend Features

1. Authentication System
   - User registration page
   - Login page with email/password
   - Protected routes
   - Mock authentication for development

2. Recipe Management
   - Recipe creation form with dynamic ingredient list
   - Step-by-step instruction editor
   - Recipe categorization and difficulty selection
   - Recipe listing with search and filters
   - Recipe detail view

3. UI Components
   - Modern, responsive layout using Tailwind CSS
   - Form components with validation
   - Navigation system
   - Toast notifications
   - Loading states and error handling

4. Data Management
   - Client-side state management
   - Form handling with validation
   - Mock data for development

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod validation

### Backend
- Hono.js
- Cloudflare Pages Functions
- Cloudflare D1 (SQLite)
- Drizzle ORM
- JWT Authentication

## Project Structure

```
family-menu/
├── frontend/                # Next.js frontend project
│   ├── app/                # App Router directory
│   │   ├── (auth)/        # Authentication pages
│   │   ├── dashboard/     # User dashboard
│   │   ├── recipes/       # Recipe management
│   │   ├── menus/         # Menu planning
│   │   └── shopping-lists/# Shopping list management
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── styles/            # Global styles
│   └── types/             # TypeScript type definitions
├── functions/              # Cloudflare Pages Functions
│   ├── api/               # API endpoints
│   ├── db/                # Database schema and migrations
│   ├── middleware/        # API middleware
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
└── docs/                  # Project documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- Wrangler CLI (for Cloudflare development)
- SQLite (for local development)

### Development Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/family-menu.git
cd family-menu
```

2. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

3. Backend setup
```bash
cd functions
npm install
wrangler dev
```

4. Local database setup
```bash
wrangler d1 create family-menu-db
wrangler d1 execute family-menu-db --local --file=./db/schema.sql
```

## Deployment

1. Frontend deployment
```bash
cd frontend
npm run build
wrangler pages publish .next
```

2. Backend deployment
```bash
cd functions
wrangler deploy
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
