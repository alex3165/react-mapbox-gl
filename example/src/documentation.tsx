import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import raw from 'raw.macro';

const rawAPI = raw('./API.md.raw');

const Container = styled.div`
  max-width: 900px;
  margin: auto;
`;

const Documentation = () => (
  <Container>
    <ReactMarkdown source={rawAPI} />
  </Container>
);

export default Documentation;
