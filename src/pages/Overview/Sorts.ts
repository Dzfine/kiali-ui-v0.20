import { SortField } from '../../types/SortFilters';
import NamespaceInfo from './NamespaceInfo';

export namespace Sorts {
  export const sortFields: SortField<NamespaceInfo>[] = [
    {
      id: 'namespace',
      title: '名称',
      isNumeric: false,
      param: 'ns',
      compare: (a: NamespaceInfo, b: NamespaceInfo) => a.name.localeCompare(b.name)
    },
    {
      id: 'health',
      title: '状态',
      isNumeric: false,
      param: 'h',
      compare: (a: NamespaceInfo, b: NamespaceInfo) => {
        if (a.status && b.status) {
          let diff = b.status.inError.length - a.status.inError.length;
          if (diff !== 0) {
            return diff;
          }
          diff = b.status.inWarning.length - a.status.inWarning.length;
          if (diff !== 0) {
            return diff;
          }
        } else if (a.status) {
          return -1;
        } else if (b.status) {
          return 1;
        }
        // default comparison fallback
        return a.name.localeCompare(b.name);
      }
    },
    {
      id: 'mtls',
      title: 'mTLS',
      isNumeric: false,
      param: 'm',
      compare: (a: NamespaceInfo, b: NamespaceInfo) => {
        if (a.tlsStatus && b.tlsStatus) {
          return a.tlsStatus.status.localeCompare(b.tlsStatus.status);
        } else if (a.tlsStatus) {
          return -1;
        } else if (b.tlsStatus) {
          return 1;
        }

        // default comparison fallback
        return a.name.localeCompare(b.name);
      }
    }
  ];

  export const sortFunc = (
    allNamespaces: NamespaceInfo[],
    sortField: SortField<NamespaceInfo>,
    isAscending: boolean
  ) => {
    return allNamespaces.sort(isAscending ? sortField.compare : (a, b) => sortField.compare(b, a));
  };
}
