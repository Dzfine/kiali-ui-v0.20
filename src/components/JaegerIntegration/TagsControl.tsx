import * as React from 'react';
import { Button, Form, FormGroup, Popover, TextInput } from '@patternfly/react-core';
import { InfoAltIcon } from '@patternfly/react-icons';

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
              值应为{' '}
              <a rel="noopener noreferrer" href="https://brandur.org/logfmt" target="_blank">
                logfmt
              </a>{' '}
              格式。
              <ul>
                <li>用空格连接</li>
                <li>包含空白的值应该用引号括起来</li>
              </ul>
              <code>error=true db.statement="select * from User"</code>
            </>
          }
        >
          <>
            <Button variant="plain">
              <InfoAltIcon />
            </Button>
            例如http.status_code=200 error=true
          </>
        </Popover>
      </>
    );
  };

  render() {
    const { tags } = this.props;
    return (
      <Form isHorizontal={true}>
        <FormGroup label="标签" isRequired={true} fieldId="horizontal-form-name" helperText={this.tagsHelp()}>
          <TextInput value={tags} type="text" onChange={this.props.onChange} aria-label="tagsJaegerTraces" />
        </FormGroup>
      </Form>
    );
  }
}

export default TagsControl;
