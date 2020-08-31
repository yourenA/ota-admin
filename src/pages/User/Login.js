import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import { Icon ,notification} from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import {formatMessage, FormattedMessage, setLocale, getLocale} from 'umi/locale';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import Footer from './../../layouts/Footer';
import styles from './Login.less'
import logo from '../../images/logo.png';
import SelectLang from '@/components/SelectLang';
import request from '@/utils/request';
import find from 'lodash/find'
// @connect(({ login, loading }) => ({
//   login,
//   submitting: loading.effects['login/login'],//根据 loading.effects 对象判断当前异步加载是否完成
// }))


@connect()
 class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state={
      password:'',
      username:'',
      company_name: '',
      company_code: '',
    }
  }
  componentDidMount() {
    const that=this;
    document.addEventListener('keyup',function (e) {
      if(e.keyCode===13){
        that.handleSubmit()
      }
    })
  }
  componentWillReceiveProps = (nextProps)=> {
  }
  handleChange=(key,value)=>{
    this.setState({
      [key]:value
    })
  }
  handleSubmit = () => {
    const {username,password,company_code}=this.state
    if(!username){
      notification.error({
        message:formatMessage({ id: 'app.login.username.null', defaultMessage: '用户名为空' })
      });
      return false
    }
    if(!password){
      notification.error({
        message:formatMessage({ id: 'app.login.password.null', defaultMessage: '密码为空' })
      });
      return false
    }
    this.props.dispatch({
      type: `login/login`,
      payload: {
        password,
        username,
        company_code
        // company_id:values.company_id.key,
      },
      callback: ()=> {

      }
    });
  }
  render() {

    // const classes = {};
    return <Grid container component="main" className={styles.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={styles.image}>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={styles.rightBox}>
        <div className={styles.paper}>
          <div className={styles.formBox}>
            <div className="animated fadeInRight">
              <Avatar src={logo} className={styles.avatar}>
              </Avatar>

              <Typography component="h1" variant="h5">
                广州辂轺RTU管理平台
              </Typography>
            </div>

            <form  className={`${styles.form} animated fadeInRight`} >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label={
                  <FormattedMessage
                    id="app.login.username"
                    defaultMessage="密码"
                  />
                }
                value={this.state.username}
                onChange={(e)=>this.handleChange('username',e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label={
                  <FormattedMessage
                    id="app.login.password"
                    defaultMessage="密码"
                  />
                }
                type="password"
                id="password"
                autoComplete="current-password"
                value={this.state.password}
                onChange={(e)=>this.handleChange('password',e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon  />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={styles.submit}
                onClick={this.handleSubmit}
              >
                <FormattedMessage
                  id="app.login.login"
                  defaultMessage="登 录"
                />
              </Button>
            </form>
          </div>
          <div  className={`${styles.copyright} animated fadeInRight`}>
            <Footer />
          </div>
        </div>
      </Grid>
    </Grid>
    /* return (
     <div className={styles.main}>
     <Form onSubmit={this.handleSubmit}>
     <FormItem>
     {getFieldDecorator('username', {
     rules: [{
     required: true, message: '请输入用户名！',
     }],
     })(
     <Input
     size="large"
     prefix={<Icon type="user" className={styles.prefixIcon} />}
     placeholder="用户名"
     />
     )}
     </FormItem>
     <FormItem>
     {getFieldDecorator('password', {
     rules: [{
     required: true, message: '请输入密码！',
     }],
     })(
     <Input
     size="large"
     prefix={<Icon type="lock" className={styles.prefixIcon} />}
     type="password"
     placeholder="密码"
     />
     )}
     </FormItem>
     <FormItem >
     <Button size="large" loading={submitting} block type="primary" htmlType="submit">
     登录
     </Button>
     </FormItem>
     </Form>
     </div>
     );*/
  }

}
export  default LoginPage
