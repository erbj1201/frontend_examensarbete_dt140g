/*search in header component*/
const SearchForm = () => {
  return (
    <div className="mx-auto">
      <form className="form-control form-control-sm align-items-center mx-auto bglight border-0 w-50">
        {/**search-input and button in header */}
        <div className="row mx-auto">
          <div className="col">
            <label>Sökord:</label>
            <input type="text" className="form-control form-control-sm shadow border-dark" />
          </div>
          <div className="col">
            <label htmlFor="filter">Filtrera</label>
            <select className="form-select form-select-sm shadow border-dark">
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
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
    </div>
  );
};
//export
export default SearchForm;
