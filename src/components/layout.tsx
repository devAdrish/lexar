import React, { FC } from "react";
import Navbar from "./navbar";
interface LayoutProps {
  children: any;
}
const Layout: FC<LayoutProps> = (props) => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        {props.children}
      </div>
      
    </>
  );
};

export default Layout;
