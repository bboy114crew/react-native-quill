import React, {ReactElement} from 'react';
// @ts-ignore
import {StyleSheet, View, NativeSyntheticEvent, Platform} from 'react-native';
import {WebView} from 'react-native-webview';
import DebugMessageBox from './DebugMessageBox';
import {WebViewError} from 'react-native-webview/lib/WebViewTypes';
// @ts-ignore node types
const INDEX_FILE_PATH = require('./assets/index.html');

export interface Props {
  debugMessages: string[];
  doShowDebugMessages: boolean;
  handleMessage: (data: string) => void;
  loadingIndicator: () => ReactElement;
  onError: (syntheticEvent: NativeSyntheticEvent<WebViewError>) => void;
  onLoadEnd: () => void;
  onLoadStart: () => void;
  setWebViewRef: (ref: WebView) => void;
}

class WebViewQuillJSView extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      debugMessages,
      doShowDebugMessages,
      handleMessage,
      loadingIndicator,
      onError,
      onLoadEnd,
      onLoadStart,
      setWebViewRef,
    } = this.props;
    return (
      <View style={styles.viewStyle}>
        <WebView
          ref={component => {
            setWebViewRef(component);
          }}
          containerStyle={styles.containerStyle}
          onLoadEnd={onLoadEnd}
          onLoadStart={onLoadStart}
          onMessage={event => {
            if (event && event.nativeEvent && event.nativeEvent.data) {
              handleMessage(event.nativeEvent.data);
            }
          }}
          onError={onError}
          renderLoading={loadingIndicator || null}
          source={
            Platform.OS === 'ios'
              ? INDEX_FILE_PATH
              : {uri: 'file:///android_asset/index.html'}
          }
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          allowFileAccessFromFileURLs={true}
        />
        <DebugMessageBox
          debugMessages={debugMessages}
          doShowDebugMessages={doShowDebugMessages}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  containerStyle: {
    flex: 0,
    height: '100%',
    width: '100%',
  },
});

export default WebViewQuillJSView;
