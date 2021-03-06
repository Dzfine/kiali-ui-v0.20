import * as React from 'react';
import { DropdownButton, MenuItem, MessageDialog } from 'patternfly-react';
import { style } from 'typestyle';
import intl from '../../locales/KiwiInit';

type Props = {
  objectKind?: string;
  objectName: string;
  canDelete: boolean;
  onDelete: () => void;
};

type State = {
  showConfirmModal: boolean;
};

const msgDialogStyle = style({
  $nest: {
    ['.modal-content']: {
      fontSize: '14px'
    }
  }
});

class IstioActionDropdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showConfirmModal: false };
  }

  onAction = (key: string) => {
    if (key === 'delete') {
      this.setState({ showConfirmModal: true });
    }
  };

  hideConfirmModal = () => {
    this.setState({ showConfirmModal: false });
  };

  onDelete = () => {
    this.hideConfirmModal();
    this.props.onDelete();
  };

  render() {
    const objectName = this.props.objectKind ? this.props.objectKind : 'Istio对象';

    return (
      <>
        <DropdownButton id="actions" title="操作" onSelect={this.onAction} pullRight={true}>
          <MenuItem key="delete" eventKey="delete" disabled={!this.props.canDelete}>
            删除
          </MenuItem>
        </DropdownButton>
        <MessageDialog
          className={msgDialogStyle}
          show={this.state.showConfirmModal}
          primaryAction={this.onDelete}
          secondaryAction={this.hideConfirmModal}
          onHide={this.hideConfirmModal}
          primaryActionButtonContent="删除"
          secondaryActionButtonContent="取消"
          primaryActionButtonBsStyle="danger"
          title="确定删除"
          primaryContent={`确定删除${objectName} '${this.props.objectName}'? `}
          secondaryContent={intl.get('IstioConfig.deleteAction.tip')}
          accessibleName="deleteConfirmationDialog"
          accessibleDescription="deleteConfirmationDialogContent"
        />
      </>
    );
  }
}

export default IstioActionDropdown;
