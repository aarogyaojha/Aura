import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInAction, clearMessage } from "../redux/actions/authActions";
import { AiFillGithub } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Mail, Lock } from "lucide-react";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import Logo from "../assets/aura_logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoadingText("Signing in...");
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const timeout = setTimeout(() => {
      setLoadingText(
        "This is taking longer than usual. Please wait while backend services are getting started."
      );
    }, 5000);
    await dispatch(signInAction(formData, navigate));
    setLoading(false);
    clearTimeout(timeout);
  };

  const signInError = useSelector((state) => state.auth?.signInError);
  const successMessage = useSelector((state) => state.auth?.successMessage);

  const handleClearMessage = () => {
    dispatch(clearMessage());
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md shadow-xl border-none ring-1 ring-black/5">
        <CardHeader className="space-y-4 flex flex-col items-center">
          <div className="flex justify-center transition-transform hover:scale-105 duration-300">
            <img className="h-20 w-auto sm:h-24" src={Logo} alt="Aura Logo" />
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-primary">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {signInError && (
              <div
                className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive text-sm"
                role="alert"
              >
                <span className="font-medium">{signInError}</span>
                <button
                  type="button"
                  className="hover:opacity-70 transition-opacity"
                  onClick={handleClearMessage}
                >
                  <RxCross1 className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {successMessage && (
              <div
                className="flex items-center justify-between rounded-lg border border-green-400/20 bg-green-100 flex items-center justify-between px-4 py-3 text-green-700 text-sm"
                role="alert"
              >
                <span className="font-medium">{successMessage}</span>
                <button
                  type="button"
                  className="hover:opacity-70 transition-opacity"
                  onClick={handleClearMessage}
                >
                  <RxCross1 className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className="flex border-b border-muted">
              <Link
                to={"/signin"}
                className="w-1/2 pb-4 text-center font-semibold text-primary border-b-2 border-primary transition-all"
              >
                Sign In
              </Link>
              <Link
                to={"/signup"}
                className="w-1/2 pb-4 text-center font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                Sign Up
              </Link>
            </div>

            <div className="space-y-4 pt-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 border-muted bg-background focus-visible:ring-primary"
                  placeholder="Email address"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10 border-muted bg-background focus-visible:ring-primary"
                  placeholder="Password"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <Button
              className="w-full mt-6 h-11 font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <ButtonLoadingSpinner loadingText={loadingText} />
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t border-muted/50 pt-6">
          <div className="flex items-center justify-center gap-6 text-sm">
            <a
              href="https://github.com/aarogyaojha"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <AiFillGithub className="h-5 w-5" />
              <span>GitHub</span>
            </a>
            <Link
              to="/admin"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MdOutlineAdminPanelSettings className="h-5 w-5" />
              <span>Admin</span>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};

export default SignIn;
