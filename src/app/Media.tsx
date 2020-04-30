/**
 * MEDIA
 * ---
 * This control all the display of the functions for our list view and search
 * Using the search, fab icon, or click on item of list we then switch "views"
 * to show the `Diary` component which allows us to viewm edit, add, delete media
 */

import { AppBar, Box, makeStyles } from "@material-ui/core";
import * as React from "react";
import Navigation from "./Navigation";
import List from "./List";
import Search from "./Search";
import { useState } from "react";
// import { MediaDiaryActions } from "./MediaDiary";

export type MediaTypes = "film" | "tv" | "album" | "";

const useStyles = makeStyles((theme) => ({
  nav: {
    flexGrow: 1,
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    zIndex: 9,
  },
  appbar: {
    backgroundColor: "#F0F0F0",
  },
  toolbarPad: {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  backDrop: {
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    display: "flex",
    // zIndex: (props) => (props ? 2 : -1),
    zIndex: 2,
    position: "fixed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000080",
    opacity: 1,
    // opacity: (props) => (props ? 1 : 0),
    transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
}));

function Media() {
  const classes = useStyles();
  const [showSearch, setShowSearch] = useState(false);
  return (
    <>
      {showSearch ? <Search setShowSearch={setShowSearch} /> : <Navigation />}
      <List setShowSearch={setShowSearch} />
    </>
  );
}

export default Media;
