import * as MessageCenter from '../utils/MessageCenter';
import * as API from '../services/Api';
import { GraphDefinition, NodeParamsType } from '../types/Graph';

export const fetchTrafficDetails = (
  node: NodeParamsType,
  restParams: any
): Promise<GraphDefinition | undefined | null> => {
  return API.getNodeGraphElements(node, restParams).then(
    (response: any) => {
      // Check that response is formed as expected.
      if (!response.data || !response.data.elements || !response.data.elements.nodes || !response.data.elements.edges) {
        MessageCenter.add('流量数据不佳');
        return;
      }

      return response.data;
    },
    error => {
      MessageCenter.add(API.getErrorMsg('无法获取流量数据', error));
      return undefined;
    }
  );
};
