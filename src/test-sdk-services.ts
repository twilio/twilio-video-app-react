const LZString = require('./lz-string');

interface IWatchRTCHttpOptions {
  debug?: boolean;
}

const logPrefix = (type: 'error' | 'info' = 'info') =>
  type === 'error'
    ? [
        '%cwatchRTC %cERROR',
        `background: ${'gold'}; color: black; padding: 2px 0.5em; border-radius: 0.5em;`,
        `background: ${'red'}; color: white; padding: 2px 0.5em; border-radius: 0.5em;`,
      ]
    : ['%cwatchRTC', `background: ${'gold'}; color: black; padding: 2px 0.5em; border-radius: 0.5em;`];

export class WatchRTCHttp {
  public static _instance: WatchRTCHttp;
  private debug = false;

  constructor(options: IWatchRTCHttpOptions) {
    if (WatchRTCHttp._instance) {
      console.info(...logPrefix('info'), 'WatchRTCSocket instance already created');
    } else {
      WatchRTCHttp._instance = this;
      this.debug = !!options.debug;
    }
  }

  trace(url: string, projectId?: string, rtcRoomId?: string, rtcPeerId?: string, ...data: any[]) {
    const args = Array.prototype.slice.call(data);
    args.push(Date.now());
    if (args[1] instanceof RTCPeerConnection) {
      args[1] = (args[1] as any).__rtcStatsId;
    }

    const response = fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        projectId,
        rtcRoomId,
        rtcPeerId,
      }),
    });

    response.then().catch(err => console.log(...logPrefix('error'), err.message, { err: err.stack }));
  }
}

const PROTOCOL_VERSION = '2.0';

interface IWatchRTCSocketOptions {
  debug?: boolean;
}

export class WatchRTCSocket {
  public static _instance: WatchRTCSocket;
  public connection: WebSocket | null = null;
  public wasConnected = false;
  public buffer: any[] = [];

  private sendInterval = 1;
  private onClose: () => void = () => {};
  private debug = false;
  private dataCollection = true;

  constructor(options: IWatchRTCSocketOptions) {
    if (WatchRTCSocket._instance) {
      console.info(...logPrefix('info'), 'WatchRTCSocket instance already created');
    } else {
      WatchRTCSocket._instance = this;
      this.debug = !!options.debug;
    }
  }

  connect(url: string, onData: (data: any) => void, onError: (error: any) => void) {
    if (WatchRTCSocket._instance.connection) {
      WatchRTCSocket._instance.connection.close();
    }
    const _this = WatchRTCSocket._instance;
    WatchRTCSocket._instance.connection = new WebSocket(url, PROTOCOL_VERSION);
    WatchRTCSocket._instance.connection.onopen = function(_e: Event) {};
    WatchRTCSocket._instance.connection.onclose = function(_e: CloseEvent) {};
    WatchRTCSocket._instance.connection.onmessage = function(e: MessageEvent) {
      try {
        const data = JSON.parse(e.data);
        if (data.error) {
          _this?.connection?.close();
          _this.connection = null;
          console.info(...logPrefix('error'), '\n' + data.error);
          onError(data.error);
        } else {
          if (data.sendInterval) {
            WatchRTCSocket._instance.sendInterval = data.sendInterval;
          }
          onData(data);

          WatchRTCSocket._instance.wasConnected = true;
        }
      } catch (err) {
        console.info(...logPrefix('error'), { err: err.stack });
        onError(err.message);
      }
    };
    WatchRTCSocket._instance.connection.onerror = function(e: Event) {
      console.info(...logPrefix('error'), '\n', e);
      onError(e);
    };
  }

  trace(...data: any[]) {
    const args = Array.prototype.slice.call(data);
    args.push(Date.now());
    if (args[1] instanceof RTCPeerConnection) {
      args[1] = (args[1] as any).__rtcStatsId;
    }

    if (!WatchRTCSocket._instance.dataCollection) {
      return;
    }

    if (!WatchRTCSocket._instance.connection) {
      if (WatchRTCSocket._instance.buffer.length > 1000) {
        return;
      }
      WatchRTCSocket._instance.buffer.push(args);
      return;
    }

    if (WatchRTCSocket._instance.connection.readyState === WebSocket.OPEN) {
      WatchRTCSocket._instance.buffer.push(args);

      if (WatchRTCSocket._instance.buffer.length >= WatchRTCSocket._instance.sendInterval) {
        const lines = JSON.stringify(WatchRTCSocket._instance.buffer);
        const compressedMessage = LZString.compressToEncodedURIComponent(lines);
        if (WatchRTCSocket._instance.debug) {
          console.log(...logPrefix('info'), `lines: ${lines.length}`);
          console.log(...logPrefix('info'), `compressedMessage: ${compressedMessage.length}`);
        }
        WatchRTCSocket._instance.buffer = [];
        WatchRTCSocket._instance.connection.send(compressedMessage);
      }
    }
  }

  close() {
    WatchRTCSocket._instance.buffer = [];

    if (WatchRTCSocket._instance.connection) {
      WatchRTCSocket._instance.connection.close();
      WatchRTCSocket._instance.onClose();
      WatchRTCSocket._instance.connection = null;
    }
  }

  disableDataCollection() {
    if (WatchRTCSocket._instance.debug) {
      console.log(...logPrefix('info'), `Data collection disabled.`);
    }
    WatchRTCSocket._instance.dataCollection = false;
  }

  enableDataCollection() {
    if (WatchRTCSocket._instance.debug) {
      console.log(...logPrefix('info'), `Data collection enabled.`);
    }
    WatchRTCSocket._instance.dataCollection = true;
  }

  toggleDebug(debug: boolean) {
    WatchRTCSocket._instance.debug = debug;
  }
}
