import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { TwilioError } from 'twilio-video';
import { ERROR_MESSAGE } from '../utils/displayStrings';
import { PARTICIANT_TYPES } from '../utils/participantTypes';
import axios from 'axios';

import * as jwt_decode from 'jwt-decode';

export interface ParticipantInformation {
  caseReference: string;
  displayName: string;
  partyType: string;
  videoConferenceRoomName: string;
}

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
  authoriseParticipant(): Promise<any>;
  participantInfo: ParticipantInformation;
  getToken(participantInformation: ParticipantInformation): Promise<string>;
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

  //const [endpoint, setEndpoint] = useState('');
  var endpoint = '';

  // fetch(`${process.env.PUBLIC_URL}/config.json`)
  //   .then(r => r.json())
  //   .then(data => {
  //     //setEndpoint(data.endPoint);
  //     endpoint = data.endPoint;
  //   });

  async function fetchEndpoint(endpointUrl) {
    if (endpointUrl !== '') return;

    console.log(
      `fetching endpoint. process.env: ${
        process.env ? 'process.env: ' + JSON.stringify(process.env) : 'not yet initialised'
      }`
    );
    console.log(
      `fetching endpoint. process.env.PUBLIC_URL: ${
        process.env.PUBLIC_URL
          ? 'process.env.PUBLIC_URL: ' + JSON.stringify(process.env.PUBLIC_URL)
          : 'not yet initialised'
      }`
    );

    await fetch(`${process.env.PUBLIC_URL}/config.json`)
      .then(
        response => {
          console.log('response from fetch received');
          return response.json();
        },
        err => {
          console.log('failed to fetch url. err: ' + err);
        }
      )
      .then(responseBodyAsJson => {
        console.log('response body from fetch: ' + JSON.stringify(responseBodyAsJson));
        //setEndpoint(responseBodyAsJson.endPoint);
        endpoint = responseBodyAsJson.endPoint;
      });
  }
  //fetchEndpoint(endpoint);

  // useEffect(()=> {
  //   async function fetchEndpointAsync() {
  //     await fetchEndpoint(endpoint);
  //   }
  //   fetchEndpointAsync();
  // }, [endpoint]);

  // .then(async () =>
  //   {await authoriseParticipant(participantAuthToken);}
  // );

  async function ensureEndpointInitialised() {
    if (endpoint === '') {
      console.log('ensureEndpointInitialised. endpoint not yet defined attempting to fetch now');
      await fetchEndpoint(endpoint);
      if (endpoint === '') {
        //throw new Error('endpoint still not defined.');
        console.log('warning: endpoint not defined');
        return false;
      } else {
        console.log('managed to fetch endpoint: ' + endpoint);
        return true;
      }
    }
  }

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
      if (!(await ensureEndpointInitialised())) return null;

      const url = `${endpoint}/authorise-participant`;

      console.log('attempting authorise ' + new Date().toLocaleTimeString());

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
    participantInfo,
    getToken: async (participantInformation: ParticipantInformation) => {
      if (!(await ensureEndpointInitialised())) return null;

      const url = `${endpoint}/token`;
      const { data } = await axios({
        url: url,
        method: 'POST',
        headers: {
          Authorization: participantAuthToken ? `Bearer ${participantAuthToken}` : '',
        },
        data: {
          caseReference: participantInformation.caseReference,
          partyName: participantInformation.displayName,
          partyType: participantInformation.partyType,
          videoConferenceRoomName: participantInformation.videoConferenceRoomName,
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

  const authoriseParticipant: StateContextType['authoriseParticipant'] = async () => {
    if (hasTriedAuthorisation) return participantInfo;

    //setIsFetching(true);

    try {
      const response: any = await contextValue.authoriseParticipant();
      //setIsFetching(false);
      if (!response) return response;
      setParticipantInfo(response.participantInfo);
      setHasTriedAuthorisation(true);
      return response.participantInfo;
    } catch (err) {
      //setHasTriedAuthorisation(true);
      //setError({ message: 'Unauthorised Access', code: 401, name: 'Authorization Error' });
      //setIsFetching(false);
      console.log('error authorising participant: ' + err);

      return Promise.reject(err);
    }
  };

  const getToken: StateContextType['getToken'] = (participantInformation: ParticipantInformation) => {
    setIsFetching(true);
    return contextValue
      .getToken(participantInformation)
      .then((res: any) => {
        setIsFetching(false);

        if (!res.roomExist && !participantIsMemberInHostRole(participantInformation.partyType))
          return Promise.resolve(ERROR_MESSAGE.ROOM_NOT_FOUND);

        setUserToken(res.result);
        const user = jwt_decode(res.result);
        setUser(user);

        return Promise.resolve(user.twilioToken);
      })
      .catch(err => {
        setIsFetching(false);
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
  return partyType === PARTICIANT_TYPES.REPORTER || partyType === PARTICIANT_TYPES.HEARING_OFFICER;
}

export function useAppState(): any {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
