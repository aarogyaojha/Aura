import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getNotificationsAction, 
  markNotificationsReadAction, 
  markOneReadAction, 
  deleteNotificationAction 
} from "../redux/actions/notificationActions";
import { 
  Bell, 
  MessageSquare, 
  Heart, 
  UserPlus, 
  Users, 
  PlusSquare, 
  Trash2, 
  CheckCircle,
  Clock,
  Settings,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

dayjs.extend(relativeTime);

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getNotificationsAction());

    if (socket) {
      socket.on("newNotification", () => {
        dispatch(getNotificationsAction());
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
    if (!notification.isRead) {
      dispatch(markOneReadAction(notification._id));
    }

    if (notification.type === "comment" || notification.type === "like" || notification.type === "post_created") {
      navigate(`/post/${notification.post?._id}`);
    } else if (notification.type === "follow") {
      navigate(`/user/${notification.sender?._id}`);
    } else if (notification.type === "community_join") {
      navigate(`/community/${notification.community?.name}`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "comment": return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "like": return <Heart className="h-5 w-5 text-red-500 fill-red-500" />;
      case "follow": return <UserPlus className="h-5 w-5 text-green-500" />;
      case "community_join": return <Users className="h-5 w-5 text-purple-500" />;
      case "post_created": return <PlusSquare className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getMessage = (notification) => {
    const senderName = <span className="font-bold text-foreground hover:underline cursor-pointer">{notification.sender?.name}</span>;
    switch (notification.type) {
      case "comment": return <p>{senderName} commented on your post</p>;
      case "like": return <p>{senderName} liked your post</p>;
      case "follow": return <p>{senderName} started following you</p>;
      case "community_join": return <p>{senderName} joined <span className="font-semibold text-primary">{notification.community?.name}</span></p>;
      case "post_created": return <p>{senderName} shared a new post</p>;
      default: return <p>New activity from {senderName}</p>;
    }
  };

  return (
    <div className="main-section max-w-2xl mx-auto py-6 px-4 md:px-0">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground font-medium">
              You have {unreadCount} unread updates
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMarkAllRead}
              className="hidden sm:flex items-center gap-2 border-primary/20 hover:bg-primary/5 text-primary font-bold transition-all"
            >
              <CheckCircle className="h-4 w-4" />
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 && !loading ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed bg-muted/50 border-2">
            <div className="p-6 bg-muted rounded-full mb-4">
              <Bell className="h-12 w-12 text-muted-foreground/20" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Silence is golden</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Interact with the community to see notifications when people talk to you.
            </p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`group relative flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-primary/10 hover:shadow-lg ${!notification.isRead ? 'bg-primary/[0.04] ring-1 ring-primary/10' : 'bg-card border hover:bg-muted/30'}`}
            >
              <div className="relative shrink-0">
                <img 
                  src={notification.sender?.avatar} 
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-background shadow-md group-hover:scale-105 transition-transform"
                  alt={notification.sender?.name}
                />
                <div className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-background rounded-xl shadow-lg ring-1 ring-black/5">
                  {getIcon(notification.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-base text-foreground leading-snug">
                    {getMessage(notification)}
                  </div>
                  {!notification.isRead && (
                    <Badge variant="default" className="h-2 w-2 rounded-full p-0 shrink-0 ml-2 animate-pulse" />
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {dayjs(notification.createdAt).fromNow()}
                  </div>
                </div>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(deleteNotificationAction(notification._id));
                  }}
                  className="h-10 w-10 hover:bg-destructive/10 hover:text-destructive rounded-xl"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {loading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
