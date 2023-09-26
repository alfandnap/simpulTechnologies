import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";

export default function Choosepage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()


  async function handleClick(e) {

    const action = {
      type: 'login',
      guid: e.target.id
    }

    await dispatch(action)

    await localStorage.clear()
    localStorage.guid = e.target.id

    navigate('/chatroom')
  }

  return (
    <div className='App'>
      <div className="messageHeader">
        <h1>Choose User</h1>
      </div>


      <div className="messages" id="messages" style={{ overflowY: "hidden" }}>

        <button id="1" onClick={handleClick}>1</button><br />
        <button id="2" onClick={handleClick}>2</button>

      </div>
    </div>
  )
}