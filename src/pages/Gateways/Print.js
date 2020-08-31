import React, {PureComponent, Fragment} from 'react';
import './print.less';
import JsBarcode from 'jsbarcode'
// import axios from "axios";
class App extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            productCode:this.getUrlParms('productCode'),
            numbers:this.getUrlParms('numbers').split(','),
        };
    }
    getUrlParms=(name)=> {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = this.props.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return '';
    }
    componentDidMount() {
        console.log('this.props',this.props)
        console.log('this.state',this.state)
        const that = this;
        for(let i=0;i<this.state.numbers.length;i++){
            JsBarcode(document.querySelector(`#barcode_${this.state.numbers[i]}`),this.state.numbers[i], {
                format: "CODE128",
                displayValue: false,
                width: 1.1,
                height: 20,
                margin: 0,
            });
            if(i===this.state.numbers.length-1){
                setTimeout(function () {
                    window.print()
                },300)
            }
        }
    }

    render() {
        const that=this
        return (
            <div>
                {
                this.state.numbers.map(function (item,index) {
                    return  <div className={'custom-print'} key={index}>
                        <p>智能RTU</p>
                        <p style={{textAlign:'left',paddingLeft:'15px'}}>产品码:{that.state.productCode}</p>
                        <p style={{textAlign:'left',paddingLeft:'15px'}}>序列号:{item}</p>
                        <svg  id={`barcode_${item}`}></svg>
                    </div>
                })}
            </div>


        );
    }
}

export default App;
