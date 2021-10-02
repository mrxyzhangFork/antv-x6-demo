// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/Users/sunpanyu/Desktop/workFiles/x6-study/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": require('@/pages/X6/index').default,
    "exact": true
  },
  {
    "path": "/dnd",
    "component": require('@/pages/examples/Dnd').default,
    "exact": true
  },
  {
    "path": "/test",
    "component": require('@/pages/test').default,
    "exact": true
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
