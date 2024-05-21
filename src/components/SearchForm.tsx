import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
/*search in header component*/
// Structure of animal
interface Animal {
  id: number;
  animalId: string;
  earNo: string;
  birthDate: string;
  breed: string;
  sex: string;
  category: string;
  name: string;
  herd_id: string;
}

const SearchForm = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('earNo');
  const [filteredOptions, setFilteredOptions] = useState<Animal[]>([]);
  const cookies = new Cookies();
  const token = cookies.get("token");
  // Get userid from sessionstorage
  const userid = sessionStorage.getItem("userid");

  useEffect(() => {
    if (userid) {
      getAnimalsByUser();
    }
  }, [userid]); // Fetch animals when userid changes

  const getAnimalsByUser = async () => {
    try {
      // Fetch all animals by user (get)
      const animalsResponse = await fetch(
        `http://localhost:8000/api/animals/users/${userid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const animalsData = await animalsResponse.json();
      setAnimals(animalsData);

      //Get errors
    } catch (error) {
      console.log("Kunde inte hämta djur")
    }
  };
//Call the function directly 
  useEffect(() => {
    filterAnimals();
  }, [searchText, filter, animals]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent reload
    filterAnimals(); // Filter animals
  };

  // Filtered animals based on filter option, i nsearch field
  const filterAnimals = () => {
    const searchTerm = searchText.trim().toLowerCase();
    const filtered = animals.filter(animal => {
      // If "earNo", all animals shows
      switch (filter) {
        case 'earNo':
          return animal.earNo.toLowerCase().includes(searchTerm);
        case 'birthDate':
          return animal.birthDate.includes(searchTerm);
        case 'breed':
          return animal.breed.toLowerCase().includes(searchTerm);
        case 'sex':
          return animal.sex.toLowerCase().includes(searchTerm);
        case 'category':
          return animal.category.toLowerCase().includes(searchTerm);
        case 'animalId':
          return animal.animalId.toLowerCase().includes(searchTerm);
        case 'name':
          return animal.name.toLowerCase().includes(searchTerm);
        default:
          return false;
      }
    });
    setFilteredOptions(filtered);
  };

  return (
    <div className="mx-auto">
      <form onSubmit={handleSubmit} className="form-control form-control-sm align-items-center mx-auto bglight border-0 searchOptions">
        {/**search-input and button in header */}
        <div className="row">
          <div className="col-sm-12 col-lg">
            <label htmlFor="search" >Sökord:</label>
            <input type="text" id="search" name='search' className="form-control form-control-sm border-dark active"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                filterAnimals();
              }}
            />
          </div>
          <div className="col-12 col-lg">
            <label htmlFor="filter">Filtrera</label>
            <select id="filter" name='filter' className="form-select form-select-sm border-dark"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}>

              <option value="earNo">Öronnummer</option>
              <option value="name">Namn</option>
              <option value="animalId">Djuridentitet</option>
              <option value="sex">Kön</option>
              <option value="category">Kategori</option>
              <option value="birthDate">Födelsedatum</option>
            </select>
          </div>
          <div className="col mt-3">
            <button className="search-btn-btn mx-auto my-1 py-1 px-4 shadow border border-dark">
              <img
                className="search-btn"
                src="\src\content\search.png"
                alt="sök här"
              />
            </button>
          </div>
        </div>
      </form>
      {searchText && filteredOptions.length > 0 && (
        <div className="scroll-list-container">
            <ul className="scroll-list">
            {filteredOptions.map(animal => (
              <li key={animal.id}>
                <Link to={`/details/${animal.id}`}>
                  {animal.name} - {animal.animalId} - {animal.earNo}
                </Link>
              </li>
            ))}
          </ul> 
        </div>
      )}
    </div>
  );
};
//export
export default SearchForm;
