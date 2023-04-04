import { Content, Header, Page } from '@backstage/core-components';
import React from 'react';
import { SpaceliftStacks } from './SpaceliftStacks';

export const Spacelift = () => {
  return (
    <Page themeId="tool">
      <Header
        title="Spacelift"
        subtitle="Spacelift is a platform for building, deploying, and managing infrastructure."
      />
      <Content>
        <SpaceliftStacks />
      </Content>
    </Page>
  );
};
