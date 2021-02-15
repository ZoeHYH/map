import { fade, styled } from "@material-ui/core/styles";
import { InputBase } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const StyledSearch = styled("div")`
  position: relative;
  border-radius: ${(theme) => theme.shape.borderRadius};
  background: ${(theme) => fade(theme.palette.common.white, 0.15)};
  &:hover {
    background: ${(theme) => fade(theme.palette.common.white, 0.25)};
  }
  margin-left: 0;
  width: 100%;
  ${(theme) => theme.breakpoints.up("sm")} {
    margin-left: ${(theme) => theme.spacing(1)};
    width: auto;
  }
`;
const StyledIcon = styled("div")`
  padding: ${(theme) => theme.spacing(0, 2)};
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledInput = styled(InputBase)`
  ${(theme) => `
  background: rgba(255, 255, 255, 0.87);
  & .MuiInputBase-input {
    background: black;
    padding: ${theme.spacing(1, 1, 1, 0)};
    padding-left: calc(1em + ${theme.spacing(4)}px);
    padding-left: 2rem;
    transition: theme.transitions.create("width");
    width: 100%;
    ${theme.breakpoints.up("sm")} {
      width: "12ch";
      &:focus {
        width: 20ch;
      }
    }
  }
  `}
`;

export const SearchInput = ({}) => {
  return (
    <StyledSearch>
      <StyledIcon>
        <SearchIcon />
      </StyledIcon>
      <StyledInput placeholder="搜尋" inputProps={{ "aria-label": "search" }} />
    </StyledSearch>
  );
};
