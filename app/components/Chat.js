import React, { useEffect, useContext, useRef } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import io from "socket.io-client";
import { Link } from "react-router-dom";

function Chat() {
  const socket = useRef(null);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: []
  });

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearUnreadChatCount" });
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    socket.current = io(process.env.BACKENDURL || "https://myreactapp-api.herokuapp.com");
    socket.current.on("chatFromServer", message => {
      setState(draft => {
        draft.chatMessages.push(message);
      });
    });
    // Clean up - socket
    return () => socket.current.disconnect();
  }, []);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (state.chatMessages.length && !appState.isChatOpen) {
      appDispatch({ type: "addUnreadChatCount" });
    }
  }, [state.chatMessages]);

  function handleSubmit(e) {
    e.preventDefault();
    // Send message to chat server (realtime)
    socket.current.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token });

    setState(draft => {
      // add message to state collection of messages
      draft.chatMessages.push({ message: draft.fieldValue, username: appState.user.username, avatar: appState.user.avatar });
      draft.fieldValue = "";
    });
  }

  function handleFieldChange(e) {
    const value = e.target.value;
    setState(draft => {
      draft.fieldValue = value;
    });
  }

  return (
    <div id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right " + (appState.isChatOpen ? "chat-wrapper--is-visible" : "")}>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => appDispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" ref={chatLog} className="chat-log">
        {state.chatMessages.map((message, index) => {
          if (message.username == appState.user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }

          return (
            <div key={index} className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        <input onChange={handleFieldChange} ref={chatField} value={state.fieldValue} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </div>
  );
}

export default Chat;
