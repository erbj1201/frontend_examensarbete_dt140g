/*Message component*/
//Import

import DOMPurify from "dompurify";
import React, { useState } from "react";
import Cookies from "universal-cookie";
import Collapsible from "./Collapsible";

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

//New instance of cookies
const cookies = new Cookies();
//Get token from cookies
const token = cookies.get("token");

//Get userid from sessionstorage
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
  //State for fetched messages
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
    //Clear messages
    setShowMessage(null);
    setFormError({
      title: "",
      description: "",
    });
  };

 /*  // Fetch all herds and animals by user on component mount
  useEffect(() => {
    getAllMessages();
  }, []); */
  //Get users herds and users anmials
  const getAllMessages = async () => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    //Get userid from sessionstorage
    const userid = sessionStorage.getItem("userid")!;
    try {
      // Fetch all user herds (get)
      const getMessages = await fetch(
        `http://127.0.0.1:8000/api/messages/users/${userid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const message = await getMessages.json();

      setFetchMessages(message);

      //Get errors
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Object to track input errors
    let inputError = {
      title: "",
      description: "",
    };
    //Check if title, description are empty
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
        getAllMessages();
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
      <div className="mx-auto container">
        {showMessage !== null && (
          <p className="alert mx-auto alert-success text-dark text-center mt-2">
            {showMessage || ""}
          </p>
        )}
        <div className="mx-auto p-5 messageDiv border border-grey shadow">
        <h3 className="text-center m-1 pb-5 pt-0">Support via mejl</h3>
          <form
            className="form-control bglight shadow border-dark form-control-sm p-3 mx-auto"
            onSubmit={sendMessage}
            noValidate //The formdata is not automaticallly validated by the browser
          >
            <h4 className="p-2 mb-3">Vad vill du ha hjälp med? </h4>
            <input type="hidden" value={messageData.userid} />
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Ämne
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control form-control-sm border-dark"
                required
                value={messageData.title}
                onChange={({ target }) =>
                  handleInputChange(target.name, target.value)
                }
              />
              <p className="error-message text-danger fw-bold">{formError.title}</p>
            </div>
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Beskrivning
              </label>
              <textarea className="form-control border-dark"
                id="description"
                name="description"
                required
                value={messageData.description}
                onChange={({ target }) =>
                  handleInputChange(target.name, target.value)
                }></textarea>
              <p className="error-message text-danger fw-bold">{formError.description}</p>
            </div>
            <button type="submit" className="button mt-2">
              Skicka meddelande
            </button>
          </form>
       
        <div className="mx-auto collapsible-messages">
          <Collapsible open title="Alla skickade meddelanden" 
            onClick={() => getAllMessages()}>
            <section className=" m-4 mx-auto p-4">
              {fetchMessages.length > 0 ? (
                <>
                  {/*   <h3 className="text-center">Alla skickade meddelanden</h3> */}
                  {fetchMessages.map((message) => {
                    // Convert created_at to a new Date-Object
                    const createNewDate = new Date(message.created_at);
                    // Convert Date and Time to the swedish standard.
                    const formattedDateTime = `${createNewDate.toLocaleDateString(
                      "sv-SE"
                    )} ${createNewDate.toLocaleTimeString("sv-SE")}`;

                    return (
                      <article className=" bg-white mx-auto border border-dark p-3 m-3" key={message.id}>
                        <h4>{message.title}</h4>
                        <p className="dateText">
                          <em>Skickat: {formattedDateTime}</em>
                        </p>
                        <p>{message.description}</p>
                      </article>
                    );
                  })}
                </>
              ) : (
                <p>Inga meddelanden finns registrerade</p>
              )
              }
            </section>
          </Collapsible>
        </div>
      </div>
      </div>
  );
};
//export
export default Message;
