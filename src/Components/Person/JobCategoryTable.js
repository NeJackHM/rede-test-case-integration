import React from 'react';
import { Table } from 'react-bootstrap';

const JobCategoryTable = ({ jobCategories }) => {
  return (
    <Table className="table" striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Descripción</th>
          <th>Activo</th>
          <th>Fecha de Creación</th>
        </tr>
      </thead>
      <tbody>
        {jobCategories.map(category => (
          <tr key={category.id}>
            <td>{category.id}</td>
            <td>{category.description}</td>
            <td>{category.active ? "Sí" : "No"}</td>
            <td>{new Date(category.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default JobCategoryTable;