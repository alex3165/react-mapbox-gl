import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
const rawAPI = require('raw-loader!../../docs/API.md');

const Container = styled.div`
  max-width: 900px;
  margin: auto;
`;

const Documentation = () => (
  <Container>
    <ReactMarkdown source={rawAPI}/>
  </Container>
);

export default Documentation;
