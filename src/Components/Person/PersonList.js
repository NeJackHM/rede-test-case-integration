import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form } from 'react-bootstrap';
import PersonTable from './PersonTable';
import JobCategoryTable from './JobCategoryTable';
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container className="container">
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
      <PersonTable
        persons={persons}
        personIdFilter={personIdFilter}
        searchQuery={searchQuery}
        jobCategoryOrder={jobCategoryOrder}
        setJobCategoryOrder={setJobCategoryOrder}
        currentPage={currentPage}
        personsPerPage={personsPerPage}
        handlePageChange={handlePageChange}
      />

      <h3 className="mt-4">Categorías de Trabajo</h3>
      <JobCategoryTable jobCategories={jobCategories} />
    </Container>
  );
}

export default PersonList;