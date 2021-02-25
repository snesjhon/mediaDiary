import { Button, Center, DrawerBody, DrawerFooter } from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useReducer } from "react";
import { mutate } from "swr";
import { useMDDispatch, useMDState } from "../../config/store";
import type { LogState } from "../../config/storeLog";
import { LogReducer } from "../../config/storeLog";
import { fuegoDelete, fuegoEdit } from "../../fuego/fuegoMDActions";
import useFuegoUser from "../../fuego/useFuegoUser";
import type { MediaDiaryWithId } from "../../types/typesMedia";
import InfoFields from "../info/InfoFields";
import InfoHeader from "../info/InfoHeader";
import MdSpinner from "../md/MdSpinner";

function ContentEdit(): JSX.Element {
  const MDState = useMDState();
  const { edit, isSaving } = MDState;
  const mdDispatch = useMDDispatch();
  const { user } = useFuegoUser();

  let initData: LogState = {
    diaryDate: dayjs().toISOString(),
    loggedBefore: false,
    rating: 0,
  };
  if (typeof edit !== "undefined") {
    initData = edit;
  }

  const [state, dispatch] = useReducer(LogReducer, initData);

  return (
    <>
      {isSaving ? (
        <Center minH="40vh">
          <MdSpinner />
        </Center>
      ) : (
        <>
          <DrawerBody px={{ base: 6, sm: 8 }}>
            {edit && (
              <>
                <InfoHeader {...edit} />
                <InfoFields
                  type={edit.type}
                  fields={state}
                  dispatch={dispatch}
                  item={edit}
                  isEdit
                />
              </>
            )}
          </DrawerBody>
          <DrawerFooter justifyContent="space-between" borderTopWidth="1px">
            <Button
              onClick={deleteData}
              isLoading={isSaving}
              colorScheme="red"
              variant="outline"
            >
              Delete
            </Button>
            <Button
              onClick={editData}
              isLoading={isSaving}
              colorScheme="purple"
              variant="outline"
            >
              Save
            </Button>
          </DrawerFooter>
        </>
      )}
    </>
  );

  async function editData() {
    if (
      user !== null &&
      user &&
      user.email !== null &&
      typeof edit !== "undefined"
    ) {
      mdDispatch({ type: "saving" });
      const diaryEdit = createEdit();
      if (diaryEdit) {
        await fuegoEdit(user.uid, edit.id, diaryEdit, edit);
        mdDispatch({
          type: "savedEdit",
          payload: diaryEdit,
        });
        mutate(["/fuego/diaryDay", user.uid, edit.id]);
      } else {
        console.error("[EDIT] error with diaryEdit");
      }
    } else {
      console.error("user missing");
    }
  }

  function createEdit(): MediaDiaryWithId | false {
    if (typeof edit !== "undefined") {
      const editItem = {
        ...edit,
        diaryDate: state.diaryDate,
        diaryYear: parseInt(dayjs(state.diaryDate).format("YYYY")),
        loggedBefore: state.loggedBefore,
        rating: state.rating,
      };
      if (typeof state.seenEpisodes !== "undefined") {
        Object.assign(editItem, { seenEpisodes: state.seenEpisodes });
      }
      return editItem;
    } else {
      return false;
    }
  }

  async function deleteData() {
    if (
      typeof edit !== "undefined" &&
      user !== null &&
      user &&
      user.email !== null
    ) {
      mdDispatch({ type: "saving" });
      await fuegoDelete(user.uid, edit.id, edit);
      mdDispatch({ type: "view", payload: "md" });
      mdDispatch({ type: "saved" });
    } else {
      console.error("[EDIT]: Missing delete params");
    }
  }
}

export default ContentEdit;
