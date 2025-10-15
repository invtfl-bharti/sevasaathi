# SevaSaathi

The SevaSaathi project is a Next.js TypeScript-based web app built to connect volunteers with social causes. It includes authentication, an event listing system, and an admin dashboard. It uses Tailwind CSS for styling and Prisma with PostgreSQL for data management. The default README only has the basic Next.js boilerplate, so here’s a more detailed README you can use:


## 🧡 SevaSaathi

SevaSaathi is a platform designed to connect volunteers with nonprofit organizations and social initiatives. It simplifies the process of finding, joining, and managing volunteering opportunities.


## 🔧 Tech Stack

	•	Frontend: Next.js (App Router) + TypeScript
	•	Styling: Tailwind CSS
	•	Backend & ORM: Node.js + Prisma
	•	Database: PostgreSQL
	•	Authentication: NextAuth.js
	•	Deployment: Vercel (recommended)
## ✨Key Features

	•	🧑‍🤝‍🧑 Volunteer onboarding & authentication
	•	🏢 Admin dashboard to manage causes and events
	•	📅 Event creation, listing, and volunteer registration
	•	🔔 Real-time feedback via UI notifications
	•	💾 PostgreSQL integration using Prisma ORM
	•	🎨 Clean and responsive UI with Tailwind
## Installation

1. Clone the Repo

```bash
git clone https://github.com/invtfl-yuvraj/sevasaathi.git
cd sevasaathi
```
2. Install Dependencies
```bash
npm install
# or
yarn install
```
3. Set Up Environment

Rename .env.sample to .env and update with your database URL and other secrets (e.g., for authentication).

4. Set Up the Database
```bash
npx prisma migrate dev --name init
```

5. Run the Dev Server
```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 to see it in action.
## Folder Structure
```bash
├── src
│   ├── app           # App routes & layouts
│   ├── components    # Reusable UI components
│   ├── lib           # Helper functions
│   ├── prisma        # Prisma schema & DB config
│   └── styles        # Global styles (Tailwind config)
```
## 🧪 Testing & Linting

	•	ESLint config included for code quality
	•	Prettier for consistent formatting
run:
 ```bash
 npm run lint
 ```
## 🤝 Contributing
```bash
Want to help improve SevaSaathi?
	1.	Fork the repo
	2.	Create a feature branch: git checkout -b feature/your-feature
	3.	Commit your changes
	4.	Push and create a PR!
    
```
## 📝 License
This project is licensed under the MIT License.
