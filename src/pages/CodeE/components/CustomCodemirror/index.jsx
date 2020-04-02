import React, { useState,useEffect,PropTypes } from 'react';
import IceContainer from '@icedesign/container';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { Button, Message } from '@alifd/next';
import { Checkbox, Input, Form, Select, DatePicker } from '@alifd/next';
import { Grid } from '@alifd/next';
import cogoToast from 'cogo-toast';
import 'codemirror/lib/codemirror.css';
import './codeE.css';

import 'codemirror/theme/monokai.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/go/go'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/http/http'
import 'codemirror/mode/php/php'
import 'codemirror/mode/python/python'
import 'codemirror/mode/http/http'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/vue/vue'
import 'codemirror/mode/xml/xml'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/sql-hint'
import 'codemirror/addon/hint/html-hint'
import 'codemirror/addon/hint/xml-hint'
import 'codemirror/addon/hint/anyword-hint'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/fold/markdown-fold'
import 'codemirror/mode/meta'
import "codemirror/addon/fold/foldgutter.css"
import "codemirror/addon/fold/foldcode"
import 'codemirror/addon/selection/active-line'
import {resolveMode} from "codemirror/src/modes";

require('codemirror/mode/javascript/javascript');

const { Row, Col } = Grid;
const codeString = `
  const fn1 = () => {
    console.log('I ♥ ICE')
  }`;
const formItemLayout = {
  labelCol: {xxs: 7, s: 4, l: 30},
  wrapperCol: {xxs: 16, s: 10, l: 70},
};

export default function CustomCodemirror({fileData, filePath}) {
  const debug = true; // 本机调试开关
  var host = "";
  if (debug) {
    host = "localhost";
  } else {
    host = "30.208.45.10"
  }

  const {Group: ButtonGroup} = Button;
  const FormItem = Form.Item;
  const [value, setValue] = useState(fileData.code);
  const [appId, setAppId] = useState("biz.svip_order");
  const [path, setPath] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [canGenerate, setCanGenerate] = useState(false);
  const [canConvert, setCanConvert] = useState(false);

  useEffect(() => {
    setValue(fileData.code);
  }, [fileData.code]);

  // 重新选择文件时更改路径
  useEffect(()=>{
    setPath(filePath);
  },[filePath])

  // 编辑框变更事件
  const onChange = (editor, data, value) => {
    // console.log({ data, value });
    setValue(value);
    setIsDisabled(false);
  };

  // 提交代码到服务器
  const submit = () => {
    if (path != "") {
      fetch(' http://' + host + ':9999/code/submit', {
        method: 'post',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        body: JSON.stringify({path: path, codePiece: value})
      })
        .then(response => response.json())
        // .then(() => data.log(response.json()))
        .then(data => {
          if (data.result === 'pass') {
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        })
        .then(() => {
            cogoToast.success('提交成功');
          }
        )
        .catch(() => {
          cogoToast.success('提交失败~');
        })
    }
  };

  // 生成代码的request
  const generate = () => {
    if (appId != "") {
      fetch(' http://' + host + ':9999/code/generate', {
        method: 'post',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        body: JSON.stringify({appId: appId})
      })
        .then(response => response.json())
        // .then(() => data.log(response.json()))
        .then(data => {
          if (data.result === 'pass') {
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        })
        .then(() => {
            cogoToast.success('生成成功');
          }
        )
        .catch(() => {
          cogoToast.success('生成失败~');
        })
    }
  };

  // 转换代码的request
  const convert = () => {
      fetch(' http://' + host + ':9999/code/convert', {
        method: 'post',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        body: JSON.stringify({obj: value})
      })
        .then(response => response.text())
        // .then(() => data.log(response.json()))
        .then(response => {
          if (response != '') {
            setValue(response);

          } else {
            return Promise.reject();
          }
        })
        .then(() => {
            cogoToast.success('转换成功');
          }
        )
        .catch(() => {
          cogoToast.success('转换失败~');
        })
  };

  const renderCodeMirror = () => {
    const options = {
      theme: 'monokai',
      styleActiveLine: true,
      mode: 'python',
      lineNumbers: true,
      extraKeys: {"Ctrl": "autocomplete"},//输入s然后ctrl就可以弹出选择项
      tabSize: '4',
      smartIndent: true,
      scrollbarStyle: "overlay",
      lineWrapping: true, //代码折叠,
      matchBrackets: true,  //括号匹配
      autoCloseBrackets: true
    };

    let instance = null;

    return (
      <CodeMirror
        className="CodeMirror"
        value={value}
        options={options}
        onChange={onChange}
        editorDidMount={(editor) => {
          instance = editor; // save it here
        }}
        onSet={(editor, value) => {
          setTimeout(() => {
            instance.setSize(1000, 1000); // example, do this *anywhere*
          }, 1);
        }}
      />
    )
  };

  return (
    <IceContainer>
      {/*<Row wrap>*/}
      {/*  <Col l="12" xxs="24">*/}
      <FormItem
        label="生成代码："
        {...formItemLayout}
      >
        <Button
          onClick={generate}
          type="primary"
          disabled={canGenerate}>
          生成
        </Button>
        <Button
          onClick={convert}
          type="primary"
          disabled={canConvert}>
          代码转换
        </Button>
        <Input
          name="appIdInput"
          htmlType=""
          size="large"
          value={appId}
          onChange={(value) => setAppId(value)}
        />
      </FormItem>

      <FormItem
        label="当前文件："
        {...formItemLayout}
      >
        <Input
          name="filePathInput"
          htmlType=""
          size="large"
          value={path}
          onChange={(value) => setPath(value)}
        />
      </FormItem>
      {renderCodeMirror()}
      {/*  </Col>*/}
      {/*</Row>*/}
      <ButtonGroup>
        <Button
          onClick={submit}
          type="primary"
          disabled={isDisabled}>
          提交
        </Button>
      </ButtonGroup>
    </IceContainer>

  );
}
