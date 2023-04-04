import React, { useState, useEffect } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { spaceliftApiRef, SpaceliftApi } from '../api/spaceliftApi';
import { Table, TableColumn } from '@backstage/core-components';
import { Link, Chip } from '@material-ui/core';
import { getStatusColor } from '../utils/status';

type RunData = {
  id: string;
  branch: string;
  state: string;
  createdAt: number;
  commit: {
    url: string;
    authorName: string;
    timestamp: number;
    hash: string;
  };
  url: string;
};

interface SpaceliftRunsProps {
  stackId: string;
  url: string;
}

export const SpaceliftRuns: React.FC<SpaceliftRunsProps> = ({
  stackId,
  url,
}) => {
  const spaceliftApi = useApi<SpaceliftApi>(spaceliftApiRef);
  const [runs, setRuns] = useState<RunData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columns: TableColumn<RunData>[] = [
    {
      title: 'Run',
      field: 'createdAt',
      render: (rowData: RunData) => (
        <Link
          href={`${url}/stack/${stackId}/run/${rowData.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {new Date(rowData.createdAt * 1000).toLocaleString()}
        </Link>
      ),
    },
    { title: 'Branch', field: 'branch' },
    {
      title: 'Commit Hash',
      field: 'commit.hash',
      render: (rowData: RunData) => (
        <Link
          href={rowData.commit.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {rowData.commit.hash.slice(0, 7)}
        </Link>
      ),
    },
    { title: 'Commit Author', field: 'commit.authorName' },
    {
      title: 'Commit Timestamp',
      field: 'commit.timestamp',
      type: 'datetime',
      render: (rowData: RunData) =>
        new Date(rowData.commit.timestamp * 1000).toLocaleString(),
    },
    {
      title: 'Status',
      field: 'state',
      render: (rowData: RunData) => {
        const color = getStatusColor(rowData.state);
        return (
          <Chip
            label={rowData.state}
            style={{
              backgroundColor: color,
            }}
          />
        );
      },
    },
  ];

  useEffect(() => {
    async function fetchRuns() {
      setLoading(true);
      const response = await spaceliftApi.getRuns(stackId);
      setRuns(response);
      setLoading(false);
    }

    fetchRuns();
  }, [spaceliftApi, stackId]);

  return (
    <div>
      <Table
        title="Runs"
        isLoading={loading}
        options={{
          search: true,
          paging: true,
          pageSize: 5,
        }}
        columns={columns}
        data={runs}
      />
    </div>
  );
};
