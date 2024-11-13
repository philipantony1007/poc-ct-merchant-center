import { useCallback, useEffect, useState, useMemo } from "react";
import { deleteAllCustomObjects, fetchMessageBodyObject } from "../../hooks/customobjects.hooks";
import { useAsyncDispatch } from '@commercetools-frontend/sdk';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DataTable from '@commercetools-uikit/data-table';
import DataTableManager from '@commercetools-uikit/data-table-manager';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { Pagination } from '@commercetools-uikit/pagination';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { RefreshIcon, ExportIcon } from '@commercetools-uikit/icons';
import LogsChart from "./LogsChart";
import HistoChart from "./JobTimeHistogram";

const ITEMS_PER_PAGE = 10;

interface LogValue {
  timestamp: string;
  status: 'success' | 'failed';
  message: string;
  details: {
    durationInMilliseconds: number;
    totalOrdersProcessed?: number;
    error?: string;
  };
}

interface LogEntry {
  id: string;
  key: string;
  container: string;
  value: LogValue;
}

const columns = [
  { key: 'date', label: 'Date', isSortable: true },
  { key: 'time', label: 'Time', isSortable: true },
  { key: 'status', label: 'Status', isSortable: true },
  { key: 'message', label: 'Message', isSortable: true },
  { key: 'duration', label: 'Duration (ms)', isSortable: true },
  { key: 'totalOrdersProcessed', label: 'Total Orders Processed', isSortable: true },
] as const;

type RowData = {
  id: string;
  date: string;
  time: string;
  status: string;
  message: string;
  duration: string;
  totalOrdersProcessed?: number;
};

const JobLogs = () => {
  const dispatch = useAsyncDispatch();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state variables for enhanced functionality
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(ITEMS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState<keyof RowData | 'all'>('all');
  const [filterValue, setFilterValue] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState<{ key: keyof RowData; order: 'asc' | 'desc' }>({
    key: 'date',
    order: 'desc'
  });

  const loadLogs = useCallback(async () => {
    try {
      const results = await fetchMessageBodyObject(dispatch);
      console.log(results);
      setLogs(results);
      setError(null);
    } catch (err) {
      console.error('Failed to load logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load logs.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const rows: RowData[] = useMemo(() => logs.map((log) => {
    const timestamp = new Date(log.value.timestamp);
    return {
      id: log.key,
      date: timestamp.toLocaleDateString(),
      time: timestamp.toLocaleTimeString(),
      status: log.value.status,
      message: log.value.message,
      duration: `${log.value.details.durationInMilliseconds}`,
      totalOrdersProcessed: log.value.status === 'success' ? log.value.details.totalOrdersProcessed : undefined, // Add condition for success
    };
  }), [logs]);

  const filteredRows = useMemo(() => {
    let filtered = [...rows];

    if (filterField === 'date' && dateFilter) {
      filtered = filtered.filter(row => row.date === new Date(dateFilter).toLocaleDateString());
    } else if (filterField === 'all' && searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    } else if (filterValue && filterField !== 'all') {
      const filterLower = filterValue.toLowerCase();
      filtered = filtered.filter(row =>
        String(row[filterField]).toLowerCase().includes(filterLower)
      );
    }

    return filtered;
  }, [rows, searchTerm, filterField, filterValue, dateFilter]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const aValue = String(a[sortBy.key]);
      const bValue = String(b[sortBy.key]);

      if (sortBy.order === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [filteredRows, sortBy]);

  const paginatedRows = useMemo(() =>
    sortedRows.slice((page - 1) * perPage, page * perPage),
    [sortedRows, page, perPage]
  );

  const handleColumnSort = useCallback((columnKey: keyof RowData) => {
    setSortBy(prevSort => ({
      key: columnKey,
      order: prevSort.key === columnKey && prevSort.order === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{error}</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <Spacings.Stack scale="xl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text.Headline as="h2">Cron Job Logs</Text.Headline>
        <div style={{ display: 'flex', gap: '8px' }}>
          <SecondaryButton
            iconLeft={<RefreshIcon />}
            label="Refresh"
            onClick={loadLogs}
          />
          {paginatedRows.length > 0 && (
            <SecondaryButton
              iconLeft={<ExportIcon />}
              label="Delete Log"
              onClick={() => deleteAllCustomObjects(dispatch)}
            />
          )}
        </div>
      </div>

      <DataTableManager columns={[...columns]}>
        <DataTable
          columns={Array.from(columns)} 
          rows={paginatedRows}
          sortedBy={sortBy.key}
          sortDirection={sortBy.order}
          onSortChange={handleColumnSort}
          itemRenderer={(item: RowData, column) => {
            const value = item[column.key as keyof RowData];
            if (column.key === 'status') {
              return <span style={{ color: value === 'failed' ? 'red' : 'green' }}>{value}</span>;
            }
            return value;
          }}
        />
      </DataTableManager>

      <Pagination
        page={page}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
        totalItems={filteredRows.length}
      />

      <Text.Headline as="h2">Success vs. Failure Distribution</Text.Headline>
      <LogsChart logs={logs} />

      <HistoChart logs={logs} />
    </Spacings.Stack>
  );
};

export default JobLogs;
