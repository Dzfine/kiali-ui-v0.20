import * as React from 'react';
import Draggable from 'react-draggable';
import {
  Button,
  Icon,
  Nav,
  NavItem,
  TabContainer,
  TabContent,
  TabPane,
  Table,
  TablePfProvider
} from 'patternfly-react';
import { style } from 'typestyle';
import * as resolve from 'table-resolver';

export interface GraphHelpFindProps {
  onClose: () => void;
  className?: string;
}

export default class GraphHelpFind extends React.Component<GraphHelpFindProps> {
  headerFormat = (label, { column }) => <Table.Heading className={column.property}>{label}</Table.Heading>;
  cellFormat = (value, { column }) => {
    const props = column.cell.props;
    const className = props ? props.align : '';

    return <Table.Cell className={className}>{value}</Table.Cell>;
  };

  constructor(props: GraphHelpFindProps) {
    super(props);
  }

  edgeColumns = () => {
    return {
      columns: [
        {
          property: 'c',
          header: {
            label: '表达式',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat],
            props: {
              align: 'text-left'
            }
          }
        },
        {
          property: 'n',
          header: {
            label: '注释',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat],
            props: {
              align: 'text-left'
            }
          }
        }
      ]
    };
  };

  exampleColumns = () => {
    return {
      columns: [
        {
          property: 'e',
          header: {
            label: '表达式',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat],
            props: {
              align: 'text-left'
            }
          }
        },
        {
          property: 'd',
          header: {
            label: '描述信息',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat],
            props: {
              align: 'text-left'
            }
          }
        }
      ]
    };
  };

  nodeColumns = () => {
    return {
      columns: [
        {
          property: 'c',
          header: {
            label: '表达式',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat],
            props: {
              align: 'text-left'
            }
          }
        },
        {
          property: 'n',
          header: {
            label: '注释',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat],
            props: {
              align: 'text-left'
            }
          }
        }
      ]
    };
  };

  noteColumns = () => {
    return {
      columns: [
        {
          property: 't',
          header: {
            label: '使用说明',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat],
            props: {
              align: 'textleft'
            }
          }
        }
      ]
    };
  };

  operatorColumns = () => {
    return {
      columns: [
        {
          property: 'o',
          header: {
            label: '操作运算符',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat],
            props: {
              align: 'text-center'
            }
          }
        },
        {
          property: 'd',
          header: {
            label: '描述信息',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat],
            props: {
              align: 'text-left'
            }
          }
        }
      ]
    };
  };

  render() {
    const className = this.props.className ? this.props.className : '';
    const width = '600px';
    const maxWidth = '602px';
    const contentWidth = 'calc(100vw - 50px - var(--pf-c-page__sidebar--md--Width))'; // 50px prevents full coverage
    const contentStyle = style({
      width: contentWidth,
      maxWidth: maxWidth,
      height: 'auto',
      right: '0',
      top: '10px',
      zIndex: 9999,
      position: 'absolute',
      overflow: 'hidden',
      overflowX: 'auto',
      overflowY: 'auto'
    });
    const headerStyle = style({
      width: width
    });
    const bodyStyle = style({
      width: width
    });
    const prefaceStyle = style({
      width: '100%',
      height: '105px',
      padding: '10px',
      resize: 'vertical',
      color: '#fff',
      backgroundColor: '#003145'
    });
    const preface =
      '您可以使用“查找”和“隐藏”字段突出显示或隐藏图形中的边和节点。 每个字段 ' +
      '使用下面描述的语言来接受文本表达式。 使用“查找”和“隐藏”时，“隐藏”优先级更高 ' +
      '“隐藏”维护布局，不会重新定位剩余的图表元素。';

    return (
      <Draggable handle="#helpheader" bounds="#root">
        <div className={`modal-content ${className} ${contentStyle}`}>
          <div id="helpheader" className={`modal-header ${headerStyle}`}>
            <Button className="close" bsClass="" onClick={this.props.onClose}>
              <Icon title="Close" type="pf" name="close" />
            </Button>
            <span className="modal-title">帮助: 图表 查找/隐藏</span>
          </div>
          <div className={`modal-body ${bodyStyle}`}>
            <textarea className={`${prefaceStyle}`} readOnly={true} value={preface} />
            <TabContainer id="basic-tabs" defaultActiveKey="notes">
              <>
                <Nav bsClass="nav nav-tabs nav-tabs-pf" style={{ paddingLeft: '10px' }}>
                  <NavItem eventKey="notes">
                    <div>使用说明</div>
                  </NavItem>
                  <NavItem eventKey="operators">
                    <div>操作运算符</div>
                  </NavItem>
                  <NavItem eventKey="nodes">
                    <div>节点</div>
                  </NavItem>
                  <NavItem eventKey="edges">
                    <div>连线</div>
                  </NavItem>
                  <NavItem eventKey="examples">
                    <div>案例</div>
                  </NavItem>
                </Nav>
                <TabContent>
                  <TabPane eventKey="notes" mountOnEnter={true} unmountOnExit={true}>
                    <TablePfProvider
                      striped={true}
                      bordered={true}
                      hover={true}
                      dataTable={true}
                      columns={this.noteColumns().columns}
                    >
                      <Table.Header headerRows={resolve.headerRows(this.noteColumns())} />
                      <Table.Body
                        rowKey="id"
                        rows={[
                          { id: 't00', t: '表达式中不能将"AND"和"OR"整合。' },
                          { id: 't05', t: '不支持（或不需要）括号。' },
                          {
                            id: 't10',
                            t: '“name”操作数在内部扩展为“OR”表达式（否定时为“AND”）。'
                          },
                          { id: 't30', t: '表达式无法组合节点和边界值条件。' },
                          {
                            id: 't40',
                            t: '数值相等(=,!=)为完全匹配。包括前导0和精度数字。'
                          },
                          {
                            id: 't45',
                            t: '使用"<operand> = NaN"来测试无活动. 使用"!= NaN"，用于任何活动。(例如，httpout = NaN)'
                          },
                          { id: 't50', t: '数字使用“.”十进制记数法。' },
                          { id: 't60', t: '百分比精度精确到1位，比率使用2位精度。' },
                          {
                            id: 't70',
                            t: `使用一元操作数可以有选择地使用前缀"is"或者"has". (即"has mtls")`
                          },
                          {
                            id: 't80',
                            t: '缩写：namespace|ns, service|svc, workload|wl (e.g. is wlnode)'
                          },
                          {
                            id: 't90',
                            t:
                              '缩写: circuitbreaker|cb, responsetime|rt, serviceentry->se, sidecar|sc, virtualservice|vs'
                          }
                        ]}
                      />
                    </TablePfProvider>
                  </TabPane>
                  <TabPane eventKey="operators" mountOnEnter={true} unmountOnExit={true}>
                    <TablePfProvider
                      striped={true}
                      bordered={true}
                      hover={true}
                      dataTable={true}
                      columns={this.operatorColumns().columns}
                    >
                      <Table.Header headerRows={resolve.headerRows(this.operatorColumns())} />
                      <Table.Body
                        rowKey="id"
                        rows={[
                          { id: 'o0', o: '! | not <unary expression>', d: `取反` },
                          { id: 'o1', o: '=', d: `等于` },
                          { id: 'o2', o: '!=', d: `不等于` },
                          { id: 'o3', o: 'endswith | $=', d: `仅以字符串结尾` },
                          { id: 'o4', o: '!endswith | !$=', d: `不以字符串结尾` },
                          { id: 'o5', o: 'startswith | ^=', d: `仅以字符串开头` },
                          { id: 'o6', o: '!startswith | !^=', d: `不以字符串开头` },
                          { id: 'o7', o: 'contains | *=', d: '仅包含字符串' },
                          { id: 'o8', o: '!contains | !*=', d: '不包含字符串' },
                          { id: 'o9', o: '>', d: `大于` },
                          { id: 'o10', o: '>=', d: `大于等于` },
                          { id: 'o11', o: '<', d: `小于` },
                          { id: 'o12', o: '<=', d: `小于等于` }
                        ]}
                      />
                    </TablePfProvider>
                  </TabPane>
                  <TabPane eventKey="nodes" mountOnEnter={true} unmountOnExit={true}>
                    <TablePfProvider
                      striped={true}
                      bordered={true}
                      hover={true}
                      dataTable={true}
                      columns={this.nodeColumns().columns}
                    >
                      <Table.Header headerRows={resolve.headerRows(this.nodeColumns())} />
                      <Table.Body
                        rowKey="id"
                        rows={[
                          { id: 'nc00', c: 'grpcin <op> <number>', n: '单位：每秒请求数' },
                          { id: 'nc10', c: 'grpcout <op> <number>', n: '单位：每秒请求数' },
                          { id: 'nc12', c: 'httpin <op> <number>', n: '单位：每秒请求数' },
                          { id: 'nc13', c: 'httpout <op> <number>', n: '单位：每秒请求数' },
                          {
                            id: 'nc15',
                            c: 'name <op> <string>',
                            n: '测试应用程序标签，服务名称和工作负载名称'
                          },
                          { id: 'nc20', c: 'namespace <op> <namespaceName>' },
                          { id: 'nc25', c: 'node <op> <nodeType>', n: '节点类型: app | service | workload | unknown' },
                          { id: 'nc30', c: 'service <op> <serviceName>' },
                          { id: 'nc40', c: 'version <op> <string>' },
                          { id: 'nc50', c: 'tcpin <op> <number>', n: '单位：每秒字节数' },
                          { id: 'nc60', c: 'tcpout <op> <number>', n: '单位：每秒字节数' },
                          { id: 'nc70', c: 'workload <op> <workloadName>' },
                          { id: 'nc90', c: 'circuitbreaker' },
                          { id: 'nc100', c: 'outside', n: '在请求的命名空间范围之外' },
                          { id: 'nc110', c: 'sidecar' },
                          { id: 'nc130', c: 'serviceentry' },
                          { id: 'nc135', c: 'trafficsource', n: `只有外向边界` },
                          { id: 'nc150', c: 'unused', n: `必须启用“显示未使用”选项` },
                          { id: 'nc160', c: 'virtualservice' }
                        ]}
                      />
                    </TablePfProvider>
                  </TabPane>
                  <TabPane eventKey="edges" mountOnEnter={true} unmountOnExit={true}>
                    <TablePfProvider
                      striped={true}
                      bordered={true}
                      hover={true}
                      dataTable={true}
                      columns={this.edgeColumns().columns}
                    >
                      <Table.Header headerRows={resolve.headerRows(this.edgeColumns())} />
                      <Table.Body
                        rowKey="id"
                        rows={[
                          { id: 'ec00', c: 'grpc <op> <number>', n: '单位：每秒请求数' },
                          { id: 'ec10', c: '%grpcerr <op> <number>', n: '区间: [0..100]' },
                          { id: 'ec20', c: '%grpctraffic <op> <number>', n: '区间: [0..100]' },
                          { id: 'ec23', c: 'http <op> <number>', n: '单位: 每秒请求数' },
                          { id: 'ec24', c: '%httperr <op> <number>', n: '区间: [0..100]' },
                          { id: 'ec25', c: '%httptraffic <op> <number>', n: '区间: [0..100]' },
                          { id: 'ec30', c: 'protocol <op> <protocol>', n: 'grpc, http, tcp, etc..' },
                          {
                            id: 'ec40',
                            c: 'responsetime <op> <number>',
                            n: `单位：毫秒，需要“响应时间”边缘标签`
                          },
                          { id: 'ec50', c: 'tcp <op> <number>', n: '单位：每秒请求数' },
                          { id: 'ec60', c: 'mtls' },
                          { id: 'ec70', c: 'traffic', n: '任何协议的任何流量' }
                        ]}
                      />
                    </TablePfProvider>
                  </TabPane>
                  <TabPane eventKey="examples">
                    <TablePfProvider
                      striped={true}
                      bordered={true}
                      hover={true}
                      dataTable={true}
                      columns={this.exampleColumns().columns}
                    >
                      <Table.Header headerRows={resolve.headerRows(this.exampleColumns())} />
                      <Table.Body
                        rowKey="id"
                        rows={[
                          {
                            id: 'e00',
                            e: 'name = reviews',
                            d: `"按名称": app标签，服务名称或工作负载名称等于“reviews”的节点`
                          },
                          {
                            id: 'e10',
                            e: 'name not contains rev',
                            d: `"按名称": app标签，服务名称和工作负载名称不包含'rev'的节点`
                          },
                          {
                            id: 'e20',
                            e: 'app startswith product',
                            d: `app标签以'product'开头的节点`
                          },
                          {
                            id: 'e30',
                            e: 'app != details and version=v1',
                            d: `app不等于'details'且version等于'v1'的节点`
                          },
                          { id: 'e40', e: '!sc', d: `没有sidecar的节点` },
                          { id: 'e50', e: 'httpin > 0.5', d: `HTTP入站速率 > 0.5 rps的节点` },
                          { id: 'e60', e: 'tcpout >= 1000', d: `TCP发送速率 >= 1000 bps的节点` },
                          { id: 'e65', e: '!traffic', d: '无流量' },
                          { id: 'e70', e: 'http > 0.5', d: `HTTP速率大于0.5rps` },
                          {
                            id: 'e80',
                            e: 'rt > 500',
                            d: `响应时间大于500毫秒（需要响应时间边缘标签）`
                          },
                          {
                            id: 'e90',
                            e: '%httptraffic >= 50.0',
                            d: `父节点HTTP出站请求流量大于50%的连接`
                          }
                        ]}
                      />
                    </TablePfProvider>
                  </TabPane>
                </TabContent>
              </>
            </TabContainer>
          </div>
        </div>
      </Draggable>
    );
  }
}
