import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Alert,Badge,Table,Divider,Card,Collapse,Modal ,message   } from 'antd';
import EditConfigs from './EditConfigs'
import find from 'lodash/find'
const Panel = Collapse.Panel;
@connect(({configs,system_configs, loading}) => ({
  configs,system_configs
}))
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      editRecord:{},
      targetKeys: [],
      selectedKeys: [],
      refresh_second: 0,
    };
  }
  componentDidMount() {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'system_configs/fetch',
      callback: ()=> {
        const {system_configs}=that.props
        const refresh_second = find(system_configs.data, function (o) {
          return o.key === 'collector_config_refresh_time'
        })
        if (refresh_second) {
          that.setState({
            refresh_second: Number(refresh_second.value),
          }, function () {
            that.handleSearch()
          })
        }
      }
    });
  }
  handleSearch = ( cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'configs/fetch',
      payload: {
        device_id:that.props.history.location.query.id
      },
      callback: function () {
        if (that.timer) {
          console.log('clearTimeout')
          clearTimeout(that.timer)
        }
        that.timer = setTimeout(function () {
          that.handleSearch();
        }, that.state.refresh_second * 1000)
      }

    });
  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
    if(this.timer){
      console.log(this.timer)
    }
    clearTimeout(this.timer)
  }
  handleEdit = ()=> {
    const formValues = this.editConfig.props.form.getFieldsValue();
    console.log('formValues2', formValues)
    const that = this;
    this.props.dispatch({
      type: 'configs/edit',
      payload: {
        device_id:that.props.history.location.query.id,
        [that.state.editRecord.key]:formValues.value
      },
      callback: function () {
        message.success('修改采集器配置成功')
        that.setState({
          editModal: false,
        });
        // that.handleSearch()
      }
    });
  }
  render() {
    const {
      configs: {data, loading, meta},
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '配置值',
        dataIndex: 'value',
      },
      {
        title: '操作',
        render: (text, record) => (
          <div>
            {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>*/}
            <a  onClick={()=>{
              this.setState({
                editModal:true,
                editRecord:record,
              })
            }}>编辑</a>
          </div>
        ),
      },
    ];
    return (
      <div>
        <div className="info-page-container" >
          <Collapse activeKey={['1']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div> 采集器信息 </div>} key="1"
            >
              <Alert   message={`数据每隔${this.state.refresh_second}秒刷新一次`} type="info"  />
              <Table
                size='small'
                loading={loading}
                rowKey={'key'}
                dataSource={data.filter((o)=>o.key!=='server_address')}
                columns={columns}
                pagination={false}
              />
              </Panel>

          </Collapse>

        </div>
        <Modal
          title={'编辑'+this.state.editRecord.name }
          destroyOnClose
          visible={this.state.editModal}
          centered
          width={580}
          onOk={this.handleEdit}
          onCancel={()=> {
            this.setState({editModal: false, editRecord: {}})
          }}
        >
          <EditConfigs editRecord={this.state.editRecord}
                      wrappedComponentRef={(inst) => this.editConfig = inst}/>

        </Modal>
        </div>
    );
  }
}

export default SearchList;
