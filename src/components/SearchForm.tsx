//Component Searchform
const SearchForm = () => {

    return (
<div className="container p-3 mx-auto">
<form className="mx-auto">
  <div className="row mx-auto">
    <div className="col">
        <label>Sökord:</label>
      <input type="text" className="form-control"/>
    </div>
    <div className="col">
    <label htmlFor="filter">Filtrera</label>
      <select className="form-control">
<option value={1}>1</option>
<option value={2}>2</option>
<option value={3}>3</option>
      </select>
    </div>
    <div className="col align-content-center mt-4">
    <button className="d-flex justify-content-center max-auto p-3"><img className="search-btn align-self-center" src="\src\content\search.png" alt="sök här"/></button> 
    </div>
    </div>
</form>
</div>
);
};

export default SearchForm;