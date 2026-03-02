import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { signUpAction, clearMessage } from "../redux/actions/authActions";
import { Link } from "react-router-dom";
import ContextAuthModal from "../components/modals/ContextAuthModal";
import { RxCross1 } from "react-icons/rx";
import { User, Mail, Lock, Upload, CheckCircle2, ShieldAlert } from "lucide-react";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import Logo from "../assets/aura_logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const SignUpNew = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState(null);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signUpError = useSelector((state) => state.auth?.signUpError);

  const handleNameChange = (e) => setName(e.target.value);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsModerator(e.target.value.includes("mod.aura.com"));
  };

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setAvatar(null);
      setAvatarError(null);
      return;
    }
    if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
      setAvatar(null);
      setAvatarError("Please upload a valid image file (jpeg, jpg, png)");
    } else if (file.size > 10 * 1024 * 1024) {
      setAvatar(null);
      setAvatarError("Please upload an image file less than 10MB");
    } else {
      setAvatar(file);
      setAvatarError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingText("Signing up...");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("role", "general");
    formData.append("isConsentGiven", isConsentGiven.toString());

    const timeout = setTimeout(() => {
      setLoadingText("This is taking longer than usual...");
    }, 5000);

    await dispatch(signUpAction(formData, navigate, isConsentGiven, email));
    setLoading(false);
    setIsConsentGiven(false);
    clearTimeout(timeout);
  };

  const handleClearError = () => dispatch(clearMessage());

  return (
    <section className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md shadow-xl border-none ring-1 ring-black/5">
        <CardHeader className="space-y-4 flex flex-col items-center">
          <div className="flex justify-center transition-transform hover:scale-105 duration-300">
            <img className="h-20 w-auto sm:h-24" src={Logo} alt="Aura Logo" />
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-primary">Create Account</CardTitle>
            <CardDescription>Join Aura and start connecting</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {signUpError && Array.isArray(signUpError) && signUpError.map((err, i) => (
              <div
                className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive text-sm"
                role="alert"
                key={i}
              >
                <span className="font-medium">{err}</span>
                <button type="button" onClick={handleClearError}>
                  <RxCross1 className="h-3 w-3" />
                </button>
              </div>
            ))}

            <div className="flex border-b border-muted">
              <Link to="/signin" className="w-1/2 pb-4 text-center font-medium text-muted-foreground hover:text-foreground">
                Sign In
              </Link>
              <Link to="/signup" className="w-1/2 pb-4 text-center font-semibold text-primary border-b-2 border-primary">
                Sign Up
              </Link>
            </div>

            <div className="space-y-4 pt-4">
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="pl-10 h-10"
                  placeholder="Username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar" className="flex items-center justify-center gap-2 w-full h-12 border-2 border-dashed border-muted rounded-lg hover:border-primary hover:bg-primary/5 cursor-pointer transition-all">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Profile Photo</span>
                  <input id="avatar" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </Label>
                {avatar && <p className="text-xs text-center text-green-600 font-medium">{avatar.name}</p>}
                {avatarError && <p className="text-xs text-center text-destructive">{avatarError}</p>}
              </div>

              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="pl-10 h-10"
                  placeholder="Email address"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="pl-10 h-10"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <Button className="w-full mt-6 h-11 font-semibold" disabled={loading} type="submit">
              {loading ? <ButtonLoadingSpinner loadingText={loadingText} /> : "Sign Up"}
            </Button>

            <div 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 cursor-pointer"
            >
              {isConsentGiven && !isModerator ? (
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg border border-green-500/30 bg-green-50 text-green-700 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  Context Authentication Enabled
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg border border-muted bg-muted/20 text-muted-foreground text-xs font-medium hover:bg-muted/40 transition-colors">
                  <ShieldAlert className="h-4 w-4" />
                  Context Authentication Disabled
                </div>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <ContextAuthModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setIsConsentGiven={setIsConsentGiven}
            isModerator={isModerator}
          />
        </CardFooter>
      </Card>
    </section>
  );
};

export default SignUpNew;
