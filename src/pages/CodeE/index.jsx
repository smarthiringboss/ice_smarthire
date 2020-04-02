import React, { Component, useState, useEffect,PropTypes } from 'react';
import CustomCodemirror from './components/CustomCodemirror';
import {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import {Treebeard} from 'react-treebeard';
import cogoToast from 'cogo-toast';

const debug = true; // 本机调试开关
var host = "";
if (debug) {
    host = "localhost";
  } else {
  host = "30.208.45.10"
}


export default class TreeExample extends PureComponent {

  constructor(props) {
    super(props);
    console.log("初始化tree控件");
    // 初始化需要的变量state
    this.state = {
      data: {
        name: 'root',
        toggled: true,
        children: [
          {
            name: 'parent',
            children: [
              {name: 'child1'},
              {name: 'child2'}
            ]
          },
          {
            name: 'loading parent',
            loading: true,
            children: []
          },
          {
            name: 'parent',
            children: [
              {
                name: 'nested parent',
                children: [
                  {name: 'nested child 1'},
                  {name: 'nested child 2'}
                ]
              }
            ]
          }
        ]
      },
      fileConent: {code: "文件存储在服务器上，如果临时调试请记得改回去~"},
      filePath: ""
    };
    this.onToggle = this.onToggle.bind(this);
  }

  // 组件渲染后调用
  // fetch方法写在外面搞不定
  async componentDidMount() {
    console.log("enter did mount...");
    fetch(' http://' + host + ':9999/code/pullall', {
      method: 'post',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
      body: JSON.stringify({})
    })
      .then(response => response.json())
      // .then(() => data.log(response.json()))
      .then(fileListdata => {
        // setData(data);
        if (fileListdata != null) {
          console.log("读取文件列表成功");
          console.log(fileListdata);
          // 重要：设置文件列表控件内容
          this.setState({data: fileListdata});
        } else {
          return Promise.reject();
        }
      })
      .then(() => {
          cogoToast.success('读取文件成功');
        }
      ).catch(()=>{
        cogoToast.success("读取文件失败了~");
    })
  }

  // 文件点击事件
  onToggle(node, toggled) {
    const {cursor, data} = this.state;
    if (cursor) {
      this.setState(() => ({cursor, active: false}));
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    console.log("点击了node：");
    console.log(node);
    var codeContent = "";
    // 点击文件时获取文件内容
    // 这里考虑以后传全路径会安全一点，否则文件重名
    if (node.fullPath) {
      // 点击文件则获取服务器代码
      fetch(' http://' + host + ':9999/code/view', {
        method: 'post',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        body: JSON.stringify({path: node.fullPath})
      })
        .then(response => response.text())
        // .then(() => data.log(response.json()))
        .then(response => {
          if (response != '') {
            codeContent = response;
            // 设置编辑器内容
            this.setState(() => ({cursor: node, data: Object.assign({}, data), fileConent: {code: codeContent}, filePath: node.fullPath}));
          } else {
            return Promise.reject();
          }
        })
        .then(() => {
            cogoToast.success('读取成功');
          }
        )
        .catch(() => {
          cogoToast.success('读取失败~');
        })
    } else{
      // 点击文件夹也设置状态，否则tree无法展开
      this.setState(() => ({cursor: node, data: Object.assign({}, data), fileConent: {code: codeContent}, filePath: ""}));
    };
  }

  render() {
    // this.fetchFiles();
    // 渲染时获取文件内容，并传递给编辑器组件
    const {data, fileConent, filePath} = this.state;
    return (
      <>
        <Treebeard
          data={data}
          onToggle={this.onToggle}
        />
        <CustomCodemirror fileData={fileConent} filePath={filePath}/>
      </>
    );
  }
}
// const content = document.getElementById('content');


// export default function() {
//
//   return (
//     <div className="CodeE-page">
//       <div id="content">
//         <h3>If you can see this, something is broken (or JS is not enabled)!</h3>
//       </div>
//       {/* CodeMirror是一款功能强大的代码高亮插件，他不仅提供了高亮功能，其丰富的方法属性也封装了缩进、自动换行、获取编辑文本、设置编辑文本、回退功能等多种实用效果 */}
//       <CustomCodemirror />
//     </div>
//
//   );
//   ReactDOM.render(<TreeExample/>, content);
// }
