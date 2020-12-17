import React from "react";
import useDelete from "../hooks/useDelete";

function Preferences(): JSX.Element {
  const { isDeleting, deleteUser } = useDelete();
  return (
    <div>
      <p>preferences</p>

      <button>{isDeleting ? "deleting" : "delete"}</button>
    </div>
  );
}
export default Preferences;
