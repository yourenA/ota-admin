import React, {PureComponent} from 'react';
import {findDOMNode} from 'react-dom';
import moment from 'moment';
import {connect} from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Badge,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  message ,
  Select,
} from 'antd';
import request from '@/utils/request';
// import * as THREE from 'three';
let THREE = window.THREE
console.log('THREE',THREE);
import OBJLoader from './../threejsLibs/OBJLoader';
import OrbitControls from  './../threejsLibs/OrbitControls';
import GLTFLoader from './../threejsLibs/GLTFLoader';
//import exhibitObj from './../threejsLibs/wall.obj';
import gtlf from './../threejsLibs/model.gltf';
import lan from './../threejsLibs/lan.png'
import door from './../threejsLibs/door.png'

@connect(({user_manage, loading}) => ({
}))
@Form.create()
class BasicList extends PureComponent {
  constructor(props) {
    super(props);
    this.threeRef = React.createRef();
    this.state = {
    };
  }

  componentDidMount() {
    const width = document.querySelector('#d3').offsetWidth;
    const height = document.querySelector('#d3').offsetHeight;
    // todo 初始化场景
    const scene = new THREE.Scene();
    // todo 加载相机
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 500, 500);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //todo 加载光线
    const ambLight = new THREE.AmbientLight(0x404040, 0.5);
    const pointLight = new THREE.PointLight(0x404040, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    pointLight.position.set(100, 10, 0);
    pointLight.receiveShadow = true;
    scene.add(ambLight);
    scene.add(pointLight);
    scene.add(directionalLight);
    //todo  renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(width, height);
    //renderer.setClearColor(0xb9d3ff,1);
    renderer.setClearColor(0x000000, 1.0);

    // todo 场景控制器初始化
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = true; // 鼠标控制是否可用

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;

    var geometry = new THREE.BoxBufferGeometry( 20, 20, 200 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

    var cube = new THREE.Mesh( geometry, material );

    // this.scene.add(cube)
    const that=this

    var OBJLoader = new THREE.OBJLoader();
//    OBJLoader.load(exhibitObj, function (obj) {
//      console.log('obj',obj)
//      obj.scale.set(0.98, 5, 1);
//      var texLan = new THREE.TextureLoader().load(lan);
//      texLan.wrapS = THREE.RepeatWrapping;
//      texLan.wrapT = THREE.RepeatWrapping;
//     texLan.repeat.set(40, 1);
//      obj.children[0].material = new THREE.MeshBasicMaterial({
//        side: THREE.DoubleSide,
//        map: texLan,
//        transparent: true,
//      });
//      obj.children[1].material = new THREE.MeshBasicMaterial({
//        map: new THREE.TextureLoader().load(door),
//        side: THREE.DoubleSide,
//        transparent: true,
//      });
//      obj.position.y=-100
//
//      that.scene.add(obj)
//    });

    var loader2 = new THREE.GLTFLoader();

    loader2.load( gtlf, function ( object ) {
      console.log('object',object)
      that.scene.add( object.scene  );
    }, undefined, function ( error ) {
      console.error( 'error',error );

    } );

    // 初始化场景
    // 加载到dom元素上
    this.threeRef.current.appendChild(this.renderer.domElement)

    this.start();

    window.addEventListener('resize',this.resizeFunc1 ,false);
    window.addEventListener('resize',this.resizeFunc2 ,false);

  }
  resizeFunc1 = () => {
    this.controls.update();
  }

  resizeFunc2 = (e) =>  {
    const width = document.querySelector('#d3').offsetWidth;
    const height = document.querySelector('#d3').offsetHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // 初始化
  start = () => {
    if(!this.frameId){
      this.frameId = requestAnimationFrame(this.animate)
    }
  }
// 更新状态
  animate = () => {
    this.controls.update();
    this.renderScene();
    this.frameId = requestAnimationFrame(this.animate);
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }


  render() {
    return (
      <div style={{margin:'-24px'}} >
        <div
          style={{width:'100%',height:'calc(100vh - 64px)'}}
          id="d3"
          ref={ this.threeRef }
        />
      </div>

    )
  }
}

export default BasicList;
