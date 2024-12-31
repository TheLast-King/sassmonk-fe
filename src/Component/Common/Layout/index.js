import DefaultLayout from "./Default";

const LayoutTypesMapping = {
  DefaultLayout
};

const defaultLayoutType = "DefaultLayout";

const Layout = ({ asLayout = defaultLayoutType, children, ...rest }) => {
  const LayoutType = LayoutTypesMapping[asLayout];

  if (!LayoutType) {
    throw new Error(`Unknown layout type: ${asLayout}`);
  }

  return (
    <LayoutType hideHeader={false} withSideBar={false} {...rest}>
      {children}
    </LayoutType>
  );
};

export default Layout;
