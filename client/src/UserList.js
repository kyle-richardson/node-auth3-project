import React from "react";

import DeleteUserDialog from "./DeleteUserDialog";
import EditUserDialog from "./EditUserDialog";

const UserList = ({ userList, tryLogout, refresh, currentId }) => {
  return (
    <>
      {!!userList &&
        userList.map(user => {
          return (
            <div
              key={user.id}
              style={{
                padding: "10px",
                border: "2px solid blue",
                marginBottom: "10px",
                borderRadius: "4px"
              }}
            >
              <p>id: {user.id}</p>
              <p>username: {user.username}</p>
              <p>department: {user.department}</p>
              {currentId === user.id && (
                <>
                  <EditUserDialog user={user} refresh={refresh} />
                  <DeleteUserDialog
                    id={user.id}
                    refresh={refresh}
                    logout={tryLogout}
                  />
                </>
              )}
            </div>
          );
        })}
    </>
  );
};

export default UserList;
