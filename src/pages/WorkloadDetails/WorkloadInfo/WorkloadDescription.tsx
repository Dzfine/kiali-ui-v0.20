import * as React from 'react';
import { Col, Row } from 'patternfly-react';
import PfInfoCard from '../../../components/Pf/PfInfoCard';
import { Workload, WorkloadIcon } from '../../../types/Workload';
import LocalTime from '../../../components/Time/LocalTime';
import { DisplayMode, HealthIndicator } from '../../../components/Health/HealthIndicator';
import { WorkloadHealth } from '../../../types/Health';
import { runtimesLogoProviders } from '../../../config/Logos';
import Labels from '../../../components/Label/Labels';
import { CytoscapeGraphSelectorBuilder } from '../../../components/CytoscapeGraph/CytoscapeGraphSelector';

type WorkloadDescriptionProps = {
  workload: Workload;
  namespace: string;
  istioEnabled: boolean;
  health?: WorkloadHealth;
};

type WorkloadDescriptionState = {};

class WorkloadDescription extends React.Component<WorkloadDescriptionProps, WorkloadDescriptionState> {
  constructor(props: WorkloadDescriptionProps) {
    super(props);
    this.state = {};
  }

  renderLogo(name: string, idx: number): JSX.Element {
    const logoProvider = runtimesLogoProviders[name];
    if (logoProvider) {
      return <img key={'logo-' + idx} src={logoProvider()} alt={name} title={name} />;
    }
    return <span key={'runtime-' + idx}>{name}</span>;
  }

  showOnGraphLink(workloadName: string, namespace: string) {
    return `/graph/namespaces?graphType=workload&injectServiceNodes=true&unusedNodes=true&focusSelector=${encodeURI(
      new CytoscapeGraphSelectorBuilder()
        .workload(workloadName)
        .namespace(namespace)
        .build()
    )}`;
  }

  render() {
    const workload = this.props.workload;
    const isTemplateLabels =
      workload &&
      ['Deployment', 'ReplicaSet', 'ReplicationController', 'DeploymentConfig', 'StatefulSet'].indexOf(workload.type) >=
        0;
    return workload ? (
      <PfInfoCard
        iconType="pf"
        iconName={WorkloadIcon}
        title={workload.name}
        istio={this.props.istioEnabled}
        showOnGraphLink={this.showOnGraphLink(this.props.workload.name, this.props.namespace)}
        items={
          <Row>
            <Col xs={12} sm={8} md={6} lg={6}>
              <div className="progress-description">
                <strong>{isTemplateLabels ? '模板标签' : '标签'}</strong>
              </div>
              <div className="label-collection">
                <Labels labels={workload.labels} />
              </div>
              <div>
                <strong>类型：</strong> {workload.type ? workload.type : ''}
              </div>
              <div>
                <strong>创建时间：</strong> <LocalTime time={workload.createdAt} />
              </div>
              <div>
                <strong>资源版本：</strong> {workload.resourceVersion}
              </div>
              {workload.runtimes.length > 0 && (
                <div>
                  <br />
                  {workload.runtimes
                    .filter(r => r.name !== '')
                    .map((rt, idx) => this.renderLogo(rt.name, idx))
                    .reduce(
                      (list: JSX.Element[], elem) => (list ? [...list, <span key="sep"> | </span>, elem] : [elem]),
                      undefined
                    )}
                </div>
              )}
            </Col>
            <Col xs={12} sm={4} md={3} lg={3} />
            <Col xs={12} sm={4} md={3} lg={3}>
              <div className="progress-description">
                <strong>健康状况</strong>
              </div>
              <HealthIndicator
                id={workload.name}
                health={this.props.health}
                mode={DisplayMode.LARGE}
                tooltipPlacement="left"
              />
            </Col>
          </Row>
        }
      />
    ) : (
      'Loading'
    );
  }
}

export default WorkloadDescription;
