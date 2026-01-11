import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings, Grid, Bookmark, Users, MapPin,
  Link as LinkIcon, Edit, ChevronRight, Camera, Loader2, LogOut, Plane, Heart, UserPlus, UserMinus, Calendar, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useUpdateProfile, useUploadAvatar } from '@/hooks/useProfile';
import { useFollowers, useFollowing, useFollowUser, useUnfollowUser, useConnections } from '@/hooks/useConnections';
import { useSavedItineraries } from '@/hooks/useItineraries';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
  });

  // Determine which profile to show
  const targetUserId = userId || user?.id;
  const isOwnProfile = !userId || userId === user?.id;

  const { data: profile, isLoading } = useProfile(targetUserId);
  const { data: connections } = useConnections(targetUserId);
  const { data: followers } = useFollowers();
  const { data: following } = useFollowing();
  const { data: savedItineraries, isLoading: savedLoading } = useSavedItineraries();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const isFollowing = connections?.followers?.some(f => f.follower_id === user?.id) || false;

  // Redirect to auth if not logged in and viewing own profile
  if (!user && !userId) {
    navigate('/auth');
    return null;
  }

  const handleEditOpen = () => {
    if (profile) {
      setEditForm({
        display_name: profile.display_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
      });
    }
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync(editForm);
      toast({ title: 'Profile updated!', description: 'Your changes have been saved.' });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar.mutateAsync(file);
      toast({ title: 'Avatar updated!', description: 'Your profile picture has been changed.' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload avatar',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleFollow = async () => {
    if (!targetUserId || !user) return;
    try {
      await followUser.mutateAsync(targetUserId);
      toast({ title: 'Following!', description: `You are now following ${profile?.display_name || 'this user'}.` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUnfollow = async () => {
    if (!targetUserId || !user) return;
    try {
      await unfollowUser.mutateAsync(targetUserId);
      toast({ title: 'Unfollowed', description: `You unfollowed ${profile?.display_name || 'this user'}.` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Users className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
          <p className="text-muted-foreground">This user doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-primary/20">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {profile.display_name?.[0] || profile.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isOwnProfile && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadAvatar.isPending}
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full gradient-sky flex items-center justify-center shadow-travel disabled:opacity-50"
                      >
                        {uploadAvatar.isPending ? (
                          <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4 text-primary-foreground" />
                        )}
                      </button>
                    </>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">
                    {profile.display_name || 'Traveler'}
                  </h1>
                  <p className="text-muted-foreground mb-2">@{profile.username || 'user'}</p>
                  
                  {/* Follower/Following counts - Clickable */}
                  <div className="flex gap-4 text-sm mb-2">
                    <button 
                      onClick={() => setShowFollowers(true)}
                      className="hover:text-primary transition-colors"
                    >
                      <strong>{connections?.followers?.length || 0}</strong> followers
                    </button>
                    <button 
                      onClick={() => setShowFollowing(true)}
                      className="hover:text-primary transition-colors"
                    >
                      <strong>{connections?.following?.length || 0}</strong> following
                    </button>
                  </div>
                  
                  {profile.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {profile.location}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <>
                    <Dialog open={isEditing} onOpenChange={setIsEditing}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-xl" onClick={handleEditOpen}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="display_name">Display Name</Label>
                            <Input
                              id="display_name"
                              value={editForm.display_name}
                              onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                              placeholder="Your name"
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              value={editForm.username}
                              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                              placeholder="username"
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              value={editForm.bio}
                              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                              placeholder="Tell us about yourself..."
                              className="rounded-xl resize-none"
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={editForm.location}
                              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                              placeholder="City, Country"
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              value={editForm.website}
                              onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                              placeholder="https://yoursite.com"
                              className="rounded-xl"
                            />
                          </div>
                          <Button
                            onClick={handleSaveProfile}
                            disabled={updateProfile.isPending}
                            className="w-full rounded-xl gradient-sky"
                          >
                            {updateProfile.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="icon" className="rounded-xl" onClick={() => navigate('/settings')}>
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button 
                    className={`rounded-xl ${isFollowing ? 'bg-muted text-foreground hover:bg-muted/80' : 'gradient-sky'}`}
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    disabled={followUser.isPending || unfollowUser.isPending}
                  >
                    {followUser.isPending || unfollowUser.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : isFollowing ? (
                      <UserMinus className="w-4 h-4 mr-2" />
                    ) : (
                      <UserPlus className="w-4 h-4 mr-2" />
                    )}
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm mb-4 max-w-xl">{profile.bio}</p>
            )}

            {/* Website */}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </motion.div>

          {/* Quick Actions - only for own profile */}
          {isOwnProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
            >
              <button 
                onClick={() => navigate('/chat')}
                className="p-4 rounded-xl bg-card shadow-travel hover:shadow-travel-lg transition-all text-left"
              >
                <Users className="w-5 h-5 text-primary mb-2" />
                <p className="font-medium text-sm">Connect</p>
              </button>
              <button 
                onClick={() => setActiveTab('saved')}
                className="p-4 rounded-xl bg-card shadow-travel hover:shadow-travel-lg transition-all text-left"
              >
                <Bookmark className="w-5 h-5 text-accent mb-2" />
                <p className="font-medium text-sm">Saved</p>
              </button>
              <button 
                onClick={() => navigate('/my-trips')}
                className="p-4 rounded-xl bg-card shadow-travel hover:shadow-travel-lg transition-all text-left"
              >
                <Plane className="w-5 h-5 text-primary mb-2" />
                <p className="font-medium text-sm">My Trips</p>
              </button>
              <button 
                onClick={() => navigate('/search')}
                className="p-4 rounded-xl bg-card shadow-travel hover:shadow-travel-lg transition-all text-left"
              >
                <MapPin className="w-5 h-5 text-accent mb-2" />
                <p className="font-medium text-sm">Start Plan</p>
              </button>
            </motion.div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 mb-6 rounded-xl bg-muted/50 p-1">
              <TabsTrigger value="posts" className="rounded-lg data-[state=active]:gradient-sky data-[state=active]:text-primary-foreground">
                <Grid className="w-4 h-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="saved" className="rounded-lg data-[state=active]:gradient-sky data-[state=active]:text-primary-foreground">
                <Bookmark className="w-4 h-4 mr-2" />
                Saved
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <div className="text-center py-12 text-muted-foreground">
                <Grid className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No posts yet</p>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    className="mt-4 rounded-xl"
                    onClick={() => navigate('/explore')}
                  >
                    Explore itineraries
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="saved">
              {savedLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : savedItineraries && savedItineraries.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {savedItineraries.map((saved: any, index: number) => (
                    <motion.div
                      key={saved.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-card rounded-2xl shadow-travel overflow-hidden cursor-pointer hover:shadow-travel-lg transition-all duration-300"
                      onClick={() => navigate(`/itinerary/${saved.itinerary?.id}`)}
                    >
                      {/* Cover Image with Overlay */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                          src={saved.itinerary?.cover_image || '/placeholder.svg'} 
                          alt={saved.itinerary?.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Bookmark Badge */}
                        <div className="absolute top-3 right-3">
                          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                            <Bookmark className="w-4 h-4 text-primary fill-current" />
                          </div>
                        </div>
                        
                        {/* AI Generated Badge */}
                        {saved.itinerary?.is_ai_generated && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                              ✨ AI Generated
                            </Badge>
                          </div>
                        )}
                        
                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center gap-1 text-white/90 text-sm mb-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {saved.itinerary?.destination}
                            {saved.itinerary?.country && `, ${saved.itinerary.country}`}
                          </div>
                          <h3 className="font-display font-bold text-white text-lg line-clamp-2">
                            {saved.itinerary?.title}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Details Card */}
                      <div className="p-4 space-y-3">
                        {/* Trip Info */}
                        <div className="flex items-center flex-wrap gap-2">
                          {saved.itinerary?.nights && (
                            <Badge variant="secondary" className="rounded-lg text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {saved.itinerary.nights} nights
                            </Badge>
                          )}
                          {saved.itinerary?.budget && (
                            <Badge variant="outline" className="rounded-lg text-xs">
                              {saved.itinerary.budget}
                            </Badge>
                          )}
                          {saved.itinerary?.start_date && (
                            <Badge variant="outline" className="rounded-lg text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              {format(new Date(saved.itinerary.start_date), 'MMM d, yyyy')}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Stats & Action */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                              {saved.itinerary?.likes_count || 0}
                            </span>
                          </div>
                          <Button size="sm" className="rounded-xl gradient-sky text-primary-foreground text-xs h-8">
                            View Trip
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Bookmark className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No saved itineraries</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Save itineraries you love to access them quickly later
                  </p>
                  <Button
                    className="rounded-xl gradient-sky text-primary-foreground"
                    onClick={() => navigate('/explore')}
                  >
                    Explore Itineraries
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Followers Dialog */}
      <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {isOwnProfile && followers?.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No followers yet</p>
            )}
            {isOwnProfile && followers?.map((follower) => (
              <div
                key={follower.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setShowFollowers(false);
                  navigate(`/profile/${follower.follower_id}`);
                }}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={follower.profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm">
                    {follower.profile?.display_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{follower.profile?.display_name || 'User'}</p>
                  <p className="text-sm text-muted-foreground truncate">@{follower.profile?.username || 'user'}</p>
                </div>
              </div>
            ))}
            {!isOwnProfile && (
              <p className="text-center text-muted-foreground py-8">{connections?.followers?.length || 0} followers</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Following Dialog */}
      <Dialog open={showFollowing} onOpenChange={setShowFollowing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {isOwnProfile && following?.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Not following anyone yet</p>
            )}
            {isOwnProfile && following?.map((follow) => (
              <div
                key={follow.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setShowFollowing(false);
                  navigate(`/profile/${follow.following_id}`);
                }}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={follow.profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm">
                    {follow.profile?.display_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{follow.profile?.display_name || 'User'}</p>
                  <p className="text-sm text-muted-foreground truncate">@{follow.profile?.username || 'user'}</p>
                </div>
              </div>
            ))}
            {!isOwnProfile && (
              <p className="text-center text-muted-foreground py-8">{connections?.following?.length || 0} following</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}