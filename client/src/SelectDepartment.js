import React from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

const SelectDepartment = ({ department, handleChange }) => {
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <>
      <FormControl variant="outlined" id="select-root">
        <InputLabel ref={inputLabel} id="select-inp-label">
          Department
        </InputLabel>
        <Select
          labelId="select-label"
          id="select-id"
          value={department || "student"}
          onChange={handleChange}
          name="department"
          margin="dense"
          labelWidth={labelWidth}
        >
          <MenuItem value="None">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"Student"}>Student</MenuItem>
          <MenuItem value={"Faculty"}>Faculty</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default SelectDepartment;
