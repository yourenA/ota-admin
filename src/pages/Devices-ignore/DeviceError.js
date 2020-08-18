import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment'
import {Link} from 'dva/router';
import {
  Row,
  Col,
  Form,
  Select,
  Button,
  Icon,
  Table,
  DatePicker
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './Index.less';
import request from '@/utils/request';
const FormItem = Form.Item;
const { Option } = Select;
/* eslint react/no-multi-comp:0 */
@connect(({error, loading}) => ({
  error,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    page: 1,
    per_page: 30,
    number: '',
    name: '',
    status:'1',
    parameter_id:'',
    errorParameters:[]

  };


  componentDidMount() {
    const that=this
    request(`/devices/${this.props.history.location.query.id}/parameters`,{
      method:'GET',
      params:{
        types:['error']
      }
    }).then((response)=>{
      if(response.status===200){
        that.setState({
          errorParameters:response.data.data,
          parameter_id:response.data.data[0].id
        },function () {
          this.handleSearch({
            page: 1,
            per_page: 30,
            started_at:moment().format('YYYY-MM-DD'),
            ended_at:moment().format('YYYY-MM-DD')
          });
        })
      }

    });

  }


  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'error/fetch',
      payload: {
        device_id:this.props.history.location.query.id,
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
          <Col md={5} sm={24}>
            <FormItem label="开始日期">
              {getFieldDecorator('started_at',{ initialValue: moment() })(<DatePicker  format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="结束日期">
              {getFieldDecorator('ended_at',{ initialValue: moment() })(<DatePicker  format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
         {/* <Col md={7} sm={24}>
            <FormItem label="参数">
              {getFieldDecorator('parameter_id',{ initialValue: this.state.parameter_id })(
                <Select >
                  {
                    this.state.errorParameters.map((item,index)=>{
                      return <Option key={index} value={item.id}>{`${item.collector_number}/${item.name}`}</Option>
                    })
                  }
                </Select >
              )}
            </FormItem>
          </Col>*/}
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={()=> {
                const {form} = this.props;
                form.validateFields((err, fieldsValue) => {
                  if (err) return;

                  const values = {
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
      error: {data, loading, meta},
    } = this.props;
    const columns = [{
      title: '时间',
      dataIndex: 'timestamp',
      render: (text)=> {
        return moment(text).format('MM-DD HH:mm:ss')
      }
    }]
    const renderHeader = (data.errors || []).map((item, index)=> {
      columns.push({
        title: item.name,
        dataIndex: `column-${index}`,
        className:'text-center',
        render:(text,record)=>{
          if(text===1){
            return <Icon type="check" style={{color:"#52c41a"}}/>
          }
          if(text===-1){
            return ''
          }
          return text
        }
      })
    })
    let parseData=[]
    if (data.data) {
      for (let i = 0; i < data.data.length; i++) {
        let row={}
        for(let key in data.data[i].data){
          row[`column-${key}`]=data.data[i].data[key].value
        }
        parseData.push({
          ...row,
          timestamp: data.data[i].timestamp
        })
      }

    }
    console.log('parseData',parseData)
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize,started_at:this.state.started_at,
          ended_at:this.state.ended_at,status:this.state.status})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize,started_at:this.state.started_at,
          ended_at:this.state.ended_at,status:this.state.status})
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
              className={'error-table'}
              style={{backgroundColor:'#fff'}}
              loading={loading}
              rowKey={'timestamp'}
              dataSource={parseData}
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
