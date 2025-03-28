import FontsTable from "./components/FontTable";
import Navbar from "./components/Navbar";
import TTFFileUploader from "./components/TTFFileUploader";

function App() {
  return (
    <>
      <Navbar />
      <TTFFileUploader />
      <FontsTable />
      {/* <FontGroupForm /> */}
    </>
  );
}

export default App;
