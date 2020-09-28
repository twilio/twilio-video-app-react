import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel } from '@material-ui/core';

export default function ChatInput({ onSend }: { onSend: any }) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
      <FormControl>
        <label htmlFor="chat-snack-input" style={{ color: 'black' }}>
          Say something:
        </label>
        <TextField value={value} autoFocus={true} onChange={handleChange} id="chat-snack-input" size="small" />
      </FormControl>
      <Button type="submit" color="primary" variant="contained" style={{ marginLeft: '0.5em' }} size="small">
        Send
      </Button>
    </form>
  );
}
