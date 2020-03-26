import React from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';

export interface Props {
  debugMessages: string[];
  doShowDebugMessages: boolean;
}

const DebugMessageBox = ({
  debugMessages = [],
  doShowDebugMessages = false,
}: Props) => {
  if (doShowDebugMessages) {
    return (
      <View style={styles.container}>
        <ScrollView>
          {debugMessages.map((msg, idx) => {
            if (typeof msg === 'object') {
              return (
                <Text style={styles.textStyle} key={idx}>{`- ${JSON.stringify(
                  msg,
                )}`}</Text>
              );
            }
            return <Text style={styles.textStyle} key={idx}>{`- ${msg}`}</Text>;
          })}
        </ScrollView>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 10,
  },
  container: {
    height: 100,
    backgroundColor: 'aliceblue',
    padding: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});

export default DebugMessageBox;
