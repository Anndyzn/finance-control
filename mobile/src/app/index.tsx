import { View, Text, StyleSheet, Pressable, TextInput, Alert, FlatList } from 'react-native';
import { useState} from 'react';
import { formatarMoeda } from '@/utils/formatarMoeda';
import ResumoCard from '@/components/ResumoCard';
import type { Movimentacao } from '@/types/Movimentacao';

export default function HomeScreen(){
  
  const [receitas, setReceitas] = useState<number>(1000000000);
  const [despesas, setDespesas] = useState<number>(1500);
  const [valor, setValor] = useState<string>('');
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('receita');
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [descricao, setDescricao] = useState<string>('');
  
  const saldo = receitas - despesas;

    const registrarMovimentacao = () => {
      const valorConvertido = Number(
        valor.trim().replace(',', '.')
      );

      // 1. Validar o valor
      if (
        !valor.trim() ||
        !Number.isFinite(valorConvertido) ||
        valorConvertido <= 0
      ) {
        Alert.alert('Valor inválido', 'Digite um valor maior que zero.');
        return;
      }

      // 2. Validar a descrição
      if (!descricao.trim()) {
        Alert.alert('Descrição obrigatória', 'Informe uma descrição.');
        return;
      }

      // 3. Criar a movimentação
      const novaMovimentacao: Movimentacao = {
        id: `${Date.now()}-${Math.random()}`,
        descricao: descricao.trim(),
        valor: valorConvertido,
        tipo: tipo,
        data: new Date().toISOString(),
      };

      // 4. Atualizar o histórico
      setMovimentacoes(anterior => [
        novaMovimentacao,
        ...anterior,
      ]);

      // 5. Atualizar os totais
      if (tipo === 'receita') {
        setReceitas(anterior => anterior + valorConvertido);
      } else {
        setDespesas(anterior => anterior + valorConvertido);
      }

      // 6. Limpar os campos
      setValor('');
      setDescricao('');
    };

    return (
      <View style={styles.container}>
      <Text style={styles.title}>FinanceControl</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Saldo total</Text>
        <Text style={styles.cardValue}>{formatarMoeda(saldo)}</Text>
        <Text style={styles.cardDescription}>Seu saldo disponivel</Text>
      </View>      

    <View style={styles.resumo}>
      <ResumoCard
        titulo="Receitas"
        valor={receitas}
        cor="#2563EB"
      />

      <ResumoCard
        titulo="Despesas"
        valor={despesas}
        cor="#DC2626"
      />
    </View>

      <View style={styles.formulario}>
        <Text style={styles.formularioTitulo}>
          Nova movimentação
        </Text>

      <View style={styles.seletor}>
        <Pressable
          style={[
            styles.opcao,
            tipo== 'receita' && styles.opcaoReceita,
          ]}
          onPress={() => setTipo('receita')}
        >
          <Text style={styles.textOpcao}>Receita</Text>
        </Pressable>

        <Pressable 
          style={[
            styles.opcao,
            tipo ==='despesa' && styles.opcaoDespesa,
          ]}
          onPress={() => setTipo('despesa')}
        >
          <Text style={styles.textOpcao}>Despesa</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder='Descrição (ex.: Mercado)'
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        style={styles.input}
        placeholder='Digite o valor'
        keyboardType='decimal-pad'
        value={valor}
        onChangeText={setValor}
      />
      <Pressable
        style={[
          styles.botaoRegistrar,
          tipo === 'receita'
            ? styles.botaoVerde
            : styles.botaoVermelho,
        ]}
        onPress={registrarMovimentacao}
      >
        <Text style={styles.textoBotao}>
          Registrar {tipo}
        </Text>
        </Pressable>
      </View>

      <Text style={styles.historicoTitulo}>
        Últimas movimentações
      </Text>

      <FlatList
        data={movimentacoes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.movimentacaoItem}>
            <View>
              <Text style={styles.movimentacaoDescricao}>
                {item.descricao}
              </Text>

              <Text style={styles.movimentacaoTipo}>
                {item.tipo === 'receita' ? 'Receita' : 'Despesa'}
              </Text>
            </View>

            <Text
              style={{
                color: item.tipo === 'receita' ? '#16A34A' : '#DC2626',
                fontWeight: 'bold',
              }}
            >
              {item.tipo === 'receita' ? '+' : '-'}
              {formatarMoeda(item.valor)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.listaVazia}>
            Nenhuma movimentação registrada.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
    paddingTop: 5,
  },

  title: {
    backgroundColor:'#7aa8f1',
    borderRadius: 15,
    fontSize: 35,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
    marginTop:50,
  },

  card: {
    backgroundColor: '#173D32',
    borderRadius: 16,
    padding: 24,
  },

  cardLabel: {
    fontSize: 16,
    color: '#D4E8DF'
  },

  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
  },

  cardDescription: {
    fontSize: 13,
    color: '#B8D9C9',
    marginTop: 8,
  },

  resumo: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },

  resumoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },

  botaoReceita: {
    backgroundColor: '#16A34A',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  formulario: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },

  formularioTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    color: '#1e293b'
  },

  seletor: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  opcao: {
    flex: 1,
    padding: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    alignItems: 'center',
  },

  opcaoReceita: {
    backgroundColor: '#86efac',
  },

  opcaoDespesa: {
    backgroundColor: '#fca5a5'
  },

  textOpcao: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b'
  },

  botaoRegistrar: {
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
  },

  botaoVerde: {
    backgroundColor: '#16a34a'
  },

  botaoVermelho: {
    backgroundColor: '#dc2626'
  },

  historicoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 25,
    marginBottom: 12,
  },

  movimentacaoItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  movimentacaoDescricao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  movimentacaoTipo: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  listaVazia: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 20,
  },
});