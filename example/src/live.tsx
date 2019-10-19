import * as React from 'react';
import { LiveProvider, LiveEditor, LivePreview } from 'react-live';
import styled from 'styled-components';

const Wrapper =
  // eslint-disable-next-line
  styled.div <
  { full: boolean } >
  `
  background-color: #363431;
  max-height: calc(100vh - 74px);
  display: ${props => (props.full ? 'block' : 'flex')};
  overflow: auto;
`;

const StyledEditor = styled(LiveEditor)`
  font-family: 'Source Code Pro', monospace;
  font-size: 13px;
  line-height: 18px;
`;

export interface Props {
  raw: string;
  // tslint:disable-next-line:no-any
  scope?: any;
  preview?: boolean;
  full: boolean;
}

export const Live: React.StatelessComponent<Props> = ({
  raw,
  scope,
  preview,
  full
}) => (
  <Wrapper full={full}>
    <LiveProvider code={raw} noInline={true} scope={scope}>
      <StyledEditor contentEditable={false} />
      {preview && <LivePreview />}
    </LiveProvider>
  </Wrapper>
);
