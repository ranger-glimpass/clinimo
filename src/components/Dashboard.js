import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

function Dashboard() {
    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>

                {/* Call Volume Analytics */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Total Active Assistants</Typography>
                            <Typography variant="body2">5 Assistants</Typography>
                            <Typography variant="h6" gutterBottom>Calls Made Today</Typography>
                            <Typography variant="body2">200 Calls</Typography>
                            <Typography variant="h6" gutterBottom>Calls per Assistant</Typography>
                            <Typography variant="body2">40 Calls on average</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Cost Analysis */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Total Cost</Typography>
                            <Typography variant="body2">$500 Today</Typography>
                            <Typography variant="h6" gutterBottom>Cost per Call</Typography>
                            <Typography variant="body2">$2.50 per Call</Typography>
                            <Typography variant="h6" gutterBottom>Cost per Assistant</Typography>
                            <Typography variant="body2">$100 per Assistant</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Performance Metrics */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Success Rate</Typography>
                            <Typography variant="body2">85% Goal Achievement</Typography>
                            <Typography variant="h6" gutterBottom>Call Duration</Typography>
                            <Typography variant="body2">Average 5 min per Call</Typography>
                            <Typography variant="h6" gutterBottom>Longest and Shortest Calls</Typography>
                            <Typography variant="body2">Max: 10 min, Min: 2 min</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Usage Trends */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Usage Trends</Typography>
                            <Typography variant="body2">Trend graph will be here</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Customer Interaction Insights */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Customer Interaction Insights</Typography>
                            <Typography variant="body2">Average satisfaction score: 4.5/5</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Resource Allocation */}
                <Grid item xs={12} md={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Resource Allocation</Typography>
                            <Typography variant="body2">Details on assistant utilization</Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Box>
    );
}

export default Dashboard;
