import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField, Button, Card, TableContainer, Grid } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://cho-bingo-api.onrender.com/api';

export default function Commissions() {
  const [filter, setFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    fetchCommissions();
    // eslint-disable-next-line
  }, []);

  const fetchCommissions = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `${API_URL}/commissions`;
      const params = [];
      if (fromDate) params.push(`startDate=${fromDate}`);
      if (toDate) params.push(`endDate=${toDate}`);
      if (params.length) url += `?${params.join('&')}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommissions(res.data);
    } catch (err) {
      setCommissions([]);
    }
  };

  const filtered = commissions.filter(c => {
    const branchName = c.branch?.name || '';
    const branchMatch = branchName.toLowerCase().includes(filter.toLowerCase());
    const date = c.createdAt ? c.createdAt.slice(0, 10) : '';
    const fromMatch = !fromDate || date >= fromDate;
    const toMatch = !toDate || date <= toDate;
    return branchMatch && fromMatch && toMatch;
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }, mb: { xs: 2, sm: 3 } }}>
        Commissions
      </Typography>
      <Card sx={{ p: 2, boxShadow: 4, bgcolor: '#f9fafb', mb: 3 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField label="Filter by Branch" value={filter} onChange={e => setFilter(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="From Date"
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="To Date"
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button variant="outlined" startIcon={<DownloadIcon />} fullWidth>Export CSV</Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Branch</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Commission</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c, idx) => (
                <TableRow key={c._id || idx}>
                  <TableCell>{c.branch?.name || '-'}</TableCell>
                  <TableCell>{c.createdAt ? c.createdAt.slice(0, 10) : '-'}</TableCell>
                  <TableCell>{c.amount} Birr</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
} 
