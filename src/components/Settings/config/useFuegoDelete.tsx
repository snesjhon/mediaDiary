import fuego from "@/fuego/fuego";
import { useRouter } from "next/router";
import { useState } from "react";

function useFuegoDelete(): { isDeleting: boolean; deleteUser: () => void } {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  function deleteUser() {
    setIsDeleting(true);
    const currentUser = fuego.auth().currentUser;
    if (currentUser) {
      currentUser.delete().then(() => {
        setIsDeleting(false);
        return router.push("/");
      });
    }
  }
  return { isDeleting, deleteUser };
}

export default useFuegoDelete;
