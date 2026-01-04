import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Grid, Bookmark, Users, MapPin,
  Link as LinkIcon, Edit, ChevronRight, Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { currentUser } from '@/data/mockData';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');

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
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="text-2xl">{currentUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full gradient-sky flex items-center justify-center shadow-travel">
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>

                {/* Info */}
                <div>
                  <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">
                    {currentUser.name}
                  </h1>
                  <p className="text-muted-foreground mb-2">{currentUser.username}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-bold">{currentUser.trips}</p>
                      <p className="text-muted-foreground">Trips</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{currentUser.followers.toLocaleString()}</p>
                      <p className="text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{currentUser.following}</p>
                      <p className="text-muted-foreground">Following</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-xl">
                  <Edit className="w-4 h-4" />
                </Button>
                <Link to="/settings">
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm mb-4 max-w-xl">{currentUser.bio}</p>

            {/* External Links */}
            <div className="flex flex-wrap gap-3">
              {currentUser.externalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Stories/Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h3 className="font-semibold mb-4">Story Highlights</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {currentUser.stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="flex flex-col items-center gap-2 shrink-0"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-0.5 bg-gradient-to-tr from-primary to-accent">
                    <div className="w-full h-full rounded-full p-0.5 bg-background">
                      <img 
                        src={story.image} 
                        alt={story.title}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium">{story.title}</span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-2 shrink-0"
              >
                <button className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary transition-colors">
                  <span className="text-2xl text-muted-foreground">+</span>
                </button>
                <span className="text-xs text-muted-foreground">New</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
          >
            <Link to="/groups" className="p-4 rounded-xl bg-card shadow-travel hover:shadow-travel-lg transition-all">
              <Users className="w-5 h-5 text-primary mb-2" />
              <p className="font-medium text-sm">My Groups</p>
            </Link>
            <Link to="/saved" className="p-4 rounded-xl bg-card shadow-travel hover:shadow-travel-lg transition-all">
              <Bookmark className="w-5 h-5 text-accent mb-2" />
              <p className="font-medium text-sm">Saved</p>
            </Link>
            <Link to="/nearby" className="p-4 rounded-xl bg-card shadow-travel hover:shadow-travel-lg transition-all">
              <MapPin className="w-5 h-5 text-primary mb-2" />
              <p className="font-medium text-sm">Nearby</p>
            </Link>
            <Link to="/chat" className="p-4 rounded-xl bg-card shadow-travel hover:shadow-travel-lg transition-all">
              <ChevronRight className="w-5 h-5 text-accent mb-2" />
              <p className="font-medium text-sm">AI Assistant</p>
            </Link>
          </motion.div>

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
              <div className="grid grid-cols-3 gap-1 md:gap-2">
                {currentUser.posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <img 
                      src={post.media} 
                      alt={post.caption}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-4 text-primary-foreground">
                        <span className="flex items-center gap-1">
                          ❤️ {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          💬 {post.comments}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved">
              <div className="text-center py-12 text-muted-foreground">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>Save posts to see them here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
