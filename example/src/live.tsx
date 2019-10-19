import * as React from 'react';
import { LiveProvider, LiveEditor, LivePreview } from 'react-live';
import styled from 'styled-components';

const StyledLiveProvider = styled(LiveProvider)`
  flex: 1;
  max-height: calc(100vh - 74px);
  overflow: auto;
  display: flex;
  justify-content: ${props => (props.scope ? 'center' : 'flex-start')};
  background-color: ${props => (props.scope ? 'none' : '#F4F1E8')};
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
}

export const Live: React.StatelessComponent<Props> = ({
  raw,
  scope,
  preview
}) => (
  <StyledLiveProvider code={raw} noInline={true} scope={scope}>
    <StyledEditor contentEditable={false} />
    {preview && <LivePreview />}
  </StyledLiveProvider>
);
