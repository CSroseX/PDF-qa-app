# PDF Q&A Platform

Production-ready PDF ingestion and retrieval-augmented generation (RAG) web application that indexes documents into vector embeddings and serves low-latency, context-aware question answering through a Next.js App Router frontend orchestrating OpenAI models.

<img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white&style=for-the-badge"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge"/> <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge"/> <img src="https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white&style=for-the-badge"/> <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&style=for-the-badge"/> <img src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white&style=for-the-badge"/>

Follow the instructions below to provision dependencies, bootstrap the environment, and run the service locally.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js) or yarn

## Download

Clone the repository from GitHub:

```bash
git clone https://github.com/CSroseX/pdf-qa-app.git
```

Then navigate to the project directory:

```bash
cd pdf-qa-app
```

## Installation

Install runtime and build-time dependencies:

```bash
npm install
```

## Running the Project

### Development

Launch the hot-reload development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Production

Build the project for production with optimized static assets and server bundles:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## Environment Variables

Create a `.env` file in the project root with the following variables (replace the keys with your own):

```properties
OPENAI_API_KEY=your_openai_api_key
API_SECRET_KEY=your_api_secret_key
NEXT_PUBLIC_API_SECRET_KEY=your_public_api_secret_key
```

## Additional Information

- Built with [Next.js](https://nextjs.org/) App Router to leverage server components and edge-ready deployments.
- PDF ingestion leverages `pdf-parse` to extract text for downstream embedding.
- Retrieval latency is minimized via precomputed embeddings and streamlined OpenAI completion calls.

Feel free to open an issue in the repository for any questions or problems.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
