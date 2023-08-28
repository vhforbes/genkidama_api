export interface ChatScene {
  command: string;
  currentStep: string;
}

export interface MemberScene {
  command: '/membro';
  currentStep: 'AWAIT_EMAIL';
}

export interface AlarmesScene {
  command: '/alarmes';
  currentStep: 'AWAIT_ALERTAS_COMMAND';
}

export interface ChatScenes {
  membro: MemberScene;
  ajuda: ChatScene;
  alarmes: AlarmesScene;
}

export interface Conversation {
  chatId: number;
  currentScene: ChatScene | null;
}

// Create a new unique conversation
export const createNewConversation = (
  chatId: number,
  currentScene: ChatScene | null,
) => {
  const newChat: Conversation = {
    chatId,
    currentScene,
  };
  return newChat;
};

// Create a new conversation in the list
export const newConversationsList = (
  chatId: number,
  activeConversations: Conversation[],
  currentScene: ChatScene | null,
): Conversation[] => {
  const newChat = createNewConversation(chatId, currentScene);

  activeConversations.push(newChat);

  return activeConversations;
};

// Find a conversation
export const findCurrentConversation = (
  chatId: number,
  activeConversations: Conversation[],
): Conversation | null => {
  for (let index = 0; index < activeConversations.length; index += 1) {
    const conversation = activeConversations[index];

    if (conversation.chatId === chatId) {
      return conversation;
    }
  }
  return null;
};

// Returns list of conversations with updated one
export const updateConversationsList = (
  chatId: number,
  updatedConversation: Conversation,
  activeConversations: Conversation[],
): Conversation[] => {
  const conversationIndex = activeConversations.findIndex(
    obj => obj.chatId === chatId,
  );

  const updatedActiveConversations = activeConversations;

  updatedActiveConversations[conversationIndex] = updatedConversation;

  return updatedActiveConversations;
};
