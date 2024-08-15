import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Label } from "@radix-ui/react-label";
import kitlogo from "../../public/kitlogo.png";

interface ErrorMessages {
  email?: string;
  password?: string;
  confirmPassword?: string;
  [key: string]: string | undefined;
}

const SignupUser = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorMessages>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signupUser = async () => {
    try {
      setIsLoading(true); // Set loading to true
      setErrors({}); // Clear previous errors
      if (password !== confirmPassword) {
        setErrors({ confirmPassword: "Passwords do not match" });
        setIsLoading(false);
        return;
      }
      const user = {
        email,
        password,
      };
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/signup`, user);
      if (response?.data.success) {
        localStorage.setItem('authToken', response?.data.authToken);
        toast.success(response?.data.message);
        navigate('/userdashboard'); // Navigate after successful signup
      } else {
        toast.error(response?.data.message);
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1">
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center items-center">
            <img src={kitlogo} alt="kitlogo" className="w-1/2 h-1/2" />
          </div>
          <h1 className="font-bold text-3xl text-[#2E2A47]">
            Welcome to <span className="text-blue-600">KIT TPO</span>
          </h1>
        </div>
        <div className="mt-2">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Enter your details below to signup
              </CardDescription>
            </CardHeader>
            <CardContent className="grid ">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                {errors.email && <div className="ml-2">
                  <p className="text-sm text-red-400">
                    {errors.email}
                  </p>
                </div>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex  items-center">
                  <Input 
                    id="password" 
                    type={isPasswordVisible ? 'text' : 'password'} 
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button 
                    variant={'outline'} 
                    onClick={() => setIsPasswordVisible((t) => !t)}
                    style={{
                      aspectRatio: 1,
                      padding: '0',
                      borderColor: 'rgb(226 232 240 / 1)',
                    }}
                    disabled={isLoading}
                  >
                    {isPasswordVisible && <EyeOffIcon color="rgb(226 232 240 / 1)" size={24} />}
                    {!isPasswordVisible && <EyeIcon color="rgb(226 232 240 / 1)" size={24} />}
                  </Button>
                </div>
                {errors.password && <div className="ml-2">
                  <p className="text-sm text-red-400">
                    {errors.password}
                  </p>
                </div>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="flex items-center">
                  <Input 
                    id="confirm-password" 
                    type={isPasswordVisible ? 'text' : 'password'} 
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button 
                    variant={'outline'} 
                    onClick={() => setIsPasswordVisible((t) => !t)}
                    style={{
                      aspectRatio: 1,
                      padding: '0',
                      borderColor: 'rgb(226 232 240 / 1)',
                    }}
                    disabled={isLoading}
                  >
                    {isPasswordVisible && <EyeOffIcon color="rgb(226 232 240 / 1)" size={24} />}
                    {!isPasswordVisible && <EyeIcon color="rgb(226 232 240 / 1)" size={24} />}
                  </Button>
                </div>
                {errors.confirmPassword && <div className="ml-2">
                  <p className="text-sm text-red-400">
                    {errors.confirmPassword}
                  </p>
                </div>}
              </div>
            </CardContent>
            <CardFooter>
                <div className="grid gap-2 w-full">
                    <Button 
                        className="w-full max-w-[500px] mx-auto bg-blue-600 hover:bg-blue-500"
                        onClick={signupUser}
                        disabled={isLoading}
                        >
                        {isLoading ? 'Signing up...' : 'Sign up'}
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                    </div>
                    <div className="text-center mt-1">
                        <span className="text-sm text-gray-600">
                            Don't have an account? <Link to="/signinuser" className="text-blue-600 hover:underline">Log in</Link>
                        </span>
                    </div>
                </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SignupUser
