import * as React from 'react';
import {WebView} from 'react-native-webview';
import WebViewBaseJSComponent from './WebViewBaseJSComponent';
import {
  WebviewBaseJSMessage,
  WebviewBaseJSEvents,
  StartupMessage,
  WebViewBaseJSProps,
} from './models';

interface State {
  debugMessages: string[];
}

class WebViewBaseJS extends React.Component<WebViewBaseJSProps, State> {
  private webViewRef: any;
  static defaultProps = {
    content: null,
    defaultContent: null,
    doShowDebugMessages: false,
    loadingIndicator: () => {
      return null;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (syntheticEvent: any) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMessageReceived: (message: WebviewBaseJSMessage) => {},
    onLoadEnd: () => {},
    onLoadStart: () => {},
  };

  constructor(props: any) {
    super(props);
    this.state = {
      debugMessages: [],
    };
    this.webViewRef = null;
  }

  componentDidMount() {
    const {content, defaultContent} = this.props;
    if (content) {
      this.sendMessage({content});
    }
    if (defaultContent) {
      this.sendMessage({defaultContent});
    }
  }

  componentDidUpdate(prevProps: WebViewBaseJSProps) {
    const {content, defaultContent} = this.props;
    if (content !== prevProps.content) {
      this.sendMessage({content});
    }
    if (defaultContent !== prevProps.defaultContent) {
      this.sendMessage({defaultContent});
    }
  }

  // Handle messages received from webview contents
  private handleMessage = (data: string) => {
    const {onMessageReceived} = this.props;
    if (onMessageReceived) {
      let message: WebviewBaseJSMessage = JSON.parse(data);
      this.updateDebugMessages(`Received: ${JSON.stringify(message)}`);
      if (message.msg === WebviewBaseJSEvents.BASEJS_COMPONENT_MOUNTED) {
        this.sendStartupMessage();
      }
      onMessageReceived(message);
    }
  };

  // Send message to webview
  private sendMessage = (payload: object) => {
    this.updateDebugMessages(`Sending: ${payload}`);
    this.webViewRef.injectJavaScript(
      `window.postMessage(${JSON.stringify(payload)}, '*');`,
    );
  };

  // Send a startup message with initalizing values to the map
  private sendStartupMessage = () => {
    const {
      content,
      doShowBaseComponentDebugMessages,
      defaultContent,
    } = this.props;
    const startupMessage: StartupMessage = {
      content,
      defaultContent,
      doShowBaseComponentDebugMessages,
    };

    this.updateDebugMessages('Sending startup message');
    this.webViewRef.injectJavaScript(
      `window.postMessage(${JSON.stringify(startupMessage)}, '*');`,
    );
  };

  // Add a new debug message to the debug message array
  private updateDebugMessages = (debugMessage: string) => {
    this.setState({
      debugMessages: [...this.state.debugMessages, debugMessage],
    });
  };

  private onError = (syntheticEvent: any) => {
    this.props.onError(syntheticEvent);
  };

  private onLoadEnd = () => {
    this.props.onLoadEnd && this.props.onLoadEnd();
  };

  private onLoadStart = () => {
    this.props.onLoadStart && this.props.onLoadStart();
  };

  // Output rendered item to screen
  render() {
    const {debugMessages} = this.state;
    const {doShowDebugMessages, loadingIndicator} = this.props;
    return (
      <WebViewBaseJSComponent
        debugMessages={debugMessages}
        doShowDebugMessages={doShowDebugMessages}
        handleMessage={this.handleMessage}
        loadingIndicator={loadingIndicator}
        onError={this.onError}
        onLoadEnd={this.onLoadEnd}
        onLoadStart={this.onLoadStart}
        setWebViewRef={(ref: WebView) => {
          this.webViewRef = ref;
        }}
      />
    );
  }
}

export default WebViewBaseJS;
