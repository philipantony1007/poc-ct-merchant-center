import { actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';


export const fetchAllCustomerGroups = async (dispatch: any) => {
    try {
        // Fetch all customer groups
        const result = await dispatch(
            actions.get({
                mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
                service: 'customerGroups',
                options: {},
            })
        ) as any;

        const customerGroups = result.results;

        // For each customer group, fetch the customer count
        const customerGroupsWithCounts = await Promise.all(
            customerGroups.map(async (group: any) => {
                try {
                    const customerResult = await dispatch(
                        actions.get({
                            mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
                            service: 'customers',
                            options: {
                                id: `?where=customerGroup(id="${group.id}")`,
                            },
                        })
                    ) as any;

                    return {
                        ...group,
                        customerCount: customerResult.total, // Add customer count for each group
                    };
                } catch (error) {
                    console.error(`Failed to fetch customers for group ${group.id}:`, error);
                    return { ...group, customerCount: 0 }; // Set count to 0 if error occurs
                }
            })
        );

        // Calculate total users count across all customer groups
        const totalUsersCount = customerGroupsWithCounts.reduce(
            (sum, group) => sum + group.customerCount,
            0
        );

        // Fetch total count of all users (customers)
        const totalResult = await dispatch(
            actions.get({
                mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
                service: 'customers',
                options: {},
            })
        ) as any;

        const totalCountOfUsers = totalResult.total; // Get the total customer count

        // Calculate remaining customers (those not part of any group)
        const remainingCustomers = totalCountOfUsers - totalUsersCount;

        // Prepare data for pie chart in the required format
        const pieChartData = customerGroupsWithCounts.map((group: any) => ({
            name: group.name, // Group name (e.g., Premium, Elite, etc.)
            value: group.customerCount, // Customer count for the group
        }));

        // Add the "Other" category for remaining customers
        pieChartData.push({
            name: 'Other',
            value: remainingCustomers, // Remaining customers, not in any group
        });

        // Log the pie chart data for debugging
        console.log('Pie Chart Data:', pieChartData);

        return {
            customerGroupsWithCounts,
            totalUsersCount,
            totalCountOfUsers,
            remainingCustomers, // This is the remaining number of customers
            pieChartData, // Return the pie chart data
        };
    } catch (error) {
        console.error('Error fetching customer groups:', error);
        throw error;
    }
};


