function App() {
  const handleClick = async () => {
    const response = await fetch('http://localhost:3001/api/hello');
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <button onClick={handleClick}>Llamar al backend</button>
    </div>
  );
}

export default App;
