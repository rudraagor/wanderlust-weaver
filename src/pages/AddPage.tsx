import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, Image, Video, MapPin, X, 
  Camera, FileVideo, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';

export default function AddPage() {
  const [uploadType, setUploadType] = useState<'photo' | 'video' | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!preview || !caption) {
      toast({
        title: "Missing Information",
        description: "Please add media and a caption",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    const posts = JSON.parse(localStorage.getItem('userPosts') || '[]');
    posts.push({
      id: Date.now().toString(),
      type: uploadType,
      media: preview,
      caption,
      location,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0
    });
    localStorage.setItem('userPosts', JSON.stringify(posts));

    toast({
      title: "Posted Successfully!",
      description: "Your travel moment has been shared",
    });

    // Reset form
    setUploadType(null);
    setCaption('');
    setLocation('');
    setPreview(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display font-bold text-3xl mb-2">Share Your Journey</h1>
            <p className="text-muted-foreground">Upload photos and videos from your travels</p>
          </motion.div>

          {!uploadType ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUploadType('photo')}
                className="p-8 rounded-2xl bg-card shadow-travel hover:shadow-travel-lg transition-all border-2 border-transparent hover:border-primary/20"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-sky flex items-center justify-center">
                  <Camera className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Photo</h3>
                <p className="text-sm text-muted-foreground">Share travel photos</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUploadType('video')}
                className="p-8 rounded-2xl bg-card shadow-travel hover:shadow-travel-lg transition-all border-2 border-transparent hover:border-accent/20"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-sunset flex items-center justify-center">
                  <FileVideo className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Video</h3>
                <p className="text-sm text-muted-foreground">Share travel videos</p>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Back button */}
              <Button 
                variant="ghost" 
                onClick={() => {
                  setUploadType(null);
                  setPreview(null);
                }}
                className="mb-4"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>

              {/* Upload Area */}
              <div className="relative">
                {preview ? (
                  <div className="relative rounded-2xl overflow-hidden">
                    {uploadType === 'photo' ? (
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full aspect-square object-cover"
                      />
                    ) : (
                      <video 
                        src={preview} 
                        controls 
                        className="w-full aspect-video object-cover"
                      />
                    )}
                    <button
                      onClick={() => setPreview(null)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-foreground/80 text-background"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 cursor-pointer transition-colors">
                    <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center ${
                      uploadType === 'photo' ? 'gradient-sky' : 'gradient-sunset'
                    }`}>
                      {uploadType === 'photo' ? (
                        <Image className="w-8 h-8 text-primary-foreground" />
                      ) : (
                        <Video className="w-8 h-8 text-accent-foreground" />
                      )}
                    </div>
                    <p className="font-medium mb-1">
                      Click to upload {uploadType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {uploadType === 'photo' ? 'JPG, PNG up to 10MB' : 'MP4, MOV up to 100MB'}
                    </p>
                    <input
                      type="file"
                      accept={uploadType === 'photo' ? 'image/*' : 'video/*'}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Label>Caption</Label>
                <Textarea
                  placeholder="Tell the story of this moment..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Add location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button 
                onClick={handleSubmit}
                className="w-full gradient-sky text-primary-foreground rounded-xl py-6 text-lg shadow-travel hover:shadow-travel-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Share Post
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
