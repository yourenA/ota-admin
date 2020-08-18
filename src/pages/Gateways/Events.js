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
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table, Tag,notification,Card
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
        id: this.props.history.location.query.id,
        ...values,
        order_direction:'desc'
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
  deviceUpdate=()=>{
    const formValues = this.EditDevice.props.form.getFieldsValue();
    console.log('formValues', formValues)
    request(`/upgrade_device`, {
      method: 'POST',
      data:{
        firmware_id:formValues.firmware_id,
        device_ids:this.state.selectedRowKeys
      }
    }).then((response)=> {
      console.log(response);
      if(response.status===200){
        notification.success({
          message: formatMessage({id: 'app.successfully'}, {type:'设备固件更新'}),
        });
        this.setState({
          editModal:false
        })
        this.handleSearch({
          page: this.state.page,
          per_page: this.state.per_page,
        })
      }
    })
  }
  render() {
    const {
      gateway_events: {data, loading, meta, pageLoaded},
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: 'IMEI',
        dataIndex: 'imei',
      },
      {
        title: '固件版本',
        dataIndex: 'firmware_version',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => formatMessage({id: 'app.pagination'}, {total}),
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize, date: this.state.date})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize,date: this.state.date})
      },
    };
    const {  selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const renderTable = <Card type="inner" title={
      <div>
        <Icon type="appstore" />
        设备列表
      </div>

    } bordered={false}>
      <div className={styles.tableList} style={{padding: '12px'}}>
        <div style={{marginBottom:'10px'}}>
          已选 {this.state.selectedRowKeys.length} 个设备
          <Button onClick={  ()=>{
            if(this.state.selectedRowKeys.length===0){
              return false
            }
            this.setState({
            editModal:true
          })} } icon={'printer'} type={'primary'} style={{marginLeft:'10px'}}>批量更新设备固件</Button>
        </div>
        <Table
          rowSelection={rowSelection}
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
      </div>
    );
  }
}

export default TableList;