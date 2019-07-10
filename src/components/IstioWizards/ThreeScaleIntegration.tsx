import * as React from 'react';
import { ThreeScaleHandler, ThreeScaleServiceRule } from '../../types/ThreeScale';
import {
  Button,
  Col,
  ControlLabel,
  DropdownKebab,
  ExpandCollapse,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
  ListView,
  ListViewIcon,
  ListViewItem,
  MenuItem,
  OverlayTrigger,
  Tooltip,
  Row
} from 'patternfly-react';
import { style } from 'typestyle';
import * as API from '../../services/Api';
import * as MessageCenter from '../../utils/MessageCenter';

type Props = {
  serviceName: string;
  serviceNamespace: string;
  threeScaleServiceRule: ThreeScaleServiceRule;
  onChange: (valid: boolean, threeScaleServiceRule: ThreeScaleServiceRule) => void;
};

type ModifiedHandler = ThreeScaleHandler & {
  modified: boolean;
};

type State = {
  threeScaleHandlers: ModifiedHandler[];
  threeScaleServiceRule: ThreeScaleServiceRule;
  newThreeScaleHandler: ThreeScaleHandler;
};

const expandStyle = style({
  marginTop: 20,
  $nest: {
    ['.btn']: {
      fontSize: '14px'
    }
  }
});

const createHandlerStyle = style({
  marginTop: 20
});

const headingStyle = style({
  fontWeight: 'normal',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});

const k8sRegExpName = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[-a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;

class ThreeScaleIntegration extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      threeScaleHandlers: [],
      threeScaleServiceRule: props.threeScaleServiceRule,
      newThreeScaleHandler: {
        name: '',
        serviceId: '',
        accessToken: '',
        systemUrl: ''
      }
    };
  }

  componentDidMount() {
    this.fetchHandlers();
  }

  fetchHandlers = () => {
    API.getThreeScaleHandlers()
      .then(results => {
        this.setState(
          prevState => {
            let handlerName = prevState.threeScaleServiceRule.threeScaleHandlerName;
            if (handlerName === '' && results.data.length > 0) {
              handlerName = results.data[0].name;
            }
            return {
              threeScaleHandlers: results.data.map(h => {
                return {
                  name: h.name,
                  serviceId: h.serviceId,
                  accessToken: h.accessToken,
                  systemUrl: h.systemUrl,
                  modified: false
                };
              }),
              threeScaleServiceRule: {
                serviceName: prevState.threeScaleServiceRule.serviceName,
                serviceNamespace: prevState.threeScaleServiceRule.serviceNamespace,
                threeScaleHandlerName: handlerName
              }
            };
          },
          () => this.props.onChange(this.state.threeScaleHandlers.length > 0, this.state.threeScaleServiceRule)
        );
      })
      .catch(error => {
        MessageCenter.add(API.getErrorMsg('无法获取监控套件适配器', error));
      });
  };

  onUpdateHandler = (id: number) => {
    const handler = this.state.threeScaleHandlers[id];
    const patch = {
      name: handler.name,
      serviceId: handler.serviceId,
      accessToken: handler.accessToken,
      systemUrl: handler.systemUrl
    };
    API.updateThreeScaleHandler(this.state.threeScaleHandlers[id].name, JSON.stringify(patch))
      .then(results => {
        this.setState(
          prevState => {
            return {
              threeScaleHandlers: results.data.map(h => {
                return {
                  name: h.name,
                  serviceId: h.serviceId,
                  accessToken: h.accessToken,
                  systemUrl: h.systemUrl,
                  modified: false
                };
              }),
              threeScaleServiceRule: prevState.threeScaleServiceRule
            };
          },
          () => this.props.onChange(true, this.state.threeScaleServiceRule)
        );
      })
      .catch(error => {
        MessageCenter.add(API.getErrorMsg('无法修改监控套件适配器', error));
      });
  };

  onDeleteHandler = (handlerName: string) => {
    API.deleteThreeScaleHandler(handlerName)
      .then(results => {
        this.setState(
          prevState => {
            return {
              threeScaleHandlers: results.data.map(h => {
                return {
                  name: h.name,
                  serviceId: h.serviceId,
                  accessToken: h.accessToken,
                  systemUrl: h.systemUrl,
                  modified: false
                };
              }),
              threeScaleServiceRule: {
                serviceName: prevState.threeScaleServiceRule.serviceName,
                serviceNamespace: prevState.threeScaleServiceRule.serviceNamespace,
                threeScaleHandlerName:
                  prevState.threeScaleServiceRule.threeScaleHandlerName === handlerName
                    ? ''
                    : prevState.threeScaleServiceRule.threeScaleHandlerName
              }
            };
          },
          () => this.props.onChange(this.state.threeScaleHandlers.length > 0, this.state.threeScaleServiceRule)
        );
      })
      .catch(error => {
        MessageCenter.add(API.getErrorMsg('无法删除监控套件适配器', error));
      });
  };

  isValid = () => {
    let isModified = true;
    this.state.threeScaleHandlers.forEach(handlers => {
      isModified = isModified && handlers.modified;
    });
    const isNewModified =
      this.state.newThreeScaleHandler.name !== '' ||
      this.state.newThreeScaleHandler.serviceId !== '' ||
      this.state.newThreeScaleHandler.systemUrl !== '' ||
      this.state.newThreeScaleHandler.accessToken !== '';
    return !(isModified || isNewModified);
  };

  onChangeHandler = (selectedId: number, field: string, value: string) => {
    this.setState(prevState => {
      const newThreeScaleHandler = prevState.newThreeScaleHandler;
      if (selectedId === -1) {
        switch (field) {
          case 'name':
            newThreeScaleHandler.name = value.trim();
            break;
          case 'serviceId':
            newThreeScaleHandler.serviceId = value.trim();
            break;
          case 'accessToken':
            newThreeScaleHandler.accessToken = value.trim();
            break;
          case 'systemUrl':
            newThreeScaleHandler.systemUrl = value.trim();
            break;
          default:
        }
      }
      return {
        threeScaleServiceRule: prevState.threeScaleServiceRule,
        threeScaleHandlers: prevState.threeScaleHandlers.map((handler, id) => {
          if (selectedId === id) {
            handler.modified = true;
            switch (field) {
              case 'serviceId':
                handler.serviceId = value.trim();
                break;
              case 'accessToken':
                handler.accessToken = value.trim();
                break;
              case 'systemUrl':
                handler.systemUrl = value.trim();
                break;
              default:
            }
          }
          return handler;
        }),
        newThreeScaleHandler: newThreeScaleHandler
      };
    });
  };

  onCreateHandler = () => {
    API.createThreeScaleHandler(JSON.stringify(this.state.newThreeScaleHandler))
      .then(results => {
        this.setState(
          prevState => {
            return {
              threeScaleHandlers: results.data.map(h => {
                return {
                  name: h.name,
                  serviceId: h.serviceId,
                  accessToken: h.accessToken,
                  systemUrl: h.systemUrl,
                  modified: false
                };
              }),
              threeScaleServiceRule: {
                serviceName: prevState.threeScaleServiceRule.serviceName,
                serviceNamespace: prevState.threeScaleServiceRule.serviceNamespace,
                threeScaleHandlerName: this.state.newThreeScaleHandler.name
              },
              newThreeScaleHandler: {
                name: '',
                serviceId: '',
                systemUrl: '',
                accessToken: ''
              }
            };
          },
          () => this.props.onChange(true, this.state.threeScaleServiceRule)
        );
      })
      .catch(error => {
        MessageCenter.add(API.getErrorMsg('无法创建监控套件适配器', error));
      });
  };

  onSelectHandler = (handlerName: string) => {
    this.setState(
      prevState => {
        return {
          threeScaleHandlers: prevState.threeScaleHandlers,
          threeScaleServiceRule: {
            serviceName: prevState.threeScaleServiceRule.serviceName,
            serviceNamespace: prevState.threeScaleServiceRule.serviceNamespace,
            threeScaleHandlerName: handlerName
          }
        };
      },
      () => this.props.onChange(true, this.state.threeScaleServiceRule)
    );
  };

  renderHandlers = () => {
    return (
      <ListView>
        {this.state.threeScaleHandlers.map((handler, id) => {
          const isLinked =
            handler.name === this.state.threeScaleServiceRule.threeScaleHandlerName ||
            (this.state.threeScaleServiceRule.threeScaleHandlerName === '' && id === 0);
          const handlerActions = (
            <>
              {!isLinked && <Button onClick={() => this.onSelectHandler(handler.name)}>Select</Button>}
              <DropdownKebab key={'delete-handler-actions-' + id} id={'delete-handler-actions-' + id} pullRight={true}>
                <MenuItem onClick={() => this.onDeleteHandler(handler.name)}>删除适配器</MenuItem>
              </DropdownKebab>
            </>
          );
          const leftContent = isLinked ? <ListViewIcon type="pf" name="connected" /> : undefined;

          return (
            <ListViewItem
              key={id}
              leftContent={leftContent}
              heading={
                <>
                  <div>
                    {handler.name} {handler.modified && '*'}
                  </div>
                  <div className={headingStyle}>3scale适配器</div>
                </>
              }
              description={
                <>
                  {isLinked && (
                    <>
                      服务<b>{this.props.serviceName}</b>将与3scale API关联
                    </>
                  )}
                  <br />
                  服务Id: <i>{handler.serviceId}</i>
                  <br />
                  系统Url: <i>{handler.systemUrl}</i>
                </>
              }
              actions={handlerActions}
            >
              <Form horizontal={true}>
                <FormGroup
                  controlId="serviceId"
                  disabled={false}
                  validationState={handler.serviceId !== '' ? 'success' : 'error'}
                >
                  <Col componentClass={ControlLabel} sm={2}>
                    服务Id:
                  </Col>
                  <Col sm={8}>
                    <OverlayTrigger
                      placement={'right'}
                      overlay={<Tooltip id={'mtls-status-masthead'}>3scale ID提供给API调用</Tooltip>}
                      trigger={['hover', 'focus']}
                      rootClose={false}
                    >
                      <FormControl
                        type="text"
                        disabled={false}
                        value={handler.serviceId}
                        onChange={e => this.onChangeHandler(id, 'serviceId', e.target.value)}
                      />
                    </OverlayTrigger>
                  </Col>
                </FormGroup>
                <FormGroup
                  controlId="systemUrl"
                  disabled={false}
                  validationState={handler.systemUrl !== '' ? 'success' : 'error'}
                >
                  <Col componentClass={ControlLabel} sm={2}>
                    系统Url:
                  </Col>
                  <Col sm={8}>
                    <OverlayTrigger
                      placement={'right'}
                      overlay={<Tooltip id={'mtls-status-masthead'}>用于API的3scale系统Url</Tooltip>}
                      trigger={['hover', 'focus']}
                      rootClose={false}
                    >
                      <FormControl
                        type="text"
                        disabled={false}
                        value={handler.systemUrl}
                        onChange={e => this.onChangeHandler(id, 'systemUrl', e.target.value)}
                      />
                    </OverlayTrigger>
                  </Col>
                </FormGroup>
                <FormGroup
                  controlId="accessToken"
                  disabled={false}
                  validationState={handler.accessToken !== '' ? 'success' : 'error'}
                >
                  <Col componentClass={ControlLabel} sm={2}>
                    访问令牌:
                  </Col>
                  <Col sm={8}>
                    <OverlayTrigger
                      placement={'right'}
                      overlay={<Tooltip id={'mtls-status-masthead'}>3scale访问令牌</Tooltip>}
                      trigger={['hover', 'focus']}
                      rootClose={false}
                    >
                      <FormControl
                        type="text"
                        disabled={false}
                        value={handler.accessToken}
                        onChange={e => this.onChangeHandler(id, 'accessToken', e.target.value)}
                      />
                    </OverlayTrigger>
                  </Col>
                </FormGroup>
                <Row style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                  <Col smOffset={10} sm={2}>
                    <Button
                      bsStyle="primary"
                      style={{ marginLeft: '-10px' }}
                      onClick={() => this.onUpdateHandler(id)}
                      disabled={handler.serviceId === '' || handler.systemUrl === '' || handler.accessToken === ''}
                    >
                      修改适配器
                    </Button>
                  </Col>
                </Row>
              </Form>
            </ListViewItem>
          );
        })}
      </ListView>
    );
  };

  isValidCreateHandler = () => {
    return (
      this.isValidK8SName(this.state.newThreeScaleHandler.name) &&
      this.state.newThreeScaleHandler.serviceId !== '' &&
      this.state.newThreeScaleHandler.systemUrl !== '' &&
      this.state.newThreeScaleHandler.accessToken !== ''
    );
  };

  isValidK8SName = (name: string) => {
    return name === '' ? false : name.search(k8sRegExpName) === 0;
  };

  renderCreateHandler = () => {
    const isValidName = this.isValidK8SName(this.state.newThreeScaleHandler.name);
    return (
      <Form className={createHandlerStyle} horizontal={true}>
        <FormGroup
          controlId="handlerName"
          disabled={false}
          value={this.state.newThreeScaleHandler.name}
          onChange={e => this.onChangeHandler(-1, 'name', e.target.value)}
          validationState={isValidName ? 'success' : 'error'}
        >
          <Col componentClass={ControlLabel} sm={2}>
            适配器名称:
          </Col>
          <Col sm={8}>
            <FormControl type="text" disabled={false} />
            {!isValidName && (
              <HelpBlock>
                名称必须由小写字母数字字符“ - ”或“。”组成，并且必须以字母数字字符开头和结尾。
              </HelpBlock>
            )}
          </Col>
        </FormGroup>
        <FormGroup
          controlId="serviceId"
          disabled={false}
          value={this.state.newThreeScaleHandler.serviceId}
          onChange={e => this.onChangeHandler(-1, 'serviceId', e.target.value)}
          validationState={this.state.newThreeScaleHandler.serviceId !== '' ? 'success' : 'error'}
        >
          <Col componentClass={ControlLabel} sm={2}>
            服务Id:
          </Col>
          <Col sm={8}>
            <OverlayTrigger
              placement={'right'}
              overlay={<Tooltip id={'mtls-status-masthead'}>3scale ID提供给API调用</Tooltip>}
              trigger={['hover', 'focus']}
              rootClose={false}
            >
              <FormControl type="text" disabled={false} />
            </OverlayTrigger>
          </Col>
        </FormGroup>
        <FormGroup
          controlId="systemUrl"
          disabled={false}
          value={this.state.newThreeScaleHandler.systemUrl}
          onChange={e => this.onChangeHandler(-1, 'systemUrl', e.target.value)}
          validationState={this.state.newThreeScaleHandler.systemUrl !== '' ? 'success' : 'error'}
        >
          <Col componentClass={ControlLabel} sm={2}>
            系统Url:
          </Col>
          <Col sm={8}>
            <OverlayTrigger
              placement={'right'}
              overlay={<Tooltip id={'mtls-status-masthead'}>用于API的3scale系统Url</Tooltip>}
              trigger={['hover', 'focus']}
              rootClose={false}
            >
              <FormControl type="text" disabled={false} />
            </OverlayTrigger>
          </Col>
        </FormGroup>
        <FormGroup
          controlId="accessToken"
          disabled={false}
          value={this.state.newThreeScaleHandler.accessToken}
          onChange={e => this.onChangeHandler(-1, 'accessToken', e.target.value)}
          validationState={this.state.newThreeScaleHandler.accessToken !== '' ? 'success' : 'error'}
        >
          <Col componentClass={ControlLabel} sm={2}>
            访问令牌:
          </Col>
          <Col sm={8}>
            <OverlayTrigger
              placement={'right'}
              overlay={<Tooltip id={'mtls-status-masthead'}>3scale访问令牌</Tooltip>}
              trigger={['hover', 'focus']}
              rootClose={false}
            >
              <FormControl type="text" disabled={false} />
            </OverlayTrigger>
          </Col>
        </FormGroup>
        <Row style={{ paddingTop: '10px', paddingBottom: '10px' }}>
          <Col smOffset={10} sm={2}>
            <Button bsStyle="primary" onClick={this.onCreateHandler} disabled={!this.isValidCreateHandler()}>
              创建适配器
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    return (
      <>
        {this.renderHandlers()}
        <ExpandCollapse
          className={expandStyle}
          textCollapsed="显示高级选项"
          textExpanded="隐藏高级选项"
          expanded={this.state.threeScaleHandlers.length === 0 || this.state.newThreeScaleHandler.name !== ''}
        >
          {this.renderCreateHandler()}
        </ExpandCollapse>
      </>
    );
  }
}

export default ThreeScaleIntegration;
