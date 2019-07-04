import { StepPlacement } from '../../components/Tour/Tour';
import { StatefulStep } from '../../components/Tour/StatefulTour';

const GraphHelpTour: Array<StatefulStep> = [
  {
    placement: StepPlacement.BOTTOM_START,
    offset: 0,
    target: '#namespace-selector',
    name: '命名空间',
    description: '选择您想要在图表中显示的命名空间。'
  },
  {
    placement: StepPlacement.RIGHT,
    offset: 0,
    target: '#graph_filter_view_type',
    name: '图表类型',
    description:
      '选择工作负载，服务或应用程序图表视图。可以选择对应用程序视图进行版本控制，并依赖于应用程序和版本标签。工作负载和服务图分别提供物理和逻辑视图。'
  },
  {
    offset: 0,
    target: '#graph_filter_edge_labels',
    name: '边缘标签',
    description: '选择要在节点之间的边缘线上显示的信息。 Response times reflect the 95th percentile.'
  },
  {
    offset: 0,
    target: '#graph_settings',
    name: '显示',
    description: '切换各种显示选项，例如标记流量动画和服务节点。'
  },
  {
    offset: 0,
    target: '#graph_find',
    name: '查找和隐藏',
    description: '通过类型化表达式突出显示或隐藏图表元素。单击查找/隐藏帮助图标以获取详细信息。'
  },
  {
    placement: StepPlacement.BOTTOM,
    offset: -120,
    target: '#cytoscape-container',
    isVisible: target => {
      return target.contains(document.querySelector('#cy'));
    },
    name: '图表',
    description:
      '单击一个节点以查看其摘要并强调其端到端路径。双击节点以查看关注该节点的图表。\n双击“外部名称空间”节点，直接导航到节点文本标签中的命名空间。'
  },
  {
    offset: 0,
    target: '#toolbar_layout_group',
    name: '布局选择器',
    description:
      '选择网格的图形布局。不同的布局最好用于不同的网格。找到最有效的布局。这里的其他按钮提供缩放和适合屏幕选项。'
  },
  {
    offset: 0,
    target: '#toolbar_toggle_legend',
    name: '图例',
    description: '显示图例以了解不同形状，颜色和背景的含义。'
  }
];

export default GraphHelpTour;
