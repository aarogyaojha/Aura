import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getNotificationsAction, 
  markNotificationsReadAction, 
  markOneReadAction, 
  deleteNotificationAction 
} from "../../redux/actions/notificationActions";
import { 
  Bell, 
  MessageSquare, 
  Heart, 
  UserPlus, 
  Users, 
  PlusSquare, 
  Trash2, 
  CheckCircle,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";

dayjs.extend(relativeTime);

const NotificationMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(getNotificationsAction());
    
    if (socket) {
      socket.on("newNotification", (notification) => {
        // Refresh notifications list when a new one arrives
        dispatch(getNotificationsAction());
        // You could also just append the new notification to the state, 
        // but getNotificationsAction ensures everything is synced with server.
      });

      return () => {
        socket.off("newNotification");
      };
    }
  }, [dispatch, socket]);

  const handleMarkAllRead = () => {
    dispatch(markNotificationsReadAction());
  };

  const handleNotificationClick = (notification) => {
    dispatch(markOneReadAction(notification._id));
    setIsOpen(false);

    if (notification.type === "comment" || notification.type === "like" || notification.type === "post_created") {
      navigate(`/post/${notification.post._id}`);
    } else if (notification.type === "follow") {
      navigate(`/profile/${notification.sender._id}`);
    } else if (notification.type === "community_join") {
      navigate(`/community/${notification.community.name}`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "comment": return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "like": return <Heart className="h-4 w-4 text-red-500 fill-red-500" />;
      case "follow": return <UserPlus className="h-4 w-4 text-green-500" />;
      case "community_join": return <Users className="h-4 w-4 text-purple-500" />;
      case "post_created": return <PlusSquare className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getMessage = (notification) => {
    const senderName = <span className="font-bold text-foreground">{notification.sender.name}</span>;
    switch (notification.type) {
      case "comment": return <p>{senderName} commented on your post</p>;
      case "like": return <p>{senderName} liked your post</p>;
      case "follow": return <p>{senderName} started following you</p>;
      case "community_join": return <p>{senderName} joined {notification.community?.name}</p>;
      case "post_created": return <p>{senderName} created a new post</p>;
      default: return <p>New activity from {senderName}</p>;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative transition-all hover:bg-primary/10 rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary border-2 border-background animate-in zoom-in duration-300">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-[380px] mt-2 p-0" align="end" forceMount>
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <DropdownMenuLabel className="p-0 text-base font-bold flex items-center gap-2 text-foreground">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8 text-primary hover:text-primary/80 hover:bg-primary/5 font-semibold transition-colors"
              onClick={handleMarkAllRead}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 px-8 text-center space-y-3">
              <div className="p-4 bg-muted/20 rounded-full">
                <Bell className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
              <p className="text-xs text-muted-foreground/60 leading-relaxed">Notifications will appear here when people interact with you.</p>
            </div>
          ) : (
            <div className="p-1">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group relative flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-muted/40 ${!notification.isRead ? 'bg-primary/[0.03] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-primary before:rounded-r-full' : ''}`}
                >
                  <div className="relative shrink-0">
                    <img 
                      src={notification.sender.avatar} 
                      className="h-11 w-11 rounded-full object-cover border-2 border-background ring-1 ring-muted shadow-sm"
                      alt={notification.sender.name}
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-lg ring-1 ring-black/5">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="text-sm text-foreground leading-snug pr-6">
                      {getMessage(notification)}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                      <Clock className="h-3 w-3" />
                      {dayjs(notification.createdAt).fromNow()}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(deleteNotificationAction(notification._id));
                    }}
                    className="absolute right-3 top-4 p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive rounded-lg text-muted-foreground"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <DropdownMenuSeparator className="m-0" />
        <Button 
          variant="ghost" 
          className="w-full text-sm py-4 h-auto rounded-none text-muted-foreground hover:text-primary hover:bg-primary/5 font-semibold"
          onClick={() => {
            navigate("/notifications");
            setIsOpen(false);
          }}
        >
          View all notifications
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
