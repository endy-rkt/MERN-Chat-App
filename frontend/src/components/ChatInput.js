import React, { useState, useRef, useEffect } from 'react';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';
import Picker from 'emoji-picker-react';
import styled from 'styled-components';

const ChatInput = ({ handleSendMsg }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showEmojiPicker && inputRef.current && !inputRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showEmojiPicker]);

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
    
    setShowEmojiPicker(!showEmojiPicker);
  };

  const sendMsg = (e) => {
    e.preventDefault();
    if (msg.length) {
      handleSendMsg(msg);
      setMsg('');
    }
  };

  return (
    <Container>
      <div className="button-container" ref={inputRef}>
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && (
            <EmojiPickerContainer>
              <Picker onEmojiClick={handleEmojiClick} />
            </EmojiPickerContainer>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={(e) => sendMsg(e)}>
        <input
          type="text"
          placeholder="Type our message here"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  padding: 0 2rem;
  bottom: 9.2%;
  width: 60%;
  height: 50px;
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
    width: 50%;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;

const EmojiPickerContainer = styled.div`
  position: absolute;
  top: -470px;
  right: 0;
  background-color: #080420;
  box-shadow: 0 5px 10px #9a86f3;
  border-color: #9a86f3;
  z-index: 1;
  .emoji-scroll-wrapper::-webkit-scrollbar {
    background-color: #080420;
    width: 5px;
    &-thumb {
      background-color: #9a86f3;
    }
  }
  .emoji-categories {
    button {
      filter: contrast(0);
    }
  }
  .emoji-search {
    background-color: transparent;
    border-color: #9a86f3;
  }
  .emoji-group:before {
    background-color: #080420;
  }
`;

export default ChatInput;
