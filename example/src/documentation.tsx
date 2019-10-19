import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
const rawAPI = require('./API.md');

console.log(rawAPI);

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
