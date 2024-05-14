/*Message component*/
//Import

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

  // Fetch all herds and animals by user on component mount
  useEffect(() => {
    getAllMessages();
  }, []);
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
    <div>
      <h2 className="text-center m-5">Vill du ha hjälp med eller komma i kontakt med support?</h2>
      <div>
        {showMessage !== null && (
          <p className="alert alert-light text-center mx-auto">
            {showMessage || ""}
          </p>
        )}
        <form
          className="form-control handleForm bglight shadow-sm border-dark form-control-sm p-3 mx-auto w-50"
          onSubmit={sendMessage}
          noValidate //The formdata is not automaticallly validated by the browser
        > 
        <h3 className="p-4 mb-3">Skicka ett meddelande till oss</h3>
          <input type="hidden" value={messageData.userid} />
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Ämne
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control form-control-sm border-dark shadow-sm"
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
            <textarea className="form-control border-dark shadow-sm"
              id="description"
              name="description"
              required
              value={messageData.description}
              onChange={({ target }) =>
                handleInputChange(target.name, target.value)
              }></textarea>
            <p className="error-message">{formError.description}</p>
          </div>
          <button type="submit" className="button mt-2">
            Skicka meddelande
          </button>
        </form>
      </div>
      <section className="bglight m-4 mx-auto border border-dark p-4 w-50 shadow">
        <h3 className="text-center">Alla skickade meddelanden</h3>
        {fetchMessages.map((message) => {
          // Convert created_at to a new Date-Object
          const createNewDate = new Date(message.created_at);
          // Convert Date and Time to the swedish standard.
          const formattedDateTime = `${createNewDate.toLocaleDateString(
            "sv-SE"
          )} ${createNewDate.toLocaleTimeString("sv-SE")}`;

          return (
            <article className="mx-auto p-2 border border-dark bg-white m-3 w-50 shadow-sm" key={message.id}>
              <h4>{message.title}</h4>
              <p>
                <em>Skickat: {formattedDateTime}</em>
              </p>
              <p>{message.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
};
//export
export default Message;
