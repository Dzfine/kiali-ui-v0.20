import { SortField } from '../../types/SortFilters';
import { IstioConfigItem } from '../../types/IstioConfigList';
import { FILTER_ACTION_APPEND, FILTER_ACTION_UPDATE, FilterType } from '../../types/Filters';

export namespace IstioConfigListFilters {
  export const getType = (item: IstioConfigItem): string => {
    return item.type === 'adapter'
      ? item.type + '_' + item.adapter!.adapter
      : item.type === 'template'
      ? item.type + '_' + item.template!.template
      : item.type;
  };
  export const sortFields: SortField<IstioConfigItem>[] = [
    {
      id: 'namespace',
      title: '命名空间',
      isNumeric: false,
      param: 'ns',
      compare: (a: IstioConfigItem, b: IstioConfigItem) => {
        return a.namespace.localeCompare(b.namespace) || a.name.localeCompare(b.name);
      }
    },
    {
      id: 'istiotype',
      title: 'Istio类型',
      isNumeric: false,
      param: 'it',
      compare: (a: IstioConfigItem, b: IstioConfigItem) => {
        return getType(a).localeCompare(getType(b)) || a.name.localeCompare(b.name);
      }
    },
    {
      id: 'istioname',
      title: 'Istio名称',
      isNumeric: false,
      param: 'in',
      compare: (a: IstioConfigItem, b: IstioConfigItem) => {
        // On same name order is not well defined, we need some fallback methods
        // This happens specially on adapters/templates where Istio 1.0.x calls them "handler"
        // So, we have a lot of objects with same namespace+name
        return (
          a.name.localeCompare(b.name) || a.namespace.localeCompare(b.namespace) || getType(a).localeCompare(getType(b))
        );
      }
    },
    {
      id: 'configvalidation',
      title: '配置',
      isNumeric: false,
      param: 'cv',
      compare: (a: IstioConfigItem, b: IstioConfigItem) => {
        let sortValue = -1;
        if (a.validation && !b.validation) {
          sortValue = -1;
        } else if (!a.validation && b.validation) {
          sortValue = 1;
        } else if (!a.validation && !b.validation) {
          sortValue = 0;
        } else if (a.validation && b.validation) {
          if (a.validation.valid && !b.validation.valid) {
            sortValue = -1;
          } else if (!a.validation.valid && b.validation.valid) {
            sortValue = 1;
          } else if (a.validation.valid && b.validation.valid) {
            sortValue = a.validation.checks.length - b.validation.checks.length;
          } else if (!a.validation.valid && !b.validation.valid) {
            sortValue = b.validation.checks.length - a.validation.checks.length;
          }
        }

        return sortValue || a.name.localeCompare(b.name);
      }
    }
  ];

  export const istioNameFilter: FilterType = {
    id: 'istioname',
    title: 'Istio名称',
    placeholder: '按照Istio名称筛选',
    filterType: 'text',
    action: FILTER_ACTION_UPDATE,
    filterValues: []
  };

  export const istioTypeFilter: FilterType = {
    id: 'istiotype',
    title: 'Istio类型',
    placeholder: '按照Istio类型筛选',
    filterType: 'select',
    action: FILTER_ACTION_APPEND,
    filterValues: [
      {
        id: 'Gateway',
        title: 'Gateway'
      },
      {
        id: 'VirtualService',
        title: 'VirtualService'
      },
      {
        id: 'DestinationRule',
        title: 'DestinationRule'
      },
      {
        id: 'ServiceEntry',
        title: 'ServiceEntry'
      },
      {
        id: 'Rule',
        title: 'Rule'
      },
      {
        id: 'Adapter',
        title: 'Adapter'
      },
      {
        id: 'Template',
        title: 'Template'
      },
      {
        id: 'QuotaSpec',
        title: 'QuotaSpec'
      },
      {
        id: 'QuotaSpecBinding',
        title: 'QuotaSpecBinding'
      },
      {
        id: 'Policy',
        title: 'Policy'
      },
      {
        id: 'MeshPolicy',
        title: 'MeshPolicy'
      },
      {
        id: 'ClusterRbacConfig',
        title: 'ClusterRbacConfig'
      },
      {
        id: 'RbacConfig',
        title: 'RbacConfig'
      },
      {
        id: 'ServiceRole',
        title: 'ServiceRole'
      },
      {
        id: 'ServiceRoleBinding',
        title: 'ServiceRoleBinding'
      }
    ]
  };

  export const configValidationFilter: FilterType = {
    id: 'configvalidation',
    title: '配置',
    placeholder: '根据配置验证筛选',
    filterType: 'select',
    action: FILTER_ACTION_APPEND,
    filterValues: [
      {
        id: 'valid',
        title: '有效'
      },
      {
        id: 'warning',
        title: '警告'
      },
      {
        id: 'notvalid',
        title: '无效'
      },
      {
        id: 'notvalidated',
        title: '未验证'
      }
    ]
  };

  export const availableFilters: FilterType[] = [istioTypeFilter, istioNameFilter, configValidationFilter];

  export const sortIstioItems = (
    unsorted: IstioConfigItem[],
    sortField: SortField<IstioConfigItem>,
    isAscending: boolean
  ) => {
    const sortPromise: Promise<IstioConfigItem[]> = new Promise((resolve, reject) => {
      resolve(unsorted.sort(isAscending ? sortField.compare : (a, b) => sortField.compare(b, a)));
    });

    return sortPromise;
  };
}
