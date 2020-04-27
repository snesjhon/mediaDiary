import * as React from "react";
import { useReducer } from "react";
import Navigation from "./Navigation";
import {
  Hidden,
  SwipeableDrawer,
  makeStyles,
  Box,
  AppBar,
  IconButton,
  Toolbar,
} from "@material-ui/core";
import Sidebar from "./Sidebar";
import Search from "./Search";
import MediaLog from "./MediaLog";
import { IconChevronLeft } from "./icons";

type StateType = {
  openDrawer: boolean;
  openSearch: boolean;
  openLog: boolean;
};

export type MediaActionType =
  | {
      type: "toggleDrawer";
      payload: boolean;
    }
  | {
      type: "toggleSearch";
      payload: boolean;
    }
  | {
      type: "toggleLog";
      payload: boolean;
    };

const MediaReducer = (state: StateType, action: MediaActionType) => {
  switch (action.type) {
    case "toggleDrawer":
      return {
        ...state,
        openDrawer: action.payload,
      };
    case "toggleSearch":
      return {
        ...state,
        openSearch: action.payload,
        openLog: false,
      };
    case "toggleLog":
      return {
        ...state,
        openLog: action.payload,
        openSearch: false,
      };
    default:
      return state;
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    zIndex: 9,
  },
  navColors: {
    backgroundColor: "#F0F0F0",
  },
  backDrop: {
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    display: "flex",
    zIndex: (props) => (props ? 2 : -1),
    position: "fixed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000080",
    opacity: (props) => (props ? 1 : 0),
    transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  toolbarPad: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

function Media() {
  const [{ openDrawer, openSearch, openLog }, dispatch] = useReducer(
    MediaReducer,
    {
      openDrawer: false,
      openSearch: false,
      openLog: false,
    }
  );
  const classes = useStyles(openSearch);
  return (
    <>
      <Box className={classes.root}>
        <AppBar
          className={classes.navColors}
          position="static"
          variant="outlined"
        >
          {!openSearch && !openLog && (
            <Navigation dispatchMedia={dispatch} openDrawer={openDrawer} />
          )}
          {openSearch && <Search dispatchMedia={dispatch} />}
          {openLog && (
            <Toolbar
              className={classes.toolbarPad}
              variant="dense"
              disableGutters={true}
            >
              <IconButton
                size="small"
                onClick={() =>
                  dispatch({ type: "toggleSearch", payload: true })
                }
              >
                <IconChevronLeft />
              </IconButton>
            </Toolbar>
          )}
        </AppBar>
        <Hidden smUp>
          <SwipeableDrawer
            anchor="left"
            variant="temporary"
            open={openDrawer}
            onClose={() => dispatch({ type: "toggleDrawer", payload: false })}
            onOpen={() => dispatch({ type: "toggleDrawer", payload: true })}
            disableDiscovery={true}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <Sidebar />
          </SwipeableDrawer>
        </Hidden>
      </Box>
      <Box
        className={classes.backDrop}
        onClick={() => dispatch({ type: "toggleSearch", payload: false })}
      />
      {openLog && <MediaLog />}
      <button
        onClick={() => dispatch({ type: "toggleSearch", payload: !openSearch })}
      >
        asd
      </button>
    </>
  );
}
export default Media;

// import MediaSearch from "./MediaSearch";

// export interface MediaListView {
//   open: boolean;
//   type: viewType;
//   mediaID?: string;
//   showOverview?: boolean;
//   showEdit?: boolean;
// }

{
  /* {listView.open && listView.type === "search" && (
        <MediaSearch setViewType={() => {}} dialogClose={dialogClose} />
      )} */
}
