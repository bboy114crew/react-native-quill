import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import WebViewBaseJS from './WebViewBaseJSContainer';
import ActivityOverlay from './ActivityOverlay';

interface State {
  content: any;
  defaultContent: any;
}

export default class App extends React.Component<null, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      content: {
        ops: [
          {insert: 'This', attributes: {bold: true}},
          {insert: ' is '},
          {
            insert: 'base-quill-react',
            attributes: {
              bold: true, 
              color: '#3498db'
            },
          },
        ],
      },
      defaultContent: null,
    };
  }

  onMessageReceived = (message: any) => {
    const {instruction, payload} = message;
    if (payload?.delta) {
      console.log(payload);
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{flex: 1, padding: 5}}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          enabled>
          <View style={{flex: 1}}>
            <WebViewBaseJS
              content={this.state.content}
              onMessageReceived={this.onMessageReceived}
              loadingIndicator={ActivityOverlay}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  header: {
    height: 60,
    backgroundColor: 'dodgerblue',
    paddingHorizontal: 10,
    paddingTop: 30,
    width: '100%',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
