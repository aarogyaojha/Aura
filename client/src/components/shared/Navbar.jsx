import { useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import { logoutAction } from "../../redux/actions/authActions";
import { LogOut, Menu, X, User as UserIcon, Mail } from "lucide-react";
import Logo from "../../assets/aura_logo.png";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import NotificationMenu from "./NotificationMenu";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = ({ userData, showLeftbar, toggleLeftbar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    await dispatch(logoutAction());
    setLoggingOut(false);
    navigate("/signin");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-36 py-3">
      <div className="flex h-14 items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleLeftbar}
          >
            {showLeftbar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <Link to="/" className="hidden md:flex items-center space-x-2 transition-transform hover:scale-105 duration-200">
            <img className="h-9 w-auto dark:invert" src={Logo} alt="Aura" />
          </Link>
        </div>

        {/* Search Section */}
        <div className="flex-1 max-w-xl">
          <Search />
        </div>

        {/* User Specific Actions */}
        <div className="flex items-center gap-2">
          <NotificationMenu />
          <DarkModeToggle />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20 focus-visible:ring-2 focus-visible:ring-primary">
                <Avatar className="h-9 w-9 border border-muted shadow-sm">
                  <AvatarImage src={userData.avatar} alt={userData.name} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {userData.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-64 mt-2 p-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-semibold leading-none text-foreground">{userData.name}</p>
                  <p className="text-xs leading-none text-muted-foreground pt-1 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {userData.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator className="my-2" />
              
              <Link to="/profile">
                <DropdownMenuItem className="cursor-pointer gap-2 py-2.5">
                  <UserIcon className="h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
              </Link>
              
              <DropdownMenuSeparator className="my-2" />
              
              <DropdownMenuItem 
                className="cursor-pointer gap-2 py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive" 
                onClick={logout}
                disabled={loggingOut}
              >
                <LogOut className="h-4 w-4" />
                <span>{loggingOut ? "Logging out..." : "Logout"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
