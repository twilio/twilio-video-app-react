export interface TwilioCaptionResult {
  transcriptionResponse: TranscriptionResponse;
  participantIdentity: string;
}

export interface TranscriptionResponse {
  TranscriptEvent: TranscriptEvent;
}

export interface TranscriptEvent {
  Transcript: Transcript;
}

export interface Transcript {
  Results: Result[];
}

export interface Result {
  Alternatives: Alternative[];
  EndTime: number;
  IsPartial: boolean;
  ResultId: string;
  StartTime: number;
}

export interface Alternative {
  Items: Item[];
  Transcript: string;
}

export interface Item {
  Content: string;
  EndTime: number;
  StartTime: number;
  Type: string;
  VocabularyFilterMatch: boolean;
}
