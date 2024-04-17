/*Message component*/
//import
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

//Structure for MessageItem (post messages)
interface MessageItem {
  title: string;
  description: string;
  userid: string;
}
interface Message {
    id: number;
    title: string;
    description: string;
    created_at: string;
}
//new instance of cookies
const cookies = new Cookies();
//get token from cookies
const token = cookies.get("token");
//get userid from sessionstorage
const userid = sessionStorage.getItem("userid")!;

const Message: React.FC = () => {
  //State for storing data
  const [messageData, setMessageData] = useState<MessageItem>({
    title: "",
    description: "",
    userid: userid,
  });
  //State for error to form
  const [formError, setFormError] = useState({
    title: "",
    description: "",
  });
  //state for fetched messages
  const [fetchMessages, setFetchMessages] = useState<Message[]>([]);
  //State for showing form messages
  const [showMessage, setShowMessage] = useState<string | null>(null);

  //Event for handling input-changes
  const handleInputChange = (title: string, value: string) => {
    setMessageData({
      ...messageData,
      [title]: value,
    });
  };

  // Function to clear update and delete messages after a specified time
  const clearMessages = () => {
    //clear messages
    setShowMessage(null);
    setFormError({
      title: "",
      description: "",
    });
    console.log("Message cleared");
  };
// Fetch all herds and animals by user on component mount
useEffect(() => {
     getAllMessages();
      }, []);
  //Get users herds and users anmials
  const getAllMessages = async () => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    //get userid from sessionstorage
const userid = sessionStorage.getItem("userid")!;
    try {
      // Fetch all user herds (get)
      const getMessages = await fetch(
        `http://127.0.0.1:8000/api/messages/users/${userid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        }
      );
      const message= await getMessages.json();
      setFetchMessages(message);
 //Get errors
} catch (error) {
    console.log(error);
  } 
} 

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Object to track input errors
    let inputError = {
      title: "",
      description: "",
    };
    // check if title, description are empty
    if (!messageData.title && !messageData.description) {
      setFormError({
        ...inputError,
        title: "Fyll i ett ämne",
        description: "Fyll i en beskrivning",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if title empty
    if (!messageData.title) {
      setFormError({
        ...inputError,
        title: "Fyll i ett ämne",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if description empty
    if (!messageData.description) {
      setFormError({
        ...inputError,
        description: "Fyll i en beskrivning",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    // Sanitize message input using DOMPurify
    const sanitizedTitle = DOMPurify.sanitize(messageData.title);
    const sanitizedDescription = DOMPurify.sanitize(messageData.description);

    // Update state with sanitized values
    setMessageData({
      title: sanitizedTitle,
      description: sanitizedDescription,
      userid: userid,
    });

    //Fetch (post) new message
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/messages/users/${userid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );
      const data = await response.json();
      //Response ok, get token and store
      if (response.ok) {
        setMessageData({
          title: "",
          description: "",
          userid: userid,
        });
        setShowMessage("Ditt meddelande har skickats");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      } else {
        //Error
        setShowMessage("Kunde inte skicka meddelande, försök igen");
        console.log(data);
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      } //Error
    } catch (error) {
      setShowMessage("Kunde inte skicka meddelande");
      console.log(error);
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
    }
  };


  return (
    <div>
      <h2>Skicka ett meddelande till oss</h2>
      <div>
        {showMessage !== null && (
          <p className="alert alert-light text-center mt-2">
            {showMessage || ""}
          </p>
        )}
        <form
          className="form-control form-control-sm border-0 p-2 mx-auto w-100"
          onSubmit={sendMessage}
          noValidate //The formdata is not automaticallly validated by the browser
        >
          <input type="hidden" value={messageData.userid} />
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Ämne
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              required
              value={messageData.title}
              onChange={({ target }) =>
                handleInputChange(target.name, target.value)
              }
            />
            <p className="error-message">{formError.title}</p>
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Beskrivning
            </label>
            <input
              type="text"
              id="description"
              name="description"
              className="form-control"
              required
              value={messageData.description}
              onChange={({ target }) =>
                handleInputChange(target.name, target.value)
              }
            />
            <p className="error-message">{formError.description}</p>
          </div>
          <button type="submit" className="btn btn-secondary mt-2">
            Skicka meddelande
          </button>
        </form>
      </div>
      <section>
        <h3>Alla skickade meddelanden</h3>
        {fetchMessages.map((message) => (
            <article key={message.id}>
                <h4>{message.title}</h4>
                <p><em>Skickat: {message.created_at}</em></p> 
                <p>{message.description}</p>

            </article>
       ) )}
      </section>
    </div>
  );
};
//export
export default Message;
