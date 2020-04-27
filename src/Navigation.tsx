import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import * as React from "react";
import IconLogo from "./icons/IconLogo";
import IconMenu from "./icons/IconMenu";
import IconSettings from "./icons/IconSettings";
import { MediaActionType } from "./Media";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  toolbarPad: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  divider: {
    color: theme.palette.grey["300"],
    marginRight: theme.spacing(1),
  },
  linkColor: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
  year: {
    color: theme.palette.secondary.main,
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

function Navigation({
  dispatchMedia,
  openDrawer,
}: {
  dispatchMedia: React.Dispatch<MediaActionType>;
  openDrawer: boolean;
}) {
  const classes = useStyles();

  return (
    <Toolbar
      className={classes.toolbarPad}
      variant="dense"
      disableGutters={true}
    >
      <IconButton
        size="small"
        onClick={() =>
          dispatchMedia({ type: "toggleDrawer", payload: !openDrawer })
        }
      >
        <IconMenu />
      </IconButton>
      <Box className={classes.title}>
        <Box pl={2}>
          <IconLogo width={20} />
        </Box>
        <Box pl={1} color="#592ABC" fontSize="body1.fontSize" fontWeight="600">
          mediaDiary
        </Box>
      </Box>
      <IconButton size="small">
        <IconSettings />
      </IconButton>
    </Toolbar>
  );
}

export default Navigation;

// const year = useStoreState((state) =>
//   state.global.preferences.year !== null ? state.global.preferences.year : ""
// );
// const userLogout = useStoreActions((actions) => actions.global.userLogout);
// const user = useStoreState((state) => state.global.user);
// const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

// const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//   setAnchorEl(event.currentTarget);
// };

// const handleClose = () => {
//   setAnchorEl(null);
// };
// navColors: {
//   paddingLeft: theme.spacing(2),
//   paddingRight: theme.spacing(2),
//   // backgroundColor: theme.palette.background.default,
//   backgroundColor: "#F0F0F0",
// },

// root: {
//   flexGrow: 1,
//   position: "sticky",
//   top: 0,
//   backgroundColor: "white",
//   zIndex: 9,
// },
