import * as React from 'react';
import { Button, Form, FormGroup, Popover, TextInput } from '@patternfly/react-core';
import { InfoAltIcon } from '@patternfly/react-icons';
import intl from '../../locales/KiwiInit';

interface TagsControlProps {
  disable?: boolean;
  tags?: string;
  onChange: (value: string) => void;
}

export class TagsControl extends React.PureComponent<TagsControlProps, {}> {
  constructor(props: TagsControlProps) {
    super(props);
  }

  tagsHelp = () => {
    return (
      <>
        <Popover
          position="right"
          bodyContent={
            <>
              {intl.get('tagsControl.contentHeader1')}{' '}
              <a rel="noopener noreferrer" href="https://brandur.org/logfmt" target="_blank">
                logfmt
              </a>{' '}
              {intl.get('tagsControl.contentHeader2')}
              <ul>
                <li>{intl.get('tagsControl.liContent1')}</li>
                <li>{intl.get('tagsControl.liContent2')}</li>
              </ul>
              <code>error=true db.statement="select * from User"</code>
            </>
          }
        >
          <>
            <Button variant="plain">
              <InfoAltIcon />
            </Button>
            {intl.get('tagsControl.tagsHelper')}
          </>
        </Popover>
      </>
    );
  };

  render() {
    const { tags } = this.props;
    return (
      <Form isHorizontal={true}>
        <FormGroup
          label={intl.get('tagsControl.tags')}
          isRequired={true}
          fieldId="horizontal-form-name"
          helperText={this.tagsHelp()}
        >
          <TextInput value={tags} type="text" onChange={this.props.onChange} aria-label="tagsJaegerTraces" />
        </FormGroup>
      </Form>
    );
  }
}

export default TagsControl;
