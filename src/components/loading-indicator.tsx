import React, { FC } from "react";
import { Spin } from "antd";

const LoadingIndicator: FC<{show: boolean}> = ({ show }) => {
  return show ? (
    <div className="bg-[rgba(0,0,0,0.1)] h-screen absolute top-0 left-0 right-0 flex items-center justify-center z-50">
      <Spin />
    </div>
  ) : null;
};
export default LoadingIndicator;
