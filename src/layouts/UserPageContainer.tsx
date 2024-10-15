import { FunctionComponent, ReactNode } from "react";
import NavBar from "../components/NavBar";

type Props = {
  children: ReactNode;
};

const UserPageContainer: FunctionComponent<Props> = ({ children }) => {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default UserPageContainer;
