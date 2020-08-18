import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {Card, Table, Icon, Tooltip, Form, Steps, Modal, message, Drawer, Badge, Menu, Dropdown,Divider,Button,BackTop} from 'antd';
import Step1 from './StepForm/Step1'
import Step2 from './StepForm/Step2'
import Step3 from './StepForm/Step3'
import Step4 from './StepForm/Step4'
import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DetailAnalysis from './DetailAnalysis';
import HistoryDetailAnalysis from './HistoryDetailAnalysis';
import SendData from './SendData';
import styles from './Index.less';
import Search from './Search'
import {renderIndex, ellipsis2} from '@/utils/utils'
const {Step} = Steps;
@connect(({devices, loading}) => ({
  devices,
}))
@Form.create()
class Devices extends PureComponent {
  state = {
    addContent: false,
    historyContent:false,
    realTimeContent:false,
    stepData: {},
    current: 0,
    page: 1,
    number: '',
    alias: '',
    per_page: 30
  };
  hideContent = ()=> {

    this.setState({
      current: 0,
      stepData: {},
      addContent: false
    })
    this.handleSearch({
      page: this.state.page,
      per_page: this.state.per_page,
      number: this.state.number,
      alias: this.state.alias,
    })
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'devices/fetch',
      payload: {
        page: 1,
        per_page: 30,
        number: '',
        alias: '',
      },

    });
  }

  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'devices/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
        });
        if (cb) cb()
      }
    });
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      number: '',
      alias: '',
      per_page: 30
    })
  }
  setStep = (step)=> {
    this.setState({
      current: step
    })
  }
  setStepData = (data, step)=> {
    // console.log('data',data)
    this.setState({
      stepData: data
    }, function () {
      console.log('setStepData', this.state.stepData)
      this.setStep(step)
    })
  }
  deleteItem = id => {
    const {dispatch} = this.props;
    dispatch({
      type: 'devices/remove',
      payload: {id},
      callback: ()=> {
        message.success('删除设备成功')
        this.handleSearch({
          page: this.state.page,
          per_page: this.state.per_page,
          number: this.state.number,
          alias: this.state.alias,
        })
      }
    });
  };
  resetItem = id=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'devices/resetPassword',
      payload: {id},
      callback: ()=> {
        message.success('重置设备密码成功')
        this.handleSearch({
          page: this.state.page,
          per_page: this.state.per_page,
          number: this.state.number,
          alias: this.state.alias,
        })
      }
    });
  }

  render() {
    const {
      devices: {data, loading, meta},
    } = this.props;



    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="设备列表"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize})
      },
    };
    const itemMenu = (item)=> (
      <Menu onClick={(e)=> {
        console.log('key', e.key)
        if (e.key === 'delete') {
          Modal.confirm({
            title: '删除设备',
            content: '确定删除该设备吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.deleteItem(item.id),
          })
        }
        if (e.key === 'reset') {
          Modal.confirm({
            title: '密码重置',
            content: '确定重置该设备密码吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.resetItem(item.id),
          })
        }
        if (e.key === 'sendData') {
          this.setState({senDataModal:true,stepData:{...item}})
        }
      }}>
        <Menu.Item key="sendData">
          模拟发送数据
        </Menu.Item>
        <Menu.Item key="reset">
          重置密码
        </Menu.Item>
        <Menu.Item key="delete">
          删除
        </Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        className: 'table-index',
        render: (text, record, index) => {
          return renderIndex(meta, this.state.page, index)
        }
      },
      {
        title: '设备编号', dataIndex: 'number', key: 'number',
        render: (val, record, index) => {
          let html=(<span style={{color:'#722ED1'}}>{val}</span>)
          return <Tooltip
            placement="topLeft"
            title={<p style={{wordWrap: 'break-word'}}>{val}</p>}>
            <p
              onClick={()=>{this.setState({detailModal:true,stepData:{...record}})}}
              style={{
              cursor:'pointer',
              display: 'inline-block',
              width: `100px`,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>{html}</p>
          </Tooltip>
        }
      },
      {
        title: '设备别名', dataIndex: 'alias', key: 'alias',
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {
        title: '状态', dataIndex: 'is_online', key: 'is_online',

        render: (val, record, index) => {
          let status = 'success';
          let text = '在线';
          switch (val) {
            case -1:
              status = 'error'
              text = '离线';

              break;
            default:
              status = 'success'
              text = '在线';

          }
          return (
            <p>
              <Badge status={status}/>{text}
            </p>
          )
        }
      },
      {
        title: '操作',
        float:'right',
        width:300,
        render: (val, record, index) => (
          <div>
            <Button size="small"  type="dashed"  onClick={()=>{this.setState({addContent:true,stepData:{...record}})}}>编辑</Button>
            <Divider type="vertical" />
            <Button size="small"  type="primary"  onClick={()=>{this.setState({analysisModal:true,realTimeContent:true,stepData:{...record}})}}>实时记录</Button>
            <Divider type="vertical" />
            <Button size="small"  type="primary"  onClick={()=>{this.setState({analysisModal:true,historyContent:true,stepData:{...record}})}}>历史纪录</Button>
            <Divider type="vertical" />
            <Dropdown overlay={itemMenu(record)}>
              <Button  size="small">
                更多<Icon type="down" />
              </Button>
            </Dropdown>
          </div>
        ),
      }
    ];

    let title='设备列表';
    let content = (
      <div className={styles.pageHeaderContent}>
        <p>
          添加"设备"同时添加"传感器信息"与"主题信息"
        </p>
        <p>点击设备名称查看传感器历史数据</p>

      </div>
    );
    if(this.state.historyContent){
      title=`设备(${this.state.stepData.number})历史数据`;
      content = (
        <div className={styles.pageHeaderContent}>
          <p>
            更改时间可以查询不同日期的数据
          </p>
          <p>
            红色点表示出错数据
          </p>
        </div>
      )
    }
    if(this.state.realTimeContent){
      title=`设备(${this.state.stepData.number})实时数据`;
      content = (
        <div className={styles.pageHeaderContent}>
          <p>
            设备实时数据每隔10秒刷新一次
          </p>
          <p>
            红色点表示出错数据
          </p>
        </div>
      )
    }
    return (
      <PageHeaderWrapper title={title} content={content} extraContent={extraContent}>
        {!this.state.addContent ?
          <div className={styles.cardList}>
            {
              (!this.state.realTimeContent&&!this.state.historyContent)&&<div>
              <Search
                handleSearch={this.handleSearch}
                handleFormReset={this.handleFormReset}
                per_page={this.state.per_page}
                addContent={this.state.addContent}
                number={this.state.number}
                alias={this.state.alias}
                addDevice={()=> {
                  this.setState({addContent: true,})
                }}
              />
              <Table
                className={styles.whiteBg}
                loading={loading}
                rowKey={'id'}
                dataSource={data}
                bordered
                columns={columns}
                pagination={paginationProps}
              />
            </div>
            }
            {
               this.state.historyContent&&
              <div className={styles.data_content}>
                <HistoryDetailAnalysis data={this.state.stepData}
                                       turnPre={()=>this.setState({historyContent:false})}/>
              </div>
            }.  {
             this.state.realTimeContent&&
            <div className={styles.data_content}>
              <DetailAnalysis data={this.state.stepData}
                              turnPre={()=>this.setState({realTimeContent:false})}/>
            </div>
          }

          </div>
          :
          <div>
            <Card>
              <h3
                style={{marginBottom: '16px'}}>{this.state.stepData.id ? `修改设备${this.state.stepData.number}` : '新增设备'}</h3>
              <Fragment>

                <Steps current={this.state.current} className={styles.steps}>
                  <Step title="填写设备信息"/>
                  <Step title="填写传感器信息"/>
                  <Step title="填写主题信息"/>
                  <Step title="提交"/>
                </Steps>
                {this.state.current === 0 &&
                <Step1 hideContent={this.hideContent} stepData={this.state.stepData} setStepData={this.setStepData}
                       setStep={this.setStep}/>}
                {this.state.current === 1 &&
                <Step2 hideContent={this.hideContent} stepData={this.state.stepData} setStepData={this.setStepData}
                       setStep={this.setStep}/>}
                {this.state.current === 2 &&
                <Step3 hideContent={this.hideContent} stepData={this.state.stepData} setStepData={this.setStepData}
                       setStep={this.setStep}/>}
                {this.state.current === 3 &&
                <Step4 hideContent={this.hideContent} stepData={this.state.stepData} setStepData={this.setStepData}
                       setStep={this.setStep}/>}
              </Fragment>
            </Card>

          </div>}
        <Modal
          title={this.state.stepData.number + '详情'}
          width={900}
          destroyOnClose
          visible={this.state.detailModal}
          footer={null}
          centered
          onCancel={()=> {
            this.setState({detailModal: false, stepData: {}})
          }}
        >
          <Step4 stepData={this.state.stepData} hideAction={true}/>

        </Modal>
        <Drawer
          title={`${this.state.stepData.number} 发布消息`}
          placement="right"
          closable={false}
          width={500}
          onClose={()=> {
            this.setState({stepData: {}, senDataModal: false})
          }}
          visible={this.state.senDataModal}
        >
          {<SendData data={this.state.stepData}/>}
        </Drawer>
        <BackTop/>
      </PageHeaderWrapper>
    );
  }
}

export default Devices;
