import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Send, Search, Plus, Users, User, X, Loader2, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useConversations, 
  useMessages, 
  useSendMessage, 
  useCreateConversation,
  useSearchUsers,
  Conversation
} from '@/hooks/useChat';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');

  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const { data: messages, isLoading: messagesLoading } = useMessages(selectedConversation?.id);
  const sendMessage = useSendMessage();
  const createConversation = useCreateConversation();
  const { data: searchResults } = useSearchUsers(searchQuery);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      await sendMessage.mutateAsync({
        conversationId: selectedConversation.id,
        content: messageInput.trim(),
      });
      setMessageInput('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const conversation = await createConversation.mutateAsync({
        name: isGroup ? groupName : undefined,
        type: isGroup ? 'group' : 'direct',
        participantIds: selectedUsers,
      });
      setShowNewChat(false);
      setSearchQuery('');
      setSelectedUsers([]);
      setGroupName('');
      setIsGroup(false);
      setSelectedConversation(conversation as Conversation);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getConversationName = (conv: Conversation) => {
    if (conv.name) return conv.name;
    if (conv.type === 'group') return 'Group Chat';
    const otherParticipant = conv.participants?.find(p => p.user_id !== user.id);
    return otherParticipant?.profile?.display_name || otherParticipant?.profile?.username || 'Chat';
  };

  const getConversationAvatar = (conv: Conversation) => {
    if (conv.type === 'group') return null;
    const otherParticipant = conv.participants?.find(p => p.user_id !== user.id);
    return otherParticipant?.profile?.avatar_url;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto h-[calc(100vh-180px)]">
          <div className="flex h-full rounded-2xl bg-card shadow-travel overflow-hidden">
            {/* Sidebar */}
            <div className={`w-full md:w-80 border-r border-border flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="font-display font-bold text-xl">Messages</h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNewChat(true)}
                    className="rounded-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {conversationsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : conversations?.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No conversations yet</p>
                    <Button
                      variant="outline"
                      className="mt-4 rounded-xl"
                      onClick={() => setShowNewChat(true)}
                    >
                      Start a chat
                    </Button>
                  </div>
                ) : (
                  conversations?.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                        selectedConversation?.id === conv.id ? 'bg-muted' : ''
                      }`}
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={getConversationAvatar(conv) || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                          {conv.type === 'group' ? <Users className="w-5 h-5" /> : getConversationName(conv)[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left overflow-hidden">
                        <p className="font-medium truncate">{getConversationName(conv)}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                      {conv.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(conv.lastMessage.created_at), 'HH:mm')}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden rounded-xl"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={getConversationAvatar(selectedConversation) || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {selectedConversation.type === 'group' ? <Users className="w-4 h-4" /> : getConversationName(selectedConversation)[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{getConversationName(selectedConversation)}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.participants?.length} participants
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messagesLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : messages?.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No messages yet. Say hello! 👋
                      </div>
                    ) : (
                      messages?.map((message) => {
                        const isOwn = message.sender_id === user.id;
                        return (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-end gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                              {!isOwn && (
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={message.sender?.avatar_url || undefined} />
                                  <AvatarFallback className="text-xs">
                                    {message.sender?.display_name?.[0] || '?'}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`px-4 py-2 rounded-2xl ${
                                  isOwn
                                    ? 'gradient-sky text-primary-foreground rounded-br-md'
                                    : 'bg-muted rounded-bl-md'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                  {format(new Date(message.created_at), 'HH:mm')}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="rounded-xl"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || sendMessage.isPending}
                        className="gradient-sky text-primary-foreground rounded-xl"
                      >
                        {sendMessage.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl font-semibold mb-2">Select a conversation</p>
                    <p className="text-muted-foreground">Choose from your existing conversations or start a new one</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Chat Type Toggle */}
            <div className="flex gap-2">
              <Button
                variant={!isGroup ? 'default' : 'outline'}
                onClick={() => setIsGroup(false)}
                className="flex-1 rounded-xl"
              >
                <User className="w-4 h-4 mr-2" /> Direct
              </Button>
              <Button
                variant={isGroup ? 'default' : 'outline'}
                onClick={() => setIsGroup(true)}
                className="flex-1 rounded-xl"
              >
                <Users className="w-4 h-4 mr-2" /> Group
              </Button>
            </div>

            {/* Group Name */}
            {isGroup && (
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group name"
                className="rounded-xl"
              />
            )}

            {/* Search Users */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-10 rounded-xl"
              />
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((userId) => {
                  const user = searchResults?.find(u => u.user_id === userId);
                  return (
                    <div key={userId} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {user?.display_name || user?.username}
                      <button onClick={() => toggleUserSelection(userId)}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Search Results */}
            <div className="max-h-48 overflow-y-auto space-y-1">
              {searchResults?.map((result) => (
                <button
                  key={result.user_id}
                  onClick={() => toggleUserSelection(result.user_id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors ${
                    selectedUsers.includes(result.user_id) ? 'bg-primary/10' : ''
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={result.avatar_url || undefined} />
                    <AvatarFallback>{result.display_name?.[0] || result.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">{result.display_name}</p>
                    <p className="text-xs text-muted-foreground">@{result.username}</p>
                  </div>
                  {selectedUsers.includes(result.user_id) && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>

            <Button
              onClick={handleCreateConversation}
              disabled={selectedUsers.length === 0 || createConversation.isPending}
              className="w-full gradient-sky text-primary-foreground rounded-xl"
            >
              {createConversation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Start Conversation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
