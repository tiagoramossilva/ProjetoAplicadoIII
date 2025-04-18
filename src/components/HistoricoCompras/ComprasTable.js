import React from "react";
import { LiaEditSolid } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";

const ComprasTable = ({ compras, onDelete }) => {
  return (
    <table className="historico-table">
      <thead>
        <tr className="table-header-row">
          <th className="table-header">Fornecedor</th>
          <th className="table-header">Data</th>
          <th className="table-header">Valor Total</th>
          <th className="table-header">Projeto</th>
          <th className="table-header">Gerente</th>
          <th className="table-header">Ações</th>
        </tr>
      </thead>
      <tbody>
        {compras.length > 0 ? (
          compras.map((compra) => (
            <tr className="table-row" key={compra.id}>
              <td className="table-data">
                {compra.fornecedor?.razao_social_fornecedor || "N/A"}
              </td>
              <td className="table-data">
                {compra.data_compra
                  ? new Date(compra.data_compra).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="table-data">
                R$ {compra.valor_total?.toFixed(2) || "N/A"}
              </td>
              <td className="table-data">
                {compra.projeto?.nome_projeto || "N/A"}
              </td>
              <td className="table-data">
                {compra.projeto?.gerente_projeto || "N/A"}
              </td>
              <td className="table-actions">
                <button className="action-button edit-button">
                  <LiaEditSolid />
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => onDelete(compra.id)}
                >
                  <MdDeleteOutline />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="no-data">
              Nenhuma compra encontrada
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ComprasTable;
