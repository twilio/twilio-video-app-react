import { EventEmitter } from 'events';

const mockConversation: any = new EventEmitter();
mockConversation.getMessages = jest.fn(() => Promise.resolve({ items: ['mockMessage'] }));

const mockClient = {
  getConversationByUniqueName: jest.fn(() => Promise.resolve(mockConversation)),
};

const Client = {
  create: jest.fn(() => Promise.resolve(mockClient)),
};

export { Client, mockClient, mockConversation };
