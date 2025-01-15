import {
  View, Map, Image,
  MapProps,
} from '@tarojs/components';
import Taro, { useLoad, useReady } from '@tarojs/taro';
import './index.scss';
import {
  useCallback,
  useEffect, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from '@tarojs/runtime';
import iconSearch from '@/images/map/search.png';
import iconSearchLocation from '@/images/map/searchLocation.png';
import footerApplyAnnotation from '@/images/map/footerApplyAnnotation.svg';
import footerMyApplication from '@/images/map/footerMyApplication.svg';
import iconAnnotation from '@/images/map/annotation.png';
import iconApplication from '@/images/map/application.png';
import { getLocation } from '@/utils/utils';
import MapAlertPage from './MapAlertPage';
import ApplyAnnotation from './ApplyAnnotation';
import { getMapInfo, getMapList } from '@/api';
import MapAlertPageExpand from './MapAlertPageExpand';
import useMarkerLock from './hooks/useMarkerLock';

const getIconPath = (type, sel?: boolean) => {
  let iconPath = `/images/marker/markerFriendly${sel ? 'Sel' : ''}.png`;
  if (type === 'MAP_TYPE_GRUFF') {
    iconPath = `/images/marker/markerUnfriendly${sel ? 'Sel' : ''}.png`;
  }
  if (type === 'MAP_TYPE_POI') {
    iconPath = `/images/marker/markerPoisoning${sel ? 'Sel' : ''}.png`;
  }
  return iconPath;
};

export default function Index() {
  const { t } = useTranslation();
  const mapContextRef = useRef<Taro.MapContext | null>(null);
  const hasIncludedPoints = useRef(false);
  const [location, setLocation] = useState({
    longitude: 116.39742222222222,
    latitude: 39.90922222222222,
  });
  /** 友好 不友好 投毒 */
  const [activeIndex, setActiveIndex] = useState<ActiveIndexState>({
    MAP_TYPE_NICE: true,
    MAP_TYPE_GRUFF: true,
    MAP_TYPE_POI: true,
  });
  /** 点位marker的详细信息 */
  const [markerInfo, setMarkerInfo] = useState<any>();
  const { isLocked, lockMarker } = useMarkerLock();
  /** 地图的markers数据 */
  const [markers, setMarkers] = useState<any[]>([]);
  /** markers req原始数据 */
  const markerList = useRef<any[]>([]);
  /** markers 转换后没有选中的基础数据 */
  const markersDefault = useRef<any[]>([]);
  /** 选点回显的marker */
  const markerPoint = useRef<any>();
  /** 最近的点 */
  const [recentlyPoint, setRecentlyPoint] = useState<any>(null);
  /** 地图载入完成 */
  const mapInitComplete = useRef(false);
  /** 显示申请标准 */
  const [applyAnnotationInfo, setApplyAnnotationInfo] = useState<true | null>(null);
  /** 获取用户定位 */
  const setUserLocation = () => {
    getLocation().then((res) => {
      const { longitude, latitude } = res;
      setLocation({ longitude, latitude });
    });
  };
  /** 获取地图实例 */
  const getMapRef = () => {
    if (!mapContextRef.current) {
      mapContextRef.current = Taro.createMapContext('petFriendlyMap', this);
    }
    return mapContextRef.current;
  };
  /** 区域数据转为 marker可用格式 id选中的marker的id实际为index */
  const getMarkers = useCallback((data?: any[], id?: number) => {
    if (!data) {
      if (markerPoint.current) {
        return [markerPoint.current, ...markersDefault.current];
      }
      return markersDefault.current;
    }
    const marker: MapProps.marker[] = [];
    data.forEach((item, index) => {
      if (item.latitude && item.longitude) {
        if (!hasIncludedPoints.current && item.recently) {
          setRecentlyPoint(item);
        }
        const markerObj: MapProps.marker = {
          id: index, // 简单以索引作为marker的id
          latitude: item.latitude,
          longitude: item.longitude,
          width: 32,
          height: 32,
          zIndex: 1,
          iconPath: getIconPath(item.type),
        };
        if (id && index === id) {
          markerObj.zIndex = 200;
          markerObj.iconPath = getIconPath(item.type, true);
          markerObj.width = 42;
          markerObj.height = 37;
          markerObj.anchor = {
            x: 0.5,
            y: 0.8,
          };
        }
        marker.push(markerObj);
      }
    });
    if (markerPoint.current) {
      marker.push(markerPoint.current);
    }
    return marker;
  }, []);
  // 获取xx区域列表
  const getArea = useCallback(async (typeList: string[], lat?: number, lng?: number) => {
    try {
      if (typeList.length === 0) return;
      let latitude = lat;
      let longitude = lng;
      // 如果没有经纬度，则使用当前地图中心位置
      if (!lat || !lng) {
        ({ latitude, longitude } = await getMapRef().getCenterLocation());
      }
      const res = await getMapList({
        typeList,
        latitude,
        longitude,
      });
      console.log('res', res);

      const marker = getMarkers(res.data);
      markersDefault.current = marker;
      markerList.current = res.data;
      setMarkers(marker);
    } catch (error) {
      console.error('Error fetching area:', error);
      throw error;
    }
  }, [getMarkers]);
  // 获取区域详情
  const getAreaInfo = (id) => {
    getMapInfo({ id }).then((res) => {
      // console.log('res', res);
      setMarkerInfo(res.data);
    });
  };

  /** 移动到用户位置 */
  const moveLocation = () => {
    const mapRef = getMapRef();
    mapRef.moveToLocation({});
  };
  const onceMove = useRef(false);
  /** 地图移动end事件 */
  const onRegionChange = debounce((e) => {
    console.log('🚀 ~ onRegionChange ~ e:', e.detail.centerLocation);
    const { longitude, latitude } = e.detail.centerLocation;
    const activeKeys = Object.keys(activeIndex).filter((key) => activeIndex[key]);
    getArea(activeKeys, latitude, longitude);
    onceMove.current = true;
  }, 500);

  useReady(() => {
    Taro.setNavigationBarTitle({
      title: t('map.title'),
    });
    setUserLocation();
    // setUserLocation();

    // console.log(extractAddressInfo('广西壮族自治区西双版纳自治州上自治县海市县上海市bb区省钱开爱爱市区县区'));
  });
  useLoad((options) => {
    console.log('🚀 ~ useLoad ~ options:', options);
    if (options.id && options.id !== 'null') {
      getAreaInfo(options.id);
    }
  });
  /** 地图选点回调 */
  const chooseLocationCb = (res) => {
    const map = Taro.createMapContext('petFriendlyMap', this);
    map.moveToLocation({
      longitude: res.longitude,
      latitude: res.latitude,
    });
    const markerIndex = markers.findIndex((n) => n.id === 9999);
    markerPoint.current = {
      id: 9999,
      zIndex: 100,
      longitude: res.longitude,
      latitude: res.latitude,
      iconPath: '/images/marker/point.png',
      width: 31,
      height: 51,
    };
    if (markerIndex !== -1) {
      // 如果找到标记，则更新其经纬度
      setMarkers((pre) => {
        const newMarkers = [...pre];
        newMarkers[markerIndex] = {
          ...newMarkers[markerIndex],
          longitude: res.longitude,
          latitude: res.latitude,
        };
        return newMarkers;
      });
    } else {
      // 如果没有找到标记，则添加新的标记
      setMarkers((pre) => [...pre, {
        id: 9999,
        longitude: res.longitude,
        latitude: res.latitude,
        iconPath: '/images/marker/point.png',
        width: 31,
        height: 51,

      }]);
    }
  };
  // 查看信息的时候修改地图中心偏移值
  useEffect(() => {
    let y = 0.5;
    if (markerInfo?.id) {
      y = 0.2;
    } else {
      // 取消选中marker
      setMarkers(getMarkers());
    }
    const mapRef = getMapRef();
    mapRef.setCenterOffset({
      offset: [0.5, y],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerInfo]);
  /* 修改展示区域 请求数据 */
  useEffect(() => {
    // 初始不在这获取区域数据，交给onRegionChange
    if (activeIndex && mapInitComplete.current) {
      const activeKeys = Object.keys(activeIndex).filter((key) => activeIndex[key]);
      getArea(activeKeys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);
  useEffect(() => {
    if (recentlyPoint && location.latitude
      && location.longitude && !hasIncludedPoints.current) {
      lockMarker(1000);
      console.log('🚀 ~ useEffect ~ lockMarker:', isLocked());
      getMapRef().includePoints({
        points: [
          {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          {
            latitude: recentlyPoint.latitude,
            longitude: recentlyPoint.longitude,
          },
        ],
        padding: [120, 120, 120, 120],
      });
      hasIncludedPoints.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, recentlyPoint]);
  return (
    <View className="vwh100 container">
      <Map
        className="wh100 map"
        id="petFriendlyMap"
        longitude={location.longitude}
        latitude={location.latitude}
        markers={markers}
        showLocation
        onError={(e) => console.log(e)}
        onUpdated={() => {
          if (!mapInitComplete.current) {
            mapInitComplete.current = true;
            moveLocation();
          }

          //
        }}
        onRegionChange={(e) => {
          if (onceMove.current && markerList.current.length > 0) return;

          if (e.detail.type === 'end' && !isLocked()) {
            onRegionChange(e);
          }
          // console.log('🚀 ~ Index ~ !isLocked():', !isLocked());
        }}
        onTap={() => {

        }}
        onMarkerTap={(e) => {
          console.log(e);
          const marker = markerList.current[e.detail.markerId || e.markerId];
          if (marker) {
            lockMarker(2000);
            console.log('onMarkerTap:', marker, markerList.current);
            setMarkers(getMarkers(markerList.current, Number(e.detail.markerId)));
            const map = Taro.createMapContext('petFriendlyMap', this);
            map.moveToLocation({
              longitude: marker.longitude,
              latitude: marker.latitude,
            });
            setLocation({
              longitude: marker.longitude,
              latitude: marker.latitude,
            });
            getAreaInfo(marker.id);
          }
          // setMarkerInfo(markerInfo ? null : {id: e.detail.markerId || e.markerId });
        }}
      />
      {!markerInfo?.id && (
        <View className="flex_cc pt24 search-container">
          <View
            className="search-content flex_csb"
            onClick={() => {
              Taro.chooseLocation({
                success: (res) => {
                  console.log('🚀 ~ search-chooseLocation ~ res:', res);
                  if (res.name && res.address) {
                    chooseLocationCb(res);
                    const { longitude, latitude } = res;
                    const activeKeys = Object.keys(activeIndex).filter((key) => activeIndex[key]);
                    getArea(activeKeys, latitude, longitude);
                  }
                },
              });
            }}
          >
            <View className="flex_ic search-content-left">
              <Image className="icon20" src={iconSearchLocation} />
              <View className="search-input c_9">搜索</View>
            </View>
            <Image className="icon20" src={iconSearch} />
          </View>
        </View>
      )}
      <View className="footer xsafe_16">
        {!markerInfo?.id && (
          <MapAlertPageExpand
            activeIndex={activeIndex}
            setActiveIndex={(e) => {
              // 重置 hasIncludedPoints，这样就可以重新触发 includePoints
              hasIncludedPoints.current = false;
              setActiveIndex(e);
            }}
            handleLocation={moveLocation}
            bottom={16 + 48 + 60}
            showTabs
          />
        )}
        <View className="footer-btn  c_f bold">
          <View
            className="footer-apply-annotation"
            onClick={() => {
              setApplyAnnotationInfo(true);
            }}
          >
            <Image className="footer-btn-bg" src={footerApplyAnnotation} />
            <View className="footer-btn-item">
              <Image className="icon20 mr8" src={iconAnnotation} />
              申请标注
            </View>
          </View>
          <View
            className="footer-my-application"
            onClick={() => {
              Taro.navigateTo({
                url: '/pages/myApplication/index',
              });
            }}
          >
            <Image className="footer-btn-bg" src={footerMyApplication} />
            <View className="footer-btn-item">
              <Image className="icon20 mr8" src={iconApplication} />
              我的申请
            </View>
          </View>
        </View>
      </View>

      {/* 地图信息弹框 */}
      <MapAlertPage
        handleLocation={() => {
          const map = Taro.createMapContext('petFriendlyMap', this);
          map.moveToLocation({});
        }}
        info={markerInfo}
        visible={!!markerInfo?.id}
        close={() => { setMarkerInfo(null); }}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <ApplyAnnotation
        handleChooseLocation={chooseLocationCb}
        info={applyAnnotationInfo}
        setInfo={setApplyAnnotationInfo}
      />

    </View>
  );
}
