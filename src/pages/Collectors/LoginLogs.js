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
  DatePicker
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './Index.less';
const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({login_logs, loading}) => ({
  login_logs,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    page: 1,
    per_page: 30,
    number: '',
    name: '',
  };


  componentDidMount() {
   this.handleSearch({
        page: 1,
        per_page: 30,
        started_at:moment().format('YYYY-MM-DD'),
        ended_at:moment().format('YYYY-MM-DD')
      });
  }


  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'login_logs/fetch',
      payload: {
        id:this.props.history.location.query.id,
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
    const {form} = this.props;
    form.resetFields();
    this.handleSearch({
      page: 1,
      started_at:moment().format('YYYY-MM-DD'),
      ended_at:moment().format('YYYY-MM-DD'),
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
          <Col md={6} sm={24}>
            <FormItem label="开始日期">
              {getFieldDecorator('started_at',{ initialValue: moment() })(<DatePicker  format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="结束日期">
              {getFieldDecorator('ended_at',{ initialValue: moment() })(<DatePicker  format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={()=> {
                const {form} = this.props;
                form.validateFields((err, fieldsValue) => {
                  if (err) return;

                  const values = {
                    status:fieldsValue.status,
                    started_at:fieldsValue.started_at.format('YYYY-MM-DD'),
                    ended_at:fieldsValue.ended_at.format('YYYY-MM-DD'),
                  };
                  console.log("values",values)
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
      login_logs: {data, loading, meta},
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:50,
        render:(text,record,index)=>{
          return index+1
        }
      },
      {
        title: '登录时间',
        dataIndex: 'logined_at',
      },

    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize,started_at:this.state.started_at,
          ended_at:this.state.ended_at,status:this.state.status,})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize,started_at:this.state.started_at,
          ended_at:this.state.ended_at,status:this.state.status,})
      },
    };
    return (
      <div>
        <div className="info-page-container" >

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
              rowKey={'logined_at'}
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
