import React, { useState, useEffect } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { spaceliftApiRef, SpaceliftApi } from '../api/spaceliftApi';
import { Table, TableColumn } from '@backstage/core-components';
import { Link } from '@material-ui/core';
import { Chip } from '@material-ui/core';
import { SpaceliftRuns } from './SpaceliftRuns';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { getStatusColor } from '../utils/status';

type ProjectData = {
  id: string;
  name: string;
  description: string;
  apiHost: string;
  namespace: string;
  repository: string;
  branch: string;
  state: string;
  url?: string;
};

export const SpaceliftStacks = () => {
  const spaceliftApi = useApi<SpaceliftApi>(spaceliftApiRef);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedStack, setSelectedStack] = useState<string | null>(null);
  const [stackUrl, setStackUrl] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const columns: TableColumn<ProjectData>[] = [
    {
      title: 'Name',
      field: 'name',
      render: (rowData: ProjectData) => (
        <Link
          component="button"
          variant="body2"
          onClick={() => {
            setSelectedStack(rowData.id);
            setStackUrl(rowData.url || null);
            setDialogOpen(true);
          }}
        >
          {rowData.name}
        </Link>
      ),
    },
    {
      title: 'Spacelift Url',
      field: 'url',
      render: (rowData: ProjectData) => (
        <Link
          href={rowData.url ? `${rowData.url}/stack/${rowData.id}` : ''}
          target="_blank"
          rel="noopener noreferrer"
        >
          {rowData.url ? `${rowData.url}/stack/${rowData.id}` : ''}
        </Link>
      ),
    },
    { title: 'Description', field: 'description' },
    {
      title: 'Source',
      field: 'repository',
      render: (rowData: ProjectData) => (
        <Link
          href={`${rowData.apiHost}/${rowData.namespace}/${rowData.repository}/tree/${rowData.branch}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {rowData.repository}
        </Link>
      ),
    },
    {
      title: 'Status',
      field: 'state',
      render: (rowData: ProjectData) => {
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
    async function fetchProjects() {
      setLoading(true);
      const response = await spaceliftApi.getProjects();
      const url = await spaceliftApi.getUrl();
      const projectsWithUrls = response.map(project => {
        return { ...project, url };
      });
      setProjects(projectsWithUrls);
      setLoading(false);
    }

    fetchProjects();
  }, [spaceliftApi]);

  return (
    <div>
      <Table
        title="Stacks"
        isLoading={loading}
        options={{
          search: true,
          paging: true,
          pageSize: 5,
        }}
        columns={columns}
        data={projects}
        style={{
          margin: 20,
          width: '100%',
        }}
      />
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Spacelift</DialogTitle>
        <DialogContent>
          {selectedStack && (
            <SpaceliftRuns stackId={selectedStack} url={stackUrl || ''} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
