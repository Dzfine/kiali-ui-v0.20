import * as React from 'react';
import { Button } from 'patternfly-react';
type Props = {
  objectName: string;
  readOnly: boolean;
  canUpdate: boolean;
  onCancel: () => void;
  onUpdate: () => void;
  onRefresh: () => void;
};
type State = {
  showConfirmModal: boolean;
};
class IstioActionButtons extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showConfirmModal: false };
  }
  hideConfirmModal = () => {
    this.setState({ showConfirmModal: false });
  };
  render() {
    return (
      <>
        <span style={{ float: 'left', paddingTop: '10px', paddingBottom: '10px' }}>
          {!this.props.readOnly && (
            <span style={{ paddingRight: '5px' }}>
              <Button bsStyle="primary" disabled={!this.props.canUpdate} onClick={this.props.onUpdate}>
                保存
              </Button>
            </span>
          )}
          <span style={{ paddingRight: '5px' }}>
            <Button onClick={this.props.onRefresh}>重载</Button>
          </span>
          <span style={{ paddingRight: '5px' }}>
            <Button onClick={this.props.onCancel}>{this.props.readOnly ? '关闭' : '取消'}</Button>
          </span>
        </span>
      </>
    );
  }
}
export default IstioActionButtons;
