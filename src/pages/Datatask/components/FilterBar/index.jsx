import React, { useState } from 'react';
import IceContainer from '@icedesign/container';
import { Select, DatePicker } from '@alifd/next';
import styles from './index.module.scss';
import { Button, Message } from '@alifd/next';

export default function FilterBar() {
  const { Group: ButtonGroup } = Button;
  const [reportPath, setReportPath] = useState({});
  const [mobile, setMobile] = useState();
  var [taskId, setTask] = useState(1.1);
  var [card, setCard]= useState();

  const submit = () => {
    console.log(data);
    // var temp = data.lanes[0].cards[0];
    // data.lanes[0].cards[0]=data.lanes[0].cards[1];
    // data.lanes[0].cards[1]=temp;
    fetch(' http://30.208.45.10:8888/tasks/v1/'+taskId, {
      method: 'post',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
      body: JSON.stringify({"title":"Read a book"})
    })
      .then(response => response.json())
      // .then(() => data.log(response.json()))
      .then(data => {
        setReportPath(data.reportPath);
        setMobile(data.mobile);
        if (data.result === 'pass') {
          return Promise.resolve();
        } else {
          return Promise.reject();
        }

      })
      .then(() => Message.success('造数成功'))
      .catch(() => Message.success('造数失败，请查看报告或者联系管理员'))
  };

  /**
   * Select 发生改变的时候触发的回调
   */
  const handleSelectChange = (value) => {
    console.log('handleSelectChange:', value);
  };

  /**
   * DatePicker 发生改变的时候触发的回调
   */
  const handleDatePickerChange = (value) => {
    console.log('handleDatePickerChange:', value);
  };

  return (
    <IceContainer className={styles.container}>
      <Select
        size="large"
        style={{ width: '200px' }}
        onChange={handleSelectChange}
        defaultValue="taobao"
      >
        <Select.Option value="taobao">淘宝技术部</Select.Option>
        <Select.Option value="aliyun">阿里云事业部</Select.Option>
        <Select.Option value="dingding">钉钉事业部</Select.Option>
      </Select>
      {/*<DatePicker size="large" onChange={handleDatePickerChange} />*/}

        <ButtonGroup>
          <Button
            onClick={submit}
            type="primary">
            提交
          </Button>
        </ButtonGroup>
        <a href={reportPath} target="view_window">   报告</a><div>用户ID:{mobile}</div>

    </IceContainer>
  );
}
