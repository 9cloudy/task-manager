# Task manager

Task manager is an productive web app built with with **Next.js** and **mongoDB**, designed to provide manage tasks and contribute to overall productivity

## Features

- user can create delete read and update tasks

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/9cloudy/task-manager.git
   cd task-manager
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory with your own mongoDB url.
   ```env
   DB_URL=""
   ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Deployment

To deploy Max.AI, use a cloud hosting provider that supports Next.js and PostgreSQL, such as **Vercel** or **Railway**.