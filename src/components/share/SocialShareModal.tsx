import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Mail,
  MessageCircle,
  Check,
  Copy,
} from 'lucide-react';

interface SocialShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  description?: string;
}

export function SocialShareModal({
  open,
  onOpenChange,
  title,
  url,
  description = '',
}: SocialShareModalProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-[#1DA1F2] hover:bg-[#1A94DA]',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'bg-[#0A66C2] hover:bg-[#095AA8]',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-[#25D366] hover:bg-[#20BD5A]',
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'bg-muted hover:bg-muted/80',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShareClick = (href: string, name: string) => {
    window.open(href, '_blank', 'width=600,height=400');
    toast.success(`Opening ${name}...`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Share this itinerary</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Social Share Buttons */}
          <div className="grid grid-cols-5 gap-3">
            {shareLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-12 h-12 rounded-full ${link.color} text-white`}
                  onClick={() => handleShareClick(link.href, link.name)}
                  title={`Share on ${link.name}`}
                >
                  <link.icon className="w-5 h-5" />
                </Button>
                <p className="text-xs text-center mt-1 text-muted-foreground">
                  {link.name}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Copy Link Section */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Or copy link</p>
            <div className="flex items-center gap-2">
              <Input
                value={url}
                readOnly
                className="flex-1 text-sm bg-muted"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Native Share (for mobile) */}
          {'share' in navigator && (
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                try {
                  await navigator.share({ title, url, text: description });
                } catch {
                  // User cancelled or share failed
                }
              }}
            >
              <Link2 className="w-4 h-4 mr-2" />
              More sharing options
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
