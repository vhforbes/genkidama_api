"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConversationsList = exports.findCurrentConversation = exports.newConversationsList = exports.createNewConversation = void 0;
// Create a new unique conversation
const createNewConversation = (chatId, currentScene) => {
    const newChat = {
        chatId,
        currentScene,
    };
    return newChat;
};
exports.createNewConversation = createNewConversation;
// Create a new conversation in the list
const newConversationsList = (chatId, activeConversations, currentScene) => {
    const newChat = (0, exports.createNewConversation)(chatId, currentScene);
    activeConversations.push(newChat);
    return activeConversations;
};
exports.newConversationsList = newConversationsList;
// Find a conversation
const findCurrentConversation = (chatId, activeConversations) => {
    for (let index = 0; index < activeConversations.length; index += 1) {
        const conversation = activeConversations[index];
        if (conversation.chatId === chatId) {
            return conversation;
        }
    }
    return null;
};
exports.findCurrentConversation = findCurrentConversation;
// Returns list of conversations with updated one
const updateConversationsList = (chatId, updatedConversation, activeConversations) => {
    const conversationIndex = activeConversations.findIndex(obj => obj.chatId === chatId);
    const updatedActiveConversations = activeConversations;
    updatedActiveConversations[conversationIndex] = updatedConversation;
    return updatedActiveConversations;
};
exports.updateConversationsList = updateConversationsList;
//# sourceMappingURL=helpers.js.map