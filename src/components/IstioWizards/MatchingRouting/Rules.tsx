import * as React from 'react';
import { Button, DropdownKebab, ListView, ListViewIcon, ListViewItem, MenuItem } from 'patternfly-react';
import { style } from 'typestyle';
import { PfColors } from '../../Pf/PfColors';

export enum MOVE_TYPE {
  UP,
  DOWN
}

export type Rule = {
  matches: string[];
  routes: string[];
};

type Props = {
  rules: Rule[];
  onRemoveRule: (index: number) => void;
  onMoveRule: (index: number, move: MOVE_TYPE) => void;
};

const matchValueStyle = style({
  fontWeight: 'normal',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});

const ruleItemStyle = style({
  $nest: {
    ['.list-group-item-heading']: {
      flexBasis: 'calc(50% - 20px)',
      width: 'calc(50% - 20px)'
    },
    ['.list-view-pf-actions']: {
      zIndex: 10
    }
  }
});

const routeToStyle = style({
  marginLeft: 10
});

const validationStyle = style({
  marginTop: 15,
  color: PfColors.Red100
});

const vsIconType = 'fa';
const vsIconName = 'code-fork';

const wkIconType = 'pf';
const wkIconName = 'bundle';

class Rules extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  matchAllIndex = (rules: Rule[]): number => {
    let matchAll: number = -1;
    for (let index = 0; index < rules.length; index++) {
      const rule = rules[index];
      if (rule.matches.length === 0) {
        matchAll = index;
        break;
      }
    }
    return matchAll;
  };

  render() {
    const ruleItems: any[] = [];
    let isValid: boolean = true;
    const matchAll: number = this.matchAllIndex(this.props.rules);
    for (let index = 0; index < this.props.rules.length; index++) {
      const rule = this.props.rules[index];
      isValid = matchAll === -1 || index <= matchAll;
      const matches: any[] = rule.matches.map((map, i) => {
        return (
          <div key={'match-' + map + '-' + i} className={matchValueStyle}>
            {map}
          </div>
        );
      });
      const ruleActions = (
        <>
          <Button onClick={() => this.props.onRemoveRule(index)}>移除</Button>
          {this.props.rules.length > 1 && (
            <DropdownKebab key={'move-rule-actions-' + index} id={'move-rule-actions-' + index} pullRight={true}>
              {index > 0 && <MenuItem onClick={() => this.props.onMoveRule(index, MOVE_TYPE.UP)}>上移</MenuItem>}
              {index + 1 < this.props.rules.length && (
                <MenuItem onClick={() => this.props.onMoveRule(index, MOVE_TYPE.DOWN)}>下移</MenuItem>
              )}
            </DropdownKebab>
          )}
        </>
      );
      ruleItems.push(
        <ListViewItem
          key={'match-rule-' + index}
          className={ruleItemStyle}
          leftContent={<ListViewIcon type={vsIconType} name={vsIconName} />}
          heading={
            <>
              匹配:
              {rule.matches.length === 0 && <div className={matchValueStyle}>任务请求</div>}
              {rule.matches.length !== 0 && matches}
            </>
          }
          description={
            <>
              <b>路由到:</b>
              {rule.routes.map(route => (
                <div key={'route-to-' + route}>
                  <span>
                    <ListViewIcon type={wkIconType} name={wkIconName} />
                    <span className={routeToStyle}>{route}</span>
                  </span>
                </div>
              ))}
              {!isValid && (
                <div className={validationStyle}>
                  匹配“任何请求”在前面的规则中定义。
                  <br />
                  此规则不可访问。
                </div>
              )}
            </>
          }
          actions={ruleActions}
        />
      );
    }
    return (
      <>
        <ListView>{ruleItems}</ListView>
      </>
    );
  }
}

export default Rules;
