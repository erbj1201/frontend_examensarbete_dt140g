//Component Navbar
const SearchForm = () => {

    return (
<div className="container p-3 mx-auto">
<form className="mx-auto">
  <div className="row">
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
    <div className="col">
    <input type="submit" value="Sök" />
    </div>
    </div>
</form>

</div>


);
};

export default SearchForm;