import React, { createContext, useContext, useReducer, useState } from 'react';
import { TwilioError } from 'twilio-video';
import axios from 'axios';
import * as jwt_decode from 'jwt-decode';

export interface StateContextType {
  error: TwilioError | null;
  setError(error: TwilioError | null): void;
  isFetching: boolean;
  setSelectedAudioInput: string;
  selectedVideoInput: string;
  setSelectedVideoInput: string;
  selectedSpeakerOutput: string;
  setSelectedSpeakerOutput: string;
  gridView: boolean;
  setGridView: any;
  getToken(caseNumber, partyType, partyName, pinNumber): Promise<string>;
  removeParticipant: any;
}

export const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);
  const [gridView, setGridView] = useState(true);
  const [userToken, setUserToken] = useState('');
  const [selectedAudioInput, setSelectedAudioInput] = useState({ deviceId: '' });
  const [selectedVideoInput, setSelectedVideoInput] = useState({ deviceId: '' });
  const [selectedSpeakerOutput, setSelectedSpeakerOutput] = useState({ deviceId: '' });

  const reporterToken = window.location.hash.substr(1);

  var endpoint = '';
  fetch(`${process.env.PUBLIC_URL}/config.json`)
    .then(r => r.json())
    .then(data => {
      endpoint = data.endPoint;
    });

  let contextValue = ({
    error,
    setError,
    isFetching,
    selectedAudioInput,
    setSelectedAudioInput,
    selectedVideoInput,
    setSelectedVideoInput,
    selectedSpeakerOutput,
    setSelectedSpeakerOutput,
    gridView,
    setGridView,
    getToken: async (caseNumber, partyType, partyName, pinNumber = '') => {
      const url = `${endpoint}/token`;

      const { data } = await axios({
        url: url,
        method: 'POST',
        headers: {
          Authorization: reporterToken ? `Bearer ${reporterToken}` : '',
        },
        data: {
          caseNumber,
          partyType,
          partyName,
          pinNumber,
        },
      });

      return data;
    },
    removeParticipant: async participantSid => {
      const url = `${endpoint}/remove-participant`;

      const { data } = await axios({
        url: url,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: { participantSid },
      });

      return data;
    },
  } as unknown) as StateContextType;

  const getToken: StateContextType['getToken'] = (caseNumber, partyType, partyName, pinNumber = '') => {
    setIsFetching(true);
    return contextValue
      .getToken(caseNumber, partyType === 'Reporter' ? 'Other' : partyType, partyName, pinNumber)
      .then((res: any) => {
        setIsFetching(false);
        setUserToken(res.token);
        const user = jwt_decode(res.token);
        setUser(user);
        return Promise.resolve(user.twilioToken);
      })
      .catch(err => {
        setError(err.response ? err.response.data : { message: 'Network Error' });
        setIsFetching(false);
        return Promise.reject(err);
      });
  };

  const removeParticipant: StateContextType['removeParticipant'] = participantSid => {
    return contextValue.removeParticipant(participantSid).catch(err => {
      setError(err.response ? err.response.data : { message: 'Network Error' });
      return Promise.reject(err);
    });
  };

  return (
    <StateContext.Provider value={{ ...contextValue, getToken, removeParticipant }}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState(): any {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
