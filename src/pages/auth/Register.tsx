import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { account } from "../../config/appwriteConfig";
import { AppwriteException, ID } from "appwrite";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    const promis = account.create(
      ID.unique(),
      authState.email,
      authState.password,
      authState.name
    );
    promis
      .then((res) => {
        console.log("The response is", res);
        setLoading(false);
        navigate("/login");
        toast.success("Account created successfully!please login now", {
          theme: "colored",
        });
      })
      .catch((err: AppwriteException) => {
        setLoading(false);
        toast.error(err.message, { theme: "colored" });
      });
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-[500px] p-4 rounded-md shadow">
        <h1 className="text-3xl font-bold text-red-400 text-center">ChatApp</h1>
        <h1 className="text-2xl font-bold">Register</h1>
        <p>Welcome Back to world of communities chats</p>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <Input
              label="Name"
              type="text"
              onChange={(e) =>
                setAuthState({ ...authState, name: e.target.value })
              }
            />
          </div>
          <div className="mt-5">
            <Input
              label="Email"
              type="email"
              onChange={(e) =>
                setAuthState({ ...authState, email: e.target.value })
              }
            />
          </div>
          <div className="mt-5">
            <Input
              label="Password"
              type="password"
              onChange={(e) =>
                setAuthState({ ...authState, password: e.target.value })
              }
            />
          </div>
          <div className="mt-5">
            <Button
              color="danger"
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Processing.." : "Submit"}
            </Button>
          </div>
          <div className="text-center mt-2">
            <p>
              Already have an account ?{" "}
              <strong>
                <Link to="/login">Login</Link>
              </strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
