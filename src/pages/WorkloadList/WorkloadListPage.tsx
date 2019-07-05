import * as React from 'react';
import { Breadcrumb } from 'patternfly-react';
import { ListPagesHelper } from '../../components/ListPage/ListPagesHelper';
import WorkloadListContainer from './WorkloadListComponent';
import { WorkloadListFilters } from './FiltersAndSorts';

const WorkloadListPage: React.SFC<{}> = () => {
  return (
    <>
      <Breadcrumb title={true}>
        <Breadcrumb.Item active={true}>工作负载</Breadcrumb.Item>
      </Breadcrumb>
      <WorkloadListContainer
        pagination={ListPagesHelper.currentPagination()}
        currentSortField={ListPagesHelper.currentSortField(WorkloadListFilters.sortFields)}
        isSortAscending={ListPagesHelper.isCurrentSortAscending()}
        rateInterval={ListPagesHelper.currentDuration()}
      />
    </>
  );
};

export default WorkloadListPage;
