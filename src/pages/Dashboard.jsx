import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, TextField, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [stats, setStats] = useState({ branches: 0, games: 0, commissions: 0 });

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [branchesRes, gamesRes, commissionsRes] = await Promise.all([
        axios.get(`${API_URL}/branches`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/games`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/commissions`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats({
        branches: branchesRes.data.length,
        games: gamesRes.data.length,
        commissions: commissionsRes.data.reduce((sum, c) => sum + (c.amount || 0), 0),
      });
    } catch (err) {
      setStats({ branches: 0, games: 0, commissions: 0 });
    }
  };

  const handleFilter = () => {};
  const handleClear = () => { setFromDate(''); setToDate(''); };

  const statCards = [
    { label: 'Total Branches', value: stats.branches },
    { label: 'Total Commissions', value: `${stats.commissions} Birr` },
    { label: 'Total Games', value: stats.games },
    { label: 'Total Payouts', value: '-' }, // Placeholder for payouts
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }, mb: { xs: 2, sm: 3 } }}>
        Dashboard Overview
      </Typography>
      {/* Filter Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon sx={{ mr: 1 }} />
            Filter Dashboard
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: toDate || undefined }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: fromDate || undefined }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleFilter}>
                  Apply Filter
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClear} startIcon={<ClearIcon />}>
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {statCards.map(stat => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card sx={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 4, bgcolor: '#f9fafb' }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h4" color="primary" fontWeight={700}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: { xs: 2, sm: 3 } }}>
        {/* Placeholder for chart */}
        <Card sx={{ p: 3, minHeight: 200, bgcolor: '#fff' }}>
          <Typography variant="subtitle1" color="text.secondary">[Chart Placeholder]</Typography>
        </Card>
      </Box>
    </Box>
  );
} 