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
  authoriseParticipant(authToken): Promise<any>;
  getToken(caseNumber, partyType, partyName): Promise<string>;
  removeParticipant: any;
}

export const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasTriedAuthorisation, setHasTriedAuthorisation] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);
  const [gridView, setGridView] = useState(true);
  const [userToken, setUserToken] = useState('');
  const [selectedAudioInput, setSelectedAudioInput] = useState({ deviceId: '' });
  const [selectedVideoInput, setSelectedVideoInput] = useState({ deviceId: '' });
  const [selectedSpeakerOutput, setSelectedSpeakerOutput] = useState({ deviceId: '' });
  const [participantInfo, setParticipantInfo] = useState(null);

  const participantAuthToken = window.location.hash.substr(1);

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
    authoriseParticipant: async () => {
      const url = `${endpoint}/authorise-participant`;

      const { data } = await axios({
        url: url,
        method: 'POST',
        headers: {
          Authorization: participantAuthToken ? `Bearer ${participantAuthToken}` : '',
        },
        data: {},
      });

      return data;
    },
    getToken: async () => {
      const url = `${endpoint}/token`;
      const { data } = await axios({
        url: url,
        method: 'POST',
        headers: {
          Authorization: participantAuthToken ? `Bearer ${participantAuthToken}` : '',
        },
        data: {},
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

  const authoriseParticipant: StateContextType['authoriseParticipant'] = async authToken => {
    if (hasTriedAuthorisation || endpoint === '') return participantInfo;

    setIsFetching(true);

    try {
      const response: any = await contextValue.authoriseParticipant(authToken);
      setHasTriedAuthorisation(true);
      setIsFetching(false);
      setParticipantInfo(response.participantInfo);
      return response.participantInfo;
    } catch (err) {
      setHasTriedAuthorisation(true);
      setError({ message: 'Unauthorised Access', code: 401, name: 'Authorization Error' });
      setIsFetching(false);
      return err;
    }
  };

  const getToken: StateContextType['getToken'] = (caseNumber, partyType, partyName) => {
    setIsFetching(true);
    return contextValue
      .getToken(caseNumber, partyType, partyName)
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
    <StateContext.Provider value={{ ...contextValue, getToken, removeParticipant, authoriseParticipant }}>
      {props.children}
    </StateContext.Provider>
  );
}

function participantIsMemberInHostRole(partyType: string) {
  return partyType === PARTICIANT_TYPES.REPORTER && partyType === PARTICIANT_TYPES.HEARING_OFFICER;
}

export function useAppState(): any {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
