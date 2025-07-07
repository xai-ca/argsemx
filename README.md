# Argumentation Framework Visualization

Interactive web application for visualizing argumentation framework extensions.

## Quick Start

### 1. Setup Conda Environment

\`\`\`bash
# Create conda environment
conda create -n argsemx python=3.11 nodejs=18

# Activate environment
conda activate argsemx

# Install pnpm
npm install -g pnpm
\`\`\`

### 2. Install & Run

\`\`\`bash
# Clone and setup
git clone <repository-url>
cd argsemx

# Install dependencies
pnpm install

# Start development server
pnpm dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## Available Commands

- `pnpm dev` - Development server with hot reload
- `pnpm build` - Production build
- `pnpm start` - Production server

## Tech Stack

- Next.js 15 + React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
