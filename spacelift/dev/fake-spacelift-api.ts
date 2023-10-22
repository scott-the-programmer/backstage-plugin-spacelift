import { SpaceliftApi } from '../src/api/spaceliftApi';

export class FakeSpaceliftApi implements SpaceliftApi {
  async getProjects(): Promise<any[]> {
    return [
      {
        id: '1',
        name: 'Datastores',
        description: 'Stateful stack',
        apiHost: 'https://github.com',
        namespace: 'user',
        repository: 'terraform-datastores',
        branch: 'main',
        state: 'FINISHED',
      },
      {
        id: '2',
        name: 'Web Services',
        description: 'Web services stack',
        apiHost: 'https://github.com',
        namespace: 'user',
        repository: 'terraform-web-services',
        branch: 'main',
        state: 'FAILED',
      },
      {
        id: '3',
        name: 'Background Services',
        description: 'Background services stack',
        apiHost: 'https://github.com',
        namespace: 'user',
        repository: 'terraform-background-services',
        branch: 'main',
        state: 'IN_PROGRESS',
      },
    ];
  }

  async getUrl(): Promise<string> {
    return 'https://domain.app.spacelift.io';
  }

  async getRuns(stackId: string): Promise<any[]> {
    const runsData: Record<string, any[]> = {
      '1': [
        {
          id: '11',
          branch: 'main',
          state: 'FINISHED',
          createdAt: 1677649421,
          commit: {
            url: 'https://github.com/user/project-1/commit/abcdef1',
            authorName: 'John Doe',
            timestamp: 1677649321,
            hash: 'abcdef1',
          },
          url: 'https://fakespacelifturl.com/stack/1/run/11',
        },
        {
          id: '12',
          branch: 'main',
          state: 'DISCARDED',
          createdAt: 1677648421,
          commit: {
            url: 'https://github.com/user/project-1/commit/abcdef2',
            authorName: 'Jane Doe',
            timestamp: 1677648321,
            hash: 'abcdef2',
          },
          url: 'https://fakespacelifturl.com/stack/1/run/12',
        },
        {
          id: '14',
          branch: 'main',
          state: 'FINISHED',
          createdAt: 1677648421,
          commit: {
            url: 'https://github.com/user/project-1/commit/abcdef2',
            authorName: 'Jane Doe',
            timestamp: 1677648321,
            hash: 'abcdef3',
          },
          url: 'https://fakespacelifturl.com/stack/1/run/12',
        },
        {
          id: '15',
          branch: 'main',
          state: 'DISCARDED',
          createdAt: 1677648421,
          commit: {
            url: 'https://github.com/user/project-1/commit/abcdef2',
            authorName: 'Jane Doe',
            timestamp: 1677648321,
            hash: 'abcdef4',
          },
          url: 'https://fakespacelifturl.com/stack/1/run/12',
        },
        {
          id: '16',
          branch: 'main',
          state: 'FINISHED',
          createdAt: 1677648421,
          commit: {
            url: 'https://github.com/user/project-1/commit/abcdef2',
            authorName: 'Jane Doe',
            timestamp: 1677648321,
            hash: 'abcdef5',
          },
          url: 'https://fakespacelifturl.com/stack/1/run/12',
        },
      ],
      '2': [
        {
          id: '21',
          branch: 'main',
          state: 'FAILED',
          createdAt: 1677647421,
          commit: {
            url: 'https://github.com/user/project-2/commit/abcdef3',
            authorName: 'Alice',
            timestamp: 1677647321,
            hash: 'abcdef3',
          },
          url: 'https://fakespacelifturl.com/stack/2/run/21',
        },
        {
          id: '22',
          branch: 'main',
          state: 'FINISHED',
          createdAt: 1677646421,
          commit: {
            url: 'https://github.com/user/project-2/commit/abcdef4',
            authorName: 'Bob',
            timestamp: 1677646321,
            hash: 'abcdef4',
          },
          url: 'https://fakespacelifturl.com/stack/2/run/22',
        },
      ],
      '3': [
        {
          id: '32',
          branch: 'main',
          state: 'IN_PROGRESS',
          createdAt: 1677647421,
          commit: {
            url: 'https://github.com/user/project-2/commit/abcdef3',
            authorName: 'Alice',
            timestamp: 1677647321,
            hash: 'abcdef3',
          },
          url: 'https://fakespacelifturl.com/stack/2/run/21',
        },
        {
          id: '32',
          branch: 'main',
          state: 'FINISHED',
          createdAt: 1677646421,
          commit: {
            url: 'https://github.com/user/project-2/commit/abcdef4',
            authorName: 'Bob',
            timestamp: 1677646321,
            hash: 'abcdef4',
          },
          url: 'https://fakespacelifturl.com/stack/2/run/22',
        },
      ],
    };

    return runsData[stackId] || [];
  }
}
