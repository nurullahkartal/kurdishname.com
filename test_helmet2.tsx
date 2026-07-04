import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider, Helmet, HelmetData } from 'react-helmet-async';

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
