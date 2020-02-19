import React from "react";

import TextField from "@material-ui/core/TextField";
import SelectDepartment from "./SelectDepartment";

const SignupAdditions = ({ handleChange, passwordVerify, department }) => {
  return (
    <>
      <TextField
        id="outlined-password"
        name="passwordVerify"
        type="password"
        label="Verify Password"
        value={passwordVerify}
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        required
      />
      <SelectDepartment handleChange={handleChange} department={department} />
    </>
  );
};

export default SignupAdditions;
