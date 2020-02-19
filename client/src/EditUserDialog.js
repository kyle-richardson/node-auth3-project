import React, { useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const EditUserDialog = ({ user, refresh }) => {
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState({
    username: user.username,
    password: ""
    // department: user.department
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSave = async () => {
    const omitPass = {
      username: editUser.username
      //   department: editUser.department
    };
    try {
      await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        editUser.password ? editUser : omitPass,
        {
          headers: { Authorization: localStorage.getItem("token") }
        }
      );
      handleClose();
      refresh();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Edit User
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            onChange={handleChange}
            value={editUser.username}
            name="username"
            // fullWidth
          />
          <TextField
            margin="dense"
            id="password"
            label="password"
            type="password"
            onChange={handleChange}
            value={editUser.password}
            name="password"
            // fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditUserDialog;
