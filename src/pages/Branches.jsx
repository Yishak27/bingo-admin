import { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton, Alert, Card, TableContainer } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://cho-bingo-api.onrender.com/api';

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [branchForm, setBranchForm] = useState({ name: '', location: '' });
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchBranches();
    // eslint-disable-next-line
  }, []);

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
    setBranchForm(idx !== null ? branches[idx] : { name: '', location: '' });
    setOpen(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (editIdx !== null) {
      // Edit branch
      try {
        const branchId = branches[editIdx]._id;
        await axios.put(`${API_URL}/branches/${branchId}`, branchForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlert({ show: true, message: 'Branch updated!', severity: 'success' });
        fetchBranches();
      } catch (err) {
        setAlert({ show: true, message: 'Failed to update branch', severity: 'error' });
      }
    } else {
      // Add branch
      try {
        await axios.post(`${API_URL}/branches`, branchForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlert({ show: true, message: 'Branch added!', severity: 'success' });
        fetchBranches();
      } catch (err) {
        setAlert({ show: true, message: 'Failed to add branch', severity: 'error' });
      }
    }
    setOpen(false);
    setBranchForm({ name: '', location: '' });
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
      const branchId = branches[deleteIdx]._id;
      await axios.delete(`${API_URL}/branches/${branchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({ show: true, message: 'Branch deleted!', severity: 'info' });
      fetchBranches();
    } catch (err) {
      setAlert({ show: true, message: 'Failed to delete branch', severity: 'error' });
    }
    setDeleteDialogOpen(false);
    setDeleteIdx(null);
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 2000);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }, mb: { xs: 2, sm: 3 } }}>
        Branches Management
      </Typography>
      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>{alert.message}</Alert>
      )}
      <Card sx={{ p: 2, boxShadow: 4, bgcolor: '#f9fafb' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
          <Typography variant="h6">Branches</Typography>
          <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ minWidth: 140 }}>Add Branch</Button>
        </Box>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Branch Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches.map((branch, idx) => (
                <TableRow key={branch._id || idx}>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.location || '-'}</TableCell>
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
        <DialogTitle>{editIdx !== null ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
        <DialogContent>
          <TextField label="Branch Name" fullWidth margin="normal" value={branchForm.name} onChange={e => setBranchForm({ ...branchForm, name: e.target.value })} />
          <TextField label="Location" fullWidth margin="normal" value={branchForm.location} onChange={e => setBranchForm({ ...branchForm, location: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">{editIdx !== null ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this branch?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
