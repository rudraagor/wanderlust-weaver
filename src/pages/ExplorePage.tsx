import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Layout } from '@/components/layout/Layout';
import { explorePosts } from '@/data/mockData';

export default function ExplorePage() {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display font-bold text-3xl mb-2">Explore</h1>
            <p className="text-muted-foreground">Discover amazing travel stories from the community</p>
          </motion.div>

          {/* Feed */}
          <div className="space-y-6">
            {explorePosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl shadow-travel overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{post.user.name}</p>
                      <p className="text-xs text-muted-foreground">{post.location}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>

                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={post.media} 
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleLike(post.id)}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                      >
                        <Heart 
                          className={`w-6 h-6 transition-colors ${
                            likedPosts.includes(post.id) 
                              ? 'fill-accent text-accent' 
                              : 'text-foreground'
                          }`} 
                        />
                      </motion.button>
                      <button className="p-2 hover:bg-muted rounded-full transition-colors">
                        <MessageCircle className="w-6 h-6" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-full transition-colors">
                        <Share2 className="w-6 h-6" />
                      </button>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleSave(post.id)}
                      className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                      <Bookmark 
                        className={`w-6 h-6 transition-colors ${
                          savedPosts.includes(post.id) 
                            ? 'fill-foreground' 
                            : ''
                        }`} 
                      />
                    </motion.button>
                  </div>

                  {/* Likes */}
                  <p className="font-semibold text-sm mb-2">
                    {(post.likes + (likedPosts.includes(post.id) ? 1 : 0)).toLocaleString()} likes
                  </p>

                  {/* Caption */}
                  <p className="text-sm">
                    <span className="font-semibold">{post.user.username}</span>{' '}
                    {post.caption}
                  </p>

                  {/* Comments */}
                  <button className="text-sm text-muted-foreground mt-2">
                    View all {post.comments} comments
                  </button>

                  {/* Date */}
                  <p className="text-xs text-muted-foreground mt-2 uppercase">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
