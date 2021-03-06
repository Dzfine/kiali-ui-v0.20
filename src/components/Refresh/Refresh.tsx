import * as React from 'react';
import { Button, Icon } from 'patternfly-react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { KialiAppState } from '../../store/Store';
import { refreshIntervalSelector } from '../../store/Selectors';
import { config } from '../../config';
import { PollIntervalInMs } from '../../types/Common';
import { UserSettingsActions } from '../../actions/UserSettingsActions';
import { KialiAppAction } from '../../actions/KialiAppAction';
import { ToolbarDropdown } from '../ToolbarDropdown/ToolbarDropdown';

type ComponentProps = {
  id: string;
  handleRefresh: () => void;
  hideLabel?: boolean;
};

type ReduxProps = {
  refreshInterval: PollIntervalInMs;
  setRefreshInterval: (pollInterval: PollIntervalInMs) => void;
};

type Props = ComponentProps & ReduxProps;

type State = {
  pollerRef?: number;
};

const POLL_INTERVALS = config.toolbar.pollInterval;

class Refresh extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let pollerRef: number | undefined = undefined;
    if (this.props.refreshInterval) {
      pollerRef = window.setInterval(this.props.handleRefresh, this.props.refreshInterval);
    }
    this.state = {
      pollerRef: pollerRef
    };
  }

  componentWillUnmount() {
    if (this.state.pollerRef) {
      clearInterval(this.state.pollerRef);
    }
  }

  updatePollInterval = (pollInterval: PollIntervalInMs) => {
    let newRefInterval: number | undefined = undefined;
    if (this.state.pollerRef) {
      clearInterval(this.state.pollerRef);
    }
    if (pollInterval > 0) {
      newRefInterval = window.setInterval(this.props.handleRefresh, pollInterval);
    }
    this.setState({ pollerRef: newRefInterval });
    this.props.setRefreshInterval(pollInterval); // notify redux of the change
  };

  render() {
    if (this.props.refreshInterval !== undefined) {
      const { hideLabel } = this.props;
      return (
        <>
          {!hideLabel && <label style={{ paddingRight: '0.5em', marginLeft: '1.5em' }}>Refreshing</label>}
          <ToolbarDropdown
            id={this.props.id}
            handleSelect={value => this.updatePollInterval(Number(value))}
            value={this.props.refreshInterval}
            label={POLL_INTERVALS[this.props.refreshInterval]}
            options={POLL_INTERVALS}
            tooltip={'刷新时间间隔'}
          />
          <span style={{ paddingLeft: '0.5em' }}>
            <Button id={this.props.id + '_btn'} onClick={this.props.handleRefresh}>
              <Icon name="refresh" />
            </Button>
          </span>
        </>
      );
    } else {
      return this.renderButtonOnly();
    }
  }

  renderButtonOnly() {
    return (
      <Button id="refresh_button" onClick={this.props.handleRefresh}>
        <Icon name="refresh" />
      </Button>
    );
  }
}

const mapStateToProps = (state: KialiAppState) => ({
  refreshInterval: refreshIntervalSelector(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch<KialiAppState, void, KialiAppAction>) => {
  return {
    setRefreshInterval: (refresh: PollIntervalInMs) => {
      dispatch(UserSettingsActions.setRefreshInterval(refresh));
    }
  };
};

const RefreshContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Refresh);

export default RefreshContainer;
