import { lazy } from 'react';

const Joblogs = lazy(
  () => import('./Joblogs' /* webpackChunkName: "channels" */)
);


export default Joblogs;
