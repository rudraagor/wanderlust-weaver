import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Heart, MessageCircle, UserPlus, 
  Plane, Check, Trash2, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useNotifications, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead,
  useDeleteNotification 
} from '@/hooks/useNotifications';
import { format, formatDistanceToNow } from 'date-fns';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart className="w-5 h-5 text-accent" />;
    case 'comment':
    case 'message':
      return <MessageCircle className="w-5 h-5 text-primary" />;
    case 'follow':
      return <UserPlus className="w-5 h-5 text-primary" />;
    case 'booking':
    case 'trip':
      return <Plane className="w-5 h-5 text-primary" />;
    default:
      return <Bell className="w-5 h-5 text-muted-foreground" />;
  }
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  const handleNotificationClick = async (notification: typeof notifications[0]) => {
    if (!notification.is_read) {
      await markRead.mutateAsync(notification.id);
    }
    // Navigate based on notification type
    if (notification.related_id) {
      switch (notification.type) {
        case 'like':
        case 'comment':
          navigate(`/plan/${notification.related_id}`);
          break;
        case 'follow':
          navigate(`/profile/${notification.related_id}`);
          break;
        case 'message':
          navigate('/chat');
          break;
        default:
          break;
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-display font-bold text-2xl">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllRead.mutateAsync()}
                disabled={markAllRead.isPending}
                className="rounded-xl"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
            )}
          </motion.div>

          {/* Notifications List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : notifications?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl font-semibold mb-2">No notifications yet</p>
              <p className="text-muted-foreground">
                When you get notifications, they'll show up here
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {notifications?.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-colors cursor-pointer ${
                    notification.is_read 
                      ? 'bg-card hover:bg-muted/50' 
                      : 'bg-primary/5 hover:bg-primary/10'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    notification.is_read ? 'bg-muted' : 'bg-primary/10'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${!notification.is_read ? 'text-foreground' : ''}`}>
                      {notification.title}
                    </p>
                    {notification.message && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification.mutateAsync(notification.id);
                      }}
                      className="rounded-lg opacity-0 group-hover:opacity-100 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
