import { useEffect, useState } from 'react'
import '../App.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ws = new WebSocket("ws://localhost:3000/cable")

export function Chatroom() {
  const [messages, setMessages] = useState([])
  const {guid} = useSelector(state => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
    if (!guid) {

      const action = {
        type: 'login',
        guid: localStorage.guid
      }
  
      dispatch(action)
    }
  }, [])

  useEffect(() => {
    resetScroll()
  }, [messages])

  async function fetchMessages() {
    try {
      const response = await fetch("http://localhost:3000/messages")

      const data = await response.json()

      await setMessagesAndScrollDown(data)
    } catch (error) {
      console.log(error, '>>>>>>>>>>>');
    }

  }

  async function setMessagesAndScrollDown(data) {
    await setMessages(data)

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
        id: guid, 
        message: body  
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

  return (
    <div className='App'>
      <button onClick={ () => navigate('/')} style={{ margin: "1%"}}>Back</button>
      <div className="messageHeader">
        <h1>Messages</h1>
        <p>User: {guid}</p>
      </div>

      <div className="messages" id="messages">

        {messages.map((message) => {
          const messageData = JSON.parse(message.body);

          const messageClass = messageData.guid == guid ? 'message-right' : 'message-left';

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

