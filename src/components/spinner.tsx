import { Spin } from "antd";
import React, { FC } from "react";
interface SpinnerProps {
  show: boolean;
}
const Spinner: FC<SpinnerProps> = (props) => {
  return props.show ? (
    <div className="bg-[rgba(0,0,0,0.1)] h-screen absolute top-0 left-0 right-0 flex items-center justify-center z-50">
      <Spin />
    </div>
  ) : null;
};
export default Spinner;
