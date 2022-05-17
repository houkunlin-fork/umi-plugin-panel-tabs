import React, { useContext, useRef } from 'react';
import type { FC } from 'react';
// @ts-ignore
import { useAliveController } from 'react-activation';
import PanelTab from './PanelTab';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { RouteContext } from '@ant-design/pro-layout';
import './index.less';

const PanelTabs: FC = () => {
  const { getCachingNodes } = useAliveController();
  const cachingNodes = getCachingNodes();
  const routeContext = useContext(RouteContext);
  const scrollContainer = useRef<HTMLDivElement>();

  return (
    <div className={'panel-tabs-box'}>
      <div className={'panel-tabs-bar'}
           ref={scrollContainer}
           style={{ width: `calc(100% - ${routeContext.siderWidth}px)` }}>
        {cachingNodes.map((node, idx) => (
          <PanelTab key={idx} node={node} />
        ))}
        <Space className={'panel-tabs-bar-more'}>
          <CaretLeftOutlined
            style={{ display: 'inline-block', cursor: 'pointer' }}
            onClick={() =>
              (scrollContainer.current.scrollLeft = scrollContainer.current.scrollLeft - 100)
            }
          />
          <CaretRightOutlined
            style={{ display: 'inline-block', cursor: 'pointer' }}
            onClick={() =>
              (scrollContainer.current.scrollLeft = scrollContainer.current.scrollLeft + 100)
            }
          />
        </Space>
      </div>
    </div>
  );
};

export default PanelTabs;
