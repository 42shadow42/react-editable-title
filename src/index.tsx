import React, { useState, useCallback, useRef, useMemo, CSSProperties } from 'react';
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
  editButton?: boolean;
  editControlButtons?: boolean;
  seamlessInput?: boolean;
  saveOnBlur?: boolean;
  placeholder?: string;
  textStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  editButtonStyle?: CSSProperties;
  saveButtonStyle?: CSSProperties;
  cancelButtonStyle?: CSSProperties;
  inputPattern?: string;
  inputErrorMessage?: string;
  inputErrorMessageStyle?: CSSProperties;
  inputMinLength?: number;
  inputMaxLength?: number;
  cb: (currentText: string) => any;
  onEditCancel?: Function;
  onValidationFail?: Function;
}

const Editable: React.FC<EditableProps> = ({
  text,
  editButton = false,
  editControlButtons = false,
  seamlessInput = false,
  saveOnBlur = true,
  placeholder = 'Type Here',
  textStyle,
  inputStyle,
  editButtonStyle,
  saveButtonStyle,
  cancelButtonStyle,
  inputPattern,
  inputErrorMessage = 'Input does not match the pattern',
  inputErrorMessageStyle,
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
    [editing],
  )

  const updateDisplayText = useCallback(
    () => {
      setDisplayText(inputRef.current!.value)
      if (popupVisibile) {
        setPopupVisible(false)
      }
    },
    [],
  )

  const terminateEditing = useCallback(
    () => {
      setEditing(false);
      setPopupVisible(false);
      onEditCancel ? onEditCancel() : undefined
    },
    [],
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
    [],
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
    [],
  )

  return useMemo(() => {
    return (
      <React.Fragment>
        <div className={`title-wrapper ${cx(styles['title-wrapper'])}`}>
          {editing &&
            <input
              className={`${cx(styles['control'])} ${seamlessInput ? cx(styles['seamlessInput']) : cx(styles['customTitleInput'])} ${editControlButtons ? '' : cx(styles['bendRightSide'])}`}
              style={{ ...inputStyle, minWidth: `${placeholder.length * 8}px` }}
              ref={inputRef}
              placeholder={placeholder}
              value={displayText}
              onChange={updateDisplayText}
              onKeyDown={handleKeyDown}
              minLength={inputMinLength}
              maxLength={inputMaxLength}
              onBlur={saveOnBlur ? handleSaveText : terminateEditing}
            />
          }
          {
            inputPattern && popupVisibile &&
            <div className={`${cx(styles['popover'])} ${cx(styles['editable-title'])}`} style={inputErrorMessageStyle}>
                {inputErrorMessage}
            </div>
          }
          <span
            className={cx(styles['displayText'])}
            style={!editing ? { ...textStyle } : { display: 'none' }}
            onClick={handleClickOnText}>
            {text}
            {
              editButton &&
              <Button onClick={handleSaveText} className={`${cx(styles['control-button'])} ${cx(styles['control'])} ${cx(styles['edit-control'])}`}>
                <AiOutlineEdit className={cx(styles['control-icon'])} />
              </Button>
            }
          </span>
          {
            editControlButtons && editing &&
            <React.Fragment>
              <Button onClick={handleSaveText} className={`${cx(styles['control-button'])} ${cx(styles['control'])}`}>
                <AiOutlineCheck className={cx(styles['control-icon'])} />
              </Button>
              <Button onClick={terminateEditing} className={`${cx(styles['control-button'])} ${cx(styles['control'])} ${cx(styles['cancel-control'])}`}>
                <AiOutlineClose className={cx(styles['control-icon'])} />
              </Button>
            </React.Fragment>
          }
        </div>

      </React.Fragment>
    )
  }, [displayText, editing, popupVisibile])
}

export default Editable