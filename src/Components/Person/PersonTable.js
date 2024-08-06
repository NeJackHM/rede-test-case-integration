import React, { useState, useEffect } from 'react';
import { Table, Pagination, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const PersonTable = ({ persons, personIdFilter, searchQuery, jobCategoryOrder, setJobCategoryOrder, currentPage, personsPerPage, handlePageChange }) => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editablePerson, setEditablePerson] = useState({});
  const [jobCategories, setJobCategories] = useState([]);

  useEffect(() => {
    const fetchJobCategories = async () => {
      try {
        const response = await axios.get('https://localhost:7019/api/v1/JobCategory');
        setJobCategories(response.data.content);
      } catch (error) {
        console.error("Error al obtener los datos de categorías de trabajo:", error);
      }
    };

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

  const handleEditClick = (person) => {
    setSelectedPerson(person);
    setEditablePerson({ ...person });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditablePerson(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put('https://localhost:7019/api/v1/Person', {
        id: editablePerson.personId,
        name: editablePerson.name,
        email: editablePerson.email,
        gender: editablePerson.gender,
        birthDate: editablePerson.birthDate,
        telefoneNumber: editablePerson.telefoneNumber,
        country: editablePerson.country,
        isFreelance: editablePerson.isFreelance,
        isMarried: editablePerson.isMarried,
        jobCategoryId: editablePerson.jobCategoryId
      });
      alert('Datos actualizados correctamente');
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar la persona:', error);
      alert('Error al actualizar los datos');
    }
  };

  const handleDelete = async (personId) => {
    try {
      await axios.delete('https://localhost:7019/api/v1/Person', { data: { id: personId } });
      alert('Registro eliminado correctamente');
      window.location.reload(); // Recarga la página para reflejar los cambios
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      alert('Error al eliminar el registro');
    }
  };

  return (
    <>
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
            <th>Acciones</th>
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
              <td>
                <Button variant="primary" onClick={() => handleEditClick(person)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(person.personId)} className="ms-2">Eliminar</Button>
              </td>
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
      {selectedPerson && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>Detalles de la Persona</Card.Title>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editablePerson.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editablePerson.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formGender">
                <Form.Label>Género</Form.Label>
                <Form.Control
                  type="text"
                  name="gender"
                  value={editablePerson.gender}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formBirthDate">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="birthDate"
                  value={editablePerson.birthDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formTelefoneNumber">
                <Form.Label>Número de Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefoneNumber"
                  value={editablePerson.telefoneNumber}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formCountry">
                <Form.Label>País</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={editablePerson.country}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formIsFreelance">
                <Form.Check
                  type="checkbox"
                  label="Freelance"
                  name="isFreelance"
                  checked={editablePerson.isFreelance}
                  onChange={() => setEditablePerson(prevState => ({
                    ...prevState,
                    isFreelance: !prevState.isFreelance
                  }))}
                />
              </Form.Group>
              <Form.Group controlId="formIsMarried">
                <Form.Check
                  type="checkbox"
                  label="Casado"
                  name="isMarried"
                  checked={editablePerson.isMarried}
                  onChange={() => setEditablePerson(prevState => ({
                    ...prevState,
                    isMarried: !prevState.isMarried
                  }))}
                />
              </Form.Group>
              <Form.Group controlId="formJobCategoryId">
                <Form.Label>Categoría de Trabajo</Form.Label>
                <Form.Control
                  as="select"
                  name="jobCategoryId"
                  value={editablePerson.jobCategoryId}
                  onChange={handleInputChange}
                >
                  {jobCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.description}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" onClick={handleSave} className="mt-3 mx-auto">Guardar Cambios</Button>
              <Button variant="secondary" onClick={() => setSelectedPerson(null)} className="mt-3 mx-auto">Cancelar</Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default PersonTable;