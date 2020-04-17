import React, { useState, useRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import CopyIcon from '@material-ui/icons/Save';
import InputAdornment from '@material-ui/core/InputAdornment';

function InviteLink({ chat }) {
  const { protocol, hostname, port } = window.location;
  const location = `${protocol}//${hostname}${port.length ? ':' + port : ''}`;
  const inputRef = useRef();
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    inputRef.current.select();
    document.execCommand('copy');
  };
  return (
    <TextField
      variant="outlined"
      value={`${location}/${chat.inviteLink}`}
      fullWidth
      InputProps={{
        inputRef,
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip
              title={copied ? 'Copied!' : 'Copy'}
              onTransitionEnd={() => setCopied(false)}
            >
              <IconButton
                color="primary"
                onClick={handleCopy}
              >
                <CopyIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        )
      }}
    />
  )
}

export default InviteLink;