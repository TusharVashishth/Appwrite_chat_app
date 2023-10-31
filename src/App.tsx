import { useEffect, useRef } from "react";
import { Button } from "@nextui-org/react";
import { account } from "./config/appwriteConfig";
import { userStore } from "./state/userStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppNavbar from "./components/AppNavbar";
import CreateCommunity from "./components/CreateCommunity";
import CommunitiesList from "./components/CommunitiesList";
function App() {
  const isRendered = useRef<boolean>(false);
  const userState = userStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRendered.current) {
      account
        .get()
        .then((res) => {
          userState.updateUser(res);
        })
        .catch(() => {
          userState.resetState();
          navigate("/login");
          toast.error("Your session got expired.please login again", {
            theme: "colored",
          });
        });
      isRendered.current = true;
    }
  }, []);
  return (
    <>
      <AppNavbar />
      <div className="p-10 w-screen h-screen">
        <div className="flex justify-end">
          <CreateCommunity />
        </div>
        <CommunitiesList />
      </div>
    </>
  );
}

export default App;
