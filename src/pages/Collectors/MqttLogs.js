import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment'
import {Link} from 'dva/router';
import {
  Row,
  Col,
  Form,
  Radio,
  Button,
  Badge,
  Table,
  DatePicker,
  Icon,
Select,
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './Index.less';
const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({mqtt_logs, loading}) => ({
  mqtt_logs,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    page: 1,
    per_page: 30,
    number: '',
    name: '',
    status: '',
    direction: '',
    topic:'',
  };


  componentDidMount() {
    this.handleSearch({
      page: 1,
      per_page: 30,
      status: '',
      direction: '',
      topic:'',
      started_at: moment().format('YYYY-MM-DD'),
      ended_at: moment().format('YYYY-MM-DD')
    });
  }


  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    const sendData={...values}
    if(!sendData.direction){
      delete sendData.direction
    }
    if(!sendData.status){
      delete sendData.status
    }
    if(!sendData.topic){
      delete sendData.topic
    }
    dispatch({
      type: 'mqtt_logs/fetch',
      payload: {
        id: this.props.history.location.query.id,
        ...sendData,
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
    const {form} = this.props;
    form.resetFields();
    this.handleSearch({
      page: 1,
      status: '',
      direction: '',
      topic:'',
      started_at: moment().format('YYYY-MM-DD'),
      ended_at: moment().format('YYYY-MM-DD'),
      per_page: 30
    })
  }

  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={12}>
          <Col xl={5} lg={8} md={8} sm={8}>
            <FormItem label="开始日期">
              {getFieldDecorator('started_at', {initialValue: moment()})(<DatePicker format="YYYY-MM-DD"/>)}
            </FormItem>
          </Col>
          <Col xl={5} lg={8} md={8} sm={8}>
            <FormItem label="结束日期">
              {getFieldDecorator('ended_at', {initialValue: moment()})(<DatePicker format="YYYY-MM-DD"/>)}
            </FormItem>
          </Col>
          <Col xl={6} lg={8} md={8} sm={8}>
            <FormItem label="方向">
              {getFieldDecorator('direction', {initialValue: ''})(
                <Radio.Group>
                  <Radio.Button value="">全部</Radio.Button>
                  <Radio.Button value="up">上行</Radio.Button>
                  <Radio.Button value="down">下行</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={8} md={8} sm={8}>
            <FormItem label="状态">
              {getFieldDecorator('status', {initialValue: ''})(
                <Radio.Group>
                  <Radio.Button value="">全部</Radio.Button>
                  <Radio.Button value="1">正常</Radio.Button>
                  <Radio.Button value="-1">异常</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          <Col xl={5} lg={8} md={8} sm={8}>
            <FormItem label="主题">
              {getFieldDecorator('topic', {initialValue: ''})(
                <Select>
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value="info">info</Select.Option>
                  <Select.Option value="config">config</Select.Option>
                  <Select.Option value="collect">collect</Select.Option>
                  <Select.Option value="v1_ctrl">v1_ctrl</Select.Option>
                  <Select.Option value="v2_ctrl">v2_ctrl</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={3} lg={8} md={8} sm={8}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={()=> {
                const {form} = this.props;
                form.validateFields((err, fieldsValue) => {
                  if (err) return;

                  const values = {
                    status: fieldsValue.status,
                    direction: fieldsValue.direction,
                    topic: fieldsValue.topic,
                    started_at: fieldsValue.started_at.format('YYYY-MM-DD'),
                    ended_at: fieldsValue.ended_at.format('YYYY-MM-DD'),
                  };
                  console.log("values", values)
                  this.handleSearch({
                    page: this.state.page,
                    per_page: this.state.per_page,
                    ...values,
                  })

                });
              }}>
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  renderForm() {
    return this.renderSimpleForm()
  }

  render() {
    const {
      mqtt_logs: {data, loading, meta},
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        render:(text,record,index)=>{
          return index+1
        }
      },
      {
        title: '服务端收发时间',
        dataIndex: 'server_time',
      },
      {
        title: '终端收发时间',
        dataIndex: 'terminal_time',
      },
      {
        title: '主题',
        dataIndex: 'topic',
      },
      {
        title: '方向',
        dataIndex: 'direction',
        render(val) {
          return val==='up'?<Icon type="arrow-up" style={{color:'#1890ff'}} />:<Icon type="arrow-down"  style={{color:'#f5222d'}} />
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val) {
          return <Badge status={val === 1 ? 'success' : 'error'} text={val === 1 ? '正常' : '异常'}/>;
        },
      },
      {
        title: '内容',
        dataIndex: 'content',
      },

    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({
          page, per_page: pageSize, started_at: this.state.started_at,
          ended_at: this.state.ended_at, status: this.state.status,direction: this.state.direction,topic: this.state.topic,
        })
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({
          page, per_page: pageSize, started_at: this.state.started_at,
          ended_at: this.state.ended_at, status: this.state.status,direction: this.state.direction,topic: this.state.topic,
        })
      },
    };
    return (
      <div>
        <div className="info-page-container">

          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {/*   <div className={styles.tableListOperator}>
             <Button icon="plus" type="primary" onClick={
             ()=>{this.setState({
             addModal:true
             })}
             }>
             新建应用
             </Button>
             </div>*/}
            <Table
              style={{backgroundColor: '#fff',padding:'12px'}}
              loading={loading}
              rowKey={(record)=>{return record.server_time+record.topic}}
              dataSource={data}
              columns={columns}
              bordered={true}
              size="small"
              pagination={paginationProps}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TableList;
