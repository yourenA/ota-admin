import React, { PureComponent } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Card, Tabs } from 'antd';
import { Pie, WaterWave, Gauge, TagCloud } from '@/components/Charts';
import NumberInfo from '@/components/NumberInfo';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import styles from './Monitor.less';
import find from 'lodash/find';
const { Secured } = Authorized;

const { TabPane } = Tabs;

// use permission as a parameter
const havePermissionAsync = new Promise(resolve => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 300);
});

@Secured(havePermissionAsync)
class Monitor extends PureComponent {
  constructor(props) {
    super(props);
    this.BMap = window.BMap;
    this.map = null;
    this.state = {
      mapdata: [
        {
          name: `1 号茶园`,
          cvr: Math.ceil(Math.random() * 9) / 10,
          tem: Math.ceil(Math.random() * 10) + 15,
          lng: '113.030557',
          lat: '23.83164',
        },
        {
          name: `2 号茶园`,
          cvr: Math.ceil(Math.random() * 9) / 10,
          tem: Math.ceil(Math.random() * 10) + 15,

          lng: '113.116795',
          lat: '23.865484',
        },
        {
          name: `3 号茶园`,
          cvr: Math.ceil(Math.random() * 9) / 10,
          lng: '113.128293',
          lat: '23.897734',
          tem: Math.ceil(Math.random() * 10) + 15,
        },
        {
          name: `4 号茶园`,
          cvr: Math.ceil(Math.random() * 9) / 10,
          tem: Math.ceil(Math.random() * 10) + 15,

          lng: '113.147265',
          lat: '24.031934',
        },
        {
          name: `5 号茶园`,
          cvr: Math.ceil(Math.random() * 9) / 10,
          tem: Math.ceil(Math.random() * 10) + 15,

          lng: '112.984564',
          lat: '24.052527',
        },
        {
          name: `6 号茶园`,
          cvr: Math.ceil(Math.random() * 9) / 10,
          tem: Math.ceil(Math.random() * 10) + 15,

          lng: '112.985564',
          lat: '24.153527',
        },
      ],
    };
  }
  componentDidMount() {
    let points = [];
    this.map = new this.BMap.Map('mapData', {
      enableMapClick: false, //兴趣点不能点击
      mapType: BMAP_HYBRID_MAP, //默认卫星图
    }); // 创建地图实例
    this.map.setMapStyle({
      styleJson: [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: {
            lightness: 10,
            saturation: -100,
          },
        },
      ],
    });
    this.map.centerAndZoom(new BMap.Point(112.159141, 26.269442), 5);
    this.map.addControl(
      new BMap.MapTypeControl({
        mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
      })
    );
    this.map.enableScrollWheelZoom();
    const { mapdata } = this.state;
    const that = this;
    for (let i = 0; i < mapdata.length; i++) {
      const pt = new this.BMap.Point(mapdata[i].lng, mapdata[i].lat);
      let marker = new this.BMap.Marker(pt /*, {icon: myIcon}*/);
      marker.addEventListener('click', function(e) {
        console.log(e);
        that.showInfo(mapdata[i]);
      });
      let label = new this.BMap.Label(mapdata[i].name, { offset: new this.BMap.Size(-20, 28) });
      marker.setLabel(label);
      this.map.addOverlay(marker);
      points.push(pt);
    }
    this.map.setViewport(points); //调整视野
  }
  showInfo = point => {
    let dot = new this.BMap.Point(point.lng, point.lat);
    let content = `<div class="table-content">${point.name}</div><div>茶园相关信息</div>`;
    let infoWindow = new this.BMap.InfoWindow(content, { title: point.number }); // 创建信息窗口对象
    let info = this.map.openInfoWindow(infoWindow, dot); //开启信息窗口
  };
  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
    const point = find(this.state.mapdata, o => o.name === key);
    this.showInfo(point);
  };
  render() {
    const { currentTabKey, mapdata } = this.state;
    const activeKey = currentTabKey || (mapdata[0] && mapdata[0].name);
    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 160, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.name}
            subTitle={'温度'}
            gap={2}
            total={`${data.tem} ℃`}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
        <Col span={12} style={{ paddingTop: 40 }}>
          <NumberInfo
            subTitle={'土壤湿度'}
            gap={2}
            total={`${data.cvr * 100}%`}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
      </Row>
    );
    return (
      <GridContent>
        <div className={styles.map}>
          <div className="mapData" id="mapData" style={{ width: '100%', height: '100%' }} />
          <div className={styles.maptabBg} />
          <div className={styles.maptab}>
            <Tabs className="noMarginBottom" onChange={this.handleTabChange} activeKey={activeKey}>
              {this.state.mapdata.map(shop => (
                <TabPane
                  tab={<CustomTab data={shop} currentTabKey={activeKey} />}
                  key={shop.name}
                />
              ))}
            </Tabs>
          </div>
        </div>
      </GridContent>
    );
  }
}

export default Monitor;
