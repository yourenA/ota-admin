import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {formatMessage, FormattedMessage} from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Alert,
  PageHeader,
  Modal,
  Drawer,
  Badge,
  Divider,
  Steps,
  Radio,
  Table, Tag, notification, Card, Descriptions,
} from 'antd';
import styles from './Index.less';
import request from '@/utils/request';
import Update from './Update';
const FormItem = Form.Item;
const {Option} = Select;

/* eslint react/no-multi-comp:0 */
@connect(({gateway_events, loading, system_configs}) => ({
  gateway_events, system_configs
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
  }

  state = {
    selectedRowKeys:[],
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    page: 1,
    per_page: 30,
    dev_eui: '',
    name: '',
    editRecord: {},
    current: 0,
    refresh_second: 1,
    stepData: {},
    mqttInfo: {},
    events: [],
    date:moment().format('YYYY-MM-DD'),
  };
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  componentDidMount() {
    let params = {}
    params = {
      page: 1,
      per_page: 30,
    }
    const that = this;
    that.handleSearch(params)
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    if (this.timer) {
      console.log(this.timer)
    }
    clearTimeout(this.timer)
    const {dispatch} = this.props;
    dispatch({
      type: 'gateway_events/loadedPage',
      payload: true,
    });
  }

  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'gateway_events/fetch',
      payload: {
        rtuId: this.props.history.location.query.rtu_id,
        ...values,
        size:values.per_page,
        page:Number(values.page)-1,
        sort:"time,desc"
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
          selectedRowKeys:[],
        }, function () {
        });
        if (cb) cb()
      }
    });
  }
  render() {
    const {
      gateway_events: {data, loading, meta, pageLoaded},
    } = this.props;
    const columns = [
      {
        title: '序号',
        width: 50,
        key: '_index',
        render: (text, record,index) => {
          const {
            gateway_events: {meta},
          } = this.props;
          return <p className={'index'}>{((meta.number ) * meta.size) + (index + 1)}</p>;
        },
      },
      {
        title: 'rtuId',
        dataIndex: 'rtuId',
        key: 'rtuId',
      },
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '错误代码',
        dataIndex: 'lastTroubleCode',
        key: 'lastTroubleCode',
      },
      {
        title: '文件长度',
        dataIndex: 'lastFileReceiveLen',
        key: 'lastFileReceiveLen',
      },
      {
        title: '当前固件',
        dataIndex: 'currentFirmwareVersion',
        key: 'currentFirmwareVersion',
        render:(text,record)=>{
          return <div>
            <p>版 本 : {text}</p>
            <p>GUID : { record.currentFirmwareGuid}</p>
          </div>
        }
      },
      {
        title: '最新固件',
        dataIndex: 'lastFirmwareVersion',
        key: 'lastFirmwareVersion',
        render:(text,record)=>{
          return <div>
            <p>版 本 : {text}</p>
            <p>GUID : { record.lastFirmwareGuid}</p>
          </div>
        }
      },

    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => formatMessage({id: 'app.pagination'}, {total}),
      pageSize: meta.size,
      total: meta.totalElements,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize, start_date: this.state.start_date, end_date: this.state.end_date, dev_eui: this.state.dev_eui,sort_field: this.state.sort_field,
          sort_type: this.state.sort_type})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize, start_date: this.state.start_date, end_date: this.state.end_date, dev_eui: this.state.dev_eui,sort_field: this.state.sort_field,
          sort_type: this.state.sort_type})
      },
    };
    const {  selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const renderTable = <Card type="inner" title={
      <div>
        <Icon type="history" />
        升级日志
      </div>

    } bordered={false}>
      <div className={styles.tableList} >
        <Table
          style={{backgroundColor: '#fff'}}
          loading={loading}
          rowKey={(record)=> {
            return record.id
          }}
          dataSource={data}
          columns={columns}
          bordered={true}
          size="small"
          pagination={paginationProps}
        />
      </div>
    </Card>
    const editRecord=this.state.editRecord
    return (
      <div>
        <div className="info-page-container">
            {renderTable}
        </div>
        <Modal
          title={'更新设备固件'}
          visible={this.state.editModal}
          centered
          onOk={this.deviceUpdate}
          onCancel={()=> {
            this.setState({editModal: false, editRecord: {}})
          }}
        >
          <Update id={this.props.history.location.query.id}
                  wrappedComponentRef={(inst) => this.EditDevice = inst}/>

        </Modal>
        <Drawer
          title={`${editRecord && editRecord.name} 详情`}
          placement="right"
          destroyOnClose
          onClose={() => {
            this.setState({
              infoModal: false,
              editRecord: {},
            });
          }}

          width={550}
          visible={this.state.infoModal}
        >
          <Descriptions column={2} title={<div>
            <span></span>
          </div>} bordered>
            <Descriptions.Item label="名称"  span={2}>{editRecord.name}</Descriptions.Item>
            <Descriptions.Item label="IMEI" span={2}>{editRecord.imei}</Descriptions.Item>
            <Descriptions.Item label="当前固件版本" span={2}>{editRecord.firmware_version}</Descriptions.Item>
            <Descriptions.Item label="当前固件GUID" span={2}>{editRecord.firmware_guid}</Descriptions.Item>
            <Descriptions.Item label="更新状态" span={2}>{editRecord.upgrade_state}</Descriptions.Item>
            <Descriptions.Item label="更新错误代码" span={2}>{editRecord.upgrade_err_code}</Descriptions.Item>
            <Descriptions.Item label="更新的固件版本" span={2}>{editRecord.new_firmware_version}</Descriptions.Item>
            <Descriptions.Item label="更新的固件GUID" span={2}>{editRecord.new_firmware_guid}</Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>{editRecord.created_at}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>{editRecord.remark}</Descriptions.Item>

          </Descriptions>
        </Drawer>
      </div>
    );
  }
}

export default TableList;
