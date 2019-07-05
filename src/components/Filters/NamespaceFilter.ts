import * as API from '../../services/Api';
import { FILTER_ACTION_APPEND, FilterType } from '../../types/Filters';

export class NamespaceFilter {
  static id = 'namespaces';
  static category = '命名空间';

  static create = (): FilterType => {
    return {
      id: NamespaceFilter.id,
      title: NamespaceFilter.category,
      placeholder: '按命名空间筛选',
      filterType: 'select',
      action: FILTER_ACTION_APPEND,
      filterValues: [],
      loader: () =>
        API.getNamespaces().then(response => {
          return response.data.map(ns => ({ title: ns.name, id: ns.name }));
        })
    };
  };
}

export default NamespaceFilter;
