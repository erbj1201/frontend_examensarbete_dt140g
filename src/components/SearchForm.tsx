/*search in header component*/
const SearchForm = () => {
  return (
    <div className="container p-3 mx-auto">
      <form className="mx-auto">
        {/**search-input and button in header */}
        <div className="row mx-auto">
          <div className="col">
            <label>Sökord:</label>
            <input type="text" className="form-control shadow-sm border-dark" />
          </div>
          <div className="col">
            <label htmlFor="filter">Filtrera</label>
            <select className="form-select shadow-sm border-dark">
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
          <div className="col align-content-center mt-4">
            <button className="d-flex justify-content-center max-auto p-3 shadow-sm">
              <img
                className="search-btn align-self-center"
                src="\src\content\search.png"
                alt="sök här"
              />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
//export
export default SearchForm;
