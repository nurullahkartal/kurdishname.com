import React from 'react';
import { renderToString } from 'react-dom/server';

async function run() {
  const rh = await import('react-helmet-async');
  const HelmetProvider = rh.HelmetProvider || (rh as any).default?.HelmetProvider;
  const Helmet = rh.Helmet || (rh as any).default?.Helmet;
  const HelmetData = rh.HelmetData || (rh as any).default?.HelmetData;

  const helmetData = new HelmetData({});

  const app = React.createElement(
    HelmetProvider,
    { context: helmetData.context },
    React.createElement(
      Helmet,
      null,
      React.createElement('title', null, 'My Title'),
      React.createElement('meta', { name: 'description', content: 'My Desc' })
    )
  );

  renderToString(app);
  console.log('TITLE:', helmetData.context.helmet.title.toString());
  console.log('META:', helmetData.context.helmet.meta.toString());
}

run();
