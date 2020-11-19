import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SingleButton } from './components/Singlebutton.js'

import SplashScreen from 'react-native-splash-screen'

import mexp from 'math-expression-evaluator'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.initialState = {
      currentNumber: '0',
      display: '0',
      calculation: '0',
      storage: '',             //zapisuje aktualny operator
      screen: Dimensions.get('window'),
      singleArgument: false
    }
    this.state = this.initialState;
  }

  buttons = [
    [
      {
        title: '\u02B8\u221Ax',
        backgroundColor: '#616160',
        type: 'landscape',
        onPress: () => { this.showRoot() }
      },
      {
        title: 'x!',
        backgroundColor: '#616160',
        type: 'landscape',
        onPress: () => { this.doCalculatedExtend('x!') }
      },
      {
        title: 'AC',
        backgroundColor: '#616160',
        type: 'portrait',
        onPress: () => { this.clearAll() }
      },
      {
        title: 'DEL',
        backgroundColor: '#616160',
        type: 'portrait',
        onPress: () => { this.deleteLast() }
      },
      {
        title: '+/-',
        backgroundColor: '#616160',
        type: 'portrait',
        onPress: () => { this.changeSign() }
      },
      {
        title: '÷',
        backgroundColor: '#E8AB3A',
        type: 'portrait',
        onPress: () => { this.doCalculatedStandard('÷') }
      }
    ],
    [
      {
        title: 'e\u02E3',
        backgroundColor: '#616160',
        type: 'landscape',
        onPress: () => { this.doCalculatedExtend('e\u02E3') }
      },
      {
        title: '10\u02E3',
        backgroundColor: '#616160',
        type: 'landscape',
        onPress: () => { this.doCalculatedExtend('10\u02E3') }
      },
      {
        title: '7',
        backgroundColor: '#8A8988',
        type: 'portrait',
        onPress: () => { this.enterNumber('7') }
      },
      {
        title: '8',
        backgroundColor: '#8A8988',
        type: 'portrait',
        onPress: () => { this.enterNumber('8') }
      },
      {
        title: '9',
        backgroundColor: '#8A8988',
        type: 'portrait',
        onPress: () => { this.enterNumber('9') }
      },
      {
        title: 'x',
        backgroundColor: '#E8AB3A',
        type: 'portrait',
        onPress: () => { this.doCalculatedStandard('x') }
      },
    ],
    [
      {
        title: 'ln',
        backgroundColor: '#616160',
        type: 'landscape',
        onPress: () => { this.doCalculatedExtend('ln') }
      },
      {
        title: 'log\u2081\u2080',
        backgroundColor: '#616160',
        type: 'landscape',
        onPress: () => { this.doCalculatedExtend('log\u2081\u2080') }
      },
      {
        title: '4',
        backgroundColor: '#8A8988',
        type: 'portrait',
        onPress: () => { this.enterNumber('4') }
      },
      {
        title: '5',
        backgroundColor: '#8A8988',
        type: 'portrait',
        onPress: () => { this.enterNumber('5') }
      },
      {
        title: '6',
        backgroundColor: '#8A8988',
        type: 'portrait',
        onPress: () => { this.enterNumber('6') }
      },
      {
        title: '-',
        backgroundColor: '#E8AB3A',
        type: 'portrait',
        onPress: () => { this.doCalculatedStandard('-') }
      },
    ],
    [
      {
        title: '%',
        backgroundColor: '#616160',
        type: 'landscape',
        onPress: () => { this.doCalculatedStandard('%') }
      },
      {
        title: 'x\u00B2',
        backgroundColor: '#616160',
        type: 'landscape',
        onPress: () => { this.doCalculatedExtend('x\u00B2') }
      },
      {
        title: '1',
        backgroundColor: '#8A8988',
        type: 'portrait',
        onPress: () => { this.enterNumber('1') }
      },
      {
        title: '2',
        backgroundColor: '#8A8988',
        type: 'portrait',
        onPress: () => { this.enterNumber('2') }
      },
      {
        title: '3',
        backgroundColor: '#8A8988',
        type: 'portrait',
        onPress: () => { this.enterNumber('3') }
      },
      {
        title: '+',
        backgroundColor: '#E8AB3A',
        type: 'portrait',
        onPress: () => { this.doCalculatedStandard('+') }
      },
    ],
    [
      {
        title: 'π',
        backgroundColor: '#616160',
        type: 'landscape',
        onPress: () => { this.showPI() }
      },
      {
        title: 'x\u00B3',
        backgroundColor: '#616160',
        type: 'landscape',
        onPress: () => { this.doCalculatedExtend('x\u00B3') }
      },
      {
        title: '0',
        backgroundColor: '#8A8988',
        type: 'portrait',
        onPress: () => { this.enterNumber('0') }
      },
      {
        title: ',',
        backgroundColor: '#8A8988',
        type: 'portrait',
        onPress: () => { this.makePoint() }
      },
      {
        title: '=',
        backgroundColor: '#E8AB3A',
        type: 'portrait',
        onPress: () => { this.equals() }
      }
    ]
  ];

  createButtons() {
    let calculatorButtons;
    if (this.getOrientation() === 'Portrait') {
      calculatorButtons = this.buttons.map((row) => {
        return row.filter((button) => {               // z tablicy przycisków wybieramy tylko te będące w trybie portretowym
          return button.type === 'portrait'
        })
      });
    }
    else calculatorButtons = this.buttons;

    let buttonsLayout = calculatorButtons.map((buttonRows, rowsIndex) => {
      let rowLayout = buttonRows.map((button, buttonIndex) => {
        return <SingleButton
          title={button.title}
          background={button.backgroundColor}
          clickButton={button.onPress}
          key={'b' + buttonIndex} />
      });
      return <View style={styles.rowStyle} key={'r' + rowsIndex}>{rowLayout}</View>
    });
    return buttonsLayout
  }

  enterNumber = (digit) => {
    const { storage, currentNumber, display, calculation, singleArgument } = this.state;

    if (!(currentNumber === '0' && digit === '0') && !(storage === 'root' && (digit === '0' || digit === '1')) && !(singleArgument === true)) {
      if (storage === 'root') {
        let index = display.lastIndexOf('\u221A');        // znak pierwiastka
        let resultCalculation = calculation.substring(0, calculation.length - 1);     // usuwanie ')' ze stringa w celu aktualizacji stopnia pierwiastka 
        this.setState({                                                               // Zapis liczb w postaci stopnia pierwiastka
          currentNumber: currentNumber + digit,
          display: display.substr(0, index) + this.adjustNumber(digit) + display.substring(index, display.length),
          calculation: resultCalculation + digit + ')'
        })
      }
      else if (storage === '÷' && digit === '0') {
        this.setState({                
          currentNumber: '0',
          display: '0',
          calculation: '0',                  // Zabezpieczenie przed dzieleniem przez 0
          storage: '',
          singleArgument: false
        })
        alert('Nie można dzielić przez 0');
      }
      else if (display.charAt(display.length - 1) !== ')'){
        this.setState({
          currentNumber: currentNumber === '0' ? digit : currentNumber + digit,
          display: currentNumber === '0' ? display.substring(0, display.length - 1) + digit : display + digit,
          calculation: currentNumber === '0' ? calculation.substring(0, calculation.length - 1) + digit : calculation + digit
        })
      }
    }
  }

  showPI = () => {
    const { currentNumber, display, storage, calculation } = this.state;

    if ((currentNumber === '' || currentNumber === '0') && storage !== 'root')
      this.setState({
        currentNumber: Math.PI.toFixed(2).toString(),
        display: currentNumber === '0' ? display.substring(0, display.length - 1) + Math.PI.toFixed(2).toString() : display + Math.PI.toFixed(2).toString(),
        calculation: currentNumber === '0' ? calculation.substring(0, calculation.length - 1) + 'pi' : calculation + 'pi'
      })
  }

  doCalculatedStandard = (input) => {
    const { storage, currentNumber, display, calculation } = this.state;

    let currentDisplay;
    let operator = input;
    if (input === '÷') operator = '/'
    if (input === 'x') operator = '*'
    if (input === '%') operator = 'Mod'

    if (currentNumber !== '' && display !== '' && display.charAt(display.length - 1) !== '.') {
      currentDisplay = display + ' ' + input + ' ';
      this.setState({
        storage: input,
        display: currentDisplay.length > 48 ? '...' + currentDisplay.substring(3 + currentDisplay.length - 48, currentDisplay.length) : currentDisplay,
        calculation: calculation + ' ' + operator + ' ',
        currentNumber: '',
        singleArgument: false
      })
    }
    else {                          // zamiana operatora działania
      currentDisplay = display.substring(0, display.length - 2) + input + ' ';
      if (display !== '' && storage !== 'root' && display.charAt(display.length - 1) !== '.') {
        this.setState({
          storage: input,                             
          display: currentDisplay.length > 48 ? '...' + currentDisplay.substring(3 + currentDisplay.length - 48, currentDisplay.length) : currentDisplay,
          calculation: calculation.substring(0, calculation.length - 2) + operator + ' ',
        })
      }
    }
  }

  doCalculatedExtend = (input) => {
    const { storage, currentNumber, display, calculation, singleArgument } = this.state;

    if (currentNumber !== '' && singleArgument !== true && storage !== 'root') {
      let resultDisplay = '0';
      let resultCalculation = '0'

      if (input === 'x!') {
        if (currentNumber.includes('.') === true || parseFloat(currentNumber) < 0) alert('Silnie liczy się dla liczb naturalnych');
        else {
          resultDisplay = display + '!';
          resultCalculation = calculation + '!';
        }
      }
      else if (input === 'x\u00B2' || input === 'x\u00B3') {
        resultDisplay = display + input.substring(1, input.length);
        resultCalculation = input === 'x\u00B2' ? calculation + '^2' : calculation + '^3';
      }
      else if (input === 'ln' || input === 'log\u2081\u2080') {
        if (parseFloat(currentNumber) <= 0 ) {
          alert('Liczba logarytmowa musi być większa od 0');
        }
        else {
          resultDisplay = display.substring(0, display.length - currentNumber.length) + input + currentNumber;
          resultCalculation = input === 'ln'
            ? calculation.substring(0, calculation.length - currentNumber.length) + input + currentNumber
            : calculation.substring(0, calculation.length - currentNumber.length) + input.substring(0, input.length - 2) + currentNumber;
        }
      }
      else if (input === 'e\u02E3' || input === '10\u02E3') {
        resultDisplay = display.substring(0, display.length - currentNumber.length) + input.substring(0, input.length - 1) + [...currentNumber].map((el) => {
          return this.adjustNumber(el);
        }).toString().replace(/,/g, "");        // zapisywanie wykładnika potęgi przy pomocy funkcji zwacającej znaki w unicode
        resultCalculation = calculation.substring(0, calculation.length - currentNumber.length) + input.substring(0, input.length - 1) + '^(' + currentNumber + ')';
      }

      this.setState({
        currentNumber: resultDisplay === '0' ? '0' : currentNumber,
        display: resultDisplay,
        calculation: resultCalculation,
        singleArgument: resultDisplay === '0' ? false : true
      })
    }
  }

  makePoint = () => {
    const { currentNumber, display, calculation, singleArgument } = this.state;

    if (currentNumber.includes('.') === false && /[0-9]$/.test(display) && singleArgument !== true) {
      this.setState({
        currentNumber: currentNumber + '.',
        display: display + '.',
        calculation: calculation + '.'
      })
    }
  }

  changeSign = () => {
    const { storage, currentNumber, display, singleArgument, calculation } = this.state;

    if (singleArgument === false && ((/[0-9]$/.test(display) || display.charAt(display.length - 1) === ')') && storage !== 'root')) {
      let currentDisplay = display;
      let currentCalculation = calculation;

      if (display.charAt(display.length - 1) === ')') {
        let index = currentDisplay.lastIndexOf('(')
        currentDisplay = currentDisplay.substring(0, index);
        currentDisplay = currentDisplay + currentNumber;
      }

      if (calculation.charAt(calculation.length - 1) === ')') {
        let index = currentCalculation.lastIndexOf('(')
        currentCalculation = currentCalculation.substring(0, index);
        currentCalculation = currentCalculation + currentNumber;
      }

      let changedValue = parseFloat(currentNumber) * (-1)
      this.setState({
        currentNumber: changedValue.toString(),
        display: (currentDisplay.length > currentNumber.length && changedValue < 0)
          ? display.substring(0, currentDisplay.length - currentNumber.length) + '(' + changedValue + ')'
          : display.substring(0, currentDisplay.length - currentNumber.length) + changedValue,
        calculation: (currentDisplay.length > currentNumber.length && changedValue < 0)
          ? calculation.substring(0, currentCalculation.length - currentNumber.length) + '(' + changedValue + ')'
          : calculation.substring(0, currentCalculation.length - currentNumber.length) + changedValue,
      })
    }

  }

  equals = () => {
    const { currentNumber, calculation, storage, singleArgument } = this.state;

    if (currentNumber !== '' && (storage !== '' || singleArgument !== false)){
      let result = parseFloat(mexp.eval(calculation)).toFixed(2);
      this.setState({
        storage: '',
        display: (mexp.eval(calculation) % 1 == 0) ? (parseInt(mexp.eval(calculation))).toString() : result.toString(),
        currentNumber: (mexp.eval(calculation) % 1 == 0) ? (parseInt(mexp.eval(calculation))).toString() : result.toString(),
        calculation: (mexp.eval(calculation) % 1 == 0) ? (parseInt(mexp.eval(calculation))).toString() : result.toString(),
        singleArgument: false
      })
    }

  }

  showRoot = () => {
    const { currentNumber, display, calculation, singleArgument } = this.state;

    if (currentNumber !== '' && parseFloat(currentNumber) >= 0 && singleArgument !== true) {
      this.setState({
        storage: 'root',
        display: display.substring(0, display.length - currentNumber.length) + '\u221A' + '(' + currentNumber + ')',        // pierwiastek n stopnia
        calculation: calculation + '^(1/)',
        currentNumber: ''
      })
    }
  }

  clearAll = () => {
    this.setState({
      storage: '',
      display: '0',
      calculation: '0',
      currentNumber: '0',
      singleArgument: false
    })
  }

  deleteLast = () => {
    const { currentNumber, display, calculation, singleArgument } = this.state;
    if (currentNumber !== '' && display.charAt(display.length - 1) !== ')' && singleArgument !== true) {
      this.setState({
        currentNumber: currentNumber.substring(0, currentNumber.length - 1),
        display: display.substring(0, display.length - 1),
        calculation: calculation.substring(0, calculation.length - 1)
      })
    }
  }

  adjustNumber = (digit) => {
    switch (digit) {
      case '.': return '\u22C5'
      case '-': return '\u207B';
      case '0': return '\u2070';
      case '1': return '\u00B9';
      case '2': return '\u00B2';      // zamiana na odpowiedni znak w unicode
      case '3': return '\u00B3';
      case '4': return '\u2074';
      case '5': return '\u2075';
      case '6': return '\u2076';
      case '7': return '\u2077';
      case '8': return '\u2078';
      case '9': return '\u2079';
    }
  }

  getOrientation = () => {
    if (this.state.screen.width < this.state.screen.height) {
      return 'Portrait';
    } else {
      return 'Landscape';
    }
  }

  onLayout = () => {
    this.setState({
      screen: Dimensions.get('window')
    });
  }

  componentDidMount = () => {
    SplashScreen.hide();
  }

  render() {

    return (
      <View style={styles.container} onLayout={this.onLayout.bind(this)}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{this.state.display}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          {this.createButtons()}
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A4A49'
  },
  resultContainer: {
    flex: 4,
    justifyContent: "center",
  },
  buttonsContainer: {
    flex: 9,
  },
  resultText: {
    color: 'white',
    fontSize: 50,
    padding: 10,
    textAlign: "right"
  },
  rowStyle: {
    flex: 1,
    flexDirection: "row"
  }
});