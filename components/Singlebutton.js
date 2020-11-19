import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

const SingleButton = (props) => {
  
    let flexButton = props.title === '0'  ? 2 : 1; 
    let currentBorderWidth = props.title === '0' ? 1 : 0;     // dodanie 2 brakujacych pikseli szerokosci w szerszym przycisku

    return(
      <TouchableOpacity 
        style={{
          margin: 1,
          borderWidth : currentBorderWidth,
          borderColor: '#8A8988',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor : props.background,
          flex: flexButton
        }}
        onPress={() => props.clickButton(props.title)}>
        
        <Text style={styles.textStyle}>{props.title}</Text>
      </TouchableOpacity>
    );
  
}
  
const styles = StyleSheet.create({
  textStyle: {
      color: 'white',
      fontSize: 35
  }
});

export { SingleButton };