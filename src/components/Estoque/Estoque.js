import React, { useEffect, useState } from "react";
import {
  fetchProdutos,
  deleteProduto,
  updateProduto,
} from "../../services/api";
import { filterProdutos, safeGet } from "../../utils/helpers";
import { SearchBar } from "./SearchBar";
import { EditModal } from "./EditModal";
import { LiaEditSolid } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";
import Navigation from "../Navigation/Navigation";
import "./Estoque.css";

const ITEMS_PER_PAGE = 12;

export const EstoquePage = () => {
  const [produtos, setProdutos] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    nome: "",
    andar: "",
    sala: "",
    armario: "",
    nome_projeto: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  // Busca os produtos ao carregar
  useEffect(() => {
    const loadProdutos = async () => {
      try {
        const data = await fetchProdutos();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Erro ao carregar produtos. Verifique o console.");
      }
    };
    loadProdutos();
  }, []);

  // Filtra os produtos
  const filteredProdutos = filterProdutos(produtos, searchQuery);

  // Paginação
  const totalPages = Math.ceil(filteredProdutos.length / ITEMS_PER_PAGE);
  const paginatedProdutos = filteredProdutos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Funções de CRUD
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    try {
      await deleteProduto(id);
      setProdutos(produtos.filter((item) => item.id !== id));
      alert("Item excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir item. Verifique o console.");
    }
  };

  const handleUpdate = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    setUpdatedData({
      nome: item.nome,
      quantidade: item.quantidade,
      tipo_unitario: item.tipo_unitario,
      andar: item.andar,
      sala: item.sala,
      armario: item.armario,
    });
  };

  const handleSaveUpdate = async (data) => {
    try {
      const updatedItem = await updateProduto(currentItem.id, data);
      setProdutos(
        produtos.map((item) =>
          item.id === currentItem.id ? { ...item, ...updatedItem } : item
        )
      );
      setIsEditing(false);
      alert("Item atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar item. Verifique o console.");
    }
  };

  return (
    <>
      <Navigation />
      <div className="containertitle">
        <h1>Estoque</h1>
      </div>
      <div className="estoque-container">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <EditModal
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          currentItem={currentItem}
          updatedData={updatedData}
          setUpdatedData={setUpdatedData}
          onSave={handleSaveUpdate}
        />

        {/* Tabela de produtos */}
        <table className="estoque-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantidade</th>
              <th>Tipo Unitário</th>
              <th>Andar</th>
              <th>Sala</th>
              <th>Armário</th>
              <th>Projeto</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProdutos.length > 0 ? (
              paginatedProdutos.map((item) => (
                <tr key={item.id}>
                  <td>{safeGet(item, "nome")}</td>
                  <td>{safeGet(item, "quantidade")}</td>
                  <td>{safeGet(item, "tipo_unitario")}</td>
                  <td>{safeGet(item, "andar")}</td>
                  <td>{safeGet(item, "sala")}</td>
                  <td>{safeGet(item, "armario")}</td>
                  <td>{safeGet(item, "compras.0.projeto.nome_projeto")}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-button update-button"
                        onClick={() => handleUpdate(item)}
                      >
                        <LiaEditSolid />
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(item.id)}
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Nenhum item encontrado</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginação */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="buttonsPagination"
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="buttonsPagination"
          >
            Próxima
          </button>
        </div>
      </div>
    </>
  );
};

export default EstoquePage;
