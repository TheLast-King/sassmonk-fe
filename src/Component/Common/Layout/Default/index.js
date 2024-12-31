import { memo } from "react";
import HeaderComponent from "../../Header";

const DefaultLayout = ({
  children,
  withSideBar = false,
  ...rest
}) => {
  return (
    <div>
      <HeaderComponent {...rest} />
      <div
        style={{ minHeight: "100vh" }}
        className="min-h-screen mt-0 bg-gradient-to-r from-black via-gray-900 to-black"
      >
        {children}
      </div>
    </div>
  );
};

export default memo(DefaultLayout);
