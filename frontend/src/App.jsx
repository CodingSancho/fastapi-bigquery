import UserDetails from "./components/UserDetails";
import UserForm from "./components/UserForm";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        width: "100vw",
      }}
    >
      <UserDetails />
      <UserForm />
    </div>
  );
}

export default App;
