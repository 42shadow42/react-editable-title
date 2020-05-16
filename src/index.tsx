import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Button } from 'reactstrap';
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';

import cn from 'classnames/bind';
import styles from '../src/css/index.module.css';
const cx = cn.bind(styles);

/**
 * Keyboard Event Key-codes
 */
enum Key {
  Enter = 13,
  ESC = 27
}

interface EditableProps {
  text: string;
  seamlessInput?: boolean;
  saveOnBlur?: boolean;
  placeholder?: string;
  inputPattern?: string;
  inputErrorMessage?: string;
  inputMinLength?: number;
  inputMaxLength?: number;
  cb: (currentText: string) => any;
  onEditCancel?: Function;
  onValidationFail?: Function;
}

const Editable: React.FC<EditableProps> = ({
  text,
  seamlessInput = false,
  saveOnBlur = true,
  placeholder = 'Type Here',
  inputPattern,
  inputErrorMessage = 'Input does not match the pattern',
  inputMinLength,
  inputMaxLength,
  cb,
  onEditCancel,
  onValidationFail
}) => {
  const [editing, setEditing] = useState(false);
  const [popupVisibile, setPopupVisible] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const handleClickOnText = useCallback(
    () => {
      setEditing(!editing)
      setDisplayText(text)
      /* 
         A little hack to wait event-loop to flush-out itself
         The issue is, when the user clicked on the text 
         or the edit button, the focus instantly being given
         to the input element. But, it`s not visible at the moment.
         By calling the `setTimeout`, function call will be done
         after the event-loop has executed all the functions.
      */
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0);
    },
    [editing, text],
  )

  const updateDisplayText = useCallback(
    () => {
      setDisplayText(inputRef.current!.value)
      if (popupVisibile) {
        setPopupVisible(false)
      }
    },
    [popupVisibile],
  )

  const terminateEditing = useCallback(
    () => {
      setEditing(false);
      setPopupVisible(false);
      onEditCancel ? onEditCancel() : undefined
    },
    [onEditCancel],
  )

  const handleKeyDown = useCallback(
    (event) => {
      const stroke = event.keyCode || event.which

      if (stroke === Key.Enter && text !== inputRef.current?.value) {
        handleSaveText()
      } else if (stroke === Key.ESC) {
        terminateEditing()
      }
    },
    [text],
  )

  const saveText = useCallback(
    () => {
      terminateEditing()
      cb(inputRef.current!.value)
    },
    [cb],
  )

  const handleSaveText = useCallback(
    () => {
      if (inputRef.current && inputRef.current.value.trim() !== '') {
        if (inputPattern) {
          if (inputRef.current.value.match(new RegExp(inputPattern))) {
            saveText()
          } else {
            setPopupVisible(true)
            onValidationFail ? onValidationFail() : undefined
          }
        } else {
          saveText()
        }

      }
    },
    [onValidationFail, inputPattern],
  )

  return useMemo(() => {
    return (
      <React.Fragment>
        <span className={`react-editable-title-wrapper ${cx(styles['title-wrapper'])}`}>
          {editing &&
            <input
              className={`react-editable-title-input ${cx(styles['control'])} ${seamlessInput ? cx(styles['seamless-input']) : cx(styles['custom-title-input'])}`}
              style={{ minWidth: `${placeholder.length * 8}px` }}
              ref={inputRef}
              placeholder={placeholder}
              value={displayText}
              onChange={updateDisplayText}
              onKeyDown={handleKeyDown}
              minLength={inputMinLength}
              maxLength={inputMaxLength}
              onBlur={saveOnBlur ? handleSaveText : undefined}
            />
          }
          {
            inputPattern && popupVisibile &&
            <span className={`react-editable-title-error ${cx(styles['popover'])} ${cx(styles['editable-title'])}`}>
              {inputErrorMessage}
            </span>
          }
          {!editing &&
            <span
              className={`react-editable-title-text ${cx(styles['display-text'])}`}
              onClick={handleClickOnText}>
              {text}
              {
                !seamlessInput &&
                <Button onClick={handleSaveText} className={`react-editable-title-edit-button ${cx(styles['control-button'])} ${cx(styles['control'])} ${cx(styles['edit-control'])}`}>
                  <AiOutlineEdit className={cx(styles['control-icon'])} />
                </Button>
              }
            </span>
          }
          {
            !seamlessInput && editing &&
            <React.Fragment>
              <Button onClick={handleSaveText} className={`react-editable-title-save-button ${cx(styles['control-button'])} ${cx(styles['control'])}`}>
                <AiOutlineCheck className={cx(styles['control-icon'])} />
              </Button>
              <Button onClick={terminateEditing} className={`react-editable-title-cancel-button ${cx(styles['control-button'])} ${cx(styles['control'])} ${cx(styles['cancel-control'])}`}>
                <AiOutlineClose className={cx(styles['control-icon'])} />
              </Button>
            </React.Fragment>
          }
        </span>
      </React.Fragment>
    )
  }, [displayText, editing, popupVisibile, inputMaxLength, inputMinLength, inputErrorMessage, inputPattern, placeholder, seamlessInput, saveOnBlur])
}

export default Editable