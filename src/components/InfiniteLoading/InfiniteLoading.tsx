// import React, { useState } from 'react';
// import { ScrollView } from '@tarojs/components';
// import { PullToRefresh } from '@nutui/nutui-react-taro';
// import '@nutui/nutui-react-taro/dist/esm/PullToRefresh/style/css.js';
// import './PullToRefresh.scss';

// interface Props {
//   children: React.ReactNode;
//   height: string;
//   onRefresh?: () => Promise<any>
// }
// const Demo2 = ({ children, height, onRefresh }: Props) => {
//   const [scrollTop, setScrollTop] = useState(0);
//   return (
//     <ScrollView
//       style={{ height }}
//       scrollY
//       onScrollEnd={(e) => {
//         // scrollTop > 0, PullToRefresh 不触发 touchmove 事件。
//         if (e.detail?.scrollTop) {
//           setScrollTop(e.detail?.scrollTop);
//         }
//       }}
//     >
//       <PullToRefresh
//         className="pulltorefresh"
//         scrollTop={scrollTop}
//         onRefresh={onRefresh}
//       >
//         {children}
//       </PullToRefresh>
//     </ScrollView>
//   );
// };

// export default Demo2;
import React from 'react';
import { InfiniteLoading } from '@nutui/nutui-react-taro';
import '@nutui/nutui-react-taro/dist/esm/InfiniteLoading/style/css.js';
import './InfiniteLoading.scss';
import { View } from '@tarojs/components';

interface Props {
  children: React.ReactNode;
  className: string;
  hasMore: boolean;
  loadMoreText?: string;
  onRefresh?: () => Promise<any>
  onLoadMore?: () => Promise<any>
}
const Demo2 = ({
  children, className, hasMore, loadMoreText, onRefresh, onLoadMore,
}: Props) => {
  return (
    <InfiniteLoading
      className={`InfiniteLoading ${className}`}
      pullingText={(
        <>
          下拉刷新
        </>
      )}
      loadingText={(
        <>
          加载中
        </>
      )}
      target="refreshScroll"
      pullRefresh
      loadMoreText={loadMoreText}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      onRefresh={onRefresh}
    >
      {children}
    </InfiniteLoading>
  );
};
export default Demo2;
