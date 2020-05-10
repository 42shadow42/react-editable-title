An editable title implementation for react.

## Installation



```
npm install react-editable-title
```

## Usage

```javascript
import React, { useState } from 'react'
import Editable from 'react-editable-title'

const App = () => {
  const [text, setText] = useState('')

  const handleTextUpdate = (current: string) => {
    setText(current)
  }

  return (
        <Editable 
          text={text} 
          placeholder="Type here"
          cb={handleTextUpdate}
         />
  )
}

```

## API

| Attribute                | Type            | Description                                                        | Required |
|--------------------------|-----------------|--------------------------------------------------------------------|----------|
| `text`                   | `string`        | Text to be displayed                                               | **Yes**  |
| `cb`                     | `function`      | Invoked when the text has been edited                              | **Yes**  |
| `onEditCancel`           | `function`      | Invoked when the edit has been canceled                            | No       |
| `onValidationFail`       | `function`      | Invoked when the text hasn't matched the regex                     | No       |
| `placeholder`            | `string`        | Placeholder text of the input element                              | No       |
| `saveOnBlur`             | `boolean`       | Attempts to save text input on unfocus. **Default** is `true`      | No       |
| `seamlessInput`          | `boolean`       | Presents text-editor alike experience. **Default** is `false`      | No       |
| `inputPattern`           | `string`        | Regex pattern of desired input                                     | No       |
| `inputErrorMessage`      | `string`        | Info message about mismatch of input                               | No       |
| `inputMinLength`         | `number`        | Min length accepted as an input                                    | No       |
| `inputMaxLength`         | `number`        | Max length accepted as an input                                    | No       |



## Features
The component can be controlled by keyboard keys. Hit **Enter** to save or **Esc** to cancel your edit.
If there is **no** change in the text, neither **Enter** nor the **Edit** button would work.

You also can control the validity of inputs with the **regex** you would provide. If the regex won't match the user input
then your desired **error message** will be shown below of the input field.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
Thanks :raised_hands:


## License
[GPL](https://choosealicense.com/licenses/gpl-3.0/)
