import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'CT-ML-Integration',
  entryPointUriPath,
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: '${env:PROJECT_ID}',
    },
    production: {
      applicationId: '${env:APPLICATION_ID}',
      url: 'https://poc-ct-merchant-center.vercel.app',
    },
  },
  oAuthScopes: {
    view: [
      'view_products',
      'view_customers',         // Added scope for viewing customers
      'view_customer_groups',    // Added scope for viewing customer groups
    ],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/screen.svg}',
  mainMenuLink: {
    defaultLabel: 'Job Log',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'customer-segments',
      defaultLabel: 'Customer Segments',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
};

export default config;
