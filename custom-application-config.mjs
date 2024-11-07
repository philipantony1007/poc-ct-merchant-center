import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Starter Typescript 225680',
  entryPointUriPath,
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: 'poc-ct-ml-integration',
    },
    production: {
      applicationId: 'TODO',
      url: 'https://your_app_hostname.com',
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
