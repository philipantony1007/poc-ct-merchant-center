import { actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';

export const fetchMessageBodyObject = async (dispatch: any) => {
  try {
    const result = await dispatch(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        service: 'customObjects',
        options: {
          id: 'cron-job-log',
        },
      })
    ) as any;

    return result.results;
  } catch (error) {
    console.error('Error fetching custom objects:', error);
    throw error;
  }
};

