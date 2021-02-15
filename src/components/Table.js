import styled from "styled-components";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableSortLabel,
  TableCell,
  Collapse,
  Typography,
  IconButton,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import PropTypes from "prop-types";
import { useState } from "react";

const tableHead = [
  {
    name: "name",
    label: "名稱",
  },
  {
    name: "distance",
    label: "距離 km",
  },
  {
    name: "rating",
    label: "評價",
  },
  {
    name: "price_level",
    label: "價格",
  },
];

const StyledCell = styled(TableCell)`
  padding: 0.5rem;
`;

const SortHead = ({ head, order, orderCell, handleSort }) => (
  <TableHead>
    <TableRow>
      <StyledCell />
      {head.map((cell) => (
        <StyledCell
          key={cell.name}
          sortDirection={orderCell === cell.name ? order : false}
        >
          <TableSortLabel
            active={orderCell === cell.name}
            direction={orderCell === cell.name ? order : "asc"}
            onClick={() => handleSort(cell.name)}
          >
            {cell.label}
          </TableSortLabel>
        </StyledCell>
      ))}
    </TableRow>
  </TableHead>
);

SortHead.propTypes = {
  head: PropTypes.array,
  order: PropTypes.string,
  orderCell: PropTypes.string,
  handleSort: PropTypes.func,
};

const StyledRow = styled(TableRow)`
  & > * {
    border: none;
  }
`;

const StyledCollapseCell = styled(StyledCell)`
  padding: 0 1rem;
`;

const Row = ({ row, openDetail, handleOpenDetail }) => (
  <>
    <StyledRow
      hover
      onClick={() => handleOpenDetail(row.place_id, openDetail === false)}
    >
      <StyledCell>
        <IconButton
          size="small"
          onClick={() => handleOpenDetail(row.place_id, openDetail === false)}
        >
          {openDetail ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </StyledCell>
      <StyledCell>{row.name}</StyledCell>
      <StyledCell>{row.distance}</StyledCell>
      <StyledCell>{row.rating}</StyledCell>
      <StyledCell>{"$".repeat(row.price_level)}</StyledCell>
    </StyledRow>
    <TableRow>
      <StyledCollapseCell colSpan={tableHead.length + 1}>
        <Collapse in={openDetail !== false} timeout="auto" unmountOnExit>
          <Typography variant="h6">{row.name}</Typography>
          {openDetail && (
            <>
              <Typography variant="subtitle1">
                {openDetail.formatted_address}
              </Typography>
              <Typography variant="subtitle1">
                {openDetail.formatted_phone_number}
              </Typography>
              <Typography variant="subtitle1">營業時間</Typography>
              <Typography variant="subtitle2">
                {openDetail.opening_hours.isOpen() ? "營業中" : "尚未開始營業"}
              </Typography>
              {openDetail.opening_hours.weekday_text.map((day) => (
                <Typography key={day.slice(2, 3)} variant="body2">
                  {day}
                </Typography>
              ))}
            </>
          )}
        </Collapse>
      </StyledCollapseCell>
    </TableRow>
  </>
);

Row.propTypes = {
  row: PropTypes.shape({
    place_id: PropTypes.string,
    name: PropTypes.string,
    distance: PropTypes.string,
    rating: PropTypes.number,
    price_level: PropTypes.number,
  }),
  openDetail: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  handleOpenDetail: PropTypes.func,
};

const sortCompare = (a, b, target) => {
  let x = a[target];
  let y = b[target];
  if (typeof x === "string" || typeof y === "string") {
    x = x.toUpperCase();
    y = y.toUpperCase();
  }
  if (!x || x < y) return -1;
  if (x > y) return 1;
  return 0;
};

const StyledTable = styled(TableContainer)`
  max-width: 500px;
  word-break: keep-all;
`;

export const DataTable = ({
  data,
  handleData,
  openDetail,
  handleOpenDetail,
}) => {
  const [order, setOrder] = useState(null);
  const [orderCell, setOrderCell] = useState(null);

  const handleSort = (target) => {
    if (target !== orderCell || !order || order === "asc") {
      setOrder("desc");
      const newData = data.sort((a, b) => sortCompare(a, b, target)).reverse();
      handleData(newData);
    }
    if (order === "desc") {
      setOrder("asc");
      const newData = data.sort((a, b) => sortCompare(a, b, target));
      handleData(newData);
    }
    setOrderCell(target);
  };
  return (
    <StyledTable>
      <Table stickyHeader size="small">
        <SortHead
          head={tableHead}
          order={order}
          orderCell={orderCell}
          handleSort={handleSort}
        />
        <TableBody>
          {data.map((row) => (
            <Row
              key={row.name}
              row={row}
              openDetail={openDetail[row.place_id]}
              handleOpenDetail={handleOpenDetail}
            />
          ))}
        </TableBody>
      </Table>
    </StyledTable>
  );
};

DataTable.propTypes = {
  data: PropTypes.array,
  handleData: PropTypes.func,
  openDetail: PropTypes.object,
  handleOpenDetail: PropTypes.func,
};
