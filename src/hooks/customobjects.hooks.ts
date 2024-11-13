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

export const deleteAllCustomObjects = async (dispatch: any) => {
  console.log('deleteAllCustomObjects');
  try {
      // Get all custom objects with type 'notifications'
      const result = await dispatch(
          actions.get({
              mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
              service: 'customObjects',
              options: {
                  id: 'cron-job-log',

              },
          })
      ) ;
      console.log(result);
      // Delete each custom object
      const deletePromises = result.results.map(async (obj: any) => {
          await dispatch(
              actions.del({
                  mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
                  service: 'customObjects',
                  options: {
                      container: obj.container,
                      key: obj.key,
                  },
              })
          );
      });

      await Promise.all(deletePromises);

  } catch (error) {
      console.error('Error deleting custom objects:', error);
      throw error;
  }
};