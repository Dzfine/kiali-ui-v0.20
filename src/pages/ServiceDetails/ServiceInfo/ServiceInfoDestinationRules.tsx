import * as React from 'react';
import { Col, Row, Table } from 'patternfly-react';
import * as resolve from 'table-resolver';
import LocalTime from '../../../components/Time/LocalTime';
import DetailObject from '../../../components/Details/DetailObject';
import { Link } from 'react-router-dom';
import { ConfigIndicator } from '../../../components/ConfigValidation/ConfigIndicator';
import { DestinationRule, ObjectValidation, Subset } from '../../../types/IstioObjects';
import Labels from '../../../components/Label/Labels';
import { safeRender } from '../../../utils/SafeRender';

interface ServiceInfoDestinationRulesProps {
  destinationRules?: DestinationRule[];
  validations: { [key: string]: ObjectValidation };
}

class ServiceInfoDestinationRules extends React.Component<ServiceInfoDestinationRulesProps> {
  constructor(props: ServiceInfoDestinationRulesProps) {
    super(props);
  }

  headerFormat = (label, { column }) => <Table.Heading className={column.property}>{label}</Table.Heading>;
  cellFormat = (value, { column }) => {
    const props = column.cell.props;
    const className = props ? props.align : '';

    return <Table.Cell className={className}>{value}</Table.Cell>;
  };

  columns() {
    return {
      columns: [
        {
          property: 'status',
          header: {
            label: '状态',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'name',
          header: {
            label: '名称',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'trafficPolicy',
          header: {
            label: '流量策略',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'subsets',
          header: {
            label: '子集',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'host',
          header: {
            label: '主机',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'createdAt',
          header: {
            label: '创建于',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'resourceVersion',
          header: {
            label: '资源版本',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'actions',
          header: {
            label: '操作',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        }
      ]
    };
  }

  yamlLink(destinationRule: DestinationRule) {
    return (
      <Link
        to={
          '/namespaces/' +
          destinationRule.metadata.namespace +
          '/istio/destinationrules/' +
          destinationRule.metadata.name +
          '?list=yaml'
        }
      >
        查看YAML
      </Link>
    );
  }

  hasValidations(destinationRule: DestinationRule): boolean {
    return !!this.props.validations && !!this.props.validations[destinationRule.metadata.name];
  }

  validation(destinationRule: DestinationRule): ObjectValidation {
    return this.props.validations[destinationRule.metadata.name];
  }

  overviewLink(destinationRule: DestinationRule) {
    return (
      <Link
        to={
          '/namespaces/' +
          destinationRule.metadata.namespace +
          '/istio/destinationrules/' +
          destinationRule.metadata.name +
          '?list=overview'
        }
      >
        {destinationRule.metadata.name}
      </Link>
    );
  }

  rows() {
    return (this.props.destinationRules || []).map((destinationRule, vsIdx) => {
      return {
        id: vsIdx,
        name: this.overviewLink(destinationRule),
        status: (
          <ConfigIndicator
            id={vsIdx + '-config-validation'}
            validations={this.hasValidations(destinationRule) ? [this.validation(destinationRule)] : []}
          />
        ),
        trafficPolicy: destinationRule.spec.trafficPolicy ? (
          <DetailObject name="" detail={destinationRule.spec.trafficPolicy} />
        ) : (
          'None'
        ),
        subsets:
          destinationRule.spec.subsets && destinationRule.spec.subsets.length > 0
            ? this.generateSubsets(destinationRule.spec.subsets)
            : 'None',
        host: destinationRule.spec.host ? <DetailObject name="" detail={destinationRule.spec.host} /> : undefined,
        createdAt: <LocalTime time={destinationRule.metadata.creationTimestamp || ''} />,
        resourceVersion: destinationRule.metadata.resourceVersion,
        actions: this.yamlLink(destinationRule)
      };
    });
  }

  generateKey() {
    return (
      'key_' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  generateSubsets(subsets: Subset[]) {
    const childrenList = subsets.map(subset => (
      <li key={this.generateKey() + '_k' + subset.name} style={{ marginBottom: '13px' }}>
        <Row>
          <Col xs={3}>
            <span style={{ paddingRight: '10px', paddingTop: '3px' }}>{safeRender(subset.name)}</span>{' '}
          </Col>
          <Col xs={4}>
            <Labels labels={subset.labels} />
          </Col>
          <Col xs={4}>
            <DetailObject name={subset.trafficPolicy ? 'trafficPolicy' : ''} detail={subset.trafficPolicy} />
          </Col>
        </Row>
      </li>
    ));
    return <ul style={{ listStyleType: 'none', paddingLeft: '0px' }}>{childrenList}</ul>;
  }

  renderTable() {
    return (
      <Table.PfProvider columns={this.columns().columns} striped={true} bordered={true} hover={true} dataTable={true}>
        <Table.Header headerRows={resolve.headerRows(this.columns())} />
        <Table.Body rows={this.rows()} rowKey="id" />
      </Table.PfProvider>
    );
  }

  render() {
    return (
      <Row className="card-pf-body">
        <Col xs={12}>{this.renderTable()}</Col>
      </Row>
    );
  }
}

export default ServiceInfoDestinationRules;
