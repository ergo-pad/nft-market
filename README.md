This is a template to quickly create a NextJS site with MUI using Typescript

## Features

- Build in Next links with MUI styling. Also works for MUI Buttons. This means internal links will transition smoothly with no page refresh
- Using `theme.palette` colors will change automatically with dark & light themes when using themeContext
- Built in dark/light mode toggle switch and appropriate themes located in one theme.ts file
- Premade AppBar with mobile nav and alignment options
- Premade Footer with variants
- Typography variant formatting, and other components such as blockquotes
- In-page nav menu for specific sections
- 404 page
- path definitions, no more `../../../spaghetti`
- Page template, component template
- Framer motion full-page animations built in, and support for component animations

## Getting Started

First, install dependencies

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.