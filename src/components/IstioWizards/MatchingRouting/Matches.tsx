import * as React from 'react';
import { Label } from 'patternfly-react';
import { style } from 'typestyle';

type Props = {
  matches: string[];
  onRemoveMatch: (match: string) => void;
};

const labelContainerStyle = style({
  marginTop: 5
});

const labelMatchStyle = style({});

class Matches extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const matches: any[] = this.props.matches.map((match, index) => (
      <span key={match + '-' + index}>
        <Label className={labelMatchStyle} type="primary" onRemoveClick={() => this.props.onRemoveMatch(match)}>
          {match}
        </Label>{' '}
      </span>
    ));
    return <div className={labelContainerStyle}>匹配选择: {matches.length > 0 ? matches : <b>匹配任何请求</b>}</div>;
  }
}

export default Matches;
