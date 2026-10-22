export type Movimentacao = {
    id: string;
    descricao: string;
    valor: number;
    tipo: 'receita' | 'despesa';
    data: string;
}