import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button ,Card} from 'react-bootstrap';
import PersonTable from './PersonTable';
import JobCategoryTable from './JobCategoryTable';
import '../../Styles/Person/PersonList.css';

function PersonList() {
  const [persons, setPersons] = useState([]);
  const [personNameFilter, setPersonNameFilter] = useState('');
  const [personIdOrder, setPersonIdOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [personsPerPage] = useState(5);
  const [jobCategories, setJobCategories] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: '',
    email: '',
    gender: '',
    birthDate: '',
    telefoneNumber: '',
    country: '',
    isFreelance: false,
    isMarried: false,
    jobCategoryId: ''
  });

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
        setJobCategories(response.data.content);
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

  const handleCreateClick = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPerson(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const clearNewPerson = () => {
    setNewPerson({
      name: '',
      email: '',
      gender: '',
      birthDate: '',
      telefoneNumber: '',
      country: '',
      isFreelance: false,
      isMarried: false,
      jobCategoryId: ''
    });
  };

  const handleCreateSave = async () => {
    try {
      await axios.post('https://localhost:7019/api/v1/Person', newPerson);
      alert('Persona creada correctamente');
      clearNewPerson();
      setShowCreateForm(false);
      // Opcional: Actualizar la lista de personas sin recargar la página
      const response = await axios.get('https://localhost:7019/api/v1/Person');
      setPersons(response.data.content);
    } catch (error) {
      console.error('Error al crear la persona:', error);
      alert('Error al crear la persona');
    }
  };

  return (
    <Container className="container">
      <h2 className="mt-4">Personas</h2>

      <Form.Control
        type="text"
        placeholder="Buscar por Nombre"
        value={personNameFilter}
        onChange={(e) => setPersonNameFilter(e.target.value)}
        className="mb-3"
      />
      <Form.Control
        type="text"
        placeholder="Buscar por Descripción de Categoría de Trabajo"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-3"
      />
  
      <Button variant="success" onClick={()=>{
        handleCreateClick();
        clearNewPerson();
        }} className="mb-3">
        {showCreateForm ? 'Cancelar' : 'Crear Persona'}
      </Button>

      {showCreateForm && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title><h4>Crear Nueva Persona</h4></Card.Title>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newPerson.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newPerson.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formGender">
                <Form.Label>Género</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={newPerson.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona...</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formBirthDate">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="birthDate"
                  value={newPerson.birthDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formTelefoneNumber">
                <Form.Label>Número de Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefoneNumber"
                  value={newPerson.telefoneNumber}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formCountry">
                <Form.Label>País</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={newPerson.country}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formIsFreelance">
                <Form.Check
                  type="checkbox"
                  label="Freelance"
                  name="isFreelance"
                  checked={newPerson.isFreelance}
                  onChange={() => setNewPerson(prevState => ({
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
                  checked={newPerson.isMarried}
                  onChange={() => setNewPerson(prevState => ({
                    ...prevState,
                    isMarried: !prevState.isMarried
                  }))}
                />
              </Form.Group>
              <><br/></>
              <Form.Group controlId="formJobCategoryId">
                <Form.Label>Categoría de Trabajo</Form.Label>
                <Form.Control
                  as="select"
                  name="jobCategoryId"
                  value={newPerson.jobCategoryId}
                  onChange={handleInputChange}
                >
                  {jobCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.description}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <center><Button variant="primary" onClick={handleCreateSave} className="mt-3" style={{ width: '200px'}}><h4>Guardar</h4></Button></center>     
            </Form>
          </Card.Body>
          <><br/></>
        </Card>
      )}

      <PersonTable
        persons={persons}
        personNameFilter={personNameFilter}
        searchQuery={searchQuery}
        personIdOrder={personIdOrder}
        setPersonIdOrder={setPersonIdOrder}
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