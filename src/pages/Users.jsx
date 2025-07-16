import { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton, Alert, Card, TableContainer, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'branch', branch: '' });
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [branches, setBranches] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchBranches();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    }
  };

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/branches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranches(res.data);
    } catch (err) {
      setBranches([]);
    }
  };

  const handleOpen = (idx = null) => {
    setEditIdx(idx);
    setUserForm(idx !== null ? {
      username: users[idx].username,
      password: '',
      role: users[idx].role,
      branch: users[idx].branch?._id || '',
    } : { username: '', password: '', role: 'branch', branch: '' });
    setOpen(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    // If branch is 'admin' or empty string, set branch to null before sending
    let formToSend = { ...userForm };
    if (userForm.branch === 'admin' || userForm.branch === '') {
      formToSend = { ...userForm, branch: null };
    }
    if (editIdx !== null) {
      // Edit user
      try {
        const userId = users[editIdx]._id;
        await axios.put(`${API_URL}/admin/users/${userId}`, formToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlert({ show: true, message: 'User updated!', severity: 'success' });
        fetchUsers();
      } catch (err) {
        setAlert({ show: true, message: 'Failed to update user', severity: 'error' });
      }
    } else {
      // Add user
      try {
        await axios.post(`${API_URL}/admin/users`, formToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlert({ show: true, message: 'User added!', severity: 'success' });
        fetchUsers();
      } catch (err) {
        setAlert({ show: true, message: 'Failed to add user', severity: 'error' });
      }
    }
    setOpen(false);
    setUserForm({ username: '', password: '', role: 'branch', branch: '' });
    setEditIdx(null);
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 2000);
  };

  const handleDelete = idx => {
    setDeleteIdx(idx);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteIdx === null) return;
    const token = localStorage.getItem('token');
    try {
      const userId = users[deleteIdx]._id;
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({ show: true, message: 'User deleted!', severity: 'info' });
      fetchUsers();
    } catch (err) {
      setAlert({ show: true, message: 'Failed to delete user', severity: 'error' });
    }
    setDeleteDialogOpen(false);
    setDeleteIdx(null);
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 2000);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }, mb: { xs: 2, sm: 3 } }}>
        Users Management
      </Typography>
      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>{alert.message}</Alert>
      )}
      <Card sx={{ p: 2, boxShadow: 4, bgcolor: '#f9fafb' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
          <Typography variant="h6">Users</Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ minWidth: 140 }}>Add User</Button>
        </Box>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, idx) => (
                <TableRow key={user._id || idx}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.branch ? user.branch.name : '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(idx)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(idx)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editIdx !== null ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField label="Username" fullWidth margin="normal" value={userForm.username} onChange={e => setUserForm({ ...userForm, username: e.target.value })} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} />
          <TextField
            label="Role"
            select
            fullWidth
            margin="normal"
            value={userForm.role}
            onChange={e => {
              const newRole = e.target.value;
              setUserForm({
                ...userForm,
                role: newRole,
                branch: newRole === 'admin' ? '' : userForm.branch
              });
            }}
          >
            <option value="admin">Admin</option>
            <option value="branch">Branch</option>
          </TextField>
          {userForm.role === 'admin' ? (
            <TextField
              label="Branch"
              select
              fullWidth
              margin="normal"
              value={userForm.branch}
              onChange={e => setUserForm({ ...userForm, branch: e.target.value })}
            >
              <option value="admin">Admin</option>
            </TextField>
          ) : (
            <TextField
              label="Branch"
              select
              fullWidth
              margin="normal"
              value={userForm.branch}
              onChange={e => setUserForm({ ...userForm, branch: e.target.value })}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select Branch</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              {branches.map(branch => (
                <MenuItem key={branch._id} value={branch._id}>{branch.name}</MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">{editIdx !== null ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 