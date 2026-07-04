import React from 'react';
import { renderToString } from 'react-dom/server';
import reactHelmetAsync from 'react-helmet-async';

const HelmetProvider = reactHelmetAsync.HelmetProvider || (reactHelmetAsync as any).default?.HelmetProvider;
const Helmet = reactHelmetAsync.Helmet || (reactHelmetAsync as any).default?.Helmet;

const ctx: any = {};
const app = React.createElement(
  HelmetProvider,
  { context: ctx },
  React.createElement(
    Helmet,
    null,
    React.createElement('title', null, 'My Title')
  )
);
renderToString(app);
console.log(ctx.helmet ? ctx.helmet.title.toString() : 'undefined');
