import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import "./CadastroCompra.css";

function CadastroCompra() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([
    {
      nome: "",
      numero_serie: "",
      fabricante: "",
      descricao: "",
      tipo_unitario: "",
      quantidade: "",
      andar: "",
      sala: "",
      armario: "",
    },
  ]);

  const [formData, setFormData] = useState({
    fornecedor: {
      razao_social: "",
    },
    cliente: {
      razao_social: "",
    },
    razao_social: {
      cnpj: "",
      inscricao_estadual: "",
      endereco: "",
      municipio: "",
      cep: "",
      bairro: "",
      uf: "",
      telefone: "",
    },
    compra: {
      data_compra: "",
      data_emissao: "",
      data_envio: "",
      valor_total: "",
    },
    projeto: {
      nome_projeto: "",
      responsavel_tecnico: "",
      gerente_projeto: "",
      cliente: "",
    },
    adicionais: {
      usuario: "",
      observacoes: "",
    },
  });

  const handleCancel = () => {
    navigate(-1);
  };

  const handleAddProduct = () => {
    setProdutos([
      ...produtos,
      {
        nome: "",
        numero_serie: "",
        fabricante: "",
        descricao: "",
        tipo_unitario: "",
        quantidade: "",
        andar: "",
        sala: "",
        armario: "",
      },
    ]);
  };

  const handleRemoveProduct = () => {
    if (produtos.length > 1) {
      setProdutos(produtos.slice(0, -1));
    }
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newProdutos = [...produtos];
    newProdutos[index][name] = value;
    setProdutos(newProdutos);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    const [section, field] = name.split(".");
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const fornecedorRef = await addDoc(
        collection(db, "fornecedores"),
        formData.fornecedor
      );
      const clienteRef = await addDoc(
        collection(db, "clientes"),
        formData.cliente
      );
      const razao_socialRef = await addDoc(
        collection(db, "razoesSociais"),
        formData.razao_social
      );

      const produtosRefs = await Promise.all(
        produtos.map(async (produto) => {
          const { andar, sala, armario, ...produtoInfo } = produto;

          const produtoRef = await addDoc(
            collection(db, "produtos"),
            produtoInfo
          );

          await addDoc(collection(db, "locaisArmazenamento"), {
            andar,
            sala,
            armario,
            produtoId: produtoRef.id, 
          });

          return produtoRef.id;
        })
      );

      const compraData = {
        clienteId: clienteRef.id,
        fornecedorId: fornecedorRef.id,
        razaoSocialId: razao_socialRef.id,
        produtosIds: produtosRefs,
        ...formData.compra,
        projeto: formData.projeto,
        adicionais: formData.adicionais,
        timestamp: new Date(),
      };

      const compraRef = await addDoc(collection(db, "compras"), compraData);
      console.log("Compra registrada com sucesso, ID: ", compraRef.id);
      alert("Compra cadastrada com sucesso!");
      navigate(-1);
    } catch (error) {
      console.error("Erro ao cadastrar a compra: ", error);
      alert("Erro ao cadastrar a compra. Tente novamente.");
    }
  };

  return (
    <div className="form-container">
      <h1>Cadastro de compra</h1>

      <form className="purchase-form" onSubmit={handleSubmit}>
        {/* Informações do fornecedor */}
        <fieldset className="form-section">
          <legend style={{display: "flex"}}>Informações do fornecedor <p style={{color: "red"}}>*</p></legend>
          <div className="form-group">
            <label>Razão social:</label>
            <input
              type="text"
              name="fornecedor.razao_social"
              onChange={handleFormChange}
            />
            <label>CNPJ:</label>
            <input
              type="text"
              name="razao_social.cnpj"
              onChange={handleFormChange}
            />
            <label>Inscrição estadual:</label>
            <input
              type="text"
              name="razao_social.inscricao_estadual"
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Endereço:</label>
            <input
              type="text"
              name="razao_social.endereco"
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Município:</label>
            <input
              type="text"
              name="razao_social.municipio"
              onChange={handleFormChange}
            />
            <label>UF:</label>
            <input
              type="text"
              name="razao_social.uf"
              onChange={handleFormChange}
            />
            <label>CEP:</label>
            <input
              type="text"
              name="razao_social.cep"
              onChange={handleFormChange}
            />
            <label>Bairro:</label>
            <input
              type="text"
              name="razao_social.bairro"
              onChange={handleFormChange}
            />
            <label>Telefone:</label>
            <input
              type="text"
              name="razao_social.telefone"
              onChange={handleFormChange}
            />
          </div>
        </fieldset>

        {/* Informações do cliente */}
        <fieldset className="form-section">
          <legend style={{display: "flex"}}>Informações do cliente<p style={{color: "red"}}>*</p></legend>
          <div className="form-group">
            <label>Razão social:</label>
            <input
              type="text"
              name="cliente.razao_social"
              onChange={handleFormChange}
            />
            <label>CNPJ:</label>
            <input
              type="text"
              name="razao_social.cnpj"
              onChange={handleFormChange}
            />
            <label>Inscrição estadual:</label>
            <input
              type="text"
              name="razao_social.inscricao_estadual"
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Endereço:</label>
            <input
              type="text"
              name="razao_social.endereco"
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Município:</label>
            <input
              type="text"
              name="razao_social.municipio"
              onChange={handleFormChange}
            />
            <label>UF:</label>
            <input
              type="text"
              name="razao_social.uf"
              onChange={handleFormChange}
            />
            <label>Telefone:</label>
            <input
              type="text"
              name="razao_social.telefone"
              onChange={handleFormChange}
            />
            <label>CEP:</label>
            <input
              type="text"
              name="razao_social.cep"
              onChange={handleFormChange}
            />
            <label>Bairro:</label>
            <input
              type="text"
              name="razao_social.bairro"
              onChange={handleFormChange}
            />
          </div>
        </fieldset>

        {/* Informações da compra */}
        <fieldset className="form-section">
          <legend style={{display: "flex"}}>Informações da compra<p style={{color: "red"}}>*</p></legend>
          <div className="form-group">
            <label>Data da compra:</label>
            <input
              type="date"
              name="compra.data_compra"
              onChange={handleFormChange}
            />
            <label>Data da emissão:</label>
            <input
              type="date"
              name="compra.data_emissao"
              onChange={handleFormChange}
            />
            <label>Data do envio:</label>
            <input
              type="date"
              name="compra.data_envio"
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Valor total:</label>
            <input
              type="text"
              name="compra.valor_total"
              onChange={handleFormChange}
            />
          </div>
        </fieldset>

        {/* Informações de produto e armazenamento */}
        {produtos.map((produto, index) => (
          <fieldset className="form-section" key={index}>
            <legend>Informações do produto</legend>
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                name="nome"
                value={produto.nome}
                onChange={(event) => handleChange(index, event)}
              />
              <label>Número de série:</label>
              <input
                type="text"
                name="numero_serie"
                value={produto.numero_serie}
                onChange={(event) => handleChange(index, event)}
              />
              <label>Fabricante:</label>
              <input
                type="text"
                name="fabricante"
                value={produto.fabricante}
                onChange={(event) => handleChange(index, event)}
              />
            </div>
            <div className="form-group">
              <label>Descrição do item:</label>
              <input
                type="text"
                name="descricao"
                value={produto.descricao}
                onChange={(event) => handleChange(index, event)}
              />
              <label>Tipo unitário:</label>
              <input
                type="text"
                name="tipo_unitario"
                value={produto.tipo_unitario}
                onChange={(event) => handleChange(index, event)}
              />
              <label>Quantidade:</label>
              <input
                type="number"
                name="quantidade"
                value={produto.quantidade}
                onChange={(event) => handleChange(index, event)}
              />
            </div>
            <div className="form-group">
              <label>Andar:</label>
              <input
                type="text"
                name="andar"
                value={produto.andar}
                onChange={(event) => handleChange(index, event)}
              />
              <label>Sala:</label>
              <input
                type="text"
                name="sala"
                value={produto.sala}
                onChange={(event) => handleChange(index, event)}
              />
              <label>Armário:</label>
              <input
                type="text"
                name="armario"
                value={produto.armario}
                onChange={(event) => handleChange(index, event)}
              />
            </div>
          </fieldset>
        ))}
        <div className="form-group">
          <button type="button" onClick={handleAddProduct}>
            Adicionar Produto
          </button>
          <button type="button" onClick={handleRemoveProduct}>
            Remover Produto
          </button>
        </div>
        {/* Informações do projeto */}
        <fieldset className="form-section">
          <legend>Informações do projeto</legend>
          <div className="form-group">
            <label>Nome do projeto:</label>
            <input
              type="text"
              name="projeto.nome_projeto"
              onChange={handleFormChange}
            />
            <label>Responsável técnico:</label>
            <input
              type="text"
              name="projeto.responsavel_tecnico"
              onChange={handleFormChange}
            />
            <label>Gerente do projeto:</label>
            <input
              type="text"
              name="projeto.gerente_projeto"
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Cliente:</label>
            <input
              type="text"
              name="projeto.cliente"
              onChange={handleFormChange}
            />
          </div>
        </fieldset>

        {/* Informações adicionais */}
        <fieldset className="form-section">
          <legend>Informações adicionais</legend>
          <div className="form-group">
            <label>Usuário:</label>
            <input
              type="text"
              name="adicionais.usuario"
              onChange={handleFormChange}
            />
            <label>Observações:</label>
            <input
              type="text"
              name="adicionais.observacoes"
              onChange={handleFormChange}
            />
          </div>
        </fieldset>

        <div className="form-group">
          <button type="submit">Salvar</button>
          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroCompra;
