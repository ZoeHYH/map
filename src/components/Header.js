import { Toolbar, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledToolbar = styled(Toolbar)`
  z-index: 3000;
  position: fixed;
`;

export const Header = ({ drawer, toggleDrawer }) => {
  return (
    <StyledToolbar>
      <IconButton
        edge="start"
        color="inherit"
        onClick={toggleDrawer(!drawer)}
        aria-label="open drawer"
      >
        <MenuIcon />
      </IconButton>
    </StyledToolbar>
  );
};

Header.propTypes = {
  drawer: PropTypes.bool,
  toggleDrawer: PropTypes.func,
};
