import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import intl from '../../locales/KiwiInit';

interface RightToolbarProps {
  disabled: boolean;
  onSubmit: () => void;
}

const RightToolbar = (props: RightToolbarProps) => (
  <Button variant="primary" aria-label="SearchTraces" onClick={() => props.onSubmit()} isDisabled={props.disabled}>
    <SearchIcon /> {intl.get('rightToolbar.searchTrace')}
  </Button>
);
export default RightToolbar;
