import * as React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  EmptyState,
  EmptyStateTitle,
  EmptyStateIcon,
  EmptyStateInfo,
  EmptyStateAction
} from 'patternfly-react';
import { style } from 'typestyle';
import * as _ from 'lodash';
import { KialiAppState } from '../store/Store';
import { GraphFilterActions } from '../actions/GraphFilterActions';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import Namespace from '../types/Namespace';
import { KialiAppAction } from '../actions/KialiAppAction';

const mapStateToProps = (state: KialiAppState) => {
  return {
    error: state.graph.error,
    isDisplayingUnusedNodes: state.graph.filterState.showUnusedNodes
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<KialiAppState, void, KialiAppAction>) => {
  return {
    displayUnusedNodes: bindActionCreators(GraphFilterActions.toggleUnusedNodes, dispatch)
  };
};

type EmptyGraphLayoutProps = {
  elements?: any;
  namespaces: Namespace[];
  action?: any;
  displayUnusedNodes: () => void;
  isDisplayingUnusedNodes: boolean;
  isLoading?: boolean;
  isError: boolean;
  error?: string;
};

const emptyStateStyle = style({
  height: '98%',
  marginRight: 5,
  marginBottom: 10,
  marginTop: 10
});

type EmptyGraphLayoutState = {};

export class EmptyGraphLayout extends React.Component<EmptyGraphLayoutProps, EmptyGraphLayoutState> {
  shouldComponentUpdate(nextProps: EmptyGraphLayoutProps) {
    const currentIsEmpty = _.isEmpty(this.props.elements.nodes);
    const nextIsEmpty = _.isEmpty(nextProps.elements.nodes);

    // Update if we have elements and we are not loading
    if (!nextProps.isLoading && !nextIsEmpty) {
      return true;
    }

    // Update if we are going from having no elements to having elements or vice versa
    if (currentIsEmpty !== nextIsEmpty) {
      return true;
    }
    // Do not update if we have elements and the namespace didn't change, as this means we are refreshing
    return !(!nextIsEmpty && this.props.namespaces === nextProps.namespaces);
  }

  namespacesText() {
    if (this.props.namespaces && this.props.namespaces.length > 0) {
      if (this.props.namespaces.length === 1) {
        return (
          <>
            命名空间 <b>{this.props.namespaces[0].name}</b>
          </>
        );
      } else {
        const namespacesString =
          this.props.namespaces
            .slice(0, -1)
            .map(namespace => namespace.name)
            .join(',') +
          ' and ' +
          this.props.namespaces[this.props.namespaces.length - 1].name;
        return (
          <>
            命名空间 <b>{namespacesString}</b>
          </>
        );
      }
    }
    return null;
  }

  render() {
    if (this.props.isError) {
      return (
        <EmptyState className={emptyStateStyle}>
          <EmptyStateIcon name="error-circle-o" />
          <EmptyStateTitle>加载图表时出错</EmptyStateTitle>
          <EmptyStateInfo>{this.props.error}</EmptyStateInfo>
        </EmptyState>
      );
    }
    if (this.props.isLoading) {
      return (
        <EmptyState className={emptyStateStyle}>
          <EmptyStateTitle>正在加载图表</EmptyStateTitle>
        </EmptyState>
      );
    }

    if (this.props.namespaces.length === 0) {
      return (
        <EmptyState className={emptyStateStyle}>
          <EmptyStateTitle>无命名空间被选中</EmptyStateTitle>
          <EmptyStateInfo>当前没有选择命名空间，请选择命名空间。</EmptyStateInfo>
        </EmptyState>
      );
    }

    const isGraphEmpty = !this.props.elements || !this.props.elements.nodes || this.props.elements.nodes.length < 1;

    if (isGraphEmpty) {
      return (
        <EmptyState className={emptyStateStyle}>
          <EmptyStateTitle>空图表</EmptyStateTitle>
          <EmptyStateInfo>
            {this.namespacesText()}当前没有可读的图表。这可能意味着没有可用于
            {this.props.namespaces.length === 1 ? '该命名空间' : '这些命名空间'}
            的服务网格，或者服务网格尚未查看请求流量。
            {this.props.isDisplayingUnusedNodes && <> 当前显示“未使用的节点”, 需将请求发送给服务网格并点击刷新按钮。</>}
            {!this.props.isDisplayingUnusedNodes && (
              <> 您可以启用“未使用的节点”来显示尚未查看任何请求流量的服务网格节点。</>
            )}
          </EmptyStateInfo>
          <EmptyStateAction>
            <Button
              bsStyle="primary"
              bsSize="large"
              onClick={this.props.isDisplayingUnusedNodes ? this.props.action : this.props.displayUnusedNodes}
            >
              {(this.props.isDisplayingUnusedNodes && <>刷新</>) || <>显示未使用的节点</>}
            </Button>
          </EmptyStateAction>
        </EmptyState>
      );
    } else {
      return this.props.children;
    }
  }
}

const EmptyGraphLayoutContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EmptyGraphLayout);
export default EmptyGraphLayoutContainer;
