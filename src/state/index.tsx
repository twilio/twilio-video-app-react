import React, { createContext, useContext, useReducer, useState } from 'react';
import { TwilioError } from 'twilio-video';
import { EROOR_MESSAGE } from '../utils/displayStrings';
import { PARTICIANT_TYPES } from '../utils/participantTypes';
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
  getToken(caseNumber, partyType, partyName): Promise<string>;
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
    getToken: async (caseNumber, partyType, partyName) => {
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

  const getToken: StateContextType['getToken'] = (caseNumber, partyType, partyName) => {
    setIsFetching(true);
    return contextValue
      .getToken(caseNumber, partyType === PARTICIANT_TYPES.REPORTER ? PARTICIANT_TYPES.OTHER : partyType, partyName)
      .then((res: any) => {
        setIsFetching(false);
        if (!res.roomExist && !participantIsMemberInHostRole(partyType))
          return Promise.resolve(EROOR_MESSAGE.ROOM_NOT_FOUND);

        setUserToken(res.result);
        const user = jwt_decode(res.result);
        setUser(user);
        return Promise.resolve(user.twilioToken);
      })
      .catch(err => {
        return Promise.reject(err);
      });
  };
  const removeParticipant: StateContextType['removeParticipant'] = participantSid => {
    return contextValue.removeParticipant(participantSid).catch(err => {
      return Promise.reject(err);
    });
  };

  return (
    <StateContext.Provider value={{ ...contextValue, getToken, removeParticipant }}>
      {props.children}
    </StateContext.Provider>
  );
}

function participantIsMemberInHostRole(partyType: string) {
  return partyType == PARTICIANT_TYPES.REPORTER && partyType == PARTICIANT_TYPES.HEARING_OFFICER;
}

export function useAppState(): any {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
