import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const ws = new WebSocket("ws://localhost:3000/cable")

function App() {
  const [messages, setMessages] = useState([])
  const [guid, setGuid] = useState(2)
  const messagesContainer = document.getElementById("messages")

  ws.onopen = () => {
    console.log("Connected");

    ws.send(
      JSON.stringify({
        command: "subscribe",
        identifier: JSON.stringify({
          id: guid,
          channel: "MessagesChannel"
        })
      })
    )
  }

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data)
    if (data.type == "ping") return;
    if (data.type == "welcome") return;
    if (data.type == "confirm_subscription") return;

    const message = data.message;
    setMessagesAndScrollDown([...messages, message])
  }

  useEffect(() => {
    fetchMessages()

  }, [])

  useEffect(() => {
    resetScroll()
  }, [messages])

  async function fetchMessages() {
    try {
      const response = await fetch("http://localhost:3000/messages")

      const data = await response.json()

      await setMessagesAndScrollDown(data)
      // console.log(data, '<<<');
    } catch (error) {
      console.log(error, '>>>>>>>>>>>');
    }

  }

  async function setMessagesAndScrollDown(data) {
    await setMessages(data)
    // console.log(data, messages, '<<<');

    resetScroll()

  }

  function resetScroll() {
    if (!messagesContainer) return;

    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault()
      const body = e.target.message.value;
      e.target.message.value = ''

      const messageObject = {
        id: guid,  // Set the 'guid' as the 'id' identifier
        message: body  // Set the message content
      };

      await fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ body: messageObject })
      })

    } catch (error) {
      console.log(error, '>>>>>>');
    }
  }

  // console.log(messages);
  return (
    <div className='App'>
      <div className="messageHeader">
        <h1>Messages</h1>
        <p>Guid: {guid}</p>
      </div>

      <div className="messages" id="messages">

        {messages.map((message) => {
          // Parse message.body as JSON
          const messageData = JSON.parse(message.body);

          // Determine the CSS class based on the guid
          const messageClass = messageData.guid === guid ? 'message-right' : 'message-left';

          return (
            <div className={`message ${messageClass}`} key={message.id}>
              <p>{messageData.message}</p>
            </div>
          );
        })}

      </div>
      <div className="messageForm">
        <form onSubmit={handleSubmit}>
          <input type="text" className="messageInput" name='message' />
          <button className='messageButton' type='submit'>Send</button>
        </form>
      </div>
    </div>
  )
}

export default App
