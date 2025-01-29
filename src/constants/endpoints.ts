export const EndPoints = {
  BASE_URL: '',
  SPEECH_TOKEN: 'speech/fetch-access-info',
  CHAT: 'chatbot/chat',
  INTERACTIVE: 'interactive',
  INTERACTIVE_CHAT: 'chatbot/chat/interactive',
  INTERACTIVE_ACTION: 'interactive/action',
  AVATAR: 'avatar',
  LOCALS: 'http://localhost:3333',
  VIDEO_INDEXER: 'https://www.videoindexer.ai/embed',
  AI_SEARCH: 'search/search',
  CHAT_HISTORY: 'chat-history',
  DOC_INTELLIGENCE: 'document-intelligence',
  MEDIA: 'media',
  ADMIN: 'admin',
}

export type EndpointsType = typeof EndPoints
