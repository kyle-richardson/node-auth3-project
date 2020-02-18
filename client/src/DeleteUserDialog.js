import React from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const DeleteUserDialog = ({ id, refresh }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const tryDelete = async id => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      refresh();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Delete User
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user? You cannot retrieve
            content from this user once it is deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={e => {
              handleClose();
              tryDelete(id);
            }}
            color="primary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteUserDialog;
