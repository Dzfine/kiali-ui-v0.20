import * as React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'patternfly-react';
import { Paths } from '../../config';

type Props = {
  name: string;
};

class OverviewCardLinks extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div style={{ marginTop: '10px' }}>
        <Link to={`/graph/namespaces?namespaces=` + this.props.name} title="图表">
          <Icon type="pf" name="topology" style={{ paddingLeft: 10, paddingRight: 10 }} />
        </Link>
        <Link to={`/${Paths.APPLICATIONS}?namespaces=` + this.props.name} title="应用列表">
          <Icon type="pf" name="applications" style={{ paddingLeft: 10, paddingRight: 10 }} />
        </Link>
        <Link to={`/${Paths.WORKLOADS}?namespaces=` + this.props.name} title="工作负载列表">
          <Icon type="pf" name="bundle" style={{ paddingLeft: 10, paddingRight: 10 }} />
        </Link>
        <Link to={`/${Paths.SERVICES}?namespaces=` + this.props.name} title="服务列表">
          <Icon type="pf" name="service" style={{ paddingLeft: 10, paddingRight: 10 }} />
        </Link>
        <Link to={`/${Paths.ISTIO}?namespaces=` + this.props.name} title="Istio配置列表">
          <Icon type="pf" name="template" style={{ paddingLeft: 10, paddingRight: 10 }} />
        </Link>
      </div>
    );
  }
}

export default OverviewCardLinks;
