import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllCustomerGroups } from '../../hooks/customerGroup.hooks';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';

interface CustomerGroupData {
  name: string; // The group name
  customerCount: number; // The count of customers in the group
}

const CustomerGroup = () => {
  const dispatch = useDispatch();
  const [customerGroups, setCustomerGroups] = useState<CustomerGroupData[]>([]); // Typing the state as an array of CustomerGroupData
  const [, setTotalUsersCount] = useState(0); // Total users count in groups
  const [totalCountOfUsers, setTotalCountOfUsers] = useState(0); // Total count of all customers
  const [remainingCustomers, setRemainingCustomers] = useState(0); // Remaining customers (not in any group)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomerGroups = useCallback(async () => {
    try {
      const results = await fetchAllCustomerGroups(dispatch);
      setCustomerGroups(results.customerGroupsWithCounts); // Set customer groups with counts
      setTotalUsersCount(results.totalUsersCount); // Set total users count for groups
      setTotalCountOfUsers(results.totalCountOfUsers); // Set total count of all customers
      setRemainingCustomers(results.remainingCustomers); // Set remaining customers count
      setError(null);
    } catch (err) {
      console.error('Failed to load customer groups:', err);
      setError(err instanceof Error ? err.message : 'Failed to load customer groups.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadCustomerGroups();
  }, [loadCustomerGroups]);

  // Prepare data for the combined PieChart
  const pieChartData = customerGroups.map((group) => ({
    name: group.name, // Group name (e.g., Premium, Elite, etc.)
    value: group.customerCount, // Customer count for the group
  }));

  // Add the "Other" category for remaining customers
  pieChartData.push({
    name: 'Other',
    value: remainingCustomers, // Remaining customers, not in any group
  });

  // Color array for the PieChart slices
  const COLORS = ['#FF0000', '#0000FF', '#008000', '#fccb24', '#0a417a'];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Customer Segments</h1>
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh', // Full viewport height
          }}
        >
          <LoadingSpinner />
        </div>
      )}
      {error && <p>Error: {error}</p>}
      {!isLoading && !error && (
        <div>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', margin: '5px 0' }}>Total Users: {totalCountOfUsers}</p>
          </div>

          {/* Single Pie Chart for All Customer Groups */}
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {pieChartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CustomerGroup;
