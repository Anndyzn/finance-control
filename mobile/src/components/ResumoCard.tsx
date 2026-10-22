import { View, Text, StyleSheet } from 'react-native';
import { formatarMoeda } from '@/utils/formatarMoeda';

type ResumoCardProps = {
    titulo: string;
    valor: number;
    cor: string;
};

export default function ResumoCard({
    titulo,
    valor,
    cor,
}: ResumoCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.titulo}></Text>
            <Text style={[styles.valor, { color: cor}]}> {formatarMoeda(valor)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
    },

    titulo: {
        fontSize: 14,
        color: '#64748b',
    },

    valor: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
});