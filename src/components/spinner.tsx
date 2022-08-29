import { Spin } from "antd";
import React, { FC } from "react";
interface SpinnerProps {
  show: boolean;
}
const Spinner: FC<SpinnerProps> = (props) => {
  return props.show ? <Spin /> : null;
};
export default Spinner;
