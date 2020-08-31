import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {formatMessage, FormattedMessage} from 'umi/locale';

import {Link} from 'dva/router';
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
  Table,Tag,Popconfirm,notification
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './TableList.less';
import AddOrEditDevice from './AddOrEditDevice2'
import find from 'lodash/find'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import EditFirmware from './EditFirmware'
const FormItem = Form.Item;
const {Step} = Steps;
const {TextArea} = Input;
const {Option} = Select;
const RadioGroup = Radio.Group;
const {Description} = DescriptionList;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

/* eslint react/no-multi-comp:0 */
@connect(({applications, loading,system_configs}) => ({
  applications,system_configs
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.timer=null;
  }
  state = {
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
    refresh_second:1,
    stepData: {},
    mqttInfo: {}
  };


  componentDidMount() {
    let params = {}
    if (this.props.location.search) {
      const search = this.props.location.search.substring(1);
      const searchArr = search.split("&");
      for (let i = 0; i < searchArr.length; i++) {
        var tmp_arr = searchArr[i].split("=");

        if (tmp_arr[0] === 'page'||tmp_arr[0] === 'page') {
          params[tmp_arr[0]]=Number(tmp_arr[1])

        }else{
          params[tmp_arr[0]]=decodeURI(tmp_arr[1])
          this.props.form.setFieldsValue({[tmp_arr[0]]:decodeURI(tmp_arr[1])})
        }
      }
      // console.log('params', params)
      // this.handleSearch(params)
    }else{
      params={
        page: 1,
        per_page: 30,
      }
    }

    const that=this;
    that.handleSearch(params)

  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
    if(this.timer){
      console.log(this.timer)
    }
    clearTimeout(this.timer)
    const {dispatch} = this.props;
    dispatch({
      type: 'applications/loadedPage',
      payload: true,
    });
  }
  handleMenuClick = e => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'applications/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
        },function () {
          setTimeout(function () {
            dispatch({
              type: 'applications/loadedPage',
              payload: true,
            });
          },1000)
          dispatch(routerRedux.replace(`/firmwares/list?page=${this.state.page}&per_page=${this.state.per_page}`)
          )
        });
        if (cb) cb()
      }
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.handleSearch({
      page: 1,
      per_page: 30
    })
  }

  renderForm() {
  }

  handleDelete = id => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'applications/remove',
      payload: {id},
      callback: ()=> {
        message.success('删除设备成功')
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
          dev_eui: that.state.dev_eui,
          name: that.state.name,
        });
      }
    });
  };
  handleEdit = ()=> {
    const formValues = this.EditDevice.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'applications/edit',
      payload: {
        ...formValues,
        id: this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改固件成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
        });
      }
    });
  }
  handleAdd = ()=> {
    const formValues = this.AddDevice.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'applications/add',
      payload: {
        ...formValues,
      },
      callback: function () {
        message.success('新建设备成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
          dev_eui: that.state.dev_eui,
          name: that.state.name,
        });
      }
    });
  }
  handleDelete = (record)=> {
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type: `applications/remove`,
      payload: {
        id:record.id,
      },
      callback: function () {
        notification.success({
          message: formatMessage({id: 'app.successfully'}, {type: formatMessage({id: 'menu.applications.delete'},{name:record.dev_eui})}),
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
          dev_eui: that.state.dev_eui,
          name: that.state.name,
        });
      }
    });
  }
  render() {
    const {
      applications: {data, loading, meta,pageLoaded},
    } = this.props;
    const { dispatch } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">关闭</Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '序号',
        width: 80,
        key: '_index',
        render: (text, record,index) => {
          const {
            applications: { meta },
          } = this.props;
          return <p className={'index'}>{((meta.current_page - 1) * meta.per_page) + (index + 1)}</p>;
        },
      },
      {
        title:'版本',
        dataIndex: 'version',
      },
      {
        title:'状态',
        dataIndex: 'status',
        render: (value, record,index) => {
          let type = '';
          let color = '';
          let text = '';
          switch (value) {
            case 1:
              type = 'check-circle', color = '#00c546', text = '启用';
              break;
            case -1:
              type = 'close-circle', color = '#fe1b2e', text = '停用';
              break;
            default:
              type = 'close-circle', color = '#9a9a9a', text = '未知';
              break;
          }
          return <Fragment> <Icon type={type} theme="twoTone" className="table-icon" twoToneColor={color}/>{text}</Fragment>;

        }
      },
      {
        title:'适用的RTU基板型号',
        dataIndex: 'applicable_substrate_types',
        render: (text, record,index) => {
          return text.map((item,index)=>{
            return <Tag color="purple" key={index}>{item.name}</Tag>
          })
        },
      },
      {
        title:'文件大小(字节)',
        dataIndex: 'file_size',
      },
      {
        title:'创建时间',
        dataIndex: 'created_at',
      },
      {
        title:<FormattedMessage
          id="app.operate"
        />,
        dataIndex: 'operate',
        render:(text,record)=>{
          return <div>
            <Button onClick={()=>{
              this.setState({
                editRecord:record,
                editModal:true
              })
            }} style={{marginRight:'5px'}} type="primary" icon='edit'
                     size="small"><FormattedMessage
              id="app.edit"
            /></Button>
            <Popconfirm title={formatMessage({id: 'app.delete.info'})}
                        onConfirm={()=>this.handleDelete(record)}>
              <Button  type="danger" icon='delete'
                       size="small"><FormattedMessage
                id="app.delete"
                defaultMessage="名称"
              /></Button>
            </Popconfirm>
          </div>
        }
      },

    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal:total =>  formatMessage({ id: 'app.pagination' }, { total }),
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize,name:this.state.name,dev_eui:this.state.dev_eui})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize,name:this.state.name,dev_eui:this.state.dev_eui})
      },
    };
    const renderTable= <CardContent>
      <div className={styles.tableList}>
        <div className={styles.tableListOperator}>
          <Button icon="plus" type="primary"
                   style={{marginRight:'8px'}} onClick={
            ()=>{
              dispatch(routerRedux.push(`/firmwares/add_firmware`));

            }
          }>
            新建固件
          </Button>
        </div>
        <Table
          style={{backgroundColor:'#fff'}}
          className="custom-small-table"
          loading={loading}
          rowKey={'id'}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
        />
      </div>
    </CardContent>
    return (
      <div>
        <div className="page-header">
          <PageHeader
            title={'固件列表'}
          />
        </div>

        <div className="info-page-container" >

          {
            pageLoaded?
              <Card >
                {renderTable}
              </Card>
              :
            !loading&&<Card className={'animated zoomIn'}>
              {renderTable}
            </Card>
          }

          <Modal
            title={this.state.editRecord.dev_eui + '详情'}
            destroyOnClose
            visible={this.state.showModal}
            footer={null}
            centered
            width={700}
            onCancel={()=> {
              this.setState({showModal: false, editRecord: {}})
            }}
          >
            <div style={{overflow: 'hidden'}}>
              <DescriptionList className={styles.headerList} size="small" col="2">
                <Description term="id"> {this.state.editRecord.id}</Description>
                <Description term="编号"> {this.state.editRecord.dev_eui}</Description>
                <Description term="名称"> {this.state.editRecord.name}</Description>
                <Description term="状态">
                  <Badge status={this.state.editRecord.is_online === 1 ? 'success' : 'error'}
                         text={this.state.editRecord.is_online === 1 ? '在线' : '离线'}/>
                </Description>
                <Description term="协议">{this.state.editRecord.protocol}</Description>
                <Description term="登录时间">{this.state.editRecord.logined_at}</Description>
                <Description term="创建时间">{this.state.editRecord.created_at}</Description>
                <Description term="备注">{this.state.editRecord.remark}</Description>
              </DescriptionList>
            </div>

          </Modal>
          <Modal
            title={'新建设备'}
            visible={this.state.addModal}
            centered
            onCancel={()=> {
              this.setState({addModal: false})
            }}
            onOk={this.handleAdd}
          >
            <AddOrEditDevice
              wrappedComponentRef={(inst) => this.AddDevice = inst}/>

          </Modal>
          <Modal
            title={'编辑版本' + this.state.editRecord.version }
            destroyOnClose
            visible={this.state.editModal}
            centered
            onOk={this.handleEdit}
            width={600}
            onCancel={()=> {
              this.setState({editModal: false, editRecord: {}})
            }}
          >
            <EditFirmware editRecord={this.state.editRecord}
                             wrappedComponentRef={(inst) => this.EditDevice = inst}/>

          </Modal>
        </div>
      </div>
    );
  }
}

export default TableList;
