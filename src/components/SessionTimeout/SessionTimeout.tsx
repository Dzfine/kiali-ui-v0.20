import * as React from 'react';
import { Modal, Button, Icon, Row, Col } from 'patternfly-react';
import { AuthStrategy } from '../../types/Auth';
import { LoginSession } from '../../store/Store';
import * as API from '../../services/Api';
import authenticationConfig from '../../config/AuthenticationConfig';

type SessionTimeoutProps = {
  onLogout: () => void;
  onExtendSession: (session: LoginSession) => void;
  onDismiss: () => void;
  show: boolean;
  timeOutCountDown: number;
};

export class SessionTimeout extends React.Component<SessionTimeoutProps, {}> {
  constructor(props: SessionTimeoutProps) {
    super(props);
  }

  render() {
    return (
      <Modal
        backdrop="static"
        className={'message-dialog-pf'}
        show={this.props.show}
        enforceFocus={true}
        aria-modal={true}
      >
        <Modal.Body>
          <Row style={{ paddingTop: '25px' }}>
            <Col xs={12} sm={1} md={1} lg={1} />
            <Col xs={12} sm={1} md={1} lg={1} style={{ paddingLeft: '10px' }}>
              <Icon name="warning-triangle-o" type="pf" style={{ fontSize: '48px' }} />
            </Col>
            <Col xs={12} sm={10} md={10} lg={10}>
              {this.textForAuthStrategy(authenticationConfig.strategy)}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <React.Fragment>
            <Button bsStyle={'default'} onClick={this.props.onLogout}>
              退出登录
            </Button>
            {authenticationConfig.strategy === AuthStrategy.login ? (
              <Button autoFocus={true} bsStyle={'primary'} onClick={this.extendSessionHandler}>
                继续当前会话
              </Button>
            ) : (
              <Button autoFocus={true} bsStyle={'primary'} onClick={this.props.onDismiss}>
                确定
              </Button>
            )}
          </React.Fragment>
        </Modal.Footer>
      </Modal>
    );
  }

  private extendSessionHandler = async () => {
    try {
      const session = await API.extendSession();
      this.props.onExtendSession(session.data);
    } catch (err) {
      console.error(err);
    }
  };

  private textForAuthStrategy = (strategy: AuthStrategy) => {
    const line1 =
      this.props.timeOutCountDown <= 0
        ? '当前会话已过期。'
        : `您的会话将于 ${this.props.timeOutCountDown.toFixed()} 秒后过期。`;

    const line2 =
      strategy === AuthStrategy.openshift ? '您需要提供集群凭证进行重新登录。请保存修改。' : '是否想要延长您的会话？';

    return (
      <p className={'lead'}>
        {line1}
        <br />
        {line2}
      </p>
    );
  };
}
