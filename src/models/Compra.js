const db = require('../config/firebase');

class Compra {
  constructor(id, dataCompra, dataEmissao, dataEnvio, projeto_id, fornecedor_id, cliente_id, produto_id, valorTotal) {
    this.id = id;
    this.dataCompra = dataCompra;
    this.dataEmissao = dataEmissao;
    this.dataEnvio = dataEnvio;
    this.projeto_id = projeto_id; 
    this.fornecedor_id = fornecedor_id; 
    this.cliente_id = cliente_id; 
    this.produto_id = produto_id;
    this.valorTotal = valorTotal;
  }

  static async create(compraData) {
    const docRef = db.collection('compras').doc();
    const novaCompra = new Compra(
      docRef.id,
      compraData.dataCompra,
      compraData.dataEmissao,
      compraData.dataEnvio,
      compraData.projeto_id,
      compraData.fornecedor_id,
      compraData.cliente_id,
      compraData.produto_id,
      compraData.valorTotal
    );
    await docRef.set(novaCompra);
    return novaCompra;
  }

  static async getById(id) {
    const doc = await db.collection('compras').doc(id).get();
    if (!doc.exists) {
      throw new Error('Compra não encontrada');
    }
    const data = doc.data();
    return new Compra(
      doc.id,
      data.dataCompra,
      data.dataEmissao,
      data.dataEnvio,
      data.projeto_id,
      data.fornecedor_id,
      data.cliente_id,
      data.produto_id,
      data.valorTotal
    );
  }

  static async update(id, updateData) {
    const docRef = db.collection('compras').doc(id);
    await docRef.update(updateData);
    const doc = await docRef.get();
    const data = doc.data();
    return new Compra(
      doc.id,
      data.dataCompra,
      data.dataEmissao,
      data.dataEnvio,
      data.projeto_id,
      data.fornecedor_id,
      data.cliente_id,
      data.produto_id,
      data.valorTotal
    );
  }

  static async delete(id) {
    await db.collection('compras').doc(id).delete();
    return { message: 'Compra deletada com sucesso' };
  }

  static async getAll() {
    const snapshot = await db.collection('compras').get();
    const compras = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      compras.push(new Compra(
        doc.id,
        data.dataCompra,
        data.dataEmissao,
        data.dataEnvio,
        data.projeto_id,
        data.fornecedor_id,
        data.cliente_id,
        data.produto_id,
        data.valorTotal
      ));
    });
    return compras;
  }
}

module.exports = Compra;
