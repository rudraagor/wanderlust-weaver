import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Moon, Sun, Globe, Lock, Bell, 
  HelpCircle, Info, LogOut, ChevronRight,
  Eye, EyeOff, Users, Trash2, FileText, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingItem({ icon: Icon, label, description, action, onClick, danger }: SettingItemProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
        danger ? 'hover:bg-destructive/10' : 'hover:bg-muted/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          danger ? 'bg-destructive/10' : 'bg-muted'
        }`}>
          <Icon className={`w-5 h-5 ${danger ? 'text-destructive' : 'text-muted-foreground'}`} />
        </div>
        <div className="text-left">
          <p className={`font-medium ${danger ? 'text-destructive' : ''}`}>{label}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action || <ChevronRight className="w-5 h-5 text-muted-foreground" />}
    </motion.button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [privateAccount, setPrivateAccount] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  // Change Password State
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure both passwords are the same',
        variant: 'destructive',
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Password changed!',
        description: 'Your password has been updated successfully.',
      });
      setShowPasswordDialog(false);
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    toast({
      title: 'Not implemented',
      description: 'Account deletion requires admin approval. Please contact support.',
      variant: 'destructive',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display font-bold text-2xl">Settings</h1>
          </motion.div>

          <div className="space-y-6">
            {/* Appearance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-card shadow-travel overflow-hidden"
            >
              <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Appearance
              </h2>
              <SettingItem
                icon={darkMode ? Moon : Sun}
                label="Dark Mode"
                description="Switch between light and dark theme"
                action={
                  <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                }
              />
              <SettingItem
                icon={Globe}
                label="Language"
                description="English"
              />
            </motion.div>

            {/* Privacy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-card shadow-travel overflow-hidden"
            >
              <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Privacy & Security
              </h2>
              <SettingItem
                icon={privateAccount ? EyeOff : Eye}
                label="Private Account"
                description="Only followers can see your content"
                action={
                  <Switch checked={privateAccount} onCheckedChange={setPrivateAccount} />
                }
              />
              <SettingItem
                icon={Lock}
                label="Change Password"
                onClick={() => setShowPasswordDialog(true)}
              />
              <SettingItem
                icon={Users}
                label="Blocked Accounts"
                description="Manage blocked users"
              />
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-card shadow-travel overflow-hidden"
            >
              <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Notifications
              </h2>
              <SettingItem
                icon={Bell}
                label="Push Notifications"
                description="Get notified about activity"
                action={
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                }
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-card shadow-travel overflow-hidden"
            >
              <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Content
              </h2>
              <SettingItem
                icon={FileText}
                label="Saved Items"
                description="View your saved posts and plans"
                onClick={() => navigate('/profile')}
              />
              <SettingItem
                icon={FileText}
                label="Drafts"
                description="Unpublished content"
              />
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl bg-card shadow-travel overflow-hidden"
            >
              <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Support
              </h2>
              <SettingItem
                icon={HelpCircle}
                label="Help Center"
              />
              <SettingItem
                icon={Info}
                label="About Wanderly"
                description="Version 1.0.0"
              />
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl bg-card shadow-travel overflow-hidden"
            >
              <SettingItem
                icon={LogOut}
                label="Log Out"
                onClick={handleSignOut}
                danger
              />
              <SettingItem
                icon={Trash2}
                label="Delete Account"
                description="Permanently delete your account"
                onClick={handleDeleteAccount}
                danger
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                className="rounded-xl"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="w-full rounded-xl gradient-sky"
            >
              {isChangingPassword ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
