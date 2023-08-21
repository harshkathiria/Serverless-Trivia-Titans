import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import axios from 'axios';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const TeamManagementForm = () => {
  const [teams, setTeams] = useState([]);
  const [teamStatsDialogOpen, setTeamStatsDialogOpen] = useState(false);
  const [teamStats, setTeamStats] = useState([]);
  const [u_email, setEmail] = useState('1997ashutosh@gmail.com'); // Selected user email from dropdown

  useEffect(() => {
    fetchTeamDetails();
  }, [u_email]); // Fetch teams whenever u_email changes

  const isAdmin = (team) => {
    return team.admin === u_email;
  };

  // const fetchTeamDetails = async () => {
  //   try {
  //     const response = await axios.get(
  //       'https://k9e84ss46j.execute-api.us-east-1.amazonaws.com/dev/getteamdetails'
  //     );
  //     const { teams } = JSON.parse(response.data.body);
  //     const filteredTeams = teams.filter((team) =>
  //       team.members.includes(u_email)
  //     );
  //     setTeams(filteredTeams);
  //   } catch (error) {
  //     console.error('Error fetching team details:', error);
  //   }
  // };

  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(
        'https://k9e84ss46j.execute-api.us-east-1.amazonaws.com/dev/getteamdetails'
      );
      const { teams } = response.data.body;
      const filteredTeams = teams.filter((team) =>
        team.members.includes(u_email)
      );
      setTeams(filteredTeams);
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };


  const createTeam = async () => {
    try {
      const response = await axios.post(
        'https://2cv7r3iic2.execute-api.us-east-1.amazonaws.com/dev/teamnamegeneration',
        {
          u_email: u_email,
        }
      );
      const newTeam = {
        t_id: response.data.t_id,
        t_name: 'New Team', // You can customize the team name here
        members: [u_email], // The creator of the team will be the only member initially
      };
      setTeams((prevTeams) => [...prevTeams, newTeam]);
      fetchTeamDetails();
      // Refresh the page to fetch the latest team details
      window.location.reload();
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const [openTeamIds, setOpenTeamIds] = useState([]);
  const [emailInputs, setEmailInputs] = useState({});

  const handleToggleTeam = (teamId) => {
    setOpenTeamIds((prevOpenIds) =>
      prevOpenIds.includes(teamId)
        ? prevOpenIds.filter((id) => id !== teamId)
        : [...prevOpenIds, teamId]
    );

    if (teamId in emailInputs) {
      // Clear the email input for the team when the user toggles the team accordion
      setEmailInputs((prevInputs) => ({ ...prevInputs, [teamId]: '' }));
    }
  };

  const handleEmailInputChange = (event, teamId) => {
    setEmailInputs((prevInputs) => ({ ...prevInputs, [teamId]: event.target.value }));
  };

  const handleInvite = async (teamId) => {
    const emails = emailInputs[teamId]
      ? emailInputs[teamId].split(',').map((email) => email.trim())
      : [];

    if (!emails || emails.length === 0) {
      alert('Please enter valid emails.');
      return;
    }

    const requestBody = {
      t_id: teamId,
      emails: emails,
    };

    try {
      const response = await axios.post(
        'https://k9e84ss46j.execute-api.us-east-1.amazonaws.com/dev/invitemembers',
        requestBody
      );
      console.log('Invitation sent:', response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  // const handleTeamStats = async (teamId) => {
  //   const requestBody = {
  //     u_email: u_email,
  //   };
  
  //   try {
  //     const response = await axios.post(
  //       'https://k9e84ss46j.execute-api.us-east-1.amazonaws.com/dev/getteamstats',
  //       requestBody
  //     );
  //     const { teams_stats } = JSON.parse(response.data.body);
  //     const teamStat = teams_stats.find((stat) => stat.t_id === teamId);
  //     if (teamStat) {
  //       setTeamStats([teamStat]);
  //       setTeamStatsDialogOpen(true);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching team stats:', error);
  //   }
  // };

  const handleTeamStats = async (teamId) => {
    const requestBody = {
      u_email: u_email,
    };
  
    try {
      const response = await axios.post(
        'https://k9e84ss46j.execute-api.us-east-1.amazonaws.com/dev/getteamstats',
        requestBody
      );
      const { teams_stats } = response.data.body;
      const teamStat = teams_stats.find((stat) => stat.t_id === teamId);
      if (teamStat) {
        setTeamStats([teamStat]);
        setTeamStatsDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching team stats:', error);
    }
  };

  const handleLeave = async (teamId) => {
    const requestBody = {
      u_email: u_email,
      t_id: teamId,
    };

    try {
      const response = await axios.post(
        'https://k9e84ss46j.execute-api.us-east-1.amazonaws.com/dev/leaveteam',
        requestBody
      );
      console.log('Successfully left the team:', response.data);
        
      // After successful leave, we should refresh the team details
      fetchTeamDetails();
    } catch (error) {
      console.error('Error leaving the team:', error);
    }
  };

  const handleRemoveMember = async (teamId, memberEmail) => {
    const requestBody = {
      u_email: memberEmail,
      t_id: teamId,
    };

    try {
      const response = await axios.post(
        'https://k9e84ss46j.execute-api.us-east-1.amazonaws.com/dev/removemember',
        requestBody
      );
      console.log('Successfully removed member from the team:', response.data);
      // After successful removal, we should refresh the team details
      fetchTeamDetails();
      window.location.reload();
    } catch (error) {
      console.error('Error removing member from the team:', error);
    }
  };

  const handleCloseTeamStatsDialog = () => {
    setTeamStatsDialogOpen(false);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '90%', // Set the width of the main container to 90% of the viewport width
        margin: '0 auto', // Centers the container horizontally
        backgroundColor: '#f0f0f0', // Change to your desired background color for the unused space
        padding: '24px',
        borderRadius: '8px',
      }}
    >
      <Box mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h2>Welcome!</h2>
          {/* <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>User Email</InputLabel>
            <Select
              value={u_email}
              onChange={(e) => setEmail(e.target.value)}
              label="User Email"
            >
              <MenuItem value="1997ashutosh@gmail.com">1997ashutosh@gmail.com</MenuItem>
              <MenuItem value="ashutoshsagar0710@gmail.com">ashutoshsagar0710@gmail.com</MenuItem>
              <MenuItem value="as890306@dal.ca">as890306@dal.ca</MenuItem>
            </Select>
          </FormControl> */}
          {isAdmin && ( // Show "Create Team" button only for admins
            <Button variant="contained" color="primary" onClick={createTeam}>
              Create Team
            </Button>
          )}
        </Box>
        <Box mt={2}>
          <Grid container spacing={2}>
            {teams.map((team) => (
              <Grid item xs={12} key={team.t_id}>
                <Paper elevation={3}>
                  <Box p={2}>
                    <Button
                      variant="text"
                      onClick={() => handleToggleTeam(team.t_id)}
                    >
                      {team.t_name}
                    </Button>
                    {openTeamIds.includes(team.t_id) && (
                      <Box mt={2}>
                        {isAdmin(team) && ( // Show email input and invite button only for the team admin
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                label="Invite Members (comma-separated emails)"
                                value={emailInputs[team.t_id] || ''}
                                onChange={(e) => handleEmailInputChange(e, team.t_id)}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleInvite(team.t_id)}
                                fullWidth
                              >
                                Invite
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                        {team.members.length > 0 && (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell align="right">Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {team.members.map((member) => (
                                <TableRow key={member}>
                                  <TableCell>{member}</TableCell>
                                  <TableCell align="right">
                                    {isAdmin(team) && ( // Show "Remove Member" button only for the team admin
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        size="small"
                                        onClick={() => handleRemoveMember(team.t_id, member)}
                                      >
                                        Remove Member
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </Box>
                    )}
                    <Box mt={2}>
                      <Grid container spacing={1}>
                        <Grid item>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<SportsEsportsIcon />}
                            onClick={() => handleTeamStats(team.t_id)} // Pass the team.t_id to the function
                          >
                            Team Stats
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<CloseIcon />}
                            onClick={() => handleLeave(team.t_id)}
                          >
                            Leave
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Dialog
        open={teamStatsDialogOpen}
        onClose={handleCloseTeamStatsDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Team Statistics</DialogTitle>
        <DialogContent>
          {teamStats.map((teamStat) => (
            <DialogContentText key={teamStat.t_id}>
              <strong>{teamStat.t_name}</strong>
              <br />
              Total Games: {teamStat.total_games}
              <br />
              Total Points: {teamStat.total_points}
              <br />
              Wins: {teamStat.wins}
              <br />
              Lost: {teamStat.lost}
            </DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTeamStatsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeamManagementForm;
