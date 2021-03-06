import * as React from 'react';
import { Button, Wizard } from 'patternfly-react';
import { WorkloadOverview } from '../../types/ServiceInfo';
import * as API from '../../services/Api';
import * as MessageCenter from '../../utils/MessageCenter';
import MatchingRouting from './MatchingRouting';
import WeightedRouting, { WorkloadWeight } from './WeightedRouting';
import TrafficPolicyContainer from '../../components/IstioWizards/TrafficPolicy';
import { DISABLE, ROUND_ROBIN } from './TrafficPolicy';
import SuspendTraffic, { SuspendedRoute } from './SuspendTraffic';
import { Rule } from './MatchingRouting/Rules';
import {
  buildIstioConfig,
  getInitLoadBalancer,
  getInitRules,
  getInitSuspendedRoutes,
  getInitTlsMode,
  getInitWeights,
  WIZARD_MATCHING_ROUTING,
  WIZARD_SUSPEND_TRAFFIC,
  WIZARD_THREESCALE_INTEGRATION,
  WIZARD_TITLES,
  WIZARD_UPDATE_TITLES,
  WIZARD_WEIGHTED_ROUTING,
  WizardProps,
  WizardState
} from './IstioWizardActions';
import { Response } from '../../services/Api';
import { MessageType } from '../../types/MessageCenter';
import ThreeScaleIntegration from './ThreeScaleIntegration';
import { ThreeScaleServiceRule } from '../../types/ThreeScale';

class IstioWizard extends React.Component<WizardProps, WizardState> {
  constructor(props: WizardProps) {
    super(props);
    this.state = {
      showWizard: false,
      workloads: [],
      rules: [],
      suspendedRoutes: [],
      valid: true,
      mtlsMode: DISABLE,
      tlsModified: false,
      loadBalancer: ROUND_ROBIN,
      lbModified: false
    };
  }

  componentDidUpdate(prevProps: WizardProps) {
    if (prevProps.show !== this.props.show || !this.compareWorkloads(prevProps.workloads, this.props.workloads)) {
      let isValid: boolean;
      switch (this.props.type) {
        // By default the rule of Weighted routing should be valid
        case WIZARD_WEIGHTED_ROUTING:
          isValid = true;
          break;
        // By default no rules is a no valid scenario
        case WIZARD_MATCHING_ROUTING:
          isValid = false;
          break;
        case WIZARD_SUSPEND_TRAFFIC:
        default:
          isValid = true;
          break;
      }
      const initMtlsMode = getInitTlsMode(prevProps.destinationRules);
      const initLoadBalancer = getInitLoadBalancer(prevProps.destinationRules);
      this.setState({
        showWizard: this.props.show,
        workloads: [],
        rules: [],
        valid: isValid,
        mtlsMode: initMtlsMode !== '' ? initMtlsMode : DISABLE,
        loadBalancer: initLoadBalancer !== '' ? initLoadBalancer : ROUND_ROBIN
      });
    }
  }

  compareWorkloads = (prev: WorkloadOverview[], current: WorkloadOverview[]): boolean => {
    if (prev.length !== current.length) {
      return false;
    }
    for (let i = 0; i < prev.length; i++) {
      if (!current.includes(prev[i])) {
        return false;
      }
    }
    return true;
  };

  onClose = () => {
    this.setState({
      showWizard: false
    });
    this.props.onClose(false);
  };

  onCreateUpdate = () => {
    const promises: Promise<Response<string>>[] = [];
    switch (this.props.type) {
      case WIZARD_WEIGHTED_ROUTING:
      case WIZARD_MATCHING_ROUTING:
      case WIZARD_SUSPEND_TRAFFIC:
        const [dr, vs] = buildIstioConfig(this.props, this.state);
        if (this.props.update) {
          promises.push(
            API.updateIstioConfigDetail(this.props.namespace, 'destinationrules', dr.metadata.name, JSON.stringify(dr))
          );
          promises.push(
            API.updateIstioConfigDetail(this.props.namespace, 'virtualservices', vs.metadata.name, JSON.stringify(vs))
          );
        } else {
          promises.push(API.createIstioConfigDetail(this.props.namespace, 'destinationrules', JSON.stringify(dr)));
          promises.push(API.createIstioConfigDetail(this.props.namespace, 'virtualservices', JSON.stringify(vs)));
        }
        break;
      case WIZARD_THREESCALE_INTEGRATION:
        if (this.state.threeScaleServiceRule) {
          if (this.props.update) {
            promises.push(
              API.updateThreeScaleServiceRule(
                this.props.namespace,
                this.props.serviceName,
                JSON.stringify(this.state.threeScaleServiceRule)
              )
            );
          } else {
            promises.push(
              API.createThreeScaleServiceRule(this.props.namespace, JSON.stringify(this.state.threeScaleServiceRule))
            );
          }
        }
        break;
      default:
    }
    // Disable button before promise is completed. Then Wizard is closed.
    this.setState({
      valid: false
    });
    Promise.all(promises)
      .then(results => {
        if (results.length > 0) {
          MessageCenter.add(
            'Istio config' +
              (this.props.update ? 'updated' : 'created') +
              ' for ' +
              this.props.serviceName +
              ' service.',
            'default',
            MessageType.SUCCESS
          );
        }
        this.props.onClose(true);
      })
      .catch(error => {
        MessageCenter.add(API.getErrorMsg('无法' + (this.props.update ? '更新' : '创建') + ' Istio配置对象.', error));
        this.props.onClose(true);
      });
  };

  onTLS = (mTLS: string) => {
    this.setState({
      mtlsMode: mTLS,
      tlsModified: true
    });
  };

  onLoadBalancer = (simple: string) => {
    this.setState({
      loadBalancer: simple,
      lbModified: true
    });
  };

  onWeightsChange = (valid: boolean, workloads: WorkloadWeight[]) => {
    this.setState({
      valid: valid,
      workloads: workloads
    });
  };

  onRulesChange = (valid: boolean, rules: Rule[]) => {
    this.setState({
      valid: valid,
      rules: rules
    });
  };

  onSuspendedChange = (valid: boolean, suspendedRoutes: SuspendedRoute[]) => {
    this.setState({
      valid: valid,
      suspendedRoutes: suspendedRoutes
    });
  };

  onThreeScaleChange = (valid: boolean, threeScaleServiceRule: ThreeScaleServiceRule) => {
    this.setState({
      valid: valid,
      threeScaleServiceRule: threeScaleServiceRule
    });
  };

  render() {
    return (
      <Wizard show={this.state.showWizard} onHide={this.onClose}>
        <Wizard.Header
          onClose={this.onClose}
          title={this.props.update ? WIZARD_UPDATE_TITLES[this.props.type] : WIZARD_TITLES[this.props.type]}
        />
        <Wizard.Body>
          <Wizard.Row>
            <Wizard.Main>
              <Wizard.Contents stepIndex={0} activeStepIndex={0}>
                {this.props.type === WIZARD_WEIGHTED_ROUTING && (
                  <WeightedRouting
                    serviceName={this.props.serviceName}
                    workloads={this.props.workloads}
                    initWeights={getInitWeights(this.props.workloads, this.props.virtualServices)}
                    onChange={this.onWeightsChange}
                  />
                )}
                {this.props.type === WIZARD_MATCHING_ROUTING && (
                  <MatchingRouting
                    serviceName={this.props.serviceName}
                    workloads={this.props.workloads}
                    initRules={getInitRules(this.props.workloads, this.props.virtualServices)}
                    onChange={this.onRulesChange}
                  />
                )}
                {this.props.type === WIZARD_SUSPEND_TRAFFIC && (
                  <SuspendTraffic
                    serviceName={this.props.serviceName}
                    workloads={this.props.workloads}
                    initSuspendedRoutes={getInitSuspendedRoutes(this.props.workloads, this.props.virtualServices)}
                    onChange={this.onSuspendedChange}
                  />
                )}
                {this.props.type === WIZARD_THREESCALE_INTEGRATION && (
                  <ThreeScaleIntegration
                    serviceName={this.props.serviceName}
                    serviceNamespace={this.props.namespace}
                    threeScaleServiceRule={
                      this.props.threeScaleServiceRule || {
                        serviceName: this.props.serviceName,
                        serviceNamespace: this.props.namespace,
                        threeScaleHandlerName: ''
                      }
                    }
                    onChange={this.onThreeScaleChange}
                  />
                )}
                {(this.props.type === WIZARD_WEIGHTED_ROUTING ||
                  this.props.type === WIZARD_MATCHING_ROUTING ||
                  this.props.type === WIZARD_SUSPEND_TRAFFIC) && (
                  <TrafficPolicyContainer
                    mtlsMode={this.state.mtlsMode}
                    loadBalancer={this.state.loadBalancer}
                    onTlsChange={this.onTLS}
                    onLoadbalancerChange={this.onLoadBalancer}
                    expanded={false}
                    nsWideStatus={this.props.tlsStatus}
                  />
                )}
              </Wizard.Contents>
            </Wizard.Main>
          </Wizard.Row>
        </Wizard.Body>
        <Wizard.Footer>
          <Button bsStyle="default" className="btn-cancel" onClick={this.onClose}>
            取消
          </Button>
          <Button disabled={!this.state.valid} bsStyle="primary" onClick={this.onCreateUpdate}>
            {this.props.update ? '更新' : '创建'}
          </Button>
        </Wizard.Footer>
      </Wizard>
    );
  }
}

export default IstioWizard;
