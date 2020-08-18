import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List } from 'antd';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AvatarList from '@/components/AvatarList';
import styles from './Workplace.less';
import img from './../../images/chayuan.jpg';
import camera from './../../images/camera.png'
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
class CardList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mapdata: [
        {
          name: `1 号茶园`,
          cvr: Math.ceil(Math.random() * 9) / 10,
          lng: '113.030557',
          lat: '23.83164',
          desc: '这是茶园的相关描述信息，这是茶园的相关描述信息，这是茶园的相关描述信息',
          videoImage: img,
          video: '/video.mp4',
        },
        {
          name: `2 号茶园`,
          cvr: Math.ceil(Math.random() * 9) / 10,
          lng: '113.116795',
          lat: '23.865484',
          desc: '这是茶园的相关描述信息，这是茶园的相关描述信息，这是茶园的相关描述信息',
          videoImage: img,
          video: '/video2.mp4',
        },
        {
          name: `3 号茶园`,
          cvr: Math.ceil(Math.random() * 9) / 10,
          lng: '113.128293',
          lat: '23.897734',
          desc: '这是茶园的相关描述信息，这是茶园的相关描述信息，这是茶园的相关描述信息',
          videoImage: img,
          video: '/video3.mp4',
        },
        {
          name: `4 号茶园`,
          cvr: Math.ceil(Math.random() * 9) / 10,
          lng: '113.147265',
          lat: '24.031934',
          desc: '这是茶园的相关描述信息，这是茶园的相关描述信息，这是茶园的相关描述信息',
          videoImage: img,
          video: '/video2.mp4',
        },
        {
          name: `5 号茶园`,
          cvr: Math.ceil(Math.random() * 9) / 10,
          lng: '112.984564',
          lat: '24.052527',
          desc: '这是茶园的相关描述信息，这是茶园的相关描述信息，这是茶园的相关描述信息',
          videoImage: img,
          video: '/video.mp4',
        },
        {
          name: `6 号茶园`,
          cvr: Math.ceil(Math.random() * 9) / 10,
          lng: '112.984564',
          lat: '24.052527',
          desc: '这是茶园的相关描述信息，这是茶园的相关描述信息，这是茶园的相关描述信息',
          videoImage: img,
          video: '/video3.mp4',
        },
      ],
    };
  }
  componentDidMount() {}

  render() {
    const {
      list: { list },
      loading,
    } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>在这个页面你可以看到系统上所有茶园的视频摄像头监控信息</p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
            页面介绍
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
            摄像头相关信息
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src={camera}
        />
      </div>
    );
    const cardList = this.state.mapdata ? (
      <List
        rowKey="id"
        loading={loading}
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={this.state.mapdata}
        renderItem={item => (
          <List.Item>
            <Card
              className={styles.card}
              hoverable
              cover={
                <video
                  src={item.video}
                  width="100%"
                  height="100%"
                  controls="controls"
                  autoPlay={true}
                  loop={true}
                >
                  Your browser does not support the video tag.
                </video>
              }
            >
              <Card.Meta
                title={<a>{item.name}</a>}
                description={<Ellipsis lines={2}>{item.desc}</Ellipsis>}
              />
            </Card>
          </List.Item>
        )}
      />
    ) : null;
    return (
      <PageHeaderWrapper title="视频监控页面" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>{cardList}</div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
