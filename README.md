# Force Equals Assignment

This project is a Next.js application that provides a PDF-based Q&A interface. Follow the instructions below to download and run the project.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js) or yarn

## Download

Clone the repository from GitHub:

```bash
git clone https://github.com/CSroseX/force-equals-assignment.git
```

Then navigate to the project directory:

```bash
cd pdf-qa-app
```

## Installation

Install the project dependencies:

```bash
npm install
```

## Running the Project

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Production

Build the project for production:

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

- The project uses [Next.js](https://nextjs.org/).
- PDF parsing is done using the `pdf-parse` library.

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
