import React, { useState } from 'react';
import IceContainer from '@icedesign/container';
import { Step, Button, Message } from '@alifd/next';
import styles from './index.module.scss';

const { Item: StepItem } = Step;
const { Group: ButtonGroup } = Button;

export default function SimpleStep() {
  // 默认第一步选择好
  const [currentStep, setCurrentStep] = useState(0);
  const [reportPath, setReportPath] = useState({});
  const [mobile, setMobile] = useState();
  var [taskId, setTask] = useState(1.1);


  const submit = () => {
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

  const prev = () => {
    setCurrentStep(currentStep - 1 < 0 ? 0 : currentStep - 1);
  };

  const onClick = (currentStep) => {
    console.log(currentStep);
    setCurrentStep(currentStep);
  };

  // 设置造数具体task节点
  const set_Task = (task_id) => {
    setTask(task_id);
  };

  return (
    <IceContainer title="奖励金版">
      <Step current={currentStep}>
        <StepItem title="生成会员" onClick={() => {onClick(0);set_Task(1.1);}} />
        <StepItem title="兑换一个普通红包" onClick={() => {onClick(1);set_Task(1.2);}} />
        <StepItem title="将此红包兑换成商家券" onClick={() => {onClick(2);set_Task(1.3);}} />
        <StepItem title="步骤4" onClick={() => {onClick(3);set_Task(1.4);}} />
        <StepItem title="步骤5" onClick={() => {onClick(4);set_Task(1.5);}} />
        <StepItem title="步骤6" onClick={() => {onClick(5);set_Task(1.8);}} />
      </Step>
      <a href={reportPath} target="view_window">报告</a><div>用户ID:{mobile}</div>
      <div className={styles.buttonGroup}>
        <ButtonGroup>
          <Button
            onClick={submit}
            type="primary"
            // disabled={currentStep === 5}
          >
            提交
          </Button>
        </ButtonGroup>
      </div>
    </IceContainer>
  );
}
