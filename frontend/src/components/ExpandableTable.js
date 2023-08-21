import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const tableCellStyle = {
  width: '40%', // Adjust the width as needed
  height: '50px', // Adjust the height as needed
};

function Row(props) {
  const { row, position } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row" style={tableCellStyle}>
          {position}
        </TableCell>
        <TableCell style={{ ...tableCellStyle, width: '20%' }}>{row?.teamDetail?.teamName}</TableCell>
        <TableCell component="th" scope="row" style={tableCellStyle}>
          {row.totalMarks}
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ ...tableCellStyle, paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Individual Performance
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={tableCellStyle}>Position</TableCell>
                    <TableCell style={{ ...tableCellStyle, width: '40%' }}>
                      User Name
                    </TableCell>
                    <TableCell style={{ ...tableCellStyle, width: '20%' }}>
                      Marks
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.users.map((userRow, index) => (
                    <TableRow key={index}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={tableCellStyle}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell style={{ ...tableCellStyle, width: '40%' }}>
                        {userRow?.userDetail?.userName}
                      </TableCell>
                      <TableCell style={{ ...tableCellStyle, width: '20%' }}>
                        {userRow.marks}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function CollapsibleTable({ rows }) {
  return (
    <TableContainer component={Paper}>
    <h1>Game Leaderboard</h1>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell style={tableCellStyle}>Position</TableCell>
            <TableCell style={{ ...tableCellStyle, width: '40%' }}>
              Team Name
            </TableCell>
            <TableCell style={{ ...tableCellStyle, width: '20%' }}>Score</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <Row key={index} row={row} position={index + 1} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CollapsibleTable;
