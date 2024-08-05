import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Form, Pagination } from 'react-bootstrap';
import '../../Styles/Person/PersonList.css';

function PersonList() {
  const [persons, setPersons] = useState([]);
  const [personIdFilter, setPersonIdFilter] = useState('');
  const [jobCategoryOrder, setJobCategoryOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [personsPerPage] = useState(15);
  const [jobCategories, setJobCategories] = useState([]); // Estado para las categorías de trabajo

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await axios.get('https://localhost:7019/api/v1/Person');
        setPersons(response.data.content);
      } catch (error) {
        console.error("Error al obtener los datos de personas:", error);
      }
    };

    const fetchJobCategories = async () => {
      try {
        const response = await axios.get('https://localhost:7019/api/v1/JobCategory');
        setJobCategories(response.data.content); // Asumiendo que la respuesta tiene una propiedad `content`
      } catch (error) {
        console.error("Error al obtener los datos de categorías de trabajo:", error);
      }
    };

    fetchPersons();
    fetchJobCategories();
  }, []);

  const filteredPersons = persons.filter(person => {
    const matchesPersonId = !personIdFilter || person.personId === parseInt(personIdFilter);
    const matchesSearchQuery = person.jobCategoryDescription.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPersonId && matchesSearchQuery;
  });

  const sortedPersons = filteredPersons.sort((a, b) => {
    if (jobCategoryOrder === 'asc') {
      return a.jobCategoryDescription.localeCompare(b.jobCategoryDescription);
    } else {
      return b.jobCategoryDescription.localeCompare(a.jobCategoryDescription);
    }
  });

  const totalPages = Math.ceil(sortedPersons.length / personsPerPage);
  const startIndex = (currentPage - 1) * personsPerPage;
  const currentPersons = sortedPersons.slice(startIndex, startIndex + personsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container className="container">
      {/* Filtros y tabla de personas */}
      <h3 className="mt-4">Personas</h3>
      <Form.Control
        type="text"
        placeholder="Buscar por PersonId"
        value={personIdFilter}
        onChange={(e) => setPersonIdFilter(e.target.value)}
        className="mb-3"
      />
      <Form.Control
        type="text"
        placeholder="Buscar por Descripción de Categoría de Trabajo"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-3"
      />
      <Table className="table" striped bordered hover>
        <thead>
          <tr>
            <th>PersonId</th>
            <th>
              Descripción de Categoría de Trabajo
              <button onClick={() => setJobCategoryOrder(jobCategoryOrder === 'asc' ? 'desc' : 'asc')}>
                {jobCategoryOrder === 'asc' ? '↓' : '↑'}
              </button>
            </th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Género</th>
            <th>Fecha de Nacimiento</th>
            <th>Número de Teléfono</th>
            <th>País</th>
            <th>Freelance</th>
            <th>Casado</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {currentPersons.map(person => (
            <tr key={person.personId}>
              <td>{person.personId}</td>
              <td>{person.jobCategoryDescription}</td>
              <td>{person.name}</td>
              <td>{person.email}</td>
              <td>{person.gender}</td>
              <td>{new Date(person.birthDate).toLocaleDateString()}</td>
              <td>{person.telefoneNumber}</td>
              <td>{person.country}</td>
              <td>{person.isFreelance ? "Sí" : "No"}</td>
              <td>{person.isMarried ? "Sí" : "No"}</td>
              <td>{person.active ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="pagination">
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>

      {/* Nueva sección para mostrar categorías de trabajo */}
      <h3 className="mt-4">Categorías de Trabajo</h3>
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
    </Container>
  );
}

export default PersonList;