import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import request from '@/utils/request';
import { PageHeader,Badge,Table,Divider,Card,Button,Alert ,Collapse   } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import find from 'lodash/find'
const Panel = Collapse.Panel;
const {Description} = DescriptionList;
@connect(({information,system_configs, loading}) => ({
  information,system_configs
}))
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.name=this.props.history.location.query.name
    this.timer=null;
    console.log(this.props)
    this.state = {
      refresh_second:1,
      mqttInfo:{},
      editRecord:{}
    };
  }

  componentDidMount() {
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type: 'system_configs/fetch',
      payload: {

      },
      callback:()=>{
        const {system_configs}=that.props
        const refresh_second=find(system_configs.data,function (o) {
          return o.key==='collector_info_refresh_time'
        })
        console.log('refresh_second',refresh_second)

        if(refresh_second){
          that.setState({
            refresh_second:Number(refresh_second.value),
          },function () {
            that.handleSearch()
          })
        }
      }
    });
    request(`/collectors/${that.props.history.location.query.id}/mqtt_account`, {
      method: 'GET',
    }).then((response)=> {
      that.setState({
        mqttInfo: response.data.data,
      })
    });
    // this.handleSearch()
  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
    if(this.timer){
      console.log(this.timer)
    }
    clearTimeout(this.timer)
  }
  handleSearch = ( cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'information/fetch',
      payload: {
        device_id:that.props.history.location.query.id
      },
      callback: function () {
        if (cb) cb()
        if(that.timer){
          console.log('clearTimeout')
          clearTimeout(that.timer)
        }
        that.timer=setTimeout(function () {
          that.handleSearch();
        },that.state.refresh_second*1000)
      }
    });

  }
  render() {
    const {
      information: {data, loading, meta},
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '属性值',
        dataIndex: 'value',
      },
    ];
    return (
      <div>
        <div className="info-page-container" >
          <Collapse activeKey={['1']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div> 采集器信息 </div>} key="1"
            >
              <Alert  message={`数据每隔${this.state.refresh_second}秒刷新一次`} type="info"  />
          <Table
            size='small'
            loading={loading}
            rowKey={'name'}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
            </Panel>

          </Collapse>
          <Collapse activeKey={['1']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div> MQTT信息 </div>} key="1"
            >
          <DescriptionList  size="small" col="4">
            <Description term="用户名"> {this.state.mqttInfo.username}</Description>
            <Description term="密码"> {this.state.mqttInfo.password}</Description>

          </DescriptionList>
          {
            this.state.mqttInfo.topics && this.state.mqttInfo.topics.map((item, index)=> {

              return(
                <div style={{marginTop:'10px'}} key={index}>
                  <DescriptionList size="small" col="4" >
                    <Description term="主题名称"> {item.name}</Description>
                    <Description term="是否允许发布"> {item.allow_publish === 1 ? '是' : '否'}</Description>
                    <Description term="是否允许订阅"> {item.allow_subscribe === 1 ? '是' : '否'}</Description>
                  </DescriptionList>
                </div>

              )
            })
          }
            </Panel>

          </Collapse>
        </div>
        </div>
    );
  }
}

export default SearchList;
