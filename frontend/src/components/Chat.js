import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, getDocs } from 'firebase/firestore';
import db from './firebase';

const ChatUI = forwardRef(({ onValueChange, scroll, teamDetail, userDetail,quizDetail }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const quizId = quizDetail?.quizId;
  const teamId = teamDetail?.teamId;
  const currentUserId = userDetail?.userId;
  const currentUserName = userDetail?.userName;

  const messagesCollectionRef = collection(
    db,
    'chats',
    `${quizId}_${teamId}`,
    'messages'
  );
  const messagesQuery = query(messagesCollectionRef, orderBy('timestamp',"asc"));

  const yourChildMethod = async(e) => {
    try{
      await addDoc(messagesCollectionRef, {
      message: e,
      userId: currentUserId,
      timestamp: Math.floor(new Date().getTime()/1000),
      userName: currentUserName
    }); 
     if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
    }catch(e){
      console.log(e);
    }
  };

  // Expose the child method to the parent component
  useImperativeHandle(ref, () => ({
    childMethod: yourChildMethod
  }));

  useEffect(() => {
    let unsubscribe;
    const fetchChatMessages = async () => {
      try {
        const snapshot = await getDocs(messagesQuery);
        const initialChatMessages = snapshot.docs.map((doc) => doc.data());
        setChatMessages(initialChatMessages);
        unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const updatedChatMessages = snapshot.docs.map((doc) => doc.data());
          setChatMessages(updatedChatMessages);
        });
      } catch (error) {
        console.log('Error fetching chat messages:', error);
      }
    };

    fetchChatMessages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [messagesQuery]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    onValueChange(!isOpen);
  };

  const handleSubmitMessage = async () => {
    if (message.trim() === '') {
      return;
    }

    await addDoc(messagesCollectionRef, {
      message: message,
      userId: currentUserId,
      timestamp: new Date().getTime(),
      userName: currentUserName
    });
     if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
    setMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen && (
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-full shadow"
          onClick={toggleChat}
        >
          Open Chat
        </button>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow">
          {/* Chat header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="font-bold">Trivia Chat</div>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={toggleChat}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat content */}
          <div
            className="chat-container"
            ref={chatContainerRef}
          >
            {/* Chat messages */}
            {chatMessages.map((chatMessage, index) => (
              <div
                className={`flex items-center mt-4 ${
                  chatMessage.userId === currentUserId ? 'justify-end' : 'justify-start'
                }`}
                key={index}
              >
                <div
                  className={`rounded-full h-8 w-8 bg-blue-500 text-white flex items-center justify-center mr-2 ${
                    chatMessage.userId === currentUserId ? 'order-2' : 'order-1'
                  }`}
                >
                  {chatMessage?.userName?.length > 0 ? chatMessage.userName[0] : 'T'}
                </div>
                <div
                  className={`bg-gray-100 py-2 px-4 rounded-lg ${
                    chatMessage.userId === currentUserId ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className="font-bold">{chatMessage.userName}</div>
                  <div>{chatMessage.message}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="flex items-center p-4 border-t">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="ml-4 bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleSubmitMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default ChatUI;
