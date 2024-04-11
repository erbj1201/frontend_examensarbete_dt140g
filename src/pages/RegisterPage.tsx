import Footer from "../components/Footer";
import Header from "../components/Header";
import Register from "../components/Register";


const RegisterPage: React.FC = () => {
  //State store data
  const [newUser, setNewUser] = useState <UserItem>({
    name: "",
    email: "",
    password: "",
    confirmPassword:"",
    successMsg: "",
  });

 //State store data
 const [formError, setFormError] = useState({
  name: "",
  email: "",
  password: "",
  confirmPassword:"",
});


const handleUserInput = (name: string, value: string) => {
  setNewUser({
    ...newUser,
    [name]: value,
  });
};

//const [userMessage, setUserMessage] = useState<string | null>(null);

const registerUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Object to track input errors
    let inputError = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
// check if name, email and password are empty
if(! newUser.name && !newUser.email && !newUser.password){
  setFormError({
    ...inputError,
    name: "Fyll i ett namn",
    email: "Fyll i en korrekt mejladress",
    password: "Fyll i ett lösenord",
  });
  return;
}
//Check if name empty
if(!newUser.name){
  setFormError({
    ...inputError,
    name: "Fyll i ett namn",
  });
  return;
}
//Check if email empty
if(!newUser.email){
  setFormError({
    ...inputError,
    email: "Fyll i en korrekt mejladress",
  });
  return;
}
//Check if password and confirm password match
if(newUser.confirmPassword !== newUser.password){
  setFormError({
    ...inputError,
    confirmPassword: "Lösenord och bekräftat lösenord är inte lika, försök igen",
  });
  return;
}

//Check if password empty
if(!newUser.password){
  setFormError({
    ...inputError,
    password: "Fyll i ett lösenord",
  });
  return;
}

    // Sanitize user input using DOMPurify
    const sanitizedName = DOMPurify.sanitize(newUser.name);
    const sanitizedEmail = DOMPurify.sanitize(newUser.email);
    const sanitizedPassword = DOMPurify.sanitize(newUser.password);


    // Update state with sanitized values
    setNewUser({
      name: sanitizedName,
      email: sanitizedEmail,
      password: sanitizedPassword,
      confirmPassword: newUser.confirmPassword,
      successMsg: newUser.successMsg,
    });

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: sanitizedName,
          email: sanitizedEmail,
          password: sanitizedPassword,
        }),
      });
      const responseData = await response.json();
      //If response ok
      if (response.ok) {
        setNewUser({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          successMsg: "",
        });
      }
      console.log(responseData);
    } catch (error) {
      console.log(error)
    }
  };
  
  return (
    <div>
      <Header />
      <main className="container mx-auto">
      <Register />
      </main>
      <Footer />
    </div>
  );
};
export default RegisterPage;
