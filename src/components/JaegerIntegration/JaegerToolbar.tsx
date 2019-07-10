import * as React from 'react';
import { ExpandCollapse } from 'patternfly-react';
import { Form, FormGroup, Grid, GridItem, InputGroup, TextInput } from '@patternfly/react-core';
import ServiceDropdown from './ServiceDropdown';
import LookBack from './LookBack';
import RightToolbar from './RightToolbar';
import TagsControl from './TagsControl';
import {
  getUnixTimeStampInMSFromForm,
  logfmtTagsConv,
  getFormFromUnixTimeStamp,
  JaegerSearchOptions,
  TracesDate
} from './RouteHelper';
import { HistoryManager, URLParam } from '../../app/History';
import { style } from 'typestyle';

const separator = style({ borderBottom: '1px solid #d1d1d1;', marginBottom: '10px' });

interface JaegerToolbarProps {
  disableSelectorNs?: boolean;
  tagsValue?: string;
  limit?: number;
  serviceSelected?: string;
  updateURL: (url: JaegerSearchOptions) => void;
  disabled?: boolean;
}

interface JaegerToolbarState {
  tags: string;
  limit: number;
  lookback: string;
  dateTimes: TracesDate;
  minDuration: string;
  maxDuration: string;
  serviceSelected: string;
}

export class JaegerToolbar extends React.Component<JaegerToolbarProps, JaegerToolbarState> {
  defaultLookback = 3600;

  constructor(props: JaegerToolbarProps) {
    super(props);
    const start = HistoryManager.getParam(URLParam.JAEGER_START_TIME);
    const end = HistoryManager.getParam(URLParam.JAEGER_END_TIME);
    const lookback = HistoryManager.getParam(URLParam.JAEGER_LOOKBACK);
    const startDateTime =
      start && lookback === 'custom'
        ? getFormFromUnixTimeStamp(Number(start) / 1000)
        : getFormFromUnixTimeStamp(0, -60 * 60 * 1000);
    const endDateTime =
      end && lookback === 'custom' ? getFormFromUnixTimeStamp(Number(end) / 1000) : getFormFromUnixTimeStamp(0);

    this.state = {
      tags: logfmtTagsConv(HistoryManager.getParam(URLParam.JAEGER_TAGS)) || this.props.tagsValue || '',
      limit: Number(HistoryManager.getParam(URLParam.JAEGER_LIMIT_TRACES) || '20'),
      minDuration: HistoryManager.getParam(URLParam.JAEGER_MIN_DURATION) || '',
      maxDuration: HistoryManager.getParam(URLParam.JAEGER_MAX_DURATION) || '',
      lookback: HistoryManager.getParam(URLParam.JAEGER_LOOKBACK) || String(this.defaultLookback),
      serviceSelected: HistoryManager.getParam(URLParam.JAEGER_SERVICE_SELECTOR) || this.props.serviceSelected || '',
      dateTimes: { start: startDateTime, end: endDateTime }
    };
    if (HistoryManager.getParam(URLParam.JAEGER_SERVICE_SELECTOR) || this.props.serviceSelected) {
      this.onRequestTraces();
    }
  }

  onChangeLookBackCustom = (step: string, dateField: string, timeField: string) => {
    const current = this.state.dateTimes;
    if (dateField) {
      current[step].date = dateField;
    }
    if (timeField) {
      current[step].time = timeField;
    }
    this.setState({ dateTimes: current });
  };

  onRequestTraces = () => {
    const toTimestamp = getUnixTimeStampInMSFromForm(
      this.state.dateTimes.start.date,
      this.state.dateTimes.start.time,
      this.state.dateTimes.end.date,
      this.state.dateTimes.end.time
    );
    const options: JaegerSearchOptions = {
      start: toTimestamp.start,
      end: toTimestamp.end,
      serviceSelected: this.state.serviceSelected,
      limit: this.state.limit,
      lookback: this.state.lookback,
      minDuration: this.state.minDuration,
      maxDuration: this.state.maxDuration,
      tags: this.state.tags
    };

    this.props.updateURL(options);
  };

  render() {
    const { disableSelectorNs } = this.props;
    const { dateTimes, lookback } = this.state;

    const tz = lookback === '0' ? new Date().toTimeString().replace(/^.*?GMT/, 'UTC') : null;

    return (
      <>
        <Grid>
          {!disableSelectorNs && (
            <>
              <GridItem span={4}>
                <Form isHorizontal={true}>
                  <FormGroup label={'服务'} isRequired={true} fieldId={'service_jaeger_form'}>
                    <ServiceDropdown
                      service={this.state.serviceSelected}
                      setService={(service: string) => this.setState({ serviceSelected: service })}
                    />
                  </FormGroup>
                </Form>
              </GridItem>
              <GridItem span={1} />
            </>
          )}
          <GridItem span={4}>
            <Form isHorizontal={true}>
              <FormGroup label={'回顾'} isRequired={true} fieldId={'lookback_jaeger_form'}>
                <LookBack
                  lookback={this.state.lookback !== 'custom' ? Number(this.state.lookback) : 0}
                  setLookback={(value, event) => {
                    this.setState({ lookback: value });
                  }}
                />
              </FormGroup>
            </Form>
          </GridItem>
          <GridItem span={1} />
          <GridItem span={disableSelectorNs ? 7 : 2}>
            <RightToolbar disabled={this.state.serviceSelected === ''} onSubmit={this.onRequestTraces} />
          </GridItem>
          {tz && (
            <>
              <GridItem span={12} className={separator}>
                自定义时间
              </GridItem>
              <GridItem span={4}>
                <Form isHorizontal={true}>
                  <FormGroup label={'开始时间'} fieldId={'dateTimeStartJaegerTraces'} helperText={<>时间以{tz}表示</>}>
                    <InputGroup>
                      <TextInput
                        value={dateTimes.start.date}
                        type="date"
                        onChange={value => this.onChangeLookBackCustom('start', value, '')}
                        aria-label="datestartJaegerTraces"
                      />
                      <TextInput
                        value={dateTimes.start.time}
                        type="time"
                        onChange={value => this.onChangeLookBackCustom('start', '', value)}
                        aria-label="timestartJaegerTraces"
                      />
                    </InputGroup>
                  </FormGroup>
                </Form>
              </GridItem>
              <GridItem span={1} />
              <GridItem span={4}>
                <Form isHorizontal={true}>
                  <FormGroup label={'结束时间'} fieldId={'dateTimeEndJaegerTraces'} helperText={<>时间以{tz}表示</>}>
                    <InputGroup>
                      <TextInput
                        value={dateTimes.end.date}
                        type="date"
                        onChange={value => this.onChangeLookBackCustom('end', value, '')}
                        aria-label="dateendJaegerTraces"
                      />
                      <TextInput
                        value={dateTimes.end.time}
                        type="time"
                        onChange={value => this.onChangeLookBackCustom('end', '', value)}
                        aria-label="timeendJaegerTraces"
                      />
                    </InputGroup>
                  </FormGroup>
                </Form>
              </GridItem>
              <GridItem span={3} />
              <GridItem span={12} className={separator} />
            </>
          )}
        </Grid>
        <ExpandCollapse textCollapsed="显示高级选项" textExpanded="隐藏高级选项">
          <Grid>
            <GridItem span={7}>
              <TagsControl tags={this.state.tags} onChange={value => this.setState({ tags: value })} />
            </GridItem>
            <GridItem span={1} />
            <GridItem span={3}>
              <Form isHorizontal={true}>
                <FormGroup label="限制结果" isRequired={true} fieldId="horizontal-form-name">
                  <TextInput
                    value={this.state.limit}
                    type="number"
                    onChange={value => this.setState({ limit: Number(value) })}
                    aria-label="tagsJaegerTraces"
                  />
                </FormGroup>
              </Form>
            </GridItem>
            <GridItem span={1} />
            <GridItem span={12} className={separator}>
              跨度配置
            </GridItem>
            <GridItem span={2}>
              <Form isHorizontal={true}>
                <FormGroup
                  label="最小持续时间"
                  fieldId="form-minDurationSpanJaegerTraces"
                  helperText="例如1.2s、100ms、500us"
                >
                  <TextInput
                    value={this.state.minDuration}
                    type="text"
                    onChange={value => this.setState({ minDuration: value })}
                    aria-label="minDurationSpanJaegerTraces"
                  />
                </FormGroup>
              </Form>
            </GridItem>
            <GridItem span={1} />
            <GridItem span={2}>
              <Form isHorizontal={true}>
                <FormGroup label="最大持续时间" fieldId="form-maxDurationSpanJaegerTraces" helperText="例如1.1s">
                  <TextInput
                    value={this.state.minDuration}
                    type="text"
                    onChange={value => this.setState({ maxDuration: value })}
                    aria-label="maxDurationSpanJaegerTraces"
                  />
                </FormGroup>
              </Form>
            </GridItem>
            <GridItem span={1} />
          </Grid>
        </ExpandCollapse>
      </>
    );
  }
}
