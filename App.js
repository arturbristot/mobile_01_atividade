import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, Button, Text, Surface } from 'react-native-paper';

const simbolos = [
  [1000000, '𓁨'],
  [100000, '𓆐'],
  [10000, '𓂭'],
  [1000, '𓆼'],
  [100, '𓍢'],
  [10, '𓎆'],
  [1, '𓏺'],
];

function paraHieroglifo(valor) {
  let numero = Math.floor(Math.abs(Number(valor)));
  if (isNaN(numero) || numero === 0) return '0';
  let texto = '';
  for (const [v, s] of simbolos) {
    while (numero >= v) {
      texto += s;
      numero -= v;
    }
  }
  return Number(valor) < 0 ? '-' + texto : texto;
}

export default function App() {
  const [display, setDisplay] = useState('0');
  const [anterior, setAnterior] = useState(null);
  const [operacao, setOperacao] = useState(null);
  const [novoNumero, setNovoNumero] = useState(false);

  function digito(d) {
    if (display === '0' || novoNumero) {
      setDisplay(d === '.' ? '0.' : d);
      setNovoNumero(false);
    } else {
      if (d === '.' && display.includes('.')) return;
      setDisplay(display + d);
    }
  }

  function calcular(a, b, op) {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') return b === 0 ? 'Erro' : a / b;
    return b;
  }

  function escolherOperacao(op) {
    if (anterior !== null && operacao && !novoNumero) {
      const resultado = calcular(anterior, Number(display), operacao);
      setDisplay(String(resultado));
      setAnterior(resultado === 'Erro' ? null : resultado);
    } else {
      setAnterior(Number(display));
    }
    setOperacao(op);
    setNovoNumero(true);
  }

  function igual() {
    if (anterior === null || !operacao) return;
    const resultado = calcular(anterior, Number(display), operacao);
    setDisplay(String(resultado));
    setAnterior(null);
    setOperacao(null);
    setNovoNumero(true);
  }

  function limpar() {
    setDisplay('0');
    setAnterior(null);
    setOperacao(null);
    setNovoNumero(false);
  }

  const linhas = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['C', '0', '.', '+'],
  ];

  function apertar(tecla) {
    if (tecla === 'C') limpar();
    else if (['+', '-', '*', '/'].includes(tecla)) escolherOperacao(tecla);
    else digito(tecla);
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Surface style={styles.display} elevation={2}>
          <Text variant="headlineMedium" style={styles.hieroglifo}>
            {display === 'Erro' ? 'Erro' : paraHieroglifo(display)}
          </Text>
          <Text variant="titleMedium" style={styles.numero}>
            {anterior !== null && operacao ? anterior + ' ' + operacao : ''} {display}
          </Text>
        </Surface>

        {linhas.map((linha, i) => (
          <View key={i} style={styles.linha}>
            {linha.map((tecla) => (
              <Button
                key={tecla}
                mode={['+', '-', '*', '/'].includes(tecla) ? 'contained' : 'outlined'}
                style={styles.botao}
                labelStyle={styles.textoBotao}
                onPress={() => apertar(tecla)}
              >
                {tecla}
              </Button>
            ))}
          </View>
        ))}

        <Button mode="contained" style={styles.igual} labelStyle={styles.textoBotao} onPress={igual}>
          =
        </Button>
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  display: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    minHeight: 120,
    justifyContent: 'center',
  },
  hieroglifo: {
    textAlign: 'right',
  },
  numero: {
    textAlign: 'right',
    color: '#666',
    marginTop: 10,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  botao: {
    flex: 1,
    marginHorizontal: 5,
  },
  textoBotao: {
    fontSize: 22,
    paddingVertical: 8,
  },
  igual: {
    marginHorizontal: 5,
  },
});
