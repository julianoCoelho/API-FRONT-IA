import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../hooks/useChat';
import { useFileUpload } from '../hooks/useFileUpload';
import AppLayout from '../components/layout/AppLayout';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ChatWindow from '../components/chat/ChatWindow';

export default function ChatPage() {
  const { user, logout } = useAuth();
  const { sessions, activeSession, messages, sendMessage, selectSession, createSession, isLoading, isSending } = useChat();
  const { uploadFile: _uploadFile } = useFileUpload();

  return (
    <AppLayout
      sidebar={
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSession?.id}
          onSelectSession={selectSession}
          onCreateSession={() => createSession('Nova conversa')}
        />
      }
      header={<Header username={user?.username ?? 'Usuário'} onLogout={logout} />}
    >
      <ChatWindow messages={messages} onSendMessage={sendMessage} isLoading={isLoading || isSending} />
    </AppLayout>
  );
}
