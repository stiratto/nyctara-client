import { apiLogIn } from "@/api/auth/auth.api";
import { Button } from "@/components/ui/button";
import { AppDispatch } from "@/store/store";
import { logIn } from "@/store/userAuth/userAuthSlice";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { mutate: handleLogin } = useMutation({
    mutationFn: () => apiLogIn(password),
    onSuccess: (data: any) => {
      console.log(data.access_token);
      dispatch(logIn({ token: data.access_token }));
      navigate("/");
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center w-full max-w-sm bg-[#7f807a] rounded-lg p-4 shadow-md gap-4"
      >
        <input
          type="text"
          className="mt-4 w-full bg-[#ecefdc] text-[#7f807a] rounded-lg p-2 border-none text-sm "
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          type="submit"
          className="p-2 bg-[#ecefdc] lowercase rounded-lg w-full"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Login;
