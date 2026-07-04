import React from 'react';
import { renderToString } from 'react-dom/server';

async function run() {
  const rh = await import('react-helmet-async');
  const HelmetProvider = rh.HelmetProvider || (rh as any).default?.HelmetProvider;
  const Helmet = rh.Helmet || (rh as any).default?.Helmet;
  const HelmetData = rh.HelmetData || (rh as any).default?.HelmetData;

  const helmetData = new HelmetData({});

  const app = (
    <HelmetProvider context={helmetData.context}>
      <Helmet>
        <title>My Title</title>
        <meta name="description" content="My Description" />
      </Helmet>
    </HelmetProvider>
  );

  renderToString(app);
  console.log(helmetData.context.helmet.title.toString());
  console.log(helmetData.context.helmet.meta.toString());
}

run();
