import { EventEmitter } from 'events';

const mockConversation: any = new EventEmitter();
mockConversation.getMessages = jest.fn(() => Promise.resolve({ items: ['mockMessage'] }));

const mockClient = {
  getConversationByUniqueName: jest.fn(() => Promise.resolve(mockConversation)),
};

const mockGetConversationByUniqueName = jest.fn(() => Promise.resolve(mockConversation));

class Client extends EventEmitter {
  getConversationByUniqueName = mockGetConversationByUniqueName;
}

export { Client, mockClient, mockConversation, mockGetConversationByUniqueName };
